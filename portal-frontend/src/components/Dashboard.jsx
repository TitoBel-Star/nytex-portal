import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PaymentSimulatorModal from './PaymentSimulatorModal';
import NytexEcosistemaDiagram, { AREAS_CONFIG } from './NytexEcosistemaDiagram';
import ModeloTransformacionNyt from './ModeloTransformacionNyt';
import NytexVideoCard from './NytexVideoCard';
import ComoTrabajamosConUsted from './ComoTrabajamosConUsted';

const modulesList = [
  { id: 'Ventas', name: 'NyTEX Ventas', description: 'Gestión de ventas y facturación.' },
  { id: 'CRM', name: 'NyTEX CRM', description: 'Gestión de relaciones con los clientes.' },
  { id: 'Inventario', name: 'NyTEX Inventario', description: 'Control de stock y almacén.' },
  { id: 'Compras', name: 'NyTEX Compras', description: 'Gestión de proveedores y compras.' },
  { id: 'Rop', name: 'NyTEX Reabastecimiento ROP Inteligente', description: 'Cálculo dinámico de punto de reorden (ROP), stock de seguridad y control de pedidos.' },
  { id: 'Produccion', name: 'NyTEX Producción', description: 'Control de procesos de manufactura.' },
  { id: 'Contabilidad', name: 'NyTEX Contabilidad', description: 'Gestión contable financiera.' },
  { id: 'CxC', name: 'NyTEX Cuentas por Cobrar (CxC)', description: 'Gestión de cuentas por cobrar.' },
  { id: 'CxP', name: 'NyTEX Cuentas por Pagar (CxP)', description: 'Gestión de cuentas por pagar.' },
  { id: 'Tesoreria', name: 'NyTEX Tesorería', description: 'Control de flujo de caja y bancos.' },
  { id: 'Logistica', name: 'NyTEX Logística', description: 'Gestión de despachos y distribución.' },
  { id: 'RRHH', name: 'NyTEX RRHH', description: 'Gestión de recursos humanos.' },
  { id: 'Nomina', name: 'NyTEX Nómina', description: 'Cálculo y pago de planillas.' },
  { id: 'ProcessSuite', name: 'NyTEX Process Suite', description: 'Reglas de negocio y flujos automatizados.' },
  { id: 'ProcessMining', name: 'NyTEX Process Mining', description: 'Auditoría de logs y cuellos de botella.' },
  { id: 'BusinessPartners', name: 'NyTEX Business Partners', description: 'Ficha única de clientes y proveedores.' },
  { id: 'BIyReportes', name: 'NyTEX BI y Reportes', description: 'Inteligencia de negocios y analítica.' },
  { id: 'Configuracion', name: 'NyTEX Configuración', description: 'Seguridad RBAC, multi-empresa y APIs.' },
  { id: 'WMS', name: 'NyTEX WMS', description: 'Racks, picking RF y control FEFO.' },
  { id: 'Dashboards', name: 'NyTEX Dashboards Operativos', description: 'Visualización de métricas en tiempo real.' },
  { id: 'BigData', name: 'NyTEX Big Data', description: 'Procesamiento de grandes volúmenes de datos.' },
  { id: 'MineriaDatos', name: 'NyTEX Minería de Datos', description: 'Descubrimiento de patrones y minería masiva.' },
  { id: 'IA', name: 'NyTEX IA', description: 'Inteligencia artificial aplicada a negocios.' },
  { id: 'Predictivos', name: 'NyTEX Modelos Predictivos', description: 'Series de tiempo y proyecciones a futuro.' },
  { id: 'Planeacion', name: 'NyTEX Planeación', description: 'Planificación S&OP y presupuestos.' }
];

const phases = [
  {
    id: 1,
    name: 'Fase 1: NyTEX Starter',
    subtitle: 'Control Transaccional',
    moduleCount: '7 MÓDULOS:',
    modulesText: 'Ventas, Inventario, Compras, Contabilidad, CxC, CxP, Tesorería',
    modulesArray: ['Ventas', 'Inventario', 'Compras', 'Contabilidad', 'CxC', 'CxP', 'Tesoreria'],
    imp: '$0 USD',
    lic: '$35 USD / mes'
  },
  {
    id: 2,
    name: 'Fase 2: NyTEX Express',
    subtitle: 'Productividad y Flujo',
    moduleCount: '17 MÓDULOS:',
    modulesText: 'Incluye Fase 1 + CRM, ROP Inteligente, WMS, Logística, Producción, RRHH, Nómina, Dashboards, Process Suite, Process Mining',
    modulesArray: ['Ventas', 'Inventario', 'Compras', 'Contabilidad', 'CxC', 'CxP', 'Tesoreria', 'CRM', 'Rop', 'WMS', 'Logistica', 'Produccion', 'RRHH', 'Nomina', 'Dashboards', 'ProcessSuite', 'ProcessMining'],
    imp: '$1,500 USD',
    lic: '$149 USD / mes'
  },
  {
    id: 3,
    name: 'Fase 3: NyTEX Advanced',
    subtitle: 'Inteligencia y Rentabilidad',
    moduleCount: '20 MÓDULOS:',
    modulesText: 'Incluye Fase 2 + BI y Reportes, Big Data, Planeación',
    modulesArray: ['Ventas', 'Inventario', 'Compras', 'Contabilidad', 'CxC', 'CxP', 'Tesoreria', 'CRM', 'Rop', 'WMS', 'Logistica', 'Produccion', 'RRHH', 'Nomina', 'Dashboards', 'ProcessSuite', 'ProcessMining', 'BIyReportes', 'BigData', 'Planeacion'],
    imp: '$4,500 USD',
    lic: '$299 USD / mes'
  },
  {
    id: 4,
    name: 'Fase 4: NyTEX Enterprise',
    subtitle: 'Anticipación y Escala',
    moduleCount: '25 MÓDULOS:',
    modulesText: 'Todo el Ecosistema: Fase 3 + IA, Modelos Predictivos, Minería de Datos, Business Partners, Configuración',
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
  const [selectedAreas, setSelectedAreas] = useState([]);
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

  const handleToggleArea = (areaNum) => {
    setSelectedAreas(prev => 
      prev.includes(areaNum) ? prev.filter(id => id !== areaNum) : [...prev, areaNum]
    );
  };

  const handleClearAreas = () => {
    setSelectedAreas([]);
  };

  const getHighlightedModules = () => {
    let mods = [];

    if (activePhase === 'custom') {
      mods = [...customModules];
    } else if (activePhase) {
      const phase = phases.find(p => p.id === activePhase);
      if (phase) mods = [...phase.modulesArray];
    }

    if (selectedAreas.length > 0) {
      selectedAreas.forEach(aNum => {
        const area = AREAS_CONFIG.find(a => a.num === aNum);
        if (area) {
          mods = [...mods, ...area.modules];
        }
      });
    }

    return Array.from(new Set(mods));
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

        {/* BANNER MAESTRO: MI ESPACIO DE TRABAJO (MI FASE CONTRATADA) */}
        <div className="mb-8 bg-gradient-to-r from-[#0A2540] via-[#0E355E] to-[#0A2540] border-2 border-blue-400/50 rounded-2xl p-6 sm:p-7 shadow-2xl text-white relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-full bg-gradient-to-l from-cyan-500/10 to-transparent pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-3xl shadow-lg shadow-cyan-500/30 shrink-0">
                🏢
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-[11px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full">
                    ● Acceso Directo a su Solución
                  </span>
                  <span className="text-cyan-200 text-xs font-semibold">
                    Entorno de Trabajo Unificado Multimodular
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  Mi Espacio de Trabajo Integrado (Workspace)
                </h2>
                <p className="text-slate-300 text-sm mt-1 max-w-2xl leading-relaxed">
                  ¿Adquirió una Fase o desea operar todos sus módulos de forma integral? Ingrese aquí para alternar con pestañas superiores instantáneas entre cada módulo de su plan, con datos sincronizados y sin recargas de página.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <Link 
                to="/app/workspace" 
                className="px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black rounded-xl text-sm transition-all shadow-xl shadow-teal-500/30 flex items-center justify-center gap-2 text-center group"
              >
                <span>🚀</span>
                <span>ENTRAR A MI ESPACIO DE TRABAJO</span>
                <span className="group-hover:translate-x-1 transition-transform font-bold">➔</span>
              </Link>
            </div>
          </div>

          {/* Accesos directos por fase */}
          <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-300 font-semibold mr-1">Abrir Workspace por Fase:</span>
            <Link to="/app/workspace?phase=1" className="bg-white/10 hover:bg-white/25 text-blue-200 px-3 py-1.5 rounded-lg font-bold transition-colors border border-blue-400/30 flex items-center gap-1.5">
              <span>Fase 1: Starter (7 Módulos)</span> ➔
            </Link>
            <Link to="/app/workspace?phase=2" className="bg-white/10 hover:bg-white/25 text-amber-200 px-3 py-1.5 rounded-lg font-bold transition-colors border border-amber-400/30 flex items-center gap-1.5">
              <span>Fase 2: Express (17 Módulos)</span> ➔
            </Link>
            <Link to="/app/workspace?phase=3" className="bg-white/10 hover:bg-white/25 text-cyan-200 px-3 py-1.5 rounded-lg font-bold transition-colors border border-cyan-400/30 flex items-center gap-1.5">
              <span>Fase 3: Advanced (20 Módulos)</span> ➔
            </Link>
            <Link to="/app/workspace?phase=4" className="bg-white/10 hover:bg-white/25 text-purple-200 px-3 py-1.5 rounded-lg font-bold transition-colors border border-purple-400/30 flex items-center gap-1.5">
              <span>Fase 4: Enterprise (25 Módulos)</span> ➔
            </Link>
          </div>
        </div>

        {/* Barra de Circuitos Operativos Integrados Alineados a las 4 Fases Comerciales */}
        <div className="mb-10 bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 pb-4 border-b border-gray-100">
            <div>
              <span className="text-[10px] font-black tracking-widest text-[#006EAD] uppercase bg-blue-50 px-2 py-0.5 rounded-full">
                Demostradores en Tiempo Real Alineados a los Paquetes Comerciales
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#0A2540] mt-1">
                Circuitos Operativos Integrados por Fase de Contratación
              </h2>
              <p className="text-xs text-gray-500 max-w-xl mt-1">
                Compruebe en vivo exactamente qué obtiene su empresa en cada una de las 4 Fases Comerciales con datos reales interconectados.
              </p>
            </div>
            {/* Tarjeta NyTEX ERP: Ver recorrido en 3 minutos */}
            <div className="shrink-0 w-full sm:w-auto">
              <NytexVideoCard className="!p-4 !px-8 !rounded-2xl" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Circuito Fase 1: Starter */}
            <div className="p-5 rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50/60 to-white shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full uppercase">
                    Fase 1 • $35 USD/mes
                  </span>
                  <span className="text-[10px] text-gray-500 font-bold">Imp. $0 USD</span>
                </div>
                <h4 className="font-extrabold text-base text-gray-900">
                  Circuito Starter: Control Transaccional
                </h4>
                <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">
                  Venta de producto, descuento automático en Inventario, factura en CxC, cobro en Tesorería y póliza contable cuadrada de partida doble.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-blue-100">
                <span className="text-[10px] font-bold text-slate-500 block mb-1.5">7 Módulos Núcleo:</span>
                <div className="flex flex-wrap gap-1 mb-3">
                  {['Ventas', 'Inventario', 'Compras', 'CxC', 'CxP', 'Tesoreria', 'Contabilidad'].map(m => (
                    <span key={m} className="text-[9px] font-bold bg-white text-blue-900 border border-blue-200 px-1.5 py-0.5 rounded">
                      {m}
                    </span>
                  ))}
                </div>
                <div className="flex flex-col gap-2">
                  <Link 
                    to="/app/workspace?phase=1"
                    className="w-full text-center py-2 px-3 rounded-lg text-xs font-black bg-blue-600 hover:bg-blue-700 text-white shadow transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>🚀</span> Abrir Workspace (7 Módulos)
                  </Link>
                  <Link 
                    to="/app/circuito-fase1"
                    className="w-full text-center py-1.5 px-3 rounded-lg text-xs font-bold text-blue-700 hover:bg-blue-50 border border-blue-200 transition-colors"
                  >
                    Ver Demostración Flujo ➔
                  </Link>
                </div>
              </div>
            </div>

            {/* Circuito Fase 2: Express */}
            <div className="p-5 rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50/50 to-white shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full uppercase">
                    Fase 2 • $149 USD/mes
                  </span>
                  <span className="text-[10px] text-gray-500 font-bold">Imp. $1,500 USD</span>
                </div>
                <h4 className="font-extrabold text-base text-gray-900">
                  Circuito Express: Manufactura & Nómina
                </h4>
                <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">
                  Añade órdenes en telares circulares Mayer & Cie, surtido con código de barras en WMS, logística con camiones, nómina quincenal con horas extra y BPMN.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-amber-100">
                <span className="text-[10px] font-bold text-slate-500 block mb-1.5">17 Módulos (Starter + 10):</span>
                <div className="flex flex-wrap gap-1 mb-3">
                  {['CRM', 'ROP Inteligente', 'WMS', 'Logistica', 'Produccion', 'RRHH', 'Nomina', 'Dashboards', 'ProcessSuite', 'ProcessMining'].map(m => (
                    <span key={m} className="text-[9px] font-bold bg-white text-amber-900 border border-amber-200 px-1.5 py-0.5 rounded">
                      +{m}
                    </span>
                  ))}
                </div>
                <div className="flex flex-col gap-2">
                  <Link 
                    to="/app/workspace?phase=2"
                    className="w-full text-center py-2 px-3 rounded-lg text-xs font-black bg-amber-600 hover:bg-amber-700 text-white shadow transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>🚀</span> Abrir Workspace (17 Módulos)
                  </Link>
                  <Link 
                    to="/app/circuito-fase2"
                    className="w-full text-center py-1.5 px-3 rounded-lg text-xs font-bold text-amber-800 hover:bg-amber-50 border border-amber-200 transition-colors"
                  >
                    Ver Demostración Flujo ➔
                  </Link>
                </div>
              </div>
            </div>

            {/* Circuito Fase 3: Advanced */}
            <div className="p-5 rounded-2xl border border-cyan-200 bg-gradient-to-br from-cyan-50/50 to-white shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black text-cyan-800 bg-cyan-100 px-2 py-0.5 rounded-full uppercase">
                    Fase 3 • $299 USD/mes
                  </span>
                  <span className="text-[10px] text-gray-500 font-bold">Imp. $4,500 USD</span>
                </div>
                <h4 className="font-extrabold text-base text-gray-900">
                  Circuito Advanced: Inteligencia & IoT
                </h4>
                <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">
                  Cubo OLAP multidimensional de rentabilidad, Data Lake con 96 sensores IoT en telares, planeación S&OP / MRP II y reportes fiscales auditados NIF/Tributarios.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-cyan-100">
                <span className="text-[10px] font-bold text-slate-500 block mb-1.5">20 Módulos (Express + 3):</span>
                <div className="flex flex-wrap gap-1 mb-3">
                  {['BI Reportes', 'BigData IoT', 'Planeacion'].map(m => (
                    <span key={m} className="text-[9px] font-bold bg-white text-cyan-900 border border-cyan-200 px-1.5 py-0.5 rounded">
                      +{m}
                    </span>
                  ))}
                </div>
                <div className="flex flex-col gap-2">
                  <Link 
                    to="/app/workspace?phase=3"
                    className="w-full text-center py-2 px-3 rounded-lg text-xs font-black bg-cyan-600 hover:bg-cyan-700 text-white shadow transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>🚀</span> Abrir Workspace (20 Módulos)
                  </Link>
                  <Link 
                    to="/app/circuito-fase3"
                    className="w-full text-center py-1.5 px-3 rounded-lg text-xs font-bold text-cyan-800 hover:bg-cyan-50 border border-cyan-200 transition-colors"
                  >
                    Ver Demostración Flujo ➔
                  </Link>
                </div>
              </div>
            </div>

            {/* Circuito Fase 4: Enterprise */}
            <div className="p-5 rounded-2xl border border-purple-300 bg-gradient-to-br from-purple-50/70 to-white shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black text-purple-900 bg-purple-100 px-2 py-0.5 rounded-full uppercase">
                    Fase 4 • $499 USD/mes
                  </span>
                  <span className="text-[10px] text-emerald-700 font-extrabold">⭐ 25 Módulos 100%</span>
                </div>
                <h4 className="font-extrabold text-base text-gray-900">
                  Circuito Enterprise: IA Autónoma 360°
                </h4>
                <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">
                  Ecosistema total autónomo: Asistente IA cognitivo con SQLite, pronósticos ARIMA, clustering K-Means, minería DFG y gobernanza fiscal inmutable multi-país (DTE / SAT / SAR / DGI).
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-purple-100">
                <span className="text-[10px] font-bold text-slate-500 block mb-1.5">Los 25 Módulos Completos:</span>
                <div className="flex flex-wrap gap-1 mb-3">
                  {['IA Copilot', 'Predictivos', 'MineriaDatos', 'Partners', 'Configuracion'].map(m => (
                    <span key={m} className="text-[9px] font-bold bg-white text-purple-900 border border-purple-200 px-1.5 py-0.5 rounded">
                      +{m}
                    </span>
                  ))}
                </div>
                <div className="flex flex-col gap-2">
                  <Link 
                    to="/app/workspace?phase=4"
                    className="w-full text-center py-2 px-3 rounded-lg text-xs font-black bg-purple-700 hover:bg-purple-800 text-white shadow transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>🚀</span> Abrir Workspace (25 Módulos)
                  </Link>
                  <Link 
                    to="/app/circuito-fase4"
                    className="w-full text-center py-1.5 px-3 rounded-lg text-xs font-bold text-purple-900 hover:bg-purple-50 border border-purple-200 transition-colors"
                  >
                    Ver Demostración Flujo ➔
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>

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

                {/* Acceso Directo al Workspace de la Fase */}
                <Link
                  to={`/app/workspace?phase=${phase.id}`}
                  className="w-full mt-2 py-1.5 px-3 rounded text-xs font-bold text-center text-cyan-300 hover:text-white hover:bg-white/10 transition-colors border border-cyan-500/30 flex items-center justify-center gap-1"
                >
                  <span>🚀</span> Abrir en Workspace ➔
                </Link>
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

        {/* EL MODELO DE TRANSFORMACIÓN NyT™ */}
        <ModeloTransformacionNyt 
          activePhase={activePhase}
          onSelectPhase={(lvl) => setActivePhase(activePhase === lvl ? null : lvl)}
        />

        {/* Encabezado: Las Aplicaciones UN ECOSISTEMA. TODA SU EMPRESA CONECTADA. */}
        <div className="text-center mt-16 mb-6">
          <span className="text-amber-500 font-bold tracking-wider uppercase text-sm mb-2 block">
            Las Aplicaciones
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--nytex-navy)] mb-3">
            UN ECOSISTEMA. TODA SU EMPRESA CONECTADA.
          </h2>
          <div className="w-24 h-1 bg-[#2A114B] mx-auto"></div>
        </div>

        {/* DIAGRAMA OPERATIVO Y ÁREAS FUNCIONALES (Con Alumbrado Dinámico según la Fase elegida o Áreas Funcionales) */}
        <NytexEcosistemaDiagram 
          highlightedModules={highlightedModules} 
          selectedAreas={selectedAreas}
          onToggleArea={handleToggleArea}
          onClearAreas={handleClearAreas}
          onClearPhase={() => setActivePhase(null)}
          activePhase={activePhase}
        />

        {/* Sección: Grid de 25 Módulos */}
        <div className="mb-8 text-center">
          <h3 className="text-2xl font-extrabold text-[var(--nytex-navy)]">
            Módulos y Aplicaciones del Sistema (25 Módulos)
          </h3>
          <p className="text-sm text-gray-500 mt-2">
            {hasActivePhase ? (
              <span className="inline-flex items-center gap-2 flex-wrap justify-center text-amber-700 font-bold bg-amber-50 border border-amber-300 px-4 py-1.5 rounded-full shadow-sm">
                <span>⭐ Mostrando en dorado vibrante las aplicaciones seleccionadas ({highlightedModules.length} módulos iluminados).</span>
                <button 
                  type="button"
                  onClick={() => { setActivePhase(null); setSelectedAreas([]); setCustomModules([]); }}
                  className="text-xs bg-amber-200 hover:bg-amber-300 text-amber-950 font-extrabold px-2.5 py-0.5 rounded-full transition-colors ml-1 border border-amber-400"
                >
                  ✕ Quitar iluminación
                </button>
              </span>
            ) : (
              'Haga clic en "Ver aplicaciones ↓" en cualquiera de las fases arriba o en las "Áreas Funcionales" para alumbrarlas en dorado.'
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

                {/* Badge: En dorado cuando está seleccionada en fase o área, o verde normal cuando no hay filtro */}
                <div className={`absolute top-0 right-0 px-3 py-1 text-xs font-extrabold rounded-bl-lg shadow-sm transition-all ${
                  isHighlighted 
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black shadow-md' 
                    : 'bg-[#15A36A] text-white'
                }`}>
                  {isHighlighted ? '⭐ SELECCIONADO' : 'ADQUIRIDO'}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Sección: Cómo trabajamos con usted, Tecnología NyTEX + Consultores NyT y FAQ */}
        <ComoTrabajamosConUsted />
        
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
