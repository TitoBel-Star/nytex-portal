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
  const [deliveryMode, setDeliveryMode] = useState('logistica'); // 'logistica' | 'mostrador' | 'mixto'
  const [selectedPartnerCode, setSelectedPartnerCode] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('Crédito 30 días');
  const [paymentMethod, setPaymentMethod] = useState('Efectivo');
  const [amountReceived, setAmountReceived] = useState('');
  const [items, setItems] = useState([
    { sku: 'SKU-TEL-01', description: 'Rollo Algodón Peinado 100% 180g (Azul)', quantity: '1', unitPrice: '1850', dispatchLocation: 'Bodega' }
  ]);

  // Buscador Rápido en Tabla Principal
  const [tableSearchQuery, setTableSearchQuery] = useState('');

  // Buscador Rápido de Productos por SKU / Descripción en Modal de Creación
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState('Todas');
  const [searchNotification, setSearchNotification] = useState('');

  // Modales
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [printOrder, setPrintOrder] = useState(null);

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
    if (deliveryMode === 'logistica' && p && p.address) {
      setDeliveryAddress(p.address);
    }
  };

  const handleDeliveryModeChange = (mode) => {
    setDeliveryMode(mode);
    if (mode === 'mostrador') {
      setDeliveryAddress('Mostrador / Caja Principal (Entrega Inmediata)');
      setPaymentTerms('Contado / Anticipado');
      setPaymentMethod('Efectivo');
    } else if (mode === 'mixto') {
      setDeliveryAddress('Caja (Menudeo) + Andén Bodega (Bultos Grandes)');
      setPaymentTerms('Contado / Anticipado');
      setPaymentMethod('Efectivo');
    } else {
      const p = partners.find(part => part.code === selectedPartnerCode);
      setDeliveryAddress(p?.address || 'Dirección de Entrega Predeterminada');
      setPaymentTerms('Crédito 30 días');
      setPaymentMethod('Crédito en Cuenta');
    }
  };

  const handleAddItem = () => {
    setItems([...items, { sku: 'SKU-NUEVO', description: 'Nuevo Producto / Tela', quantity: '1', unitPrice: '500', dispatchLocation: 'Caja' }]);
  };

  const handleAddCatalogItem = (product) => {
    const newPrice = product.price || Math.round((product.unitCost || 1200) * 1.35) || 1850;
    const defaultLocation = (product.name && product.name.toLowerCase().includes('rollo')) || product.category === 'Materia Prima' ? 'Bodega' : 'Caja';
    
    // Si la lista tiene solo un ítem vacío o con 'SKU-NUEVO', lo reemplazamos
    const hasPlaceholder = items.length === 1 && (!items[0].sku || items[0].sku === 'SKU-NUEVO');
    if (hasPlaceholder) {
      setItems([{
        sku: product.sku,
        description: product.name,
        quantity: '1',
        unitPrice: String(newPrice),
        dispatchLocation: defaultLocation
      }]);
    } else {
      // Si el SKU ya está en la orden, sumamos +1 a su cantidad
      const existingIdx = items.findIndex(it => it.sku.toLowerCase() === product.sku.toLowerCase());
      if (existingIdx !== -1) {
        const updated = [...items];
        updated[existingIdx].quantity = String((Number(updated[existingIdx].quantity) || 0) + 1);
        setItems(updated);
      } else {
        setItems([...items, {
          sku: product.sku,
          description: product.name,
          quantity: '1',
          unitPrice: String(newPrice),
          dispatchLocation: defaultLocation
        }]);
      }
    }
    setSearchNotification(`✓ Agregado: [${product.sku}] ${product.name} (Despacho: ${defaultLocation})`);
    setTimeout(() => setSearchNotification(''), 3500);
  };

  const toggleDispatchLocation = (index) => {
    const newItems = [...items];
    const current = newItems[index].dispatchLocation || 'Caja';
    newItems[index].dispatchLocation = current === 'Caja' ? 'Bodega' : 'Caja';
    setItems(newItems);
  };

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, idx) => idx !== index));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    if (field === 'quantity') {
      let clean = String(value ?? '').replace(/[^0-9]/g, '');
      if (clean.length > 1 && clean.startsWith('0')) {
        clean = clean.replace(/^0+/, '');
      }
      newItems[index][field] = clean;
    } else if (field === 'unitPrice') {
      let clean = String(value ?? '').replace(/[^0-9.]/g, '');
      const parts = clean.split('.');
      if (parts.length > 2) clean = parts[0] + '.' + parts.slice(1).join('');
      if (clean.length > 1 && clean.startsWith('0') && !clean.startsWith('0.')) {
        clean = clean.replace(/^0+/, '');
      }
      newItems[index][field] = clean;
    } else {
      newItems[index][field] = value;
      // Autocompletar inteligente al escribir o seleccionar un SKU
      if (field === 'sku') {
        const found = inventoryCatalog.find(c => c.sku.toLowerCase() === value.trim().toLowerCase());
        if (found) {
          newItems[index].description = found.name;
          newItems[index].unitPrice = String(found.price || Math.round((found.unitCost || 1200) * 1.35) || 1850);
        }
      } else if (field === 'description') {
        const found = inventoryCatalog.find(c => c.name.toLowerCase() === value.trim().toLowerCase());
        if (found) {
          newItems[index].sku = found.sku;
          newItems[index].unitPrice = String(found.price || Math.round((found.unitCost || 1200) * 1.35) || 1850);
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

  const subtotalCalc = items.reduce((sum, it) => {
    const q = it.quantity === '' ? 0 : (Number(it.quantity) || 0);
    const p = it.unitPrice === '' ? 0 : (Number(it.unitPrice) || 0);
    return sum + (q * p);
  }, 0);
  const taxCalc = Math.round(subtotalCalc * 0.13 * 100) / 100;
  const totalCalc = Math.round((subtotalCalc + taxCalc) * 100) / 100;

  // Cálculo en tiempo real de cambio / vuelto a entregar
  const numericAmountReceived = parseFloat(amountReceived) || 0;
  const changeToGive = numericAmountReceived > totalCalc ? Math.round((numericAmountReceived - totalCalc) * 100) / 100 : 0;

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    const partner = partners.find(p => p.code === selectedPartnerCode) || { name: 'Cliente General' };
    const validatedItems = items.map(it => ({
      ...it,
      quantity: it.quantity === '' || Number(it.quantity) <= 0 ? 1 : Number(it.quantity),
      unitPrice: it.unitPrice === '' || Number(it.unitPrice) < 0 ? 0 : Number(it.unitPrice),
      dispatchLocation: it.dispatchLocation || ((it.description && it.description.toLowerCase().includes('rollo')) ? 'Bodega' : 'Caja')
    }));

    const finalPaymentMethod = paymentTerms.includes('Crédito') ? 'Crédito en Cuenta' : paymentMethod;
    const finalAmountReceived = finalPaymentMethod === 'Efectivo' 
      ? (numericAmountReceived > 0 ? numericAmountReceived : totalCalc)
      : totalCalc;
    const finalChangeGiven = finalPaymentMethod === 'Efectivo' ? changeToGive : 0;

    try {
      const res = await fetch('/api/ventas/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientCode: selectedPartnerCode,
          clientName: partner.name,
          deliveryAddress,
          paymentTerms,
          deliveryMode,
          paymentMethod: finalPaymentMethod,
          amountReceived: finalAmountReceived,
          changeGiven: finalChangeGiven,
          items: validatedItems
        })
      });
      const newOrd = await res.json();
      if (res.ok) {
        if (deliveryMode === 'mostrador') {
          setActionMessage(`Venta de Mostrador ${newOrd.orderCode} registrada exitosamente con estado ENTREGADO.`);
        } else if (deliveryMode === 'mixto') {
          setActionMessage(`Despacho Mixto ${newOrd.orderCode}: Mercancía ligera entregada en caja; bultos mayores enviados a Bodega para entrega en rampa.`);
        } else {
          setActionMessage(`Cotización ${newOrd.orderCode} creada exitosamente.`);
        }
        setTimeout(() => setActionMessage(''), 6000);
        setCreateModalOpen(false);
        setAmountReceived('');
        fetchData();
      } else {
        alert(newOrd.error || 'Error al crear orden');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Confirmar entrega de bultos en bodega / rampa
  const handleCompleteDelivery = async (orderCode) => {
    try {
      const res = await fetch(`/api/ventas/orders/${orderCode}/deliver`, {
        method: 'POST'
      });
      const result = await res.json();
      if (res.ok) {
        setActionMessage(result.message);
        setTimeout(() => setActionMessage(''), 6000);
        fetchData();
      } else {
        alert(result.error || 'Error al confirmar entrega');
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

  // Cancelar / Anular Orden (Liberación de inventario y cancelación de WMS)
  const handleCancelOrder = async (orderCode) => {
    if (!window.confirm(`¿Está seguro de que desea ANULAR la orden ${orderCode}?\n\nEsta acción cambiará el estado a 'Cancelada' y anulará automáticamente la tarea en WMS.`)) {
      return;
    }
    try {
      const res = await fetch(`/api/ventas/orders/${orderCode}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'Cancelada a petición del usuario en Mostrador / Ventas' })
      });
      const result = await res.json();
      if (res.ok) {
        setActionMessage(result.message);
        setTimeout(() => setActionMessage(''), 6000);
        fetchData();
      } else {
        alert(result.error || 'Error al cancelar la orden');
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
      case 'Cancelada': return 'bg-rose-100 text-rose-800 border-rose-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const filteredOrders = orders.filter(o => {
    // 1. Filtro por Pestañas
    if (activeTab === 'Cotizaciones' && o.status !== 'Cotización') return false;
    if (activeTab === 'En Proceso' && (o.status === 'Cotización' || o.status === 'Entregado' || o.status === 'Cancelada')) return false;
    if (activeTab === 'Entregadas' && o.status !== 'Entregado') return false;
    if (activeTab === 'Canceladas' && o.status !== 'Cancelada') return false;

    // 2. Buscador Rápido de Texto
    if (!tableSearchQuery.trim()) return true;
    const q = tableSearchQuery.toLowerCase().trim();
    const orderCodeMatch = (o.orderCode || '').toLowerCase().includes(q);
    const clientNameMatch = (o.clientName || '').toLowerCase().includes(q);
    const clientCodeMatch = (o.clientCode || '').toLowerCase().includes(q);
    const invoiceMatch = (o.invoiceCode || '').toLowerCase().includes(q);
    const paymentMatch = (o.paymentMethod || '').toLowerCase().includes(q) || (o.paymentTerms || '').toLowerCase().includes(q);
    const itemsMatch = Array.isArray(o.items) && o.items.some(it => 
      (it.sku || '').toLowerCase().includes(q) || (it.description || '').toLowerCase().includes(q)
    );
    return orderCodeMatch || clientNameMatch || clientCodeMatch || invoiceMatch || paymentMatch || itemsMatch;
  });

  const totalFacturado = orders.filter(o => o.isInvoiced).reduce((sum, o) => sum + (o.total || 0), 0);

  return (
    <div className="h-full flex flex-col bg-[#f4f7f9] overflow-y-auto w-full">
      {/* Top Header */}
      <div className="flex flex-col border-b border-gray-200 px-6 py-4 bg-white sticky top-0 z-10 shrink-0 shadow-sm w-full">
        <div className="flex flex-wrap justify-between items-center gap-3">
          <div className="flex items-center text-lg text-gray-700">
            <span className="cursor-pointer hover:underline text-[#006EAD]" onClick={() => navigate('/portal')}>Portal</span>
            <span className="mx-2 text-gray-400">/</span>
            <span className="font-bold text-[#0A2540] flex items-center gap-2">
              <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 font-bold rounded">Módulo [2]</span>
              NyTEX Ventas & Facturación
            </span>
          </div>
          <div className="flex items-center flex-wrap gap-2">
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 px-6 py-3 bg-gray-50/50">
            <div className="flex flex-wrap items-center gap-1.5">
              {['Todas', 'Cotizaciones', 'En Proceso', 'Entregadas', 'Canceladas'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition ${
                    activeTab === tab 
                      ? 'bg-[#006EAD] text-white shadow-xs' 
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Buscador Rápido en la Tabla */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <input
                  type="text"
                  value={tableSearchQuery}
                  onChange={(e) => setTableSearchQuery(e.target.value)}
                  placeholder="🔍 Buscar folio, cliente, SKU..."
                  className="w-56 sm:w-64 pl-8 pr-7 py-1.5 text-xs bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 font-medium"
                />
                <span className="absolute left-2.5 top-1.5 text-gray-400 text-xs">🔎</span>
                {tableSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setTableSearchQuery('')}
                    className="absolute right-2 top-1.5 text-gray-400 hover:text-gray-700 text-xs font-bold"
                  >
                    ✕
                  </button>
                )}
              </div>
              <div className="text-xs text-gray-500 shrink-0 font-medium">
                {filteredOrders.length} {filteredOrders.length === 1 ? 'orden' : 'órdenes'}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3.5">Folio</th>
                  <th className="px-6 py-3.5">Cliente (Business Partner)</th>
                  <th className="px-6 py-3.5">Términos & Pago</th>
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
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-400">
                      {tableSearchQuery ? `No se encontraron órdenes con el criterio "${tableSearchQuery}".` : 'No hay órdenes en este estado.'}
                    </td>
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
                        <div className="font-semibold text-gray-700">{order.paymentTerms}</div>
                        {order.paymentMethod && order.paymentMethod !== 'Por Definir' && (
                          <span className="inline-block mt-0.5 px-1.5 py-0.2 text-[10px] font-bold rounded bg-slate-100 text-slate-700 border border-slate-200">
                            {order.paymentMethod === 'Efectivo' ? '💵 Efectivo' :
                             order.paymentMethod === 'Tarjeta POS' ? '💳 Tarjeta POS' :
                             order.paymentMethod === 'Transferencia' ? '🏦 Transf' :
                             order.paymentMethod === 'Cheque' ? '📝 Cheque' : order.paymentMethod}
                          </span>
                        )}
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
                        <div className="flex justify-end gap-1.5 flex-wrap">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="px-2.5 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded"
                          >
                            Detalle
                          </button>

                          {/* Botón de Impresión de Ticket / Factura */}
                          <button
                            onClick={() => setPrintOrder(order)}
                            className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-bold rounded shadow-2xs transition flex items-center gap-1"
                            title="Ver e Imprimir Ticket Térmico / Factura"
                          >
                            <span>🖨️</span> Ticket
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

                          {order.status !== 'Cotización' && order.status !== 'Entregado' && order.status !== 'Cancelada' && (
                            <button
                              onClick={() => handleCompleteDelivery(order.orderCode)}
                              className="px-2.5 py-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded shadow-sm transition"
                              title="Confirmar que el cliente retiró los bultos de bodega"
                            >
                              ✓ Entrega Bodega
                            </button>
                          )}

                          {!order.isInvoiced && order.status !== 'Cancelada' && (
                            <button
                              onClick={() => handleInvoiceOrder(order.orderCode)}
                              className="px-2.5 py-1 text-xs bg-purple-600 hover:bg-purple-700 text-white font-bold rounded shadow-sm transition"
                              title="Genera factura y la registra en Cuentas por Cobrar"
                            >
                              🧾 Facturar ➔ CxC
                            </button>
                          )}

                          {/* Botón Cancelar / Anular Orden */}
                          {order.status !== 'Cancelada' && !order.isInvoiced && (
                            <button
                              onClick={() => handleCancelOrder(order.orderCode)}
                              className="px-2 py-1 text-xs bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold rounded transition"
                              title="Anular orden y cancelar tarea asociada en WMS"
                            >
                              ✕ Anular
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
                      onChange={(e) => {
                        const val = e.target.value;
                        setPaymentTerms(val);
                        if (val.includes('Crédito')) {
                          setPaymentMethod('Crédito en Cuenta');
                        } else {
                          setPaymentMethod('Efectivo');
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-blue-600"
                    >
                      <option value="Contado / Anticipado">Contado / Anticipado</option>
                      <option value="Crédito 15 días">Crédito 15 días</option>
                      <option value="Crédito 30 días">Crédito 30 días</option>
                    </select>
                  </div>
                </div>

                {/* REGISTRO DE MEDIO DE PAGO EN CAJA */}
                {paymentTerms === 'Contado / Anticipado' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-emerald-50/70 border border-emerald-300 rounded-xl">
                    <div>
                      <label className="block text-xs font-extrabold text-emerald-950 uppercase mb-1 flex items-center gap-1.5">
                        <span>💳</span>
                        <span>Medio de Pago en Caja</span>
                      </label>
                      <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-full px-3 py-2 border border-emerald-300 bg-white rounded-lg text-gray-900 font-bold text-xs focus:outline-none focus:border-emerald-600 shadow-2xs"
                      >
                        <option value="Efectivo">💵 Efectivo (Cash USD)</option>
                        <option value="Tarjeta POS">💳 Tarjeta Débito / Crédito (POS)</option>
                        <option value="Transferencia">🏦 Transferencia Bancaria Directa</option>
                        <option value="Cheque">📝 Cheque Certificado</option>
                      </select>
                    </div>

                    {paymentMethod === 'Efectivo' ? (
                      <div>
                        <label className="block text-xs font-extrabold text-emerald-950 uppercase mb-1">
                          Efectivo Recibido ($ USD)
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            inputMode="decimal"
                            placeholder={`Monto (ej: $${totalCalc})`}
                            value={amountReceived}
                            onChange={(e) => {
                              let clean = e.target.value.replace(/[^0-9.]/g, '');
                              const parts = clean.split('.');
                              if (parts.length > 2) clean = parts[0] + '.' + parts.slice(1).join('');
                              setAmountReceived(clean);
                            }}
                            className="w-full px-3 py-2 border border-emerald-300 rounded-lg text-xs font-mono font-bold bg-white text-gray-900 focus:outline-none focus:border-emerald-600 shadow-2xs"
                          />
                          {numericAmountReceived >= totalCalc && numericAmountReceived > 0 && (
                            <div className="px-2.5 py-1.5 bg-emerald-700 text-white rounded-lg text-xs font-mono font-black whitespace-nowrap shadow-xs animate-fadeIn">
                              Vuelto: ${changeToGive.toFixed(2)}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center text-xs text-emerald-800 font-semibold pt-4">
                        <span>✓ Cobro registrado por el importe exacto (${totalCalc.toLocaleString('es-MX', { minimumFractionDigits: 2 })} USD).</span>
                      </div>
                    )}
                  </div>
                )}

                {/* SELECTOR DE MODALIDAD DE DESPACHO Y DESTINO */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 bg-gradient-to-r from-blue-50/60 to-indigo-50/60 border border-blue-200/80 rounded-xl">
                  <div>
                    <label className="block text-xs font-extrabold text-[#0A2540] uppercase mb-1 flex items-center gap-1.5">
                      <span>⚡</span>
                      <span>Modalidad de Despacho</span>
                    </label>
                    <select
                      value={deliveryMode}
                      onChange={(e) => handleDeliveryModeChange(e.target.value)}
                      className="w-full px-3 py-2 border-2 border-blue-300 bg-white rounded-lg text-gray-900 font-bold text-xs focus:outline-none focus:border-blue-600 shadow-xs"
                    >
                      <option value="logistica">🚚 Envío por Logística (Flujo B2B / Camión a Domicilio)</option>
                      <option value="mostrador">🏪 Entrega Inmediata en Caja / Mostrador (Supermercado / Retail)</option>
                      <option value="mixto">📦 Despacho Mixto (Menudeo en Caja + Bultos en Rampa Bodega)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      {deliveryMode === 'mostrador' 
                        ? 'Punto de Entrega Física' 
                        : deliveryMode === 'mixto'
                        ? 'Punto de Entrega Mixta'
                        : 'Dirección de Entrega (Logística)'}
                    </label>
                    <input
                      type="text"
                      required
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder={
                        deliveryMode === 'mostrador' 
                          ? 'Mostrador / Caja Principal' 
                          : deliveryMode === 'mixto'
                          ? 'Caja + Andén de Bodega'
                          : 'Calle, Número, Ciudad'
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 text-xs bg-white focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  {deliveryMode === 'mostrador' && (
                    <div className="col-span-full text-[11px] bg-emerald-50 border border-emerald-300 text-emerald-900 font-semibold px-3 py-2 rounded-lg flex items-center gap-2">
                      <span className="text-base">🏪</span>
                      <span>
                        <strong>Modalidad Supermercado / Retail activada:</strong> Los artículos se entregan en el acto al cliente en caja. La orden se guardará automáticamente con el estado verde <strong>«Entregado»</strong>, lista para emitir el ticket/factura al instante sin pasar por flete ni bodega.
                      </span>
                    </div>
                  )}

                  {deliveryMode === 'mixto' && (
                    <div className="col-span-full text-[11px] bg-amber-50 border border-amber-300 text-amber-900 font-semibold px-3 py-2 rounded-lg flex items-center gap-2">
                      <span className="text-base">📦</span>
                      <span>
                        <strong>Modalidad Despacho Mixto activada:</strong> La mercancía pequeña/menudeo se entrega en la misma caja, y los bultos mayores (cajas, sacos o rollos) se alistan en el andén de Bodega. La orden se envía a Bodega en preparación y podrá confirmarse como <strong>«Entregado»</strong> con el botón <em>«✓ Entrega Bodega»</em> una vez que el cliente retire los bultos con su comprobante de pago.
                      </span>
                    </div>
                  )}
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
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 mb-2">
                    <div>
                      <label className="text-xs font-bold text-gray-700 uppercase">Partidas de la Orden</label>
                      {deliveryMode === 'mixto' && (
                        <p className="text-[11px] text-amber-800 font-semibold">
                          💡 En cada fila puede hacer clic en <strong>[🏪 Caja]</strong> o <strong>[📦 Bodega]</strong> si el producto no está en mostrador y el cliente debe recogerlo en bodega.
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={handleAddItem}
                      className="text-xs text-[#006EAD] hover:underline font-bold self-start sm:self-auto"
                    >
                      + Agregar Fila Manual
                    </button>
                  </div>

                  <div className="space-y-2 border border-gray-200 rounded-lg p-3 bg-gray-50 max-h-56 overflow-y-auto">
                    {items.map((it, idx) => {
                      const loc = it.dispatchLocation || ((it.description && it.description.toLowerCase().includes('rollo')) ? 'Bodega' : 'Caja');
                      return (
                        <div key={idx} className="flex flex-wrap md:flex-nowrap gap-2 items-center text-xs bg-white p-2 rounded-md border border-gray-200 shadow-2xs">
                          {/* SKU */}
                          <input
                            type="text"
                            list="inventory-sku-datalist"
                            placeholder="SKU"
                            value={it.sku}
                            onChange={(e) => handleItemChange(idx, 'sku', e.target.value)}
                            className="w-28 px-2 py-1.5 border border-gray-300 rounded bg-white font-mono font-bold text-blue-900 shrink-0"
                          />

                          {/* Descripción */}
                          <input
                            type="text"
                            list="inventory-desc-datalist"
                            placeholder="Descripción"
                            value={it.description}
                            onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                            className="flex-1 min-w-[130px] px-2 py-1.5 border border-gray-300 rounded bg-white"
                          />

                          {/* BOTÓN INTERACTIVO DEL CAJERO: CAJA VS BODEGA */}
                          {deliveryMode === 'mixto' && (
                            <button
                              type="button"
                              onClick={() => toggleDispatchLocation(idx)}
                              title="Haga clic si el producto no está en piso de venta y el cliente debe retirarlo en bodega"
                              className={`px-2 py-1.5 rounded-md font-bold text-[11px] border shrink-0 transition-all flex items-center gap-1 cursor-pointer ${
                                loc === 'Bodega'
                                  ? 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200'
                                  : 'bg-emerald-100 text-emerald-900 border-emerald-300 hover:bg-emerald-200'
                              }`}
                            >
                              <span>{loc === 'Bodega' ? '📦 Bodega' : '🏪 Caja'}</span>
                              <span className="text-[9px] text-gray-500 font-normal underline">cambiar</span>
                            </button>
                          )}

                          {/* Cantidad */}
                          <div className="w-16 shrink-0">
                            <input
                              type="text"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              placeholder="Cant"
                              value={it.quantity}
                              onFocus={(e) => e.target.select()}
                              onBlur={() => {
                                if (!it.quantity || Number(it.quantity) <= 0) {
                                  handleItemChange(idx, 'quantity', '1');
                                }
                              }}
                              onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                              className="w-full px-2 py-1.5 border border-gray-300 rounded bg-white font-mono text-right"
                            />
                          </div>

                          {/* Precio */}
                          <div className="w-20 shrink-0">
                            <input
                              type="text"
                              inputMode="decimal"
                              placeholder="P. Unit"
                              value={it.unitPrice}
                              onFocus={(e) => e.target.select()}
                              onBlur={() => {
                                if (it.unitPrice === '' || Number(it.unitPrice) < 0) {
                                  handleItemChange(idx, 'unitPrice', '0');
                                }
                              }}
                              onChange={(e) => handleItemChange(idx, 'unitPrice', e.target.value)}
                              className="w-full px-2 py-1.5 border border-gray-300 rounded bg-white font-mono text-right"
                            />
                          </div>

                          {/* Subtotal */}
                          <div className="w-16 text-right font-mono font-bold text-gray-700 text-xs shrink-0">
                            ${((Number(it.quantity) || 0) * (Number(it.unitPrice) || 0)).toLocaleString('es-MX')}
                          </div>

                          {/* Eliminar */}
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            className="text-red-500 hover:text-red-700 font-bold px-1 text-center shrink-0 cursor-pointer"
                          >
                            ✕
                          </button>
                        </div>
                      );
                    })}
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
                    className={`px-5 py-2 text-sm text-white font-bold rounded-lg shadow-sm transition ${
                      deliveryMode === 'mostrador' 
                        ? 'bg-emerald-600 hover:bg-emerald-700' 
                        : deliveryMode === 'mixto'
                        ? 'bg-amber-600 hover:bg-amber-700'
                        : 'bg-[#006EAD] hover:bg-[#005587]'
                    }`}
                  >
                    {deliveryMode === 'mostrador' 
                      ? '🏪 Registrar Venta Entregada en Caja' 
                      : deliveryMode === 'mixto'
                      ? '📦 Registrar Despacho Mixto (Caja + Bodega)'
                      : 'Registrar Cotización'}
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
                  <div className="space-y-1.5 mt-1 max-h-48 overflow-y-auto">
                    {selectedOrder.items && selectedOrder.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded border text-xs">
                        <div>
                          <div className="font-semibold text-gray-800 flex items-center gap-1.5">
                            <span>{it.description || it.sku}</span>
                            {it.dispatchLocation && (
                              <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold border ${
                                it.dispatchLocation === 'Bodega'
                                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                                  : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                              }`}>
                                {it.dispatchLocation === 'Bodega' ? '📦 Retiro en Bodega' : '🏪 Entregado en Caja'}
                              </span>
                            )}
                          </div>
                          <div className="text-gray-400 font-mono">SKU: {it.sku} x {it.quantity} un.</div>
                        </div>
                        <div className="font-mono font-bold text-gray-800">
                          ${((Number(it.quantity) || 1) * (Number(it.unitPrice) || 0)).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Resumen de Pago */}
                <div className="p-3 bg-gray-50 rounded-lg space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500 font-bold uppercase">Forma de Pago:</span>
                    <span className="font-bold text-gray-800">{selectedOrder.paymentMethod || selectedOrder.paymentTerms || 'Contado'}</span>
                  </div>
                  {selectedOrder.amountReceived > 0 && selectedOrder.paymentMethod === 'Efectivo' && (
                    <>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-500">Monto Recibido:</span>
                        <span className="font-mono font-bold">${selectedOrder.amountReceived.toLocaleString('es-MX', { minimumFractionDigits: 2 })} USD</span>
                      </div>
                      <div className="flex justify-between items-center text-xs text-emerald-700 font-bold">
                        <span>Cambio Entregado:</span>
                        <span className="font-mono">${(selectedOrder.changeGiven || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })} USD</span>
                      </div>
                    </>
                  )}
                </div>

                <div className="p-3 bg-blue-50/50 rounded-lg flex justify-between items-center text-sm font-bold border border-blue-100">
                  <span>Importe Total:</span>
                  <span className="text-[#006EAD] font-mono text-base">${selectedOrder.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })} USD</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 border-t">
                <button
                  type="button"
                  onClick={() => {
                    const toPrint = selectedOrder;
                    setSelectedOrder(null);
                    setPrintOrder(toPrint);
                  }}
                  className="px-3.5 py-2 text-xs bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition"
                >
                  <span>🖨️</span> Ver / Imprimir Ticket
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Impresión de Ticket / Factura y Talón de Retiro en Bodega */}
        {printOrder && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 my-8 relative">
              {/* Barra de Acciones Superior (No se imprime) */}
              <div className="flex justify-between items-center pb-3 border-b border-gray-200 no-print">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🖨️</span>
                  <span className="font-bold text-gray-800 text-sm">Vista Previa de Impresión</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-3 py-1.5 bg-[#006EAD] hover:bg-[#005587] text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <span>🖨️</span> Imprimir / PDF
                  </button>
                  <button
                    type="button"
                    onClick={() => setPrintOrder(null)}
                    className="text-gray-400 hover:text-gray-700 text-lg font-bold px-1 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* TICKET / COMPROBANTE FÍSICO IMPRIMIBLE */}
              <div id="printable-ticket" className="bg-white font-mono text-[11px] text-gray-900 space-y-3 leading-tight p-2">
                {/* Cabecera */}
                <div className="text-center space-y-1">
                  <div className="text-base font-black tracking-widest text-[#0A2540]">NYTEX TEXTIL INDUSTRIAL</div>
                  <div className="text-[10px] text-gray-600">S.A. DE C.V. • NIT: 0614-280392-102-1</div>
                  <div className="text-[10px] text-gray-600">Carretera Panamericana Km 28, Complejo Industrial</div>
                  <div className="text-[10px] text-gray-600">PBX: (503) 2250-9000 • ventas@nytex.com</div>
                  <div className="border-b-2 border-dashed border-gray-400 pt-1"></div>
                </div>

                {/* Datos del Comprobante */}
                <div className="space-y-0.5 text-[10px]">
                  <div className="flex justify-between">
                    <span className="font-bold">ORDEN / FOLIO:</span>
                    <span className="font-black text-xs text-[#006EAD]">{printOrder.orderCode}</span>
                  </div>
                  {printOrder.invoiceCode && (
                    <div className="flex justify-between">
                      <span className="font-bold">FACTURA DTE:</span>
                      <span className="font-bold text-emerald-800">{printOrder.invoiceCode}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>FECHA / HORA:</span>
                    <span>{new Date(printOrder.createdAt || Date.now()).toLocaleDateString('es-MX')} {new Date(printOrder.createdAt || Date.now()).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>CLIENTE:</span>
                    <span className="font-bold truncate max-w-[190px]">{printOrder.clientName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>CÓDIGO:</span>
                    <span>{printOrder.clientCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ENTREGA:</span>
                    <span className="truncate max-w-[190px] text-[9px]">{printOrder.deliveryAddress}</span>
                  </div>
                  <div className="border-b border-dashed border-gray-300 pt-1"></div>
                </div>

                {/* Partidas */}
                <div>
                  <div className="flex justify-between font-bold text-[10px] uppercase border-b border-gray-400 pb-0.5 mb-1">
                    <span>Cant / Descripción</span>
                    <span>Importe</span>
                  </div>
                  <div className="space-y-1.5">
                    {printOrder.items && printOrder.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between items-start text-[10px]">
                        <div className="flex-1 pr-2">
                          <div className="font-bold leading-tight flex items-center gap-1">
                            <span>{it.description || it.sku}</span>
                            {it.dispatchLocation && (
                              <span className={`text-[8px] px-1 rounded font-bold border ${
                                it.dispatchLocation === 'Bodega'
                                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                                  : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                              }`}>
                                {it.dispatchLocation === 'Bodega' ? '📦 Bodega' : '🏪 Caja'}
                              </span>
                            )}
                          </div>
                          <div className="text-[9px] text-gray-500">
                            {it.quantity} un. x ${(Number(it.unitPrice) || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                          </div>
                        </div>
                        <div className="font-bold font-mono text-right shrink-0">
                          ${((Number(it.quantity) || 1) * (Number(it.unitPrice) || 0)).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-b border-dashed border-gray-300 pt-1"></div>
                </div>

                {/* Totales y Finanzas */}
                <div className="space-y-1 text-[11px]">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-mono">${(printOrder.total / 1.13).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>IVA (13%):</span>
                    <span className="font-mono">${(printOrder.total - (printOrder.total / 1.13)).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-sm font-black border-t border-b border-gray-800 py-1">
                    <span>TOTAL:</span>
                    <span>${printOrder.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })} USD</span>
                  </div>
                </div>

                {/* Desglose de Pago en Caja */}
                <div className="bg-gray-50 p-2 rounded border border-gray-200 text-[10px] space-y-0.5">
                  <div className="flex justify-between">
                    <span className="font-bold">CONDICIONES:</span>
                    <span>{printOrder.paymentTerms}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold">FORMA DE PAGO:</span>
                    <span className="font-bold text-gray-800">{printOrder.paymentMethod || 'Contado / Efectivo'}</span>
                  </div>
                  {(printOrder.paymentMethod === 'Efectivo' || !printOrder.paymentMethod) && (
                    <>
                      <div className="flex justify-between">
                        <span>IMPORTE RECIBIDO:</span>
                        <span className="font-mono font-bold">${(printOrder.amountReceived || printOrder.total).toLocaleString('es-MX', { minimumFractionDigits: 2 })} USD</span>
                      </div>
                      <div className="flex justify-between text-emerald-800 font-bold">
                        <span>CAMBIO ENTREGADO:</span>
                        <span className="font-mono">${(printOrder.changeGiven || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })} USD</span>
                      </div>
                    </>
                  )}
                </div>

                {/* TALÓN DESPRENDIBLE DE RETIRO EN BODEGA */}
                {Array.isArray(printOrder.items) && printOrder.items.some(it => it.dispatchLocation === 'Bodega') && (
                  <div className="pt-3">
                    <div className="text-center text-[9px] text-gray-500 font-bold tracking-widest border-t-2 border-dashed border-gray-500 pt-2 mb-2">
                      ✂️ CORTE AQUÍ • TALÓN DE RETIRO EN BODEGA 📦
                    </div>
                    <div className="border-2 border-gray-800 rounded p-2.5 bg-amber-50/50 space-y-2">
                      <div className="flex justify-between items-center text-[10px]">
                        <div>
                          <div className="font-black text-xs text-amber-950">VALE DE RETIRO EN RAMPA / BODEGA</div>
                          <div className="text-[9px] text-gray-600">Folio: <strong>{printOrder.orderCode}</strong></div>
                        </div>
                        <div className="text-right text-[9px]">
                          <div>Fecha: {new Date(printOrder.createdAt || Date.now()).toLocaleDateString('es-MX')}</div>
                          <div className="font-bold text-emerald-800">✓ PAGADO EN CAJA</div>
                        </div>
                      </div>

                      <div className="text-[10px] border-t border-b border-gray-300 py-1 space-y-1">
                        <div className="font-bold text-[9px] text-gray-700 uppercase">Bultos Autorizados para Entrega:</div>
                        {printOrder.items.filter(it => it.dispatchLocation === 'Bodega').map((it, idx) => (
                          <div key={idx} className="flex items-center justify-between text-[10px]">
                            <span className="flex items-center gap-1.5">
                              <span className="font-bold">[  ]</span>
                              <span className="font-semibold">{it.description || it.sku}</span>
                            </span>
                            <span className="font-mono font-bold">{it.quantity} un.</span>
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-2 text-[9px] text-center">
                        <div className="border-t border-gray-500 pt-1">
                          <p className="font-bold">Firma Cliente Recibí Conforme</p>
                        </div>
                        <div className="border-t border-gray-500 pt-1">
                          <p className="font-bold">Sello Despacho Bodega WMS</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Pie del Ticket */}
                <div className="text-center pt-2 text-[9px] text-gray-500 border-t border-dashed border-gray-300">
                  <p className="font-bold text-gray-700">¡GRACIAS POR SU COMPRA!</p>
                  <p>Conserve este comprobante para cualquier reclamo o garantía.</p>
                  <p className="font-mono text-[8px] text-gray-400 mt-1">SISTEMA NYTEX ERP v2.4 • TRAZABILIDAD O2C CERTIFICADA</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Estilos CSS aislados para la ventana de impresión (window.print) */}
        <style>{`
          @media print {
            body * {
              visibility: hidden;
            }
            #printable-ticket, #printable-ticket * {
              visibility: visible;
            }
            #printable-ticket {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              margin: 0;
              padding: 15px;
              box-shadow: none !important;
              border: none !important;
            }
            .no-print {
              display: none !important;
            }
          }
        `}</style>

      </div>
    </div>
  );
}