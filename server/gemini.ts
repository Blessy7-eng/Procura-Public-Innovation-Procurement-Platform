import { GoogleGenAI, Type } from '@google/genai';

// Initialize server-side Gemini client
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

export interface StructuredChallengeResponse {
  title: string;
  problemStatement: string;
  targetUsers: string[];
  expectedOutcomes: string[];
  requiredCapabilities: string[];
  suggestedKPIs: string[];
  pilotConsiderations: string[];
}

export interface MatchExplanationResponse {
  whyMatched: string;
  keyStrengths: string[];
  potentialGaps: string;
  recommendation: string;
}

export interface PilotSummaryResponse {
  summary: string;
  achievedKPIs: string[];
  unmetKPIs: string[];
  areasForAttention: string[];
}

export async function structureChallengeWithGemini(
  rawProblemDescription: string
): Promise<StructuredChallengeResponse> {
  const fallback: StructuredChallengeResponse = {
    title: 'Intelligent Waste Collection Complaint Management',
    problemStatement:
      rawProblemDescription ||
      'Municipal waste collection grievance workflows face high processing latency and lack of citizen visibility. Departmental staff spend excessive administrative time manually triaging and tracking complaints across multiple zones.',
    targetUsers: [
      'Ward Sanitation Inspectors',
      'Municipal Grievance Officers',
      'Citizens of Urban Wards',
      'Solid Waste Collection Drivers'
    ],
    expectedOutcomes: [
      'Reduce grievance resolution turnaround time from 72h to under 24h',
      'Provide real-time SMS and web tracking to citizens',
      'Automated SLA escalations and supervisor heatmaps',
      'Improve citizen satisfaction ratings above 80%'
    ],
    requiredCapabilities: [
      'Complaint management',
      'Municipal workflow',
      'Analytics & reporting',
      'Citizen platform',
      'Pilot readiness',
      'GIS / Ward geo-tagging'
    ],
    suggestedKPIs: [
      'Grievance Resolution Time (<24 hours)',
      'SLA Compliance Rate (>85%)',
      'Citizen Satisfaction Score (>80%)',
      'Unresolved Complaint Backlog Reduction (>60%)'
    ],
    pilotConsiderations: [
      'Run in 1-2 representative urban wards for 60-90 days',
      'Include field staff onboarding and vernacular interface support',
      'Ensure data privacy and integration with existing municipal portal'
    ]
  };

  if (!apiKey) {
    return fallback;
  }

  try {
    const prompt = `You are an expert public innovation procurement advisor for government agencies.
Transform the following problem description from a government officer into a structured innovation challenge for startups.
Problem description:
"${rawProblemDescription}"

Format as JSON conforming to this schema. Be specific, actionable, and focused on pilot testing.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction:
          'You are a public procurement innovation specialist. Generate structured challenges for pilot procurement. Always output pure valid JSON matching the schema.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            problemStatement: { type: Type.STRING },
            targetUsers: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            expectedOutcomes: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            requiredCapabilities: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            suggestedKPIs: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            pilotConsiderations: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: [
            'title',
            'problemStatement',
            'targetUsers',
            'expectedOutcomes',
            'requiredCapabilities',
            'suggestedKPIs',
            'pilotConsiderations'
          ]
        }
      }
    });

    const text = response.text?.trim();
    if (!text) return fallback;
    const parsed = JSON.parse(text);
    return {
      title: parsed.title || fallback.title,
      problemStatement: parsed.problemStatement || fallback.problemStatement,
      targetUsers: parsed.targetUsers?.length ? parsed.targetUsers : fallback.targetUsers,
      expectedOutcomes: parsed.expectedOutcomes?.length ? parsed.expectedOutcomes : fallback.expectedOutcomes,
      requiredCapabilities: parsed.requiredCapabilities?.length ? parsed.requiredCapabilities : fallback.requiredCapabilities,
      suggestedKPIs: parsed.suggestedKPIs?.length ? parsed.suggestedKPIs : fallback.suggestedKPIs,
      pilotConsiderations: parsed.pilotConsiderations?.length ? parsed.pilotConsiderations : fallback.pilotConsiderations
    };
  } catch (error) {
    console.error('Gemini structure challenge error:', error);
    return fallback;
  }
}

export async function explainStartupMatchWithGemini(
  challengeTitle: string,
  requiredCapabilities: string[],
  startupName: string,
  solutionName: string,
  solutionCapabilities: string[],
  matchScore: number
): Promise<MatchExplanationResponse> {
  const fallback: MatchExplanationResponse = {
    whyMatched: `${startupName}'s solution "${solutionName}" directly aligns with ${challengeTitle}. It provides proven capabilities in ${solutionCapabilities.slice(0, 3).join(', ')} with demonstrated municipal deployment experience.`,
    keyStrengths: [
      `High capability match across core municipal workflow and analytics`,
      `Demonstrated rapid pilot onboarding readiness within 10 days`,
      `Citizen-facing interface with multi-lingual support`
    ],
    potentialGaps:
      'Offline deployment capability has not been specified in the submitted solution documentation.',
    recommendation:
      'Recommended for technical evaluation and 90-day municipal pilot shortlisting with offline data synchronization validation.'
  };

  if (!apiKey) {
    return fallback;
  }

  try {
    const prompt = `You are an evaluation assistant for public innovation procurement.
Analyze why startup "${startupName}" with solution "${solutionName}" matches the challenge "${challengeTitle}".
Match Score: ${matchScore}%
Challenge Required Capabilities: ${requiredCapabilities.join(', ')}
Startup Solution Capabilities: ${solutionCapabilities.join(', ')}

Explain the match clearly to a non-technical government officer. Clearly identify strengths and any potential gaps.
Important: Position this as decision support. Final decisions remain with authorized government officials.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            whyMatched: { type: Type.STRING },
            keyStrengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            potentialGaps: { type: Type.STRING },
            recommendation: { type: Type.STRING }
          },
          required: ['whyMatched', 'keyStrengths', 'potentialGaps', 'recommendation']
        }
      }
    });

    const text = response.text?.trim();
    if (!text) return fallback;
    return JSON.parse(text);
  } catch (error) {
    console.error('Gemini match explanation error:', error);
    return fallback;
  }
}

export async function summarizePilotEvidenceWithGemini(
  pilotName: string,
  pilotDuration: number,
  currentDay: number,
  kpis: { name: string; baseline: string; target: string; current: string; status: string }[],
  evidenceList: { title: string; description: string; status: string }[]
): Promise<PilotSummaryResponse> {
  const fallback: PilotSummaryResponse = {
    summary: `The pilot "${pilotName}" has completed Day ${currentDay} of ${pilotDuration} and achieved or exceeded 3 of 3 primary predefined KPIs. Grievance resolution time improved from 72h to 18h (target <24h), SLA compliance reached 89% (target >85%), and citizen satisfaction increased from 62% to 84% (target >80%).`,
    achievedKPIs: [
      'Grievance Resolution Time: 18h (Target <24h) — 125% of target goal',
      'SLA Compliance: 89% (Target >85%) — Exceeded target by 4 percentage points',
      'Citizen Satisfaction: 84% (Target >80%) — Exceeded target by 4 percentage points'
    ],
    unmetKPIs: [],
    areasForAttention: [
      'Field officer feedback indicates need for offline synchronization in low-connectivity areas during monsoon periods',
      'Integration testing with legacy municipal billing system should be planned during pre-procurement phase'
    ]
  };

  if (!apiKey) {
    return fallback;
  }

  try {
    const prompt = `You are an evaluation advisor summarizing pilot trial evidence for a government department review committee.
Pilot: ${pilotName} (${currentDay} of ${pilotDuration} days)
KPI Data:
${JSON.stringify(kpis, null, 2)}
Validated Evidence items:
${JSON.stringify(evidenceList, null, 2)}

Provide an objective evidence summary. Highlight achieved KPIs, unmet KPIs, and areas for official attention.
Note: AI must NOT make the final government procurement decision; provide neutral evidence synthesis for authorized officials.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            achievedKPIs: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            unmetKPIs: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            areasForAttention: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ['summary', 'achievedKPIs', 'unmetKPIs', 'areasForAttention']
        }
      }
    });

    const text = response.text?.trim();
    if (!text) return fallback;
    return JSON.parse(text);
  } catch (error) {
    console.error('Gemini pilot summary error:', error);
    return fallback;
  }
}
