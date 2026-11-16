import 'dotenv/config';
import express from 'express';
import path from 'path';
import { createApiApp } from './server/app';

const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  const app = createApiApp();
  const isProd = process.env.NODE_ENV === 'production' || process.argv.includes('--prod');

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Sidi Travel & Tours Ltd. server listening on http://localhost:${PORT}`);
  });
}

startServer();
