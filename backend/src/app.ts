import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { logger } from './config/logger.js';
import { authRoutes } from './routes/auth.js';
import { setupRoutes } from './routes/setup.js';
import { issueRoutes } from './routes/issues.js';
import { memoryRoutes } from './routes/memories.js';
import { aiRoutes } from './routes/ai.js';
import { predictionRoutes } from './routes/predictions.js';
import { analyticsRoutes } from './routes/analytics.js';
import { repairRoutes } from './routes/repairs.js';
import { prisma } from './config/prisma.js';

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:8080'],
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health check (public)
app.get('/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    const counts = {
      users: await prisma.user.count(),
      issues: await prisma.issue.count(),
      memories: await prisma.memory.count(),
      repairs: await prisma.repair.count(),
    };
    res.json({ status: 'ok', timestamp: new Date().toISOString(), db: 'connected', counts });
  } catch (e) {
    res.status(500).json({ status: 'error', db: 'disconnected' });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/setup', setupRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/repairs', repairRoutes);
app.use('/api/memories', memoryRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/predictions', predictionRoutes);
app.use('/api/analytics', analyticsRoutes);

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    code: err.code
  });
});

export default app;
