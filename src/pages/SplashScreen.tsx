import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Shield } from 'lucide-react';

export const SplashScreen: React.FC = () => {
  const { navigate } = useApp();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('login');
    }, 1800);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#FFFDF5] flex flex-col items-center justify-center p-6 select-none">
      <div className="max-w-md w-full text-center space-y-6 animate-in fade-in duration-500">
        {/* Simple Procura Green Icon */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-[#2A7C13] flex items-center justify-center shadow-sm ring-4 ring-[#76C457]/20">
          <Shield className="w-8 h-8 text-white" strokeWidth={2.2} />
        </div>

        {/* Title & Tagline */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-center gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-[#0F172A] font-sans">
              PROCURA
            </span>
          </div>
          <div className="text-sm font-semibold tracking-wide uppercase text-[#2A7C13]">
            Public Innovation Procurement
          </div>
        </div>

        {/* Supporting Message */}
        <p className="text-sm text-[#475569] max-w-xs mx-auto leading-relaxed">
          Connecting public problems with startup innovation.
        </p>

        {/* Subtle Minimal Loading Indicator */}
        <div className="pt-4 flex flex-col items-center gap-3">
          <div className="w-36 h-1 bg-[#FBE6C2] rounded-full overflow-hidden">
            <div className="h-full bg-[#2A7C13] rounded-full animate-pulse w-3/4 transition-all duration-700"></div>
          </div>
          <button
            onClick={() => navigate('login')}
            className="text-[11px] text-[#64748B] hover:text-[#2A7C13] transition-colors underline underline-offset-2 cursor-pointer pt-2"
          >
            Continue to Portal &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};
