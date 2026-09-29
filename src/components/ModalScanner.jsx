import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { STATIONS } from '../data/stations';
import { Html5Qrcode } from 'html5-qrcode';
import { 
  X, 
  Camera, 
  Zap, 
  ShieldCheck, 
  MapPin, 
  AlertCircle, 
  RefreshCw, 
  Upload, 
  Image as ImageIcon 
} from 'lucide-react';

export default function ModalScanner() {
  const { modalScanner, setModalScanner, activeHike, setModalCheckin, setModalCheckout, showToast } = useApp();
  const [cameraState, setCameraState] = useState('initializing'); // 'initializing' | 'active' | 'blocked'
  const [errorMessage, setErrorMessage] = useState('');
  const [facingMode, setFacingMode] = useState('environment'); // 'environment' | 'user'
  const scannerRef = useRef(null);
  const fileInputRef = useRef(null);

  // Process decoded QR string
  const handleDecodedCode = (decodedText) => {
    // Stop scanner if active
    if (scannerRef.current) {
      try {
        scannerRef.current.stop().catch(() => {});
      } catch (e) {}
    }

    setModalScanner({ isOpen: false, stationId: null });

    // Try to find station by ID or match text
    const textUpper = (decodedText || '').toUpperCase();
    let matchedStation = STATIONS.find(s => textUpper.includes(s.id));
    if (!matchedStation) {
      // Find by station name
      matchedStation = STATIONS.find(s => textUpper.includes(s.name.toUpperCase().split(' ')[1] || ''));
    }
    if (!matchedStation) {
      matchedStation = STATIONS[0];
    }

    if (activeHike) {
      showToast(`Código QR verificado en ${matchedStation.name}. Confirmando descenso seguro.`, 'success');
      setModalCheckout(true);
    } else {
      showToast(`Código QR verificado en ${matchedStation.name}. Registrando ascenso.`, 'success');
      setModalCheckin({ isOpen: true, station: matchedStation });
    }
  };

  // Start live camera scanner
  useEffect(() => {
    if (!modalScanner.isOpen) {
      if (scannerRef.current) {
        try {
          scannerRef.current.stop().catch(() => {});
          scannerRef.current = null;
        } catch (e) {}
      }
      return;
    }

    setCameraState('initializing');
    setErrorMessage('');

    // Wait for DOM element #qr-camera-box to mount
    const timer = setTimeout(() => {
      try {
        const scanner = new Html5Qrcode('qr-camera-box');
        scannerRef.current = scanner;

        const config = {
          fps: 15,
          qrbox: { width: 220, height: 220 },
          aspectRatio: 1.0
        };

        scanner.start(
          { facingMode: facingMode },
          config,
          (decodedText) => {
            handleDecodedCode(decodedText);
          },
          () => {
            // Scanning in progress
          }
        )
        .then(() => {
          setCameraState('active');
        })
        .catch((err) => {
          console.warn('Camera access issue:', err);
          setCameraState('blocked');
          if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
            setErrorMessage('Tu navegador móvil requiere HTTPS para abrir el video en vivo en red local. Puedes tomar foto directa del QR o usar los selectores rápidos:');
          } else {
            setErrorMessage('No se pudo acceder al lente de la cámara (permiso denegado o dispositivo en uso).');
          }
        });
      } catch (e) {
        console.warn('Html5Qrcode init error:', e);
        setCameraState('blocked');
        setErrorMessage('Cámara no disponible en este navegador.');
      }
    }, 250);

    return () => {
      clearTimeout(timer);
      if (scannerRef.current) {
        try {
          scannerRef.current.stop().catch(() => {});
          scannerRef.current = null;
        } catch (e) {}
      }
    };
  }, [modalScanner.isOpen, facingMode]);

  // Handle photo/file upload scan fallback
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      showToast('Analizando código QR de la fotografía...', 'info');
      const html5QrCode = new Html5Qrcode('qr-camera-box');
      const result = await html5QrCode.scanFile(file, true);
      handleDecodedCode(result);
    } catch (err) {
      showToast('No se detectó un código QR legible en la imagen. Selecciona el puesto manualmente.', 'warning');
    }
  };

  const toggleCameraFacing = () => {
    if (scannerRef.current) {
      try {
        scannerRef.current.stop().catch(() => {});
      } catch (e) {}
    }
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
  };

  const handleSimulateScan = (stId) => {
    const station = STATIONS.find(s => s.id === stId) || STATIONS[0];
    handleDecodedCode(station.id);
  };

  if (!modalScanner.isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={() => setModalScanner({ isOpen: false, stationId: null })}>
      <div className="modal-sheet modal-scanner-sheet animate-pop" onClick={e => e.stopPropagation()}>
        
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-header-text">
            <span className="modal-badge-tag text-yellow">ESCÁNER OFICIAL DE PUESTO</span>
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

        {/* Viewfinder & Video Stream Box */}
        <div className="scanner-viewfinder-box">
          
          {/* HTML5 QR Camera Element */}
          <div id="qr-camera-box" className="qr-camera-stream-target"></div>

          {/* Viewfinder Target Overlays */}
          <div className="viewfinder-frame">
            <div className="vf-corner vf-tl"></div>
            <div className="vf-corner vf-tr"></div>
            <div className="vf-corner vf-bl"></div>
            <div className="vf-corner vf-br"></div>
            <div className="vf-laser-line"></div>
          </div>

          {/* Fallback Display if Camera is Loading or Blocked */}
          {cameraState === 'initializing' && (
            <div className="vf-camera-overlay">
              <Camera size={28} className="vf-cam-icon animate-pulse" />
              <span>Iniciando cámara...</span>
            </div>
          )}

          {cameraState === 'blocked' && (
            <div className="vf-camera-overlay vf-blocked">
              <AlertCircle size={28} className="text-yellow" />
              <span className="vf-blocked-text">{errorMessage}</span>
              <button 
                type="button" 
                className="btn-capture-photo"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera size={16} />
                <span>Tomar Foto al QR</span>
              </button>
            </div>
          )}

          {/* Flip Camera Control if active */}
          {cameraState === 'active' && (
            <button 
              type="button" 
              className="btn-flip-cam"
              onClick={toggleCameraFacing}
              title="Cambiar lente de cámara"
            >
              <RefreshCw size={15} />
            </button>
          )}

        </div>

        {/* Hidden File Input for Native Camera Photo Capture */}
        <input 
          ref={fileInputRef}
          type="file" 
          accept="image/*" 
          capture="environment"
          style={{ display: 'none' }}
          onChange={handleFileUpload}
        />

        {/* Quick Simulation Bar for Testing Any Station Instantly */}
        <div className="scanner-quick-select">
          <div className="sqs-title">
            <Zap size={14} className="text-yellow" />
            <span>Simulador de Caseta (Validación Rápida):</span>
          </div>
          <div className="sqs-chips">
            {STATIONS.map(st => (
              <button 
                key={st.id}
                type="button"
                className="sqs-chip-btn"
                onClick={() => handleSimulateScan(st.id)}
              >
                <MapPin size={12} className="text-yellow" />
                <span>{st.name.split(' ')[1] || st.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="scanner-footer-note">
          <ShieldCheck size={14} className="text-green" />
          <span>Compatible con cámaras móviles y funcionamiento offline.</span>
        </div>

      </div>
    </div>
  );
}
