import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProcessMiningView() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const fetchMiningData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/process/mining/summary');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error('Error fetching process mining data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMiningData();
  }, []);

  const handleSimulateCase = async () => {
    try {
      setSimulating(true);
      const res = await fetch('/api/process/mining/simulate-case', {
        method: 'POST'
      });
      const json = await res.json();
      if (res.ok) {
        setFeedback({ type: 'success', message: json.message });
        fetchMiningData();
      } else {
        setFeedback({ type: 'error', message: json.error });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setSimulating(false);
    }
  };

  const metrics = data?.metrics;
  const activityStats = data?.activityStats || [];
  const recentCases = data?.recentCases || [];

  return (
    <div className="h-full flex flex-col bg-[#f8fafc] overflow-hidden w-full">
      {/* Top Header */}
      <div className="flex flex-col border-b border-gray-200 px-6 py-4 bg-white sticky top-0 z-10 shrink-0 shadow-sm w-full">
        <div className="flex justify-between items-center">
          <div className="flex items-center text-lg text-gray-700">
            <span className="cursor-pointer hover:underline text-[#006EAD]" onClick={() => navigate('/portal')}>Portal</span>
            <span className="mx-2 text-gray-400">/</span>
            <span className="font-bold text-[#0A2540] flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs bg-indigo-100 text-indigo-900 font-bold rounded-full">[16] Process Mining</span>
              Minería de Procesos, Detección de Cuellos de Botella & Desviaciones
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => navigate('/app/processsuite')}
              className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm"
            >
              [15] Process Suite
            </button>
            <button 
              onClick={() => navigate('/app/circuito-procesos')}
              className="bg-[#0A2540] hover:bg-[#1E3A8A] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-all"
            >
              Monitor Gobernanza ➔
            </button>
          </div>
        </div>
      </div>

      {/* Contenido con scroll */}
      <div className="flex-1 overflow-auto p-6 space-y-6">

        {/* Banner Ilustrativo */}
        <div className="bg-gradient-to-r from-[#1e1b4b] via-[#312e81] to-[#4338ca] rounded-2xl p-6 text-white shadow-md">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="max-w-3xl space-y-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 text-white uppercase tracking-wider">
                Descubrimiento Automático de Procesos (Process Discovery)
              </span>
              <h2 className="text-2xl font-black">Algoritmo de Minería Operativa del ERP</h2>
              <p className="text-sm text-indigo-100 leading-relaxed">
                NyTEX Process Mining lee los registros de auditoría y marcas de tiempo generados por <strong>Ventas, WMS, Logística, Compras y Tesorería</strong> para reconstruir el flujo de trabajo real, compararlo contra el modelo BPMN ideal y alertar cuellos de botella antes de que afecten la entrega al cliente.
              </p>
            </div>

            <button
              disabled={simulating}
              onClick={handleSimulateCase}
              className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white px-5 py-3 rounded-xl text-xs font-black shadow-lg transition-all flex items-center gap-2 shrink-0"
            >
              <span>⚡</span> {simulating ? 'Procesando Eventos...' : 'Descubrir Nuevo Caso en Vivo'}
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6 pt-4 border-t border-white/20">
            <div>
              <span className="text-xs text-indigo-200 font-bold uppercase">1. Casos Analizados</span>
              <div className="text-2xl font-black font-mono">{metrics?.totalCases || 0} Tránsitos</div>
              <div className="text-xs text-indigo-200">Pedidos y órdenes activas</div>
            </div>
            <div>
              <span className="text-xs text-indigo-200 font-bold uppercase">2. Eventos Minados</span>
              <div className="text-2xl font-black font-mono">{metrics?.totalEvents || 0} Registros</div>
              <div className="text-xs text-indigo-200">Marcas de tiempo auditadas</div>
            </div>
            <div>
              <span className="text-xs text-indigo-200 font-bold uppercase">3. Lead Time Promedio</span>
              <div className="text-2xl font-black font-mono">{metrics?.avgDurationHours || '0.0'} Horas</div>
              <div className="text-xs text-indigo-200">Tiempo ciclo end-to-end</div>
            </div>
            <div>
              <span className="text-xs text-indigo-200 font-bold uppercase">4. Tasa de Conformancia</span>
              <div className="text-2xl font-black font-mono text-emerald-300">{metrics?.conformanceRate || 0}%</div>
              <div className="text-xs text-emerald-200">Cumplimiento de ruta óptima</div>
            </div>
            <div>
              <span className="text-xs text-indigo-200 font-bold uppercase">5. Cuellos de Botella</span>
              <div className="text-2xl font-black font-mono text-rose-300">
                {metrics?.identifiedBottlenecksCount || 0} Etapas Críticas
              </div>
              <div className="text-xs text-rose-200">Requieren optimización</div>
            </div>
          </div>
        </div>

        {feedback && (
          <div className="p-4 rounded-xl text-xs font-bold flex justify-between items-center shadow-sm bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span>✓ {feedback.message}</span>
            <button onClick={() => setFeedback(null)} className="text-gray-400 hover:text-gray-600 font-bold ml-4">✕</button>
          </div>
        )}

        {/* GRAFO DE DESCUBRIMIENTO DE PROCESOS (Direct-Follows Graph) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          <div className="flex justify-between items-center border-b pb-3">
            <div>
              <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <span>🗺️</span> Grafo de Flujo Descubierto (Order-to-Cash Textil)
              </h3>
              <p className="text-xs text-gray-500">
                Secuencia reconstruida automáticamente a partir de los timestamps reales del sistema.
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
              🔴 Cuello de botella detectado en Despacho Logístico
            </span>
          </div>

          {/* Diagrama de Nodos y Tiempos */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-3 py-4">
            {activityStats.map((act, index) => {
              const isBottleneck = act.isMajorBottleneck;
              return (
                <div 
                  key={act.activity}
                  className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                    isBottleneck 
                      ? 'bg-rose-50/70 border-rose-300 ring-2 ring-rose-400/50 shadow-md' 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-center">
                      <span className={`text-[10px] font-black uppercase px-1.5 py-0.5 rounded ${
                        isBottleneck ? 'bg-rose-200 text-rose-900 font-bold' : 'bg-gray-200 text-gray-700'
                      }`}>
                        Etapa {index + 1}
                      </span>
                      {isBottleneck && <span className="text-xs text-rose-600 font-bold">⚠️ SLA Excedido</span>}
                    </div>
                    <h5 className="font-bold text-xs text-gray-900 mt-2 leading-snug">{act.activity}</h5>
                  </div>

                  <div className="mt-4 pt-2 border-t border-gray-200/60">
                    <div className="text-[11px] text-gray-500">Tiempo Medio:</div>
                    <div className={`text-base font-black font-mono ${
                      isBottleneck ? 'text-rose-700' : 'text-gray-800'
                    }`}>
                      {act.avgMinutes} min <span className="text-xs font-normal">({act.avgHours}h)</span>
                    </div>
                    <div className="text-[10px] text-gray-400 mt-0.5">
                      Frecuencia: {act.count} ejecuciones
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Diagnóstico Causa Raíz */}
          <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-xs space-y-1 text-amber-900">
            <span className="font-bold uppercase tracking-wider text-[11px] block">
              💡 Diagnóstico Automatizado de Minería de Procesos:
            </span>
            <p className="leading-relaxed">
              La etapa <strong>"4. Despacho y Transporte en Logística"</strong> promedia más de 3.5 horas de duración (representando el <strong>58% del tiempo total del ciclo</strong>). Se recomienda optimizar el tiempo de consolidación de carga con la flota externa (Transportes Express) o implementar asignación previa en WMS para reducir el tiempo en andén.
            </p>
          </div>
        </div>

        {/* Casos Recientes Minados */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          <h3 className="font-bold text-gray-900 text-sm">Casos y Trazas Recientes Analizadas</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider">
                  <th className="py-2.5 px-3">Caso (Instancia)</th>
                  <th className="py-2.5 px-3">Proceso</th>
                  <th className="py-2.5 px-3 text-center">Eventos Registrados</th>
                  <th className="py-2.5 px-3 text-right">Duración Total</th>
                  <th className="py-2.5 px-3 text-center">Conformancia SLA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentCases.map(c => (
                  <tr key={c.caseId} className="hover:bg-indigo-50/30 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-indigo-900">
                      {c.caseId}
                    </td>
                    <td className="py-3 px-3 font-medium text-gray-800">
                      {c.processName}
                    </td>
                    <td className="py-3 px-3 text-center font-mono">
                      {c.events?.length || 0} pasos
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-gray-900">
                      {c.totalDurationMinutes} min ({(c.totalDurationMinutes / 60).toFixed(1)}h)
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        c.hasBottleneck ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {c.hasBottleneck ? 'Retraso Detectado' : '✓ 100% Conforme'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
