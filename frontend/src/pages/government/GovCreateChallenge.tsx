import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  FileEdit,
  Send,
  Building2,
  Plus,
  Trash2,
  Lightbulb,
  HelpCircle
} from 'lucide-react';
import { AiBadge } from '../../components/AiBadge';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { ConfirmationModal } from '../../components/ConfirmationModal';

export const GovCreateChallenge: React.FC = () => {
  const { navigate, showToast } = useApp();
  const [step, setStep] = useState<number>(1);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [showPublishModal, setShowPublishModal] = useState<boolean>(false);

  // Step 1: Raw problem
  const [rawProblem, setRawProblem] = useState<string>(
    'Our municipal waste collection complaints are handled manually. Citizens don’t know the status of their complaints and officers spend significant time tracking them.'
  );

  // Step 2 & 3: Structured Draft
  const [draft, setDraft] = useState({
    title: 'Intelligent Waste Collection Complaint Management',
    problemStatement:
      'Municipal waste collection grievance workflows face high processing latency and lack of citizen visibility. Departmental staff spend excessive administrative time manually triaging and tracking complaints across multiple zones.',
    targetUsers: [
      'Ward Sanitation Inspectors',
      'Municipal Grievance Officers',
      'Citizens of Urban Wards',
      'Solid Waste Collection Drivers'
    ],
    expectedOutcomes: [
      'Reduce grievance resolution turnaround time from 72h to under 24h',
      'Provide real-time SMS and web tracking to citizens',
      'Automated SLA escalations and supervisor heatmaps',
      'Improve citizen satisfaction ratings above 80%'
    ],
    requiredCapabilities: [
      'Complaint management',
      'Municipal workflow',
      'Analytics & reporting',
      'Citizen platform',
      'Pilot readiness',
      'GPS collection tracking'
    ],
    suggestedKPIs: [
      'Average Grievance Resolution Time (<24 hours)',
      'SLA Compliance Rate (>85%)',
      'Citizen Satisfaction Rating (>80%)',
      'Unresolved Backlog Clearance (>60%)'
    ],
    pilotConsiderations: [
      'Run in 1-2 representative urban wards for 60-90 days',
      'Include field staff onboarding and vernacular interface support',
      'Ensure data privacy and integration with existing municipal portal'
    ],
    pilotDuration: '90 days'
  });

  const handleUseExample = (text: string) => {
    setRawProblem(text);
  };

  const handleRunAiBuilder = async () => {
    if (!rawProblem.trim()) {
      showToast({ type: 'warning', title: 'Problem Required', message: 'Please describe the problem you want to solve.' });
      return;
    }
    setIsAiLoading(true);
    try {
      const result = await api.structureChallenge(rawProblem);
      setDraft(prev => ({
        ...prev,
        title: result.title || prev.title,
        problemStatement: result.problemStatement || prev.problemStatement,
        targetUsers: result.targetUsers || prev.targetUsers,
        expectedOutcomes: result.expectedOutcomes || prev.expectedOutcomes,
        requiredCapabilities: result.requiredCapabilities || prev.requiredCapabilities,
        suggestedKPIs: result.suggestedKPIs || prev.suggestedKPIs,
        pilotConsiderations: result.pilotConsiderations || prev.pilotConsiderations
      }));
      setStep(2);
      showToast({
        type: 'success',
        title: 'Draft Generated',
        message: 'AI structured challenge generated. Review and refine as needed.'
      });
    } catch (e) {
      console.error(e);
      setStep(2);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handlePublish = async () => {
    try {
      const newCh = await api.createChallenge({
        title: draft.title,
        problemStatement: draft.problemStatement,
        targetUsers: draft.targetUsers,
        expectedOutcomes: draft.expectedOutcomes,
        requiredCapabilities: draft.requiredCapabilities,
        suggestedKPIs: draft.suggestedKPIs,
        pilotDuration: draft.pilotDuration
      });

      showToast({
        type: 'success',
        title: 'Challenge Published',
        message: `Published "${draft.title}". 5 startup matches calculated.`
      });

      navigate('gov-challenge-detail', { challengeId: newCh.id });
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddItem = (field: 'targetUsers' | 'expectedOutcomes' | 'requiredCapabilities' | 'suggestedKPIs') => {
    setDraft(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const handleUpdateItem = (field: 'targetUsers' | 'expectedOutcomes' | 'requiredCapabilities' | 'suggestedKPIs', index: number, value: string) => {
    setDraft(prev => {
      const updated = [...prev[field]];
      updated[index] = value;
      return { ...prev, [field]: updated };
    });
  };

  const handleRemoveItem = (field: 'targetUsers' | 'expectedOutcomes' | 'requiredCapabilities' | 'suggestedKPIs', index: number) => {
    setDraft(prev => {
      const updated = prev[field].filter((_, i) => i !== index);
      return { ...prev, [field]: updated };
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <Breadcrumbs
        items={[
          { label: 'Challenges', view: 'gov-challenges' },
          { label: 'Create Challenge' }
        ]}
      />

      {/* Guided Government Progress Header */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-[#2A7C13] uppercase tracking-wider">
              Public Innovation Procurement Form
            </span>
            <h1 className="text-xl font-bold text-[#0F172A] mt-0.5">
              Create a Challenge
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {[
              { num: 1, label: '1. Describe Problem' },
              { num: 2, label: '2. Structure Challenge' },
              { num: 3, label: '3. Review & Publish' }
            ].map((s, idx) => (
              <div key={s.num} className="flex items-center gap-2">
                <div
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    step === s.num
                      ? 'bg-[#2A7C13] text-white shadow-xs'
                      : step > s.num
                      ? 'bg-[#F0F8EC] text-[#2A7C13] border border-[#2A7C13]/20'
                      : 'bg-[#F1F5F9] text-[#64748B]'
                  }`}
                >
                  {step > s.num ? <CheckCircle2 className="w-3.5 h-3.5" /> : null}
                  <span>{s.label}</span>
                </div>
                {idx < 2 && <div className="w-4 h-0.5 bg-[#E2E8F0] hidden sm:block" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* STEP 1: DESCRIBE THE PROBLEM (With Helpful Side Panel) */}
      {step === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Form (8 cols) */}
          <div className="lg:col-span-8 bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-7 space-y-5 shadow-xs">
            <div className="space-y-1">
              <h2 className="text-base font-bold text-[#0F172A]">Describe the Problem</h2>
              <p className="text-xs text-[#64748B]">
                Explain what civic challenge or departmental bottleneck you are trying to solve in simple, non-technical words.
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[#334155]">
                What problem are you trying to solve?
              </label>
              <textarea
                rows={5}
                value={rawProblem}
                onChange={e => setRawProblem(e.target.value)}
                placeholder="e.g. Our municipal waste collection complaints are handled manually. Citizens don't know the status of their complaints..."
                className="w-full bg-[#FAFDF8] border border-[#CBD5E1] rounded-xl p-3.5 text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2A7C13]/30 focus:border-[#2A7C13] leading-relaxed"
              />
            </div>

            {/* Presets */}
            <div className="space-y-2 pt-2 border-t border-[#F1F5F9]">
              <div className="flex items-center gap-1.5 text-xs text-[#64748B] font-medium">
                <Lightbulb className="w-3.5 h-3.5 text-[#D97706]" />
                <span>Or select a pre-filled departmental example:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    handleUseExample(
                      'Our municipal waste collection complaints are handled manually. Citizens don’t know the status of their complaints and officers spend significant time tracking them.'
                    )
                  }
                  className="text-xs px-3 py-1.5 rounded-lg bg-[#FAFDF8] hover:bg-[#F2F9EE] text-[#2A7C13] border border-[#2A7C13]/20 font-medium transition-colors text-left cursor-pointer"
                >
                  Municipal Waste Grievances & Citizen Tracking
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleUseExample(
                      'Streetlight outage complaints take 5+ days to resolve due to lack of real-time inventory and night patrol coverage. Citizens report frequent dark spots.'
                    )
                  }
                  className="text-xs px-3 py-1.5 rounded-lg bg-[#FAFDF8] hover:bg-[#F2F9EE] text-[#2A7C13] border border-[#2A7C13]/20 font-medium transition-colors text-left cursor-pointer"
                >
                  Streetlight Outages & Night SLA Automation
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button
                onClick={handleRunAiBuilder}
                disabled={isAiLoading}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#2A7C13] hover:bg-[#236810] text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-[#FFF8CF]" />
                <span>{isAiLoading ? 'Analyzing & Structuring...' : 'Continue to Structure'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Helpful AI Side Panel (4 cols) */}
          <div className="lg:col-span-4 bg-[#FFFDF5] border border-[#FBE6C2] rounded-2xl p-5 space-y-4 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0F172A]">
                <Sparkles className="w-4 h-4 text-[#2A7C13]" />
                <span>AI-Assisted Draft</span>
              </div>
              <p className="text-xs text-[#475569] leading-relaxed">
                Procura can help structure your problem statement into a procurement-ready challenge with suggested outcomes, required capabilities, and pilot KPIs.
              </p>
              <div className="text-[11px] text-[#64748B] space-y-1.5 pt-1">
                <div className="flex items-center gap-1.5">✓ Saves hours of paperwork</div>
                <div className="flex items-center gap-1.5">✓ Formulates pilot-ready KPIs</div>
                <div className="flex items-center gap-1.5">✓ You review and edit everything</div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#FBE6C2]">
              <button
                type="button"
                onClick={handleRunAiBuilder}
                disabled={isAiLoading}
                className="w-full py-2 px-3 bg-white hover:bg-[#FAFDF8] text-[#2A7C13] border border-[#2A7C13]/30 font-semibold text-xs rounded-xl shadow-2xs transition-colors cursor-pointer"
              >
                Generate Draft
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: STRUCTURE CHALLENGE (All Fields Editable) */}
      {step === 2 && (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#F1F5F9]">
            <div>
              <h2 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
                <span>Step 2: Structure Challenge</span>
              </h2>
              <p className="text-xs text-[#64748B] mt-0.5">
                AI-assisted draft — please review before publishing. All fields are fully editable.
              </p>
            </div>
            <AiBadge text="AI-assisted draft — please review before publishing" />
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-[#334155] mb-1">
                Challenge Title
              </label>
              <input
                type="text"
                value={draft.title}
                onChange={e => setDraft({ ...draft, title: e.target.value })}
                className="w-full px-3.5 py-2 bg-white border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] font-semibold focus:outline-none focus:ring-2 focus:ring-[#2A7C13]/30 focus:border-[#2A7C13]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#334155] mb-1">
                Refined Problem Statement (Visible to Startups)
              </label>
              <textarea
                rows={3}
                value={draft.problemStatement}
                onChange={e => setDraft({ ...draft, problemStatement: e.target.value })}
                className="w-full p-3 bg-white border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2A7C13]/30 focus:border-[#2A7C13] leading-relaxed"
              />
            </div>

            {/* Target Users */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-[#334155]">Target Users & Beneficiaries</label>
                <button
                  type="button"
                  onClick={() => handleAddItem('targetUsers')}
                  className="text-xs text-[#2A7C13] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" /> Add User
                </button>
              </div>
              <div className="space-y-1.5">
                {draft.targetUsers.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={e => handleUpdateItem('targetUsers', idx, e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-[#FAFDF8] border border-[#CBD5E1] rounded-lg text-xs text-[#0F172A]"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveItem('targetUsers', idx)}
                      className="text-[#94A3B8] hover:text-[#DC2626] p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Required Capabilities */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-[#334155]">
                  Required Capabilities (Used for Deterministic Matching)
                </label>
                <button
                  type="button"
                  onClick={() => handleAddItem('requiredCapabilities')}
                  className="text-xs text-[#2A7C13] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" /> Add Capability
                </button>
              </div>
              <div className="space-y-1.5">
                {draft.requiredCapabilities.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={e => handleUpdateItem('requiredCapabilities', idx, e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-[#FAFDF8] border border-[#CBD5E1] rounded-lg text-xs text-[#0F172A]"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveItem('requiredCapabilities', idx)}
                      className="text-[#94A3B8] hover:text-[#DC2626] p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Expected Outcomes */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-[#334155]">Expected Measurable Outcomes</label>
                <button
                  type="button"
                  onClick={() => handleAddItem('expectedOutcomes')}
                  className="text-xs text-[#2A7C13] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" /> Add Outcome
                </button>
              </div>
              <div className="space-y-1.5">
                {draft.expectedOutcomes.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={e => handleUpdateItem('expectedOutcomes', idx, e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-[#FAFDF8] border border-[#CBD5E1] rounded-lg text-xs text-[#0F172A]"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveItem('expectedOutcomes', idx)}
                      className="text-[#94A3B8] hover:text-[#DC2626] p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggested KPIs */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-[#334155]">Suggested Pilot KPIs</label>
                <button
                  type="button"
                  onClick={() => handleAddItem('suggestedKPIs')}
                  className="text-xs text-[#2A7C13] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" /> Add KPI
                </button>
              </div>
              <div className="space-y-1.5">
                {draft.suggestedKPIs.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={e => handleUpdateItem('suggestedKPIs', idx, e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-[#FAFDF8] border border-[#CBD5E1] rounded-lg text-xs text-[#0F172A]"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveItem('suggestedKPIs', idx)}
                      className="text-[#94A3B8] hover:text-[#DC2626] p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#F1F5F9]">
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-[#64748B] hover:text-[#0F172A] cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Problem</span>
            </button>

            <button
              onClick={() => setStep(3)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#2A7C13] hover:bg-[#236810] text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
            >
              <span>Review Challenge</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: REVIEW AND PUBLISH */}
      {step === 3 && (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="pb-4 border-b border-[#F1F5F9]">
            <span className="text-xs font-semibold text-[#2A7C13] uppercase tracking-wider">
              Step 3: Review and Publish
            </span>
            <h2 className="text-xl font-bold text-[#0F172A] mt-1">
              {draft.title}
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Urban Development Department • 90 Days Controlled Pilot
            </p>
          </div>

          <div className="bg-[#FAFDF8] border border-[#E2E8F0] rounded-xl p-5 space-y-4">
            <div>
              <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                Problem Statement
              </div>
              <p className="text-xs text-[#0F172A] mt-1 leading-relaxed">
                {draft.problemStatement}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[#E2E8F0]">
              <div>
                <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                  Target Beneficiaries
                </div>
                <ul className="text-xs text-[#334155] mt-1 space-y-1">
                  {draft.targetUsers.map((u, i) => (
                    <li key={i}>• {u}</li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                  Required Capabilities
                </div>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {draft.requiredCapabilities.map((c, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#F0F8EC] text-[#2A7C13] border border-[#2A7C13]/20"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E2E8F0]">
              <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                Suggested Pilot KPIs
              </div>
              <ul className="text-xs text-[#334155] mt-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {draft.suggestedKPIs.map((kpi, i) => (
                  <li key={i} className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-[#E2E8F0]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2A7C13] shrink-0" />
                    <span>{kpi}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <AiBadge variant="banner" text="This challenge was structured with AI decision support. Authorized officers retain full authority and responsibility for publication." />

          <div className="flex items-center justify-between pt-4 border-t border-[#F1F5F9]">
            <button
              onClick={() => setStep(2)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-[#64748B] hover:text-[#0F172A] cursor-pointer"
            >
              <FileEdit className="w-4 h-4" />
              <span>Back to Edit</span>
            </button>

            <button
              onClick={() => setShowPublishModal(true)}
              className="flex items-center gap-2 px-7 py-2.5 rounded-xl bg-[#2A7C13] hover:bg-[#236810] text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Publish Challenge</span>
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmationModal
        isOpen={showPublishModal}
        onClose={() => setShowPublishModal(false)}
        onConfirm={() => {
          setShowPublishModal(false);
          handlePublish();
        }}
        title="Publish Innovation Challenge?"
        message={`Are you sure you want to publish "${draft.title}"? This will officially open the problem statement to registered startups for capability matching and proposal submissions.`}
        confirmLabel="Confirm & Publish"
        variant="primary"
      />
    </div>
  );
};
