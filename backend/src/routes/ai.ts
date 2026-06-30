import express from "express";
import { body, validationResult } from "express-validator";
import { AIService } from "../services/ai.service.js";
import { authenticateToken, AuthRequest } from "../middlewares/auth.js";
import { prisma } from "../config/prisma.js";
import { logger } from "../config/logger.js";

const router = express.Router();

// ─── POST /api/ai/ask ─────────────────────────────────────────────────────────
router.post(
  "/ask",
  authenticateToken,
  [body("question").notEmpty().withMessage("Question is required")],
  async (req: AuthRequest, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const { question } = req.body;
      const userId = req.user!.id;

      const result = await AIService.askAxiom(question, userId);
      res.json(result);
    } catch (error: any) {
      logger.error("Axiom AI failed:", error);
      res.status(500).json({ error: "Axiom AI failed", details: error.message });
    }
  }
);

// ─── POST /api/ai/analyze ─────────────────────────────────────────────────────
router.post(
  "/analyze",
  authenticateToken,
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("description").notEmpty().withMessage("Description is required"),
  ],
  async (req: AuthRequest, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const { title, description } = req.body;
      const analysis = await AIService.analyzeIssue(title, description);
      const similar = await AIService.searchSimilarMemories(`${title} ${description}`, 5);

      res.json({
        analysis,
        similar: similar.map((s) => ({
          id: s.memory.id,
          title: s.memory.title,
          successScore: s.memory.successScore,
          similarity: Math.round(s.similarity * 100),
        })),
      });
    } catch (error: any) {
      logger.error("AI analysis failed:", error);
      res.status(500).json({ error: "AI analysis failed", details: error.message });
    }
  }
);

// ─── GET /api/ai/conversations ───────────────────────────────────────────────
router.get("/conversations", authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    const conversations = await prisma.aIConversation.findMany({
      where: { userId: req.user!.id, deletedAt: null },
      include: {
        messages: { orderBy: { createdAt: "asc" }, take: 2 },
        _count: { select: { messages: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
    res.json(conversations);
  } catch (error: any) {
    logger.error("Failed to fetch conversations:", error);
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
});

// ─── GET /api/ai/conversations/:id ───────────────────────────────────────────
router.get("/conversations/:id", authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    const convo = await prisma.aIConversation.findUnique({
      where: { id: req.params.id, deletedAt: null },
      include: { messages: { orderBy: { createdAt: "asc" } } },
    });
    if (!convo) return res.status(404).json({ error: "Conversation not found." });
    if (convo.userId !== req.user!.id) return res.status(403).json({ error: "Access denied." });
    res.json(convo);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch conversation" });
  }
});

export { router as aiRoutes };
