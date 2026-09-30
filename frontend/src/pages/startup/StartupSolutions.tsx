import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { StartupSolution } from '../../types';
import {
  FolderKanban,
  Plus,
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react';

export const StartupSolutions: React.FC = () => {
  const { navigate, showToast } = useApp();
  const [solutions, setSolutions] = useState<StartupSolution[]>([]);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newSol, setNewSol] = useState({
    name: '',
    problemSolved: '',
    description: '',
    capabilities: 'Complaint management, Municipal workflow, Analytics & reporting',
    technology: 'Node.js, React, PostGIS, Computer Vision, SMS Gateway',
    deploymentModel: 'Cloud SaaS / Hybrid Municipal Cloud',
    implementationTime: '10 to 14 days onboarding',
    estimatedCost: '$4,200 for 90-day pilot',
    previousDeployments: 'Ward 4 & 5 pilot in Hubballi-Dharwad Municipal Corp',
    pilotReadiness: 'Immediate' as const
  });

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getSolutions();
        setSolutions(data);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSol.name || !newSol.description) {
      showToast({ type: 'warning', title: 'Missing Information', message: 'Name and description are required.' });
      return;
    }

    try {
      const created = await api.createSolution({
        startupId: 'st-ecotrack',
        name: newSol.name,
        problemSolved: newSol.problemSolved,
        description: newSol.description,
        capabilities: newSol.capabilities.split(',').map(c => c.trim()),
        technology: newSol.technology,
        deploymentModel: newSol.deploymentModel,
        implementationTime: newSol.implementationTime,
        estimatedCost: newSol.estimatedCost,
        previousDeployments: newSol.previousDeployments,
        pilotReadiness: newSol.pilotReadiness
      });

      setSolutions(prev => [created, ...prev]);
      setShowAddModal(false);
      showToast({
        type: 'success',
        title: 'Solution Published',
        message: `"${created.name}" is now available for challenge matching.`
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <span className="text-xs font-semibold text-[#2A7C13] uppercase tracking-wider">
            Startup Capability Portfolio
          </span>
          <h1 className="text-2xl font-bold text-[#0F172A] mt-0.5">My Innovation Solutions</h1>
          <p className="text-xs text-[#64748B] mt-1 max-w-2xl">
            Register modular products, technological capabilities, and verified readiness tiers to match with open government procurement challenges.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2A7C13] hover:bg-[#236810] text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Solution</span>
        </button>
      </div>

      {/* Solutions Grid */}
      <div className="space-y-4">
        {solutions.map(sol => (
          <div
            key={sol.id}
            className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs hover:border-[#CBD5E1] transition-all space-y-3.5"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-[#0F172A]">{sol.name}</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#F0F8EC] text-[#2A7C13] border border-[#2A7C13]/20">
                    Readiness: {sol.pilotReadiness}
                  </span>
                </div>
                <div className="text-xs text-[#64748B]">
                  Model: <strong className="text-[#334155]">{sol.deploymentModel}</strong> • Tech: {sol.technology}
                </div>
              </div>

              <button
                onClick={() => navigate('startup-marketplace')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#F8FAFC] text-xs font-semibold text-[#2A7C13] border border-[#CBD5E1] transition-colors shrink-0 cursor-pointer"
              >
                <span>Apply to Challenge</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs text-[#475569] leading-relaxed max-w-4xl">
              {sol.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-[#F1F5F9] text-xs text-[#475569]">
              <div>
                <span className="text-[#64748B]">Problem Solved:</span>
                <div className="text-[#0F172A] mt-0.5">{sol.problemSolved}</div>
              </div>
              <div>
                <span className="text-[#64748B]">Implementation Timeline:</span>
                <div className="text-[#0F172A] mt-0.5">{sol.implementationTime}</div>
              </div>
              <div>
                <span className="text-[#64748B]">Estimated Pilot Budget:</span>
                <div className="text-[#0F172A] mt-0.5">{sol.estimatedCost}</div>
              </div>
            </div>

            {/* Capabilities badges */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] text-[#64748B] mr-1">Capabilities:</span>
              {sol.capabilities.map((c, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#F1F5F9] text-[#334155]"
                >
                  ✓ {c}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Add Solution Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white border border-[#E2E8F0] rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
              <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                <FolderKanban className="w-4 h-4 text-[#2A7C13]" />
                <span>+ Add New Solution</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-[#94A3B8] hover:text-[#0F172A] p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-[#334155] mb-1">Solution Name</label>
                <input
                  type="text"
                  placeholder="e.g. AI Waste Management Platform"
                  value={newSol.name}
                  onChange={e => setNewSol({ ...newSol, name: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2A7C13]/30 focus:border-[#2A7C13]"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-[#334155] mb-1">Problem Solved</label>
                <input
                  type="text"
                  placeholder="e.g. Manual municipal complaint routing and lack of citizen visibility"
                  value={newSol.problemSolved}
                  onChange={e => setNewSol({ ...newSol, problemSolved: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2A7C13]/30 focus:border-[#2A7C13]"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-[#334155] mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe your architecture, telemetry, and civic workflow capabilities..."
                  value={newSol.description}
                  onChange={e => setNewSol({ ...newSol, description: e.target.value })}
                  className="w-full p-3 bg-white border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2A7C13]/30 focus:border-[#2A7C13]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#334155] mb-1">Capabilities (Comma-separated)</label>
                  <input
                    type="text"
                    value={newSol.capabilities}
                    onChange={e => setNewSol({ ...newSol, capabilities: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2A7C13]/30 focus:border-[#2A7C13]"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#334155] mb-1">Pilot Readiness</label>
                  <select
                    value={newSol.pilotReadiness}
                    onChange={e => setNewSol({ ...newSol, pilotReadiness: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2A7C13]/30 focus:border-[#2A7C13]"
                  >
                    <option value="Immediate">Immediate (Ready in &lt;14 days)</option>
                    <option value="High">High (Ready in 30 days)</option>
                    <option value="Medium">Medium (Ready in 60 days)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-[#334155] mb-1">Implementation Time</label>
                  <input
                    type="text"
                    placeholder="e.g. 10 to 14 days"
                    value={newSol.implementationTime}
                    onChange={e => setNewSol({ ...newSol, implementationTime: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2A7C13]/30 focus:border-[#2A7C13]"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#334155] mb-1">Estimated 90-day Pilot Budget</label>
                  <input
                    type="text"
                    placeholder="e.g. $4,200"
                    value={newSol.estimatedCost}
                    onChange={e => setNewSol({ ...newSol, estimatedCost: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2A7C13]/30 focus:border-[#2A7C13]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-[#334155] mb-1">Previous Deployments / References</label>
                <input
                  type="text"
                  placeholder="e.g. Ward 4 & 5 municipal deployment in Hubballi-Dharwad"
                  value={newSol.previousDeployments}
                  onChange={e => setNewSol({ ...newSol, previousDeployments: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2A7C13]/30 focus:border-[#2A7C13]"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-[#F1F5F9]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-[#64748B] hover:text-[#0F172A] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#2A7C13] hover:bg-[#236810] text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  Publish Solution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
