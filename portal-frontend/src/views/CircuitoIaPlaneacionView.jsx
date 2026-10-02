import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CircuitoIaPlaneacionView() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [executing, setExecuting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const fetchSummary = async () => {
    try {
      const res = await fetch('/api/circuit/ia-planeacion/summary');
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

  const handleExecuteSop = async () => {
    try {
      setExecuting(true);
      const res = await fetch('/api/fase6/planeacion/generate-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rolls: 50, kgYarn: 600 })
      });
      const json = await res.json();
      if (res.ok) {
        setFeedback({ type: 'success', message: json.message });
        fetchSummary();
      } else {
        setFeedback({ type: 'error', message: json.error });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setExecuting(false);
    }
  };

  const metrics = data?.metrics;

  return (
    <div className="h-full flex flex-col bg-[#f8fafc] overflow-hidden w-full">
      {/* Top Header */}
      <div className="flex flex-col border-b border-gray-200 px-6 py-4 bg-white sticky top-0 z-10 shrink-0 shadow-sm w-full">
        <div className="flex justify-between items-center">
          <div className="flex items-center text-lg text-gray-700">
            <span className="cursor-pointer hover:underline text-[#006EAD]" onClick={() => navigate('/portal')}>Portal</span>
            <span className="mx-2 text-gray-400">/</span>
            <span className="font-bold text-[#0A2540] flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs bg-rose-100 text-rose-900 font-bold rounded-full">Fase 6: Inteligencia & S&OP</span>
              Monitor Central de IA, Predictivos, Planeación S&OP y Dashboards
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => navigate('/app/ia')}
              className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm"
            >
              [23] IA Copilot
            </button>
            <button 
              onClick={() => navigate('/app/predictivos')}
              className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm"
            >
              [24] Predictivos
            </button>
            <button 
              onClick={() => navigate('/app/planeacion')}
              className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm"
            >
              [25] Planeación S&OP
            </button>
            <button 
              onClick={() => navigate('/app/dashboards')}
              className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm"
            >
              [19] Dashboards
            </button>
          </div>
        </div>
      </div>

      {/* Contenido con scroll */}
      <div className="flex-1 overflow-auto p-6 space-y-6">

        {/* Banner Ilustrativo */}
        <div className="bg-gradient-to-r from-[#881337] via-[#9f1239] to-[#be123c] rounded-2xl p-6 text-white shadow-md">
          <div className="max-w-4xl space-y-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 text-white uppercase tracking-wider">
              Circuito Estratégico & Analítica de Alta Dirección
            </span>
            <h2 className="text-2xl font-black">Inteligencia Artificial, Predictivos & S&OP</h2>
            <p className="text-sm text-rose-100 leading-relaxed">
              Cierre del ecosistema: la demanda de <strong>[1] Ventas</strong> y los pronósticos de <strong>[24] Predictivos</strong> se transforman en el plan maestro de <strong>[25] Planeación S&OP</strong>, alimentando automáticamente la emisión de compras e insumos; mientras <strong>[23] IA</strong> y <strong>[19] Dashboards</strong> ofrecen diagnósticos y control en tiempo real.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-4 border-t border-white/20">
            <div>
              <span className="text-xs text-rose-200 font-bold uppercase">1. Ventas Consolidadas</span>
              <div className="text-2xl font-black font-mono">${(metrics?.totalSales || 0).toLocaleString()} USD</div>
              <div className="text-xs text-rose-200">Facturación acumulada</div>
            </div>
            <div>
              <span className="text-xs text-rose-200 font-bold uppercase">2. Motor de IA Copilot</span>
              <div className="text-xl font-black text-emerald-300">● Conectado a BD</div>
              <div className="text-xs text-rose-200">Consultas en lenguaje natural</div>
            </div>
            <div>
              <span className="text-xs text-rose-200 font-bold uppercase">3. Plan S&OP Activo</span>
              <div className="text-2xl font-black font-mono">Octubre 2026</div>
              <div className="text-xs text-rose-200">Requerimientos netos calculados</div>
            </div>
            <div>
              <span className="text-xs text-rose-200 font-bold uppercase">4. Capacidad de Telares</span>
              <div className="text-2xl font-black font-mono text-cyan-200">1,200 horas/mes</div>
              <div className="text-xs text-rose-200">{metrics?.loonsCount || 2} Telares Mayer & Cie</div>
            </div>
          </div>
        </div>

        {feedback && (
          <div className="p-4 rounded-xl text-xs font-bold flex justify-between items-center shadow-sm bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span>✓ {feedback.message}</span>
            <button onClick={() => setFeedback(null)} className="text-gray-400 hover:text-gray-600 font-bold ml-4">✕</button>
          </div>
        )}

        {/* Tarjetas del Flujo Inteligente */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* Paso 1: Predictivos */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">[24] Predictivos</span>
                <span className="text-xs text-gray-400">Paso 1</span>
              </div>
              <h4 className="font-bold text-gray-900 text-xs mt-2">Pronóstico de Demanda</h4>
              <p className="text-[11px] text-gray-500">
                Modelos de series de tiempo y regresión para estimar ventas de rollos de tela y riesgo en CxC.
              </p>
            </div>
            <button 
              onClick={() => navigate('/app/predictivos')}
              className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 py-1.5 rounded-lg text-xs font-bold transition-all"
            >
              Ver Modelos ➔
            </button>
          </div>

          {/* Paso 2: Planeación */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">[25] Planeación</span>
                <span className="text-xs text-gray-400">Paso 2</span>
              </div>
              <h4 className="font-bold text-gray-900 text-xs mt-2">Explosión MRP & Capacidad</h4>
              <p className="text-[11px] text-gray-500">
                Cálculo de kilos de hilo de algodón requeridos y balance de horas máquina en telares.
              </p>
            </div>
            <button 
              disabled={executing}
              onClick={handleExecuteSop}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white py-1.5 rounded-lg text-xs font-bold shadow transition-all"
            >
              Disparar Plan S&OP 🚀
            </button>
          </div>

          {/* Paso 3: Dashboards */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-cyan-100 text-cyan-800">[19] Dashboards</span>
                <span className="text-xs text-gray-400">Paso 3</span>
              </div>
              <h4 className="font-bold text-gray-900 text-xs mt-2">Tableros en Tiempo Real</h4>
              <p className="text-[11px] text-gray-500">
                Visualización unificada de KPIs comerciales, OEE fabril, inventarios y posición de tesorería.
              </p>
            </div>
            <button 
              onClick={() => navigate('/app/dashboards')}
              className="w-full bg-cyan-50 hover:bg-cyan-100 text-cyan-700 py-1.5 rounded-lg text-xs font-bold transition-all"
            >
              Abrir Tableros ➔
            </button>
          </div>

          {/* Paso 4: IA Copilot */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800">[23] IA Copilot</span>
                <span className="text-xs text-gray-400">Paso 4</span>
              </div>
              <h4 className="font-bold text-gray-900 text-xs mt-2">Asistente Cognitivo Textil</h4>
              <p className="text-[11px] text-gray-500">
                Diagnósticos automatizados y consultas en lenguaje natural fundamentadas en datos reales de la BD.
              </p>
            </div>
            <button 
              onClick={() => navigate('/app/ia')}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white py-1.5 rounded-lg text-xs font-bold shadow transition-all"
            >
              Abrir IA Copilot ➔
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
