import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const dummyProducts = [
  { id: 'LAP-001', name: 'Laptop Pro 15"', category: 'Electrónica', stock: 45, reserved: 5, warehouse: 'Bodega Principal', location: 'A1-01', price: '$1,299.00', status: 'Óptimo' },
  { id: 'MON-27', name: 'Monitor 27" 4K', category: 'Electrónica', stock: 2, reserved: 2, warehouse: 'Bodega Principal', location: 'A2-05', price: '$349.00', status: 'Bajo Stock' },
  { id: 'KB-MEC', name: 'Teclado Mecánico', category: 'Accesorios', stock: 120, reserved: 10, warehouse: 'Bodega Secundaria', location: 'B1-12', price: '$89.00', status: 'Óptimo' },
  { id: 'SVR-09', name: 'Servidor Rack 1U', category: 'Redes', stock: 0, reserved: 0, warehouse: 'Bodega Principal', location: 'C3-01', price: '$2,450.00', status: 'Agotado' },
];

const InventoryView = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Existencias');

  const getStatusColor = (status) => {
    switch(status) {
      case 'Óptimo': return 'bg-green-100 text-green-800';
      case 'Bajo Stock': return 'bg-yellow-100 text-yellow-800';
      case 'Agotado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#f4f7f9] overflow-hidden w-full">
      
      {/* Header */}
      <div className="flex flex-col border-b border-gray-200 px-6 py-4 bg-white sticky top-0 z-10 shrink-0 shadow-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center text-lg text-gray-700">
            <span className="cursor-pointer hover:underline text-[#006EAD]" onClick={() => navigate('/portal')}>Portal</span>
            <span className="mx-2 text-gray-400">/</span>
            <span className="font-bold text-[#0A2540]">NyTEX Inventario (WMS)</span>
          </div>
          <div className="flex space-x-3">
            <button className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md text-sm font-semibold transition-colors shadow-sm">
              <i className="fas fa-barcode mr-2"></i>Escanear
            </button>
            <button className="bg-[#006EAD] hover:bg-[#005587] text-white px-4 py-2 rounded-md text-sm font-bold transition-colors shadow-sm">
              <i className="fas fa-plus mr-2"></i>NUEVO PRODUCTO
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 text-gray-800">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col">
              <span className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Valor de Inventario</span>
              <span className="text-3xl font-extrabold text-[#0A2540]">$1.4M</span>
              <span className="text-green-500 text-xs font-semibold mt-2">Costo total de existencias</span>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col">
              <span className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Items Agotados</span>
              <span className="text-3xl font-extrabold text-red-600">14</span>
              <span className="text-red-500 text-xs font-semibold mt-2">Requieren reabastecimiento</span>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col">
              <span className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Movimientos Hoy</span>
              <span className="text-3xl font-extrabold text-[#006EAD]">128</span>
              <span className="text-gray-400 text-xs font-semibold mt-2">Entradas y Salidas</span>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col">
              <span className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Capacidad Bodega</span>
              <span className="text-3xl font-extrabold text-[#09A9E8]">76%</span>
              <span className="text-gray-400 text-xs font-semibold mt-2">Bodega Principal</span>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            
            {/* Tabs */}
            <div className="flex border-b border-gray-100 px-4 bg-gray-50/50">
              {['Existencias', 'Movimientos', 'Bodegas', 'Reglas de Abastecimiento'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors ${
                    activeTab === tab 
                      ? 'border-[#006EAD] text-[#006EAD]' 
                      : 'border-transparent text-gray-500 hover:text-gray-800'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Toolbar */}
            <div className="p-4 flex justify-between items-center bg-white border-b border-gray-50">
              <div className="relative w-72">
                <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <input 
                  type="text" 
                  placeholder="Buscar producto o SKU..." 
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#09A9E8] focus:border-transparent"
                />
              </div>
              <div className="flex space-x-2">
                <button className="text-gray-500 hover:text-[#006EAD] p-2 text-sm"><i className="fas fa-filter"></i> Filtros</button>
                <button className="text-gray-500 hover:text-[#006EAD] p-2 text-sm"><i className="fas fa-layer-group"></i> Agrupar</button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-y border-gray-100">
                    <th className="px-6 py-3 font-semibold">SKU / Producto</th>
                    <th className="px-6 py-3 font-semibold">Ubicación</th>
                    <th className="px-6 py-3 font-semibold text-right">A Mano</th>
                    <th className="px-6 py-3 font-semibold text-right">Reservado</th>
                    <th className="px-6 py-3 font-semibold text-right">Disponible</th>
                    <th className="px-6 py-3 font-semibold text-center">Estatus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {activeTab === 'Existencias' ? (
                    dummyProducts.map((prod, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="text-sm font-bold text-[#006EAD]">{prod.id}</div>
                          <div className="text-sm font-semibold text-[#0A2540]">{prod.name}</div>
                          <div className="text-xs text-gray-500">{prod.category}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-800">{prod.warehouse}</div>
                          <div className="text-xs text-gray-500 font-mono"><i className="fas fa-map-marker-alt mr-1 text-red-400"></i>{prod.location}</div>
                        </td>
                        <td className="px-6 py-4 text-sm font-extrabold text-gray-800 text-right">{prod.stock}</td>
                        <td className="px-6 py-4 text-sm font-bold text-orange-600 text-right">{prod.reserved}</td>
                        <td className="px-6 py-4 text-sm font-extrabold text-green-600 text-right">{prod.stock - prod.reserved}</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(prod.status)}`}>
                            {prod.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                        Selecciona 'Existencias' para ver el inventario.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryView;
