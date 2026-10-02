import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DEFAULT_CATALOG = [
  { sku: 'PT-TEL-101', name: 'Rollo Tela Gabardina Algodón Peinado (Azul)', price: 1850, stock: 35, unit: 'rollos', category: 'Producto Terminado' },
  { sku: 'PT-POP-102', name: 'Rollo Popelina Estampada Premium', price: 2150, stock: 15, unit: 'rollos', category: 'Producto Terminado' },
  { sku: 'PT-RIB-103', name: 'Rollo Rib 1x1 con Spandex Elastomérico', price: 1950, stock: 22, unit: 'rollos', category: 'Producto Terminado' },
  { sku: 'PT-FLE-104', name: 'Rollo Felpa Francesa Fleece 280g Térmico', price: 2800, stock: 18, unit: 'rollos', category: 'Producto Terminado' },
  { sku: 'PT-PIQ-105', name: 'Rollo Piqué 100% Algodón Tipo Polo', price: 2100, stock: 26, unit: 'rollos', category: 'Producto Terminado' },
  { sku: 'SKU-TEL-01', name: 'Rollo Algodón Peinado 100% 180g (Azul)', price: 1850, stock: 45, unit: 'rollos', category: 'Producto Terminado' },
  { sku: 'SKU-TEL-02', name: 'Rollo Algodón Peinado 100% 180g (Negro)', price: 1850, stock: 32, unit: 'rollos', category: 'Producto Terminado' },
  { sku: 'SKU-TEL-03', name: 'Rollo Algodón Peinado 100% 180g (Blanco Óptico)', price: 1780, stock: 60, unit: 'rollos', category: 'Producto Terminado' },
  { sku: 'SKU-MEZ-01', name: 'Rollo Mezclilla Denim 12oz Índigo Strech', price: 2400, stock: 28, unit: 'rollos', category: 'Producto Terminado' },
  { sku: 'SKU-MEZ-02', name: 'Rollo Mezclilla Denim 14oz Rígida Pesada', price: 2650, stock: 19, unit: 'rollos', category: 'Producto Terminado' },
  { sku: 'SKU-POL-01', name: 'Rollo Poliéster Dry-Fit Transpirable', price: 1450, stock: 55, unit: 'rollos', category: 'Producto Terminado' },
  { sku: 'MP-HIL-01', name: 'Hilo de Algodón Peinado 100% 30/1 (Cono 2.5kg)', price: 380, stock: 120, unit: 'kg', category: 'Materia Prima' },
  { sku: 'MP-POL-02', name: 'Hilo de Poliéster Alta Tenacidad 150D', price: 240, stock: 450, unit: 'kg', category: 'Materia Prima' },
  { sku: 'MP-TIN-03', name: 'Tinte Reactivo Azul Marino Textil', price: 490, stock: 18, unit: 'litros', category: 'Insumo Químico' }
];

export default function Ventas() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [partners, setPartners] = useState([]);
  const [inventoryCatalog, setInventoryCatalog] = useState(DEFAULT_CATALOG);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Todas');
  const [actionMessage, setActionMessage] = useState('');
  
  // Modal Crear Orden
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedPartnerCode, setSelectedPartnerCode] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('Crédito 30 días');
  const [items, setItems] = useState([
    { sku: 'SKU-TEL-01', description: 'Rollo Algodón Peinado 100% 180g (Azul)', quantity: 10, unitPrice: 1850 }
  ]);

  // Buscador Rápido de Productos por SKU / Descripción
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState('Todas');
  const [searchNotification, setSearchNotification] = useState('');

  // Modal Ver Detalle
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchData = async () => {
    try {
      const [resOrders, resPartners, resInv] = await Promise.all([
        fetch('/api/ventas/orders'),
        fetch('/api/business-partners'),
        fetch('/api/inventario/items')
      ]);
      if (resOrders.ok) {
        const dataOrders = await resOrders.json();
        setOrders(dataOrders);
      }
      if (resPartners.ok) {
        const dataPartners = await resPartners.json();
        setPartners(dataPartners);
        if (dataPartners.length > 0 && !selectedPartnerCode) {
          setSelectedPartnerCode(dataPartners[0].code);
          setDeliveryAddress(dataPartners[0].address || 'Dirección de Entrega Predeterminada');
        }
      }
      if (resInv.ok) {
        const dataInv = await resInv.json();
        if (Array.isArray(dataInv) && dataInv.length > 0) {
          const formatted = dataInv.map(it => ({
            sku: it.sku,
            name: it.name,
            price: it.unitCost ? Math.round(it.unitCost * 1.35) : 1500,
            unitCost: it.unitCost,
            stock: it.stock,
            unit: it.unit,
            category: it.category
          }));
          const merged = [...formatted];
          DEFAULT_CATALOG.forEach(def => {
            if (!merged.some(m => m.sku.toLowerCase() === def.sku.toLowerCase())) {
              merged.push(def);
            }
          });
          setInventoryCatalog(merged);
        }
      }
    } catch (err) {
      console.error('Error fetching data in Ventas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePartnerChange = (e) => {
    const code = e.target.value;
    setSelectedPartnerCode(code);
    const p = partners.find(part => part.code === code);
    if (p && p.address) {
      setDeliveryAddress(p.address);
    }
  };

  const handleAddItem = () => {
    setItems([...items, { sku: 'SKU-NUEVO', description: 'Nuevo Producto / Tela', quantity: 1, unitPrice: 500 }]);
  };

  const handleAddCatalogItem = (product) => {
    const newPrice = product.price || Math.round((product.unitCost || 1200) * 1.35) || 1850;
    
    // Si la lista tiene solo un ítem vacío o con 'SKU-NUEVO', lo reemplazamos
    const hasPlaceholder = items.length === 1 && (!items[0].sku || items[0].sku === 'SKU-NUEVO');
    if (hasPlaceholder) {
      setItems([{
        sku: product.sku,
        description: product.name,
        quantity: 1,
        unitPrice: newPrice
      }]);
    } else {
      // Si el SKU ya está en la orden, sumamos +1 a su cantidad
      const existingIdx = items.findIndex(it => it.sku.toLowerCase() === product.sku.toLowerCase());
      if (existingIdx !== -1) {
        const updated = [...items];
        updated[existingIdx].quantity += 1;
        setItems(updated);
      } else {
        setItems([...items, {
          sku: product.sku,
          description: product.name,
          quantity: 1,
          unitPrice: newPrice
        }]);
      }
    }
    setSearchNotification(`✓ Agregado a la orden: [${product.sku}] ${product.name}`);
    setTimeout(() => setSearchNotification(''), 3500);
  };

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, idx) => idx !== index));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    if (field === 'quantity' || field === 'unitPrice') {
      newItems[index][field] = parseFloat(value) || 0;
    } else {
      newItems[index][field] = value;
      // Autocompletar inteligente al escribir o seleccionar un SKU
      if (field === 'sku') {
        const found = inventoryCatalog.find(c => c.sku.toLowerCase() === value.trim().toLowerCase());
        if (found) {
          newItems[index].description = found.name;
          newItems[index].unitPrice = found.price || Math.round((found.unitCost || 1200) * 1.35) || 1850;
        }
      } else if (field === 'description') {
        const found = inventoryCatalog.find(c => c.name.toLowerCase() === value.trim().toLowerCase());
        if (found) {
          newItems[index].sku = found.sku;
          newItems[index].unitPrice = found.price || Math.round((found.unitCost || 1200) * 1.35) || 1850;
        }
      }
    }
    setItems(newItems);
  };

  const filteredCatalog = inventoryCatalog.filter(item => {
    if (searchCategory !== 'Todas') {
      if (searchCategory === 'Producto Terminado' && item.category !== 'Producto Terminado') return false;
      if (searchCategory === 'Materia Prima' && item.category !== 'Materia Prima') return false;
    }
    if (!searchQuery.trim()) {
      return true;
    }
    const q = searchQuery.toLowerCase().trim();
    const skuMatch = (item.sku || '').toLowerCase().includes(q);
    const nameMatch = (item.name || '').toLowerCase().includes(q);
    const catMatch = (item.category || '').toLowerCase().includes(q);
    return skuMatch || nameMatch || catMatch;
  });

  const subtotalCalc = items.reduce((sum, it) => sum + (it.quantity * it.unitPrice), 0);
  const taxCalc = Math.round(subtotalCalc * 0.13 * 100) / 100;
  const totalCalc = Math.round((subtotalCalc + taxCalc) * 100) / 100;

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    const partner = partners.find(p => p.code === selectedPartnerCode) || { name: 'Cliente General' };
    try {
      const res = await fetch('/api/ventas/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientCode: selectedPartnerCode,
          clientName: partner.name,
          deliveryAddress,
          paymentTerms,
          items
        })
      });
      const newOrd = await res.json();
      if (res.ok) {
        setActionMessage(`Cotización ${newOrd.orderCode} creada exitosamente.`);
        setTimeout(() => setActionMessage(''), 6000);
        setCreateModalOpen(false);
        fetchData();
      } else {
        alert(newOrd.error || 'Error al crear orden');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Confirmar y disparar a WMS
  const handleConfirmOrder = async (orderCode) => {
    try {
      const res = await fetch(`/api/ventas/orders/${orderCode}/confirm`, {
        method: 'POST'
      });
      const result = await res.json();
      if (res.ok) {
        setActionMessage(result.message);
        setTimeout(() => setActionMessage(''), 6000);
        fetchData();
      } else {
        alert(result.error || 'Error al confirmar orden');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Facturar y disparar a CxC
  const handleInvoiceOrder = async (orderCode) => {
    try {
      const res = await fetch(`/api/ventas/orders/${orderCode}/invoice`, {
        method: 'POST'
      });
      const result = await res.json();
      if (res.ok) {
        setActionMessage(result.message);
        setTimeout(() => setActionMessage(''), 6000);
        fetchData();
      } else {
        alert(result.error || 'Error al facturar orden');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Cotización': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'En Preparación WMS': return 'bg-blue-100 text-blue-800 border-blue-300 animate-pulse';
      case 'Listo para Despacho': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'En Tránsito': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Entregado': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const filteredOrders = orders.filter(o => {
    if (activeTab === 'Todas') return true;
    if (activeTab === 'Cotizaciones') return o.status === 'Cotización';
    if (activeTab === 'En Proceso') return o.status !== 'Cotización' && o.status !== 'Entregado';
    if (activeTab === 'Entregadas') return o.status === 'Entregado';
    return true;
  });

  const totalFacturado = orders.filter(o => o.isInvoiced).reduce((sum, o) => sum + (o.total || 0), 0);

  return (
    <div className="h-full flex flex-col bg-[#f4f7f9] overflow-hidden w-full">
      {/* Top Header */}
      <div className="flex flex-col border-b border-gray-200 px-6 py-4 bg-white sticky top-0 z-10 shrink-0 shadow-sm w-full">
        <div className="flex justify-between items-center">
          <div className="flex items-center text-lg text-gray-700">
            <span className="cursor-pointer hover:underline text-[#006EAD]" onClick={() => navigate('/portal')}>Portal</span>
            <span className="mx-2 text-gray-400">/</span>
            <span className="font-bold text-[#0A2540] flex items-center gap-2">
              <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 font-bold rounded">Módulo [2]</span>
              NyTEX Ventas & Facturación
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => navigate('/app/circuito-comercial')}
              className="bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 px-3 py-1.5 rounded-md text-xs font-bold shadow-sm transition"
            >
              ⚡ Monitor Trazabilidad O2C
            </button>
            <button 
              onClick={() => setCreateModalOpen(true)}
              className="bg-[#006EAD] hover:bg-[#005587] text-white px-4 py-2 rounded-md text-sm font-bold shadow-sm transition flex items-center gap-1.5"
            >
              <span>+</span> NUEVA ORDEN / COTIZACIÓN
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 text-gray-800 w-full space-y-6">
        {/* Banner Mensaje Automatización */}
        {actionMessage && (
          <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-r-lg shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl">⚡</span>
              <div>
                <p className="text-sm font-bold text-emerald-900">Circuito O2C Automatizado</p>
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
              <span className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Total Facturado</span>
              <span className="block text-2xl font-extrabold text-[#0A2540]">
                ${totalFacturado.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </span>
              <span className="text-xs text-emerald-600 font-semibold">Emitido hacia CxC</span>
            </div>
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center text-xl font-bold">
              💰
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center justify-between">
            <div>
              <span className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Órdenes Totales</span>
              <span className="block text-3xl font-extrabold text-[#006EAD]">{orders.length}</span>
              <span className="text-xs text-gray-400">Registradas en sistema</span>
            </div>
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold">
              📑
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center justify-between">
            <div>
              <span className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">En Flujo (WMS / Logística)</span>
              <span className="block text-3xl font-extrabold text-amber-600">
                {orders.filter(o => o.status !== 'Cotización' && o.status !== 'Entregado').length}
              </span>
              <span className="text-xs text-amber-500 font-semibold">En preparación o tránsito</span>
            </div>
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center text-xl font-bold">
              🔄
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center justify-between">
            <div>
              <span className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Cotizaciones Abiertas</span>
              <span className="block text-3xl font-extrabold text-purple-600">
                {orders.filter(o => o.status === 'Cotización').length}
              </span>
              <span className="text-xs text-purple-500 font-semibold">Pendientes de confirmación</span>
            </div>
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center text-xl font-bold">
              📝
            </div>
          </div>
        </div>

        {/* Tabla Principal */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="flex border-b border-gray-100 px-6 py-3 bg-gray-50/50 justify-between items-center">
            <div className="flex space-x-2">
              {['Todas', 'Cotizaciones', 'En Proceso', 'Entregadas'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
                    activeTab === tab 
                      ? 'bg-[#006EAD] text-white shadow-sm' 
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="text-xs text-gray-400">
              Mostrando {filteredOrders.length} registros
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3.5">Folio</th>
                  <th className="px-6 py-3.5">Cliente (Business Partner)</th>
                  <th className="px-6 py-3.5">Términos Pago</th>
                  <th className="px-6 py-3.5 text-right">Total ($ USD)</th>
                  <th className="px-6 py-3.5 text-center">Estado Operativo</th>
                  <th className="px-6 py-3.5 text-center">Facturación (CxC)</th>
                  <th className="px-6 py-3.5 text-right">Acciones de Circuito</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-400">Cargando órdenes de venta...</td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-400">No hay órdenes en este estado.</td>
                  </tr>
                ) : (
                  filteredOrders.map(order => (
                    <tr key={order.id} className="hover:bg-blue-50/30 transition">
                      <td className="px-6 py-4 font-mono font-bold text-[#006EAD]">
                        {order.orderCode}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-800">{order.clientName}</div>
                        <div className="text-xs text-gray-400 font-mono">{order.clientCode}</div>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-600">
                        {order.paymentTerms}
                      </td>
                      <td className="px-6 py-4 text-right font-mono font-bold text-gray-900">
                        ${order.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {order.isInvoiced ? (
                          <span className="inline-block px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            ✓ {order.invoiceCode}
                          </span>
                        ) : (
                          <span className="inline-block px-2.5 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-500">
                            No Facturada
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="px-2.5 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded"
                          >
                            Detalle
                          </button>

                          {order.status === 'Cotización' && (
                            <button
                              onClick={() => handleConfirmOrder(order.orderCode)}
                              className="px-2.5 py-1 text-xs bg-[#006EAD] hover:bg-[#005587] text-white font-bold rounded shadow-sm transition"
                              title="Pasa la orden a WMS para picking y empaque"
                            >
                              ⚡ Confirmar ➔ WMS
                            </button>
                          )}

                          {!order.isInvoiced && (
                            <button
                              onClick={() => handleInvoiceOrder(order.orderCode)}
                              className="px-2.5 py-1 text-xs bg-purple-600 hover:bg-purple-700 text-white font-bold rounded shadow-sm transition"
                              title="Genera factura y la registra en Cuentas por Cobrar"
                            >
                              🧾 Facturar ➔ CxC
                            </button>
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

        {/* Modal Crear Orden */}
        {createModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b pb-3">
                <div>
                  <h3 className="text-lg font-bold text-[#0A2540]">Crear Nueva Cotización / Orden de Venta</h3>
                  <p className="text-xs text-gray-500">Integrada con Business Partners e Inventario</p>
                </div>
                <button onClick={() => setCreateModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl font-bold">✕</button>
              </div>

              <form onSubmit={handleCreateOrder} className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Cliente (Business Partner)</label>
                    <select
                      value={selectedPartnerCode}
                      onChange={handlePartnerChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-blue-600"
                    >
                      {partners.map(p => (
                        <option key={p.code} value={p.code}>
                          {p.name} ({p.code}) - {p.type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Condiciones de Pago</label>
                    <select
                      value={paymentTerms}
                      onChange={(e) => setPaymentTerms(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-blue-600"
                    >
                      <option value="Crédito 30 días">Crédito 30 días</option>
                      <option value="Crédito 15 días">Crédito 15 días</option>
                      <option value="Contado / Anticipado">Contado / Anticipado</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Dirección de Entrega (Logística)</label>
                  <input
                    type="text"
                    required
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 text-sm focus:outline-none focus:border-blue-600"
                  />
                </div>

                {/* BUSCADOR RÁPIDO DE CATÁLOGO (SKU / DESCRIPCIÓN) CON PESTAÑAS */}
                <div className="bg-slate-50 border-2 border-blue-200/80 rounded-xl p-3.5 space-y-2.5 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-base">🏷️</span>
                      <span className="text-xs font-black text-[#0A2540] uppercase tracking-wide">
                        Buscar Producto en Catálogo (SKU / Descripción)
                      </span>
                      <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
                        Escriba letra o número
                      </span>
                    </div>

                    {/* Pestañas de Filtro Rápido */}
                    <div className="flex items-center gap-1 text-[11px]">
                      {[
                        { id: 'Todas', label: 'Todos' },
                        { id: 'Producto Terminado', label: 'Telas (PT)' },
                        { id: 'Materia Prima', label: 'Hilos (MP)' }
                      ].map(tab => (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setSearchCategory(tab.id)}
                          className={`px-2.5 py-1 rounded-md font-bold transition-all ${
                            searchCategory === tab.id
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-300'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Input de Búsqueda Instantánea */}
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="🔍 Escriba una letra o número (ej: T, 1, 01, TEL, Algodón, PT, Gabardina)..."
                      className="w-full pl-9 pr-8 py-2 bg-white border-2 border-blue-300 focus:border-blue-600 rounded-lg text-xs font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30 transition-all shadow-xs"
                    />
                    <span className="absolute left-3 top-2.5 text-gray-400 text-xs">🔎</span>
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2.5 top-2 text-gray-400 hover:text-gray-700 text-xs font-bold bg-gray-100 hover:bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Notificación de Producto Agregado */}
                  {searchNotification && (
                    <div className="text-xs bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 animate-fadeIn">
                      <span>✓</span>
                      <span>{searchNotification}</span>
                    </div>
                  )}

                  {/* Resultados Encontrados por Letra / Número */}
                  {filteredCatalog.length > 0 && (
                    <div className="bg-white border border-blue-200 rounded-lg p-1.5 max-h-48 overflow-y-auto divide-y divide-gray-100 shadow-xs">
                      <div className="text-[10px] text-gray-400 uppercase font-bold px-2 py-1 flex justify-between bg-slate-50/50 rounded">
                        <span>{searchQuery ? `Resultados para "${searchQuery}" (${filteredCatalog.length})` : `Catálogo Disponible (${filteredCatalog.length} productos)`}</span>
                        <span className="text-blue-600 font-black">Haga clic o pulse "+ Agregar"</span>
                      </div>
                      {filteredCatalog.map(p => (
                        <div
                          key={p.sku}
                          onClick={() => handleAddCatalogItem(p)}
                          className="p-2 hover:bg-blue-50/80 rounded-md cursor-pointer transition-colors flex items-center justify-between gap-3 group"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="font-mono font-black text-xs text-blue-900 bg-blue-100 px-2 py-0.5 rounded border border-blue-200 shrink-0">
                              {p.sku}
                            </span>
                            <div className="min-w-0">
                              <p className="font-bold text-xs text-gray-800 truncate group-hover:text-blue-700 transition-colors">
                                {p.name}
                              </p>
                              <div className="flex items-center gap-2 text-[10px] text-gray-500">
                                <span className="bg-gray-100 px-1.5 py-0.2 rounded text-gray-600 font-semibold">{p.category}</span>
                                <span>•</span>
                                <span className="font-semibold text-emerald-700">Stock: {p.stock} {p.unit || 'uds'}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <div className="text-right">
                              <span className="text-[10px] text-gray-400 block leading-tight">Precio Ref:</span>
                              <span className="font-mono font-extrabold text-xs text-gray-900">
                                ${(p.price || Math.round((p.unitCost || 1200) * 1.35) || 1850).toLocaleString('es-MX')} USD
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); handleAddCatalogItem(p); }}
                              className="px-2.5 py-1 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded shadow-xs transition-transform active:scale-95 whitespace-nowrap"
                            >
                              + Agregar
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {searchQuery && filteredCatalog.length === 0 && (
                    <div className="bg-white border border-dashed border-gray-300 rounded-lg p-3 text-center text-xs text-gray-500">
                      No se encontraron productos con "{searchQuery}". Puede dar de alta la partida manualmente abajo.
                    </div>
                  )}
                </div>

                {/* Datalists para Autocompletado Nativo en las partidas */}
                <datalist id="inventory-sku-datalist">
                  {inventoryCatalog.map(c => (
                    <option key={c.sku} value={c.sku}>{c.name}</option>
                  ))}
                </datalist>
                <datalist id="inventory-desc-datalist">
                  {inventoryCatalog.map(c => (
                    <option key={c.sku} value={c.name}>{c.sku} - ${c.price || Math.round((c.unitCost || 1200) * 1.35) || 1850}</option>
                  ))}
                </datalist>

                {/* Ítems */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-gray-700 uppercase">Partidas de la Orden</label>
                    <button
                      type="button"
                      onClick={handleAddItem}
                      className="text-xs text-[#006EAD] hover:underline font-bold"
                    >
                      + Agregar Fila Manual
                    </button>
                  </div>

                  <div className="space-y-2 border border-gray-200 rounded-lg p-3 bg-gray-50 max-h-48 overflow-y-auto">
                    {items.map((it, idx) => (
                      <div key={idx} className="grid grid-cols-12 gap-2 items-center text-xs">
                        <input
                          type="text"
                          list="inventory-sku-datalist"
                          placeholder="SKU"
                          value={it.sku}
                          onChange={(e) => handleItemChange(idx, 'sku', e.target.value)}
                          className="col-span-3 px-2 py-1.5 border border-gray-300 rounded bg-white font-mono font-bold text-blue-900"
                        />
                        <input
                          type="text"
                          list="inventory-desc-datalist"
                          placeholder="Descripción"
                          value={it.description}
                          onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                          className="col-span-4 px-2 py-1.5 border border-gray-300 rounded bg-white"
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
                          placeholder="P. Unit"
                          value={it.unitPrice}
                          onChange={(e) => handleItemChange(idx, 'unitPrice', e.target.value)}
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
                <div className="bg-blue-50/50 p-4 rounded-lg space-y-1 text-right text-xs">
                  <div>Subtotal: <span className="font-mono font-bold">${subtotalCalc.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span></div>
                  <div>IVA (13%): <span className="font-mono font-bold">${taxCalc.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span></div>
                  <div className="text-base font-extrabold text-[#0A2540] border-t border-blue-200 pt-1">
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
                    className="px-5 py-2 text-sm bg-[#006EAD] hover:bg-[#005587] text-white font-bold rounded-lg shadow-sm transition"
                  >
                    Registrar Cotización
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Detalle de Orden */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <div>
                  <h3 className="text-lg font-bold text-[#0A2540]">Orden {selectedOrder.orderCode}</h3>
                  <p className="text-xs text-gray-500">{selectedOrder.clientName} ({selectedOrder.clientCode})</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600 text-xl font-bold">✕</button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <span className="font-bold text-gray-400 uppercase">Destino de Entrega:</span>
                  <p className="text-gray-800 text-sm mt-0.5">{selectedOrder.deliveryAddress}</p>
                </div>

                <div>
                  <span className="font-bold text-gray-400 uppercase">Partidas de la Orden:</span>
                  <div className="space-y-1.5 mt-1 max-h-40 overflow-y-auto">
                    {selectedOrder.items && selectedOrder.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between p-2 bg-gray-50 rounded border text-xs">
                        <div>
                          <div className="font-semibold text-gray-800">{it.description || it.sku}</div>
                          <div className="text-gray-400 font-mono">SKU: {it.sku} x {it.quantity} un.</div>
                        </div>
                        <div className="font-mono font-bold text-gray-800">
                          ${((it.quantity || 1) * (it.unitPrice || 0)).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg flex justify-between items-center text-sm font-bold">
                  <span>Importe Total:</span>
                  <span className="text-[#006EAD] font-mono text-base">${selectedOrder.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })} USD</span>
                </div>
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