import React from 'react';
import { useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import Toast from './components/Toast';
import ModalCheckin from './components/ModalCheckin';
import ModalCheckout from './components/ModalCheckout';
import ModalScanner from './components/ModalScanner';
import ModalSos from './components/ModalSos';
import ModalQrCards from './components/ModalQrCards';

import OnboardingView from './views/OnboardingView';
import AuthView from './views/AuthView';
import HomeView from './views/HomeView';
import ActiveHikeView from './views/ActiveHikeView';
import RangerConsoleView from './views/RangerConsoleView';
import ProfileView from './views/ProfileView';

export default function App() {
  const { currentView } = useApp();

  const renderView = () => {
    switch (currentView) {
      case 'onboarding':
        return <OnboardingView />;
      case 'auth':
        return <AuthView />;
      case 'home':
        return <HomeView />;
      case 'active-hike':
        return <ActiveHikeView />;
      case 'ranger-console':
        return <RangerConsoleView />;
      case 'profile':
        return <ProfileView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="app-root-container">
      
      {/* Universal Top Glass Navbar */}
      <Navbar />

      {/* Main Viewport Container */}
      <main className="app-main-viewport">
        {renderView()}
      </main>

      {/* Mobile Floating Bottom Bar */}
      <BottomNav />

      {/* Global Notifications */}
      <Toast />

      {/* Interactive Overlays / Modals */}
      <ModalCheckin />
      <ModalCheckout />
      <ModalScanner />
      <ModalSos />
      <ModalQrCards />

    </div>
  );
}
