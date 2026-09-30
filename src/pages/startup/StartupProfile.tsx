import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  ShieldCheck,
  CheckCircle2,
  Award,
  Save
} from 'lucide-react';
import { VerificationBadge } from '../../components/AiBadge';

export const StartupProfile: React.FC = () => {
  const { showToast } = useApp();
  const [profile, setProfile] = useState({
    name: 'EcoTrack Technologies',
    founderName: 'Aarav Sharma',
    email: 'aarav@ecotrack.io',
    website: 'https://ecotrack.io',
    location: 'Bengaluru / Hyderabad',
    industry: 'GovTech & CleanTech',
    teamSize: '24 members',
    startupRecognition: 'DPIIT Recognised #DIPP84920',
    verificationStatus: 'verified' as const,
    profileCompleteness: 85,
    description:
      'AI-enabled municipal complaint and waste monitoring platform providing automated dispatch, citizen transparency, and real-time SLA telemetry.',
    technologies: [
      'Computer Vision Grievance Verification',
      'Route Optimization & GPS Dispatch',
      'SMS & WhatsApp Citizen Gateways',
      'Municipal GIS Spatial Mapping',
      'PostGIS & Node.js Cloud Backend'
    ],
    previousDeployments:
      'Successfully deployed in Hubballi-Dharwad Municipal Corporation (Ward 4 & 5) covering 45,000 citizens with 92% resolution SLA compliance.'
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast({
      type: 'success',
      title: 'Profile Updated',
      message: 'Startup details saved successfully.'
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-7 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#2A7C13] flex items-center justify-center font-bold text-white text-lg font-sans">
              E
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-[#0F172A]">{profile.name}</h1>
                <VerificationBadge status={profile.verificationStatus} />
              </div>
              <p className="text-xs text-[#64748B]">
                Public Innovation Procurement Profile • {profile.industry}
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-[#64748B] font-medium">Profile Completeness:</span>
            <div className="text-2xl font-bold text-[#2A7C13] font-sans">
              {profile.profileCompleteness}%
            </div>
          </div>
        </div>

        {/* Official Verification Disclaimer */}
        <div className="p-3.5 rounded-xl bg-[#FAFDF8] border border-[#2A7C13]/20 text-xs text-[#475569] flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-[#2A7C13] shrink-0 mt-0.5" />
          <div>
            <strong className="text-[#0F172A]">Official Verification Notice:</strong> Startup eligibility and verification are confirmed by authorised state innovation cells and department officials. AI does not legally verify eligibility.
          </div>
        </div>
      </div>

      {/* Main Profile Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Company Info */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 space-y-4 shadow-xs">
          <h2 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#2A7C13]" />
            <span>Company Information</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#334155] mb-1">Startup Legal Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={e => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-3.5 py-2 bg-white border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2A7C13]/30 focus:border-[#2A7C13]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#334155] mb-1">Founder / Primary Contact</label>
              <input
                type="text"
                value={profile.founderName}
                onChange={e => setProfile({ ...profile, founderName: e.target.value })}
                className="w-full px-3.5 py-2 bg-white border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2A7C13]/30 focus:border-[#2A7C13]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#334155] mb-1">Contact Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={e => setProfile({ ...profile, email: e.target.value })}
                className="w-full px-3.5 py-2 bg-white border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2A7C13]/30 focus:border-[#2A7C13]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#334155] mb-1">Website</label>
              <input
                type="text"
                value={profile.website}
                onChange={e => setProfile({ ...profile, website: e.target.value })}
                className="w-full px-3.5 py-2 bg-white border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2A7C13]/30 focus:border-[#2A7C13]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#334155] mb-1">Headquarters Location</label>
              <input
                type="text"
                value={profile.location}
                onChange={e => setProfile({ ...profile, location: e.target.value })}
                className="w-full px-3.5 py-2 bg-white border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2A7C13]/30 focus:border-[#2A7C13]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#334155] mb-1">Team Size</label>
              <input
                type="text"
                value={profile.teamSize}
                onChange={e => setProfile({ ...profile, teamSize: e.target.value })}
                className="w-full px-3.5 py-2 bg-white border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2A7C13]/30 focus:border-[#2A7C13]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#334155] mb-1">Company Description</label>
            <textarea
              rows={3}
              value={profile.description}
              onChange={e => setProfile({ ...profile, description: e.target.value })}
              className="w-full p-3 bg-white border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2A7C13]/30 focus:border-[#2A7C13]"
            />
          </div>
        </div>

        {/* Section 2: Credentials & Previous Deployments */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 space-y-4 shadow-xs">
          <h2 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
            <Award className="w-4 h-4 text-[#2A7C13]" />
            <span>Credentials & Proven Field Deployments</span>
          </h2>

          <div>
            <label className="block text-xs font-medium text-[#334155] mb-1">
              Government / Startup Recognition ID
            </label>
            <input
              type="text"
              value={profile.startupRecognition}
              onChange={e => setProfile({ ...profile, startupRecognition: e.target.value })}
              className="w-full px-3.5 py-2 bg-white border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2A7C13]/30 focus:border-[#2A7C13]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#334155] mb-1">
              Previous Municipal / Public Deployments
            </label>
            <textarea
              rows={2}
              value={profile.previousDeployments}
              onChange={e => setProfile({ ...profile, previousDeployments: e.target.value })}
              className="w-full p-3 bg-white border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2A7C13]/30 focus:border-[#2A7C13] leading-relaxed"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#2A7C13] hover:bg-[#236810] text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile</span>
          </button>
        </div>
      </form>
    </div>
  );
};
