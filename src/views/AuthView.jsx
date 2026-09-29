import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, Phone, IdCard, Heart, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AuthView() {
  const { user, updateUser, loginUser, setCurrentView } = useApp();
  const [mode, setMode] = useState('register'); // 'register' | 'login'

  // Register form state
  const [name, setName] = useState(user.name);
  const [cedula, setCedula] = useState(user.cedula);
  const [phone, setPhone] = useState(user.phone);
  const [bloodType, setBloodType] = useState(user.bloodType || 'O+');
  const [emergencyContact, setEmergencyContact] = useState(user.emergencyContact);
  const [emergencyPhone, setEmergencyPhone] = useState(user.emergencyPhone);
  const [emergencyRel, setEmergencyRel] = useState(user.emergencyRel);

  // Login form state
  const [loginCedula, setLoginCedula] = useState('');
  const [loginPhone, setLoginPhone] = useState('');

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    updateUser({
      name,
      cedula,
      phone,
      bloodType,
      emergencyContact,
      emergencyPhone,
      emergencyRel,
      isLoggedIn: true
    });
    setCurrentView('home');
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    loginUser(loginCedula, loginPhone);
  };

  return (
    <div className="auth-page-wrap">
      <div className="auth-card animate-pop">
        
        {/* Header Tabs */}
        <div className="auth-tabs-row">
          <button 
            type="button"
            className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
            onClick={() => setMode('register')}
          >
            Ficha de Senderista
          </button>
          <button 
            type="button"
            className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => setMode('login')}
          >
            Ingresar con Cédula
          </button>
        </div>

        {mode === 'register' ? (
          <form onSubmit={handleRegisterSubmit} className="auth-form-body">
            <div className="auth-heading">
              <h3>Ficha Preventiva Oficial</h3>
              <p>Datos requeridos por INPARQUES para rescate y control de senderistas.</p>
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="reg-name">Nombre y Apellido:</label>
              <input 
                id="reg-name"
                type="text" 
                required 
                className="styled-input" 
                placeholder="Ej: Alejandro Mendoza"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>

            <div className="form-row-two">
              <div className="input-group">
                <label className="input-label" htmlFor="reg-cedula">Cédula de Identidad:</label>
                <input 
                  id="reg-cedula"
                  type="text" 
                  required 
                  className="styled-input" 
                  placeholder="V-20.458.120"
                  value={cedula}
                  onChange={e => setCedula(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label className="input-label" htmlFor="reg-blood">Tipo de Sangre:</label>
                <select 
                  id="reg-blood"
                  className="styled-input"
                  value={bloodType}
                  onChange={e => setBloodType(e.target.value)}
                >
                  <option value="O+">O Positivo (O+)</option>
                  <option value="O-">O Negativo (O-)</option>
                  <option value="A+">A Positivo (A+)</option>
                  <option value="A-">A Negativo (A-)</option>
                  <option value="B+">B Positivo (B+)</option>
                  <option value="B-">B Negativo (B-)</option>
                  <option value="AB+">AB Positivo (AB+)</option>
                  <option value="AB-">AB Negativo (AB-)</option>
                </select>
              </div>
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="reg-phone">Teléfono Móvil (WhatsApp):</label>
              <input 
                id="reg-phone"
                type="tel" 
                required 
                className="styled-input" 
                placeholder="+58 414 302 1948"
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
            </div>

            <div className="emergency-fieldset">
              <div className="ef-title">
                <Heart size={15} className="text-red" />
                <span>Contacto de Emergencia en Caso de Extravío:</span>
              </div>

              <div className="form-row-two">
                <div className="input-group">
                  <label className="input-label" htmlFor="em-name">Nombre del Familiar:</label>
                  <input 
                    id="em-name"
                    type="text" 
                    required 
                    className="styled-input" 
                    placeholder="Ej: María Elena Mendoza"
                    value={emergencyContact}
                    onChange={e => setEmergencyContact(e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <label className="input-label" htmlFor="em-rel">Parentesco:</label>
                  <input 
                    id="em-rel"
                    type="text" 
                    required 
                    className="styled-input" 
                    placeholder="Hermana, Padre, Esposa..."
                    value={emergencyRel}
                    onChange={e => setEmergencyRel(e.target.value)}
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label" htmlFor="em-phone">Teléfono de Emergencia:</label>
                <input 
                  id="em-phone"
                  type="tel" 
                  required 
                  className="styled-input" 
                  placeholder="+58 414 302 1948"
                  value={emergencyPhone}
                  onChange={e => setEmergencyPhone(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="btn-primary-large btn-glow w-full">
              <span>Guardar Ficha e Ingresar</span>
              <ArrowRight size={18} />
            </button>
          </form>
        ) : (
          <form onSubmit={handleLoginSubmit} className="auth-form-body">
            <div className="auth-heading">
              <h3>Ingreso a Ávila Pass</h3>
              <p>Coloca tu cédula y teléfono para recuperar tu perfil.</p>
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="login-id">Cédula de Identidad:</label>
              <input 
                id="login-id"
                type="text" 
                required 
                className="styled-input" 
                placeholder="V-20.458.120"
                value={loginCedula}
                onChange={e => setLoginCedula(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="login-tel">Teléfono Registrado:</label>
              <input 
                id="login-tel"
                type="tel" 
                required 
                className="styled-input" 
                placeholder="+58 414 302 1948"
                value={loginPhone}
                onChange={e => setLoginPhone(e.target.value)}
              />
            </div>

            <button type="submit" className="btn-primary-large btn-glow w-full">
              <span>Ingresar al Sistema</span>
              <ArrowRight size={18} />
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
