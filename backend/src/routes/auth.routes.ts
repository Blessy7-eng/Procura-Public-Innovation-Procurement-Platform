import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

export const authRouter = Router();

authRouter.post('/demo-login', AuthController.demoLogin);
authRouter.get('/me', AuthController.getCurrentUser);
authRouter.get('/users', AuthController.getAllUsers);
