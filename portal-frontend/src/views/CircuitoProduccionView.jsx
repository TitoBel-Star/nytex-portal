import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CircuitoProduccionView() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSummary = async () => {
    try {
      const res = await fetch('/api/circuit/produccion/summary');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error('Error fetching production circuit summary:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
    const interval = setInterval(fetchSummary, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full flex flex-col bg-[#f4f7f9] overflow-hidden w-full">
      {/* Top Header */}
      <div className="flex flex-col border-b border-gray-200 px-6 py-4 bg-white sticky top-0 z-10 shrink-0 shadow-sm w-full">
        <div className="flex justify-between items-center">
          <div className="flex items-center text-lg text-gray-700">
            <span className="cursor-pointer hover:underline text-[#006EAD]" onClick={() => navigate('/portal')}>Portal</span>
            <span className="mx-2 text-gray-400">/</span>
            <span className="font-bold text-[#0A2540] flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs bg-amber-100 text-amber-800 font-bold rounded-full">Circuito P2P & M</span>
              Monitor Integral de Abastecimiento, Inventario & Producción Fabril
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => navigate('/app/inventario')}
              className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm"
            >
              [4] Inventario
            </button>
            <button 
              onClick={() => navigate('/app/compras')}
              className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm"
            >
              [3] Compras
            </button>
            <button 
              onClick={() => navigate('/app/produccion')}
              className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm"
            >
              [7] Producción
            </button>
            <button 
              onClick={() => navigate('/app/cxp')}
              className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm"
            >
              [9] CxP
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 text-gray-800 w-full space-y-6">
        
        {/* Banner Ilustrativo */}
        <div className="bg-gradient-to-r from-[#1e293b] via-[#334155] to-[#475569] rounded-2xl p-6 text-white shadow-md">
          <div className="max-w-4xl space-y-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
              Cadena de Suministro y Manufactura Automatizada
            </span>
            <h2 className="text-2xl font-black">Circuito de Abastecimiento, Inventario & Fabricación</h2>
            <p className="text-sm text-gray-200 leading-relaxed">
              Monitoreo del ciclo MRP completo: el consumo de materiales en <strong>[7] Producción</strong> descuenta materias primas en <strong>[4] Inventario</strong>; los faltantes detonan órdenes en <strong>[3] Compras</strong>, y su recepción genera pasivos en <strong>[9] CxP</strong> mientras ingresa producto terminado para surtido.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-4 border-t border-white/10">
            <div>
              <span className="text-xs text-amber-300 font-bold uppercase">1. Insumos en Almacén</span>
              <div className="text-xl font-bold">{data?.metrics?.totalRawMaterials || 0} SKUs Registrados</div>
              <div className="text-xs text-amber-200">{data?.metrics?.lowStockAlerts || 0} bajo punto reorden</div>
            </div>
            <div>
              <span className="text-xs text-blue-300 font-bold uppercase">2. Compras a Proveedores</span>
              <div className="text-xl font-bold">{data?.metrics?.activePurchaseOrders || 0} Órdenes PO</div>
              <div className="text-xs text-blue-200">Abastecimiento en tránsito</div>
            </div>
            <div>
              <span className="text-xs text-emerald-300 font-bold uppercase">3. Planta de Producción</span>
              <div className="text-xl font-bold">{data?.metrics?.inProcessProduction || 0} OPs en Telar</div>
              <div className="text-xs text-emerald-200">Transformación activa</div>
            </div>
            <div>
              <span className="text-xs text-purple-300 font-bold uppercase">4. Producto Terminado</span>
              <div className="text-xl font-bold">{data?.metrics?.totalFinishedProducts || 0} rollos/un.</div>
              <div className="text-xs text-purple-200">Disponibles para Ventas</div>
            </div>
          </div>
        </div>

        {/* Alertas de Reabastecimiento Inmediato */}
        {data?.lowStockItems && data.lowStockItems.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-xl">⚠️</span>
                <h3 className="font-bold text-amber-900 text-sm">Alertas de Bajo Stock / Necesidad de Reorden Inmediata</h3>
              </div>
              <span className="text-xs font-semibold text-amber-700">{data.lowStockItems.length} insumos requieren compra</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {data.lowStockItems.map((item, idx) => (
                <div key={idx} className="bg-white p-3.5 rounded-xl border border-amber-200 shadow-xs flex justify-between items-center text-xs">
                  <div>
                    <div className="font-bold text-gray-900 text-sm">{item.name}</div>
                    <div className="text-gray-500 font-mono">SKU: {item.sku} | Ubicación: {item.location}</div>
                    <div className="text-amber-700 font-bold mt-1">
                      Existencia: {item.stock} {item.unit} (Mínimo requerido: {item.minStock} {item.unit})
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('/app/compras')}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg shadow-sm transition"
                  >
                    Crear PO en Compras ➔
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Órdenes de Fabricación en Planta */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          <div className="flex justify-between items-center border-b pb-3">
            <div>
              <h3 className="text-lg font-bold text-[#0A2540]">Estado de Órdenes de Fabricación en Planta</h3>
              <p className="text-xs text-gray-500">Trazabilidad desde asignación de maquinarias hasta ingreso a almacén</p>
            </div>
            <button 
              onClick={() => navigate('/app/produccion')}
              className="text-xs font-bold text-[#006EAD] hover:underline"
            >
              Ir a Producción [7] ➔
            </button>
          </div>

          {loading ? (
            <p className="text-center py-8 text-gray-400">Cargando circuito de producción...</p>
          ) : !data?.activeProductionOrders || data.activeProductionOrders.length === 0 ? (
            <p className="text-center py-8 text-gray-400">No hay órdenes de producción activas.</p>
          ) : (
            <div className="space-y-3">
              {data.activeProductionOrders.map((op, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 flex flex-wrap justify-between items-center gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                        {op.opCode}
                      </span>
                      <strong className="text-gray-900 text-sm">{op.productName}</strong>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Centro: {op.workcenter} | Operador: {op.operator} | Lote: <strong className="text-gray-800">{op.targetQuantity} {op.unit}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      op.status === 'Completada en Almacén PT' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                      op.status === 'En Proceso de Fabricación' ? 'bg-blue-100 text-blue-800 border-blue-300 animate-pulse' :
                      'bg-amber-100 text-amber-800 border-amber-300'
                    }`}>
                      {op.status}
                    </span>
                    <button
                      onClick={() => navigate('/app/produccion')}
                      className="px-3 py-1 text-xs bg-white hover:bg-gray-100 text-gray-700 font-bold border border-gray-200 rounded-lg shadow-xs"
                    >
                      Gestionar en Planta
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
