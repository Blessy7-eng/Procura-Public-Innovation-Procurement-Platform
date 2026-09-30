import { Request, Response } from 'express';
import { db } from '../services/db.service';

export const AuditController = {
  getActivityLogs: (_req: Request, res: Response) => {
    res.json(db.activityLogs);
  }
};
