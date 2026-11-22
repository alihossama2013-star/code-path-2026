import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import express from 'express';
import {
  handleAuthCallback,
  handleAuthLogout,
  handleAuthMe,
  handleAuthUrl,
  handleProgress,
  handleTts,
} from './server/lib/handlers.js';

const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

async function startServer() {
  const app = express();
  app.set('trust proxy', 1);
  app.use(express.json({ limit: '128kb' }));

  app.post('/api/tts', (req, res) => void handleTts(req, res));
  app.get('/api/auth/url', (req, res) => void handleAuthUrl(req, res));
  app.get(['/api/auth/callback', '/api/auth/callback/'], (req, res) => void handleAuthCallback(req, res));
  app.get('/api/auth/me', (req, res) => void handleAuthMe(req, res));
  app.post('/api/auth/logout', (req, res) => void handleAuthLogout(req, res));
  app.all('/api/progress', (req, res) => void handleProgress(req, res));

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    const indexHtml = path.join(distDir, 'index.html');
    app.use(express.static(distDir, { maxAge: '7d' }));
    app.get('*', (_req, res) => {
      if (fs.existsSync(indexHtml)) {
        res.sendFile(indexHtml);
      } else {
        res.status(404).send('Build output not found.');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CodePath server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
