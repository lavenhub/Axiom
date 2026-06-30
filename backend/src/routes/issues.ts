import express from "express";
import { body, validationResult } from "express-validator";
import { prisma } from "../config/prisma.js";
import { AIService } from "../services/ai.service.js";
import { MemoryService } from "../services/memory.service.js";
import { authenticateToken, AuthRequest } from "../middlewares/auth.js";
import { logger } from "../config/logger.js";

const router = express.Router();

// ─── GET /api/issues ─────────────────────────────────────────────────────────
router.get("/", authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    const { status, category, wardId, limit = "50" } = req.query;
    const where: any = { deletedAt: null };
    if (status) where.status = status;
    if (category) where.category = category;
    if (wardId) where.wardId = wardId;

    const issues = await prisma.issue.findMany({
      where,
      include: {
        citizen: { select: { id: true, name: true, email: true } },
        ward: { select: { id: true, name: true, number: true } },
        location: true,
        asset: { include: { type: true } },
        media: true,
        repair: { include: { engineer: { select: { id: true, name: true } } } },
        _count: { select: { media: true } },
      },
      orderBy: { createdAt: "desc" },
      take: parseInt(limit as string),
    });

    res.json({ issues, count: issues.length });
  } catch (error: any) {
    logger.error("Failed to fetch issues:", error);
    res.status(500).json({ error: "Failed to fetch issues" });
  }
});

// ─── POST /api/issues ─────────────────────────────────────────────────────────
router.post(
  "/",
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
      const {
        title,
        description,
        wardId,
        assetId,
        locationId,
        gpsLatitude,
        gpsLongitude,
        severity,
        category,
        mediaUrls,
      } = req.body;

      const citizenId = req.user!.id;

      // Run AI analysis
      const aiAnalysis = await AIService.analyzeIssue(title, description);

      // Search for similar memories
      const similar = await AIService.searchSimilarMemories(`${title} ${description}`, 5);

      // Create issue with any media
      const issue = await prisma.issue.create({
        data: {
          title,
          description,
          category: category || aiAnalysis.category,
          severity: severity || aiAnalysis.severity,
          citizenId,
          wardId: wardId || null,
          assetId: assetId || null,
          locationId: locationId || null,
          gpsLatitude: gpsLatitude ? parseFloat(gpsLatitude) : null,
          gpsLongitude: gpsLongitude ? parseFloat(gpsLongitude) : null,
          status: "ANALYZED",
          ...(mediaUrls && mediaUrls.length > 0
            ? {
                media: {
                  create: mediaUrls.map((url: string) => ({
                    url,
                    type: "IMAGE",
                    mimeType: "image/jpeg",
                    size: 0,
                  })),
                },
              }
            : {}),
        },
        include: {
          citizen: { select: { id: true, name: true } },
          ward: { select: { id: true, name: true } },
          media: true,
        },
      });

      // Build similar memories context message
      let similarMemoriesMessage: string;
      if (similar.length === 0) {
        similarMemoriesMessage = "No similar historical memories found. This is a new type of issue for the system.";
      } else if (similar.length === 1) {
        similarMemoriesMessage = `1 related memory found: "${similar[0].memory.title}" (Success Score: ${similar[0].memory.successScore}/100).`;
      } else {
        const avgScore = similar.reduce((s, m) => s + m.memory.successScore, 0) / similar.length;
        similarMemoriesMessage = `Found ${similar.length} similar memories with an average success score of ${Math.round(avgScore)}/100.`;
      }

      logger.info(`Issue created: "${title}" — Category: ${aiAnalysis.category}, Severity: ${aiAnalysis.severity}`);

      res.status(201).json({
        issue,
        aiAnalysis,
        similarMemories: similar.map((s) => ({
          id: s.memory.id,
          title: s.memory.title,
          successScore: s.memory.successScore,
          similarity: Math.round(s.similarity * 100),
        })),
        similarMemoriesMessage,
      });
    } catch (error: any) {
      logger.error("Failed to create issue:", error);
      res.status(500).json({ error: "Failed to create issue", details: error.message });
    }
  }
);

// ─── GET /api/issues/:id ─────────────────────────────────────────────────────
router.get("/:id", authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    const issue = await prisma.issue.findUnique({
      where: { id: req.params.id, deletedAt: null },
      include: {
        citizen: { select: { id: true, name: true, email: true } },
        ward: { select: { id: true, name: true, number: true } },
        location: true,
        asset: { include: { type: true } },
        media: true,
        repair: {
          include: {
            engineer: { select: { id: true, name: true, email: true } },
            method: true,
            rootCause: true,
          },
        },
        memory: { select: { id: true, title: true, successScore: true } },
        tags: true,
      },
    });

    if (!issue) return res.status(404).json({ error: "Issue not found." });
    res.json(issue);
  } catch (error: any) {
    logger.error("Failed to fetch issue:", error);
    res.status(500).json({ error: "Failed to fetch issue" });
  }
});

// ─── PATCH /api/issues/:id/status ──────────────────────────────────────────
router.patch("/:id/status", authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: "Status is required." });

    const issue = await prisma.issue.update({
      where: { id: req.params.id },
      data: { status },
    });
    res.json(issue);
  } catch (error: any) {
    logger.error("Failed to update issue status:", error);
    res.status(500).json({ error: "Failed to update issue status" });
  }
});

export { router as issueRoutes };
