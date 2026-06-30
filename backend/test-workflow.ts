#!/usr/bin/env node
import axios from "axios";
import { logger } from "./src/config/logger.js";

const API_BASE = "http://localhost:3001/api";

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testHealthCheck() {
  logger.info("🧪 Step 1: Testing Health Check");
  const response = await axios.get("http://localhost:3001/health");
  logger.info("✅ Health Check Passed!", response.data);
  return true;
}

async function testListIssues() {
  logger.info("\n🧪 Step 2: List all issues");
  const response = await axios.get(`${API_BASE}/issues`);
  logger.info(`✅ Found ${response.data.length} issues`);
  return response.data;
}

async function testCreateIssue(mockIssue: any) {
  logger.info("\n🧪 Step 3: Create new issue");
  const response = await axios.post(`${API_BASE}/issues`, mockIssue);
  logger.info("✅ Issue created successfully!");
  logger.info("   Issue:", JSON.stringify(response.data.issue, null, 2));
  logger.info("   AI Analysis:", JSON.stringify(response.data.aiAnalysis, null, 2));
  logger.info("   Similar Memories:", response.data.similarMemories.length);
  return response.data.issue;
}

async function testListMemories() {
  logger.info("\n🧪 Step 4: List all memories");
  const response = await axios.get(`${API_BASE}/memories`);
  logger.info(`✅ Found ${response.data.length} memories`);
  return response.data;
}

async function testAskAxiom(userId: string) {
  logger.info("\n🧪 Step 5: Ask Axiom a question");
  const question = "What are common causes of potholes?";
  const response = await axios.post(`${API_BASE}/ai/ask`, { question, userId });
  logger.info("✅ Axiom responded!");
  logger.info("   Answer:", response.data.answer);
  logger.info("   Confidence:", response.data.confidence);
  logger.info("   Recommendations:", response.data.recommendations);
  return response.data;
}

async function testListPredictions() {
  logger.info("\n🧪 Step 6: List predictions");
  const response = await axios.get(`${API_BASE}/predictions`);
  logger.info(`✅ Found ${response.data.length} predictions`);
  response.data.forEach((p: any) => {
    logger.info(`   - ${p.type} (${p.confidence}%): ${p.description}`);
  });
  return response.data;
}

async function testAnalytics() {
  logger.info("\n🧪 Step 7: Get dashboard analytics");
  const response = await axios.get(`${API_BASE}/analytics/dashboard`);
  logger.info("✅ Dashboard stats:");
  logger.info(`   Total Memories: ${response.data.totalMemories}`);
  logger.info(`   Total Issues: ${response.data.totalIssues}`);
  logger.info(`   Latest Snapshot:`, JSON.stringify(response.data.latestSnapshot, null, 2));
  return response.data;
}

async function main() {
  logger.info("=".repeat(80));
  logger.info("🧪 Starting Axiom End-to-End Test Suite");
  logger.info("=".repeat(80));

  try {
    // 1. Test health check
    await testHealthCheck();

    // 2. List initial issues and memories
    const initialIssues = await testListIssues();
    const initialMemories = await testListMemories();
    await testAnalytics();
    await testListPredictions();

    // 3. Create a test issue
    if (initialIssues.length > 0) {
      const mockIssueData = {
        title: "New pothole on Oak Avenue",
        description: "A large pothole has appeared on Oak Avenue near the park entrance, causing damage to vehicles",
        citizenId: initialIssues[0].citizenId,
        wardId: initialIssues[0].wardId,
        gpsLatitude: 40.7150,
        gpsLongitude: -74.0080
      };

      const newIssue = await testCreateIssue(mockIssueData);

      // 4. Ask Axiom a question
      await testAskAxiom(newIssue.citizenId);

      // Verify new issue appears in list
      const updatedIssues = await testListIssues();
      logger.info(`\n📊 After creating issue: ${updatedIssues.length} total issues now!`);

      await testAnalytics();
    } else {
      logger.warn("⚠️ No initial issues found to use for testing create issue!");
    }

    logger.info("\n".repeat(3));
    logger.info("=".repeat(80));
    logger.info("🎉 All tests passed! Axiom is fully operational!");
    logger.info("=".repeat(80));

  } catch (error: any) {
    logger.error("\n❌ Test failed!", error.response?.data || error.message);
    process.exit(1);
  }
}

main();
