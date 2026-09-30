import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { ToastContainer } from './components/ToastContainer';
import { SplashScreen } from './pages/SplashScreen';
import { LoginScreen } from './pages/LoginScreen';
import { SignUpScreen } from './pages/SignUpScreen';
import { LandingPage } from './pages/LandingPage';
import { GovDashboard } from './pages/government/GovDashboard';
import { GovCreateChallenge } from './pages/government/GovCreateChallenge';
import { GovChallengeDetail } from './pages/government/GovChallengeDetail';
import { GovChallengesList } from './pages/government/GovChallengesList';
import { GovStartupsList } from './pages/government/GovStartupsList';
import { GovPilotView } from './pages/government/GovPilotView';
import { GovScaleUpReview } from './pages/government/GovScaleUpReview';
import { StartupDashboard } from './pages/startup/StartupDashboard';
import { StartupProfile } from './pages/startup/StartupProfile';
import { StartupSolutions } from './pages/startup/StartupSolutions';
import { StartupMarketplace } from './pages/startup/StartupMarketplace';
import { StartupApplications } from './pages/startup/StartupApplications';
import { StartupPilotView } from './pages/startup/StartupPilotView';
import { StartupEvidenceView } from './pages/startup/StartupEvidenceView';
import { EvaluatorDashboard } from './pages/evaluator/EvaluatorDashboard';
import { EvaluatorAppReview } from './pages/evaluator/EvaluatorAppReview';
import { EvaluatorEvidenceReview } from './pages/evaluator/EvaluatorEvidenceReview';
import { ActivityTrailPage } from './pages/ActivityTrailPage';

const MainLayout: React.FC = () => {
  const { currentView, role } = useApp();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Splash Screen
  if (currentView === 'splash') {
    return (
      <>
        <SplashScreen />
        <ToastContainer />
      </>
    );
  }

  // Login Screen
  if (currentView === 'login') {
    return (
      <>
        <LoginScreen />
        <ToastContainer />
      </>
    );
  }

  // Sign Up Screen
  if (currentView === 'signup') {
    return (
      <>
        <SignUpScreen />
        <ToastContainer />
      </>
    );
  }

  // Public Landing Page
  if (currentView === 'landing') {
    return (
      <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans">
        <Navbar onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} />
        <LandingPage />
        <ToastContainer />
      </div>
    );
  }

  // Strictly Role-Isolated Application Workspace
  const renderCurrentView = () => {
    // 1. Government Role Views
    if (role === 'government') {
      switch (currentView) {
        case 'gov-dashboard':
          return <GovDashboard />;
        case 'gov-challenges':
          return <GovChallengesList />;
        case 'gov-create-challenge':
          return <GovCreateChallenge />;
        case 'gov-challenge-detail':
          return <GovChallengeDetail />;
        case 'gov-startups':
          return <GovStartupsList />;
        case 'gov-applications':
          return <StartupApplications />;
        case 'gov-pilots':
        case 'gov-pilot-detail':
          return <GovPilotView />;
        case 'gov-scale-up-review':
          return <GovScaleUpReview />;
        case 'activity-trail':
          return <ActivityTrailPage />;
        default:
          return <GovDashboard />;
      }
    }

    // 2. Startup Role Views
    if (role === 'startup') {
      switch (currentView) {
        case 'startup-dashboard':
          return <StartupDashboard />;
        case 'startup-profile':
          return <StartupProfile />;
        case 'startup-solutions':
          return <StartupSolutions />;
        case 'startup-marketplace':
          return <StartupMarketplace />;
        case 'startup-applications':
          return <StartupApplications />;
        case 'startup-pilot-view':
          return <StartupPilotView />;
        case 'startup-evidence':
          return <StartupEvidenceView />;
        default:
          return <StartupDashboard />;
      }
    }

    // 3. Evaluator Role Views
    if (role === 'evaluator') {
      switch (currentView) {
        case 'eval-dashboard':
        case 'eval-applications':
          return <EvaluatorDashboard />;
        case 'eval-review':
          return <EvaluatorAppReview />;
        case 'eval-pilots':
          return <GovPilotView />;
        case 'eval-evidence':
          return <EvaluatorEvidenceReview />;
        case 'activity-trail':
          return <ActivityTrailPage />;
        default:
          return <EvaluatorDashboard />;
      }
    }

    return <GovDashboard />;
  };

  return (
    <div className="h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A] font-sans antialiased selection:bg-[#2A7C13] selection:text-white overflow-hidden">
      <Navbar onToggleMobileSidebar={() => setMobileSidebarOpen(true)} />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {renderCurrentView()}
        </main>
      </div>
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

export default App;
