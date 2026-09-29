import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { STATIONS } from '../data/stations';
import { X, Camera, Zap, CheckCircle2, ShieldCheck, MapPin } from 'lucide-react';

export default function ModalScanner() {
  const { modalScanner, setModalScanner, activeHike, setModalCheckin, setModalCheckout, showToast } = useApp();
  const [selectedStation, setSelectedStation] = useState(STATIONS[0].id);

  if (!modalScanner.isOpen) return null;

  const handleSimulateScan = (stId) => {
    const station = STATIONS.find(s => s.id === stId) || STATIONS[0];
    setModalScanner({ isOpen: false, stationId: null });

    if (activeHike) {
      // If there's an active hike, scanning completes the hike
      showToast(`Código QR escaneado en ${station.name}. Confirmando descenso.`);
      setModalCheckout(true);
    } else {
      // If not, opens checkin modal
      showToast(`Código QR escaneado en ${station.name}. Registrando ascenso.`);
      setModalCheckin({ isOpen: true, station });
    }
  };

  return (
    <div className="modal-backdrop" onClick={() => setModalScanner({ isOpen: false, stationId: null })}>
      <div className="modal-sheet modal-scanner-sheet animate-pop" onClick={e => e.stopPropagation()}>
        
        <div className="modal-header">
          <div className="modal-header-text">
            <span className="modal-badge-tag text-green">ESCÁNER OFICIAL DE PUESTO</span>
            <h3 className="modal-title">Escanear Código QR en Caseta</h3>
          </div>
          <button 
            className="modal-close-btn" 
            onClick={() => setModalScanner({ isOpen: false, stationId: null })}
            title="Cerrar ventana"
          >
            <X size={18} />
          </button>
        </div>

        {/* Viewfinder Area */}
        <div className="scanner-viewfinder-box">
          <div className="viewfinder-frame">
            <div className="vf-corner vf-tl"></div>
            <div className="vf-corner vf-tr"></div>
            <div className="vf-corner vf-bl"></div>
            <div className="vf-corner vf-br"></div>
            <div className="vf-laser-line"></div>
            <div className="vf-instruction">
              <Camera size={28} className="vf-cam-icon" />
              <span>Apunta la cámara al cartel QR de la caseta</span>
            </div>
          </div>
        </div>

        {/* Quick Simulation Bar for Testing */}
        <div className="scanner-quick-select">
          <div className="sqs-title">
            <Zap size={14} className="text-yellow" />
            <span>Simulador de Escaneo Inmediato:</span>
          </div>
          <div className="sqs-chips">
            {STATIONS.map(st => (
              <button 
                key={st.id}
                type="button"
                className="sqs-chip-btn"
                onClick={() => handleSimulateScan(st.id)}
              >
                <MapPin size={12} />
                <span>{st.name.split(' ')[1] || st.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="scanner-footer-note">
          <ShieldCheck size={14} className="text-green" />
          <span>Funciona 100% sin conexión a internet en toda la cordillera.</span>
        </div>

      </div>
    </div>
  );
}
