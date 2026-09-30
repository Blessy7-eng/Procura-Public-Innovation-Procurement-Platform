import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { Startup } from '../../types';
import {
  Rocket,
  ShieldCheck,
  Search,
  ExternalLink,
  MapPin,
  Users,
  CheckCircle2,
  Cpu,
  ArrowRight,
  Target
} from 'lucide-react';

export const GovStartupsList: React.FC = () => {
  const { navigate } = useApp();
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterCapability, setFilterCapability] = useState<string>('all');

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getStartups();
        setStartups(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredStartups = startups.filter(st => {
    const matchesSearch =
      st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.technologies?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      st.founderName?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (filterCapability === 'all') return true;
    return st.industry?.toLowerCase().includes(filterCapability.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#2A7C13] uppercase tracking-wider">
            <Rocket className="w-4 h-4" />
            <span>Innovation Ecosystem</span>
          </div>
          <h1 className="text-2xl font-bold text-[#0F172A] mt-1">
            Registered Startups & Innovators
          </h1>
          <p className="text-xs text-[#64748B] mt-1 max-w-2xl leading-relaxed">
            Verified GovTech and CleanTech startups with field-tested solutions ready for controlled municipal pilots.
          </p>
        </div>

        <button
          onClick={() => navigate('gov-challenges')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-[#F8FAFC] text-[#0F172A] border border-[#CBD5E1] font-semibold text-xs shadow-2xs transition-colors cursor-pointer shrink-0"
        >
          <Target className="w-4 h-4 text-[#2A7C13]" />
          <span>Match With Challenges</span>
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
            placeholder="Search by company name, technology, or founder..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-1 focus:ring-[#2A7C13] focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All Industries' },
            { id: 'govtech', label: 'GovTech' },
            { id: 'cleantech', label: 'CleanTech' },
            { id: 'iot', label: 'Smart Cities IoT' },
            { id: 'analytics', label: 'Data & Analytics' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterCapability(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                filterCapability === f.id
                  ? 'bg-[#F0F8EC] text-[#2A7C13] border border-[#2A7C13]/30'
                  : 'bg-white text-[#64748B] border border-[#E2E8F0] hover:text-[#0F172A]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Startups Grid */}
      {loading ? (
        <div className="py-20 text-center text-[#64748B] text-xs">
          Loading startup ecosystem...
        </div>
      ) : filteredStartups.length === 0 ? (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-12 text-center space-y-3">
          <Rocket className="w-10 h-10 text-[#94A3B8] mx-auto" />
          <h3 className="text-sm font-bold text-[#0F172A]">No Startups Found</h3>
          <p className="text-xs text-[#64748B] max-w-sm mx-auto">
            Try adjusting your search criteria or filter options.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredStartups.map(startup => (
            <div
              key={startup.id}
              className="bg-white border border-[#E2E8F0] rounded-xl p-5 sm:p-6 hover:border-[#CBD5E1] transition-all shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#F0F8EC] text-[#2A7C13] flex items-center justify-center font-bold text-sm border border-[#2A7C13]/20">
                      {startup.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-1.5">
                        <span>{startup.name}</span>
                        {startup.verificationStatus === 'verified' && (
                          <span title="Verified Startup">
                            <ShieldCheck className="w-4 h-4 text-[#2A7C13]" />
                          </span>
                        )}
                      </h3>
                      <div className="text-[11px] text-[#64748B] flex items-center gap-2 mt-0.5">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#94A3B8]" />
                          <span>{startup.location}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3 text-[#94A3B8]" />
                          <span>{startup.teamSize}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#F0F8EC] text-[#2A7C13] border border-[#2A7C13]/20 whitespace-nowrap">
                    {startup.startupRecognition || 'DPIIT Recognised'}
                  </span>
                </div>

                <p className="text-xs text-[#475569] leading-relaxed line-clamp-3">
                  {startup.description}
                </p>

                {/* Technologies */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {startup.technologies?.slice(0, 4).map((tech, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-0.5 rounded bg-[#F1F5F9] text-[#475569] font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                  {(startup.technologies?.length || 0) > 4 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#F1F5F9] text-[#64748B]">
                      +{(startup.technologies?.length || 0) - 4} more
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-xs">
                <span className="text-[11px] text-[#2A7C13] font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Profile {startup.profileCompleteness || 85}% Complete</span>
                </span>

                <button
                  onClick={() => navigate('gov-challenge-detail', { challengeId: 'ch-waste-1' })}
                  className="flex items-center gap-1 text-[#2A7C13] hover:underline font-semibold cursor-pointer"
                >
                  <span>Evaluate Compatibility</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
