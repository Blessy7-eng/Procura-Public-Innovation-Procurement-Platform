import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { PilotResult, Pilot } from '../../types';
import {
  FileCheck,
  CheckCircle2,
  Clock,
  PlusCircle,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Building2,
  Award
} from 'lucide-react';
import { Breadcrumbs } from '../../components/Breadcrumbs';

export const StartupEvidenceView: React.FC = () => {
  const { showToast, navigate } = useApp();
  const [evidenceList, setEvidenceList] = useState<PilotResult[]>([]);
  const [pilot, setPilot] = useState<Pilot | null>(null);
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
      showToast({
        type: 'warning',
        title: 'Missing Details',
        message: 'Title and description are required.'
      });
      return;
    }

    try {
      const created = await api.submitEvidence({
        pilotId: 'plt-waste-1',
        submittedBy: 'Aarav Sharma (EcoTrack Technologies)',
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
        message: 'Evidence submitted for technical committee audit.'
      });
    } catch (e) {
      console.error(e);
    }
  };

  const validatedCount = evidenceList.filter(e => e.validationStatus === 'validated').length;
  const pendingCount = evidenceList.filter(e => e.validationStatus === 'pending').length;

  return (
    <div className="space-y-4">
      <Breadcrumbs
        items={[
          { label: 'Pilots', view: 'startup-pilot-view' },
          { label: 'Pilot Evidence Vault' }
        ]}
      />

      {/* Header */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#2A7C13] uppercase tracking-wider">
            <FileCheck className="w-4 h-4" />
            <span>Pilot Evidence Vault</span>
          </div>
          <h1 className="text-2xl font-bold text-[#0F172A] mt-1">
            Pilot Evidence & Verification
          </h1>
          <p className="text-xs text-[#64748B] mt-1 max-w-2xl leading-relaxed">
            Submit verifiable telemetry logs, citizen survey exports, and performance reports to prove contractual KPI achievements to the government evaluation committee.
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

      {/* Status Summary Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs">
          <span className="text-xs font-medium text-[#64748B]">Total Submissions</span>
          <div className="text-3xl font-bold text-[#0F172A] mt-1 font-sans">{evidenceList.length}</div>
          <div className="text-[11px] text-[#64748B] mt-1">Ward 12 Municipal Pilot</div>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs">
          <span className="text-xs font-medium text-[#64748B]">Audited & Validated</span>
          <div className="text-3xl font-bold text-[#2A7C13] mt-1 font-sans">{validatedCount}</div>
          <div className="text-[11px] text-[#2A7C13] font-semibold mt-1">Ready for scale-up review</div>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs">
          <span className="text-xs font-medium text-[#64748B]">Awaiting Committee Audit</span>
          <div className="text-3xl font-bold text-[#D97706] mt-1 font-sans">{pendingCount}</div>
          <div className="text-[11px] text-[#64748B] mt-1">Evaluation panel assigned</div>
        </div>
      </div>

      {/* Evidence Items */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-bold text-[#0F172A]">Submitted Evidence Records</h2>
          <p className="text-xs text-[#64748B]">All artifacts are timestamped and tied to contractual pilot milestones</p>
        </div>

        <div className="space-y-3">
          {evidenceList.map(item => (
            <div
              key={item.id}
              className="p-4 rounded-xl border border-[#E2E8F0] hover:border-[#CBD5E1] transition-all space-y-2.5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-[#0F172A]">{item.evidenceTitle}</h3>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                      item.validationStatus === 'validated'
                        ? 'bg-[#F0F8EC] text-[#2A7C13] border border-[#2A7C13]/20'
                        : item.validationStatus === 'needs_clarification'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0]'
                    }`}
                  >
                    {item.validationStatus.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="text-[11px] text-[#64748B]">
                  Recorded: {new Date(item.submittedAt).toLocaleDateString()}
                </div>
              </div>

              <p className="text-xs text-[#475569] leading-relaxed">
                {item.evidenceDescription}
              </p>

              {item.metricResult && (
                <div className="text-xs font-semibold text-[#2A7C13] bg-[#FAFDF8] px-3 py-1.5 rounded-lg border border-[#2A7C13]/15 inline-block">
                  Metric Result: {item.metricResult}
                </div>
              )}

              {item.evaluatorNotes && (
                <div className="mt-2 pt-2 border-t border-[#F1F5F9] text-xs text-[#334155] bg-[#F8FAFC] p-3 rounded-lg">
                  <span className="font-semibold text-[#0F172A]">Committee Verification Note:</span> {item.evaluatorNotes}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Submission Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E2E8F0] rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div>
              <h3 className="text-lg font-bold text-[#0F172A]">Submit Pilot Evidence</h3>
              <p className="text-xs text-[#64748B] mt-0.5">
                Provide verifiable evidence for the Ward 12 Municipal Pilot
              </p>
            </div>

            <form onSubmit={handleEvidenceSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#334155] mb-1">
                  Evidence Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Month 1 Resolution Time Telemetry Export"
                  value={evidenceForm.evidenceTitle}
                  onChange={e => setEvidenceForm({ ...evidenceForm, evidenceTitle: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#2A7C13] focus:border-[#2A7C13]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#334155] mb-1">
                  Metric Result / Achievement Value
                </label>
                <input
                  type="text"
                  placeholder="e.g. 18.2 hours (Target was < 24h)"
                  value={evidenceForm.metricResult}
                  onChange={e => setEvidenceForm({ ...evidenceForm, metricResult: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#2A7C13] focus:border-[#2A7C13]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#334155] mb-1">
                  Description & Methodology
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe data collection methodology, sample size, and validation steps..."
                  value={evidenceForm.evidenceDescription}
                  onChange={e => setEvidenceForm({ ...evidenceForm, evidenceDescription: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#2A7C13] focus:border-[#2A7C13]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#2A7C13] hover:bg-[#236810] text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  Submit for Audit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
