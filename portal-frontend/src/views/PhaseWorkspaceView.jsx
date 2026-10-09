import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Importar todos los componentes de módulos
import Ventas from '../modules/Ventas';
import CrmDashboardView from './CrmDashboardView';
import InventoryView from './InventoryView';
import Compras from '../modules/Compras';
import Produccion from '../modules/Produccion';
import BusinessPartnersView from './BusinessPartnersView';
import Logistica from '../modules/Logistica';
import CxcView from './CxcView';
import CxpView from './CxpView';
import Tesoreria from '../modules/Tesoreria';
import ActivosFijos from '../modules/ActivosFijos';
import Contabilidad from '../modules/Contabilidad';
import RRHH from '../modules/RRHH';
import Nomina from '../modules/Nomina';
import SynexProcessSuiteView from './SynexProcessSuiteView';
import ProcessMiningView from './ProcessMiningView';
import WmsView from './WmsView';
import RopView from './RopView';
import BIyReportes from '../modules/BIyReportes';
import DashboardsView from './DashboardsView';
import BiCubeView from './BiCubeView';
import BigDataView from './BigDataView';
import DataMiningView from './DataMiningView';
import IaAssistantView from './IaAssistantView';
import PredictiveModelsView from './PredictiveModelsView';
import PlaneacionView from './PlaneacionView';
import Configuracion from '../modules/Configuracion';

// Vistas de Circuitos
import CircuitoFase1View from './CircuitoFase1View';
import CircuitoFase2View from './CircuitoFase2View';
import CircuitoFase3View from './CircuitoFase3View';
import CircuitoFase4View from './CircuitoFase4View';

const PHASES_CONFIG = {
  1: {
    id: 1,
    name: 'Fase 1: NyTEX Starter',
    badge: 'Starter (7 Módulos)',
    price: '$35 USD/mes',
    imp: '$0 USD',
    color: 'blue',
    modules: [
      { id: 'ventas', name: '[1] Ventas', label: 'Ventas', icon: '💰' },
      { id: 'inventario', name: '[3] Inventario', label: 'Inventario', icon: '📦' },
      { id: 'compras', name: '[4] Compras', label: 'Compras', icon: '🛒' },
      { id: 'cxc', name: '[8] CxC', label: 'CxC', icon: '📄' },
      { id: 'cxp', name: '[9] CxP', label: 'CxP', icon: '💳' },
      { id: 'tesoreria', name: '[10] Finanzas & Tesorería', label: 'Tesorería & Cajas', icon: '🏦' },
      { id: 'contabilidad', name: '[12] Contabilidad', label: 'Contabilidad', icon: '⚖️' }
    ]
  },
  2: {
    id: 2,
    name: 'Fase 2: NyTEX Express',
    badge: 'Express (17 Módulos)',
    price: '$149 USD/mes',
    imp: '$1,500 USD',
    color: 'amber',
    modules: [
      { id: 'ventas', name: '[1] Ventas', label: 'Ventas', icon: '💰' },
      { id: 'crm', name: '[2] CRM', label: 'CRM', icon: '👥' },
      { id: 'inventario', name: '[3] Inventario', label: 'Inventario', icon: '📦' },
      { id: 'compras', name: '[4] Compras', label: 'Compras', icon: '🛒' },
      { id: 'rop', name: '[4.1] ROP Inteligente', label: 'ROP Inteligente', icon: '📊' },
      { id: 'produccion', name: '[5] Producción', label: 'Producción', icon: '🏭' },
      { id: 'logistica', name: '[7] Logística', label: 'Logística', icon: '🚚' },
      { id: 'cxc', name: '[8] CxC', label: 'CxC', icon: '📄' },
      { id: 'cxp', name: '[9] CxP', label: 'CxP', icon: '💳' },
      { id: 'tesoreria', name: '[10] Finanzas & Tesorería', label: 'Tesorería & Cajas', icon: '🏦' },
      { id: 'contabilidad', name: '[12] Contabilidad', label: 'Contabilidad', icon: '⚖️' },
      { id: 'rrhh', name: '[13] RRHH', label: 'RRHH', icon: '🧑‍💼' },
      { id: 'nomina', name: '[14] Nómina', label: 'Nómina', icon: '💵' },
      { id: 'processsuite', name: '[15] Process Suite', label: 'BPMN', icon: '🔄' },
      { id: 'processmining', name: '[16] Process Mining', label: 'Process Mining', icon: '🕸️' },
      { id: 'wms', name: '[17] WMS', label: 'WMS', icon: '🏷️' },
      { id: 'dashboards', name: '[19] Dashboards', label: 'Dashboards', icon: '📈' }
    ]
  },
  3: {
    id: 3,
    name: 'Fase 3: NyTEX Advanced',
    badge: 'Advanced (22 Módulos)',
    price: '$299 USD/mes',
    imp: '$4,500 USD',
    color: 'cyan',
    modules: [
      { id: 'ventas', name: '[1] Ventas', label: 'Ventas', icon: '💰' },
      { id: 'crm', name: '[2] CRM', label: 'CRM', icon: '👥' },
      { id: 'inventario', name: '[3] Inventario', label: 'Inventario', icon: '📦' },
      { id: 'compras', name: '[4] Compras', label: 'Compras', icon: '🛒' },
      { id: 'rop', name: '[4.1] ROP Inteligente', label: 'ROP Inteligente', icon: '📊' },
      { id: 'produccion', name: '[5] Producción', label: 'Producción', icon: '🏭' },
      { id: 'logistica', name: '[7] Logística', label: 'Logística', icon: '🚚' },
      { id: 'cxc', name: '[8] CxC', label: 'CxC', icon: '📄' },
      { id: 'cxp', name: '[9] CxP', label: 'CxP', icon: '💳' },
      { id: 'tesoreria', name: '[10] Finanzas & Tesorería', label: 'Tesorería & Cajas', icon: '🏦' },
      { id: 'activosfijos', name: '[11] Activos Fijos', label: 'Activos Fijos', icon: '🏗️' },
      { id: 'contabilidad', name: '[12] Contabilidad', label: 'Contabilidad', icon: '⚖️' },
      { id: 'rrhh', name: '[13] RRHH', label: 'RRHH', icon: '🧑‍💼' },
      { id: 'nomina', name: '[14] Nómina', label: 'Nómina', icon: '💵' },
      { id: 'processsuite', name: '[15] Process Suite', label: 'BPMN', icon: '🔄' },
      { id: 'processmining', name: '[16] Process Mining', label: 'Process Mining', icon: '🕸️' },
      { id: 'wms', name: '[17] WMS', label: 'WMS', icon: '🏷️' },
      { id: 'biyreportes', name: '[18] BI y Reportes', label: 'Reportes NIF', icon: '📑' },
      { id: 'dashboards', name: '[19] Dashboards', label: 'Dashboards', icon: '📈' },
      { id: 'bi', name: '[20] BI Cubo', label: 'BI Cubo OLAP', icon: '🧊' },
      { id: 'bigdata', name: '[21] Big Data', label: 'Big Data IoT', icon: '📡' },
      { id: 'planeacion', name: '[25] Planeación', label: 'Planeación S&OP', icon: '🗓️' }
    ]
  },
  4: {
    id: 4,
    name: 'Fase 4: NyTEX Enterprise',
    badge: 'Enterprise (27 Módulos)',
    price: '$499 USD/mes',
    imp: 'A Medida',
    color: 'purple',
    modules: [
      { id: 'ventas', name: '[1] Ventas', label: 'Ventas', icon: '💰' },
      { id: 'crm', name: '[2] CRM', label: 'CRM', icon: '👥' },
      { id: 'inventario', name: '[3] Inventario', label: 'Inventario', icon: '📦' },
      { id: 'compras', name: '[4] Compras', label: 'Compras', icon: '🛒' },
      { id: 'rop', name: '[4.1] ROP Inteligente', label: 'ROP Inteligente', icon: '📊' },
      { id: 'produccion', name: '[5] Producción', label: 'Producción', icon: '🏭' },
      { id: 'businesspartners', name: '[6] Partners', label: 'Partners', icon: '🤝' },
      { id: 'logistica', name: '[7] Logística', label: 'Logística', icon: '🚚' },
      { id: 'cxc', name: '[8] CxC', label: 'CxC', icon: '📄' },
      { id: 'cxp', name: '[9] CxP', label: 'CxP', icon: '💳' },
      { id: 'tesoreria', name: '[10] Finanzas & Tesorería', label: 'Tesorería & Cajas', icon: '🏦' },
      { id: 'activosfijos', name: '[11] Activos Fijos', label: 'Activos Fijos', icon: '🏗️' },
      { id: 'contabilidad', name: '[12] Contabilidad', label: 'Contabilidad', icon: '⚖️' },
      { id: 'rrhh', name: '[13] RRHH', label: 'RRHH', icon: '🧑‍💼' },
      { id: 'nomina', name: '[14] Nómina', label: 'Nómina', icon: '💵' },
      { id: 'processsuite', name: '[15] Process Suite', label: 'BPMN', icon: '🔄' },
      { id: 'processmining', name: '[16] Process Mining', label: 'Process Mining', icon: '🕸️' },
      { id: 'wms', name: '[17] WMS', label: 'WMS', icon: '🏷️' },
      { id: 'biyreportes', name: '[18] BI y Reportes', label: 'Reportes NIF', icon: '📑' },
      { id: 'dashboards', name: '[19] Dashboards', label: 'Dashboards', icon: '📈' },
      { id: 'bi', name: '[20] BI Cubo', label: 'BI Cubo OLAP', icon: '🧊' },
      { id: 'bigdata', name: '[21] Big Data', label: 'Big Data IoT', icon: '📡' },
      { id: 'mineriadatos', name: '[22] Minería', label: 'Minería K-Means', icon: '🎯' },
      { id: 'ia', name: '[23] IA Copilot', label: 'IA Cognitiva', icon: '🧠' },
      { id: 'predictivos', name: '[24] Predictivos', label: 'Predictivos', icon: '🔮' },
      { id: 'planeacion', name: '[25] Planeación', label: 'Planeación S&OP', icon: '🗓️' },
      { id: 'configuracion', name: '[26] Configuración', label: 'Configuración', icon: '⚙️' }
    ]
  }
};

export default function PhaseWorkspaceView() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, login, logout } = useAuth();
  const [activePhase, setActivePhase] = useState(1);
  const [activeTab, setActiveTab] = useState('circuito'); // 'circuito' o moduleId

  const safeUser = user || { 
    role: localStorage.getItem('nytex_role') || 'Client',
    email: localStorage.getItem('nytex_email') || 'demo@consultores-nyt.com'
  };

  const isClient = safeUser.role === 'Client';
  const contractedPhase = isClient 
    ? (parseInt(localStorage.getItem('nytex_contracted_phase') || localStorage.getItem('nytex_active_phase'), 10) || 1)
    : 4;

  const [upgradeModalPhase, setUpgradeModalPhase] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    let p = parseInt(params.get('phase'), 10);
    const mod = params.get('mod');
    
    // Si el usuario es Cliente, no puede ver una fase mayor a la contratada
    if (isClient && p > contractedPhase) {
      p = contractedPhase;
    }

    if (p >= 1 && p <= 4 && (!isClient || p <= contractedPhase)) {
      setActivePhase(p);
      localStorage.setItem('nytex_active_phase', p.toString());
    } else {
      const saved = isClient ? contractedPhase : (parseInt(localStorage.getItem('nytex_active_phase'), 10) || 1);
      setActivePhase(saved);
    }

    if (mod) {
      const allowed = PHASES_CONFIG[contractedPhase]?.modules.map(m => m.id) || [];
      if (!isClient || allowed.includes(mod)) {
        setActiveTab(mod);
      } else {
        setActiveTab('circuito');
      }
    }
  }, [location, isClient, contractedPhase]);

  const currentConfig = PHASES_CONFIG[activePhase] || PHASES_CONFIG[1];

  const handleSelectPhase = (pId) => {
    if (isClient && pId > contractedPhase) {
      setUpgradeModalPhase(pId);
      return;
    }
    setActivePhase(pId);
    setActiveTab('circuito');
    localStorage.setItem('nytex_active_phase', pId.toString());
    localStorage.setItem('nytex_user_plan', PHASES_CONFIG[pId]?.name || `Fase ${pId}`);
  };

  const handleSwitchRole = (newRole, phaseNum = activePhase) => {
    if (isClient) return; // Clientes no pueden cambiar su rol
    if (newRole === 'Client') {
      handleSelectPhase(phaseNum);
      if (login) login('Client');
    } else {
      if (login) login(newRole);
    }
  };

  // Renderizador dinámico del componente seleccionado
  const renderModuleContent = () => {
    if (activeTab === 'circuito') {
      if (activePhase === 1) return <CircuitoFase1View />;
      if (activePhase === 2) return <CircuitoFase2View />;
      if (activePhase === 3) return <CircuitoFase3View />;
      return <CircuitoFase4View />;
    }

    switch (activeTab) {
      case 'ventas': return <Ventas />;
      case 'crm': return <CrmDashboardView />;
      case 'inventario': return <InventoryView />;
      case 'compras': return <Compras />;
      case 'rop': return <RopView />;
      case 'produccion': return <Produccion />;
      case 'businesspartners': return <BusinessPartnersView />;
      case 'logistica': return <Logistica />;
      case 'cxc': return <CxcView />;
      case 'cxp': return <CxpView />;
      case 'tesoreria': return <Tesoreria />;
      case 'activosfijos': return <ActivosFijos />;
      case 'contabilidad': return <Contabilidad />;
      case 'rrhh': return <RRHH />;
      case 'nomina': return <Nomina />;
      case 'processsuite': return <SynexProcessSuiteView />;
      case 'processmining': return <ProcessMiningView />;
      case 'wms': return <WmsView />;
      case 'biyreportes': return <BIyReportes />;
      case 'dashboards': return <DashboardsView />;
      case 'bi': return <BiCubeView />;
      case 'bigdata': return <BigDataView />;
      case 'mineriadatos': return <DataMiningView />;
      case 'ia': return <IaAssistantView />;
      case 'predictivos': return <PredictiveModelsView />;
      case 'planeacion': return <PlaneacionView />;
      case 'configuracion': return <Configuracion />;
      default: return <CircuitoFase1View />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      
      {/* Barra Superior Maestra de Mi Espacio de Trabajo */}
      <div className="bg-[#0A2540] text-white shadow-xl border-b border-slate-700 sticky top-0 z-40">
        
        {/* Fila 1: Selector de Fase Contratada & Simulador de Roles */}
        <div className="max-w-[1700px] mx-auto px-4 py-2.5 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <Link to="/portal" className="font-black text-xl tracking-tight text-white flex items-center gap-2">
              <span className="bg-gradient-to-r from-blue-500 to-cyan-400 text-slate-950 px-2 py-0.5 rounded font-black text-sm">NyTEX</span>
              <span>Workspace</span>
            </Link>
            <span className="text-slate-500 text-xs hidden sm:inline">|</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-300 font-semibold">Fase Activa:</span>
              <div className="flex bg-slate-900/90 p-0.5 rounded-lg border border-slate-700">
                {[1, 2, 3, 4].map(pId => {
                  const isLocked = isClient && pId > contractedPhase;
                  return (
                    <button
                      key={pId}
                      onClick={() => handleSelectPhase(pId)}
                      className={`px-3 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
                        activePhase === pId
                          ? 'bg-blue-600 text-white shadow-sm'
                          : isLocked
                          ? 'text-slate-500 hover:text-amber-300 hover:bg-slate-800 cursor-pointer'
                          : 'text-slate-400 hover:text-white'
                      }`}
                      title={isLocked ? `Fase ${pId} no incluida en su plan. Requiere Upgrade.` : `Fase ${pId}`}
                    >
                      {isLocked && <span className="text-[10px]">🔒</span>}
                      <span>Fase {pId} ({PHASES_CONFIG[pId].modules.length} mód)</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Simulador de Rol (SOLO para Admin/Partner) o Ficha de Cliente */}
          <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto justify-between xl:justify-end">
            {!isClient ? (
              <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-700 rounded-lg p-1 text-xs">
                <span className="text-slate-400 px-1 font-semibold">Simular:</span>
                <button
                  type="button"
                  onClick={() => handleSwitchRole('Admin')}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                    safeUser.role === 'Admin' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  👑 Admin
                </button>
                <button
                  type="button"
                  onClick={() => handleSwitchRole('Partner')}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                    safeUser.role === 'Partner' || (!safeUser.role && !safeUser.email?.includes('admin') && !safeUser.email?.includes('cliente')) ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🤝 Partner
                </button>
                <button
                  type="button"
                  onClick={() => handleSwitchRole('Client', activePhase)}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                    safeUser.role === 'Client' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🏢 Cliente (F{activePhase})
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-slate-900/90 border border-emerald-500/40 rounded-lg px-3 py-1.5 text-xs text-white">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-slate-400">Cliente:</span>
                <strong className="text-emerald-300 font-bold">{safeUser.email || 'demo@consultores-nyt.com'}</strong>
                <span className="text-slate-500">|</span>
                <span className="text-slate-300">Plan: <strong className="text-cyan-300">Fase {contractedPhase}</strong></span>
              </div>
            )}

            <div className="flex items-center gap-2 text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-emerald-400 font-bold hidden sm:inline">Licencia:</span>
              <strong className="text-white font-extrabold">{PHASES_CONFIG[contractedPhase]?.name || currentConfig.name}</strong>
            </div>

            <Link
              to="/portal"
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border border-slate-700"
            >
              Menú Principal (Portal) ➔
            </Link>

            <button
              type="button"
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all border border-rose-500/40 flex items-center gap-1 shadow-sm"
              title="Cerrar sesión y volver al Control de Acceso"
            >
              <span>🔒</span> Salir
            </button>
          </div>
        </div>

        {/* Fila 2: Pestañas de Acceso Directo a los Módulos de esta Fase */}
        <div className="bg-slate-900 border-t border-slate-800 px-4">
          <div className="max-w-[1700px] mx-auto flex items-center gap-1.5 overflow-x-auto py-2 scrollbar-thin">
            
            {/* Pestaña: Flujo Integrado (Monitor Global del Plan) */}
            <button
              onClick={() => setActiveTab('circuito')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 whitespace-nowrap transition-all ${
                activeTab === 'circuito'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-md font-black ring-2 ring-amber-400/50'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <span>⚡</span> Flujo Operativo Integrado ({currentConfig.modules.length} Módulos)
            </button>

            <span className="text-slate-700 mx-1">|</span>

            {/* Pestañas individuales para cada módulo contratado */}
            {currentConfig.modules.map(mod => {
              const isActive = activeTab === mod.id;
              return (
                <button
                  key={mod.id}
                  onClick={() => setActiveTab(mod.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span>{mod.icon}</span>
                  <span>{mod.label}</span>
                </button>
              );
            })}

          </div>
        </div>

      </div>

      {/* Contenido Dinámico del Módulo o Flujo Seleccionado */}
      <div className="flex-1 w-full max-w-[1700px] mx-auto p-4 md:p-6">
        {renderModuleContent()}
      </div>

      {/* Modal de Bloqueo / Upgrade para Clientes */}
      {upgradeModalPhase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in font-sans">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-slate-800 shadow-2xl border border-slate-200 text-center animate-scale-up">
            <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-3">
              🔒
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-1">
              Fase {upgradeModalPhase} no incluida en su plan
            </h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Su empresa cuenta actualmente con la licencia activa para la <strong>{PHASES_CONFIG[contractedPhase]?.name}</strong>. Para acceder a los módulos de la <strong>{PHASES_CONFIG[upgradeModalPhase]?.name}</strong> ({PHASES_CONFIG[upgradeModalPhase]?.badge}), active su ampliación de suscripción.
            </p>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-5 text-left text-xs">
              <div className="flex justify-between mb-1.5">
                <span className="text-slate-600 font-bold">Precio mensual:</span>
                <span className="font-black text-blue-900">{PHASES_CONFIG[upgradeModalPhase]?.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 font-bold">Total módulos:</span>
                <span className="font-black text-emerald-700">{PHASES_CONFIG[upgradeModalPhase]?.modules.length} Módulos</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={() => setUpgradeModalPhase(null)}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors"
              >
                Volver a mi Plan
              </button>
              <button
                type="button"
                onClick={() => {
                  setUpgradeModalPhase(null);
                  navigate(`/portal?phase=${upgradeModalPhase}&checkout=true`);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <span>🚀 Contratar Upgrade ➔</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
