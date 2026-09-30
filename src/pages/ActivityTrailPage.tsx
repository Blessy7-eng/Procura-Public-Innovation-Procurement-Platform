import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { ActivityLog, UserRole } from '../types';
import {
  Layers,
  Clock,
  User,
  CheckCircle2,
  Building2,
  Rocket,
  Scale
} from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';

export const ActivityTrailPage: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [roleFilter, setRoleFilter] = useState<string>('all');

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getActivityLogs();
        setLogs(data);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);

  const filteredLogs = roleFilter === 'all'
    ? logs
    : logs.filter(l => l.role === roleFilter);

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'government':
        return <Building2 className="w-3.5 h-3.5 text-[#2A7C13]" />;
      case 'startup':
        return <Rocket className="w-3.5 h-3.5 text-[#2A7C13]" />;
      case 'evaluator':
        return <Scale className="w-3.5 h-3.5 text-[#2A7C13]" />;
    }
  };

  const stages = [
    'Challenge Created',
    'Startup Discovered',
    'Application Submitted',
    'Eligibility Verified',
    'Evaluation Completed',
    'Pilot Approved',
    'Pilot Results Recorded',
    'Evidence Validated',
    'Scale-up Review'
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <Breadcrumbs
        items={[
          { label: 'Activity Trail' }
        ]}
      />

      {/* Header */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-7 space-y-3 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-[#2A7C13] uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4" />
              <span>Immutable Governance Audit Trail</span>
            </span>
            <h1 className="text-2xl font-bold text-[#0F172A] mt-1">
              Procurement Activity Trail
            </h1>
            <p className="text-xs text-[#64748B] mt-0.5">
              Every procurement decision has an evidence trail — from initial problem description to scale-up authorization.
            </p>
          </div>

          {/* Role Filter */}
          <div className="flex items-center gap-1 bg-[#F1F5F9] p-1 rounded-xl border border-[#E2E8F0] shrink-0">
            {['all', 'government', 'startup', 'evaluator'].map(r => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                  roleFilter === r
                    ? 'bg-white text-[#2A7C13] shadow-xs'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* 9-Stage Standard Workflow Graphic */}
        <div className="pt-3 border-t border-[#F1F5F9]">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] mb-2">
            The Procura 9-Stage Governance Lifecycle:
          </div>
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-[#334155]">
            {stages.map((st, idx) => (
              <React.Fragment key={idx}>
                <span className="px-2 py-0.5 rounded bg-[#FAFDF8] border border-[#E2E8F0] text-[#0F172A] font-medium">
                  {st}
                </span>
                {idx < stages.length - 1 && (
                  <span className="text-[#94A3B8] font-bold">→</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Clean Vertical Timeline */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-7 shadow-xs">
        <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E2E8F0]">
          {filteredLogs.map(log => {
            return (
              <div key={log.id} className="relative group">
                {/* Node indicator */}
                <div className="absolute -left-6 sm:-left-8 top-1 w-6 h-6 rounded-full bg-white border-2 border-[#2A7C13] flex items-center justify-center text-[10px] text-[#2A7C13] shadow-xs">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>

                <div className="bg-[#FAFDF8] border border-[#E2E8F0] rounded-xl p-4 space-y-2 hover:border-[#CBD5E1] transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#0F172A]">{log.action}</span>
                      <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.2 rounded-full font-semibold bg-white border border-[#E2E8F0] text-[#475569]">
                        {getRoleIcon(log.role)}
                        <span className="capitalize">{log.role}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-[#64748B]">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(log.createdAt).toLocaleString()}</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#334155] leading-relaxed">
                    {log.description}
                  </p>

                  <div className="text-[11px] text-[#64748B] flex items-center gap-1 pt-1 border-t border-[#F1F5F9]">
                    <User className="w-3 h-3 text-[#94A3B8]" />
                    <span>Actor: <strong className="text-[#0F172A]">{log.actorName}</strong></span>
                    <span className="text-[#CBD5E1] mx-1">•</span>
                    <span>Ref: <strong className="font-mono text-[#475569]">{log.entityId}</strong></span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
