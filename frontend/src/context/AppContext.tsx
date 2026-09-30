import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, User } from '../types';
import { api } from '../services/api';

export type AppView =
  | 'splash'
  | 'login'
  | 'signup'
  | 'landing'
  // Government views
  | 'gov-dashboard'
  | 'gov-create-challenge'
  | 'gov-challenges'
  | 'gov-challenge-detail'
  | 'gov-startups'
  | 'gov-applications'
  | 'gov-pilots'
  | 'gov-pilot-detail'
  | 'gov-scale-up-review'
  // Startup views
  | 'startup-dashboard'
  | 'startup-profile'
  | 'startup-solutions'
  | 'startup-marketplace'
  | 'startup-applications'
  | 'startup-pilot-view'
  | 'startup-evidence'
  // Evaluator views
  | 'eval-dashboard'
  | 'eval-applications'
  | 'eval-review'
  | 'eval-pilots'
  | 'eval-evidence'
  // Shared
  | 'activity-trail';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: 'pilot' | 'evidence' | 'challenge' | 'eval';
}

const ROLE_ALLOWED_VIEWS: Record<UserRole, AppView[]> = {
  government: [
    'gov-dashboard',
    'gov-create-challenge',
    'gov-challenges',
    'gov-challenge-detail',
    'gov-startups',
    'gov-applications',
    'gov-pilots',
    'gov-pilot-detail',
    'gov-scale-up-review',
    'activity-trail'
  ],
  startup: [
    'startup-dashboard',
    'startup-profile',
    'startup-solutions',
    'startup-marketplace',
    'startup-applications',
    'startup-pilot-view',
    'startup-evidence'
  ],
  evaluator: [
    'eval-dashboard',
    'eval-applications',
    'eval-review',
    'eval-pilots',
    'eval-evidence',
    'activity-trail'
  ]
};

const PUBLIC_VIEWS: AppView[] = ['splash', 'login', 'signup', 'landing'];

interface AppContextType {
  role: UserRole;
  currentUser: User | null;
  currentView: AppView;
  selectedChallengeId: string;
  selectedPilotId: string;
  selectedApplicationId: string;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  notifications: AppNotification[];
  unreadNotificationsCount: number;
  markAllNotificationsRead: () => void;
  dismissNotification: (id: string) => void;
  toasts: ToastMessage[];
  loginWithRole: (targetRole: UserRole, customUser?: User) => Promise<void>;
  navigate: (view: AppView, params?: { challengeId?: string; pilotId?: string; applicationId?: string }) => void;
  showToast: (toast: Omit<ToastMessage, 'id'>) => void;
  dismissToast: (id: string) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'Ward 12 Pilot Telemetry',
    description: 'Day 47 checkpoint logged. Resolution time reached 18h (< 24h target).',
    time: '12m ago',
    read: false,
    type: 'pilot'
  },
  {
    id: 'notif-2',
    title: 'New Pilot Evidence Submitted',
    description: 'EcoTrack Technologies uploaded citizen survey telemetry logs.',
    time: '1h ago',
    read: false,
    type: 'evidence'
  },
  {
    id: 'notif-3',
    title: 'Challenge Evaluation Complete',
    description: 'Committee scored AI Waste Management proposal at 88/100.',
    time: '3h ago',
    read: true,
    type: 'eval'
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('government');
  const [currentUser, setCurrentUser] = useState<User | null>({
    id: 'usr-gov-1',
    name: 'Officer Rajesh Varma',
    email: 'rajesh.varma@urban.gov.in',
    role: 'government',
    organizationId: 'dept-1',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-08-01T09:00:00Z'
  });

  // Start on splash screen
  const [currentView, setCurrentView] = useState<AppView>('splash');
  const [selectedChallengeId, setSelectedChallengeId] = useState<string>('ch-waste-1');
  const [selectedPilotId, setSelectedPilotId] = useState<string>('plt-waste-1');
  const [selectedApplicationId, setSelectedApplicationId] = useState<string>('app-ecotrack-1');
  
  // Clean single-toast queue
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sidebar toggle state
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const toggleSidebar = () => setSidebarCollapsed(prev => !prev);

  // Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);

  useEffect(() => {
    // Initial fetch to sync user details
    api.demoLogin(role).then(res => {
      if (res.user) {
        setCurrentUser(res.user);
      }
    }).catch(console.error);
  }, []);

  // Authentication: only invoked from Login / SignUp / Landing entry points
  const loginWithRole = async (targetRole: UserRole, customUser?: User) => {
    try {
      const res = await api.demoLogin(targetRole);
      setRole(targetRole);
      setCurrentUser(customUser || res.user);

      // Route to that role's dedicated home dashboard
      if (targetRole === 'government') {
        setCurrentView('gov-dashboard');
      } else if (targetRole === 'startup') {
        setCurrentView('startup-dashboard');
      } else if (targetRole === 'evaluator') {
        setCurrentView('eval-dashboard');
      }

      showToast({
        type: 'success',
        title: 'Signed In Successfully',
        message: `Welcome, ${customUser?.name || res.user.name}`
      });
    } catch (e) {
      console.error(e);
      showToast({
        type: 'error',
        title: 'Authentication Failed',
        message: 'Could not complete sign in.'
      });
    }
  };

  const logout = () => {
    setCurrentView('login');
    showToast({
      type: 'info',
      title: 'Signed Out',
      message: 'You have returned to the Procura sign-in portal.'
    });
  };

  // Route protection: prevents accessing other roles' dashboards
  const navigate = (
    view: AppView,
    params?: { challengeId?: string; pilotId?: string; applicationId?: string }
  ) => {
    // Check role authorization for non-public views
    if (!PUBLIC_VIEWS.includes(view)) {
      const allowedViews = ROLE_ALLOWED_VIEWS[role] || [];
      if (!allowedViews.includes(view)) {
        showToast({
          type: 'error',
          title: 'Access Restricted',
          message: `Your account (${role}) does not have permission to view that route. Sign out to switch roles.`
        });
        const defaultView = role === 'government' ? 'gov-dashboard' : role === 'startup' ? 'startup-dashboard' : 'eval-dashboard';
        setCurrentView(defaultView);
        return;
      }
    }

    if (params?.challengeId) setSelectedChallengeId(params.challengeId);
    if (params?.pilotId) setSelectedPilotId(params.pilotId);
    if (params?.applicationId) setSelectedApplicationId(params.applicationId);
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Show exactly ONE toast per action (no stacked or duplicate toasts)
  const showToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}`;
    setToasts([{ ...toast, id }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        role,
        currentUser,
        currentView,
        selectedChallengeId,
        selectedPilotId,
        selectedApplicationId,
        sidebarCollapsed,
        toggleSidebar,
        setSidebarCollapsed,
        notifications,
        unreadNotificationsCount,
        markAllNotificationsRead,
        dismissNotification,
        toasts,
        loginWithRole,
        navigate,
        showToast,
        dismissToast,
        logout
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
