import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { Application, ApplicationStatus } from '../../types';
import {
  FileText,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export const StartupApplications: React.FC = () => {
  const { role, navigate } = useApp();
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getApplications(role === 'startup' ? { startupId: 'st-ecotrack' } : undefined);
        setApplications(data);
        if (data.length > 0) {
          setSelectedApp(data[0]);
        }
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, [role]);

  const stages: { key: ApplicationStatus; label: string }[] = [
    { key: 'submitted', label: 'Application Submitted' },
    { key: 'eligibility_review', label: 'Eligibility Review' },
    { key: 'under_evaluation', label: 'Technical Evaluation' },
    { key: 'shortlisted', label: 'Shortlisted' },
    { key: 'pilot_selected', label: 'Pilot Selected / Approved' }
  ];

  const getStageIndex = (status: ApplicationStatus) => {
    const idx = stages.findIndex(s => s.key === status);
    return idx === -1 ? 0 : idx;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-7 space-y-1 shadow-xs">
        <span className="text-xs font-semibold text-[#2A7C13] uppercase tracking-wider">
          {role === 'government' ? 'Department Proposal Submissions' : 'Proposal Status & Tracking'}
        </span>
        <h1 className="text-2xl font-bold text-[#0F172A]">
          {role === 'government' ? 'Challenge Applications & Proposals' : 'Your Challenge Applications'}
        </h1>
        <p className="text-xs text-[#64748B] max-w-2xl">
          {role === 'government'
            ? 'Review startup applications across open challenges, inspect technical evaluation scores, and authorize pilot deployments.'
            : 'Track transparency milestones across 5 stages from initial submission to pilot authorization.'}
        </p>
      </div>

      {/* Applications Table */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#334155]">
            <thead className="bg-[#F8FAFC] text-[11px] font-semibold text-[#64748B] uppercase tracking-wider border-b border-[#E2E8F0]">
              <tr>
                <th className="py-3 px-4">Challenge Title</th>
                {role === 'government' && <th className="py-3 px-4">Applicant Startup</th>}
                <th className="py-3 px-4">Submitted Solution</th>
                <th className="py-3 px-4">Current Status</th>
                <th className="py-3 px-4">Submitted Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {applications.map(app => {
                const isSelected = selectedApp?.id === app.id;
                return (
                  <tr
                    key={app.id}
                    onClick={() => setSelectedApp(app)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-[#FAFDF8]' : 'hover:bg-[#F8FAFC]'
                    }`}
                  >
                    <td className="py-3 px-4 font-semibold text-[#0F172A]">
                      {app.challenge?.title || 'Municipal Challenge'}
                    </td>
                    {role === 'government' && (
                      <td className="py-3 px-4 font-medium text-[#2A7C13]">
                        {app.startup?.name || 'EcoTrack Technologies'}
                      </td>
                    )}
                    <td className="py-3 px-4 text-[#475569]">
                      {app.solution?.name || 'AI Waste Management Platform'}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                          app.status === 'pilot_selected'
                            ? 'bg-[#F0F8EC] text-[#2A7C13] border border-[#2A7C13]/20'
                            : app.status === 'shortlisted'
                            ? 'bg-sky-50 text-sky-700 border border-sky-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {app.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#64748B] font-mono">
                      {new Date(app.submittedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {app.status === 'pilot_selected' ? (
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            navigate('startup-pilot-view');
                          }}
                          className="px-3 py-1 rounded-lg bg-[#2A7C13] hover:bg-[#236810] text-white font-semibold text-[11px] shadow-xs cursor-pointer"
                        >
                          Open Pilot View
                        </button>
                      ) : (
                        <span className="text-[#2A7C13] font-medium hover:underline">View Timeline &rarr;</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Application Timeline Detailed View */}
      {selectedApp && (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-7 space-y-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F1F5F9]">
            <div>
              <span className="text-[10px] font-semibold text-[#2A7C13] uppercase tracking-wider">
                Application Timeline & Progression
              </span>
              <h3 className="text-base font-bold text-[#0F172A] mt-0.5">
                {selectedApp.challenge?.title}
              </h3>
            </div>

            <div className="text-xs text-[#64748B]">
              Budget: <strong>{selectedApp.proposedCost}</strong> • Timeline: {selectedApp.proposedTimeline}
            </div>
          </div>

          {/* 5-Stage Visual Progress Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
            {stages.map((st, i) => {
              const currentIdx = getStageIndex(selectedApp.status);
              const isPassed = i <= currentIdx;
              const isCurrent = i === currentIdx;

              return (
                <div
                  key={st.key}
                  className={`p-3 rounded-xl border transition-all ${
                    isCurrent
                      ? 'bg-[#F0F8EC] border-[#2A7C13] text-[#0F172A]'
                      : isPassed
                      ? 'bg-[#FAFDF8] border-[#2A7C13]/30 text-[#334155]'
                      : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#94A3B8]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold">STAGE 0{i + 1}</span>
                    {isPassed && <CheckCircle2 className="w-3.5 h-3.5 text-[#2A7C13]" />}
                  </div>
                  <div className="text-xs font-semibold leading-tight">{st.label}</div>
                </div>
              );
            })}
          </div>

          {/* Proposal Summary Details */}
          <div className="bg-[#FAFDF8] p-4 rounded-xl border border-[#E2E8F0] space-y-3 text-xs">
            <div>
              <div className="text-[10px] font-bold uppercase text-[#64748B]">
                Proposed Implementation Methodology
              </div>
              <p className="text-[#334155] mt-1 leading-relaxed">
                {selectedApp.proposedApproach}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#E2E8F0]">
              <div>
                <div className="text-[10px] font-bold uppercase text-[#64748B]">
                  Target Outcomes & Expected Impact
                </div>
                <p className="text-[#334155] mt-1 leading-relaxed">
                  {selectedApp.expectedImpact}
                </p>
              </div>

              <div>
                <div className="text-[10px] font-bold uppercase text-[#64748B]">
                  Evaluator Status & Score
                </div>
                {selectedApp.evaluation ? (
                  <div className="mt-1 space-y-1">
                    <div className="text-[#2A7C13] font-bold text-sm">
                      Total Score: {selectedApp.evaluation.totalScore}/100
                    </div>
                    <p className="text-[#475569] italic">
                      "{selectedApp.evaluation.notes}"
                    </p>
                  </div>
                ) : (
                  <div className="mt-1 text-[#64748B]">
                    Awaiting evaluator review and scoring.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
