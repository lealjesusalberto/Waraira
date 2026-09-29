import React, { createContext, useContext, useState, useEffect } from 'react';
import { STATIONS } from '../data/stations';

const AppContext = createContext(null);

const DEFAULT_USER = {
  name: 'Alejandro Mendoza',
  cedula: 'V-20.458.120',
  phone: '+58 414 302 1948',
  bloodType: 'O+',
  emergencyContact: 'María Elena Mendoza',
  emergencyPhone: '+58 414 302 1948',
  emergencyRel: 'Hermana',
  isLoggedIn: true
};

const DEFAULT_HISTORY = [
  {
    id: 'h_1',
    stationName: 'Puesto Sabas Nieves I & II',
    date: '2026-09-21',
    duration: '1h 15m',
    ascentMeters: 450,
    status: 'Completado con éxito'
  },
  {
    id: 'h_2',
    stationName: 'Puesto La Julia / Mirador',
    date: '2026-09-14',
    duration: '1h 45m',
    ascentMeters: 620,
    status: 'Completado con éxito'
  }
];

export function AppProvider({ children }) {
  // 1. User State
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('avila_user');
      return saved ? JSON.parse(saved) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  // 2. Active Hike State
  const [activeHike, setActiveHike] = useState(() => {
    try {
      const saved = localStorage.getItem('avila_active_hike');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // 3. Hike History State
  const [hikeHistory, setHikeHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('avila_hike_history');
      return saved ? JSON.parse(saved) : DEFAULT_HISTORY;
    } catch {
      return DEFAULT_HISTORY;
    }
  });

  // 4. Navigation View State
  const [currentView, setCurrentView] = useState('onboarding');

  // 5. Connectivity State
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // 6. Elapsed Time for Active Hike
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // 7. Modals
  const [modalCheckin, setModalCheckin] = useState({ isOpen: false, station: null });
  const [modalCheckout, setModalCheckout] = useState(false);
  const [modalScanner, setModalScanner] = useState({ isOpen: false, stationId: null });
  const [modalQrPosters, setModalQrPosters] = useState(false);
  const [modalSos, setModalSos] = useState(false);

  // 8. Toast Notification
  const [toast, setToast] = useState({ visible: false, message: '', type: 'info' });

  const showToast = (message, type = 'info') => {
    setToast({ visible: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 4000);
  };

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('avila_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    if (activeHike) {
      localStorage.setItem('avila_active_hike', JSON.stringify(activeHike));
    } else {
      localStorage.removeItem('avila_active_hike');
    }
  }, [activeHike]);

  useEffect(() => {
    localStorage.setItem('avila_hike_history', JSON.stringify(hikeHistory));
  }, [hikeHistory]);

  // Online / offline listeners
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      showToast('Conexión restaurada. Sincronización en tiempo real activa.', 'success');
    };
    const handleOffline = () => {
      setIsOnline(false);
      showToast('Modo sin conexión activado. Guardando registros en caché local.', 'warning');
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Timer for active hike
  useEffect(() => {
    if (!activeHike) {
      setElapsedSeconds(0);
      return;
    }
    const updateTimer = () => {
      const now = Date.now();
      const start = new Date(activeHike.startTime).getTime();
      const diffSecs = Math.max(0, Math.floor((now - start) / 1000));
      setElapsedSeconds(diffSecs);
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [activeHike]);

  // Start a new hike
  const startHike = (stationId, destination = '', party = 1) => {
    const st = STATIONS.find(s => s.id === stationId) || STATIONS[0];
    const newHike = {
      id: 'hike_' + Date.now(),
      stationId: st.id,
      stationName: st.name,
      stationSub: st.sub,
      elevation: st.altitude,
      altitudeNum: st.altitudeNum,
      destination: destination || st.name,
      partyCount: party,
      startTime: new Date().toISOString(),
      curfew: st.descentCurfew || '17:30',
      status: 'En curso'
    };
    setActiveHike(newHike);
    setModalCheckin({ isOpen: false, station: null });
    setCurrentView('active-hike');
    showToast(`¡Ascenso iniciado en ${st.name}! Sube con precaución.`, 'success');
  };

  // Checkout / Finish Hike
  const finishHike = () => {
    if (!activeHike) return;
    const durMins = Math.max(1, Math.round(elapsedSeconds / 60));
    const hours = Math.floor(durMins / 60);
    const mins = durMins % 60;
    const durationStr = hours > 0 ? `${hours}h ${mins}m` : `${mins} min`;

    const completed = {
      id: activeHike.id,
      stationName: activeHike.stationName,
      date: new Date().toISOString().split('T')[0],
      duration: durationStr,
      ascentMeters: activeHike.altitudeNum || 500,
      status: 'Descenso registrado exitosamente'
    };

    setHikeHistory(prev => [completed, ...prev]);
    setActiveHike(null);
    setModalCheckout(false);
    setCurrentView('home');
    showToast('¡Regreso seguro confirmado en garita! Excelente jornada.', 'success');
  };

  const updateUser = (data) => {
    setUser(prev => ({ ...prev, ...data }));
    showToast('Datos de senderista actualizados correctamente.', 'success');
  };

  const loginUser = (cedula, phone) => {
    setUser(prev => ({
      ...prev,
      cedula,
      phone,
      isLoggedIn: true
    }));
    setCurrentView('home');
    showToast(`Bienvenido de nuevo, ${user.name.split(' ')[0]}`, 'success');
  };

  return (
    <AppContext.Provider
      value={{
        user,
        updateUser,
        loginUser,
        activeHike,
        startHike,
        finishHike,
        hikeHistory,
        currentView,
        setCurrentView,
        isOnline,
        elapsedSeconds,
        modalCheckin,
        setModalCheckin,
        modalCheckout,
        setModalCheckout,
        modalScanner,
        setModalScanner,
        modalQrPosters,
        setModalQrPosters,
        modalSos,
        setModalSos,
        toast,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
