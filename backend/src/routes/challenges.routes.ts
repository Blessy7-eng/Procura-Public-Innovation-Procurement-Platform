import { Router } from 'express';
import { ChallengesController } from '../controllers/challenges.controller';

export const challengesRouter = Router();

challengesRouter.get('/', ChallengesController.getChallenges);
challengesRouter.get('/:id', ChallengesController.getChallengeById);
challengesRouter.post('/', ChallengesController.createChallenge);
challengesRouter.get('/:id/matches', ChallengesController.getMatches);
