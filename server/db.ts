import {
  User,
  Department,
  Startup,
  StartupSolution,
  Challenge,
  StartupMatch,
  Application,
  Evaluation,
  Pilot,
  PilotKPI,
  PilotResult,
  ActivityLog,
  UserRole
} from './types';
import { calculateDeterministicMatch } from './matching';

export class DatabaseStore {
  users: User[] = [];
  departments: Department[] = [];
  startups: Startup[] = [];
  solutions: StartupSolution[] = [];
  challenges: Challenge[] = [];
  matches: StartupMatch[] = [];
  applications: Application[] = [];
  evaluations: Evaluation[] = [];
  pilots: Pilot[] = [];
  kpis: PilotKPI[] = [];
  evidence: PilotResult[] = [];
  activityLogs: ActivityLog[] = [];

  constructor() {
    this.seedDefaultData();
  }

  seedDefaultData() {
    // 1. Users
    this.users = [
      {
        id: 'usr-gov-1',
        name: 'Officer Rajesh Varma',
        email: 'rajesh.varma@urban.gov.in',
        role: 'government',
        organizationId: 'dept-1',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        createdAt: '2026-08-01T09:00:00Z'
      },
      {
        id: 'usr-startup-1',
        name: 'Aarav Sharma',
        email: 'aarav@ecotrack.io',
        role: 'startup',
        organizationId: 'st-ecotrack',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        createdAt: '2026-08-05T10:00:00Z'
      },
      {
        id: 'usr-eval-1',
        name: 'Dr. Priya Sundaram',
        email: 'priya.sundaram@evaluators.gov.in',
        role: 'evaluator',
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        createdAt: '2026-08-10T11:00:00Z'
      }
    ];

    // 2. Departments
    this.departments = [
      {
        id: 'dept-1',
        name: 'Urban Development Department',
        departmentType: 'Municipal & Smart Cities',
        location: 'City Corporation Headquarters',
        description: 'Overseeing municipal infrastructure, civic grievance redressal, smart urban governance and solid waste management.',
        createdAt: '2026-07-01T00:00:00Z'
      },
      {
        id: 'dept-2',
        name: 'Renewable Energy & Power Agency',
        departmentType: 'Energy & Infrastructure',
        location: 'State Secretariat',
        description: 'Managing public solar adoption, building efficiency and microgrid innovation.',
        createdAt: '2026-07-01T00:00:00Z'
      }
    ];

    // 3. Startups
    this.startups = [
      {
        id: 'st-ecotrack',
        name: 'EcoTrack Technologies',
        logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
        description: 'AI-enabled municipal complaint and waste monitoring platform providing automated dispatch, citizen transparency, and real-time SLA telemetry.',
        website: 'https://ecotrack.io',
        location: 'Bengaluru / Hyderabad',
        founderName: 'Aarav Sharma',
        teamSize: '24 members',
        industry: 'GovTech & CleanTech',
        technologies: ['Computer Vision', 'Route Optimization', 'SMS/WhatsApp APIs', 'GIS Mapping', 'React/Node'],
        startupRecognition: 'DPIIT Recognised #DIPP84920',
        verificationStatus: 'verified',
        profileCompleteness: 85,
        createdAt: '2026-08-01T10:00:00Z'
      },
      {
        id: 'st-civicflow',
        name: 'CivicFlow Labs',
        logoUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&auto=format&fit=crop&q=80',
        description: 'Automated civic grievance triaging and citizen feedback loop software designed for municipal corporations.',
        website: 'https://civicflow.ai',
        location: 'Pune',
        founderName: 'Meera Kulkarni',
        teamSize: '16 members',
        industry: 'Civic Technology',
        technologies: ['NLP Grievance Categorization', 'Cloud SaaS', 'Voice Bot'],
        startupRecognition: 'State Startup Mission Level 2',
        verificationStatus: 'verified',
        profileCompleteness: 80,
        createdAt: '2026-08-05T12:00:00Z'
      },
      {
        id: 'st-urbansense',
        name: 'UrbanSense AI',
        logoUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=100&auto=format&fit=crop&q=80',
        description: 'IoT ultrasonic bin monitoring and fleet GPS tracking with real-time sanitation analytics.',
        website: 'https://urbansense.io',
        location: 'Chennai',
        founderName: 'Venkatesh Raman',
        teamSize: '12 members',
        industry: 'Smart Cities IoT',
        technologies: ['IoT Hardware', 'LoRaWAN', 'Telemetry Dashboards'],
        startupRecognition: 'DPIIT Recognised #DIPP65112',
        verificationStatus: 'verified',
        profileCompleteness: 75,
        createdAt: '2026-08-07T14:00:00Z'
      },
      {
        id: 'st-govserve',
        name: 'GovServe Technologies',
        logoUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&auto=format&fit=crop&q=80',
        description: 'Modular citizen self-service portal and public service delivery workflow orchestration.',
        website: 'https://govserve.tech',
        location: 'New Delhi',
        founderName: 'Sunil Mathur',
        teamSize: '30 members',
        industry: 'GovTech Enterprise',
        technologies: ['Enterprise Workflow', 'PostgreSQL', 'Multi-tenant SaaS'],
        startupRecognition: 'DPIIT Recognised #DIPP44219',
        verificationStatus: 'verified',
        profileCompleteness: 90,
        createdAt: '2026-08-08T09:00:00Z'
      },
      {
        id: 'st-civicpulse',
        name: 'CivicPulse Systems',
        logoUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=100&auto=format&fit=crop&q=80',
        description: 'Public grievance sentiment analysis and ward-level satisfaction pulse tracking.',
        website: 'https://civicpulse.org',
        location: 'Mumbai',
        founderName: 'Neha Deshmukh',
        teamSize: '9 members',
        industry: 'Data & Analytics',
        technologies: ['Sentiment Analysis', 'Survey Engine', 'Geo Heatmaps'],
        startupRecognition: 'DPIIT Recognised #DIPP90812',
        verificationStatus: 'verified',
        profileCompleteness: 70,
        createdAt: '2026-08-10T11:00:00Z'
      }
    ];

    // 4. Startup Solutions
    this.solutions = [
      {
        id: 'sol-ecotrack-1',
        startupId: 'st-ecotrack',
        name: 'AI Waste Management Platform',
        description: 'End-to-end municipal waste complaint resolution and collection tracking platform. Features instant photo geo-tagging, automated zone dispatch, live SMS tracking for citizens, and supervisory SLA escalation heatmaps.',
        problemSolved: 'Slow manual municipal complaint routing, lack of citizen updates, untracked sanitation vehicle routes, and inaccurate SLA compliance reporting.',
        capabilities: [
          'Complaint management',
          'Municipal workflow',
          'Analytics & reporting',
          'Citizen platform',
          'Pilot readiness',
          'GPS collection tracking'
        ],
        technology: 'Node.js, React, PostGIS, Computer Vision Verification, SMS Gateway',
        deploymentModel: 'Cloud SaaS / Hybrid Municipal Cloud',
        implementationTime: '10 to 14 days pilot onboarding',
        estimatedCost: '$4,200 for 90-day municipal pilot (Ward 12)',
        previousDeployments: 'Successfully deployed in Hubballi-Dharwad Municipal Corporation (Ward 4 & 5) with 45,000 citizens.',
        pilotReadiness: 'Immediate',
        status: 'active',
        createdAt: '2026-08-02T10:00:00Z'
      },
      {
        id: 'sol-civicflow-1',
        startupId: 'st-civicflow',
        name: 'CivicFlow Municipal Grievance AI',
        description: 'Automated civic ticket categorization, duplicate detection, and automated officer dispatching.',
        problemSolved: 'Manual ticket assignment delays and duplicate complaints clogging municipal helplines.',
        capabilities: [
          'Complaint management',
          'Municipal workflow',
          'Citizen platform'
        ],
        technology: 'Python FastAPI, React, NLP Classifier',
        deploymentModel: 'Cloud SaaS',
        implementationTime: '21 days',
        estimatedCost: '$3,800 for 90 days',
        previousDeployments: 'Pilot tested with Pune Pimpri-Chinchwad municipal zone.',
        pilotReadiness: 'High',
        status: 'active',
        createdAt: '2026-08-05T13:00:00Z'
      },
      {
        id: 'sol-urbansense-1',
        startupId: 'st-urbansense',
        name: 'SanitationSense IoT & Telemetry',
        description: 'Bin fill-level sensors with fleet GPS telematics to prevent garbage overflow before complaints occur.',
        problemSolved: 'Reactive waste collection and unmonitored garbage dump overflow.',
        capabilities: [
          'Municipal workflow',
          'Analytics & reporting',
          'GPS collection tracking'
        ],
        technology: 'LoRaWAN Sensors, MQTT, TimeSeries DB',
        deploymentModel: 'Hardware + Cloud SaaS',
        implementationTime: '30 days',
        estimatedCost: '$6,500 including 100 sensors',
        previousDeployments: 'Coimbatore Smart City pilot in commercial district.',
        pilotReadiness: 'Medium',
        status: 'active',
        createdAt: '2026-08-07T15:00:00Z'
      },
      {
        id: 'sol-govserve-1',
        startupId: 'st-govserve',
        name: 'GovDesk Citizen Service Suite',
        description: 'Omnichannel citizen service portal covering water, sanitation, and street lighting requests.',
        problemSolved: 'Fragmented citizen interfaces across municipal departments.',
        capabilities: [
          'Complaint management',
          'Citizen platform',
          'Municipal workflow'
        ],
        technology: 'Java Spring Boot, Angular, PostgreSQL',
        deploymentModel: 'On-premise or Gov Cloud',
        implementationTime: '45 days',
        estimatedCost: '$8,000',
        previousDeployments: 'Deployed across 3 small town councils.',
        pilotReadiness: 'Medium',
        status: 'active',
        createdAt: '2026-08-08T10:00:00Z'
      },
      {
        id: 'sol-civicpulse-1',
        startupId: 'st-civicpulse',
        name: 'CivicPulse Citizen Satisfaction Engine',
        description: 'Post-resolution automated IVR and WhatsApp feedback collection with ward satisfaction scorecards.',
        problemSolved: 'Lack of verified citizen satisfaction data after complaint closure.',
        capabilities: [
          'Analytics & reporting',
          'Citizen platform'
        ],
        technology: 'Cloud Telephony, Python, PowerBI',
        deploymentModel: 'Cloud SaaS',
        implementationTime: '14 days',
        estimatedCost: '$2,900',
        previousDeployments: 'Nagpur Municipal Corporation feedback study.',
        pilotReadiness: 'High',
        status: 'active',
        createdAt: '2026-08-10T12:00:00Z'
      }
    ];

    // 5. Challenges
    this.challenges = [
      {
        id: 'ch-waste-1',
        departmentId: 'dept-1',
        createdBy: 'usr-gov-1',
        title: 'Intelligent Waste Collection Complaint Management',
        problemStatement:
          'Municipal solid waste collection grievance workflows currently operate on manual phone registers and fragmented WhatsApp groups. Citizens receive no status tracking on their garbage complaints, while ward sanitation officers spend over 3 hours daily manually tracking field workers and verifying completion.',
        targetUsers: [
          'Ward 12 Citizens (approx. 5,000 active households)',
          'Ward Sanitation Supervisors & Junior Engineers',
          'Solid Waste Collection Truck Drivers (22 vehicles)',
          'Central Municipal Grievance Desk'
        ],
        expectedOutcomes: [
          'Reduce average grievance resolution time from 72 hours to under 24 hours',
          'Provide citizens with real-time SMS/web status tracking and photo verification',
          'Automate SLA escalation alerts to ward supervisors',
          'Increase verified citizen satisfaction rate above 80%'
        ],
        requiredCapabilities: [
          'Complaint management',
          'Municipal workflow',
          'Analytics & reporting',
          'Citizen platform',
          'Pilot readiness',
          'GPS collection tracking'
        ],
        eligibilityRequirements: [
          'DPIIT recognized startup or registered innovation enterprise',
          'Product readiness level at minimum TRL 7 (demonstrated in operational environment)',
          'Ability to begin 90-day pilot within 14 calendar days of selection',
          'Compliance with local citizen data privacy standards'
        ],
        suggestedKPIs: [
          'Average Grievance Resolution Time (<24 hours)',
          'SLA Compliance Rate (>85%)',
          'Citizen Satisfaction Rating (>80%)',
          'Unresolved Backlog Clearance (>60%)'
        ],
        pilotDuration: '90 days',
        status: 'pilot_active',
        createdAt: '2026-08-01T11:00:00Z'
      },
      {
        id: 'ch-citizen-2',
        departmentId: 'dept-1',
        createdBy: 'usr-gov-1',
        title: 'Citizen Complaint Resolution & Streetlight SLA Automation',
        problemStatement:
          'Street lighting dark spot complaints take over 5 days to resolve due to lack of inventory tracking and night inspection staff. Seeking automated fault reporting and verification solutions.',
        targetUsers: ['City Traffic Police', 'Night Patrol Teams', 'Residents', 'Electrical Engineers'],
        expectedOutcomes: ['Streetlight outage resolution in <12h', 'Automated energy saving during non-peak hours'],
        requiredCapabilities: ['Municipal workflow', 'Analytics & reporting', 'Citizen platform'],
        eligibilityRequirements: ['Registered tech startup', 'Hardware/software integration ready'],
        suggestedKPIs: ['Outage Duration (<12h)', 'Uptime (>98%)', 'Citizen Satisfaction (>85%)'],
        pilotDuration: '60 days',
        status: 'evaluation',
        createdAt: '2026-08-15T09:30:00Z'
      },
      {
        id: 'ch-energy-3',
        departmentId: 'dept-2',
        createdBy: 'usr-gov-1',
        title: 'Rooftop Solar Yield Optimization for Municipal Facilities',
        problemStatement:
          'Municipal administrative offices have installed 1.2 MW of rooftop solar across 14 buildings, but lack real-time generation monitoring and maintenance alerts.',
        targetUsers: ['Energy Auditors', 'Facility Managers', 'State Energy Agency'],
        expectedOutcomes: ['15% increase in solar generation uptime', 'Automated predictive cleaning schedules'],
        requiredCapabilities: ['Analytics & reporting', 'Pilot readiness'],
        eligibilityRequirements: ['Solar IoT or AI analytics provider'],
        suggestedKPIs: ['Generation Uptime (>97%)', 'Fault Detection Latency (<2h)'],
        pilotDuration: '90 days',
        status: 'published',
        createdAt: '2026-08-20T14:00:00Z'
      },
      {
        id: 'ch-pothole-4',
        departmentId: 'dept-1',
        createdBy: 'usr-gov-1',
        title: 'Automated Pothole Detection & Road Safety Auditing',
        problemStatement:
          'Road damage reports during monsoons arrive after accidents occur. Seeking automated dashcam or mobile accelerometer detection for early patch repair.',
        targetUsers: ['Public Works Department Engineers', 'City Bus Drivers', 'Commuters'],
        expectedOutcomes: ['Detection of high-severity potholes within 24h of emergence', 'Prioritized road repair dispatch'],
        requiredCapabilities: ['Municipal workflow', 'Analytics & reporting', 'Computer Vision'],
        eligibilityRequirements: ['Computer vision or geospatial startup with tested model'],
        suggestedKPIs: ['Hazard Detection Accuracy (>90%)', 'Repair Turnaround Time (<48h)'],
        pilotDuration: '60 days',
        status: 'published',
        createdAt: '2026-08-25T11:00:00Z'
      }
    ];

    // 6. Compute Matches for Challenge 1
    const chWaste = this.challenges[0];
    this.matches = this.startups.map(st => {
      const sol = this.solutions.find(s => s.startupId === st.id) || this.solutions[0];
      return calculateDeterministicMatch(chWaste, st, sol);
    });

    // 7. Applications
    this.applications = [
      {
        id: 'app-ecotrack-1',
        challengeId: 'ch-waste-1',
        startupId: 'st-ecotrack',
        solutionId: 'sol-ecotrack-1',
        proposedApproach:
          'Deploy the EcoTrack AI platform across Ward 12 covering 5,000 households. Equip 22 collection vehicles with automated route guidance, provide sanitation supervisors with our tablet application, and launch the WhatsApp/Web grievance bot with vernacular voice support.',
        proposedTimeline: 'Phase 1: Ward setup & vehicle onboarding (Day 1-14); Phase 2: Live pilot & citizen rollout (Day 15-75); Phase 3: Evidence collation & scale-up audit (Day 76-90).',
        proposedCost: '$4,200 total for 90-day pilot (includes hardware mounts, cloud hosting, and field training).',
        expectedImpact:
          'Reduce citizen grievance resolution time from 72h to <24h. Achieve >85% SLA adherence and 80%+ citizen satisfaction across Ward 12.',
        status: 'pilot_selected',
        submittedAt: '2026-08-08T14:30:00Z'
      },
      {
        id: 'app-civicflow-1',
        challengeId: 'ch-waste-1',
        startupId: 'st-civicflow',
        solutionId: 'sol-civicflow-1',
        proposedApproach:
          'Implement CivicFlow Grievance NLP to automatically classify incoming tickets from the existing municipal portal and route them to junior sanitation officers.',
        proposedTimeline: 'Setup in 20 days, live test for 70 days.',
        proposedCost: '$3,800',
        expectedImpact: 'Reduce ticket triage backlog by 60%.',
        status: 'shortlisted',
        submittedAt: '2026-08-09T16:00:00Z'
      },
      {
        id: 'app-urbansense-1',
        challengeId: 'ch-waste-1',
        startupId: 'st-urbansense',
        solutionId: 'sol-urbansense-1',
        proposedApproach:
          'Deploy 50 IoT ultrasonic bin monitors at primary commercial dump points in Ward 12 and pair with driver telematics.',
        proposedTimeline: 'Hardware deployment in 30 days, pilot for 60 days.',
        proposedCost: '$6,500',
        expectedImpact: 'Prevent bin overflow with 95% accuracy.',
        status: 'under_evaluation',
        submittedAt: '2026-08-11T11:20:00Z'
      }
    ];

    // 8. Evaluations
    this.evaluations = [
      {
        id: 'eval-eco-1',
        applicationId: 'app-ecotrack-1',
        evaluatorId: 'usr-eval-1',
        problemFit: 92,
        technicalFeasibility: 88,
        innovation: 84,
        scalability: 90,
        costEffectiveness: 82,
        totalScore: 88.2,
        notes:
          'Solution demonstrates exceptional domain fit for Ward 12 municipal grievance requirements. Deployment architecture is mature with proven municipal references in Hubballi-Dharwad. Clear cost structure and rapid 14-day onboarding. Recommendation: Approve for 90-day controlled municipal pilot.',
        createdAt: '2026-08-12T16:00:00Z'
      }
    ];

    // 9. Pilots
    this.pilots = [
      {
        id: 'plt-waste-1',
        challengeId: 'ch-waste-1',
        startupId: 'st-ecotrack',
        solutionId: 'sol-ecotrack-1',
        applicationId: 'app-ecotrack-1',
        name: 'Municipal Waste Management Pilot — Ward 12',
        durationDays: 90,
        pilotArea: 'Ward 12 (Central Municipal Zone)',
        targetUsers: '5,000 citizens, 22 collection vehicle staff, 4 ward inspectors',
        objectives:
          'Validate AI grievance triaging, automated driver routing, and SMS citizen resolution tracking across Ward 12. Measure resolution time, SLA compliance, and citizen satisfaction before considering city-wide scale-up.',
        status: 'running',
        startDate: '2026-08-15',
        endDate: '2026-11-13',
        currentDay: 47,
        overallKpiAchievement: 91,
        aiSummary: {
          summary:
            'The pilot "Municipal Waste Management Pilot — Ward 12" has completed Day 47 of 90 and achieved or exceeded all 3 primary predefined KPIs. Grievance resolution time improved from 72h baseline to 18h (target <24h), SLA compliance reached 89% (target >85%), and citizen satisfaction increased from 62% to 84% (target >80%).',
          achievedKPIs: [
            'Resolution Time: 18h (Target <24h) — Baseline was 72h',
            'SLA Compliance: 89% (Target >85%) — Baseline was 51%',
            'Citizen Satisfaction: 84% (Target >80%) — Baseline was 62%'
          ],
          unmetKPIs: [],
          areasForAttention: [
            'Field officer feedback indicates need for offline synchronization in low-connectivity pockets',
            'Finalize integration bridge with legacy municipal ERP before city-wide procurement review'
          ]
        },
        createdAt: '2026-08-14T10:00:00Z'
      }
    ];

    // 10. Pilot KPIs
    this.kpis = [
      {
        id: 'kpi-1',
        pilotId: 'plt-waste-1',
        name: 'Resolution Time',
        baselineValue: '72 hours',
        targetValue: '< 24 hours',
        currentValue: '18 hours',
        unit: 'hours',
        status: 'achieved',
        trendData: [
          { label: 'Baseline', value: 72 },
          { label: 'Day 10', value: 58 },
          { label: 'Day 20', value: 42 },
          { label: 'Day 30', value: 29 },
          { label: 'Day 40', value: 21 },
          { label: 'Day 47', value: 18 }
        ]
      },
      {
        id: 'kpi-2',
        pilotId: 'plt-waste-1',
        name: 'SLA Compliance',
        baselineValue: '51%',
        targetValue: '> 85%',
        currentValue: '89%',
        unit: '%',
        status: 'achieved',
        trendData: [
          { label: 'Baseline', value: 51 },
          { label: 'Day 10', value: 60 },
          { label: 'Day 20', value: 71 },
          { label: 'Day 30', value: 80 },
          { label: 'Day 40', value: 86 },
          { label: 'Day 47', value: 89 }
        ]
      },
      {
        id: 'kpi-3',
        pilotId: 'plt-waste-1',
        name: 'Citizen Satisfaction',
        baselineValue: '62%',
        targetValue: '> 80%',
        currentValue: '84%',
        unit: '%',
        status: 'achieved',
        trendData: [
          { label: 'Baseline', value: 62 },
          { label: 'Day 10', value: 65 },
          { label: 'Day 20', value: 72 },
          { label: 'Day 30', value: 78 },
          { label: 'Day 40', value: 82 },
          { label: 'Day 47', value: 84 }
        ]
      }
    ];

    // 11. Evidence Results
    this.evidence = [
      {
        id: 'ev-1',
        pilotId: 'plt-waste-1',
        submittedBy: 'Aarav Sharma (EcoTrack)',
        evidenceTitle: 'Deployment Completed & Ward 12 Onboarding',
        evidenceDescription: 'Field vehicle hardware mounting and tablet deployment completed for all 22 collection trucks across Ward 12.',
        metricResult: '100% vehicle coverage (22/22 vehicles live)',
        evidenceUrl: 'https://procura.gov.in/docs/evidence-ward12-onboarding.pdf',
        validationStatus: 'validated',
        evaluatorNotes: 'Inspected and verified in person by Ward Sanitation Inspector on Day 12.',
        submittedAt: '2026-08-27T10:00:00Z'
      },
      {
        id: 'ev-2',
        pilotId: 'plt-waste-1',
        submittedBy: 'Aarav Sharma (EcoTrack)',
        evidenceTitle: '5,000 Citizens Onboarded to Tracking Portal',
        evidenceDescription: 'Citizen awareness flyers and SMS links distributed. 5,230 unique citizen phone numbers actively registered.',
        metricResult: '5,230 verified active citizen profiles',
        evidenceUrl: 'https://procura.gov.in/docs/citizen-onboarding-report.pdf',
        validationStatus: 'validated',
        evaluatorNotes: 'Telephonic spot check of 50 random registered citizens verified 94% awareness.',
        submittedAt: '2026-09-05T14:15:00Z'
      },
      {
        id: 'ev-3',
        pilotId: 'plt-waste-1',
        submittedBy: 'Aarav Sharma (EcoTrack)',
        evidenceTitle: 'First Milestone Completed: Automated Routing Live',
        evidenceDescription: 'Dynamic route optimization reduced daily truck fuel consumption by 14% and lowered missed pickups to zero.',
        metricResult: '0 missed pickups in consecutive 14 days',
        evidenceUrl: 'https://procura.gov.in/docs/fuel-route-telemetry.pdf',
        validationStatus: 'validated',
        evaluatorNotes: 'Fuel log audit matches GPS telemetry reports.',
        submittedAt: '2026-09-15T11:45:00Z'
      },
      {
        id: 'ev-4',
        pilotId: 'plt-waste-1',
        submittedBy: 'Aarav Sharma (EcoTrack)',
        evidenceTitle: 'Mid-term KPI Performance Audit Report',
        evidenceDescription: 'Comprehensive telemetry extract from 1,420 resolved grievances during Days 15-45. Median resolution time confirmed at 18 hours.',
        metricResult: '18 hours average resolution time (vs 72h baseline)',
        evidenceUrl: 'https://procura.gov.in/docs/kpi-audit-midterm.pdf',
        validationStatus: 'pending',
        evaluatorNotes: 'Pending final cross-verification with municipal central call center records.',
        submittedAt: '2026-09-24T16:20:00Z'
      }
    ];

    // 12. Activity Logs (Visual Audit Trail)
    this.activityLogs = [
      {
        id: 'act-1',
        userId: 'usr-gov-1',
        actorName: 'Officer Rajesh Varma',
        role: 'government',
        entityType: 'challenge',
        entityId: 'ch-waste-1',
        action: 'Challenge Created',
        description: 'Created challenge: "Intelligent Waste Collection Complaint Management" with AI assistance.',
        createdAt: '2026-08-01T11:00:00Z'
      },
      {
        id: 'act-2',
        userId: 'usr-gov-1',
        actorName: 'Procura Matching Engine',
        role: 'government',
        entityType: 'matching',
        entityId: 'ch-waste-1',
        action: 'Startup Discovered',
        description: 'Matched EcoTrack Technologies with 92% compatibility score based on 5 weighted factors.',
        createdAt: '2026-08-02T10:15:00Z'
      },
      {
        id: 'act-3',
        userId: 'usr-startup-1',
        actorName: 'Aarav Sharma',
        role: 'startup',
        entityType: 'application',
        entityId: 'app-ecotrack-1',
        action: 'Application Submitted',
        description: 'EcoTrack Technologies submitted pilot proposal for Ward 12 ($4,200 budget).',
        createdAt: '2026-08-08T14:30:00Z'
      },
      {
        id: 'act-4',
        userId: 'usr-gov-1',
        actorName: 'Officer Rajesh Varma',
        role: 'government',
        entityType: 'application',
        entityId: 'app-ecotrack-1',
        action: 'Eligibility Verified',
        description: 'Verified DPIIT registration #DIPP84920 and municipal TRL-7 readiness.',
        createdAt: '2026-08-10T09:00:00Z'
      },
      {
        id: 'act-5',
        userId: 'usr-eval-1',
        actorName: 'Dr. Priya Sundaram',
        role: 'evaluator',
        entityType: 'evaluation',
        entityId: 'eval-eco-1',
        action: 'Evaluation Completed',
        description: 'Scored proposal at 88.2/100 across 5 transparent criteria. Recommended for pilot.',
        createdAt: '2026-08-12T16:00:00Z'
      },
      {
        id: 'act-6',
        userId: 'usr-gov-1',
        actorName: 'Officer Rajesh Varma',
        role: 'government',
        entityType: 'pilot',
        entityId: 'plt-waste-1',
        action: 'Pilot Approved',
        description: 'Launched 90-day controlled municipal pilot in Ward 12 with 3 defined KPIs.',
        createdAt: '2026-08-14T10:00:00Z'
      },
      {
        id: 'act-7',
        userId: 'usr-startup-1',
        actorName: 'Aarav Sharma',
        role: 'startup',
        entityType: 'evidence',
        entityId: 'ev-1',
        action: 'Pilot Results Recorded',
        description: 'EcoTrack uploaded Ward 12 deployment completion & 22-vehicle telematics telemetry.',
        createdAt: '2026-08-27T10:00:00Z'
      },
      {
        id: 'act-8',
        userId: 'usr-eval-1',
        actorName: 'Dr. Priya Sundaram',
        role: 'evaluator',
        entityType: 'evidence',
        entityId: 'ev-1',
        action: 'Evidence Validated',
        description: 'Validated Ward 12 deployment milestone following on-site inspection.',
        createdAt: '2026-08-28T11:00:00Z'
      },
      {
        id: 'act-9',
        userId: 'usr-eval-1',
        actorName: 'Dr. Priya Sundaram',
        role: 'evaluator',
        entityType: 'evidence',
        entityId: 'ev-2',
        action: 'Evidence Validated',
        description: 'Validated 5,230 citizen profiles onboarding telemetry and random verification check.',
        createdAt: '2026-09-06T15:30:00Z'
      },
      {
        id: 'act-10',
        userId: 'usr-eval-1',
        actorName: 'Dr. Priya Sundaram',
        role: 'evaluator',
        entityType: 'evidence',
        entityId: 'ev-3',
        action: 'Evidence Validated',
        description: 'Validated 0 missed pickups milestone and 14% route fuel telemetry.',
        createdAt: '2026-09-16T12:00:00Z'
      },
      {
        id: 'act-11',
        userId: 'usr-startup-1',
        actorName: 'Aarav Sharma',
        role: 'startup',
        entityType: 'evidence',
        entityId: 'ev-4',
        action: 'Evidence Submitted',
        description: 'EcoTrack uploaded mid-term KPI audit report demonstrating 18h resolution time.',
        createdAt: '2026-09-24T16:20:00Z'
      }
    ];
  }

  logActivity(
    actorName: string,
    role: UserRole,
    entityType: string,
    entityId: string,
    action: string,
    description: string,
    userId?: string
  ) {
    const log: ActivityLog = {
      id: `act-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId,
      actorName,
      role,
      entityType,
      entityId,
      action,
      description,
      createdAt: new Date().toISOString()
    };
    this.activityLogs.unshift(log);
    return log;
  }
}

export const db = new DatabaseStore();
