import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Compass, 
  QrCode, 
  Mountain, 
  ShieldCheck, 
  User 
} from 'lucide-react';

export default function BottomNav() {
  const { currentView, setCurrentView, activeHike, setModalScanner } = useApp();

  return (
    <nav className="mobile-bottom-nav mobile-only">
      <button 
        className={`bnav-item ${currentView === 'home' ? 'active' : ''}`}
        onClick={() => setCurrentView('home')}
      >
        <Compass size={20} />
        <span>Puestos</span>
      </button>

      <button 
        className="bnav-item bnav-scan-primary"
        onClick={() => setModalScanner({ isOpen: true, stationId: null })}
      >
        <div className="bnav-scan-circle">
          <QrCode size={22} />
        </div>
        <span>Escanear</span>
      </button>

      <button 
        className={`bnav-item ${currentView === 'active-hike' ? 'active' : ''}`}
        onClick={() => setCurrentView('active-hike')}
      >
        <div className="bnav-icon-wrap">
          <Mountain size={20} />
          {activeHike && <span className="bnav-pulse-dot"></span>}
        </div>
        <span>Mi Ruta</span>
      </button>

      <button 
        className={`bnav-item ${currentView === 'ranger-console' ? 'active' : ''}`}
        onClick={() => setCurrentView('ranger-console')}
      >
        <ShieldCheck size={20} />
        <span>Guardaparques</span>
      </button>

      <button 
        className={`bnav-item ${currentView === 'profile' ? 'active' : ''}`}
        onClick={() => setCurrentView('profile')}
      >
        <User size={20} />
        <span>Perfil</span>
      </button>
    </nav>
  );
}
