import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Shield,
  ArrowRight,
  Target,
  Sparkles,
  CheckCircle2,
  Building2,
  Rocket,
  Scale,
  LayoutDashboard
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { loginWithRole, currentUser, role, navigate } = useApp();

  const handleReturnToDashboard = () => {
    const dash = role === 'government' ? 'gov-dashboard' : role === 'startup' ? 'startup-dashboard' : 'eval-dashboard';
    navigate(dash);
  };

  const handleGovEntry = async () => {
    await loginWithRole('government');
  };

  const handleStartupEntry = async () => {
    await loginWithRole('startup');
  };

  const handleEvaluatorEntry = async () => {
    await loginWithRole('evaluator');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-12 pb-16 border-b border-[#E2E8F0] bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F0F8EC] border border-[#2A7C13]/20 text-[#2A7C13] text-xs font-semibold mb-5">
            <Shield className="w-3.5 h-3.5" />
            <span>Public Innovation Procurement Platform</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0F172A] max-w-4xl mx-auto leading-tight">
            From Government Problems to <span className="text-[#2A7C13]">Proven Solutions</span>.
          </h1>

          <p className="mt-4 text-base sm:text-lg text-[#475569] max-w-2xl mx-auto font-normal leading-relaxed">
            Procura connects government demand with startup innovation and turns promising ideas into measurable pilot evidence before scale-up.
          </p>

          <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-[#2A7C13]">
            Discover better • Test safely • Decide with evidence
          </p>

          {/* Logged-in Quick Return or Role Entry Points */}
          {currentUser ? (
            <div className="mt-8 flex flex-col items-center gap-3">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F0F8EC] border border-[#2A7C13]/30 text-xs text-[#2A7C13]">
                <CheckCircle2 className="w-4 h-4 text-[#2A7C13]" />
                <span>
                  Currently signed in as <strong>{currentUser.name}</strong> ({role.toUpperCase()})
                </span>
              </div>
              <button
                onClick={handleReturnToDashboard}
                className="flex items-center justify-center gap-2.5 px-7 py-3 rounded-xl bg-[#2A7C13] hover:bg-[#236810] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Go to My Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
                <button
                  onClick={handleGovEntry}
                  className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-[#2A7C13] hover:bg-[#236810] text-white font-semibold text-xs shadow-sm transition-all cursor-pointer"
                >
                  <Building2 className="w-4 h-4" />
                  <span>I'm a Government Department</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={handleStartupEntry}
                  className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-white hover:bg-[#F8FAFC] text-[#0F172A] border border-[#CBD5E1] font-semibold text-xs shadow-xs transition-all cursor-pointer"
                >
                  <Rocket className="w-4 h-4 text-[#2A7C13]" />
                  <span>I'm a Startup</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#64748B]" />
                </button>
              </div>

              {/* Third Evaluator Link */}
              <div className="mt-4">
                <button
                  onClick={handleEvaluatorEntry}
                  className="text-xs text-[#64748B] hover:text-[#2A7C13] underline underline-offset-4 flex items-center justify-center gap-1 mx-auto cursor-pointer font-medium"
                >
                  <Scale className="w-3.5 h-3.5" />
                  Access as Evaluator / Review Committee
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* The 5-Stage Core Innovation Procurement Loop */}
      <section className="py-14 border-b border-[#E2E8F0] bg-[#FAFDF8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-xs font-bold tracking-widest text-[#2A7C13] uppercase">
              The Procura Workflow
            </h2>
            <p className="mt-1 text-xl font-bold text-[#0F172A]">
              End-to-End Innovation Governance
            </p>
            <p className="text-xs text-[#64748B] mt-1">
              Structured from problem definition to verifiable KPI scale-up reviews.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
            {/* Step 1 */}
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-xs space-y-2">
              <div className="w-7 h-7 rounded-lg bg-[#F0F8EC] text-[#2A7C13] font-bold text-xs flex items-center justify-center font-mono">
                01
              </div>
              <div className="text-xs font-bold text-[#0F172A]">Identify</div>
              <div className="text-[11px] font-semibold text-[#2A7C13]">Structured Challenge</div>
              <p className="text-[11px] text-[#64748B] leading-relaxed">
                Officers describe problems in plain words. AI structures outcomes, capabilities, and pilot KPIs.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-xs space-y-2">
              <div className="w-7 h-7 rounded-lg bg-[#F0F8EC] text-[#2A7C13] font-bold text-xs flex items-center justify-center font-mono">
                02
              </div>
              <div className="text-xs font-bold text-[#0F172A]">Discover</div>
              <div className="text-[11px] font-semibold text-[#2A7C13]">5-Factor Matching</div>
              <p className="text-[11px] text-[#64748B] leading-relaxed">
                Deterministic matching computes compatibility across capabilities, readiness, and history with AI explanations.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-xs space-y-2">
              <div className="w-7 h-7 rounded-lg bg-[#F0F8EC] text-[#2A7C13] font-bold text-xs flex items-center justify-center font-mono">
                03
              </div>
              <div className="text-xs font-bold text-[#0F172A]">Evaluate</div>
              <div className="text-[11px] font-semibold text-[#2A7C13]">Multi-Criteria Scoring</div>
              <p className="text-[11px] text-[#64748B] leading-relaxed">
                Independent evaluators score proposals across Problem Fit, Feasibility, Innovation, Scale, and Cost.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-xs space-y-2">
              <div className="w-7 h-7 rounded-lg bg-[#F0F8EC] text-[#2A7C13] font-bold text-xs flex items-center justify-center font-mono">
                04
              </div>
              <div className="text-xs font-bold text-[#0F172A]">Pilot</div>
              <div className="text-[11px] font-semibold text-[#2A7C13]">Controlled Field Trial</div>
              <p className="text-[11px] text-[#64748B] leading-relaxed">
                60–90 day controlled rollout in specific zones (e.g. Ward 12) with real citizens and automated telemetry.
              </p>
            </div>

            {/* Step 5 */}
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-xs space-y-2">
              <div className="w-7 h-7 rounded-lg bg-[#F0F8EC] text-[#2A7C13] font-bold text-xs flex items-center justify-center font-mono">
                05
              </div>
              <div className="text-xs font-bold text-[#0F172A]">Scale</div>
              <div className="text-[11px] font-semibold text-[#2A7C13]">Evidence Review</div>
              <p className="text-[11px] text-[#64748B] leading-relaxed">
                Validated KPI achievements (e.g. 91%) unlock formal scale-up review backed by indisputable proof.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Innovation Procurement differs from traditional tenders */}
      <section className="py-14 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-2 text-[#2A7C13] text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Public Procurement Modernization</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-[#0F172A] mb-2">
              Why Traditional Procurement Stalls Startup Innovation
            </h3>
            <p className="text-[#475569] text-xs leading-relaxed mb-5">
              Traditional procurement is designed around standardised commodity products with 3-year audited turnover requirements, rigid spec sheets, and high bank guarantees. Innovative startup solutions require problem discovery, controlled field pilots, and measurable evidence before public scale-up.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-[#F1F5F9] text-xs">
              <div className="p-4 rounded-xl bg-[#FFFDF5] border border-[#FBE6C2]">
                <div className="font-bold text-[#9A6700] mb-2 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#D97706]"></span>
                  Traditional Tenders (Lowest Bidder)
                </div>
                <ul className="space-y-1 text-[#64748B] text-[11px]">
                  <li>• Requires 3–5 years of audited financial turnover</li>
                  <li>• Fixed specifications lock out novel technological approaches</li>
                  <li>• High risk of failed deployment without early testing</li>
                  <li>• Startups disqualified before demonstrating capability</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-[#F0F8EC] border border-[#2A7C13]/20">
                <div className="font-bold text-[#2A7C13] mb-2 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#2A7C13]"></span>
                  Procura Innovation Procurement
                </div>
                <ul className="space-y-1 text-[#334155] text-[11px]">
                  <li>• Focuses on measurable problem outcomes & capabilities</li>
                  <li>• Controlled 60–90 day pilot de-risks public adoption</li>
                  <li>• Real citizen telemetry validates claims before scaling</li>
                  <li>• Audited activity trail gives government officers safety</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-6 border-t border-[#E2E8F0] bg-white text-[#64748B] text-xs text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#0F172A]">PROCURA</span>
            <span>•</span>
            <span>Public Innovation Procurement Platform</span>
          </div>
          <div>
            AI-Assisted Decision Support • Final decisions remain with authorised officials.
          </div>
        </div>
      </footer>
    </div>
  );
};
