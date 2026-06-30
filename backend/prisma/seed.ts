import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Password is bcrypt hash of "axiom123"
  const HASHED_PW = "$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu6bO";

  // 1. Create Organization
  const org = await prisma.organization.create({
    data: { name: "City of Axiom" },
  });

  // 2. Create City
  const city = await prisma.city.create({
    data: { name: "Axiom City", organizationId: org.id },
  });

  // 3. Create Department
  const dept = await prisma.department.create({
    data: { name: "Infrastructure & Roads", cityId: city.id },
  });

  // 4. Create Users
  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@axiom.com",
      role: "ADMIN",
      password: HASHED_PW,
      organizationId: org.id,
      cityId: city.id,
    },
  });
  const engineer = await prisma.user.create({
    data: {
      name: "John Engineer",
      email: "john@axiom.com",
      role: "ENGINEER",
      password: HASHED_PW,
      organizationId: org.id,
      cityId: city.id,
      departmentId: dept.id,
    },
  });
  const citizen = await prisma.user.create({
    data: {
      name: "Jane Citizen",
      email: "jane@citizen.com",
      role: "CITIZEN",
      password: HASHED_PW,
      cityId: city.id,
    },
  });

  // 5. Create Wards
  const ward1 = await prisma.ward.create({
    data: { name: "Downtown Ward", number: 1, cityId: city.id },
  });
  const ward2 = await prisma.ward.create({
    data: { name: "Westside Ward", number: 2, cityId: city.id },
  });

  // 6. Create Infrastructure Type
  const roadType = await prisma.infrastructureType.create({
    data: { name: "Road", icon: "road" },
  });

  // 7. Create Location
  const location1 = await prisma.location.create({
    data: { latitude: 40.7128, longitude: -74.006, address: "123 Main St", wardId: ward1.id },
  });

  // 8. Create Infrastructure Asset
  const asset1 = await prisma.infrastructureAsset.create({
    data: {
      name: "Main St Road Segment",
      typeId: roadType.id,
      locationId: location1.id,
      age: 15,
      status: "OPERATIONAL",
    },
  });

  // 9. Create Repair Method
  const potholeMethod = await prisma.repairMethod.create({
    data: {
      name: "Pothole Patching",
      description: "Standard asphalt patching for small potholes",
      avgCost: 150,
      avgDuration: 60,
      successRate: 85,
    },
  });

  // 10. Create Root Cause
  const wearCause = await prisma.rootCause.create({
    data: {
      name: "Heavy Traffic Wear",
      description: "Excessive traffic causing wear and tear",
      category: "ROAD",
    },
  });

  // 11. Create Issue
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
      gpsLongitude: -74.006,
    },
  });

  // 12. Create Repair
  const repair = await prisma.repair.create({
    data: {
      issueId: issue.id,
      engineerId: engineer.id,
      description: "Filled the pothole with asphalt",
      cost: 120,
      successScore: 90,
      outcome: "SUCCESS",
      methodId: potholeMethod.id,
      rootCauseId: wearCause.id,
    },
  });

  // 13. Create Memory
  await prisma.memory.create({
    data: {
      title: issue.title,
      summary: issue.description,
      issueId: issue.id,
      repairId: repair.id,
      wardId: ward1.id,
      locationId: location1.id,
      assetId: asset1.id,
      successScore: 90,
    },
  });

  // 14. Analytics snapshot
  await prisma.analyticsSnapshot.create({
    data: {
      infrastructureHealth: 82,
      repairSuccess: 88,
      predictionAccuracy: 85,
      knowledgeGrowth: 1200,
      avgRepairTime: 1440,
      totalMemories: 1,
    },
  });

  // 15. Prediction
  await prisma.prediction.create({
    data: {
      type: "ROAD_FAILURE",
      confidence: 35,
      description: "Moderate risk of road damage in Ward 1",
    },
  });

  console.log("✅ Database seeded successfully!");
  console.log("📧 Demo login: admin@axiom.com / axiom123");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
