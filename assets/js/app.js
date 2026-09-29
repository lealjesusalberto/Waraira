/**
 * ÁVILA PASS PWA - WARAIRA REPANO CARACAS
 * Core Application Logic, QR Scanning/Generating, Offline PWA & Mountain Tracker
 */

// ==========================================
// 1. DATA MODELS & INITIAL STATE
// ==========================================

const DEFAULT_USER = {
  id: 'user_001',
  fullName: 'Alejandro Mendoza Suárez',
  cedula: 'V-20.458.120',
  phone: '4143021948',
  email: 'alejandro.mendoza@avila.org.ve',
  bloodType: 'O+',
  medicalNotes: 'Alergia leve a picadura de avispa. Lleva antihistamínico en mochila.',
  avatar: 'assets/images/avatar.jpg',
  contact1: {
    name: 'María Elena Mendoza',
    relation: 'Hermana',
    phone: '+58 414 302 1948'
  },
  contact2: {
    name: 'Carlos Ramírez',
    relation: 'Amigo / Hiker',
    phone: '+58 424 555 1234'
  },
  registeredAt: '2026-09-01T08:00:00Z'
};

const STATIONS_DATA = {
  SABAS_NIEVES: {
    id: 'SABAS_NIEVES',
    name: 'Puesto Sabas Nieves I & II',
    sub: 'Altamira, Caracas',
    altitude: '1,300 m.s.n.m.',
    altitudeNum: 1300,
    rating: '4.9',
    category: 'popular',
    difficulty: 'Moderado',
    avgAscent: '45 - 60 min',
    image: 'assets/images/sabas_nieves.jpg',
    rangers: 'Guardaparques Gómez / Padrón',
    lat: 10.5186,
    lng: -66.8524,
    status: 'Puesto Abierto y Activo'
  },
  LA_JULIA: {
    id: 'LA_JULIA',
    name: 'Puesto La Julia / Mirador',
    sub: 'El Marqués Norte, Caracas',
    altitude: '1,140 m.s.n.m.',
    altitudeNum: 1140,
    rating: '4.8',
    category: 'popular',
    difficulty: 'Moderado',
    avgAscent: '50 - 70 min',
    image: 'assets/images/trails.jpg',
    rangers: 'Guardaparques Velásquez',
    lat: 10.5120,
    lng: -66.8190,
    status: 'Puesto Abierto y Activo'
  },
  LOS_VENADOS: {
    id: 'LOS_VENADOS',
    name: 'Puesto Los Venados / Hacienda',
    sub: 'Cotiza / Puerta Caracas',
    altitude: '1,550 m.s.n.m.',
    altitudeNum: 1550,
    rating: '4.9',
    category: 'moderate',
    difficulty: 'Familiar / Histórico',
    avgAscent: '1h 30 min (Vehículo o a pie)',
    image: 'assets/images/los_venados.jpg',
    rangers: 'Guardaparques Rivas',
    lat: 10.5367,
    lng: -66.8920,
    status: 'Puesto Abierto con Enfermería'
  },
  QUEBRADA_QUINTERO: {
    id: 'QUEBRADA_QUINTERO',
    name: 'Puesto Quebrada Quintero',
    sub: 'Sebucán / Los Chorros',
    altitude: '1,220 m.s.n.m.',
    altitudeNum: 1220,
    rating: '4.7',
    category: 'moderate',
    difficulty: 'Fresco / Sendero Acuático',
    avgAscent: '40 min',
    image: 'assets/images/sabas_nieves.jpg',
    rangers: 'Guardaparques Terán',
    lat: 10.5211,
    lng: -66.8370,
    status: 'Puesto Abierto'
  },
  PICO_NAIGUATA: {
    id: 'PICO_NAIGUATA',
    name: 'Pico Naiguatá (Cumbre)',
    sub: 'Waraira Repano - Techo de Caracas',
    altitude: '2,765 m.s.n.m.',
    altitudeNum: 2765,
    rating: '5.0',
    category: 'extreme',
    difficulty: 'Muy Exigente (Alta Montaña)',
    avgAscent: '6 - 8 horas',
    image: 'assets/images/trails.jpg',
    rangers: 'Control en La Julia / Galindo',
    lat: 10.5422,
    lng: -66.7820,
    status: 'Registro Físico Obligatorio'
  }
};

// Initial simulated mountain active hikers for the Ranger Console
const INITIAL_RANGER_HIKERS = [
  {
    id: 'hiker_101',
    name: 'Valeria Ramos Castillo',
    cedula: 'V-24.119.882',
    phone: '+58 412 908 1122',
    station: 'Sabas Nieves',
    destination: 'El Banquito (1,500m)',
    entryTime: new Date(Date.now() - 75 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    elapsedMins: 75,
    contact: 'Pedro Ramos (Padre) - +58 414 112 3344',
    avatar: 'assets/images/hero.jpg'
  },
  {
    id: 'hiker_102',
    name: 'Carlos Benítez Osorio',
    cedula: 'V-18.441.092',
    phone: '+58 414 887 2390',
    station: 'La Julia',
    destination: 'Pico Oriental (2,640m)',
    entryTime: new Date(Date.now() - 210 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    elapsedMins: 210,
    contact: 'Ana Osorio (Madre) - +58 424 991 8822',
    avatar: 'assets/images/avatar.jpg'
  },
  {
    id: 'hiker_103',
    name: 'Daniela Machado',
    cedula: 'V-26.778.330',
    phone: '+58 416 332 9901',
    station: 'Los Venados',
    destination: 'Casona y Vivero',
    entryTime: new Date(Date.now() - 40 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    elapsedMins: 40,
    contact: 'Luis Machado (Hermano) - +58 412 445 6677',
    avatar: 'assets/images/hero.jpg'
  }
];

// App State
let currentUser = null;
let activeHike = null;
let hikesHistory = [];
let html5QrScanner = null;
let hikeTimerInterval = null;
let currentCameraFacing = 'environment'; // environment or user
let deferredPWAInstallPrompt = null;

// ==========================================
// 2. AUDIO SYNTH (NATIVE CHIMES)
// ==========================================
class SoundFX {
  static playSuccess() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.15); // G5
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start();
      osc.stop(ctx.currentTime + 0.32);
    } catch (e) {
      console.warn('Audio not allowed yet', e);
    }
  }

  static playBeep() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) {
      console.warn('Audio not allowed', e);
    }
  }

  static playAlert() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.setValueAtTime(330, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc.start();
      osc.stop(ctx.currentTime + 0.36);
    } catch (e) {
      console.warn(e);
    }
  }
}

// ==========================================
// 3. TOAST NOTIFICATIONS
// ==========================================
function showToast(message, type = 'success', duration = 4000) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast-msg ${type}`;
  
  let icon = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>';
  if (type === 'warning') icon = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>';
  if (type === 'danger') icon = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';
  if (type === 'success') icon = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>';

  toast.innerHTML = `<span class="toast-svg-wrap">${icon}</span> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, duration);
}

// ==========================================
// 4. NAVIGATION & VIEW SWITCHER
// ==========================================
function switchView(viewId) {
  // Stop QR camera scanner if navigating away from scanner view
  if (viewId !== 'view-scanner' && html5QrScanner) {
    try {
      html5QrScanner.stop().catch(() => {});
    } catch (e) {}
  }

  const allViews = document.querySelectorAll('.app-view');
  allViews.forEach(view => {
    view.classList.remove('active');
  });

  const targetView = document.getElementById(viewId);
  if (targetView) {
    targetView.classList.add('active');
  }

  // Set active view on body for CSS selectors
  document.body.dataset.activeView = viewId;

  // Manage mobile bottom navigation visibility (hide on onboarding & auth)
  const bottomNav = document.getElementById('app-bottom-nav');
  if (bottomNav) {
    if (viewId === 'view-onboarding' || viewId === 'view-auth') {
      bottomNav.style.display = 'none';
    } else {
      bottomNav.style.display = '';
    }
  }

  // Reset scroll position on view switch
  window.scrollTo({ top: 0, behavior: 'instant' });

  // Update bottom navigation active item
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    if (item.dataset.view === viewId) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  // Update desktop navigation active item
  const desktopNavItems = document.querySelectorAll('.nav-link-btn');
  desktopNavItems.forEach(item => {
    if (item.dataset.view === viewId) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  // Handle specific views actions
  if (viewId === 'view-scanner') {
    initCameraScanner();
  } else if (viewId === 'view-station-qrs') {
    renderStationQRs();
  } else if (viewId === 'view-ranger-monitor') {
    renderRangerMonitor();
  } else if (viewId === 'view-history') {
    renderHikesHistory();
  } else if (viewId === 'view-home') {
    updateActiveHikeBanner();
  }
}

// ==========================================
// 5. LOCAL STORAGE & PERSISTENCE
// ==========================================
function loadSavedData() {
  // Load User
  const savedUser = localStorage.getItem('avila_user');
  if (savedUser) {
    try {
      currentUser = JSON.parse(savedUser);
    } catch (e) {
      currentUser = DEFAULT_USER;
    }
  } else {
    currentUser = DEFAULT_USER;
    localStorage.setItem('avila_user', JSON.stringify(DEFAULT_USER));
  }

  // Load Active Hike
  const savedHike = localStorage.getItem('avila_active_hike');
  if (savedHike) {
    try {
      activeHike = JSON.parse(savedHike);
      startHikeTimer();
    } catch (e) {
      activeHike = null;
    }
  }

  // Load History
  const savedHistory = localStorage.getItem('avila_hikes_history');
  if (savedHistory) {
    try {
      hikesHistory = JSON.parse(savedHistory);
    } catch (e) {
      hikesHistory = [];
    }
  } else {
    // Default past completed hike sample
    hikesHistory = [
      {
        id: 'hike_prev_1',
        stationName: 'Sabas Nieves I & II',
        destination: 'El Banquito (1,500m)',
        date: '27 Sep 2026',
        entryTime: '07:15 AM',
        exitTime: '10:30 AM',
        durationStr: '03h 15m',
        status: 'Completado con Éxito'
      },
      {
        id: 'hike_prev_2',
        stationName: 'Puesto La Julia',
        destination: 'Mirador La Julia',
        date: '20 Sep 2026',
        entryTime: '08:00 AM',
        exitTime: '10:45 AM',
        durationStr: '02h 45m',
        status: 'Completado con Éxito'
      }
    ];
    localStorage.setItem('avila_hikes_history', JSON.stringify(hikesHistory));
  }

  updateUserProfileUI();
  updateActiveHikeUI();
  updateHistoryStats();
}

function saveUser(user) {
  currentUser = user;
  localStorage.setItem('avila_user', JSON.stringify(user));
  updateUserProfileUI();
}

function saveActiveHike(hike) {
  activeHike = hike;
  if (hike) {
    localStorage.setItem('avila_active_hike', JSON.stringify(hike));
    startHikeTimer();
  } else {
    localStorage.removeItem('avila_active_hike');
    if (hikeTimerInterval) {
      clearInterval(hikeTimerInterval);
      hikeTimerInterval = null;
    }
  }
  updateActiveHikeUI();
  updateActiveHikeBanner();
}

// ==========================================
// 6. UI UPDATERS
// ==========================================
function updateUserProfileUI() {
  if (!currentUser) return;

  // Header
  const firstName = currentUser.fullName.split(' ')[0] || 'Excursionista';
  const nameEl = document.getElementById('home-user-firstname');
  if (nameEl) nameEl.textContent = firstName;
  const nameDisp = document.getElementById('home-user-firstname-display');
  if (nameDisp) nameDisp.textContent = firstName;

  const sideC1Name = document.getElementById('sidebar-c1-name');
  const sideC1Rel = document.getElementById('sidebar-c1-rel');
  if (sideC1Name && currentUser.contact1) sideC1Name.textContent = currentUser.contact1.name;
  if (sideC1Rel && currentUser.contact1) sideC1Rel.textContent = `${currentUser.contact1.relation} • ${currentUser.contact1.phone}`;

  const headerAvatar = document.getElementById('home-user-avatar');
  if (headerAvatar && currentUser.avatar) headerAvatar.src = currentUser.avatar;

  // Profile View
  const profName = document.getElementById('profile-card-fullname');
  if (profName) profName.textContent = currentUser.fullName;

  const profCedula = document.getElementById('profile-card-cedula');
  if (profCedula) profCedula.textContent = `C.I. ${currentUser.cedula}`;

  const profBlood = document.getElementById('profile-card-blood');
  if (profBlood) profBlood.textContent = currentUser.bloodType || 'O+';

  const profAvatar = document.getElementById('profile-card-avatar');
  if (profAvatar && currentUser.avatar) profAvatar.src = currentUser.avatar;

  // Emergency Contacts in Profile View
  if (currentUser.contact1) {
    const c1Name = document.getElementById('prof-c1-name');
    const c1Rel = document.getElementById('prof-c1-rel');
    const c1Phone = document.getElementById('prof-c1-phone');
    const c1Link = document.getElementById('prof-c1-tel-link');
    if (c1Name) c1Name.textContent = currentUser.contact1.name;
    if (c1Rel) c1Rel.textContent = `${currentUser.contact1.relation} • Principal`;
    if (c1Phone) c1Phone.textContent = currentUser.contact1.phone;
    if (c1Link) c1Link.href = `tel:${currentUser.contact1.phone.replace(/\s+/g, '')}`;
  }

  if (currentUser.contact2 && currentUser.contact2.name) {
    const c2Container = document.getElementById('prof-c2-container');
    if (c2Container) c2Container.style.display = 'flex';
    const c2Name = document.getElementById('prof-c2-name');
    const c2Rel = document.getElementById('prof-c2-rel');
    const c2Phone = document.getElementById('prof-c2-phone');
    const c2Link = document.getElementById('prof-c2-tel-link');
    if (c2Name) c2Name.textContent = currentUser.contact2.name;
    if (c2Rel) c2Rel.textContent = `${currentUser.contact2.relation} • Secundario`;
    if (c2Phone) c2Phone.textContent = currentUser.contact2.phone;
    if (c2Link) c2Link.href = `tel:${currentUser.contact2.phone.replace(/\s+/g, '')}`;
  } else {
    const c2Container = document.getElementById('prof-c2-container');
    if (c2Container) c2Container.style.display = 'none';
  }

  const medNotes = document.getElementById('prof-medical-display');
  if (medNotes) {
    medNotes.textContent = currentUser.medicalNotes || 'Sin observaciones médicas registradas.';
  }
}

function updateActiveHikeBanner() {
  const banner = document.getElementById('home-active-hike-banner');
  const hikeDot = document.getElementById('nav-hike-indicator');
  const desktopDot = document.getElementById('desktop-hike-indicator');

  if (activeHike) {
    if (banner) banner.style.display = 'flex';
    if (hikeDot) hikeDot.style.display = 'block';
    if (desktopDot) desktopDot.style.display = 'inline-block';
  } else {
    if (banner) banner.style.display = 'none';
    if (hikeDot) hikeDot.style.display = 'none';
    if (desktopDot) desktopDot.style.display = 'none';
  }
}

function updateActiveHikeUI() {
  if (!activeHike) {
    updateActiveHikeBanner();
    return;
  }

  // Active Hike Station Elements
  const stationName = activeHike.stationName || 'Sabas Nieves I';
  const altitude = activeHike.altitude || '1,300 m.s.n.m.';

  const stationEl = document.getElementById('active-hike-station');
  if (stationEl) stationEl.textContent = stationName;

  const altEl = document.getElementById('active-hike-altitude');
  if (altEl) altEl.textContent = altitude;

  const stationDisp = document.getElementById('active-station-display');
  if (stationDisp) stationDisp.textContent = stationName;

  const elevDisp = document.getElementById('active-elevation-display');
  if (elevDisp) elevDisp.textContent = altitude;

  const routeObj = document.getElementById('active-route-objective');
  if (routeObj) routeObj.textContent = activeHike.destination || 'Ruta Tradicional';

  const entryTimeDisp = document.getElementById('active-entry-time-display');
  if (entryTimeDisp) entryTimeDisp.textContent = `Entrada: ${activeHike.entryTimeStr} • Hoy`;

  // Contact name & phone
  if (currentUser && currentUser.contact1) {
    const cName = document.getElementById('active-contact-name');
    const cPhone = document.getElementById('active-contact-phone');
    if (cName) cName.textContent = currentUser.contact1.name;
    if (cPhone) cPhone.textContent = currentUser.contact1.phone;
  }

  // Update Trail BG image if matched
  const bgImg = document.getElementById('active-trail-img');
  if (bgImg && activeHike.stationId && STATIONS_DATA[activeHike.stationId]) {
    bgImg.src = STATIONS_DATA[activeHike.stationId].image;
  }

  updateActiveHikeBanner();
}

function startHikeTimer() {
  if (hikeTimerInterval) clearInterval(hikeTimerInterval);

  const startTime = new Date(activeHike.startTimestamp).getTime();

  function tick() {
    const now = Date.now();
    const elapsedMs = Math.max(0, now - startTime);
    const totalSecs = Math.floor(elapsedMs / 1000);
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;

    const timeString = `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    const timerEl = document.getElementById('live-hike-timer');
    if (timerEl) timerEl.textContent = timeString;

    const bannerTimer = document.getElementById('banner-elapsed-time');
    if (bannerTimer) bannerTimer.textContent = `Tiempo en ruta: ${timeString}`;

    // Update sunlight countdown (Based on sunset at 18:15 Caracas time)
    const curDate = new Date();
    const sunsetDate = new Date();
    sunsetDate.setHours(18, 15, 0, 0);

    const msUntilSunset = sunsetDate.getTime() - curDate.getTime();
    const sunCountdownEl = document.getElementById('sunlight-countdown');
    if (sunCountdownEl) {
      if (msUntilSunset > 0) {
        const sunHrs = Math.floor(msUntilSunset / 3600000);
        const sunMins = Math.floor((msUntilSunset % 3600000) / 60000);
        sunCountdownEl.textContent = `${sunHrs}h ${sunMins}m`;
      } else {
        sunCountdownEl.textContent = 'Atardecer en curso';
        sunCountdownEl.style.color = 'var(--c-red-500)';
      }
    }
  }

  tick();
  hikeTimerInterval = setInterval(tick, 1000);
}

// ==========================================
// 7. CHECKPOINT CAROUSEL RENDERER
// ==========================================
function renderCheckpointsCarousel(filter = 'all') {
  const container = document.getElementById('checkpoints-container');
  if (!container) return;

  container.innerHTML = '';

  const stations = Object.values(STATIONS_DATA);
  const filtered = stations.filter(st => {
    if (filter === 'all') return true;
    return st.category === filter;
  });

  filtered.forEach(st => {
    const card = document.createElement('div');
    card.className = 'checkpoint-card';
    card.innerHTML = `
      <div class="cp-card-bg">
        <img src="${st.image}" alt="${st.name}" class="cp-card-img">
        <div class="cp-card-overlay"></div>
      </div>
      <div class="cp-card-top-badges">
        <div class="rating-pill">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style="color:var(--c-yellow-400);margin-right:2px;"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
          <span>${st.rating}</span>
        </div>
        <button class="fav-btn" title="Guardar favorito">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
        </button>
      </div>
      <div class="cp-card-content">
        <div class="cp-card-text">
          <span class="cp-card-coords">${st.altitude} • ${st.sub}</span>
          <h4 class="cp-card-name">${st.name}</h4>
          <span class="cp-card-sub">${st.difficulty} • ${st.avgAscent}</span>
        </div>
        <button class="cp-card-cta-btn" data-station="${st.id}" title="Registrar en este puesto">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>
    `;

    // Click handler: opens check-in confirm modal if not active hike, or scanner
    card.addEventListener('click', (e) => {
      if (e.target.closest('.fav-btn')) {
        const fav = e.target.closest('.fav-btn');
        fav.style.color = fav.style.color === 'red' ? '#f87171' : 'red';
        showToast(`Marcado ${st.name} como favorito`);
        return;
      }

      if (activeHike) {
        showToast(`Ya tienes una caminata activa en ${activeHike.stationName}. Escanea el QR de Salida para finalizar.`, 'warning');
        switchView('view-active-hike');
      } else {
        openCheckinModal(st.id);
      }
    });

    container.appendChild(card);
  });
}

// ==========================================
// 8. QR SCANNER & CAMERA MODULE
// ==========================================
function initCameraScanner() {
  const qrReaderEl = document.getElementById('qr-reader');
  if (!qrReaderEl) return;

  // Clean existing instance
  if (html5QrScanner) {
    try {
      html5QrScanner.stop().catch(() => {});
    } catch (e) {}
  }

  try {
    html5QrScanner = new Html5Qrcode('qr-reader');
    const config = {
      fps: 10,
      qrbox: { width: 220, height: 220 },
      aspectRatio: 1.0
    };

    html5QrScanner.start(
      { facingMode: currentCameraFacing },
      config,
      (decodedText) => {
        handleScannedCode(decodedText);
      },
      (errorMessage) => {
        // Scanning frame without QR; normal
      }
    ).catch(err => {
      console.warn('Camera could not be started automatically (normal in desktop/restricted):', err);
      // Inform user they can test with the quick simulation buttons
    });
  } catch (e) {
    console.warn('Html5Qrcode init error:', e);
  }
}

function handleScannedCode(qrString) {
  SoundFX.playSuccess();

  // Try to stop camera immediately
  if (html5QrScanner) {
    try {
      html5QrScanner.stop().catch(() => {});
    } catch (e) {}
  }

  // Parse QR format:
  // e.g. "CHECKPOINT:SABAS_NIEVES:ENTRY" or "CHECKPOINT:SABAS_NIEVES:EXIT"
  let stationId = 'SABAS_NIEVES';
  let action = 'ENTRY';

  if (qrString.includes(':')) {
    const parts = qrString.split(':');
    if (parts.length >= 3) {
      stationId = parts[1].toUpperCase();
      action = parts[2].toUpperCase();
    } else if (parts.length === 2) {
      stationId = parts[0].toUpperCase();
      action = parts[1].toUpperCase();
    }
  } else {
    // If scanning raw text, guess action based on active hike
    action = activeHike ? 'EXIT' : 'ENTRY';
  }

  // If station is not recognized, default to Sabas Nieves
  if (!STATIONS_DATA[stationId]) {
    stationId = 'SABAS_NIEVES';
  }

  if (action === 'ENTRY') {
    if (activeHike) {
      showToast(`Ya estás registrado en la montaña desde las ${activeHike.entryTimeStr}. Debes escanear el QR de SALIDA al descender.`, 'warning');
      switchView('view-active-hike');
    } else {
      openCheckinModal(stationId);
    }
  } else if (action === 'EXIT') {
    if (!activeHike) {
      showToast(`No tienes ningún ascenso activo registrado. ¿Deseas registrar una nueva subida?`, 'warning');
      openCheckinModal(stationId);
    } else {
      processCheckOut(stationId);
    }
  }
}

// ==========================================
// 9. CHECK-IN (ENTRADA) PROCESS
// ==========================================
let pendingCheckinStation = null;

function openCheckinModal(stationId) {
  const station = STATIONS_DATA[stationId] || STATIONS_DATA.SABAS_NIEVES;
  pendingCheckinStation = station;

  const modal = document.getElementById('modal-checkin-confirm');
  if (!modal) return;

  const titleEl = document.getElementById('modal-station-title');
  const detailsEl = document.getElementById('modal-station-details');
  const timeEl = document.getElementById('modal-entry-current-time');
  const contactEl = document.getElementById('modal-entry-contact-name');

  const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (titleEl) titleEl.textContent = station.name;
  if (detailsEl) detailsEl.textContent = `Altitud: ${station.altitude} • Guardaparques: ${station.rangers}`;
  if (timeEl) timeEl.textContent = `${nowStr} (Hora Oficial)`;
  if (contactEl && currentUser && currentUser.contact1) {
    contactEl.textContent = `${currentUser.contact1.name} (${currentUser.contact1.phone})`;
  }

  modal.classList.add('active');
}

function confirmCheckIn() {
  if (!pendingCheckinStation) return;

  const destSelect = document.getElementById('select-hike-destination');
  const destination = destSelect ? destSelect.value : 'Mirador Sabas Nieves (1,300m)';

  const now = new Date();
  const entryTimeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const newHike = {
    id: `hike_${Date.now()}`,
    stationId: pendingCheckinStation.id,
    stationName: pendingCheckinStation.name,
    altitude: pendingCheckinStation.altitude,
    destination: destination,
    startTimestamp: now.toISOString(),
    entryTimeStr: entryTimeStr,
    userFullName: currentUser ? currentUser.fullName : 'Excursionista',
    userCedula: currentUser ? currentUser.cedula : 'V-00000000',
    contactNotified: currentUser && currentUser.contact1 ? currentUser.contact1.name : 'Contacto Registrado'
  };

  saveActiveHike(newHike);
  SoundFX.playSuccess();

  // Close modal
  const modal = document.getElementById('modal-checkin-confirm');
  if (modal) modal.classList.remove('active');

  showToast(`¡Entrada registrada con éxito en ${pendingCheckinStation.name}! Guardaparques informados.`);
  switchView('view-active-hike');
}

// ==========================================
// 10. CHECK-OUT (SALIDA) PROCESS
// ==========================================
function processCheckOut(exitStationId) {
  if (!activeHike) return;

  const exitStation = STATIONS_DATA[exitStationId] || STATIONS_DATA.SABAS_NIEVES;
  const now = new Date();
  const start = new Date(activeHike.startTimestamp);
  const diffMs = Math.max(0, now.getTime() - start.getTime());
  const diffHrs = Math.floor(diffMs / 3600000);
  const diffMins = Math.floor((diffMs % 3600000) / 60000);
  const durationStr = `${String(diffHrs).padStart(2, '0')}h ${String(diffMins).padStart(2, '0')}m`;

  const completedRecord = {
    id: activeHike.id,
    stationName: activeHike.stationName,
    exitStationName: exitStation.name,
    destination: activeHike.destination,
    date: now.toLocaleDateString('es-VE', { day: 'numeric', month: 'short', year: 'numeric' }),
    entryTime: activeHike.entryTimeStr,
    exitTime: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    durationStr: durationStr,
    status: 'Descenso Seguro • Completado'
  };

  // Add to history
  hikesHistory.unshift(completedRecord);
  localStorage.setItem('avila_hikes_history', JSON.stringify(hikesHistory));

  // Clear active hike
  saveActiveHike(null);

  SoundFX.playSuccess();

  // Populate checkout modal
  const modal = document.getElementById('modal-checkout-success');
  if (modal) {
    const durEl = document.getElementById('summary-hike-duration');
    const stEl = document.getElementById('summary-hike-station');
    if (durEl) durEl.textContent = durationStr;
    if (stEl) stEl.textContent = exitStation.name;
    modal.classList.add('active');
  }

  showToast(`¡Descenso exitoso! Gracias por registrar tu salida del Ávila.`);
}

// ==========================================
// 11. HISTORIAL & STATS RENDERER
// ==========================================
function renderHikesHistory() {
  const container = document.getElementById('hikes-history-container');
  if (!container) return;

  container.innerHTML = '';

  if (hikesHistory.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding:30px; color:var(--text-secondary);">
        <p style="margin-bottom:12px; color:var(--c-green-400);">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m8 3 4 8 5-5 5 15H2L8 3z"></path></svg>
        </p>
        <p>No tienes ascensos registrados en tu bitácora todavía.</p>
        <button id="btn-empty-start-hike" class="btn-sm btn-yellow" style="margin-top:12px;">Comenzar mi Primer Ascenso</button>
      </div>
    `;
    const emptyBtn = document.getElementById('btn-empty-start-hike');
    if (emptyBtn) {
      emptyBtn.addEventListener('click', () => switchView('view-home'));
    }
    return;
  }

  hikesHistory.forEach(item => {
    const card = document.createElement('div');
    card.className = 'history-item-card';
    card.innerHTML = `
      <div class="hic-header">
        <div class="hic-station">${item.stationName}</div>
        <span class="hic-badge completed">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" style="vertical-align:middle;margin-right:3px;"><polyline points="20 6 9 17 4 12"></polyline></svg>
          <span>${item.status || 'Descenso Seguro'}</span>
        </span>
      </div>
      <div style="font-size:12px; color:var(--c-yellow-400); font-weight:600;">
        Destino: ${item.destination || 'Mirador Sabas Nieves'}
      </div>
      <div class="hic-meta-grid">
        <div>
          <span>Fecha</span>
          <strong>${item.date}</strong>
        </div>
        <div>
          <span>Horario</span>
          <strong>${item.entryTime} - ${item.exitTime}</strong>
        </div>
        <div>
          <span>Duración</span>
          <strong style="color:var(--c-green-400);">${item.durationStr}</strong>
        </div>
      </div>
    `;
    container.appendChild(card);
  });

  updateHistoryStats();
}

function updateHistoryStats() {
  const countEl = document.getElementById('stat-total-hikes');
  const hoursEl = document.getElementById('stat-total-hours');
  if (countEl) countEl.textContent = hikesHistory.length;

  let totalMins = 0;
  hikesHistory.forEach(h => {
    if (h.durationStr) {
      const match = h.durationStr.match(/(\d+)h\s*(\d+)m/);
      if (match) {
        totalMins += parseInt(match[1]) * 60 + parseInt(match[2]);
      }
    }
  });

  const totalHrs = (totalMins / 60).toFixed(1);
  if (hoursEl) hoursEl.textContent = `${totalHrs}h`;
}

// ==========================================
// 12. RANGER CENTRAL MONITOR (INPARQUES)
// ==========================================
function renderRangerMonitor() {
  const container = document.getElementById('ranger-hikers-container');
  if (!container) return;

  container.innerHTML = '';

  // Combine initial simulated hikers + active current user if on mountain
  const list = [...INITIAL_RANGER_HIKERS];
  if (activeHike) {
    const start = new Date(activeHike.startTimestamp);
    const elapsedMins = Math.floor((Date.now() - start.getTime()) / 60000);
    list.unshift({
      id: 'active_current_user',
      name: currentUser ? currentUser.fullName : 'Alejandro Mendoza',
      cedula: currentUser ? currentUser.cedula : 'V-20.458.120',
      phone: currentUser ? currentUser.phone : '+58 414 302 1948',
      station: activeHike.stationName,
      destination: activeHike.destination,
      entryTime: activeHike.entryTimeStr,
      elapsedMins: elapsedMins,
      contact: currentUser && currentUser.contact1 ? `${currentUser.contact1.name} (${currentUser.contact1.phone})` : 'Registrado',
      avatar: currentUser ? currentUser.avatar : 'assets/images/avatar.jpg'
    });
  }

  // Update KPI counters
  const activeCountEl = document.getElementById('kpi-active-hikers');
  if (activeCountEl) activeCountEl.textContent = list.length;

  const alertsCountEl = document.getElementById('kpi-alerts-overdue');
  let overdueAlerts = 0;

  list.forEach(hiker => {
    const isOverdue = hiker.elapsedMins > 300; // > 5 hours
    if (isOverdue) overdueAlerts++;

    const card = document.createElement('div');
    card.className = 'ranger-hiker-card';
    card.innerHTML = `
      <img src="${hiker.avatar}" alt="${hiker.name}" class="rh-avatar">
      <div class="rh-info">
        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
          <h4 class="rh-name">${hiker.name}</h4>
          <span class="rh-alert-badge ${isOverdue ? 'danger' : 'safe'}">
            ${isOverdue ? '<span class="pulse-dot-red"></span> TIEMPO EXCEDIDO' : '<span class="pulse-dot-green"></span> EN TIEMPO'}
          </span>
        </div>
        <div class="rh-sub">${hiker.cedula} • Entrada: ${hiker.entryTime} (${Math.floor(hiker.elapsedMins/60)}h ${hiker.elapsedMins%60}m en ruta)</div>
        <div class="rh-sub">Puesto: <strong>${hiker.station}</strong> &rarr; ${hiker.destination}</div>
        <div class="rh-sub" style="color:var(--c-yellow-400); margin-top:2px;">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:4px;"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
          <span>Contacto: ${hiker.contact}</span>
        </div>
      </div>
    `;

    container.appendChild(card);
  });

  if (alertsCountEl) alertsCountEl.textContent = overdueAlerts;
}

// ==========================================
// 13. OFFICIAL STATION QR GENERATOR
// ==========================================
function renderStationQRs() {
  const stationSelect = document.getElementById('select-qr-station');
  if (!stationSelect) return;

  const currentStationKey = stationSelect.value || 'SABAS_NIEVES';
  const station = STATIONS_DATA[currentStationKey] || STATIONS_DATA.SABAS_NIEVES;

  const nameEntry = document.getElementById('poster-station-name-entry');
  const nameExit = document.getElementById('poster-station-name-exit');
  if (nameEntry) nameEntry.textContent = station.name;
  if (nameExit) nameExit.textContent = station.name;

  // Generate QR Canvas for Entry
  const entryHolder = document.getElementById('qr-holder-entry');
  if (entryHolder) {
    entryHolder.innerHTML = '';
    const entryData = `AVILA_PASS:CHECKPOINT:${station.id}:ENTRY`;
    new QRCode(entryHolder, {
      text: entryData,
      width: 170,
      height: 170,
      colorDark: '#064e3b',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.H
    });
  }

  // Generate QR Canvas for Exit
  const exitHolder = document.getElementById('qr-holder-exit');
  if (exitHolder) {
    exitHolder.innerHTML = '';
    const exitData = `AVILA_PASS:CHECKPOINT:${station.id}:EXIT`;
    new QRCode(exitHolder, {
      text: exitData,
      width: 170,
      height: 170,
      colorDark: '#b45309',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.H
    });
  }

  // Wire simulation buttons
  const btnSimEntry = document.getElementById('btn-simulate-current-entry');
  if (btnSimEntry) {
    btnSimEntry.onclick = () => {
      handleScannedCode(`CHECKPOINT:${station.id}:ENTRY`);
    };
  }

  const btnSimExit = document.getElementById('btn-simulate-current-exit');
  if (btnSimExit) {
    btnSimExit.onclick = () => {
      handleScannedCode(`CHECKPOINT:${station.id}:EXIT`);
    };
  }
}

// ==========================================
// 14. EMERGENCY SOS PROTOCOL
// ==========================================
function openSOSModal() {
  SoundFX.playAlert();

  const modal = document.getElementById('modal-emergency-sos');
  if (!modal) return;

  // Try real GPS coordinates
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coordsText = `${pos.coords.latitude.toFixed(4)}° N, ${pos.coords.longitude.toFixed(4)}° W (±${Math.round(pos.coords.accuracy)}m)`;
        const coordsEl = document.getElementById('sos-live-coords');
        if (coordsEl) coordsEl.textContent = coordsText;

        updateWhatsAppSOSLink(coordsText);
      },
      (err) => {
        console.warn('Geolocation fallback used');
        updateWhatsAppSOSLink('10.5190° N, -66.8522° W (El Ávila - Sabas Nieves)');
      },
      { enableHighAccuracy: true, timeout: 6000 }
    );
  } else {
    updateWhatsAppSOSLink('10.5190° N, -66.8522° W (El Ávila - Sabas Nieves)');
  }

  // Elapsed time in SOS modal
  const sosTimeEl = document.getElementById('sos-live-time');
  if (sosTimeEl) {
    const liveTimer = document.getElementById('live-hike-timer');
    sosTimeEl.textContent = liveTimer ? liveTimer.textContent : '00h 00m';
  }

  modal.classList.add('active');
}

function updateWhatsAppSOSLink(coords) {
  const btn = document.getElementById('btn-sos-whatsapp-contact');
  const btnText = document.getElementById('sos-whatsapp-btn-text');
  if (!btn) return;

  let phone = '584143021948';
  let contactName = 'Contacto de Emergencia';

  if (currentUser && currentUser.contact1) {
    contactName = currentUser.contact1.name;
    phone = currentUser.contact1.phone.replace(/[^0-9]/g, '');
  }

  const hikerName = currentUser ? currentUser.fullName : 'Excursionista';
  const stationName = activeHike ? activeHike.stationName : 'El Ávila';

  const message = encodeURIComponent(
    `[ALERTA SOS - EXTRAVÍO EN EL ÁVILA / WARAIRA REPANO]\n\n` +
    `Soy *${hikerName}*. Necesito asistencia inmediata o auxilio en la montaña.\n` +
    `• Coordenadas GPS actuales: ${coords}\n` +
    `• Registré entrada por: ${stationName}\n` +
    `• Por favor comunícate urgente con Guardaparques INPARQUES al 0800-ELAVILA (0800-3528452) o Bomberos Forestales (0212-2856410).`
  );

  btn.href = `https://wa.me/${phone}?text=${message}`;
  if (btnText) btnText.textContent = `Enviar Ubicación SOS a ${contactName}`;
}

// ==========================================
// 15. INITIALIZATION & EVENT LISTENERS
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  // 1. Load Data
  loadSavedData();

  // 2. Render Initial Components
  renderCheckpointsCarousel('all');

  // Initialize initial active view state & navigation visibility
  const activeViewEl = document.querySelector('.app-view.active');
  switchView(activeViewEl ? activeViewEl.id : 'view-onboarding');

  // 3. Status Bar Clock Update
  function updateClock() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const clockEl = document.getElementById('status-time');
    if (clockEl) clockEl.textContent = timeStr;
  }
  updateClock();
  setInterval(updateClock, 30000);

  // 4. Onboarding Buttons
  const btnGetStarted = document.getElementById('btn-get-started');
  if (btnGetStarted) {
    btnGetStarted.addEventListener('click', () => switchView('view-auth'));
  }

  const btnQuickLogin = document.getElementById('btn-quick-login-link');
  if (btnQuickLogin) {
    btnQuickLogin.addEventListener('click', () => {
      switchView('view-auth');
      document.getElementById('tab-login')?.click();
    });
  }

  const btnDemoLink = document.getElementById('btn-demo-link');
  if (btnDemoLink) {
    btnDemoLink.addEventListener('click', () => {
      saveUser(DEFAULT_USER);
      showToast('¡Bienvenido Alejandro! Perfil demo activado.');
      switchView('view-home');
    });
  }

  // 5. Auth Tabs & Form
  const tabRegister = document.getElementById('tab-register');
  const tabLogin = document.getElementById('tab-login');
  const formRegister = document.getElementById('form-register');
  const formLogin = document.getElementById('form-login');

  if (tabRegister && tabLogin) {
    tabRegister.addEventListener('click', () => {
      tabRegister.classList.add('active');
      tabLogin.classList.remove('active');
      formRegister.style.display = 'block';
      formLogin.style.display = 'none';
    });

    tabLogin.addEventListener('click', () => {
      tabLogin.classList.add('active');
      tabRegister.classList.remove('active');
      formRegister.style.display = 'none';
      formLogin.style.display = 'block';
    });
  }

  const btnBackToReg = document.getElementById('btn-back-to-reg');
  if (btnBackToReg) {
    btnBackToReg.addEventListener('click', () => tabRegister.click());
  }

  // Autofill Demo Button
  const btnAutofill = document.getElementById('btn-autofill-demo');
  if (btnAutofill) {
    btnAutofill.addEventListener('click', () => {
      document.getElementById('reg-fullname').value = DEFAULT_USER.fullName;
      document.getElementById('reg-cedula').value = DEFAULT_USER.cedula;
      document.getElementById('reg-phone').value = DEFAULT_USER.phone;
      document.getElementById('reg-email').value = DEFAULT_USER.email;
      document.getElementById('reg-blood').value = DEFAULT_USER.bloodType;
      document.getElementById('reg-contact1-name').value = DEFAULT_USER.contact1.name;
      document.getElementById('reg-contact1-rel').value = DEFAULT_USER.contact1.relation;
      document.getElementById('reg-contact1-phone').value = DEFAULT_USER.contact1.phone;
      document.getElementById('reg-contact2-name').value = DEFAULT_USER.contact2.name;
      document.getElementById('reg-contact2-rel').value = DEFAULT_USER.contact2.relation;
      document.getElementById('reg-contact2-phone').value = DEFAULT_USER.contact2.phone;
      document.getElementById('reg-medical').value = DEFAULT_USER.medicalNotes;
      document.getElementById('avatar-preview').src = DEFAULT_USER.avatar;

      showToast('Formulario completado con datos de prueba.');
    });
  }

  // Avatar File Upload
  const avatarInput = document.getElementById('avatar-file-input');
  if (avatarInput) {
    avatarInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          document.getElementById('avatar-preview').src = event.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Register Form Submit
  if (formRegister) {
    formRegister.addEventListener('submit', (e) => {
      e.preventDefault();

      const newUser = {
        id: `user_${Date.now()}`,
        fullName: document.getElementById('reg-fullname').value.trim(),
        cedula: document.getElementById('reg-cedula').value.trim(),
        phone: document.getElementById('reg-phone').value.trim(),
        email: document.getElementById('reg-email').value.trim(),
        bloodType: document.getElementById('reg-blood').value,
        medicalNotes: document.getElementById('reg-medical').value.trim(),
        avatar: document.getElementById('avatar-preview').src || DEFAULT_USER.avatar,
        contact1: {
          name: document.getElementById('reg-contact1-name').value.trim(),
          relation: document.getElementById('reg-contact1-rel').value.trim(),
          phone: document.getElementById('reg-contact1-phone').value.trim()
        },
        contact2: {
          name: document.getElementById('reg-contact2-name').value.trim(),
          relation: document.getElementById('reg-contact2-rel').value.trim(),
          phone: document.getElementById('reg-contact2-phone').value.trim()
        },
        registeredAt: new Date().toISOString()
      };

      saveUser(newUser);
      SoundFX.playSuccess();
      showToast(`¡Perfil creado exitosamente! Bienvenido ${newUser.fullName}.`);
      switchView('view-home');
    });
  }

  // Login Form Submit
  if (formLogin) {
    formLogin.addEventListener('submit', (e) => {
      e.preventDefault();
      // Fast login with current or default
      saveUser(currentUser || DEFAULT_USER);
      SoundFX.playSuccess();
      showToast('Sesión iniciada correctamente.');
      switchView('view-home');
    });
  }

  // 6. Navigation Buttons (Bottom Nav & Back Buttons)
  document.querySelectorAll('[data-view]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.view;
      switchView(target);
    });
  });

  document.querySelectorAll('[data-back]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.back;
      switchView(target);
    });
  });

  // Center QR Scanner FAB and Navbar Scan Button
  const fabScan = document.getElementById('btn-fab-scan');
  if (fabScan) {
    fabScan.addEventListener('click', () => switchView('view-scanner'));
  }

  const btnNavbarScan = document.getElementById('btn-navbar-scan');
  if (btnNavbarScan) {
    btnNavbarScan.addEventListener('click', () => switchView('view-scanner'));
  }

  const heroScanTrigger = document.getElementById('btn-hero-scan-trigger');
  if (heroScanTrigger) {
    heroScanTrigger.addEventListener('click', () => switchView('view-scanner'));
  }

  // Header Profile click
  const headerProfile = document.getElementById('btn-header-profile');
  if (headerProfile) {
    headerProfile.addEventListener('click', () => switchView('view-profile'));
  }

  // Active Hike Banner link
  const bannerGoHike = document.getElementById('btn-go-to-active-hike');
  if (bannerGoHike) {
    bannerGoHike.addEventListener('click', () => switchView('view-active-hike'));
  }

  // 7. QR Scanner Simulation Buttons (Allows instant testing anywhere)
  document.querySelectorAll('.btn-sim-qr').forEach(btn => {
    btn.addEventListener('click', () => {
      const qrData = btn.dataset.qr;
      handleScannedCode(qrData);
    });
  });

  // QR File Scanner
  const qrFileInput = document.getElementById('qr-input-file');
  if (qrFileInput) {
    qrFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file && html5QrScanner) {
        html5QrScanner.scanFile(file, true)
          .then(decodedText => {
            handleScannedCode(decodedText);
          })
          .catch(err => {
            showToast('No se encontró un código QR válido en la imagen.', 'warning');
          });
      }
    });
  }

  // Camera flip
  const btnCameraFlip = document.getElementById('btn-toggle-camera-facing');
  if (btnCameraFlip) {
    btnCameraFlip.addEventListener('click', () => {
      currentCameraFacing = currentCameraFacing === 'environment' ? 'user' : 'environment';
      initCameraScanner();
      showToast(`Cámara cambiada a: ${currentCameraFacing === 'environment' ? 'Trasera' : 'Frontal'}`);
    });
  }

  // 8. Modals Wire
  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.dataset.closeModal;
      const modal = document.getElementById(modalId);
      if (modal) modal.classList.remove('active');
    });
  });

  const btnConfirmEntryFinal = document.getElementById('btn-confirm-entry-final');
  if (btnConfirmEntryFinal) {
    btnConfirmEntryFinal.addEventListener('click', confirmCheckIn);
  }

  const btnScanExitNow = document.getElementById('btn-scan-exit-now');
  if (btnScanExitNow) {
    btnScanExitNow.addEventListener('click', () => {
      // Direct checkout for active station
      if (activeHike) {
        processCheckOut(activeHike.stationId);
      } else {
        switchView('view-scanner');
      }
    });
  }

  const btnCloseCheckoutSummary = document.getElementById('btn-close-checkout-summary');
  if (btnCloseCheckoutSummary) {
    btnCloseCheckoutSummary.addEventListener('click', () => {
      const modal = document.getElementById('modal-checkout-success');
      if (modal) modal.classList.remove('active');
      switchView('view-home');
    });
  }

  // 9. SOS Emergency Trigger
  const btnSosTrigger = document.getElementById('btn-sos-modal-trigger');
  if (btnSosTrigger) {
    btnSosTrigger.addEventListener('click', openSOSModal);
  }

  // 10. Category Chips Filter
  document.querySelectorAll('.cat-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.cat-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const filter = chip.dataset.filter;
      renderCheckpointsCarousel(filter);
    });
  });

  // 11. Weather Pills click
  document.querySelectorAll('.weather-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.weather-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const place = pill.querySelector('.wp-place').textContent;
      const temp = pill.querySelector('.wp-temp').textContent;
      showToast(`Clima en ${place}: ${temp}C`);
    });
  });

  // 12. Station Posters View
  const btnSeeAllQrs = document.getElementById('btn-see-all-qrs');
  if (btnSeeAllQrs) {
    btnSeeAllQrs.addEventListener('click', () => switchView('view-station-qrs'));
  }

  const btnOpenStationQrs = document.getElementById('btn-open-station-qrs');
  if (btnOpenStationQrs) {
    btnOpenStationQrs.addEventListener('click', () => switchView('view-station-qrs'));
  }

  const selectQrStation = document.getElementById('select-qr-station');
  if (selectQrStation) {
    selectQrStation.addEventListener('change', renderStationQRs);
  }

  // 13. Ranger Monitor Desktop Button
  const btnQuickRanger = document.getElementById('btn-quick-ranger');
  if (btnQuickRanger) {
    btnQuickRanger.addEventListener('click', () => switchView('view-ranger-monitor'));
  }

  const btnRefreshRanger = document.getElementById('btn-refresh-ranger');
  if (btnRefreshRanger) {
    btnRefreshRanger.addEventListener('click', () => {
      renderRangerMonitor();
      showToast('Lista de guardaparques actualizada.');
    });
  }

  // Ranger Search
  const rangerSearchInput = document.getElementById('ranger-search-input');
  if (rangerSearchInput) {
    rangerSearchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();
      document.querySelectorAll('.ranger-hiker-card').forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(q) ? 'flex' : 'none';
      });
    });
  }

  // 14. Desktop Phone Frame Toggle
  const btnToggleFrame = document.getElementById('btn-toggle-frame');
  const mobileFrame = document.getElementById('mobile-frame');
  const frameToggleText = document.getElementById('frame-toggle-text');
  if (btnToggleFrame && mobileFrame) {
    btnToggleFrame.addEventListener('click', () => {
      mobileFrame.classList.toggle('fullscreen-mode');
      const isFullscreen = mobileFrame.classList.contains('fullscreen-mode');
      if (frameToggleText) {
        frameToggleText.textContent = isFullscreen ? 'Modo Marco Móvil' : 'Modo Pantalla Ampliada';
      }
    });
  }

  // 15. Clear History Button
  const btnClearHistory = document.getElementById('btn-clear-history');
  if (btnClearHistory) {
    btnClearHistory.addEventListener('click', () => {
      if (confirm('¿Deseas vaciar tu historial de caminatas registradas?')) {
        hikesHistory = [];
        localStorage.removeItem('avila_hikes_history');
        renderHikesHistory();
        showToast('Historial vaciado.');
      }
    });
  }

  // 16. Logout / Change User
  const btnLogout = document.getElementById('btn-logout');
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      if (confirm('¿Cerrar sesión actual? Se guardarán tus datos.')) {
        switchView('view-auth');
        showToast('Sesión cerrada.');
      }
    });
  }

  // 17. Search checkpoints input
  const searchInput = document.getElementById('search-checkpoints');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();
      document.querySelectorAll('.checkpoint-card').forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(q) ? 'block' : 'none';
      });
    });
  }

  // GPS Nearest Station button
  const btnGps = document.getElementById('btn-gps-nearest');
  if (btnGps) {
    btnGps.addEventListener('click', () => {
      showToast('Puesto más cercano detectado: Sabas Nieves I (Altamira - 450m)');
      renderCheckpointsCarousel('all');
    });
  }

  // 18. PWA Service Worker Registration
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then(reg => {
          console.log('[PWA] Service Worker registered with scope:', reg.scope);
        })
        .catch(err => {
          console.warn('[PWA] Service Worker registration failed:', err);
        });
    });
  }

  // 19. PWA Install Prompt Banner Handler
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPWAInstallPrompt = e;
    console.log('[PWA] beforeinstallprompt captured');
  });

  const btnInstallPwa = document.getElementById('btn-install-pwa');
  if (btnInstallPwa) {
    btnInstallPwa.addEventListener('click', () => {
      if (deferredPWAInstallPrompt) {
        deferredPWAInstallPrompt.prompt();
        deferredPWAInstallPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            showToast('¡Ávila Pass instalada en tu dispositivo!');
          }
          deferredPWAInstallPrompt = null;
        });
      } else {
        showToast('Para instalar: usa el menú de tu navegador "Agregar a pantalla de inicio"');
      }
    });
  }

  // Online / Offline Detection
  function updateOnlineStatus() {
    const badge = document.getElementById('network-badge');
    if (badge) {
      if (navigator.onLine) {
        badge.innerHTML = '<span class="dot-online"></span> PWA Online';
        badge.style.color = 'var(--c-green-400)';
      } else {
        badge.innerHTML = '<span class="dot-online" style="background:#f59e0b;"></span> Modo Ávila Offline';
        badge.style.color = 'var(--c-yellow-400)';
      }
    }
  }
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
  updateOnlineStatus();
});
