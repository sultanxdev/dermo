import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { requestIdMiddleware } from './middleware/audit';
import { errorHandler } from './middleware/errorHandler';
import apiRoutes from './routes';
import { seedDatabase } from './database/seed';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './auth';
import { config } from './config';

export function createApp(): Express {
  const app = express();

  // Initialize seed data
  seedDatabase();

  // Security headers & CORS
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(
    cors({
      origin: config.frontendUrl,
      credentials: true,
    })
  );

  // Better Auth — handles all /api/auth/* routes
  // Must be mounted BEFORE body parsers (Better Auth handles its own body parsing)
  app.all('/api/auth/*', toNodeHandler(auth));

  // Body parsers
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Logging & Tracing
  app.use(requestIdMiddleware);
  if (process.env.NODE_ENV !== 'test') {
    app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
  }

  // Health check
  app.get('/health', (_req: Request, res: Response) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'Dermo Clinic API',
      version: '1.0.0',
    });
  });

  // Main API Router
  app.use('/api/v1', apiRoutes);

  // Catch 404
  app.use((req: Request & { requestId?: string }, res: Response) => {
    res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: `Endpoint ${req.method} ${req.originalUrl} does not exist.`,
        requestId: req.requestId,
      },
    });
  });

  // Centralized Error Handler
  app.use(errorHandler);

  return app;
}
