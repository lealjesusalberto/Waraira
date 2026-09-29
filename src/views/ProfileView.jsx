import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  User, 
  Phone, 
  Heart, 
  MapPin, 
  Mountain, 
  Award, 
  Clock, 
  CheckCircle2, 
  Edit3,
  Calendar
} from 'lucide-react';

export default function ProfileView() {
  const { user, hikeHistory, setCurrentView } = useApp();

  const totalAscents = hikeHistory.length;
  const totalMeters = hikeHistory.reduce((acc, h) => acc + (h.ascentMeters || 500), 0);

  return (
    <div className="profile-page-wrap">
      
      {/* Profile Header Card */}
      <div className="profile-header-card animate-pop">
        <div className="phc-avatar-wrap">
          <img src="/assets/images/avatar.jpg" alt={user.name} className="phc-avatar-img" />
          <span className="phc-status-dot" title="Senderista Verificado"></span>
        </div>

        <div className="phc-user-info">
          <div className="phc-title-row">
            <h2 className="phc-name">{user.name}</h2>
            <span className="phc-badge-verified">Verificado INPARQUES</span>
          </div>
          <span className="phc-meta-line">{user.cedula} • Tipo de Sangre: {user.bloodType || 'O+'}</span>
          <span className="phc-phone-line"><Phone size={14} /> {user.phone}</span>
        </div>

        <button 
          className="btn-edit-profile" 
          onClick={() => setCurrentView('auth')}
          title="Editar datos personales"
        >
          <Edit3 size={16} />
          <span>Editar Ficha</span>
        </button>
      </div>

      {/* Stats Summary */}
      <div className="profile-stats-grid">
        <div className="p-stat-card">
          <div className="psc-icon text-green"><Award size={22} /></div>
          <div className="psc-info">
            <span className="psc-val">{totalAscents}</span>
            <span className="psc-label">Ascensos Registrados</span>
          </div>
        </div>

        <div className="p-stat-card">
          <div className="psc-icon text-yellow"><Mountain size={22} /></div>
          <div className="psc-info">
            <span className="psc-val">{totalMeters.toLocaleString()} m</span>
            <span className="psc-label">Desnivel Acumulado</span>
          </div>
        </div>

        <div className="p-stat-card">
          <div className="psc-icon text-teal"><CheckCircle2 size={22} /></div>
          <div className="psc-info">
            <span className="psc-val">100%</span>
            <span className="psc-label">Retornos Confirmados</span>
          </div>
        </div>
      </div>

      {/* Emergency Contact Card */}
      <div className="profile-emergency-card">
        <div className="pec-header">
          <Heart size={18} className="text-red" />
          <h4>Contacto de Extravío Designado</h4>
        </div>
        <div className="pec-body">
          <div className="pec-name">{user.emergencyContact || 'María Elena Mendoza'}</div>
          <div className="pec-detail">{user.emergencyRel || 'Hermana'} • {user.emergencyPhone || '+58 414 302 1948'}</div>
          <p className="pec-note">
            Este contacto recibe alertas automáticas si no registras tu salida en el puesto de guardaparques antes de las 17:30.
          </p>
        </div>
      </div>

      {/* Hike History List */}
      <div className="profile-history-section">
        <h4 className="phs-title">Historial de Ascensos a El Ávila</h4>
        
        {hikeHistory.length === 0 ? (
          <div className="phs-empty">
            <Mountain size={36} className="text-muted" />
            <p>Aún no tienes ascensos registrados en tu historial.</p>
          </div>
        ) : (
          <div className="phs-list">
            {hikeHistory.map((h, idx) => (
              <div key={idx} className="phs-card">
                <div className="phsc-left">
                  <span className="phsc-station">{h.stationName}</span>
                  <div className="phsc-meta">
                    <span className="phsc-date"><Calendar size={12} /> {h.date}</span>
                    <span className="phsc-dur"><Clock size={12} /> {h.duration}</span>
                  </div>
                </div>
                <div className="phsc-right">
                  <span className="phsc-status-pill">
                    <CheckCircle2 size={12} />
                    <span>{h.status || 'Completado'}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
