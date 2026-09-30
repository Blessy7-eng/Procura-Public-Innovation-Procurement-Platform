import { Request, Response, NextFunction } from 'express';

export function requestLogger(req: Request, _res: Response, next: NextFunction) {
  const timestamp = new Date().toISOString();
  console.log(`[PROCURA] ${timestamp} ${req.method} ${req.originalUrl}`);
  next();
}
