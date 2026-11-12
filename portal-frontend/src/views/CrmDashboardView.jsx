import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Catálogo base de Kardex (Productos y Servicios de NyTEX ERP)
const DEFAULT_KARDEX = [
  { sku: 'PT-TEL-101', name: 'Lote Producto Terminado Estándar Alfa', category: 'Producto Terminado', unitPrice: 1850, stock: 35, unit: 'rollos' },
  { sku: 'PT-POP-102', name: 'Lote Producto Terminado Modelo Estándar', category: 'Producto Terminado', unitPrice: 2150, stock: 15, unit: 'unidades' },
  { sku: 'PT-RIB-103', name: 'Lote Producto Terminado Modelo Reforzado', category: 'Producto Terminado', unitPrice: 1950, stock: 22, unit: 'unidades' },
  { sku: 'PT-FLE-104', name: 'Lote Producto Terminado Modelo Industrial', category: 'Producto Terminado', unitPrice: 2800, stock: 18, unit: 'unidades' },
  { sku: 'PT-PIQ-105', name: 'Lote Producto Terminado Modelo Plus', category: 'Producto Terminado', unitPrice: 2100, stock: 26, unit: 'unidades' },
  { sku: 'SKU-TEL-01', name: 'Lote Producto Terminado Serie 100', category: 'Producto Terminado', unitPrice: 1850, stock: 45, unit: 'unidades' },
  { sku: 'SKU-TEL-02', name: 'Lote Producto Terminado Serie 200', category: 'Producto Terminado', unitPrice: 1850, stock: 32, unit: 'unidades' },
  { sku: 'SKU-TEL-03', name: 'Lote Producto Terminado Serie 300', category: 'Producto Terminado', unitPrice: 1780, stock: 60, unit: 'unidades' },
  { sku: 'SKU-MEZ-01', name: 'Lote Producto Terminado Serie 400', category: 'Producto Terminado', unitPrice: 2400, stock: 28, unit: 'unidades' },
  { sku: 'SKU-MEZ-02', name: 'Lote Producto Terminado Serie 500', category: 'Producto Terminado', unitPrice: 2650, stock: 19, unit: 'unidades' },
  { sku: 'SKU-POL-01', name: 'Lote Producto Terminado Compuesto', category: 'Producto Terminado', unitPrice: 1450, stock: 55, unit: 'unidades' },
  { sku: 'MP-HIL-01', name: 'Materia Prima Base MP-01', category: 'Materia Prima', unitPrice: 380, stock: 120, unit: 'kg' },
  { sku: 'MP-POL-02', name: 'Materia Prima Sintética MP-02', category: 'Materia Prima', unitPrice: 240, stock: 450, unit: 'kg' },
  { sku: 'MP-TIN-03', name: 'Compuesto Reactivo Azul Marino', category: 'Insumo Químico', unitPrice: 490, stock: 18, unit: 'litros' },
  { sku: 'SRV-CONS-01', name: 'Servicio de Consultoría y Diagnóstico ERP', category: 'Servicio', unitPrice: 1200, stock: 999, unit: 'servicio' },
  { sku: 'SRV-MIG-02', name: 'Servicio de Migración a la Nube e Infraestructura', category: 'Servicio', unitPrice: 3500, stock: 999, unit: 'servicio' },
  { sku: 'SRV-CAP-03', name: 'Capacitación y Adopción de Usuarios NyTEX', category: 'Servicio', unitPrice: 750, stock: 999, unit: 'servicio' },
  { sku: 'SRV-SOP-04', name: 'Soporte Hypercare 24/7 (Bolsa Mensual)', category: 'Servicio', unitPrice: 2400, stock: 999, unit: 'servicio' }
];

// Razones oficiales de No Compra (Venta Perdida)
const LOST_SALE_REASONS = [
  '1. No compró por precio alto',
  '2. No compró por la Marca',
  '3. No compró porque no hay existencias',
  '4. No compró porque quería crédito y no se le dio',
  '5. No compra por mal servicio'
];

// Tipos de Contacto según Manual de Usuario NyTEX CRM (Paso 2)
const CONTACT_TYPES = [
  { id: 'Llamada', label: 'Llamada', icon: 'fas fa-phone-alt', bg: 'bg-blue-50 text-blue-700 border-blue-300' },
  { id: 'Reunión Presencial', label: 'Reunión Presencial', icon: 'fas fa-handshake', bg: 'bg-emerald-50 text-emerald-700 border-emerald-300' },
  { id: 'Videoconferencia', label: 'Videoconferencia', icon: 'fas fa-video', bg: 'bg-purple-50 text-purple-700 border-purple-300' },
  { id: 'Correo', label: 'Correo', icon: 'fas fa-envelope', bg: 'bg-amber-50 text-amber-700 border-amber-300' },
  { id: 'Envío de Muestras', label: 'Envío de Muestras', icon: 'fas fa-box-open', bg: 'bg-indigo-50 text-indigo-700 border-indigo-300' }
];

const initialDeals = [
  { 
    id: 1, 
    title: 'Implementación ERP - Fase 1', 
    company: 'Industrias Apex', 
    value: '$15,000', 
    stage: 'Nuevo', 
    date: '24 Sep', 
    priority: 'Alta', 
    contact: 'Roberto Silva', 
    email: 'rsilva@apex.com', 
    phone: '+503 7890-1234', 
    assignedTo: 'María Asesora',
    activities: [
      {
        id: 101,
        contactType: 'Reunión Presencial',
        notes: 'Minuta: Reunión en instalaciones del cliente. Se revisó alcance de Fase 1 (Módulos 1 al 4). Solicitan términos de pago a 30 días y entrega en planta.',
        nextTask: 'Enviar cotización ajustada con cronograma',
        nextTaskDate: '2026-09-24 10:00',
        registeredAt: '2026-09-18 16:30',
        registeredBy: 'María Asesora'
      }
    ],
    quote: {
      paymentTerms: 'Crédito 30 días',
      deliveryMode: 'Entrega en Sucursal',
      deliveryAddress: 'Planta Industrial Apex, Km 14',
      items: [
        { id: 11, sku: 'SRV-CONS-01', name: 'Servicio de Consultoría y Diagnóstico ERP', category: 'Servicio', unitPrice: 1200, quantity: 2, total: 2400, status: 'comprado', lostReason: null, lostNotes: '', lostDate: null },
        { id: 12, sku: 'SRV-MIG-02', name: 'Servicio de Migración a la Nube e Infraestructura', category: 'Servicio', unitPrice: 3500, quantity: 3, total: 10500, status: 'cotizado', lostReason: null, lostNotes: '', lostDate: null },
        { id: 13, sku: 'SRV-CAP-03', name: 'Capacitación y Adopción de Usuarios NyTEX', category: 'Servicio', unitPrice: 700, quantity: 3, total: 2100, status: 'cotizado', lostReason: null, lostNotes: '', lostDate: null }
      ]
    }
  },
  { 
    id: 2, 
    title: 'Migración a la nube', 
    company: 'TechSolutions S.A.', 
    value: '$8,500', 
    stage: 'Nuevo', 
    date: '23 Sep', 
    priority: 'Media', 
    contact: 'Karla Morales', 
    email: 'kmorales@techsolutions.com', 
    phone: '+503 7654-3210', 
    assignedTo: 'Alejandro Castillo',
    activities: [
      {
        id: 201,
        contactType: 'Videoconferencia',
        notes: 'Minuta: Se revisó la infraestructura de servidores locales con el equipo de TI de TechSolutions. Solicitan cotización para migración y plan de capacitación.',
        nextTask: 'Enviar cotización ajustada y acordar fecha de inicio',
        nextTaskDate: '2026-09-23 11:30',
        registeredAt: '2026-09-20 14:00',
        registeredBy: 'Alejandro Castillo'
      }
    ],
    quote: {
      paymentTerms: 'Crédito 30 días',
      deliveryMode: 'A Domicilio',
      deliveryAddress: 'Torre TechSolutions, Nivel 5',
      items: [
        { id: 21, sku: 'SRV-MIG-02', name: 'Servicio de Migración a la Nube e Infraestructura', category: 'Servicio', unitPrice: 3500, quantity: 2, total: 7000, status: 'comprado', lostReason: null, lostNotes: '', lostDate: null },
        { id: 22, sku: 'SRV-CAP-03', name: 'Capacitación y Adopción de Usuarios NyTEX', category: 'Servicio', unitPrice: 750, quantity: 2, total: 1500, status: 'comprado', lostReason: null, lostNotes: '', lostDate: null }
      ]
    }
  },
  { 
    id: 3, 
    title: 'Módulo de Facturación Electrónica', 
    company: 'Comercializadora del Sur', 
    value: '$3,200', 
    stage: 'Contactado', 
    date: '21 Sep', 
    priority: 'Alta', 
    contact: 'Luis Gómez', 
    email: 'lgomez@comsur.com', 
    phone: '+503 7123-4567', 
    assignedTo: 'María Asesora',
    activities: [
      {
        id: 301,
        contactType: 'Llamada',
        notes: 'Minuta: Primera llamada de contacto. El cliente requiere timbrado DTE urgente para cumplir normativa fiscal.',
        nextTask: 'Llamada de seguimiento para revisión de propuesta',
        nextTaskDate: '2026-09-21 15:00',
        registeredAt: '2026-09-19 10:15',
        registeredBy: 'María Asesora'
      }
    ],
    quote: {
      paymentTerms: 'Contado',
      deliveryMode: 'Entrega en Sucursal',
      deliveryAddress: '',
      items: [
        { id: 31, sku: 'SRV-CONS-01', name: 'Servicio de Consultoría y Diagnóstico ERP', category: 'Servicio', unitPrice: 1200, quantity: 1, total: 1200, status: 'cotizado', lostReason: null, lostNotes: '', lostDate: null },
        { id: 32, sku: 'SRV-SOP-04', name: 'Soporte Hypercare 24/7 (Bolsa Mensual)', category: 'Servicio', unitPrice: 2000, quantity: 1, total: 2000, status: 'cotizado', lostReason: null, lostNotes: '', lostDate: null }
      ]
    }
  },
  { 
    id: 4, 
    title: 'Consultoría Logística', 
    company: 'Logistics Pro', 
    value: '$5,000', 
    stage: 'Calificado', 
    date: '18 Sep', 
    priority: 'Baja', 
    contact: 'Sandra Peña', 
    email: 'spena@logisticspro.com', 
    phone: '+503 7321-9876', 
    assignedTo: 'Carlos Méndez',
    activities: [],
    quote: {
      paymentTerms: 'Crédito 15 días',
      deliveryMode: 'Entrega en Sucursal',
      deliveryAddress: '',
      items: [
        { id: 41, sku: 'SRV-CONS-01', name: 'Servicio de Consultoría y Diagnóstico ERP', category: 'Servicio', unitPrice: 1250, quantity: 4, total: 5000, status: 'cotizado', lostReason: null, lostNotes: '', lostDate: null }
      ]
    }
  },
  { 
    id: 5, 
    title: 'Renovación Licencias anual', 
    company: 'Grupo Inmobiliario', 
    value: '$12,000', 
    stage: 'Calificado', 
    date: '15 Sep', 
    priority: 'Alta', 
    contact: 'Eduardo Castro', 
    email: 'ecastro@grupoinm.com', 
    phone: '+503 7987-6543', 
    assignedTo: 'Alejandro Castillo',
    activities: [],
    quote: {
      paymentTerms: 'Contado',
      deliveryMode: 'Entrega en Sucursal',
      deliveryAddress: '',
      items: [
        { id: 51, sku: 'SRV-SOP-04', name: 'Soporte Hypercare 24/7 (Bolsa Mensual)', category: 'Servicio', unitPrice: 2400, quantity: 5, total: 12000, status: 'cotizado', lostReason: null, lostNotes: '', lostDate: null }
      ]
    }
  },
  { 
    id: 6, 
    title: 'Proyecto WMS', 
    company: 'Almacenes Globales', 
    value: '$25,000', 
    stage: 'Cotizado', 
    date: '10 Sep', 
    priority: 'Media', 
    contact: 'Guillermo Vega', 
    email: 'gvega@almacenesg.com', 
    phone: '+503 7456-1122', 
    assignedTo: 'María Asesora',
    activities: [
      {
        id: 601,
        contactType: 'Envío de Muestras',
        notes: 'Minuta: Se despacharon muestras de etiquetas de código de barras y terminales para pruebas en almacén central.',
        nextTask: 'Reunión de seguimiento de resultados de muestras',
        nextTaskDate: '2026-09-10 09:00',
        registeredAt: '2026-09-05 11:00',
        registeredBy: 'María Asesora'
      }
    ],
    quote: {
      paymentTerms: 'Crédito 30 días',
      deliveryMode: 'A Domicilio',
      deliveryAddress: 'Centro de Distribución Almacenes Globales, Nave 4',
      items: [
        { id: 61, sku: 'PT-FLE-104', name: 'Lote Producto Terminado Modelo Industrial', category: 'Producto Terminado', unitPrice: 2800, quantity: 5, total: 14000, status: 'comprado', lostReason: null, lostNotes: '', lostDate: null },
        { id: 62, sku: 'PT-POP-102', name: 'Lote Producto Terminado Modelo Estándar', category: 'Producto Terminado', unitPrice: 2150, quantity: 3, total: 6450, status: 'perdido', lostReason: '3. No compró porque no hay existencias', lostNotes: 'Cliente requería entrega inmediata pero el inventario estaba en producción.', lostDate: '2026-09-10 11:15' },
        { id: 63, sku: 'SRV-CONS-01', name: 'Servicio de Consultoría y Diagnóstico ERP', category: 'Servicio', unitPrice: 1200, quantity: 2, total: 2400, status: 'perdido', lostReason: '1. No compró por precio alto', lostNotes: 'Cliente consideró el costo de consultoría fuera de presupuesto.', lostDate: '2026-09-10 11:20' }
      ]
    }
  },
  { 
    id: 7, 
    title: 'Soporte Hypercare', 
    company: 'Constructora XYZ', 
    value: '$2,400', 
    stage: 'Ganado', 
    date: '05 Sep', 
    priority: 'Media', 
    contact: 'Patricia Henríquez', 
    email: 'phenriquez@xyz.com', 
    phone: '+503 7889-0011', 
    assignedTo: 'Carlos Méndez',
    activities: [
      {
        id: 701,
        contactType: 'Llamada',
        notes: 'Minuta: Cierre formal del acuerdo. Se acordó inicio de bolsa Hypercare con soporte extendido.',
        nextTask: 'Monitoreo de tickets de primer mes',
        nextTaskDate: '2026-09-30 17:00',
        registeredAt: '2026-09-05 16:00',
        registeredBy: 'Carlos Méndez'
      }
    ],
    quote: {
      paymentTerms: 'Contado',
      deliveryMode: 'Entrega en Sucursal',
      deliveryAddress: '',
      items: [
        { id: 71, sku: 'SRV-SOP-04', name: 'Soporte Hypercare 24/7 (Bolsa Mensual)', category: 'Servicio', unitPrice: 2400, quantity: 1, total: 2400, status: 'comprado', lostReason: null, lostNotes: '', lostDate: null }
      ]
    }
  },
];

// Calcular valor activo sincronizado de una cotización
const calculateQuoteActiveValue = (quote, stage, fallbackValue) => {
  if (!quote || !Array.isArray(quote.items) || quote.items.length === 0) {
    return fallbackValue;
  }
  let totalComprado = 0;
  let totalPendiente = 0;
  let totalCotizado = 0;
  quote.items.forEach(it => {
    const sub = (Number(it.unitPrice) || 0) * (Number(it.quantity) || 1);
    totalCotizado += sub;
    if (it.status === 'comprado') {
      totalComprado += sub;
    } else if (it.status !== 'perdido') {
      totalPendiente += sub;
    }
  });

  if (stage === 'Ganado') {
    const val = totalComprado > 0 ? totalComprado : totalCotizado;
    return `$${val.toLocaleString()}`;
  }

  // Valor vigente activo en la negociación (lo cotizado no perdido)
  const active = totalPendiente + totalComprado;
  return `$${active.toLocaleString()}`;
};

const stages = ['Nuevo', 'Contactado', 'Calificado', 'Cotizado', 'Ganado'];

const CrmDashboardView = () => {
  const navigate = useNavigate();
  const [deals, setDeals] = useState(() =>
    initialDeals.map(d => ({
      ...d,
      value: calculateQuoteActiveValue(d.quote, d.stage, d.value)
    }))
  );

  // Business Partners Catálogo
  const [businessPartners, setBusinessPartners] = useState([]);
  const [partnerMode, setPartnerMode] = useState('catalog'); // 'catalog' | 'manual'
  const [selectedPartnerCode, setSelectedPartnerCode] = useState('');

  // Modal Crear Oportunidad
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    partnerCode: '',
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

  // Pestaña activa en Modal Detalle ('actividades' | 'cotizacion' | 'venta_perdida' | 'info')
  const [detailTab, setDetailTab] = useState('actividades');

  // Formulario Registro de Actividades (Pasos 2, 3, 4 del Manual de Usuario)
  const [activityForm, setActivityForm] = useState({
    contactType: 'Llamada',
    notes: '',
    nextTask: 'Llamada de seguimiento',
    nextTaskDate: ''
  });

  // Catálogo de Kardex (Productos y Servicios)
  const [kardexCatalog, setKardexCatalog] = useState(DEFAULT_KARDEX);

  // Formulario Agregar SKU a Cotización
  const [quoteForm, setQuoteForm] = useState({
    selectedSku: '',
    quantity: 1,
    unitPrice: ''
  });

  // Estado de transferencia a Módulo 2 (Ventas)
  const [isTransferringOrder, setIsTransferringOrder] = useState(false);

  // Modal Emergente para Registrar Motivo de Venta Perdida (1 al 5)
  const [lostSaleModal, setLostSaleModal] = useState({
    isOpen: false,
    targetItem: null, // null | item object | 'ALL'
    reason: LOST_SALE_REASONS[0],
    notes: ''
  });

  // Pestañas y estado de cotización en Modal Crear Oportunidad
  const [createModalTab, setCreateModalTab] = useState('datos'); // 'datos' | 'cotizacion'
  const [newDealQuote, setNewDealQuote] = useState({
    paymentTerms: 'Contado',
    deliveryMode: 'Entrega en Sucursal',
    deliveryAddress: '',
    items: []
  });
  const [newDealSkuForm, setNewDealSkuForm] = useState({
    selectedSku: '',
    quantity: 1,
    unitPrice: ''
  });

  // Filtros
  const [showFilterBar, setShowFilterBar] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('Todas');
  const [stageFilter, setStageFilter] = useState('Todas');

  // Mensaje de notificación (Toast)
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 4500);
  };

  // Cargar Business Partners e Inventario / Kardex desde el API
  useEffect(() => {
    fetch('/api/business-partners')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setBusinessPartners(data);
        } else {
          setBusinessPartners(getFallbackPartners());
        }
      })
      .catch(err => {
        console.error('Error fetching business partners:', err);
        setBusinessPartners(getFallbackPartners());
      });

    // Cargar Kardex dinámico si está disponible en backend
    fetch('/api/inventario/items')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map(it => ({
            sku: it.sku,
            name: it.name || it.description,
            category: it.category || 'Inventario',
            unitPrice: Number(it.price || it.unitPrice || it.cost || 100),
            stock: Number(it.stock || it.quantity || 10),
            unit: it.unit || 'unidades'
          }));
          // Combinar con servicios base
          setKardexCatalog(prev => {
            const combined = [...mapped];
            DEFAULT_KARDEX.forEach(def => {
              if (!combined.some(c => c.sku === def.sku)) combined.push(def);
            });
            return combined;
          });
        }
      })
      .catch(() => {
        // Fallback predeterminado ya asignado
      });
  }, []);

  const getFallbackPartners = () => [
    { code: 'BP-001', name: 'Distribuidora Comercial del Norte S.A.', type: 'Cliente', contactName: 'María González', email: 'mgonzalez@dcomercial.com', phone: '+503 7890-1234' },
    { code: 'BP-002', name: 'Distribuciones Industriales del Centro S.A.', type: 'Cliente', contactName: 'Carlos Ruiz', email: 'cruiz@distribucionesindustrial.com', phone: '+503 7654-3210' },
    { code: 'BP-003', name: 'Materiales y Fibras Sintéticas S.A.', type: 'Proveedor', contactName: 'John Smith', email: 'jsmith@fibrascorp.com', phone: '+503 7123-4567' },
    { code: 'BP-004', name: 'Transportes Express del Norte', type: 'Fletero', contactName: 'Roberto Méndez', email: 'rmendez@transnorte.com', phone: '+503 7321-9876' },
    { code: 'BP-005', name: 'Químicos y Componentes Globales S.A.', type: 'Proveedor', contactName: 'Laura Vega', email: 'lvega@quimicoscorp.com', phone: '+503 7987-6543' },
    { code: 'BP-006', name: 'Industrias Apex', type: 'Cliente', contactName: 'Roberto Silva', email: 'rsilva@apex.com', phone: '+503 7890-1234' },
    { code: 'BP-007', name: 'Comercializadora del Sur', type: 'Cliente', contactName: 'Luis Gómez', email: 'lgomez@comsur.com', phone: '+503 7123-4567' },
    { code: 'BP-008', name: 'Logistics Pro', type: 'Cliente', contactName: 'Sandra Peña', email: 'spena@logisticspro.com', phone: '+503 7321-9876' },
    { code: 'BP-009', name: 'Almacenes Globales', type: 'Cliente', contactName: 'Guillermo Vega', email: 'gvega@almacenesg.com', phone: '+503 7456-1122' }
  ];

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

    const totalOpenVal = openDeals.reduce((sum, d) => {
      const v = calculateQuoteActiveValue(d.quote, d.stage, d.value);
      return sum + parseVal(v);
    }, 0);
    const totalWonVal = wonDeals.reduce((sum, d) => {
      const v = calculateQuoteActiveValue(d.quote, d.stage, d.value);
      return sum + parseVal(v);
    }, 0);
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
    setPartnerMode('catalog');
    setSelectedPartnerCode('');
    setCreateModalTab('datos');
    setNewDealQuote({
      paymentTerms: 'Contado',
      deliveryMode: 'Entrega en Sucursal',
      deliveryAddress: '',
      items: []
    });
    setNewDealSkuForm({
      selectedSku: '',
      quantity: 1,
      unitPrice: ''
    });
    setFormData({
      title: '',
      company: '',
      partnerCode: '',
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

  // Agregar SKU en la Cotización Inicial al Crear Oportunidad
  const handleAddNewDealSku = (e) => {
    e.preventDefault();
    if (!newDealSkuForm.selectedSku) {
      alert('Por favor seleccione un SKU del Kardex.');
      return;
    }
    const kardexItem = kardexCatalog.find(k => k.sku === newDealSkuForm.selectedSku);
    const qty = parseInt(newDealSkuForm.quantity, 10) || 1;
    const price = parseFloat(newDealSkuForm.unitPrice) || (kardexItem ? kardexItem.unitPrice : 0);

    const newItem = {
      id: Date.now(),
      sku: newDealSkuForm.selectedSku,
      name: kardexItem ? kardexItem.name : newDealSkuForm.selectedSku,
      category: kardexItem ? kardexItem.category : 'General',
      unitPrice: price,
      quantity: qty,
      total: price * qty,
      status: 'cotizado',
      lostReason: null,
      lostNotes: '',
      lostDate: null
    };

    const updatedItems = [...newDealQuote.items, newItem];
    const totalQuote = updatedItems.reduce((acc, it) => acc + (it.unitPrice * it.quantity), 0);

    setNewDealQuote(prev => ({ ...prev, items: updatedItems }));
    setFormData(prev => ({ ...prev, value: String(totalQuote) }));
    setNewDealSkuForm({ selectedSku: '', quantity: 1, unitPrice: '' });
    showToast(`📦 SKU "${newItem.sku}" añadido. Monto estimado actualizado a $${totalQuote.toLocaleString()}`);
  };

  // Eliminar SKU de la Cotización Inicial al Crear Oportunidad
  const handleRemoveNewDealSku = (itemId) => {
    const updatedItems = newDealQuote.items.filter(it => it.id !== itemId);
    const totalQuote = updatedItems.reduce((acc, it) => acc + (it.unitPrice * it.quantity), 0);
    setNewDealQuote(prev => ({ ...prev, items: updatedItems }));
    setFormData(prev => ({ ...prev, value: totalQuote > 0 ? String(totalQuote) : '' }));
  };

  // Selección de un Business Partner del Catálogo
  const handleSelectPartner = (e) => {
    const code = e.target.value;
    setSelectedPartnerCode(code);
    if (!code) {
      setFormData(prev => ({ ...prev, company: '', partnerCode: '' }));
      return;
    }
    const partner = businessPartners.find(p => p.code === code);
    if (partner) {
      setFormData(prev => ({
        ...prev,
        company: partner.name,
        partnerCode: partner.code,
        contact: partner.contactName || prev.contact,
        email: partner.email || prev.email,
        phone: partner.phone || prev.phone
      }));
    }
  };

  // Guardar Nueva Oportunidad
  const handleSaveDeal = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.company.trim()) {
      alert('Por favor ingrese el Título de la Oportunidad y seleccione o escriba la Empresa.');
      return;
    }

    const rawNum = parseInt(String(formData.value).replace(/[^0-9]/g, '') || '0', 10);
    const formattedVal = `$${rawNum.toLocaleString()}`;

    const newDealItem = {
      id: Date.now(),
      title: formData.title.trim(),
      company: formData.company.trim(),
      partnerCode: formData.partnerCode,
      value: formattedVal,
      stage: formData.stage,
      date: formData.date.trim() || '30 Nov',
      priority: formData.priority,
      contact: formData.contact.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      assignedTo: formData.assignedTo,
      notes: formData.notes.trim(),
      activities: [],
      quote: {
        paymentTerms: newDealQuote.paymentTerms,
        deliveryMode: newDealQuote.deliveryMode,
        deliveryAddress: newDealQuote.deliveryAddress,
        items: newDealQuote.items
      }
    };

    setDeals(prev => [newDealItem, ...prev]);
    setIsModalOpen(false);
    showToast(`✅ Oportunidad "${newDealItem.title}" agregada con éxito a la etapa "${newDealItem.stage}".`);
  };

  // Abrir Detalle de Oportunidad (Paso 1 del Manual)
  const handleCardClick = (deal) => {
    const rawQuote = deal.quote || {
      paymentTerms: 'Contado',
      deliveryMode: 'Entrega en Sucursal',
      deliveryAddress: '',
      items: []
    };
    const syncedValue = calculateQuoteActiveValue(rawQuote, deal.stage, deal.value);
    const normalized = {
      ...deal,
      value: syncedValue,
      activities: deal.activities || [],
      quote: rawQuote
    };
    setSelectedDeal(normalized);
    setDeals(prev => prev.map(d => d.id === normalized.id ? normalized : d));
    setDetailTab('actividades');
    setActivityForm({
      contactType: 'Llamada',
      notes: '',
      nextTask: 'Llamada de seguimiento',
      nextTaskDate: ''
    });
    setQuoteForm({
      selectedSku: '',
      quantity: 1,
      unitPrice: ''
    });
    setIsDetailOpen(true);
  };

  // Cambiar Etapa de Oportunidad
  const handleMoveStage = (targetStage) => {
    if (!selectedDeal) return;
    const syncedValue = calculateQuoteActiveValue(selectedDeal.quote, targetStage, selectedDeal.value);
    const updated = { ...selectedDeal, stage: targetStage, value: syncedValue };
    setDeals(prev => prev.map(d => d.id === selectedDeal.id ? updated : d));
    setSelectedDeal(updated);
    
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

  // =========================================================
  // GESTIÓN DE ACTIVIDADES Y SEGUIMIENTO (PASOS 1 A 4 DEL MANUAL)
  // =========================================================
  const handleSaveActivity = (e) => {
    e.preventDefault();
    if (!activityForm.notes.trim()) {
      alert('Paso 3 requerido: Por favor redacte la minuta de acuerdos con el cliente.');
      return;
    }

    const newActivity = {
      id: Date.now(),
      contactType: activityForm.contactType,
      notes: activityForm.notes.trim(),
      nextTask: activityForm.nextTask.trim() || 'Llamada de seguimiento',
      nextTaskDate: activityForm.nextTaskDate || 'Pendiente por definir',
      registeredAt: new Date().toLocaleString('es-SV', { dateStyle: 'short', timeStyle: 'short' }),
      registeredBy: selectedDeal.assignedTo || 'Asesor Comercial'
    };

    const updatedActivities = [newActivity, ...(selectedDeal.activities || [])];
    
    // Actualizar fecha de seguimiento de la tarjeta si se especificó
    let updatedDate = selectedDeal.date;
    if (activityForm.nextTaskDate) {
      try {
        const d = new Date(activityForm.nextTaskDate);
        const day = d.getDate();
        const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        if (!isNaN(day)) {
          updatedDate = `${day} ${monthNames[d.getMonth()]}`;
        }
      } catch (err) {
        // fallback
      }
    }

    const updatedDeal = {
      ...selectedDeal,
      activities: updatedActivities,
      date: updatedDate
    };

    setSelectedDeal(updatedDeal);
    setDeals(prev => prev.map(d => d.id === updatedDeal.id ? updatedDeal : d));

    setActivityForm({
      contactType: 'Llamada',
      notes: '',
      nextTask: 'Llamada de seguimiento',
      nextTaskDate: ''
    });

    showToast(`✅ Pasos 1 al 4 completados: Actividad (${newActivity.contactType}) registrada con éxito.`);
  };

  // =========================================================
  // GESTIÓN DE COTIZACIÓN KARDEX & VENTA PERDIDA
  // =========================================================

  // Resumen financiero de la cotización actual
  const quoteSummary = useMemo(() => {
    if (!selectedDeal || !selectedDeal.quote || !Array.isArray(selectedDeal.quote.items)) {
      return { totalCotizado: 0, totalComprado: 0, totalPerdido: 0, totalPendiente: 0, lostPercent: '0.0', itemsCount: 0, lostCount: 0, purchasedCount: 0 };
    }
    const items = selectedDeal.quote.items;
    let totalCotizado = 0;
    let totalComprado = 0;
    let totalPerdido = 0;
    let totalPendiente = 0;
    let lostCount = 0;
    let purchasedCount = 0;

    items.forEach(it => {
      const sub = (Number(it.unitPrice) || 0) * (Number(it.quantity) || 1);
      totalCotizado += sub;
      if (it.status === 'comprado') {
        totalComprado += sub;
        purchasedCount++;
      } else if (it.status === 'perdido') {
        totalPerdido += sub;
        lostCount++;
      } else {
        totalPendiente += sub;
      }
    });

    const lostPercent = totalCotizado > 0 ? ((totalPerdido / totalCotizado) * 100).toFixed(1) : '0.0';

    return {
      totalCotizado,
      totalComprado,
      totalPerdido,
      totalPendiente,
      lostPercent,
      itemsCount: items.length,
      lostCount,
      purchasedCount
    };
  }, [selectedDeal]);

  // Actualizar condiciones comerciales de la cotización (Crédito/Contado, Entrega)
  const handleUpdateQuoteCondition = (field, value) => {
    if (!selectedDeal) return;
    const currentQuote = selectedDeal.quote || {
      paymentTerms: 'Contado',
      deliveryMode: 'Entrega en Sucursal',
      deliveryAddress: '',
      items: []
    };
    const updatedQuote = { ...currentQuote, [field]: value };
    const updatedDeal = { ...selectedDeal, quote: updatedQuote };
    setSelectedDeal(updatedDeal);
    setDeals(prev => prev.map(d => d.id === updatedDeal.id ? updatedDeal : d));
  };

  // Agregar nuevo SKU del Kardex a la cotización
  const handleAddSkuToQuote = (e) => {
    e.preventDefault();
    if (!quoteForm.selectedSku) {
      alert('Por favor seleccione un SKU de la lista de Kardex.');
      return;
    }

    const kardexItem = kardexCatalog.find(k => k.sku === quoteForm.selectedSku);
    const qty = parseInt(quoteForm.quantity, 10) || 1;
    const price = parseFloat(quoteForm.unitPrice) || (kardexItem ? kardexItem.unitPrice : 0);

    const newItem = {
      id: Date.now(),
      sku: quoteForm.selectedSku,
      name: kardexItem ? kardexItem.name : quoteForm.selectedSku,
      category: kardexItem ? kardexItem.category : 'General',
      unitPrice: price,
      quantity: qty,
      total: price * qty,
      status: 'cotizado', // 'cotizado' | 'comprado' | 'perdido'
      lostReason: null,
      lostNotes: '',
      lostDate: null
    };

    const currentQuote = selectedDeal.quote || {
      paymentTerms: 'Contado',
      deliveryMode: 'Entrega en Sucursal',
      deliveryAddress: '',
      items: []
    };

    const updatedItems = [...(currentQuote.items || []), newItem];
    const updatedQuote = { ...currentQuote, items: updatedItems };
    const syncedValue = calculateQuoteActiveValue(updatedQuote, selectedDeal.stage, selectedDeal.value);
    const updatedDeal = { ...selectedDeal, quote: updatedQuote, value: syncedValue };

    setSelectedDeal(updatedDeal);
    setDeals(prev => prev.map(d => d.id === updatedDeal.id ? updatedDeal : d));

    setQuoteForm({
      selectedSku: '',
      quantity: 1,
      unitPrice: ''
    });

    showToast(`📦 SKU "${newItem.sku}" incorporado a la cotización.`);
  };

  // Marcar SKU como comprado (Compra Parcial o Individual)
  const handleMarkItemPurchased = (itemId) => {
    const currentQuote = selectedDeal.quote || { items: [] };
    const updatedItems = (currentQuote.items || []).map(it => {
      if (it.id === itemId) {
        return { ...it, status: 'comprado', lostReason: null, lostNotes: '', lostDate: null };
      }
      return it;
    });

    const updatedQuote = { ...currentQuote, items: updatedItems };
    const syncedValue = calculateQuoteActiveValue(updatedQuote, selectedDeal.stage, selectedDeal.value);
    const updatedDeal = { ...selectedDeal, quote: updatedQuote, value: syncedValue };

    setSelectedDeal(updatedDeal);
    setDeals(prev => prev.map(d => d.id === updatedDeal.id ? updatedDeal : d));
    showToast(`✅ SKU marcado como COMPRADO.`);
  };

  // Transferir Cotización Aprobada a Módulo 2 (Ventas & Facturación) para emisión de factura por Cajera
  const handleTransferToVentas = async (dealTarget = null, customItems = null) => {
    const deal = dealTarget || selectedDeal;
    if (!deal) return;

    const currentQuote = deal.quote || { items: [] };
    const itemsSource = customItems || currentQuote.items || [];
    
    // Tomar los SKUs comprados/aprobados (o los no perdidos)
    let approvedItems = itemsSource.filter(it => it.status === 'comprado');
    if (approvedItems.length === 0) {
      approvedItems = itemsSource.filter(it => it.status !== 'perdido');
    }

    if (approvedItems.length === 0) {
      alert('No hay SKUs aprobados para generar el pedido en Módulo 2 (Ventas).');
      return;
    }

    setIsTransferringOrder(true);
    try {
      const payload = {
        clientCode: deal.partnerCode || 'BP-001',
        clientName: deal.company || 'Cliente Oportunidad CRM',
        deliveryAddress: deal.quote?.deliveryAddress || (deal.quote?.deliveryMode === 'A Domicilio' ? 'Entrega a Domicilio' : 'Mostrador / Sucursal Central'),
        paymentTerms: deal.quote?.paymentTerms || 'Contado',
        deliveryMode: deal.quote?.deliveryMode === 'A Domicilio' ? 'logistica' : 'mostrador',
        paymentMethod: deal.quote?.paymentTerms?.includes('Crédito') ? 'Crédito en Cuenta' : 'Efectivo',
        status: 'Cotización', // Se registra en Ventas con estado Cotización para revisión y facturación de la Cajera
        originDealId: deal.id,
        originCrmTitle: deal.title,
        items: approvedItems.map(it => ({
          sku: it.sku,
          description: it.name,
          quantity: Number(it.quantity) || 1,
          unitPrice: Number(it.unitPrice) || 0,
          dispatchLocation: (it.name && it.name.toLowerCase().includes('rollo')) || it.category === 'Materia Prima' ? 'Bodega' : 'Caja'
        }))
      };

      const res = await fetch('/api/ventas/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Error al generar la orden en Módulo 2');
      }

      const createdOrder = await res.json();
      const orderCode = createdOrder.orderCode;

      // Registrar actividad automática de auditoría en la minuta
      const newActivity = {
        id: Date.now(),
        contactType: 'Correo',
        notes: `🚀 Cotización autorizada por el cliente. Se originó el Pedido de Venta ${orderCode} en Módulo 2 (Ventas & Facturación) para emisión de factura por Cajera. Monto Total: $${(createdOrder.total || 0).toLocaleString()}.`,
        nextTask: 'Seguimiento a emisión de factura por Cajera en Módulo 2',
        nextTaskDate: new Date().toISOString().split('T')[0],
        registeredAt: new Date().toLocaleString('es-SV', { dateStyle: 'short', timeStyle: 'short' }),
        registeredBy: deal.assignedTo || 'María Asesora'
      };

      const updatedActivities = [newActivity, ...(deal.activities || [])];
      const updatedDeal = {
        ...deal,
        salesOrderCode: orderCode,
        activities: updatedActivities
      };

      setSelectedDeal(updatedDeal);
      setDeals(prev => prev.map(d => d.id === updatedDeal.id ? updatedDeal : d));

      // Sincronizar en tiempo real con cualquier otra pestaña abierta del navegador (ej. Ventas / Cajera)
      try {
        const channel = new BroadcastChannel('nytex_sales_sync');
        channel.postMessage({ type: 'ORDER_CREATED', orderCode });
        channel.close();
      } catch (e) {}
      try {
        localStorage.setItem('nytex_new_order_timestamp', String(Date.now()));
      } catch (e) {}

      showToast(`🎉 ¡Éxito! Pedido ${orderCode} generado en Módulo 2 (Ventas & Facturación). La cajera ya puede emitir la factura.`);
      return createdOrder;
    } catch (error) {
      console.error('Error transfiriendo orden a Ventas:', error);
      alert('Error al transferir cotización a Ventas: ' + error.message);
    } finally {
      setIsTransferringOrder(false);
    }
  };

  // Comprar TODOS los SKUs de la cotización y transferir automáticamente a Módulo 2
  const handlePurchaseAllItems = async () => {
    const currentQuote = selectedDeal.quote || { items: [] };
    if (!currentQuote.items || currentQuote.items.length === 0) {
      alert('No hay SKUs en la cotización para comprar.');
      return;
    }

    const updatedItems = currentQuote.items.map(it => ({
      ...it,
      status: 'comprado',
      lostReason: null,
      lostNotes: '',
      lostDate: null
    }));

    const updatedQuote = { ...currentQuote, items: updatedItems };
    const syncedValue = calculateQuoteActiveValue(updatedQuote, 'Ganado', selectedDeal.value);
    const updatedDeal = { ...selectedDeal, quote: updatedQuote, stage: 'Ganado', value: syncedValue };

    setSelectedDeal(updatedDeal);
    setDeals(prev => prev.map(d => d.id === updatedDeal.id ? updatedDeal : d));
    
    // Transferir automáticamente la orden al Módulo 2 de Ventas
    await handleTransferToVentas(updatedDeal, updatedItems);
  };

  // Abrir Modal para Registrar Venta Perdida (Eliminar SKU o Rechazar Toda la Cotización)
  const handleOpenLostSaleModal = (target) => {
    // target: objeto item | 'ALL'
    setLostSaleModal({
      isOpen: true,
      targetItem: target,
      reason: LOST_SALE_REASONS[0],
      notes: ''
    });
  };

  // Confirmar Registro de Venta Perdida con uno de los 5 motivos obligatorios
  const handleConfirmLostSale = () => {
    const { targetItem, reason, notes } = lostSaleModal;
    const nowStr = new Date().toLocaleString('es-SV', { dateStyle: 'short', timeStyle: 'short' });
    const currentQuote = selectedDeal.quote || { items: [] };

    let updatedItems = [];
    if (targetItem === 'ALL') {
      // Rechazar toda la cotización
      updatedItems = (currentQuote.items || []).map(it => {
        if (it.status !== 'comprado') {
          return {
            ...it,
            status: 'perdido',
            lostReason: reason,
            lostNotes: notes || 'Cotización rechazada en su totalidad por el cliente.',
            lostDate: nowStr
          };
        }
        return it;
      });
      showToast(`📉 Toda la cotización fue registrada como VENTA PERDIDA (${reason}).`);
    } else {
      // Descartar un SKU específico
      updatedItems = (currentQuote.items || []).map(it => {
        if (it.id === targetItem.id) {
          return {
            ...it,
            status: 'perdido',
            lostReason: reason,
            lostNotes: notes,
            lostDate: nowStr
          };
        }
        return it;
      });
      showToast(`📉 SKU "${targetItem.sku}" registrado como VENTA PERDIDA (${reason}).`);
    }

    const updatedQuote = { ...currentQuote, items: updatedItems };
    const syncedValue = calculateQuoteActiveValue(updatedQuote, selectedDeal.stage, selectedDeal.value);
    const updatedDeal = { ...selectedDeal, quote: updatedQuote, value: syncedValue };

    setSelectedDeal(updatedDeal);
    setDeals(prev => prev.map(d => d.id === updatedDeal.id ? updatedDeal : d));

    setLostSaleModal({
      isOpen: false,
      targetItem: null,
      reason: LOST_SALE_REASONS[0],
      notes: ''
    });
  };

  // Restaurar SKU a estado Cotizado / Pendiente
  const handleRestoreItem = (itemId) => {
    const currentQuote = selectedDeal.quote || { items: [] };
    const updatedItems = (currentQuote.items || []).map(it => {
      if (it.id === itemId) {
        return { ...it, status: 'cotizado', lostReason: null, lostNotes: '', lostDate: null };
      }
      return it;
    });

    const updatedQuote = { ...currentQuote, items: updatedItems };
    const syncedValue = calculateQuoteActiveValue(updatedQuote, selectedDeal.stage, selectedDeal.value);
    const updatedDeal = { ...selectedDeal, quote: updatedQuote, value: syncedValue };

    setSelectedDeal(updatedDeal);
    setDeals(prev => prev.map(d => d.id === updatedDeal.id ? updatedDeal : d));
    showToast(`↩️ SKU restaurado a estado "Cotizado".`);
  };

  // Sincronizar monto estimado de la oportunidad con la cotización
  const handleSyncDealValue = () => {
    if (!selectedDeal) return;
    const syncedValue = calculateQuoteActiveValue(selectedDeal.quote, selectedDeal.stage, selectedDeal.value);
    const updatedDeal = { ...selectedDeal, value: syncedValue };
    setSelectedDeal(updatedDeal);
    setDeals(prev => prev.map(d => d.id === updatedDeal.id ? updatedDeal : d));
    showToast(`🔄 Monto de la oportunidad sincronizado a ${syncedValue} según cotización activa.`);
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
                      <p className="text-xs text-gray-500 mb-3 flex items-center">
                        <i className="far fa-building mr-1.5 text-gray-400"></i>
                        <span>{deal.company}</span>
                        {deal.partnerCode && (
                          <span className="ml-1.5 bg-blue-50 text-[#006EAD] text-[9px] font-bold px-1.5 py-0.2 rounded border border-blue-200">
                            {deal.partnerCode}
                          </span>
                        )}
                      </p>
                      
                      <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                        <span className="font-extrabold text-[#006EAD] text-sm">
                          {calculateQuoteActiveValue(deal.quote, deal.stage, deal.value)}
                        </span>
                        <div className="flex items-center text-gray-400 text-xs">
                          <i className="far fa-clock mr-1"></i>
                          <span>{deal.date}</span>
                        </div>
                      </div>

                      {/* Chips indicadores: Actividades, Cotización y Venta Perdida */}
                      {((deal.activities && deal.activities.length > 0) || (deal.quote && deal.quote.items && deal.quote.items.length > 0)) && (
                        <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t border-gray-100">
                          {deal.activities && deal.activities.length > 0 && (
                            <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100 flex items-center">
                              <i className="fas fa-history mr-1 text-[9px]"></i>{deal.activities.length} act.
                            </span>
                          )}
                          {deal.quote && deal.quote.items && deal.quote.items.length > 0 && (
                            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 flex items-center">
                              <i className="fas fa-boxes mr-1 text-[9px]"></i>{deal.quote.items.length} SKUs
                            </span>
                          )}
                          {deal.salesOrderCode && (
                            <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200 flex items-center" title={`Pedido ${deal.salesOrderCode} en Módulo 2`}>
                              <i className="fas fa-receipt mr-1 text-[9px]"></i>{deal.salesOrderCode}
                            </span>
                          )}
                          {deal.quote && deal.quote.items && deal.quote.items.some(i => i.status === 'perdido') && (
                            <span className="text-[10px] font-semibold text-red-700 bg-red-50 px-1.5 py-0.5 rounded border border-red-100 flex items-center">
                              <i className="fas fa-exclamation-triangle mr-1 text-[9px]"></i>Venta perdida
                            </span>
                          )}
                        </div>
                      )}
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
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col max-h-[92vh] overflow-hidden animate-fadeIn border border-gray-100">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-[#0A2540] text-white shrink-0">
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

            {/* Pestañas del Modal de Creación */}
            <div className="flex border-b border-gray-200 bg-slate-50 px-6 shrink-0 text-xs font-bold">
              <button
                type="button"
                onClick={() => setCreateModalTab('datos')}
                className={`py-2.5 px-4 border-b-2 flex items-center space-x-2 transition ${
                  createModalTab === 'datos'
                    ? 'border-[#006EAD] text-[#006EAD] bg-white'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                <i className="fas fa-file-alt"></i>
                <span>1. Datos del Proyecto y Cliente</span>
              </button>
              <button
                type="button"
                onClick={() => setCreateModalTab('cotizacion')}
                className={`py-2.5 px-4 border-b-2 flex items-center space-x-2 transition ${
                  createModalTab === 'cotizacion'
                    ? 'border-[#006EAD] text-[#006EAD] bg-white'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                <i className="fas fa-boxes"></i>
                <span>2. Cotización Kardex (SKUs, Crédito/Contado, Entrega)</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  newDealQuote.items.length > 0 ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-700'
                }`}>
                  {newDealQuote.items.length}
                </span>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveDeal} className="p-6 overflow-y-auto space-y-4 text-sm flex-1">
              {createModalTab === 'datos' && (
                <>
              {/* Sección 1: Título y Monto */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Título de la Oportunidad / Proyecto <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Venta de ERP Fase 4 o Implementación CRM"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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

              {/* Sección 2: EMPRESA / RAZÓN SOCIAL CON PESTAÑAS (BUSINESS PARTNERS vs MANUAL) */}
              <div className="bg-slate-50 p-4 rounded-xl border border-gray-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <span className="block text-xs font-bold text-gray-700 uppercase">
                      Empresa / Razón Social <span className="text-red-500">*</span>
                    </span>
                    <span className="text-[11px] text-gray-500">Seleccione del catálogo o capture un prospecto nuevo</span>
                  </div>
                  
                  {/* Selector de Pestañas */}
                  <div className="inline-flex bg-gray-200/90 p-1 rounded-lg text-xs font-bold self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setPartnerMode('catalog')}
                      className={`px-3 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                        partnerMode === 'catalog'
                          ? 'bg-[#006EAD] text-white shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <i className="fas fa-address-book text-[11px]"></i>
                      <span>Business Partners</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPartnerMode('manual');
                        setSelectedPartnerCode('');
                      }}
                      className={`px-3 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                        partnerMode === 'manual'
                          ? 'bg-[#006EAD] text-white shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <i className="fas fa-pen text-[11px]"></i>
                      <span>Escribir Manual</span>
                    </button>
                  </div>
                </div>

                {/* Vista Pestaña 1: Catálogo de Business Partners */}
                {partnerMode === 'catalog' ? (
                  <div className="space-y-2">
                    <select
                      value={selectedPartnerCode}
                      onChange={handleSelectPartner}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#006EAD] text-sm font-medium"
                    >
                      <option value="">-- Seleccionar Socio de Negocio registrado en NyTEX --</option>
                      {businessPartners.map(bp => (
                        <option key={bp.code} value={bp.code}>
                          [{bp.code}] {bp.name} — ({bp.type || 'Socio'})
                        </option>
                      ))}
                    </select>

                    {selectedPartnerCode ? (
                      <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-lg text-xs text-emerald-800">
                        <div className="flex items-center gap-2">
                          <i className="fas fa-check-circle text-emerald-600 text-sm"></i>
                          <span>
                            Socio Vinculado: <strong>{formData.company}</strong> [{selectedPartnerCode}] • Datos de contacto sincronizados.
                          </span>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => { setSelectedPartnerCode(''); setFormData({ ...formData, company: '', partnerCode: '' }); }}
                          className="text-emerald-700 hover:text-emerald-950 font-bold underline ml-2 text-[11px]"
                        >
                          Limpiar
                        </button>
                      </div>
                    ) : (
                      <p className="text-[11px] text-gray-500 italic flex items-center gap-1.5">
                        <i className="fas fa-info-circle text-[#006EAD]"></i>
                        <span>Al seleccionar un socio, se completarán automáticamente el nombre de la empresa, contacto, correo y teléfono.</span>
                      </p>
                    )}
                  </div>
                ) : (
                  /* Vista Pestaña 2: Escribir Manualmente */
                  <div>
                    <input
                      type="text"
                      required={partnerMode === 'manual'}
                      placeholder="Escriba el nombre de la empresa / razón social del nuevo prospecto..."
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value, partnerCode: '' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006EAD] text-sm bg-white"
                    />
                    <p className="text-[11px] text-blue-700 mt-1.5 flex items-center gap-1.5">
                      <i className="fas fa-user-plus text-[#006EAD]"></i>
                      <span><strong>Prospecto Nuevo:</strong> No registrado en catálogo. Podrá ser promovido a Business Partner al cerrar la venta.</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Sección 3: Configuración del Pipeline */}
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
                    placeholder="Ej. 30 Nov"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006EAD] text-sm"
                  />
                </div>
              </div>

              {/* Sección 4: Contacto y Responsable */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-gray-100">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Contacto Principal
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Juan Pérez"
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
                    placeholder="perez@empresa.com"
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

              {/* Sección 5: Notas / Calificación BANT */}
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

                </>
              )}

              {createModalTab === 'cotizacion' && (
                <div className="space-y-4">
                  <div className="bg-blue-50/70 p-3.5 rounded-xl border border-blue-200 text-xs text-blue-900">
                    <span className="font-bold block uppercase text-[10px] text-[#006EAD]">
                      Cotización Inicial Completa (Kardex & Condiciones Comerciales)
                    </span>
                    <p className="mt-0.5">
                      Defina los SKUs solicitados por el prospecto, si es a <strong>Crédito o Contado</strong>, y si se entrega en <strong>Sucursal o a Domicilio</strong>. El monto total de venta se calculará automáticamente.
                    </p>
                  </div>

                  {/* Condiciones Comerciales */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-3.5 rounded-xl border border-gray-200">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                        Condición de Pago
                      </label>
                      <select
                        value={newDealQuote.paymentTerms}
                        onChange={(e) => setNewDealQuote(prev => ({ ...prev, paymentTerms: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-bold bg-white"
                      >
                        <option value="Contado">💵 Contado</option>
                        <option value="Crédito 15 días">💳 Crédito 15 días</option>
                        <option value="Crédito 30 días">💳 Crédito 30 días</option>
                        <option value="Crédito 60 días">💳 Crédito 60 días</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                        Tipo de Entrega
                      </label>
                      <select
                        value={newDealQuote.deliveryMode}
                        onChange={(e) => setNewDealQuote(prev => ({ ...prev, deliveryMode: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-bold bg-white"
                      >
                        <option value="Entrega en Sucursal">🏢 Entrega en Sucursal</option>
                        <option value="A Domicilio">🚚 A Domicilio</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                        Dirección de Despacho
                      </label>
                      <input
                        type="text"
                        placeholder={newDealQuote.deliveryMode === 'A Domicilio' ? 'Ingresar dirección...' : 'N/A - Sucursal'}
                        value={newDealQuote.deliveryAddress}
                        onChange={(e) => setNewDealQuote(prev => ({ ...prev, deliveryAddress: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  {/* Formulario Agregar SKU del Kardex */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-gray-200 space-y-3">
                    <h5 className="font-bold text-gray-800 text-xs uppercase tracking-wider flex items-center">
                      <i className="fas fa-cart-plus mr-1.5 text-[#006EAD]"></i>
                      Incorporar SKU del Kardex a la Propuesta
                    </h5>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                      <div className="sm:col-span-6">
                        <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                          Producto / Servicio (Kardex)
                        </label>
                        <select
                          value={newDealSkuForm.selectedSku}
                          onChange={(e) => {
                            const val = e.target.value;
                            const found = kardexCatalog.find(k => k.sku === val);
                            setNewDealSkuForm(prev => ({
                              ...prev,
                              selectedSku: val,
                              unitPrice: found ? found.unitPrice : ''
                            }));
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs bg-white font-medium"
                        >
                          <option value="">-- Seleccionar SKU del Kardex --</option>
                          {kardexCatalog.map(k => (
                            <option key={k.sku} value={k.sku}>
                              [{k.sku}] {k.name} • Stock: {k.stock} • (${k.unitPrice})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                          Cantidad
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={newDealSkuForm.quantity}
                          onChange={(e) => setNewDealSkuForm(prev => ({ ...prev, quantity: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-bold text-center"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                          P. Unitario ($)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={newDealSkuForm.unitPrice}
                          onChange={(e) => setNewDealSkuForm(prev => ({ ...prev, unitPrice: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-bold"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <button
                          type="button"
                          onClick={handleAddNewDealSku}
                          className="w-full py-2 px-3 bg-[#006EAD] hover:bg-[#005587] text-white rounded-lg font-bold text-xs shadow-xs transition"
                        >
                          + Agregar SKU
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Tabla de SKUs de la nueva oportunidad */}
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="px-4 py-2.5 bg-slate-50 border-b border-gray-200 flex justify-between items-center text-xs font-bold text-gray-700">
                      <span>SKUs Cotizados ({newDealQuote.items.length})</span>
                      <span className="text-[#006EAD] font-black text-sm">
                        Total: ${newDealQuote.items.reduce((acc, it) => acc + (it.unitPrice * it.quantity), 0).toLocaleString()}
                      </span>
                    </div>

                    {newDealQuote.items.length === 0 ? (
                      <div className="p-6 text-center text-gray-400 text-xs">
                        No ha agregado SKUs aún. Puede agregarlos ahora o posterior al crear la oportunidad.
                      </div>
                    ) : (
                      <table className="w-full text-xs text-left">
                        <thead className="bg-gray-50 text-gray-600 font-bold text-[10px] uppercase">
                          <tr>
                            <th className="p-2.5">SKU & Nombre</th>
                            <th className="p-2.5 text-center">Cant.</th>
                            <th className="p-2.5 text-right">P. Unit.</th>
                            <th className="p-2.5 text-right">Subtotal</th>
                            <th className="p-2.5 text-center">Quitar</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {newDealQuote.items.map(it => (
                            <tr key={it.id}>
                              <td className="p-2.5">
                                <span className="font-mono font-bold text-gray-900 bg-gray-100 px-1 py-0.5 rounded text-[10px] mr-1.5">
                                  {it.sku}
                                </span>
                                <span className="font-semibold text-gray-800">{it.name}</span>
                              </td>
                              <td className="p-2.5 text-center font-bold">{it.quantity}</td>
                              <td className="p-2.5 text-right">${Number(it.unitPrice).toLocaleString()}</td>
                              <td className="p-2.5 text-right font-black text-[#006EAD]">${(it.unitPrice * it.quantity).toLocaleString()}</td>
                              <td className="p-2.5 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveNewDealSku(it.id)}
                                  className="text-red-500 hover:text-red-700 font-bold p-1"
                                >
                                  ✕
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>

                </div>
              )}

              {/* Botones de Acción */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <div>
                  {createModalTab === 'datos' ? (
                    <button
                      type="button"
                      onClick={() => setCreateModalTab('cotizacion')}
                      className="text-xs text-[#006EAD] hover:underline font-bold flex items-center space-x-1"
                    >
                      <span>Ir a Cotización Kardex (Opcional)</span>
                      <i className="fas fa-arrow-right text-[10px]"></i>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setCreateModalTab('datos')}
                      className="text-xs text-gray-600 hover:underline font-bold flex items-center space-x-1"
                    >
                      <i className="fas fa-arrow-left text-[10px]"></i>
                      <span>Volver a Datos Generales</span>
                    </button>
                  )}
                </div>

                <div className="flex space-x-3">
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
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: DETALLE, ACTIVIDADES, COTIZACIÓN KARDEX & AUDITORÍA*/}
      {/* ========================================================= */}
      {isDetailOpen && selectedDeal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3 md:p-6 overflow-hidden">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[94vh] flex flex-col overflow-hidden animate-fadeIn border border-gray-100">
            
            {/* Modal Header */}
            <div className="px-6 py-3.5 border-b border-gray-200 flex justify-between items-center bg-[#0A2540] text-white shrink-0">
              <div className="flex items-center space-x-3">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${getPriorityColor(selectedDeal.priority)}`}>
                  {selectedDeal.priority}
                </span>
                <div>
                  <h3 className="text-base font-bold leading-tight">{selectedDeal.title}</h3>
                  <p className="text-xs text-blue-200 flex items-center mt-0.5">
                    <i className="far fa-building mr-1.5"></i>
                    <span>{selectedDeal.company}</span>
                    {selectedDeal.partnerCode && (
                      <span className="ml-2 bg-blue-400/30 text-blue-100 text-[10px] font-bold px-1.5 py-0.2 rounded">
                        {selectedDeal.partnerCode}
                      </span>
                    )}
                    {selectedDeal.salesOrderCode && (
                      <span className="ml-2 bg-purple-500/40 text-purple-200 border border-purple-300/40 text-[10px] font-bold px-2 py-0.5 rounded flex items-center">
                        <i className="fas fa-receipt mr-1"></i>
                        Pedido {selectedDeal.salesOrderCode} (Ventas)
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsDetailOpen(false)}
                className="text-gray-300 hover:text-white text-xl font-bold p-1 leading-none transition"
              >
                ✕
              </button>
            </div>

            {/* Barra Superior de Resumen y Control de Etapa */}
            <div className="bg-slate-100/90 px-6 py-3 border-b border-gray-200 shrink-0 space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-white p-2 rounded-lg border border-gray-200 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 font-bold uppercase text-[10px] block">Monto Estimado</span>
                    {selectedDeal.quote?.items?.length > 0 && (
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded flex items-center">
                        <i className="fas fa-check mr-1 text-[8px]"></i>Auto
                      </span>
                    )}
                  </div>
                  <span className="text-base font-black text-[#006EAD]">
                    {calculateQuoteActiveValue(selectedDeal.quote, selectedDeal.stage, selectedDeal.value)}
                  </span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-gray-200 shadow-xs">
                  <span className="text-gray-400 font-bold uppercase text-[10px] block">Próx. Seguimiento</span>
                  <span className="text-xs font-bold text-gray-800 flex items-center mt-1">
                    <i className="far fa-clock mr-1 text-[#006EAD]"></i>{selectedDeal.date}
                  </span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-gray-200 shadow-xs">
                  <span className="text-gray-400 font-bold uppercase text-[10px] block">Contacto</span>
                  <span className="text-xs font-semibold text-gray-800 truncate block mt-1" title={selectedDeal.contact}>
                    {selectedDeal.contact || 'No especificado'}
                  </span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-gray-200 shadow-xs">
                  <span className="text-gray-400 font-bold uppercase text-[10px] block">Asesor Asignado</span>
                  <span className="text-xs font-semibold text-gray-800 truncate block mt-1" title={selectedDeal.assignedTo}>
                    {selectedDeal.assignedTo || 'María Asesora'}
                  </span>
                </div>
              </div>

              {/* Selector de Etapa del Embudo */}
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wider shrink-0">
                  Avanzar Etapa:
                </span>
                <div className="grid grid-cols-5 gap-1.5 flex-1">
                  {stages.map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleMoveStage(st)}
                      className={`px-2 py-1.5 rounded-lg text-xs font-bold transition text-center border ${
                        selectedDeal.stage === st 
                          ? 'bg-[#006EAD] text-white border-[#006EAD] shadow-xs' 
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Pestañas de Navegación del Modal */}
            <div className="flex border-b border-gray-200 bg-white px-6 shrink-0 text-xs font-bold">
              <button
                type="button"
                onClick={() => setDetailTab('actividades')}
                className={`py-3 px-4 border-b-2 flex items-center space-x-2 transition ${
                  detailTab === 'actividades'
                    ? 'border-[#006EAD] text-[#006EAD] bg-blue-50/50'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                <i className="fas fa-calendar-check"></i>
                <span>Seguimiento y Actividades (Manual Pasos 1-4)</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  detailTab === 'actividades' ? 'bg-[#006EAD] text-white' : 'bg-gray-200 text-gray-700'
                }`}>
                  {selectedDeal.activities?.length || 0}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setDetailTab('cotizacion')}
                className={`py-3 px-4 border-b-2 flex items-center space-x-2 transition ${
                  detailTab === 'cotizacion'
                    ? 'border-[#006EAD] text-[#006EAD] bg-blue-50/50'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                <i className="fas fa-boxes"></i>
                <span>Cotización (Kardex) & Compra Parcial/Total</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  detailTab === 'cotizacion' ? 'bg-[#006EAD] text-white' : 'bg-gray-200 text-gray-700'
                }`}>
                  {selectedDeal.quote?.items?.length || 0}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setDetailTab('venta_perdida')}
                className={`py-3 px-4 border-b-2 flex items-center space-x-2 transition ${
                  detailTab === 'venta_perdida'
                    ? 'border-red-600 text-red-600 bg-red-50/50'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                <i className="fas fa-chart-pie"></i>
                <span>Rastro & Auditoría Venta Perdida</span>
                {quoteSummary.lostCount > 0 && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-red-500 text-white font-bold animate-pulse">
                    {quoteSummary.lostCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setDetailTab('info')}
                className={`py-3 px-4 border-b-2 flex items-center space-x-2 transition ${
                  detailTab === 'info'
                    ? 'border-[#006EAD] text-[#006EAD] bg-blue-50/50'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                <i className="fas fa-info-circle"></i>
                <span>Datos Generales</span>
              </button>
            </div>

            {/* Contenido de la Pestaña Activa */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/60 text-sm">
              
              {/* ======================================================== */}
              {/* PESTAÑA 1: REGISTRO DE ACTIVIDADES (PASOS 1 AL 4 MANUAL) */}
              {/* ======================================================== */}
              {detailTab === 'actividades' && (
                <div className="space-y-6">
                  
                  {/* Banner Explicativo Oficial del Manual */}
                  <div className="bg-gradient-to-r from-blue-900 to-[#006EAD] text-white p-4 rounded-xl shadow-xs">
                    <div className="flex items-center space-x-2 mb-1">
                      <i className="fas fa-book-reader text-yellow-300"></i>
                      <h4 className="font-bold text-sm">Flujo Oficial: Pasos para Registrar Actividades (Manual NyTEX CRM)</h4>
                    </div>
                    <p className="text-xs text-blue-100">
                      Cumplimiento de los 4 pasos para registro oportuno en el expediente: Selección de canal, redacción de acuerdos y programación obligatoria de la siguiente interacción.
                    </p>
                  </div>

                  {/* Formulario de Pasos 1 al 4 */}
                  <form onSubmit={handleSaveActivity} className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-5">
                    
                    {/* Paso 1: Abrir la Oportunidad (Confirmación de contexto activo) */}
                    <div className="bg-blue-50/70 border border-blue-200 rounded-lg p-3 flex items-center justify-between text-xs text-blue-900">
                      <div className="flex items-center space-x-2">
                        <span className="w-5 h-5 rounded-full bg-[#006EAD] text-white flex items-center justify-center font-bold text-[11px]">1</span>
                        <span className="font-bold">Paso 1: Oportunidad Abierta:</span>
                        <span className="text-gray-700">{selectedDeal.title} • {selectedDeal.company}</span>
                      </div>
                      <span className="bg-blue-200/60 text-[#006EAD] font-bold px-2 py-0.5 rounded text-[10px]">
                        Etapa: {selectedDeal.stage}
                      </span>
                    </div>

                    {/* Paso 2: Seleccionar Tipo de Contacto */}
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="w-5 h-5 rounded-full bg-[#006EAD] text-white flex items-center justify-center font-bold text-[11px]">2</span>
                        <label className="font-bold text-gray-800 text-xs uppercase tracking-wider">
                          Paso 2: Seleccionar Tipo de Contacto <span className="text-red-500">*</span>
                        </label>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                        {CONTACT_TYPES.map(ct => {
                          const isSelected = activityForm.contactType === ct.id;
                          return (
                            <button
                              key={ct.id}
                              type="button"
                              onClick={() => setActivityForm(prev => ({ ...prev, contactType: ct.id }))}
                              className={`p-2.5 rounded-xl border text-xs font-bold transition flex flex-col items-center justify-center space-y-1.5 text-center ${
                                isSelected 
                                  ? 'bg-[#006EAD] text-white border-[#006EAD] shadow-md ring-2 ring-blue-300' 
                                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                              }`}
                            >
                              <i className={`${ct.icon} text-base ${isSelected ? 'text-white' : 'text-[#006EAD]'}`}></i>
                              <span className="text-[11px] leading-tight">{ct.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Paso 3: Redactar Minuta de Acuerdos */}
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="w-5 h-5 rounded-full bg-[#006EAD] text-white flex items-center justify-center font-bold text-[11px]">3</span>
                        <label className="font-bold text-gray-800 text-xs uppercase tracking-wider">
                          Paso 3: Redactar Minuta de Acuerdos y Solicitudes <span className="text-red-500">*</span>
                        </label>
                      </div>
                      <textarea
                        required
                        rows="3"
                        value={activityForm.notes}
                        onChange={(e) => setActivityForm(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Escriba un resumen de los puntos acordados, compromisos adquiridos y solicitudes específicas del cliente..."
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006EAD] text-xs bg-slate-50/50"
                      ></textarea>
                    </div>

                    {/* Paso 4: Programar Siguiente Tarea */}
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="w-5 h-5 rounded-full bg-[#006EAD] text-white flex items-center justify-center font-bold text-[11px]">4</span>
                        <label className="font-bold text-gray-800 text-xs uppercase tracking-wider">
                          Paso 4: Programar Siguiente Tarea (Fecha y Hora) <span className="text-red-500">*</span>
                        </label>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                            Acción o Tarea de Seguimiento
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Ej. Llamada de seguimiento o envío de cotización ajustada"
                            value={activityForm.nextTask}
                            onChange={(e) => setActivityForm(prev => ({ ...prev, nextTask: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006EAD] text-xs"
                          />
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {['Llamada de seguimiento', 'Envío de cotización ajustada', 'Reunión de demostración', 'Revisión de muestras'].map(sug => (
                              <button
                                key={sug}
                                type="button"
                                onClick={() => setActivityForm(prev => ({ ...prev, nextTask: sug }))}
                                className="text-[10px] bg-gray-100 hover:bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded transition"
                              >
                                {sug}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                            Fecha y Hora Programada
                          </label>
                          <input
                            type="datetime-local"
                            required
                            value={activityForm.nextTaskDate}
                            onChange={(e) => setActivityForm(prev => ({ ...prev, nextTaskDate: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006EAD] text-xs font-semibold text-gray-800"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Botón de Guardado de Actividad */}
                    <div className="flex justify-end pt-2 border-t border-gray-100">
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-[#006EAD] hover:bg-[#005587] text-white rounded-xl font-bold shadow-md transition flex items-center space-x-2 text-xs"
                      >
                        <i className="fas fa-check-circle"></i>
                        <span>Registrar Actividad en Bitácora</span>
                      </button>
                    </div>

                  </form>

                  {/* Historial / Bitácora de Actividades Registradas */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider flex items-center">
                        <i className="fas fa-history mr-1.5 text-[#006EAD]"></i>
                        Historial y Bitácora de Interacciones ({selectedDeal.activities?.length || 0})
                      </h4>
                      <span className="text-[11px] text-gray-400">Orden cronológico</span>
                    </div>

                    {(!selectedDeal.activities || selectedDeal.activities.length === 0) ? (
                      <div className="bg-white p-6 rounded-xl border border-dashed border-gray-300 text-center text-gray-400 text-xs">
                        <i className="far fa-comments text-2xl mb-1 text-gray-300 block"></i>
                        Aún no se han registrado actividades para esta oportunidad.<br/>
                        Utilice el formulario superior para completar los 4 pasos descritos en el manual.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {selectedDeal.activities.map(act => {
                          const contactObj = CONTACT_TYPES.find(c => c.id === act.contactType) || CONTACT_TYPES[0];
                          return (
                            <div key={act.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs hover:border-gray-300 transition space-y-2">
                              <div className="flex justify-between items-start">
                                <div className="flex items-center space-x-2">
                                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold border flex items-center ${contactObj.bg}`}>
                                    <i className={`${contactObj.icon} mr-1`}></i>
                                    {act.contactType}
                                  </span>
                                  <span className="text-gray-400 text-xs">•</span>
                                  <span className="text-xs font-semibold text-gray-700">{act.registeredBy}</span>
                                </div>
                                <span className="text-[11px] text-gray-400">{act.registeredAt}</span>
                              </div>

                              <p className="text-xs text-gray-800 bg-slate-50 p-2.5 rounded-lg border border-gray-100 whitespace-pre-wrap leading-relaxed">
                                {act.notes}
                              </p>

                              {act.nextTask && (
                                <div className="bg-blue-50/60 border border-blue-100 p-2 rounded-lg text-xs text-blue-900 flex items-center justify-between">
                                  <span className="font-semibold flex items-center">
                                    <i className="far fa-clock mr-1.5 text-[#006EAD]"></i>
                                    Próxima Tarea: {act.nextTask}
                                  </span>
                                  <span className="font-bold text-[11px] bg-white px-2 py-0.5 rounded text-[#006EAD] border border-blue-200">
                                    {act.nextTaskDate}
                                  </span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* ======================================================== */}
              {/* PESTAÑA 2: COTIZACIÓN COMPLETA KARDEX & COMPRA PARCIAL   */}
              {/* ======================================================== */}
              {detailTab === 'cotizacion' && (
                <div className="space-y-6">
                  
                  {/* Encabezado y Condiciones Comerciales */}
                  <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs space-y-4">
                    <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                      <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider flex items-center">
                        <i className="fas fa-file-invoice-dollar mr-1.5 text-[#006EAD]"></i>
                        Condiciones Comerciales de la Cotización
                      </h4>
                      <span className="text-[11px] font-semibold text-gray-500">Módulo 1 CRM • Origen de Pedido</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                          Condición de Pago <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={selectedDeal.quote?.paymentTerms || 'Contado'}
                          onChange={(e) => handleUpdateQuoteCondition('paymentTerms', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006EAD] text-xs font-bold bg-white"
                        >
                          <option value="Contado">💵 Contado (Pago Inmediato)</option>
                          <option value="Crédito 15 días">💳 Crédito 15 días</option>
                          <option value="Crédito 30 días">💳 Crédito 30 días</option>
                          <option value="Crédito 60 días">💳 Crédito 60 días</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                          Tipo de Entrega <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={selectedDeal.quote?.deliveryMode || 'Entrega en Sucursal'}
                          onChange={(e) => handleUpdateQuoteCondition('deliveryMode', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006EAD] text-xs font-bold bg-white"
                        >
                          <option value="Entrega en Sucursal">🏢 Entrega en Sucursal (Mostrador)</option>
                          <option value="A Domicilio">🚚 A Domicilio (Logística / Flete)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                          Dirección de Despacho
                        </label>
                        <input
                          type="text"
                          placeholder={selectedDeal.quote?.deliveryMode === 'A Domicilio' ? 'Ingresar dirección exacta...' : 'N/A - Retira en sucursal'}
                          value={selectedDeal.quote?.deliveryAddress || ''}
                          onChange={(e) => handleUpdateQuoteCondition('deliveryAddress', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006EAD] text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Resumen Financiero y KPIs de Cotización */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-xs">
                      <span className="text-gray-400 font-bold uppercase text-[10px] block">Total Cotizado</span>
                      <span className="text-lg font-black text-gray-900">${quoteSummary.totalCotizado.toLocaleString()}</span>
                      <span className="text-[10px] text-gray-500 block">{quoteSummary.itemsCount} SKUs cotizados</span>
                    </div>

                    <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 shadow-xs">
                      <span className="text-emerald-700 font-bold uppercase text-[10px] block">Comprado / Aprobado</span>
                      <span className="text-lg font-black text-emerald-800">${quoteSummary.totalComprado.toLocaleString()}</span>
                      <span className="text-[10px] text-emerald-600 block">{quoteSummary.purchasedCount} SKUs ganados</span>
                    </div>

                    <div className="bg-red-50 p-3 rounded-xl border border-red-200 shadow-xs">
                      <span className="text-red-700 font-bold uppercase text-[10px] block">Venta Perdida</span>
                      <span className="text-lg font-black text-red-800">${quoteSummary.totalPerdido.toLocaleString()}</span>
                      <span className="text-[10px] text-red-600 font-bold block">{quoteSummary.lostPercent}% del total cotizado</span>
                    </div>

                    <div className="bg-blue-50 p-3 rounded-xl border border-blue-200 shadow-xs">
                      <span className="text-blue-700 font-bold uppercase text-[10px] block">Pendiente / Abierto</span>
                      <span className="text-lg font-black text-[#006EAD]">${quoteSummary.totalPendiente.toLocaleString()}</span>
                      <span className="text-[10px] text-emerald-700 font-bold flex items-center mt-1">
                        <i className="fas fa-check-circle mr-1 text-emerald-600"></i>Sincronizado con Oportunidad
                      </span>
                    </div>
                  </div>

                  {/* Formulario Agregar SKU del Kardex */}
                  <form onSubmit={handleAddSkuToQuote} className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs space-y-3">
                    <h5 className="font-bold text-gray-800 text-xs uppercase tracking-wider flex items-center">
                      <i className="fas fa-plus-circle mr-1.5 text-[#006EAD]"></i>
                      Agregar Productos o Servicios del Kardex
                    </h5>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                      <div className="sm:col-span-6">
                        <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                          Seleccionar SKU del Kardex <span className="text-red-500">*</span>
                        </label>
                        <select
                          required
                          value={quoteForm.selectedSku}
                          onChange={(e) => {
                            const val = e.target.value;
                            const found = kardexCatalog.find(k => k.sku === val);
                            setQuoteForm(prev => ({
                              ...prev,
                              selectedSku: val,
                              unitPrice: found ? found.unitPrice : ''
                            }));
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006EAD] text-xs bg-white font-medium"
                        >
                          <option value="">-- Seleccionar SKU de Producto o Servicio --</option>
                          {kardexCatalog.map(item => (
                            <option key={item.sku} value={item.sku}>
                              [{item.sku}] {item.name} • Stock: {item.stock} {item.unit || ''} • (${item.unitPrice})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                          Cantidad
                        </label>
                        <input
                          type="number"
                          min="1"
                          required
                          value={quoteForm.quantity}
                          onChange={(e) => setQuoteForm(prev => ({ ...prev, quantity: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006EAD] text-xs font-bold text-center"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                          Precio Unitario ($)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          required
                          placeholder="0.00"
                          value={quoteForm.unitPrice}
                          onChange={(e) => setQuoteForm(prev => ({ ...prev, unitPrice: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006EAD] text-xs font-bold"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <button
                          type="submit"
                          className="w-full py-2 px-3 bg-[#006EAD] hover:bg-[#005587] text-white rounded-lg font-bold text-xs shadow-xs transition flex items-center justify-center space-x-1"
                        >
                          <i className="fas fa-cart-plus"></i>
                          <span>Agregar SKU</span>
                        </button>
                      </div>
                    </div>
                  </form>

                  {/* Tabla de SKUs de la Cotización */}
                  <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-slate-50/80">
                      <span className="font-bold text-xs text-gray-800 uppercase tracking-wider">
                        Desglose de SKUs Solicitados ({selectedDeal.quote?.items?.length || 0})
                      </span>
                      
                      {/* Acciones Masivas y Puente con Módulo 2 Ventas */}
                      <div className="flex flex-wrap items-center gap-2">
                        {selectedDeal.salesOrderCode ? (
                          <div className="flex items-center space-x-2">
                            <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center">
                              <i className="fas fa-check-circle mr-1 text-emerald-600"></i>
                              Pedido {selectedDeal.salesOrderCode} en Módulo 2
                            </span>
                            <button
                              type="button"
                              onClick={() => navigate('/app/workspace?phase=2&mod=ventas')}
                              className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold shadow-2xs transition flex items-center space-x-1"
                              title="Abrir Módulo 2 (Ventas & Facturación) para facturar por Cajera"
                            >
                              <i className="fas fa-file-invoice-dollar text-[10px]"></i>
                              <span>Ir a Facturar en Módulo 2 ➔</span>
                            </button>
                          </div>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={handlePurchaseAllItems}
                              disabled={isTransferringOrder}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-2xs transition flex items-center space-x-1 disabled:opacity-50"
                              title="Autorizar todos los SKUs y transferir el pedido a Módulo 2 (Ventas)"
                            >
                              <i className="fas fa-check-double text-[10px]"></i>
                              <span>{isTransferringOrder ? 'Generando Pedido...' : '✓ Comprar Todos los SKUs'}</span>
                            </button>

                            {quoteSummary.purchasedCount > 0 && (
                              <button
                                type="button"
                                onClick={() => handleTransferToVentas()}
                                disabled={isTransferringOrder}
                                className="px-2.5 py-1 bg-[#006EAD] hover:bg-[#005587] text-white rounded-lg text-xs font-bold shadow-2xs transition flex items-center space-x-1 disabled:opacity-50"
                                title="Transferir los SKUs autorizados a Módulo 2 de Ventas"
                              >
                                <i className="fas fa-paper-plane text-[10px]"></i>
                                <span>{isTransferringOrder ? 'Transfiriendo...' : '🚀 Generar Pedido en Módulo 2'}</span>
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => handleOpenLostSaleModal('ALL')}
                              className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold shadow-2xs transition flex items-center space-x-1"
                            >
                              <i className="fas fa-ban text-[10px]"></i>
                              <span>Rechazar Toda la Cotización</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {(!selectedDeal.quote?.items || selectedDeal.quote.items.length === 0) ? (
                      <div className="p-8 text-center text-gray-400 text-xs">
                        <i className="fas fa-box-open text-3xl mb-2 text-gray-300 block"></i>
                        No hay productos o servicios agregados en esta cotización.<br/>
                        Seleccione un SKU del Kardex arriba para armar la propuesta completa.
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left">
                          <thead className="bg-gray-100/70 text-gray-600 uppercase font-bold text-[10px]">
                            <tr>
                              <th className="p-3">SKU & Descripción</th>
                              <th className="p-3 text-center">Cant.</th>
                              <th className="p-3 text-right">P. Unitario</th>
                              <th className="p-3 text-right">Subtotal</th>
                              <th className="p-3 text-center">Estado de Compra</th>
                              <th className="p-3 text-center">Acciones</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {selectedDeal.quote.items.map(it => {
                              const isPurchased = it.status === 'comprado';
                              const isLost = it.status === 'perdido';
                              const subtotal = (Number(it.unitPrice) || 0) * (Number(it.quantity) || 1);

                              return (
                                <tr key={it.id} className={`hover:bg-slate-50/80 transition ${
                                  isPurchased ? 'bg-emerald-50/30' : isLost ? 'bg-red-50/40' : ''
                                }`}>
                                  <td className="p-3">
                                    <div className="flex items-center space-x-2">
                                      <span className="font-mono font-bold text-gray-900 bg-gray-100 px-1.5 py-0.5 rounded text-[11px]">
                                        {it.sku}
                                      </span>
                                      <div>
                                        <p className="font-semibold text-gray-800 leading-tight">{it.name}</p>
                                        <span className="text-[10px] text-gray-400">{it.category || 'General'}</span>
                                      </div>
                                    </div>
                                    {isLost && (
                                      <div className="mt-1.5 p-1.5 bg-red-100/70 rounded text-[11px] text-red-800 border border-red-200">
                                        <span className="font-bold">⚠️ Razón de No Compra:</span> {it.lostReason}
                                        {it.lostNotes && <span className="block italic text-red-700 mt-0.5">Nota: "{it.lostNotes}"</span>}
                                      </div>
                                    )}
                                  </td>
                                  <td className="p-3 text-center font-bold text-gray-700">
                                    {it.quantity}
                                  </td>
                                  <td className="p-3 text-right font-medium text-gray-700">
                                    ${Number(it.unitPrice).toLocaleString()}
                                  </td>
                                  <td className="p-3 text-right font-bold text-gray-900">
                                    ${subtotal.toLocaleString()}
                                  </td>
                                  <td className="p-3 text-center">
                                    {isPurchased ? (
                                      <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold text-[10px] inline-flex items-center">
                                        <i className="fas fa-check-circle mr-1"></i> Comprado
                                      </span>
                                    ) : isLost ? (
                                      <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded-full font-bold text-[10px] inline-flex items-center">
                                        <i className="fas fa-times-circle mr-1"></i> Venta Perdida
                                      </span>
                                    ) : (
                                      <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-bold text-[10px] inline-flex items-center">
                                        <i className="far fa-clock mr-1"></i> Cotizado
                                      </span>
                                    )}
                                  </td>
                                  <td className="p-3 text-center">
                                    <div className="flex justify-center space-x-1.5">
                                      {/* Botón Comprar */}
                                      {!isPurchased && (
                                        <button
                                          type="button"
                                          onClick={() => handleMarkItemPurchased(it.id)}
                                          title="Comprar / Aprobar SKU"
                                          className="p-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded font-bold transition text-xs"
                                        >
                                          <i className="fas fa-check"></i>
                                        </button>
                                      )}

                                      {/* Botón Descartar / Venta Perdida */}
                                      {!isLost && (
                                        <button
                                          type="button"
                                          onClick={() => handleOpenLostSaleModal(it)}
                                          title="Eliminar SKU / Registrar Venta Perdida"
                                          className="p-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded font-bold transition text-xs"
                                        >
                                          <i className="fas fa-trash-alt"></i>
                                        </button>
                                      )}

                                      {/* Botón Restaurar */}
                                      {(isPurchased || isLost) && (
                                        <button
                                          type="button"
                                          onClick={() => handleRestoreItem(it.id)}
                                          title="Restaurar a estado Cotizado"
                                          className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded font-bold transition text-xs"
                                        >
                                          <i className="fas fa-undo"></i>
                                        </button>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* ======================================================== */}
              {/* PESTAÑA 3: RASTRO Y AUDITORÍA DE VENTA PERDIDA          */}
              {/* ======================================================== */}
              {detailTab === 'venta_perdida' && (
                <div className="space-y-6">
                  
                  {/* Encabezado de Auditoría */}
                  <div className="bg-gradient-to-r from-red-900 to-rose-700 text-white p-4 rounded-xl shadow-xs">
                    <div className="flex items-center space-x-2 mb-1">
                      <i className="fas fa-chart-line text-yellow-300 text-lg"></i>
                      <h4 className="font-bold text-sm">Auditoría de Venta Perdida & Rastro Comercial (Lead-to-Order)</h4>
                    </div>
                    <p className="text-xs text-red-100">
                      Trazabilidad exacta entre lo que el cliente pidió originalmente vs lo que realmente compró vs lo que descartó, catalogado bajo los 5 motivos estratégicos de no compra.
                    </p>
                  </div>

                  {/* Métricas Principales de Fuga Comercial */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
                      <span className="text-gray-400 font-bold uppercase text-[10px] block">Monto Total Solicitado</span>
                      <span className="text-xl font-black text-gray-900">${quoteSummary.totalCotizado.toLocaleString()}</span>
                      <span className="text-xs text-gray-500 mt-1 block">Demanda bruta inicial</span>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
                      <span className="text-emerald-600 font-bold uppercase text-[10px] block">Monto Efectivamente Comprado</span>
                      <span className="text-xl font-black text-emerald-700">${quoteSummary.totalComprado.toLocaleString()}</span>
                      <span className="text-xs text-emerald-600 mt-1 block">Conversión real lograda</span>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-red-200 shadow-xs bg-red-50/20">
                      <span className="text-red-600 font-bold uppercase text-[10px] block">Monto Venta Perdida</span>
                      <span className="text-xl font-black text-red-700">${quoteSummary.totalPerdido.toLocaleString()}</span>
                      <span className="text-xs text-red-600 font-bold mt-1 block">
                        Tasa de fuga: {quoteSummary.lostPercent}%
                      </span>
                    </div>
                  </div>

                  {/* Desglose por los 5 Motivos de No Compra */}
                  <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs space-y-3">
                    <h5 className="font-bold text-gray-800 text-xs uppercase tracking-wider flex items-center">
                      <i className="fas fa-list-ol mr-1.5 text-red-600"></i>
                      Distribución por Motivo de Rechazo (Razones 1 al 5)
                    </h5>

                    <div className="space-y-2">
                      {LOST_SALE_REASONS.map(reason => {
                        const itemsWithReason = (selectedDeal.quote?.items || []).filter(
                          it => it.status === 'perdido' && it.lostReason === reason
                        );
                        const reasonAmount = itemsWithReason.reduce(
                          (sum, it) => sum + ((Number(it.unitPrice) || 0) * (Number(it.quantity) || 1)),
                          0
                        );
                        const percentOfLoss = quoteSummary.totalPerdido > 0 
                          ? ((reasonAmount / quoteSummary.totalPerdido) * 100).toFixed(0) 
                          : 0;

                        return (
                          <div key={reason} className="p-2.5 rounded-lg border border-gray-100 bg-slate-50/70 text-xs flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                              <span className={`w-2.5 h-2.5 rounded-full ${itemsWithReason.length > 0 ? 'bg-red-500' : 'bg-gray-300'}`}></span>
                              <span className={`font-semibold ${itemsWithReason.length > 0 ? 'text-gray-900 font-bold' : 'text-gray-500'}`}>
                                {reason}
                              </span>
                            </div>
                            <div className="flex items-center space-x-3 text-right">
                              <span className="text-gray-500 text-[11px]">{itemsWithReason.length} SKUs</span>
                              <span className="font-mono font-bold text-red-700">${reasonAmount.toLocaleString()}</span>
                              <span className="text-[10px] bg-red-100 text-red-800 font-bold px-1.5 py-0.2 rounded">
                                {percentOfLoss}%
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Rastro Detallado de SKUs Descartados */}
                  <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100 bg-slate-50 font-bold text-xs text-gray-800 uppercase tracking-wider">
                      Detalle y Evidencia de SKUs NO Comprados ({quoteSummary.lostCount})
                    </div>

                    {quoteSummary.lostCount === 0 ? (
                      <div className="p-6 text-center text-gray-400 text-xs">
                        <i className="fas fa-shield-alt text-2xl text-emerald-400 mb-1 block"></i>
                        No hay registros de venta perdida en esta oportunidad.<br/>
                        Todos los SKUs cotizados están vigentes o fueron aprobados por el cliente.
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-100 text-xs">
                        {selectedDeal.quote.items.filter(it => it.status === 'perdido').map(it => {
                          const sub = (Number(it.unitPrice) || 0) * (Number(it.quantity) || 1);
                          return (
                            <div key={it.id} className="p-4 space-y-2 hover:bg-red-50/20 transition">
                              <div className="flex justify-between items-start">
                                <div>
                                  <span className="font-mono font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded text-xs border border-red-200">
                                    {it.sku}
                                  </span>
                                  <span className="font-bold text-gray-900 ml-2">{it.name}</span>
                                  <span className="text-gray-500 text-xs ml-2">({it.quantity} unidades x ${it.unitPrice})</span>
                                </div>
                                <span className="font-mono font-black text-red-700 text-sm">
                                  -${sub.toLocaleString()} USD
                                </span>
                              </div>

                              <div className="bg-white p-2.5 rounded-lg border border-red-100 text-xs">
                                <div className="flex items-center text-red-800 font-bold mb-0.5">
                                  <i className="fas fa-exclamation-circle mr-1.5"></i>
                                  {it.lostReason}
                                </div>
                                {it.lostNotes && (
                                  <p className="text-gray-600 italic text-[11px] mt-1 pl-4 border-l-2 border-red-300">
                                    "{it.lostNotes}"
                                  </p>
                                )}
                                <div className="text-[10px] text-gray-400 mt-1 flex justify-between">
                                  <span>Registrado por: {selectedDeal.assignedTo || 'Asesor'}</span>
                                  <span>Fecha: {it.lostDate || 'Reciente'}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* ======================================================== */}
              {/* PESTAÑA 4: DATOS GENERALES DE LA OPORTUNIDAD            */}
              {/* ======================================================== */}
              {detailTab === 'info' && (
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-4">
                  <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider border-b border-gray-100 pb-2">
                    Ficha de la Oportunidad de Negocio
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-gray-400 font-bold uppercase text-[10px] block">Título</span>
                      <p className="font-bold text-gray-900 text-sm mt-0.5">{selectedDeal.title}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 font-bold uppercase text-[10px] block">Empresa / Cuenta</span>
                      <p className="font-bold text-gray-900 text-sm mt-0.5">{selectedDeal.company}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 font-bold uppercase text-[10px] block">Correo Electrónico</span>
                      <p className="font-medium text-gray-700 mt-0.5">{selectedDeal.email || 'No registrado'}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 font-bold uppercase text-[10px] block">Teléfono / WhatsApp</span>
                      <p className="font-medium text-gray-700 mt-0.5">{selectedDeal.phone || 'No registrado'}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 font-bold uppercase text-[10px] block">Prioridad</span>
                      <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${getPriorityColor(selectedDeal.priority)}`}>
                        {selectedDeal.priority}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 font-bold uppercase text-[10px] block">Asesor a Cargo</span>
                      <p className="font-semibold text-gray-800 mt-0.5">{selectedDeal.assignedTo || 'María Asesora'}</p>
                    </div>
                  </div>

                  {selectedDeal.notes && (
                    <div className="pt-2">
                      <span className="text-gray-400 font-bold uppercase text-[10px] block mb-1">Notas Iniciales</span>
                      <p className="bg-slate-50 p-3 rounded-lg border border-gray-100 text-xs text-gray-700 whitespace-pre-wrap">
                        {selectedDeal.notes}
                      </p>
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* Modal Footer con Acciones */}
            <div className="px-6 py-3.5 bg-white border-t border-gray-200 flex justify-between items-center shrink-0">
              <button
                type="button"
                onClick={handleDeleteDeal}
                className="text-red-600 hover:text-red-800 text-xs font-bold hover:underline flex items-center transition"
              >
                <i className="fas fa-trash-alt mr-1.5"></i>Descartar Oportunidad
              </button>

              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setIsDetailOpen(false)}
                  className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition"
                >
                  Cerrar
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL EMERGENTE: REGISTRAR MOTIVO DE VENTA PERDIDA        */}
      {/* ========================================================= */}
      {lostSaleModal.isOpen && (
        <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fadeIn border border-red-200">
            
            {/* Modal Header */}
            <div className="px-5 py-3.5 bg-red-700 text-white flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <i className="fas fa-exclamation-triangle text-yellow-300"></i>
                <h4 className="font-bold text-sm">Registrar Causal de Venta Perdida</h4>
              </div>
              <button
                type="button"
                onClick={() => setLostSaleModal({ isOpen: false, targetItem: null, reason: LOST_SALE_REASONS[0], notes: '' })}
                className="text-white hover:text-gray-200 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 space-y-4 text-xs">
              <div className="bg-red-50 p-3 rounded-xl border border-red-200 text-red-900">
                <span className="font-bold block uppercase text-[10px]">Elemento a Descartar:</span>
                {lostSaleModal.targetItem === 'ALL' ? (
                  <p className="font-bold text-sm mt-0.5">Toda la Cotización Actual ({quoteSummary.itemsCount} SKUs)</p>
                ) : (
                  <p className="font-bold text-sm mt-0.5">
                    [{lostSaleModal.targetItem?.sku}] {lostSaleModal.targetItem?.name} • ({lostSaleModal.targetItem?.quantity} un. x ${lostSaleModal.targetItem?.unitPrice})
                  </p>
                )}
                <span className="text-[11px] text-red-700 block mt-1">
                  Se generará el indicador de fuga comercial para análisis y auditoría gerencial.
                </span>
              </div>

              {/* Selección Obligatoria de los 5 Motivos */}
              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase mb-2">
                  Seleccione la Razón Oficial de la NO Compra <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  {LOST_SALE_REASONS.map(rs => (
                    <label
                      key={rs}
                      className={`flex items-center space-x-3 p-2.5 rounded-xl border cursor-pointer transition ${
                        lostSaleModal.reason === rs
                          ? 'bg-red-50/80 border-red-500 text-red-950 font-bold ring-1 ring-red-400'
                          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="lostReasonRadio"
                        value={rs}
                        checked={lostSaleModal.reason === rs}
                        onChange={(e) => setLostSaleModal(prev => ({ ...prev, reason: e.target.value }))}
                        className="text-red-600 focus:ring-red-500 h-4 w-4"
                      />
                      <span className="text-xs">{rs}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Justificación o Notas Adicionales */}
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                  Observaciones adicionales o detalle de la objeción del cliente
                </label>
                <textarea
                  rows="2"
                  value={lostSaleModal.notes}
                  onChange={(e) => setLostSaleModal(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Detalles sobre por qué no se concretó la venta (competencia, precio ofertado, etc.)..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-xs"
                ></textarea>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 bg-gray-50 border-t border-gray-200 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setLostSaleModal({ isOpen: false, targetItem: null, reason: LOST_SALE_REASONS[0], notes: '' })}
                className="px-4 py-2 border border-gray-300 rounded-lg font-semibold text-gray-600 hover:bg-gray-100 transition text-xs"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmLostSale}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold shadow-md transition text-xs flex items-center space-x-1.5"
              >
                <i className="fas fa-check"></i>
                <span>Confirmar Venta Perdida</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default CrmDashboardView;
