import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { STATIONS } from '../data/stations';
import jsQR from 'jsqr';
import { 
  X, 
  Camera, 
  Zap, 
  ShieldCheck, 
  MapPin, 
  AlertCircle, 
  RefreshCw, 
  Image as ImageIcon 
} from 'lucide-react';

export default function ModalScanner() {
  const { modalScanner, setModalScanner, activeHike, setModalCheckin, setModalCheckout, showToast } = useApp();
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [facingMode, setFacingMode] = useState('environment'); // 'environment' | 'user'

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const animationFrameRef = useRef(null);
  const fileInputRef = useRef(null);
  const isScanningRef = useRef(false);

  // Process decoded QR string
  const handleDecodedCode = (decodedText) => {
    if (!isScanningRef.current) return;
    isScanningRef.current = false;

    // Stop camera stream immediately
    stopCamera();

    setModalScanner({ isOpen: false, stationId: null });

    const textUpper = (decodedText || '').toUpperCase();
    let matchedStation = STATIONS.find(s => textUpper.includes(s.id));
    if (!matchedStation) {
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

  const stopCamera = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  // Continuous frame scanner using jsQR
  const scanFrame = () => {
    if (!isScanningRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert'
      });

      if (code && code.data) {
        handleDecodedCode(code.data);
        return;
      }
    }

    if (isScanningRef.current) {
      animationFrameRef.current = requestAnimationFrame(scanFrame);
    }
  };

  // Start Camera
  useEffect(() => {
    if (!modalScanner.isOpen) {
      isScanningRef.current = false;
      stopCamera();
      return;
    }

    isScanningRef.current = true;
    setCameraError('');
    setCameraActive(false);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('Tu navegador no soporta acceso directo a la cámara por video.');
      return;
    }

    const constraints = {
      video: {
        facingMode: { ideal: facingMode },
        width: { ideal: 640 },
        height: { ideal: 480 }
      },
      audio: false
    };

    navigator.mediaDevices.getUserMedia(constraints)
      .then(stream => {
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().then(() => {
            setCameraActive(true);
            animationFrameRef.current = requestAnimationFrame(scanFrame);
          }).catch(err => {
            console.warn('Video play error:', err);
          });
        }
      })
      .catch(err => {
        console.warn('getUserMedia error:', err);
        if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
          setCameraError('El navegador móvil bloquea la cámara web en HTTP local. Puedes usar el botón de tomar foto o la simulación rápida:');
        } else {
          setCameraError('Permiso de cámara no concedido o lente ocupado por otra app.');
        }
      });

    return () => {
      isScanningRef.current = false;
      stopCamera();
    };
  }, [modalScanner.isOpen, facingMode]);

  // Decode from native camera photo upload
  const handlePhotoFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    showToast('Analizando fotografía del código QR...', 'info');
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current || document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, img.width, img.height);
        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code && code.data) {
          handleDecodedCode(code.data);
        } else {
          showToast('No se detectó un código QR nítido. Puedes seleccionar el puesto manualmente abajo.', 'warning');
        }
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const toggleCameraFacing = () => {
    stopCamera();
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
  };

  const handleSimulateScan = (stId) => {
    handleDecodedCode(stId);
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

        {/* Viewfinder Screen (Strict single box layout) */}
        <div className="scanner-viewfinder-box">
          
          {/* Native Live Video Feed */}
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className="scanner-live-video"
          />

          {/* Off-screen hidden canvas for jsQR analysis */}
          <canvas ref={canvasRef} style={{ display: 'none' }} />

          {/* Golden Target Viewfinder Overlay */}
          <div className="viewfinder-frame">
            <div className="vf-corner vf-tl"></div>
            <div className="vf-corner vf-tr"></div>
            <div className="vf-corner vf-bl"></div>
            <div className="vf-corner vf-br"></div>
            <div className="vf-laser-line"></div>
          </div>

          {/* Camera Error / Fallback State */}
          {cameraError && (
            <div className="vf-camera-overlay">
              <AlertCircle size={26} className="text-yellow" />
              <p className="vf-error-msg">{cameraError}</p>
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

          {/* Flip camera button */}
          {cameraActive && (
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
          onChange={handlePhotoFile}
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
          <span>Detección automática en tiempo real • Sin división de pantalla.</span>
        </div>

      </div>
    </div>
  );
}
