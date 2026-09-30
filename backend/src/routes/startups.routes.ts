import { Router } from 'express';
import { StartupsController } from '../controllers/startups.controller';

export const startupsRouter = Router();

startupsRouter.get('/', StartupsController.getStartups);
startupsRouter.get('/solutions', StartupsController.getSolutions);
startupsRouter.post('/solutions', StartupsController.addSolution);
startupsRouter.get('/:id', StartupsController.getStartupById);
