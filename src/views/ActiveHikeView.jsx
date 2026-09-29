import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Mountain, 
  Clock, 
  MapPin, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowLeft, 
  PhoneCall, 
  Users,
  Compass,
  QrCode
} from 'lucide-react';

export default function ActiveHikeView() {
  const { 
    activeHike, 
    elapsedSeconds, 
    setCurrentView, 
    setModalCheckout, 
    setModalSos,
    setModalScanner
  } = useApp();

  if (!activeHike) {
    return (
      <div className="empty-hike-wrap">
        <Mountain size={54} className="text-muted" />
        <h3>No tienes una caminata activa en este momento</h3>
        <p>Selecciona un puesto de guardaparques en el inicio para registrar tu ascenso a El Ávila.</p>
        <button className="btn-primary-large" onClick={() => setCurrentView('home')}>
          Ir a Puestos de Guardaparques
        </button>
      </div>
    );
  }

  const hours = Math.floor(elapsedSeconds / 3600);
  const minutes = Math.floor((elapsedSeconds % 3600) / 60);
  const seconds = elapsedSeconds % 60;
  const timeFormatted = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div className="active-hike-page-wrap">
      
      {/* Top Navigation Strip */}
      <div className="ah-top-nav">
        <button className="btn-ah-back" onClick={() => setCurrentView('home')}>
          <ArrowLeft size={18} />
          <span>Volver a Puestos</span>
        </button>
        <div className="ah-live-badge">
          <span className="pulse-dot-green"></span>
          <span>Ascenso Registrado en INPARQUES</span>
        </div>
      </div>

      {/* Hero Active Mountain Card */}
      <div className="active-tracker-card animate-pop">
        <div className="atc-bg-frame">
          <img src="/assets/images/trails.jpg" alt="Ruta Ávila" className="atc-bg-img" />
          <div className="atc-gradient"></div>
        </div>

        <div className="atc-content">
          <div className="atc-station-header">
            <span className="atc-pill"><MapPin size={13} /> {activeHike.stationSub || 'Waraira Repano'}</span>
            <h2 className="atc-station-name">{activeHike.stationName}</h2>
            <span className="atc-dest-line">Rumbo a: <strong>{activeHike.destination}</strong></span>
          </div>

          {/* Big Live Stopwatch */}
          <div className="atc-timer-box">
            <span className="timer-label"><Clock size={16} /> TIEMPO EN MONTAÑA</span>
            <div className="timer-digits">{timeFormatted}</div>
            <span className="timer-curfew-note">
              Hora límite para inicio de descenso seguro: <strong>{activeHike.curfew}</strong>
            </span>
          </div>

          {/* Metrics Grid */}
          <div className="atc-metrics-grid">
            <div className="metric-cell">
              <span className="mc-label"><Mountain size={14} /> Altitud Puesto</span>
              <span className="mc-val">{activeHike.elevation}</span>
            </div>
            <div className="metric-cell">
              <span className="mc-label"><Users size={14} /> Grupo</span>
              <span className="mc-val">{activeHike.partyCount} {activeHike.partyCount === 1 ? 'senderista' : 'personas'}</span>
            </div>
            <div className="metric-cell">
              <span className="mc-label"><Compass size={14} /> Estado</span>
              <span className="mc-val text-green">Ruta Activa</span>
            </div>
          </div>

          {/* Action Row */}
          <div className="atc-actions-row">
            <button 
              className="btn-atc-sos"
              onClick={() => setModalSos(true)}
              title="Solicitar asistencia de rescate"
            >
              <ShieldAlert size={18} />
              <span>Botón SOS Ávila</span>
            </button>

            <button 
              className="btn-atc-checkout"
              onClick={() => setModalCheckout(true)}
              title="Registrar salida de la montaña"
            >
              <CheckCircle2 size={20} />
              <span>Registrar Retorno / Salida</span>
            </button>
          </div>

          <div className="atc-quick-scan-prompt">
            <button 
              className="btn-scan-link"
              onClick={() => setModalScanner({ isOpen: true, stationId: activeHike.stationId })}
            >
              <QrCode size={15} />
              <span>¿Estás en la caseta? Escanea el QR para cerrar automáticamente</span>
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
