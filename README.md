# PROCURA — Public Innovation Procurement Platform

> **From Government Problems to Proven Solutions.**  
> *Procura connects government demand with startup innovation and turns promising ideas into measurable pilot evidence before scale-up.*

---

## 🌟 Hackathon MVP Overview

Procura addresses the structural innovation gap in public sector procurement: traditional tenders demand rigid, pre-certified enterprise products, while cutting-edge startup innovations require discovery, structured problem definition, controlled field pilots, and validated KPI evidence before multi-year public scaling.

### Core Product Loop
```text
Government Problem
       ↓
Structured Challenge (AI-Assisted)
       ↓
Startup Discovery (Deterministic 5-Factor Match + AI Explanation)
       ↓
Startup Proposal & Evaluation (Weighted Criteria)
       ↓
Controlled Pilot (Milestones & Ward Telemetry)
       ↓
KPI Evidence & Evaluator Validation
       ↓
Evidence-Based Scale-Up / Procurement Review
```

---

## 👥 Three Primary Roles

1. **Government Officer** (e.g. *Urban Development Department*)
   - Describe civic pain points in everyday language
   - Use AI Challenge Builder to structure outcomes, required capabilities, and suggested KPIs
   - Discover high-compatibility startups with explainable match metrics
   - Review applications and launch controlled 60–90 day pilots
   - Monitor real-time KPI progress and access the Evidence-Based Scale-Up Review

2. **Startup** (e.g. *EcoTrack Technologies*)
   - Manage startup profile and capability portfolio
   - Add solutions with pilot readiness ratings and deployment history
   - Discover matching challenges with transparency on capability fits and gaps
   - Submit structured pilot proposals
   - Track application progression across 5 defined stages
   - Submit pilot evidence with telemetry metrics and documentation

3. **Evaluator** (e.g. *Technical Evaluation Committee*)
   - Independently score applications across 5 transparent criteria: Problem Fit, Technical Feasibility, Innovation, Scalability, Cost-Effectiveness
   - Shortlist candidates for controlled pilots
   - Inspect and validate submitted pilot evidence (Validated / Needs Clarification / Rejected)
   - Trigger AI Evidence Summaries to evaluate KPI achievement against baselines

---

## ⚙️ Architecture & Tech Stack

```text
                 PROCURA
                    │
          ┌─────────┴─────────┐
          │                   │
    React 19 + Vite       Node.js + Express
   Tailwind CSS + Lucide      Backend
   Recharts Data Viz          │
          │          ┌────────┼─────────┐
          │          │        │         │
          │       Gemini   Supabase   Business
          │     3.8 Flash PostgreSQL   Logic &
          │       (Server)  Schema    Matching
          │                   │
          └───────────────────┘
```

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React, Recharts.
- **Backend**: Node.js, Express, TypeScript, REST API.
- **AI Integration**: Google GenAI SDK (`@google/genai`), server-side execution with `gemini-3.8-flash`. AI acts strictly as **Decision Support**, not a decision maker.
- **Database**: PostgreSQL schema designed for Supabase (`database/schema.sql`).
- **Matching Algorithm**: Deterministic 5-factor weighted calculation (Capability Match 40%, Problem Domain 25%, Pilot Readiness 15%, Implementation Fit 10%, Previous Deployment 10%) combined with AI explanation of strengths and potential gaps.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- npm or pnpm

### Environment Configuration
Copy `.env.example` to `.env`:
```bash
GEMINI_API_KEY="your-gemini-api-key"
PORT=3000
```

### Running Locally
```bash
# Install dependencies
npm install

# Start full-stack development server (Express + Vite on port 3000)
npm run dev

# Build for production
npm run build
npm start
```

---

## 🛡️ AI Safety Principles
- AI outputs are clearly labelled as **AI-assisted draft / recommendation**.
- Official eligibility verification, scoring, and final procurement decisions remain strictly with authorized government officials.
- Deterministic fallbacks guarantee unbroken functionality even during network disruption.
