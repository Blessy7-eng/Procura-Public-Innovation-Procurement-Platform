import { Request, Response } from 'express';
import { db } from '../services/db.service';
import { Challenge } from '../types';

export const ChallengesController = {
  getChallenges: (_req: Request, res: Response) => {
    res.json(db.challenges);
  },

  getChallengeById: (req: Request, res: Response) => {
    const { id } = req.params;
    const challenge = db.challenges.find(c => c.id === id);
    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }
    res.json(challenge);
  },

  createChallenge: (req: Request, res: Response) => {
    const {
      title,
      problemStatement,
      targetUsers,
      expectedOutcomes,
      requiredCapabilities,
      eligibilityRequirements,
      suggestedKPIs,
      pilotDuration
    } = req.body;

    if (!title || !problemStatement) {
      return res.status(400).json({ error: 'Title and problem statement are required' });
    }

    const newChallenge: Challenge = {
      id: `ch-${Date.now()}`,
      departmentId: 'dept-1',
      createdBy: 'usr-gov-1',
      title,
      problemStatement,
      targetUsers: Array.isArray(targetUsers) ? targetUsers : (targetUsers ? [targetUsers] : []),
      expectedOutcomes: Array.isArray(expectedOutcomes) ? expectedOutcomes : (expectedOutcomes ? [expectedOutcomes] : []),
      requiredCapabilities: Array.isArray(requiredCapabilities) ? requiredCapabilities : (requiredCapabilities ? [requiredCapabilities] : []),
      eligibilityRequirements: Array.isArray(eligibilityRequirements) ? eligibilityRequirements : (eligibilityRequirements ? [eligibilityRequirements] : []),
      suggestedKPIs: Array.isArray(suggestedKPIs) ? suggestedKPIs : (suggestedKPIs ? [suggestedKPIs] : []),
      pilotDuration: pilotDuration || '90 days',
      status: 'published',
      createdAt: new Date().toISOString()
    };

    db.challenges.unshift(newChallenge);
    db.logActivity('Officer Rajesh Varma', 'government', 'challenge', newChallenge.id, 'create', `Created challenge: ${newChallenge.title}`);

    res.status(201).json(newChallenge);
  },

  getMatches: (req: Request, res: Response) => {
    const { id } = req.params;
    const challenge = db.challenges.find(c => c.id === id);
    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    const matches = db.matches.filter(m => m.challengeId === id);
    res.json(matches);
  }
};
