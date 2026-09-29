import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  QrCode, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  ArrowRight, 
  Compass, 
  Mountain,
  HeartHandshake
} from 'lucide-react';

export default function OnboardingView() {
  const { setCurrentView } = useApp();

  return (
    <div className="onboarding-page-wrap">
      
      {/* Full-Bleed Cinematic Background */}
      <div className="onboarding-cover-backdrop">
        <img 
          src="/assets/images/hero.jpg" 
          alt="Hiking Cover Waraira Repano" 
          className="onboarding-cover-img" 
        />
        <div className="onboarding-cover-gradient"></div>
      </div>

      <div className="onboarding-content-container">
        
        {/* Left Column / Main Information */}
        <div className="onboarding-text-column">
          
          <div className="brand-pill">
            <img src="/assets/images/logo.jpg" alt="Logo Ávila Pass" className="brand-logo-small" />
            <span>INPARQUES • Caracas • Waraira Repano</span>
          </div>

          <h1 className="onboarding-title">
            Senderismo <span className="highlight-green">Inteligente</span> y Seguro en <span className="highlight-yellow">El Ávila</span>
          </h1>

          <p className="onboarding-desc">
            Registro digital oficial de entrada y salida mediante códigos QR para senderistas del Parque Nacional Waraira Repano. Control preventivo de ascensos, estimación de retorno y aviso automático en caso de extravío.
          </p>

          {/* Mountain Weather Bar */}
          <div className="onboarding-status-bar">
            <div className="osb-item">
              <span className="pulse-dot-green"></span>
              <span>Puestos Activos: Sabas Nieves • La Julia • Los Venados</span>
            </div>
            <div className="osb-item osb-highlight">
              <Clock size={14} className="text-yellow" />
              <span>21°C • Límite Descenso: 17:30</span>
            </div>
          </div>

          {/* Features Grid with Clean Vector Icons */}
          <div className="onboarding-features-grid">
            <div className="feat-card">
              <div className="feat-icon-badge feat-qr">
                <QrCode size={20} />
              </div>
              <div className="feat-text">
                <strong>Registro en 3 Segundos</strong>
                <span>Escanea el QR en la caseta al iniciar y al bajar</span>
              </div>
            </div>

            <div className="feat-card">
              <div className="feat-icon-badge feat-shield">
                <ShieldCheck size={20} />
              </div>
              <div className="feat-text">
                <strong>Control Preventivo Guardaparques</strong>
                <span>Censo activo en caso de emergencias climáticas</span>
              </div>
            </div>

            <div className="feat-card">
              <div className="feat-icon-badge feat-contact">
                <HeartHandshake size={20} />
              </div>
              <div className="feat-text">
                <strong>Aviso a Contactos</strong>
                <span>Monitoreo automático si no marcas salida a las 17:30</span>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="onboarding-cta-group">
            <button 
              className="btn-primary-large btn-glow"
              onClick={() => setCurrentView('home')}
            >
              <span>Ingresar al Sistema Ávila Pass</span>
              <ArrowRight size={20} />
            </button>

            <button 
              className="btn-secondary-large"
              onClick={() => setCurrentView('auth')}
            >
              <span>Editar Mi Ficha de Senderista</span>
            </button>
          </div>

          <div className="onboarding-footer-badge">
            <ShieldCheck size={14} className="text-green" />
            <span>Sistema oficial INPARQUES Caracas • 100% PWA Offline</span>
          </div>

        </div>

        {/* Right Column / Visual Showcase Card (Desktop) */}
        <div className="onboarding-visual-column desktop-only">
          <div className="onboarding-hero-card">
            <img src="/assets/images/hero.jpg" alt="Excursionista" className="onboarding-bg-img" />
            <div className="onboarding-gradient-overlay"></div>

            <div className="hero-floating-badge top-badge">
              <span className="pulse-dot-green"></span>
              <span>Guardaparques activos en 5 puestos</span>
            </div>

            <div className="hero-floating-card bottom-card">
              <div className="hfc-top">
                <span className="hfc-temp">21°C</span>
                <span className="hfc-cond">
                  <Mountain size={14} className="text-green" />
                  Neblina en Sabas Nieves
                </span>
              </div>
              <span className="hfc-sub">Atardecer: 18:15 • Retorno sugerido antes de 17:30</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
