import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Shield,
  Search,
  Bell,
  HelpCircle,
  Menu,
  ChevronDown,
  User,
  Settings,
  LogOut,
  CheckCircle2,
  Activity,
  FileCheck,
  Award,
  X,
  Home
} from 'lucide-react';
import { ProfileSettingsModal } from './ProfileSettingsModal';

interface NavbarProps {
  onToggleMobileSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobileSidebar }) => {
  const {
    currentUser,
    role,
    navigate,
    logout,
    toggleSidebar,
    notifications,
    unreadNotificationsCount,
    markAllNotificationsRead,
    dismissNotification
  } = useApp();

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profileModalTab, setProfileModalTab] = useState<'profile' | 'settings'>('profile');

  const userDropdownRef = useRef<HTMLDivElement>(null);
  const notifDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const openProfile = () => {
    setUserDropdownOpen(false);
    setProfileModalTab('profile');
    setProfileModalOpen(true);
  };

  const openSettings = () => {
    setUserDropdownOpen(false);
    setProfileModalTab('settings');
    setProfileModalOpen(true);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'pilot':
        return <Activity className="w-3.5 h-3.5 text-[#2A7C13]" />;
      case 'evidence':
        return <FileCheck className="w-3.5 h-3.5 text-[#2A7C13]" />;
      case 'eval':
        return <Award className="w-3.5 h-3.5 text-[#D97706]" />;
      default:
        return <Bell className="w-3.5 h-3.5 text-[#2A7C13]" />;
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.03)] h-16 shrink-0">
        <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Left: Hamburger and Brand */}
          <div className="flex items-center gap-3">
            {/* Desktop Hamburger Button (collapse/expand full-height sidebar) */}
            <button
              type="button"
              onClick={toggleSidebar}
              className="hidden md:flex p-2 rounded-xl text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
              title="Toggle Sidebar"
              aria-label="Toggle Sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Mobile Hamburger Button (opens drawer) */}
            {onToggleMobileSidebar && (
              <button
                type="button"
                onClick={onToggleMobileSidebar}
                className="md:hidden p-2 rounded-xl text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
                aria-label="Open Navigation Drawer"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            {/* PROCURA Logo & Title */}
            <button
              onClick={() => {
                const defaultHome = role === 'government' ? 'gov-dashboard' : role === 'startup' ? 'startup-dashboard' : 'eval-dashboard';
                navigate(defaultHome);
              }}
              className="flex items-center gap-3 text-left focus:outline-none cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-[#2A7C13] flex items-center justify-center text-white shadow-xs group-hover:bg-[#236810] transition-colors">
                <Shield className="w-5 h-5" strokeWidth={2.2} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold tracking-tight text-[#0F172A] font-sans">
                    PROCURA
                  </span>
                  <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-[#F0F8EC] text-[#2A7C13] border border-[#2A7C13]/20">
                    Public Innovation
                  </span>
                </div>
                <div className="text-[10px] text-[#64748B] font-medium hidden sm:block">
                  Public Innovation Procurement Platform
                </div>
              </div>
            </button>
          </div>

          {/* Center: Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-sm mx-6">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#94A3B8]">
                <Search className="w-3.5 h-3.5" />
              </div>
              <input
                type="text"
                placeholder="Search challenges, pilots, evidence..."
                className="w-full pl-9 pr-3 py-1.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-1 focus:ring-[#2A7C13] focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Right: Notifications, Help, Home, and User Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Home Button */}
            <button
              onClick={() => navigate('landing')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#475569] hover:text-[#0F172A] hover:bg-[#F1F5F9] border border-[#E2E8F0] bg-white transition-colors cursor-pointer shadow-2xs"
              title="Go to Home Page"
            >
              <Home className="w-3.5 h-3.5 text-[#2A7C13]" />
              <span className="hidden sm:inline">Home</span>
            </button>

            {/* Help / Information Button */}
            <button
              onClick={() => setHelpModalOpen(true)}
              className="p-2 rounded-xl text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
              title="Platform Guide & Information"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {/* Notifications Bell with Small Dropdown */}
            <div className="relative" ref={notifDropdownRef}>
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 rounded-xl text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors relative cursor-pointer"
                title="Notifications"
                aria-label="View notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#2A7C13] rounded-full ring-2 ring-white"></span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-[#E2E8F0] rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2 border-b border-[#F1F5F9] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#0F172A]">Notifications</span>
                      {unreadNotificationsCount > 0 && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#F0F8EC] text-[#2A7C13] font-semibold">
                          {unreadNotificationsCount} new
                        </span>
                      )}
                    </div>
                    {unreadNotificationsCount > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-[11px] text-[#2A7C13] hover:underline font-semibold cursor-pointer"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-[#F1F5F9]">
                    {notifications.length === 0 ? (
                      <div className="py-6 text-center text-xs text-[#94A3B8]">
                        No notifications
                      </div>
                    ) : (
                      notifications.map(n => (
                        <div
                          key={n.id}
                          className={`p-3.5 text-xs transition-colors hover:bg-[#F8FAFC] flex gap-3 items-start ${
                            !n.read ? 'bg-[#FAFDF8]' : ''
                          }`}
                        >
                          <div className="w-7 h-7 rounded-lg bg-[#F0F8EC] flex items-center justify-center shrink-0 mt-0.5">
                            {getNotificationIcon(n.type)}
                          </div>
                          <div className="flex-1 space-y-0.5">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-[#0F172A]">{n.title}</span>
                              <span className="text-[10px] text-[#94A3B8]">{n.time}</span>
                            </div>
                            <p className="text-[11px] text-[#475569] leading-relaxed">
                              {n.description}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={userDropdownRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 pl-2.5 rounded-xl border border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                aria-label="User Profile Menu"
              >
                <div className="w-7 h-7 rounded-lg bg-[#F0F8EC] text-[#2A7C13] font-bold text-xs flex items-center justify-center border border-[#2A7C13]/20">
                  {currentUser?.name?.charAt(0) || 'U'}
                </div>
                <div className="hidden sm:block text-left text-xs leading-tight pr-1">
                  <div className="font-semibold text-[#0F172A] truncate max-w-[130px]">
                    {currentUser?.name?.split(' ')[0]}
                  </div>
                  <div className="text-[10px] text-[#64748B] capitalize">{role}</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8]" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-[#E2E8F0] rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2 border-b border-[#F1F5F9]">
                    <div className="text-xs font-semibold text-[#0F172A]">{currentUser?.name}</div>
                    <div className="text-[10px] text-[#64748B] truncate">{currentUser?.email}</div>
                    <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#F0F8EC] text-[#2A7C13]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2A7C13]"></span>
                      <span className="capitalize">{role}</span>
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={openProfile}
                      className="w-full px-4 py-2 text-left text-xs text-[#334155] hover:bg-[#F8FAFC] flex items-center gap-2.5 cursor-pointer font-medium"
                    >
                      <User className="w-4 h-4 text-[#64748B]" />
                      <span>Profile</span>
                    </button>

                    <button
                      onClick={openSettings}
                      className="w-full px-4 py-2 text-left text-xs text-[#334155] hover:bg-[#F8FAFC] flex items-center gap-2.5 cursor-pointer font-medium"
                    >
                      <Settings className="w-4 h-4 text-[#64748B]" />
                      <span>Settings</span>
                    </button>
                  </div>

                  <div className="border-t border-[#F1F5F9] my-1"></div>

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      logout();
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-[#DC2626] hover:bg-[#FEF2F2] flex items-center gap-2.5 cursor-pointer font-medium"
                  >
                    <LogOut className="w-4 h-4 text-[#DC2626]" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Profile & Settings Modal */}
      <ProfileSettingsModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        defaultTab={profileModalTab}
      />

      {/* Help Modal */}
      {helpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white border border-[#E2E8F0] rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#F0F8EC] text-[#2A7C13] flex items-center justify-center border border-[#2A7C13]/20">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0F172A]">About PROCURA</h3>
                  <p className="text-xs text-[#64748B]">Public Innovation Procurement Platform</p>
                </div>
              </div>
              <button
                onClick={() => setHelpModalOpen(false)}
                className="p-1 rounded-lg text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#F1F5F9]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#475569] leading-relaxed">
              Procura connects municipal departments with innovative startups. Instead of rigid legacy tender specifications, problems are solved through controlled field pilots with verifiable KPI telemetry and transparent committee audits.
            </p>

            <div className="bg-[#FAFDF8] border border-[#E2E8F0] rounded-xl p-4 space-y-2 text-xs">
              <div className="font-bold text-[#0F172A]">Current Signed-In Authority:</div>
              <div className="text-[#334155]">
                Role: <strong className="capitalize text-[#2A7C13]">{role}</strong>
              </div>
              <p className="text-[11px] text-[#64748B]">
                Role dashboards are strictly isolated. To change roles, select <strong>Sign Out</strong> from your profile menu and log in with your corresponding role credentials.
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setHelpModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#2A7C13] hover:bg-[#236810] text-white text-xs font-semibold shadow-xs"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
