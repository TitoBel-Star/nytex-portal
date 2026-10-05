import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// Datos maestros iniciales basados en el sistema ROP consolidado
const INITIAL_SKUS = [
  {
    sku: 'KC-10185',
    name: 'Papel Higiénico Scott RindeMax 12x4',
    supplier: 'Kimberly Clark',
    supCode: 'SUP-001',
    branch: 'Bodega Central',
    dailyDemand: 45, // cajas/día
    leadTimeDays: 7, // días proveedor
    safetyStock: 120, // cajas
    rop: 435, // 45 * 7 + 120 = 435
    currentStock: 280, // en alerta de reorden
    unitCost: 18.50,
    packUnit: 'Caja x 48 rollos',
    eoq: 350
  },
  {
    sku: 'UN-20412',
    name: 'Detergente OMO Multiacción 5kg',
    supplier: 'Unilever Industrial',
    supCode: 'SUP-002',
    branch: 'Bodega Central',
    dailyDemand: 28,
    leadTimeDays: 10,
    safetyStock: 90,
    rop: 370, // 28 * 10 + 90 = 370
    currentStock: 140, // muy crítico
    unitCost: 14.20,
    packUnit: 'Saco 5kg',
    eoq: 250
  },
  {
    sku: 'NES-30114',
    name: 'Café Nescafé Clásico 500g Lata',
    supplier: 'Nestlé Profesional',
    supCode: 'SUP-003',
    branch: 'Sucursal Norte',
    dailyDemand: 18,
    leadTimeDays: 5,
    safetyStock: 40,
    rop: 130, // 18 * 5 + 40 = 130
    currentStock: 195, // óptimo
    unitCost: 9.75,
    packUnit: 'Caja x 12 latas',
    eoq: 180
  },
  {
    sku: 'COL-40890',
    name: 'Crema Dental Colgate Total 12 150ml',
    supplier: 'Colgate-Palmolive',
    supCode: 'SUP-004',
    branch: 'Bodega Central',
    dailyDemand: 60,
    leadTimeDays: 8,
    safetyStock: 150,
    rop: 630, // 60 * 8 + 150 = 630
    currentStock: 310, // reorden urgente
    unitCost: 3.10,
    packUnit: 'Caja x 72 unid',
    eoq: 500
  },
  {
    sku: 'PG-50211',
    name: 'Shampoo Pantene Restauración 700ml',
    supplier: 'Procter & Gamble',
    supCode: 'SUP-005',
    branch: 'Sucursal Sur',
    dailyDemand: 15,
    leadTimeDays: 12,
    safetyStock: 50,
    rop: 230, // 15 * 12 + 50 = 230
    currentStock: 420, // óptimo / sobrestock leve
    unitCost: 6.80,
    packUnit: 'Caja x 24 botellas',
    eoq: 200
  },
  {
    sku: 'DIA-60102',
    name: 'Snacks Picamas Mixto 24x50g',
    supplier: 'Alimentos Diana',
    supCode: 'SUP-006',
    branch: 'Bodega Central',
    dailyDemand: 75,
    leadTimeDays: 4,
    safetyStock: 110,
    rop: 410, // 75 * 4 + 110 = 410
    currentStock: 95, // en quiebre inminente
    unitCost: 11.00,
    packUnit: 'Tira / Fardo',
    eoq: 600
  }
];

export default function RopView() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('monitor'); // 'monitor' | 'ciclo5' | 'simulador' | 'ordenes'
  const [supplierFilter, setSupplierFilter] = useState('ALL');
  const [branchFilter, setBranchFilter] = useState('ALL');
  const [skusList, setSkusList] = useState(INITIAL_SKUS);
  const [successToast, setSuccessToast] = useState(null);

  // Estados del Simulador ROP interactivo
  const [simDemand, setSimDemand] = useState(50);
  const [simLeadTime, setSimLeadTime] = useState(7);
  const [simSafetyStock, setSimSafetyStock] = useState(120);
  const [simUnitCost, setSimUnitCost] = useState(15);
  const [simOrderCost, setSimOrderCost] = useState(45);
  const [simHoldingRate, setSimHoldingRate] = useState(20); // 20% anual

  // Ciclo de 5 Pasos de Pedidos (Schedule)
  const [ordersSchedule, setOrdersSchedule] = useState([
    {
      id: 'ROP-PED-2026-081',
      supplier: 'Kimberly Clark',
      supCode: 'SUP-001',
      itemsCount: 4,
      totalEstimate: 8740.00,
      step: 3, // 1=Colocado, 2=1er Envío, 3=Factura DTE Cargada, 4=Autorizado 2do Envío, 5=Recepción Bodega
      stepName: '3. Reconciliación Factura DTE Proveedor',
      dteNumber: 'DTE-0049102-KC',
      dteAmount: 8695.50,
      datePlaced: '2026-10-01',
      dateDeliveryExpected: '2026-10-08',
      status: 'pending_reconciliation'
    },
    {
      id: 'ROP-PED-2026-082',
      supplier: 'Unilever Industrial',
      supCode: 'SUP-002',
      itemsCount: 2,
      totalEstimate: 5200.00,
      step: 1,
      stepName: '1. Colocado para Autorización (Cuadro Comparativo)',
      dteNumber: '—',
      dteAmount: 0,
      datePlaced: '2026-10-04',
      dateDeliveryExpected: '2026-10-14',
      status: 'waiting_manager_auth'
    },
    {
      id: 'ROP-PED-2026-080',
      supplier: 'Colgate-Palmolive',
      supCode: 'SUP-004',
      itemsCount: 3,
      totalEstimate: 4120.00,
      step: 4,
      stepName: '4. Autorización 2do Envío (Orden Oficial Definitiva)',
      dteNumber: 'DTE-99214-COL',
      dteAmount: 4120.00,
      datePlaced: '2026-09-28',
      dateDeliveryExpected: '2026-10-06',
      status: 'ready_to_send_po'
    },
    {
      id: 'ROP-PED-2026-079',
      supplier: 'Nestlé Profesional',
      supCode: 'SUP-003',
      itemsCount: 5,
      totalEstimate: 3450.00,
      step: 5,
      stepName: '5. Recepción Física y Reconciliación en Bodega',
      dteNumber: 'DTE-55410-NES',
      dteAmount: 3450.00,
      datePlaced: '2026-09-25',
      dateDeliveryExpected: '2026-09-30',
      status: 'received_completed'
    }
  ]);

  // Filtrado de SKUs
  const filteredSkus = useMemo(() => {
    return skusList.filter(item => {
      const matchSup = supplierFilter === 'ALL' || item.supplier === supplierFilter;
      const matchBranch = branchFilter === 'ALL' || item.branch === branchFilter;
      return matchSup && matchBranch;
    });
  }, [skusList, supplierFilter, branchFilter]);

  // Cálculos agregados
  const totalMonitored = skusList.length;
  const criticalCount = skusList.filter(s => s.currentStock <= s.safetyStock).length;
  const reorderCount = skusList.filter(s => s.currentStock > s.safetyStock && s.currentStock <= s.rop).length;
  const optimalCount = skusList.filter(s => s.currentStock > s.rop).length;

  // Cálculos en tiempo real del Simulador ROP y EOQ
  const simCalculatedRop = (simDemand * simLeadTime) + Number(simSafetyStock);
  const annualDemand = simDemand * 365;
  const unitHoldingCost = (simUnitCost * simHoldingRate) / 100;
  const simCalculatedEoq = unitHoldingCost > 0 
    ? Math.round(Math.sqrt((2 * annualDemand * simOrderCost) / unitHoldingCost))
    : 0;
  const daysCoverage = simDemand > 0 ? (simCalculatedRop / simDemand).toFixed(1) : 0;

  const showToast = (msg) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const handleGeneratePurchaseOrder = (skuItem) => {
    const suggestedQty = Math.max(skuItem.eoq, (skuItem.rop * 1.5) - skuItem.currentStock);
    const newOrder = {
      id: `ROP-PED-2026-0${ordersSchedule.length + 83}`,
      supplier: skuItem.supplier,
      supCode: skuItem.supCode,
      itemsCount: 1,
      totalEstimate: Math.round(suggestedQty * skuItem.unitCost * 100) / 100,
      step: 1,
      stepName: '1. Colocado para Autorización (Cuadro Comparativo)',
      dteNumber: '—',
      dteAmount: 0,
      datePlaced: new Date().toISOString().split('T')[0],
      dateDeliveryExpected: new Date(Date.now() + skuItem.leadTimeDays * 86400000).toISOString().split('T')[0],
      status: 'waiting_manager_auth'
    };

    setOrdersSchedule([newOrder, ...ordersSchedule]);
    showToast(`✅ Se generó el Pedido ROP sugerido #${newOrder.id} para ${skuItem.supplier} por ${suggestedQty} unidades ($${newOrder.totalEstimate.toLocaleString()} USD).`);
  };

  const handleAdvanceOrderStep = (orderId) => {
    setOrdersSchedule(prev => prev.map(ord => {
      if (ord.id !== orderId) return ord;
      if (ord.step >= 5) return ord;
      const nextStep = ord.step + 1;
      const stepNames = {
        2: '2. 1er Envío Sugerido al Proveedor (WhatsApp / PDF)',
        3: '3. Reconciliación Factura DTE Proveedor',
        4: '4. Autorización 2do Envío (Orden Oficial Definitiva)',
        5: '5. Recepción Física y Reconciliación en Bodega'
      };
      return {
        ...ord,
        step: nextStep,
        stepName: stepNames[nextStep] || ord.stepName,
        status: nextStep === 5 ? 'received_completed' : 'in_progress'
      };
    }));
    showToast(`🔄 Orden ${orderId} avanzada a la siguiente etapa del ciclo.`);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      
      {/* Toast de Notificación */}
      {successToast && (
        <div className="fixed top-16 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-2xl border border-emerald-400 font-medium text-sm flex items-center gap-3 animate-bounce">
          <span>🔔</span>
          <span>{successToast}</span>
        </div>
      )}

      {/* Header Principal */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-sky-950 border-b border-emerald-800/50 px-6 py-5 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Área 2: Cadena de Suministro
              </span>
              <span className="bg-sky-500/20 text-sky-300 border border-sky-500/40 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                Abastecimiento Óptimo & Control de Pedidos
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-black text-white flex items-center gap-3">
              <span className="text-emerald-400">📊</span>
              NyTEX Reabastecimiento ROP Inteligente
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Algoritmo de cálculo dinámico de Punto de Reorden (<strong className="text-emerald-300">ROP = Demanda × Lead Time + Stock de Seguridad</strong>), lote económico (EOQ) y ciclo de control de compras en 5 etapas.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/app/compras')}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5"
            >
              <span>🛒</span> NyTEX Compras
            </button>
            <button
              onClick={() => navigate('/app/inventario')}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5"
            >
              <span>📦</span> NyTEX Inventario
            </button>
            <button
              onClick={() => navigate('/app/workspace')}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3.5 py-1.5 rounded-lg text-xs transition-all shadow-md flex items-center gap-1.5"
            >
              <span>🚀</span> Mi Workspace
            </button>
          </div>
        </div>

        {/* Métricas Resumen KPI */}
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-3 mt-6">
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 shadow-sm">
            <div className="text-[11px] text-slate-400 font-semibold uppercase">SKUs Monitoreados</div>
            <div className="text-2xl font-black text-white mt-0.5">{totalMonitored}</div>
            <div className="text-[10px] text-slate-500 mt-1">En catálogo activo</div>
          </div>

          <div className="bg-rose-950/40 border border-rose-800/60 rounded-xl p-3 shadow-sm">
            <div className="text-[11px] text-rose-300 font-semibold uppercase flex items-center gap-1">
              <span>🚨</span> En Quiebre Inminente
            </div>
            <div className="text-2xl font-black text-rose-400 mt-0.5">{criticalCount}</div>
            <div className="text-[10px] text-rose-300/80 mt-1">Stock ≤ Stock de Seguridad</div>
          </div>

          <div className="bg-amber-950/40 border border-amber-800/60 rounded-xl p-3 shadow-sm">
            <div className="text-[11px] text-amber-300 font-semibold uppercase flex items-center gap-1">
              <span>⚠️</span> Bajo Punto Reorden (ROP)
            </div>
            <div className="text-2xl font-black text-amber-400 mt-0.5">{reorderCount}</div>
            <div className="text-[10px] text-amber-300/80 mt-1">Generar orden sugerida</div>
          </div>

          <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-xl p-3 shadow-sm">
            <div className="text-[11px] text-emerald-300 font-semibold uppercase flex items-center gap-1">
              <span>✅</span> Stock Óptimo
            </div>
            <div className="text-2xl font-black text-emerald-400 mt-0.5">{optimalCount}</div>
            <div className="text-[10px] text-emerald-300/80 mt-1">Sin riesgo de desabastecimiento</div>
          </div>

          <div className="bg-sky-950/40 border border-sky-800/60 rounded-xl p-3 shadow-sm">
            <div className="text-[11px] text-sky-300 font-semibold uppercase flex items-center gap-1">
              <span>🎯</span> Nivel de Servicio (Fill Rate)
            </div>
            <div className="text-2xl font-black text-sky-400 mt-0.5">98.6%</div>
            <div className="text-[10px] text-sky-300/80 mt-1">+14% quiebres prevenidos</div>
          </div>
        </div>

        {/* Pestañas de Navegación del Módulo */}
        <div className="max-w-7xl mx-auto flex items-center gap-2 mt-6 border-b border-slate-800 pt-1">
          <button
            onClick={() => setActiveTab('monitor')}
            className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-all flex items-center gap-2 ${
              activeTab === 'monitor'
                ? 'bg-slate-800 text-emerald-400 border-t-2 border-emerald-500 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <span>📋</span> Monitor de Stock y Reorden ROP
          </button>

          <button
            onClick={() => setActiveTab('ciclo5')}
            className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-all flex items-center gap-2 ${
              activeTab === 'ciclo5'
                ? 'bg-slate-800 text-emerald-400 border-t-2 border-emerald-500 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <span>🔄</span> Ciclo de Compras en 5 Etapas
            <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-1.5 py-0.2 rounded-full">
              {ordersSchedule.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('simulador')}
            className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-all flex items-center gap-2 ${
              activeTab === 'simulador'
                ? 'bg-slate-800 text-emerald-400 border-t-2 border-emerald-500 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <span>🧮</span> Simulador ROP &amp; Lote Óptimo (EOQ)
          </button>
        </div>
      </div>

      {/* Contenido Principal según Pestaña */}
      <div className="max-w-7xl mx-auto w-full p-6 flex-1">
        
        {/* =========================================================
            PESTAÑA 1: MONITOR DE STOCK & MATRIZ ROP
           ========================================================= */}
        {activeTab === 'monitor' && (
          <div className="space-y-5">
            {/* Barra de Filtros */}
            <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <label className="text-xs text-slate-400 font-semibold">Proveedor:</label>
                  <select
                    value={supplierFilter}
                    onChange={(e) => setSupplierFilter(e.target.value)}
                    className="bg-slate-900 border border-slate-700 text-white text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="ALL">Todos los Proveedores</option>
                    <option value="Kimberly Clark">Kimberly Clark</option>
                    <option value="Unilever Industrial">Unilever Industrial</option>
                    <option value="Nestlé Profesional">Nestlé Profesional</option>
                    <option value="Colgate-Palmolive">Colgate-Palmolive</option>
                    <option value="Procter & Gamble">Procter &amp; Gamble</option>
                    <option value="Alimentos Diana">Alimentos Diana</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-xs text-slate-400 font-semibold">Sucursal / Bodega:</label>
                  <select
                    value={branchFilter}
                    onChange={(e) => setBranchFilter(e.target.value)}
                    className="bg-slate-900 border border-slate-700 text-white text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="ALL">Todas las Bodegas</option>
                    <option value="Bodega Central">Bodega Central</option>
                    <option value="Sucursal Norte">Sucursal Norte</option>
                    <option value="Sucursal Sur">Sucursal Sur</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">
                  Mostrando <strong className="text-white">{filteredSkus.length}</strong> artículos
                </span>
              </div>
            </div>

            {/* Tabla de SKUs y Parámetros ROP */}
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/90 text-slate-300 font-bold border-b border-slate-700">
                    <tr>
                      <th className="py-3 px-4">SKU / Descripción</th>
                      <th className="py-3 px-3">Proveedor</th>
                      <th className="py-3 px-3 text-center">Consumo Diario</th>
                      <th className="py-3 px-3 text-center">Lead Time</th>
                      <th className="py-3 px-3 text-center">Stock Seg. (SS)</th>
                      <th className="py-3 px-3 text-center bg-emerald-950/30 text-emerald-300">Punto Reorden (ROP)</th>
                      <th className="py-3 px-3 text-center">Stock Actual</th>
                      <th className="py-3 px-3 text-center">Diagnóstico</th>
                      <th className="py-3 px-4 text-center">Acción Sugerida</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/60">
                    {filteredSkus.map((sku) => {
                      const isCritical = sku.currentStock <= sku.safetyStock;
                      const isReorder = sku.currentStock <= sku.rop && !isCritical;
                      const isOptimal = sku.currentStock > sku.rop;
                      const suggestedBuy = Math.max(sku.eoq, (sku.rop * 1.5) - sku.currentStock);

                      return (
                        <tr key={sku.sku} className="hover:bg-slate-700/30 transition-colors">
                          <td className="py-3 px-4">
                            <div className="font-bold text-white text-xs">{sku.name}</div>
                            <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                              <span className="font-mono text-cyan-300">{sku.sku}</span>
                              <span>•</span>
                              <span>{sku.branch}</span>
                              <span>•</span>
                              <span>{sku.packUnit}</span>
                            </div>
                          </td>

                          <td className="py-3 px-3 text-slate-300">
                            <div>{sku.supplier}</div>
                            <div className="text-[10px] text-slate-500 font-mono">{sku.supCode}</div>
                          </td>

                          <td className="py-3 px-3 text-center font-mono font-semibold text-slate-200">
                            {sku.dailyDemand} <span className="text-[10px] text-slate-500">un/d</span>
                          </td>

                          <td className="py-3 px-3 text-center font-mono text-slate-200">
                            {sku.leadTimeDays} <span className="text-[10px] text-slate-500">días</span>
                          </td>

                          <td className="py-3 px-3 text-center font-mono text-amber-300/90">
                            {sku.safetyStock}
                          </td>

                          <td className="py-3 px-3 text-center font-mono font-black text-emerald-400 bg-emerald-950/20">
                            {sku.rop}
                          </td>

                          <td className="py-3 px-3 text-center font-mono font-bold">
                            <span className={
                              isCritical ? 'text-rose-400 text-sm' :
                              isReorder ? 'text-amber-400 text-sm' : 'text-emerald-400'
                            }>
                              {sku.currentStock}
                            </span>
                          </td>

                          <td className="py-3 px-3 text-center">
                            {isCritical && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                                <span>🚨</span> Quiebre Inminente
                              </span>
                            )}
                            {isReorder && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                <span>⚠️</span> Reordenar (Stock ≤ ROP)
                              </span>
                            )}
                            {isOptimal && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                <span>✅</span> Stock Óptimo
                              </span>
                            )}
                          </td>

                          <td className="py-3 px-4 text-center">
                            {sku.currentStock <= sku.rop ? (
                              <button
                                onClick={() => handleGeneratePurchaseOrder(sku)}
                                className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-extrabold px-3 py-1.5 rounded-lg text-[11px] transition-all shadow-md flex items-center justify-center gap-1 mx-auto"
                              >
                                <span>🛒</span> Pedir {suggestedBuy} un.
                              </button>
                            ) : (
                              <span className="text-[10px] text-slate-500 font-medium">Abastecido</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Explicación de la Lógica ROP */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 border border-emerald-800/40 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
                <span>💡</span> Fórmula Matemática del Punto de Reorden (ROP):
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                El <strong className="text-emerald-300">Punto de Reorden (ROP)</strong> determina el umbral exacto de existencias en el que se debe emitir una orden de compra para que el pedido del proveedor arribe antes de que se agote el stock de seguridad:
              </p>
              <div className="mt-3 bg-slate-950/70 p-3 rounded-xl border border-slate-700 font-mono text-xs text-emerald-400 flex flex-wrap items-center justify-around gap-4 text-center">
                <div>
                  <span className="text-slate-400 block text-[10px]">Demanda Promedio</span>
                  <strong>D (Consumo diario)</strong>
                </div>
                <div className="text-slate-400 font-black">×</div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Tiempo Entrega</span>
                  <strong>L (Lead Time días)</strong>
                </div>
                <div className="text-slate-400 font-black">+</div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Colchón de Incertidumbre</span>
                  <strong>SS (Stock Seguridad = Z × σ × √L)</strong>
                </div>
                <div className="text-slate-400 font-black">=</div>
                <div className="bg-emerald-900/60 px-3 py-1 rounded-lg border border-emerald-500">
                  <span className="text-emerald-300 block text-[10px]">Gatillo de Compra</span>
                  <strong className="text-white text-sm">ROP (Reorder Point)</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            PESTAÑA 2: CICLO DE COMPRAS EN 5 ETAPAS (SCHEDULE)
           ========================================================= */}
        {activeTab === 'ciclo5' && (
          <div className="space-y-6">
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>🔁</span> Trazabilidad del Ciclo de Compras ROP en 5 Pasos
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Cronograma validado de colocación, cotización, reconciliación DTE y recepción en bodega física.
                  </p>
                </div>
                <span className="text-xs bg-emerald-950 text-emerald-300 border border-emerald-600/40 px-3 py-1 rounded-full font-bold">
                  {ordersSchedule.length} Pedidos en Curso
                </span>
              </div>

              {/* Lista de Órdenes con Barra de Pasos */}
              <div className="space-y-4">
                {ordersSchedule.map((order) => (
                  <div
                    key={order.id}
                    className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 transition-all hover:border-slate-600 shadow-md"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-emerald-400 text-sm">{order.id}</span>
                          <span className="bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded font-mono">
                            {order.supCode}
                          </span>
                          <strong className="text-white text-xs">{order.supplier}</strong>
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-3 mt-1">
                          <span>Fecha Colocación: <strong className="text-slate-200">{order.datePlaced}</strong></span>
                          <span>•</span>
                          <span>Entrega Estimada: <strong className="text-cyan-300">{order.dateDeliveryExpected}</strong></span>
                          <span>•</span>
                          <span>Artículos: <strong className="text-white">{order.itemsCount}</strong></span>
                          <span>•</span>
                          <span>Monto Estimado: <strong className="text-emerald-400 font-mono">${order.totalEstimate.toLocaleString()} USD</strong></span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {order.step < 5 ? (
                          <button
                            onClick={() => handleAdvanceOrderStep(order.id)}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-all shadow flex items-center gap-1.5"
                          >
                            <span>Avanzar Paso ➔</span>
                          </button>
                        ) : (
                          <span className="bg-emerald-900/60 border border-emerald-500/50 text-emerald-300 text-xs px-3 py-1 rounded-lg font-bold flex items-center gap-1">
                            <span>✅</span> Completado en Bodega
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Stepper Visual de 5 Pasos */}
                    <div className="grid grid-cols-5 gap-2 mt-4 pt-1">
                      {[
                        { stepNum: 1, title: '1. Colocado Autorización', desc: 'Cuadro Comparativo' },
                        { stepNum: 2, title: '2. 1er Envío', desc: 'Cotización Proveedor' },
                        { stepNum: 3, title: '3. Reconciliación DTE', desc: order.dteNumber !== '—' ? order.dteNumber : 'Cargar Proforma' },
                        { stepNum: 4, title: '4. Autorización 2do Envío', desc: 'O.C. Definitiva CxP' },
                        { stepNum: 5, title: '5. Recepción Bodega', desc: 'Ingreso Kardex WMS' }
                      ].map((st) => {
                        const isDone = order.step > st.stepNum;
                        const isCurrent = order.step === st.stepNum;
                        return (
                          <div
                            key={st.stepNum}
                            className={`p-2.5 rounded-xl border text-center transition-all ${
                              isCurrent
                                ? 'bg-emerald-950/60 border-emerald-500 shadow-lg ring-1 ring-emerald-400'
                                : isDone
                                ? 'bg-slate-800/80 border-emerald-700/60 text-slate-300'
                                : 'bg-slate-900/50 border-slate-800 text-slate-500'
                            }`}
                          >
                            <div className={`text-[10px] font-black uppercase ${isCurrent ? 'text-emerald-400' : isDone ? 'text-emerald-500' : 'text-slate-500'}`}>
                              {isDone ? '✓ ' : ''}{st.title}
                            </div>
                            <div className="text-[10px] text-slate-400 truncate mt-0.5 font-medium">
                              {st.desc}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            PESTAÑA 3: SIMULADOR INTERACTIVO ROP & LOTE ÓPTIMO (EOQ)
           ========================================================= */}
        {activeTab === 'simulador' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Panel de Parámetros */}
            <div className="lg:col-span-5 bg-slate-800/90 border border-slate-700 rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-700">
                <span>⚙️</span> Parámetros de Entrada del Artículo
              </h3>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-semibold">Consumo Diario Promedio (D):</span>
                  <span className="font-mono text-emerald-400 font-bold">{simDemand} un./día</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="200"
                  value={simDemand}
                  onChange={(e) => setSimDemand(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-semibold">Tiempo de Entrega del Proveedor (Lead Time L):</span>
                  <span className="font-mono text-cyan-400 font-bold">{simLeadTime} días</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={simLeadTime}
                  onChange={(e) => setSimLeadTime(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-semibold">Stock de Seguridad (SS):</span>
                  <span className="font-mono text-amber-400 font-bold">{simSafetyStock} unidades</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="500"
                  step="10"
                  value={simSafetyStock}
                  onChange={(e) => setSimSafetyStock(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div className="pt-2 border-t border-slate-700">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-semibold">Costo Unitario ($ USD):</span>
                  <span className="font-mono text-white font-bold">${simUnitCost}</span>
                </div>
                <input
                  type="number"
                  min="1"
                  value={simUnitCost}
                  onChange={(e) => setSimUnitCost(Math.max(1, Number(e.target.value)))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-semibold">Costo por Emitir una Orden (S):</span>
                  <span className="font-mono text-white font-bold">${simOrderCost} USD</span>
                </div>
                <input
                  type="number"
                  min="5"
                  value={simOrderCost}
                  onChange={(e) => setSimOrderCost(Math.max(5, Number(e.target.value)))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-semibold">Tasa Anual de Almacenamiento (H %):</span>
                  <span className="font-mono text-white font-bold">{simHoldingRate}% anual</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="40"
                  value={simHoldingRate}
                  onChange={(e) => setSimHoldingRate(Number(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Resultados del Cálculo */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-emerald-700/50 rounded-2xl p-6 shadow-xl">
                <h3 className="text-sm font-bold text-emerald-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span>🎯</span> Resultados en Vivo del Modelo Estadístico
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-950/70 border border-emerald-500/50 rounded-xl p-4">
                    <span className="text-xs text-slate-400 block font-semibold">Punto de Reorden (ROP)</span>
                    <div className="text-3xl font-black text-emerald-400 mt-1">
                      {simCalculatedRop} <span className="text-xs text-slate-400 font-normal">unidades</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2">
                      Gatillo automático: cuando el stock llegue a {simCalculatedRop} un., se debe pedir de inmediato.
                    </p>
                  </div>

                  <div className="bg-slate-950/70 border border-cyan-500/50 rounded-xl p-4">
                    <span className="text-xs text-slate-400 block font-semibold">Lote Económico Óptimo (EOQ)</span>
                    <div className="text-3xl font-black text-cyan-400 mt-1">
                      {simCalculatedEoq} <span className="text-xs text-slate-400 font-normal">unidades</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2">
                      Cantidad óptima que minimiza costos combinados de emisión y almacenaje.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-700/70 text-center">
                  <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Demanda Anual Estimada</span>
                    <strong className="text-sm text-white font-mono">{annualDemand.toLocaleString()} un.</strong>
                  </div>
                  <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Días de Autonomía ROP</span>
                    <strong className="text-sm text-amber-400 font-mono">{daysCoverage} días</strong>
                  </div>
                  <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Costo Almacenar Unit/Año</span>
                    <strong className="text-sm text-purple-400 font-mono">${unitHoldingCost.toFixed(2)} USD</strong>
                  </div>
                </div>

                <div className="mt-5 p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-xs text-slate-300 leading-relaxed">
                  <strong className="text-emerald-300">Impacto en la Cadena de Suministro:</strong> Con un consumo de <strong>{simDemand} un/día</strong> y entrega en <strong>{simLeadTime} días</strong>, el lote económico de <strong>{simCalculatedEoq} unidades</strong> implicará realizar aproximadamente <strong>{Math.round(annualDemand / Math.max(1, simCalculatedEoq))} pedidos al año</strong>, previniendo quiebres de inventario sin incurrir en costos excesivos de capital inmovilizado.
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
