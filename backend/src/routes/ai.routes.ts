import { Router } from 'express';
import { AiController } from '../controllers/ai.controller';

export const aiRouter = Router();

aiRouter.post('/structure-challenge', AiController.structureChallenge);
aiRouter.post('/explain-match', AiController.explainMatch);
aiRouter.post('/summarize-evidence', AiController.summarizeEvidence);
