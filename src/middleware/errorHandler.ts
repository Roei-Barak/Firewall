import type { Request, Response, NextFunction } from 'express';
import logger from '../config/logger.js';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error(`Unhandled error: ${err.message}`);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
};