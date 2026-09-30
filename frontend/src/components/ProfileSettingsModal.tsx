import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  Shield,
  Building2,
  Mail,
  Lock,
  Bell,
  CheckCircle2,
  X,
  ShieldCheck,
  Save
} from 'lucide-react';

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'profile' | 'settings';
}

export const ProfileSettingsModal: React.FC<ProfileSettingsModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'profile'
}) => {
  const { currentUser, role, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'profile' | 'settings'>(defaultTab);

  // Settings states
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [telemetryUpdates, setTelemetryUpdates] = useState(true);
  const [auditLogging, setAuditLogging] = useState(true);

  if (!isOpen) return null;

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    showToast({
      type: 'success',
      title: 'Preferences Saved',
      message: 'Your system and notification settings have been updated.'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white border border-[#E2E8F0] rounded-2xl max-w-lg w-full overflow-hidden shadow-xl animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-[#F1F5F9] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F0F8EC] text-[#2A7C13] flex items-center justify-center font-bold text-base border border-[#2A7C13]/20">
              {currentUser?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0F172A]">{currentUser?.name}</h2>
              <div className="flex items-center gap-1.5 text-xs text-[#2A7C13] font-semibold capitalize">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2A7C13]"></span>
                <span>{role === 'government' ? 'Government Officer' : role}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#F1F5F9] px-5 bg-[#FAFDF8]">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 text-xs font-semibold border-b-2 mr-6 transition-colors cursor-pointer ${
              activeTab === 'profile'
                ? 'border-[#2A7C13] text-[#2A7C13]'
                : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            User Profile
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'settings'
                ? 'border-[#2A7C13] text-[#2A7C13]'
                : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            System Settings & Security
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'profile' ? (
            <div className="space-y-4 text-xs">
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 space-y-2">
                <div className="text-[10px] font-bold uppercase text-[#64748B]">Official Designation</div>
                <div className="text-sm font-bold text-[#0F172A]">
                  {role === 'government' && 'Joint Commissioner (Smart City & Urban Works)'}
                  {role === 'startup' && 'Lead Founder & Principal Architect'}
                  {role === 'evaluator' && 'Senior Technical Evaluation Auditor'}
                </div>
                <div className="text-xs text-[#64748B]">
                  Organization: {role === 'government' ? 'Urban Development Department' : role === 'startup' ? 'EcoTrack Technologies' : 'Technical Evaluation Panel'}
                </div>
              </div>

              <div className="space-y-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-[#64748B] mb-1">Official Email</label>
                  <div className="px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] font-mono">
                    {currentUser?.email}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#64748B] mb-1">Access Role & Clearance</label>
                  <div className="px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] flex items-center justify-between">
                    <span className="capitalize">{role} Portal Account</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#F0F8EC] text-[#2A7C13] border border-[#2A7C13]/20">
                      Verified Active
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#64748B] mb-1">Role Security Rule</label>
                  <p className="text-[11px] text-[#64748B] leading-relaxed bg-[#FFFDF5] p-3 rounded-xl border border-[#FBE6C2]">
                    To switch roles, sign out of this account and sign in with the target authority credentials. Route isolation is strictly enforced.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl border border-[#E2E8F0] hover:border-[#CBD5E1]">
                  <div>
                    <div className="font-bold text-[#0F172A]">Pilot Telemetry Notifications</div>
                    <div className="text-[11px] text-[#64748B]">Receive real-time alerts when KPI checkpoints are recorded.</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={telemetryUpdates}
                    onChange={e => setTelemetryUpdates(e.target.checked)}
                    className="w-4 h-4 rounded text-[#2A7C13] focus:ring-[#2A7C13]"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl border border-[#E2E8F0] hover:border-[#CBD5E1]">
                  <div>
                    <div className="font-bold text-[#0F172A]">Official Email Digests</div>
                    <div className="text-[11px] text-[#64748B]">Weekly summary of challenge submissions and evidence status.</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailAlerts}
                    onChange={e => setEmailAlerts(e.target.checked)}
                    className="w-4 h-4 rounded text-[#2A7C13] focus:ring-[#2A7C13]"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl border border-[#E2E8F0] hover:border-[#CBD5E1]">
                  <div>
                    <div className="font-bold text-[#0F172A]">Audit Trail Logging</div>
                    <div className="text-[11px] text-[#64748B]">Cryptographically log every state transition to activity trail.</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={auditLogging}
                    onChange={e => setAuditLogging(e.target.checked)}
                    className="w-4 h-4 rounded text-[#2A7C13] focus:ring-[#2A7C13]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#2A7C13] hover:bg-[#236810] text-white font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save System Preferences</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
