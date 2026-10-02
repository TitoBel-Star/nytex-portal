import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function DashboardsView() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/fase6/dashboards/metrics');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error('Error fetching dashboard metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 5000);
    return () => clearInterval(interval);
  }, []);

  const summary = data?.summary;
  const charts = data?.charts;
  const recentOrders = data?.recentOrders || [];

  return (
    <div className="h-full flex flex-col bg-[#f8fafc] overflow-hidden w-full">
      {/* Top Header */}
      <div className="flex flex-col border-b border-gray-200 px-6 py-4 bg-white sticky top-0 z-10 shrink-0 shadow-sm w-full">
        <div className="flex justify-between items-center">
          <div className="flex items-center text-lg text-gray-700">
            <span className="cursor-pointer hover:underline text-[#006EAD]" onClick={() => navigate('/portal')}>Portal</span>
            <span className="mx-2 text-gray-400">/</span>
            <span className="font-bold text-[#0A2540] flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs bg-cyan-100 text-cyan-900 font-bold rounded-full">[19] Dashboards</span>
              Tableros Ejecutivos & Métricas Transversales en Tiempo Real
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => navigate('/app/planeacion')}
              className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm"
            >
              [25] Planeación S&OP
            </button>
            <button 
              onClick={() => navigate('/app/predictivos')}
              className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm"
            >
              [24] Predictivos
            </button>
            <button 
              onClick={() => navigate('/app/ia')}
              className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm"
            >
              [23] IA Copilot
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

        {/* Tarjetas Ejecutivas Principales (4 Cuadrantes del Negocio) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Comercial */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2">
            <div className="flex justify-between items-center text-xs text-gray-500 font-bold uppercase">
              <span>Ventas Acumuladas</span>
              <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded">O2C</span>
            </div>
            <div className="text-2xl font-black font-mono text-gray-900">
              ${(summary?.totalSales || 0).toLocaleString()} USD
            </div>
            <div className="text-xs text-gray-500 flex justify-between">
              <span>{summary?.totalSalesOrdersCount || 0} pedidos confirmados</span>
              <span className="text-emerald-600 font-bold">100% activo</span>
            </div>
          </div>

          {/* Finanzas */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2">
            <div className="flex justify-between items-center text-xs text-gray-500 font-bold uppercase">
              <span>Liquidez en Tesorería</span>
              <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Bancos</span>
            </div>
            <div className="text-2xl font-black font-mono text-emerald-700">
              ${(summary?.totalBankBalance || 0).toLocaleString()} USD
            </div>
            <div className="text-xs text-gray-500 flex justify-between">
              <span>Por cobrar CxC:</span>
              <span className="font-mono font-bold text-gray-800">${(summary?.totalReceivables || 0).toLocaleString()}</span>
            </div>
          </div>

          {/* Inventario */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2">
            <div className="flex justify-between items-center text-xs text-gray-500 font-bold uppercase">
              <span>Valoración Almacén</span>
              <span className="text-amber-600 bg-amber-50 px-2 py-0.5 rounded">WMS</span>
            </div>
            <div className="text-2xl font-black font-mono text-gray-900">
              ${(summary?.totalInventoryValue || 0).toLocaleString()} USD
            </div>
            <div className="text-xs text-gray-500 flex justify-between">
              <span>Alertas Stock Mínimo:</span>
              <span className={`font-bold ${summary?.lowStockAlerts > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                {summary?.lowStockAlerts || 0} SKUs
              </span>
            </div>
          </div>

          {/* Manufactura */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2">
            <div className="flex justify-between items-center text-xs text-gray-500 font-bold uppercase">
              <span>Activos & Telar</span>
              <span className="text-purple-600 bg-purple-50 px-2 py-0.5 rounded">Planta</span>
            </div>
            <div className="text-2xl font-black font-mono text-purple-900">
              ${(summary?.totalAssetBookValue || 0).toLocaleString()} USD
            </div>
            <div className="text-xs text-gray-500 flex justify-between">
              <span>Órdenes activas:</span>
              <span className="font-bold text-indigo-700">{summary?.activeProductionOrders || 0} en proceso</span>
            </div>
          </div>
        </div>

        {/* Paneles de Desglose y Gráficos Visuales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Panel 1: Estado del Pipeline Comercial */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <span>📈</span> Embudo Comercial (Ventas & Facturación)
              </h4>
              <span className="text-xs text-blue-600 font-bold">En Vivo</span>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600">Pedidos Confirmados</span>
                  <span className="font-bold font-mono text-blue-700">{charts?.salesByStatus?.pedidos || 0}</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: '80%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600">Facturados en CxC</span>
                  <span className="font-bold font-mono text-emerald-700">{charts?.salesByStatus?.facturados || 0}</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600">Cotizaciones Abiertas CRM</span>
                  <span className="font-bold font-mono text-amber-700">{charts?.salesByStatus?.cotizaciones || 0}</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: '30%' }}></div>
                </div>
              </div>
            </div>
            <button 
              onClick={() => navigate('/app/ventas')}
              className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 py-1.5 rounded-lg text-xs font-bold transition-all text-center block mt-2"
            >
              Abrir Módulo de Ventas [1] ➔
            </button>
          </div>

          {/* Panel 2: Posición de Tesorería por Entidad Bancaria */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <span>🏦</span> Distribución de Fondos Bancarios
              </h4>
              <span className="text-xs text-emerald-600 font-bold">100% Conciliado</span>
            </div>
            <div className="space-y-2.5">
              {charts?.financialLiquidity?.map(b => (
                <div key={b.bankName} className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-gray-800 text-xs block">{b.bankName}</span>
                    <span className="text-[10px] text-gray-500 uppercase">{b.currency} • Operativa</span>
                  </div>
                  <span className="font-mono font-bold text-xs text-emerald-700">
                    ${b.balance?.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
            <button 
              onClick={() => navigate('/app/tesoreria')}
              className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 py-1.5 rounded-lg text-xs font-bold transition-all text-center block mt-2"
            >
              Abrir Tesorería & Flujos [10] ➔
            </button>
          </div>

          {/* Panel 3: Eficiencia y OEE de Manufactura Textil */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <span>⚙️</span> OEE Fabril & Telares Circulares
              </h4>
              <span className="text-xs text-purple-600 font-bold">Planta 1</span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Disponibilidad Telar Mayer & Cie:</span>
                <span className="font-bold text-xs font-mono text-purple-900">92.4%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Rendimiento a 850 RPM:</span>
                <span className="font-bold text-xs font-mono text-purple-900">88.1%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Calidad Textil (Tasa 1ª Calidad):</span>
                <span className="font-bold text-xs font-mono text-emerald-700">97.8%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-100 flex justify-between items-center">
                <span className="text-xs font-bold text-purple-900">OEE Global Integrado:</span>
                <span className="text-lg font-black text-purple-900 font-mono">79.6%</span>
              </div>
            </div>
            <button 
              onClick={() => navigate('/app/produccion')}
              className="w-full bg-purple-50 hover:bg-purple-100 text-purple-700 py-1.5 rounded-lg text-xs font-bold transition-all text-center block mt-2"
            >
              Abrir Producción Fabril [5] ➔
            </button>
          </div>

        </div>

        {/* Tabla de Últimos Pedidos Procesados */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-gray-900 text-sm">Órdenes Transaccionales Recientes</h4>
            <span className="text-xs text-gray-400">Actualizado cada 5 segundos</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider">
                  <th className="py-2.5 px-3">Folio Pedido</th>
                  <th className="py-2.5 px-3">Cliente</th>
                  <th className="py-2.5 px-3 text-right">Importe Total</th>
                  <th className="py-2.5 px-3">Términos Pago</th>
                  <th className="py-2.5 px-3 text-center">Estatus Operativo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.map(o => (
                  <tr key={o.orderCode} className="hover:bg-blue-50/30 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-[#006EAD]">{o.orderCode}</td>
                    <td className="py-3 px-3 font-semibold text-gray-800">{o.clientName}</td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-gray-900">${o.total?.toLocaleString()} USD</td>
                    <td className="py-3 px-3 text-gray-600">{o.paymentTerms}</td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                        {o.status}
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
