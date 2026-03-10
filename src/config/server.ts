import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { env } from './env';

export function createServer(): Application {
  const app = express();

  // ── Segurança: headers HTTP ──────────────────────────────
  app.use(helmet());

  // ── Segurança: CORS ──────────────────────────────────────
  // Em produção, substituir pelo domínio real do frontend
  app.use(
    cors({
      origin: env.isProduction ? process.env.ALLOWED_ORIGIN : '*',
      methods: ['GET', 'POST', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }),
  );

  // ── Segurança: rate limiting global ──────────────────────
  app.use(
    rateLimit({
      windowMs: env.rateLimit.windowMs,
      max: env.rateLimit.maxRequests,
      standardHeaders: true,
      legacyHeaders: false,
      message: {
        success: false,
        error: {
          code: 'TOO_MANY_REQUESTS',
          message: 'Muitas requisições. Tente novamente em alguns instantes.',
        },
      },
    }),
  );

  // ── Body parsing ─────────────────────────────────────────
  app.use(express.json({ limit: '10kb' })); // limite para evitar payloads gigantes
  app.use(express.urlencoded({ extended: true, limit: '10kb' }));

  // ── Health check ─────────────────────────────────────────
  app.get('/health', (_req, res) => {
    res.json({
      success: true,
      data: {
        status: 'ok',
        environment: env.nodeEnv,
        timestamp: new Date().toISOString(),
      },
    });
  });

  return app;
}