import catalogRouter from '../server/api/catalog.js';
import githubRouter from '../server/api/github.js';
import trackingRouter from '../server/api/tracking.js';
import analyticsRouter from '../server/api/analytics.js';
import express from 'express';
import { corsMiddleware } from '../server/middleware/cors.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'trending-ai-pdfs-api'
  });
});

// API Routes
app.use('/api/catalog', catalogRouter);
app.use('/api/github', githubRouter);
app.use('/api/tracking', trackingRouter);
app.use('/api/analytics', analyticsRouter);

// Export for Vercel
export default app;
