import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';
import { apiRouter } from './backend/src/routes';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();

  const PORT = Number(process.env.PORT) || 3000;
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json());

  // API routes
  app.use('/api', apiRouter);

  // Health check
  app.get('/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'procura-api',
      timestamp: new Date().toISOString(),
    });
  });

  const distPath = path.resolve(__dirname, 'dist');
  const indexPath = path.resolve(distPath, 'index.html');

  if (isProd) {
    if (!fs.existsSync(indexPath)) {
      console.error('[PROCURA] Production build not found:', indexPath);
      process.exit(1);
    }

    console.log('[PROCURA] Serving production build from:', distPath);

    app.use(express.static(distPath));

    app.get('*', (_req, res) => {
      res.sendFile(indexPath);
    });
  } else {
    const { createServer: createViteServer } = await import('vite');

    const vite = await createViteServer({
      server: {
        middlewareMode: true,
      },
      appType: 'spa',
    });

    app.use(vite.middlewares);

    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;

      try {
        let template = fs.readFileSync(
          path.resolve(__dirname, 'index.html'),
          'utf-8'
        );

        template = await vite.transformIndexHtml(url, template);

        res
          .status(200)
          .set({ 'Content-Type': 'text/html' })
          .end(template);
      } catch (error: any) {
        if (vite.ssrFixStacktrace) {
          vite.ssrFixStacktrace(error);
        }

        next(error);
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(
      `[PROCURA] Server listening on http://0.0.0.0:${PORT} (mode: ${
        isProd ? 'production' : 'development'
      })`
    );
  });
}

startServer().catch((error) => {
  console.error('[PROCURA] Server failed to start:', error);
  process.exit(1);
});
