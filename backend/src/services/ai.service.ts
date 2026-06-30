import { prisma } from "../config/prisma.js";
import { logger } from "../config/logger.js";

// Cosine similarity computed locally in Node.js — no pgvector needed
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
  const magA = Math.sqrt(a.reduce((s, ai) => s + ai * ai, 0));
  const magB = Math.sqrt(b.reduce((s, bi) => s + bi * bi, 0));
  return magA && magB ? dot / (magA * magB) : 0;
}

// Simple keyword-based embedding (TF-like) for fallback when OpenAI key missing
function simpleTextEmbedding(text: string): number[] {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter(Boolean);

  const vocab = [
    "road", "pothole", "drain", "water", "pipe", "flood", "light", "streetlight",
    "garbage", "trash", "bridge", "crack", "damage", "broken", "repair", "fix",
    "leak", "sewage", "electricity", "power", "tree", "fall", "accident", "danger",
    "urgent", "critical", "high", "medium", "low", "severe", "minor", "infrastructure",
    "maintenance", "construction", "asphalt", "concrete", "wall", "pavement",
  ];

  return vocab.map((v) => words.filter((w) => w === v).length / (words.length || 1));
}

export interface AIIssueAnalysis {
  category: "ROAD" | "DRAINAGE" | "STREETLIGHT" | "GARBAGE" | "BRIDGE" | "PIPELINE" | "OTHER";
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  possibleCauses: string[];
  summary: string;
  recommendation: string;
}

// Category keyword maps
const CATEGORY_KEYWORDS: Record<AIIssueAnalysis["category"], string[]> = {
  ROAD: ["road", "pothole", "pavement", "asphalt", "highway", "street", "traffic", "crack"],
  DRAINAGE: ["drain", "drainage", "flood", "water", "sewage", "sewer", "waterlog"],
  STREETLIGHT: ["light", "streetlight", "lamp", "dark", "electricity", "power", "bulb"],
  GARBAGE: ["garbage", "trash", "waste", "litter", "rubbish", "dump", "overflow"],
  BRIDGE: ["bridge", "overpass", "flyover", "span"],
  PIPELINE: ["pipe", "pipeline", "leak", "water", "gas", "burst"],
  OTHER: [],
};

const SEVERITY_KEYWORDS: Record<AIIssueAnalysis["severity"], string[]> = {
  CRITICAL: ["critical", "emergency", "danger", "collapse", "accident", "flooding", "major"],
  HIGH: ["urgent", "high", "bad", "severe", "serious", "large"],
  MEDIUM: ["medium", "moderate", "regular"],
  LOW: ["minor", "small", "low", "slight"],
};

const CAUSE_MAP: Record<AIIssueAnalysis["category"], string[]> = {
  ROAD: ["Surface wear and tear", "Heavy vehicle traffic", "Monsoon waterlogging", "Poor initial construction quality"],
  DRAINAGE: ["Blocked drain channels", "Monsoon overflow", "Deteriorated drainage pipes", "Accumulated debris"],
  STREETLIGHT: ["Blown fuse or bulb", "Power supply failure", "Vandalism", "Aging electrical components"],
  GARBAGE: ["Irregular collection schedule", "Overflow from high-density area", "Malfunctioning collection vehicle"],
  BRIDGE: ["Structural fatigue", "Overloading", "Corrosion", "Natural calamity stress"],
  PIPELINE: ["Corrosion over time", "Ground movement", "High water pressure", "Freeze-thaw cycles"],
  OTHER: ["Unknown cause", "Requires site inspection"],
};

const RECOMMENDATION_MAP: Record<AIIssueAnalysis["category"], string> = {
  ROAD: "Schedule immediate pothole filling with hot-mix asphalt. Inspect surrounding 50m for additional damage.",
  DRAINAGE: "Clear blockage manually or using jetting equipment. Schedule preventive cleaning for adjacent drains.",
  STREETLIGHT: "Replace faulty component. Check surrounding circuit for cascading failures.",
  GARBAGE: "Deploy additional pickup vehicle. Review ward-level collection frequency.",
  BRIDGE: "Immediately restrict heavy vehicles. Schedule structural inspection within 48 hours.",
  PIPELINE: "Isolate the section and deploy emergency repair team. Notify affected residents.",
  OTHER: "Assign to relevant department for site inspection and categorization.",
};

export class AIService {
  static async analyzeIssue(
    title: string,
    description: string
  ): Promise<AIIssueAnalysis> {
    const text = `${title} ${description}`.toLowerCase();

    // Determine category
    let category: AIIssueAnalysis["category"] = "OTHER";
    let maxMatches = 0;
    for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
      const matches = keywords.filter((k) => text.includes(k)).length;
      if (matches > maxMatches) {
        maxMatches = matches;
        category = cat as AIIssueAnalysis["category"];
      }
    }

    // Determine severity
    let severity: AIIssueAnalysis["severity"] = "MEDIUM";
    for (const [sev, keywords] of Object.entries(SEVERITY_KEYWORDS)) {
      if (keywords.some((k) => text.includes(k))) {
        severity = sev as AIIssueAnalysis["severity"];
        break;
      }
    }

    const possibleCauses = CAUSE_MAP[category];
    const recommendation = RECOMMENDATION_MAP[category];
    const summary = description.length > 200 ? description.substring(0, 197) + "..." : description;

    logger.info(`AI analyzed issue: "${title}" → Category: ${category}, Severity: ${severity}`);

    return { category, severity, possibleCauses, summary, recommendation };
  }

  static generateEmbedding(text: string): number[] {
    return simpleTextEmbedding(text);
  }

  static async searchSimilarMemories(
    query: string,
    limit = 5
  ): Promise<{ memory: any; similarity: number }[]> {
    const allMemories = await prisma.memory.findMany({
      where: { deletedAt: null },
      include: {
        issue: { select: { title: true, description: true, category: true } },
        repair: { select: { outcome: true, description: true } },
        ward: { select: { name: true } },
      },
    });

    if (allMemories.length === 0) return [];

    const queryEmbedding = simpleTextEmbedding(query);

    const scored = allMemories
      .map((m) => {
        // Use stored embedding if available, else recompute
        let memEmbedding: number[];
        try {
          memEmbedding = m.embedding ? JSON.parse(m.embedding) : simpleTextEmbedding(`${m.title} ${m.summary || ""}`);
        } catch {
          memEmbedding = simpleTextEmbedding(`${m.title} ${m.summary || ""}`);
        }
        return { memory: m, similarity: cosineSimilarity(queryEmbedding, memEmbedding) };
      })
      .filter((x) => x.similarity > 0)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);

    return scored;
  }

  static async askAxiom(question: string, userId: string) {
    const totalMemories = await prisma.memory.count({ where: { deletedAt: null } });

    let answer: string;
    let confidence: number;
    let sources: string[] = [];
    let recommendations: string[] = [];

    if (totalMemories === 0) {
      answer =
        "No historical memories are available in the system yet. " +
        "Once engineers begin resolving civic issues, Axiom will build its memory and be able to answer questions like this with historical context.";
      confidence = 0;
      recommendations = [
        "Report your first civic issue to start building Axiom's memory",
        "Complete a repair to create the first knowledge entry",
      ];
    } else {
      const similar = await AIService.searchSimilarMemories(question, 5);

      if (similar.length === 0) {
        answer =
          `Axiom has ${totalMemories} memory record(s) but none closely match your question. ` +
          "Try rephrasing with specific terms like road, drainage, streetlight, or bridge.";
        confidence = 0.2;
        recommendations = ["Refine your query with infrastructure-specific terms"];
      } else {
        const topMatches = similar.slice(0, 3);
        const avgScore = topMatches.reduce((s, m) => s + m.memory.successScore, 0) / topMatches.length;
        const successCount = topMatches.filter((m) => m.memory.repair?.outcome === "SUCCESS").length;

        answer =
          `Found ${similar.length} related memory record(s) in Axiom's knowledge base. ` +
          `The top match is "${topMatches[0].memory.title}" with a success score of ${topMatches[0].memory.successScore}/100. ` +
          (successCount > 0
            ? `${successCount} of the top ${topMatches.length} similar issues were resolved successfully with an average success score of ${Math.round(avgScore)}/100.`
            : "None of the similar issues were marked as fully successful — consider a different approach.");

        confidence = Math.min(0.95, 0.4 + similar.length * 0.1);
        sources = topMatches.map((m) => m.memory.id);

        const category = topMatches[0].memory.issue?.category;
        if (category) {
          recommendations = [RECOMMENDATION_MAP[category as keyof typeof RECOMMENDATION_MAP] || "Review similar records for guidance"];
        }
        recommendations.push(`Review ${similar.length} similar memory record(s) in the Memory module`);
      }
    }

    // Persist conversation
    await prisma.aIConversation.create({
      data: {
        title: question.substring(0, 100),
        userId,
        messages: {
          create: [
            { role: "USER", content: question },
            {
              role: "ASSISTANT",
              content: answer,
              sources: sources,
            },
          ],
        },
      },
    });

    logger.info(`Axiom answered question for user ${userId}. Confidence: ${confidence}`);

    return { answer, confidence, sources, recommendations, totalMemoriesSearched: totalMemories };
  }
}
