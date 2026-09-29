import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, ShieldAlert, PhoneCall, MapPin, Copy, Check } from 'lucide-react';

export default function ModalSos() {
  const { modalSos, setModalSos, user, activeHike, showToast } = useApp();
  const [copied, setCopied] = useState(false);

  if (!modalSos) return null;

  const simulatedCoords = activeHike 
    ? `10.5186° N, 66.8524° W (Cerca de ${activeHike.stationName})` 
    : '10.5186° N, 66.8524° W (Waraira Repano)';

  const handleCopyCoords = () => {
    navigator.clipboard.writeText(simulatedCoords);
    setCopied(true);
    showToast('Coordenadas copiadas al portapapeles', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="modal-backdrop" onClick={() => setModalSos(false)}>
      <div className="modal-sheet modal-sos-sheet animate-pop" onClick={e => e.stopPropagation()}>
        
        <div className="modal-header">
          <div className="modal-header-text">
            <span className="modal-badge-tag text-red">CANAL DE EMERGENCIA Y RESCATE</span>
            <h3 className="modal-title">Centro de Emergencias El Ávila</h3>
          </div>
          <button 
            className="modal-close-btn" 
            onClick={() => setModalSos(false)}
            title="Cerrar ventana"
          >
            <X size={18} />
          </button>
        </div>

        <div className="sos-alert-banner">
          <ShieldAlert size={28} className="text-red" />
          <div>
            <strong>Línea de Rescate Inmediato INPARQUES</strong>
            <p>Utiliza estos números en caso de extravío, deshidratación, caída o presencia de fuego.</p>
          </div>
        </div>

        <div className="sos-coords-card">
          <div className="sos-coords-header">
            <span className="label"><MapPin size={14} /> Tus coordenadas GPS de emergencia:</span>
            <button className="copy-btn" onClick={handleCopyCoords} title="Copiar coordenadas">
              {copied ? <Check size={14} className="text-green" /> : <Copy size={14} />}
              <span>{copied ? 'Copiado' : 'Copiar'}</span>
            </button>
          </div>
          <div className="coords-text">{simulatedCoords}</div>
        </div>

        <div className="sos-contacts-list">
          <a href="tel:08003528452" className="sos-call-item">
            <div className="sci-icon-wrap">
              <PhoneCall size={20} className="text-yellow" />
            </div>
            <div className="sci-info">
              <span className="sci-title">Línea Directa Guardaparques Ávila</span>
              <span className="sci-num">0800-ELAVILA (3528452)</span>
            </div>
            <span className="btn-call-pill">Llamar</span>
          </a>

          <a href="tel:02128608111" className="sos-call-item">
            <div className="sci-icon-wrap">
              <PhoneCall size={20} className="text-red" />
            </div>
            <div className="sci-info">
              <span className="sci-title">Bomberos Forestales Caracas</span>
              <span className="sci-num">0212-8608111 / 911</span>
            </div>
            <span className="btn-call-pill">Llamar</span>
          </a>

          {user.emergencyPhone && (
            <a href={`tel:${user.emergencyPhone}`} className="sos-call-item contact-personal">
              <div className="sci-icon-wrap">
                <PhoneCall size={20} className="text-green" />
              </div>
              <div className="sci-info">
                <span className="sci-title">{user.emergencyContact || 'Contacto Personal'} ({user.emergencyRel || 'Emergencia'})</span>
                <span className="sci-num">{user.emergencyPhone}</span>
              </div>
              <span className="btn-call-pill">Llamar</span>
            </a>
          )}
        </div>

        <button 
          type="button" 
          className="btn-modal-cancel w-full"
          onClick={() => setModalSos(false)}
        >
          Volver a la aplicación
        </button>

      </div>
    </div>
  );
}
