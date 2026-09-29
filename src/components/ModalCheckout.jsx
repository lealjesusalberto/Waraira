import React from 'react';
import { useApp } from '../context/AppContext';
import { X, CheckCircle2, Clock, Mountain, ArrowRight } from 'lucide-react';

export default function ModalCheckout() {
  const { modalCheckout, setModalCheckout, activeHike, finishHike, elapsedSeconds } = useApp();

  if (!modalCheckout || !activeHike) return null;

  const hours = Math.floor(elapsedSeconds / 3600);
  const minutes = Math.floor((elapsedSeconds % 3600) / 60);
  const seconds = elapsedSeconds % 60;
  const timeFormatted = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div className="modal-backdrop" onClick={() => setModalCheckout(false)}>
      <div className="modal-sheet animate-pop" onClick={e => e.stopPropagation()}>
        
        <div className="modal-header">
          <div className="modal-header-text">
            <span className="modal-badge-tag text-green">REGISTRO DE SALIDA Y RETORNO</span>
            <h3 className="modal-title">Finalizar Caminata en El Ávila</h3>
          </div>
          <button 
            className="modal-close-btn" 
            onClick={() => setModalCheckout(false)}
            title="Cerrar ventana"
          >
            <X size={18} />
          </button>
        </div>

        <div className="checkout-summary-box">
          <div className="csb-top-icon">
            <CheckCircle2 size={36} className="text-green" />
          </div>
          <h4 className="csb-title">¿Llegaste a la caseta de guardaparques?</h4>
          <p className="csb-sub">
            Al registrar tu salida, confirmas que has descendido de la montaña de manera segura y se cerrará tu reporte en la consola de INPARQUES.
          </p>

          <div className="csb-stats-grid">
            <div className="csb-stat-card">
              <span className="csb-label"><Clock size={14} /> Tiempo en Montaña</span>
              <span className="csb-value">{timeFormatted}</span>
            </div>
            <div className="csb-stat-card">
              <span className="csb-label"><Mountain size={14} /> Puesto de Retorno</span>
              <span className="csb-value">{activeHike.stationName.split('/')[0]}</span>
            </div>
          </div>
        </div>

        <div className="modal-action-row">
          <button 
            type="button" 
            className="btn-modal-cancel"
            onClick={() => setModalCheckout(false)}
          >
            Aún estoy en ruta
          </button>
          <button 
            type="button" 
            className="btn-modal-primary btn-success-glow"
            onClick={finishHike}
          >
            <span>Confirmar Salida Segura</span>
            <ArrowRight size={18} />
          </button>
        </div>

      </div>
    </div>
  );
}
