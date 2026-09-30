-- PROCURA Database Schema for Supabase PostgreSQL
-- Public Innovation Procurement Platform
-- Supporting Government Departments, Startups, and Evaluators

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('government', 'startup', 'evaluator', 'admin')),
    organization_id UUID,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. DEPARTMENTS TABLE
CREATE TABLE IF NOT EXISTS departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    department_type VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    description TEXT,
    contact_email VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. STARTUPS TABLE
CREATE TABLE IF NOT EXISTS startups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    logo_url TEXT,
    description TEXT NOT NULL,
    website VARCHAR(255),
    location VARCHAR(255) NOT NULL,
    founder_name VARCHAR(255) NOT NULL,
    team_size VARCHAR(50),
    industry VARCHAR(100) NOT NULL,
    technologies TEXT[] DEFAULT '{}',
    startup_recognition VARCHAR(255), -- e.g. DPIIT / State Startup Cell
    verification_status VARCHAR(50) DEFAULT 'verified' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
    profile_completeness INT DEFAULT 70,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. STARTUP SOLUTIONS TABLE
CREATE TABLE IF NOT EXISTS startup_solutions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    startup_id UUID NOT NULL REFERENCES startups(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    problem_solved TEXT NOT NULL,
    capabilities TEXT[] DEFAULT '{}',
    technology VARCHAR(255),
    deployment_model VARCHAR(100) DEFAULT 'Cloud SaaS',
    implementation_time VARCHAR(100),
    estimated_cost VARCHAR(100),
    previous_deployments TEXT,
    pilot_readiness VARCHAR(50) DEFAULT 'High' CHECK (pilot_readiness IN ('Low', 'Medium', 'High', 'Immediate')),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('draft', 'active', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. STARTUP DOCUMENTS TABLE
CREATE TABLE IF NOT EXISTS startup_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    startup_id UUID NOT NULL REFERENCES startups(id) ON DELETE CASCADE,
    solution_id UUID REFERENCES startup_solutions(id) ON DELETE SET NULL,
    document_name VARCHAR(255) NOT NULL,
    document_type VARCHAR(100) NOT NULL,
    document_url TEXT NOT NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. CHALLENGES TABLE
CREATE TABLE IF NOT EXISTS challenges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    problem_statement TEXT NOT NULL,
    target_users TEXT[] DEFAULT '{}',
    expected_outcomes TEXT[] DEFAULT '{}',
    required_capabilities TEXT[] DEFAULT '{}',
    eligibility_requirements TEXT[] DEFAULT '{}',
    suggested_kpis TEXT[] DEFAULT '{}',
    pilot_duration VARCHAR(100) DEFAULT '90 days',
    status VARCHAR(50) DEFAULT 'published' CHECK (status IN ('draft', 'published', 'evaluation', 'pilot_active', 'closed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. STARTUP MATCHES TABLE
CREATE TABLE IF NOT EXISTS startup_matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
    startup_id UUID NOT NULL REFERENCES startups(id) ON DELETE CASCADE,
    solution_id UUID REFERENCES startup_solutions(id) ON DELETE SET NULL,
    match_score INT NOT NULL CHECK (match_score >= 0 AND match_score <= 100),
    matching_capabilities TEXT[] DEFAULT '{}',
    potential_gaps TEXT,
    match_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
    startup_id UUID NOT NULL REFERENCES startups(id) ON DELETE CASCADE,
    solution_id UUID NOT NULL REFERENCES startup_solutions(id) ON DELETE CASCADE,
    proposed_approach TEXT NOT NULL,
    proposed_timeline VARCHAR(100) NOT NULL,
    proposed_cost VARCHAR(100) NOT NULL,
    expected_impact TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'submitted' CHECK (status IN ('submitted', 'eligibility_review', 'under_evaluation', 'shortlisted', 'rejected', 'pilot_selected')),
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. EVALUATIONS TABLE
CREATE TABLE IF NOT EXISTS evaluations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    evaluator_id UUID REFERENCES users(id) ON DELETE SET NULL,
    problem_fit INT CHECK (problem_fit BETWEEN 0 AND 100),
    technical_feasibility INT CHECK (technical_feasibility BETWEEN 0 AND 100),
    innovation INT CHECK (innovation BETWEEN 0 AND 100),
    scalability INT CHECK (scalability BETWEEN 0 AND 100),
    cost_effectiveness INT CHECK (cost_effectiveness BETWEEN 0 AND 100),
    total_score DECIMAL(5,2),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. PILOTS TABLE
CREATE TABLE IF NOT EXISTS pilots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
    startup_id UUID NOT NULL REFERENCES startups(id) ON DELETE CASCADE,
    solution_id UUID NOT NULL REFERENCES startup_solutions(id) ON DELETE CASCADE,
    application_id UUID REFERENCES applications(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    duration_days INT DEFAULT 90,
    pilot_area VARCHAR(255) NOT NULL,
    target_users VARCHAR(255) NOT NULL,
    objectives TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'running' CHECK (status IN ('planned', 'running', 'completed', 'scale_up_review', 'closed')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    current_day INT DEFAULT 47,
    overall_kpi_achievement INT DEFAULT 0,
    ai_summary JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. PILOT KPIS TABLE
CREATE TABLE IF NOT EXISTS pilot_kpis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pilot_id UUID NOT NULL REFERENCES pilots(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    baseline_value VARCHAR(100) NOT NULL,
    target_value VARCHAR(100) NOT NULL,
    current_value VARCHAR(100) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'on_track' CHECK (status IN ('on_track', 'achieved', 'at_risk', 'missed'))
);

-- 13. PILOT RESULTS & EVIDENCE TABLE
CREATE TABLE IF NOT EXISTS pilot_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pilot_id UUID NOT NULL REFERENCES pilots(id) ON DELETE CASCADE,
    submitted_by VARCHAR(255) NOT NULL,
    evidence_title VARCHAR(255) NOT NULL,
    evidence_description TEXT NOT NULL,
    metric_result VARCHAR(255),
    evidence_url TEXT,
    validation_status VARCHAR(50) DEFAULT 'pending' CHECK (validation_status IN ('pending', 'validated', 'needs_clarification', 'rejected')),
    evaluator_notes TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 14. ACTIVITY LOGS (AUDIT TRAIL) TABLE
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    actor_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(255) NOT NULL,
    action VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_challenges_dept ON challenges(department_id);
CREATE INDEX IF NOT EXISTS idx_applications_challenge ON applications(challenge_id);
CREATE INDEX IF NOT EXISTS idx_applications_startup ON applications(startup_id);
CREATE INDEX IF NOT EXISTS idx_matches_challenge ON startup_matches(challenge_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_app ON evaluations(application_id);
CREATE INDEX IF NOT EXISTS idx_pilots_challenge ON pilots(challenge_id);
CREATE INDEX IF NOT EXISTS idx_pilot_kpis_pilot ON pilot_kpis(pilot_id);
CREATE INDEX IF NOT EXISTS idx_pilot_results_pilot ON pilot_results(pilot_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created ON activity_logs(created_at DESC);
