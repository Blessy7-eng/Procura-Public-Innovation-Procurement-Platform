import { Router } from 'express';
import { authRouter } from './auth.routes';
import { challengesRouter } from './challenges.routes';
import { startupsRouter } from './startups.routes';
import { pilotsRouter } from './pilots.routes';
import { evaluationsRouter } from './evaluations.routes';
import { aiRouter } from './ai.routes';
import { auditRouter } from './audit.routes';

export const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/challenges', challengesRouter);
apiRouter.use('/startups', startupsRouter);
apiRouter.use('/pilots', pilotsRouter);
apiRouter.use('/evaluations', evaluationsRouter);
apiRouter.use('/ai', aiRouter);
apiRouter.use('/audit', auditRouter);
