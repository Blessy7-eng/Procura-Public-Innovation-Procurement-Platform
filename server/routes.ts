import { Router, Request, Response } from 'express';
import { db } from './db';
import { calculateDeterministicMatch } from './matching';
import {
  structureChallengeWithGemini,
  explainStartupMatchWithGemini,
  summarizePilotEvidenceWithGemini
} from './gemini';
import { ApplicationStatus, Challenge, Pilot, StartupSolution, Evaluation, PilotResult, PilotKPI } from './types';

export const apiRouter = Router();

// 1. AUTH / DEMO LOGIN
apiRouter.post('/auth/demo-login', (req: Request, res: Response) => {
  const { role } = req.body;
  const user = db.users.find(u => u.role === role) || db.users[0];
  res.json({
    success: true,
    user,
    token: `demo-token-${user.id}`
  });
});

// 2. CHALLENGES
apiRouter.get('/challenges', (req: Request, res: Response) => {
  res.json(db.challenges);
});

apiRouter.post('/challenges', (req: Request, res: Response) => {
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

  // Recalculate matches for all existing startups
  for (const st of db.startups) {
    const sol = db.solutions.find(s => s.startupId === st.id) || db.solutions[0];
    if (sol) {
      const match = calculateDeterministicMatch(newChallenge, st, sol);
      db.matches.push(match);
    }
  }

  db.logActivity(
    'Officer Rajesh Varma',
    'government',
    'challenge',
    newChallenge.id,
    'Challenge Created',
    `Published challenge: "${newChallenge.title}" with ${newChallenge.requiredCapabilities.length} required capabilities.`
  );

  res.status(201).json(newChallenge);
});

apiRouter.get('/challenges/:id', (req: Request, res: Response) => {
  const challenge = db.challenges.find(c => c.id === req.params.id);
  if (!challenge) {
    return res.status(404).json({ error: 'Challenge not found' });
  }
  const department = db.departments.find(d => d.id === challenge.departmentId);
  const challengeMatches = db.matches.filter(m => m.challengeId === challenge.id);
  const challengeApplications = db.applications.filter(a => a.challengeId === challenge.id);
  res.json({
    ...challenge,
    department,
    matches: challengeMatches,
    applications: challengeApplications
  });
});

apiRouter.put('/challenges/:id', (req: Request, res: Response) => {
  const challenge = db.challenges.find(c => c.id === req.params.id);
  if (!challenge) {
    return res.status(404).json({ error: 'Challenge not found' });
  }
  Object.assign(challenge, req.body);
  res.json(challenge);
});

// 3. STARTUPS
apiRouter.get('/startups', (req: Request, res: Response) => {
  res.json(db.startups);
});

apiRouter.get('/startups/:id', (req: Request, res: Response) => {
  const startup = db.startups.find(s => s.id === req.params.id);
  if (!startup) {
    return res.status(404).json({ error: 'Startup not found' });
  }
  const solutions = db.solutions.filter(s => s.startupId === startup.id);
  res.json({ ...startup, solutions });
});

apiRouter.post('/startups', (req: Request, res: Response) => {
  const { name, founderName, email, website, location, industry, teamSize, startupRecognition, description, technologies } = req.body;
  if (!name || !description) {
    return res.status(400).json({ error: 'Name and description are required' });
  }
  const newStartup = {
    id: `st-${Date.now()}`,
    name,
    description,
    website: website || '',
    location: location || 'City',
    founderName: founderName || 'Founder',
    teamSize: teamSize || '10-20',
    industry: industry || 'GovTech',
    technologies: Array.isArray(technologies) ? technologies : ['Web', 'Cloud'],
    startupRecognition: startupRecognition || 'Self-Registered',
    verificationStatus: 'verified' as const,
    profileCompleteness: 75,
    createdAt: new Date().toISOString()
  };
  db.startups.push(newStartup);
  db.logActivity(
    founderName || name,
    'startup',
    'startup',
    newStartup.id,
    'Startup Registered',
    `Registered startup profile for ${name}`
  );
  res.status(201).json(newStartup);
});

apiRouter.put('/startups/:id', (req: Request, res: Response) => {
  const startup = db.startups.find(s => s.id === req.params.id);
  if (!startup) {
    return res.status(404).json({ error: 'Startup not found' });
  }
  Object.assign(startup, req.body);
  res.json(startup);
});

// 4. SOLUTIONS
apiRouter.get('/solutions', (req: Request, res: Response) => {
  res.json(db.solutions);
});

apiRouter.post('/solutions', (req: Request, res: Response) => {
  const {
    startupId,
    name,
    problemSolved,
    description,
    capabilities,
    technology,
    deploymentModel,
    implementationTime,
    estimatedCost,
    previousDeployments,
    pilotReadiness
  } = req.body;

  if (!name || !description) {
    return res.status(400).json({ error: 'Solution name and description are required' });
  }

  const newSolution: StartupSolution = {
    id: `sol-${Date.now()}`,
    startupId: startupId || 'st-ecotrack',
    name,
    description,
    problemSolved: problemSolved || 'Municipal operational challenge',
    capabilities: Array.isArray(capabilities) ? capabilities : (capabilities ? [capabilities] : ['Municipal workflow', 'Citizen platform']),
    technology: technology || 'Cloud SaaS',
    deploymentModel: deploymentModel || 'Cloud SaaS',
    implementationTime: implementationTime || '14 days',
    estimatedCost: estimatedCost || '$4,000 for 90 days',
    previousDeployments: previousDeployments || 'Municipal pilots',
    pilotReadiness: pilotReadiness || 'Immediate',
    status: 'active',
    createdAt: new Date().toISOString()
  };

  db.solutions.push(newSolution);

  // Recalculate matches for challenges
  const startup = db.startups.find(s => s.id === newSolution.startupId) || db.startups[0];
  for (const challenge of db.challenges) {
    const match = calculateDeterministicMatch(challenge, startup, newSolution);
    db.matches.push(match);
  }

  db.logActivity(
    startup.name,
    'startup',
    'solution',
    newSolution.id,
    'Solution Added',
    `Published solution "${newSolution.name}"`
  );

  res.status(201).json(newSolution);
});

// 5. MATCHES
apiRouter.get('/matches/:challengeId', (req: Request, res: Response) => {
  const challengeId = req.params.challengeId;
  const challenge = db.challenges.find(c => c.id === challengeId);
  if (!challenge) {
    return res.status(404).json({ error: 'Challenge not found' });
  }

  // Get or compute matches
  let challengeMatches = db.matches.filter(m => m.challengeId === challengeId);
  if (challengeMatches.length === 0) {
    challengeMatches = db.startups.map(st => {
      const sol = db.solutions.find(s => s.startupId === st.id) || db.solutions[0];
      return calculateDeterministicMatch(challenge, st, sol);
    });
    db.matches.push(...challengeMatches);
  }

  // Attach enriched startup and solution details
  const enriched = challengeMatches
    .map(match => {
      const startup = db.startups.find(s => s.id === match.startupId);
      const solution = db.solutions.find(s => s.id === match.solutionId);
      return {
        ...match,
        startup,
        solution
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore);

  res.json(enriched);
});

// 6. APPLICATIONS
apiRouter.get('/applications', (req: Request, res: Response) => {
  const { challengeId, startupId } = req.query;
  let apps = [...db.applications];
  if (challengeId) {
    apps = apps.filter(a => a.challengeId === challengeId);
  }
  if (startupId) {
    apps = apps.filter(a => a.startupId === startupId);
  }
  const enriched = apps.map(app => {
    const challenge = db.challenges.find(c => c.id === app.challengeId);
    const startup = db.startups.find(s => s.id === app.startupId);
    const solution = db.solutions.find(s => s.id === app.solutionId);
    const evaluation = db.evaluations.find(e => e.applicationId === app.id);
    return {
      ...app,
      challenge,
      startup,
      solution,
      evaluation
    };
  });
  res.json(enriched);
});

apiRouter.post('/applications', (req: Request, res: Response) => {
  const {
    challengeId,
    startupId,
    solutionId,
    proposedApproach,
    proposedTimeline,
    proposedCost,
    expectedImpact
  } = req.body;

  if (!challengeId || !startupId || !proposedApproach) {
    return res.status(400).json({ error: 'Missing required application fields' });
  }

  const newApp = {
    id: `app-${Date.now()}`,
    challengeId,
    startupId,
    solutionId: solutionId || db.solutions.find(s => s.startupId === startupId)?.id || 'sol-ecotrack-1',
    proposedApproach,
    proposedTimeline: proposedTimeline || '90 days (14d setup, 60d live, 16d evaluation)',
    proposedCost: proposedCost || '$4,500',
    expectedImpact: expectedImpact || 'Proven reduction in citizen grievance turnaround',
    status: 'submitted' as ApplicationStatus,
    submittedAt: new Date().toISOString()
  };

  db.applications.push(newApp);

  const startup = db.startups.find(s => s.id === startupId);
  const challenge = db.challenges.find(c => c.id === challengeId);

  db.logActivity(
    startup?.founderName || 'Startup Founder',
    'startup',
    'application',
    newApp.id,
    'Application Submitted',
    `${startup?.name || 'Startup'} submitted proposal for "${challenge?.title || 'Challenge'}"`
  );

  res.status(201).json(newApp);
});

apiRouter.get('/applications/:id', (req: Request, res: Response) => {
  const app = db.applications.find(a => a.id === req.params.id);
  if (!app) {
    return res.status(404).json({ error: 'Application not found' });
  }
  const challenge = db.challenges.find(c => c.id === app.challengeId);
  const startup = db.startups.find(s => s.id === app.startupId);
  const solution = db.solutions.find(s => s.id === app.solutionId);
  const evaluation = db.evaluations.find(e => e.applicationId === app.id);
  res.json({ ...app, challenge, startup, solution, evaluation });
});

apiRouter.put('/applications/:id/status', (req: Request, res: Response) => {
  const app = db.applications.find(a => a.id === req.params.id);
  if (!app) {
    return res.status(404).json({ error: 'Application not found' });
  }
  const { status, actorName, role } = req.body;
  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }
  app.status = status;

  db.logActivity(
    actorName || 'Evaluator / Officer',
    role || 'evaluator',
    'application',
    app.id,
    'Status Updated',
    `Application status changed to ${status.replace('_', ' ').toUpperCase()}`
  );

  res.json(app);
});

// 7. EVALUATIONS
apiRouter.get('/evaluations/:applicationId', (req: Request, res: Response) => {
  const evaluation = db.evaluations.find(e => e.applicationId === req.params.applicationId);
  if (!evaluation) {
    return res.status(404).json({ error: 'Evaluation not found' });
  }
  res.json(evaluation);
});

apiRouter.post('/evaluations', (req: Request, res: Response) => {
  const {
    applicationId,
    problemFit,
    technicalFeasibility,
    innovation,
    scalability,
    costEffectiveness,
    notes,
    shortlistForPilot
  } = req.body;

  const app = db.applications.find(a => a.id === applicationId);
  if (!app) {
    return res.status(404).json({ error: 'Application not found' });
  }

  const pFit = Number(problemFit) || 80;
  const tFeas = Number(technicalFeasibility) || 80;
  const innov = Number(innovation) || 80;
  const scale = Number(scalability) || 80;
  const costEff = Number(costEffectiveness) || 80;

  // Weighted calculation:
  // Problem Fit 30%, Tech Feas 25%, Innovation 15%, Scalability 15%, Cost 15%
  const totalScore = Number(
    (pFit * 0.3 + tFeas * 0.25 + innov * 0.15 + scale * 0.15 + costEff * 0.15).toFixed(1)
  );

  let evaluation = db.evaluations.find(e => e.applicationId === applicationId);
  if (evaluation) {
    evaluation.problemFit = pFit;
    evaluation.technicalFeasibility = tFeas;
    evaluation.innovation = innov;
    evaluation.scalability = scale;
    evaluation.costEffectiveness = costEff;
    evaluation.totalScore = totalScore;
    evaluation.notes = notes || evaluation.notes;
  } else {
    evaluation = {
      id: `eval-${Date.now()}`,
      applicationId,
      evaluatorId: 'usr-eval-1',
      problemFit: pFit,
      technicalFeasibility: tFeas,
      innovation: innov,
      scalability: scale,
      costEffectiveness: costEff,
      totalScore,
      notes: notes || 'Proposal evaluated against 5 transparent procurement criteria.',
      createdAt: new Date().toISOString()
    };
    db.evaluations.push(evaluation);
  }

  if (shortlistForPilot) {
    app.status = 'shortlisted';
  } else if (app.status === 'submitted' || app.status === 'under_evaluation') {
    app.status = 'under_evaluation';
  }

  db.logActivity(
    'Dr. Priya Sundaram',
    'evaluator',
    'evaluation',
    evaluation.id,
    'Evaluation Completed',
    `Scored application at ${totalScore}/100. ${shortlistForPilot ? 'Shortlisted for controlled pilot.' : ''}`
  );

  res.json({ evaluation, application: app });
});

// 8. PILOTS
apiRouter.get('/pilots', (req: Request, res: Response) => {
  const enriched = db.pilots.map(pilot => {
    const challenge = db.challenges.find(c => c.id === pilot.challengeId);
    const startup = db.startups.find(s => s.id === pilot.startupId);
    const solution = db.solutions.find(s => s.id === pilot.solutionId);
    const pilotKpis = db.kpis.filter(k => k.pilotId === pilot.id);
    const pilotEvidence = db.evidence.filter(e => e.pilotId === pilot.id);
    return {
      ...pilot,
      challenge,
      startup,
      solution,
      kpis: pilotKpis,
      evidence: pilotEvidence
    };
  });
  res.json(enriched);
});

apiRouter.get('/pilots/:id', (req: Request, res: Response) => {
  const pilot = db.pilots.find(p => p.id === req.params.id);
  if (!pilot) {
    return res.status(404).json({ error: 'Pilot not found' });
  }
  const challenge = db.challenges.find(c => c.id === pilot.challengeId);
  const startup = db.startups.find(s => s.id === pilot.startupId);
  const solution = db.solutions.find(s => s.id === pilot.solutionId);
  const pilotKpis = db.kpis.filter(k => k.pilotId === pilot.id);
  const pilotEvidence = db.evidence.filter(e => e.pilotId === pilot.id);
  res.json({
    ...pilot,
    challenge,
    startup,
    solution,
    kpis: pilotKpis,
    evidence: pilotEvidence
  });
});

apiRouter.post('/pilots', (req: Request, res: Response) => {
  const {
    challengeId,
    startupId,
    solutionId,
    applicationId,
    name,
    durationDays,
    pilotArea,
    targetUsers,
    objectives,
    initialKPIs
  } = req.body;

  const duration = Number(durationDays) || 90;
  const startDate = new Date();
  const endDate = new Date(startDate.getTime() + duration * 24 * 60 * 60 * 1000);

  const newPilot: Pilot = {
    id: `plt-${Date.now()}`,
    challengeId: challengeId || 'ch-waste-1',
    startupId: startupId || 'st-ecotrack',
    solutionId: solutionId || 'sol-ecotrack-1',
    applicationId: applicationId || 'app-ecotrack-1',
    name: name || 'Municipal Innovation Controlled Pilot',
    durationDays: duration,
    pilotArea: pilotArea || 'Ward 12',
    targetUsers: targetUsers || '5,000 citizens',
    objectives: objectives || 'Verify grievance resolution and citizen satisfaction metrics',
    status: 'running',
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
    currentDay: 1,
    overallKpiAchievement: 85,
    createdAt: new Date().toISOString()
  };

  db.pilots.push(newPilot);

  // Add KPIs
  if (Array.isArray(initialKPIs) && initialKPIs.length > 0) {
    for (const k of initialKPIs) {
      db.kpis.push({
        id: `kpi-${Date.now()}-${Math.floor(Math.random() * 100)}`,
        pilotId: newPilot.id,
        name: k.name || 'Resolution Time',
        baselineValue: k.baselineValue || '72h',
        targetValue: k.targetValue || '<24h',
        currentValue: k.currentValue || '36h',
        unit: k.unit || 'hours',
        status: 'on_track'
      });
    }
  }

  // Update application status
  if (applicationId) {
    const app = db.applications.find(a => a.id === applicationId);
    if (app) {
      app.status = 'pilot_selected';
    }
  }

  db.logActivity(
    'Officer Rajesh Varma',
    'government',
    'pilot',
    newPilot.id,
    'Pilot Approved',
    `Approved and launched ${duration}-day controlled pilot in ${pilotArea || 'Ward 12'}`
  );

  res.status(201).json(newPilot);
});

apiRouter.put('/pilots/:id', (req: Request, res: Response) => {
  const pilot = db.pilots.find(p => p.id === req.params.id);
  if (!pilot) {
    return res.status(404).json({ error: 'Pilot not found' });
  }
  Object.assign(pilot, req.body);

  if (req.body.status) {
    db.logActivity(
      'Officer Rajesh Varma',
      'government',
      'pilot',
      pilot.id,
      'Pilot Status Changed',
      `Pilot "${pilot.name}" transitioned to ${req.body.status.replace('_', ' ').toUpperCase()}`
    );
  }

  res.json(pilot);
});

// 9. KPIS
apiRouter.post('/pilots/:id/kpis', (req: Request, res: Response) => {
  const { name, baselineValue, targetValue, currentValue, unit, status } = req.body;
  const newKpi: PilotKPI = {
    id: `kpi-${Date.now()}`,
    pilotId: req.params.id,
    name: name || 'New KPI',
    baselineValue: baselineValue || '0',
    targetValue: targetValue || '100',
    currentValue: currentValue || '0',
    unit: unit || '%',
    status: status || 'on_track'
  };
  db.kpis.push(newKpi);
  res.status(201).json(newKpi);
});

apiRouter.put('/pilots/:id/kpis/:kpiId', (req: Request, res: Response) => {
  const kpi = db.kpis.find(k => k.id === req.params.kpiId && k.pilotId === req.params.id);
  if (!kpi) {
    return res.status(404).json({ error: 'KPI not found' });
  }
  Object.assign(kpi, req.body);
  res.json(kpi);
});

// 10. EVIDENCE
apiRouter.get('/evidence/:pilotId', (req: Request, res: Response) => {
  const results = db.evidence.filter(e => e.pilotId === req.params.pilotId);
  res.json(results);
});

apiRouter.post('/evidence', (req: Request, res: Response) => {
  const {
    pilotId,
    submittedBy,
    evidenceTitle,
    evidenceDescription,
    metricResult,
    evidenceUrl
  } = req.body;

  if (!evidenceTitle || !evidenceDescription) {
    return res.status(400).json({ error: 'Evidence title and description are required' });
  }

  const newEvidence: PilotResult = {
    id: `ev-${Date.now()}`,
    pilotId: pilotId || 'plt-waste-1',
    submittedBy: submittedBy || 'Aarav Sharma (EcoTrack)',
    evidenceTitle,
    evidenceDescription,
    metricResult: metricResult || '',
    evidenceUrl: evidenceUrl || 'https://procura.gov.in/docs/uploaded-evidence.pdf',
    validationStatus: 'pending',
    submittedAt: new Date().toISOString()
  };

  db.evidence.push(newEvidence);

  db.logActivity(
    submittedBy || 'Startup Lead',
    'startup',
    'evidence',
    newEvidence.id,
    'Pilot Evidence Submitted',
    `Submitted pilot evidence: "${evidenceTitle}" with metric: ${metricResult || 'N/A'}`
  );

  res.status(201).json(newEvidence);
});

apiRouter.put('/evidence/:id/validate', (req: Request, res: Response) => {
  const evidenceItem = db.evidence.find(e => e.id === req.params.id);
  if (!evidenceItem) {
    return res.status(404).json({ error: 'Evidence item not found' });
  }

  const { validationStatus, evaluatorNotes, actorName } = req.body;
  evidenceItem.validationStatus = validationStatus || 'validated';
  if (evaluatorNotes) {
    evidenceItem.evaluatorNotes = evaluatorNotes;
  }

  db.logActivity(
    actorName || 'Dr. Priya Sundaram',
    'evaluator',
    'evidence',
    evidenceItem.id,
    'Evidence Validated',
    `Evidence "${evidenceItem.evidenceTitle}" marked as ${evidenceItem.validationStatus.replace('_', ' ').toUpperCase()}`
  );

  res.json(evidenceItem);
});

// 11. ACTIVITY LOGS (AUDIT TRAIL)
apiRouter.get('/activity', (req: Request, res: Response) => {
  const { entityId } = req.query;
  if (entityId) {
    const filtered = db.activityLogs.filter(a => a.entityId === entityId);
    return res.json(filtered);
  }
  res.json(db.activityLogs);
});

// 12. AI ROUTES (GEMINI)
apiRouter.post('/ai/structure-challenge', async (req: Request, res: Response) => {
  const { problemDescription } = req.body;
  if (!problemDescription) {
    return res.status(400).json({ error: 'Problem description is required' });
  }
  const structured = await structureChallengeWithGemini(problemDescription);
  res.json(structured);
});

apiRouter.post('/ai/match-explanation', async (req: Request, res: Response) => {
  const { challengeId, startupId } = req.body;
  const challenge = db.challenges.find(c => c.id === challengeId) || db.challenges[0];
  const startup = db.startups.find(s => s.id === startupId) || db.startups[0];
  const solution = db.solutions.find(s => s.startupId === startup.id) || db.solutions[0];
  const match = db.matches.find(m => m.challengeId === challenge.id && m.startupId === startup.id);
  const score = match ? match.matchScore : 92;

  const explanation = await explainStartupMatchWithGemini(
    challenge.title,
    challenge.requiredCapabilities,
    startup.name,
    solution.name,
    solution.capabilities,
    score
  );
  res.json(explanation);
});

apiRouter.post('/ai/pilot-summary', async (req: Request, res: Response) => {
  const { pilotId } = req.body;
  const pilot = db.pilots.find(p => p.id === pilotId) || db.pilots[0];
  const kpis = db.kpis.filter(k => k.pilotId === pilot.id).map(k => ({
    name: k.name,
    baseline: k.baselineValue,
    target: k.targetValue,
    current: k.currentValue,
    status: k.status
  }));
  const evidenceList = db.evidence.filter(e => e.pilotId === pilot.id).map(e => ({
    title: e.evidenceTitle,
    description: e.evidenceDescription,
    status: e.validationStatus
  }));

  const summary = await summarizePilotEvidenceWithGemini(
    pilot.name,
    pilot.durationDays,
    pilot.currentDay,
    kpis,
    evidenceList
  );

  pilot.aiSummary = summary;
  res.json(summary);
});

// 13. DEMO RESET
apiRouter.post('/reset-demo', (req: Request, res: Response) => {
  db.seedDefaultData();
  res.json({ success: true, message: 'Demo data reset to default state' });
});
