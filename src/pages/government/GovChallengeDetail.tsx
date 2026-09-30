import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { Challenge, StartupMatch } from '../../types';
import {
  Rocket,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Clock,
  Play,
  FileText
} from 'lucide-react';
import { AiBadge } from '../../components/AiBadge';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { ConfirmationModal } from '../../components/ConfirmationModal';

export const GovChallengeDetail: React.FC = () => {
  const { selectedChallengeId, navigate, showToast } = useApp();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [matches, setMatches] = useState<StartupMatch[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedMatchModal, setSelectedMatchModal] = useState<StartupMatch | null>(null);
  const [pilotConfirmStartup, setPilotConfirmStartup] = useState<{ startupId: string; solutionId: string; startupName: string } | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [chData, matchesData] = await Promise.all([
          api.getChallenge(selectedChallengeId || 'ch-waste-1'),
          api.getMatches(selectedChallengeId || 'ch-waste-1')
        ]);
        setChallenge(chData);
        setMatches(matchesData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [selectedChallengeId]);

  if (loading || !challenge) {
    return (
      <div className="py-20 text-center text-[#64748B] text-xs">
        Loading challenge details and matching algorithms...
      </div>
    );
  }

  const handleLaunchPilot = (startupId: string, solutionId: string) => {
    navigate('gov-pilot-detail', { pilotId: 'plt-waste-1' });
    showToast({
      type: 'info',
      title: 'Viewing Controlled Pilot',
      message: 'Monitoring active 90-day pilot for Ward 12.'
    });
  };

  return (
    <div className="space-y-4">
      <Breadcrumbs
        items={[
          { label: 'Challenges', view: 'gov-challenges' },
          { label: challenge.title }
        ]}
      />

      {/* Top Challenge Specification Card */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-7 space-y-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#F0F8EC] text-[#2A7C13] border border-[#2A7C13]/20">
              {challenge.status.replace('_', ' ').toUpperCase()}
            </span>
            <span className="text-xs text-[#64748B]">
              Department: <strong className="text-[#0F172A]">Urban Development Department</strong>
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
            <Clock className="w-3.5 h-3.5 text-[#2A7C13]" />
            <span>Pilot Duration: <strong>{challenge.pilotDuration || '90 days'}</strong></span>
          </div>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A]">
          {challenge.title}
        </h1>

        <p className="text-xs text-[#475569] leading-relaxed max-w-4xl">
          {challenge.problemStatement}
        </p>

        {/* Structured Spec Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-[#F1F5F9] text-xs">
          <div>
            <div className="text-[10px] font-bold uppercase text-[#64748B]">
              Target Users
            </div>
            <ul className="text-[#334155] mt-1 space-y-0.5">
              {challenge.targetUsers?.slice(0, 3).map((u, i) => (
                <li key={i}>• {u}</li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-[10px] font-bold uppercase text-[#64748B]">
              Required Capabilities
            </div>
            <div className="flex flex-wrap gap-1 mt-1">
              {challenge.requiredCapabilities?.map((c, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded text-[10px] bg-[#F1F5F9] text-[#475569]"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-bold uppercase text-[#64748B]">
              Suggested Pilot KPIs
            </div>
            <ul className="text-[#334155] mt-1 space-y-0.5">
              {challenge.suggestedKPIs?.slice(0, 3).map((kpi, i) => (
                <li key={i} className="text-[#2A7C13] font-medium">✓ {kpi}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Startup Discovery Section */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
              <Rocket className="w-4 h-4 text-[#2A7C13]" />
              <span>Startup Discovery ({matches.length} Matched Solutions)</span>
            </h2>
            <p className="text-xs text-[#64748B]">
              Ranked by deterministic 5-factor weighted algorithm (Capability 40%, Domain 25%, Readiness 15%, Implementation 10%, History 10%).
            </p>
          </div>

          <AiBadge text="AI explains strengths & gaps — score is deterministic" />
        </div>

        {/* Clean Startup Comparison Rows / Cards */}
        <div className="space-y-3">
          {matches.map(m => {
            const isEcoTrack = m.startup?.name.includes('EcoTrack');
            return (
              <div
                key={m.id}
                className={`bg-white border rounded-xl p-5 transition-all shadow-xs ${
                  isEcoTrack
                    ? 'border-[#2A7C13]/40 ring-1 ring-[#2A7C13]/10 bg-[#FAFDF8]'
                    : 'border-[#E2E8F0] hover:border-[#CBD5E1]'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
                  {/* Left: Startup information */}
                  <div className="space-y-2.5 flex-1">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#F0F8EC] border border-[#2A7C13]/20 flex items-center justify-center font-bold text-sm text-[#2A7C13] font-sans">
                        {m.startup?.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-[#0F172A]">{m.startup?.name}</h3>
                          {m.startup?.verificationStatus === 'verified' && (
                            <span className="text-[10px] px-2 py-0.2 rounded-full bg-[#F0F8EC] text-[#2A7C13] border border-[#2A7C13]/20 font-semibold">
                              Verified Startup
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-[#64748B]">
                          Solution: <strong className="text-[#0F172A]">{m.solution?.name}</strong> • {m.startup?.industry}
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-[#475569] leading-relaxed max-w-3xl">
                      {m.solution?.description || m.startup?.description}
                    </p>

                    {/* Matching capabilities */}
                    <div className="space-y-1.5 pt-1">
                      <div className="text-[11px] font-semibold text-[#334155] flex items-center gap-1">
                        <span>Matching capabilities:</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 text-xs">
                        {m.matchingCapabilities.map((cap, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 text-[11px] text-[#2A7C13] bg-white px-2 py-0.5 rounded-md border border-[#E2E8F0]"
                          >
                            <CheckCircle2 className="w-3 h-3 text-[#2A7C13]" />
                            {cap}
                          </span>
                        ))}
                      </div>

                      {/* Potential Gap */}
                      {m.potentialGaps && (
                        <div className="text-xs text-[#64748B] flex items-start gap-1 pt-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-[#D97706] shrink-0 mt-0.5" />
                          <span>
                            <strong className="text-[#334155]">Potential gap:</strong> {m.potentialGaps}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Match Score Card & Clean Buttons */}
                  <div className="flex flex-col items-center sm:items-end justify-between gap-3 shrink-0 lg:w-52">
                    <div className="text-center sm:text-right bg-[#FAFDF8] px-3.5 py-2 rounded-xl border border-[#E2E8F0] w-full sm:w-auto">
                      <div className="text-[10px] uppercase font-bold text-[#64748B]">
                        Match Score
                      </div>
                      <div className="text-2xl font-bold text-[#2A7C13] font-sans">
                        {m.matchScore}%
                      </div>
                      <button
                        onClick={() => setSelectedMatchModal(m)}
                        className="text-[10px] text-[#2A7C13] hover:underline cursor-pointer"
                      >
                        5-factor breakdown
                      </button>
                    </div>

                    <div className="flex flex-col gap-1.5 w-full">
                      {isEcoTrack ? (
                        <>
                          <button
                            onClick={() => handleLaunchPilot(m.startupId, m.solutionId)}
                            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#2A7C13] hover:bg-[#236810] text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
                          >
                            <Play className="w-3 h-3" />
                            <span>View Active Pilot (Day 47)</span>
                          </button>
                          <button
                            onClick={() => navigate('eval-review', { applicationId: 'app-ecotrack-1' })}
                            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-white hover:bg-[#F8FAFC] text-[#334155] text-xs font-medium border border-[#E2E8F0] transition-colors cursor-pointer"
                          >
                            <FileText className="w-3 h-3" />
                            <span>Review Proposal</span>
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setSelectedMatchModal(m)}
                            className="w-full py-1.5 px-3 rounded-xl bg-white hover:bg-[#F8FAFC] text-[#334155] text-xs font-medium border border-[#E2E8F0] transition-colors cursor-pointer"
                          >
                            View Startup
                          </button>
                          <button
                            onClick={() => {
                              showToast({
                                type: 'info',
                                title: 'Startup Shortlisted',
                                message: `Added ${m.startup?.name} to secondary review queue.`
                              });
                            }}
                            className="w-full py-1.5 px-3 rounded-xl bg-[#F0F8EC] hover:bg-[#E4F3DE] text-[#2A7C13] text-xs font-semibold border border-[#2A7C13]/20 transition-colors cursor-pointer"
                          >
                            Shortlist
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5-Factor Match Breakdown Modal */}
      {selectedMatchModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white border border-[#E2E8F0] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
              <div>
                <h3 className="text-sm font-bold text-[#0F172A]">
                  5-Factor Match Calculation
                </h3>
                <p className="text-xs text-[#64748B]">
                  {selectedMatchModal.startup?.name} — {selectedMatchModal.matchScore}% Score
                </p>
              </div>
              <button
                onClick={() => setSelectedMatchModal(null)}
                className="text-[#94A3B8] hover:text-[#0F172A] p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-[#475569] leading-relaxed bg-[#FAFDF8] p-3 rounded-xl border border-[#E2E8F0]">
              <span className="font-semibold text-[#2A7C13]">Deterministic Engine:</span> Numerical score calculated using verifiable capabilities, previous deployments, and pilot readiness.
            </div>

            <div className="space-y-2.5 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[#334155] font-medium">Capability Match (40%)</span>
                  <span className="font-bold text-[#2A7C13]">{selectedMatchModal.factorBreakdown?.capabilityMatch || 90}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
                  <div className="h-full bg-[#2A7C13] rounded-full" style={{ width: `${selectedMatchModal.factorBreakdown?.capabilityMatch || 90}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[#334155] font-medium">Problem Domain Match (25%)</span>
                  <span className="font-bold text-[#2A7C13]">{selectedMatchModal.factorBreakdown?.problemDomainMatch || 85}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
                  <div className="h-full bg-[#2A7C13] rounded-full" style={{ width: `${selectedMatchModal.factorBreakdown?.problemDomainMatch || 85}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[#334155] font-medium">Pilot Readiness (15%)</span>
                  <span className="font-bold text-[#2A7C13]">{selectedMatchModal.factorBreakdown?.pilotReadiness || 100}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
                  <div className="h-full bg-[#2A7C13] rounded-full" style={{ width: `${selectedMatchModal.factorBreakdown?.pilotReadiness || 100}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[#334155] font-medium">Implementation Fit (10%)</span>
                  <span className="font-bold text-[#2A7C13]">{selectedMatchModal.factorBreakdown?.implementationFit || 95}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
                  <div className="h-full bg-[#2A7C13] rounded-full" style={{ width: `${selectedMatchModal.factorBreakdown?.implementationFit || 95}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[#334155] font-medium">Previous Deployment (10%)</span>
                  <span className="font-bold text-[#2A7C13]">{selectedMatchModal.factorBreakdown?.previousDeploymentRelevance || 95}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
                  <div className="h-full bg-[#2A7C13] rounded-full" style={{ width: `${selectedMatchModal.factorBreakdown?.previousDeploymentRelevance || 95}%` }} />
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedMatchModal(null)}
                className="px-4 py-1.5 rounded-xl bg-white hover:bg-[#F8FAFC] text-xs font-semibold text-[#0F172A] border border-[#CBD5E1] cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pilot Launch Confirmation Dialog */}
      <ConfirmationModal
        isOpen={!!pilotConfirmStartup}
        onClose={() => setPilotConfirmStartup(null)}
        onConfirm={() => {
          if (pilotConfirmStartup) {
            handleLaunchPilot(pilotConfirmStartup.startupId, pilotConfirmStartup.solutionId);
            setPilotConfirmStartup(null);
          }
        }}
        title="Authorize Controlled Municipal Pilot?"
        message={`This will approve a 90-day controlled municipal field trial for ${pilotConfirmStartup?.startupName || 'this startup'} in Ward 12 with live telemetry and predefined KPI tracking.`}
        confirmLabel="Authorize Pilot"
        variant="primary"
      />
    </div>
  );
};
