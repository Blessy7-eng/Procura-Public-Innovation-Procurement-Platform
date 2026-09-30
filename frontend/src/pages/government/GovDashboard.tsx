import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { Challenge, Pilot } from '../../types';
import {
  Target,
  Rocket,
  Activity,
  Award,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  Building2,
  Users,
  CheckCircle2,
  Home
} from 'lucide-react';

export const GovDashboard: React.FC = () => {
  const { navigate, currentUser } = useApp();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [pilots, setPilots] = useState<Pilot[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [chData, plData] = await Promise.all([
          api.getChallenges(),
          api.getPilots()
        ]);
        setChallenges(chData);
        setPilots(plData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const stats = [
    { label: 'Active Challenges', value: '4', icon: Target, detail: '2 in evaluation phase' },
    { label: 'Startups Evaluated', value: '18', icon: Rocket, detail: '5 matching high threshold' },
    { label: 'Active Pilots', value: '3', icon: Activity, detail: 'Ward 12 pilot at Day 47' },
    { label: 'Completed Pilots', value: '7', icon: Award, detail: 'Ready for scale-up review' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Welcome Header */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#2A7C13] uppercase tracking-wider">
            <Building2 className="w-4 h-4" />
            <span>Urban Development Department</span>
          </div>
          <h1 className="text-2xl font-bold text-[#0F172A]">
            Good afternoon, {currentUser?.name?.split(' ')[0] || 'Officer'}
          </h1>
          <p className="text-xs text-[#64748B] max-w-2xl leading-relaxed">
            Manage municipal innovation challenges, discover startup solutions, and monitor real-world pilot evidence before public scale-up.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => navigate('landing')}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white hover:bg-[#F8FAFC] text-[#334155] hover:text-[#0F172A] font-semibold text-xs border border-[#CBD5E1] shadow-2xs transition-colors cursor-pointer"
            title="Go to Procura Home Page"
          >
            <Home className="w-4 h-4 text-[#2A7C13]" />
            <span>Home</span>
          </button>

          <button
            onClick={() => navigate('gov-create-challenge')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2A7C13] hover:bg-[#236810] text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create a Challenge</span>
          </button>
        </div>
      </div>

      {/* Summary Cards (Clean White with subtle border & green accents) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={idx}
              className="bg-white border border-[#E2E8F0] rounded-xl p-5 hover:border-[#CBD5E1] transition-all shadow-xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#64748B]">{s.label}</span>
                <div className="w-8 h-8 rounded-lg bg-[#F0F8EC] text-[#2A7C13] flex items-center justify-center">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-bold text-[#0F172A] mt-2 font-sans">{s.value}</div>
              <div className="text-[11px] text-[#64748B] mt-1">{s.detail}</div>
            </div>
          );
        })}
      </div>

      {/* Main Section: Active Pilot with Horizontal Progress Indicators */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#F1F5F9]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#F0F8EC] text-[#2A7C13] border border-[#2A7C13]/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2A7C13] animate-pulse"></span>
                Active Pilot: Day 47 of 90
              </span>
              <span className="text-xs text-[#64748B]">Ward 12 (Central Municipal Zone)</span>
            </div>
            <h2 className="text-xl font-bold text-[#0F172A]">
              Municipal Waste Management Pilot
            </h2>
            <p className="text-xs text-[#475569]">
              Partner Startup: <strong className="text-[#0F172A]">EcoTrack Technologies</strong> • 5,000 citizens • 22 collection trucks
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('gov-pilot-detail', { pilotId: 'plt-waste-1' })}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-[#F8FAFC] text-[#334155] text-xs font-semibold border border-[#E2E8F0] transition-colors cursor-pointer"
            >
              <span>Monitor Telemetry</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#2A7C13]" />
            </button>

            <button
              onClick={() => navigate('gov-scale-up-review', { pilotId: 'plt-waste-1' })}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2A7C13] hover:bg-[#236810] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Scale-up Review</span>
            </button>
          </div>
        </div>

        {/* Horizontal Progress Indicators for KPIs (Restrained Green) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {/* KPI 1 */}
          <div className="bg-[#FAFDF8] border border-[#E2E8F0] rounded-xl p-4 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-[#0F172A]">Resolution Time</span>
              <span className="text-[11px] font-bold text-[#2A7C13]">72h → 18h</span>
            </div>
            <div className="w-full h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
              <div className="h-full bg-[#2A7C13] rounded-full" style={{ width: '85%' }} />
            </div>
            <div className="flex justify-between text-[10px] text-[#64748B]">
              <span>Baseline: 72h</span>
              <span className="text-[#2A7C13] font-semibold">Target &lt;24h (Achieved)</span>
            </div>
          </div>

          {/* KPI 2 */}
          <div className="bg-[#FAFDF8] border border-[#E2E8F0] rounded-xl p-4 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-[#0F172A]">SLA Compliance</span>
              <span className="text-[11px] font-bold text-[#2A7C13]">51% → 89%</span>
            </div>
            <div className="w-full h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
              <div className="h-full bg-[#2A7C13] rounded-full" style={{ width: '89%' }} />
            </div>
            <div className="flex justify-between text-[10px] text-[#64748B]">
              <span>Baseline: 51%</span>
              <span className="text-[#2A7C13] font-semibold">Target &gt;85% (Achieved)</span>
            </div>
          </div>

          {/* KPI 3 */}
          <div className="bg-[#FAFDF8] border border-[#E2E8F0] rounded-xl p-4 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-[#0F172A]">Citizen Satisfaction</span>
              <span className="text-[11px] font-bold text-[#2A7C13]">62% → 84%</span>
            </div>
            <div className="w-full h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
              <div className="h-full bg-[#2A7C13] rounded-full" style={{ width: '84%' }} />
            </div>
            <div className="flex justify-between text-[10px] text-[#64748B]">
              <span>Baseline: 62%</span>
              <span className="text-[#2A7C13] font-semibold">Target &gt;80% (Achieved)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Your Innovation Challenges Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#0F172A]">Your Innovation Challenges</h2>
            <p className="text-xs text-[#64748B]">Challenges open for startup discovery and pilot submissions</p>
          </div>
          <button
            onClick={() => navigate('gov-challenges')}
            className="text-xs text-[#2A7C13] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
          >
            <span>View All (4)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Challenge 1 */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 hover:border-[#CBD5E1] transition-all flex flex-col justify-between shadow-xs">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#F0F8EC] text-[#2A7C13] border border-[#2A7C13]/20">
                  Startup Evaluation
                </span>
                <span className="text-xs text-[#2A7C13] font-semibold flex items-center gap-1">
                  <Rocket className="w-3.5 h-3.5" />
                  6 startups matched
                </span>
              </div>
              <h3 className="text-sm font-bold text-[#0F172A]">
                Intelligent Waste Collection Complaint Management
              </h3>
              <p className="text-xs text-[#475569] line-clamp-2 leading-relaxed">
                Municipal solid waste collection grievance workflows currently operate on manual registers. Need real-time SMS tracking, route optimization, and SLA escalation.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#F1F5F9] text-[#475569]">Complaint management</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#F1F5F9] text-[#475569]">Municipal workflow</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#F1F5F9] text-[#475569]">Citizen platform</span>
              </div>
            </div>

            <div className="pt-3 mt-3 border-t border-[#F1F5F9] flex items-center justify-between text-xs">
              <span className="text-[11px] text-[#64748B]">Pilot Duration: 90 days</span>
              <button
                onClick={() => navigate('gov-challenge-detail', { challengeId: 'ch-waste-1' })}
                className="text-[#2A7C13] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>Find Matching Startups</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Challenge 2 */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 hover:border-[#CBD5E1] transition-all flex flex-col justify-between shadow-xs">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#F0F8EC] text-[#2A7C13] border border-[#2A7C13]/20">
                  Pilot Running
                </span>
                <span className="text-xs text-[#2A7C13] font-semibold flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  72% KPI achievement
                </span>
              </div>
              <h3 className="text-sm font-bold text-[#0F172A]">
                Citizen Complaint Resolution & Streetlight SLA Automation
              </h3>
              <p className="text-xs text-[#475569] line-clamp-2 leading-relaxed">
                Street lighting dark spot complaints take over 5 days to resolve due to lack of inventory tracking. Seeking automated fault reporting and verification.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#F1F5F9] text-[#475569]">Municipal workflow</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#F1F5F9] text-[#475569]">Analytics & reporting</span>
              </div>
            </div>

            <div className="pt-3 mt-3 border-t border-[#F1F5F9] flex items-center justify-between text-xs">
              <span className="text-[11px] text-[#64748B]">Pilot Duration: 60 days</span>
              <button
                onClick={() => navigate('gov-challenge-detail', { challengeId: 'ch-citizen-2' })}
                className="text-[#2A7C13] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>View Challenge</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
