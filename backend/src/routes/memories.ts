import express from "express";
import { prisma } from "../config/prisma.js";
import { MemoryService } from "../services/memory.service.js";
import { AIService } from "../services/ai.service.js";
import { authenticateToken, AuthRequest } from "../middlewares/auth.js";
import { logger } from "../config/logger.js";

const router = express.Router();

// ─── GET /api/memories ───────────────────────────────────────────────────────
router.get("/", authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    const { wardId, category, limit = "50" } = req.query;
    const where: any = { deletedAt: null };
    if (wardId) where.wardId = wardId;

    const memories = await prisma.memory.findMany({
      where,
      include: {
        issue: { select: { id: true, title: true, category: true, severity: true } },
        repair: { select: { id: true, outcome: true, cost: true }, include: { engineer: { select: { name: true } }, method: { select: { name: true } } } },
        ward: { select: { id: true, name: true, number: true } },
        tags: true,
        _count: { select: { connections: true, relatedMemories: true, lessons: true } },
      },
      orderBy: { createdAt: "desc" },
      take: parseInt(limit as string),
    });

    if (memories.length === 0) {
      return res.json({
        memories: [],
        count: 0,
        message: "No memories available yet. Memories are automatically created when repairs are completed.",
      });
    }

    res.json({ memories, count: memories.length });
  } catch (error: any) {
    logger.error("Failed to fetch memories:", error);
    res.status(500).json({ error: "Failed to fetch memories" });
  }
});

// ─── GET /api/memories/:id ───────────────────────────────────────────────────
router.get("/:id", authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    const memory = await MemoryService.getMemoryById(req.params.id);
    if (!memory) return res.status(404).json({ error: "Memory not found." });
    res.json(memory);
  } catch (error: any) {
    logger.error("Failed to fetch memory:", error);
    res.status(500).json({ error: "Failed to fetch memory" });
  }
});

// ─── GET /api/memories/search?q= ─────────────────────────────────────────────
router.get("/search", authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    const { q, limit = "10" } = req.query;
    if (!q || typeof q !== "string") return res.status(400).json({ error: "Query parameter 'q' is required." });

    const results = await AIService.searchSimilarMemories(q, parseInt(limit as string));

    if (results.length === 0) {
      return res.json({
        results: [],
        message: "No similar memories found. Try different search terms.",
        totalMemories: await prisma.memory.count({ where: { deletedAt: null } }),
      });
    }

    res.json({
      results: results.map((r) => ({
        id: r.memory.id,
        title: r.memory.title,
        summary: r.memory.summary,
        successScore: r.memory.successScore,
        similarity: Math.round(r.similarity * 100),
        ward: r.memory.ward?.name,
        category: r.memory.issue?.category,
        repairOutcome: r.memory.repair?.outcome,
      })),
      count: results.length,
    });
  } catch (error: any) {
    logger.error("Failed to search memories:", error);
    res.status(500).json({ error: "Failed to search memories" });
  }
});

// ─── GET /api/memories/graph ──────────────────────────────────────────────────
router.get("/graph", authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    const memories = await prisma.memory.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        title: true,
        successScore: true,
        wardId: true,
        ward: { select: { name: true } },
        issue: { select: { category: true, severity: true } },
        connections: {
          select: {
            id: true,
            type: true,
            weight: true,
            targetMemoryId: true,
            targetMemory: { select: { id: true, title: true } },
          },
          where: { deletedAt: null },
        },
      },
    });

    const connections = await prisma.knowledgeConnection.count({ where: { deletedAt: null } });

    if (memories.length === 0) {
      return res.json({
        nodes: [],
        edges: [],
        message: "Knowledge graph will be created after the first completed repair.",
        nodeCount: 0,
        edgeCount: 0,
      });
    }

    const nodes = memories.map((m) => ({
      id: m.id,
      label: m.title.length > 30 ? m.title.substring(0, 30) + "..." : m.title,
      title: m.title,
      category: m.issue?.category || "OTHER",
      severity: m.issue?.severity,
      successScore: m.successScore,
      ward: m.ward?.name,
    }));

    const edges = memories.flatMap((m) =>
      m.connections.map((c) => ({
        id: c.id,
        source: m.id,
        target: c.targetMemoryId,
        type: c.type,
        weight: c.weight,
        label: c.type.replace(/_/g, " "),
      }))
    );

    res.json({ nodes, edges, nodeCount: nodes.length, edgeCount: edges.length });
  } catch (error: any) {
    logger.error("Failed to fetch knowledge graph:", error);
    res.status(500).json({ error: "Failed to fetch knowledge graph" });
  }
});

export { router as memoryRoutes };
