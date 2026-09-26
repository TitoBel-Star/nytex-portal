import React, { useState, useEffect } from 'react';

const diagramDefinition = `flowchart TD
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
    IA -.-> PLAN`;

export const AREAS_CONFIG = [
  {
    num: 1,
    title: '1. Dirección Comercial',
    modulesText: 'CRM, Ventas',
    modules: ['CRM', 'Ventas'],
    badgeBg: 'bg-sky-500',
    colorText: 'text-sky-300',
    activeRing: 'ring-sky-400',
    activeBg: 'bg-sky-950/60 border-sky-400',
    hoverBorder: 'hover:border-sky-400/60'
  },
  {
    num: 2,
    title: '2. Cadena de Suministro',
    modulesText: 'Compras, Inventario, WMS, Logística',
    modules: ['Compras', 'Inventario', 'WMS', 'Logistica'],
    badgeBg: 'bg-emerald-500',
    colorText: 'text-emerald-300',
    activeRing: 'ring-emerald-400',
    activeBg: 'bg-emerald-950/60 border-emerald-400',
    hoverBorder: 'hover:border-emerald-400/60'
  },
  {
    num: 3,
    title: '3. Operaciones y Producción',
    modulesText: 'Producción',
    modules: ['Produccion'],
    badgeBg: 'bg-green-500',
    colorText: 'text-green-300',
    activeRing: 'ring-green-400',
    activeBg: 'bg-green-950/60 border-green-400',
    hoverBorder: 'hover:border-green-400/60'
  },
  {
    num: 4,
    title: '4. Administración y Finanzas',
    modulesText: 'CxP, CxC, Activos Fijos, Tesorería, Contabilidad',
    modules: ['CxP', 'CxC', 'ActivosFijos', 'Tesoreria', 'Contabilidad'],
    badgeBg: 'bg-amber-500',
    colorText: 'text-amber-300',
    activeRing: 'ring-amber-400',
    activeBg: 'bg-amber-950/60 border-amber-400',
    hoverBorder: 'hover:border-amber-400/60'
  },
  {
    num: 5,
    title: '5. Talento Humano',
    modulesText: 'RRHH, Nómina',
    modules: ['RRHH', 'Nomina'],
    badgeBg: 'bg-purple-600',
    colorText: 'text-purple-300',
    activeRing: 'ring-purple-400',
    activeBg: 'bg-purple-950/60 border-purple-400',
    hoverBorder: 'hover:border-purple-400/60'
  },
  {
    num: 6,
    title: '6. Inteligencia y Analítica',
    modulesText: 'BI, Dashboards, Big Data, Minería, Modelos, IA, Planeación',
    modules: ['BIyReportes', 'Dashboards', 'BI', 'BigData', 'MineriaDatos', 'Predictivos', 'IA', 'Planeacion'],
    badgeBg: 'bg-blue-600',
    colorText: 'text-blue-300',
    activeRing: 'ring-blue-400',
    activeBg: 'bg-blue-950/60 border-blue-400',
    hoverBorder: 'hover:border-blue-400/60'
  },
  {
    num: 7,
    title: '7. Gobernanza y TI',
    modulesText: 'Partners, Configuración, Process Suite, Process Mining',
    modules: ['BusinessPartners', 'Configuracion', 'ProcessSuite', 'ProcessMining'],
    badgeBg: 'bg-slate-600',
    colorText: 'text-slate-300',
    activeRing: 'ring-slate-400',
    activeBg: 'bg-slate-900/80 border-slate-400',
    hoverBorder: 'hover:border-slate-400/60'
  }
];

export default function NytexEcosistemaDiagram({ 
  highlightedModules = [], 
  selectedAreas = [],
  onToggleArea = () => {},
  onClearAreas = () => {},
  onClearPhase = () => {},
  activePhase = null
}) {
  const [zoom, setZoom] = useState(1);
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const renderChart = async () => {
      const container = document.getElementById('diagramWrapper-container');
      if (!container) return;

      if (window.mermaid) {
        try {
          window.mermaid.initialize({
            startOnLoad: false,
            theme: 'dark',
            securityLevel: 'loose',
            flowchart: { curve: 'basis', htmlLabels: true }
          });
          const id = 'mermaid-chart-' + Date.now();
          const { svg } = await window.mermaid.render(id, diagramDefinition);
          if (isMounted && container) {
            container.innerHTML = svg;
            setRendered(true);
          }
        } catch (err) {
          console.error("Mermaid error:", err);
        }
      }
    };

    renderChart();
    const timer = setTimeout(renderChart, 300);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);

  // Zoom management
  useEffect(() => {
    const svg = document.querySelector("#diagramWrapper-container svg");
    if (svg) {
      svg.style.transform = `scale(${zoom})`;
      svg.style.transformOrigin = "top center";
      svg.style.transition = "transform 0.2s ease";
    }
  }, [zoom, rendered]);

  // Dynamic Highlighting of Nodes in Diagram
  useEffect(() => {
    const container = document.getElementById('diagramWrapper-container');
    if (!container) return;
    const svg = container.querySelector('svg');
    if (!svg) return;

    const nodeElements = svg.querySelectorAll('g.node');
    if (!nodeElements || nodeElements.length === 0) return;

    const hasFilter = highlightedModules && highlightedModules.length > 0;

    nodeElements.forEach(g => {
      const text = (g.textContent || '').toLowerCase();
      let matches = false;

      if (hasFilter) {
        matches = highlightedModules.some(modId => {
          if (modId === 'Ventas' && text.includes('ventas')) return true;
          if (modId === 'CRM' && text.includes('crm')) return true;
          if (modId === 'Inventario' && text.includes('inventario')) return true;
          if (modId === 'Compras' && text.includes('compras')) return true;
          if (modId === 'Produccion' && text.includes('producción')) return true;
          if (modId === 'Contabilidad' && text.includes('contabilidad')) return true;
          if (modId === 'CxC' && (text.includes('cxc') || text.includes('cobranza'))) return true;
          if (modId === 'CxP' && (text.includes('cxp') || text.includes('deudas'))) return true;
          if (modId === 'Tesoreria' && (text.includes('tesorería') || text.includes('efectivo'))) return true;
          if (modId === 'ActivosFijos' && text.includes('activos fijos')) return true;
          if (modId === 'Logistica' && text.includes('logística')) return true;
          if (modId === 'RRHH' && text.includes('rrhh')) return true;
          if (modId === 'Nomina' && (text.includes('nómina') || text.includes('sueldos'))) return true;
          if (modId === 'ProcessSuite' && text.includes('process suite')) return true;
          if (modId === 'ProcessMining' && text.includes('process mining')) return true;
          if (modId === 'BusinessPartners' && text.includes('business partners')) return true;
          if (modId === 'BIyReportes' && text.includes('bi y reportes')) return true;
          if (modId === 'Configuracion' && text.includes('configuración')) return true;
          if (modId === 'WMS' && text.includes('wms')) return true;
          if (modId === 'Dashboards' && text.includes('dashboards')) return true;
          if (modId === 'BI' && text.includes('nytex bi') && !text.includes('reportes')) return true;
          if (modId === 'BigData' && text.includes('big data')) return true;
          if (modId === 'MineriaDatos' && text.includes('minería de datos')) return true;
          if (modId === 'IA' && text.includes('nytex ia')) return true;
          if (modId === 'Predictivos' && text.includes('predictivos')) return true;
          if (modId === 'Planeacion' && text.includes('planeación')) return true;
          return false;
        });
      }

      const shape = g.querySelector('rect, polygon, circle, path');

      if (!hasFilter) {
        g.style.opacity = '1';
        g.style.filter = 'none';
        g.style.transition = 'all 0.35s ease';
        if (shape) {
          shape.style.stroke = '';
          shape.style.strokeWidth = '';
        }
      } else if (matches) {
        // Highlighting in vibrant golden glow
        g.style.opacity = '1';
        g.style.filter = 'drop-shadow(0 0 12px #F59E0B) drop-shadow(0 0 24px #FBBF24)';
        g.style.transition = 'all 0.35s ease';
        if (shape) {
          shape.style.stroke = '#FBBF24';
          shape.style.strokeWidth = '4.5px';
        }
      } else {
        // Dimming non-selected nodes
        g.style.opacity = '0.2';
        g.style.filter = 'grayscale(85%)';
        g.style.transition = 'all 0.35s ease';
        if (shape) {
          shape.style.stroke = '';
          shape.style.strokeWidth = '';
        }
      }
    });
  }, [highlightedModules, rendered]);

  // Determine active areas for the right panel
  const isAreaActive = (area) => {
    if (selectedAreas.includes(area.num)) return true;
    if (!highlightedModules || highlightedModules.length === 0) return true;
    return area.modules.some(m => highlightedModules.includes(m));
  };

  const hasFilter = (highlightedModules && highlightedModules.length > 0) || selectedAreas.length > 0;

  return (
    <div className="bg-gradient-to-br from-gray-950 via-[#0a0f1d] to-[#0f172a] rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl border border-gray-800 mt-12 mb-16 text-white w-full">
      
      {/* Encabezado del marco */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <span className="bg-[#fbc044]/15 text-[#fbc044] border border-[#fbc044]/30 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest inline-block mb-3">
          Arquitectura Empresarial NyTEX
        </span>
        <h3 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          Ecosistema Operativo y Mapeo por Áreas Funcionales
        </h3>
        <p className="text-gray-400 text-sm md:text-base mt-3 leading-relaxed">
          Conozca la interconexión viva de las <strong className="text-white font-bold">26 aplicaciones</strong> de nuestro ecosistema, clasificadas según su <strong className="text-[#fbc044]">Dirección Estratégica</strong> y los departamentos que operan día a día.
        </p>
        {hasFilter && (
          <div className="mt-4 inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/40 text-amber-300 px-4 py-1.5 rounded-full text-xs font-bold animate-pulse flex-wrap justify-center">
            <span>
              ✨ Alumbrando en dorado {highlightedModules.length} aplicaciones 
              {selectedAreas.length > 0 
                ? ` (${selectedAreas.length} área${selectedAreas.length > 1 ? 's' : ''} seleccionada${selectedAreas.length > 1 ? 's' : ''})` 
                : ' correspondientes a la fase seleccionada'}
            </span>
            <button 
              type="button"
              onClick={() => { onClearAreas(); onClearPhase(); }}
              className="ml-2 bg-amber-400/20 hover:bg-amber-400/30 text-amber-200 px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-colors border border-amber-400/30"
              title="Quitar iluminación"
            >
              ✕ Quitar iluminación
            </button>
          </div>
        )}
      </div>

      {/* Grid Principal: 75% Diagrama + 25% Áreas Funcionales */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Columna Izquierda: Diagrama de Flujo (9 cols) */}
        <div className="lg:col-span-8 xl:col-span-9 bg-[#050814]/90 rounded-2xl p-5 border border-gray-800 shadow-xl flex flex-col">
          
          {/* Barra Superior del Diagrama */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-4 border-b border-gray-800/80">
            <div className="flex items-center gap-3">
              <span className="text-[#fbc044] text-lg font-bold">
                <i className="fas fa-project-diagram mr-2"></i>Diagrama Operativo de Sincronización
              </span>
              <span className="bg-gray-800/90 text-gray-300 text-xs px-2.5 py-1 rounded-full border border-gray-700 font-semibold">
                26 Módulos Conectados
              </span>
            </div>

            {/* Controles de Zoom */}
            <div className="flex items-center gap-1.5 bg-gray-900 border border-gray-700/80 rounded-lg p-1 shadow-inner text-xs">
              <span className="text-[10px] text-gray-400 px-2 font-mono uppercase font-bold">Zoom:</span>
              <button 
                type="button"
                onClick={() => setZoom(prev => Math.min(2.2, prev + 0.15))}
                className="w-7 h-7 flex items-center justify-center bg-gray-800 hover:bg-gray-700 text-gray-200 rounded font-bold transition-colors"
                title="Acercar"
              >
                +
              </button>
              <button 
                type="button"
                onClick={() => setZoom(prev => Math.max(0.5, prev - 0.15))}
                className="w-7 h-7 flex items-center justify-center bg-gray-800 hover:bg-gray-700 text-gray-200 rounded font-bold transition-colors"
                title="Alejar"
              >
                -
              </button>
              <button 
                type="button"
                onClick={() => setZoom(1)}
                className="w-7 h-7 flex items-center justify-center bg-gray-800 hover:bg-gray-700 text-gray-200 rounded font-bold transition-colors"
                title="Restablecer"
              >
                <i className="fas fa-expand-arrows-alt text-[10px]"></i>
              </button>
            </div>
          </div>

          {/* Contenedor del Diagrama */}
          <div 
            id="diagramWrapper-container" 
            className="overflow-x-auto overflow-y-hidden py-4 bg-[#02050e]/60 rounded-xl p-2 border border-gray-800/50 min-h-[580px] flex items-center justify-center"
          >
            <div className="text-gray-500 text-sm">Cargando Diagrama de Ecosistema...</div>
          </div>

        </div>

        {/* Columna Derecha: Tarjetas de Áreas Funcionales (3 cols) */}
        <div className="lg:col-span-4 xl:col-span-3 bg-[#050814]/80 rounded-2xl p-5 border border-gray-800 shadow-xl flex flex-col">
          
          <div className="border-b border-gray-800 pb-3 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <i className="fas fa-sitemap text-[#fbc044]"></i>
              <div>
                <h4 className="text-sm font-extrabold text-white tracking-wide uppercase">Áreas Funcionales</h4>
                <p className="text-[10px] text-gray-400">Clic en 1 o varias para alumbrar</p>
              </div>
            </div>
            {selectedAreas.length > 0 && (
              <button 
                type="button"
                onClick={onClearAreas}
                className="text-[10px] bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded-full font-bold transition-all flex items-center gap-1"
                title="Deseleccionar todas las áreas"
              >
                <span>Limpiar ({selectedAreas.length})</span> ✕
              </button>
            )}
          </div>

          <div className="space-y-2">
            {AREAS_CONFIG.map((area) => {
              const isDirectlySelected = selectedAreas.includes(area.num);
              const active = isAreaActive(area);
              const hasAnySelection = (highlightedModules && highlightedModules.length > 0) || selectedAreas.length > 0;

              let cardClasses = "border rounded-xl p-2.5 transition-all duration-200 flex items-start gap-2.5 cursor-pointer select-none ";
              
              if (isDirectlySelected) {
                // Actively selected by user click: brilliant golden halo
                cardClasses += "bg-gradient-to-r from-amber-950/70 to-yellow-950/50 border-amber-400 ring-2 ring-amber-400/90 shadow-[0_0_22px_rgba(245,158,11,0.6)] transform scale-[1.02] z-10";
              } else if (hasAnySelection && active) {
                // Active because of a selected phase or sharing modules
                cardClasses += `${area.activeBg} ring-2 ${area.activeRing} opacity-100 shadow-md hover:scale-[1.01]`;
              } else if (!hasAnySelection) {
                // Idle state
                cardClasses += `bg-gray-900/90 border-gray-800 ${area.hoverBorder} hover:bg-gray-850 hover:scale-[1.01] opacity-100`;
              } else {
                // Dimmed state when other areas/phases are active
                cardClasses += `bg-gray-900/40 border-gray-800/40 opacity-35 grayscale hover:opacity-85 hover:grayscale-0 hover:border-gray-700`;
              }

              return (
                <div 
                  key={area.num}
                  role="button"
                  tabIndex={0}
                  onClick={() => onToggleArea(area.num)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onToggleArea(area.num); }}
                  title={`Haga clic para ${isDirectlySelected ? 'desactivar' : 'activar y alumbrar'} ${area.title}`}
                  className={cardClasses}
                >
                  <div className={`w-5 h-5 rounded ${isDirectlySelected ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300' : area.badgeBg + ' text-white'} font-black flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5 shadow-sm transition-all`}>
                    {area.num}
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h5 className="text-white font-bold text-xs leading-tight">{area.title}</h5>
                      {isDirectlySelected && (
                        <span className="bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 text-[9px] font-black px-1.5 py-0.2 rounded shadow-sm tracking-wide">
                          ✓ ACTIVA
                        </span>
                      )}
                      {!isDirectlySelected && hasAnySelection && active && (
                        <span className="bg-sky-400/20 text-sky-300 border border-sky-400/40 text-[9px] font-bold px-1.5 py-0.2 rounded">
                          EN FASE
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-400 mt-0.5 leading-snug">
                      <span className="text-[9px] text-gray-500 uppercase">Módulos:</span> <span className={isDirectlySelected ? 'text-amber-200 font-semibold' : area.colorText + ' font-medium'}>{area.modulesText}</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>

    </div>
  );
}
