import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Produccion() {
  const navigate = useNavigate();
  const [ops, setOps] = useState([]);
  const [invItems, setInvItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState('');
  
  // Modal Crear OP
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [productSku, setProductSku] = useState('PT-TEL-101');
  const [productName, setProductName] = useState('Rollo Tela Gabardina Algodón Peinado (Azul)');
  const [targetQuantity, setTargetQuantity] = useState(25);
  const [unit, setUnit] = useState('rollos');
  const [workcenter, setWorkcenter] = useState('Telar Circular #3 - Planta 1');
  const [operator, setOperator] = useState('Ing. Miguel Tejeduría');
  const [bom, setBom] = useState([
    { sku: 'MP-HIL-01', name: 'Hilo de Algodón Peinado 100% 30/1', quantityPerUnit: 3, unit: 'kg' },
    { sku: 'MP-POL-02', name: 'Hilo de Poliéster Alta Tenacidad 150D', quantityPerUnit: 1.5, unit: 'kg' },
    { sku: 'MP-TIN-03', name: 'Tinte Reactivo Azul Marino Textil', quantityPerUnit: 0.4, unit: 'litros' }
  ]);

  // Modal Ver BOM
  const [selectedOP, setSelectedOP] = useState(null);

  const fetchData = async () => {
    try {
      const [resOP, resInv] = await Promise.all([
        fetch('/api/produccion/orders'),
        fetch('/api/inventario/items')
      ]);
      if (resOP.ok) setOps(await resOP.json());
      if (resInv.ok) setInvItems(await resInv.json());
    } catch (err) {
      console.error('Error fetching Produccion data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateOP = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/produccion/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productSku,
          productName,
          targetQuantity: parseFloat(targetQuantity),
          unit,
          bom,
          workcenter,
          operator
        })
      });
      const data = await res.json();
      if (res.ok) {
        setActionMessage(`Orden de producción ${data.opCode} programada con éxito.`);
        setTimeout(() => setActionMessage(''), 6000);
        setCreateModalOpen(false);
        fetchData();
      } else {
        alert(data.error || 'Error al programar orden fabril');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ACCIÓN INTEGRADA: Iniciar Fabricación (Descontar Insumos)
  const handleStartOP = async (opCode) => {
    try {
      const res = await fetch(`/api/produccion/orders/${opCode}/start`, {
        method: 'POST'
      });
      const result = await res.json();
      if (res.ok) {
        setActionMessage(result.message);
        setTimeout(() => setActionMessage(''), 8000);
        fetchData();
      } else {
        alert(result.error || 'Error al iniciar fabricación');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ACCIÓN INTEGRADA: Completar Lote e Ingresar a Inventario PT
  const handleCompleteOP = async (opCode) => {
    try {
      const res = await fetch(`/api/produccion/orders/${opCode}/complete`, {
        method: 'POST'
      });
      const result = await res.json();
      if (res.ok) {
        setActionMessage(result.message);
        setTimeout(() => setActionMessage(''), 8000);
        fetchData();
      } else {
        alert(result.error || 'Error al completar orden fabril');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Planificada': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'En Proceso de Fabricación': return 'bg-blue-100 text-blue-800 border-blue-300 animate-pulse font-bold';
      case 'Completada en Almacén PT': return 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
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
              <span className="px-2 py-0.5 text-xs bg-indigo-100 text-indigo-800 font-bold rounded">Módulo [7]</span>
              NyTEX Producción & Manufactura Textil
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => navigate('/app/circuito-produccion')}
              className="bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 px-3 py-1.5 rounded-md text-xs font-bold shadow-sm transition"
            >
              ⚡ Monitor MRP & Planta
            </button>
            <button 
              onClick={() => navigate('/app/inventario')}
              className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded-md text-xs font-semibold shadow-sm transition"
            >
              Ver Inventario [4]
            </button>
            <button 
              onClick={() => setCreateModalOpen(true)}
              className="bg-[#006EAD] hover:bg-[#005587] text-white px-4 py-2 rounded-md text-sm font-bold shadow-sm transition flex items-center gap-1.5"
            >
              <span>+</span> PROGRAMAR ORDEN DE PRODUCCIÓN (OP)
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 text-gray-800 w-full space-y-6">
        {/* Banner de Mensaje Integrado */}
        {actionMessage && (
          <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-r-lg shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl">🏭</span>
              <div>
                <p className="text-sm font-bold text-indigo-900">Operación de Planta Registrada</p>
                <p className="text-xs text-indigo-700">{actionMessage}</p>
              </div>
            </div>
            <button onClick={() => setActionMessage('')} className="text-indigo-700 hover:text-indigo-900 text-xs font-bold">✕ Cerrar</button>
          </div>
        )}

        {/* KPIs de Producción */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center justify-between">
            <div>
              <span className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Órdenes Programadas</span>
              <span className="block text-3xl font-extrabold text-[#0A2540]">{ops.length}</span>
              <span className="text-xs text-gray-400">Total en el período</span>
            </div>
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center text-xl font-bold">
              📋
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center justify-between">
            <div>
              <span className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">En Fabricación Activa</span>
              <span className="block text-3xl font-extrabold text-blue-600">
                {ops.filter(o => o.status === 'En Proceso de Fabricación').length}
              </span>
              <span className="text-xs text-blue-500 font-semibold">En telares y telares circulares</span>
            </div>
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold">
              ⚙️
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center justify-between">
            <div>
              <span className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Lotes Concluidos</span>
              <span className="block text-3xl font-extrabold text-emerald-600">
                {ops.filter(o => o.status === 'Completada en Almacén PT').length}
              </span>
              <span className="text-xs text-emerald-500 font-semibold">Ingresados a stock de ventas</span>
            </div>
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center text-xl font-bold">
              ✅
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center justify-between">
            <div>
              <span className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Control de Merma Fabril</span>
              <span className="block text-3xl font-extrabold text-purple-600">1.2%</span>
              <span className="text-xs text-purple-500 font-semibold">Bajo norma de tolerancia (3.0%)</span>
            </div>
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center text-xl font-bold">
              📊
            </div>
          </div>
        </div>

        {/* Tabla de Órdenes de Producción */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="flex border-b border-gray-100 px-6 py-4 bg-gray-50/50 justify-between items-center">
            <h3 className="font-bold text-gray-800 text-sm">Órdenes de Fabricación en Planta (OP)</h3>
            <span className="text-xs text-gray-500">Mostrando {ops.length} órdenes fabriles</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3.5">Folio OP</th>
                  <th className="px-6 py-3.5">Producto Terminado (PT)</th>
                  <th className="px-6 py-3.5 text-right">Cantidad Meta</th>
                  <th className="px-6 py-3.5">Centro de Trabajo / Maquinaria</th>
                  <th className="px-6 py-3.5">Responsable</th>
                  <th className="px-6 py-3.5 text-center">Estado Fabril</th>
                  <th className="px-6 py-3.5 text-right">Control de Planta</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-400">Cargando órdenes de producción...</td>
                  </tr>
                ) : ops.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-400">No hay órdenes de fabricación registradas.</td>
                  </tr>
                ) : (
                  ops.map(op => (
                    <tr key={op.id} className="hover:bg-indigo-50/20 transition">
                      <td className="px-6 py-4 font-mono font-bold text-indigo-700">
                        {op.opCode}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">{op.productName}</div>
                        <div className="text-xs text-gray-400 font-mono">SKU: {op.productSku}</div>
                      </td>
                      <td className="px-6 py-4 text-right font-mono font-bold text-gray-900 text-base">
                        {op.targetQuantity} <span className="text-xs font-normal text-gray-500">{op.unit}</span>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-700">
                        🏭 {op.workcenter}
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-600">
                        👤 {op.operator}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(op.status)}`}>
                          {op.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedOP(op)}
                            className="px-2.5 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded"
                          >
                            Receta BOM ({op.bom ? op.bom.length : 0})
                          </button>

                          {op.status === 'Planificada' && (
                            <button
                              onClick={() => handleStartOP(op.opCode)}
                              className="px-3 py-1 text-xs bg-[#006EAD] hover:bg-[#005587] text-white font-bold rounded shadow-sm transition"
                              title="Valida y descuenta las materias primas del Inventario"
                            >
                              ▶ Iniciar Fabricación ➔ Descontar Insumos
                            </button>
                          )}

                          {op.status === 'En Proceso de Fabricación' && (
                            <button
                              onClick={() => handleCompleteOP(op.opCode)}
                              className="px-3 py-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded shadow-sm transition"
                              title="Concluye la producción e ingresa las telas al inventario PT"
                            >
                              🏁 Concluir Lote ➔ Ingresar a Almacén PT
                            </button>
                          )}

                          {op.status === 'Completada en Almacén PT' && (
                            <span className="px-2.5 py-1 text-xs bg-emerald-50 text-emerald-700 font-bold rounded">
                              ✓ En Almacén PT
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Detalle Receta BOM */}
        {selectedOP && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <div>
                  <h3 className="text-lg font-bold text-[#0A2540]">Lista de Materiales (BOM) - {selectedOP.opCode}</h3>
                  <p className="text-xs text-gray-500">Fabricación de {selectedOP.targetQuantity} {selectedOP.unit} de {selectedOP.productName}</p>
                </div>
                <button onClick={() => setSelectedOP(null)} className="text-gray-400 hover:text-gray-600 text-xl font-bold">✕</button>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {selectedOP.bom && selectedOP.bom.map((b, idx) => {
                  const totalNeeded = (b.quantityPerUnit || 1) * selectedOP.targetQuantity;
                  return (
                    <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border text-xs">
                      <div>
                        <div className="font-bold text-gray-800">{b.name}</div>
                        <div className="text-gray-400 font-mono">SKU: {b.sku} | Unitario: {b.quantityPerUnit} {b.unit} / unidad</div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-bold text-[#006EAD] text-sm">{totalNeeded} {b.unit}</div>
                        <div className="text-[10px] text-gray-400">Total a consumir</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between items-center p-3 bg-indigo-50 rounded-lg text-xs font-semibold text-indigo-900">
                <span>Centro de Producción Asignado:</span>
                <span>{selectedOP.workcenter}</span>
              </div>

              <div className="flex justify-end pt-3 border-t">
                <button
                  onClick={() => setSelectedOP(null)}
                  className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}