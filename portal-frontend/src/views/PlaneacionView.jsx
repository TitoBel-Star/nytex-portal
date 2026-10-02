import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PlaneacionView() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [executing, setExecuting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const fetchPlanningData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/fase6/planeacion/mrp');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error('Error fetching planning data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlanningData();
  }, []);

  const handleExecutePlan = async () => {
    try {
      setExecuting(true);
      const res = await fetch('/api/fase6/planeacion/generate-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rolls: data?.demand?.totalRollsDemanded || 50,
          kgYarn: data?.mrp?.deficitKg || 600
        })
      });
      const json = await res.json();
      if (res.ok) {
        setFeedback({ type: 'success', message: json.message });
        fetchPlanningData();
      } else {
        setFeedback({ type: 'error', message: json.error });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setExecuting(false);
    }
  };

  const demand = data?.demand;
  const mrp = data?.mrp;
  const capacity = data?.capacity;
  const suggestedActions = data?.suggestedActions || [];

  return (
    <div className="h-full flex flex-col bg-[#f8fafc] overflow-hidden w-full">
      {/* Top Header */}
      <div className="flex flex-col border-b border-gray-200 px-6 py-4 bg-white sticky top-0 z-10 shrink-0 shadow-sm w-full">
        <div className="flex justify-between items-center">
          <div className="flex items-center text-lg text-gray-700">
            <span className="cursor-pointer hover:underline text-[#006EAD]" onClick={() => navigate('/portal')}>Portal</span>
            <span className="mx-2 text-gray-400">/</span>
            <span className="font-bold text-[#0A2540] flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs bg-amber-100 text-amber-900 font-bold rounded-full">[25] Planeación</span>
              Plan Maestro S&OP (Sales & Operations Planning) & MRP II
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => navigate('/app/produccion')}
              className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm"
            >
              [5] Producción
            </button>
            <button 
              onClick={() => navigate('/app/compras')}
              className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm"
            >
              [4] Compras
            </button>
            <button 
              onClick={() => navigate('/app/circuito-ia-planeacion')}
              className="bg-[#0A2540] hover:bg-[#1E3A8A] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-all"
            >
              Monitor Circuito 6 ➔
            </button>
          </div>
        </div>
      </div>

      {/* Contenido con scroll */}
      <div className="flex-1 overflow-auto p-6 space-y-6">

        {/* Banner Ilustrativo */}
        <div className="bg-gradient-to-r from-[#78350f] via-[#92400e] to-[#b45309] rounded-2xl p-6 text-white shadow-md">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="max-w-3xl space-y-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 text-white uppercase tracking-wider">
                Alineación Estratégica Ventas vs Capacidad Fabril
              </span>
              <h2 className="text-2xl font-black">Plan Maestro de Producción & Requerimientos MRP</h2>
              <p className="text-sm text-amber-100 leading-relaxed">
                El motor S&OP lee los pedidos comerciales confirmados en <strong>[1] Ventas</strong>, los contrasta con el inventario de hilaturas en <strong>[3] Almacén</strong> y la capacidad de telares en <strong>[5] Producción</strong>, calculando las compras y órdenes fabriles necesarias para cumplir entregas sin sobrecostos.
              </p>
            </div>

            <button
              disabled={executing}
              onClick={handleExecutePlan}
              className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white px-6 py-3.5 rounded-xl text-xs font-black shadow-lg transition-all flex items-center gap-2 shrink-0"
            >
              <span>🚀</span> {executing ? 'Generando Órdenes...' : 'Disparar Plan S&OP (Generar OP y PO)'}
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-4 border-t border-white/20">
            <div>
              <span className="text-xs text-amber-200 font-bold uppercase">1. Demanda Comprometida</span>
              <div className="text-2xl font-black font-mono">{demand?.totalRollsDemanded || 0} Rollos</div>
              <div className="text-xs text-amber-200">Tela Jersey Algodón Crudo</div>
            </div>
            <div>
              <span className="text-xs text-amber-200 font-bold uppercase">2. Hilatura Requerida (BOM)</span>
              <div className="text-2xl font-black font-mono">{(mrp?.totalRequiredKg || 0).toLocaleString()} kg</div>
              <div className="text-xs text-amber-200">21 kg / rollo (5% merma técnica)</div>
            </div>
            <div>
              <span className="text-xs text-amber-200 font-bold uppercase">3. Déficit de Compra</span>
              <div className="text-2xl font-black font-mono text-rose-300">
                {(mrp?.deficitKg || 0).toLocaleString()} kg
              </div>
              <div className="text-xs text-rose-200">${(mrp?.suggestedPurchaseAmount || 0).toLocaleString()} USD a emitir</div>
            </div>
            <div>
              <span className="text-xs text-amber-200 font-bold uppercase">4. Utilización de Telares</span>
              <div className="text-2xl font-black font-mono text-emerald-300">
                {capacity?.loomUtilizationPct || 0}%
              </div>
              <div className="text-xs text-emerald-200">{capacity?.totalLoomHoursRequired || 0} h de 1,200 h mensuales</div>
            </div>
          </div>
        </div>

        {feedback && (
          <div className="p-4 rounded-xl text-xs font-bold flex justify-between items-center shadow-sm bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span>✓ {feedback.message}</span>
            <button onClick={() => setFeedback(null)} className="text-gray-400 hover:text-gray-600 font-bold ml-4">✕</button>
          </div>
        )}

        {/* 2 Columnas: Explosión MRP de Insumos vs Capacidad de Máquinas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Tarjeta 1: Requerimientos Netos de Materiales (MRP) */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                  <span>📦</span> Explosión de Materiales MRP (Hilaturas)
                </h4>
                <p className="text-xs text-gray-500">Materia prima indispensable para tejeduría.</p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900">
                {mrp?.urgency}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center p-3 rounded-xl bg-gray-50 border">
                <span className="text-gray-600">Material Insumo Clave:</span>
                <span className="font-bold text-gray-900">{mrp?.materialName} ({mrp?.materialSku})</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-gray-50 border">
                <span className="text-gray-600">Requerimiento Bruto de Producción:</span>
                <span className="font-mono font-bold text-gray-900">{mrp?.totalRequiredKg?.toLocaleString()} kg</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-gray-50 border">
                <span className="text-gray-600">Stock Actual en Almacén [3]:</span>
                <span className="font-mono font-bold text-emerald-700">{mrp?.currentStockKg?.toLocaleString()} kg</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-rose-50 border border-rose-200">
                <span className="text-rose-900 font-bold">Faltante Neto a Comprar en [4]:</span>
                <span className="font-mono font-black text-rose-700 text-sm">{mrp?.deficitKg?.toLocaleString()} kg (${mrp?.suggestedPurchaseAmount?.toLocaleString()} USD)</span>
              </div>
              <div className="text-[11px] text-gray-500 pt-1">
                Proveedor Recomendado en Business Partners: <strong>{mrp?.recommendedSupplier}</strong>
              </div>
            </div>
          </div>

          {/* Tarjeta 2: Capacidad de Planta & Telares (RCCP) */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                  <span>⚙️</span> Capacidad de Planta (Tejeduría en Telar)
                </h4>
                <p className="text-xs text-gray-500">Balance de horas máquina vs calendario fabril.</p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900">
                {capacity?.status}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center p-3 rounded-xl bg-gray-50 border">
                <span className="text-gray-600">Telares Circulares Disponibles:</span>
                <span className="font-bold text-gray-900">{capacity?.activeLooms} Unidades (Mayer & Cie)</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-gray-50 border">
                <span className="text-gray-600">Capacidad Teórica Mensual:</span>
                <span className="font-mono font-bold text-gray-900">{capacity?.monthlyLoomCapacityHours} horas</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-gray-50 border">
                <span className="text-gray-600">Horas Máquina Requeridas:</span>
                <span className="font-mono font-bold text-purple-800">{capacity?.totalLoomHoursRequired} horas</span>
              </div>
              <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 flex justify-between items-center">
                <span className="text-purple-900 font-bold">Porcentaje de Utilización Proyectado:</span>
                <span className="font-mono font-black text-purple-900 text-sm">{capacity?.loomUtilizationPct}%</span>
              </div>
              <div className="text-[11px] text-emerald-600 font-medium pt-1">
                ✓ El parque de maquinaria cuenta con margen suficiente para absorber la demanda sin turnos triples de sobretiempo.
              </div>
            </div>
          </div>

        </div>

        {/* Acciones Recomendadas por S&OP */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <h4 className="font-bold text-gray-900 text-sm">Órdenes Programadas por el Plan S&OP</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suggestedActions.map(act => (
              <div key={act.id} className="p-4 rounded-xl border border-gray-200 bg-gray-50/70 flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 px-2 py-0.5 rounded bg-amber-100">
                    {act.type} ➔ {act.moduleTarget}
                  </span>
                  <h5 className="font-bold text-xs text-gray-900 mt-2">{act.title}</h5>
                  {act.amount && <p className="text-[11px] text-gray-500 font-mono mt-0.5">Presupuesto: ${act.amount?.toLocaleString()} USD</p>}
                  {act.hours && <p className="text-[11px] text-gray-500 font-mono mt-0.5">Tiempo de Tejido: {act.hours} horas máquina</p>}
                </div>
                <button
                  disabled={executing}
                  onClick={handleExecutePlan}
                  className="bg-[#0A2540] hover:bg-[#1E3A8A] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0"
                >
                  Ejecutar Orden ➔
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
