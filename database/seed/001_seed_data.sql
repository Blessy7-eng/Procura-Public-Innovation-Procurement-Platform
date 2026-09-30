-- ====================================================================
-- PROCURA: Public Innovation Procurement Platform
-- Seed Data: 001_seed_data.sql
-- ====================================================================

-- Departments
INSERT INTO departments (id, name, state, city, jurisdiction) VALUES
('dept-1', 'Urban Development & Smart Cities Mission', 'Maharashtra', 'Pune', 'Municipal Corporation Zone 4'),
('dept-2', 'Public Works & Transportation Department', 'Karnataka', 'Bengaluru', 'Metropolitan Transport Region')
ON CONFLICT (id) DO NOTHING;

-- Users
INSERT INTO users (id, name, email, role, organization_id, avatar_url) VALUES
('usr-gov-1', 'Officer Rajesh Varma', 'rajesh.varma@urban.gov.in', 'government', 'dept-1', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'),
('usr-startup-1', 'Aarav Sharma', 'aarav@ecotrack.io', 'startup', 'start-1', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'),
('usr-eval-1', 'Dr. Priya Sundaram', 'priya.sundaram@iitb.ac.in', 'evaluator', 'dept-1', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80')
ON CONFLICT (id) DO NOTHING;

-- Startups
INSERT INTO startups (id, name, tagline, description, founded_year, website, dpiit_number, stage, sector, team_size, location, logo_url) VALUES
('start-1', 'EcoTrack Technologies', 'IoT-Powered Decentralized Municipal Waste Triage', 'Enterprise environmental monitoring startup specializing in edge IoT sensor telemetry and dynamic municipal route optimization.', 2023, 'https://ecotrack.io', 'DIPP-89412', 'Pilot Ready', 'Waste Management', '12-25', 'Pune, India', 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=150&auto=format&fit=crop&q=80'),
('start-2', 'AquaSense Systems', 'Real-time Water Quality and Distribution Telemetry', 'AIoT sensor array detecting non-revenue water losses and biological contaminants across municipal supply lines.', 2022, 'https://aquasense.in', 'DIPP-77219', 'Commercial Ready', 'Water & Sanitation', '20-50', 'Bengaluru, India', 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=150&auto=format&fit=crop&q=80')
ON CONFLICT (id) DO NOTHING;

-- Startup Solutions
INSERT INTO startup_solutions (id, startup_id, name, description, capabilities, sector, stage, pricing_model) VALUES
('sol-1', 'start-1', 'EcoTrack Municipal AI Suite', 'End-to-end municipal grievance tracker featuring auto-triage, driver dispatch, and bin sensor telemetry.', ARRAY['Complaint management', 'Municipal workflow', 'IoT telemetry', 'Dynamic routing', 'Citizen alerts'], 'Waste Management', 'Pilot Ready', 'Monthly Ward SaaS + Hardware Rental'),
('sol-2', 'start-2', 'AquaSense Smart Grid', 'SCADA-compatible distribution monitoring with acoustic leak pinpointing.', ARRAY['Water leakage detection', 'IoT telemetry', 'SCADA integration', 'Automated alerts'], 'Water & Sanitation', 'Commercial Ready', 'Annual Per-Kilometer License')
ON CONFLICT (id) DO NOTHING;

-- Challenges
INSERT INTO challenges (id, department_id, created_by, title, problem_statement, target_users, expected_outcomes, required_capabilities, eligibility_requirements, suggested_kpis, pilot_duration, status) VALUES
('ch-waste-1', 'dept-1', 'usr-gov-1', 'Decentralized Municipal Solid Waste Complaint Triage', 'Current citizen grievance resolution for overflowing community bins in high-density wards exceeds 72 hours due to paper logs and manual route reallocation.', ARRAY['Ward Sanitation Inspectors', 'Citizens of Ward 12', 'Sanitation Truck Drivers'], ARRAY['Reduce turnaround to <24h', 'Provide live tracking to citizens', 'Generate automated heatmaps'], ARRAY['Complaint management', 'Municipal workflow', 'IoT telemetry'], ARRAY['DPIIT Registered', 'ISO 27001 or SOC2 compliance', 'Previous municipal sandbox experience'], ARRAY['Average resolution time < 24 hours', 'Citizen CSAT > 80%', 'SLA compliance > 90%'], '90 days', 'published')
ON CONFLICT (id) DO NOTHING;

-- Pilots
INSERT INTO pilots (id, challenge_id, startup_id, department_id, title, target_ward, start_date, end_date, current_day, total_days, budget, status) VALUES
('plt-waste-1', 'ch-waste-1', 'start-1', 'dept-1', 'Ward 12 Municipal Waste Management Pilot', 'Ward 12 (Central Zone)', '2026-08-15', '2026-11-13', 47, 90, 850000.00, 'active')
ON CONFLICT (id) DO NOTHING;

-- Pilot KPIs
INSERT INTO pilot_kpis (id, pilot_id, metric_name, target_value, current_value, unit, direction, status) VALUES
('kpi-1', 'plt-waste-1', 'Grievance Resolution Time', 24.0, 18.2, 'hours', 'decrease', 'exceeded'),
('kpi-2', 'plt-waste-1', 'Citizen Satisfaction Score', 80.0, 87.5, '%', 'increase', 'on_track'),
('kpi-3', 'plt-waste-1', 'SLA Adherence Rate', 90.0, 94.1, '%', 'increase', 'on_track')
ON CONFLICT (id) DO NOTHING;
