import { Request, Response } from 'express';
import { db } from '../services/db.service';

export const AuthController = {
  demoLogin: (req: Request, res: Response) => {
    const { role } = req.body;
    const user = db.users.find(u => u.role === role) || db.users[0];
    res.json({
      success: true,
      user,
      token: `demo-token-${user.id}`
    });
  },

  getCurrentUser: (req: Request, res: Response) => {
    const userId = req.headers['x-user-id'] || 'usr-gov-1';
    const user = db.users.find(u => u.id === userId) || db.users[0];
    res.json(user);
  },

  getAllUsers: (_req: Request, res: Response) => {
    res.json(db.users);
  }
};
