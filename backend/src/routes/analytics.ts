import express from "express";
import { AnalyticsService } from "../services/analytics.service.js";
import { authenticateToken, AuthRequest } from "../middlewares/auth.js";
import { logger } from "../config/logger.js";

const router = express.Router();

// ─── GET /api/analytics/dashboard ───────────────────────────────────────────
router.get("/dashboard", authenticateToken, async (_req, res) => {
  try {
    const stats = await AnalyticsService.getDashboardStats();
    res.json(stats);
  } catch (error: any) {
    logger.error("Failed to get dashboard stats:", error);
    res.status(500).json({ error: "Failed to get dashboard stats" });
  }
});

// ─── POST /api/analytics/snapshot ────────────────────────────────────────────
router.post("/snapshot", authenticateToken, async (_req, res) => {
  try {
    const snapshot = await AnalyticsService.generateSnapshot();
    res.status(201).json(snapshot);
  } catch (error: any) {
    logger.error("Failed to generate snapshot:", error);
    res.status(500).json({ error: "Failed to generate snapshot" });
  }
});

export { router as analyticsRoutes };
