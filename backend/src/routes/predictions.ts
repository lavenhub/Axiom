import express from "express";
import { PredictionService } from "../services/prediction.service.js";
import { authenticateToken, AuthRequest } from "../middlewares/auth.js";
import { logger } from "../config/logger.js";

const router = express.Router();

// ─── GET /api/predictions ─────────────────────────────────────────────────────
router.get("/", authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    const { wardId } = req.query;
    const result = await PredictionService.getPredictions(wardId as string | undefined);
    res.json(result);
  } catch (error: any) {
    logger.error("Failed to get predictions:", error);
    res.status(500).json({ error: "Failed to get predictions" });
  }
});

// ─── POST /api/predictions/recalculate ───────────────────────────────────────
router.post("/recalculate", authenticateToken, async (_req, res) => {
  try {
    const predictions = await PredictionService.recalculatePredictions();
    res.json({ predictions, count: predictions.length, message: `Generated ${predictions.length} predictions.` });
  } catch (error: any) {
    logger.error("Failed to recalculate predictions:", error);
    res.status(500).json({ error: "Failed to recalculate predictions" });
  }
});

export { router as predictionRoutes };
