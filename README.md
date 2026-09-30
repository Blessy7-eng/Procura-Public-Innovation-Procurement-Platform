# PROCURA

### Public Innovation Procurement Platform

> **Discover better. Test safely. Decide with evidence.**

Procura is a digital innovation procurement platform that connects **government departments, startups, and evaluators** through a structured and evidence-based workflow.

It helps government departments move from identifying a real-world problem to discovering innovative startup solutions, evaluating them, running controlled pilots, measuring outcomes, and reviewing solutions for scale-up.

---

## 🚀 Problem

Traditional public procurement is primarily designed for standardized goods and established vendors.

Innovative startups often face difficulties such as:

- Limited visibility into government requirements
- Experience and turnover barriers
- Long procurement cycles
- Difficulty demonstrating their solutions to government departments
- Unclear pilot and evaluation processes

Government departments also face challenges in:

- Defining problems as outcome-based challenges
- Discovering relevant startups
- Evaluating new technologies
- Managing controlled pilots
- Measuring pilot outcomes
- Making evidence-based scale-up decisions

---

## 💡 Our Solution

**Procura creates a structured pathway for innovation procurement.**

Instead of directly moving from a government problem to procurement, Procura creates an intermediate evidence-building process:

```text
Government Problem
        ↓
Challenge Creation
        ↓
Startup Discovery
        ↓
Application
        ↓
Evaluation
        ↓
Controlled Pilot
        ↓
KPI Measurement
        ↓
Evidence Review
        ↓
Scale-up / Procurement Review
👥 User Roles
🏛️ Government Officer

Government departments can:

Create innovation challenges
Structure problems with AI assistance
Discover relevant startup solutions
Review applications
Monitor pilots
Track KPIs
Review pilot evidence
Conduct scale-up reviews
View the complete activity trail
🚀 Startup

Startups can:

Create their organization profile
Add their solutions
Discover government challenges
View solution compatibility
Apply to challenges
Track applications
Participate in pilots
Submit pilot evidence
⚖️ Evaluator

Evaluators can:

Review startup applications
Score proposals
Assess technical feasibility
Evaluate innovation and scalability
Review pilot performance
Validate submitted evidence
Support evidence-based evaluation
🤖 AI-Assisted Features

Procura uses AI as decision support, not as an autonomous decision-maker.

Challenge Structuring

Government officers can describe a problem in plain language.

AI helps structure it into:

Problem statement
Target users
Expected outcomes
Required capabilities
Suggested KPIs
Pilot considerations
Startup Match Explanation

Procura identifies potential startup matches based on predefined matching criteria and uses AI to explain:

Why the solution matches
Relevant capabilities
Potential gaps
Pilot Evidence Summary

AI can summarize submitted pilot evidence to help evaluators understand the results.

AI does not make procurement, legal eligibility, rejection, or scale-up decisions.

🧠 Startup Matching

Procura uses a transparent matching approach rather than relying entirely on AI.

Criteria	Weight
Capability Match	40%
Problem Domain Match	25%
Pilot Readiness	15%
Implementation Fit	10%
Previous Deployment Relevance	10%

AI is used to explain the match rather than determine the final decision.

🏗️ System Architecture
                    PROCURA
          Public Innovation Procurement
                         │
                         ▼
        ┌──────────────────────────┐
        │   React + TypeScript     │
        │        + Vite            │
        │                          │
        │ Government | Startup     │
        │ Evaluator Portals        │
        └────────────┬─────────────┘
                     │
                  HTTPS / REST
                     │
                     ▼
        ┌──────────────────────────┐
        │    Node.js + Express     │
        │                          │
        │ Authentication & RBAC    │
        │ Challenge Management     │
        │ Startup Matching         │
        │ Applications             │
        │ Evaluation               │
        │ Pilots & KPIs            │
        │ Evidence & Audit Trail   │
        └──────────┬───────┬───────┘
                   │       │
             ┌─────▼───┐ ┌─▼─────────┐
             │ Supabase│ │ Gemini API │
             │         │ │            │
             │ Auth    │ │ Challenge  │
             │ Postgres│ │ Structuring│
             │ RLS     │ │ Match Help │
             │ Data    │ │ Evidence   │
             │ Audit   │ │ Summary    │
             └─────────┘ └────────────┘
🛠️ Technology Stack
Technology	Purpose
React + TypeScript	Frontend user portals
Vite	Frontend development and build
Node.js + Express.js	Backend APIs and business logic
Supabase PostgreSQL	Application database
Supabase Auth	Authentication
Row Level Security	Role-based data security
Gemini API	AI-assisted features
Recharts	KPI and pilot visualizations
Zod	Form and API validation
Vercel	Frontend deployment
Render / Railway	Backend deployment
🔐 Security & Role-Based Access

Procura follows a role-based access model.

Each authenticated account has one role:

GOVERNMENT_OFFICER
STARTUP
EVALUATOR

Users can only access the workspace and resources permitted for their role.

Role switching is not available inside the application.

To access another account:

Sign Out
   ↓
Login
   ↓
Authenticate with another account

The backend also validates authorization instead of relying only on frontend navigation.

📊 Pilot & Evidence Management

Procura allows government departments to run controlled pilots before considering scale-up.

Pilot information can include:

Pilot duration
Pilot location
Target users
Objectives
Baseline values
Target values
Current KPI values
Evidence submissions
Evidence validation

Example:

Resolution Time
72 hours → 18 hours

SLA Compliance
51% → 89%

Citizen Satisfaction
62% → 84%

The objective is to create a traceable evidence trail before a scale-up review.

🧾 Activity & Audit Trail

Procura maintains a chronological activity trail across the procurement workflow.

Challenge Created
        ↓
Startup Discovered
        ↓
Application Submitted
        ↓
Evaluation Completed
        ↓
Pilot Approved
        ↓
Pilot Results Recorded
        ↓
Evidence Validated
        ↓
Scale-up Review

This improves transparency and helps users understand how a decision progressed through the platform.

📁 Project Structure
procura/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
│   └── ...
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   └── ...
│   └── ...
│
├── database/
│   ├── migrations/
│   └── seed/
│
├── .env.example
├── README.md
└── ...
⚙️ Getting Started
1. Clone the repository
git clone https://github.com/YOUR-USERNAME/procura.git
cd procura
2. Install dependencies

Install frontend dependencies:

cd frontend
npm install

Install backend dependencies:

cd ../backend
npm install
3. Configure environment variables

Create .env files based on .env.example.

Example:

SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key

For the backend, keep private API keys server-side.

Never commit real API keys or secrets to GitHub.

4. Start the backend
npm run dev
5. Start the frontend
npm run dev

Open the local development URL shown by Vite.

🗄️ Database

Procura uses Supabase PostgreSQL for persistent application data.

Major entities include:

Users
Departments
Startups
Startup Solutions
Challenges
Startup Matches
Applications
Evaluations
Pilots
Pilot KPIs
Pilot Results
Activity Logs

Authentication is handled through Supabase Auth, while Row Level Security helps enforce data access policies.

🎯 MVP Scope

The current MVP focuses on the core innovation procurement journey:

Role-based authentication
Government dashboard
Startup dashboard
Evaluator dashboard
Challenge creation
AI-assisted challenge structuring
Startup discovery
Startup matching
Application management
Evaluation
Pilot management
KPI tracking
Evidence submission
Evidence review
Scale-up review
Activity trail

The MVP intentionally avoids unnecessary infrastructure complexity such as:

Blockchain
Kubernetes
Kafka
Complex microservices
Autonomous AI agents
Unnecessary third-party procurement integrations

The goal is to demonstrate the core value of evidence-based innovation procurement with a practical and buildable architecture.

🌍 Future Scope

Potential future extensions include:

Government department integrations
Startup verification integrations
Digital document verification
Advanced procurement workflows
Multi-department challenge sharing
Advanced analytics
Pilot benchmarking
Automated reporting
Additional government compliance workflows
Integration with public procurement systems
🏆 Smart India Hackathon 2026

Problem Statement: SIH26136YELLOW

Theme: Software / Smart Automation

Solution: Procura — Public Innovation Procurement Platform

Procura is designed around the idea that innovative procurement should not jump directly from:

Problem → Purchase

Instead:

Problem → Test → Measure → Evidence → Scale
📌 Project Status

🚧 MVP / Hackathon Prototype

The project is being developed as a functional prototype demonstrating the complete innovation procurement lifecycle.

👨‍💻 Team

Built for Smart India Hackathon 2026.

📜 License

This project is developed for educational, research, and hackathon purposes.

Add an appropriate open-source license before distributing the project publicly.
