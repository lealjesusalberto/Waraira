import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  MapPin, 
  Clock, 
  Users, 
  Mountain, 
  ShieldCheck, 
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

export default function ModalCheckin() {
  const { modalCheckin, setModalCheckin, startHike } = useApp();
  const [destination, setDestination] = useState('');
  const [partyCount, setPartyCount] = useState(1);

  if (!modalCheckin.isOpen || !modalCheckin.station) return null;

  const st = modalCheckin.station;

  const handleConfirm = (e) => {
    e.preventDefault();
    startHike(st.id, destination || st.name, partyCount);
  };

  return (
    <div className="modal-backdrop" onClick={() => setModalCheckin({ isOpen: false, station: null })}>
      <div className="modal-sheet animate-pop" onClick={e => e.stopPropagation()}>
        
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-header-text">
            <span className="modal-badge-tag">REGISTRO DE ASCENSO OFICIAL</span>
            <h3 className="modal-title">{st.name}</h3>
          </div>
          <button 
            className="modal-close-btn" 
            onClick={() => setModalCheckin({ isOpen: false, station: null })}
            title="Cerrar ventana"
          >
            <X size={18} />
          </button>
        </div>

        {/* Station Details Card */}
        <div className="modal-station-hero">
          <img src={st.image} alt={st.name} className="msh-img" />
          <div className="msh-overlay"></div>
          <div className="msh-info">
            <div className="msh-row">
              <span className="msh-chip"><MapPin size={12} /> {st.sub}</span>
              <span className="msh-chip"><Mountain size={12} /> {st.altitude}</span>
            </div>
            <div className="msh-curfew-alert">
              <Clock size={14} className="text-yellow" />
              <span>Hora límite obligatoria de descenso: <strong>{st.descentCurfew || '17:30'}</strong></span>
            </div>
          </div>
        </div>

        {/* Check-in Form */}
        <form onSubmit={handleConfirm} className="modal-form-content">
          <div className="input-group">
            <label className="input-label" htmlFor="checkin-dest">Destino previsto en el parque:</label>
            <input 
              id="checkin-dest"
              type="text" 
              className="styled-input"
              placeholder={`Ej: Mirador, El Banquito, Cortafuegos...`}
              value={destination}
              onChange={e => setDestination(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label className="input-label">Número de excursionistas en tu grupo:</label>
            <div className="counter-row">
              <button 
                type="button" 
                className="counter-btn"
                onClick={() => setPartyCount(Math.max(1, partyCount - 1))}
              >
                -
              </button>
              <div className="counter-value">
                <Users size={16} />
                <span>{partyCount} {partyCount === 1 ? 'persona' : 'personas'}</span>
              </div>
              <button 
                type="button" 
                className="counter-btn"
                onClick={() => setPartyCount(partyCount + 1)}
              >
                +
              </button>
            </div>
          </div>

          <div className="safety-agreement-box">
            <ShieldCheck size={16} className="text-green" />
            <p>
              Al registrar tu ascenso, los guardaparques de INPARQUES y tus contactos de emergencia sabrán que estás en la montaña. Recuerda registrar tu salida al bajar.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="modal-action-row">
            <button 
              type="button" 
              className="btn-modal-cancel"
              onClick={() => setModalCheckin({ isOpen: false, station: null })}
            >
              Cancelar
            </button>
            <button type="submit" className="btn-modal-primary">
              <span>Confirmar y Comenzar Ascenso</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
