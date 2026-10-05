import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function CircuitoFase2View() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const res = await fetch('/api/fases/fase2/summary');
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error('Error fetching Fase 2 summary:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSimulate = async () => {
    setSimulating(true);
    setSimulationResult(null);
    try {
      const res = await fetch('/api/fases/fase2/simulate', { method: 'POST' });
      const json = await res.json();
      setSimulationResult(json);
      fetchSummary();
    } catch (err) {
      console.error('Error simulating Fase 2:', err);
    } finally {
      setSimulating(false);
    }
  };

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-slate-100 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-amber-500 border-t-transparent mb-3"></div>
          <p className="text-slate-600 font-semibold">Cargando Circuito Fase 2: Express...</p>
        </div>
      </div>
    );
  }

  const { metrics = {} } = data || {};

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Cabecera Comercial Coherente */}
        <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-indigo-950 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-amber-500 text-slate-950 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                  Circuito 2 • Paquete Comercial
                </span>
                <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-bold">
                  17 Módulos Operativos
                </span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-black tracking-tight">
                Fase 2: NyTEX Express — Manufactura, ROP, Personal & Minería
              </h1>
              <p className="text-amber-200 text-sm mt-2 max-w-2xl leading-relaxed">
                Diseñado para empresas y fábricas en pleno crecimiento: añade piso de producción en telares circulares, reabastecimiento ROP inteligente, código de barras en WMS, logística con camiones, nómina quincenal, KPIs de OEE, gobernanza BPMN y Minería de Procesos.
              </p>
              <div className="flex items-center gap-6 mt-4 pt-4 border-t border-white/10 text-xs">
                <div>
                  <span className="text-amber-300 block uppercase font-bold text-[10px]">Licencia Mensual</span>
                  <strong className="text-xl text-amber-300 font-black">$149 USD</strong> / mes
                </div>
                <div>
                  <span className="text-amber-300 block uppercase font-bold text-[10px]">Implementación</span>
                  <strong className="text-xl text-white font-black">$1,500 USD</strong>
                </div>
                <div>
                  <span className="text-amber-300 block uppercase font-bold text-[10px]">Cobertura Total</span>
                  <strong className="text-xl text-emerald-400 font-black">17 Módulos (Starter + 10)</strong>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto">
              <button
                onClick={handleSimulate}
                disabled={simulating}
                className="bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black px-6 py-3 rounded-2xl text-sm transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <span>🏭</span> {simulating ? 'Montando en Telar...' : 'Simular Operación Fabril'}
              </button>
              <Link
                to="/portal?phase=2"
                className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-6 py-3 rounded-2xl text-sm transition-all text-center shadow-md"
              >
                Contratar Express ($149 USD/mes)
              </Link>
              <Link
                to="/portal"
                className="text-xs text-center text-amber-200 hover:text-white underline pt-1"
              >
                Volver al Menú Principal
              </Link>
            </div>
          </div>
        </div>

        {/* Notificación de Simulación */}
        {simulationResult && (
          <div className="bg-amber-50 border-2 border-amber-400 p-5 rounded-2xl shadow-sm text-amber-900 font-semibold text-sm flex items-center gap-3 animate-fade-in">
            <span className="text-2xl">✓</span>
            <div>
              <p className="font-bold">{simulationResult.message}</p>
              <p className="text-xs text-amber-800 font-normal mt-0.5">Se afectaron simultáneamente Producción, WMS, Logística y las bandejas de Process Suite.</p>
            </div>
          </div>
        )}

        {/* Métricas Reales del Circuito Express */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">[5] Telares Circulares</span>
            <div className="text-2xl font-black text-amber-600 mt-1 font-mono">
              {metrics.activeLoomsCount} <span className="text-xs text-slate-500">en marcha</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">{metrics.totalRollsPlanned} rollos programados</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">[14] Nómina y Personal</span>
            <div className="text-2xl font-black text-slate-900 mt-1 font-mono">
              ${metrics.lastPayrollDisbursed?.toLocaleString()} <span className="text-xs text-slate-500">USD</span>
            </div>
            <p className="text-[11px] text-blue-600 mt-1 font-semibold">{metrics.activeEmployeesCount} colaboradores con IMSS/SAT</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">[19] OEE de Planta</span>
            <div className="text-2xl font-black text-emerald-600 mt-1 font-mono">
              {metrics.oeeAverage}
            </div>
            <p className="text-[11px] text-emerald-700 font-semibold">{metrics.fleetTrucksActiveCount} camiones en logística</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">[15] Process Suite BPMN</span>
            <div className="text-2xl font-black text-purple-600 mt-1 font-mono">
              {metrics.pendingBpmTasks} <span className="text-xs text-slate-500">tareas</span>
            </div>
            <p className="text-[11px] text-purple-700 font-bold">{metrics.bpmStatus}</p>
          </div>
        </div>

        {/* Arquitectura de Flujo Express */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-base font-extrabold text-slate-900 mb-1">Cadena Operativa Express: Del Pedido a la Entrega</h3>
          <p className="text-xs text-slate-500 mb-4">Integración de Piso de Planta, Almacén Inteligente y Recursos Humanos</p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
              <span className="text-[10px] font-black uppercase text-amber-600">Manufactura</span>
              <h4 className="font-bold text-slate-900 text-sm mt-1">[5] Producción Textil</h4>
              <p className="text-xs text-slate-600 mt-1">Órdenes fabriles que transforman hilo peinado en rollos de tejido circular Mayer & Cie.</p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
              <span className="text-[10px] font-black uppercase text-blue-600">Almacenaje</span>
              <h4 className="font-bold text-slate-900 text-sm mt-1">[17] WMS Inteligente</h4>
              <p className="text-xs text-slate-600 mt-1">Zonificación de racks por código de barras y listas de picking optimizadas para surtido.</p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
              <span className="text-[10px] font-black uppercase text-indigo-600">Transporte</span>
              <h4 className="font-bold text-slate-900 text-sm mt-1">[7] Logística y Flota</h4>
              <p className="text-xs text-slate-600 mt-1">Programación de rutas de entrega, asignación de fleteros y guías de embarque.</p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
              <span className="text-[10px] font-black uppercase text-purple-600">Talento</span>
              <h4 className="font-bold text-slate-900 text-sm mt-1">[13] RRHH & [14] Nómina</h4>
              <p className="text-xs text-slate-600 mt-1">Control de horas extra en planta, retenciones IMSS Art 96 y dispersión bancaria directa.</p>
            </div>
          </div>
        </div>

        {/* Directorio de los 17 Módulos */}
        <div>
          <h3 className="font-extrabold text-slate-900 text-lg mb-3">Los 17 Módulos de la Fase 2 Express</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3">
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
              { id: 'contabilidad', name: '[12] Contabilidad' },
              { id: 'rrhh', name: '[13] RRHH' },
              { id: 'nomina', name: '[14] Nómina' },
              { id: 'processsuite', name: '[15] Process Suite' },
              { id: 'processmining', name: '[16] Process Mining' },
              { id: 'wms', name: '[17] WMS' },
              { id: 'dashboards', name: '[19] Dashboards' }
            ].map(m => (
              <Link
                key={m.id}
                to={`/app/${m.id}`}
                className="bg-white p-3 rounded-xl border border-slate-200 hover:border-amber-500 shadow-sm text-center block transition-all"
              >
                <strong className="text-xs text-slate-800 block">{m.name}</strong>
                <span className="text-[10px] text-amber-600 font-bold">Abrir ➔</span>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
