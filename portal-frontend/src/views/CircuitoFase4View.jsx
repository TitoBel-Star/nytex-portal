import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function CircuitoFase4View() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const res = await fetch('/api/fases/fase4/summary');
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error('Error fetching Fase 4 summary:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSimulate = async () => {
    setSimulating(true);
    setSimulationResult(null);
    try {
      const res = await fetch('/api/fases/fase4/simulate', { method: 'POST' });
      const json = await res.json();
      setSimulationResult(json);
      fetchSummary();
    } catch (err) {
      console.error('Error simulating Fase 4:', err);
    } finally {
      setSimulating(false);
    }
  };

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-purple-500 border-t-transparent mb-3"></div>
          <p className="text-slate-300 font-semibold">Cargando Circuito Fase 4: Enterprise (26 Módulos)...</p>
        </div>
      </div>
    );
  }

  const { metrics = {}, modules = [] } = data || {};

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Cabecera Comercial Coherente */}
        <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white p-8 rounded-3xl shadow-2xl relative overflow-hidden border border-purple-500/40">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-purple-500 text-white font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                  Circuito 4 • Paquete Comercial
                </span>
                <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2.5 py-1 rounded-full font-bold border border-emerald-500/30">
                  ⭐ 26 de 26 Módulos (100% Ecosistema)
                </span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-black tracking-tight">
                Fase 4: NyTEX Enterprise — Anticipación, IA & Escala Global
              </h1>
              <p className="text-purple-200 text-sm mt-2 max-w-2xl leading-relaxed">
                La experiencia corporativa definitiva y autónoma: integra Inteligencia Artificial Cognitiva conectada a la base de datos, proyecciones ARIMA de ventas, scoring de cobranza Logit, minería de procesos DFG, clustering K-Means y gobernanza fiscal inmutable multi-país (DTE / SAT / SAR / DGI).
              </p>
              <div className="flex items-center gap-6 mt-4 pt-4 border-t border-white/10 text-xs">
                <div>
                  <span className="text-purple-300 block uppercase font-bold text-[10px]">Licencia Mensual</span>
                  <strong className="text-xl text-amber-300 font-black">$499 USD</strong> / mes
                </div>
                <div>
                  <span className="text-purple-300 block uppercase font-bold text-[10px]">Implementación</span>
                  <strong className="text-xl text-white font-black">Cotización a Medida</strong>
                </div>
                <div>
                  <span className="text-purple-300 block uppercase font-bold text-[10px]">Ecosistema</span>
                  <strong className="text-xl text-emerald-400 font-black">26 Módulos (Totalidad)</strong>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto">
              <button
                onClick={handleSimulate}
                disabled={simulating}
                className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white font-black px-6 py-3 rounded-2xl text-sm transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <span>🧠</span> {simulating ? 'Auditoría en Curso...' : 'Auditoría Cognitiva IA 360°'}
              </button>
              <Link
                to="/portal?phase=4"
                className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-6 py-3 rounded-2xl text-sm transition-all text-center shadow-md border border-purple-400/30"
              >
                Solicitar Cotización Enterprise ($499 USD/mes)
              </Link>
              <Link
                to="/portal"
                className="text-xs text-center text-purple-200 hover:text-white underline pt-1"
              >
                Volver al Menú Principal
              </Link>
            </div>
          </div>
        </div>

        {/* Notificación de Simulación */}
        {simulationResult && (
          <div className="bg-purple-950 border-2 border-purple-500 p-5 rounded-2xl shadow-sm text-purple-200 font-semibold text-sm flex items-center gap-3 animate-fade-in">
            <span className="text-2xl">✓</span>
            <div>
              <p className="font-bold">{simulationResult.message}</p>
              <p className="text-xs text-purple-300 font-normal mt-0.5">Se actualizó la bitácora de auditoría global y las proyecciones cognitivas del ERP.</p>
            </div>
          </div>
        )}

        {/* Métricas Reales del Circuito Enterprise */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">[23] Asistente Cognitivo IA</span>
            <div className="text-xl font-black text-purple-400 mt-1">
              Online
            </div>
            <p className="text-[11px] text-slate-400 mt-1">{metrics.aiAssistantModel}</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">[24] Modelos Predictivos</span>
            <div className="text-xl font-black text-cyan-400 mt-1">
              ARIMA & Logit
            </div>
            <p className="text-[11px] text-cyan-500 mt-1 font-semibold">{metrics.predictiveModel}</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">[22] Minería de Datos</span>
            <div className="text-xl font-black text-amber-400 mt-1">
              K-Means & Apriori
            </div>
            <p className="text-[11px] text-slate-400 mt-1">{metrics.clusteringModel}</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">[26] Gobernanza Fiscal & Auditoría</span>
            <div className="text-xl font-black text-emerald-400 mt-1">
              {metrics.auditLogsCount} logs
            </div>
            <p className="text-[11px] text-emerald-500 mt-1">{metrics.fiscalStatus}</p>
          </div>
        </div>

        {/* Los 4 Pilares Enterprise Exclusivos */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl">
          <h3 className="text-base font-extrabold text-white mb-1">Capacidades de Vanguardia Exclusivas de la Fase 4</h3>
          <p className="text-xs text-slate-400 mb-4">Lo que convierte a NyTEX en un sistema autónomo e inteligente</p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] font-black uppercase text-purple-400">Inteligencia</span>
              <h4 className="font-bold text-white text-sm mt-1">[23] IA Copilot</h4>
              <p className="text-xs text-slate-400 mt-1">Chat cognitivo que consulta en tiempo real la base de datos para responder preguntas directivas.</p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] font-black uppercase text-cyan-400">Anticipación</span>
              <h4 className="font-bold text-white text-sm mt-1">[24] Modelos Predictivos</h4>
              <p className="text-xs text-slate-400 mt-1">Proyección de demanda con series de tiempo ARIMA y probabilidad de incumplimiento de pago.</p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] font-black uppercase text-amber-400">Gobernanza</span>
              <h4 className="font-bold text-white text-sm mt-1">[16] Process Mining</h4>
              <p className="text-xs text-slate-400 mt-1">Grafos DFG para identificar cuellos de botella reales entre el almacén y el transporte.</p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] font-black uppercase text-emerald-400">Seguridad & Compliance</span>
              <h4 className="font-bold text-white text-sm mt-1">[26] Configuración Global</h4>
              <p className="text-xs text-slate-400 mt-1">Bitácora inmutable de auditoría forense con firmas criptográficas, cumplimiento tributario regional (MH DTE / SAT / SAR) y trazabilidad por usuario e IP.</p>
            </div>
          </div>
        </div>

        {/* Los 26 Módulos Completos */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-extrabold text-white text-lg">Catálogo Total del Ecosistema (26 de 26 Módulos)</h3>
            <span className="text-xs font-bold text-purple-400 bg-purple-950/60 border border-purple-800 px-3 py-1 rounded-full">
              Todo Incluido en Enterprise
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5">
            {[
              { id: 'ventas', name: '[1] Ventas' },
              { id: 'crm', name: '[2] CRM' },
              { id: 'inventario', name: '[3] Inventario' },
              { id: 'compras', name: '[4] Compras' },
              { id: 'produccion', name: '[5] Producción' },
              { id: 'businesspartners', name: '[6] Partners' },
              { id: 'logistica', name: '[7] Logística' },
              { id: 'cxc', name: '[8] CxC' },
              { id: 'cxp', name: '[9] CxP' },
              { id: 'tesoreria', name: '[10] Tesorería' },
              { id: 'activosfijos', name: '[11] Activos Fijos' },
              { id: 'contabilidad', name: '[12] Contabilidad' },
              { id: 'rrhh', name: '[13] RRHH' },
              { id: 'nomina', name: '[14] Nómina' },
              { id: 'processsuite', name: '[15] Process Suite' },
              { id: 'processmining', name: '[16] Process Mining' },
              { id: 'wms', name: '[17] WMS' },
              { id: 'biyreportes', name: '[18] Reportes' },
              { id: 'dashboards', name: '[19] Dashboards' },
              { id: 'bi', name: '[20] BI Cubo' },
              { id: 'bigdata', name: '[21] Big Data' },
              { id: 'mineriadatos', name: '[22] Minería' },
              { id: 'ia', name: '[23] IA Copilot' },
              { id: 'predictivos', name: '[24] Predictivos' },
              { id: 'planeacion', name: '[25] Planeación' },
              { id: 'configuracion', name: '[26] Configuración' }
            ].map(m => (
              <Link
                key={m.id}
                to={`/app/${m.id}`}
                className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 hover:border-purple-500 shadow-sm text-center block transition-all group"
              >
                <strong className="text-xs text-slate-300 block truncate group-hover:text-purple-300">{m.name}</strong>
                <span className="text-[10px] text-purple-400 font-semibold">Abrir ➔</span>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
