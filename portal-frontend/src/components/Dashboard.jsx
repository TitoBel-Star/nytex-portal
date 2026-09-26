import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PaymentSimulatorModal from './PaymentSimulatorModal';

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

  const [activePhase, setActivePhase] = useState(null);
  const [customModules, setCustomModules] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPhaseForPayment, setSelectedPhaseForPayment] = useState(null);

  // Initialize and render Mermaid diagram
  useEffect(() => {
    // Expose zoom functions to window for the buttons in diagram
    window.currentDiagramZoom = 1;
    window.adjustDiagramZoom = function(delta) {
      window.currentDiagramZoom = Math.max(0.6, Math.min(2.5, window.currentDiagramZoom + delta));
      window.applyDiagramZoom();
    };
    window.resetDiagramZoom = function() {
      window.currentDiagramZoom = 1;
      window.applyDiagramZoom();
    };
    window.applyDiagramZoom = function() {
      const svg = document.querySelector("#diagramWrapper .mermaid svg");
      if (svg) {
        svg.style.transform = "scale(" + window.currentDiagramZoom + ")";
        svg.style.transformOrigin = "top center";
      }
    };

    const renderMermaid = async () => {
      if (window.mermaid) {
        try {
          window.mermaid.initialize({
            startOnLoad: false,
            theme: 'dark',
            securityLevel: 'loose',
            flowchart: { curve: 'basis' }
          });
          await window.mermaid.run({ querySelector: '.mermaid' });
        } catch (e) {
          console.error("Mermaid run error:", e);
        }
      }
    };

    renderMermaid();
    const timer = setTimeout(renderMermaid, 600);
    return () => clearTimeout(timer);
  }, []);

  // Parse URL query params
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

  const handleContratar = (phaseId, phaseModules) => {
    if (phaseId === 4 && !user.customQuoteAmount) {
      alert("Su cotización está siendo calculada por nuestro equipo de ventas. Le contactaremos en breve o use el panel de pruebas abajo para simular una cotización.");
      return;
    }

    let amount = 0;
    let title = "";

    if (phaseId === 1) { amount = 0; title = "Fase 1: NyTEX Starter"; }
    else if (phaseId === 2) { amount = 1500; title = "Fase 2: NyTEX Express"; }
    else if (phaseId === 3) { amount = 4500; title = "Fase 3: NyTEX Advanced"; }
    else if (phaseId === 4) { 
      amount = user.customQuoteAmount || 0; 
      title = "Fase 4: NyTEX Enterprise"; 
    }
    else if (phaseId === 'custom') {
      amount = customModules.length * 400;
      title = "Plan a su medida (" + customModules.length + " Módulos)";
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
    login({
      ...user,
      subscriptions: newSubscriptions
    });
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
        {user.customQuoteAmount && (
          <div className="mb-8 p-4 bg-gradient-to-r from-purple-900 to-indigo-900 border border-purple-500 rounded-xl flex justify-between items-center text-white shadow-lg">
            <div>
              <h3 className="font-bold text-lg text-purple-200">¡Tiene una cotización personalizada lista!</h3>
              <p className="text-sm text-gray-300">Monto aprobado para Fase 4: <strong>${user.customQuoteAmount.toLocaleString()} USD</strong></p>
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
                className="bg-[#2A114B] border border-white/10 rounded-xl p-5 hover:border-white/30 transition-all flex flex-col text-white"
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
                  className={`w-full py-2 px-4 rounded text-sm font-bold transition-colors border mb-2 ${
                    activePhase === phase.id 
                      ? 'bg-[#15A36A] border-[#15A36A] text-white shadow-md' 
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
                    phase.id === 4 && !user.customQuoteAmount 
                    ? 'bg-purple-600 hover:bg-purple-700 text-white border-purple-600'
                    : 'bg-[#0070BA] hover:bg-[#005ea6] text-white border-transparent'
                  }`}
                >
                  {phase.id === 4 && !user.customQuoteAmount ? 'SOLICITAR COTIZACIÓN' : 'CONTRATAR EN PORTAL'}
                </button>
              </div>
            ))}

            {/* Tarjeta: A su medida */}
            <div className="bg-[#2A114B] border border-white/10 rounded-xl p-5 hover:border-white/30 transition-all flex flex-col text-white">
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
                className={`w-full py-2 px-4 rounded text-sm font-bold transition-colors border mb-2 ${
                  activePhase === 'custom' 
                    ? 'bg-[#15A36A] border-[#15A36A] text-white shadow-md' 
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

        {/* Sección: Grid de 26 Módulos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {modulesList.map((mod) => {
            const hasAccess = user.subscriptions.includes(mod.id);
            const isHighlighted = highlightedModules.includes(mod.id);
            const isCardActive = hasAccess || isHighlighted;

            return (
              <div 
                key={mod.id} 
                className={`relative bg-white rounded-xl overflow-hidden border transition-all duration-300 ${
                  isHighlighted 
                    ? 'border-[#15A36A] ring-4 ring-[#15A36A] shadow-[0_0_20px_rgba(21,163,106,0.8)] transform scale-105 z-20 opacity-100' 
                    : hasAccess 
                      ? 'border-[#15A36A] shadow-md opacity-100 z-10' 
                      : 'border-[var(--nytex-border)] opacity-60 z-0'
                }`}
              >
                <div className="p-6 flex flex-col h-full">
                  <h3 className="text-xl font-extrabold text-[var(--nytex-navy)] mb-2">{mod.name}</h3>
                  <p className="text-[var(--nytex-text)] mb-6 flex-grow">{mod.description}</p>
                  
                  {isCardActive ? (
                    <Link 
                      to={`/app/` + mod.id.toLowerCase()} 
                      className="mt-auto block w-full text-center bg-[#15A36A] text-white py-2 px-4 rounded-md font-bold hover:bg-[#108253] transition-colors shadow-lg"
                    >
                      Abrir Módulo
                    </Link>
                  ) : (
                    <button 
                      disabled 
                      className="mt-auto block w-full text-center bg-[var(--nytex-ice)] text-[var(--nytex-navy)] py-2 px-4 rounded-md font-bold border border-[var(--nytex-border)] cursor-not-allowed"
                    >
                      Módulo Bloqueado
                    </button>
                  )}
                </div>

                {/* Badges */}
                {!isCardActive && (
                  <div className="absolute top-0 right-0 bg-gray-400 text-white px-3 py-1 text-xs font-extrabold rounded-bl-lg shadow-sm">
                    REQUERIDO
                  </div>
                )}
                {isCardActive && (
                  <div className="absolute top-0 right-0 bg-[#15A36A] text-white px-3 py-1 text-xs font-extrabold rounded-bl-lg shadow-sm">
                    ADQUIRIDO
                  </div>
                )}
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

        {/* Diagrama Completo de Ecosistema NyTEX (26 Módulos + 7 Áreas Funcionales) */}
        <div 
          className="w-full mt-12 mb-16"
          dangerouslySetInnerHTML={{ __html: `
            <div class="bg-gradient-to-br from-gray-950 via-[#0a0f1d] to-[#0f172a] rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl border border-gray-800 mt-12 mb-16">
                
                <div class="text-center max-w-3xl mx-auto mb-10">
                    <span class="bg-brand-accent/15 text-brand-accent border border-brand-accent/30 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest inline-block mb-3">
                        <i class="fas fa-network-wired mr-1.5"></i> Arquitectura Empresarial NyTEX
                    </span>
                    <h3 class="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Ecosistema Operativo y Mapeo por Áreas Funcionales</h3>
                    <p class="text-gray-400 text-sm md:text-base mt-3 leading-relaxed">
                        Conozca la interconexión viva de las <strong class="text-white font-bold">26 aplicaciones</strong> de nuestro ecosistema, clasificadas según su <strong class="text-brand-accent">Dirección Estratégica</strong> y los departamentos que operan día a día.
                    </p>
                </div>

                
                
                <style>
                    #diagramWrapper .mermaid svg {
                        width: 100% !important;
                        min-width: 920px !important;
                        max-width: none !important;
                        height: auto !important;
                        margin: 0 auto;
                        transition: transform 0.2s ease;
                    }
                </style>

                
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                    
                    
                    <div class="lg:col-span-8 xl:col-span-9 bg-[#030712]/95 rounded-2xl p-4 sm:p-5 border border-gray-800/80 shadow-inner flex flex-col">
                        <div class="flex flex-wrap items-center justify-between pb-3 mb-3 border-b border-gray-800 gap-2">
                            <div class="flex items-center gap-2">
                                <span class="text-xs font-bold text-gray-200 flex items-center gap-1.5">
                                    <i class="fas fa-project-diagram text-brand-accent"></i> Diagrama Operativo de Sincronización
                                </span>
                                <span class="text-[10px] font-semibold bg-gray-800/90 text-gray-400 px-2 py-0.5 rounded-full border border-gray-700">
                                    26 Módulos Conectados
                                </span>
                            </div>

                            
                            <div class="flex items-center gap-1.5 bg-gray-900 border border-gray-700/80 px-2 py-1 rounded-lg">
                                <span class="text-gray-400 text-[10px] font-semibold mr-1">Zoom:</span>
                                <button type="button" onclick="adjustDiagramZoom(0.15)" class="w-6 h-6 rounded bg-gray-800 hover:bg-gray-700 text-gray-200 flex items-center justify-center text-[10px] transition-colors" title="Ampliar diagrama">
                                    <i class="fas fa-plus"></i>
                                </button>
                                <button type="button" onclick="adjustDiagramZoom(-0.15)" class="w-6 h-6 rounded bg-gray-800 hover:bg-gray-700 text-gray-200 flex items-center justify-center text-[10px] transition-colors" title="Reducir diagrama">
                                    <i class="fas fa-minus"></i>
                                </button>
                                <button type="button" onclick="resetDiagramZoom()" class="w-6 h-6 rounded bg-gray-800 hover:bg-gray-700 text-gray-200 flex items-center justify-center text-[10px] transition-colors" title="Restablecer tamaño">
                                    <i class="fas fa-compress-arrows-alt"></i>
                                </button>
                            </div>
                        </div>

                        
                        <div id="diagramWrapper" class="overflow-x-auto py-3 bg-[#02050e]/60 rounded-xl p-2 border border-gray-800/50 min-h-[560px] flex items-center justify-center">
                            <pre class="mermaid text-center w-full">
flowchart TD
    classDef sales fill:#0284C7,stroke:#38BDF8,stroke-width:2.5px,color:#FFFFFF,font-size:14px
    classDef supply fill:#15803D,stroke:#4ADE80,stroke-width:2.5px,color:#FFFFFF,font-size:14px
    classDef prod fill:#047857,stroke:#34D399,stroke-width:2.5px,color:#FFFFFF,font-size:14px
    classDef finance fill:#B45309,stroke:#FBBF24,stroke-width:2.5px,color:#FFFFFF,font-size:14px
    classDef hr fill:#7E22CE,stroke:#C084FC,stroke-width:2.5px,color:#FFFFFF,font-size:14px
    classDef data fill:#0F172A,stroke:#60A5FA,stroke-width:2.5px,color:#93C5FD,font-size:14px
    classDef core fill:#1E293B,stroke:#94A3B8,stroke-width:2.5px,color:#FFFFFF,font-size:14px

    BP["<span style='font-size:11px;font-weight:bold;color:#94a3b8'>ÁREA 7</span><br/><b>NyTEX Business Partners</b><br/><span style='font-size:12px'>Clientes y Proveedores</span>"]:::core
    CONF["<span style='font-size:11px;font-weight:bold;color:#94a3b8'>ÁREA 7</span><br/><b>NyTEX Configuración</b><br/><span style='font-size:12px'>Parámetros Globales</span>"]:::core
    PS["<span style='font-size:11px;font-weight:bold;color:#94a3b8'>ÁREA 7</span><br/><b>NyTEX Process Suite</b><br/><span style='font-size:12px'>Reglas de Negocio</span>"]:::core
    PM["<span style='font-size:11px;font-weight:bold;color:#94a3b8'>ÁREA 7</span><br/><b>NyTEX Process Mining</b><br/><span style='font-size:12px'>Minería de Procesos</span>"]:::core

    CRM["<span style='font-size:11px;font-weight:bold;color:#bae6fd'>ÁREA 1</span><br/><b>NyTEX CRM</b><br/><span style='font-size:12px'>Embudo de Ventas</span>"]:::sales
    VTS["<span style='font-size:11px;font-weight:bold;color:#bae6fd'>ÁREA 1</span><br/><b>NyTEX Ventas</b><br/><span style='font-size:12px'>Cotizaciones y Pedidos</span>"]:::sales
    CXC["<span style='font-size:11px;font-weight:bold;color:#fde68a'>ÁREA 4</span><br/><b>NyTEX CxC</b><br/><span style='font-size:12px'>Gestión de Cobranza</span>"]:::finance

    PLAN["<span style='font-size:11px;font-weight:bold;color:#93c5fd'>ÁREA 6</span><br/><b>NyTEX Planeación</b><br/><span style='font-size:12px'>MRP y Pronósticos</span>"]:::data
    COMP["<span style='font-size:11px;font-weight:bold;color:#bbf7d0'>ÁREA 2</span><br/><b>NyTEX Compras</b><br/><span style='font-size:12px'>Órdenes y Requisiciones</span>"]:::supply
    INV["<span style='font-size:11px;font-weight:bold;color:#bbf7d0'>ÁREA 2</span><br/><b>NyTEX Inventario</b><br/><span style='font-size:12px'>Control de Stock</span>"]:::supply
    WMS["<span style='font-size:11px;font-weight:bold;color:#bbf7d0'>ÁREA 2</span><br/><b>NyTEX WMS</b><br/><span style='font-size:12px'>Gestión de Bodegas</span>"]:::supply
    PROD["<span style='font-size:11px;font-weight:bold;color:#a7f3d0'>ÁREA 3</span><br/><b>NyTEX Producción</b><br/><span style='font-size:12px'>Recetas y Órdenes</span>"]:::prod
    LOG["<span style='font-size:11px;font-weight:bold;color:#bbf7d0'>ÁREA 2</span><br/><b>NyTEX Logística</b><br/><span style='font-size:12px'>Rutas y Despachos</span>"]:::supply

    CXP["<span style='font-size:11px;font-weight:bold;color:#fde68a'>ÁREA 4</span><br/><b>NyTEX CxP</b><br/><span style='font-size:12px'>Control de Deudas</span>"]:::finance
    TES["<span style='font-size:11px;font-weight:bold;color:#fde68a'>ÁREA 4</span><br/><b>NyTEX Tesorería</b><br/><span style='font-size:12px'>Flujo de Efectivo</span>"]:::finance
    CONT["<span style='font-size:11px;font-weight:bold;color:#fde68a'>ÁREA 4</span><br/><b>NyTEX Contabilidad</b><br/><span style='font-size:12px'>Pólizas y Balances</span>"]:::finance
    AF["<span style='font-size:11px;font-weight:bold;color:#fde68a'>ÁREA 4</span><br/><b>NyTEX Activos Fijos</b><br/><span style='font-size:12px'>Depreciaciones</span>"]:::finance

    RRHH["<span style='font-size:11px;font-weight:bold;color:#e9d5ff'>ÁREA 5</span><br/><b>NyTEX RRHH</b><br/><span style='font-size:12px'>Expedientes</span>"]:::hr
    NOM["<span style='font-size:11px;font-weight:bold;color:#e9d5ff'>ÁREA 5</span><br/><b>NyTEX Nómina</b><br/><span style='font-size:12px'>Cálculo de Sueldos</span>"]:::hr

    DASH["<span style='font-size:11px;font-weight:bold;color:#93c5fd'>ÁREA 6</span><br/><b>NyTEX Dashboards</b><br/><span style='font-size:12px'>KPIs Operativos</span>"]:::data
    BI_R["<span style='font-size:11px;font-weight:bold;color:#93c5fd'>ÁREA 6</span><br/><b>NyTEX BI y Reportes</b><br/><span style='font-size:12px'>Consultas</span>"]:::data
    BI["<span style='font-size:11px;font-weight:bold;color:#93c5fd'>ÁREA 6</span><br/><b>NyTEX BI</b><br/><span style='font-size:12px'>Inteligencia</span>"]:::data
    BD["<span style='font-size:11px;font-weight:bold;color:#93c5fd'>ÁREA 6</span><br/><b>NyTEX Big Data</b><br/><span style='font-size:12px'>Lagos de Datos</span>"]:::data
    MIN["<span style='font-size:11px;font-weight:bold;color:#93c5fd'>ÁREA 6</span><br/><b>NyTEX Minería de Datos</b><br/><span style='font-size:12px'>Data Mining</span>"]:::data
    PRED["<span style='font-size:11px;font-weight:bold;color:#93c5fd'>ÁREA 6</span><br/><b>NyTEX Modelos Predictivos</b>"]:::data
    IA["<span style='font-size:11px;font-weight:bold;color:#93c5fd'>ÁREA 6</span><br/><b>NyTEX IA</b><br/><span style='font-size:12px'>Decisiones Autónomas</span>"]:::data

    BP ==> CRM
    BP ==> VTS
    BP ==> COMP
    CONF -.-> PS
    CONF -.-> PM
    RRHH -.-> PS
    CRM ==> VTS
    VTS ==> CXC
    CXC ==> TES
    PLAN ==> COMP
    PLAN ==> PROD
    COMP ==> CXP
    CXP ==> TES
    COMP ===> INV
    INV ===> WMS
    INV ===> PROD
    PROD ===> INV
    VTS ===> LOG
    INV ===> LOG
    TES ===> CONT
    AF ===> CONT
    RRHH ===> NOM
    NOM ===> TES
    CONT -.-> DASH
    VTS -.-> BI_R
    INV -.-> BI
    WMS -.-> BD
    BD -.-> MIN
    MIN -.-> PRED
    BD -.-> PRED
    PRED -.-> IA
    IA -.-> PLAN
                            </pre>
                        </div>
                    </div>

                    
                    <div class="lg:col-span-4 xl:col-span-3 bg-[#030712]/95 rounded-2xl p-3.5 sm:p-4 border border-gray-800/80 shadow-inner flex flex-col">
                        <div class="mb-3 pb-2 border-b border-gray-800">
                            <h4 class="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                                <i class="fas fa-sitemap text-brand-accent"></i> ÁREAS FUNCIONALES
                            </h4>
                            <p class="text-[10px] text-gray-400">Mapeo organizacional NyTEX</p>
                        </div>

                        <div class="space-y-1.5">
                            
                            <div class="bg-gray-900/90 hover:bg-gray-800/70 border border-gray-800 hover:border-sky-500/50 rounded-lg p-2 transition-all flex items-start gap-2">
                                <div class="w-5 h-5 rounded bg-sky-500 text-white font-black flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5 shadow-sm">1</div>
                                <div class="flex-grow min-w-0">
                                    <h5 class="text-white font-bold text-xs leading-tight truncate">1. Dirección Comercial</h5>
                                    <p class="text-[10px] text-gray-400 mt-0.5 leading-snug">
                                        <span class="text-[9px] text-gray-500 uppercase">Módulos:</span> <span class="text-sky-300 font-medium">CRM, Ventas</span>
                                    </p>
                                </div>
                            </div>

                            
                            <div class="bg-gray-900/90 hover:bg-gray-800/70 border border-gray-800 hover:border-emerald-500/50 rounded-lg p-2 transition-all flex items-start gap-2">
                                <div class="w-5 h-5 rounded bg-emerald-500 text-white font-black flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5 shadow-sm">2</div>
                                <div class="flex-grow min-w-0">
                                    <h5 class="text-white font-bold text-xs leading-tight truncate">2. Cadena de Suministro</h5>
                                    <p class="text-[10px] text-gray-400 mt-0.5 leading-snug">
                                        <span class="text-[9px] text-gray-500 uppercase">Módulos:</span> <span class="text-emerald-300 font-medium">Compras, Inventario, WMS, Logística</span>
                                    </p>
                                </div>
                            </div>

                            
                            <div class="bg-gray-900/90 hover:bg-gray-800/70 border border-gray-800 hover:border-green-500/50 rounded-lg p-2 transition-all flex items-start gap-2">
                                <div class="w-5 h-5 rounded bg-green-500 text-white font-black flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5 shadow-sm">3</div>
                                <div class="flex-grow min-w-0">
                                    <h5 class="text-white font-bold text-xs leading-tight truncate">3. Operaciones y Producción</h5>
                                    <p class="text-[10px] text-gray-400 mt-0.5 leading-snug">
                                        <span class="text-[9px] text-gray-500 uppercase">Módulos:</span> <span class="text-green-300 font-medium">Producción</span>
                                    </p>
                                </div>
                            </div>

                            
                            <div class="bg-gray-900/90 hover:bg-gray-800/70 border border-gray-800 hover:border-amber-500/50 rounded-lg p-2 transition-all flex items-start gap-2">
                                <div class="w-5 h-5 rounded bg-amber-500 text-white font-black flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5 shadow-sm">4</div>
                                <div class="flex-grow min-w-0">
                                    <h5 class="text-white font-bold text-xs leading-tight truncate">4. Administración y Finanzas</h5>
                                    <p class="text-[10px] text-gray-400 mt-0.5 leading-snug">
                                        <span class="text-[9px] text-gray-500 uppercase">Módulos:</span> <span class="text-amber-300 font-medium">CxP, CxC, Activos Fijos, Tesorería, Contabilidad</span>
                                    </p>
                                </div>
                            </div>

                            
                            <div class="bg-gray-900/90 hover:bg-gray-800/70 border border-gray-800 hover:border-purple-500/50 rounded-lg p-2 transition-all flex items-start gap-2">
                                <div class="w-5 h-5 rounded bg-purple-600 text-white font-black flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5 shadow-sm">5</div>
                                <div class="flex-grow min-w-0">
                                    <h5 class="text-white font-bold text-xs leading-tight truncate">5. Talento Humano</h5>
                                    <p class="text-[10px] text-gray-400 mt-0.5 leading-snug">
                                        <span class="text-[9px] text-gray-500 uppercase">Módulos:</span> <span class="text-purple-300 font-medium">RRHH, Nómina</span>
                                    </p>
                                </div>
                            </div>

                            
                            <div class="bg-gray-900/90 hover:bg-gray-800/70 border border-gray-800 hover:border-blue-500/50 rounded-lg p-2 transition-all flex items-start gap-2">
                                <div class="w-5 h-5 rounded bg-blue-600 text-white font-black flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5 shadow-sm">6</div>
                                <div class="flex-grow min-w-0">
                                    <h5 class="text-white font-bold text-xs leading-tight truncate">6. Inteligencia y Analítica</h5>
                                    <p class="text-[10px] text-gray-400 mt-0.5 leading-snug">
                                        <span class="text-[9px] text-gray-500 uppercase">Módulos:</span> <span class="text-blue-300 font-medium">BI, Dashboards, Big Data, Minería, Modelos, IA, Planeación</span>
                                    </p>
                                </div>
                            </div>

                            
                            <div class="bg-gray-900/90 hover:bg-gray-800/70 border border-gray-800 hover:border-slate-500/50 rounded-lg p-2 transition-all flex items-start gap-2">
                                <div class="w-5 h-5 rounded bg-slate-600 text-white font-black flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5 shadow-sm">7</div>
                                <div class="flex-grow min-w-0">
                                    <h5 class="text-white font-bold text-xs leading-tight truncate">7. Gobernanza y TI</h5>
                                    <p class="text-[10px] text-gray-400 mt-0.5 leading-snug">
                                        <span class="text-[9px] text-gray-500 uppercase">Módulos:</span> <span class="text-slate-300 font-medium">Partners, Configuración, Process Suite, Process Mining</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                
                <script>
                    let currentDiagramZoom = 1;
                    function adjustDiagramZoom(delta) {
                        currentDiagramZoom = Math.max(0.6, Math.min(2.5, currentDiagramZoom + delta));
                        applyDiagramZoom();
                    }
                    function resetDiagramZoom() {
                        currentDiagramZoom = 1;
                        applyDiagramZoom();
                    }
                    function applyDiagramZoom() {
                        const svg = document.querySelector("#diagramWrapper .mermaid svg");
                        if (svg) {
                            svg.style.transform = "scale(" + currentDiagramZoom + ")";
                            svg.style.transformOrigin = "top center";
                        }
                    }
                </script>

                </div>` }} 
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
