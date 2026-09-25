import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const dummyOrders = [
  { id: 'SO-2023-001', customer: 'Industrias Apex', date: '2026-09-24', total: '$15,400.00', status: 'Facturado' },
  { id: 'SO-2023-002', customer: 'TechSolutions S.A.', date: '2026-09-22', total: '$3,250.50', status: 'En Proceso' },
  { id: 'SO-2023-003', customer: 'Comercializadora del Sur', date: '2026-09-20', total: '$890.00', status: 'Pendiente' },
  { id: 'SO-2023-004', customer: 'Logistics Pro', date: '2026-09-18', total: '$12,000.00', status: 'Cancelado' },
  { id: 'SO-2023-005', customer: 'Grupo Inmobiliario', date: '2026-09-15', total: '$45,000.00', status: 'Facturado' },
];

export default function Ventas() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Órdenes de Venta');

  const getStatusColor = (status) => {
    switch(status) {
      case 'Facturado': return 'bg-green-100 text-green-800';
      case 'En Proceso': return 'bg-blue-100 text-blue-800';
      case 'Pendiente': return 'bg-yellow-100 text-yellow-800';
      case 'Cancelado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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
            <span className="font-bold text-[#0A2540]">NyTEX Ventas</span>
          </div>
          <div className="flex space-x-3">
            <button className="bg-[#006EAD] hover:bg-[#005587] text-white px-4 py-2 rounded-md text-sm font-bold transition-colors shadow-sm">
              <i className="fas fa-plus mr-2"></i>CREAR ORDEN
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 text-gray-800 w-full">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center justify-between">
              <div>
                <span className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Ventas del Mes</span>
                <span className="block text-3xl font-extrabold text-[#0A2540]">$124,500</span>
              </div>
              <div className="w-12 h-12 bg-green-50 text-green-500 rounded-full flex items-center justify-center text-xl">
                <i className="fas fa-chart-bar"></i>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center justify-between">
              <div>
                <span className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Órdenes Pendientes</span>
                <span className="block text-3xl font-extrabold text-[#006EAD]">12</span>
              </div>
              <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center text-xl">
                <i className="fas fa-file-invoice-dollar"></i>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center justify-between">
              <div>
                <span className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Cotizaciones Abiertas</span>
                <span className="block text-3xl font-extrabold text-[#09A9E8]">28</span>
              </div>
              <div className="w-12 h-12 bg-cyan-50 text-cyan-500 rounded-full flex items-center justify-center text-xl">
                <i className="fas fa-file-signature"></i>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            
            {/* Tabs */}
            <div className="flex border-b border-gray-100 px-4 bg-gray-50/50">
              {['Cotizaciones', 'Órdenes de Venta', 'Facturas', 'Notas de Crédito'].map(tab => (
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
                  placeholder="Buscar documento..." 
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#09A9E8] focus:border-transparent"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-y border-gray-100">
                    <th className="px-6 py-3 font-semibold">Documento</th>
                    <th className="px-6 py-3 font-semibold">Cliente</th>
                    <th className="px-6 py-3 font-semibold">Fecha</th>
                    <th className="px-6 py-3 font-semibold text-right">Total</th>
                    <th className="px-6 py-3 font-semibold text-center">Estatus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {activeTab === 'Órdenes de Venta' ? (
                    dummyOrders.map((order, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-bold text-[#006EAD] cursor-pointer hover:underline">{order.id}</td>
                        <td className="px-6 py-4 text-sm font-bold text-[#0A2540]">{order.customer}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{order.date}</td>
                        <td className="px-6 py-4 text-sm font-extrabold text-gray-800 text-right">{order.total}</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                        No hay registros para {activeTab}.
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
}