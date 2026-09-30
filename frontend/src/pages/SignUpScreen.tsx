import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import {
  Shield,
  Building2,
  Rocket,
  Scale,
  CheckCircle2,
  ArrowRight,
  User,
  Mail,
  Lock,
  MapPin,
  Briefcase
} from 'lucide-react';

export const SignUpScreen: React.FC = () => {
  const { navigate, loginWithRole, showToast } = useApp();
  const [role, setRole] = useState<UserRole>('government');

  // Common fields
  const [name, setName] = useState<string>('Officer Ramesh Patel');
  const [email, setEmail] = useState<string>('ramesh.patel@urban.gov.in');
  const [password, setPassword] = useState<string>('SecurePass123!');
  const [confirmPassword, setConfirmPassword] = useState<string>('SecurePass123!');

  // Gov specific
  const [department, setDepartment] = useState<string>('Urban Development Department');
  const [designation, setDesignation] = useState<string>('Joint Commissioner (Smart City)');
  const [location, setLocation] = useState<string>('City Municipal Corporation');

  // Startup specific
  const [startupName, setStartupName] = useState<string>('EcoTrack Technologies');
  const [website, setWebsite] = useState<string>('https://ecotrack.io');
  const [industry, setIndustry] = useState<string>('CleanTech & GovTech');
  const [teamSize, setTeamSize] = useState<string>('10–25 members');
  const [recognition, setRecognition] = useState<string>('DPIIT Recognised #DIPP84920');

  // Evaluator specific
  const [organization, setOrganization] = useState<string>('National Evaluation & Audit Board');
  const [expertise, setExpertise] = useState<string>('Municipal Waste & IoT Telemetry');
  const [yearsExperience, setYearsExperience] = useState<string>('12 years');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showToast({
        type: 'error',
        title: 'Password Mismatch',
        message: 'The password fields do not match.'
      });
      return;
    }

    showToast({
      type: 'success',
      title: 'Account Created',
      message: `Welcome to Procura, ${name}!`
    });

    await loginWithRole(role, {
      id: `usr-${Date.now()}`,
      name,
      email,
      role,
      createdAt: new Date().toISOString()
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full mx-auto bg-white border border-[#E2E8F0] rounded-2xl shadow-sm p-8 sm:p-10 space-y-6">
        {/* Header */}
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F0F8EC] border border-[#2A7C13]/20 text-[#2A7C13] text-xs font-semibold mb-2">
            <Shield className="w-3.5 h-3.5" />
            <span>PROCURA Access Portal</span>
          </div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Create your Procura account</h1>
          <p className="text-xs text-[#64748B]">
            Join the public innovation ecosystem connecting public problems with startup solutions.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* First field: Role Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-[#334155]">
              I am joining as
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setRole('government')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  role === 'government'
                    ? 'bg-[#F2F9EE] border-[#2A7C13] ring-1 ring-[#2A7C13]/30'
                    : 'bg-white border-[#E2E8F0] hover:bg-[#F8FAFC]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Building2 className={`w-4 h-4 ${role === 'government' ? 'text-[#2A7C13]' : 'text-[#64748B]'}`} />
                  {role === 'government' && <CheckCircle2 className="w-3.5 h-3.5 text-[#2A7C13]" />}
                </div>
                <div className="text-xs font-bold text-[#0F172A]">Government Officer</div>
                <div className="text-[10px] text-[#64748B] mt-0.5">Municipal & state depts</div>
              </button>

              <button
                type="button"
                onClick={() => setRole('startup')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  role === 'startup'
                    ? 'bg-[#F2F9EE] border-[#2A7C13] ring-1 ring-[#2A7C13]/30'
                    : 'bg-white border-[#E2E8F0] hover:bg-[#F8FAFC]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Rocket className={`w-4 h-4 ${role === 'startup' ? 'text-[#2A7C13]' : 'text-[#64748B]'}`} />
                  {role === 'startup' && <CheckCircle2 className="w-3.5 h-3.5 text-[#2A7C13]" />}
                </div>
                <div className="text-xs font-bold text-[#0F172A]">Startup</div>
                <div className="text-[10px] text-[#64748B] mt-0.5">Innovators & creators</div>
              </button>

              <button
                type="button"
                onClick={() => setRole('evaluator')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  role === 'evaluator'
                    ? 'bg-[#F2F9EE] border-[#2A7C13] ring-1 ring-[#2A7C13]/30'
                    : 'bg-white border-[#E2E8F0] hover:bg-[#F8FAFC]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Scale className={`w-4 h-4 ${role === 'evaluator' ? 'text-[#2A7C13]' : 'text-[#64748B]'}`} />
                  {role === 'evaluator' && <CheckCircle2 className="w-3.5 h-3.5 text-[#2A7C13]" />}
                </div>
                <div className="text-xs font-bold text-[#0F172A]">Evaluator</div>
                <div className="text-[10px] text-[#64748B] mt-0.5">Review committee</div>
              </button>
            </div>
          </div>

          {/* DYNAMIC FIELDS PER ROLE */}
          {role === 'government' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              <div>
                <label className="block text-xs font-medium text-[#334155] mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2A7C13]/30 focus:border-[#2A7C13]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#334155] mb-1">Official Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2A7C13]/30 focus:border-[#2A7C13]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#334155] mb-1">Department</label>
                <select
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2A7C13]/30 focus:border-[#2A7C13]"
                >
                  <option value="Urban Development Department">Urban Development Department</option>
                  <option value="Renewable Energy & Power Agency">Renewable Energy & Power Agency</option>
                  <option value="Public Works Department (PWD)">Public Works Department (PWD)</option>
                  <option value="Smart City Innovation Mission">Smart City Innovation Mission</option>
                  <option value="Water Supply & Sewerage Board">Water Supply & Sewerage Board</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#334155] mb-1">Designation</label>
                <input
                  type="text"
                  required
                  value={designation}
                  onChange={e => setDesignation(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2A7C13]/30 focus:border-[#2A7C13]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-[#334155] mb-1">Location / Jurisdiction</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2A7C13]/30 focus:border-[#2A7C13]"
                />
              </div>
            </div>
          )}

          {role === 'startup' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              <div>
                <label className="block text-xs font-medium text-[#334155] mb-1">Founder / Contact Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2A7C13]/30 focus:border-[#2A7C13]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#334155] mb-1">Startup Name</label>
                <input
                  type="text"
                  required
                  value={startupName}
                  onChange={e => setStartupName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2A7C13]/30 focus:border-[#2A7C13]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#334155] mb-1">Business Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2A7C13]/30 focus:border-[#2A7C13]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#334155] mb-1">Website</label>
                <input
                  type="url"
                  value={website}
                  onChange={e => setWebsite(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2A7C13]/30 focus:border-[#2A7C13]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#334155] mb-1">Location</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2A7C13]/30 focus:border-[#2A7C13]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#334155] mb-1">Industry</label>
                <input
                  type="text"
                  required
                  value={industry}
                  onChange={e => setIndustry(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2A7C13]/30 focus:border-[#2A7C13]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#334155] mb-1">Team Size</label>
                <input
                  type="text"
                  value={teamSize}
                  onChange={e => setTeamSize(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2A7C13]/30 focus:border-[#2A7C13]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#334155] mb-1">Startup Recognition</label>
                <input
                  type="text"
                  value={recognition}
                  onChange={e => setRecognition(e.target.value)}
                  placeholder="e.g. DPIIT / State Startup Cell ID"
                  className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2A7C13]/30 focus:border-[#2A7C13]"
                />
              </div>
            </div>
          )}

          {role === 'evaluator' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              <div>
                <label className="block text-xs font-medium text-[#334155] mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2A7C13]/30 focus:border-[#2A7C13]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#334155] mb-1">Professional Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2A7C13]/30 focus:border-[#2A7C13]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#334155] mb-1">Organization / Institution</label>
                <input
                  type="text"
                  required
                  value={organization}
                  onChange={e => setOrganization(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2A7C13]/30 focus:border-[#2A7C13]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#334155] mb-1">Designation</label>
                <input
                  type="text"
                  required
                  value={designation}
                  onChange={e => setDesignation(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2A7C13]/30 focus:border-[#2A7C13]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#334155] mb-1">Area of Expertise</label>
                <input
                  type="text"
                  required
                  value={expertise}
                  onChange={e => setExpertise(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2A7C13]/30 focus:border-[#2A7C13]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#334155] mb-1">Years of Experience</label>
                <input
                  type="text"
                  required
                  value={yearsExperience}
                  onChange={e => setYearsExperience(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2A7C13]/30 focus:border-[#2A7C13]"
                />
              </div>
            </div>
          )}

          {/* Password fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 border-t border-[#E2E8F0]">
            <div>
              <label className="block text-xs font-medium text-[#334155] mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2A7C13]/30 focus:border-[#2A7C13]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#334155] mb-1">Confirm Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2A7C13]/30 focus:border-[#2A7C13]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-[#2A7C13] hover:bg-[#236810] text-white font-semibold text-xs rounded-xl shadow-sm transition-colors cursor-pointer"
          >
            Create Account
          </button>
        </form>

        <div className="text-center text-xs text-[#64748B]">
          Already have an account?{' '}
          <button
            onClick={() => navigate('login')}
            className="text-[#2A7C13] hover:underline font-semibold cursor-pointer"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
};
