import {
  Challenge,
  Startup,
  StartupSolution,
  StartupMatch,
  Application,
  Evaluation,
  Pilot,
  PilotKPI,
  PilotResult,
  ActivityLog,
  UserRole,
  User
} from '../types';

export const api = {
  // Auth / Demo Login
  async demoLogin(role: UserRole): Promise<{ success: boolean; user: User; token: string }> {
    const res = await fetch('/api/auth/demo-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role })
    });
    return res.json();
  },

  // Challenges
  async getChallenges(): Promise<Challenge[]> {
    const res = await fetch('/api/challenges');
    return res.json();
  },

  async getChallenge(id: string): Promise<Challenge & { department: any; matches: StartupMatch[]; applications: Application[] }> {
    const res = await fetch(`/api/challenges/${id}`);
    return res.json();
  },

  async createChallenge(data: Partial<Challenge>): Promise<Challenge> {
    const res = await fetch('/api/challenges', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Startups
  async getStartups(): Promise<Startup[]> {
    const res = await fetch('/api/startups');
    return res.json();
  },

  async getStartup(id: string): Promise<Startup & { solutions: StartupSolution[] }> {
    const res = await fetch(`/api/startups/${id}`);
    return res.json();
  },

  async createStartup(data: Partial<Startup>): Promise<Startup> {
    const res = await fetch('/api/startups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Solutions
  async getSolutions(): Promise<StartupSolution[]> {
    const res = await fetch('/api/solutions');
    return res.json();
  },

  async createSolution(data: Partial<StartupSolution>): Promise<StartupSolution> {
    const res = await fetch('/api/solutions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Matches
  async getMatches(challengeId: string): Promise<StartupMatch[]> {
    const res = await fetch(`/api/matches/${challengeId}`);
    return res.json();
  },

  // Applications
  async getApplications(params?: { challengeId?: string; startupId?: string }): Promise<Application[]> {
    const query = new URLSearchParams();
    if (params?.challengeId) query.set('challengeId', params.challengeId);
    if (params?.startupId) query.set('startupId', params.startupId);
    const res = await fetch(`/api/applications?${query.toString()}`);
    return res.json();
  },

  async getApplication(id: string): Promise<Application> {
    const res = await fetch(`/api/applications/${id}`);
    return res.json();
  },

  async createApplication(data: Partial<Application>): Promise<Application> {
    const res = await fetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updateApplicationStatus(id: string, status: string, actorName?: string, role?: string): Promise<Application> {
    const res = await fetch(`/api/applications/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, actorName, role })
    });
    return res.json();
  },

  // Evaluations
  async getEvaluation(applicationId: string): Promise<Evaluation> {
    const res = await fetch(`/api/evaluations/${applicationId}`);
    return res.json();
  },

  async submitEvaluation(data: {
    applicationId: string;
    problemFit: number;
    technicalFeasibility: number;
    innovation: number;
    scalability: number;
    costEffectiveness: number;
    notes?: string;
    shortlistForPilot?: boolean;
  }): Promise<{ evaluation: Evaluation; application: Application }> {
    const res = await fetch('/api/evaluations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Pilots
  async getPilots(): Promise<Pilot[]> {
    const res = await fetch('/api/pilots');
    return res.json();
  },

  async getPilot(id: string): Promise<Pilot> {
    const res = await fetch(`/api/pilots/${id}`);
    return res.json();
  },

  async createPilot(data: any): Promise<Pilot> {
    const res = await fetch('/api/pilots', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updatePilot(id: string, data: Partial<Pilot>): Promise<Pilot> {
    const res = await fetch(`/api/pilots/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Evidence
  async getEvidence(pilotId: string): Promise<PilotResult[]> {
    const res = await fetch(`/api/evidence/${pilotId}`);
    return res.json();
  },

  async submitEvidence(data: Partial<PilotResult>): Promise<PilotResult> {
    const res = await fetch('/api/evidence', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async validateEvidence(id: string, data: { validationStatus: string; evaluatorNotes?: string; actorName?: string }): Promise<PilotResult> {
    const res = await fetch(`/api/evidence/${id}/validate`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Activity
  async getActivityLogs(entityId?: string): Promise<ActivityLog[]> {
    const url = entityId ? `/api/activity?entityId=${entityId}` : '/api/activity';
    const res = await fetch(url);
    return res.json();
  },

  // AI Gemini Endpoints
  async structureChallenge(problemDescription: string): Promise<{
    title: string;
    problemStatement: string;
    targetUsers: string[];
    expectedOutcomes: string[];
    requiredCapabilities: string[];
    suggestedKPIs: string[];
    pilotConsiderations: string[];
  }> {
    const res = await fetch('/api/ai/structure-challenge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ problemDescription })
    });
    return res.json();
  },

  async explainMatch(challengeId: string, startupId: string): Promise<{
    whyMatched: string;
    keyStrengths: string[];
    potentialGaps: string;
    recommendation: string;
  }> {
    const res = await fetch('/api/ai/match-explanation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ challengeId, startupId })
    });
    return res.json();
  },

  async summarizePilot(pilotId: string): Promise<{
    summary: string;
    achievedKPIs: string[];
    unmetKPIs: string[];
    areasForAttention: string[];
  }> {
    const res = await fetch('/api/ai/pilot-summary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pilotId })
    });
    return res.json();
  },

  // Reset demo
  async resetDemo(): Promise<{ success: boolean; message: string }> {
    const res = await fetch('/api/reset-demo', { method: 'POST' });
    return res.json();
  }
};
