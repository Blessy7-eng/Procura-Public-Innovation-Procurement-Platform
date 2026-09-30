import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { Application } from '../../types';
import {
  Award,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { ConfirmationModal } from '../../components/ConfirmationModal';

export const EvaluatorAppReview: React.FC = () => {
  const { selectedApplicationId, showToast, navigate } = useApp();
  const [app, setApp] = useState<Application | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [scores, setScores] = useState({
    problemFit: 92,
    technicalFeasibility: 88,
    innovation: 84,
    scalability: 90,
    costEffectiveness: 82,
    notes:
      'Solution demonstrates exceptional domain fit for Ward 12 municipal grievance requirements. Deployment architecture is mature with proven municipal references in Hubballi-Dharwad. Clear cost structure and rapid 14-day onboarding. Recommendation: Approve for 90-day controlled municipal pilot.'
  });

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getApplication(selectedApplicationId || 'app-ecotrack-1');
        setApp(data);
        if (data.evaluation) {
          setScores({
            problemFit: data.evaluation.problemFit,
            technicalFeasibility: data.evaluation.technicalFeasibility,
            innovation: data.evaluation.innovation,
            scalability: data.evaluation.scalability,
            costEffectiveness: data.evaluation.costEffectiveness,
            notes: data.evaluation.notes
          });
        }
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, [selectedApplicationId]);

  // Weighted calculation:
  // Problem Fit 30% + Tech Feas 25% + Innovation 15% + Scalability 15% + Cost Effectiveness 15%
  const weightedScore = Number(
    (
      scores.problemFit * 0.30 +
      scores.technicalFeasibility * 0.25 +
      scores.innovation * 0.15 +
      scores.scalability * 0.15 +
      scores.costEffectiveness * 0.15
    ).toFixed(1)
  );

  const handleSaveScore = async (shortlistForPilot: boolean = false) => {
    if (!app) return;
    try {
      await api.submitEvaluation({
        applicationId: app.id,
        problemFit: scores.problemFit,
        technicalFeasibility: scores.technicalFeasibility,
        innovation: scores.innovation,
        scalability: scores.scalability,
        costEffectiveness: scores.costEffectiveness,
        notes: scores.notes,
        shortlistForPilot
      });

      showToast({
        type: 'success',
        title: shortlistForPilot ? 'Shortlisted for Pilot' : 'Evaluation Saved',
        message: `Scored at ${weightedScore}/100 based on 5 transparent criteria.`
      });

      if (shortlistForPilot) {
        navigate('gov-pilot-detail', { pilotId: 'plt-waste-1' });
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (!app) {
    return (
      <div className="py-20 text-center text-[#64748B] text-xs">
        Loading proposal data...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <Breadcrumbs
        items={[
          { label: 'Applications', view: 'eval-dashboard' },
          { label: app.startup?.name ? `${app.startup.name} Proposal` : 'Application Scoring' }
        ]}
      />

      {/* Header */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-7 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-[#2A7C13] uppercase tracking-wider">
              Technical Evaluation & Scoring
            </span>
            <h1 className="text-xl font-bold text-[#0F172A] mt-0.5">
              {app.startup?.name} — {app.solution?.name}
            </h1>
            <p className="text-xs text-[#64748B] mt-1">
              Challenge: <strong className="text-[#0F172A]">{app.challenge?.title}</strong>
            </p>
          </div>

          <div className="bg-[#FAFDF8] border border-[#E2E8F0] px-4 py-2.5 rounded-xl text-center sm:text-right shrink-0">
            <div className="text-[10px] text-[#64748B] uppercase font-bold">Weighted Score</div>
            <div className="text-2xl font-bold text-[#2A7C13] font-sans mt-0.5">
              {weightedScore} / 100
            </div>
          </div>
        </div>

        {/* Proposal Summary Box */}
        <div className="bg-[#FAFDF8] p-4 rounded-xl border border-[#E2E8F0] space-y-2 text-xs text-[#334155]">
          <div>
            <strong className="text-[#0F172A]">Proposed Approach:</strong> {app.proposedApproach}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-[#E2E8F0] text-[#64748B]">
            <div>Timeline: <strong className="text-[#0F172A]">{app.proposedTimeline}</strong></div>
            <div>Proposed Budget: <strong className="text-[#0F172A]">{app.proposedCost}</strong></div>
          </div>
        </div>
      </div>

      {/* 5 Transparent Criteria Sliders */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-7 space-y-5 shadow-xs">
        <div>
          <h2 className="text-sm font-bold text-[#0F172A]">5-Factor Evaluation Criteria</h2>
          <p className="text-xs text-[#64748B]">
            Transparent public procurement weighting. Adjust sliders to record score.
          </p>
        </div>

        <div className="space-y-4 text-xs">
          {/* 1. Problem Fit */}
          <div className="space-y-1 bg-[#FAFDF8] p-3.5 rounded-xl border border-[#E2E8F0]">
            <div className="flex justify-between items-center">
              <div>
                <span className="font-bold text-[#0F172A]">1. Problem Fit (30% Weight)</span>
                <p className="text-[11px] text-[#64748B]">Alignment with municipal waste collection complaint workflows</p>
              </div>
              <span className="text-sm font-bold text-[#2A7C13]">{scores.problemFit} / 100</span>
            </div>
            <input
              type="range"
              min="40"
              max="100"
              value={scores.problemFit}
              onChange={e => setScores({ ...scores, problemFit: Number(e.target.value) })}
              className="w-full accent-[#2A7C13] cursor-pointer"
            />
          </div>

          {/* 2. Technical Feasibility */}
          <div className="space-y-1 bg-[#FAFDF8] p-3.5 rounded-xl border border-[#E2E8F0]">
            <div className="flex justify-between items-center">
              <div>
                <span className="font-bold text-[#0F172A]">2. Technical Feasibility (25% Weight)</span>
                <p className="text-[11px] text-[#64748B]">Architecture maturity, GPS telemetry, PostGIS mapping and SMS integration</p>
              </div>
              <span className="text-sm font-bold text-[#2A7C13]">{scores.technicalFeasibility} / 100</span>
            </div>
            <input
              type="range"
              min="40"
              max="100"
              value={scores.technicalFeasibility}
              onChange={e => setScores({ ...scores, technicalFeasibility: Number(e.target.value) })}
              className="w-full accent-[#2A7C13] cursor-pointer"
            />
          </div>

          {/* 3. Innovation */}
          <div className="space-y-1 bg-[#FAFDF8] p-3.5 rounded-xl border border-[#E2E8F0]">
            <div className="flex justify-between items-center">
              <div>
                <span className="font-bold text-[#0F172A]">3. Innovation (15% Weight)</span>
                <p className="text-[11px] text-[#64748B]">Novel automated triaging and citizen photo verification vs legacy manual logs</p>
              </div>
              <span className="text-sm font-bold text-[#2A7C13]">{scores.innovation} / 100</span>
            </div>
            <input
              type="range"
              min="40"
              max="100"
              value={scores.innovation}
              onChange={e => setScores({ ...scores, innovation: Number(e.target.value) })}
              className="w-full accent-[#2A7C13] cursor-pointer"
            />
          </div>

          {/* 4. Scalability */}
          <div className="space-y-1 bg-[#FAFDF8] p-3.5 rounded-xl border border-[#E2E8F0]">
            <div className="flex justify-between items-center">
              <div>
                <span className="font-bold text-[#0F172A]">4. Scalability (15% Weight)</span>
                <p className="text-[11px] text-[#64748B]">Ability to expand from Ward 12 (5,000 citizens) to city-wide 14 wards</p>
              </div>
              <span className="text-sm font-bold text-[#2A7C13]">{scores.scalability} / 100</span>
            </div>
            <input
              type="range"
              min="40"
              max="100"
              value={scores.scalability}
              onChange={e => setScores({ ...scores, scalability: Number(e.target.value) })}
              className="w-full accent-[#2A7C13] cursor-pointer"
            />
          </div>

          {/* 5. Cost Effectiveness */}
          <div className="space-y-1 bg-[#FAFDF8] p-3.5 rounded-xl border border-[#E2E8F0]">
            <div className="flex justify-between items-center">
              <div>
                <span className="font-bold text-[#0F172A]">5. Cost Effectiveness (15% Weight)</span>
                <p className="text-[11px] text-[#64748B]">Pilot budget ($4,200) vs expected municipal fuel & overtime savings</p>
              </div>
              <span className="text-sm font-bold text-[#2A7C13]">{scores.costEffectiveness} / 100</span>
            </div>
            <input
              type="range"
              min="40"
              max="100"
              value={scores.costEffectiveness}
              onChange={e => setScores({ ...scores, costEffectiveness: Number(e.target.value) })}
              className="w-full accent-[#2A7C13] cursor-pointer"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-[#334155] mb-1">
              Evaluator Technical Notes & Recommendations
            </label>
            <textarea
              rows={3}
              value={scores.notes}
              onChange={e => setScores({ ...scores, notes: e.target.value })}
              className="w-full p-3 bg-white border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2A7C13]/30 focus:border-[#2A7C13]"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#F1F5F9]">
          <button
            onClick={() => handleSaveScore(false)}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white hover:bg-[#F8FAFC] text-[#334155] font-semibold text-xs border border-[#CBD5E1] transition-colors cursor-pointer"
          >
            Save Draft
          </button>

          <button
            onClick={() => setShowConfirmModal(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#2A7C13] hover:bg-[#236810] text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Shortlist for Pilot</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={() => {
          setShowConfirmModal(false);
          handleSaveScore(true);
        }}
        title="Recommend Proposal for Controlled Pilot?"
        message={`This will record an overall weighted evaluation score of ${weightedScore}/100 and formally recommend ${app.startup?.name} for controlled municipal pilot deployment.`}
        confirmLabel="Confirm Recommendation"
        variant="primary"
      />
    </div>
  );
};
