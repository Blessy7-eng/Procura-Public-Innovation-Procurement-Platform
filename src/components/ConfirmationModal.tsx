import React from 'react';
import { AlertCircle, CheckCircle2, AlertTriangle, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'primary' | 'warning' | 'danger';
  isLoading?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm Action',
  cancelLabel = 'Cancel',
  variant = 'primary',
  isLoading = false
}) => {
  if (!isOpen) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case 'warning':
        return {
          icon: <AlertTriangle className="w-5 h-5 text-[#D97706]" />,
          iconBg: 'bg-[#FFFDF5] border border-[#FBE6C2]',
          btnClass: 'bg-[#D97706] hover:bg-[#B45309] text-white'
        };
      case 'danger':
        return {
          icon: <AlertCircle className="w-5 h-5 text-[#DC2626]" />,
          iconBg: 'bg-[#FEF2F2] border border-[#FECACA]',
          btnClass: 'bg-[#DC2626] hover:bg-[#B91C1C] text-white'
        };
      default:
        return {
          icon: <CheckCircle2 className="w-5 h-5 text-[#2A7C13]" />,
          iconBg: 'bg-[#F0F8EC] border border-[#2A7C13]/20',
          btnClass: 'bg-[#2A7C13] hover:bg-[#236810] text-white'
        };
    }
  };

  const { icon, iconBg, btnClass } = getVariantStyles();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white border border-[#E2E8F0] rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4 animate-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
              {icon}
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0F172A]">{title}</h3>
              <p className="text-xs text-[#64748B] mt-0.5">Official Procurement Action</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-[#475569] leading-relaxed">
          {message}
        </p>

        <div className="flex justify-end gap-2.5 pt-2 border-t border-[#F1F5F9]">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors cursor-pointer disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50 ${btnClass}`}
          >
            {isLoading ? 'Processing...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
