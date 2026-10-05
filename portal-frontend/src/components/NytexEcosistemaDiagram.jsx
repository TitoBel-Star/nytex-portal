import React, { useState } from 'react';

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
    modulesText: 'Compras, ROP Inteligente, Inventario, WMS, Logística',
    modules: ['Compras', 'Rop', 'Inventario', 'WMS', 'Logistica'],
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
    modulesText: 'CxP, CxC, Tesorería, Contabilidad',
    modules: ['CxP', 'CxC', 'Tesoreria', 'Contabilidad'],
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
    modulesText: 'BI y Reportes, Dashboards, Big Data, Minería, Modelos, IA, Planeación',
    modules: ['BIyReportes', 'Dashboards', 'BigData', 'MineriaDatos', 'Predictivos', 'IA', 'Planeacion'],
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

  // Check if a module is currently highlighted
  const isModuleHighlighted = (modId) => {
    return highlightedModules && highlightedModules.includes(modId);
  };

  const hasFilter = (highlightedModules && highlightedModules.length > 0) || selectedAreas.length > 0;

  // Determine active areas for the right panel
  const isAreaActive = (area) => {
    if (selectedAreas.includes(area.num)) return true;
    if (!highlightedModules || highlightedModules.length === 0) return true;
    return area.modules.some(m => highlightedModules.includes(m));
  };

  // Helper for rendering a module node with dynamic golden glow
  const renderModuleNode = ({
    id,
    x,
    y,
    width,
    height,
    title,
    subtitle = '',
    bgColor,
    defaultStroke = '#eab308',
    titleColor = '#ffffff',
    subtitleColor = '#cbd5e1',
    titleSize = 11,
    subtitleSize = 9
  }) => {
    const highlighted = isModuleHighlighted(id);
    const opacity = hasFilter ? (highlighted ? 1 : 0.22) : 1;
    const filter = highlighted ? 'url(#golden-glow)' : (hasFilter ? 'grayscale(80%)' : undefined);
    const stroke = highlighted ? '#FBBF24' : defaultStroke;
    const strokeWidth = highlighted ? 3.5 : 1.5;

    return (
      <g
        id={`node-${id}`}
        key={id}
        className="cursor-pointer transition-all duration-300"
        style={{ opacity, filter }}
      >
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          rx={4}
          fill={bgColor}
          stroke={stroke}
          strokeWidth={strokeWidth}
          className="transition-all duration-300"
        />
        {subtitle ? (
          <>
            <text
              x={x + width / 2}
              y={y + height / 2 - 3}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={titleColor}
              fontSize={titleSize}
              fontWeight="bold"
              fontFamily="system-ui, -apple-system, sans-serif"
            >
              {title}
            </text>
            <text
              x={x + width / 2}
              y={y + height / 2 + 11}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={subtitleColor}
              fontSize={subtitleSize}
              fontFamily="system-ui, -apple-system, sans-serif"
            >
              {subtitle}
            </text>
          </>
        ) : (
          <text
            x={x + width / 2}
            y={y + height / 2 + 1}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={titleColor}
            fontSize={titleSize}
            fontWeight="bold"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            {title}
          </text>
        )}
      </g>
    );
  };

  // Helper for connection label pills
  const renderLabelBadge = (x, y, width, height, text) => (
    <g key={text}>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={3}
        fill="#0b1b36"
        stroke="#1e40af"
        strokeWidth={1}
      />
      <text
        x={x + width / 2}
        y={y + height / 2 + 1}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#e2e8f0"
        fontSize={9.5}
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        {text}
      </text>
    </g>
  );

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
          Conozca la interconexión viva de las <strong className="text-white font-bold">24 aplicaciones</strong> de nuestro ecosistema, clasificadas según su <strong className="text-[#fbc044]">Dirección Estratégica</strong> y los departamentos que operan día a día.
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
              className="ml-2 bg-amber-400/20 hover:bg-amber-400/30 text-amber-200 px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-colors border border-amber-400/30 cursor-pointer"
              title="Quitar iluminación"
            >
              ✕ Quitar iluminación
            </button>
          </div>
        )}
      </div>

      {/* Grid Principal: 75% Diagrama + 25% Áreas Funcionales */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Columna Izquierda: Diagrama SVG (9 cols) */}
        <div className="lg:col-span-8 xl:col-span-9 bg-[#050814]/90 rounded-2xl p-5 border border-gray-800 shadow-xl flex flex-col">
          
          {/* Barra Superior del Diagrama */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-4 border-b border-gray-800/80">
            <div className="flex items-center gap-3">
              <span className="text-[#fbc044] text-lg font-bold flex items-center gap-2">
                <i className="fas fa-project-diagram"></i>
                <span>Diagrama Operativo de Sincronización</span>
              </span>
              <span className="bg-gray-800/90 text-gray-300 text-xs px-2.5 py-1 rounded-full border border-gray-700 font-semibold">
                24 Módulos Conectados
              </span>
            </div>

            {/* Controles de Zoom */}
            <div className="flex items-center gap-1.5 bg-gray-900 border border-gray-700/80 rounded-lg p-1 shadow-inner text-xs">
              <span className="text-[10px] text-gray-400 px-2 font-mono uppercase font-bold">Zoom:</span>
              <button 
                type="button"
                onClick={() => setZoom(prev => Math.min(2.0, +(prev + 0.15).toFixed(2)))}
                className="w-7 h-7 flex items-center justify-center bg-gray-800 hover:bg-gray-700 text-gray-200 rounded font-bold transition-colors cursor-pointer"
                title="Acercar"
              >
                +
              </button>
              <button 
                type="button"
                onClick={() => setZoom(prev => Math.max(0.6, +(prev - 0.15).toFixed(2)))}
                className="w-7 h-7 flex items-center justify-center bg-gray-800 hover:bg-gray-700 text-gray-200 rounded font-bold transition-colors cursor-pointer"
                title="Alejar"
              >
                -
              </button>
              <button 
                type="button"
                onClick={() => setZoom(1)}
                className="w-7 h-7 flex items-center justify-center bg-gray-800 hover:bg-gray-700 text-gray-200 rounded font-bold transition-colors cursor-pointer"
                title="Restablecer"
              >
                <i className="fas fa-expand-arrows-alt text-[10px]"></i>
              </button>
            </div>
          </div>

          {/* Contenedor del Diagrama */}
          <div 
            id="diagramWrapper-container" 
            className="overflow-x-auto overflow-y-hidden py-4 bg-[#050814] rounded-xl p-2 border border-gray-800/50 min-h-[580px] flex items-center justify-center"
          >
            <div 
              style={{ 
                transform: `scale(${zoom})`, 
                transformOrigin: 'top center',
                transition: 'transform 0.2s ease',
                width: '100%',
                minWidth: '920px',
                maxWidth: '1080px'
              }}
            >
              <svg 
                viewBox="0 0 1024 940" 
                className="w-full h-auto select-none"
                style={{ filter: 'drop-shadow(0 10px 25px rgba(0,0,0,0.5))' }}
              >
                <defs>
                  {/* Filtro dorado brillante para módulos encendidos */}
                  <filter id="golden-glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#F59E0B" floodOpacity="0.9" />
                    <feDropShadow dx="0" dy="0" stdDeviation="14" floodColor="#FBBF24" floodOpacity="0.6" />
                  </filter>

                  {/* Flechas de conexión */}
                  <marker id="arrow-cyan" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#38bdf8" />
                  </marker>
                  <marker id="arrow-white" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#cbd5e1" />
                  </marker>
                  <marker id="arrow-slate" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#94a3b8" />
                  </marker>
                </defs>

                {/* ========================================================
                    SUBGRAFOS / CONTENEDORES PRINCIPALES
                   ======================================================== */}

                {/* 1. ÁREA 7: NÚCLEO MAESTRO & GOBERNANZA */}
                <g id="subgraph-area7">
                  <rect x="30" y="60" width="810" height="76" rx="2" fill="#080e1c" stroke="#334155" strokeWidth="1.5" />
                  <text x="42" y="76" fill="#f8fafc" fontSize="11" fontWeight="bold" fontFamily="system-ui, -apple-system, sans-serif">
                    ÁREA 7: NÚCLEO MAESTRO &amp; GOBERNANZA
                  </text>
                  <line x1="30" y1="84" x2="840" y2="84" stroke="#1e293b" strokeWidth="1" />
                </g>

                {/* 2. ÁREA 5: TALENTO HUMANO (Hire-to-Pay) */}
                <g id="subgraph-area5">
                  <rect x="858" y="16" width="156" height="136" rx="2" fill="#0c071a" stroke="#7e22ce" strokeWidth="1.5" />
                  <rect x="858" y="16" width="156" height="18" fill="#7e22ce" />
                  <text x="936" y="28" textAnchor="middle" dominantBaseline="middle" fill="#ffffff" fontSize="8.5" fontWeight="bold" fontFamily="system-ui, -apple-system, sans-serif">
                    ÁREA 5: TALENTO HUMANO (Hire-to-Pay)
                  </text>
                </g>

                {/* 3. ÁREA 1: CICLO COMERCIAL (Order-to-Cash) */}
                <g id="subgraph-area1">
                  <rect x="98" y="360" width="140" height="140" rx="2" fill="#051429" stroke="#0284c7" strokeWidth="1.5" />
                  <rect x="98" y="360" width="140" height="18" fill="#0284c7" />
                  <text x="168" y="372" textAnchor="middle" dominantBaseline="middle" fill="#ffffff" fontSize="7.8" fontWeight="bold" fontFamily="system-ui, -apple-system, sans-serif">
                    ÁREA 1: CICLO COMERCIAL (Order-to-Cash)
                  </text>
                </g>

                {/* 4. ÁREA 6: CAPA ESTRATÉGICA & ANALÍTICA */}
                <g id="subgraph-area6">
                  <rect x="452" y="168" width="370" height="316" rx="2" fill="#060f24" stroke="#1e40af" strokeWidth="1.5" />
                  <rect x="452" y="168" width="370" height="20" fill="#1e3a8a" />
                  <text x="464" y="182" fill="#93c5fd" fontSize="9.5" fontWeight="bold" fontFamily="system-ui, -apple-system, sans-serif">
                    ÁREA 6: CAPA ESTRATÉGICA &amp; ANALÍTICA
                  </text>
                </g>

                {/* 5. ÁREA 2 & 3: CADENA DE SUMINISTRO Y PLANTA */}
                <g id="subgraph-area2-3">
                  <rect x="146" y="562" width="688" height="90" rx="2" fill="#041a10" stroke="#16a34a" strokeWidth="1.5" />
                  <rect x="146" y="562" width="688" height="19" fill="#16a34a" />
                  <text x="158" y="575" fill="#ffffff" fontSize="9" fontWeight="bold" fontFamily="system-ui, -apple-system, sans-serif">
                    ÁREA 2 &amp; 3: CADENA DE SUMINISTRO Y PLANTA
                  </text>
                </g>

                {/* 6. ÁREA 4: ADMINISTRACIÓN Y FINANZAS */}
                <g id="subgraph-area4">
                  <rect x="198" y="728" width="428" height="182" rx="2" fill="#180e05" stroke="#d97706" strokeWidth="1.5" />
                  <rect x="198" y="728" width="428" height="19" fill="#d97706" />
                  <text x="208" y="741" fill="#ffffff" fontSize="9" fontWeight="bold" fontFamily="system-ui, -apple-system, sans-serif">
                    ÁREA 4: ADMINISTRACIÓN Y FINANZAS
                  </text>
                </g>

                {/* ========================================================
                    LÍNEAS Y CONEXIONES (CON FLECHAS Y ETIQUETAS)
                   ======================================================== */}

                {/* Business Partners -> CRM & Compras */}
                <path d="M 129.5 130 L 129.5 250" stroke="#cbd5e1" strokeWidth="1.4" fill="none" />
                <path d="M 129.5 250 L 168 250 L 168 388" stroke="#38bdf8" strokeWidth="1.4" fill="none" markerEnd="url(#arrow-cyan)" />
                <path d="M 129.5 250 L 358 250 L 358 605" stroke="#38bdf8" strokeWidth="1.4" fill="none" markerEnd="url(#arrow-cyan)" />

                {/* CRM -> Ventas */}
                <path d="M 168 426 L 168 454" stroke="#38bdf8" strokeWidth="1.4" fill="none" markerEnd="url(#arrow-cyan)" />

                {/* Ventas -> Inventario (Reserva stock) */}
                <path d="M 186 492 L 186 542 L 481 542 L 481 605" stroke="#38bdf8" strokeWidth="1.4" strokeDasharray="3,3" fill="none" markerEnd="url(#arrow-cyan)" />
                {renderLabelBadge(286, 534, 76, 16, "Reserva stock")}

                {/* Ventas -> CxC (Venta a crédito) */}
                <path d="M 110 492 L 110 774 L 208 774" stroke="#38bdf8" strokeWidth="1.4" fill="none" markerEnd="url(#arrow-cyan)" />
                {renderLabelBadge(78, 694, 82, 16, "Venta a crédito")}

                {/* Logística -> CxC (Prueba de entrega digital) */}
                <path d="M 224 641 L 224 756" stroke="#38bdf8" strokeWidth="1.4" strokeDasharray="3,3" fill="none" markerEnd="url(#arrow-cyan)" />
                {renderLabelBadge(148, 676, 116, 16, "Prueba de entrega digital")}

                {/* Compras -> CxP (Factura validada) */}
                <path d="M 358 641 L 358 756" stroke="#38bdf8" strokeWidth="1.4" fill="none" markerEnd="url(#arrow-cyan)" />
                {renderLabelBadge(324, 676, 84, 16, "Factura validada")}

                {/* Inventario -> Contabilidad (Costo de Ventas) */}
                <path d="M 476 641 L 476 695 L 535 695 L 535 756" stroke="#38bdf8" strokeWidth="1.4" strokeDasharray="3,3" fill="none" markerEnd="url(#arrow-cyan)" />
                {renderLabelBadge(482, 676, 84, 16, "Costo de Ventas")}

                {/* Planeación -> Compras (Requerimientos MRP) */}
                <path d="M 606 494 L 606 530 L 358 530 L 358 605" stroke="#38bdf8" strokeWidth="1.4" fill="none" markerEnd="url(#arrow-cyan)" />
                {renderLabelBadge(508, 522, 102, 16, "Requerimientos MRP")}

                {/* Planeación -> Producción (Programa de fábrica) */}
                <path d="M 674 494 L 674 530 L 759 530 L 759 605" stroke="#38bdf8" strokeWidth="1.4" fill="none" markerEnd="url(#arrow-cyan)" />
                {renderLabelBadge(636, 522, 98, 16, "Programa de fábrica")}

                {/* CxC -> Tesorería (Cobranza al banco) */}
                <path d="M 260 792 L 260 840 L 306 840 L 306 866" stroke="#38bdf8" strokeWidth="1.4" fill="none" markerEnd="url(#arrow-cyan)" />
                {renderLabelBadge(226, 822, 92, 16, "Cobranza al banco")}

                {/* CxP -> Tesorería (Propuesta de pago) */}
                <path d="M 386 792 L 386 840 L 342 840 L 342 866" stroke="#38bdf8" strokeWidth="1.4" fill="none" markerEnd="url(#arrow-cyan)" />
                {renderLabelBadge(352, 822, 90, 16, "Propuesta de pago")}

                {/* RRHH -> Nómina */}
                <path d="M 936 79 L 936 106" stroke="#38bdf8" strokeWidth="1.5" fill="none" markerEnd="url(#arrow-cyan)" />

                {/* Big Data -> Minería -> Predictivos -> IA -> Planeación */}
                <path d="M 640 230 L 640 262" stroke="#38bdf8" strokeWidth="1.4" strokeDasharray="3,3" fill="none" markerEnd="url(#arrow-cyan)" />
                <path d="M 640 290 L 640 320" stroke="#38bdf8" strokeWidth="1.4" strokeDasharray="3,3" fill="none" markerEnd="url(#arrow-cyan)" />
                <path d="M 640 356 L 640 390" stroke="#38bdf8" strokeWidth="1.4" strokeDasharray="3,3" fill="none" markerEnd="url(#arrow-cyan)" />
                <path d="M 640 426 L 640 458" stroke="#38bdf8" strokeWidth="1.5" fill="none" markerEnd="url(#arrow-cyan)" />

                {/* Telemetría: Tesorería -> Dashboards */}
                <path d="M 324 902 L 324 926 L 852 926 L 852 158 L 756 158 L 756 200" stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="4,4" fill="none" markerEnd="url(#arrow-slate)" />

                {/* ========================================================
                    LOS 24 MÓDULOS DE ARQUITECTURA (NODOS INTERACTIVOS)
                   ======================================================== */}

                {/* --- ÁREA 7 (4 módulos) --- */}
                {renderModuleNode({
                  id: 'BusinessPartners',
                  x: 42,
                  y: 90,
                  width: 175,
                  height: 40,
                  title: 'NyTEX Business Partners',
                  subtitle: '(Ficha Única: Clientes y Proveedores)',
                  bgColor: '#0e182e',
                  defaultStroke: '#eab308'
                })}

                {renderModuleNode({
                  id: 'Configuracion',
                  x: 236,
                  y: 90,
                  width: 180,
                  height: 40,
                  title: 'NyTEX Configuración',
                  subtitle: '(Seguridad RBAC, Multi-Empresa, APIs)',
                  bgColor: '#0e182e',
                  defaultStroke: '#eab308'
                })}

                {renderModuleNode({
                  id: 'ProcessSuite',
                  x: 434,
                  y: 90,
                  width: 175,
                  height: 40,
                  title: 'NyTEX Process Suite',
                  subtitle: '(Reglas de Negocio y Aprobaciones)',
                  bgColor: '#0e182e',
                  defaultStroke: '#eab308'
                })}

                {renderModuleNode({
                  id: 'ProcessMining',
                  x: 626,
                  y: 90,
                  width: 204,
                  height: 40,
                  title: 'NyTEX Process Mining',
                  subtitle: '(Auditoría de Event Logs y Cuellos de Botella)',
                  bgColor: '#0e182e',
                  defaultStroke: '#eab308'
                })}

                {/* --- ÁREA 5 (2 módulos) --- */}
                {renderModuleNode({
                  id: 'RRHH',
                  x: 868,
                  y: 44,
                  width: 136,
                  height: 35,
                  title: 'NyTEX RRHH',
                  subtitle: '(Expedientes y Asistencias)',
                  bgColor: '#581c87',
                  subtitleColor: '#e9d5ff',
                  defaultStroke: '#eab308'
                })}

                {renderModuleNode({
                  id: 'Nomina',
                  x: 868,
                  y: 106,
                  width: 136,
                  height: 35,
                  title: 'NyTEX Nómina',
                  subtitle: '(Sueldos e Impuestos)',
                  bgColor: '#581c87',
                  subtitleColor: '#e9d5ff',
                  defaultStroke: '#eab308'
                })}

                {/* --- ÁREA 1 (2 módulos) --- */}
                {renderModuleNode({
                  id: 'CRM',
                  x: 114,
                  y: 388,
                  width: 108,
                  height: 38,
                  title: 'NyTEX CRM',
                  subtitle: '(Embudo / Pipeline)',
                  bgColor: '#0284c7',
                  subtitleColor: '#e0f2fe',
                  defaultStroke: '#eab308'
                })}

                {renderModuleNode({
                  id: 'Ventas',
                  x: 110,
                  y: 454,
                  width: 116,
                  height: 38,
                  title: 'NyTEX Ventas',
                  subtitle: '(Cotización y Factura)',
                  bgColor: '#0284c7',
                  subtitleColor: '#e0f2fe',
                  defaultStroke: '#eab308'
                })}

                {/* --- ÁREA 6 (7 módulos) --- */}
                {renderModuleNode({
                  id: 'BIyReportes',
                  x: 466,
                  y: 200,
                  width: 112,
                  height: 30,
                  title: 'NyTEX BI y Reportes',
                  bgColor: '#0f2b5c',
                  defaultStroke: '#eab308'
                })}

                {renderModuleNode({
                  id: 'BigData',
                  x: 594,
                  y: 200,
                  width: 92,
                  height: 30,
                  title: 'NyTEX Big Data',
                  bgColor: '#0f2b5c',
                  defaultStroke: '#eab308'
                })}

                {renderModuleNode({
                  id: 'Dashboards',
                  x: 702,
                  y: 200,
                  width: 108,
                  height: 38,
                  title: 'NyTEX Dashboards',
                  subtitle: '(Cockpit en Vivo)',
                  bgColor: '#0f2b5c',
                  subtitleColor: '#bfdbfe',
                  defaultStroke: '#eab308'
                })}

                {renderModuleNode({
                  id: 'MineriaDatos',
                  x: 574,
                  y: 262,
                  width: 132,
                  height: 28,
                  title: 'NyTEX Minería de Datos',
                  bgColor: '#0f2b5c',
                  defaultStroke: '#eab308'
                })}

                {renderModuleNode({
                  id: 'Predictivos',
                  x: 566,
                  y: 320,
                  width: 148,
                  height: 36,
                  title: 'NyTEX Modelos Predictivos',
                  subtitle: '(Series de Tiempo + Logit/OR)',
                  bgColor: '#0f2b5c',
                  subtitleColor: '#bfdbfe',
                  defaultStroke: '#eab308',
                  subtitleSize: 8
                })}

                {renderModuleNode({
                  id: 'IA',
                  x: 576,
                  y: 390,
                  width: 128,
                  height: 36,
                  title: 'NyTEX IA',
                  subtitle: '(Decisiones Autónomas)',
                  bgColor: '#0f2b5c',
                  subtitleColor: '#bfdbfe',
                  defaultStroke: '#eab308'
                })}

                {renderModuleNode({
                  id: 'Planeacion',
                  x: 572,
                  y: 458,
                  width: 136,
                  height: 36,
                  title: 'NyTEX Planeación',
                  subtitle: '(S&OP y Presupuestos)',
                  bgColor: '#0f2b5c',
                  subtitleColor: '#bfdbfe',
                  defaultStroke: '#eab308'
                })}

                {/* --- ÁREA 2 & 3 (6 módulos) --- */}
                {renderModuleNode({
                  id: 'Logistica',
                  x: 154,
                  y: 605,
                  width: 102,
                  height: 36,
                  title: 'NyTEX Logística',
                  subtitle: '(Rutas y POD)',
                  bgColor: '#14532d',
                  subtitleColor: '#bbf7d0',
                  defaultStroke: '#eab308'
                })}

                {renderModuleNode({
                  id: 'Compras',
                  x: 264,
                  y: 605,
                  width: 98,
                  height: 36,
                  title: 'NyTEX Compras',
                  subtitle: '(Órdenes O.C.)',
                  bgColor: '#14532d',
                  subtitleColor: '#bbf7d0',
                  defaultStroke: '#eab308'
                })}

                {renderModuleNode({
                  id: 'Rop',
                  x: 370,
                  y: 605,
                  width: 110,
                  height: 36,
                  title: 'NyTEX ROP',
                  subtitle: '(Punto de Reorden)',
                  bgColor: '#14532d',
                  subtitleColor: '#bbf7d0',
                  defaultStroke: '#eab308'
                })}

                {renderModuleNode({
                  id: 'Inventario',
                  x: 488,
                  y: 605,
                  width: 98,
                  height: 36,
                  title: 'NyTEX Inventario',
                  subtitle: '(Kardex y Stock)',
                  bgColor: '#14532d',
                  subtitleColor: '#bbf7d0',
                  defaultStroke: '#eab308'
                })}

                {renderModuleNode({
                  id: 'WMS',
                  x: 594,
                  y: 605,
                  width: 112,
                  height: 36,
                  title: 'NyTEX WMS',
                  subtitle: '(Racks y Picking)',
                  bgColor: '#14532d',
                  subtitleColor: '#bbf7d0',
                  defaultStroke: '#eab308'
                })}

                {renderModuleNode({
                  id: 'Produccion',
                  x: 714,
                  y: 605,
                  width: 114,
                  height: 36,
                  title: 'NyTEX Producción',
                  subtitle: '(Recetas y Planta)',
                  bgColor: '#065f46',
                  subtitleColor: '#a7f3d0',
                  defaultStroke: '#eab308'
                })}

                {/* --- ÁREA 4 (4 módulos) --- */}
                {renderModuleNode({
                  id: 'CxC',
                  x: 208,
                  y: 756,
                  width: 104,
                  height: 36,
                  title: 'NyTEX CxC',
                  subtitle: '(Cartera y Crédito)',
                  bgColor: '#78350f',
                  subtitleColor: '#fde68a',
                  defaultStroke: '#eab308'
                })}

                {renderModuleNode({
                  id: 'CxP',
                  x: 324,
                  y: 756,
                  width: 124,
                  height: 36,
                  title: 'NyTEX CxP',
                  subtitle: '(3-Way Match y Deudas)',
                  bgColor: '#78350f',
                  subtitleColor: '#fde68a',
                  defaultStroke: '#eab308'
                })}

                {renderModuleNode({
                  id: 'Contabilidad',
                  x: 460,
                  y: 756,
                  width: 152,
                  height: 36,
                  title: 'NyTEX Contabilidad',
                  subtitle: '(Consolidación en Tiempo Real)',
                  bgColor: '#78350f',
                  subtitleColor: '#fde68a',
                  defaultStroke: '#eab308',
                  subtitleSize: 7.8
                })}

                {renderModuleNode({
                  id: 'Tesoreria',
                  x: 266,
                  y: 866,
                  width: 116,
                  height: 36,
                  title: 'NyTEX Tesorería',
                  subtitle: '(Bancos y Cash Flow)',
                  bgColor: '#78350f',
                  subtitleColor: '#fde68a',
                  defaultStroke: '#eab308'
                })}

              </svg>
            </div>
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
                className="text-[10px] bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded-full font-bold transition-all flex items-center gap-1 cursor-pointer"
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
