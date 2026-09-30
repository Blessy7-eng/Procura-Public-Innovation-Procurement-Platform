import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { Pilot, PilotResult } from '../../types';
import {
  Activity,
  CheckCircle2,
  Clock,
  PlusCircle,
  FileCheck
} from 'lucide-react';
import { Breadcrumbs } from '../../components/Breadcrumbs';

export const StartupPilotView: React.FC = () => {
  const { showToast } = useApp();
  const [pilot, setPilot] = useState<Pilot | null>(null);
  const [evidenceList, setEvidenceList] = useState<PilotResult[]>([]);
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [evidenceForm, setEvidenceForm] = useState({
    evidenceTitle: '',
    evidenceDescription: '',
    metricResult: '',
    evidenceUrl: 'https://procura.gov.in/docs/uploaded-evidence.pdf'
  });

  useEffect(() => {
    async function load() {
      try {
        const [pilotData, evData] = await Promise.all([
          api.getPilot('plt-waste-1'),
          api.getEvidence('plt-waste-1')
        ]);
        setPilot(pilotData);
        setEvidenceList(evData);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);

  const handleEvidenceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evidenceForm.evidenceTitle || !evidenceForm.evidenceDescription) {
      showToast({ type: 'warning', title: 'Missing Information', message: 'Title and description are required.' });
      return;
    }

    try {
      const created = await api.submitEvidence({
        pilotId: 'plt-waste-1',
        submittedBy: 'Aarav Sharma (EcoTrack)',
        evidenceTitle: evidenceForm.evidenceTitle,
        evidenceDescription: evidenceForm.evidenceDescription,
        metricResult: evidenceForm.metricResult,
        evidenceUrl: evidenceForm.evidenceUrl
      });

      setEvidenceList(prev => [...prev, created]);
      setShowSubmitModal(false);
      setEvidenceForm({
        evidenceTitle: '',
        evidenceDescription: '',
        metricResult: '',
        evidenceUrl: 'https://procura.gov.in/docs/uploaded-evidence.pdf'
      });

      showToast({
        type: 'success',
        title: 'Evidence Submitted',
        message: 'Evidence submitted for evaluator verification. Status: Pending Validation.'
      });
    } catch (e) {
      console.error(e);
    }
  };

  if (!pilot) {
    return (
      <div className="py-20 text-center text-[#64748B] text-xs">
        Loading pilot telemetry...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Breadcrumbs
        items={[
          { label: 'Pilots', view: 'startup-pilot-view' },
          { label: 'Municipal Waste Management Pilot' }
        ]}
      />

      {/* Pilot Header Banner */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-7 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F0F8EC] text-[#2A7C13] border border-[#2A7C13]/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2A7C13] animate-pulse"></span>
                Active Pilot: Day 47 of 90
              </span>
              <span className="text-xs text-[#64748B]">
                Department: <strong className="text-[#0F172A]">Urban Development Department</strong>
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A] mt-1">
              Municipal Waste Management Pilot
            </h1>
            <p className="text-xs text-[#475569] mt-0.5">
              Ward 12 (Central Zone) • 5,000 citizens • 22 sanitation vehicles equipped
            </p>
          </div>

          <button
            onClick={() => setShowSubmitModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2A7C13] hover:bg-[#236810] text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Submit Pilot Evidence</span>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="pt-2">
          <div className="flex justify-between text-xs text-[#64748B] mb-1">
            <span>Pilot Progression: Day 47 of 90</span>
            <span className="font-bold text-[#2A7C13]">52% Duration Completed</span>
          </div>
          <div className="w-full h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
            <div className="h-full bg-[#2A7C13] rounded-full" style={{ width: '52%' }} />
          </div>
        </div>
      </div>

      {/* KPI Cards (Target vs Current) */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#2A7C13]" />
          <span>Live Field Telemetry & Predefined KPI Targets</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 space-y-2.5 shadow-xs">
            <div className="text-xs font-semibold text-[#0F172A]">Resolution Time</div>
            <div className="flex items-baseline justify-between pt-1">
              <div>
                <span className="text-[10px] text-[#64748B] uppercase">Target</span>
                <div className="text-xs font-bold text-[#0F172A]">&lt; 24h</div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[#2A7C13] uppercase font-bold">Current</span>
                <div className="text-2xl font-bold text-[#2A7C13]">18h</div>
              </div>
            </div>
            <div className="text-[11px] text-[#2A7C13] font-semibold pt-1 border-t border-[#F1F5F9]">
              ✓ 6h faster than required SLA
            </div>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 space-y-2.5 shadow-xs">
            <div className="text-xs font-semibold text-[#0F172A]">SLA Compliance</div>
            <div className="flex items-baseline justify-between pt-1">
              <div>
                <span className="text-[10px] text-[#64748B] uppercase">Target</span>
                <div className="text-xs font-bold text-[#0F172A]">&gt; 85%</div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[#2A7C13] uppercase font-bold">Current</span>
                <div className="text-2xl font-bold text-[#2A7C13]">89%</div>
              </div>
            </div>
            <div className="text-[11px] text-[#2A7C13] font-semibold pt-1 border-t border-[#F1F5F9]">
              ✓ Exceeding target by 4%
            </div>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 space-y-2.5 shadow-xs">
            <div className="text-xs font-semibold text-[#0F172A]">Citizen Satisfaction</div>
            <div className="flex items-baseline justify-between pt-1">
              <div>
                <span className="text-[10px] text-[#64748B] uppercase">Target</span>
                <div className="text-xs font-bold text-[#0F172A]">&gt; 80%</div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[#2A7C13] uppercase font-bold">Current</span>
                <div className="text-2xl font-bold text-[#2A7C13]">84%</div>
              </div>
            </div>
            <div className="text-[11px] text-[#2A7C13] font-semibold pt-1 border-t border-[#F1F5F9]">
              ✓ Verified by SMS citizen surveys
            </div>
          </div>
        </div>
      </div>

      {/* Submitted Evidence Trail */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 space-y-4 shadow-xs">
        <div>
          <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-[#2A7C13]" />
            <span>Submitted Pilot Evidence & Verification Records</span>
          </h3>
          <p className="text-xs text-[#64748B]">All submissions are audited by the Technical Evaluation Committee</p>
        </div>

        <div className="space-y-2.5">
          {evidenceList.map(item => (
            <div
              key={item.id}
              className="bg-[#FAFDF8] border border-[#E2E8F0] rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-[#0F172A]">{item.evidenceTitle}</h4>
                  <span
                    className={`text-[10px] px-2 py-0.2 rounded-full font-semibold ${
                      item.validationStatus === 'validated'
                        ? 'bg-[#F0F8EC] text-[#2A7C13] border border-[#2A7C13]/20'
                        : 'bg-[#FFFDF5] text-[#D97706] border border-[#FBE6C2]'
                    }`}
                  >
                    {item.validationStatus === 'validated' ? '✓ VALIDATED' : 'PENDING VALIDATION'}
                  </span>
                </div>
                <p className="text-[#64748B] text-[11px]">{item.evidenceDescription}</p>
                {item.evaluatorNotes && (
                  <div className="text-[11px] text-[#475569] italic">
                    Evaluator Feedback: "{item.evaluatorNotes}"
                  </div>
                )}
              </div>

              <div className="text-right shrink-0">
                <span className="font-bold text-[#2A7C13]">
                  {item.metricResult}
                </span>
                <div className="text-[10px] text-[#94A3B8]">
                  {new Date(item.submittedAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Evidence Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white border border-[#E2E8F0] rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
              <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-[#2A7C13]" />
                <span>Submit Pilot Evidence</span>
              </h3>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="text-[#94A3B8] hover:text-[#0F172A] p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEvidenceSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-[#334155] mb-1">
                  Evidence Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Day 45 Telemetry Extract & Citizen Survey Sample"
                  value={evidenceForm.evidenceTitle}
                  onChange={e => setEvidenceForm({ ...evidenceForm, evidenceTitle: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2A7C13]/30 focus:border-[#2A7C13]"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-[#334155] mb-1">
                  Evidence Description & Telemetry Summary
                </label>
                <textarea
                  rows={3}
                  placeholder="Detail the metrics achieved, users involved, or milestone completion..."
                  value={evidenceForm.evidenceDescription}
                  onChange={e => setEvidenceForm({ ...evidenceForm, evidenceDescription: e.target.value })}
                  className="w-full p-3 bg-white border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2A7C13]/30 focus:border-[#2A7C13]"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-[#334155] mb-1">
                  Metric / Result Value
                </label>
                <input
                  type="text"
                  placeholder="e.g. 18h median resolution time across 1,420 tickets"
                  value={evidenceForm.metricResult}
                  onChange={e => setEvidenceForm({ ...evidenceForm, metricResult: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2A7C13]/30 focus:border-[#2A7C13]"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-[#334155] mb-1">
                  Supporting Document Link / PDF URL
                </label>
                <input
                  type="text"
                  value={evidenceForm.evidenceUrl}
                  onChange={e => setEvidenceForm({ ...evidenceForm, evidenceUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2A7C13]/30 focus:border-[#2A7C13]"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-[#F1F5F9]">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-[#64748B] hover:text-[#0F172A] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#2A7C13] hover:bg-[#236810] text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  Submit Evidence
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
