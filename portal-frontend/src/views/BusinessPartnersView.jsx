import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BusinessPartnersView = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Todos');
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionMessage, setActionMessage] = useState('');

  // Modal Crear / Editar
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    type: 'Proveedor',
    taxId: '',
    paymentTerms: 'Neto 30 días',
    creditLimit: 50000,
    contactName: '',
    email: '',
    phone: '',
    address: '',
    bankName: 'Banco Corporativo Principal',
    bankAccount: '',
    bankClabe: '',
    bankSwift: 'BBVAMXMM',
    status: 'Activo',
    notes: ''
  });

  // Modal Historial Comercial & Financiero
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [selectedHistoryPartner, setSelectedHistoryPartner] = useState(null);
  const [historyData, setHistoryData] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);

  const fetchPartners = () => {
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
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const tabs = ['Todos', 'Clientes', 'Proveedores', 'Prospectos', 'Aliados Comerciales'];

  const filteredPartners = partners.filter(p => {
    // Filtro por pestaña
    let matchesTab = true;
    if (activeTab === 'Aliados Comerciales') matchesTab = p.type === 'Aliado Comercial';
    else if (activeTab !== 'Todos') matchesTab = p.type === activeTab.slice(0, -1) || p.type === activeTab;

    // Filtro por búsqueda
    if (!matchesTab) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (p.code && p.code.toLowerCase().includes(q)) ||
      (p.name && p.name.toLowerCase().includes(q)) ||
      (p.taxId && p.taxId.toLowerCase().includes(q)) ||
      (p.bankName && p.bankName.toLowerCase().includes(q)) ||
      (p.contactName && p.contactName.toLowerCase().includes(q))
    );
  });

  const openCreateModal = () => {
    setEditingPartner(null);
    const nextNum = partners.length + 1;
    setFormData({
      code: `BP-00${nextNum}`,
      name: '',
      type: activeTab === 'Proveedores' ? 'Proveedor' : activeTab === 'Clientes' ? 'Cliente' : 'Proveedor',
      taxId: '0614-180612-102-4',
      paymentTerms: 'Neto 30 días',
      creditLimit: 50000,
      contactName: '',
      email: '',
      phone: '',
      address: '',
      bankName: 'BBVA Corporativo',
      bankAccount: '0129-4820-9912',
      bankClabe: '012180001294820991',
      bankSwift: 'BBVAMXMM',
      status: 'Activo',
      notes: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (partner) => {
    setEditingPartner(partner);
    setFormData({
      code: partner.code,
      name: partner.name,
      type: partner.type,
      taxId: partner.taxId || '',
      paymentTerms: partner.paymentTerms || 'Neto 30 días',
      creditLimit: partner.creditLimit || 50000,
      contactName: partner.contactName || '',
      email: partner.email || '',
      phone: partner.phone || '',
      address: partner.address || '',
      bankName: partner.bankName || 'Banco Corporativo Principal',
      bankAccount: partner.bankAccount || '',
      bankClabe: partner.bankClabe || '',
      bankSwift: partner.bankSwift || 'BBVAMXMM',
      status: partner.status || 'Activo',
      notes: partner.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleSavePartner = async (e) => {
    e.preventDefault();
    try {
      const isEdit = !!editingPartner;
      const url = isEdit ? `/api/business-partners/${editingPartner.code}` : '/api/business-partners';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setActionMessage(isEdit 
          ? `Socio ${formData.code} (${formData.name}) actualizado con sus datos bancarios y línea de crédito.`
          : `Nuevo socio ${formData.code} registrado exitosamente en la base de datos maestra.`
        );
        setTimeout(() => setActionMessage(''), 7000);
        setIsModalOpen(false);
        fetchPartners();
      } else {
        const data = await res.json();
        alert(data.error || 'Error al guardar el socio de negocio');
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión con el servidor');
    }
  };

  const openHistoryModal = async (partner) => {
    setSelectedHistoryPartner(partner);
    setIsHistoryOpen(true);
    setHistoryLoading(true);
    try {
      const res = await fetch(`/api/business-partners/${partner.code}/history`);
      if (res.ok) {
        const data = await res.json();
        setHistoryData(data);
      } else {
        setHistoryData(null);
      }
    } catch (err) {
      console.error('Error fetching history:', err);
      setHistoryData(null);
    } finally {
      setHistoryLoading(false);
    }
  };

  const totalClients = partners.filter(p => p.type === 'Cliente').length;
  const totalVendors = partners.filter(p => p.type === 'Proveedor').length;
  const totalCreditOffered = partners.reduce((sum, p) => sum + (p.creditLimit || 0), 0);

  if (loading) return <div className="p-10 text-center font-bold text-gray-500">Cargando base de datos maestra centralizada...</div>;

  return (
    <div className="h-full flex flex-col bg-[#f4f7f9] overflow-hidden">
      
      {/* Top Header */}
      <div className="flex flex-col border-b border-gray-200 px-6 py-4 bg-white sticky top-0 z-10 shrink-0 shadow-sm">
        <div className="flex justify-between items-center flex-wrap gap-3">
          <div className="flex items-center text-lg text-gray-700">
            <span className="cursor-pointer hover:underline text-[#006EAD]" onClick={() => navigate('/portal')}>Portal</span>
            <span className="mx-2 text-gray-400">/</span>
            <span className="font-bold text-[#0A2540] flex items-center gap-2">
              <span className="px-2 py-0.5 text-xs bg-blue-100 text-[#006EAD] font-bold rounded">Módulo [6 / 23]</span>
              NyTEX Business Partners (Directorio Maestro Centralizado)
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => navigate('/app/cxp')}
              className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-md text-xs font-semibold transition shadow-sm"
            >
              Ir a CxP [9]
            </button>
            <button 
              onClick={() => navigate('/app/compras')}
              className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-md text-xs font-semibold transition shadow-sm"
            >
              Ir a Compras [3]
            </button>
            <button 
              onClick={openCreateModal}
              className="bg-[#006EAD] hover:bg-[#005587] text-white px-4 py-2 rounded-md text-sm font-bold transition shadow-sm flex items-center gap-1.5"
            >
              <span>+</span> NUEVO SOCIO
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 text-gray-800">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Banner de Mensajes */}
          {actionMessage && (
            <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-r-lg shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">✅</span>
                <p className="text-sm font-bold text-emerald-900">{actionMessage}</p>
              </div>
              <button onClick={() => setActionMessage('')} className="text-emerald-700 hover:text-emerald-900 text-xs font-bold">✕ Cerrar</button>
            </div>
          )}

          {/* Header Explanation / Title */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#09A9E8]/10 text-[#006EAD] flex items-center justify-center shrink-0 text-2xl font-bold">
              👥
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-[#0A2540] mb-1">Base de Datos Maestra Centralizada</h1>
              <p className="text-gray-600 text-sm leading-relaxed">
                Gestiona todas las entidades externas (Clientes, Proveedores, Fleteros y Aliados). Ahora incluye la consulta y mantenimiento de <strong>Líneas de Crédito Autorizadas</strong>, <strong>Datos Bancarios para Dispersión</strong> (CLABE/SWIFT) e <strong>Historial Comercial & Financiero</strong> integrado con Compras, Ventas, CxP y CxC.
              </p>
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col justify-between">
              <div>
                <span className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1 block">Clientes en Catálogo</span>
                <span className="text-3xl font-extrabold text-[#0A2540]">{totalClients}</span>
              </div>
              <span className="text-emerald-600 text-xs font-semibold mt-2">✓ Carteras de crédito activas</span>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col justify-between">
              <div>
                <span className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1 block">Proveedores Registrados</span>
                <span className="text-3xl font-extrabold text-[#006EAD]">{totalVendors}</span>
              </div>
              <span className="text-gray-500 text-xs font-semibold mt-2">💳 Con datos bancarios asignados</span>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col justify-between">
              <div>
                <span className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1 block">Línea de Crédito Total</span>
                <span className="text-3xl font-extrabold text-[#0A2540] font-mono">
                  ${totalCreditOffered.toLocaleString('es-MX')}
                </span>
              </div>
              <span className="text-blue-600 text-xs font-semibold mt-2">Límite comercial autorizado</span>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col justify-between">
              <div>
                <span className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1 block">Total Entidades BP</span>
                <span className="text-3xl font-extrabold text-[#09A9E8]">{partners.length}</span>
              </div>
              <span className="text-gray-500 text-xs font-semibold mt-2">En base de datos unificada</span>
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
            <div className="p-4 flex flex-wrap justify-between items-center bg-white border-b border-gray-50 gap-3">
              <div className="relative w-80">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por código, nombre, banco o Tax ID..." 
                  className="w-full pl-3 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#006EAD]"
                />
              </div>
              <div className="text-xs text-gray-500">
                Mostrando <strong className="text-gray-800">{filteredPartners.length}</strong> socios de negocio
              </div>
            </div>

            {/* Data Table con Línea de Crédito, Datos Bancarios e Historial */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-y border-gray-100">
                    <th className="px-5 py-3.5 font-bold">Código</th>
                    <th className="px-5 py-3.5 font-bold">Nombre / Razón Social</th>
                    <th className="px-5 py-3.5 font-bold">Tipo</th>
                    <th className="px-5 py-3.5 font-bold">Línea de Crédito</th>
                    <th className="px-5 py-3.5 font-bold">Datos Bancarios</th>
                    <th className="px-5 py-3.5 font-bold">Contacto</th>
                    <th className="px-5 py-3.5 font-bold text-right">Saldo Vivo</th>
                    <th className="px-5 py-3.5 font-bold text-center">Estatus</th>
                    <th className="px-5 py-3.5 font-bold text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredPartners.map((partner) => {
                    const credit = partner.creditLimit || 50000;
                    const bal = Math.abs(partner.balance || 0);
                    const available = Math.max(0, credit - bal);

                    return (
                      <tr key={partner.code} className="hover:bg-blue-50/20 transition-colors group">
                        <td className="px-5 py-4 font-mono font-bold text-[#006EAD]">
                          {partner.code}
                        </td>
                        <td className="px-5 py-4">
                          <div className="font-bold text-[#0A2540]">{partner.name}</div>
                          <div className="text-xs text-gray-400 font-mono">Tax ID: {partner.taxId || 'RFC-GENERICO'}</div>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            partner.type === 'Cliente' ? 'bg-blue-100 text-blue-800' :
                            partner.type === 'Proveedor' ? 'bg-orange-100 text-orange-800' :
                            partner.type === 'Prospecto' ? 'bg-purple-100 text-purple-800' :
                            'bg-emerald-100 text-emerald-800'
                          }`}>
                            {partner.type}
                          </span>
                        </td>
                        {/* Columna: Línea de Crédito */}
                        <td className="px-5 py-4">
                          <div className="font-mono font-bold text-gray-900">
                            ${credit.toLocaleString('es-MX')} USD
                          </div>
                          <div className="text-[11px] text-gray-500">
                            Disp: <span className="font-bold text-emerald-700 font-mono">${available.toLocaleString('es-MX')}</span>
                          </div>
                          <div className="text-[10px] text-gray-400">
                            Plazo: {partner.paymentTerms || 'Neto 30 días'}
                          </div>
                        </td>
                        {/* Columna: Datos Bancarios del Proveedor/Socio */}
                        <td className="px-5 py-4">
                          <div className="font-semibold text-gray-800 flex items-center gap-1 text-xs">
                            <span>🏦</span> {partner.bankName || 'BBVA Corporativo'}
                          </div>
                          <div className="text-xs font-mono text-gray-500 mt-0.5">
                            Cta: {partner.bankAccount || '0129-4820-9912'}
                          </div>
                          <div className="text-[10px] font-mono text-gray-400">
                            CLABE: {partner.bankClabe || '012180001294820991'}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="font-medium text-gray-800 text-xs">{partner.contactName || 'No asignado'}</div>
                          <div className="text-xs text-gray-400">{partner.email || '-'}</div>
                        </td>
                        <td className={`px-5 py-4 text-sm font-mono font-bold text-right ${partner.balance < 0 ? 'text-red-600' : partner.balance > 0 ? 'text-emerald-700' : 'text-gray-600'}`}>
                          ${(partner.balance || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-5 py-4 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            partner.status === 'Activo' ? 'bg-green-100 text-green-800' :
                            partner.status === 'Bloqueado' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {partner.status || 'Activo'}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button 
                              onClick={() => openHistoryModal(partner)}
                              title="Ver Historial Comercial & Financiero"
                              className="px-2.5 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-[#0A2540] font-bold rounded flex items-center gap-1 shadow-sm transition"
                            >
                              <span>📜</span> Historial
                            </button>
                            <button 
                              onClick={() => openEditModal(partner)}
                              title="Editar Socio, Bancos y Crédito"
                              className="px-2.5 py-1.5 text-xs bg-blue-50 hover:bg-blue-100 text-[#006EAD] font-bold rounded flex items-center gap-1 shadow-sm transition"
                            >
                              <span>✏️</span> Editar
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredPartners.length === 0 && (
                    <tr>
                      <td colSpan="9" className="px-6 py-8 text-center text-gray-400">
                        No se encontraron registros en esta categoría o filtro de búsqueda.
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

      {/* ======================================================== */}
      {/* MODAL CREAR / EDITAR SOCIO (CON BANCOS Y LÍNEA DE CRÉDITO) */}
      {/* ======================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col max-h-[90vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-[#0A2540] text-white">
              <div>
                <h3 className="text-lg font-bold">
                  {editingPartner ? `Editar Socio de Negocio: ${editingPartner.code}` : 'Registrar Nuevo Socio de Negocio'}
                </h3>
                <p className="text-xs text-blue-200">Base de Datos Maestra Centralizada | Directorio NyTEX</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-white hover:text-gray-300 text-xl font-bold">✕</button>
            </div>
            
            <form onSubmit={handleSavePartner} className="p-6 overflow-y-auto space-y-6 text-sm">
              
              {/* Sección 1: Datos Generales */}
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5 border-b pb-1">
                  <span>🏢</span> Identificación y Clasificación
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">CÓDIGO BP *</label>
                    <input 
                      type="text" 
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      disabled={!!editingPartner}
                      className="w-full border rounded-lg p-2 text-sm font-mono font-bold bg-gray-50" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">TIPO DE SOCIO *</label>
                    <select 
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#006EAD]" 
                      required
                    >
                      <option value="Proveedor">Proveedor</option>
                      <option value="Cliente">Cliente</option>
                      <option value="Prospecto">Prospecto</option>
                      <option value="Aliado Comercial">Aliado Comercial</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">IDENTIFICACIÓN FISCAL (Tax ID / NIT)</label>
                    <input 
                      type="text" 
                      value={formData.taxId}
                      onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                      placeholder="Ej. 0614-180612-102-4"
                      className="w-full border border-gray-300 rounded-lg p-2 text-sm font-mono" 
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <label className="block text-xs font-bold text-gray-700 mb-1">NOMBRE / RAZÓN SOCIAL *</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ej. Suministros Industriales Globales S.A." 
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm font-bold text-[#0A2540]" 
                    required 
                  />
                </div>
              </div>

              {/* Sección 2: Condiciones Comerciales y Línea de Crédito */}
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5 border-b pb-1">
                  <span>📈</span> Línea de Crédito & Plazos Comerciales
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">LÍNEA DE CRÉDITO AUTORIZADA ($ USD)</label>
                    <input 
                      type="number" 
                      step="1000"
                      min="0"
                      value={formData.creditLimit}
                      onChange={(e) => setFormData({ ...formData, creditLimit: parseFloat(e.target.value) || 0 })}
                      className="w-full border border-gray-300 rounded-lg p-2 text-sm font-mono font-bold text-blue-900" 
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">TÉRMINOS DE PAGO / CRÉDITO</label>
                    <select 
                      value={formData.paymentTerms}
                      onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                    >
                      <option value="Contado">Contado</option>
                      <option value="Neto 15 días">Neto 15 días</option>
                      <option value="Neto 30 días">Neto 30 días</option>
                      <option value="Neto 45 días">Neto 45 días</option>
                      <option value="Neto 60 días">Neto 60 días</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">ESTATUS OPERATIVO</label>
                    <select 
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg p-2 text-sm font-semibold"
                    >
                      <option value="Activo">Activo (Habilitado)</option>
                      <option value="Bloqueado">Bloqueado (Sin Crédito)</option>
                      <option value="En Revisión">En Revisión</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Sección 3: Datos Bancarios del Proveedor / Socio */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <h4 className="text-xs font-bold text-[#006EAD] uppercase tracking-wider flex items-center gap-1.5">
                  <span>🏦</span> Datos Bancarios Oficiales para Dispersión / Transferencias
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">BANCO RECEPTOR</label>
                    <input 
                      type="text" 
                      value={formData.bankName}
                      onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                      placeholder="Ej. Banco Corporativo Principal, Banorte, Santander"
                      className="w-full border border-gray-300 rounded-lg p-2 text-sm bg-white" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">NÚMERO DE CUENTA</label>
                    <input 
                      type="text" 
                      value={formData.bankAccount}
                      onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
                      placeholder="Ej. 0129-4820-9912"
                      className="w-full border border-gray-300 rounded-lg p-2 text-sm font-mono bg-white" 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">CLABE INTERBANCARIA (18 DÍGITOS)</label>
                    <input 
                      type="text" 
                      value={formData.bankClabe}
                      onChange={(e) => setFormData({ ...formData, bankClabe: e.target.value })}
                      placeholder="Ej. 012180001294820991"
                      maxLength={18}
                      className="w-full border border-gray-300 rounded-lg p-2 text-sm font-mono bg-white" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">CÓDIGO SWIFT / BIC (INTERNACIONAL)</label>
                    <input 
                      type="text" 
                      value={formData.bankSwift}
                      onChange={(e) => setFormData({ ...formData, bankSwift: e.target.value })}
                      placeholder="Ej. BBVAMXMM"
                      className="w-full border border-gray-300 rounded-lg p-2 text-sm font-mono bg-white" 
                    />
                  </div>
                </div>
              </div>

              {/* Sección 4: Contacto y Ubicación */}
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5 border-b pb-1">
                  <span>📍</span> Contacto & Dirección
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">CONTACTO PRINCIPAL</label>
                    <input 
                      type="text" 
                      value={formData.contactName}
                      onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                      placeholder="Nombre del ejecutivo o contacto"
                      className="w-full border border-gray-300 rounded-lg p-2 text-sm" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">CORREO ELECTRÓNICO</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="contacto@empresa.com"
                      className="w-full border border-gray-300 rounded-lg p-2 text-sm" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">TELÉFONO DE CONTACTO</label>
                    <input 
                      type="text" 
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+52 81 8123 4567"
                      className="w-full border border-gray-300 rounded-lg p-2 text-sm" 
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <label className="block text-xs font-bold text-gray-700 mb-1">DIRECCIÓN COMPLETA</label>
                  <input 
                    type="text" 
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Calle, Número, Parque Industrial, Ciudad, Estado, País" 
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm" 
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="px-4 py-2 border rounded-lg font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-[#006EAD] hover:bg-[#005587] text-white rounded-lg font-bold shadow-sm transition"
                >
                  {editingPartner ? 'Guardar Cambios' : 'Registrar Socio'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL HISTORIAL COMERCIAL & FINANCIERO */}
      {/* ======================================================== */}
      {isHistoryOpen && selectedHistoryPartner && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col max-h-[90vh] overflow-hidden">
            
            {/* Header Modal */}
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-[#0A2540] text-white">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📜</span>
                <div>
                  <h3 className="text-lg font-bold">
                    Historial Comercial & Financiero - {selectedHistoryPartner.name}
                  </h3>
                  <p className="text-xs text-blue-200 font-mono">
                    Código: {selectedHistoryPartner.code} | Tipo: {selectedHistoryPartner.type} | Tax ID: {selectedHistoryPartner.taxId || 'RFC-GENERICO'}
                  </p>
                </div>
              </div>
              <button onClick={() => setIsHistoryOpen(false)} className="text-white hover:text-gray-300 text-xl font-bold">✕</button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-sm">
              
              {/* Tarjetas KPI de Resumen del Socio */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                  <span className="text-[10px] font-bold uppercase text-blue-800 block">Línea de Crédito</span>
                  <span className="text-lg font-extrabold text-[#0A2540] font-mono">
                    ${(selectedHistoryPartner.creditLimit || 50000).toLocaleString('es-MX')} USD
                  </span>
                  <span className="text-[10px] text-gray-500 block">Plazo: {selectedHistoryPartner.paymentTerms || 'Neto 30 días'}</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-[10px] font-bold uppercase text-gray-600 block">Saldo Vivo Actual</span>
                  <span className={`text-lg font-extrabold font-mono ${selectedHistoryPartner.balance < 0 ? 'text-red-600' : 'text-emerald-700'}`}>
                    ${(selectedHistoryPartner.balance || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-[10px] text-gray-400 block">En libros contables</span>
                </div>
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <span className="text-[10px] font-bold uppercase text-emerald-800 block">Crédito Disponible</span>
                  <span className="text-lg font-extrabold text-emerald-700 font-mono">
                    ${Math.max(0, (selectedHistoryPartner.creditLimit || 50000) - Math.abs(selectedHistoryPartner.balance || 0)).toLocaleString('es-MX')} USD
                  </span>
                  <span className="text-[10px] text-emerald-600 block">Capacidad operativa</span>
                </div>
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                  <span className="text-[10px] font-bold uppercase text-amber-800 block">Datos Bancarios</span>
                  <span className="text-xs font-bold text-gray-800 block">{selectedHistoryPartner.bankName || 'Banco Corporativo Principal'}</span>
                  <span className="text-[10px] font-mono text-gray-500 block truncate">CLABE: {selectedHistoryPartner.bankClabe || '012180001294820991'}</span>
                </div>
              </div>

              {historyLoading ? (
                <div className="p-8 text-center text-gray-400">Consultando historial en Compras, Ventas, CxP y CxC...</div>
              ) : (
                <div className="space-y-6">
                  
                  {/* Bloque: Órdenes Comerciales (Compras o Ventas) */}
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2.5 border-b font-bold text-xs uppercase text-gray-700 flex justify-between items-center">
                      <span>📦 {selectedHistoryPartner.type === 'Proveedor' ? 'Órdenes de Compra (OC)' : 'Pedidos y Órdenes de Venta'}</span>
                      <span className="text-gray-400 font-normal">
                        Total registros: {(historyData?.purchases?.length || 0) + (historyData?.sales?.length || 0)}
                      </span>
                    </div>
                    <div className="overflow-x-auto max-h-48 overflow-y-auto">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-gray-100 text-gray-500 uppercase font-semibold">
                          <tr>
                            <th className="px-4 py-2">Folio Orden</th>
                            <th className="px-4 py-2">Fecha / Concepto</th>
                            <th className="px-4 py-2 text-right">Total ($ USD)</th>
                            <th className="px-4 py-2 text-center">Estado</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {selectedHistoryPartner.type === 'Proveedor' ? (
                            historyData?.purchases && historyData.purchases.length > 0 ? (
                              historyData.purchases.map(po => (
                                <tr key={po.id} className="hover:bg-gray-50">
                                  <td className="px-4 py-2 font-mono font-bold text-orange-700">{po.poCode}</td>
                                  <td className="px-4 py-2 text-gray-600">Recepción / Abastecimiento</td>
                                  <td className="px-4 py-2 text-right font-mono font-bold">${po.total?.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                                  <td className="px-4 py-2 text-center">
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">{po.status}</span>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr><td colSpan="4" className="text-center py-4 text-gray-400">Sin órdenes de compra registradas aún con este código de proveedor.</td></tr>
                            )
                          ) : (
                            historyData?.sales && historyData.sales.length > 0 ? (
                              historyData.sales.map(so => (
                                <tr key={so.id} className="hover:bg-gray-50">
                                  <td className="px-4 py-2 font-mono font-bold text-blue-700">{so.orderCode}</td>
                                  <td className="px-4 py-2 text-gray-600">Pedido Comercial</td>
                                  <td className="px-4 py-2 text-right font-mono font-bold">${so.total?.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                                  <td className="px-4 py-2 text-center">
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">{so.status}</span>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr><td colSpan="4" className="text-center py-4 text-gray-400">Sin pedidos de venta registrados aún con este código de cliente.</td></tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Bloque: Facturación y Cartera (CxP o CxC) */}
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2.5 border-b font-bold text-xs uppercase text-gray-700 flex justify-between items-center">
                      <span>💳 {selectedHistoryPartner.type === 'Proveedor' ? 'Facturas por Pagar (Módulo [9] CxP)' : 'Facturas por Cobrar (Módulo [8] CxC)'}</span>
                      <span className="text-gray-400 font-normal">
                        Total documentos: {(historyData?.payables?.length || 0) + (historyData?.receivables?.length || 0)}
                      </span>
                    </div>
                    <div className="overflow-x-auto max-h-48 overflow-y-auto">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-gray-100 text-gray-500 uppercase font-semibold">
                          <tr>
                            <th className="px-4 py-2">Folio Documento</th>
                            <th className="px-4 py-2">Vencimiento</th>
                            <th className="px-4 py-2 text-right">Monto Total</th>
                            <th className="px-4 py-2 text-right">Saldo Pendiente</th>
                            <th className="px-4 py-2 text-center">Estado</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {selectedHistoryPartner.type === 'Proveedor' ? (
                            historyData?.payables && historyData.payables.length > 0 ? (
                              historyData.payables.map(bill => (
                                <tr key={bill.id} className="hover:bg-gray-50">
                                  <td className="px-4 py-2 font-mono font-bold text-red-700">{bill.billCode}</td>
                                  <td className="px-4 py-2 text-gray-600">📅 {bill.dueDate}</td>
                                  <td className="px-4 py-2 text-right font-mono">${bill.totalAmount?.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                                  <td className="px-4 py-2 text-right font-mono font-bold text-red-600">${bill.balance?.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                                  <td className="px-4 py-2 text-center">
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">{bill.status}</span>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr><td colSpan="5" className="text-center py-4 text-gray-400">Sin facturas de proveedor pendientes en CxP.</td></tr>
                            )
                          ) : (
                            historyData?.receivables && historyData.receivables.length > 0 ? (
                              historyData.receivables.map(inv => (
                                <tr key={inv.id} className="hover:bg-gray-50">
                                  <td className="px-4 py-2 font-mono font-bold text-blue-700">{inv.invoiceCode}</td>
                                  <td className="px-4 py-2 text-gray-600">📅 {inv.dueDate}</td>
                                  <td className="px-4 py-2 text-right font-mono">${inv.totalAmount?.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                                  <td className="px-4 py-2 text-right font-mono font-bold text-emerald-600">${inv.balance?.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                                  <td className="px-4 py-2 text-center">
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">{inv.status}</span>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr><td colSpan="5" className="text-center py-4 text-gray-400">Sin facturas de cliente pendientes en CxC.</td></tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <span className="text-xs text-gray-400">
                  Integración en tiempo real: Compras [4] ⇄ CxP [9] ⇄ Ventas [1] ⇄ CxC [8]
                </span>
                <button 
                  onClick={() => setIsHistoryOpen(false)}
                  className="px-5 py-2 bg-[#0A2540] hover:bg-[#123659] text-white text-xs font-bold rounded-lg transition"
                >
                  Cerrar Historial
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default BusinessPartnersView;
