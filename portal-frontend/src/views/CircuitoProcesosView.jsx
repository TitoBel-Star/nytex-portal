import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CircuitoProcesosView() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const fetchSummary = async () => {
    try {
      const res = await fetch('/api/circuit/procesos/summary');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error('Error fetching circuit summary:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
    const interval = setInterval(fetchSummary, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleQuickApprove = async (taskCode) => {
    try {
      setActionLoading(true);
      const res = await fetch(`/api/process/tasks/${taskCode}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'Aprobar', notes: 'Aprobación rápida desde Monitor de Gobernanza' })
      });
      const json = await res.json();
      if (res.ok) {
        setFeedback({ type: 'success', message: `Tarea ${taskCode} aprobada exitosamente.` });
        fetchSummary();
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  const handleSimulateCase = async () => {
    try {
      setActionLoading(true);
      const res = await fetch('/api/process/mining/simulate-case', {
        method: 'POST'
      });
      const json = await res.json();
      if (res.ok) {
        setFeedback({ type: 'success', message: json.message });
        fetchSummary();
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  const metrics = data?.metrics;
  const pendingTasks = data?.pendingTasks || [];
  const models = data?.models || [];

  return (
    <div className="h-full flex flex-col bg-[#f8fafc] overflow-hidden w-full">
      {/* Top Header */}
      <div className="flex flex-col border-b border-gray-200 px-6 py-4 bg-white sticky top-0 z-10 shrink-0 shadow-sm w-full">
        <div className="flex justify-between items-center">
          <div className="flex items-center text-lg text-gray-700">
            <span className="cursor-pointer hover:underline text-[#006EAD]" onClick={() => navigate('/portal')}>Portal</span>
            <span className="mx-2 text-gray-400">/</span>
            <span className="font-bold text-[#0A2540] flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs bg-purple-100 text-purple-900 font-bold rounded-full">Fase 5: Gobernanza & Minería</span>
              Monitor Central de Process Suite & Process Mining
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
              onClick={() => navigate('/app/processmining')}
              className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm"
            >
              [16] Process Mining
            </button>
          </div>
        </div>
      </div>

      {/* Contenido con scroll */}
      <div className="flex-1 overflow-auto p-6 space-y-6">

        {/* Banner Ilustrativo */}
        <div className="bg-gradient-to-r from-[#3b0764] via-[#581c87] to-[#7e22ce] rounded-2xl p-6 text-white shadow-md">
          <div className="max-w-4xl space-y-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 text-white uppercase tracking-wider">
              Ciclo de Mejora Continua y Control Operativo
            </span>
            <h2 className="text-2xl font-black">Gobernanza de Procesos & Minería Operativa</h2>
            <p className="text-sm text-purple-100 leading-relaxed">
              Orquestación transversal del negocio: <strong>[15] Process Suite</strong> impone reglas BPMN 2.0 y compuertas de autorización para compras de materia prima y líneas de crédito; mientras que <strong>[16] Process Mining</strong> audita los eventos transaccionales para detectar demoras, cuellos de botella en logística y desvíos de SLAs.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-4 border-t border-white/20">
            <div>
              <span className="text-xs text-purple-200 font-bold uppercase">1. Modelos Desplegados</span>
              <div className="text-2xl font-black font-mono">{metrics?.deployedModels || 0} Workflows</div>
              <div className="text-xs text-purple-200">Compras, Crédito, Calidad, Nómina</div>
            </div>
            <div>
              <span className="text-xs text-purple-200 font-bold uppercase">2. Tareas en Bandeja</span>
              <div className="text-2xl font-black font-mono text-amber-300">{metrics?.pendingTasksCount || 0} Pendientes</div>
              <div className="text-xs text-purple-200">Requieren visto bueno directivo</div>
            </div>
            <div>
              <span className="text-xs text-purple-200 font-bold uppercase">3. Casos Minados</span>
              <div className="text-2xl font-black font-mono">{metrics?.analyzedCases || 0} Instancias</div>
              <div className="text-xs text-purple-200">Marcas de tiempo analizadas</div>
            </div>
            <div>
              <span className="text-xs text-purple-200 font-bold uppercase">4. Cuellos de Botella</span>
              <div className="text-2xl font-black font-mono text-rose-300">{metrics?.bottlenecksDetected || 0} Alertas</div>
              <div className="text-xs text-rose-200">Despacho logístico demorado</div>
            </div>
          </div>
        </div>

        {feedback && (
          <div className="p-4 rounded-xl text-xs font-bold flex justify-between items-center shadow-sm bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span>✓ {feedback.message}</span>
            <button onClick={() => setFeedback(null)} className="text-gray-400 hover:text-gray-600 font-bold ml-4">✕</button>
          </div>
        )}

        {/* Diagrama de Gobernanza: Diseñar ➔ Ejecutar ➔ Minar ➔ Optimizar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Columna 1: Tareas Pendientes de Aprobación */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                  <span>📥</span> Tareas de Aprobación Urgentes en Process Suite
                </h3>
                <p className="text-xs text-gray-500">Autorizaciones requeridas para desbloquear órdenes de compra y créditos.</p>
              </div>
              <button 
                onClick={() => navigate('/app/processsuite')}
                className="text-xs text-purple-700 font-bold hover:underline"
              >
                Abrir Inbox Completo ➔
              </button>
            </div>

            <div className="space-y-3">
              {pendingTasks.map(task => (
                <div key={task.taskCode} className="p-3 rounded-xl border border-amber-200 bg-amber-50/40 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-mono font-bold text-gray-800">{task.taskCode} • {task.referenceCode}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-200 text-amber-900">
                      Prioridad {task.priority}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-gray-900">{task.title}</h4>
                  <div className="flex justify-between items-center pt-2 border-t border-amber-200/60 text-xs">
                    <span className="text-gray-600">
                      Monto: <strong className="text-emerald-700 font-mono">${task.amount?.toLocaleString()} USD</strong>
                    </span>
                    <button
                      disabled={actionLoading}
                      onClick={() => handleQuickApprove(task.taskCode)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded-lg text-xs font-bold shadow transition-all"
                    >
                      ✓ Aprobar Rápido
                    </button>
                  </div>
                </div>
              ))}
              {pendingTasks.length === 0 && (
                <div className="py-8 text-center text-gray-400 text-xs">
                  ✓ No hay tareas pendientes en la bandeja de aprobación.
                </div>
              )}
            </div>
          </div>

          {/* Columna 2: Process Mining & Optimización */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                  <span>🔍</span> Descubrimiento & Minería en Vivo
                </h3>
                <p className="text-xs text-gray-500">Monitoreo continuo de tiempos y conformancia en el ERP.</p>
              </div>
              <button 
                onClick={() => navigate('/app/processmining')}
                className="text-xs text-indigo-700 font-bold hover:underline"
              >
                Abrir Process Mining ➔
              </button>
            </div>

            <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/50 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-rose-800 uppercase tracking-wider">
                  ⚠️ Cuello de Botella Activo
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-rose-200 text-rose-900 font-bold">
                  SLA 1h vs Real 3.5h
                </span>
              </div>
              <h4 className="font-bold text-xs text-gray-900">
                Despacho y Transporte en Logística (Flota Foránea)
              </h4>
              <p className="text-[11px] text-gray-600">
                El 58% del tiempo total de los pedidos comerciales se consume en la espera de asignación de transporte externo en el andén.
              </p>
            </div>

            <div className="pt-2 flex justify-between items-center">
              <span className="text-xs text-gray-500">¿Desea probar la detección automática?</span>
              <button
                disabled={actionLoading}
                onClick={handleSimulateCase}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow transition-all flex items-center gap-1.5"
              >
                <span>⚡</span> Simular Nuevo Caso O2C
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
