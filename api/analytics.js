import analyticsRouter from '../server/api/analytics.js';
import express from 'express';
import { corsMiddleware } from '../server/middleware/cors.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(corsMiddleware);
app.use(express.json());
app.use('/', analyticsRouter);

// Vercel serverless function handler
export default async function handler(req, res) {
  return new Promise((resolve, reject) => {
    app(req, res, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}
