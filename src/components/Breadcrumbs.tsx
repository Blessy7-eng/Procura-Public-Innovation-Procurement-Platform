import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { useApp, AppView } from '../context/AppContext';

export interface BreadcrumbItem {
  label: string;
  view?: AppView;
  params?: { challengeId?: string; pilotId?: string; applicationId?: string };
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  const { navigate, role } = useApp();

  const getDefaultDashboard = (): AppView => {
    switch (role) {
      case 'government':
        return 'gov-dashboard';
      case 'startup':
        return 'startup-dashboard';
      case 'evaluator':
        return 'eval-dashboard';
    }
  };

  return (
    <nav aria-label="Breadcrumb" className="flex items-center text-xs text-[#64748B] mb-3 select-none">
      <button
        onClick={() => navigate(getDefaultDashboard())}
        className="flex items-center gap-1 hover:text-[#2A7C13] transition-colors cursor-pointer font-medium"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Dashboard</span>
      </button>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            <ChevronRight className="w-3 h-3 mx-1.5 text-[#CBD5E1] shrink-0" />
            {isLast || !item.view ? (
              <span className={`truncate max-w-[200px] sm:max-w-xs ${isLast ? 'text-[#0F172A] font-semibold' : 'text-[#64748B]'}`}>
                {item.label}
              </span>
            ) : (
              <button
                onClick={() => navigate(item.view!, item.params)}
                className="hover:text-[#2A7C13] transition-colors cursor-pointer font-medium truncate max-w-[160px]"
              >
                {item.label}
              </button>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
