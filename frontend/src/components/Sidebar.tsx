import React from 'react';
import { useApp, AppView } from '../context/AppContext';
import {
  LayoutDashboard,
  Target,
  Rocket,
  FileText,
  Activity,
  Award,
  Layers,
  CheckCircle2,
  FolderKanban,
  FileCheck,
  TrendingUp,
  PlusCircle,
  X,
  ChevronLeft,
  ChevronRight,
  Home
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  view: AppView;
  icon: any;
  badge?: string;
}

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const { role, currentView, navigate, sidebarCollapsed, toggleSidebar } = useApp();

  const getNavItems = (): NavItem[] => {
    switch (role) {
      case 'government':
        return [
          { id: 'gov-dash', label: 'Dashboard', view: 'gov-dashboard', icon: LayoutDashboard },
          { id: 'gov-chal', label: 'Challenges', view: 'gov-challenges', icon: Target, badge: '4' },
          { id: 'gov-start', label: 'Startups', view: 'gov-startups', icon: Rocket },
          { id: 'gov-app', label: 'Applications', view: 'gov-applications', icon: FileText, badge: '3' },
          { id: 'gov-plt', label: 'Pilots', view: 'gov-pilots', icon: Activity, badge: '1 active' },
          { id: 'gov-rev', label: 'Scale-up Review', view: 'gov-scale-up-review', icon: TrendingUp },
          { id: 'gov-act', label: 'Activity Trail', view: 'activity-trail', icon: Layers }
        ];

      case 'startup':
        return [
          { id: 'st-dash', label: 'Dashboard', view: 'startup-dashboard', icon: LayoutDashboard },
          { id: 'st-market', label: 'Challenges', view: 'startup-marketplace', icon: Target, badge: '3 Matches' },
          { id: 'st-app', label: 'My Applications', view: 'startup-applications', icon: FileText, badge: '2' },
          { id: 'st-sol', label: 'My Solutions', view: 'startup-solutions', icon: FolderKanban },
          { id: 'st-plt', label: 'Pilots', view: 'startup-pilot-view', icon: Activity, badge: 'Day 47' },
          { id: 'st-evidence', label: 'Evidence', view: 'startup-evidence', icon: FileCheck, badge: 'Verified' }
        ];

      case 'evaluator':
        return [
          { id: 'ev-dash', label: 'Dashboard', view: 'eval-dashboard', icon: LayoutDashboard },
          { id: 'ev-app', label: 'Applications', view: 'eval-applications', icon: FileText, badge: '1 pending' },
          { id: 'ev-score', label: 'Evaluations', view: 'eval-review', icon: Award },
          { id: 'ev-plt', label: 'Pilots', view: 'eval-pilots', icon: Activity },
          { id: 'ev-evidence', label: 'Evidence', view: 'eval-evidence', icon: FileCheck, badge: 'Review' },
          { id: 'ev-act', label: 'Activity Trail', view: 'activity-trail', icon: Layers }
        ];
    }
  };

  const navItems = getNavItems();

  const handleNavClick = (view: AppView) => {
    navigate(view);
    if (onCloseMobile) onCloseMobile();
  };

  const renderContent = (isMobile: boolean = false) => {
    const isCollapsed = !isMobile && sidebarCollapsed;

    return (
      <div className={`h-full bg-white text-[#0F172A] flex flex-col justify-between select-none ${
        isCollapsed ? 'w-18' : 'w-64'
      } transition-all duration-200`}>
        {/* Workspace Info / Mobile Header */}
        <div>
          <div className="p-4 border-b border-[#F1F5F9] bg-[#FAFDF8] flex items-center justify-between">
            {!isCollapsed ? (
              <div className="flex-1 min-w-0 pr-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                  Workspace
                </div>
                <div className="text-xs font-bold text-[#0F172A] mt-0.5 truncate">
                  {role === 'government' && 'Urban Development Dept'}
                  {role === 'startup' && 'EcoTrack Technologies'}
                  {role === 'evaluator' && 'Technical Evaluation Panel'}
                </div>
                <div className="text-[11px] text-[#2A7C13] font-semibold mt-0.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2A7C13]"></span>
                  <span className="capitalize">{role === 'government' ? 'Government Officer' : role}</span>
                </div>
              </div>
            ) : (
              <div className="mx-auto py-1">
                <span className="w-2 h-2 rounded-full bg-[#2A7C13] block"></span>
              </div>
            )}

            {/* Mobile X close button */}
            {isMobile && (
              <button
                type="button"
                onClick={onCloseMobile}
                className="p-1.5 rounded-xl text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
                aria-label="Close Sidebar"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Navigation Items Group */}
          <div className="px-3 pt-3 pb-1">
            {!isCollapsed && (
              <div className="text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8] px-3 mb-1">
                Navigation
              </div>
            )}
          </div>

          <nav className="px-2 sm:px-3 space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentView === item.view;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.view)}
                  title={isCollapsed ? item.label : undefined}
                  className={`w-full flex items-center ${
                    isCollapsed ? 'justify-center p-3' : 'justify-between px-3 py-2.5'
                  } rounded-xl text-xs font-semibold transition-all cursor-pointer relative ${
                    isActive
                      ? 'bg-[#F0F8EC] text-[#2A7C13]'
                      : 'text-[#475569] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
                  }`}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#2A7C13] rounded-r-md"></span>
                  )}

                  <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? 'text-[#2A7C13]' : 'text-[#64748B]'
                      }`}
                    />
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                  </div>

                  {!isCollapsed && item.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0 ${
                        isActive
                          ? 'bg-[#2A7C13] text-white'
                          : 'bg-[#F1F5F9] text-[#64748B]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Public Home Link */}
            <div className="pt-2 border-t border-[#F1F5F9] my-1">
              <button
                onClick={() => handleNavClick('landing')}
                className={`w-full flex items-center ${
                  isCollapsed ? 'justify-center px-0' : 'px-3 justify-between'
                } py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer text-[#475569] hover:text-[#0F172A] hover:bg-[#F1F5F9]`}
                title="Go to Home Page"
              >
                <div className="flex items-center gap-3">
                  <Home className="w-4 h-4 text-[#2A7C13] shrink-0" />
                  {!isCollapsed && <span>Public Home</span>}
                </div>
              </button>
            </div>
          </nav>
        </div>

        {/* Bottom Action Area */}
        <div className="p-3 border-t border-[#F1F5F9] space-y-2">
          {!isCollapsed ? (
            <>
              {role === 'government' && (
                <button
                  onClick={() => handleNavClick('gov-create-challenge')}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#2A7C13] hover:bg-[#236810] text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Create a Challenge</span>
                </button>
              )}

              {role === 'startup' && (
                <button
                  onClick={() => handleNavClick('startup-solutions')}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#2A7C13] hover:bg-[#236810] text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>+ Add Solution</span>
                </button>
              )}

              {role === 'evaluator' && (
                <button
                  onClick={() => handleNavClick('eval-evidence')}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#2A7C13] hover:bg-[#236810] text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Review Evidence</span>
                </button>
              )}

              <div className="text-center text-[10px] text-[#94A3B8] pt-1">
                PROCURA GovTech
              </div>
            </>
          ) : (
            <button
              onClick={toggleSidebar}
              className="w-full p-2 flex items-center justify-center rounded-xl text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
              title="Expand Sidebar"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Desktop Sticky/Fixed Full-Height Sidebar */}
      <aside className="hidden md:block h-full shrink-0 border-r border-[#E2E8F0] overflow-y-auto">
        {renderContent(false)}
      </aside>

      {/* Mobile Drawer with Backdrop and X Button */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative z-10 h-full max-w-[85vw] border-r border-[#E2E8F0] shadow-2xl animate-in slide-in-from-left duration-200">
            {renderContent(true)}
          </div>
        </div>
      )}
    </>
  );
};
