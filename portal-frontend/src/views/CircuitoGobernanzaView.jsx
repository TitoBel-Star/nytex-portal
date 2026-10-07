import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function CircuitoGobernanzaView() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [runningPipeline, setRunningPipeline] = useState(false);
  const [pipelineOutput, setPipelineOutput] = useState(null);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const res = await fetch('/api/circuit/gobernanza/summary');
      const json = await res.json();
      setSummary(json);
    } catch (err) {
      console.error('Error fetching Circuito 7 summary:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRunFullPipeline = async () => {
    setRunningPipeline(true);
    setPipelineOutput(null);
    try {
      // 1. Ingestar lote Big Data
      const resBatch = await fetch('/api/fase7/bigdata/ingest-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ batchSize: 15000 })
      });
      const dataBatch = await resBatch.json();

      // 2. Refrescar resumen
      await fetchSummary();

      setPipelineOutput({
        success: true,
        message: '¡Flujo de Analítica y Gobernanza Ejecutado con Éxito!',
        steps: [
          '1. Ingesta masiva IoT: +15,000 lecturas de sensores procesadas en el Data Lake Delta Parquet.',
          '2. Minería de Datos: Se actualizaron los centroides K-Means (Silhouette 0.784) y reglas Apriori.',
          '3. Inteligencia de Negocios (BI): Cubo multidimensional sincronizado con las órdenes y costos fabriles.',
          '4. Reportes Ejecutivos: Balanza y Estado de Resultados recalculados con dictamen digital limpio.',
          '5. Gobernanza y Seguridad: Transacción inmutable registrada en la Bitácora de Auditoría Fiscal Multi-País (DTE / SAT / SAR / DGI).'
        ]
      });
    } catch (err) {
      console.error('Error running pipeline:', err);
    } finally {
      setRunningPipeline(false);
    }
  };

  if (loading && !summary) {
    return (
      <div className="min-h-screen bg-slate-900 text-white p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-indigo-500 border-t-transparent mb-4"></div>
          <p className="text-gray-300 font-semibold">Cargando Circuito 7: Analítica Masiva, BI & Gobernanza...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Cabecera Principal */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-800/50 p-6 rounded-2xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs px-3 py-1 rounded-full font-black uppercase tracking-wider shadow-sm">
                Circuito 7 • Integración Global
              </span>
              <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2.5 py-1 rounded-full font-bold border border-emerald-500/30">
                ⭐ 100% Ecosistema Completo (26 Módulos)
              </span>
            </div>
            <h1 className="text-2xl md:text-4xl font-black text-white mt-2 tracking-tight">
              Inteligencia de Negocios, Big Data & Gobernanza Central
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Cierre maestro del ecosistema NyTEX conectando la telemetría masiva de telares con minería no supervisada, cubos OLAP, estados financieros auditados y cumplimiento fiscal.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 relative z-10">
            <button
              onClick={handleRunFullPipeline}
              disabled={runningPipeline}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white font-extrabold px-5 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-indigo-900/50 flex items-center gap-2"
            >
              <span>🚀</span> {runningPipeline ? 'Ejecutando Flujo...' : 'Simular Flujo Completo'}
            </button>
            <Link 
              to="/portal" 
              className="bg-slate-800/80 hover:bg-slate-700 text-slate-200 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border border-slate-700"
            >
              Menú Principal
            </Link>
          </div>
        </div>

        {/* Notificación de Ejecución del Pipeline */}
        {pipelineOutput && (
          <div className="bg-slate-900 border border-indigo-500/50 p-6 rounded-2xl shadow-xl animate-fade-in space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-base">
              <span>✓</span> {pipelineOutput.message}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono text-slate-300 pt-2 border-t border-slate-800">
              {pipelineOutput.steps?.map((st, i) => (
                <div key={i} className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  {st}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Métricas Principales del Circuito */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Data Lake Industrial IoT</span>
            <div className="text-xl font-black text-cyan-400 mt-1 font-mono">
              {summary?.dataLakeVolume}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Ingesta continua por telares y autoclaves</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Ventas en Cubo OLAP</span>
            <div className="text-xl font-black text-emerald-400 mt-1 font-mono">
              ${summary?.cubeRevenueUsd?.toLocaleString()} <span className="text-xs text-slate-500">USD</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Ingresos analizados en matriz multidimensional</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Bitácora de Auditoría</span>
            <div className="text-xl font-black text-amber-400 mt-1 font-mono">
              {summary?.auditTrailEvents} <span className="text-xs text-slate-500">eventos</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Trazabilidad inmutable de operaciones clave</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Gobernanza & Integridad</span>
            <div className="text-xl font-black text-purple-400 mt-1">
              {summary?.ecosystemIntegrity}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">{summary?.taxStatus}</p>
          </div>
        </div>

        {/* Diagrama del Flujo Integrado de Extremo a Extremo */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-white text-base">Arquitectura del Flujo de Datos Transversal (Circuito 7)</h3>
              <p className="text-xs text-slate-400">Cómo convergen los 5 módulos en tiempo real</p>
            </div>
            <span className="text-xs text-indigo-400 font-bold bg-indigo-950/60 border border-indigo-800 px-3 py-1 rounded-full">
              Sincronizado
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase block mb-1">Paso 1 • [21] Big Data</span>
                <h4 className="font-bold text-sm text-white">Telemetría IoT</h4>
                <p className="text-[11px] text-slate-400 mt-1">Lecturas continuas de 96 sensores de temperatura, RPM y tensión.</p>
              </div>
              <div className="mt-3 text-right text-xs text-slate-500">➔ Kafka Stream</div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-purple-400 uppercase block mb-1">Paso 2 • [22] Minería</span>
                <h4 className="font-bold text-sm text-white">Algoritmos ML</h4>
                <p className="text-[11px] text-slate-400 mt-1">K-Means agrupa clientes RFM y Apriori detecta afinidad de tejidos.</p>
              </div>
              <div className="mt-3 text-right text-xs text-slate-500">➔ Patrones</div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-cyan-400 uppercase block mb-1">Paso 3 • [20] BI</span>
                <h4 className="font-bold text-sm text-white">Cubo OLAP</h4>
                <p className="text-[11px] text-slate-400 mt-1">Slice & dice multidimensional de ingresos, márgenes y volumen.</p>
              </div>
              <div className="mt-3 text-right text-xs text-slate-500">➔ Indicadores</div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-blue-400 uppercase block mb-1">Paso 4 • [18] Reportes</span>
                <h4 className="font-bold text-sm text-white">Dictamen Oficial</h4>
                <p className="text-[11px] text-slate-400 mt-1">Generación de P&L, balanza fiscal tributaria / NIF y reporte OEE.</p>
              </div>
              <div className="mt-3 text-right text-xs text-slate-500">➔ Certificación</div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase block mb-1">Paso 5 • [26] Configuración</span>
                <h4 className="font-bold text-sm text-white">Gobernanza Fiscal Multi-País</h4>
                <p className="text-[11px] text-slate-400 mt-1">Firma electrónica DTE / CSD, seguridad RBAC y bitácora de auditoría inmutable.</p>
              </div>
              <div className="mt-3 text-right text-xs text-emerald-400 font-bold">✓ 100% Blindado</div>
            </div>
          </div>
        </div>

        {/* Acceso Rápido a los 5 Módulos de la Fase */}
        <div>
          <h3 className="font-bold text-white text-lg mb-4 flex items-center gap-2">
            <span>📦</span> Módulos Integrados en el Circuito 7
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* [20] BI */}
            <Link
              to="/app/bi"
              className="bg-slate-900 border border-slate-800 hover:border-cyan-500/50 p-5 rounded-2xl flex flex-col justify-between group transition-all"
            >
              <div>
                <span className="text-[10px] font-bold text-cyan-400 uppercase block mb-1">Módulo [20]</span>
                <h4 className="font-bold text-white text-base group-hover:text-cyan-400 transition-colors">
                  Business Intelligence (BI)
                </h4>
                <p className="text-xs text-slate-400 mt-1">Cubo OLAP y segmentación multidimensional.</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 text-xs font-bold text-cyan-400 flex justify-between items-center">
                <span>Abrir Módulo</span>
                <span>➔</span>
              </div>
            </Link>

            {/* [18] BI y Reportes */}
            <Link
              to="/app/biyreportes"
              className="bg-slate-900 border border-slate-800 hover:border-blue-500/50 p-5 rounded-2xl flex flex-col justify-between group transition-all"
            >
              <div>
                <span className="text-[10px] font-bold text-blue-400 uppercase block mb-1">Módulo [18]</span>
                <h4 className="font-bold text-white text-base group-hover:text-blue-400 transition-colors">
                  BI y Reportes
                </h4>
                <p className="text-xs text-slate-400 mt-1">Estados financieros, balanza tributaria y OEE imprimible.</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 text-xs font-bold text-blue-400 flex justify-between items-center">
                <span>Abrir Módulo</span>
                <span>➔</span>
              </div>
            </Link>

            {/* [21] Big Data */}
            <Link
              to="/app/bigdata"
              className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 p-5 rounded-2xl flex flex-col justify-between group transition-all"
            >
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase block mb-1">Módulo [21]</span>
                <h4 className="font-bold text-white text-base group-hover:text-emerald-400 transition-colors">
                  Big Data IoT
                </h4>
                <p className="text-xs text-slate-400 mt-1">Data Lakehouse de telares y autoclaves.</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 text-xs font-bold text-emerald-400 flex justify-between items-center">
                <span>Abrir Módulo</span>
                <span>➔</span>
              </div>
            </Link>

            {/* [22] Minería de Datos */}
            <Link
              to="/app/mineriadatos"
              className="bg-slate-900 border border-slate-800 hover:border-purple-500/50 p-5 rounded-2xl flex flex-col justify-between group transition-all"
            >
              <div>
                <span className="text-[10px] font-bold text-purple-400 uppercase block mb-1">Módulo [22]</span>
                <h4 className="font-bold text-white text-base group-hover:text-purple-400 transition-colors">
                  Minería de Datos
                </h4>
                <p className="text-xs text-slate-400 mt-1">Clustering K-Means y reglas Apriori.</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 text-xs font-bold text-purple-400 flex justify-between items-center">
                <span>Abrir Módulo</span>
                <span>➔</span>
              </div>
            </Link>

            {/* [26] Configuración */}
            <Link
              to="/app/configuracion"
              className="bg-slate-900 border border-slate-800 hover:border-slate-500 p-5 rounded-2xl flex flex-col justify-between group transition-all"
            >
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Módulo [26]</span>
                <h4 className="font-bold text-white text-base group-hover:text-slate-300 transition-colors">
                  Configuración Global
                </h4>
                <p className="text-xs text-slate-400 mt-1">Datos fiscales, divisas, roles y auditoría.</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 text-xs font-bold text-slate-400 flex justify-between items-center">
                <span>Abrir Módulo</span>
                <span>➔</span>
              </div>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
