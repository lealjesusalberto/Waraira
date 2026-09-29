import React from 'react';
import { useApp } from '../context/AppContext';
import { ArrowRight, Mountain, ShieldCheck, UserCheck } from 'lucide-react';

export default function OnboardingView() {
  const { setCurrentView } = useApp();

  return (
    <div className="splash-cover-page">
      
      {/* Full-Bleed Background with Soft Gradient (Photo clearly visible) */}
      <div className="splash-bg-wrapper">
        <img 
          src="/assets/images/hero.jpg" 
          alt="El Ávila Waraira Repano" 
          className="splash-hero-img" 
        />
        <div className="splash-soft-gradient"></div>
      </div>

      {/* Minimalist Splashscreen Content */}
      <div className="splash-content-box animate-pop">
        
        {/* Top Floating Badge */}
        <div className="splash-inparques-badge">
          <img src="/assets/images/logo.jpg" alt="Logo Ávila Pass" className="splash-logo-mini" />
          <span>INPARQUES • Caracas • Waraira Repano</span>
        </div>

        {/* Hero Title & Subtitle */}
        <div className="splash-text-center">
          <h1 className="splash-main-title">
            Ávila <span className="highlight-green">Pass</span>
          </h1>
          <p className="splash-tagline">
            Senderismo seguro, registro de ascensos y retorno protegido en el Waraira Repano.
          </p>
        </div>

        {/* Live Status Pill */}
        <div className="splash-status-pill">
          <span className="pulse-dot-green"></span>
          <span>5 Casetas Activas • Clima en Montaña: 21°C</span>
        </div>

        {/* Direct Action Buttons */}
        <div className="splash-actions-group">
          <button 
            className="btn-splash-primary btn-glow"
            onClick={() => setCurrentView('home')}
          >
            <span>Ingresar a Ávila Pass</span>
            <ArrowRight size={20} />
          </button>

          <button 
            className="btn-splash-secondary"
            onClick={() => setCurrentView('auth')}
          >
            <UserCheck size={16} />
            <span>Ficha de Senderista</span>
          </button>
        </div>

        {/* Subtle Bottom Trust Note */}
        <div className="splash-trust-note">
          <ShieldCheck size={14} className="text-green" />
          <span>Control Preventivo Oficial • 100% PWA Offline</span>
        </div>

      </div>

    </div>
  );
}
