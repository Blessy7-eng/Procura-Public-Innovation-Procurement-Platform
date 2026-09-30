-- ====================================================================
-- PROCURA: Public Innovation Procurement Platform
-- Database Migration: 001_initial_schema.sql
-- Compatible with PostgreSQL 14+ / Supabase
-- ====================================================================

-- 1. Departments Table (Government municipal entities)
CREATE TABLE IF NOT EXISTS departments (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    state VARCHAR(128) NOT NULL,
    city VARCHAR(128) NOT NULL,
    jurisdiction VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Users Table (Multi-role RBAC: government, startup, evaluator)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(32) NOT NULL CHECK (role IN ('government', 'startup', 'evaluator')),
    organization_id VARCHAR(64),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Startups Table
CREATE TABLE IF NOT EXISTS startups (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    tagline TEXT,
    description TEXT,
    founded_year INTEGER,
    website VARCHAR(255),
    dpiit_number VARCHAR(64),
    stage VARCHAR(64) DEFAULT 'Pilot Ready',
    sector VARCHAR(64) NOT NULL,
    team_size VARCHAR(32),
    location VARCHAR(128),
    logo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Startup Solutions Table
CREATE TABLE IF NOT EXISTS startup_solutions (
    id VARCHAR(64) PRIMARY KEY,
    startup_id VARCHAR(64) NOT NULL REFERENCES startups(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    capabilities TEXT[] DEFAULT '{}',
    sector VARCHAR(64) NOT NULL,
    stage VARCHAR(64) DEFAULT 'Pilot Ready',
    pricing_model TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Challenges Table (Municipal outcome-based problem statements)
CREATE TABLE IF NOT EXISTS challenges (
    id VARCHAR(64) PRIMARY KEY,
    department_id VARCHAR(64) REFERENCES departments(id) ON DELETE SET NULL,
    created_by VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    problem_statement TEXT NOT NULL,
    target_users TEXT[] DEFAULT '{}',
    expected_outcomes TEXT[] DEFAULT '{}',
    required_capabilities TEXT[] DEFAULT '{}',
    eligibility_requirements TEXT[] DEFAULT '{}',
    suggested_kpis TEXT[] DEFAULT '{}',
    pilot_duration VARCHAR(64) DEFAULT '90 days',
    status VARCHAR(32) DEFAULT 'published' CHECK (status IN ('draft', 'published', 'evaluation', 'pilot_active', 'closed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Startup Matches Table (Deterministic compatibility calculations)
CREATE TABLE IF NOT EXISTS startup_matches (
    id VARCHAR(64) PRIMARY KEY,
    challenge_id VARCHAR(64) NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
    startup_id VARCHAR(64) NOT NULL REFERENCES startups(id) ON DELETE CASCADE,
    solution_id VARCHAR(64) NOT NULL REFERENCES startup_solutions(id) ON DELETE CASCADE,
    compatibility_score INTEGER NOT NULL CHECK (compatibility_score BETWEEN 0 AND 100),
    why_matched TEXT,
    matching_capabilities TEXT[] DEFAULT '{}',
    potential_gaps TEXT,
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Applications Table (Startup proposals for challenges)
CREATE TABLE IF NOT EXISTS applications (
    id VARCHAR(64) PRIMARY KEY,
    challenge_id VARCHAR(64) NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
    startup_id VARCHAR(64) NOT NULL REFERENCES startups(id) ON DELETE CASCADE,
    solution_id VARCHAR(64) NOT NULL REFERENCES startup_solutions(id) ON DELETE CASCADE,
    proposal_summary TEXT NOT NULL,
    proposed_pilot_budget NUMERIC(12, 2) DEFAULT 0.00,
    estimated_days_to_deploy INTEGER DEFAULT 14,
    status VARCHAR(32) DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'shortlisted', 'pilot_selected', 'rejected')),
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Technical Evaluations Table (Independent scoring committee)
CREATE TABLE IF NOT EXISTS evaluations (
    id VARCHAR(64) PRIMARY KEY,
    application_id VARCHAR(64) NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    evaluator_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    technical_score INTEGER CHECK (technical_score BETWEEN 0 AND 100),
    feasibility_score INTEGER CHECK (feasibility_score BETWEEN 0 AND 100),
    cost_score INTEGER CHECK (cost_score BETWEEN 0 AND 100),
    innovation_score INTEGER CHECK (innovation_score BETWEEN 0 AND 100),
    evidence_score INTEGER CHECK (evidence_score BETWEEN 0 AND 100),
    total_weighted_score INTEGER CHECK (total_weighted_score BETWEEN 0 AND 100),
    notes TEXT,
    recommendation VARCHAR(64) DEFAULT 'recommend_pilot',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Municipal Pilots Table (Controlled bounded trials, e.g. Ward 12)
CREATE TABLE IF NOT EXISTS pilots (
    id VARCHAR(64) PRIMARY KEY,
    challenge_id VARCHAR(64) REFERENCES challenges(id) ON DELETE SET NULL,
    startup_id VARCHAR(64) REFERENCES startups(id) ON DELETE CASCADE,
    department_id VARCHAR(64) REFERENCES departments(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    target_ward VARCHAR(128) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    current_day INTEGER DEFAULT 1,
    total_days INTEGER DEFAULT 90,
    budget NUMERIC(12, 2) DEFAULT 0.00,
    status VARCHAR(32) DEFAULT 'active' CHECK (status IN ('draft', 'active', 'scale_ready', 'completed', 'terminated')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Pilot KPIs Table (Outcome targets)
CREATE TABLE IF NOT EXISTS pilot_kpis (
    id VARCHAR(64) PRIMARY KEY,
    pilot_id VARCHAR(64) NOT NULL REFERENCES pilots(id) ON DELETE CASCADE,
    metric_name VARCHAR(255) NOT NULL,
    target_value NUMERIC(12, 2) NOT NULL,
    current_value NUMERIC(12, 2) NOT NULL,
    unit VARCHAR(64) NOT NULL,
    direction VARCHAR(16) CHECK (direction IN ('increase', 'decrease')),
    status VARCHAR(32) DEFAULT 'on_track'
);

-- 11. Pilot Results / Evidence Table (Verifiable telemetry logs)
CREATE TABLE IF NOT EXISTS pilot_results (
    id VARCHAR(64) PRIMARY KEY,
    pilot_id VARCHAR(64) NOT NULL REFERENCES pilots(id) ON DELETE CASCADE,
    kpi_id VARCHAR(64) REFERENCES pilot_kpis(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    verification_type VARCHAR(64) DEFAULT 'telemetry_dump',
    metrics_data JSONB DEFAULT '{}',
    status VARCHAR(32) DEFAULT 'pending_review' CHECK (status IN ('pending_review', 'verified', 'rejected')),
    file_url TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. Activity Audit Trail (Immutable governance ledger)
CREATE TABLE IF NOT EXISTS activity_logs (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    actor_name VARCHAR(255) NOT NULL,
    role VARCHAR(32) NOT NULL,
    entity_type VARCHAR(64) NOT NULL,
    entity_id VARCHAR(64) NOT NULL,
    action VARCHAR(64) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_challenges_department ON challenges(department_id);
CREATE INDEX IF NOT EXISTS idx_matches_challenge ON startup_matches(challenge_id);
CREATE INDEX IF NOT EXISTS idx_applications_challenge ON applications(challenge_id);
CREATE INDEX IF NOT EXISTS idx_pilots_startup ON pilots(startup_id);
CREATE INDEX IF NOT EXISTS idx_pilot_kpis_pilot ON pilot_kpis(pilot_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created ON activity_logs(created_at DESC);
