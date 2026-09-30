import express from 'express';
import { apiRouter } from './routes';
import { requestLogger } from './middleware/logger.middleware';
import { errorHandler } from './middleware/error.middleware';

export function createApp() {
  const app = express();

  app.use(express.json());
  app.use(requestLogger);

  // Mount API Router
  app.use('/api', apiRouter);

  // Health check endpoint
  app.get('/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'procura-backend',
      timestamp: new Date().toISOString()
    });
  });

  // Global Error Handler
  app.use(errorHandler);

  return app;
}
