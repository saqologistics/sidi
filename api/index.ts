import type { NextFunction, Request, Response } from 'express';
import { createApiApp } from '../server/app';

const app = createApiApp();

// Normalize Vercel rewrite paths if the /api prefix was stripped before invoking api/index.ts
export default function handler(req: Request, res: Response, next?: NextFunction) {
  if (req.url && !req.url.startsWith('/api')) {
    req.url = `/api${req.url.startsWith('/') ? req.url : `/${req.url}`}`;
  }
  return app(req, res, next as NextFunction);
}
