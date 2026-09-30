import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Rocket,
  Target,
  FileText,
  Activity,
  Award,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Building,
  Home
} from 'lucide-react';
import { VerificationBadge } from '../../components/AiBadge';

export const StartupDashboard: React.FC = () => {
  const { navigate } = useApp();

  const stats = [
    { label: 'Profile Completeness', value: '85%', icon: Building, note: 'Solution & credentials added' },
    { label: 'Matching Challenges', value: '3', icon: Target, note: 'High compatibility >80%' },
    { label: 'Proposals Submitted', value: '2', icon: FileText, note: '1 under active review' },
    { label: 'Shortlisted', value: '1', icon: Award, note: 'Selected for municipal pilot' }
  ];

  return (
    <div className="space-y-6">
      {/* Friendly Startup Header */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-xs">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#0F172A]">Good morning, EcoTrack</h1>
            <VerificationBadge status="verified" />
          </div>
          <p className="text-xs text-[#475569] max-w-xl">
            Find government challenges where your solution can create measurable impact.
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
            onClick={() => navigate('startup-marketplace')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2A7C13] hover:bg-[#236810] text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer shrink-0"
          >
            <Target className="w-4 h-4" />
            <span>Explore Challenges</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div key={idx} className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#64748B]">{s.label}</span>
                <div className="w-8 h-8 rounded-lg bg-[#F0F8EC] text-[#2A7C13] flex items-center justify-center">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-bold text-[#0F172A] mt-2 font-sans">{s.value}</div>
              <div className="text-[11px] text-[#64748B] mt-1">{s.note}</div>
            </div>
          );
        })}
      </div>

      {/* Active Pilot Highlight */}
      <div className="bg-[#FAFDF8] border border-[#2A7C13]/30 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white text-[#2A7C13] border border-[#2A7C13]/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2A7C13] animate-pulse"></span>
                Active Pilot: Day 47 of 90
              </span>
              <span className="text-xs text-[#64748B]">Urban Development Department</span>
            </div>
            <h3 className="text-lg font-bold text-[#0F172A]">
              Municipal Waste Management Pilot — Ward 12
            </h3>
            <p className="text-xs text-[#475569] max-w-2xl leading-relaxed">
              Target: Reduce grievance resolution time to &lt;24 hours. Current verified telemetry: 18 hours across 1,420 resolved tickets.
            </p>
          </div>

          <button
            onClick={() => navigate('startup-pilot-view')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2A7C13] hover:bg-[#236810] text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer shrink-0"
          >
            <Activity className="w-4 h-4" />
            <span>Open Pilot & Submit Evidence</span>
          </button>
        </div>
      </div>

      {/* Recommended Challenge */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-[#0F172A]">Recommended Challenge</h2>

        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#F1F5F9] text-[#475569]">
                  Urban Development Department
                </span>
                <span className="text-xs text-[#64748B]">90 Days Pilot</span>
              </div>
              <h3 className="text-base font-bold text-[#0F172A]">
                Smart Waste Collection Monitoring
              </h3>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[10px] uppercase font-bold text-[#64748B]">Compatibility</span>
              <div className="text-2xl font-bold text-[#2A7C13] font-sans">94% Match</div>
            </div>
          </div>

          <p className="text-xs text-[#475569] leading-relaxed">
            Municipal waste collection grievance workflows currently operate on manual phone registers. Department seeking automated triaging, driver routing, and SMS tracking.
          </p>

          <div className="bg-[#FAFDF8] p-4 rounded-xl border border-[#E2E8F0] space-y-2 text-xs">
            <div className="text-[#2A7C13] font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Why Procura matched you:</span>
            </div>
            <div className="flex flex-wrap gap-2 text-[#334155]">
              <span className="inline-flex items-center gap-1 bg-white px-2 py-0.5 rounded-md border border-[#E2E8F0] text-[11px]">
                <CheckCircle2 className="w-3 h-3 text-[#2A7C13]" /> Waste management
              </span>
              <span className="inline-flex items-center gap-1 bg-white px-2 py-0.5 rounded-md border border-[#E2E8F0] text-[11px]">
                <CheckCircle2 className="w-3 h-3 text-[#2A7C13]" /> IoT monitoring
              </span>
              <span className="inline-flex items-center gap-1 bg-white px-2 py-0.5 rounded-md border border-[#E2E8F0] text-[11px]">
                <CheckCircle2 className="w-3 h-3 text-[#2A7C13]" /> Municipal deployment
              </span>
            </div>

            <div className="text-[#64748B] flex items-start gap-1 pt-1.5 border-t border-[#E2E8F0]">
              <AlertTriangle className="w-3.5 h-3.5 text-[#D97706] shrink-0 mt-0.5" />
              <span>
                <strong className="text-[#334155]">Potential gap:</strong> Previous deployment evidence in offline environments
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex flex-wrap gap-1">
              <span className="px-2 py-0.5 rounded text-[10px] bg-[#F1F5F9] text-[#64748B]">Grievance handling</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-[#F1F5F9] text-[#64748B]">Driver telematics</span>
            </div>

            <button
              onClick={() => navigate('startup-marketplace')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-[#F8FAFC] text-[#2A7C13] font-semibold text-xs border border-[#CBD5E1] transition-colors cursor-pointer"
            >
              <span>View Challenge</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
