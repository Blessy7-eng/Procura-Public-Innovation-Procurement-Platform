import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        let Icon = Info;
        let iconColor = 'text-[#2A7C13]';
        let borderColor = 'border-[#E2E8F0]';
        let bg = 'bg-white';

        if (toast.type === 'success') {
          Icon = CheckCircle2;
          iconColor = 'text-[#2A7C13]';
          borderColor = 'border-[#76C457]/40';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          iconColor = 'text-[#D97706]';
          borderColor = 'border-[#FBE6C2]';
        } else if (toast.type === 'error') {
          Icon = AlertCircle;
          iconColor = 'text-[#DC2626]';
          borderColor = 'border-[#FCA5A5]';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border ${borderColor} ${bg} shadow-md text-[#0F172A] animate-in slide-in-from-right-4 fade-in duration-200`}
          >
            <Icon className={`w-5 h-5 shrink-0 ${iconColor} mt-0.5`} />
            <div className="flex-1 text-xs">
              <div className="font-semibold text-[#0F172A]">{toast.title}</div>
              {toast.message && (
                <div className="text-[#475569] mt-0.5 leading-relaxed">{toast.message}</div>
              )}
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-[#94A3B8] hover:text-[#0F172A] p-0.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
