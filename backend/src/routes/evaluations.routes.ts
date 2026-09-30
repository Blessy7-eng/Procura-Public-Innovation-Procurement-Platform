import { Router } from 'express';
import { EvaluationsController } from '../controllers/evaluations.controller';

export const evaluationsRouter = Router();

evaluationsRouter.get('/applications', EvaluationsController.getApplications);
evaluationsRouter.post('/applications', EvaluationsController.createApplication);
evaluationsRouter.post('/', EvaluationsController.submitEvaluation);
