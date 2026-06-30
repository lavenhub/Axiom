import { logger } from './config/logger.js';
import { prisma } from './config/prisma.js';
import app from './app.js';

const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    await prisma.$connect();
    logger.info('✅ Connected to database');
    app.listen(PORT, () => {
      logger.info(`🚀 Axiom backend running on http://localhost:${PORT}`);
      logger.info(`📋 API Docs: GET /health for system status`);
    });
  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
