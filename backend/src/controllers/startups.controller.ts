import { Request, Response } from 'express';
import { db } from '../services/db.service';
import { StartupSolution } from '../types';

export const StartupsController = {
  getStartups: (_req: Request, res: Response) => {
    res.json(db.startups);
  },

  getStartupById: (req: Request, res: Response) => {
    const { id } = req.params;
    const startup = db.startups.find(s => s.id === id);
    if (!startup) {
      return res.status(404).json({ error: 'Startup not found' });
    }
    const solutions = db.solutions.filter(sol => sol.startupId === id);
    res.json({ ...startup, solutions });
  },

  getSolutions: (req: Request, res: Response) => {
    const { startupId } = req.query;
    if (startupId) {
      return res.json(db.solutions.filter(s => s.startupId === startupId));
    }
    res.json(db.solutions);
  },

  addSolution: (req: Request, res: Response) => {
    const {
      startupId,
      name,
      description,
      capabilities,
      problemSolved,
      technology,
      deploymentModel,
      implementationTime,
      estimatedCost,
      previousDeployments,
      pilotReadiness
    } = req.body;

    if (!startupId || !name || !description) {
      return res.status(400).json({ error: 'Missing required solution fields' });
    }

    const newSolution: StartupSolution = {
      id: `sol-${Date.now()}`,
      startupId,
      name,
      description,
      problemSolved: problemSolved || 'Municipal operational challenge',
      capabilities: Array.isArray(capabilities) ? capabilities : (capabilities ? [capabilities] : []),
      technology: technology || 'Cloud SaaS',
      deploymentModel: deploymentModel || 'Cloud SaaS',
      implementationTime: implementationTime || '14 days',
      estimatedCost: estimatedCost || '$4,000 for 90 days',
      previousDeployments: previousDeployments || 'Municipal pilots',
      pilotReadiness: pilotReadiness || 'Immediate',
      status: 'active',
      createdAt: new Date().toISOString()
    };

    db.solutions.unshift(newSolution);
    db.logActivity(
      'Aarav Sharma',
      'startup',
      'solution',
      newSolution.id,
      'create',
      `Registered solution: ${newSolution.name}`
    );

    res.status(201).json(newSolution);
  }
};
