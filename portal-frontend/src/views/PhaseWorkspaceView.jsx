import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';

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
      { id: 'tesoreria', name: '[10] Tesorería', label: 'Tesorería', icon: '🏦' },
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
      { id: 'produccion', name: '[5] Producción', label: 'Producción', icon: '🏭' },
      { id: 'logistica', name: '[7] Logística', label: 'Logística', icon: '🚚' },
      { id: 'cxc', name: '[8] CxC', label: 'CxC', icon: '📄' },
      { id: 'cxp', name: '[9] CxP', label: 'CxP', icon: '💳' },
      { id: 'tesoreria', name: '[10] Tesorería', label: 'Tesorería', icon: '🏦' },
      { id: 'contabilidad', name: '[12] Contabilidad', label: 'Contabilidad', icon: '⚖️' },
      { id: 'rrhh', name: '[13] RRHH', label: 'RRHH', icon: '🧑‍💼' },
      { id: 'nomina', name: '[14] Nómina', label: 'Nómina', icon: '💵' },
      { id: 'processsuite', name: '[15] Process Suite', label: 'BPMN', icon: '🔄' },
      { id: 'wms', name: '[17] WMS', label: 'WMS', icon: '🏷️' },
      { id: 'dashboards', name: '[19] Dashboards', label: 'Dashboards', icon: '📈' }
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
      { id: 'produccion', name: '[5] Producción', label: 'Producción', icon: '🏭' },
      { id: 'logistica', name: '[7] Logística', label: 'Logística', icon: '🚚' },
      { id: 'cxc', name: '[8] CxC', label: 'CxC', icon: '📄' },
      { id: 'cxp', name: '[9] CxP', label: 'CxP', icon: '💳' },
      { id: 'tesoreria', name: '[10] Tesorería', label: 'Tesorería', icon: '🏦' },
      { id: 'activosfijos', name: '[11] Activos Fijos', label: 'Activos Fijos', icon: '🏗️' },
      { id: 'contabilidad', name: '[12] Contabilidad', label: 'Contabilidad', icon: '⚖️' },
      { id: 'rrhh', name: '[13] RRHH', label: 'RRHH', icon: '🧑‍💼' },
      { id: 'nomina', name: '[14] Nómina', label: 'Nómina', icon: '💵' },
      { id: 'processsuite', name: '[15] Process Suite', label: 'BPMN', icon: '🔄' },
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
    badge: 'Enterprise (26 Módulos)',
    price: '$499 USD/mes',
    imp: 'A Medida',
    color: 'purple',
    modules: [
      { id: 'ventas', name: '[1] Ventas', label: 'Ventas', icon: '💰' },
      { id: 'crm', name: '[2] CRM', label: 'CRM', icon: '👥' },
      { id: 'inventario', name: '[3] Inventario', label: 'Inventario', icon: '📦' },
      { id: 'compras', name: '[4] Compras', label: 'Compras', icon: '🛒' },
      { id: 'produccion', name: '[5] Producción', label: 'Producción', icon: '🏭' },
      { id: 'businesspartners', name: '[6] Partners', label: 'Partners', icon: '🤝' },
      { id: 'logistica', name: '[7] Logística', label: 'Logística', icon: '🚚' },
      { id: 'cxc', name: '[8] CxC', label: 'CxC', icon: '📄' },
      { id: 'cxp', name: '[9] CxP', label: 'CxP', icon: '💳' },
      { id: 'tesoreria', name: '[10] Tesorería', label: 'Tesorería', icon: '🏦' },
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
  const [activePhase, setActivePhase] = useState(1);
  const [activeTab, setActiveTab] = useState('circuito'); // 'circuito' o moduleId

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const p = parseInt(params.get('phase'), 10);
    const mod = params.get('mod');
    
    if (p >= 1 && p <= 4) {
      setActivePhase(p);
      localStorage.setItem('nytex_active_phase', p.toString());
    } else {
      const saved = parseInt(localStorage.getItem('nytex_active_phase'), 10);
      if (saved >= 1 && saved <= 4) {
        setActivePhase(saved);
      }
    }

    if (mod) {
      setActiveTab(mod);
    }
  }, [location]);

  const currentConfig = PHASES_CONFIG[activePhase] || PHASES_CONFIG[1];

  const handleSelectPhase = (pId) => {
    setActivePhase(pId);
    setActiveTab('circuito');
    localStorage.setItem('nytex_active_phase', pId.toString());
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
        
        {/* Fila 1: Selector de Fase Contratada & Estatus */}
        <div className="max-w-[1700px] mx-auto px-4 py-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div className="flex items-center gap-3">
            <Link to="/portal" className="font-black text-xl tracking-tight text-white flex items-center gap-2">
              <span className="bg-gradient-to-r from-blue-500 to-cyan-400 text-slate-950 px-2 py-0.5 rounded font-black text-sm">NyTEX</span>
              <span>Workspace</span>
            </Link>
            <span className="text-slate-400 text-xs hidden sm:inline">|</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-300">Plan Visualizado:</span>
              <div className="flex bg-slate-900/80 p-0.5 rounded-lg border border-slate-700">
                {[1, 2, 3, 4].map(pId => (
                  <button
                    key={pId}
                    onClick={() => handleSelectPhase(pId)}
                    className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                      activePhase === pId
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Fase {pId} ({PHASES_CONFIG[pId].modules.length} mód)
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center gap-2 text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-emerald-400 font-bold">Licencia Activa:</span>
              <strong className="text-white font-extrabold">{currentConfig.name}</strong>
            </div>

            <Link
              to="/portal"
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border border-slate-700"
            >
              Menú Principal (Portal) ➔
            </Link>
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

    </div>
  );
}
