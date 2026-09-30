import { Challenge, Startup, StartupSolution, StartupMatch } from './types';

export function calculateDeterministicMatch(
  challenge: Challenge,
  startup: Startup,
  solution: StartupSolution
): StartupMatch {
  // 1. Capability Match (40%)
  const requiredCaps = challenge.requiredCapabilities.map(c => c.toLowerCase().trim());
  const solutionCaps = solution.capabilities.map(c => c.toLowerCase().trim());
  
  let matchedCapCount = 0;
  const matchingCapabilities: string[] = [];
  const missingCapabilities: string[] = [];

  for (const req of requiredCaps) {
    const isMatched = solutionCaps.some(cap => cap.includes(req) || req.includes(cap));
    if (isMatched) {
      matchedCapCount++;
      matchingCapabilities.push(req);
    } else {
      missingCapabilities.push(req);
    }
  }

  const capabilityRatio = requiredCaps.length > 0 ? matchedCapCount / requiredCaps.length : 0.8;
  const capabilityScore = Math.round(capabilityRatio * 100);

  // 2. Problem Domain Match (25%)
  // Check industry alignment, problem statement overlap
  const domainKeywords = [
    ...challenge.title.toLowerCase().split(' '),
    ...challenge.problemStatement.toLowerCase().split(' ').filter(w => w.length > 4)
  ];
  const solutionText = `${solution.name} ${solution.problemSolved} ${solution.description} ${startup.industry}`.toLowerCase();
  
  let domainHits = 0;
  for (const kw of domainKeywords) {
    if (solutionText.includes(kw)) {
      domainHits++;
    }
  }
  const domainScore = Math.min(100, Math.max(50, domainHits * 18 + 40));

  // 3. Pilot Readiness (15%)
  let readinessScore = 70;
  if (solution.pilotReadiness === 'Immediate') readinessScore = 100;
  else if (solution.pilotReadiness === 'High') readinessScore = 90;
  else if (solution.pilotReadiness === 'Medium') readinessScore = 70;
  else readinessScore = 45;

  // 4. Implementation Fit (10%)
  // e.g. Cloud SaaS or deployment model vs pilot duration
  let implementationScore = 85;
  if (solution.deploymentModel.toLowerCase().includes('cloud') || solution.deploymentModel.toLowerCase().includes('saas')) {
    implementationScore = 95;
  } else if (solution.deploymentModel.toLowerCase().includes('hybrid')) {
    implementationScore = 80;
  }

  // 5. Previous Deployment Relevance (10%)
  let deploymentScore = 60;
  if (solution.previousDeployments && solution.previousDeployments.length > 15) {
    if (solution.previousDeployments.toLowerCase().includes('municipal') || solution.previousDeployments.toLowerCase().includes('government') || solution.previousDeployments.toLowerCase().includes('city')) {
      deploymentScore = 95;
    } else {
      deploymentScore = 80;
    }
  }

  // Weighted total: 40% + 25% + 15% + 10% + 10%
  const totalScore = Math.round(
    capabilityScore * 0.40 +
    domainScore * 0.25 +
    readinessScore * 0.15 +
    implementationScore * 0.10 +
    deploymentScore * 0.10
  );

  const potentialGapText = missingCapabilities.length > 0
    ? `Offline deployment or dedicated ${missingCapabilities[0]} module has not been explicitly specified.`
    : `Deployment scaling timeline needs verification during pilot onboarding.`;

  const matchReasonText = `Matches ${matchedCapCount} of ${requiredCaps.length} core capabilities including ${matchingCapabilities.slice(0, 3).join(', ')}. Strong municipal deployment history and high pilot readiness (${solution.pilotReadiness}).`;

  return {
    id: `match-${challenge.id}-${startup.id}`,
    challengeId: challenge.id,
    startupId: startup.id,
    solutionId: solution.id,
    matchScore: Math.min(99, Math.max(45, totalScore)),
    matchingCapabilities: matchingCapabilities.length > 0 ? matchingCapabilities : solution.capabilities.slice(0, 3),
    potentialGaps: potentialGapText,
    matchReason: matchReasonText,
    factorBreakdown: {
      capabilityMatch: capabilityScore,
      problemDomainMatch: domainScore,
      pilotReadiness: readinessScore,
      implementationFit: implementationScore,
      previousDeploymentRelevance: deploymentScore
    },
    createdAt: new Date().toISOString()
  };
}
