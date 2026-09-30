import { Request, Response } from 'express';
import { db } from '../services/db.service';
import { Application, Evaluation } from '../types';

export const EvaluationsController = {
  getApplications: (_req: Request, res: Response) => {
    res.json(db.applications);
  },

  createApplication: (req: Request, res: Response) => {
    const { challengeId, startupId, solutionId, proposedApproach, proposedTimeline, proposedCost, expectedImpact } = req.body;
    if (!challengeId || !startupId || !solutionId) {
      return res.status(400).json({ error: 'Missing required application fields' });
    }

    const newApp: Application = {
      id: `app-${Date.now()}`,
      challengeId,
      startupId,
      solutionId,
      proposedApproach: proposedApproach || 'Submission proposal for municipal challenge',
      proposedTimeline: proposedTimeline || '90 days',
      proposedCost: proposedCost || '₹8,50,000',
      expectedImpact: expectedImpact || 'Reduction in turnaround time',
      status: 'submitted',
      submittedAt: new Date().toISOString()
    };

    db.applications.unshift(newApp);
    db.logActivity('Aarav Sharma', 'startup', 'application', newApp.id, 'apply', `Submitted application for challenge ${challengeId}`);

    res.status(201).json(newApp);
  },

  submitEvaluation: (req: Request, res: Response) => {
    const { applicationId, evaluatorId, problemFit, technicalFeasibility, innovation, scalability, costEffectiveness, notes, shortlistForPilot } = req.body;
    if (!applicationId) {
      return res.status(400).json({ error: 'Missing required evaluation fields' });
    }

    const pFit = Number(problemFit) || 85;
    const tFeas = Number(technicalFeasibility) || 85;
    const innov = Number(innovation) || 80;
    const scale = Number(scalability) || 80;
    const costEff = Number(costEffectiveness) || 85;

    const totalScore = Math.round(
      pFit * 0.25 + tFeas * 0.25 + innov * 0.2 + scale * 0.15 + costEff * 0.15
    );

    const newEval: Evaluation = {
      id: `eval-${Date.now()}`,
      applicationId,
      evaluatorId: evaluatorId || 'usr-eval-1',
      problemFit: pFit,
      technicalFeasibility: tFeas,
      innovation: innov,
      scalability: scale,
      costEffectiveness: costEff,
      totalScore,
      notes: notes || 'Proposal meets technical standards with verified sandbox capability',
      createdAt: new Date().toISOString()
    };

    db.evaluations.unshift(newEval);

    const app = db.applications.find(a => a.id === applicationId);
    if (app) {
      app.status = shortlistForPilot ? 'shortlisted' : 'under_evaluation';
    }

    db.logActivity('Dr. Priya Sundaram', 'evaluator', 'evaluation', newEval.id, 'score', `Evaluated application with score ${totalScore}/100`);

    res.status(201).json(newEval);
  }
};
