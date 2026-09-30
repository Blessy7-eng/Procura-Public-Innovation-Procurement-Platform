import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { Pilot } from '../../types';
import {
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Award,
  Sparkles,
  Shield,
  FileText,
  Check,
  RotateCcw
} from 'lucide-react';
import { AiBadge } from '../../components/AiBadge';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { ConfirmationModal } from '../../components/ConfirmationModal';

export const GovScaleUpReview: React.FC = () => {
  const { selectedPilotId, showToast, navigate } = useApp();
  const [pilot, setPilot] = useState<Pilot | null>(null);
  const [aiSummary, setAiSummary] = useState<any>(null);
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const [decisionTaken, setDecisionTaken] = useState<string | null>(null);
  const [showScaleUpModal, setShowScaleUpModal] = useState<boolean>(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getPilot(selectedPilotId || 'plt-waste-1');
        setPilot(data);
        if (data.aiSummary) {
          setAiSummary(data.aiSummary);
        }
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, [selectedPilotId]);

  const handleGenerateAiSummary = async () => {
    setIsGeneratingAi(true);
    try {
      const summary = await api.summarizePilot(selectedPilotId || 'plt-waste-1');
      setAiSummary(summary);
      showToast({
        type: 'success',
        title: 'Evidence Synthesized',
        message: 'AI synthesized pilot evidence for review committee.'
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleDecision = async (decision: 'scale-up' | 'improvements' | 'close') => {
    setDecisionTaken(decision);
    let msg = '';
    if (decision === 'scale-up') {
      msg = 'Formally advanced to City Corporation Procurement Committee for Scale-Up Tender.';
    } else if (decision === 'improvements') {
      msg = 'Requested pilot offline synchronization improvements from startup.';
    } else {
      msg = 'Controlled pilot closed and archived.';
    }

    showToast({
      type: 'success',
      title: 'Official Decision Recorded',
      message: msg
    });

    if (pilot) {
      await api.updatePilot(pilot.id, {
        status: decision === 'scale-up' ? 'scale_up_review' : 'completed'
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <Breadcrumbs
        items={[
          { label: 'Pilots', view: 'gov-pilots' },
          { label: 'Evidence-Based Scale-Up Review' }
        ]}
      />

      {/* Header */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-7 space-y-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#F0F8EC] text-[#2A7C13] border border-[#2A7C13]/20 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" />
              Stage 5: Final Evidence Review
            </span>
            <span className="text-xs text-[#64748B]">
              Department: <strong className="text-[#0F172A]">Urban Development Department</strong>
            </span>
          </div>

          <span className="text-xs text-[#64748B] font-mono">
            Ward 12 Pilot • Day 47 of 90
          </span>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A]">
          Evidence-Based Scale-Up Review
        </h1>

        <p className="text-xs text-[#475569] leading-relaxed max-w-3xl">
          Independent evaluation and IoT telemetry data have been cross-verified. This panel allows authorized government officers to formally review pilot metrics and authorize transition to full municipal procurement.
        </p>

        {/* Overall Achievement Banner */}
        <div className="bg-[#FAFDF8] border border-[#2A7C13]/30 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs text-[#64748B] font-medium">Overall Validated KPI Achievement:</div>
            <div className="text-2xl font-bold text-[#2A7C13] font-sans">91% Target Completion</div>
            <div className="text-xs text-[#2A7C13] font-medium flex items-center gap-1.5 mt-0.5">
              <CheckCircle2 className="w-4 h-4 text-[#2A7C13]" />
              Evidence supports proceeding to the next procurement/scale-up review.
            </div>
          </div>

          <div className="shrink-0">
            <button
              onClick={handleGenerateAiSummary}
              disabled={isGeneratingAi}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-[#F8FAFC] text-xs font-semibold text-[#0F172A] border border-[#CBD5E1] transition-colors disabled:opacity-50 cursor-pointer shadow-2xs"
            >
              <Sparkles className="w-4 h-4 text-[#2A7C13]" />
              <span>{isGeneratingAi ? 'Synthesizing...' : 'Synthesize AI Evidence Summary'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Audit Table */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 space-y-4 shadow-xs">
        <h2 className="text-sm font-bold text-[#0F172A]">
          Predefined Pilot KPI Verification Matrix
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#334155]">
            <thead className="bg-[#F8FAFC] text-[11px] font-semibold text-[#64748B] uppercase tracking-wider border-b border-[#E2E8F0]">
              <tr>
                <th className="py-2.5 px-4">KPI Parameter</th>
                <th className="py-2.5 px-4">Baseline (Pre-Pilot)</th>
                <th className="py-2.5 px-4">Target Requirement</th>
                <th className="py-2.5 px-4">Actual Result</th>
                <th className="py-2.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9] font-normal">
              <tr className="hover:bg-[#F8FAFC]">
                <td className="py-3 px-4 font-semibold text-[#0F172A]">Grievance Resolution Time</td>
                <td className="py-3 px-4 text-[#64748B]">72 hours</td>
                <td className="py-3 px-4 text-[#0F172A]">&lt; 24 hours</td>
                <td className="py-3 px-4 font-bold text-[#2A7C13]">18 hours</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#F0F8EC] text-[#2A7C13] border border-[#2A7C13]/20">
                    Achieved (125%)
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-[#F8FAFC]">
                <td className="py-3 px-4 font-semibold text-[#0F172A]">SLA Compliance Rate</td>
                <td className="py-3 px-4 text-[#64748B]">51%</td>
                <td className="py-3 px-4 text-[#0F172A]">&gt; 85%</td>
                <td className="py-3 px-4 font-bold text-[#2A7C13]">89%</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#F0F8EC] text-[#2A7C13] border border-[#2A7C13]/20">
                    Achieved (+4%)
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-[#F8FAFC]">
                <td className="py-3 px-4 font-semibold text-[#0F172A]">Citizen Satisfaction Rating</td>
                <td className="py-3 px-4 text-[#64748B]">62%</td>
                <td className="py-3 px-4 text-[#0F172A]">&gt; 80%</td>
                <td className="py-3 px-4 font-bold text-[#2A7C13]">84%</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#F0F8EC] text-[#2A7C13] border border-[#2A7C13]/20">
                    Achieved (+4%)
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Decision Support Summary Box */}
      {aiSummary && (
        <div className="bg-[#FFFDF5] border border-[#FBE6C2] rounded-2xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#2A7C13]" />
              <h3 className="text-sm font-bold text-[#0F172A]">AI Pilot Evidence Synthesis</h3>
            </div>
            <AiBadge text="Decision Support Only — Final Decision by Authorised Official" />
          </div>

          <p className="text-xs text-[#334155] leading-relaxed bg-white p-3.5 rounded-xl border border-[#FBE6C2]">
            {aiSummary.summary}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-white p-3.5 rounded-xl border border-[#E2E8F0]">
              <div className="font-semibold text-[#2A7C13] mb-1">Achieved KPI Milestones:</div>
              <ul className="space-y-1 text-[#475569]">
                {aiSummary.achievedKPIs?.map((k: string, i: number) => (
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
                {aiSummary.areasForAttention?.map((a: string, i: number) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-[#D97706] shrink-0 mt-0.5" />
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Decision Card (Official Department Action) */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 space-y-4 shadow-xs">
        <div>
          <div className="text-[10px] font-bold text-[#2A7C13] uppercase tracking-wider">
            Official Department Governance
          </div>
          <h3 className="text-base font-bold text-[#0F172A] mt-0.5">
            Record Departmental Determination
          </h3>
          <p className="text-xs text-[#64748B] mt-0.5">
            Authorised government officials make the final decision. Please select the official determination for this pilot:
          </p>
        </div>

        {decisionTaken && (
          <div className="p-3.5 rounded-xl bg-[#F0F8EC] border border-[#2A7C13]/30 text-[#2A7C13] text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#2A7C13] shrink-0" />
            <span>
              Decision Recorded: <strong>{decisionTaken.replace('-', ' ').toUpperCase()}</strong>. Transmitted to municipal procurement portal and recorded in audit log.
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <button
            onClick={() => setShowScaleUpModal(true)}
            className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-[#2A7C13] hover:bg-[#236810] text-white font-bold text-xs shadow-xs transition-all gap-1 cursor-pointer text-center"
          >
            <CheckCircle2 className="w-4 h-4 text-white" />
            <span>Proceed to Procurement Review</span>
            <span className="text-[10px] font-normal text-white/80">Advance to city-wide scale-up</span>
          </button>

          <button
            onClick={() => handleDecision('improvements')}
            className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-white hover:bg-[#F8FAFC] text-[#334155] font-semibold text-xs border border-[#CBD5E1] transition-all gap-1 cursor-pointer text-center"
          >
            <RotateCcw className="w-4 h-4 text-[#D97706]" />
            <span>Request Improvements</span>
            <span className="text-[10px] font-normal text-[#64748B]">Request offline sync module</span>
          </button>

          <button
            onClick={() => handleDecision('close')}
            className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-white hover:bg-[#F8FAFC] text-[#334155] font-semibold text-xs border border-[#CBD5E1] transition-all gap-1 cursor-pointer text-center"
          >
            <Award className="w-4 h-4 text-[#64748B]" />
            <span>Close Pilot</span>
            <span className="text-[10px] font-normal text-[#64748B]">Archive evaluation file</span>
          </button>
        </div>

        <div className="text-[11px] text-[#64748B] text-center pt-2">
          Final decision remains strictly with the authorised official. AI acts purely as decision support.
        </div>
      </div>

      <ConfirmationModal
        isOpen={showScaleUpModal}
        onClose={() => setShowScaleUpModal(false)}
        onConfirm={() => {
          setShowScaleUpModal(false);
          handleDecision('scale-up');
        }}
        title="Authorize City-Wide Municipal Scale-Up?"
        message="Based on 91% overall KPI achievement across Ward 12, this will record the formal departmental determination recommending full municipal procurement and city-wide rollout."
        confirmLabel="Confirm Scale-Up Authorization"
        variant="primary"
      />
    </div>
  );
};
