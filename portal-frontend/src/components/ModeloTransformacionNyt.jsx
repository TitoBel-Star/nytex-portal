import React from 'react';

const levelsData = [
  {
    level: 1,
    tag: 'Fase 1: NyTEX Starter',
    category: 'Eficiencia Operacional',
    title: 'CONTROL TRANSACCIONAL',
    subtitle: 'Ordenar y estabilizar la operación diaria.',
    subtitleColor: 'text-amber-600',
    description: 'Ideal cuando existen problemas de control, descontrol en inventarios, procesos manuales y reportes en Excel dispersos.',
    objective: 'REGISTRAR — ORDENAR — ESTANDARIZAR — CONTROLAR',
    tech: 'ERP Core · Compras · Inventarios · Facturación/CxC · CxP · Tesorería · Contabilidad',
    techColor: 'text-[#2A114B]',
    borderTop: 'border-t-8 border-[#2A114B]',
    tagBg: 'bg-purple-50 text-[#2A114B] border-purple-200',
  },
  {
    level: 2,
    tag: 'Fase 2: NyTEX Express',
    category: 'Eficiencia Operacional',
    title: 'PRODUCTIVIDAD Y FLUJO',
    subtitle: 'Hacer más rápido y eficiente lo que hoy hacemos.',
    subtitleColor: 'text-amber-600',
    description: 'Ideal cuando los procesos dependen de personas clave, existen cuellos de botella entre áreas y falta sincronización logística y comercial.',
    objective: 'INTEGRAR — SINCRONIZAR — MEDIR — AUTOMATIZAR',
    tech: 'CRM · Reabastecimiento ROP · WMS (Bodegas) · BPM · Minería de Procesos · Logística · Dashboards',
    techColor: 'text-[#2A114B]',
    borderTop: 'border-t-8 border-[#2A114B]',
    tagBg: 'bg-purple-50 text-[#2A114B] border-purple-200',
  },
  {
    level: 3,
    tag: 'Fase 3: NyTEX Advanced',
    category: 'Dirección Estratégica',
    title: 'INTELIGENCIA Y RENTABILIDAD',
    subtitle: 'Decidir con datos exactos y rentabilizar cada área.',
    subtitleColor: 'text-[#2A114B]',
    description: 'Ideal cuando la dirección trabaja a ciegas, no sabe qué producto o cliente deja mayor margen neto y los reportes llegan con semanas de retraso.',
    objective: 'CENTRALIZAR — ANALIZAR — DIAGNOSTICAR — RENTABILIZAR',
    tech: 'Business Intelligence (BI) · Data Warehouse · Dashboards Ejecutivos · Planeación & MRP',
    techColor: 'text-slate-900',
    borderTop: 'border-t-8 border-amber-400',
    tagBg: 'bg-amber-50 text-amber-800 border-amber-200',
  },
  {
    level: 4,
    tag: 'Fase 4: NyTEX Enterprise',
    category: 'Dirección Estratégica',
    title: 'ANTICIPACIÓN Y ESCALA',
    subtitle: 'Anticipar el futuro, innovar y liderar el mercado.',
    subtitleColor: 'text-[#2A114B]',
    description: 'No se trata solo de hacer mejor las cosas. Se trata de predecir demanda, innovar en procesos y escalar agresivamente sin inflar costos fijos.',
    objective: 'ANTICIPAR — SIMULAR — INNOVAR — ESCALAR — TRANSFORMAR',
    tech: 'IA Predictiva · Big Data · Modelos Predictivos · Agentes Autónomos · Simulación',
    techColor: 'text-slate-900',
    borderTop: 'border-t-8 border-amber-400',
    tagBg: 'bg-amber-50 text-amber-800 border-amber-200',
  },
];

export default function ModeloTransformacionNyt({ activePhase, onSelectPhase }) {
  return (
    <section className="mb-14">
      {/* Encabezado Principal */}
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--nytex-navy)] mb-4 tracking-tight">
          EL MODELO DE TRANSFORMACIÓN NyT™
        </h2>
        <div className="w-24 h-1 bg-[#2A114B] mx-auto mb-6"></div>
        <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
          No todas las empresas necesitan la misma tecnología. Primero identificamos dónde está su empresa. Después determinamos qué transformar.
        </p>
      </div>

      {/* Agrupación Visual Superior (Desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 max-w-5xl mx-auto">
        <div className="bg-[#2A114B] text-white text-center py-3.5 px-6 rounded-2xl font-black tracking-widest text-xs md:text-sm uppercase shadow-md flex items-center justify-center gap-2 border border-purple-900">
          <span className="text-amber-400 text-lg">⚙</span>
          <span>EFICIENCIA OPERACIONAL · NIVELES 1 Y 2</span>
        </div>
        <div className="bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 text-center py-3.5 px-6 rounded-2xl font-black tracking-widest text-xs md:text-sm uppercase shadow-md flex items-center justify-center gap-2 border border-amber-300">
          <span className="text-[#2A114B] text-lg">♞</span>
          <span>DIRECCIÓN ESTRATÉGICA · NIVELES 3 Y 4</span>
        </div>
      </div>

      {/* Grilla de los 4 Niveles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {levelsData.map((lvl) => {
          const isActive = activePhase === lvl.level;

          return (
            <div
              key={lvl.level}
              onClick={() => onSelectPhase && onSelectPhase(lvl.level)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelectPhase && onSelectPhase(lvl.level); }}
              className={`bg-white p-6 rounded-3xl shadow-lg ${lvl.borderTop} flex flex-col justify-between transition-all duration-300 cursor-pointer text-left ${
                isActive
                  ? 'ring-4 ring-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.5)] transform -translate-y-2 bg-amber-50/20'
                  : 'hover:-translate-y-1 hover:shadow-xl'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`${lvl.tagBg} font-black text-xs tracking-widest uppercase px-2.5 py-1 rounded-full border`}>
                    {lvl.tag}
                  </span>
                  {isActive && (
                    <span className="bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm">
                      ✓ ACTIVO
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-extrabold text-gray-900 mb-1.5 leading-snug">
                  {lvl.title}
                </h3>
                <p className={`text-xs font-bold ${lvl.subtitleColor} mb-3.5 leading-normal`}>
                  {lvl.subtitle}
                </p>
                <p className="text-xs text-gray-600 mb-5 leading-relaxed">
                  {lvl.description}
                </p>

                <div className="mb-4">
                  <strong className="text-xs font-bold text-gray-900 block mb-1">
                    Objetivo:
                  </strong>
                  <p className="text-[10.5px] font-bold text-gray-500 tracking-wide uppercase leading-snug">
                    {lvl.objective}
                  </p>
                </div>

                <div className="mb-5">
                  <strong className="text-xs font-bold text-gray-900 block mb-1">
                    Tecnología:
                  </strong>
                  <p className={`text-xs font-semibold ${lvl.techColor} leading-relaxed`}>
                    {lvl.tech}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 text-center">
                <div className="text-xs text-gray-600 leading-relaxed flex flex-wrap items-center justify-center gap-1.5">
                  <span>Para ver las aplicaciones del ecosistema, haz clic aquí ↓</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectPhase && onSelectPhase(lvl.level);
                    }}
                    className={`py-1 px-3 rounded-lg text-xs font-bold transition-all border shadow-sm cursor-pointer ${
                      isActive
                        ? 'bg-amber-400 text-slate-950 border-amber-300 font-black shadow-lg scale-[1.02]'
                        : lvl.level <= 2
                          ? 'border-[#2A114B] bg-[#2A114B] text-white hover:bg-purple-900'
                          : 'border-amber-400 bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 hover:from-amber-500 hover:to-yellow-500 font-black'
                    }`}
                  >
                    {isActive ? '✨ Activas' : 'Ver aplicaciones'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
