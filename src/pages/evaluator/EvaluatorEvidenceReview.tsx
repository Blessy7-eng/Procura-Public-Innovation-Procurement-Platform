import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { PilotResult } from '../../types';
import {
  FileCheck,
  CheckCircle2,
  HelpCircle,
  XCircle,
  Sparkles,
  AlertCircle,
  Check
} from 'lucide-react';
import { AiBadge } from '../../components/AiBadge';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { ConfirmationModal } from '../../components/ConfirmationModal';

export const EvaluatorEvidenceReview: React.FC = () => {
  const { showToast } = useApp();
  const [evidenceList, setEvidenceList] = useState<PilotResult[]>([]);
  const [evaluatorNotesMap, setEvaluatorNotesMap] = useState<Record<string, string>>({});
  const [isSummarizing, setIsSummarizing] = useState<boolean>(false);
  const [aiSummaryResult, setAiSummaryResult] = useState<any>(null);
  const [confirmValidateId, setConfirmValidateId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getEvidence('plt-waste-1');
        setEvidenceList(data);
        const map: Record<string, string> = {};
        data.forEach(item => {
          map[item.id] = item.evaluatorNotes || '';
        });
        setEvaluatorNotesMap(map);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);

  const handleUpdateStatus = async (
    id: string,
    validationStatus: 'validated' | 'needs_clarification' | 'rejected'
  ) => {
    try {
      const notes = evaluatorNotesMap[id] || '';
      const updated = await api.validateEvidence(id, {
        validationStatus,
        evaluatorNotes: notes,
        actorName: 'Dr. Priya Sundaram'
      });

      setEvidenceList(prev => prev.map(item => (item.id === id ? updated : item)));

      showToast({
        type: 'success',
        title: 'Evidence Audited',
        message: `Marked evidence as: ${validationStatus.replace('_', ' ').toUpperCase()}`
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleGenerateAiSummary = async () => {
    setIsSummarizing(true);
    try {
      const summary = await api.summarizePilot('plt-waste-1');
      setAiSummaryResult(summary);
      showToast({
        type: 'success',
        title: 'Evidence Synthesized',
        message: 'Generated comprehensive evidence summary for evaluation committee.'
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <div className="space-y-4">
      <Breadcrumbs
        items={[
          { label: 'Pilots', view: 'eval-pilots' },
          { label: 'Evidence Validation' }
        ]}
      />

      {/* Header */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <span className="text-xs font-semibold text-[#2A7C13] uppercase tracking-wider">
            Evaluation Committee Audit Panel
          </span>
          <h1 className="text-2xl font-bold text-[#0F172A] mt-0.5">Pilot Evidence Validation</h1>
          <p className="text-xs text-[#64748B] mt-1 max-w-2xl">
            Audit submitted pilot evidence, verify on-ground telemetry logs, and validate milestones before formal scale-up review.
          </p>
        </div>

        <button
          onClick={handleGenerateAiSummary}
          disabled={isSummarizing}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-[#F8FAFC] text-[#0F172A] border border-[#CBD5E1] font-semibold text-xs shadow-2xs transition-colors shrink-0 disabled:opacity-50 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-[#2A7C13]" />
          <span>{isSummarizing ? 'Synthesizing with AI...' : 'Generate AI Pilot Summary'}</span>
        </button>
      </div>

      {/* AI Summary Card */}
      {aiSummaryResult && (
        <div className="bg-[#FFFDF5] border border-[#FBE6C2] rounded-2xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#2A7C13]" />
              <span>AI Pilot Evidence Summary</span>
            </h3>
            <AiBadge text="Decision Support Only — Does Not Decide Procurement" />
          </div>

          <p className="text-xs text-[#334155] leading-relaxed bg-white p-3.5 rounded-xl border border-[#FBE6C2]">
            {aiSummaryResult.summary}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-white p-3.5 rounded-xl border border-[#E2E8F0]">
              <div className="font-semibold text-[#2A7C13] mb-1">Achieved KPI Milestones:</div>
              <ul className="space-y-1 text-[#475569]">
                {aiSummaryResult.achievedKPIs?.map((k: string, i: number) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#2A7C13] shrink-0 mt-0.5" />
                    <span>{k}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-[#E2E8F0]">
              <div className="font-semibold text-[#D97706] mb-1">Areas for Attention / Notes:</div>
              <ul className="space-y-1 text-[#475569]">
                {aiSummaryResult.areasForAttention?.map((a: string, i: number) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-[#D97706] shrink-0 mt-0.5" />
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Evidence Items List */}
      <div className="space-y-3.5">
        {evidenceList.map(item => {
          const isValidated = item.validationStatus === 'validated';
          const isClarification = item.validationStatus === 'needs_clarification';

          return (
            <div
              key={item.id}
              className="bg-white border border-[#E2E8F0] rounded-xl p-5 space-y-3 shadow-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-[#0F172A]">{item.evidenceTitle}</h3>
                    <span
                      className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider ${
                        isValidated
                          ? 'bg-[#F0F8EC] text-[#2A7C13] border border-[#2A7C13]/20'
                          : isClarification
                          ? 'bg-[#FFFDF5] text-[#D97706] border border-[#FBE6C2]'
                          : 'bg-[#F1F5F9] text-[#64748B]'
                      }`}
                    >
                      {item.validationStatus.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-xs text-[#64748B]">
                    Submitted by: <strong className="text-[#334155]">{item.submittedBy}</strong> • Date: {new Date(item.submittedAt).toLocaleDateString()}
                  </div>
                  <p className="text-xs text-[#475569] mt-1 leading-relaxed">
                    {item.evidenceDescription}
                  </p>
                </div>

                <div className="text-right shrink-0 bg-[#FAFDF8] px-3.5 py-2 rounded-xl border border-[#E2E8F0]">
                  <span className="text-[10px] text-[#64748B] uppercase font-bold">Telemetry Result</span>
                  <div className="text-xs font-bold text-[#2A7C13] font-sans mt-0.5">
                    {item.metricResult || 'Telemetry Verified'}
                  </div>
                </div>
              </div>

              {/* Notes Field */}
              <div className="space-y-1 text-xs">
                <label className="block text-[11px] font-semibold text-[#475569]">
                  Evaluator Verification Notes & Audit Remarks
                </label>
                <input
                  type="text"
                  placeholder="e.g. Telemetry verified against municipal SCADA logs and field inspections..."
                  value={evaluatorNotesMap[item.id] || ''}
                  onChange={e =>
                    setEvaluatorNotesMap({ ...evaluatorNotesMap, [item.id]: e.target.value })
                  }
                  className="w-full px-3 py-1.5 bg-[#FAFDF8] border border-[#CBD5E1] rounded-lg text-xs text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#2A7C13]"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#F1F5F9]">
                <div className="text-[11px] text-[#94A3B8]">
                  Audit action logged in public activity trail.
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleUpdateStatus(item.id, 'needs_clarification')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-[#F8FAFC] text-[#D97706] text-xs font-medium border border-[#CBD5E1] transition-colors cursor-pointer"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Needs Clarification</span>
                  </button>

                  <button
                    onClick={() => handleUpdateStatus(item.id, 'rejected')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-[#F8FAFC] text-[#DC2626] text-xs font-medium border border-[#CBD5E1] transition-colors cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>

                  <button
                    onClick={() => setConfirmValidateId(item.id)}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#2A7C13] hover:bg-[#236810] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Validate Evidence</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <ConfirmationModal
        isOpen={!!confirmValidateId}
        onClose={() => setConfirmValidateId(null)}
        onConfirm={() => {
          if (confirmValidateId) {
            handleUpdateStatus(confirmValidateId, 'validated');
            setConfirmValidateId(null);
          }
        }}
        title="Validate Pilot Evidence Artifact?"
        message="This will formally certify that the telemetry export or field report has been audited and satisfies the pilot KPI requirement."
        confirmLabel="Confirm Validation"
        variant="primary"
      />
    </div>
  );
};
