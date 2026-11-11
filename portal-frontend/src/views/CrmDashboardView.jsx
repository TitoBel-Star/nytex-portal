import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const initialDeals = [
  { id: 1, title: 'Implementación ERP - Fase 1', company: 'Industrias Apex', value: '$15,000', stage: 'Nuevo', date: '24 Sep', priority: 'Alta', contact: 'Roberto Silva', email: 'rsilva@apex.com', phone: '+503 7890-1234', assignedTo: 'María Asesora' },
  { id: 2, title: 'Migración a la nube', company: 'TechSolutions S.A.', value: '$8,500', stage: 'Nuevo', date: '23 Sep', priority: 'Media', contact: 'Karla Morales', email: 'kmorales@techsolutions.com', phone: '+503 7654-3210', assignedTo: 'Alejandro Castillo' },
  { id: 3, title: 'Módulo de Facturación Electrónica', company: 'Comercializadora del Sur', value: '$3,200', stage: 'Contactado', date: '21 Sep', priority: 'Alta', contact: 'Luis Gómez', email: 'lgomez@comsur.com', phone: '+503 7123-4567', assignedTo: 'María Asesora' },
  { id: 4, title: 'Consultoría Logística', company: 'Logistics Pro', value: '$5,000', stage: 'Calificado', date: '18 Sep', priority: 'Baja', contact: 'Sandra Peña', email: 'spena@logisticspro.com', phone: '+503 7321-9876', assignedTo: 'Carlos Méndez' },
  { id: 5, title: 'Renovación Licencias anual', company: 'Grupo Inmobiliario', value: '$12,000', stage: 'Calificado', date: '15 Sep', priority: 'Alta', contact: 'Eduardo Castro', email: 'ecastro@grupoinm.com', phone: '+503 7987-6543', assignedTo: 'Alejandro Castillo' },
  { id: 6, title: 'Proyecto WMS', company: 'Almacenes Globales', value: '$25,000', stage: 'Cotizado', date: '10 Sep', priority: 'Media', contact: 'Guillermo Vega', email: 'gvega@almacenesg.com', phone: '+503 7456-1122', assignedTo: 'María Asesora' },
  { id: 7, title: 'Soporte Hypercare', company: 'Constructora XYZ', value: '$2,400', stage: 'Ganado', date: '05 Sep', priority: 'Media', contact: 'Patricia Henríquez', email: 'phenriquez@xyz.com', phone: '+503 7889-0011', assignedTo: 'Carlos Méndez' },
];

const stages = ['Nuevo', 'Contactado', 'Calificado', 'Cotizado', 'Ganado'];

const CrmDashboardView = () => {
  const navigate = useNavigate();
  const [deals, setDeals] = useState(initialDeals);

  // Modal Crear Oportunidad
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    value: '',
    stage: 'Nuevo',
    priority: 'Alta',
    date: '30 Nov',
    contact: '',
    email: '',
    phone: '',
    assignedTo: 'María Asesora',
    notes: ''
  });

  // Modal Detalle / Mover Etapa
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Filtros
  const [showFilterBar, setShowFilterBar] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('Todas');
  const [stageFilter, setStageFilter] = useState('Todas');

  // Mensaje de notificación
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 4500);
  };

  // Helper de colores de prioridad
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Alta': return 'bg-red-100 text-red-700 border border-red-200';
      case 'Media': return 'bg-yellow-100 text-yellow-700 border border-yellow-200';
      case 'Baja': return 'bg-green-100 text-green-700 border border-green-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Cálculos dinámicos de KPIs
  const kpis = useMemo(() => {
    const parseVal = (v) => parseInt(String(v).replace(/[^0-9]/g, '') || 0, 10);
    const openDeals = deals.filter(d => d.stage !== 'Ganado');
    const wonDeals = deals.filter(d => d.stage === 'Ganado');

    const totalOpenVal = openDeals.reduce((sum, d) => sum + parseVal(d.value), 0);
    const totalWonVal = wonDeals.reduce((sum, d) => sum + parseVal(d.value), 0);
    const winRate = deals.length > 0 ? ((wonDeals.length / deals.length) * 100).toFixed(1) : '0.0';

    return {
      openCount: openDeals.length,
      pipelineValue: `$${totalOpenVal.toLocaleString()}`,
      winRate: `${winRate}%`,
      wonThisMonth: `$${totalWonVal.toLocaleString()}`
    };
  }, [deals]);

  // Filtrado de tratos
  const filteredDeals = useMemo(() => {
    return deals.filter(deal => {
      const matchSearch = searchQuery.trim() === '' || 
        deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.company.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchPriority = priorityFilter === 'Todas' || deal.priority === priorityFilter;
      const matchStage = stageFilter === 'Todas' || deal.stage === stageFilter;

      return matchSearch && matchPriority && matchStage;
    });
  }, [deals, searchQuery, priorityFilter, stageFilter]);

  // Abrir Modal de Creación
  const handleOpenModal = () => {
    setFormData({
      title: '',
      company: '',
      value: '',
      stage: 'Nuevo',
      priority: 'Alta',
      date: '30 Nov',
      contact: '',
      email: '',
      phone: '',
      assignedTo: 'María Asesora',
      notes: ''
    });
    setIsModalOpen(true);
  };

  // Guardar Nueva Oportunidad
  const handleSaveDeal = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.company.trim()) {
      alert('Por favor ingrese al menos el Título del Proyecto y la Empresa.');
      return;
    }

    const rawNum = parseInt(String(formData.value).replace(/[^0-9]/g, '') || '0', 10);
    const formattedVal = `$${rawNum.toLocaleString()}`;

    const newDealItem = {
      id: Date.now(),
      title: formData.title.trim(),
      company: formData.company.trim(),
      value: formattedVal,
      stage: formData.stage,
      date: formData.date.trim() || '30 Nov',
      priority: formData.priority,
      contact: formData.contact.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      assignedTo: formData.assignedTo,
      notes: formData.notes.trim()
    };

    setDeals(prev => [newDealItem, ...prev]);
    setIsModalOpen(false);
    showToast(`✅ Oportunidad "${newDealItem.title}" agregada con éxito a la etapa "${newDealItem.stage}".`);
  };

  // Abrir Detalle de Oportunidad
  const handleCardClick = (deal) => {
    setSelectedDeal(deal);
    setIsDetailOpen(true);
  };

  // Cambiar Etapa de Oportunidad
  const handleMoveStage = (targetStage) => {
    if (!selectedDeal) return;
    setDeals(prev => prev.map(d => d.id === selectedDeal.id ? { ...d, stage: targetStage } : d));
    setSelectedDeal(prev => ({ ...prev, stage: targetStage }));
    
    if (targetStage === 'Ganado') {
      showToast(`🎉 ¡Felicitaciones! "${selectedDeal.title}" se movió a GANADO.`);
    } else {
      showToast(`Etapa de "${selectedDeal.title}" actualizada a ${targetStage}.`);
    }
  };

  // Eliminar / Descartar Oportunidad
  const handleDeleteDeal = () => {
    if (!selectedDeal) return;
    if (window.confirm(`¿Está seguro de descartar la oportunidad "${selectedDeal.title}"?`)) {
      setDeals(prev => prev.filter(d => d.id !== selectedDeal.id));
      setIsDetailOpen(false);
      showToast(`Oportunidad descartada del pipeline.`);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#f4f7f9] overflow-hidden relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-6 z-50 bg-[#0A2540] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center space-x-3 border-l-4 border-l-[#006EAD] animate-bounce">
          <i className="fas fa-check-circle text-green-400 text-lg"></i>
          <span className="text-sm font-semibold">{toastMessage}</span>
          <button onClick={() => setToastMessage('')} className="text-gray-400 hover:text-white ml-2 text-xs">✕</button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col border-b border-gray-200 px-6 py-4 bg-white sticky top-0 z-10 shrink-0 shadow-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center text-lg text-gray-700">
            <span className="cursor-pointer hover:underline text-[#006EAD]" onClick={() => navigate('/portal')}>Portal</span>
            <span className="mx-2 text-gray-400">/</span>
            <span className="font-bold text-[#0A2540]">NyTEX CRM (Embudo de Ventas)</span>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={() => setShowFilterBar(!showFilterBar)}
              className={`border px-4 py-2 rounded-md text-sm font-semibold transition-colors shadow-sm flex items-center ${
                showFilterBar ? 'bg-blue-50 border-[#006EAD] text-[#006EAD]' : 'bg-white border-gray-300 hover:bg-gray-50 text-gray-700'
              }`}
            >
              <i className="fas fa-filter mr-2"></i>Filtrar
            </button>
            <button 
              onClick={handleOpenModal}
              className="bg-[#006EAD] hover:bg-[#005587] text-white px-4 py-2 rounded-md text-sm font-bold transition-all shadow-sm flex items-center active:scale-95"
            >
              <i className="fas fa-plus mr-2"></i>NUEVA OPORTUNIDAD
            </button>
          </div>
        </div>

        {/* Barra de Filtros Expandible */}
        {showFilterBar && (
          <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap items-center gap-4 bg-slate-50 p-3 rounded-lg text-sm">
            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                placeholder="Buscar por proyecto o empresa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:border-[#006EAD] text-sm"
              />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-600 text-xs font-bold uppercase">Prioridad:</span>
              <select 
                value={priorityFilter} 
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-2.5 py-1.5 border border-gray-300 rounded-md bg-white text-xs font-semibold focus:outline-none focus:border-[#006EAD]"
              >
                <option value="Todas">Todas</option>
                <option value="Alta">Alta</option>
                <option value="Media">Media</option>
                <option value="Baja">Baja</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-600 text-xs font-bold uppercase">Etapa:</span>
              <select 
                value={stageFilter} 
                onChange={(e) => setStageFilter(e.target.value)}
                className="px-2.5 py-1.5 border border-gray-300 rounded-md bg-white text-xs font-semibold focus:outline-none focus:border-[#006EAD]"
              >
                <option value="Todas">Todas</option>
                {stages.map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>
            {(searchQuery || priorityFilter !== 'Todas' || stageFilter !== 'Todas') && (
              <button 
                onClick={() => { setSearchQuery(''); setPriorityFilter('Todas'); setStageFilter('Todas'); }}
                className="text-xs text-red-600 hover:text-red-800 font-bold underline ml-auto"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-auto p-6">
        
        {/* KPIs Summaries */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 min-w-[800px]">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between border-l-4 border-l-[#09A9E8]">
            <div>
              <p className="text-gray-500 text-xs font-bold uppercase mb-1">Oportunidades Abiertas</p>
              <p className="text-2xl font-extrabold text-[#0A2540]">{kpis.openCount}</p>
            </div>
            <div className="text-[#09A9E8] bg-blue-50 w-10 h-10 rounded-full flex items-center justify-center text-lg">
              <i className="fas fa-briefcase"></i>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between border-l-4 border-l-purple-500">
            <div>
              <p className="text-gray-500 text-xs font-bold uppercase mb-1">Valor del Pipeline</p>
              <p className="text-2xl font-extrabold text-[#0A2540]">{kpis.pipelineValue}</p>
            </div>
            <div className="text-purple-500 bg-purple-50 w-10 h-10 rounded-full flex items-center justify-center text-lg">
              <i className="fas fa-dollar-sign"></i>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between border-l-4 border-l-yellow-500">
            <div>
              <p className="text-gray-500 text-xs font-bold uppercase mb-1">Tasa de Cierre</p>
              <p className="text-2xl font-extrabold text-[#0A2540]">{kpis.winRate}</p>
            </div>
            <div className="text-yellow-500 bg-yellow-50 w-10 h-10 rounded-full flex items-center justify-center text-lg">
              <i className="fas fa-chart-line"></i>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between border-l-4 border-l-green-500">
            <div>
              <p className="text-gray-500 text-xs font-bold uppercase mb-1">Ganado este mes</p>
              <p className="text-2xl font-extrabold text-[#0A2540]">{kpis.wonThisMonth}</p>
            </div>
            <div className="text-green-500 bg-green-50 w-10 h-10 rounded-full flex items-center justify-center text-lg">
              <i className="fas fa-trophy"></i>
            </div>
          </div>
        </div>

        {/* Pipeline Kanban Board */}
        <div className="flex space-x-4 min-w-[1200px] h-[calc(100%-120px)]">
          {stages.map(stage => {
            const stageDeals = filteredDeals.filter(d => d.stage === stage);
            
            // Calculate total value of the stage
            const stageValue = stageDeals.reduce((acc, deal) => {
              const val = parseInt(deal.value.replace(/[^0-9]/g, ''), 10);
              return acc + (isNaN(val) ? 0 : val);
            }, 0);

            return (
              <div key={stage} className="flex-1 bg-gray-100/50 rounded-xl border border-gray-200 flex flex-col overflow-hidden">
                
                {/* Stage Header */}
                <div className="p-3 border-b border-gray-200 bg-gray-100 flex justify-between items-center shrink-0">
                  <h3 className="font-bold text-gray-700 text-sm">{stage} ({stageDeals.length})</h3>
                  <span className="text-xs font-semibold text-gray-500">${stageValue.toLocaleString()}</span>
                </div>
                
                {/* Deals List */}
                <div className="flex-1 overflow-y-auto p-3 space-y-3">
                  {stageDeals.map(deal => (
                    <div 
                      key={deal.id} 
                      onClick={() => handleCardClick(deal)}
                      className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-[#006EAD] transition-all cursor-pointer group"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${getPriorityColor(deal.priority)}`}>
                          {deal.priority}
                        </span>
                        <span className="text-gray-400 text-xs hover:text-[#006EAD]"><i className="fas fa-ellipsis-h"></i></span>
                      </div>
                      
                      <h4 className="font-bold text-[#0A2540] text-sm leading-tight mb-1 group-hover:text-[#006EAD] transition-colors">{deal.title}</h4>
                      <p className="text-xs text-gray-500 mb-3"><i className="far fa-building mr-1"></i>{deal.company}</p>
                      
                      <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                        <span className="font-extrabold text-[#006EAD] text-sm">{deal.value}</span>
                        <div className="flex items-center text-gray-400 text-xs">
                          <i className="far fa-clock mr-1"></i>
                          <span>{deal.date}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {stageDeals.length === 0 && (
                    <div className="p-4 text-center text-gray-400 text-xs border border-dashed border-gray-300 rounded-lg">
                      Sin oportunidades en esta etapa
                    </div>
                  )}

                  <div className="h-4"></div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL: REGISTRAR NUEVA OPORTUNIDAD                        */}
      {/* ========================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[92vh] overflow-hidden animate-fadeIn">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-[#0A2540] text-white">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-lg bg-[#006EAD] flex items-center justify-center text-white text-lg">
                  <i className="fas fa-plus"></i>
                </div>
                <div>
                  <h3 className="text-base font-bold">Registrar Nueva Oportunidad</h3>
                  <p className="text-xs text-blue-200">ERP NyTEX • Circuito Lead-to-Order (L2O)</p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-300 hover:text-white text-xl font-bold p-1 leading-none"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveDeal} className="p-6 overflow-y-auto space-y-4 text-sm">
              
              {/* Sección 1: Datos Principales */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Título de la Oportunidad / Proyecto <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Implementación ERP - Fase 2 o Suministro Textil 2026"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006EAD] text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Empresa / Razón Social <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Hilandería Central S.A."
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006EAD] text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Monto Estimado ($ USD) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-400 font-bold">$</span>
                    <input
                      type="number"
                      required
                      placeholder="18000"
                      value={formData.value}
                      onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006EAD] text-sm font-semibold"
                    />
                  </div>
                </div>
              </div>

              {/* Sección 2: Configuración del Pipeline */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-gray-100">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Etapa Inicial
                  </label>
                  <select
                    value={formData.stage}
                    onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#006EAD] text-sm font-medium"
                  >
                    {stages.map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Prioridad
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#006EAD] text-sm font-medium"
                  >
                    <option value="Alta">🔴 Alta</option>
                    <option value="Media">🟡 Media</option>
                    <option value="Baja">🟢 Baja</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Fecha de Cierre / Seguimiento
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. 15 Dic"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006EAD] text-sm"
                  />
                </div>
              </div>

              {/* Sección 3: Contacto y Responsable */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-gray-100">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Contacto Principal
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Ing. Juan Pérez"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006EAD] text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    placeholder="jperez@cliente.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006EAD] text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Asesor Comercial
                  </label>
                  <select
                    value={formData.assignedTo}
                    onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#006EAD] text-sm font-medium"
                  >
                    <option value="María Asesora">María Asesora</option>
                    <option value="Alejandro Castillo">Alejandro Castillo</option>
                    <option value="Carlos Méndez">Carlos Méndez</option>
                  </select>
                </div>
              </div>

              {/* Sección 4: Notas / Calificación BANT */}
              <div className="pt-2 border-t border-gray-100">
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Notas de Calificación BANT / Descripción
                </label>
                <textarea
                  rows="2"
                  placeholder="Detalles sobre presupuesto aprobado, necesidad técnica o requerimientos especiales..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006EAD] text-sm"
                ></textarea>
              </div>

              {/* Botones de Acción */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg font-semibold text-gray-600 hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#006EAD] hover:bg-[#005587] text-white rounded-lg font-bold shadow-md transition flex items-center"
                >
                  <i className="fas fa-check mr-2"></i>Guardar Oportunidad
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: DETALLE Y CAMBIO DE ETAPA DE OPORTUNIDAD           */}
      {/* ========================================================= */}
      {isDetailOpen && selectedDeal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl flex flex-col overflow-hidden animate-fadeIn">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-[#0A2540] text-white">
              <div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${getPriorityColor(selectedDeal.priority)}`}>
                  {selectedDeal.priority}
                </span>
                <h3 className="text-base font-bold mt-1">{selectedDeal.title}</h3>
                <p className="text-xs text-blue-200"><i className="far fa-building mr-1"></i>{selectedDeal.company}</p>
              </div>
              <button 
                onClick={() => setIsDetailOpen(false)}
                className="text-gray-300 hover:text-white text-xl font-bold p-1 leading-none"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-5 text-sm">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-gray-200">
                <div>
                  <p className="text-gray-500 text-xs font-bold uppercase">Monto Estimado</p>
                  <p className="text-xl font-black text-[#006EAD]">{selectedDeal.value}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs font-bold uppercase">Fecha de Seguimiento</p>
                  <p className="text-sm font-bold text-gray-800"><i className="far fa-clock mr-1 text-gray-400"></i>{selectedDeal.date}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs font-bold uppercase">Contacto</p>
                  <p className="text-sm text-gray-700">{selectedDeal.contact || 'No especificado'}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs font-bold uppercase">Asesor Asignado</p>
                  <p className="text-sm text-gray-700">{selectedDeal.assignedTo || 'María Asesora'}</p>
                </div>
              </div>

              {/* Selector de Etapa */}
              <div>
                <p className="text-xs font-bold text-gray-700 uppercase mb-2">Avanzar o Mover a Etapa:</p>
                <div className="grid grid-cols-5 gap-2">
                  {stages.map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleMoveStage(st)}
                      className={`px-2 py-2 rounded-lg text-xs font-bold transition text-center border ${
                        selectedDeal.stage === st 
                          ? 'bg-[#006EAD] text-white border-[#006EAD] shadow-sm' 
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Acciones */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleDeleteDeal}
                  className="text-red-600 hover:text-red-800 text-xs font-bold hover:underline flex items-center"
                >
                  <i className="fas fa-trash-alt mr-1"></i>Descartar Oportunidad
                </button>
                <button
                  type="button"
                  onClick={() => setIsDetailOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-bold transition"
                >
                  Cerrar
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default CrmDashboardView;
