import { prisma } from "../config/prisma.js";
import { logger } from "../config/logger.js";

const PREDICTION_THRESHOLDS = {
  ROAD_FAILURE: 3,
  PIPELINE_BURST: 2,
  STREETLIGHT_OUTAGE: 2,
  GARBAGE_OVERFLOW: 1,
  BRIDGE_RISK: 1,
  INFRASTRUCTURE_MAINTENANCE: 5,
};

export class PredictionService {
  // ─── Recalculate all predictions from actual historical data ─────────────
  static async recalculatePredictions() {
    const [
      totalMemories,
      roadMemories,
      drainageMemories,
      lightMemories,
      garbageMemories,
      bridgeMemories,
      pipelineMemories,
      brokenAssets,
      oldAssets,
    ] = await Promise.all([
      prisma.memory.count({ where: { deletedAt: null } }),
      prisma.issue.count({ where: { category: "ROAD", status: "RESOLVED", deletedAt: null } }),
      prisma.issue.count({ where: { category: "DRAINAGE", status: "RESOLVED", deletedAt: null } }),
      prisma.issue.count({ where: { category: "STREETLIGHT", status: "RESOLVED", deletedAt: null } }),
      prisma.issue.count({ where: { category: "GARBAGE", status: "RESOLVED", deletedAt: null } }),
      prisma.issue.count({ where: { category: "BRIDGE", status: "RESOLVED", deletedAt: null } }),
      prisma.issue.count({ where: { category: "PIPELINE", status: "RESOLVED", deletedAt: null } }),
      prisma.infrastructureAsset.count({ where: { status: "BROKEN", deletedAt: null } }),
      prisma.infrastructureAsset.count({ where: { age: { gte: 20 }, deletedAt: null } }),
    ]);

    if (totalMemories < 1) {
      logger.info("Not enough historical data to generate predictions yet.");
      return [];
    }

    // Delete stale predictions
    await prisma.prediction.deleteMany({});

    const predictions: any[] = [];

    type PredType = "ROAD_FAILURE" | "PIPELINE_BURST" | "STREETLIGHT_OUTAGE" | "GARBAGE_OVERFLOW" | "BRIDGE_RISK" | "INFRASTRUCTURE_MAINTENANCE";

    const buildPrediction = (
      type: PredType,
      count: number,
      description: string,
      extra = 0
    ) => {
      if (count === 0) return null;
      // Confidence grows with data volume, capped at 90
      const confidence = Math.min(90, 20 + count * 12 + extra);
      return { type, confidence, description };
    };

    const candidates = [
      buildPrediction("ROAD_FAILURE", roadMemories, `Based on ${roadMemories} resolved road issue(s), similar failures are predicted in high-traffic areas.`),
      buildPrediction("PIPELINE_BURST", pipelineMemories, `${pipelineMemories} resolved pipeline issue(s) indicate aging infrastructure. Burst risk elevated.`),
      buildPrediction("STREETLIGHT_OUTAGE", lightMemories, `Recurring streetlight failures detected across ${lightMemories} historical record(s).`),
      buildPrediction("GARBAGE_OVERFLOW", garbageMemories, `Garbage overflow patterns found in ${garbageMemories} historical record(s).`),
      buildPrediction("BRIDGE_RISK", bridgeMemories, `${bridgeMemories} bridge-related issue(s) on record. Structural checks recommended.`),
    ];

    // Infrastructure maintenance: triggered by broken/old assets
    if (brokenAssets > 0 || oldAssets > 0) {
      candidates.push({
        type: "INFRASTRUCTURE_MAINTENANCE",
        confidence: Math.min(88, 30 + brokenAssets * 10 + oldAssets * 5),
        description: `${brokenAssets} broken asset(s) and ${oldAssets} aging asset(s) (20+ years) detected. Preventive maintenance recommended.`,
      });
    }

    for (const pred of candidates) {
      if (!pred) continue;
      const created = await prisma.prediction.create({ data: pred });
      predictions.push(created);
    }

    logger.info(`Recalculated ${predictions.length} predictions from ${totalMemories} memories.`);
    return predictions;
  }

  static async getPredictions(wardId?: string) {
    const predictions = await prisma.prediction.findMany({
      where: wardId ? { wardId } : {},
      orderBy: { confidence: "desc" },
    });

    if (predictions.length === 0) {
      return {
        predictions: [],
        message:
          "No predictions available yet. Prediction model needs more historical repair data. Complete at least one repair to begin building predictive intelligence.",
      };
    }

    return { predictions, message: null };
  }
}
