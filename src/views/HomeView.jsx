import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { STATIONS, WEATHER_ELEVATIONS } from '../data/stations';
import { 
  Search, 
  MapPin, 
  Mountain, 
  Star, 
  ArrowRight, 
  Clock, 
  CloudSun, 
  Sun, 
  Cloud, 
  Wind, 
  ShieldAlert, 
  PhoneCall, 
  Compass, 
  CheckCircle2, 
  QrCode,
  Flame,
  Trash2,
  HeartHandshake
} from 'lucide-react';

export default function HomeView() {
  const { 
    user, 
    activeHike, 
    setCurrentView, 
    setModalCheckin, 
    setModalScanner,
    setModalQrPosters,
    elapsedSeconds 
  } = useApp();

  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter stations
  const filteredStations = STATIONS.filter(st => {
    const matchesFilter = filter === 'all' || st.category === filter;
    const matchesSearch = 
      st.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      st.sub.toLowerCase().includes(searchTerm.toLowerCase()) ||
      st.difficulty.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleStationClick = (st) => {
    if (activeHike) {
      setCurrentView('active-hike');
    } else {
      setModalCheckin({ isOpen: true, station: st });
    }
  };

  const hours = Math.floor(elapsedSeconds / 3600);
  const minutes = Math.floor((elapsedSeconds % 3600) / 60);
  const seconds = elapsedSeconds % 60;
  const timeFormatted = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div className="home-dashboard-wrapper">
      
      {/* Active Hike Banner if In Progress */}
      {activeHike && (
        <div className="active-hike-banner-strip animate-pop">
          <div className="ahb-left">
            <span className="pulse-dot-green"></span>
            <div className="ahb-text">
              <span className="ahb-title">¡Estás en la montaña ahora! ({activeHike.stationName.split('/')[0]})</span>
              <span className="ahb-sub">Tiempo transcurrido: {timeFormatted} • Límite descenso: {activeHike.curfew}</span>
            </div>
          </div>
          <button 
            className="btn-ahb-action"
            onClick={() => setCurrentView('active-hike')}
          >
            <span>Ver Ruta y Botón SOS</span>
            <ArrowRight size={16} />
          </button>
        </div>
      )}

      {/* Main Grid: Left Content + Right Sidebar */}
      <div className="home-grid-layout">
        
        {/* LEFT COLUMN: Stations, Search, Banners */}
        <div className="home-main-col">
          
          {/* Header Greeting */}
          <div className="home-greeting-bar">
            <div>
              <span className="greeting-sub">Parque Nacional Waraira Repano</span>
              <h2 className="greeting-title">
                Hola, <span className="highlight-green">{user.name.split(' ')[0]}</span>
              </h2>
            </div>
            <div 
              className="greeting-avatar-chip mobile-only" 
              onClick={() => setCurrentView('profile')}
            >
              <img src="/assets/images/avatar.jpg" alt={user.name} />
              <span className="status-dot"></span>
            </div>
          </div>

          {/* Mountain Quote Card */}
          <div className="hero-quote-card">
            <img src="/assets/images/trails.jpg" alt="El Ávila" className="hero-quote-bg" />
            <div className="hero-quote-overlay"></div>
            <div className="hero-quote-body">
              <span className="quote-tag">CARACAS • WARAIRA REPANO</span>
              <h3 className="quote-headline">Sube seguro, respeta la montaña y registra tu regreso</h3>
              <p className="quote-subline">El Ávila nos protege; cuidémoslo juntos.</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="home-search-bar">
            <div className="search-field-box">
              <Search size={18} className="search-icon" />
              <input 
                type="text" 
                placeholder="Buscar puesto guardaparques, ruta o cima..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              className="search-scan-trigger-btn"
              onClick={() => setModalScanner({ isOpen: true, stationId: null })}
              title="Escanear QR de Puesto"
            >
              <QrCode size={18} />
              <span className="desktop-only">Escanear</span>
            </button>
          </div>

          {/* Category Filter Chips */}
          <div className="category-scroll-chips">
            <button 
              className={`cat-chip-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              <Mountain size={14} />
              <span>Todos los Puestos</span>
            </button>

            <button 
              className={`cat-chip-btn ${filter === 'popular' ? 'active' : ''}`}
              onClick={() => setFilter('popular')}
            >
              <Star size={14} />
              <span>Más Frecuentados</span>
            </button>

            <button 
              className={`cat-chip-btn ${filter === 'moderate' ? 'active' : ''}`}
              onClick={() => setFilter('moderate')}
            >
              <Compass size={14} />
              <span>Nivel Moderado</span>
            </button>

            <button 
              className={`cat-chip-btn ${filter === 'extreme' ? 'active' : ''}`}
              onClick={() => setFilter('extreme')}
            >
              <MapPin size={14} />
              <span>Exigente / Cumbre</span>
            </button>
          </div>

          {/* Checkpoint Section Heading */}
          <div className="stations-section-header">
            <div>
              <h3 className="section-title">Puestos de Guardaparques (Casetas Oficiales)</h3>
              <span className="section-subtitle">{filteredStations.length} puestos disponibles para registro</span>
            </div>
            <button 
              className="link-posters-btn"
              onClick={() => setModalQrPosters(true)}
            >
              <span>Ver Carteles QR Oficiales</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Checkpoints Responsive Grid */}
          <div className="checkpoints-cards-grid">
            {filteredStations.map(st => (
              <div 
                key={st.id} 
                className="checkpoint-station-card"
                onClick={() => handleStationClick(st)}
              >
                <div className="csc-bg-frame">
                  <img src={st.image} alt={st.name} className="csc-bg-img" />
                  <div className="csc-bg-overlay"></div>
                </div>

                <div className="csc-top-badges">
                  <div className="rating-tag">
                    <Star size={11} fill="currentColor" className="text-yellow" />
                    <span>{st.rating}</span>
                  </div>
                  <div className="status-open-tag">
                    <span className="open-dot"></span>
                    <span>Abierto</span>
                  </div>
                </div>

                <div className="csc-bottom-content">
                  <div className="csc-text-col">
                    <span className="csc-alt-badge">{st.altitude} • {st.sub}</span>
                    <h4 className="csc-station-title">{st.name}</h4>
                    <span className="csc-station-sub">{st.difficulty} • {st.avgAscent}</span>
                  </div>
                  
                  <button 
                    className="csc-cta-btn" 
                    title="Registrar en este puesto"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStationClick(st);
                    }}
                  >
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Scanner Action Banner */}
          <div className="scanner-promo-box">
            <div className="spb-text">
              <span className="promo-badge">ESCÁNER QR ACTIVO</span>
              <h4>¿Llegando a la caseta de guardaparques?</h4>
              <p>Apunta la cámara de tu teléfono al código QR en la caseta para registrar tu hora de entrada o salida con un solo toque.</p>
              <button 
                className="btn-promo-scan"
                onClick={() => setModalScanner({ isOpen: true, stationId: null })}
              >
                <QrCode size={18} />
                <span>Abrir Escáner de Puesto</span>
              </button>
            </div>
            <div className="spb-art desktop-only">
              <div className="spb-qr-frame">
                <QrCode size={64} className="text-green" />
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Sidebar (Weather, Curfew, Safety Contacts) */}
        <aside className="home-sidebar-col">
          
          {/* Weather Widget Card */}
          <div className="weather-sidebar-card">
            <div className="wsc-top">
              <div className="wsc-temp-box">
                <div className="wsc-temp-val">21°<span className="unit">C</span></div>
                <div className="wsc-cond-info">
                  <span className="wsc-badge">
                    <CloudSun size={15} />
                    <span>Neblina en Cumbres</span>
                  </span>
                  <span className="wsc-status-note">
                    <span className="status-dot-green"></span>
                    <span>Sendero óptimo para ascenso</span>
                  </span>
                </div>
              </div>

              <div className="wsc-sun-timing">
                <div className="sun-block">
                  <span className="sb-label">Atardecer</span>
                  <span className="sb-val">18:15</span>
                </div>
                <div className="sun-block">
                  <span className="sb-label">Límite bajada</span>
                  <span className="sb-val highlight-yellow">17:30</span>
                </div>
              </div>
            </div>

            {/* Elevations Pills Horizontal Bar */}
            <div className="weather-elevation-list">
              {WEATHER_ELEVATIONS.map((we, idx) => (
                <div key={idx} className="we-pill">
                  <span className="we-alt">{we.alt}</span>
                  <span className="we-icon">
                    {we.icon === 'sun' && <Sun size={16} className="text-yellow" />}
                    {we.icon === 'cloud-sun' && <CloudSun size={16} className="text-yellow" />}
                    {we.icon === 'cloud' && <Cloud size={16} className="text-blue" />}
                    {we.icon === 'wind' && <Wind size={16} className="text-teal" />}
                  </span>
                  <span className="we-temp">{we.temp}</span>
                  <span className="we-place">{we.place}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Assigned Contact Summary */}
          <div className="sidebar-contact-card">
            <div className="scc-header">
              <HeartHandshake size={18} className="text-green" />
              <h4>Contacto de Rescate Asignado</h4>
            </div>
            <div className="scc-body">
              <div className="scc-name">{user.emergencyContact || 'María Elena Mendoza'}</div>
              <div className="scc-rel">{user.emergencyRel || 'Hermana'} • {user.emergencyPhone || '+58 414 302 1948'}</div>
              <p className="scc-note">
                Se enviará notificación automática si no registras tu salida antes de las 17:30.
              </p>
            </div>
          </div>

          {/* Direct Emergency Dispatch */}
          <div className="sidebar-dispatch-card">
            <div className="sdc-icon">
              <PhoneCall size={20} className="text-yellow" />
            </div>
            <div className="sdc-text">
              <strong>Guardaparques INPARQUES Ávila</strong>
              <span>Línea Directa: 0800-ELAVILA (3528452)</span>
            </div>
            <a href="tel:08003528452" className="sdc-call-btn">Llamar</a>
          </div>

          {/* Park Rules */}
          <div className="sidebar-rules-card">
            <h4 className="rules-heading">Normas del Parque Nacional</h4>
            <ul className="rules-list">
              <li>
                <Flame size={15} className="text-red" />
                <span>Prohibido encender fogatas o fumar.</span>
              </li>
              <li>
                <Trash2 size={15} className="text-green" />
                <span>Bajar toda la basura que generes.</span>
              </li>
              <li>
                <Clock size={15} className="text-yellow" />
                <span>Descenso obligatorio antes del anochecer (17:30).</span>
              </li>
              <li>
                <ShieldAlert size={15} className="text-blue" />
                <span>Mascotas solo con correa en rutas permitidas.</span>
              </li>
            </ul>
          </div>

        </aside>

      </div>

    </div>
  );
}
