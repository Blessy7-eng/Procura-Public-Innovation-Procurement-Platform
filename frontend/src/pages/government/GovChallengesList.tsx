import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { Challenge } from '../../types';
import {
  Target,
  PlusCircle,
  ArrowRight,
  Clock,
  Rocket,
  Search,
  Filter,
  Activity,
  CheckCircle2
} from 'lucide-react';

export const GovChallengesList: React.FC = () => {
  const { navigate } = useApp();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getChallenges();
        setChallenges(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredChallenges = challenges.filter(c => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.problemStatement.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.requiredCapabilities?.some(cap => cap.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (filterStatus === 'all') return true;
    return c.status === filterStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#2A7C13] uppercase tracking-wider">
            <Target className="w-4 h-4" />
            <span>Innovation Portfolios</span>
          </div>
          <h1 className="text-2xl font-bold text-[#0F172A] mt-1">
            Department Challenges
          </h1>
          <p className="text-xs text-[#64748B] mt-1 max-w-2xl leading-relaxed">
            Public problem statements defined by civic departments. Connect with innovative startups, review matching solutions, and authorize controlled field trials.
          </p>
        </div>

        <button
          onClick={() => navigate('gov-create-challenge')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2A7C13] hover:bg-[#236810] text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create a Challenge</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="relative w-full sm:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#94A3B8]">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search by challenge title, capability, or department..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-1 focus:ring-[#2A7C13] focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All Challenges' },
            { id: 'published', label: 'Open' },
            { id: 'pilot_active', label: 'Pilot Running' },
            { id: 'evaluation', label: 'In Evaluation' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterStatus(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                filterStatus === f.id
                  ? 'bg-[#F0F8EC] text-[#2A7C13] border border-[#2A7C13]/30'
                  : 'bg-white text-[#64748B] border border-[#E2E8F0] hover:text-[#0F172A]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Challenges List */}
      {loading ? (
        <div className="py-20 text-center text-[#64748B] text-xs">
          Loading innovation challenges...
        </div>
      ) : filteredChallenges.length === 0 ? (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-12 text-center space-y-3">
          <Target className="w-10 h-10 text-[#94A3B8] mx-auto" />
          <h3 className="text-sm font-bold text-[#0F172A]">No Challenges Found</h3>
          <p className="text-xs text-[#64748B] max-w-sm mx-auto">
            Try adjusting your search query or create a new challenge to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredChallenges.map(challenge => (
            <div
              key={challenge.id}
              className="bg-white border border-[#E2E8F0] rounded-xl p-5 sm:p-6 hover:border-[#CBD5E1] transition-all shadow-xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                      challenge.status === 'pilot_active'
                        ? 'bg-[#F0F8EC] text-[#2A7C13] border border-[#2A7C13]/20'
                        : challenge.status === 'evaluation'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-sky-50 text-sky-700 border border-sky-200'
                    }`}
                  >
                    {challenge.status.replace(/_/g, ' ')}
                  </span>
                  <span className="text-xs text-[#64748B]">
                    Urban Development Department
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
                  <Clock className="w-3.5 h-3.5 text-[#2A7C13]" />
                  <span>Duration: <strong>{challenge.pilotDuration || '90 days'}</strong></span>
                </div>
              </div>

              <div>
                <h2 className="text-base sm:text-lg font-bold text-[#0F172A]">
                  {challenge.title}
                </h2>
                <p className="text-xs text-[#475569] mt-1 line-clamp-2 leading-relaxed">
                  {challenge.problemStatement}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-semibold text-[#64748B] mr-1">
                  Required Capabilities:
                </span>
                {challenge.requiredCapabilities?.map((c, i) => (
                  <span
                    key={i}
                    className="text-[10px] px-2 py-0.5 rounded bg-[#F1F5F9] text-[#475569] font-medium"
                  >
                    {c}
                  </span>
                ))}
              </div>

              <div className="pt-3 border-t border-[#F1F5F9] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3 text-[#64748B]">
                  <span className="flex items-center gap-1 text-[#2A7C13] font-semibold">
                    <Rocket className="w-3.5 h-3.5" />
                    <span>Startups Matched</span>
                  </span>
                  <span>•</span>
                  <span>Target: Ward 12 Municipal Zones</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate('gov-challenge-detail', { challengeId: challenge.id })}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-[#F8FAFC] text-[#0F172A] border border-[#CBD5E1] text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                  >
                    <span>View Challenge & Matches</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#2A7C13]" />
                  </button>

                  {challenge.status === 'pilot_active' && (
                    <button
                      onClick={() => navigate('gov-pilot-detail', { pilotId: 'plt-waste-1' })}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2A7C13] hover:bg-[#236810] text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                    >
                      <Activity className="w-3.5 h-3.5" />
                      <span>Monitor Pilot</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
