import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Compras() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [partners, setPartners] = useState([]);
  const [invItems, setInvItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState('');
  
  // Modal Crear PO
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedVendorCode, setSelectedVendorCode] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('Crédito 30 días');
  const [deliveryDate, setDeliveryDate] = useState('2026-10-10');
  const [poItems, setPoItems] = useState([
    { sku: 'MP-HIL-01', name: 'Hilo de Algodón Peinado 100% 30/1', quantity: 200, unitCost: 145 }
  ]);

  // Modal Detalle
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchData = async () => {
    try {
      const [resPO, resBP, resInv] = await Promise.all([
        fetch('/api/compras/orders'),
        fetch('/api/business-partners'),
        fetch('/api/inventario/items')
      ]);
      if (resPO.ok) setOrders(await resPO.json());
      if (resBP.ok) {
        const bpData = await resBP.json();
        const vendors = bpData.filter(b => b.type === 'Proveedor');
        setPartners(vendors.length > 0 ? vendors : bpData);
        if (vendors.length > 0 && !selectedVendorCode) {
          setSelectedVendorCode(vendors[0].code);
        }
      }
      if (resInv.ok) setInvItems(await resInv.json());
    } catch (err) {
      console.error('Error fetching Compras data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddItem = () => {
    setPoItems([...poItems, { sku: 'MP-POL-02', name: 'Hilo de Poliéster Alta Tenacidad 150D', quantity: 100, unitCost: 88 }]);
  };

  const handleRemoveItem = (index) => {
    setPoItems(poItems.filter((_, idx) => idx !== index));
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...poItems];
    updated[index][field] = field === 'quantity' || field === 'unitCost' ? parseFloat(value) || 0 : value;
    setPoItems(updated);
  };

  const subtotalCalc = poItems.reduce((sum, it) => sum + (it.quantity * it.unitCost), 0);
  const taxCalc = Math.round(subtotalCalc * 0.13 * 100) / 100;
  const totalCalc = Math.round((subtotalCalc + taxCalc) * 100) / 100;

  const handleCreatePO = async (e) => {
    e.preventDefault();
    const vendor = partners.find(p => p.code === selectedVendorCode) || { name: 'Proveedor General' };
    try {
      const res = await fetch('/api/compras/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendorCode: selectedVendorCode,
          vendorName: vendor.name,
          items: poItems,
          paymentTerms,
          deliveryDate
        })
      });
      const data = await res.json();
      if (res.ok) {
        setActionMessage(`Orden de compra ${data.poCode} emitida exitosamente.`);
        setTimeout(() => setActionMessage(''), 6000);
        setCreateModalOpen(false);
        fetchData();
      } else {
        alert(data.error || 'Error al emitir orden de compra');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ACCIÓN INTEGRADA: Recibir Mercancía
  const handleReceivePO = async (poCode) => {
    try {
      const res = await fetch(`/api/compras/orders/${poCode}/receive`, {
        method: 'POST'
      });
      const result = await res.json();
      if (res.ok) {
        setActionMessage(result.message);
        setTimeout(() => setActionMessage(''), 8000);
        fetchData();
      } else {
        alert(result.error || 'Error al recibir mercancía');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Aprobada': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Recibida en Almacén': return 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#f4f7f9] overflow-y-auto w-full">
      {/* Top Header */}
      <div className="flex flex-col border-b border-gray-200 px-6 py-4 bg-white sticky top-0 z-10 shrink-0 shadow-sm w-full">
        <div className="flex flex-wrap justify-between items-center gap-3">
          <div className="flex items-center text-lg text-gray-700">
            <span className="cursor-pointer hover:underline text-[#006EAD]" onClick={() => navigate('/portal')}>Portal</span>
            <span className="mx-2 text-gray-400">/</span>
            <span className="font-bold text-[#0A2540] flex items-center gap-2">
              <span className="px-2 py-0.5 text-xs bg-amber-100 text-amber-800 font-bold rounded">Módulo [3]</span>
              NyTEX Compras & Abastecimiento
            </span>
          </div>
          <div className="flex items-center flex-wrap gap-2">
            <button 
              onClick={() => navigate('/app/inventario')}
              className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded-md text-xs font-semibold shadow-sm transition"
            >
              Ver Inventario [4]
            </button>
            <button 
              onClick={() => navigate('/app/cxp')}
              className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded-md text-xs font-semibold shadow-sm transition"
            >
              Ver CxP Proveedores [9]
            </button>
            <button 
              onClick={() => setCreateModalOpen(true)}
              className="bg-[#006EAD] hover:bg-[#005587] text-white px-4 py-2 rounded-md text-sm font-bold shadow-sm transition flex items-center gap-1.5"
            >
              <span>+</span> NUEVA ORDEN DE COMPRA (PO)
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 text-gray-800 w-full space-y-6">
        {/* Banner de Mensaje Integrado */}
        {actionMessage && (
          <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-r-lg shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl">⚡</span>
              <div>
                <p className="text-sm font-bold text-emerald-900">Sincronización P2P Exitosa</p>
                <p className="text-xs text-emerald-700">{actionMessage}</p>
              </div>
            </div>
            <button onClick={() => setActionMessage('')} className="text-emerald-700 hover:text-emerald-900 text-xs font-bold">✕ Cerrar</button>
          </div>
        )}

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center justify-between">
            <div>
              <span className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Órdenes Emitidas</span>
              <span className="block text-3xl font-extrabold text-[#0A2540]">{orders.length}</span>
              <span className="text-xs text-gray-400">Requisiciones aprobadas</span>
            </div>
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center text-xl font-bold">
              📑
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center justify-between">
            <div>
              <span className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">En Espera de Entrega</span>
              <span className="block text-3xl font-extrabold text-blue-600">
                {orders.filter(o => o.status !== 'Recibida en Almacén').length}
              </span>
              <span className="text-xs text-blue-500 font-semibold">En tránsito con proveedor</span>
            </div>
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold">
              🚚
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center justify-between">
            <div>
              <span className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Recibidas en Almacén</span>
              <span className="block text-3xl font-extrabold text-emerald-600">
                {orders.filter(o => o.status === 'Recibida en Almacén').length}
              </span>
              <span className="text-xs text-emerald-500 font-semibold">Stock ingresado a Inventario</span>
            </div>
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center text-xl font-bold">
              ✅
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center justify-between">
            <div>
              <span className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Monto Total Compras</span>
              <span className="block text-2xl font-extrabold text-[#0A2540]">
                ${orders.reduce((sum, o) => sum + (o.total || 0), 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </span>
              <span className="text-xs text-gray-400">Total contratado con proveedores</span>
            </div>
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center text-xl font-bold">
              💰
            </div>
          </div>
        </div>

        {/* Tabla de Órdenes de Compra */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="flex border-b border-gray-100 px-6 py-4 bg-gray-50/50 justify-between items-center">
            <h3 className="font-bold text-gray-800 text-sm">Órdenes de Compra Emitidas (PO)</h3>
            <span className="text-xs text-gray-500">Mostrando {orders.length} registros</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3.5">Folio PO</th>
                  <th className="px-6 py-3.5">Proveedor (Business Partner)</th>
                  <th className="px-6 py-3.5">Entrega Programada</th>
                  <th className="px-6 py-3.5 text-right">Importe Total</th>
                  <th className="px-6 py-3.5 text-center">Estado PO</th>
                  <th className="px-6 py-3.5 text-center">Factura CxP</th>
                  <th className="px-6 py-3.5 text-right">Acción de Circuito</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-400">Cargando órdenes de compra...</td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-400">No hay órdenes de compra registradas.</td>
                  </tr>
                ) : (
                  orders.map(po => (
                    <tr key={po.id} className="hover:bg-amber-50/20 transition">
                      <td className="px-6 py-4 font-mono font-bold text-amber-700">
                        {po.poCode}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">{po.vendorName}</div>
                        <div className="text-xs text-gray-400 font-mono">{po.vendorCode}</div>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-600">
                        📅 {po.deliveryDate}
                      </td>
                      <td className="px-6 py-4 text-right font-mono font-bold text-gray-900">
                        ${po.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(po.status)}`}>
                          {po.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {po.isBilled ? (
                          <span className="inline-block px-2.5 py-0.5 rounded text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
                            ✓ {po.invoiceRef}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400 font-semibold">Pendiente Recepción</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedOrder(po)}
                            className="px-2.5 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded"
                          >
                            Partidas
                          </button>
                          {po.status !== 'Recibida en Almacén' ? (
                            <button
                              onClick={() => handleReceivePO(po.poCode)}
                              className="px-3 py-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded shadow-sm transition"
                              title="Ingresa las unidades al inventario y genera la factura en CxP"
                            >
                              📥 Recibir en Almacén ➔ Inventario & CxP
                            </button>
                          ) : (
                            <span className="px-2.5 py-1 text-xs bg-emerald-50 text-emerald-700 font-bold rounded">
                              ✓ En Existencia
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

        {/* Modal Crear Orden de Compra */}
        {createModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b pb-3">
                <div>
                  <h3 className="text-lg font-bold text-[#0A2540]">Crear Orden de Compra (PO)</h3>
                  <p className="text-xs text-gray-500">Abastecimiento de materias primas e insumos para Producción</p>
                </div>
                <button onClick={() => setCreateModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl font-bold">✕</button>
              </div>

              <form onSubmit={handleCreatePO} className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Proveedor (Business Partner)</label>
                    <select
                      value={selectedVendorCode}
                      onChange={(e) => setSelectedVendorCode(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-amber-600"
                    >
                      {partners.map(p => (
                        <option key={p.code} value={p.code}>
                          {p.name} ({p.code})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Fecha Prometida de Entrega</label>
                    <input
                      type="date"
                      required
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 text-sm focus:outline-none focus:border-amber-600"
                    />
                  </div>
                </div>

                {/* Partidas de Compra */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-gray-700 uppercase">Insumos y Materias Primas a Solicitar</label>
                    <button
                      type="button"
                      onClick={handleAddItem}
                      className="text-xs text-amber-700 hover:underline font-bold"
                    >
                      + Agregar Insumo
                    </button>
                  </div>

                  <div className="space-y-2 border border-gray-200 rounded-lg p-3 bg-gray-50 max-h-48 overflow-y-auto">
                    {poItems.map((it, idx) => (
                      <div key={idx} className="grid grid-cols-12 gap-2 items-center text-xs">
                        <select
                          value={it.sku}
                          onChange={(e) => {
                            const found = invItems.find(inv => inv.sku === e.target.value);
                            const updated = [...poItems];
                            updated[idx].sku = e.target.value;
                            if (found) {
                              updated[idx].name = found.name;
                              updated[idx].unitCost = found.unitCost;
                            }
                            setPoItems(updated);
                          }}
                          className="col-span-4 px-2 py-1.5 border border-gray-300 rounded bg-white font-mono"
                        >
                          {invItems.map(inv => (
                            <option key={inv.sku} value={inv.sku}>
                              {inv.sku} - {inv.name}
                            </option>
                          ))}
                        </select>
                        <input
                          type="text"
                          placeholder="Descripción"
                          value={it.name}
                          onChange={(e) => handleItemChange(idx, 'name', e.target.value)}
                          className="col-span-3 px-2 py-1.5 border border-gray-300 rounded bg-white"
                        />
                        <input
                          type="number"
                          min="1"
                          placeholder="Cant"
                          value={it.quantity}
                          onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                          className="col-span-2 px-2 py-1.5 border border-gray-300 rounded bg-white font-mono text-right"
                        />
                        <input
                          type="number"
                          min="0"
                          placeholder="C. Unit"
                          value={it.unitCost}
                          onChange={(e) => handleItemChange(idx, 'unitCost', e.target.value)}
                          className="col-span-2 px-2 py-1.5 border border-gray-300 rounded bg-white font-mono text-right"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          className="col-span-1 text-red-500 hover:text-red-700 font-bold text-center"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Resumen Totales */}
                <div className="bg-amber-50/50 p-4 rounded-lg space-y-1 text-right text-xs">
                  <div>Subtotal: <span className="font-mono font-bold">${subtotalCalc.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span></div>
                  <div>IVA (13%): <span className="font-mono font-bold">${taxCalc.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span></div>
                  <div className="text-base font-extrabold text-[#0A2540] border-t border-amber-200 pt-1">
                    Total: <span className="font-mono">${totalCalc.toLocaleString('es-MX', { minimumFractionDigits: 2 })} USD</span>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t">
                  <button
                    type="button"
                    onClick={() => setCreateModalOpen(false)}
                    className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-sm bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg shadow-sm transition"
                  >
                    Emitir Orden de Compra
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Detalle Partidas */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <div>
                  <h3 className="text-lg font-bold text-[#0A2540]">Orden de Compra {selectedOrder.poCode}</h3>
                  <p className="text-xs text-gray-500">{selectedOrder.vendorName} ({selectedOrder.vendorCode})</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600 text-xl font-bold">✕</button>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {selectedOrder.items && selectedOrder.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border text-xs">
                    <div>
                      <div className="font-bold text-gray-800">{it.name || it.sku}</div>
                      <div className="text-gray-400 font-mono">SKU: {it.sku} x {it.quantity} un.</div>
                    </div>
                    <div className="text-right font-mono font-bold text-gray-900">
                      ${((it.quantity || 1) * (it.unitCost || 0)).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg font-bold text-sm">
                <span>Total Facturado:</span>
                <span className="font-mono text-base text-amber-900">${selectedOrder.total.toLocaleString()} USD</span>
              </div>

              <div className="flex justify-end pt-3 border-t">
                <button
                  onClick={() => setSelectedOrder(null)}
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