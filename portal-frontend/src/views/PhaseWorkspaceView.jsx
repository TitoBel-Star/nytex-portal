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
    badge: 'Starter (6 Módulos)',
    price: '$35 USD/mes',
    imp: '$0 USD',
    color: 'blue',
    modules: [
      { id: 'ventas', name: '[1] Ventas', label: 'Ventas', icon: '💰' },
      { id: 'inventario', name: '[3] Inventario', label: 'Inventario', icon: '📦' },
      { id: 'compras', name: '[4] Compras', label: 'Compras', icon: '🛒' },
      { id: 'cxc', name: '[8] CxC', label: 'CxC', icon: '📄' },
      { id: 'cxp', name: '[9] CxP', label: 'CxP', icon: '💳' },
      { id: 'contabilidad', name: '[12] Contabilidad', label: 'Contabilidad', icon: '⚖️' }
    ]
  },
  2: {
    id: 2,
    name: 'Fase 2: NyTEX Express',
    badge: 'Express (15 Módulos)',
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
      { id: 'businesspartners', name: '[6] Partners', label: 'Partners', icon: '🤝' },
      { id: 'logistica', name: '[7] Logística', label: 'Logística', icon: '🚚' },
      { id: 'cxc', name: '[8] CxC', label: 'CxC', icon: '📄' },
      { id: 'cxp', name: '[9] CxP', label: 'CxP', icon: '💳' },
      { id: 'tesoreria', name: '[10] Finanzas & Tesorería', label: 'Tesorería & Cajas', icon: '🏦' },
      { id: 'contabilidad', name: '[12] Contabilidad', label: 'Contabilidad', icon: '⚖️' },
      { id: 'rrhh', name: '[13] RRHH', label: 'RRHH', icon: '🧑‍💼' },
      { id: 'nomina', name: '[14] Nómina', label: 'Nómina', icon: '💵' },
      { id: 'wms', name: '[17] WMS', label: 'WMS', icon: '🏷️' }
    ]
  },
  3: {
    id: 3,
    name: 'Fase 3: NyTEX Advanced',
    badge: 'Advanced (20 Módulos)',
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
      { id: 'businesspartners', name: '[6] Partners', label: 'Partners', icon: '🤝' },
      { id: 'logistica', name: '[7] Logística', label: 'Logística', icon: '🚚' },
      { id: 'cxc', name: '[8] CxC', label: 'CxC', icon: '📄' },
      { id: 'cxp', name: '[9] CxP', label: 'CxP', icon: '💳' },
      { id: 'tesoreria', name: '[10] Finanzas & Tesorería', label: 'Tesorería & Cajas', icon: '🏦' },
      { id: 'contabilidad', name: '[12] Contabilidad', label: 'Contabilidad', icon: '⚖️' },
      { id: 'rrhh', name: '[13] RRHH', label: 'RRHH', icon: '🧑‍💼' },
      { id: 'nomina', name: '[14] Nómina', label: 'Nómina', icon: '💵' },
      { id: 'wms', name: '[17] WMS', label: 'WMS', icon: '🏷️' },
      { id: 'processsuite', name: '[15] Process Suite', label: 'BPMN', icon: '🔄' },
      { id: 'processmining', name: '[16] Process Mining', label: 'Process Mining', icon: '🕸️' },
      { id: 'dashboards', name: '[19] Dashboards', label: 'Dashboards', icon: '📈' },
      { id: 'bi', name: '[20] BI Cubo', label: 'BI Cubo OLAP', icon: '🧊' },
      { id: 'planeacion', name: '[25] Planeación', label: 'Planeación S&OP', icon: '🗓️' }
    ]
  },
  4: {
    id: 4,
    name: 'Fase 4: NyTEX Enterprise',
    badge: 'Enterprise (25 Módulos)',
    price: '$499 USD/mes',
    imp: 'A Medida',
    color: 'purple',
    modules: [
      { id: 'ventas', name: '[1] Ventas', label: 'Ventas', icon: '💰' },
      { id: 'inventario', name: '[3] Inventario', label: 'Inventario', icon: '📦' },
      { id: 'compras', name: '[4] Compras', label: 'Compras', icon: '🛒' },
      { id: 'cxc', name: '[8] CxC', label: 'CxC', icon: '📄' },
      { id: 'cxp', name: '[9] CxP', label: 'CxP', icon: '💳' },
      { id: 'contabilidad', name: '[12] Contabilidad', label: 'Contabilidad', icon: '⚖️' },
      { id: 'crm', name: '[2] CRM', label: 'CRM', icon: '👥' },
      { id: 'rop', name: '[4.1] ROP Inteligente', label: 'ROP Inteligente', icon: '📊' },
      { id: 'produccion', name: '[5] Producción', label: 'Producción', icon: '🏭' },
      { id: 'businesspartners', name: '[6] Partners', label: 'Partners', icon: '🤝' },
      { id: 'logistica', name: '[7] Logística', label: 'Logística', icon: '🚚' },
      { id: 'tesoreria', name: '[10] Finanzas & Tesorería', label: 'Tesorería & Cajas', icon: '🏦' },
      { id: 'rrhh', name: '[13] RRHH', label: 'RRHH', icon: '🧑‍💼' },
      { id: 'nomina', name: '[14] Nómina', label: 'Nómina', icon: '💵' },
      { id: 'wms', name: '[17] WMS', label: 'WMS', icon: '🏷️' },
      { id: 'processsuite', name: '[15] Process Suite', label: 'BPMN', icon: '🔄' },
      { id: 'processmining', name: '[16] Process Mining', label: 'Process Mining', icon: '🕸️' },
      { id: 'dashboards', name: '[19] Dashboards', label: 'Dashboards', icon: '📈' },
      { id: 'bi', name: '[20] BI Cubo', label: 'BI Cubo OLAP', icon: '🧊' },
      { id: 'planeacion', name: '[25] Planeación', label: 'Planeación S&OP', icon: '🗓️' },
      { id: 'bigdata', name: '[21] Big Data', label: 'Big Data IoT', icon: '📡' },
      { id: 'mineriadatos', name: '[22] Minería', label: 'Minería K-Means', icon: '🎯' },
      { id: 'ia', name: '[23] IA Copilot', label: 'IA Cognitiva', icon: '🧠' },
      { id: 'predictivos', name: '[24] Predictivos', label: 'Predictivos', icon: '🔮' },
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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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
    
    // Si viene un módulo, buscar a qué fase mínima pertenece
    if (mod) {
      let modPhase = 1;
      for (let i = 1; i <= 4; i++) {
        if (PHASES_CONFIG[i].modules.some(m => m.id === mod)) {
          modPhase = i;
          break;
        }
      }
      if (!p || isNaN(p)) {
        p = modPhase;
      }
    }

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
    
    // Si el módulo activo no pertenece a la nueva fase, regresar a circuito
    const inNewPhase = PHASES_CONFIG[pId]?.modules.some(m => m.id === activeTab);
    const nextTab = inNewPhase ? activeTab : 'circuito';
    setActiveTab(nextTab);
    
    localStorage.setItem('nytex_active_phase', pId.toString());
    localStorage.setItem('nytex_user_plan', PHASES_CONFIG[pId]?.name || `Fase ${pId}`);

    if (nextTab === 'circuito') {
      navigate(`/app/workspace?phase=${pId}`, { replace: true });
    } else {
      navigate(`/app/workspace?phase=${pId}&mod=${nextTab}`, { replace: true });
    }
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

  // Filtrado de módulos en la barra lateral según la búsqueda
  const filteredModules = currentConfig.modules.filter(mod => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return mod.label.toLowerCase().includes(q) || mod.name.toLowerCase().includes(q) || mod.id.toLowerCase().includes(q);
  });

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

  const activeModuleObj = currentConfig.modules.find(m => m.id === activeTab);

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-slate-100 font-sans text-slate-800">
      
      {/* ========================================================= */}
      {/* 🧭 BARRA LATERAL IZQUIERDA (SIDEBAR DE FASES Y MÓDULOS)   */}
      {/* ========================================================= */}
      <aside 
        className={`${
          isSidebarCollapsed ? 'w-20' : 'w-72'
        } flex-shrink-0 bg-[#07192d] text-white flex flex-col h-full border-r border-slate-800 shadow-2xl transition-all duration-300 z-30 select-none relative`}
      >
        
        {/* Encabezado: Logo Corporativo NyTEX */}
        <div className="p-3.5 border-b border-slate-800/80 flex items-center justify-between bg-[#051322]">
          {!isSidebarCollapsed ? (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 via-cyan-500 to-blue-400 flex items-center justify-center font-black text-slate-950 text-base shadow-md shadow-cyan-500/20">
                N
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-lg tracking-tight text-white">NyTEX</span>
                  <span className="text-[10px] uppercase tracking-wider bg-blue-500/20 text-cyan-300 font-bold px-1.5 py-0.2 rounded border border-cyan-400/30">
                    ERP
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium">Workspace Integrado</p>
              </div>
            </div>
          ) : (
            <div className="w-9 h-9 mx-auto rounded-lg bg-gradient-to-tr from-blue-600 via-cyan-500 to-blue-400 flex items-center justify-center font-black text-slate-950 text-base shadow-md">
              N
            </div>
          )}
          
          {/* Botón de Colapsar / Expandir Sidebar */}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800/80 transition-colors"
            title={isSidebarCollapsed ? "Expandir panel lateral" : "Colapsar panel lateral"}
          >
            <span className="text-xs">{isSidebarCollapsed ? '▶' : '◀'}</span>
          </button>
        </div>

        {/* Sección 1: Selector de Fase Activa */}
        {!isSidebarCollapsed ? (
          <div className="p-3 border-b border-slate-800/90 bg-slate-950/40">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Fase Activa
              </span>
              <span className="text-[10px] font-bold text-cyan-300 bg-cyan-950/80 border border-cyan-500/30 px-2 py-0.5 rounded-full">
                {currentConfig.badge}
              </span>
            </div>

            {/* Cuadrícula de 4 Fases */}
            <div className="grid grid-cols-2 gap-1.5">
              {[1, 2, 3, 4].map(pId => {
                const isLocked = isClient && pId > contractedPhase;
                const isSelected = activePhase === pId;
                return (
                  <button
                    key={pId}
                    type="button"
                    onClick={() => handleSelectPhase(pId)}
                    className={`py-1.5 px-2 rounded-lg text-left text-xs transition-all relative flex flex-col ${
                      isSelected
                        ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30 ring-1 ring-cyan-400'
                        : isLocked
                        ? 'bg-slate-900/60 text-slate-500 hover:text-amber-300 hover:bg-slate-800/80 border border-slate-800/60 cursor-pointer'
                        : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                    }`}
                    title={isLocked ? `Fase ${pId} bloqueada (Upgrade requerido)` : `Cambiar a Fase ${pId}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold">Fase {pId}</span>
                      {isLocked && <span className="text-[10px]">🔒</span>}
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-pulse"></span>}
                    </div>
                    <span className={`text-[10px] ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                      {PHASES_CONFIG[pId].modules.length} mód
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="p-2 border-b border-slate-800/80 flex flex-col items-center gap-1">
            <span className="text-[9px] font-bold text-slate-500">FASE</span>
            <div className="flex flex-col gap-1 w-full items-center">
              {[1, 2, 3, 4].map(pId => {
                const isLocked = isClient && pId > contractedPhase;
                const isSelected = activePhase === pId;
                return (
                  <button
                    key={pId}
                    onClick={() => handleSelectPhase(pId)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-md ring-1 ring-cyan-400'
                        : isLocked
                        ? 'text-slate-600 hover:text-amber-400'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                    title={`Fase ${pId} (${PHASES_CONFIG[pId].badge})`}
                  >
                    {isLocked ? '🔒' : `F${pId}`}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Buscador Rápido de Módulos */}
        {!isSidebarCollapsed && (
          <div className="px-3 pt-2.5 pb-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar módulo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-800 rounded-lg pl-7 pr-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/40"
              />
              <span className="absolute left-2 top-1.5 text-xs text-slate-500">🔍</span>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1.5 text-xs text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        )}

        {/* Sección 2: Lista Vertical de Módulos */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-2 py-2 space-y-1">
          
          {/* Pestaña: Flujo Operativo Integrado (Circuito Global) */}
          <button
            onClick={() => {
              setActiveTab('circuito');
              navigate(`/app/workspace?phase=${activePhase}`, { replace: true });
            }}
            className={`w-full text-left py-2 px-2.5 rounded-xl text-xs flex items-center gap-2.5 transition-all ${
              activeTab === 'circuito'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black shadow-md ring-1 ring-amber-300'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/70 font-semibold'
            }`}
            title="Flujo Operativo Integrado del Plan"
          >
            <span className="text-base flex-shrink-0">⚡</span>
            {!isSidebarCollapsed && (
              <div className="flex-1 flex items-center justify-between overflow-hidden">
                <span className="truncate">Flujo Integrado</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ml-1 ${
                  activeTab === 'circuito' ? 'bg-amber-600/30 text-slate-950' : 'bg-slate-800 text-amber-400'
                }`}>
                  Circuito
                </span>
              </div>
            )}
          </button>

          {!isSidebarCollapsed && (
            <div className="pt-2 pb-0.5 px-2 flex items-center justify-between text-slate-500">
              <span className="text-[10px] font-extrabold uppercase tracking-wider">
                Módulos ({filteredModules.length})
              </span>
              <span className="text-[9px] font-bold text-slate-400">
                Fase {activePhase}
              </span>
            </div>
          )}

          {/* Módulos individuales de la fase activa */}
          {filteredModules.map((mod) => {
            const isActive = activeTab === mod.id;
            return (
              <button
                key={mod.id}
                onClick={() => {
                  setActiveTab(mod.id);
                  navigate(`/app/workspace?phase=${activePhase}&mod=${mod.id}`, { replace: true });
                }}
                className={`w-full text-left py-2 px-2.5 rounded-xl text-xs flex items-center gap-2.5 transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20 ring-1 ring-cyan-400/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60 font-medium'
                }`}
                title={mod.name}
              >
                <span className="text-base flex-shrink-0">{mod.icon}</span>
                {!isSidebarCollapsed && (
                  <span className="truncate flex-1">{mod.label}</span>
                )}
              </button>
            );
          })}

          {filteredModules.length === 0 && !isSidebarCollapsed && (
            <div className="p-4 text-center text-xs text-slate-500">
              No se encontró "{searchQuery}"
            </div>
          )}
        </div>

        {/* Sección 3: Footer del Sidebar (Roles, Licencia y Enlaces) */}
        <div className="p-3 border-t border-slate-800/90 bg-[#051322] space-y-2">
          {!isSidebarCollapsed ? (
            <>
              {/* Simulador de Rol (SOLO para Admin/Partner) o Ficha de Cliente */}
              {!isClient ? (
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-1.5">
                  <div className="text-[10px] text-slate-400 font-bold mb-1 flex items-center justify-between">
                    <span>Simulador de Rol:</span>
                    <span className="text-cyan-400 font-bold">{safeUser.role || 'Admin'}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <button
                      type="button"
                      onClick={() => handleSwitchRole('Admin')}
                      className={`py-1 rounded text-[10px] font-bold text-center transition-all ${
                        safeUser.role === 'Admin' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white bg-slate-800/60'
                      }`}
                    >
                      👑 Admin
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSwitchRole('Partner')}
                      className={`py-1 rounded text-[10px] font-bold text-center transition-all ${
                        safeUser.role === 'Partner' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white bg-slate-800/60'
                      }`}
                    >
                      🤝 Partner
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSwitchRole('Client', activePhase)}
                      className={`py-1 rounded text-[10px] font-bold text-center transition-all ${
                        safeUser.role === 'Client' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white bg-slate-800/60'
                      }`}
                    >
                      🏢 Cliente
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-900 border border-emerald-500/30 rounded-lg p-2 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px] mb-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Cliente Activo</span>
                  </div>
                  <p className="text-[11px] text-slate-300 truncate font-semibold">{safeUser.email}</p>
                </div>
              )}

              {/* Indicador de Licencia */}
              <div className="flex items-center justify-between px-1 text-[11px]">
                <span className="text-slate-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Licencia:</span>
                </span>
                <span className="font-bold text-emerald-400 truncate max-w-[140px]" title={PHASES_CONFIG[contractedPhase]?.name || currentConfig.name}>
                  {PHASES_CONFIG[contractedPhase]?.badge || currentConfig.badge}
                </span>
              </div>

              {/* Botones de Navegación Portal y Salir */}
              <div className="grid grid-cols-2 gap-1.5 pt-1">
                <Link
                  to="/portal"
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 py-1.5 px-2 rounded-lg text-[11px] font-bold text-center transition-all border border-slate-700 flex items-center justify-center gap-1"
                >
                  <span>Portal</span> ➔
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all border border-rose-500/40 flex items-center justify-center gap-1 shadow-sm"
                >
                  <span>🔒</span> Salir
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Link
                to="/portal"
                title="Menú Principal (Portal)"
                className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center text-sm font-bold border border-slate-700"
              >
                🏠
              </Link>
              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                title="Cerrar sesión"
                className="w-10 h-10 rounded-lg bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white flex items-center justify-center text-sm font-bold border border-rose-500/40"
              >
                🔒
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ========================================================= */}
      {/* 🖥️ PANTALLA DE TRABAJO PRINCIPAL (ÁREA DERECHA AMPLIA)     */}
      {/* ========================================================= */}
      <main className="flex-1 flex flex-col h-full min-w-0 overflow-hidden bg-slate-50">
        
        {/* Barra Superior de la Pantalla de Trabajo */}
        <header className="h-14 bg-white border-b border-slate-200/90 px-4 md:px-6 flex items-center justify-between shadow-xs flex-shrink-0 z-20">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="text-slate-600 hover:text-slate-900 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              title={isSidebarCollapsed ? "Expandir menú lateral" : "Colapsar menú lateral"}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>

            {/* Breadcrumb del espacio de trabajo */}
            <div className="flex items-center gap-2 text-xs md:text-sm font-medium text-slate-500 truncate">
              <span className="font-bold text-slate-900">Workspace</span>
              <span>/</span>
              <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                {currentConfig.name}
              </span>
              <span>/</span>
              <span className="font-bold text-slate-800 truncate flex items-center gap-1.5">
                <span>{activeTab === 'circuito' ? '⚡' : activeModuleObj?.icon}</span>
                <span>{activeTab === 'circuito' ? 'Flujo Operativo Integrado' : activeModuleObj?.label}</span>
              </span>
            </div>
          </div>

          {/* Acciones y Estado en Header */}
          <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
            <div className="hidden lg:flex items-center gap-2 text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-lg font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{PHASES_CONFIG[contractedPhase]?.badge || currentConfig.badge}</span>
            </div>

            <Link
              to="/portal"
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border border-slate-300 flex items-center gap-1"
            >
              <span>Portal</span> ➔
            </Link>

            <button
              type="button"
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="bg-rose-50 hover:bg-rose-100 text-rose-700 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all border border-rose-200 flex items-center gap-1"
              title="Cerrar sesión"
            >
              <span>🔒</span> <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </header>

        {/* Lienzo de Trabajo: Máxima visibilidad, altura y área útil */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 md:p-6 bg-slate-100">
          <div className="max-w-[1850px] mx-auto w-full">
            {renderModuleContent()}
          </div>
        </div>
      </main>

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
