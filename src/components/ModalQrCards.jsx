import React from 'react';
import { useApp } from '../context/AppContext';
import { STATIONS } from '../data/stations';
import { X, Printer, QrCode, ShieldCheck, MapPin } from 'lucide-react';

export default function ModalQrCards() {
  const { modalQrPosters, setModalQrPosters } = useApp();

  if (!modalQrPosters) return null;

  return (
    <div className="modal-backdrop" onClick={() => setModalQrPosters(false)}>
      <div className="modal-sheet modal-posters-sheet animate-pop" onClick={e => e.stopPropagation()}>
        
        <div className="modal-header">
          <div className="modal-header-text">
            <span className="modal-badge-tag text-green">CARTELES OFICIALES INPARQUES</span>
            <h3 className="modal-title">Carteles con Código QR de Casetas</h3>
          </div>
          <button 
            className="modal-close-btn" 
            onClick={() => setModalQrPosters(false)}
            title="Cerrar ventana"
          >
            <X size={18} />
          </button>
        </div>

        <p className="posters-intro">
          Estos son los carteles de señalización oficial instalados en cada caseta de guardaparques. Los senderistas escanean estos códigos tanto al iniciar su ascenso como al descender.
        </p>

        <div className="posters-grid">
          {STATIONS.map(st => (
            <div key={st.id} className="poster-card">
              <div className="poster-header">
                <span className="poster-inparques">INPARQUES • WARAIRA REPANO</span>
                <h4 className="poster-station-name">{st.name}</h4>
                <span className="poster-station-sub">{st.sub} • {st.altitude}</span>
              </div>

              <div className="poster-qr-frame">
                {/* SVG vector QR simulation */}
                <div className="poster-qr-mock">
                  <QrCode size={110} strokeWidth={1.5} className="text-dark" />
                </div>
                <span className="poster-qr-tag">ESCANEAR PARA REGISTRO</span>
              </div>

              <div className="poster-footer">
                <span>Registro Oficial Obligatorio</span>
                <span className="poster-coords">{st.lat}° N, {Math.abs(st.lng)}° W</span>
              </div>
            </div>
          ))}
        </div>

        <div className="modal-action-row">
          <button 
            type="button" 
            className="btn-modal-cancel"
            onClick={() => setModalQrPosters(false)}
          >
            Cerrar
          </button>
          <button 
            type="button" 
            className="btn-modal-primary"
            onClick={() => window.print()}
          >
            <Printer size={16} />
            <span>Imprimir Carteles Oficiales</span>
          </button>
        </div>

      </div>
    </div>
  );
}
