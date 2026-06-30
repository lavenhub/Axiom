import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create users
  const admin = await prisma.user.create({
    data: { name: "Admin User", email: "admin@axiom.com", role: "ADMIN" }
  });
  const engineer = await prisma.user.create({
    data: { name: "John Engineer", email: "john@axiom.com", role: "ENGINEER" }
  });
  const citizen = await prisma.user.create({
    data: { name: "Jane Citizen", email: "jane@citizen.com", role: "CITIZEN" }
  });

  // Create wards
  const ward1 = await prisma.ward.create({
    data: { name: "Downtown Ward", number: 1 }
  });
  const ward2 = await prisma.ward.create({
    data: { name: "Westside Ward", number: 2 }
  });

  // Create infrastructure types
  const roadType = await prisma.infrastructureType.create({
    data: { name: "Road", icon: "road" }
  });
  const streetlightType = await prisma.infrastructureType.create({
    data: { name: "Streetlight", icon: "lamp" }
  });

  // Create locations
  const location1 = await prisma.location.create({
    data: { latitude: 40.7128, longitude: -74.0060, address: "123 Main St", wardId: ward1.id }
  });

  // Create infrastructure assets
  const asset1 = await prisma.infrastructureAsset.create({
    data: {
      name: "Main St Road Segment",
      typeId: roadType.id,
      locationId: location1.id,
      age: 15,
      status: "OPERATIONAL"
    }
  });

  // Create repair methods
  const potholeMethod = await prisma.repairMethod.create({
    data: {
      name: "Pothole Patching",
      description: "Standard asphalt patching for small potholes",
      avgCost: 150,
      avgDuration: 60,
      successRate: 85
    }
  });

  // Create root causes
  const wearCause = await prisma.rootCause.create({
    data: { name: "Heavy Traffic Wear", description: "Excessive traffic causing wear and tear", category: "ROAD" }
  });

  // Create sample issue
  const issue = await prisma.issue.create({
    data: {
      title: "Large pothole on Main St",
      description: "A dangerous pothole has formed near the intersection, causing vehicle damage.",
      category: "ROAD",
      severity: "HIGH",
      status: "ANALYZED",
      citizenId: citizen.id,
      wardId: ward1.id,
      gpsLatitude: 40.7128,
      gpsLongitude: -74.0060
    }
  });

  // Create repair
  const repair = await prisma.repair.create({
    data: {
      issueId: issue.id,
      engineerId: engineer.id,
      description: "Filled the pothole with asphalt",
      cost: 120,
      successScore: 90,
      outcome: "SUCCESS",
      methodId: potholeMethod.id,
      rootCauseId: wearCause.id
    }
  });

  // Create memory from issue
  await prisma.memory.create({
    data: {
      title: issue.title,
      summary: issue.description,
      issueId: issue.id,
      repairId: repair.id,
      wardId: ward1.id,
      locationId: location1.id,
      assetId: asset1.id,
      successScore: 90
    }
  });

  // Create analytics snapshot
  await prisma.analyticsSnapshot.create({
    data: {
      infrastructureHealth: 82,
      repairSuccess: 88,
      predictionAccuracy: 85,
      knowledgeGrowth: 1200,
      avgRepairTime: 1440,
      totalMemories: 1
    }
  });

  // Create predictions
  await prisma.prediction.create({
    data: {
      type: "ROAD_FAILURE",
      confidence: 35,
      description: "Moderate risk of road damage in Ward 1"
    }
  });

  console.log("✅ Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
