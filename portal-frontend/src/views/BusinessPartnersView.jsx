import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BusinessPartnersView = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Todos');
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch('/api/business-partners')
      .then(res => res.json())
      .then(data => {
        setPartners(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching partners:', err);
        setLoading(false);
      });
  }, []);

  const tabs = ['Todos', 'Clientes', 'Proveedores', 'Prospectos', 'Aliados Comerciales'];

  const filteredPartners = activeTab === 'Todos' 
    ? partners 
    : partners.filter(p => {
        if (activeTab === 'Aliados Comerciales') return p.type === 'Aliado Comercial';
        // Remove plural 's' for simple matching
        return p.type === activeTab.slice(0, -1) || p.type === activeTab;
      });

  const handleCreatePartner = (e) => {
    e.preventDefault();
    alert('Simulación: El Socio de Negocio ha sido guardado exitosamente en la base de datos maestra.');
    setIsModalOpen(false);
  };

  if (loading) return <div className="p-10 text-center">Cargando socios de negocio desde la base de datos...</div>;

  return (
    <div className="h-full flex flex-col bg-[#f4f7f9] overflow-hidden">
      
      {/* Top Header */}
      <div className="flex flex-col border-b border-gray-200 px-6 py-4 bg-white sticky top-0 z-10 shrink-0 shadow-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center text-lg text-gray-700">
            <span className="cursor-pointer hover:underline text-[#006EAD]" onClick={() => navigate('/portal')}>Portal</span>
            <span className="mx-2 text-gray-400">/</span>
            <span className="font-bold text-[#0A2540]">NyTEX Business Partners</span>
          </div>
          <div className="flex space-x-3">
            <button className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md text-sm font-semibold transition-colors shadow-sm">
              <i className="fas fa-file-export mr-2"></i>Exportar
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-[#006EAD] hover:bg-[#005587] text-white px-4 py-2 rounded-md text-sm font-bold transition-colors shadow-sm"
            >
              <i className="fas fa-plus mr-2"></i>NUEVO SOCIO
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 text-gray-800">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Header Explanation / Title */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#09A9E8] bg-opacity-10 text-[#006EAD] flex items-center justify-center shrink-0">
              <i className="fas fa-users text-2xl"></i>
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-[#0A2540] mb-2">Base de Datos Maestra Centralizada</h1>
              <p className="text-gray-600 text-sm">
                Gestiona todas las entidades externas (Clientes, Proveedores, Prospectos y Aliados Comerciales). Este módulo es el corazón de las relaciones externas de la empresa y conecta en tiempo real con Ventas, Compras y Contabilidad para evitar duplicidad de datos.
              </p>
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col">
              <span className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Clientes Activos</span>
              <span className="text-3xl font-extrabold text-[#0A2540]">482</span>
              <span className="text-green-500 text-xs font-semibold mt-2"><i className="fas fa-arrow-up mr-1"></i>+12 este mes</span>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col">
              <span className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Cuentas por Cobrar</span>
              <span className="text-3xl font-extrabold text-[#006EAD]">$1.2M</span>
              <span className="text-gray-400 text-xs font-semibold mt-2">Saldo total de clientes</span>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col">
              <span className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Proveedores Aprobados</span>
              <span className="text-3xl font-extrabold text-[#0A2540]">156</span>
              <span className="text-gray-400 text-xs font-semibold mt-2">Con información bancaria verificada</span>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col">
              <span className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Nuevos Prospectos</span>
              <span className="text-3xl font-extrabold text-[#09A9E8]">24</span>
              <span className="text-green-500 text-xs font-semibold mt-2"><i className="fas fa-arrow-up mr-1"></i>En el embudo de ventas</span>
            </div>
          </div>

          {/* Table Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            
            {/* Tabs */}
            <div className="flex border-b border-gray-100 px-4 bg-gray-50/50">
              {tabs.map(tab => (
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
                  placeholder="Buscar socio de negocio..." 
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#09A9E8] focus:border-transparent"
                />
              </div>
              <button className="text-gray-500 hover:text-[#006EAD] p-2">
                <i className="fas fa-filter"></i> Filtros
              </button>
            </div>

            {/* Data Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-y border-gray-100">
                    <th className="px-6 py-3 font-semibold">Código</th>
                    <th className="px-6 py-3 font-semibold">Nombre / Razón Social</th>
                    <th className="px-6 py-3 font-semibold">Tipo</th>
                    <th className="px-6 py-3 font-semibold">Contacto Principal</th>
                    <th className="px-6 py-3 font-semibold text-right">Saldo (USD)</th>
                    <th className="px-6 py-3 font-semibold text-center">Estatus</th>
                    <th className="px-6 py-3 font-semibold text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredPartners.map((partner, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4 text-sm font-medium text-[#006EAD] cursor-pointer hover:underline">{partner.code}</td>
                      <td className="px-6 py-4 text-sm font-bold text-[#0A2540]">{partner.name}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          partner.type === 'Cliente' ? 'bg-blue-50 text-blue-700' :
                          partner.type === 'Proveedor' ? 'bg-orange-50 text-orange-700' :
                          partner.type === 'Prospecto' ? 'bg-purple-50 text-purple-700' :
                          'bg-green-50 text-green-700'
                        }`}>
                          {partner.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-800">{partner.contactName}</div>
                        <div className="text-xs text-gray-500">{partner.email}</div>
                      </td>
                      <td className={`px-6 py-4 text-sm font-bold text-right ${partner.balance < 0 ? 'text-red-600' : 'text-gray-800'}`}>
                        ${partner.balance ? partner.balance.toLocaleString() : '0'}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          partner.status === 'Activo' ? 'bg-green-100 text-green-800' :
                          partner.status === 'Bloqueado' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {partner.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-gray-400">
                        <button className="hover:text-[#006EAD] mx-1"><i className="fas fa-edit"></i></button>
                        <button className="hover:text-[#006EAD] mx-1"><i className="fas fa-ellipsis-v"></i></button>
                      </td>
                    </tr>
                  ))}
                  {filteredPartners.length === 0 && (
                    <tr>
                      <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                        No se encontraron registros en esta categoría.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
              <div>Mostrando {filteredPartners.length} de {filteredPartners.length} registros</div>
              <div className="flex space-x-1">
                <button className="px-3 py-1 border border-gray-200 rounded text-gray-400 cursor-not-allowed">Anterior</button>
                <button className="px-3 py-1 border border-gray-200 bg-[#006EAD] text-white rounded font-bold">1</button>
                <button className="px-3 py-1 border border-gray-200 rounded text-gray-400 cursor-not-allowed">Siguiente</button>
              </div>
            </div>

          </div>

        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-lg">
              <h3 className="text-xl font-bold text-[#0A2540]">Crear Nuevo Socio de Negocio</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            
            <form onSubmit={handleCreatePartner} className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">CÓDIGO BP *</label>
                  <input type="text" className="w-full border rounded p-2 text-sm focus:ring-[#006EAD]" defaultValue={`BP-00${partners.length + 1}`} required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">TIPO DE SOCIO *</label>
                  <select className="w-full border rounded p-2 text-sm focus:ring-[#006EAD]" required>
                    <option value="Cliente">Cliente</option>
                    <option value="Proveedor">Proveedor</option>
                    <option value="Prospecto">Prospecto</option>
                    <option value="Aliado Comercial">Aliado Comercial</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-xs font-bold text-gray-500 mb-1">NOMBRE / RAZÓN SOCIAL *</label>
                <input type="text" className="w-full border rounded p-2 text-sm focus:ring-[#006EAD]" placeholder="Ej. Corporativo XYZ S.A. de C.V." required />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">IDENTIFICACIÓN FISCAL (RFC / NIT)</label>
                  <input type="text" className="w-full border rounded p-2 text-sm focus:ring-[#006EAD]" placeholder="Ej. ABC123456T78" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">TÉRMINOS DE PAGO</label>
                  <select className="w-full border rounded p-2 text-sm focus:ring-[#006EAD]">
                    <option value="Contado">Contado</option>
                    <option value="Neto 15">Neto 15 días</option>
                    <option value="Neto 30">Neto 30 días</option>
                    <option value="Neto 60">Neto 60 días</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">CONTACTO PRINCIPAL</label>
                  <input type="text" className="w-full border rounded p-2 text-sm focus:ring-[#006EAD]" placeholder="Nombre del contacto" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">CORREO ELECTRÓNICO</label>
                  <input type="email" className="w-full border rounded p-2 text-sm focus:ring-[#006EAD]" placeholder="correo@empresa.com" />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-xs font-bold text-gray-500 mb-1">DIRECCIÓN COMPLETA</label>
                <input type="text" className="w-full border rounded p-2 text-sm focus:ring-[#006EAD]" placeholder="Calle, Número, Colonia, Ciudad, País" />
              </div>
              
              <div className="mb-4">
                <label className="block text-xs font-bold text-gray-500 mb-1">NOTAS</label>
                <textarea className="w-full border rounded p-2 text-sm focus:ring-[#006EAD] h-20" placeholder="Comentarios adicionales..."></textarea>
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded font-semibold text-gray-600 hover:bg-gray-50">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-[#15A36A] hover:bg-[#108253] text-white rounded font-bold shadow-sm">Guardar Socio</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default BusinessPartnersView;
