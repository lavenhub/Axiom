import { prisma } from "../config/prisma.js";
import { logger } from "../config/logger.js";
import { AIService } from "./ai.service.js";
import { AnalyticsService } from "./analytics.service.js";
import { PredictionService } from "./prediction.service.js";

export class MemoryService {
  // ─── Search similar memories using local cosine similarity ───────────────
  static async searchSimilarMemories(query: string, limit = 5) {
    return AIService.searchSimilarMemories(query, limit);
  }

  // ─── Core: create memory + connections after a repair is resolved ─────────
  static async createMemoryFromRepair(repairId: string): Promise<void> {
    const repair = await prisma.repair.findUnique({
      where: { id: repairId },
      include: {
        issue: {
          include: {
            ward: true,
            location: true,
            asset: true,
            tags: true,
            media: true,
          },
        },
        method: true,
        rootCause: true,
      },
    });

    if (!repair) throw new Error("Repair not found");
    if (!repair.issue) throw new Error("Repair has no associated issue");

    // Don't double-create
    const existingMemory = await prisma.memory.findUnique({
      where: { issueId: repair.issueId },
    });
    if (existingMemory) {
      logger.info(`Memory already exists for issue ${repair.issueId}`);
      return;
    }

    const issue = repair.issue;

    // Build a rich text summary for embedding
    const memoryText = [
      `Issue: ${issue.title}`,
      `Description: ${issue.description}`,
      `Category: ${issue.category}`,
      `Severity: ${issue.severity}`,
      `Ward: ${issue.ward?.name || "Unknown"}`,
      `Repair Method: ${repair.method?.name || repair.description}`,
      `Root Cause: ${repair.rootCause?.name || "Not specified"}`,
      `Outcome: ${repair.outcome}`,
      repair.engineerNotes ? `Engineer Notes: ${repair.engineerNotes}` : "",
    ]
      .filter(Boolean)
      .join(". ");

    // Generate embedding
    const embedding = AIService.generateEmbedding(memoryText);
    const embeddingJson = JSON.stringify(embedding);

    // Build AI summary
    const successLabel =
      repair.outcome === "SUCCESS"
        ? "successfully resolved"
        : repair.outcome === "PARTIAL"
        ? "partially resolved"
        : "repair attempted but failed";

    const aiSummary =
      `A ${issue.severity.toLowerCase()} priority ${issue.category.toLowerCase()} issue was ${successLabel}. ` +
      `Root cause: ${repair.rootCause?.name || "not categorized"}. ` +
      `Repair method: ${repair.method?.name || repair.description}. ` +
      (repair.engineerNotes ? `Engineer notes: ${repair.engineerNotes}` : "");

    // Create memory inside a transaction
    const memory = await prisma.$transaction(async (tx) => {
      const mem = await tx.memory.create({
        data: {
          title: issue.title,
          summary: memoryText.substring(0, 500),
          aiSummary,
          issueId: issue.id,
          repairId: repair.id,
          wardId: issue.wardId,
          locationId: issue.locationId,
          assetId: issue.assetId,
          successScore: repair.successScore ?? (repair.outcome === "SUCCESS" ? 85 : repair.outcome === "PARTIAL" ? 60 : 30),
          embedding: embeddingJson,
          tags: {
            connectOrCreate: issue.tags.map((t) => ({
              where: { name: t.name },
              create: { name: t.name, color: t.color },
            })),
          },
        },
      });

      // Create lesson learned
      if (repair.engineerNotes) {
        await tx.lessonsLearned.create({
          data: {
            memoryId: mem.id,
            lesson: repair.engineerNotes,
            impact: `Outcome: ${repair.outcome}. Success score: ${mem.successScore}/100`,
          },
        });
      }

      return mem;
    });

    logger.info(`Memory created: ${memory.id} for issue "${issue.title}"`);

    // Find similar memories and create knowledge graph connections
    await MemoryService.createKnowledgeConnections(memory.id, repair.issueId);

    // Trigger analytics and predictions
    try {
      await AnalyticsService.generateSnapshot();
      await PredictionService.recalculatePredictions();
    } catch (err) {
      logger.warn("Analytics/prediction update failed after memory creation:", err);
    }
  }

  // ─── Create Knowledge Graph connections ──────────────────────────────────
  static async createKnowledgeConnections(newMemoryId: string, issueId: string): Promise<void> {
    const newMemory = await prisma.memory.findUnique({
      where: { id: newMemoryId },
      include: { issue: true },
    });

    if (!newMemory) return;

    const allOtherMemories = await prisma.memory.findMany({
      where: { id: { not: newMemoryId }, deletedAt: null },
      include: { issue: true },
    });

    if (allOtherMemories.length === 0) {
      logger.info(`First memory — no connections yet. Graph will grow after next repair.`);
      return;
    }

    const queryText = `${newMemory.title} ${newMemory.summary || ""}`;
    const queryEmbedding = AIService.generateEmbedding(queryText);

    const connections: Array<{
      targetId: string;
      type: string;
      weight: number;
    }> = [];

    for (const other of allOtherMemories) {
      let memEmbedding: number[];
      try {
        memEmbedding = other.embedding
          ? JSON.parse(other.embedding)
          : AIService.generateEmbedding(`${other.title} ${other.summary || ""}`);
      } catch {
        memEmbedding = AIService.generateEmbedding(`${other.title} ${other.summary || ""}`);
      }

      const sim = cosineSimilarity(queryEmbedding, memEmbedding);

      // Same category → SIMILAR_ISSUE
      if (other.issue?.category === newMemory.issue?.category && sim > 0.1) {
        connections.push({ targetId: other.id, type: "SIMILAR_ISSUE", weight: sim });
      }

      // Same ward → SAME_LOCATION
      if (other.wardId && other.wardId === newMemory.wardId) {
        connections.push({ targetId: other.id, type: "SAME_LOCATION", weight: 0.9 });
      }

      // Same asset → SAME_INFRASTRUCTURE
      if (other.assetId && other.assetId === newMemory.assetId) {
        connections.push({ targetId: other.id, type: "SAME_INFRASTRUCTURE", weight: 0.95 });
      }
    }

    // Deduplicate: keep highest weight per target
    const best = new Map<string, typeof connections[0]>();
    for (const c of connections) {
      const existing = best.get(c.targetId);
      if (!existing || c.weight > existing.weight) best.set(c.targetId, c);
    }

    for (const conn of best.values()) {
      await prisma.knowledgeConnection.create({
        data: {
          sourceMemoryId: newMemoryId,
          targetMemoryId: conn.targetId,
          type: conn.type as any,
          weight: conn.weight,
          metadata: { similarity: conn.weight },
        },
      });
    }

    logger.info(`Created ${best.size} knowledge graph connection(s) for memory ${newMemoryId}`);
  }

  // ─── Get memory detail ────────────────────────────────────────────────────
  static async getMemoryById(id: string) {
    return prisma.memory.findUnique({
      where: { id },
      include: {
        issue: { include: { media: true, citizen: { select: { id: true, name: true, email: true } } } },
        repair: { include: { engineer: { select: { id: true, name: true, email: true } }, method: true, rootCause: true } },
        ward: true,
        location: true,
        asset: { include: { type: true } },
        tags: true,
        lessons: true,
        connections: {
          include: { targetMemory: { select: { id: true, title: true, successScore: true } } },
        },
        relatedMemories: {
          include: { sourceMemory: { select: { id: true, title: true, successScore: true } } },
        },
      },
    });
  }
}

function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
  const magA = Math.sqrt(a.reduce((s, ai) => s + ai * ai, 0));
  const magB = Math.sqrt(b.reduce((s, bi) => s + bi * bi, 0));
  return magA && magB ? dot / (magA * magB) : 0;
}
