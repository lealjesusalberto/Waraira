import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { INITIAL_HIKERS_LOG, STATIONS } from '../data/stations';
import { 
  ShieldCheck, 
  Users, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  PhoneCall, 
  Search, 
  CheckCircle2,
  Mountain
} from 'lucide-react';

export default function RangerConsoleView() {
  const { activeHike, user } = useApp();
  const [filterStation, setFilterStation] = useState('all');
  const [searchHiker, setSearchHiker] = useState('');

  // Combine static simulated active hikers with the real user if active
  const allHikers = [
    ...(activeHike ? [{
      id: 'current_user_active',
      name: user.name + ' (Tú)',
      cedula: user.cedula,
      phone: user.phone,
      station: activeHike.stationName.split(' ')[1] || activeHike.stationName,
      destination: activeHike.destination,
      entryTime: new Date(activeHike.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      elapsedMins: Math.round((Date.now() - new Date(activeHike.startTime).getTime()) / 60000),
      contact: `${user.emergencyContact} (${user.emergencyRel}) - ${user.emergencyPhone}`,
      avatar: '/assets/images/avatar.jpg',
      isMe: true
    }] : []),
    ...INITIAL_HIKERS_LOG
  ];

  const filteredHikers = allHikers.filter(h => {
    const matchStation = filterStation === 'all' || h.station.toLowerCase().includes(filterStation.toLowerCase());
    const matchSearch = h.name.toLowerCase().includes(searchHiker.toLowerCase()) || h.cedula.includes(searchHiker);
    return matchStation && matchSearch;
  });

  return (
    <div className="ranger-console-wrap">
      
      {/* Console Top Header */}
      <div className="rc-header">
        <div className="rc-badge-title">
          <div className="rc-icon-box">
            <ShieldCheck size={24} className="text-green" />
          </div>
          <div>
            <h2 className="rc-title">Consola de Control Guardaparques</h2>
            <span className="rc-sub">Puestos de Control INPARQUES • Parque Nacional Waraira Repano</span>
          </div>
        </div>

        <div className="rc-stats-strip">
          <div className="rc-stat-item">
            <Users size={16} className="text-green" />
            <span><strong>{allHikers.length}</strong> excursionistas en montaña</span>
          </div>
          <div className="rc-stat-item">
            <Mountain size={16} className="text-yellow" />
            <span><strong>5</strong> casetas operativas</span>
          </div>
        </div>
      </div>

      {/* Control Bar: Search & Filter */}
      <div className="rc-filter-bar">
        <div className="rc-search-box">
          <Search size={16} className="search-icon" />
          <input 
            type="text" 
            placeholder="Buscar senderista por nombre o cédula..." 
            value={searchHiker}
            onChange={e => setSearchHiker(e.target.value)}
          />
        </div>

        <select 
          className="rc-select" 
          value={filterStation} 
          onChange={e => setFilterStation(e.target.value)}
        >
          <option value="all">Todas las casetas</option>
          <option value="Sabas">Sabas Nieves</option>
          <option value="Julia">La Julia</option>
          <option value="Venados">Los Venados</option>
          <option value="Quintero">Quebrada Quintero</option>
        </select>
      </div>

      {/* Hikers Table / Card List */}
      <div className="rc-hikers-list">
        <h4 className="rc-list-title">Censo en Tiempo Real de Excursionistas Activos</h4>

        <div className="rc-cards-container">
          {filteredHikers.map(hiker => (
            <div key={hiker.id} className={`rc-hiker-card ${hiker.isMe ? 'hiker-card-me' : ''}`}>
              <div className="rhc-avatar-col">
                <img src={hiker.avatar} alt={hiker.name} className="rhc-avatar" />
                {hiker.isMe && <span className="rhc-tag-you">Tú</span>}
              </div>

              <div className="rhc-info-col">
                <div className="rhc-name-row">
                  <h4 className="rhc-name">{hiker.name}</h4>
                  <span className="rhc-cedula">{hiker.cedula}</span>
                </div>
                
                <div className="rhc-tags-row">
                  <span className="rhc-pill"><MapPin size={12} /> {hiker.station}</span>
                  <span className="rhc-pill"><Mountain size={12} /> Rumbo: {hiker.destination}</span>
                  <span className="rhc-pill"><Clock size={12} /> Ingreso: {hiker.entryTime}</span>
                </div>

                <div className="rhc-contact-info">
                  <span className="label">Contacto de extravío:</span>
                  <span className="val">{hiker.contact}</span>
                </div>
              </div>

              <div className="rhc-actions-col">
                <a href={`tel:${hiker.phone}`} className="rhc-call-btn" title="Llamar senderista">
                  <PhoneCall size={16} />
                  <span>Contactar</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
