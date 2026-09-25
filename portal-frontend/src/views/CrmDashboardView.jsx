import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const initialDeals = [
  { id: 1, title: 'Implementación ERP - Fase 1', company: 'Industrias Apex', value: '$15,000', stage: 'Nuevo', date: '24 Sep', priority: 'Alta' },
  { id: 2, title: 'Migración a la nube', company: 'TechSolutions S.A.', value: '$8,500', stage: 'Nuevo', date: '23 Sep', priority: 'Media' },
  { id: 3, title: 'Módulo de Facturación Electrónica', company: 'Comercializadora del Sur', value: '$3,200', stage: 'Contactado', date: '21 Sep', priority: 'Alta' },
  { id: 4, title: 'Consultoría Logística', company: 'Logistics Pro', value: '$5,000', stage: 'Calificado', date: '18 Sep', priority: 'Baja' },
  { id: 5, title: 'Renovación Licencias anual', company: 'Grupo Inmobiliario', value: '$12,000', stage: 'Calificado', date: '15 Sep', priority: 'Alta' },
  { id: 6, title: 'Proyecto WMS', company: 'Almacenes Globales', value: '$25,000', stage: 'Cotizado', date: '10 Sep', priority: 'Media' },
  { id: 7, title: 'Soporte Hypercare', company: 'Constructora XYZ', value: '$2,400', stage: 'Ganado', date: '05 Sep', priority: 'Media' },
];

const stages = ['Nuevo', 'Contactado', 'Calificado', 'Cotizado', 'Ganado'];

const CrmDashboardView = () => {
  const navigate = useNavigate();
  const [deals, setDeals] = useState(initialDeals);

  // Helper to format priority color
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'Alta': return 'bg-red-100 text-red-700';
      case 'Media': return 'bg-yellow-100 text-yellow-700';
      case 'Baja': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#f4f7f9] overflow-hidden">
      
      {/* Header */}
      <div className="flex flex-col border-b border-gray-200 px-6 py-4 bg-white sticky top-0 z-10 shrink-0 shadow-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center text-lg text-gray-700">
            <span className="cursor-pointer hover:underline text-[#006EAD]" onClick={() => navigate('/portal')}>Portal</span>
            <span className="mx-2 text-gray-400">/</span>
            <span className="font-bold text-[#0A2540]">NyTEX CRM (Embudo de Ventas)</span>
          </div>
          <div className="flex space-x-3">
            <button className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md text-sm font-semibold transition-colors shadow-sm">
              <i className="fas fa-filter mr-2"></i>Filtrar
            </button>
            <button className="bg-[#006EAD] hover:bg-[#005587] text-white px-4 py-2 rounded-md text-sm font-bold transition-colors shadow-sm">
              <i className="fas fa-plus mr-2"></i>NUEVA OPORTUNIDAD
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-auto p-6">
        
        {/* KPIs Summaries */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 min-w-[800px]">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between border-l-4 border-l-[#09A9E8]">
            <div>
              <p className="text-gray-500 text-xs font-bold uppercase mb-1">Oportunidades Abiertas</p>
              <p className="text-2xl font-extrabold text-[#0A2540]">6</p>
            </div>
            <div className="text-[#09A9E8] bg-blue-50 w-10 h-10 rounded-full flex items-center justify-center text-lg">
              <i className="fas fa-briefcase"></i>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between border-l-4 border-l-purple-500">
            <div>
              <p className="text-gray-500 text-xs font-bold uppercase mb-1">Valor del Pipeline</p>
              <p className="text-2xl font-extrabold text-[#0A2540]">$68,700</p>
            </div>
            <div className="text-purple-500 bg-purple-50 w-10 h-10 rounded-full flex items-center justify-center text-lg">
              <i className="fas fa-dollar-sign"></i>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between border-l-4 border-l-yellow-500">
            <div>
              <p className="text-gray-500 text-xs font-bold uppercase mb-1">Tasa de Cierre</p>
              <p className="text-2xl font-extrabold text-[#0A2540]">24.5%</p>
            </div>
            <div className="text-yellow-500 bg-yellow-50 w-10 h-10 rounded-full flex items-center justify-center text-lg">
              <i className="fas fa-chart-line"></i>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between border-l-4 border-l-green-500">
            <div>
              <p className="text-gray-500 text-xs font-bold uppercase mb-1">Ganado este mes</p>
              <p className="text-2xl font-extrabold text-[#0A2540]">$12,400</p>
            </div>
            <div className="text-green-500 bg-green-50 w-10 h-10 rounded-full flex items-center justify-center text-lg">
              <i className="fas fa-trophy"></i>
            </div>
          </div>
        </div>

        {/* Pipeline Kanban Board */}
        <div className="flex space-x-4 min-w-[1200px] h-[calc(100%-120px)]">
          {stages.map(stage => {
            const stageDeals = deals.filter(d => d.stage === stage);
            
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
                    <div key={deal.id} className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer group">
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${getPriorityColor(deal.priority)}`}>
                          {deal.priority}
                        </span>
                        <span className="text-gray-400 text-xs"><i className="fas fa-ellipsis-h group-hover:text-[#006EAD]"></i></span>
                      </div>
                      
                      <h4 className="font-bold text-[#0A2540] text-sm leading-tight mb-1">{deal.title}</h4>
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
                  
                  {/* Empty state padding to allow dropping in real implementation */}
                  <div className="h-4"></div>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CrmDashboardView;
