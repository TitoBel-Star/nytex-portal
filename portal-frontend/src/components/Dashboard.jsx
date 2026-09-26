import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PaymentSimulatorModal from './PaymentSimulatorModal';
import NytexEcosistemaDiagram from './NytexEcosistemaDiagram';

const modulesList = [
  { id: 'Ventas', name: 'NyTEX Ventas', description: 'Gestión de ventas y facturación.' },
  { id: 'CRM', name: 'NyTEX CRM', description: 'Gestión de relaciones con los clientes.' },
  { id: 'Inventario', name: 'NyTEX Inventario', description: 'Control de stock y almacén.' },
  { id: 'Compras', name: 'NyTEX Compras', description: 'Gestión de proveedores y compras.' },
  { id: 'Produccion', name: 'NyTEX Producción', description: 'Control de procesos de manufactura.' },
  { id: 'Contabilidad', name: 'NyTEX Contabilidad', description: 'Gestión contable financiera.' },
  { id: 'CxC', name: 'NyTEX Cuentas por Cobrar (CxC)', description: 'Gestión de cuentas por cobrar.' },
  { id: 'CxP', name: 'NyTEX Cuentas por Pagar (CxP)', description: 'Gestión de cuentas por pagar.' },
  { id: 'Tesoreria', name: 'NyTEX Tesorería', description: 'Control de flujo de caja y bancos.' },
  { id: 'ActivosFijos', name: 'NyTEX Activos Fijos', description: 'Control de bienes de la empresa.' },
  { id: 'Logistica', name: 'NyTEX Logística', description: 'Gestión de despachos y distribución.' },
  { id: 'RRHH', name: 'NyTEX RRHH', description: 'Gestión de recursos humanos.' },
  { id: 'Nomina', name: 'NyTEX Nómina', description: 'Cálculo y pago de planillas.' },
  { id: 'ProcessSuite', name: 'NyTEX Process Suite', description: 'Automatización de procesos.' },
  { id: 'ProcessMining', name: 'NyTEX Process Mining', description: 'Minería de procesos operativos y flujos.' },
  { id: 'BusinessPartners', name: 'NyTEX Business Partners', description: 'Gestión de socios de negocio.' },
  { id: 'BIyReportes', name: 'NyTEX BI y Reportes', description: 'Inteligencia de negocios y analítica.' },
  { id: 'Configuracion', name: 'NyTEX Configuración', description: 'Ajustes globales del sistema.' },
  { id: 'WMS', name: 'NyTEX WMS', description: 'Sistema de gestión de almacenes avanzado.' },
  { id: 'Dashboards', name: 'NyTEX Dashboards Operativos', description: 'Visualización de métricas en tiempo real.' },
  { id: 'BI', name: 'NyTEX BI', description: 'Business Intelligence avanzado.' },
  { id: 'BigData', name: 'NyTEX Big Data', description: 'Procesamiento de grandes volúmenes de datos.' },
  { id: 'MineriaDatos', name: 'NyTEX Minería de Datos', description: 'Descubrimiento de patrones y minería masiva.' },
  { id: 'IA', name: 'NyTEX IA', description: 'Inteligencia artificial aplicada a negocios.' },
  { id: 'Predictivos', name: 'NyTEX Modelos Predictivos', description: 'Análisis y proyecciones a futuro.' },
  { id: 'Planeacion', name: 'NyTEX Planeación', description: 'Planificación estratégica y operativa.' }
];

const phases = [
  {
    id: 1,
    name: 'Fase 1: NyTEX Starter',
    subtitle: 'Visibilidad Básica',
    moduleCount: '1 MÓDULO:',
    modulesText: 'Ventas',
    modulesArray: ['Ventas'],
    imp: '$0 USD',
    lic: '$35 USD / mes'
  },
  {
    id: 2,
    name: 'Fase 2: NyTEX Express',
    subtitle: 'Control Transaccional',
    moduleCount: '6 MÓDULOS:',
    modulesText: 'Ventas, Inventario, Contabilidad, CxC, CxP, Compras',
    modulesArray: ['Ventas', 'Inventario', 'Contabilidad', 'CxC', 'CxP', 'Compras'],
    imp: '$1,500 USD',
    lic: '$149 USD / mes'
  },
  {
    id: 3,
    name: 'Fase 3: NyTEX Advanced',
    subtitle: 'Eficiencia Operacional',
    moduleCount: '9 MÓDULOS:',
    modulesText: 'Incluye Fase 2 + Logística, CRM Básico, Recursos Humanos',
    modulesArray: ['Ventas', 'Inventario', 'Contabilidad', 'CxC', 'CxP', 'Compras', 'Logistica', 'CRM', 'RRHH'],
    imp: '$4,500 USD',
    lic: '$299 USD / mes'
  },
  {
    id: 4,
    name: 'Fase 4: NyTEX Enterprise',
    subtitle: 'Dirección Estratégica',
    moduleCount: '26 MÓDULOS:',
    modulesText: 'Todo el Ecosistema: BI, Big Data, IA, Minería, Process Suite, Process Mining, Partners y más',
    modulesArray: modulesList.map(m => m.id),
    imp: 'Cotización a Medida',
    lic: '$499 USD / mes'
  }
];

export default function Dashboard() {
  const { user, login } = useAuth();
  const location = useLocation();

  const safeUser = user || {
    email: 'demo@consultores-nyt.com',
    subscriptions: modulesList.map(m => m.id),
    customQuoteAmount: null
  };

  const [activePhase, setActivePhase] = useState(null);
  const [customModules, setCustomModules] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPhaseForPayment, setSelectedPhaseForPayment] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const phaseParam = params.get('phase');
    if (phaseParam) {
      const pId = parseInt(phaseParam, 10);
      if (pId >= 1 && pId <= 4) {
        setActivePhase(pId);
      } else if (phaseParam === 'custom') {
        setActivePhase('custom');
      }
    }
  }, [location]);

  const handleToggleModule = (modId) => {
    setCustomModules(prev => 
      prev.includes(modId) ? prev.filter(id => id !== modId) : [...prev, modId]
    );
  };

  const getHighlightedModules = () => {
    if (activePhase === 'custom') {
      return customModules;
    }
    if (activePhase) {
      const phase = phases.find(p => p.id === activePhase);
      return phase ? phase.modulesArray : [];
    }
    return [];
  };

  const highlightedModules = getHighlightedModules();
  const hasActivePhase = highlightedModules.length > 0;

  const handleContratar = (phaseId, phaseModules) => {
    if (phaseId === 4 && !safeUser.customQuoteAmount) {
      alert("Su cotización está siendo calculada por nuestro equipo de ventas. Le contactaremos en breve o use el panel de pruebas abajo para simular una cotización.");
      return;
    }

    let amount = 0;
    let title = "";

    if (phaseId === 1) { amount = 0; title = "Fase 1: NyTEX Starter"; }
    else if (phaseId === 2) { amount = 1500; title = "Fase 2: NyTEX Express"; }
    else if (phaseId === 3) { amount = 4500; title = "Fase 3: NyTEX Advanced"; }
    else if (phaseId === 4) { 
      amount = safeUser.customQuoteAmount || 0; 
      title = "Fase 4: NyTEX Enterprise"; 
    }
    else if (phaseId === 'custom') {
      amount = customModules.length * 400;
      title = `Plan a su medida (${customModules.length} Módulos)`;
    }

    setSelectedPhaseForPayment({
      phaseId,
      title,
      amount,
      modules: phaseModules
    });
    setIsModalOpen(true);
  };

  const handlePaymentSuccess = (newSubscriptions) => {
    if (login) {
      login({
        ...safeUser,
        subscriptions: newSubscriptions
      });
    }
    alert("¡Pago exitoso! Sus módulos han sido activados.");
  };

  return (
    <div className="min-h-screen bg-[var(--nytex-background)] p-8 relative">
      {/* Background Graphic */}
      <div 
        className="absolute inset-0 z-0 opacity-5 pointer-events-none" 
        style={{
          backgroundImage: 'radial-gradient(circle at 15% 50%, var(--nytex-navy) 0%, transparent 25%), radial-gradient(circle at 85% 30%, var(--nytex-cyan) 0%, transparent 25%)',
        }}
      />

      <div className="max-w-[1600px] mx-auto relative z-10">
        
        {/* Banner Cotización Pendiente */}
        {safeUser.customQuoteAmount && (
          <div className="mb-8 p-4 bg-gradient-to-r from-purple-900 to-indigo-900 border border-purple-500 rounded-xl flex justify-between items-center text-white shadow-lg">
            <div>
              <h3 className="font-bold text-lg text-purple-200">¡Tiene una cotización personalizada lista!</h3>
              <p className="text-sm text-gray-300">Monto aprobado para Fase 4: <strong>${safeUser.customQuoteAmount.toLocaleString()} USD</strong></p>
            </div>
            <button 
              onClick={() => handleContratar(4, phases[3].modulesArray)}
              className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-6 rounded-lg shadow transition-colors"
            >
              Pagar e Implementar Ahora
            </button>
          </div>
        )}

        {/* Sección: Propuesta de Implementación */}
        <div className="mb-12">
          <h2 className="text-3xl font-extrabold text-[var(--nytex-navy)] text-center mb-8">
            Propuesta de Implementación
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            
            {/* 4 Fases Estándar */}
            {phases.map((phase) => (
              <div 
                key={phase.id} 
                className={`bg-[#2A114B] border rounded-xl p-5 transition-all flex flex-col text-white shadow-md ${
                  activePhase === phase.id ? 'border-amber-400 ring-2 ring-amber-400/50' : 'border-white/10 hover:border-white/30'
                }`}
              >
                <h3 className="text-xl font-bold mb-1">{phase.name}</h3>
                <p className="text-sm text-gray-300 mb-4">{phase.subtitle}</p>

                <div className="flex-grow mb-4">
                  <p className="text-amber-400 font-extrabold text-sm mb-1">{phase.moduleCount}</p>
                  <p className="text-xs text-gray-300 leading-relaxed">{phase.modulesText}</p>
                </div>

                <div className="border-t border-white/10 pt-4 mb-4">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">Implementación</p>
                  <p className="text-lg font-bold text-white mb-2">{phase.imp}</p>

                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">Licencia NyTEX</p>
                  <p className="text-sm font-bold text-amber-400">{phase.lic}</p>
                </div>

                {/* Botón Ver / Aplicaciones incluidas */}
                <button 
                  type="button"
                  onClick={() => setActivePhase(activePhase === phase.id ? null : phase.id)}
                  className={`w-full py-2 px-4 rounded text-sm font-bold transition-all border mb-2 ${
                    activePhase === phase.id 
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 border-amber-300 shadow-lg font-black' 
                      : 'bg-transparent border-[#4B2979] hover:bg-[#4B2979] text-white'
                  }`}
                >
                  {activePhase === phase.id ? 'Aplicaciones incluidas ↓' : 'Ver aplicaciones ↓'}
                </button>

                {/* Botón Contratar */}
                <button 
                  type="button"
                  onClick={() => handleContratar(phase.id, phase.modulesArray)}
                  className={`w-full py-2 px-4 rounded text-sm font-bold text-center shadow-lg transition-colors border block ${
                    phase.id === 4 && !safeUser.customQuoteAmount 
                    ? 'bg-purple-600 hover:bg-purple-700 text-white border-purple-600'
                    : 'bg-[#0070BA] hover:bg-[#005ea6] text-white border-transparent'
                  }`}
                >
                  {phase.id === 4 && !safeUser.customQuoteAmount ? 'SOLICITAR COTIZACIÓN' : 'CONTRATAR EN PORTAL'}
                </button>
              </div>
            ))}

            {/* Tarjeta: A su medida */}
            <div className={`bg-[#2A114B] border rounded-xl p-5 transition-all flex flex-col text-white shadow-md ${
              activePhase === 'custom' ? 'border-amber-400 ring-2 ring-amber-400/50' : 'border-white/10 hover:border-white/30'
            }`}>
              <h3 className="text-xl font-bold mb-1">A su medida</h3>
              <p className="text-sm text-gray-300 mb-2">Escoja sus módulos:</p>

              <div className="flex-grow overflow-y-auto max-h-40 border border-white/10 rounded p-2 mb-4 bg-black/20">
                {modulesList.map((mod) => (
                  <div key={mod.id} className="flex items-center mb-2">
                    <input 
                      type="checkbox" 
                      id={`chk-${mod.id}`}
                      checked={customModules.includes(mod.id)}
                      onChange={() => handleToggleModule(mod.id)}
                      className="mr-2 cursor-pointer"
                    />
                    <label htmlFor={`chk-${mod.id}`} className="cursor-pointer text-xs">{mod.name.replace('NyTEX ', '')}</label>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 pt-4 mb-4 flex justify-between">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">IMP.</p>
                  <p className="text-sm font-bold text-white">${customModules.length * 400}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">LIC.</p>
                  <p className="text-sm font-bold text-amber-400">${customModules.length * 20} <span className="text-[10px] text-gray-300">/ mes</span></p>
                </div>
              </div>

              {/* Botón Ver Aplicaciones A su Medida */}
              <button 
                type="button"
                onClick={() => setActivePhase(activePhase === 'custom' ? null : 'custom')}
                className={`w-full py-2 px-4 rounded text-sm font-bold transition-all border mb-2 ${
                  activePhase === 'custom' 
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 border-amber-300 shadow-lg font-black' 
                    : 'bg-transparent border-[#4B2979] hover:bg-[#4B2979] text-white'
                }`}
              >
                {activePhase === 'custom' ? 'Aplicaciones incluidas ↓' : 'Ver aplicaciones ↓'}
              </button>

              <button 
                type="button"
                disabled={customModules.length === 0}
                onClick={() => handleContratar('custom', customModules)}
                className={`w-full py-2 px-4 rounded text-sm font-bold text-center shadow-lg transition-colors border block ${
                  customModules.length === 0 
                    ? 'bg-gray-600 border-gray-600 cursor-not-allowed text-gray-400' 
                    : 'bg-[#0070BA] hover:bg-[#005ea6] text-white border-transparent'
                }`}
              >
                CONTRATAR EN PORTAL
              </button>
            </div>

          </div>
        </div>

        {/* DIAGRAMA OPERATIVO Y ÁREAS FUNCIONALES (Con Alumbrado Dinámico según la Fase elegida) */}
        <NytexEcosistemaDiagram highlightedModules={highlightedModules} />

        {/* Sección: Grid de 26 Módulos */}
        <div className="mb-8 text-center">
          <h3 className="text-2xl font-extrabold text-[var(--nytex-navy)]">
            Módulos y Aplicaciones del Sistema (26 Módulos)
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {hasActivePhase ? (
              <span className="text-amber-600 font-bold">
                ⭐ Mostrando en dorado vibrante las aplicaciones de la fase seleccionada.
              </span>
            ) : (
              'Haga clic en "Ver aplicaciones ↓" en cualquiera de las fases arriba para alumbrarlas en dorado.'
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {modulesList.map((mod) => {
            const isHighlighted = highlightedModules.includes(mod.id);

            return (
              <div 
                key={mod.id} 
                className={`relative bg-white rounded-xl overflow-hidden border transition-all duration-300 ${
                  isHighlighted 
                    ? 'border-amber-400 ring-4 ring-amber-400/90 shadow-[0_0_35px_rgba(245,158,11,0.7)] transform scale-105 z-20 opacity-100 bg-amber-50/30' 
                    : hasActivePhase 
                      ? 'border-[#15A36A]/40 shadow-sm opacity-55 z-0' 
                      : 'border-[#15A36A] shadow-md opacity-100 z-10'
                }`}
              >
                <div className="p-6 flex flex-col h-full">
                  <h3 className={`text-xl font-extrabold mb-2 transition-colors ${
                    isHighlighted ? 'text-amber-900 font-black' : 'text-[var(--nytex-navy)]'
                  }`}>
                    {mod.name}
                  </h3>
                  <p className="text-[var(--nytex-text)] mb-6 flex-grow">{mod.description}</p>
                  
                  <Link 
                    to={`/app/` + mod.id.toLowerCase()} 
                    className={`mt-auto block w-full text-center py-2 px-4 rounded-md font-bold transition-all shadow-lg ${
                      isHighlighted 
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-slate-950 font-black ring-2 ring-amber-400 ring-offset-2' 
                        : 'bg-[#15A36A] text-white hover:bg-[#108253]'
                    }`}
                  >
                    Abrir Módulo
                  </Link>
                </div>

                {/* Badge: En dorado cuando está seleccionada en fase, o verde normal cuando no hay filtro */}
                <div className={`absolute top-0 right-0 px-3 py-1 text-xs font-extrabold rounded-bl-lg shadow-sm transition-all ${
                  isHighlighted 
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black shadow-md' 
                    : 'bg-[#15A36A] text-white'
                }`}>
                  {isHighlighted ? '⭐ SELECCIONADO EN FASE' : 'ADQUIRIDO'}
                </div>
              </div>
            );
          })}
        </div>
        
        <PaymentSimulatorModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          phaseInfo={selectedPhaseForPayment} 
          onSuccess={handlePaymentSuccess}
        />

        {/* Mini Admin Panel para Pruebas */}
        <div className="fixed bottom-2 right-2 bg-white p-2 text-xs border rounded shadow-md z-50 text-gray-500 opacity-50 hover:opacity-100 transition-opacity">
          <p className="font-bold mb-1 border-b pb-1">Test Admin</p>
          <button 
            onClick={async () => {
              const amount = prompt("Ingresa el monto de la cotización (ej: 8500):", "8500");
              if (amount) {
                await fetch('/api/admin/set-quote', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ email: 'demo@consultores-nyt.com', amount: parseInt(amount, 10) })
                });
                alert('Cotización subida. Recarga la página.');
                window.location.reload();
              }
            }}
            className="bg-purple-600 text-white px-2 py-1 rounded"
          >
            Simular Subir Cotización
          </button>
        </div>

      </div>
    </div>
  );
}
