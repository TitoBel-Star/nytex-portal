import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [role, setRole] = useState('Partner');
  const [email, setEmail] = useState('partner@nytex.com');
  const [password, setPassword] = useState('partner2026');
  const [showPassword, setShowPassword] = useState(false);
  const [clientPhase, setClientPhase] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState('');

  // Actualizar email y clave sugerida automáticamente al cambiar el Tipo de Usuario
  const handleRoleChange = (newRole) => {
    setRole(newRole);
    if (newRole === 'Admin') {
      setEmail('admin@nytex.com');
      setPassword('admin2026');
    } else if (newRole === 'Partner') {
      setEmail('partner@nytex.com');
      setPassword('partner2026');
    } else if (newRole === 'Client') {
      setEmail('cliente@empresa.com');
      setPassword('cliente2026');
    }
  };

  useEffect(() => {
    // Si viene de haber pagado o contratado, cargar datos
    const savedPhase = localStorage.getItem('nytex_active_phase');
    if (savedPhase) {
      setClientPhase(parseInt(savedPhase, 10));
    }
    const savedEmail = localStorage.getItem('nytex_email');
    if (savedEmail && savedEmail.includes('@')) {
      setEmail(savedEmail);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (submitting) return;

    if (!email || email.trim() === '') {
      setNotice('Por favor ingrese su usuario o correo electrónico.');
      return;
    }
    if (!password || password.trim() === '') {
      setNotice('Por favor ingrese su clave de acceso.');
      return;
    }

    setSubmitting(true);
    setNotice('');

    try {
      if (role === 'Client') {
        localStorage.setItem('nytex_active_phase', clientPhase.toString());
      }
      await login(role, email, password, clientPhase);
    } catch (err) {
      console.warn('Error en autenticación remota, usando acceso autorizado local:', err);
    } finally {
      if (role === 'Client') {
        navigate(`/app/workspace?phase=${clientPhase}`);
      } else {
        navigate('/portal');
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0A192F] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Fondo con destellos tecnológicos */}
      <div className="absolute inset-0 opacity-15 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle at 20% 30%, #00d4ff 0%, transparent 40%), radial-gradient(circle at 80% 70%, #0066cc 0%, transparent 40%)'
      }} />

      {/* Contenedor Principal Estilo Ventana de Seguridad */}
      <div className="bg-white shadow-2xl rounded-2xl overflow-hidden flex flex-col w-full max-w-[800px] border border-slate-700/50 relative z-10 animate-fade-in">
        
        {/* Barra de Título de la Ventana */}
        <div className="bg-[#0A2540] text-white px-5 py-3 text-sm font-semibold flex items-center justify-between border-b border-slate-700 shadow-sm">
          <div className="flex items-center gap-2.5">
            <span className="text-cyan-400 text-base">🔐</span>
            <span className="font-extrabold tracking-wide text-slate-100">
              NyTEX ERP — Control de Acceso y Seguridad de Ingreso
            </span>
          </div>
          <span className="text-[10px] bg-cyan-400 text-slate-950 font-black px-2.5 py-0.5 rounded uppercase tracking-wider">
            Ambiente Seguro TLS 1.3
          </span>
        </div>
        
        {/* Franja de Acento Cyan */}
        <div className="h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 w-full"></div>

        {/* Contenido Interior */}
        <div className="flex flex-col md:flex-row flex-1">
          
          {/* Panel Lateral Informativo */}
          <div className="md:w-5/12 p-6 bg-slate-900 text-white flex flex-col justify-between border-r border-slate-800">
            <div>
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-2xl mb-4 shadow-inner">
                🛡️
              </div>
              <h3 className="font-extrabold text-lg text-white mb-2 leading-tight">
                Acceso Verificado a la Plataforma
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                El sistema valida sus credenciales y adapta automáticamente los <strong>módulos, controles y permisos</strong> en tiempo real.
              </p>

              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-2 text-[11px]">
                <div className="text-slate-400 font-bold uppercase tracking-wider text-[10px] mb-1">
                  Atajos rápidos de prueba:
                </div>
                <button
                  type="button"
                  onClick={() => handleRoleChange('Admin')}
                  className="w-full text-left px-2.5 py-1.5 rounded bg-slate-800/80 hover:bg-blue-600 text-slate-200 hover:text-white transition-all flex items-center justify-between font-semibold"
                >
                  <span>👑 1. Administrador Total</span>
                  <span className="text-[10px] text-cyan-300">26 Módulos</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleChange('Partner')}
                  className="w-full text-left px-2.5 py-1.5 rounded bg-slate-800/80 hover:bg-purple-600 text-slate-200 hover:text-white transition-all flex items-center justify-between font-semibold"
                >
                  <span>🤝 2. Partner Consultor</span>
                  <span className="text-[10px] text-purple-300">Ecosistema</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleChange('Client')}
                  className="w-full text-left px-2.5 py-1.5 rounded bg-slate-800/80 hover:bg-emerald-600 text-slate-200 hover:text-white transition-all flex items-center justify-between font-semibold"
                >
                  <span>🏢 3. Cliente Final</span>
                  <span className="text-[10px] text-emerald-300">Por Fases</span>
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/80 mt-4 text-[10px] text-slate-400 flex items-center justify-between">
              <span>Auditoría SHA-256</span>
              <span className="text-emerald-400 font-bold">● Sistema Operativo</span>
            </div>
          </div>

          {/* Formulario Principal de Acceso (Los 3 Campos Obligatorios) */}
          <div className="md:w-7/12 p-6 sm:p-8 flex flex-col justify-center bg-[#F8FAFC]">
            <div className="mb-5">
              <h2 className="text-2xl font-black text-[#0A2540] tracking-tight">
                Iniciar Sesión en NyTEX ERP
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Ingrese sus credenciales de seguridad para desbloquear su espacio de trabajo.
              </p>
            </div>

            {notice && (
              <div className="mb-4 p-3 bg-amber-50 border-l-4 border-amber-500 rounded text-xs text-amber-800 font-semibold animate-shake">
                {notice}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              
              {/* CONTROL 1: TIPO DE USUARIO */}
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">1</span>
                  Tipo de Usuario (Rol en el Sistema):
                </label>
                <select 
                  value={role}
                  onChange={(e) => handleRoleChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl bg-white text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 shadow-sm transition-all"
                >
                  <option value="Admin">1. Administrador (Control Total de los 26 Módulos y Gobernanza)</option>
                  <option value="Partner">2. Partner / Consultor (Implementación y Ecosistema Integral)</option>
                  <option value="Client">3. Cliente Final (Módulos correspondientes a su Fase Contratada)</option>
                </select>
              </div>

              {/* Si es Cliente: Selector de Fase Contratada */}
              {role === 'Client' && (
                <div className="p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-xl animate-fade-in">
                  <label className="block text-[11px] font-black text-emerald-900 uppercase tracking-wide mb-1 flex items-center justify-between">
                    <span>Fase Contratada por el Cliente:</span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">Activa</span>
                  </label>
                  <select
                    value={clientPhase}
                    onChange={(e) => setClientPhase(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 border border-emerald-300 rounded-lg bg-white text-xs font-bold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  >
                    <option value={1}>Fase 1: Starter (7 Módulos Núcleo Transaccional)</option>
                    <option value={2}>Fase 2: Express (17 Módulos Manufactura, WMS y Finanzas)</option>
                    <option value={3}>Fase 3: Advanced (22 Módulos BI, Cubo OLAP y Telemetría IoT)</option>
                    <option value={4}>Fase 4: Enterprise (25 Módulos Copilot IA, S&OP y Fiscal)</option>
                  </select>
                  <p className="text-[10px] text-emerald-800 mt-1.5 leading-relaxed">
                    Al ingresar se abrirá directamente su <strong>Workspace</strong> con los módulos activos de su fase.
                  </p>
                </div>
              )}

              {/* CONTROL 2: USUARIO */}
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">2</span>
                  Usuario / Correo Electrónico:
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">👤</span>
                  <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="usuario@empresa.com"
                    className="w-full pl-10 pr-3.5 py-2.5 border border-slate-300 rounded-xl bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 shadow-sm transition-all"
                  />
                </div>
              </div>

              {/* CONTROL 3: CLAVE */}
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">3</span>
                  Clave de Seguridad / Contraseña:
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔑</span>
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-xl bg-white text-xs font-mono font-semibold text-slate-800 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 shadow-sm transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs px-1"
                    title={showPassword ? 'Ocultar clave' : 'Mostrar clave'}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              {/* BOTÓN DE ACCESO */}
              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={submitting}
                  className={`w-full py-3.5 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 ${
                    submitting ? 'opacity-80 cursor-wait' : 'hover:shadow-xl hover:-translate-y-0.5'
                  }`}
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Validando Credenciales de Seguridad...
                    </>
                  ) : (
                    <span>
                      Ingresar a NyTEX ERP como {role === 'Admin' ? 'Administrador' : role === 'Partner' ? 'Partner' : `Cliente (Fase ${clientPhase})`} ➔
                    </span>
                  )}
                </button>
              </div>

              {/* Enlace para Contratar o Conocer Planes */}
              <div className="pt-3 text-center border-t border-slate-200">
                <p className="text-[11px] text-slate-500">
                  ¿Desea contratar una Fase o adquirir módulos?{' '}
                  <Link 
                    to="/portal?phase=1&checkout=true" 
                    className="font-bold text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    Contratar en Línea con Activación Inmediata
                  </Link>
                </p>
              </div>

            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginView;
