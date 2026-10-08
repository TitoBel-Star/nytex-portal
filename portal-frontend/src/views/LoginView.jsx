import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginView = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [role, setRole] = useState('Partner');
  const [clientPhase, setClientPhase] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      if (role === 'Client') {
        localStorage.setItem('nytex_active_phase', clientPhase.toString());
      }
      await login(role);
    } catch (err) {
      console.warn('Login error caught, navigating anyway:', err);
    } finally {
      if (role === 'Client') {
        navigate(`/app/workspace?phase=${clientPhase}`);
      } else {
        navigate('/portal');
      }
    }
  };

  return (
    <div className="h-screen w-screen bg-nytex-background flex items-center justify-center p-4">
      {/* Login Window Container */}
      <div className="bg-nytex-white shadow-2xl rounded-sm overflow-hidden flex flex-col w-[720px] border border-nytex-silver">
        
        {/* Window Title Bar */}
        <div className="bg-gradient-to-b from-nytex-navy to-nytex-navy-dark text-nytex-white px-3 py-1.5 text-sm font-semibold flex items-center justify-between shadow-inner tracking-wide">
          <div className="flex items-center gap-2">
            <span>💻</span>
            <span>NyTEX ERP - Simulador de Roles</span>
          </div>
          <span className="text-[10px] bg-cyan-400 text-slate-950 font-black px-2 py-0.2 rounded uppercase">
            Ambiente de Pruebas
          </span>
        </div>
        
        {/* Cyan Accent Bar */}
        <div className="h-1 bg-nytex-cyan w-full"></div>

        {/* Window Content */}
        <div className="flex flex-col sm:flex-row flex-1 p-1">
          {/* Left Side Image / Info */}
          <div className="sm:w-1/3 flex-shrink-0 p-4 border border-nytex-border bg-nytex-navy-dark flex flex-col items-center justify-center text-center text-white">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-3xl mb-3 shadow-inner">
              🔐
            </div>
            <h3 className="font-bold text-base mb-1.5">Simulador de Accesos</h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Seleccione el rol con el que desea interactuar para comprobar cómo la plataforma adapta los módulos y permisos en tiempo real.
            </p>
          </div>

          {/* Right Side Login Form */}
          <div className="sm:w-2/3 p-6 sm:p-8 flex flex-col justify-center bg-[#F9F9F9]">
            <h2 className="text-2xl font-bold text-nytex-navy mb-1">Bienvenido a NyTEX ERP</h2>
            <p className="text-xs text-gray-500 mb-6">Seleccione su perfil de acceso para ingresar al sistema.</p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-nytex-navy uppercase mb-1.5">
                  Simular Iniciar Sesión como:
                </label>
                <select 
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2.5 border border-nytex-border rounded-lg bg-white text-xs font-semibold text-gray-800 focus:outline-none focus:border-nytex-blue focus:ring-1 focus:ring-nytex-blue shadow-sm"
                >
                  <option value="Admin">1. Administrador (Acceso total a los 26 módulos y configuración)</option>
                  <option value="Partner">2. Partner / Consultor (Acceso a implementación y ecosistema)</option>
                  <option value="Client">3. Cliente Final (Acceso a los módulos contratados de su Fase)</option>
                </select>
              </div>

              {role === 'Client' && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg animate-fade-in">
                  <label className="block text-[11px] font-bold text-blue-950 uppercase mb-1">
                    Fase Contratada por el Cliente:
                  </label>
                  <select
                    value={clientPhase}
                    onChange={(e) => setClientPhase(parseInt(e.target.value, 10))}
                    className="w-full px-2.5 py-1.5 border border-blue-300 rounded bg-white text-xs font-bold text-blue-900 focus:outline-none"
                  >
                    <option value={1}>Fase 1: Starter (7 Módulos Núcleo)</option>
                    <option value={2}>Fase 2: Express (17 Módulos)</option>
                    <option value={3}>Fase 3: Advanced (22 Módulos)</option>
                    <option value={4}>Fase 4: Enterprise (27 Módulos Completos)</option>
                  </select>
                  <p className="text-[10px] text-blue-700 mt-1.5">
                    Entrará directamente a su <strong>Espacio de Trabajo (Workspace)</strong> con las pestañas de los módulos correspondientes.
                  </p>
                </div>
              )}

              <div className="pt-2 flex items-center justify-between">
                <button 
                  type="submit" 
                  disabled={submitting}
                  className={`px-6 py-3 bg-nytex-blue hover:bg-nytex-blue-light text-white font-black text-sm rounded-lg shadow-md transition-all w-full flex items-center justify-center gap-2 ${
                    submitting ? 'opacity-80 cursor-wait' : 'hover:shadow-lg'
                  }`}
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Entrando al Portal...
                    </>
                  ) : (
                    <span>Entrar como {role === 'Admin' ? 'Administrador' : role === 'Partner' ? 'Partner' : `Cliente (Fase ${clientPhase})`} ➔</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
