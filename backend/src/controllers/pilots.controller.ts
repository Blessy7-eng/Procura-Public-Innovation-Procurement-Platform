import { Request, Response } from 'express';
import { db } from '../services/db.service';
import { PilotResult } from '../types';

export const PilotsController = {
  getPilots: (_req: Request, res: Response) => {
    res.json(db.pilots);
  },

  getPilotById: (req: Request, res: Response) => {
    const { id } = req.params;
    const pilot = db.pilots.find(p => p.id === id);
    if (!pilot) {
      return res.status(404).json({ error: 'Pilot not found' });
    }
    const kpis = db.kpis.filter(k => k.pilotId === id);
    const evidence = db.evidence.filter(e => e.pilotId === id);
    const startup = db.startups.find(s => s.id === pilot.startupId);
    const challenge = db.challenges.find(c => c.id === pilot.challengeId);

    res.json({
      ...pilot,
      kpis,
      evidence,
      startup,
      challenge
    });
  },

  getKpis: (req: Request, res: Response) => {
    const { pilotId } = req.query;
    if (pilotId) {
      return res.json(db.kpis.filter(k => k.pilotId === pilotId));
    }
    res.json(db.kpis);
  },

  getEvidence: (req: Request, res: Response) => {
    const { pilotId } = req.query;
    if (pilotId) {
      return res.json(db.evidence.filter(e => e.pilotId === pilotId));
    }
    res.json(db.evidence);
  },

  addEvidence: (req: Request, res: Response) => {
    const { pilotId, evidenceTitle, evidenceDescription, metricResult, evidenceUrl, telemetryData } = req.body;
    if (!pilotId || !evidenceTitle) {
      return res.status(400).json({ error: 'Missing required evidence fields' });
    }

    const newEvidence: PilotResult = {
      id: `ev-${Date.now()}`,
      pilotId,
      submittedBy: 'EcoTrack Operator',
      evidenceTitle,
      evidenceDescription: evidenceDescription || '',
      metricResult: metricResult || '',
      evidenceUrl: evidenceUrl || 'https://raw.githubusercontent.com/datasets/municipal-sample.csv',
      validationStatus: 'pending',
      submittedAt: new Date().toISOString()
    };

    db.evidence.unshift(newEvidence);
    db.logActivity(
      'EcoTrack Operator',
      'startup',
      'pilot',
      pilotId,
      'submit_evidence',
      `Submitted pilot evidence: ${evidenceTitle}`
    );

    res.status(201).json(newEvidence);
  },

  submitScaleUpDecision: (req: Request, res: Response) => {
    const { id } = req.params;
    const { decision, notes, committeeSignOff } = req.body;

    const pilot = db.pilots.find(p => p.id === id);
    if (!pilot) {
      return res.status(404).json({ error: 'Pilot not found' });
    }

    pilot.status = decision === 'approved' ? 'scale_up_review' : 'completed';

    db.logActivity(
      'Officer Rajesh Varma',
      'government',
      'pilot',
      id,
      'scale_up_decision',
      `Scale-up Review: Pilot status set to ${pilot.status}. Notes: ${notes || 'Verified by municipal procurement committee'}`
    );

    res.json({
      success: true,
      pilot,
      scaleUpDecision: {
        decision,
        notes,
        committeeSignOff,
        decidedAt: new Date().toISOString()
      }
    });
  }
};
