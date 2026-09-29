import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  QrCode, 
  Wifi, 
  WifiOff, 
  ShieldAlert, 
  User, 
  Compass, 
  ShieldCheck,
  Mountain
} from 'lucide-react';

export default function Navbar() {
  const { 
    user, 
    activeHike, 
    currentView, 
    setCurrentView, 
    isOnline, 
    setModalScanner,
    setModalSos
  } = useApp();

  return (
    <header className="navbar-glass">
      <div className="navbar-container">
        
        {/* Brand Logo & Name */}
        <div 
          className="brand-group" 
          onClick={() => setCurrentView(user.isLoggedIn ? 'home' : 'onboarding')}
          style={{ cursor: 'pointer' }}
        >
          <div className="brand-logo-frame">
            <img src="/assets/images/logo.jpg" alt="Logo Ávila Pass" className="brand-logo-img" />
          </div>
          <div className="brand-text-col">
            <div className="brand-title-row">
              <span className="brand-title">Ávila Pass</span>
              <span className="brand-badge-inparques">INPARQUES</span>
            </div>
            <span className="brand-subtitle">Parque Nacional Waraira Repano • Caracas</span>
          </div>
        </div>

        {/* Center / Navigation Links (Desktop) */}
        <nav className="navbar-center-links desktop-only">
          <button 
            className={`nav-link-btn ${currentView === 'home' ? 'active' : ''}`}
            onClick={() => setCurrentView('home')}
          >
            <Compass size={17} />
            <span>Puestos y Rutas</span>
          </button>

          {activeHike && (
            <button 
              className={`nav-link-btn highlight-active ${currentView === 'active-hike' ? 'active' : ''}`}
              onClick={() => setCurrentView('active-hike')}
            >
              <span className="pulse-dot-green"></span>
              <span>Caminata Activa</span>
            </button>
          )}

          <button 
            className={`nav-link-btn ${currentView === 'ranger-console' ? 'active' : ''}`}
            onClick={() => setCurrentView('ranger-console')}
          >
            <ShieldCheck size={17} />
            <span>Consola Guardaparques</span>
          </button>
        </nav>

        {/* Right Action Icons & User */}
        <div className="navbar-right-actions">
          
          {/* Online/Offline Status Badge */}
          <div className={`network-badge ${isOnline ? 'online' : 'offline'}`} title={isOnline ? 'Conexión activa con el servidor' : 'Modo local sin conexión'}>
            {isOnline ? <Wifi size={13} /> : <WifiOff size={13} />}
            <span className="net-status-text">{isOnline ? 'Online' : 'Offline'}</span>
          </div>

          {/* SOS Fast Emergency Button */}
          <button 
            className="btn-nav-sos" 
            onClick={() => setModalSos(true)} 
            title="Botón de Emergencia y Rescate"
          >
            <ShieldAlert size={16} />
            <span className="desktop-only">SOS Ávila</span>
          </button>

          {/* QR Scanner Trigger */}
          <button 
            className="btn-nav-scan" 
            onClick={() => setModalScanner({ isOpen: true, stationId: null })}
            title="Escanear QR de Puesto"
          >
            <QrCode size={18} />
            <span className="desktop-only">Escanear QR</span>
          </button>

          {/* User Profile Button */}
          <div 
            className={`user-chip-btn ${currentView === 'profile' ? 'active' : ''}`}
            onClick={() => setCurrentView('profile')}
            title="Ver perfil de senderista"
          >
            <img src="/assets/images/avatar.jpg" alt={user.name} className="user-chip-avatar" />
            <span className="user-chip-name desktop-only">{user.name.split(' ')[0]}</span>
          </div>
        </div>

      </div>
    </header>
  );
}
