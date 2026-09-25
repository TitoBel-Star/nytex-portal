import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginView = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [role, setRole] = useState('Partner');

  const handleLogin = async (e) => {
    e.preventDefault();
    await login(role);
    navigate('/portal');
  };

  return (
    <div className="h-screen w-screen bg-nytex-background flex items-center justify-center p-4">
      {/* Login Window Container */}
      <div className="bg-nytex-white shadow-2xl rounded-sm overflow-hidden flex flex-col w-[700px] border border-nytex-silver">
        
        {/* Window Title Bar */}
        <div className="bg-gradient-to-b from-nytex-navy to-nytex-navy-dark text-nytex-white px-3 py-1.5 text-sm font-semibold flex items-center shadow-inner tracking-wide">
          NyTEX ERP - Simulador de Roles
        </div>
        
        {/* Cyan Accent Bar */}
        <div className="h-1 bg-nytex-cyan w-full"></div>

        {/* Window Content */}
        <div className="flex flex-row flex-1 p-1">
          {/* Left Side Image */}
          <div className="w-1/3 flex-shrink-0 p-1 border border-nytex-border bg-nytex-navy-dark flex items-center justify-center text-center">
             <div className="text-white p-4">
               <h3 className="font-bold text-lg mb-2">Simulador de Accesos</h3>
               <p className="text-xs text-gray-300">Selecciona el tipo de usuario para ver cómo el sistema se adapta automáticamente ocultando módulos no autorizados.</p>
             </div>
          </div>

          {/* Right Side Login Form */}
          <div className="w-2/3 p-8 flex flex-col justify-center bg-[#F9F9F9]">
            <h2 className="text-2xl font-bold text-nytex-navy mb-1">Bienvenido a NyTEX</h2>
            <p className="text-sm text-nytex-text mb-6">Inicie sesión para acceder a su portal empresarial.</p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-nytex-navy uppercase mb-1">Simular Iniciar Sesión como:</label>
                <select 
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 border border-nytex-border rounded bg-white text-sm focus:outline-none focus:border-nytex-blue focus:ring-1 focus:ring-nytex-blue"
                >
                  <option value="Admin">1. Administrador NyTEX (Ve todo el ecosistema)</option>
                  <option value="Partner">2. Partner / Distribuidor (Ve su propio portal y clientes)</option>
                  <option value="Client">3. Cliente Final (Solo ve sus apps operativas básicas)</option>
                </select>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button 
                  type="submit"
                  className="px-6 py-2 bg-nytex-blue hover:bg-nytex-blue-light text-nytex-white font-bold rounded shadow-md transition-colors w-full"
                >
                  Entrar
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
