import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function CircuitoFase3View() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const res = await fetch('/api/fases/fase3/summary');
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error('Error fetching Fase 3 summary:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSimulate = async () => {
    setSimulating(true);
    setSimulationResult(null);
    try {
      const res = await fetch('/api/fases/fase3/simulate', { method: 'POST' });
      const json = await res.json();
      setSimulationResult(json);
      fetchSummary();
    } catch (err) {
      console.error('Error simulating Fase 3:', err);
    } finally {
      setSimulating(false);
    }
  };

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-cyan-500 border-t-transparent mb-3"></div>
          <p className="text-slate-300 font-semibold">Cargando Circuito Fase 3: Advanced...</p>
        </div>
      </div>
    );
  }

  const { metrics = {} } = data || {};

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Cabecera Comercial Coherente */}
        <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-indigo-950 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden border border-cyan-800/40">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-cyan-500 text-slate-950 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                  Circuito 3 • Paquete Comercial
                </span>
                <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-bold">
                  20 Módulos de Inteligencia
                </span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-black tracking-tight">
                Fase 3: NyTEX Advanced — Inteligencia & Rentabilidad
              </h1>
              <p className="text-cyan-200 text-sm mt-2 max-w-2xl leading-relaxed">
                El salto analítico para empresas que buscan rentabilidad estratégica: Cubo OLAP para análisis multidimensional de márgenes, Data Lake con 96 sensores IoT en telares, planeación S&OP / MRP II y reportes ejecutivos auditados NIF/SAT.
              </p>
              <div className="flex items-center gap-6 mt-4 pt-4 border-t border-white/10 text-xs">
                <div>
                  <span className="text-cyan-300 block uppercase font-bold text-[10px]">Licencia Mensual</span>
                  <strong className="text-xl text-amber-300 font-black">$299 USD</strong> / mes
                </div>
                <div>
                  <span className="text-cyan-300 block uppercase font-bold text-[10px]">Implementación</span>
                  <strong className="text-xl text-white font-black">$4,500 USD</strong>
                </div>
                <div>
                  <span className="text-cyan-300 block uppercase font-bold text-[10px]">Cobertura Total</span>
                  <strong className="text-xl text-emerald-400 font-black">20 Módulos (Express + 5)</strong>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto">
              <button
                onClick={handleSimulate}
                disabled={simulating}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-black px-6 py-3 rounded-2xl text-sm transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <span>📊</span> {simulating ? 'Sincronizando Cubo...' : 'Simular S&OP & IoT'}
              </button>
              <Link
                to="/portal?phase=3"
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3 rounded-2xl text-sm transition-all text-center shadow-md border border-indigo-400/30"
              >
                Contratar Advanced ($299 USD/mes)
              </Link>
              <Link
                to="/portal"
                className="text-xs text-center text-cyan-200 hover:text-white underline pt-1"
              >
                Volver al Menú Principal
              </Link>
            </div>
          </div>
        </div>

        {/* Notificación de Simulación */}
        {simulationResult && (
          <div className="bg-cyan-950 border-2 border-cyan-500 p-5 rounded-2xl shadow-sm text-cyan-200 font-semibold text-sm flex items-center gap-3 animate-fade-in">
            <span className="text-2xl">✓</span>
            <div>
              <p className="font-bold">{simulationResult.message}</p>
              <p className="text-xs text-cyan-400 font-normal mt-0.5">Se actualizó el Data Lake columnar y la matriz multidimensional del Cubo OLAP.</p>
            </div>
          </div>
        )}

        {/* Métricas Reales del Circuito Advanced */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">[21] Data Lake IoT</span>
            <div className="text-2xl font-black text-cyan-400 mt-1 font-mono">
              {metrics.dataLakeSizeGb} <span className="text-xs text-slate-500">GB</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">{metrics.iotRecordsCount?.toLocaleString()} eventos Parquet</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">[20] Margen Bruto OLAP</span>
            <div className="text-2xl font-black text-emerald-400 mt-1 font-mono">
              {metrics.olapGrossMarginPct}
            </div>
            <p className="text-[11px] text-emerald-500 mt-1 font-semibold">Slice & Dice por familia y región</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">[25] S&OP / MRP II</span>
            <div className="text-2xl font-black text-amber-400 mt-1 text-base">
              {metrics.mrpSopStatus}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">{metrics.activeSensorsCount} sensores monitoreando carga</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">[11] Activos Fijos</span>
            <div className="text-2xl font-black text-purple-400 mt-1 font-mono">
              ${metrics.totalAssetsValue?.toLocaleString()} <span className="text-xs text-slate-500">USD</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Depreciación mensual: ${metrics.monthlyDepreciation?.toLocaleString()} USD</p>
          </div>
        </div>

        {/* Arquitectura de Flujo Advanced */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl">
          <h3 className="text-base font-extrabold text-white mb-1">Capa de Inteligencia de Negocios & Capacidad</h3>
          <p className="text-xs text-slate-400 mb-4">Conectando sensores físicos a cubos de toma de decisiones financieras</p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] font-black uppercase text-cyan-400">Ingesta</span>
              <h4 className="font-bold text-white text-sm mt-1">[21] Big Data IoT</h4>
              <p className="text-xs text-slate-400 mt-1">Telemetría de 96 sensores de telares (RPM, vibración y tensión) directo al Data Lake.</p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] font-black uppercase text-indigo-400">Planeación</span>
              <h4 className="font-bold text-white text-sm mt-1">[25] Planeación S&OP</h4>
              <p className="text-xs text-slate-400 mt-1">Explosión de materiales MRP II y programación de turnos según capacidad disponible.</p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] font-black uppercase text-emerald-400">Multidimensional</span>
              <h4 className="font-bold text-white text-sm mt-1">[20] BI Cubo OLAP</h4>
              <p className="text-xs text-slate-400 mt-1">Visualización matricial cruzando línea de producto, clientes y regiones geográficas.</p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] font-black uppercase text-blue-400">Dictamen</span>
              <h4 className="font-bold text-white text-sm mt-1">[18] BI y Reportes</h4>
              <p className="text-xs text-slate-400 mt-1">Emisión de estados financieros NIF B-3 y balanza de comprobación SAT Anexo 24.</p>
            </div>
          </div>
        </div>

        {/* Directorio de los Módulos de Fase 3 */}
        <div>
          <h3 className="font-extrabold text-white text-lg mb-3">Módulos de la Fase 3 Advanced</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
            {[
              { id: 'ventas', name: '[1] Ventas' },
              { id: 'crm', name: '[2] CRM' },
              { id: 'inventario', name: '[3] Inventario' },
              { id: 'compras', name: '[4] Compras' },
              { id: 'rop', name: '[4.1] ROP Inteligente' },
              { id: 'produccion', name: '[5] Producción' },
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
              { id: 'biyreportes', name: '[18] BI y Reportes' },
              { id: 'dashboards', name: '[19] Dashboards' },
              { id: 'bi', name: '[20] BI Cubo' },
              { id: 'bigdata', name: '[21] Big Data' },
              { id: 'planeacion', name: '[25] Planeación' }
            ].map(m => (
              <Link
                key={m.id}
                to={`/app/${m.id}`}
                className="bg-slate-900 p-3 rounded-xl border border-slate-800 hover:border-cyan-500 shadow-sm text-center block transition-all"
              >
                <strong className="text-xs text-slate-200 block">{m.name}</strong>
                <span className="text-[10px] text-cyan-400 font-bold">Abrir ➔</span>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
