import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PaymentSimulatorModal from './PaymentSimulatorModal';

const modulesList = [
  { id: 'Ventas', name: 'NyTEX Ventas', description: 'Gestión de ventas y facturación.' },
  { id: 'CRM', name: 'NyTEX CRM', description: 'Gestión de relaciones con los clientes.' },
  { id: 'Inventario', name: 'NyTEX Inventario', description: 'Control de stock y almacén.' },
  { id: 'Compras', name: 'NyTEX Compras', description: 'Gestión de proveedores y compras.' },
  { id: 'Produccion', name: 'NyTEX Producción', description: 'Control de procesos de manufactura.' },
  { id: 'Contabilidad', name: 'NyTEX Contabilidad', description: 'Gestión contable financiera.' },
  { id: 'CxC', name: 'NyTEX Cuentas por Cobrar (CxC)', description: 'Gestión de cuentas por cobrar.' },
  { id: 'CxP', name: 'NyTEX Cuentas por Pagar (CxP)', description: 'Gestión de cuentas por pagar.' },
  { id: 'Tesoreria', name: 'NyTEX Tesorería', description: 'Control de flujo de caja y bancos.' },
  { id: 'ActivosFijos', name: 'NyTEX Activos Fijos', description: 'Control de bienes de la empresa.' },
  { id: 'Logistica', name: 'NyTEX Logística', description: 'Gestión de despachos y distribución.' },
  { id: 'RRHH', name: 'NyTEX RRHH', description: 'Gestión de recursos humanos.' },
  { id: 'Nomina', name: 'NyTEX Nómina', description: 'Cálculo y pago de planillas.' },
  { id: 'ProcessSuite', name: 'NyTEX Process Suite', description: 'Automatización de procesos.' },
  { id: 'BusinessPartners', name: 'NyTEX Business Partners', description: 'Gestión de socios de negocio.' },
  { id: 'BIyReportes', name: 'NyTEX BI y Reportes', description: 'Inteligencia de negocios y analítica.' },
  { id: 'Configuracion', name: 'NyTEX Configuración', description: 'Ajustes globales del sistema.' },
  { id: 'WMS', name: 'NyTEX WMS', description: 'Sistema de gestión de almacenes avanzado.' },
  { id: 'Dashboards', name: 'NyTEX Dashboards Operativos', description: 'Visualización de métricas en tiempo real.' },
  { id: 'BI', name: 'NyTEX BI', description: 'Business Intelligence avanzado.' },
  { id: 'BigData', name: 'NyTEX Big Data', description: 'Procesamiento de grandes volúmenes de datos.' },
  { id: 'IA', name: 'NyTEX IA', description: 'Inteligencia artificial aplicada a negocios.' },
  { id: 'Predictivos', name: 'NyTEX Modelos Predictivos', description: 'Análisis y proyecciones a futuro.' },
  { id: 'Planeacion', name: 'NyTEX Planeación', description: 'Planificación estratégica y operativa.' }
];

const phases = [
  {
    id: 1,
    name: 'Fase 1: NyTEX Starter',
    subtitle: 'Visibilidad Básica',
    moduleCount: '1 MÓDULO:',
    modulesText: 'Ventas',
    modulesArray: ['Ventas'],
    imp: '$0 USD',
    lic: '$35 USD / mes'
  },
  {
    id: 2,
    name: 'Fase 2: NyTEX Express',
    subtitle: 'Control Transaccional',
    moduleCount: '6 MÓDULOS:',
    modulesText: 'Ventas, Inventario, Contabilidad, CxC, CxP, Compras',
    modulesArray: ['Ventas', 'Inventario', 'Contabilidad', 'CxC', 'CxP', 'Compras'],
    imp: '$1,500 USD',
    lic: '$149 USD / mes'
  },
  {
    id: 3,
    name: 'Fase 3: NyTEX Advanced',
    subtitle: 'Eficiencia Operacional',
    moduleCount: '9 MÓDULOS:',
    modulesText: 'Incluye Fase 2 + Logística, CRM Básico, Recursos Humanos',
    modulesArray: ['Ventas', 'Inventario', 'Contabilidad', 'CxC', 'CxP', 'Compras', 'Logistica', 'CRM', 'RRHH'],
    imp: '$4,500 USD',
    lic: '$299 USD / mes'
  },
  {
    id: 4,
    name: 'Fase 4: NyTEX Enterprise',
    subtitle: 'Dirección Estratégica',
    moduleCount: '24 MÓDULOS:',
    modulesText: 'Todo el Ecosistema: IA, Predictivos, Planeación, Big Data, BI, Dashboards y más',
    modulesArray: modulesList.map(m => m.id),
    imp: 'Cotización a Medida',
    lic: '$499 USD / mes'
  }
];

export default function Dashboard() {
  const { user, replaceSubscriptions, loading } = useAuth();
  const location = useLocation();
  const [activePhase, setActivePhase] = useState(null);
  const [customModules, setCustomModules] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPhaseForPayment, setSelectedPhaseForPayment] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const phaseParam = params.get('phase');
    
    if (phaseParam) {
      if (phaseParam === 'custom') {
        setActivePhase('custom');
      } else {
        const phaseId = parseInt(phaseParam, 10);
        const phaseData = phases.find(p => p.id === phaseId);
        if (phaseData) {
          setActivePhase(phaseId);
          // replaceSubscriptions(phaseData.modulesArray); // Wait until paid
        }
      }
    }
  }, [location]);

  const handleContratar = (phaseId, modules) => {
    setActivePhase(phaseId);
    const phaseData = phases.find(p => p.id === phaseId);
    setSelectedPhaseForPayment({
      name: phaseData.name,
      modulesText: phaseData.modulesText,
      modulesArray: modules,
      imp: phaseData.imp
    });
    setIsModalOpen(true);
  };

  const handleCustomToggle = (moduleId) => {
    setCustomModules(prev => {
      const newCustom = prev.includes(moduleId) ? prev.filter(id => id !== moduleId) : [...prev, moduleId];
      return newCustom;
    });
    setActivePhase('custom');
  };

  const handleContratarCustom = () => {
    setSelectedPhaseForPayment({
      name: 'Paquete a su Medida',
      modulesText: `${customModules.length} módulos personalizados`,
      modulesArray: customModules,
      imp: `$${customModules.length * 250} USD`
    });
    setIsModalOpen(true);
  };

  const handlePaymentSuccess = (newSubscriptions) => {
    replaceSubscriptions(newSubscriptions);
    setIsModalOpen(false);
  };

  const getHighlightedModules = () => {
    if (activePhase === 'custom') {
      return customModules;
    }
    if (activePhase) {
      const phase = phases.find(p => p.id === activePhase);
      return phase ? phase.modulesArray : [];
    }
    return [];
  };

  if (loading) return <div className="min-h-screen bg-gray-100 flex items-center justify-center">Cargando Portal...</div>;
  if (!user) return <div className="min-h-screen bg-gray-100 flex items-center justify-center">Inicie sesión para continuar.</div>;

  const highlightedModules = getHighlightedModules();

  return (
    <div className="min-h-screen bg-[var(--nytex-background)] p-8 relative">
      {/* Background Graphic to keep the NyTEX identity */}
      <div 
        className="absolute inset-0 w-full h-full bg-no-repeat bg-contain bg-right-bottom pointer-events-none opacity-20"
        style={{ backgroundImage: "url('/dashboard-bg.png')" }}
      ></div>

      {/* Título de la página quitado porque ya vienen de la presentación, 
          pasamos directo a la propuesta comercial */}
      
      {/* Sección de 5 Columnas (Fases) */}
      <div className="max-w-[1600px] mx-auto mb-16 relative z-10">
        <h2 className="text-3xl font-extrabold text-[var(--nytex-navy-dark)] mb-6 text-center">Propuesta de Implementación</h2>
        
        {/* Contenedor morado oscuro como en la imagen */}
        <div className="bg-[#2A0F4C] p-6 rounded-xl flex flex-col lg:flex-row gap-4 overflow-x-auto">
          
          {phases.map((phase) => (
            <div key={phase.id} className="flex-1 min-w-[250px] bg-transparent border border-[#4B2979] rounded-lg p-5 flex flex-col text-white">
              <h3 className="text-xl font-bold mb-1">{phase.name}</h3>
              <p className="text-sm text-gray-300 mb-4">{phase.subtitle}</p>
              
              <p className="text-xs font-bold text-yellow-500 mb-1">{phase.moduleCount}</p>
              <p className="text-xs text-gray-300 mb-6 flex-grow">{phase.modulesText}</p>
              
              <div className="border-t border-[#4B2979] pt-4 mb-4">
                <p className="text-[10px] text-gray-400 font-bold tracking-wider mb-1">IMPLEMENTACIÓN</p>
                <p className="text-lg font-bold mb-3">
                  {phase.id === 4 && user.customQuoteAmount 
                    ? `$${user.customQuoteAmount.toLocaleString()} USD` 
                    : phase.imp}
                </p>
                
                <p className="text-[10px] text-gray-400 font-bold tracking-wider mb-1">LICENCIA NYTEX</p>
                <p className="text-lg font-bold text-yellow-400">{phase.lic}</p>
              </div>
              
              <button 
                onClick={() => setActivePhase(phase.id)}
                className={`w-full py-2 px-4 rounded text-sm font-bold transition-colors border mb-2 ${activePhase === phase.id ? 'bg-[#15A36A] border-[#15A36A] text-white' : 'bg-transparent border-[#4B2979] hover:bg-[#4B2979] text-white'}`}
              >
                {activePhase === phase.id ? 'Aplicaciones incluidas ↓' : 'Ver aplicaciones ↓'}
              </button>

              <button 
                onClick={() => {
                  if (phase.id === 4 && !user.customQuoteAmount) {
                    alert('Se ha enviado una solicitud a su Consultor NyTEX. Pronto subiremos su Cotización a Medida.');
                  } else {
                    handleContratar(phase.id, phase.modulesArray);
                  }
                }}
                className={`w-full py-2 px-4 rounded text-sm font-bold text-center shadow-lg transition-colors border block ${
                  phase.id === 4 && !user.customQuoteAmount 
                  ? 'bg-purple-600 hover:bg-purple-700 text-white border-purple-600'
                  : 'bg-[#006EAD] hover:bg-[#005587] text-white border-[#006EAD]'
                }`}
              >
                {phase.id === 4 && !user.customQuoteAmount ? 'SOLICITAR COTIZACIÓN' : 'CONTRATAR EN PORTAL'}
              </button>
            </div>
          ))}

          {/* 5ta Columna: A su medida */}
          <div className="flex-1 min-w-[250px] bg-transparent border border-[#4B2979] rounded-lg p-5 flex flex-col text-white">
            <h3 className="text-xl font-bold mb-1">A su medida</h3>
            <p className="text-sm text-gray-300 mb-4">Escoja sus módulos:</p>
            
            <div className="flex-grow overflow-y-auto max-h-[120px] mb-4 text-sm pr-2 custom-scrollbar">
              {modulesList.map(mod => (
                <div key={mod.id} className="flex items-center mb-2">
                  <input 
                    type="checkbox" 
                    id={`chk-${mod.id}`}
                    checked={customModules.includes(mod.id)}
                    onChange={() => handleCustomToggle(mod.id)}
                    className="mr-2 cursor-pointer"
                  />
                  <label htmlFor={`chk-${mod.id}`} className="cursor-pointer text-xs">{mod.name.replace('NyTEX ', '')}</label>
                </div>
              ))}
            </div>
            
            <div className="border-t border-[#4B2979] pt-4 mb-4 flex justify-between">
              <div>
                <p className="text-[10px] text-gray-400 font-bold tracking-wider mb-1">IMP.</p>
                <p className="text-sm font-bold">
                  {customModules.length === 0 
                    ? '$0' 
                    : customModules.length > 5 && !user.customQuoteAmount 
                      ? 'Cotización a Medida'
                      : customModules.length > 5 && user.customQuoteAmount
                        ? `$${user.customQuoteAmount.toLocaleString()} USD`
                        : `$${(customModules.length * 250).toLocaleString()} USD`}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-gray-400 font-bold tracking-wider mb-1">LIC.</p>
                <p className="text-sm font-bold text-yellow-400">
                  ${customModules.length === 0 ? 0 : customModules.length === 1 ? 35 : Math.round(customModules.length * (149/6))} <span className="text-[10px] text-gray-400 font-normal">/ mes</span>
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => setActivePhase('custom')}
              className={`w-full py-2 px-4 rounded text-sm font-bold transition-colors border mb-2 ${activePhase === 'custom' ? 'bg-[#15A36A] border-[#15A36A] text-white' : 'bg-transparent border-[#4B2979] hover:bg-[#4B2979] text-white'}`}
            >
              {activePhase === 'custom' ? 'Aplicaciones incluidas ↓' : 'Ver aplicaciones ↓'}
            </button>

            <button 
              onClick={() => {
                if (customModules.length > 5 && !user.customQuoteAmount) {
                  alert('Se ha enviado una solicitud a su Consultor NyTEX. Pronto subiremos su Cotización a Medida.');
                } else {
                  handleContratarCustom();
                }
              }}
              disabled={customModules.length === 0}
              className={`w-full py-2 px-4 rounded text-sm font-bold text-center shadow-lg transition-colors border block ${
                customModules.length === 0 
                  ? 'bg-gray-600 border-gray-600 cursor-not-allowed text-gray-400' 
                  : customModules.length > 5 && !user.customQuoteAmount
                    ? 'bg-purple-600 hover:bg-purple-700 text-white border-purple-600'
                    : 'bg-[#006EAD] hover:bg-[#005587] text-white border-[#006EAD]'
              }`}
            >
              {customModules.length > 5 && !user.customQuoteAmount ? 'SOLICITAR COTIZACIÓN' : 'CONTRATAR EN PORTAL'}
            </button>
          </div>

        </div>
      </div>

      {/* Cuadrícula de Módulos a iluminar */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative z-10">
        {modulesList.map((mod) => {
          const hasAccess = user.subscriptions.includes(mod.id);
          const isHighlighted = highlightedModules.includes(mod.id);
          
          return (
            <div 
              key={mod.id} 
              className={`relative bg-white rounded-xl overflow-hidden border transition-all duration-300 ${
                isHighlighted 
                  ? 'border-[var(--nytex-cyan)] ring-4 ring-[var(--nytex-cyan)] shadow-[0_0_20px_rgba(9,169,232,0.8)] transform scale-105 z-20' 
                  : hasAccess 
                    ? 'border-[#15A36A] shadow-md opacity-100 z-10' 
                    : 'border-[var(--nytex-border)] opacity-60 z-0'
              }`}
            >
              <div className="p-6 flex flex-col h-full">
                <h3 className="text-xl font-extrabold text-[var(--nytex-navy)] mb-2">{mod.name}</h3>
                <p className="text-[var(--nytex-text)] mb-6 flex-grow">{mod.description}</p>
                
                {hasAccess ? (
                  <Link 
                    to={`/app/` + mod.id.toLowerCase()} 
                    className="mt-auto block w-full text-center bg-[#15A36A] text-white py-2 px-4 rounded-md font-bold hover:bg-[#108253] transition-colors shadow-lg"
                  >
                    Abrir Módulo
                  </Link>
                ) : (
                  <button 
                    disabled
                    className="mt-auto block w-full text-center bg-[var(--nytex-ice)] text-[var(--nytex-navy)] py-2 px-4 rounded-md font-bold border border-[var(--nytex-border)] cursor-not-allowed"
                  >
                    Módulo Bloqueado
                  </button>
                )}
              </div>
              
              {!hasAccess && !isHighlighted && (
                <div className="absolute top-0 right-0 bg-[var(--nytex-silver)] text-white px-3 py-1 text-xs font-extrabold rounded-bl-lg shadow-sm">
                  REQUERIDO
                </div>
              )}
              {isHighlighted && !hasAccess && (
                <div className="absolute top-0 right-0 bg-[var(--nytex-cyan)] text-white px-3 py-1 text-xs font-extrabold rounded-bl-lg shadow-sm">
                  SELECCIONADO
                </div>
              )}
              {hasAccess && (
                <div className="absolute top-0 right-0 bg-[#15A36A] text-white px-3 py-1 text-xs font-extrabold rounded-bl-lg shadow-sm">
                  ADQUIRIDO
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <PaymentSimulatorModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        phaseInfo={selectedPhaseForPayment} 
        onSuccess={handlePaymentSuccess}
      />
      
      {/* Mini Admin Panel para Pruebas (Oculto o muy pequeño) */}
      <div className="fixed bottom-2 right-2 bg-white p-2 text-xs border rounded shadow-md z-50 text-gray-500 opacity-50 hover:opacity-100 transition-opacity">
        <p className="font-bold mb-1 border-b pb-1">Test Admin</p>
        <button 
          onClick={async () => {
            const amount = prompt("Ingresa el monto de la cotización (ej: 8500):", "8500");
            if (amount) {
              await fetch('/api/admin/set-quote', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: 'demo@consultores-nyt.com', amount: parseInt(amount, 10) })
              });
              alert('Cotización subida. Recarga la página.');
              window.location.reload();
            }
          }}
          className="bg-purple-600 text-white px-2 py-1 rounded"
        >
          Simular Subir Cotización
        </button>
      </div>
    </div>
  );
}