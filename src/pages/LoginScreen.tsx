import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import {
  Shield,
  Building2,
  Rocket,
  Scale,
  ArrowRight,
  CheckCircle2,
  Lock,
  Mail,
  Eye,
  EyeOff
} from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { loginWithRole, navigate, showToast } = useApp();
  const [selectedRole, setSelectedRole] = useState<UserRole>('government');
  const [email, setEmail] = useState<string>('rajesh.varma@urban.gov.in');
  const [password, setPassword] = useState<string>('••••••••••••');
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Sync sample credentials when role card is selected
  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'government') {
      setEmail('rajesh.varma@urban.gov.in');
    } else if (role === 'startup') {
      setEmail('aarav@ecotrack.io');
    } else if (role === 'evaluator') {
      setEmail('priya.sundaram@evaluators.gov.in');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await loginWithRole(selectedRole);
    } catch (err) {
      console.error(err);
      showToast({
        type: 'error',
        title: 'Authentication Error',
        message: 'Could not complete sign in.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl w-full mx-auto bg-white border border-[#E2E8F0] rounded-2xl shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Side: Brand & Value Proposition */}
        <div className="lg:col-span-5 bg-[#FAFDF8] border-b lg:border-b-0 lg:border-r border-[#E2E8F0] p-8 sm:p-10 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#2A7C13] flex items-center justify-center shadow-sm">
                <Shield className="w-5 h-5 text-white" strokeWidth={2.2} />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-[#0F172A] font-sans">
                  PROCURA
                </span>
                <div className="text-[11px] font-semibold text-[#2A7C13] uppercase tracking-wider">
                  Public Innovation Procurement
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <div className="text-2xl font-bold text-[#0F172A] leading-snug">
                Discover better.<br />
                Test safely.<br />
                <span className="text-[#2A7C13]">Decide with evidence.</span>
              </div>
              <p className="text-xs text-[#475569] leading-relaxed">
                Procura connects government departments with innovative startups and helps teams evaluate solutions through controlled pilots and real-world evidence.
              </p>
            </div>
          </div>

          <div className="pt-8 mt-8 border-t border-[#E2E8F0] space-y-2">
            <div className="text-[11px] font-medium text-[#64748B]">
              Trusted by public authorities & startup missions
            </div>
            <div className="flex items-center gap-4 text-xs text-[#334155] font-medium">
              <span>• Transparent Auditing</span>
              <span>• Controlled Pilots</span>
              <span>• Verified KPIs</span>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form with Role Selection */}
        <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-[#0F172A]">Welcome back</h2>
              <p className="text-xs text-[#64748B] mt-1">
                Sign in to continue to your Procura workspace.
              </p>
            </div>

            {/* Role Selector Card Group */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[#334155]">
                I am signing in as
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {/* Government Card */}
                <button
                  type="button"
                  onClick={() => handleRoleSelect('government')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedRole === 'government'
                      ? 'bg-[#F2F9EE] border-[#2A7C13] ring-1 ring-[#2A7C13]/30'
                      : 'bg-white border-[#E2E8F0] hover:bg-[#F8FAFC]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <Building2 className={`w-4 h-4 ${selectedRole === 'government' ? 'text-[#2A7C13]' : 'text-[#64748B]'}`} />
                    {selectedRole === 'government' && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#2A7C13]" />
                    )}
                  </div>
                  <div className="text-xs font-bold text-[#0F172A]">Government</div>
                  <div className="text-[10px] text-[#64748B] line-clamp-1 mt-0.5">
                    Challenges & pilots
                  </div>
                </button>

                {/* Startup Card */}
                <button
                  type="button"
                  onClick={() => handleRoleSelect('startup')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedRole === 'startup'
                      ? 'bg-[#F2F9EE] border-[#2A7C13] ring-1 ring-[#2A7C13]/30'
                      : 'bg-white border-[#E2E8F0] hover:bg-[#F8FAFC]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <Rocket className={`w-4 h-4 ${selectedRole === 'startup' ? 'text-[#2A7C13]' : 'text-[#64748B]'}`} />
                    {selectedRole === 'startup' && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#2A7C13]" />
                    )}
                  </div>
                  <div className="text-xs font-bold text-[#0F172A]">Startup</div>
                  <div className="text-[10px] text-[#64748B] line-clamp-1 mt-0.5">
                    Solutions & bids
                  </div>
                </button>

                {/* Evaluator Card */}
                <button
                  type="button"
                  onClick={() => handleRoleSelect('evaluator')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedRole === 'evaluator'
                      ? 'bg-[#F2F9EE] border-[#2A7C13] ring-1 ring-[#2A7C13]/30'
                      : 'bg-white border-[#E2E8F0] hover:bg-[#F8FAFC]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <Scale className={`w-4 h-4 ${selectedRole === 'evaluator' ? 'text-[#2A7C13]' : 'text-[#64748B]'}`} />
                    {selectedRole === 'evaluator' && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#2A7C13]" />
                    )}
                  </div>
                  <div className="text-xs font-bold text-[#0F172A]">Evaluator</div>
                  <div className="text-[10px] text-[#64748B] line-clamp-1 mt-0.5">
                    Scoring & evidence
                  </div>
                </button>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4 pt-1">
              <div>
                <label className="block text-xs font-medium text-[#334155] mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#94A3B8]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2A7C13]/30 focus:border-[#2A7C13]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#334155] mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#94A3B8]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-9 pr-9 py-2 bg-white border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2A7C13]/30 focus:border-[#2A7C13]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#94A3B8] hover:text-[#475569]"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded text-[#2A7C13] focus:ring-[#2A7C13] border-[#CBD5E1]"
                  />
                  <span className="text-[#475569]">Remember me</span>
                </label>

                <a
                  href="#forgot"
                  onClick={e => {
                    e.preventDefault();
                    showToast({
                      type: 'info',
                      title: 'Password Reset',
                      message: 'Password reset link sent to demo account.'
                    });
                  }}
                  className="text-[#2A7C13] hover:underline font-medium"
                >
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-2.5 px-4 bg-[#2A7C13] hover:bg-[#236810] text-white font-semibold text-xs rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Signing in...' : 'Sign in to Procura'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="pt-2 text-center text-xs text-[#64748B]">
              Don't have an account?{' '}
              <button
                onClick={() => navigate('signup')}
                className="text-[#2A7C13] hover:underline font-semibold cursor-pointer"
              >
                Create an account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
