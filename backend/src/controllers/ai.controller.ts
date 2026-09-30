import { Request, Response } from 'express';
import {
  structureChallengeWithGemini,
  explainStartupMatchWithGemini,
  summarizePilotEvidenceWithGemini
} from '../services/gemini.service';
import { db } from '../services/db.service';

export const AiController = {
  structureChallenge: async (req: Request, res: Response) => {
    try {
      const { problemText } = req.body;
      if (!problemText || typeof problemText !== 'string') {
        return res.status(400).json({ error: 'problemText is required' });
      }

      const structured = await structureChallengeWithGemini(problemText);
      res.json(structured);
    } catch (err: any) {
      console.error('[AiController.structureChallenge]:', err);
      res.status(500).json({ error: 'AI structuring failed', details: err.message });
    }
  },

  explainMatch: async (req: Request, res: Response) => {
    try {
      const { challengeId, startupId, solutionId } = req.body;
      const challenge = db.challenges.find(c => c.id === challengeId) || db.challenges[0];
      const startup = db.startups.find(s => s.id === startupId) || db.startups[0];
      const solution = db.solutions.find(s => s.id === solutionId) || db.solutions[0];
      const match = db.matches.find(m => m.challengeId === challenge.id && m.solutionId === solution.id);

      const explanation = await explainStartupMatchWithGemini(
        challenge.title,
        challenge.requiredCapabilities,
        startup.name,
        solution.name,
        solution.capabilities,
        match?.matchScore || 85
      );
      res.json(explanation);
    } catch (err: any) {
      console.error('[AiController.explainMatch]:', err);
      res.status(500).json({ error: 'AI match explanation failed', details: err.message });
    }
  },

  summarizeEvidence: async (req: Request, res: Response) => {
    try {
      const { pilotId } = req.body;
      const pilot = db.pilots.find(p => p.id === pilotId) || db.pilots[0];
      const kpis = db.kpis.filter(k => k.pilotId === pilot.id).map(k => ({
        name: k.name,
        baseline: k.baselineValue,
        target: k.targetValue,
        current: k.currentValue,
        status: k.status
      }));
      const evidence = db.evidence.filter(e => e.pilotId === pilot.id).map(e => ({
        title: e.evidenceTitle,
        description: e.evidenceDescription,
        status: e.validationStatus
      }));

      const summary = await summarizePilotEvidenceWithGemini(
        pilot.name,
        pilot.durationDays,
        pilot.currentDay,
        kpis,
        evidence
      );
      res.json(summary);
    } catch (err: any) {
      console.error('[AiController.summarizeEvidence]:', err);
      res.status(500).json({ error: 'AI evidence summary failed', details: err.message });
    }
  }
};
