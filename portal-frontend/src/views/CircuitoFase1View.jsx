import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NytexVideoCard from '../components/NytexVideoCard';

export default function CircuitoFase1View() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const res = await fetch('/api/fases/fase1/summary');
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error('Error fetching Fase 1 summary:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSimulate = async () => {
    setSimulating(true);
    setSimulationResult(null);
    try {
      const res = await fetch('/api/fases/fase1/simulate', { method: 'POST' });
      const json = await res.json();
      setSimulationResult(json);
      fetchSummary();
    } catch (err) {
      console.error('Error simulating Fase 1:', err);
    } finally {
      setSimulating(false);
    }
  };

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-slate-100 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent mb-3"></div>
          <p className="text-slate-600 font-semibold">Cargando Circuito Fase 1: Starter...</p>
        </div>
      </div>
    );
  }

  const { metrics = {} } = data || {};

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Cabecera Comercial Coherente */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-blue-500 text-white font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                  Circuito 1 • Paquete Comercial
                </span>
                <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-bold">
                  7 Módulos Esenciales
                </span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-black tracking-tight">
                Fase 1: NyTEX Starter — Control Transaccional
              </h1>
              <p className="text-blue-200 text-sm mt-2 max-w-2xl leading-relaxed">
                El circuito medular para empresas que inician: factura pedidos, gestiona stock en almacén, administra cartera en CxC, compras y CxP, cobra en Tesorería y cuadra automáticamente la contabilidad.
              </p>
              <div className="flex items-center gap-6 mt-4 pt-4 border-t border-white/10 text-xs">
                <div>
                  <span className="text-blue-300 block uppercase font-bold text-[10px]">Licencia Mensual</span>
                  <strong className="text-xl text-amber-300 font-black">$35 USD</strong> / mes
                </div>
                <div>
                  <span className="text-blue-300 block uppercase font-bold text-[10px]">Implementación</span>
                  <strong className="text-xl text-emerald-400 font-black">$0 USD</strong>
                </div>
                <div>
                  <span className="text-blue-300 block uppercase font-bold text-[10px]">Cobertura</span>
                  <strong className="text-xl text-white font-black">7 Módulos</strong>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto">
              <NytexVideoCard className="!p-4 !rounded-2xl" />
              <button
                onClick={handleSimulate}
                disabled={simulating}
                className="bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black px-6 py-3 rounded-2xl text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>⚡</span> {simulating ? 'Procesando Ciclo...' : 'Simular Ciclo Transaccional'}
              </button>
              <Link
                to="/portal?phase=1"
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-2xl text-sm transition-all text-center border border-blue-400/30 shadow-md"
              >
                Contratar Starter ($35 USD/mes)
              </Link>
              <Link
                to="/portal"
                className="text-xs text-center text-blue-200 hover:text-white underline pt-1"
              >
                Volver al Menú Principal
              </Link>
            </div>
          </div>
        </div>

        {/* Notificación de Simulación */}
        {simulationResult && (
          <div className="bg-emerald-50 border-2 border-emerald-400 p-5 rounded-2xl shadow-sm text-emerald-900 font-semibold text-sm flex items-center gap-3 animate-fade-in">
            <span className="text-2xl">✓</span>
            <div>
              <p className="font-bold">{simulationResult.message}</p>
              <p className="text-xs text-emerald-700 font-normal mt-0.5">Se afectaron simultáneamente los módulos de Ventas, CxC, Tesorería y Contabilidad.</p>
            </div>
          </div>
        )}

        {/* Métricas Reales del Circuito Starter */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">[1] Ventas Facturadas</span>
            <div className="text-2xl font-black text-slate-900 mt-1 font-mono">
              ${metrics.totalSales?.toLocaleString()} <span className="text-xs text-slate-500">USD</span>
            </div>
            <p className="text-[11px] text-blue-600 mt-1 font-semibold">{metrics.ordersCount} pedidos registrados</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">[3] Stock en Inventario</span>
            <div className="text-2xl font-black text-slate-900 mt-1 font-mono">
              ${metrics.totalInventoryValuation?.toLocaleString()} <span className="text-xs text-slate-500">USD</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">{metrics.inventorySkusCount} SKUs valuados al costo</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">[10] Liquidez en Tesorería</span>
            <div className="text-2xl font-black text-emerald-600 mt-1 font-mono">
              ${metrics.totalLiquidity?.toLocaleString()} <span className="text-xs text-slate-500">USD</span>
            </div>
            <p className="text-[11px] text-emerald-700 font-semibold">{metrics.bankAccountsCount} cuentas bancarias activas</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">[12] Pólizas Contables</span>
            <div className="text-2xl font-black text-indigo-600 mt-1 font-mono">
              {metrics.entriesCount} <span className="text-xs text-slate-500">asientos</span>
            </div>
            <p className="text-[11px] text-indigo-700 font-bold">{metrics.accountingStatus}</p>
          </div>
        </div>

        {/* Diagrama del Circuito: Paso a Paso */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Flujo Transaccional Integrado de los 7 Módulos</h3>
              <p className="text-xs text-slate-500">Cómo interactúan entre sí cuando opera un cliente en la Fase 1</p>
            </div>
            <span className="text-xs font-bold bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-200">
              Circuito 100% Automatizado
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
              <span className="text-[10px] font-black uppercase text-blue-600">Paso 1</span>
              <h4 className="font-bold text-slate-900 text-sm mt-1">[1] Ventas ➔ [3] Inventario</h4>
              <p className="text-xs text-slate-600 mt-1">El cliente emite pedido de tela; el sistema valida y descuenta existencias automáticamente.</p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
              <span className="text-[10px] font-black uppercase text-blue-600">Paso 2</span>
              <h4 className="font-bold text-slate-900 text-sm mt-1">[8] CxC ➔ [10] Tesorería</h4>
              <p className="text-xs text-slate-600 mt-1">Se genera factura electrónica a 30 días o contado; el ingreso se refleja en cuenta bancaria.</p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
              <span className="text-[10px] font-black uppercase text-blue-600">Paso 3</span>
              <h4 className="font-bold text-slate-900 text-sm mt-1">[4] Compras ➔ [9] CxP</h4>
              <p className="text-xs text-slate-600 mt-1">Órdenes de compra a proveedores de hilo generan pasivos y programación de pagos.</p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
              <span className="text-[10px] font-black uppercase text-emerald-600">Paso 4</span>
              <h4 className="font-bold text-slate-900 text-sm mt-1">[12] Contabilidad Central</h4>
              <p className="text-xs text-slate-600 mt-1">Cada movimiento emite pólizas de diario, ingresos o egresos de partida doble sin captura manual.</p>
            </div>
          </div>
        </div>

        {/* Directorio de los 7 Módulos de esta Fase */}
        <div>
          <h3 className="font-extrabold text-slate-900 text-lg mb-3">Módulos Incluidos en la Fase 1 Starter</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { id: 'ventas', name: '[1] Ventas', desc: 'Gestión de cotizaciones, pedidos y facturación CFDI.' },
              { id: 'inventario', name: '[3] Inventario', desc: 'Control multialmacén, existencias y costos PEPS.' },
              { id: 'compras', name: '[4] Compras', desc: 'Órdenes de compra a proveedores y recepción de insumos.' },
              { id: 'cxc', name: '[8] CxC', desc: 'Cuentas por cobrar, antigüedad de saldos y cobranza.' },
              { id: 'cxp', name: '[9] CxP', desc: 'Cuentas por pagar a proveedores de materias primas.' },
              { id: 'tesoreria', name: '[10] Tesorería', desc: 'Bancos, flujo de efectivo, dispersiones y SPEI.' },
              { id: 'contabilidad', name: '[12] Contabilidad', desc: 'Pólizas automáticas, balanza fiscal y libro mayor.' }
            ].map(m => (
              <div key={m.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{m.name}</h4>
                  <p className="text-xs text-slate-500 mt-1">{m.desc}</p>
                </div>
                <Link
                  to={`/app/${m.id}`}
                  className="mt-3 block text-center text-xs font-bold bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 py-1.5 rounded-lg transition-colors"
                >
                  Abrir Módulo ➔
                </Link>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
