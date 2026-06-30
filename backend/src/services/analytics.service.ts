import { prisma } from "../config/prisma.js";
import { logger } from "../config/logger.js";

export class AnalyticsService {
  // ─── Compute real metrics from live DB data ───────────────────────────────
  static async generateSnapshot() {
    const [
      totalMemories,
      totalIssues,
      openIssues,
      resolvedIssues,
      successfulRepairs,
      totalCompletedRepairs,
      allAssets,
      brokenAssets,
      maintenanceAssets,
      knowledgeConnections,
      completedRepairsList,
    ] = await Promise.all([
      prisma.memory.count({ where: { deletedAt: null } }),
      prisma.issue.count({ where: { deletedAt: null } }),
      prisma.issue.count({ where: { status: { in: ["REPORTED", "ANALYZED", "ASSIGNED", "IN_PROGRESS"] }, deletedAt: null } }),
      prisma.issue.count({ where: { status: { in: ["RESOLVED", "CLOSED"] }, deletedAt: null } }),
      prisma.repair.count({ where: { outcome: "SUCCESS", deletedAt: null } }),
      prisma.repair.count({ where: { outcome: { not: "PENDING" }, deletedAt: null } }),
      prisma.infrastructureAsset.count({ where: { deletedAt: null } }),
      prisma.infrastructureAsset.count({ where: { status: "BROKEN", deletedAt: null } }),
      prisma.infrastructureAsset.count({ where: { status: "MAINTENANCE", deletedAt: null } }),
      prisma.knowledgeConnection.count({ where: { deletedAt: null } }),
      prisma.repair.findMany({
        where: { outcome: { not: "PENDING" }, startDate: { not: null }, endDate: { not: null }, deletedAt: null },
        select: { startDate: true, endDate: true },
      }),
    ]);

    // Infrastructure health: 100% if no assets, penalized for broken/maintenance
    let infrastructureHealth = 100;
    if (allAssets > 0) {
      const penalty = (brokenAssets * 15 + maintenanceAssets * 5) / allAssets;
      infrastructureHealth = Math.max(0, Math.round(100 - penalty));
    }

    // Repair success rate
    const repairSuccess =
      totalCompletedRepairs > 0
        ? Math.round((successfulRepairs / totalCompletedRepairs) * 100)
        : 0;

    // Average repair time in minutes
    let avgRepairTime = 0;
    if (completedRepairsList.length > 0) {
      const totalMinutes = completedRepairsList.reduce((sum, r) => {
        if (!r.startDate || !r.endDate) return sum;
        return sum + (r.endDate.getTime() - r.startDate.getTime()) / 60000;
      }, 0);
      avgRepairTime = Math.round(totalMinutes / completedRepairsList.length);
    }

    // Knowledge growth: connections created per memory (quality of graph)
    const knowledgeGrowth =
      totalMemories > 0 ? parseFloat((knowledgeConnections / totalMemories).toFixed(2)) : 0;

    // Prediction accuracy improves with more memories (heuristic)
    const predictionAccuracy =
      totalMemories === 0
        ? 0
        : totalMemories < 5
        ? 50
        : totalMemories < 20
        ? 70
        : 85;

    const snapshot = await prisma.analyticsSnapshot.create({
      data: {
        infrastructureHealth,
        repairSuccess,
        predictionAccuracy,
        knowledgeGrowth,
        avgRepairTime,
        totalMemories,
      },
    });

    logger.info(
      `Analytics snapshot generated — Health: ${infrastructureHealth}%, Memories: ${totalMemories}, Repair Success: ${repairSuccess}%`
    );
    return snapshot;
  }

  // ─── Real-time dashboard stats ────────────────────────────────────────────
  static async getDashboardStats() {
    const [
      totalMemories,
      totalIssues,
      openIssues,
      resolvedIssues,
      successfulRepairs,
      totalCompletedRepairs,
      allAssets,
      brokenAssets,
      maintenanceAssets,
      knowledgeConnections,
      latestSnapshot,
      issuesByCategory,
      recentMemories,
    ] = await Promise.all([
      prisma.memory.count({ where: { deletedAt: null } }),
      prisma.issue.count({ where: { deletedAt: null } }),
      prisma.issue.count({ where: { status: { in: ["REPORTED", "ANALYZED", "ASSIGNED", "IN_PROGRESS"] }, deletedAt: null } }),
      prisma.issue.count({ where: { status: { in: ["RESOLVED", "CLOSED"] }, deletedAt: null } }),
      prisma.repair.count({ where: { outcome: "SUCCESS", deletedAt: null } }),
      prisma.repair.count({ where: { outcome: { not: "PENDING" }, deletedAt: null } }),
      prisma.infrastructureAsset.count({ where: { deletedAt: null } }),
      prisma.infrastructureAsset.count({ where: { status: "BROKEN", deletedAt: null } }),
      prisma.infrastructureAsset.count({ where: { status: "MAINTENANCE", deletedAt: null } }),
      prisma.knowledgeConnection.count({ where: { deletedAt: null } }),
      prisma.analyticsSnapshot.findFirst({ orderBy: { snapshotDate: "desc" } }),
      prisma.issue.groupBy({ by: ["category"], _count: { _all: true }, where: { deletedAt: null } }),
      prisma.memory.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        where: { deletedAt: null },
        select: { id: true, title: true, successScore: true, createdAt: true, ward: { select: { name: true } } },
      }),
    ]);

    const healthScore =
      allAssets > 0
        ? Math.max(0, Math.round(100 - (brokenAssets * 15 + maintenanceAssets * 5) / allAssets))
        : 100;

    const repairSuccessRate =
      totalCompletedRepairs > 0 ? Math.round((successfulRepairs / totalCompletedRepairs) * 100) : null;

    const predictionAccuracy =
      totalMemories === 0 ? null : totalMemories < 5 ? 50 : totalMemories < 20 ? 70 : 85;

    return {
      // Core metrics
      totalMemories,
      totalIssues,
      openIssues,
      resolvedIssues,
      // Infrastructure
      infrastructureHealth: healthScore,
      totalAssets: allAssets,
      brokenAssets,
      maintenanceAssets,
      // Quality
      repairSuccessRate,
      predictionAccuracy,
      knowledgeConnections,
      // Breakdown
      issuesByCategory: issuesByCategory.map((g) => ({ category: g.category, count: g._count._all })),
      recentMemories,
      latestSnapshot,
      // Empty state hints
      emptyStates: {
        noMemories: totalMemories === 0,
        noIssues: totalIssues === 0,
        noPredictions: totalMemories < 3,
        noGraph: knowledgeConnections === 0,
      },
    };
  }
}
