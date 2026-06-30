import express from "express";
import { body, validationResult } from "express-validator";
import { prisma } from "../config/prisma.js";
import { MemoryService } from "../services/memory.service.js";
import { authenticateToken, AuthRequest } from "../middlewares/auth.js";
import { logger } from "../config/logger.js";

const router = express.Router();

// ─── POST /api/repairs ───────────────────────────────────────────────────────
// Assign a repair to an engineer
router.post(
  "/",
  authenticateToken,
  [
    body("issueId").notEmpty().withMessage("Issue ID is required"),
    body("engineerId").notEmpty().withMessage("Engineer ID is required"),
    body("description").notEmpty().withMessage("Description is required"),
  ],
  async (req: AuthRequest, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const { issueId, engineerId, description, methodId, rootCauseId, cost, startDate } = req.body;

      // Ensure issue exists and is not already assigned
      const issue = await prisma.issue.findUnique({ where: { id: issueId, deletedAt: null } });
      if (!issue) return res.status(404).json({ error: "Issue not found." });

      const existingRepair = await prisma.repair.findUnique({ where: { issueId } });
      if (existingRepair) return res.status(409).json({ error: "A repair already exists for this issue." });

      // Ensure engineer exists
      const engineer = await prisma.user.findUnique({ where: { id: engineerId, role: "ENGINEER", deletedAt: null } });
      if (!engineer) return res.status(404).json({ error: "Engineer not found." });

      const repair = await prisma.$transaction(async (tx) => {
        const r = await tx.repair.create({
          data: {
            issueId,
            engineerId,
            description,
            methodId: methodId || null,
            rootCauseId: rootCauseId || null,
            cost: cost ? parseFloat(cost) : null,
            startDate: startDate ? new Date(startDate) : new Date(),
          },
          include: {
            engineer: { select: { id: true, name: true, email: true } },
            issue: { select: { id: true, title: true } },
          },
        });

        await tx.issue.update({
          where: { id: issueId },
          data: { status: "ASSIGNED" },
        });

        return r;
      });

      logger.info(`Repair assigned to engineer ${engineer.name} for issue "${issue.title}"`);
      res.status(201).json(repair);
    } catch (error: any) {
      logger.error("Failed to create repair:", error);
      res.status(500).json({ error: "Failed to create repair", details: error.message });
    }
  }
);

// ─── GET /api/repairs ────────────────────────────────────────────────────────
router.get("/", authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    const { outcome, engineerId } = req.query;
    const where: any = { deletedAt: null };
    if (outcome) where.outcome = outcome;
    if (engineerId) where.engineerId = engineerId;

    const repairs = await prisma.repair.findMany({
      where,
      include: {
        issue: { include: { ward: { select: { name: true } }, media: { take: 1 } } },
        engineer: { select: { id: true, name: true } },
        method: true,
        rootCause: true,
        memory: { select: { id: true, successScore: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ repairs, count: repairs.length });
  } catch (error: any) {
    logger.error("Failed to fetch repairs:", error);
    res.status(500).json({ error: "Failed to fetch repairs" });
  }
});

// ─── GET /api/repairs/:id ────────────────────────────────────────────────────
router.get("/:id", authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    const repair = await prisma.repair.findUnique({
      where: { id: req.params.id, deletedAt: null },
      include: {
        issue: { include: { ward: true, media: true, asset: { include: { type: true } } } },
        engineer: { select: { id: true, name: true, email: true } },
        method: true,
        rootCause: true,
        memory: true,
      },
    });

    if (!repair) return res.status(404).json({ error: "Repair not found." });
    res.json(repair);
  } catch (error: any) {
    logger.error("Failed to fetch repair:", error);
    res.status(500).json({ error: "Failed to fetch repair" });
  }
});

// ─── PUT /api/repairs/:id ─────────────────────────────────────────────────────
// Update repair progress
router.put("/:id", authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    const { outcome, successScore, engineerNotes, cost, endDate, methodId, rootCauseId } = req.body;

    const repair = await prisma.repair.update({
      where: { id: req.params.id },
      data: {
        ...(outcome !== undefined && { outcome }),
        ...(successScore !== undefined && { successScore: parseInt(successScore) }),
        ...(engineerNotes !== undefined && { engineerNotes }),
        ...(cost !== undefined && { cost: parseFloat(cost) }),
        ...(endDate !== undefined && { endDate: new Date(endDate) }),
        ...(methodId !== undefined && { methodId }),
        ...(rootCauseId !== undefined && { rootCauseId }),
      },
    });

    logger.info(`Repair ${repair.id} updated — Outcome: ${repair.outcome}`);
    res.json(repair);
  } catch (error: any) {
    logger.error("Failed to update repair:", error);
    res.status(500).json({ error: "Failed to update repair", details: error.message });
  }
});

// ─── POST /api/repairs/:id/complete ──────────────────────────────────────────
// THE KEY ENDPOINT: complete a repair and trigger memory + graph + analytics
router.post("/:id/complete", authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    const { outcome, successScore, engineerNotes, cost, rootCauseId, methodId } = req.body;

    if (!outcome || !["SUCCESS", "PARTIAL", "FAILED"].includes(outcome)) {
      return res.status(400).json({ error: "Outcome must be SUCCESS, PARTIAL, or FAILED." });
    }

    const repair = await prisma.repair.update({
      where: { id: req.params.id },
      data: {
        outcome,
        successScore: successScore ? parseInt(successScore) : outcome === "SUCCESS" ? 85 : outcome === "PARTIAL" ? 60 : 30,
        engineerNotes,
        cost: cost ? parseFloat(cost) : null,
        endDate: new Date(),
        ...(rootCauseId && { rootCauseId }),
        ...(methodId && { methodId }),
      },
      include: { issue: true },
    });

    // Update issue status
    await prisma.issue.update({
      where: { id: repair.issueId },
      data: { status: "RESOLVED" },
    });

    // 🔑 Trigger the cascade: Memory → Knowledge Graph → Analytics → Predictions
    logger.info(`Repair ${repair.id} completed with outcome: ${outcome}. Triggering memory creation...`);
    await MemoryService.createMemoryFromRepair(repair.id);

    // Fetch the newly created memory to return it
    const memory = await prisma.memory.findUnique({
      where: { issueId: repair.issueId },
      include: {
        connections: { take: 5 },
        relatedMemories: { take: 5 },
        lessons: true,
      },
    });

    const graphConnections = await prisma.knowledgeConnection.count({ where: { deletedAt: null } });
    const totalMemories = await prisma.memory.count({ where: { deletedAt: null } });

    res.json({
      repair,
      memory,
      message: `Repair completed. Memory created. Knowledge graph now has ${graphConnections} connection(s). Total memories: ${totalMemories}.`,
      cascade: {
        memoryCreated: !!memory,
        graphConnections,
        totalMemories,
      },
    });
  } catch (error: any) {
    logger.error("Failed to complete repair:", error);
    res.status(500).json({ error: "Failed to complete repair", details: error.message });
  }
});

// ─── POST /api/repairs/methods ───────────────────────────────────────────────
router.post("/methods", authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    const { name, description, avgCost, avgDuration, successRate } = req.body;
    if (!name || !description) return res.status(400).json({ error: "Name and description required." });

    const method = await prisma.repairMethod.create({
      data: { name, description, avgCost: avgCost ? parseFloat(avgCost) : null, avgDuration, successRate: successRate ? parseFloat(successRate) : null },
    });
    res.status(201).json(method);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to create repair method", details: error.message });
  }
});

// ─── GET /api/repairs/methods ────────────────────────────────────────────────
router.get("/methods", authenticateToken, async (_req, res) => {
  const methods = await prisma.repairMethod.findMany({ where: { deletedAt: null }, orderBy: { name: "asc" } });
  res.json(methods);
});

// ─── POST /api/repairs/root-causes ──────────────────────────────────────────
router.post("/root-causes", authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    const { name, description, category } = req.body;
    if (!name || !description || !category) return res.status(400).json({ error: "Name, description, and category required." });

    const rc = await prisma.rootCause.create({ data: { name, description, category } });
    res.status(201).json(rc);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to create root cause", details: error.message });
  }
});

// ─── GET /api/repairs/root-causes ───────────────────────────────────────────
router.get("/root-causes", authenticateToken, async (_req, res) => {
  const rcs = await prisma.rootCause.findMany({ where: { deletedAt: null }, orderBy: { name: "asc" } });
  res.json(rcs);
});

export { router as repairRoutes };
