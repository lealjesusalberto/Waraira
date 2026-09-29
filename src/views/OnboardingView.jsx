import React from 'react';
import { useApp } from '../context/AppContext';
import { ArrowRight, UserCheck } from 'lucide-react';

export default function OnboardingView() {
  const { setCurrentView } = useApp();

  return (
    <div className="splash-screen-root">
      
      {/* Full-Bleed Background Image (Clear, soft vignette) */}
      <div className="splash-bg-cover">
        <img 
          src="/assets/images/hero.jpg" 
          alt="El Ávila Waraira Repano" 
          className="splash-bg-photo" 
        />
        <div className="splash-gradient-overlay"></div>
      </div>

      {/* Subtle Top Header */}
      <div className="splash-minimal-header animate-pop">
        <div className="splash-brand-badge">
          <img src="/assets/images/logo.jpg" alt="Logo" className="splash-mini-logo" />
          <span>INPARQUES</span>
        </div>
        <h1 className="splash-minimal-title">Ávila Pass</h1>
        <span className="splash-minimal-sub">Parque Nacional Waraira Repano</span>
      </div>

      {/* Two Small Action Buttons Side by Side at the Very Bottom */}
      <div className="splash-bottom-actions animate-pop">
        <button 
          className="btn-splash-sm btn-splash-glass"
          onClick={() => setCurrentView('auth')}
          title="Ficha preventiva de senderista"
        >
          <UserCheck size={14} />
          <span>Mi Ficha</span>
        </button>

        <button 
          className="btn-splash-sm btn-splash-glow"
          onClick={() => setCurrentView('home')}
          title="Ingresar a puestos y rutas"
        >
          <span>Ingresar</span>
          <ArrowRight size={14} />
        </button>
      </div>

    </div>
  );
}
