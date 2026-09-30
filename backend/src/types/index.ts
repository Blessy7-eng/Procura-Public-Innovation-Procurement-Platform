export type UserRole = 'government' | 'startup' | 'evaluator';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organizationId?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Department {
  id: string;
  name: string;
  departmentType: string;
  location: string;
  description: string;
  createdAt: string;
}

export interface Startup {
  id: string;
  name: string;
  logoUrl?: string;
  description: string;
  website?: string;
  location: string;
  founderName: string;
  teamSize: string;
  industry: string;
  technologies: string[];
  startupRecognition?: string;
  verificationStatus: 'verified' | 'pending' | 'rejected';
  profileCompleteness: number;
  createdAt: string;
}

export interface StartupSolution {
  id: string;
  startupId: string;
  name: string;
  description: string;
  problemSolved: string;
  capabilities: string[];
  technology: string;
  deploymentModel: string;
  implementationTime: string;
  estimatedCost: string;
  previousDeployments: string;
  pilotReadiness: 'Low' | 'Medium' | 'High' | 'Immediate';
  status: 'draft' | 'active' | 'archived';
  createdAt: string;
}

export interface StartupDocument {
  id: string;
  startupId: string;
  solutionId?: string;
  documentName: string;
  documentType: string;
  documentUrl: string;
  uploadedAt: string;
}

export interface Challenge {
  id: string;
  departmentId: string;
  createdBy?: string;
  title: string;
  problemStatement: string;
  targetUsers: string[];
  expectedOutcomes: string[];
  requiredCapabilities: string[];
  eligibilityRequirements: string[];
  suggestedKPIs: string[];
  pilotDuration: string;
  status: 'draft' | 'published' | 'evaluation' | 'pilot_active' | 'closed';
  createdAt: string;
}

export interface StartupMatch {
  id: string;
  challengeId: string;
  startupId: string;
  solutionId: string;
  matchScore: number;
  matchingCapabilities: string[];
  potentialGaps: string;
  matchReason: string;
  factorBreakdown: {
    capabilityMatch: number;
    problemDomainMatch: number;
    pilotReadiness: number;
    implementationFit: number;
    previousDeploymentRelevance: number;
  };
  createdAt: string;
}

export type ApplicationStatus =
  | 'submitted'
  | 'eligibility_review'
  | 'under_evaluation'
  | 'shortlisted'
  | 'rejected'
  | 'pilot_selected';

export interface Application {
  id: string;
  challengeId: string;
  startupId: string;
  solutionId: string;
  proposedApproach: string;
  proposedTimeline: string;
  proposedCost: string;
  expectedImpact: string;
  status: ApplicationStatus;
  submittedAt: string;
}

export interface Evaluation {
  id: string;
  applicationId: string;
  evaluatorId?: string;
  problemFit: number;
  technicalFeasibility: number;
  innovation: number;
  scalability: number;
  costEffectiveness: number;
  totalScore: number;
  notes: string;
  createdAt: string;
}

export interface PilotKPI {
  id: string;
  pilotId: string;
  name: string;
  baselineValue: string;
  targetValue: string;
  currentValue: string;
  unit: string;
  status: 'on_track' | 'achieved' | 'at_risk' | 'missed';
  trendData?: { label: string; value: number }[];
}

export interface Pilot {
  id: string;
  challengeId: string;
  startupId: string;
  solutionId: string;
  applicationId?: string;
  name: string;
  durationDays: number;
  pilotArea: string;
  targetUsers: string;
  objectives: string;
  status: 'planned' | 'running' | 'completed' | 'scale_up_review' | 'closed';
  startDate: string;
  endDate: string;
  currentDay: number;
  overallKpiAchievement: number;
  aiSummary?: {
    summary: string;
    achievedKPIs: string[];
    unmetKPIs: string[];
    areasForAttention: string[];
  };
  createdAt: string;
}

export interface PilotResult {
  id: string;
  pilotId: string;
  submittedBy: string;
  evidenceTitle: string;
  evidenceDescription: string;
  metricResult?: string;
  evidenceUrl?: string;
  validationStatus: 'pending' | 'validated' | 'needs_clarification' | 'rejected';
  evaluatorNotes?: string;
  submittedAt: string;
}

export interface ActivityLog {
  id: string;
  userId?: string;
  actorName: string;
  role: UserRole;
  entityType: string;
  entityId: string;
  action: string;
  description: string;
  createdAt: string;
}
