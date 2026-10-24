import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function InventoryView() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [actionMessage, setActionMessage] = useState('');

  // Modal Nuevo Item
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newSku, setNewSku] = useState('');
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('Materia Prima');
  const [newStock, setNewStock] = useState(100);
  const [newMinStock, setNewMinStock] = useState(50);
  const [newUnit, setNewUnit] = useState('kg');
  const [newUnitCost, setNewUnitCost] = useState(120);
  const [newWarehouse, setNewWarehouse] = useState('Almacén de Materias Primas');
  const [newLocation, setNewLocation] = useState('Rack A-05');

  // Modal Ingreso / Entrada de Stock a SKU Existente
  const [inboundModalOpen, setInboundModalOpen] = useState(false);
  const [inboundItemId, setInboundItemId] = useState('');
  const [inboundQuantity, setInboundQuantity] = useState('');
  const [inboundReason, setInboundReason] = useState('Entrada Directa / Recepción de Almacén');

  // Modal Salida / Ajuste de Merma
  const [outboundModalOpen, setOutboundModalOpen] = useState(false);
  const [outboundItemId, setOutboundItemId] = useState('');
  const [outboundQuantity, setOutboundQuantity] = useState('');
  const [outboundReason, setOutboundReason] = useState('Merma por Defecto de Calidad / Desecho');
  const [outboundReference, setOutboundReference] = useState('');

  // Modal Kardex Detallado
  const [kardexModalOpen, setKardexModalOpen] = useState(false);
  const [kardexData, setKardexData] = useState(null);
  const [loadingKardex, setLoadingKardex] = useState(false);

  // Paginación Dinámica
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modal Carga Masiva (Batch) de SKUs
  const [batchModalOpen, setBatchModalOpen] = useState(false);
  const [batchText, setBatchText] = useState('');
  const [parsedBatchItems, setParsedBatchItems] = useState([]);
  const [batchFileName, setBatchFileName] = useState('');
  const [batchError, setBatchError] = useState('');
  const [isProcessingBatch, setIsProcessingBatch] = useState(false);

  // Parser para CSV, TSV (Excel copy-paste) o punto y coma
  const parseBatchString = (text) => {
    setBatchError('');
    if (!text || !text.trim()) {
      setParsedBatchItems([]);
      return;
    }

    const lines = text.trim().split(/\r?\n/).filter(l => l.trim().length > 0);
    if (lines.length === 0) return;

    // Detectar separador automáticamente
    const firstLine = lines[0];
    let separator = ',';
    if (firstLine.includes('\t')) separator = '\t';
    else if (firstLine.includes(';') && !firstLine.includes(',')) separator = ';';

    const cleanCell = (c) => (c || '').replace(/^["']|["']$/g, '').trim();

    // Comprobar si la primera línea es encabezado
    let startIndex = 0;
    const headerTest = firstLine.toLowerCase();
    if (headerTest.includes('sku') || headerTest.includes('código') || headerTest.includes('codigo') || headerTest.includes('nombre')) {
      startIndex = 1;
    }

    const parsed = [];
    for (let i = startIndex; i < lines.length; i++) {
      const parts = lines[i].split(separator).map(cleanCell);
      if (parts.length >= 2 && parts[0]) {
        parsed.push({
          sku: parts[0]?.toUpperCase(),
          name: parts[1] || 'Material sin nombre',
          category: parts[2] || 'Materia Prima',
          stock: parseFloat(parts[3]) || 0,
          minStock: parseFloat(parts[4]) || 10,
          unit: parts[5] || 'kg',
          unitCost: parseFloat(parts[6]) || 0,
          warehouse: parts[7] || 'Almacén de Materias Primas',
          location: parts[8] || 'Rack General'
        });
      }
    }

    if (parsed.length === 0) {
      setBatchError('No se detectaron filas válidas. Debe contener al menos SKU y Nombre por fila.');
    }
    setParsedBatchItems(parsed);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setBatchFileName(file.name);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target.result;
      setBatchText(content);
      parseBatchString(content);
    };
    reader.readAsText(file);
  };

  const handleDownloadTemplate = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "SKU,Nombre,Categoría,Stock,StockMínimo,Unidad,CostoUSD,Almacén,Ubicación\n" +
      "MP-HIL-05,Hilo de Algodón Cardado 24/1,Materia Prima,300,50,kg,4.25,Almacén de Materias Primas,Rack MP-03\n" +
      "MP-ELA-06,Filamento Elastano Spandex 70D,Materia Prima,150,30,kg,7.80,Almacén de Materias Primas,Rack MP-04\n" +
      "QUIM-BLAN-01,Compuesto Químico Especializado,Insumo Químico,80,20,litros,12.50,Almacén de Químicos,Estante Q-01\n" +
      "PT-RIB-201,Rollo Tela Rib 1x1 Algodón,Producto Terminado,25,10,rollos,45.00,Almacén de Producto Terminado,Rack PT-08\n";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "plantilla_skus_nytex.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBatchSubmit = async (e) => {
    e.preventDefault();
    if (parsedBatchItems.length === 0) {
      alert('No hay registros válidos para procesar.');
      return;
    }
    setIsProcessingBatch(true);
    try {
      const res = await fetch('/api/inventario/items/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: parsedBatchItems })
      });
      const data = await res.json();
      if (res.ok) {
        setActionMessage(data.message);
        setTimeout(() => setActionMessage(''), 7000);
        setBatchModalOpen(false);
        setBatchText('');
        setParsedBatchItems([]);
        setBatchFileName('');
        fetchItems();
      } else {
        alert(data.error || 'Error al procesar carga masiva');
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión al procesar lote');
    } finally {
      setIsProcessingBatch(false);
    }
  };

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/inventario/items');
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (err) {
      console.error('Error fetching inventory items:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInboundSubmit = async (e) => {
    e.preventDefault();
    if (!inboundItemId) return;
    try {
      const res = await fetch(`/api/inventario/items/${inboundItemId}/inbound`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quantity: parseFloat(inboundQuantity),
          reason: inboundReason
        })
      });
      const data = await res.json();
      if (res.ok) {
        setActionMessage(data.message);
        setTimeout(() => setActionMessage(''), 6000);
        setInboundModalOpen(false);
        setInboundQuantity('');
        fetchItems();
      } else {
        alert(data.error || 'Error al registrar entrada de stock');
      }
    } catch (err) {
      console.error('Error en entrada de stock:', err);
    }
  };

  const handleOutboundSubmit = async (e) => {
    e.preventDefault();
    if (!outboundItemId) return;
    try {
      const res = await fetch(`/api/inventario/items/${outboundItemId}/outbound`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quantity: parseFloat(outboundQuantity),
          reason: outboundReason,
          reference: outboundReference
        })
      });
      const data = await res.json();
      if (res.ok) {
        setActionMessage(data.message);
        setTimeout(() => setActionMessage(''), 6000);
        setOutboundModalOpen(false);
        setOutboundQuantity('');
        setOutboundReference('');
        fetchItems();
      } else {
        alert(data.error || 'Error al registrar salida/merma');
      }
    } catch (err) {
      console.error('Error en salida:', err);
    }
  };

  const openKardex = async (itemId) => {
    setLoadingKardex(true);
    setKardexModalOpen(true);
    try {
      const res = await fetch(`/api/inventario/items/${itemId}/kardex`);
      const data = await res.json();
      if (res.ok) {
        setKardexData(data);
      } else {
        alert(data.error || 'Error al consultar Kardex');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingKardex(false);
    }
  };

  const handleExportCSV = () => {
    if (items.length === 0) {
      alert('No hay items para exportar.');
      return;
    }
    const headers = ["SKU", "Nombre", "Categoría", "Existencia Actual", "Stock Mínimo", "Unidad", "Costo Unitario ($)", "Valor Total ($)", "Almacén", "Ubicación / Rack", "Estado"];
    const rows = filteredItems.map(it => [
      `"${it.sku}"`,
      `"${(it.name || '').replace(/"/g, '""')}"`,
      `"${it.category}"`,
      it.stock,
      it.minStock,
      `"${it.unit}"`,
      it.unitCost,
      ((it.stock || 0) * (it.unitCost || 0)).toFixed(2),
      `"${it.warehouse}"`,
      `"${it.location}"`,
      `"${it.status}"`
    ]);
    const csvContent = "\uFEFF" + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `kardex_inventario_nytex_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleCreateItem = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/inventario/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sku: newSku,
          name: newName,
          category: newCategory,
          stock: parseFloat(newStock),
          minStock: parseFloat(newMinStock),
          unit: newUnit,
          unitCost: parseFloat(newUnitCost),
          warehouse: newWarehouse,
          location: newLocation,
          status: parseFloat(newStock) > parseFloat(newMinStock) ? 'Óptimo' : 'Bajo Stock'
        })
      });
      const data = await res.json();
      if (res.ok) {
        setActionMessage(`Producto ${data.sku} registrado exitosamente en el catálogo.`);
        setTimeout(() => setActionMessage(''), 5000);
        setCreateModalOpen(false);
        fetchItems();
      } else {
        alert(data.error || 'Error al crear item');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredItems = items.filter(it => {
    // Categoría
    if (activeCategory !== 'Todas') {
      if (activeCategory === 'Inventario para Vender') {
        const isSellable = it.category === 'Inventario para Vender' || it.category === 'Producto Terminado';
        if (!isSellable) return false;
      } else if (it.category !== activeCategory) {
        return false;
      }
    }
    // Estado
    if (statusFilter !== 'Todos') {
      if (statusFilter === 'Inventario para Vender') {
        const isSellable = it.category === 'Inventario para Vender' || it.category === 'Producto Terminado' || it.status === 'Inventario para Vender';
        if (!isSellable || (it.stock || 0) <= 0) return false;
      } else if (it.status !== statusFilter) {
        return false;
      }
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchSku = (it.sku || '').toLowerCase().includes(q);
      const matchName = (it.name || '').toLowerCase().includes(q);
      const matchWh = (it.warehouse || '').toLowerCase().includes(q);
      const matchLoc = (it.location || '').toLowerCase().includes(q);
      if (!matchSku && !matchName && !matchWh && !matchLoc) return false;
    }
    return true;
  });

  const totalPages = Math.ceil(filteredItems.length / pageSize) || 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedItems = filteredItems.slice((safeCurrentPage - 1) * pageSize, safeCurrentPage * pageSize);

  const totalValue = items.reduce((sum, it) => sum + ((it.stock || 0) * (it.unitCost || 0)), 0);
  const lowStockCount = items.filter(it => it.stock <= it.minStock).length;
  const rawCount = items.filter(it => it.category === 'Materia Prima' || it.category === 'Insumo Químico').length;
  const finishedCount = items.filter(it => it.category === 'Producto Terminado' || it.category === 'Inventario para Vender').reduce((sum, it) => sum + (it.stock || 0), 0);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Inventario para Vender':
      case 'Disponible para Venta':
        return 'bg-blue-100 text-blue-800 border-blue-300 font-bold';
      case 'Óptimo':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Bajo Stock':
        return 'bg-amber-100 text-amber-800 border-amber-300 font-bold animate-pulse';
      case 'Agotado':
        return 'bg-red-100 text-red-800 border-red-300 font-bold';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
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
              <span className="px-2 py-0.5 text-xs bg-emerald-100 text-emerald-800 font-bold rounded">Módulo [4]</span>
              NyTEX Inventario & Control de Stock
            </span>
          </div>
          <div className="flex items-center flex-wrap gap-2">
            <button 
              onClick={() => navigate('/app/circuito-produccion')}
              className="bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 px-3 py-1.5 rounded-md text-xs font-bold shadow-sm transition"
            >
              ⚡ Monitor Abastecimiento & Planta
            </button>
            <button 
              onClick={() => navigate('/app/compras')}
              className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded-md text-xs font-semibold shadow-sm transition"
            >
              Ir a Compras [3]
            </button>
            <button 
              onClick={() => navigate('/app/produccion')}
              className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded-md text-xs font-semibold shadow-sm transition"
            >
              Ir a Producción [7]
            </button>
            <button 
              onClick={handleExportCSV}
              className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded-md text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
              title="Descargar catálogo e inventario valorizado en formato CSV para Excel"
            >
              <span>📊</span> EXPORTAR CSV
            </button>
            <button 
              onClick={() => {
                setBatchModalOpen(true);
                setBatchError('');
                setBatchFileName('');
                setBatchText('');
                setParsedBatchItems([]);
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 rounded-md text-sm font-bold shadow-sm transition flex items-center gap-1.5"
            >
              <span>📂</span> CARGA BATCH (CSV)
            </button>
            <button 
              onClick={() => {
                if (items.length > 0) {
                  setInboundItemId(items[0].id);
                }
                setInboundQuantity('');
                setInboundModalOpen(true);
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-md text-sm font-bold shadow-sm transition flex items-center gap-1.5"
            >
              <span>📥</span> ENTRADA / INGRESO DE STOCK
            </button>
            <button 
              onClick={() => setCreateModalOpen(true)}
              className="bg-[#006EAD] hover:bg-[#005587] text-white px-4 py-2 rounded-md text-sm font-bold shadow-sm transition flex items-center gap-1.5"
            >
              <span>+</span> NUEVO SKU / PRODUCTO
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 text-gray-800 w-full space-y-6">
        {/* Banner de Mensaje */}
        {actionMessage && (
          <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-r-lg shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl">📦</span>
              <div>
                <p className="text-sm font-bold text-emerald-900">Catálogo Actualizado</p>
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
              <span className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Valor Total en Existencia</span>
              <span className="block text-2xl font-extrabold text-[#0A2540]">
                ${totalValue.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </span>
              <span className="text-xs text-emerald-600 font-semibold">Costo promedio de existencias</span>
            </div>
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center text-xl font-bold">
              💵
            </div>
          </div>

          <div 
            onClick={() => setStatusFilter(statusFilter === 'Bajo Stock' ? 'Todos' : 'Bajo Stock')}
            className={`bg-white rounded-xl shadow-sm border p-5 flex items-center justify-between cursor-pointer transition hover:shadow-md ${
              statusFilter === 'Bajo Stock' ? 'border-amber-500 ring-2 ring-amber-300' : 'border-gray-100'
            }`}
            title="Haz clic para filtrar solo SKUs con Bajo Stock"
          >
            <div>
              <span className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Alertas de Bajo Stock</span>
              <span className={`block text-3xl font-extrabold ${lowStockCount > 0 ? 'text-amber-600' : 'text-gray-400'}`}>
                {lowStockCount}
              </span>
              <span className="text-xs text-amber-500 font-semibold">
                {statusFilter === 'Bajo Stock' ? '✓ Filtro activo (clic para quitar)' : 'Bajo punto de reorden'}
              </span>
            </div>
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center text-xl font-bold">
              ⚠️
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center justify-between">
            <div>
              <span className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Materias Primas & Químicos</span>
              <span className="block text-3xl font-extrabold text-blue-600">
                {rawCount} SKUs
              </span>
              <span className="text-xs text-gray-400">Insumos para Producción</span>
            </div>
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold">
              🧵
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center justify-between">
            <div>
              <span className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Inventario para Vender (PT)</span>
              <span className="block text-3xl font-extrabold text-purple-600">
                {finishedCount} rollos/un.
              </span>
              <span className="text-xs text-purple-500 font-semibold">Disponibles para NyTEX Ventas</span>
            </div>
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center text-xl font-bold">
              👔
            </div>
          </div>
        </div>

        {/* Tabla de Inventario */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="flex flex-wrap items-center justify-between border-b border-gray-100 px-6 py-4 bg-gray-50/50 gap-4">
            <div className="flex flex-wrap items-center gap-3">
              {/* Buscador predictivo en vivo */}
              <div className="relative min-w-[260px]">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 text-xs">
                  🔍
                </span>
                <input
                  type="text"
                  placeholder="Buscar por SKU, nombre, rack..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-7 py-1.5 bg-white border border-gray-300 rounded-lg text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#006EAD] focus:ring-1 focus:ring-[#006EAD]"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-gray-400 hover:text-gray-600 text-xs font-bold"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Filtro Categoría */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {['Todas', 'Materia Prima', 'Insumo Químico', 'Producto Terminado', 'Inventario para Vender'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      activeCategory === cat 
                        ? 'bg-[#006EAD] text-white shadow-sm' 
                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Filtro Estado */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 focus:outline-none focus:border-[#006EAD]"
              >
                <option value="Todos">Todos los Estados</option>
                <option value="Inventario para Vender">🏷️ Inventario para Vender (Disponible)</option>
                <option value="Óptimo">Solo Óptimo</option>
                <option value="Bajo Stock">Solo Bajo Stock (Críticos)</option>
              </select>
            </div>

            <div className="text-xs text-gray-500 flex items-center gap-2">
              <span>Mostrando <strong className="text-gray-800">{filteredItems.length}</strong> de <strong className="text-gray-800">{items.length}</strong> items</span>
              {(searchTerm || activeCategory !== 'Todas' || statusFilter !== 'Todos') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setActiveCategory('Todas');
                    setStatusFilter('Todos');
                  }}
                  className="text-xs text-[#006EAD] hover:underline font-bold"
                >
                  Restablecer filtros
                </button>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3.5">SKU</th>
                  <th className="px-6 py-3.5">Descripción del Material / Producto</th>
                  <th className="px-6 py-3.5">Categoría</th>
                  <th className="px-6 py-3.5 text-right">Existencia Actual</th>
                  <th className="px-6 py-3.5 text-right">Stock Mínimo</th>
                  <th className="px-6 py-3.5">Almacén & Rack</th>
                  <th className="px-6 py-3.5 text-center">Estado Stock</th>
                  <th className="px-6 py-3.5 text-right">Acción Integrada</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-8 text-center text-gray-400">Cargando catálogo de inventario...</td>
                  </tr>
                ) : paginatedItems.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-8 text-center text-gray-400">No hay productos que coincidan con los filtros.</td>
                  </tr>
                ) : (
                  paginatedItems.map(it => (
                    <tr key={it.id} className="hover:bg-emerald-50/20 transition">
                      <td className="px-6 py-4 font-mono font-bold text-[#006EAD]">
                        {it.sku}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">{it.name}</div>
                        <div className="text-xs text-gray-400 font-mono">Costo Unit: ${it.unitCost} / {it.unit}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                          {it.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-mono font-extrabold text-gray-900 text-base">
                        {it.stock} <span className="text-xs font-normal text-gray-500">{it.unit}</span>
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-xs text-gray-500">
                        {it.minStock} {it.unit}
                      </td>
                      <td className="px-6 py-4 text-xs">
                        <div className="font-semibold text-gray-800">{it.warehouse}</div>
                        <div className="text-gray-400 font-mono">{it.location}</div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs border ${getStatusBadge(it.status)}`}>
                          {it.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 flex-wrap">
                          <button
                            onClick={() => {
                              setInboundItemId(it.id);
                              setInboundQuantity('');
                              setInboundModalOpen(true);
                            }}
                            className="px-2 py-1 text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold rounded shadow-sm transition"
                            title={`Registrar entrada de stock para SKU ${it.sku}`}
                          >
                            + Entrada
                          </button>
                          <button
                            onClick={() => {
                              setOutboundItemId(it.id);
                              setOutboundQuantity('');
                              setOutboundReference('');
                              setOutboundModalOpen(true);
                            }}
                            className="px-2 py-1 text-xs bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 font-bold rounded shadow-sm transition"
                            title={`Registrar salida por merma o desecho para SKU ${it.sku}`}
                          >
                            - Merma
                          </button>
                          <button
                            onClick={() => openKardex(it.id)}
                            className="px-2.5 py-1 text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-300 font-bold rounded shadow-sm transition flex items-center gap-1"
                            title={`Ver Kardex y bitácora histórica de movimientos de ${it.sku}`}
                          >
                            <span>📜</span> Kardex
                          </button>
                          {it.stock <= it.minStock && it.category !== 'Producto Terminado' && it.category !== 'Inventario para Vender' ? (
                            <button
                              onClick={() => navigate('/app/compras')}
                              className="px-2.5 py-1 text-xs bg-amber-600 hover:bg-amber-700 text-white font-bold rounded shadow-sm transition"
                              title="Reordenar insumo a través de NyTEX Compras"
                            >
                              ⚡ Compras ➔
                            </button>
                          ) : (it.category === 'Producto Terminado' || it.category === 'Inventario para Vender') ? (
                            <button
                              onClick={() => navigate('/app/ventas')}
                              className="px-2.5 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded shadow-sm transition"
                              title="Facturar o cotizar este SKU en NyTEX Ventas"
                            >
                              Ventas ➔
                            </button>
                          ) : (
                            <span className="text-xs text-emerald-600 font-bold px-1">✓ OK</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Paginación y Resumen */}
          <div className="flex flex-wrap items-center justify-between border-t border-gray-100 px-6 py-3.5 bg-gray-50/60 gap-4 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <span>Registros por página:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-white border border-gray-200 rounded px-2 py-1 font-semibold text-gray-700 focus:outline-none focus:border-[#006EAD]"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span className="text-gray-400">|</span>
              <span>Página <strong>{safeCurrentPage}</strong> de <strong>{totalPages}</strong> ({filteredItems.length} SKUs filtrados)</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                disabled={safeCurrentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="px-3 py-1 bg-white border border-gray-200 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed font-medium shadow-sm transition"
              >
                ← Anterior
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`w-7 h-7 rounded text-xs font-bold transition ${
                    safeCurrentPage === p ? 'bg-[#006EAD] text-white shadow-sm' : 'bg-white border border-gray-200 hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                disabled={safeCurrentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="px-3 py-1 bg-white border border-gray-200 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed font-medium shadow-sm transition"
              >
                Siguiente →
              </button>
            </div>
          </div>
        </div>

        {/* Modal Crear SKU */}
        {createModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <div>
                  <h3 className="text-lg font-bold text-[#0A2540]">Alta de Nuevo SKU en Inventario</h3>
                  <p className="text-xs text-gray-500">Integración de catálogo con Compras, Producción y Ventas</p>
                </div>
                <button onClick={() => setCreateModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl font-bold">✕</button>
              </div>

              <form onSubmit={handleCreateItem} className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Código SKU</label>
                    <input
                      type="text"
                      required
                      placeholder="ej. MP-HIL-05"
                      value={newSku}
                      onChange={(e) => setNewSku(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Categoría</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-blue-600"
                    >
                      <option value="Materia Prima">Materia Prima</option>
                      <option value="Insumo Químico">Insumo Químico</option>
                      <option value="Producto Terminado">Producto Terminado</option>
                      <option value="Inventario para Vender">Inventario para Vender (Mercadería)</option>
                      <option value="Empaque">Empaque</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nombre / Descripción del Material</label>
                  <input
                    type="text"
                    required
                    placeholder="ej. Hilo de Lycra Elastano 40D"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 text-sm focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Stock Inicial</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={newStock}
                      onChange={(e) => setNewStock(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-right text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Mínimo Reorden</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={newMinStock}
                      onChange={(e) => setNewMinStock(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-right text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Unidad Medida</label>
                    <input
                      type="text"
                      required
                      placeholder="kg, rollos, m"
                      value={newUnit}
                      onChange={(e) => setNewUnit(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Costo Unitario ($ USD)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={newUnitCost}
                      onChange={(e) => setNewUnitCost(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-right text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Ubicación / Rack</label>
                    <input
                      type="text"
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
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
                    Guardar en Inventario
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Registrar Entrada / Ingreso de Stock */}
        {inboundModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <div>
                  <h3 className="text-lg font-bold text-[#0A2540] flex items-center gap-2">
                    <span>📥</span> Registro de Ingreso / Entrada de Stock
                  </h3>
                  <p className="text-xs text-gray-500">Incrementa físicamente las existencias del SKU en almacén</p>
                </div>
                <button onClick={() => setInboundModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl font-bold">✕</button>
              </div>

              <form onSubmit={handleInboundSubmit} className="space-y-4 text-sm">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Seleccionar SKU / Material</label>
                  <select
                    value={inboundItemId}
                    onChange={(e) => setInboundItemId(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 text-sm focus:outline-none focus:border-blue-600"
                  >
                    <option value="">-- Seleccionar SKU --</option>
                    {items.map(it => (
                      <option key={it.id} value={it.id}>
                        {it.sku} - {it.name} (Existencia actual: {it.stock} {it.unit})
                      </option>
                    ))}
                  </select>
                </div>

                {(() => {
                  const selected = items.find(it => String(it.id) === String(inboundItemId));
                  if (!selected) return null;
                  return (
                    <div className="bg-blue-50/60 p-3 rounded-lg border border-blue-200 text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Material:</span>
                        <strong className="text-gray-900">{selected.name}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Almacén y Rack:</span>
                        <span className="font-mono text-gray-800">{selected.warehouse} ({selected.location})</span>
                      </div>
                      <div className="flex justify-between border-t border-blue-200 pt-1">
                        <span className="text-gray-600">Existencia previa:</span>
                        <span className="font-mono font-bold text-[#006EAD] text-sm">{selected.stock} {selected.unit}</span>
                      </div>
                    </div>
                  );
                })()}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Cantidad a Ingresar</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      required
                      placeholder="ej. 50"
                      value={inboundQuantity}
                      onChange={(e) => setInboundQuantity(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-right text-sm focus:outline-none focus:border-emerald-600 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Motivo / Tipo de Ingreso</label>
                    <select
                      value={inboundReason}
                      onChange={(e) => setInboundReason(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 text-sm focus:outline-none focus:border-blue-600"
                    >
                      <option value="Entrada Directa / Recepción de Almacén">Entrada Directa / Recepción</option>
                      <option value="Devolución de Producción / Sobrante">Devolución de Producción</option>
                      <option value="Ajuste Positivo por Conteo Físico">Ajuste por Conteo Físico</option>
                      <option value="Ingreso Inicial de Stock">Ingreso Inicial de Stock</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t">
                  <button
                    type="button"
                    onClick={() => setInboundModalOpen(false)}
                    className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-sm bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm transition"
                  >
                    Confirmar Entrada en Almacén
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Registrar Salida / Merma de Stock */}
        {outboundModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <div>
                  <h3 className="text-lg font-bold text-[#0A2540] flex items-center gap-2">
                    <span className="text-rose-600">📉</span> Registro de Salida / Merma Operativa
                  </h3>
                  <p className="text-xs text-gray-500">Rebaja existencias físicas por merma, rotura o ajuste negativo</p>
                </div>
                <button onClick={() => setOutboundModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl font-bold">✕</button>
              </div>

              <form onSubmit={handleOutboundSubmit} className="space-y-4 text-sm">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Seleccionar SKU / Material</label>
                  <select
                    value={outboundItemId}
                    onChange={(e) => setOutboundItemId(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 text-sm focus:outline-none focus:border-rose-600"
                  >
                    <option value="">-- Seleccionar SKU --</option>
                    {items.map(it => (
                      <option key={it.id} value={it.id}>
                        {it.sku} - {it.name} (Existencia actual: {it.stock} {it.unit})
                      </option>
                    ))}
                  </select>
                </div>

                {(() => {
                  const selected = items.find(it => String(it.id) === String(outboundItemId));
                  if (!selected) return null;
                  return (
                    <div className="bg-rose-50/60 p-3 rounded-lg border border-rose-200 text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Material:</span>
                        <strong className="text-gray-900">{selected.name}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Almacén y Ubicación:</span>
                        <span className="font-mono text-gray-800">{selected.warehouse} ({selected.location})</span>
                      </div>
                      <div className="flex justify-between border-t border-rose-200 pt-1">
                        <span className="text-gray-600">Existencia actual disponible:</span>
                        <span className="font-mono font-bold text-rose-700 text-sm">{selected.stock} {selected.unit}</span>
                      </div>
                    </div>
                  );
                })()}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Cantidad a Rebajar</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      required
                      placeholder="ej. 15.5"
                      value={outboundQuantity}
                      onChange={(e) => setOutboundQuantity(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-right text-sm focus:outline-none focus:border-rose-600 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Folio / Referencia</label>
                    <input
                      type="text"
                      placeholder="ej. ACTA-MERMA-01"
                      value={outboundReference}
                      onChange={(e) => setOutboundReference(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-rose-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Motivo / Causa de la Merma</label>
                  <select
                    value={outboundReason}
                    onChange={(e) => setOutboundReason(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 text-sm focus:outline-none focus:border-rose-600"
                  >
                    <option value="Merma por Defecto de Calidad / desecho operativo">Merma por Defecto de Calidad / desecho operativo</option>
                    <option value="Merma por Evaporación / Merma Química">Merma por Evaporación / Merma Química</option>
                    <option value="Ajuste Negativo por Conteo Físico / Faltante">Ajuste Negativo por Conteo Físico / Faltante</option>
                    <option value="Consumo Interno / Muestras de Laboratorio">Consumo Interno / Muestras de Laboratorio</option>
                    <option value="Salida Especial Autorizada por Gerencia">Salida Especial Autorizada por Gerencia</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t">
                  <button
                    type="button"
                    onClick={() => setOutboundModalOpen(false)}
                    className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-sm bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg shadow-sm transition"
                  >
                    Confirmar Salida / Merma
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Kardex Detallado por SKU */}
        {kardexModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
              <div className="flex justify-between items-center border-b pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-xl font-bold">
                    📜
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#0A2540] flex items-center gap-2">
                      Kardex Físico y Valuado de Inventario
                    </h3>
                    <p className="text-xs text-gray-500">Trazabilidad cronológica de entradas, consumos, mermas y saldos valorizados</p>
                  </div>
                </div>
                <button onClick={() => setKardexModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl font-bold">✕</button>
              </div>

              {loadingKardex || !kardexData ? (
                <div className="py-16 text-center text-gray-400 text-sm">
                  Consultando bitácora de movimientos en servidor...
                </div>
              ) : (
                <div className="overflow-y-auto space-y-4 flex-1 pr-1">
                  {/* Ficha Resumen del SKU */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                    <div>
                      <span className="text-gray-400 font-bold uppercase block text-[10px]">SKU / Código</span>
                      <strong className="text-sm font-mono text-[#006EAD]">{kardexData.item.sku}</strong>
                      <span className="block text-gray-700 font-medium truncate">{kardexData.item.name}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 font-bold uppercase block text-[10px]">Categoría & Unidad</span>
                      <strong className="text-gray-800">{kardexData.item.category}</strong>
                      <span className="block text-gray-500 font-mono">Unidad: {kardexData.item.unit}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 font-bold uppercase block text-[10px]">Existencia Actual</span>
                      <strong className="text-base font-extrabold text-emerald-700 font-mono">
                        {kardexData.item.stock} {kardexData.item.unit}
                      </strong>
                      <span className="block text-gray-500">Ubicación: {kardexData.item.location}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 font-bold uppercase block text-[10px]">Valuación Total</span>
                      <strong className="text-base font-extrabold text-[#0A2540] font-mono">
                        ${((kardexData.item.stock || 0) * (kardexData.item.unitCost || 0)).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                      </strong>
                      <span className="block text-gray-500">Costo Unit: ${kardexData.item.unitCost}</span>
                    </div>
                  </div>

                  {/* Tabla de Movimientos */}
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-gray-100 text-gray-600 font-bold uppercase text-[10px] border-b border-gray-200">
                        <tr>
                          <th className="p-3">Fecha / Hora</th>
                          <th className="p-3">Folio / Ref</th>
                          <th className="p-3 text-center">Tipo</th>
                          <th className="p-3">Motivo / Detalle</th>
                          <th className="p-3 text-right">Cantidad</th>
                          <th className="p-3 text-right">Saldo Final</th>
                          <th className="p-3 text-right">Costo Mov.</th>
                          <th className="p-3">Usuario</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 font-mono">
                        {kardexData.movements.map((mov, idx) => {
                          const isPositive = mov.type.includes('ENTRADA') || mov.type.includes('ALTA') || mov.type.includes('INICIAL');
                          return (
                            <tr key={idx} className="hover:bg-indigo-50/20">
                              <td className="p-3 text-gray-500 font-sans text-[11px]">
                                {new Date(mov.createdAt).toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' })}
                              </td>
                              <td className="p-3 font-bold text-[#006EAD]">
                                {mov.reference || `MOV-${mov.id}`}
                              </td>
                              <td className="p-3 text-center">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  isPositive 
                                    ? 'bg-emerald-100 text-emerald-800' 
                                    : 'bg-rose-100 text-rose-800'
                                }`}>
                                  {mov.type.replace('_', ' ')}
                                </span>
                              </td>
                              <td className="p-3 font-sans text-gray-700 max-w-[200px] truncate" title={mov.reason}>
                                {mov.reason || 'Sin justificación'}
                              </td>
                              <td className={`p-3 text-right font-bold text-sm ${isPositive ? 'text-emerald-700' : 'text-rose-700'}`}>
                                {isPositive ? `+${mov.quantity}` : `-${mov.quantity}`} {kardexData.item.unit}
                              </td>
                              <td className="p-3 text-right font-bold text-gray-900 bg-gray-50/60">
                                {mov.newStock} {kardexData.item.unit}
                              </td>
                              <td className="p-3 text-right text-gray-600">
                                ${(mov.quantity * (mov.unitCost || kardexData.item.unitCost || 0)).toFixed(2)}
                              </td>
                              <td className="p-3 font-sans text-gray-500 text-[11px]">
                                {mov.user || 'Sistema'}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center pt-3 border-t">
                <span className="text-xs text-gray-500">
                  {kardexData ? `${kardexData.movements.length} movimientos auditados en Kardex` : ''}
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setKardexModalOpen(false)}
                    className="px-5 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg"
                  >
                    Cerrar Kardex
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Carga Masiva (Batch) de SKUs */}
        {batchModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
              <div className="flex justify-between items-center border-b pb-3">
                <div>
                  <h3 className="text-lg font-bold text-[#0A2540] flex items-center gap-2">
                    <span>📂</span> Importación y Carga Masiva (Batch) de SKUs
                  </h3>
                  <p className="text-xs text-gray-500">Carga múltiples productos e insumos desde un archivo CSV o copiando celdas de Excel</p>
                </div>
                <button onClick={() => setBatchModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl font-bold">✕</button>
              </div>

              <div className="overflow-y-auto space-y-4 flex-1 pr-1">
                {/* Opciones de carga */}
                <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl">
                  <div>
                    <span className="text-xs font-bold text-indigo-950 block">¿No tienes el formato?</span>
                    <span className="text-[11px] text-indigo-700">Descarga la plantilla oficial con ejemplos de columnas</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleDownloadTemplate}
                    className="bg-white hover:bg-indigo-100 text-indigo-700 border border-indigo-300 font-bold px-3 py-1.5 rounded-lg text-xs shadow-sm transition flex items-center gap-1.5"
                  >
                    <span>📥</span> Descargar Plantilla CSV
                  </button>
                </div>

                {/* Subir archivo */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Opción 1: Seleccionar archivo CSV / TXT</label>
                  <input
                    type="file"
                    accept=".csv,.txt"
                    onChange={handleFileUpload}
                    className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 file:cursor-pointer border border-gray-200 rounded-lg p-1.5 bg-gray-50"
                  />
                  {batchFileName && (
                    <span className="text-xs text-indigo-600 font-semibold block mt-1">Archivo cargado: {batchFileName}</span>
                  )}
                </div>

                {/* O pegar texto */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Opción 2: O pega texto copiado de Excel / CSV</label>
                  <textarea
                    rows={4}
                    placeholder="Pega aquí los datos copiados de Excel o texto delimitado por comas / tabulaciones..."
                    value={batchText}
                    onChange={(e) => {
                      setBatchText(e.target.value);
                      parseBatchString(e.target.value);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-xs focus:outline-none focus:border-indigo-600"
                  />
                </div>

                {batchError && (
                  <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 font-semibold">
                    ⚠️ {batchError}
                  </div>
                )}

                {/* Vista previa de datos parseados */}
                {parsedBatchItems.length > 0 && (
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs font-bold text-gray-700 uppercase">
                        Vista Previa: {parsedBatchItems.length} SKUs listos para procesar
                      </span>
                      <span className="text-[11px] text-emerald-600 font-bold">✓ Formato validado</span>
                    </div>
                    <div className="border border-gray-200 rounded-lg overflow-x-auto max-h-48 text-xs">
                      <table className="w-full text-left">
                        <thead className="bg-gray-100 text-gray-600 font-bold uppercase text-[10px] sticky top-0">
                          <tr>
                            <th className="p-2">SKU</th>
                            <th className="p-2">Nombre</th>
                            <th className="p-2">Categoría</th>
                            <th className="p-2 text-right">Stock</th>
                            <th className="p-2 text-right">Mín</th>
                            <th className="p-2">Unidad</th>
                            <th className="p-2 text-right">Costo ($ USD)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 font-mono">
                          {parsedBatchItems.slice(0, 50).map((it, idx) => (
                            <tr key={idx} className="hover:bg-gray-50">
                              <td className="p-2 font-bold text-indigo-700">{it.sku}</td>
                              <td className="p-2 font-sans font-medium text-gray-800 truncate max-w-[150px]">{it.name}</td>
                              <td className="p-2 font-sans">{it.category}</td>
                              <td className="p-2 text-right font-bold">{it.stock}</td>
                              <td className="p-2 text-right text-gray-500">{it.minStock}</td>
                              <td className="p-2">{it.unit}</td>
                              <td className="p-2 text-right">${it.unitCost}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {parsedBatchItems.length > 50 && (
                      <p className="text-[11px] text-gray-400 mt-1 italic">... y {parsedBatchItems.length - 50} productos más.</p>
                    )}
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center pt-3 border-t">
                <span className="text-xs text-gray-500">
                  {parsedBatchItems.length > 0 ? `${parsedBatchItems.length} registros para importar` : 'Sin registros aún'}
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setBatchModalOpen(false)}
                    className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    disabled={parsedBatchItems.length === 0 || isProcessingBatch}
                    onClick={handleBatchSubmit}
                    className="px-5 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-lg shadow-sm transition flex items-center gap-1.5"
                  >
                    {isProcessingBatch ? 'Procesando Lote...' : `Importar ${parsedBatchItems.length} SKUs al Inventario`}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
