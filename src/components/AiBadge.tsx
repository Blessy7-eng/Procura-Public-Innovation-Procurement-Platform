import React from 'react';
import { Sparkles, ShieldCheck } from 'lucide-react';

interface AiBadgeProps {
  text?: string;
  variant?: 'subtle' | 'banner' | 'pill';
}

export const AiBadge: React.FC<AiBadgeProps> = ({
  text = 'AI-assisted suggestion — final decision remains with the authorised official.',
  variant = 'pill'
}) => {
  if (variant === 'banner') {
    return (
      <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FFFDF5] border border-[#FBE6C2] text-[#334155] text-xs leading-relaxed">
        <Sparkles className="w-4 h-4 text-[#2A7C13] mt-0.5 shrink-0" />
        <div>
          <span className="font-semibold text-[#0F172A]">Decision Support Notice:</span> {text}
        </div>
      </div>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#F0F8EC] text-[#2A7C13] border border-[#2A7C13]/20">
      <Sparkles className="w-3.5 h-3.5 text-[#2A7C13]" />
      <span>{text}</span>
    </span>
  );
};

export const VerificationBadge: React.FC<{ status: 'verified' | 'pending' | 'rejected' }> = ({ status }) => {
  if (status === 'verified') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#F0F8EC] text-[#2A7C13] border border-[#2A7C13]/20">
        <ShieldCheck className="w-3.5 h-3.5 text-[#2A7C13]" />
        Official Verification: DPIIT / State Cell Confirmed
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#FFFDF5] text-[#9A6700] border border-[#FBE6C2]">
      Pending Official Department Verification
    </span>
  );
};
