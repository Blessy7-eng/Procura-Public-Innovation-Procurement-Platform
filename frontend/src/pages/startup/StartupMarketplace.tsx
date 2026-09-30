import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { Challenge } from '../../types';
import {
  Target,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Send,
  ArrowRight
} from 'lucide-react';
import { AiBadge } from '../../components/AiBadge';

export const StartupMarketplace: React.FC = () => {
  const { navigate, showToast } = useApp();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [selectedChallengeForApply, setSelectedChallengeForApply] = useState<Challenge | null>(null);
  const [applyForm, setApplyForm] = useState({
    proposedApproach:
      'Deploy the EcoTrack AI platform across Ward 12 covering 5,000 households. Equip 22 collection vehicles with automated route guidance, provide sanitation supervisors with our tablet application, and launch the WhatsApp/Web grievance bot with vernacular voice support.',
    proposedTimeline: '90 days (Phase 1: 14d setup, Phase 2: 60d live pilot, Phase 3: 16d evaluation)',
    proposedCost: '$4,200 total (includes hardware mounts, cloud hosting, and field training)',
    expectedImpact:
      'Reduce citizen grievance resolution turnaround from 72h to <24h. Achieve >85% SLA adherence and 80%+ citizen satisfaction across Ward 12.'
  });

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getChallenges();
        setChallenges(data);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChallengeForApply) return;

    try {
      await api.createApplication({
        challengeId: selectedChallengeForApply.id,
        startupId: 'st-ecotrack',
        solutionId: 'sol-ecotrack-1',
        proposedApproach: applyForm.proposedApproach,
        proposedTimeline: applyForm.proposedTimeline,
        proposedCost: applyForm.proposedCost,
        expectedImpact: applyForm.expectedImpact
      });

      showToast({
        type: 'success',
        title: 'Proposal Submitted',
        message: `Submitted pilot proposal for "${selectedChallengeForApply.title}". Status: Submitted.`
      });

      setSelectedChallengeForApply(null);
      navigate('startup-applications');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <span className="text-xs font-semibold text-[#2A7C13] uppercase tracking-wider">
            Government Demand Portal
          </span>
          <h1 className="text-2xl font-bold text-[#0F172A] mt-0.5">Challenges For You</h1>
          <p className="text-xs text-[#64748B] mt-1 max-w-2xl">
            Live public innovation challenges structured for controlled field pilots. Review match compatibility, verified capability overlaps, and potential gaps.
          </p>
        </div>

        <AiBadge text="AI-explained matches • 5-factor deterministic score" />
      </div>

      {/* Challenge Cards */}
      <div className="space-y-4">
        {challenges.map(ch => {
          const isWaste = ch.id.includes('waste');
          const matchScore = isWaste ? 94 : 78;

          return (
            <div
              key={ch.id}
              className={`bg-white border rounded-2xl p-6 shadow-xs space-y-4 transition-all ${
                isWaste
                  ? 'border-[#2A7C13]/30 bg-[#FAFDF8]'
                  : 'border-[#E2E8F0] hover:border-[#CBD5E1]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-semibold bg-[#F1F5F9] text-[#475569]">
                      Urban Development Department
                    </span>
                    <span className="text-xs text-[#64748B]">
                      Pilot Duration: <strong>{ch.pilotDuration || '90 days'}</strong>
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#0F172A]">{ch.title}</h3>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] uppercase font-bold text-[#64748B]">Compatibility</span>
                  <div className="text-2xl font-bold text-[#2A7C13] font-sans">
                    {matchScore}% Match
                  </div>
                </div>
              </div>

              <p className="text-xs text-[#475569] leading-relaxed max-w-4xl">
                {ch.problemStatement}
              </p>

              {/* Match Explanation & Gaps */}
              <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] space-y-2 text-xs">
                <div className="text-[#2A7C13] font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Why you match:</span>
                </div>
                <div className="flex flex-wrap gap-2 text-[#334155]">
                  <span className="inline-flex items-center gap-1 bg-[#FAFDF8] px-2 py-0.5 rounded-md border border-[#E2E8F0] text-[11px]">
                    <CheckCircle2 className="w-3 h-3 text-[#2A7C13]" /> Waste & Grievance Management
                  </span>
                  <span className="inline-flex items-center gap-1 bg-[#FAFDF8] px-2 py-0.5 rounded-md border border-[#E2E8F0] text-[11px]">
                    <CheckCircle2 className="w-3 h-3 text-[#2A7C13]" /> Municipal Workflow Dispatch
                  </span>
                  <span className="inline-flex items-center gap-1 bg-[#FAFDF8] px-2 py-0.5 rounded-md border border-[#E2E8F0] text-[11px]">
                    <CheckCircle2 className="w-3 h-3 text-[#2A7C13]" /> Real-time Citizen SMS Platform
                  </span>
                  <span className="inline-flex items-center gap-1 bg-[#FAFDF8] px-2 py-0.5 rounded-md border border-[#E2E8F0] text-[11px]">
                    <CheckCircle2 className="w-3 h-3 text-[#2A7C13]" /> Pilot Readiness (Immediate)
                  </span>
                </div>

                <div className="text-[#64748B] flex items-start gap-1 pt-1.5 border-t border-[#F1F5F9]">
                  <AlertTriangle className="w-3.5 h-3.5 text-[#D97706] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-[#334155]">Potential gap:</strong> Your current solution profile does not list an offline deployment mode for low-connectivity zones.
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <div className="flex flex-wrap gap-1">
                  {ch.requiredCapabilities?.slice(0, 4).map((c, i) => (
                    <span key={i} className="px-2 py-0.5 rounded text-[10px] bg-[#F1F5F9] text-[#64748B]">
                      {c}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => setSelectedChallengeForApply(ch)}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#2A7C13] hover:bg-[#236810] text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Apply to Challenge</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Apply to Challenge Modal */}
      {selectedChallengeForApply && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white border border-[#E2E8F0] rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
              <div>
                <span className="text-[10px] font-semibold text-[#2A7C13] uppercase tracking-wider">
                  Pilot Proposal Submission
                </span>
                <h3 className="text-sm font-bold text-[#0F172A] mt-0.5">
                  Apply to: {selectedChallengeForApply.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedChallengeForApply(null)}
                className="text-[#94A3B8] hover:text-[#0F172A] p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-[#FAFDF8] rounded-xl border border-[#E2E8F0] text-xs text-[#475569]">
              Selected Solution: <strong className="text-[#0F172A]">AI Waste Management Platform (EcoTrack Technologies)</strong> • Pilot Duration: {selectedChallengeForApply.pilotDuration || '90 days'}
            </div>

            <form onSubmit={handleApplySubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-[#334155] mb-1">
                  Proposed Approach & Field Methodology
                </label>
                <textarea
                  rows={3}
                  value={applyForm.proposedApproach}
                  onChange={e => setApplyForm({ ...applyForm, proposedApproach: e.target.value })}
                  className="w-full p-3 bg-white border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2A7C13]/30 focus:border-[#2A7C13]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#334155] mb-1">
                    Implementation Timeline
                  </label>
                  <input
                    type="text"
                    value={applyForm.proposedTimeline}
                    onChange={e => setApplyForm({ ...applyForm, proposedTimeline: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2A7C13]/30 focus:border-[#2A7C13]"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#334155] mb-1">
                    Proposed Pilot Budget
                  </label>
                  <input
                    type="text"
                    value={applyForm.proposedCost}
                    onChange={e => setApplyForm({ ...applyForm, proposedCost: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2A7C13]/30 focus:border-[#2A7C13]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-[#334155] mb-1">
                  Expected Impact & Measurable Outcome Targets
                </label>
                <textarea
                  rows={2}
                  value={applyForm.expectedImpact}
                  onChange={e => setApplyForm({ ...applyForm, expectedImpact: e.target.value })}
                  className="w-full p-3 bg-white border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2A7C13]/30 focus:border-[#2A7C13]"
                  required
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-[#F1F5F9]">
                <button
                  type="button"
                  onClick={() => setSelectedChallengeForApply(null)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-[#64748B] hover:text-[#0F172A] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#2A7C13] hover:bg-[#236810] text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  Submit Proposal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
