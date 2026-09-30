import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { Application, PilotResult } from '../../types';
import {
  Scale,
  Award,
  FileCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  FileText,
  Home
} from 'lucide-react';

export const EvaluatorDashboard: React.FC = () => {
  const { navigate, currentUser } = useApp();
  const [applications, setApplications] = useState<Application[]>([]);
  const [evidenceList, setEvidenceList] = useState<PilotResult[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const [apps, ev] = await Promise.all([
          api.getApplications(),
          api.getEvidence('plt-waste-1')
        ]);
        setApplications(apps);
        setEvidenceList(ev);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);

  const pendingEvidence = evidenceList.filter(e => e.validationStatus === 'pending');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#2A7C13] uppercase tracking-wider">
            <Scale className="w-4 h-4" />
            <span>Technical Evaluation Panel</span>
          </div>
          <h1 className="text-2xl font-bold text-[#0F172A] mt-1">
            Welcome, Dr. Priya Sundaram
          </h1>
          <p className="text-xs text-[#64748B] mt-1 max-w-2xl">
            Review startup proposals, score technical and cost feasibility, and inspect verifiable pilot telemetry before scale-up decisions.
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
            onClick={() => navigate('eval-evidence')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2A7C13] hover:bg-[#236810] text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer shrink-0"
          >
            <FileCheck className="w-4 h-4" />
            <span>Audit Evidence ({pendingEvidence.length} Pending)</span>
          </button>
        </div>
      </div>

      {/* Metrics Row (Neutral Government Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#64748B]">Applications Awaiting Review</span>
            <div className="w-8 h-8 rounded-lg bg-[#F0F8EC] text-[#2A7C13] flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-[#0F172A] mt-2 font-sans">5</div>
          <div className="text-[11px] text-[#64748B] mt-1">1 recommended for controlled pilot</div>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#64748B]">Evaluations Completed</span>
            <div className="w-8 h-8 rounded-lg bg-[#F0F8EC] text-[#2A7C13] flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-[#0F172A] mt-2 font-sans">18</div>
          <div className="text-[11px] text-[#64748B] mt-1">Audited across 5 transparent criteria</div>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#64748B]">Pilots Requiring Evidence Review</span>
            <div className="w-8 h-8 rounded-lg bg-[#FFFDF5] text-[#D97706] flex items-center justify-center border border-[#FBE6C2]">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-[#0F172A] mt-2 font-sans">2</div>
          <div className="text-[11px] text-[#D97706] mt-1">Pending spot checks & validation</div>
        </div>
      </div>

      {/* Applications Comparison Table (Neutral, No gaming theatrics) */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-xs space-y-2">
        <div className="p-5 pb-2">
          <h2 className="text-sm font-bold text-[#0F172A]">Startup Proposals Awaiting Evaluation</h2>
          <p className="text-xs text-[#64748B]">Objective assessment based on Problem Fit, Feasibility, Innovation, Scale, and Cost.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#334155]">
            <thead className="bg-[#F8FAFC] text-[11px] font-semibold text-[#64748B] uppercase tracking-wider border-y border-[#E2E8F0]">
              <tr>
                <th className="py-3 px-4">Startup & Solution</th>
                <th className="py-3 px-4">Challenge</th>
                <th className="py-3 px-4">Proposed Budget</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Current Score</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {applications.map(app => (
                <tr key={app.id} className="hover:bg-[#FAFDF8] transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-[#0F172A]">{app.startup?.name}</div>
                    <div className="text-[11px] text-[#64748B]">{app.solution?.name}</div>
                  </td>
                  <td className="py-3 px-4 text-[#475569]">
                    {app.challenge?.title}
                  </td>
                  <td className="py-3 px-4 font-mono text-[#0F172A]">
                    {app.proposedCost}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                        app.status === 'pilot_selected'
                          ? 'bg-[#F0F8EC] text-[#2A7C13] border border-[#2A7C13]/20'
                          : 'bg-sky-50 text-sky-700 border border-sky-200'
                      }`}
                    >
                      {app.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-[#2A7C13] font-sans">
                    {app.evaluation ? `${app.evaluation.totalScore} / 100` : '—'}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => navigate('eval-review', { applicationId: app.id })}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#F8FAFC] text-[#2A7C13] font-semibold text-xs border border-[#CBD5E1] transition-colors cursor-pointer"
                    >
                      {app.evaluation ? 'Edit Score' : 'Score Proposal'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
