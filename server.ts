import dotenv from 'dotenv';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GET as getBootstrap } from './app/api/bootstrap/route.ts';
import { POST as postAIChat } from './app/api/ai/chat/route.ts';
import { POST as postAIBlueprint } from './app/api/ai/blueprint/route.ts';
import {
  GET as getSuggestions,
  POST as postSuggestion,
} from './app/api/suggestions/route.ts';
import { POST as postUpvoteSuggestion } from './app/api/suggestions/[id]/upvote/route.ts';
import {
  GET as getInquiries,
  POST as postInquiry,
} from './app/api/inquiries/route.ts';

dotenv.config();

const PORT = 3000;

// Helper to bridge Express req/res to Next.js App Router Web Request/Response
async function forwardToNextRoute(
  req: express.Request,
  res: express.Response,
  handler: (request: Request, context?: any) => Promise<Response>,
  context?: any
) {
  try {
    const url = `http://localhost:${PORT}${req.originalUrl}`;
    const hasBody = req.method !== 'GET' && req.method !== 'HEAD';
    const webReq = new Request(url, {
      method: req.method,
      headers: { 'Content-Type': 'application/json' },
      body: hasBody ? JSON.stringify(req.body ?? {}) : undefined,
    });

    const webRes = await handler(webReq, context);
    const data = await webRes.json();
    res.status(webRes.status).json(data);
  } catch (err) {
    console.error(`Error handling ${req.originalUrl}:`, err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '2mb' }));

  // Mount Next.js App Router API Route Handlers (/app/api/*/route.ts)
  app.get('/api/bootstrap', (req, res) =>
    forwardToNextRoute(req, res, getBootstrap)
  );

  app.post('/api/ai/chat', (req, res) =>
    forwardToNextRoute(req, res, postAIChat)
  );

  app.post('/api/ai/blueprint', (req, res) =>
    forwardToNextRoute(req, res, postAIBlueprint)
  );

  app.get('/api/suggestions', (req, res) =>
    forwardToNextRoute(req, res, getSuggestions)
  );

  app.post('/api/suggestions', (req, res) =>
    forwardToNextRoute(req, res, postSuggestion)
  );

  app.post('/api/suggestions/:id/upvote', (req, res) =>
    forwardToNextRoute(req, res, postUpvoteSuggestion, {
      params: { id: req.params.id },
    })
  );

  app.get('/api/inquiries', (req, res) =>
    forwardToNextRoute(req, res, getInquiries)
  );

  app.post('/api/inquiries', (req, res) =>
    forwardToNextRoute(req, res, postInquiry)
  );

  // Dynamic SEO Sitemap & Robots endpoints using APP_URL or request host
  const resolveBaseUrl = (req: express.Request): string => {
    if (process.env.APP_URL) {
      return process.env.APP_URL.replace(/\/+$/, '');
    }
    const proto = (req.headers['x-forwarded-proto'] as string) || req.protocol || 'https';
    const host = req.headers['x-forwarded-host'] || req.get('host') || `localhost:${PORT}`;
    return `${proto}://${host}`;
  };

  app.get('/robots.txt', (req, res) => {
    const baseUrl = resolveBaseUrl(req);
    res
      .type('text/plain')
      .send(
        `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${baseUrl}/sitemap.xml\n`
      );
  });

  app.get('/sitemap.xml', (req, res) => {
    const baseUrl = resolveBaseUrl(req);
    const routes = [
      { path: '/', priority: '1.0', changefreq: 'weekly' },
      { path: '/services', priority: '0.9', changefreq: 'weekly' },
      { path: '/ai', priority: '0.9', changefreq: 'weekly' },
      { path: '/work', priority: '0.85', changefreq: 'weekly' },
      { path: '/about', priority: '0.8', changefreq: 'monthly' },
      { path: '/faq', priority: '0.75', changefreq: 'monthly' },
      { path: '/contact', priority: '0.85', changefreq: 'monthly' },
    ];
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes
      .map(
        (r) =>
          `  <url>\n    <loc>${baseUrl}${r.path}</loc>\n    <changefreq>${r.changefreq}</changefreq>\n    <priority>${r.priority}</priority>\n  </url>`
      )
      .join('\n')}\n</urlset>`;
    res.type('application/xml').send(xml);
  });

  const distPath = path.join(process.cwd(), 'dist');
  const isProdMode =
    process.env.NODE_ENV === 'production' || process.argv.includes('--prod');
  const hasBuild = fs.existsSync(path.join(distPath, 'index.html'));

  if (!isProdMode || !hasBuild) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(
      `Akviora Next.js + Node.js Server (${isProdMode && hasBuild ? 'PRODUCTION BUILD' : 'DEV'}) running on http://localhost:${PORT}`
    );
  });
}

startServer();
