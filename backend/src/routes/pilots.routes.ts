import { Router } from 'express';
import { PilotsController } from '../controllers/pilots.controller';

export const pilotsRouter = Router();

pilotsRouter.get('/', PilotsController.getPilots);
pilotsRouter.get('/kpis', PilotsController.getKpis);
pilotsRouter.get('/evidence', PilotsController.getEvidence);
pilotsRouter.post('/evidence', PilotsController.addEvidence);
pilotsRouter.get('/:id', PilotsController.getPilotById);
pilotsRouter.post('/:id/scale-up', PilotsController.submitScaleUpDecision);
