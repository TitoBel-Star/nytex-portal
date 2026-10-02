import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CircuitoComercialView() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSummary = async () => {
    try {
      const res = await fetch('/api/circuit/comercial/summary');
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
    const interval = setInterval(fetchSummary, 5000); // Polling cada 5 seg para ver cambios en vivo
    return () => clearInterval(interval);
  }, []);

  const getStagePercent = (item) => {
    if (item.cxcStatus === 'Pagada') return 100;
    if (item.orderStatus === 'Entregado') return 80;
    if (item.shipmentStatus === 'En Tránsito' || item.shipmentStatus === 'En Reparto') return 60;
    if (item.wmsStatus === 'Listo para Despacho' || item.wmsStatus === 'Empacado' || item.wmsStatus === 'En Picking') return 40;
    if (item.orderStatus === 'En Preparación WMS') return 30;
    return 15;
  };

  return (
    <div className="h-full flex flex-col bg-[#f4f7f9] overflow-hidden w-full">
      {/* Top Header */}
      <div className="flex flex-col border-b border-gray-200 px-6 py-4 bg-white sticky top-0 z-10 shrink-0 shadow-sm w-full">
        <div className="flex justify-between items-center">
          <div className="flex items-center text-lg text-gray-700">
            <span className="cursor-pointer hover:underline text-[#006EAD]" onClick={() => navigate('/portal')}>Portal</span>
            <span className="mx-2 text-gray-400">/</span>
            <span className="font-bold text-[#0A2540] flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs bg-purple-100 text-purple-800 font-bold rounded-full">Circuito O2C</span>
              Monitor Integral de Trazabilidad Comercial & Cumplimiento
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => navigate('/app/ventas')}
              className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm"
            >
              [2] Ventas
            </button>
            <button 
              onClick={() => navigate('/app/wms')}
              className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm"
            >
              [5] WMS
            </button>
            <button 
              onClick={() => navigate('/app/logistica')}
              className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm"
            >
              [6] Logística
            </button>
            <button 
              onClick={() => navigate('/app/cxc')}
              className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm"
            >
              [8] CxC
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 text-gray-800 w-full space-y-6">
        
        {/* Banner Ilustrativo del Flujo Integrado */}
        <div className="bg-gradient-to-r from-[#0A2540] via-[#006EAD] to-[#09A9E8] rounded-2xl p-6 text-white shadow-md">
          <div className="max-w-4xl space-y-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 text-white uppercase tracking-wider">
              Flujo Transaccional Automatizado
            </span>
            <h2 className="text-2xl font-black">Circuito Empresarial O2C (Order-to-Cash)</h2>
            <p className="text-sm text-blue-100 leading-relaxed">
              Vea cómo cada pedido avanza sincronizado entre los 4 módulos: desde la cotización y orden en <strong>Ventas [2]</strong>, la preparación y surtido en <strong>WMS [5]</strong>, el transporte y despacho en <strong>Logística [6]</strong>, hasta la emisión de factura y cobranza en <strong>CxC [8]</strong>.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-4 border-t border-white/20">
            <div>
              <span className="text-xs text-blue-200 font-bold uppercase">1. Ventas</span>
              <div className="text-xl font-bold">{data?.metrics?.totalOrders || 0} Órdenes</div>
              <div className="text-xs text-blue-100">${(data?.metrics?.totalSalesAmount || 0).toLocaleString()} USD</div>
            </div>
            <div>
              <span className="text-xs text-blue-200 font-bold uppercase">2. WMS Almacén</span>
              <div className="text-xl font-bold">{data?.metrics?.pendingWms || 0} en Surtido</div>
              <div className="text-xs text-blue-100">Picking & Racks</div>
            </div>
            <div>
              <span className="text-xs text-blue-200 font-bold uppercase">3. Logística</span>
              <div className="text-xl font-bold">{data?.metrics?.inTransitShipments || 0} en Tránsito</div>
              <div className="text-xs text-blue-100">{data?.metrics?.deliveredShipments || 0} Entregados</div>
            </div>
            <div>
              <span className="text-xs text-blue-200 font-bold uppercase">4. CxC Cartera</span>
              <div className="text-xl font-bold">${(data?.metrics?.totalReceivableBalance || 0).toLocaleString()} USD</div>
              <div className="text-xs text-blue-100">{data?.metrics?.overdueReceivables || 0} facturas vencidas</div>
            </div>
          </div>
        </div>

        {/* Pipeline de Órdenes en Tiempo Real */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          <div className="flex justify-between items-center border-b pb-3">
            <div>
              <h3 className="text-lg font-bold text-[#0A2540]">Pipeline Activo de Pedidos y Estado por Módulo</h3>
              <p className="text-xs text-gray-500">Actualización en vivo cada 5 segundos</p>
            </div>
            <button 
              onClick={fetchSummary}
              className="text-xs font-bold text-[#006EAD] hover:underline"
            >
              ↻ Forzar Sincronización
            </button>
          </div>

          {loading ? (
            <p className="text-center py-8 text-gray-400">Cargando estado del circuito...</p>
          ) : !data?.pipeline || data.pipeline.length === 0 ? (
            <p className="text-center py-8 text-gray-400">No hay órdenes en el pipeline.</p>
          ) : (
            <div className="space-y-4">
              {data.pipeline.map((item, idx) => {
                const pct = getStagePercent(item);
                return (
                  <div key={idx} className="p-4 rounded-xl border border-gray-200 bg-gray-50/60 hover:bg-white hover:shadow-md transition space-y-3">
                    <div className="flex flex-wrap justify-between items-center gap-2">
                      <div>
                        <span className="font-mono text-xs font-bold text-[#006EAD] bg-blue-50 px-2 py-0.5 rounded border border-blue-200 mr-2">
                          {item.orderCode}
                        </span>
                        <strong className="text-gray-900 text-sm">{item.clientName}</strong>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-gray-800 text-sm">
                          ${(item.total || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })} USD
                        </span>
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800">
                          {pct}% Completado
                        </span>
                      </div>
                    </div>

                    {/* Barra de Progreso */}
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>

                    {/* Indicadores de los 4 Pasos */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2 text-xs">
                      {/* Paso 1: Ventas */}
                      <div className="p-2.5 rounded-lg bg-white border border-gray-200">
                        <div className="font-bold text-gray-500 uppercase text-[10px]">1. NyTEX Ventas</div>
                        <div className="font-semibold text-gray-800 mt-0.5">{item.orderStatus}</div>
                      </div>

                      {/* Paso 2: WMS */}
                      <div className="p-2.5 rounded-lg bg-white border border-gray-200">
                        <div className="font-bold text-gray-500 uppercase text-[10px]">2. NyTEX WMS</div>
                        <div className="font-semibold text-blue-700 mt-0.5">
                          {item.wmsCode ? `${item.wmsStatus}` : 'Pendiente Confirmar'}
                        </div>
                        {item.wmsCode && <div className="text-[10px] text-gray-400 font-mono">{item.wmsCode}</div>}
                      </div>

                      {/* Paso 3: Logística */}
                      <div className="p-2.5 rounded-lg bg-white border border-gray-200">
                        <div className="font-bold text-gray-500 uppercase text-[10px]">3. NyTEX Logística</div>
                        <div className="font-semibold text-amber-700 mt-0.5">
                          {item.trackingCode ? `${item.shipmentStatus}` : 'En Espera de Carga'}
                        </div>
                        {item.trackingCode && <div className="text-[10px] text-gray-400 font-mono">{item.trackingCode}</div>}
                      </div>

                      {/* Paso 4: CxC */}
                      <div className="p-2.5 rounded-lg bg-white border border-gray-200">
                        <div className="font-bold text-gray-500 uppercase text-[10px]">4. NyTEX CxC</div>
                        <div className="font-semibold text-purple-700 mt-0.5">
                          {item.invoiceCode ? `${item.invoiceCode} (${item.cxcStatus})` : 'Sin Facturar'}
                        </div>
                        {item.cxcBalance > 0 && (
                          <div className="text-[10px] text-red-600 font-bold">
                            Saldo: ${item.cxcBalance.toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
