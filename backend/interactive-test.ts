#!/usr/bin/env node
import axios from "axios";
import { logger } from "./src/config/logger.js";
import readline from "readline";

const API_BASE = "http://localhost:3001/api";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (q: string) => new Promise(resolve => rl.question(q, resolve));

const MOCK_DATA = {
  citizens: [
    { id: "citizen-1", name: "Alice Johnson", email: "alice@example.com" },
    { id: "citizen-2", name: "Bob Smith", email: "bob@example.com" }
  ],
  engineers: [
    { id: "eng-1", name: "Charlie Engineer", email: "charlie@axiom.com" }
  ],
  issues: [
    {
      title: "Large pothole on Main St",
      description: "Dangerous pothole near the intersection, damaging cars.",
      gpsLatitude: 40.7128,
      gpsLongitude: -74.0060
    },
    {
      title: "Water leak on Pine St",
      description: "Water pooling near hydrant, possible pipe damage.",
      gpsLatitude: 40.7140,
      gpsLongitude: -74.0070
    }
  ],
  questions: [
    "What are common causes of potholes?",
    "How to fix recurring water leaks?",
    "Which wards have the most issues?"
  ]
};

async function main() {
  logger.info("=".repeat(80));
  logger.info("🧪 Welcome to the Axiom Interactive Test Suite");
  logger.info("=".repeat(80));
  logger.info("");

  // Health Check
  logger.info("📍 Step 1: Health Check");
  try {
    await axios.get("http://localhost:3001/health");
    logger.info("✅ Backend is healthy!");
  } catch (e) {
    logger.error("❌ Backend is not running!");
    process.exit(1);
  }
  logger.info("");

  // List issues
  logger.info("📍 Step 2: Listing current issues");
  const { data: issues } = await axios.get(`${API_BASE}/issues`);
  logger.info(`✅ Found ${issues.length} existing issues`);
  logger.info("");

  // Ask user what to do
  console.log("\nWhat would you like to test?");
  console.log("1) Create a new issue (AI analysis + memory lookup)");
  console.log("2) Ask Axiom a question");
  console.log("3) List all memories");
  console.log("4) See predictions");
  console.log("5) Get dashboard analytics");
  console.log("6) Exit");

  const action = await question("\nChoose an option (1-6): ");
  console.log("");

  switch (action) {
    case "1":
      await testCreateIssue();
      break;
    case "2":
      await testAskAxiom();
      break;
    case "3":
      await testListMemories();
      break;
    case "4":
      await testPredictions();
      break;
    case "5":
      await testAnalytics();
      break;
    default:
      logger.info("👋 Goodbye!");
  }

  rl.close();
}

async function testCreateIssue() {
  logger.info("📍 Creating a new issue with AI Analysis");
  const mockIssue = MOCK_DATA.issues[Math.floor(Math.random() * MOCK_DATA.issues.length)];
  
  const payload = {
    ...mockIssue,
    citizenId: MOCK_DATA.citizens[0].id
  };

  logger.info(`📋 Issue Title: ${payload.title}`);
  logger.info(`📋 Description: ${payload.description}`);
  
  const { data } = await axios.post(`${API_BASE}/issues`, payload);
  logger.info("✅ Issue created successfully!");
  logger.info("   AI Analysis: ", data.aiAnalysis);
  logger.info(`   Category: ${data.aiAnalysis.category}`);
  logger.info(`   Severity: ${data.aiAnalysis.severity}`);
  logger.info(`   Found ${data.similarMemories.length} similar memories`);
}

async function testAskAxiom() {
  logger.info("📍 Asking Axiom a question");
  
  const q = MOCK_DATA.questions[Math.floor(Math.random() * MOCK_DATA.questions.length)];
  logger.info(`❓ Question: ${q}`);
  
  const { data } = await axios.post(`${API_BASE}/ai/ask`, {
    question: q,
    userId: MOCK_DATA.citizens[0].id
  });

  logger.info("✅ Axiom's Response:");
  logger.info(`   Answer: ${data.answer}`);
  logger.info(`   Confidence: ${data.confidence * 100}%`);
  logger.info("   Recommendations:");
  data.recommendations.forEach((rec: string) => logger.info(`   - ${rec}`));
}

async function testListMemories() {
  logger.info("📍 Listing all memories");
  const { data } = await axios.get(`${API_BASE}/memories`);
  logger.info(`✅ ${data.length} memories in the system!`);
  data.forEach((m: any, i: number) => {
    logger.info(`   ${i + 1}) ${m.title} (Success Score: ${m.successScore}%)`);
  });
}

async function testPredictions() {
  logger.info("📍 Listing infrastructure predictions");
  const { data } = await axios.get(`${API_BASE}/predictions`);
  logger.info(`✅ ${data.length} predictions available!`);
  data.forEach((p: any) => {
    logger.info(`   ${p.type}: ${p.confidence}% - ${p.description}`);
  });
}

async function testAnalytics() {
  logger.info("📍 Getting dashboard analytics");
  const { data } = await axios.get(`${API_BASE}/analytics/dashboard`);
  logger.info("✅ Analytics:");
  logger.info(`   Total Memories: ${data.totalMemories}`);
  logger.info(`   Total Issues: ${data.totalIssues}`);
  if (data.latestSnapshot) {
    logger.info(`   Infrastructure Health: ${data.latestSnapshot.infrastructureHealth}%`);
    logger.info(`   Repair Success Rate: ${data.latestSnapshot.repairSuccess}%`);
  }
}

main();
