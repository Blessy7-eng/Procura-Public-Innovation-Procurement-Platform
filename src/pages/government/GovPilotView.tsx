import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { Pilot } from '../../types';
import {
  Activity,
  CheckCircle2,
  Clock,
  Building2,
  Users,
  TrendingUp,
  FileCheck
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { Breadcrumbs } from '../../components/Breadcrumbs';

export const GovPilotView: React.FC = () => {
  const { selectedPilotId, navigate } = useApp();
  const [pilot, setPilot] = useState<Pilot | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getPilot(selectedPilotId || 'plt-waste-1');
        setPilot(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [selectedPilotId]);

  if (loading || !pilot) {
    return (
      <div className="py-20 text-center text-[#64748B] text-xs">
        Loading pilot telemetry and KPI records...
      </div>
    );
  }

  const chartData = [
    { label: 'Baseline', resolution: 72, sla: 51, satisfaction: 62 },
    { label: 'Day 10', resolution: 58, sla: 60, satisfaction: 65 },
    { label: 'Day 20', resolution: 42, sla: 71, satisfaction: 72 },
    { label: 'Day 30', resolution: 29, sla: 80, satisfaction: 78 },
    { label: 'Day 40', resolution: 21, sla: 86, satisfaction: 82 },
    { label: 'Day 47', resolution: 18, sla: 89, satisfaction: 84 }
  ];

  return (
    <div className="space-y-4">
      <Breadcrumbs
        items={[
          { label: 'Pilots', view: 'gov-pilots' },
          { label: pilot.name }
        ]}
      />

      {/* Pilot Header */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-7 space-y-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F0F8EC] text-[#2A7C13] border border-[#2A7C13]/20">
              <span className="w-2 h-2 rounded-full bg-[#2A7C13] animate-pulse"></span>
              Pilot Status: Running (Day {pilot.currentDay || 47} / {pilot.durationDays || 90})
            </span>
            <span className="text-xs text-[#64748B]">
              Pilot Area: <strong className="text-[#0F172A]">{pilot.pilotArea}</strong>
            </span>
          </div>

          <button
            onClick={() => navigate('gov-scale-up-review', { pilotId: pilot.id })}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2A7C13] hover:bg-[#236810] text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
          >
            <TrendingUp className="w-4 h-4" />
            <span>Scale-up Review</span>
          </button>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A]">
              {pilot.name}
            </h1>
            <p className="text-xs text-[#475569] mt-0.5">
              Startup: <strong className="text-[#2A7C13]">{pilot.startup?.name}</strong> • Solution: {pilot.solution?.name}
            </p>
          </div>

          <div className="bg-[#FAFDF8] border border-[#E2E8F0] px-4 py-2.5 rounded-xl text-center sm:text-right shrink-0">
            <div className="text-[10px] text-[#64748B] uppercase font-bold">Overall KPI Achievement</div>
            <div className="text-2xl font-bold text-[#2A7C13] font-sans">
              {pilot.overallKpiAchievement || 91}%
            </div>
            <div className="text-[10px] text-[#2A7C13] font-semibold">Exceeding baseline targets</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-[#F1F5F9] text-xs text-[#475569]">
          <div><span className="text-[#64748B]">Area:</span> {pilot.pilotArea}</div>
          <div><span className="text-[#64748B]">Target Users:</span> {pilot.targetUsers}</div>
          <div><span className="text-[#64748B]">Timeline:</span> {pilot.startDate} to {pilot.endDate}</div>
        </div>
      </div>

      {/* KPI Comparison Cards */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#2A7C13]" />
          <span>Core KPI Verification (Before vs Target vs Current)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* KPI 1 */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#0F172A]">Resolution Time</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F0F8EC] text-[#2A7C13] font-semibold border border-[#2A7C13]/20">
                Achieved
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center py-2 bg-[#FAFDF8] rounded-lg border border-[#E2E8F0]">
              <div>
                <div className="text-[10px] text-[#64748B] uppercase">Before</div>
                <div className="text-xs font-semibold text-[#475569] font-sans mt-0.5">72h</div>
              </div>
              <div className="border-x border-[#E2E8F0]">
                <div className="text-[10px] text-[#64748B] uppercase">Target</div>
                <div className="text-xs font-semibold text-[#0F172A] font-sans mt-0.5">&lt; 24h</div>
              </div>
              <div>
                <div className="text-[10px] text-[#2A7C13] uppercase font-bold">Current</div>
                <div className="text-sm font-bold text-[#2A7C13] font-sans mt-0.5">18h</div>
              </div>
            </div>
            <p className="text-[11px] text-[#64748B] leading-relaxed">
              Automated zone routing and supervisor SMS alerts reduced complaint triage to under 18 hours.
            </p>
          </div>

          {/* KPI 2 */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#0F172A]">SLA Compliance Rate</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F0F8EC] text-[#2A7C13] font-semibold border border-[#2A7C13]/20">
                Achieved
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center py-2 bg-[#FAFDF8] rounded-lg border border-[#E2E8F0]">
              <div>
                <div className="text-[10px] text-[#64748B] uppercase">Before</div>
                <div className="text-xs font-semibold text-[#475569] font-sans mt-0.5">51%</div>
              </div>
              <div className="border-x border-[#E2E8F0]">
                <div className="text-[10px] text-[#64748B] uppercase">Target</div>
                <div className="text-xs font-semibold text-[#0F172A] font-sans mt-0.5">&gt; 85%</div>
              </div>
              <div>
                <div className="text-[10px] text-[#2A7C13] uppercase font-bold">Current</div>
                <div className="text-sm font-bold text-[#2A7C13] font-sans mt-0.5">89%</div>
              </div>
            </div>
            <p className="text-[11px] text-[#64748B] leading-relaxed">
              Grievance escalation triggers reached junior sanitation engineers automatically upon 12h threshold.
            </p>
          </div>

          {/* KPI 3 */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#0F172A]">Citizen Satisfaction</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F0F8EC] text-[#2A7C13] font-semibold border border-[#2A7C13]/20">
                Achieved
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center py-2 bg-[#FAFDF8] rounded-lg border border-[#E2E8F0]">
              <div>
                <div className="text-[10px] text-[#64748B] uppercase">Before</div>
                <div className="text-xs font-semibold text-[#475569] font-sans mt-0.5">62%</div>
              </div>
              <div className="border-x border-[#E2E8F0]">
                <div className="text-[10px] text-[#64748B] uppercase">Target</div>
                <div className="text-xs font-semibold text-[#0F172A] font-sans mt-0.5">&gt; 80%</div>
              </div>
              <div>
                <div className="text-[10px] text-[#2A7C13] uppercase font-bold">Current</div>
                <div className="text-sm font-bold text-[#2A7C13] font-sans mt-0.5">84%</div>
              </div>
            </div>
            <p className="text-[11px] text-[#64748B] leading-relaxed">
              Real-time SMS updates and photo verification upon resolution gave citizens transparent proof of closure.
            </p>
          </div>
        </div>
      </div>

      {/* KPI Trend Chart using Recharts with soft government colors */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-[#0F172A]">Pilot KPI Telemetry Trajectory (Days 0 to 47)</h3>
            <p className="text-xs text-[#64748B]">Resolution time (hours) dropping while SLA compliance and satisfaction (%) rise.</p>
          </div>
          <span className="text-[11px] font-semibold text-[#2A7C13] bg-[#F0F8EC] px-2.5 py-1 rounded-full border border-[#2A7C13]/20">
            Source: Ward 12 IoT Telemetry
          </span>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="label" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '10px', fontSize: '11px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}
                labelStyle={{ color: '#0f172a', fontWeight: 'bold' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Line
                type="monotone"
                dataKey="resolution"
                name="Resolution Time (h) [Target <24h]"
                stroke="#DC2626"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="sla"
                name="SLA Compliance (%) [Target >85%]"
                stroke="#2A7C13"
                strokeWidth={2.5}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="satisfaction"
                name="Citizen Satisfaction (%) [Target >80%]"
                stroke="#76C457"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Evidence Timeline */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-[#2A7C13]" />
              <span>Pilot Evidence Timeline</span>
            </h3>
            <p className="text-xs text-[#64748B]">Telemetry documents submitted by EcoTrack and validated by evaluation committee</p>
          </div>
          <button
            onClick={() => navigate('eval-evidence')}
            className="text-xs text-[#2A7C13] hover:underline font-semibold cursor-pointer"
          >
            Evidence Validator &rarr;
          </button>
        </div>

        <div className="space-y-2.5 pt-1">
          {pilot.evidence?.map((item) => (
            <div
              key={item.id}
              className="bg-[#FAFDF8] border border-[#E2E8F0] rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-[#F0F8EC] text-[#2A7C13] border border-[#2A7C13]/30 flex items-center justify-center text-[10px] font-bold">
                    ✓
                  </span>
                  <h4 className="font-bold text-[#0F172A]">{item.evidenceTitle}</h4>
                  <span
                    className={`text-[10px] px-2 py-0.2 rounded-full font-semibold ${
                      item.validationStatus === 'validated'
                        ? 'bg-[#F0F8EC] text-[#2A7C13] border border-[#2A7C13]/20'
                        : 'bg-[#FFFDF5] text-[#D97706] border border-[#FBE6C2]'
                    }`}
                  >
                    {item.validationStatus.toUpperCase()}
                  </span>
                </div>
                <p className="text-[#64748B] text-[11px]">{item.evidenceDescription}</p>
                {item.evaluatorNotes && (
                  <div className="text-[11px] text-[#475569] italic">
                    Note: "{item.evaluatorNotes}"
                  </div>
                )}
              </div>

              <div className="text-right shrink-0">
                <span className="font-semibold text-[#2A7C13]">
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
    </div>
  );
};
