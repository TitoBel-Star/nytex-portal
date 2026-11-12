import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Catálogo base de Kardex (Productos y Servicios de NyTEX ERP) con Proveedores
const DEFAULT_KARDEX = [
  { sku: 'PT-TEL-101', name: 'Lote Producto Terminado Estándar Alfa', category: 'Producto Terminado', provider: 'Textiles del Pacífico S.A.', unitPrice: 1850, stock: 35, unit: 'rollos' },
  { sku: 'PT-POP-102', name: 'Lote Producto Terminado Modelo Estándar', category: 'Producto Terminado', provider: 'Textiles del Pacífico S.A.', unitPrice: 2150, stock: 15, unit: 'unidades' },
  { sku: 'PT-RIB-103', name: 'Lote Producto Terminado Modelo Reforzado', category: 'Producto Terminado', provider: 'Industrias TexAlfa', unitPrice: 1950, stock: 22, unit: 'unidades' },
  { sku: 'PT-FLE-104', name: 'Lote Producto Terminado Modelo Industrial', category: 'Producto Terminado', provider: 'Industrias TexAlfa', unitPrice: 2800, stock: 18, unit: 'unidades' },
  { sku: 'PT-PIQ-105', name: 'Lote Producto Terminado Modelo Plus', category: 'Producto Terminado', provider: 'Textiles del Pacífico S.A.', unitPrice: 2100, stock: 26, unit: 'unidades' },
  { sku: 'SKU-TEL-01', name: 'Lote Producto Terminado Serie 100', category: 'Producto Terminado', provider: 'Distribuidora Global Textil', unitPrice: 1850, stock: 45, unit: 'unidades' },
  { sku: 'SKU-TEL-02', name: 'Lote Producto Terminado Serie 200', category: 'Producto Terminado', provider: 'Distribuidora Global Textil', unitPrice: 1850, stock: 32, unit: 'unidades' },
  { sku: 'SKU-TEL-03', name: 'Lote Producto Terminado Serie 300', category: 'Producto Terminado', provider: 'Distribuidora Global Textil', unitPrice: 1780, stock: 60, unit: 'unidades' },
  { sku: 'SKU-MEZ-01', name: 'Lote Producto Terminado Serie 400', category: 'Producto Terminado', provider: 'Hilaturas y Telas S.A.', unitPrice: 2400, stock: 28, unit: 'unidades' },
  { sku: 'SKU-MEZ-02', name: 'Lote Producto Terminado Serie 500', category: 'Producto Terminado', provider: 'Hilaturas y Telas S.A.', unitPrice: 2650, stock: 19, unit: 'unidades' },
  { sku: 'SKU-POL-01', name: 'Lote Producto Terminado Compuesto', category: 'Producto Terminado', provider: 'Hilaturas y Telas S.A.', unitPrice: 1450, stock: 55, unit: 'unidades' },
  { sku: 'MP-HIL-01', name: 'Materia Prima Base MP-01', category: 'Materia Prima', provider: 'Fibras Sintéticas Corp', unitPrice: 380, stock: 120, unit: 'kg' },
  { sku: 'MP-POL-02', name: 'Materia Prima Sintética MP-02', category: 'Materia Prima', provider: 'Fibras Sintéticas Corp', unitPrice: 240, stock: 450, unit: 'kg' },
  { sku: 'MP-TIN-03', name: 'Compuesto Reactivo Azul Marino', category: 'Insumo Químico', provider: 'Químicos y Colorantes CA', unitPrice: 490, stock: 18, unit: 'litros' },
  { sku: 'SRV-CONS-01', name: 'Servicio de Consultoría y Diagnóstico ERP', category: 'Servicio', provider: 'Servicios NyTEX Tech', unitPrice: 1200, stock: 999, unit: 'servicio' },
  { sku: 'SRV-MIG-02', name: 'Servicio de Migración a la Nube e Infraestructura', category: 'Servicio', provider: 'Servicios Cloud Tech', unitPrice: 3500, stock: 999, unit: 'servicio' },
  { sku: 'SRV-CAP-03', name: 'Capacitación y Adopción de Usuarios NyTEX', category: 'Servicio', provider: 'Academia NyTEX', unitPrice: 750, stock: 999, unit: 'servicio' },
  { sku: 'SRV-SOP-04', name: 'Soporte Hypercare 24/7 (Bolsa Mensual)', category: 'Servicio', provider: 'Soporte Hypercare NyTEX', unitPrice: 2400, stock: 999, unit: 'servicio' }
];

// Lista de Sucursales de NyTEX
const BRANCHES_LIST = [
  'Sucursal Central (San Salvador)',
  'Sucursal Norte (Santa Ana)',
  'Sucursal Oriente (San Miguel)',
  'Sucursal Occidente (Sonsonate)'
];

// Lista de Asesores Comerciales (Vendedores)
const SELLERS_LIST = [
  'María Asesora',
  'Carlos Méndez',
  'Alejandro Castillo',
  'Ana Gómez'
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
    createdDate: '2026-09-18',
    branch: 'Sucursal Central (San Salvador)',
    priority: 'Alta', 
    contact: 'Roberto Silva', 
    email: 'rsilva@apex.com', 
    phone: '+503 7890-1234', 
    assignedTo: 'María Asesora',
    channel: 'email',
    requestType: 'cotizacion',
    resolutionStatus: 'pendiente',
    resolutionNotes: '',
    resolvedAt: null,
    resolvedBy: null,
    slaMinutes: 120,
    messages: [
      { id: 1001, sender: 'client', channel: 'email', text: 'Estimados señores de NyTEX: Nos comunicamos para solicitar formalmente la cotización de los módulos de Fase 1 para nuestra planta en Ilopango.', timestamp: '2026-09-18 09:15' },
      { id: 1002, sender: 'agent', channel: 'email', text: 'Buenos días Roberto, con gusto. Ya cargamos la propuesta en el cotizador con los servicios de consultoría y migración en la nube.', timestamp: '2026-09-18 10:30' }
    ],
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
        { id: 11, sku: 'SRV-CONS-01', name: 'Servicio de Consultoría y Diagnóstico ERP', category: 'Servicio', provider: 'Servicios NyTEX Tech', unitPrice: 1200, quantity: 2, total: 2400, status: 'comprado', lostReason: null, lostNotes: '', lostDate: null },
        { id: 12, sku: 'SRV-MIG-02', name: 'Servicio de Migración a la Nube e Infraestructura', category: 'Servicio', provider: 'Servicios Cloud Tech', unitPrice: 3500, quantity: 3, total: 10500, status: 'cotizado', lostReason: null, lostNotes: '', lostDate: null },
        { id: 13, sku: 'SRV-CAP-03', name: 'Capacitación y Adopción de Usuarios NyTEX', category: 'Servicio', provider: 'Academia NyTEX', unitPrice: 700, quantity: 3, total: 2100, status: 'cotizado', lostReason: null, lostNotes: '', lostDate: null }
      ]
    }
  },
  { 
    id: 2, 
    title: 'Migración a la nube', 
    company: 'TechSolutions S.A.', 
    value: '$8,500', 
    stage: 'Ganado', 
    date: '23 Sep',
    createdDate: '2026-09-20',
    branch: 'Sucursal Central (San Salvador)',
    priority: 'Media', 
    contact: 'Karla Morales', 
    email: 'kmorales@techsolutions.com', 
    phone: '+503 7654-3210', 
    assignedTo: 'Alejandro Castillo',
    channel: 'whatsapp',
    requestType: 'cotizacion',
    resolutionStatus: 'resuelto',
    resolutionNotes: 'Cotización aceptada en su totalidad y enviada a Módulo 2 para facturación en caja.',
    resolvedAt: '2026-09-23 15:30',
    resolvedBy: 'Alejandro Castillo',
    slaMinutes: 0,
    messages: [
      { id: 2001, sender: 'client', channel: 'whatsapp', text: 'Hola Alejandro, revisamos la cotización de la migración y el plan de capacitación. Queda aprobada, ¿cuándo podemos firmar el contrato?', timestamp: '2026-09-23 11:20' },
      { id: 2002, sender: 'agent', channel: 'whatsapp', text: '¡Excelente Karla! En este momento transfiero la orden formal a facturación y caja para coordinar el anticipo.', timestamp: '2026-09-23 11:25' }
    ],
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
        { id: 21, sku: 'SRV-MIG-02', name: 'Servicio de Migración a la Nube e Infraestructura', category: 'Servicio', provider: 'Servicios Cloud Tech', unitPrice: 3500, quantity: 2, total: 7000, status: 'comprado', lostReason: null, lostNotes: '', lostDate: null },
        { id: 22, sku: 'SRV-CAP-03', name: 'Capacitación y Adopción de Usuarios NyTEX', category: 'Servicio', provider: 'Academia NyTEX', unitPrice: 750, quantity: 2, total: 1500, status: 'comprado', lostReason: null, lostNotes: '', lostDate: null }
      ]
    }
  },
  { 
    id: 3, 
    title: 'Módulo de Facturación Electrónica', 
    company: 'Comercializadora del Sur', 
    value: '$3,200', 
    stage: 'Contactado', 
    date: '12 Oct',
    createdDate: '2026-10-12',
    branch: 'Sucursal Oriente (San Miguel)',
    priority: 'Alta', 
    contact: 'Luis Gómez', 
    email: 'lgomez@comsur.com', 
    phone: '+503 7123-4567', 
    assignedTo: 'María Asesora',
    channel: 'whatsapp',
    requestType: 'cotizacion',
    resolutionStatus: 'pendiente',
    resolutionNotes: '',
    resolvedAt: null,
    resolvedBy: null,
    slaMinutes: 45,
    messages: [
      { id: 3001, sender: 'client', channel: 'whatsapp', text: 'Buenas tardes, nos urge implementar DTE para facturación electrónica en San Miguel. ¿Tienen disponibilidad?', timestamp: '2026-10-12 14:10' },
      { id: 3002, sender: 'agent', channel: 'whatsapp', text: 'Hola Luis, sí contamos con el conector oficial de Hacienda. Te preparo la cotización con 1 conector DTE y la capacitación inicial.', timestamp: '2026-10-12 14:25' }
    ],
    activities: [
      {
        id: 301,
        contactType: 'Llamada',
        notes: 'Minuta: Primera llamada de contacto. El cliente requiere timbrado DTE urgente para cumplir normativa fiscal.',
        nextTask: 'Enviar cotización formal de DTE',
        nextTaskDate: '2026-10-14 09:00',
        registeredAt: '2026-10-12 10:15',
        registeredBy: 'María Asesora'
      }
    ],
    quote: {
      paymentTerms: 'Contado',
      deliveryMode: 'Entrega en Sucursal',
      deliveryAddress: 'Agencia San Miguel, 4a Calle Pte',
      items: [
        { id: 31, sku: 'SRV-CONS-01', name: 'Servicio de Consultoría y Diagnóstico ERP', category: 'Servicio', provider: 'Servicios NyTEX Tech', unitPrice: 1200, quantity: 1, total: 1200, status: 'comprado', lostReason: null, lostNotes: '', lostDate: null },
        { id: 32, sku: 'SRV-CAP-03', name: 'Capacitación y Adopción de Usuarios NyTEX', category: 'Servicio', provider: 'Academia NyTEX', unitPrice: 1000, quantity: 2, total: 2000, status: 'perdido', lostReason: '1. Precio Alto / Competencia Más Barata', lostNotes: 'El cliente consideró que el costo de capacitación superaba su presupuesto asignado y optó por capacitar internamente a su personal.', lostDate: '2026-10-13' }
      ]
    }
  },
  { 
    id: 4, 
    title: 'Consultoría Logística WMS', 
    company: 'Logistics Pro', 
    value: '$5,000', 
    stage: 'Calificado', 
    date: '18 Oct',
    createdDate: '2026-10-15',
    branch: 'Sucursal Central (San Salvador)',
    priority: 'Baja', 
    contact: 'Ana Beltrán', 
    email: 'abeltran@logisticspro.com', 
    phone: '+503 7987-6543', 
    assignedTo: 'Carlos Méndez',
    channel: 'instagram',
    requestType: 'cotizacion',
    resolutionStatus: 'pendiente',
    resolutionNotes: '',
    resolvedAt: null,
    resolvedBy: null,
    slaMinutes: 180,
    messages: [
      { id: 4001, sender: 'client', channel: 'instagram', text: 'Hola! Vi su publicación sobre el módulo WMS de almacenes. ¿Hacen consultoría para centros de distribución con radiofrecuencia?', timestamp: '2026-10-15 16:00' },
      { id: 4002, sender: 'agent', channel: 'instagram', text: 'Hola Ana, sí, cubrimos picking con código de barras y radiofrecuencia. Te agendamos una llamada técnica para el 18 de octubre.', timestamp: '2026-10-15 16:30' }
    ],
    activities: [
      {
        id: 401,
        contactType: 'Reunión Presencial',
        notes: 'Minuta: Calificación de requerimientos en bodega central. Solicitan control de racks y trazabilidad de lotes.',
        nextTask: 'Enviar propuesta de consultoría logística',
        nextTaskDate: '2026-10-20 15:00',
        registeredAt: '2026-10-18 11:00',
        registeredBy: 'Carlos Méndez'
      }
    ],
    quote: {
      paymentTerms: 'Contado',
      deliveryMode: 'Entrega en Sucursal',
      deliveryAddress: 'Centro Logístico Nejapa',
      items: [
        { id: 41, sku: 'SRV-CONS-01', name: 'Servicio de Consultoría y Diagnóstico ERP', category: 'Servicio', provider: 'Servicios NyTEX Tech', unitPrice: 1200, quantity: 2, total: 2400, status: 'comprado', lostReason: null, lostNotes: '', lostDate: null },
        { id: 42, sku: 'SRV-MIG-02', name: 'Servicio de Migración a la Nube e Infraestructura', category: 'Servicio', provider: 'Servicios Cloud Tech', unitPrice: 2600, quantity: 1, total: 2600, status: 'perdido', lostReason: '2. Falta de Stock / Tiempo de Entrega Tardío', lostNotes: 'Requerían iniciar la migración en menos de 48 horas y el equipo técnico tenía agenda copada por dos semanas.', lostDate: '2026-10-18' }
      ]
    }
  },
  { 
    id: 5, 
    title: 'Suministro de Tejido Plano Industrial', 
    company: 'Almacenes Globales', 
    value: '$25,000', 
    stage: 'Cotizado', 
    date: '25 Oct',
    createdDate: '2026-10-20',
    branch: 'Sucursal Occidente (Santa Ana)',
    priority: 'Alta', 
    contact: 'Javier Ramos', 
    email: 'jramos@almacenesglobales.com', 
    phone: '+503 7456-7890', 
    assignedTo: 'María Asesora',
    channel: 'web',
    requestType: 'cotizacion',
    resolutionStatus: 'pendiente',
    resolutionNotes: '',
    resolvedAt: null,
    resolvedBy: null,
    slaMinutes: 30,
    messages: [
      { id: 5001, sender: 'client', channel: 'web', text: 'Solicitud web: Requerimos cotización de 200 rollos de tela Oxford y gabardina para confección de uniformes de temporada.', timestamp: '2026-10-20 08:30' },
      { id: 5002, sender: 'agent', channel: 'web', text: 'Estimado Javier, cotización preparada y enviada con precio especial por volumen y entrega en Santa Ana.', timestamp: '2026-10-20 10:00' }
    ],
    activities: [
      {
        id: 501,
        contactType: 'Envío de Muestras',
        notes: 'Minuta: Entrega de muestrario físico de telas Oxford y Gabardina. Cliente evaluará solidez de color.',
        nextTask: 'Llamada de seguimiento a aprobación de muestra',
        nextTaskDate: '2026-10-26 10:00',
        registeredAt: '2026-10-22 14:00',
        registeredBy: 'María Asesora'
      }
    ],
    quote: {
      paymentTerms: 'Crédito 15 días',
      deliveryMode: 'A Domicilio',
      deliveryAddress: 'Bodega Santa Ana, Parque Industrial',
      items: [
        { id: 51, sku: 'MP-OXF-001', name: 'Tela Oxford Algodón/Poliéster 1.50m', category: 'Materia Prima', provider: 'Textiles El Cóndor', unitPrice: 3800, quantity: 3, total: 11400, status: 'comprado', lostReason: null, lostNotes: '', lostDate: null },
        { id: 52, sku: 'MP-GAB-002', name: 'Tela Gabardina Pesada 100% Algodón', category: 'Materia Prima', provider: 'Hilados San Andrés', unitPrice: 4200, quantity: 2, total: 8400, status: 'perdido', lostReason: '3. Desistimiento del Cliente / Cancelación del Proyecto', lostNotes: 'La junta directiva del cliente congeló el presupuesto de uniformes corporativos hasta el primer trimestre del próximo año.', lostDate: '2026-10-24' },
        { id: 53, sku: 'HIL-POL-010', name: 'Cono de Hilo Poliéster 40/2 5000m', category: 'Insumos', provider: 'Hilos Industriales Global', unitPrice: 2600, quantity: 2, total: 5200, status: 'cotizado', lostReason: null, lostNotes: '', lostDate: null }
      ]
    }
  },
  { 
    id: 6, 
    title: 'Soporte Hypercare Post-GoLive', 
    company: 'Constructora XYZ', 
    value: '$2,400', 
    stage: 'Ganado', 
    date: '02 Nov',
    createdDate: '2026-10-28',
    branch: 'Sucursal Central (San Salvador)',
    priority: 'Media', 
    contact: 'Pedro Castillo', 
    email: 'pcastillo@constructoraxyz.com', 
    phone: '+503 7321-6549', 
    assignedTo: 'Carlos Méndez',
    channel: 'whatsapp',
    requestType: 'cotizacion',
    resolutionStatus: 'resuelto',
    resolutionNotes: 'Contrato de soporte cerrado y formalizado en Módulo 2.',
    resolvedAt: '2026-11-02 16:00',
    resolvedBy: 'Carlos Méndez',
    slaMinutes: 0,
    messages: [
      { id: 6001, sender: 'client', channel: 'whatsapp', text: 'Carlos, aceptamos el plan de soporte hypercare de $2,400 por 3 meses.', timestamp: '2026-11-02 10:15' },
      { id: 6002, sender: 'agent', channel: 'whatsapp', text: 'Excelente Pedro, acabamos de generar la orden formal para activar el equipo de soporte.', timestamp: '2026-11-02 10:20' }
    ],
    activities: [
      {
        id: 601,
        contactType: 'Llamada',
        notes: 'Minuta: Acuerdo de soporte extendido por 3 meses post-arranque de sistema.',
        nextTask: 'Enviar póliza de soporte firmada',
        nextTaskDate: '2026-11-05 09:00',
        registeredAt: '2026-11-02 15:30',
        registeredBy: 'Carlos Méndez'
      }
    ],
    quote: {
      paymentTerms: 'Contado',
      deliveryMode: 'Entrega en Sucursal',
      deliveryAddress: 'Oficinas Constructora XYZ, Escalón',
      items: [
        { id: 61, sku: 'SRV-CONS-01', name: 'Servicio de Consultoría y Diagnóstico ERP', category: 'Servicio', provider: 'Servicios NyTEX Tech', unitPrice: 1200, quantity: 2, total: 2400, status: 'comprado', lostReason: null, lostNotes: '', lostDate: null }
      ]
    }
  },
  { 
    id: 7, 
    title: 'Adquisición de Lote Frazadas y Cobertores', 
    company: 'Distribuidora Textil del Centro', 
    value: '$6,800', 
    stage: 'Cotizado', 
    date: '04 Nov',
    createdDate: '2026-10-30',
    branch: 'Sucursal Central (San Salvador)',
    priority: 'Alta', 
    contact: 'Claudia Herrera', 
    email: 'cherrera@distextil.com', 
    phone: '+503 7600-1122', 
    assignedTo: 'Alejandro Castillo',
    channel: 'email',
    requestType: 'cotizacion',
    resolutionStatus: 'pendiente',
    resolutionNotes: '',
    resolvedAt: null,
    resolvedBy: null,
    slaMinutes: 60,
    messages: [
      { id: 7001, sender: 'client', channel: 'email', text: 'Buenas tardes, requerimos cotización de 100 frazadas térmicas y cobertores para temporada navideña.', timestamp: '2026-10-30 11:00' },
      { id: 7002, sender: 'agent', channel: 'email', text: 'Estimada Claudia, cotización enviada con precios por mayor y despacho en almacén central.', timestamp: '2026-10-30 14:00' }
    ],
    activities: [
      {
        id: 701,
        contactType: 'Llamada',
        notes: 'Minuta: Cliente solicitó cotización formal con descuento por volumen superior a 100 unidades.',
        nextTask: 'Seguimiento a cotización enviada',
        nextTaskDate: '2026-11-06 10:00',
        registeredAt: '2026-11-04 11:30',
        registeredBy: 'Alejandro Castillo'
      }
    ],
    quote: {
      paymentTerms: 'Crédito 30 días',
      deliveryMode: 'A Domicilio',
      deliveryAddress: 'Sucursal Centro, Calle Arce',
      items: [
        { id: 71, sku: 'PT-COB-101', name: 'Cobertor Matrimonial Estampado Premium', category: 'Producto Terminado', provider: 'Industrias TexAlfa', unitPrice: 1800, quantity: 2, total: 3600, status: 'comprado', lostReason: null, lostNotes: '', lostDate: null },
        { id: 72, sku: 'PT-FRA-102', name: 'Frazada Térmica Microfibra Suave', category: 'Producto Terminado', provider: 'Industrias TexAlfa', unitPrice: 3200, quantity: 1, total: 3200, status: 'perdido', lostReason: '4. Especificación Técnica Incorrecta o Incompatible', lostNotes: 'El gramaje de la microfibra no coincidía con las especificaciones del pliego de licitación del cliente.', lostDate: '2026-11-04' }
      ]
    }
  },
  { 
    id: 8, 
    title: 'Reposición Insumos de Costura', 
    company: 'Maquilas Modernas S.A.', 
    value: '$4,200', 
    stage: 'Calificado', 
    date: '06 Nov',
    createdDate: '2026-11-01',
    branch: 'Sucursal Oriente (San Miguel)',
    priority: 'Media', 
    contact: 'Jorge Meléndez', 
    email: 'jmelendez@maquilasmodernas.com', 
    phone: '+503 7555-4321', 
    assignedTo: 'Carlos Méndez',
    channel: 'instagram',
    requestType: 'cotizacion',
    resolutionStatus: 'pendiente',
    resolutionNotes: '',
    resolvedAt: null,
    resolvedBy: null,
    slaMinutes: 110,
    messages: [
      { id: 8001, sender: 'client', channel: 'instagram', text: 'Buenas, quisiéramos saber el precio por caja de botones y cremalleras de poliéster para entrega en San Miguel.', timestamp: '2026-11-01 15:20' }
    ],
    activities: [
      {
        id: 801,
        contactType: 'Llamada',
        notes: 'Minuta: Se revisaron volúmenes de hilo y botones. El cliente solicitó plazo de crédito a 45 días.',
        nextTask: 'Consultar aprobación de crédito en Módulo CxC',
        nextTaskDate: '2026-11-08 14:00',
        registeredAt: '2026-11-06 09:15',
        registeredBy: 'Carlos Méndez'
      }
    ],
    quote: {
      paymentTerms: 'Crédito 45 días',
      deliveryMode: 'Entrega en Sucursal',
      deliveryAddress: 'Parque Industrial San Miguel, Módulo 8',
      items: [
        { id: 81, sku: 'HIL-POL-010', name: 'Cono de Hilo Poliéster 40/2 5000m', category: 'Insumos', provider: 'Hilos Industriales Global', unitPrice: 2000, quantity: 1, total: 2000, status: 'comprado', lostReason: null, lostNotes: '', lostDate: null },
        { id: 82, sku: 'INS-BOT-020', name: 'Botón Poliéster 4 Agujeros Caja 1000u', category: 'Insumos', provider: 'Hilos Industriales Global', unitPrice: 2200, quantity: 1, total: 2200, status: 'perdido', lostReason: '5. Falta de Aprobación de Crédito / Condiciones de Pago', lostNotes: 'El departamento de CxC rechazó otorgar plazo de 45 días por no contar con referencias bancarias suficientes.', lostDate: '2026-11-06' }
      ]
    }
  },
  { 
    id: 9, 
    title: 'Suministro Tela Gabardina para Uniformes', 
    company: 'Uniformes Industriales El Salvador', 
    value: '$7,200', 
    stage: 'Cotizado', 
    date: '08 Nov',
    createdDate: '2026-11-03',
    branch: 'Sucursal Central (San Salvador)',
    priority: 'Alta', 
    contact: 'Patricia Salazar', 
    email: 'psalazar@uniformes.sv', 
    phone: '+503 7200-3344', 
    assignedTo: 'María Asesora',
    channel: 'web',
    requestType: 'cotizacion',
    resolutionStatus: 'pendiente',
    resolutionNotes: '',
    resolvedAt: null,
    resolvedBy: null,
    slaMinutes: 15,
    messages: [
      { id: 9001, sender: 'client', channel: 'web', text: 'Formulario web: Cotización de tela gabardina azul y caqui para dotación de seguridad industrial.', timestamp: '2026-11-03 09:00' }
    ],
    activities: [
      {
        id: 901,
        contactType: 'Reunión Presencial',
        notes: 'Minuta: Presentación de cotización en oficinas del cliente. Se revisó ficha técnica y tiempos de despacho.',
        nextTask: 'Llamada de confirmación de pedido',
        nextTaskDate: '2026-11-10 11:00',
        registeredAt: '2026-11-08 16:00',
        registeredBy: 'María Asesora'
      }
    ],
    quote: {
      paymentTerms: 'Crédito 15 días',
      deliveryMode: 'A Domicilio',
      deliveryAddress: 'Planta de Confección Soyapango',
      items: [
        { id: 91, sku: 'MP-GAB-002', name: 'Tela Gabardina Pesada 100% Algodón', category: 'Materia Prima', provider: 'Hilados San Andrés', unitPrice: 3600, quantity: 2, total: 7200, status: 'comprado', lostReason: null, lostNotes: '', lostDate: null }
      ]
    }
  },
  { 
    id: 10, 
    title: 'Adquisición Frazadas Infantiles', 
    company: 'Comercial Hogar Feliz', 
    value: '$3,600', 
    stage: 'Ganado', 
    date: '10 Nov',
    createdDate: '2026-11-05',
    branch: 'Sucursal Occidente (Santa Ana)',
    priority: 'Media', 
    contact: 'Raúl Morales', 
    email: 'rmorales@hogarfeliz.com', 
    phone: '+503 7411-9988', 
    assignedTo: 'Alejandro Castillo',
    channel: 'whatsapp',
    requestType: 'cotizacion',
    resolutionStatus: 'resuelto',
    resolutionNotes: 'Venta cerrada y cobrada en mostrador de sucursal Santa Ana.',
    resolvedAt: '2026-11-10 17:00',
    resolvedBy: 'Alejandro Castillo',
    slaMinutes: 0,
    messages: [
      { id: 10001, sender: 'client', channel: 'whatsapp', text: 'Raúl: Ya autorizamos la orden de las 50 frazadas infantiles. Llegaré hoy a pagar a caja en Santa Ana.', timestamp: '2026-11-10 14:00' },
      { id: 10002, sender: 'agent', channel: 'whatsapp', text: 'Excelente Raúl, la cotización ya está en el sistema de caja de Santa Ana lista para facturación.', timestamp: '2026-11-10 14:05' }
    ],
    activities: [
      {
        id: 1001,
        contactType: 'Llamada',
        notes: 'Minuta: Confirmación de compra de lote de frazadas infantiles estampadas.',
        nextTask: 'Facturación en Módulo 2',
        nextTaskDate: '2026-11-11 10:00',
        registeredAt: '2026-11-10 14:30',
        registeredBy: 'Alejandro Castillo'
      }
    ],
    quote: {
      paymentTerms: 'Contado',
      deliveryMode: 'Entrega en Sucursal',
      deliveryAddress: 'Agencia Santa Ana, Centro',
      items: [
        { id: 101, sku: 'PT-FRA-103', name: 'Frazada Térmica Estampada Infantil', category: 'Producto Terminado', provider: 'Industrias TexAlfa', unitPrice: 1800, quantity: 2, total: 3600, status: 'comprado', lostReason: null, lostNotes: '', lostDate: null }
      ]
    }
  },
  { 
    id: 11, 
    title: 'Dotación Integral Ropa de Cama Hospitalaria', 
    company: 'Servicios Médicos de El Salvador', 
    value: '$11,400', 
    stage: 'Ganado', 
    date: '12 Nov',
    createdDate: '2026-11-08',
    branch: 'Sucursal Occidente (Santa Ana)',
    priority: 'Alta', 
    contact: 'Dr. Fernando Rivas', 
    email: 'frivas@servimedicos.sv', 
    phone: '+503 7888-5522', 
    assignedTo: 'Alejandro Castillo',
    channel: 'direct',
    requestType: 'cotizacion',
    resolutionStatus: 'resuelto',
    resolutionNotes: 'Licitación hospitalaria adjudicada y formalizada en Módulo 2.',
    resolvedAt: '2026-11-12 11:00',
    resolvedBy: 'Alejandro Castillo',
    slaMinutes: 0,
    messages: [
      { id: 11001, sender: 'client', channel: 'direct', text: 'Confirmación escrita: Adjudicación de dotación hospitalaria de sábanas y cobertores según cotización presentada.', timestamp: '2026-11-12 09:30' }
    ],
    activities: [
      {
        id: 1101,
        contactType: 'Reunión Presencial',
        notes: 'Cierre total de compra para dotación de planta Santa Ana.',
        nextTask: 'Despacho logístico',
        nextTaskDate: '2026-11-14 09:00',
        registeredAt: '2026-11-12 10:00',
        registeredBy: 'Alejandro Castillo'
      }
    ],
    quote: {
      paymentTerms: 'Crédito 30 días',
      deliveryMode: 'A Domicilio',
      deliveryAddress: 'Zona Franca Santa Ana, Nave 2',
      items: [
        { id: 111, sku: 'PT-FLE-104', name: 'Lote Producto Terminado Modelo Industrial', category: 'Producto Terminado', provider: 'Industrias TexAlfa', unitPrice: 2800, quantity: 3, total: 8400, status: 'comprado', lostReason: null, lostNotes: '', lostDate: null },
        { id: 112, sku: 'SRV-CAP-03', name: 'Capacitación y Adopción de Usuarios NyTEX', category: 'Servicio', provider: 'Academia NyTEX', unitPrice: 750, quantity: 4, total: 3000, status: 'comprado', lostReason: null, lostNotes: '', lostDate: null }
      ]
    }
  },
  // NUEVAS SOLICITUDES OMNICANAL EN VIVO (CONSULTAS Y RECLAMOS)
  {
    id: 12,
    title: 'Consulta sobre disponibilidad y muestra de Hilo Poliéster en San Miguel',
    company: 'Confecciones La Unión',
    value: '$0',
    stage: 'Nuevo',
    date: '12 Nov',
    createdDate: '2026-11-12',
    branch: 'Sucursal Oriente (San Miguel)',
    priority: 'Media',
    contact: 'Marta Rivas',
    email: 'marta@confeccioneslaunion.com',
    phone: '+503 7234-5678',
    assignedTo: 'Carlos Méndez',
    channel: 'whatsapp',
    requestType: 'consulta',
    resolutionStatus: 'pendiente',
    resolutionNotes: '',
    resolvedAt: null,
    resolvedBy: null,
    slaMinutes: 18,
    messages: [
      { id: 1201, sender: 'client', channel: 'whatsapp', text: 'Hola buenas tardes, ¿tienen disponible Hilo Poliéster 40/2 blanco en la sucursal de San Miguel? Necesitamos 25 conos para esta misma tarde.', timestamp: '14:20' }
    ],
    activities: [],
    quote: { paymentTerms: 'Contado', deliveryMode: 'Entrega en Sucursal', deliveryAddress: '', items: [] }
  },
  {
    id: 13,
    title: 'Reclamo: Lote de Tela Gabardina con variación de tono azul',
    company: 'Uniformes del Pacífico',
    value: '$0',
    stage: 'Nuevo',
    date: '12 Nov',
    createdDate: '2026-11-12',
    branch: 'Sucursal Central (San Salvador)',
    priority: 'Alta',
    contact: '@uniformes_pacifico',
    email: 'produccion@uniformespacifico.com',
    phone: '+503 7890-4321',
    assignedTo: 'María Asesora',
    channel: 'instagram',
    requestType: 'reclamo',
    resolutionStatus: 'pendiente',
    resolutionNotes: '',
    resolvedAt: null,
    resolvedBy: null,
    slaMinutes: 38,
    messages: [
      { id: 1301, sender: 'client', channel: 'instagram', text: 'Hola, les escribo por este medio porque el lote de tela gabardina azul marino que recibimos en el pedido de ayer trae una tonalidad más clara que la muestra aprobada. Por favor necesitamos solución urgente ya que tenemos producción parada.', timestamp: '13:55' }
    ],
    activities: [],
    quote: { paymentTerms: 'Contado', deliveryMode: 'Entrega en Sucursal', deliveryAddress: '', items: [] }
  },
  {
    id: 14,
    title: 'Consulta: Formas de pago y catálogo para clientes nuevos',
    company: 'Textiles El Ángel',
    value: '$0',
    stage: 'Contactado',
    date: '10 Nov',
    createdDate: '2026-11-10',
    branch: 'Sucursal Central (San Salvador)',
    priority: 'Baja',
    contact: 'Fernando Castro',
    email: 'fcastro@elangeltextiles.com',
    phone: '+503 7111-2233',
    assignedTo: 'María Asesora',
    channel: 'email',
    requestType: 'consulta',
    resolutionStatus: 'resuelto',
    resolutionNotes: 'Se envió formulario de solicitud de crédito de CxC y lista de precios oficial por correo electrónico.',
    resolvedAt: '2026-11-10 16:45',
    resolvedBy: 'María Asesora',
    slaMinutes: 0,
    messages: [
      { id: 1401, sender: 'client', channel: 'email', text: 'Buenas tardes, somos una nueva empresa de confección en Soyapango. Quisiéramos saber qué requisitos solicitan para abrir línea de crédito y si tienen catálogo de telas.', timestamp: '2026-11-10 10:15' },
      { id: 1402, sender: 'agent', channel: 'email', text: 'Estimado Fernando, te adjunto el catálogo de productos vigente y los requisitos para apertura de cuenta en CxC.', timestamp: '2026-11-10 16:40' }
    ],
    activities: [],
    quote: { paymentTerms: 'Contado', deliveryMode: 'Entrega en Sucursal', deliveryAddress: '', items: [] }
  },
  {
    id: 15,
    title: 'Reclamo: Factura emitida con NIT incorrecto en compra de mostrador',
    company: 'Bordados y Estampados Cuscatlecos',
    value: '$0',
    stage: 'Contactado',
    date: '09 Nov',
    createdDate: '2026-11-09',
    branch: 'Sucursal Central (San Salvador)',
    priority: 'Alta',
    contact: 'Elena Rivas',
    email: 'erivas@bordadoscuscatlecos.com',
    phone: '+503 7999-8877',
    assignedTo: 'Alejandro Castillo',
    channel: 'web',
    requestType: 'reclamo',
    resolutionStatus: 'resuelto',
    resolutionNotes: 'Se coordinó con facturación la anulación del DTE y reemisión con el NIT corregido.',
    resolvedAt: '2026-11-09 11:20',
    resolvedBy: 'Alejandro Castillo',
    slaMinutes: 0,
    messages: [
      { id: 1501, sender: 'client', channel: 'web', text: 'Ticket web #492: El día de ayer compramos hilos en la sucursal Central y la factura salió con el NIT de persona natural en lugar de nuestra razón social.', timestamp: '2026-11-09 08:45' },
      { id: 1502, sender: 'agent', channel: 'web', text: 'Estimada Elena, ya se gestionó la nota de crédito y se reemitió el DTE con el NIT corporativo correcto.', timestamp: '2026-11-09 11:15' }
    ],
    activities: [],
    quote: { paymentTerms: 'Contado', deliveryMode: 'Entrega en Sucursal', deliveryAddress: '', items: [] }
  }
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
    createdDate: '2026-11-12',
    branch: 'Sucursal Central (San Salvador)',
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

  // Buscador reactivo por código SKU / texto en Cotización
  const [skuSelectTab, setSkuSelectTab] = useState('search'); // 'search' | 'list'
  const [skuSearchQuery, setSkuSearchQuery] = useState('');

  // Buscador reactivo en Modal Crear Oportunidad
  const [newDealSkuTab, setNewDealSkuTab] = useState('search'); // 'search' | 'list'
  const [newDealSkuSearchQuery, setNewDealSkuSearchQuery] = useState('');

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

  // Modo de Vista Principal: 'kanban' | 'omnichannel' (Bandeja Omnicanal) | 'analytics'
  const [currentMainView, setCurrentMainView] = useState('kanban');

  // Estado de la Bandeja Omnicanal (WhatsApp, Instagram, Correo & Web)
  const [omnichannelFilterStatus, setOmnichannelFilterStatus] = useState('pendiente'); // 'pendiente' (DEFAULT: solo pendientes) | 'resuelto' | 'todos'
  const [omnichannelFilterType, setOmnichannelFilterType] = useState('todos'); // 'todos' | 'cotizacion' | 'consulta' | 'reclamo'
  const [omnichannelFilterChannel, setOmnichannelFilterChannel] = useState('todos'); // 'todos' | 'whatsapp' | 'instagram' | 'email' | 'web'
  const [omnichannelSearch, setOmnichannelSearch] = useState('');
  const [activeChatDeal, setActiveChatDeal] = useState(null);
  const [newChatReplyText, setNewChatReplyText] = useState('');
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [simulatorForm, setSimulatorForm] = useState({
    channel: 'whatsapp',
    requestType: 'cotizacion',
    company: 'Textiles El Volcán',
    contact: 'Guillermo Mendoza',
    contactHandle: '+503 7988-1122',
    title: 'Cotización urgente de 200 yardas de tela Oxford',
    messageText: 'Buenas tardes, quisiéramos saber el precio por yarda de tela Oxford celeste y si tienen disponibilidad para entrega inmediata en San Salvador.'
  });
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  const [dealToResolve, setDealToResolve] = useState(null);
  const [resolveNotesInput, setResolveNotesInput] = useState('');

  // Filtros Analíticos de Cotizaciones
  const [analyticsDatePreset, setAnalyticsDatePreset] = useState('all'); // 'all' | 'today' | 'last7' | 'thisMonth' | 'last30' | 'year' | 'custom'
  const [analyticsDateFrom, setAnalyticsDateFrom] = useState('2025-01-01');
  const [analyticsDateTo, setAnalyticsDateTo] = useState('2026-12-31');
  const [analyticsBranch, setAnalyticsBranch] = useState('TODAS');
  const [analyticsSeller, setAnalyticsSeller] = useState('TODOS');
  const [analyticsProvider, setAnalyticsProvider] = useState('TODOS');
  const [analyticsCategory, setAnalyticsCategory] = useState('TODAS');
  const [analyticsSku, setAnalyticsSku] = useState('TODOS');
  const [analyticsActiveTab, setAnalyticsActiveTab] = useState('sku'); // 'total_empresa' | 'sucursal' | 'vendedor' | 'proveedor' | 'categoria' | 'sku'
  const [skuFilterSearch, setSkuFilterSearch] = useState('');
  const [skuMetricMode, setSkuMetricMode] = useState('all'); // 'all' | 'qty' | 'percent' | 'amount'
  const [skuStatusFilter, setSkuStatusFilter] = useState('todos'); // 'todos' | 'con_perdidas' | 'con_ventas' | '100_vendido' | '100_perdido'
  const [skuSuccessFilter, setSkuSuccessFilter] = useState('todos'); // 'todos' | 'gt75' | '50_75' | 'lt50' | 'zero'
  const [expandedSkuDetail, setExpandedSkuDetail] = useState(null); // sku code string for drilldown
  const [expandedReason, setExpandedReason] = useState(null);

  // Atajos para presets de fecha en el panel analítico
  const handleApplyDatePreset = (preset) => {
    setAnalyticsDatePreset(preset);
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const todayStr = `${yyyy}-${mm}-${dd}`;

    if (preset === 'today') {
      setAnalyticsDateFrom(todayStr);
      setAnalyticsDateTo(todayStr);
    } else if (preset === 'last7') {
      const d = new Date(now);
      d.setDate(d.getDate() - 7);
      const dY = d.getFullYear();
      const dM = String(d.getMonth() + 1).padStart(2, '0');
      const dD = String(d.getDate()).padStart(2, '0');
      setAnalyticsDateFrom(`${dY}-${dM}-${dD}`);
      setAnalyticsDateTo(todayStr);
    } else if (preset === 'thisMonth') {
      const lastDay = new Date(yyyy, now.getMonth() + 1, 0).getDate();
      setAnalyticsDateFrom(`${yyyy}-${mm}-01`);
      setAnalyticsDateTo(`${yyyy}-${mm}-${String(lastDay).padStart(2, '0')}`);
    } else if (preset === 'last30') {
      const d = new Date(now);
      d.setDate(d.getDate() - 30);
      const dY = d.getFullYear();
      const dM = String(d.getMonth() + 1).padStart(2, '0');
      const dD = String(d.getDate()).padStart(2, '0');
      setAnalyticsDateFrom(`${dY}-${dM}-${dD}`);
      setAnalyticsDateTo(todayStr);
    } else if (preset === 'year') {
      setAnalyticsDateFrom(`${yyyy}-01-01`);
      setAnalyticsDateTo(`${yyyy}-12-31`);
    } else if (preset === 'all') {
      setAnalyticsDateFrom('2025-01-01');
      setAnalyticsDateTo('2027-12-31');
    }
  };

  const handleResetAnalyticsFilters = () => {
    setAnalyticsDatePreset('all');
    setAnalyticsDateFrom('2025-01-01');
    setAnalyticsDateTo('2027-12-31');
    setAnalyticsBranch('TODAS');
    setAnalyticsSeller('TODOS');
    setAnalyticsProvider('TODOS');
    setAnalyticsCategory('TODAS');
    setAnalyticsSku('TODOS');
    setSkuFilterSearch('');
    setSkuMetricMode('all');
    setSkuStatusFilter('todos');
    setSkuSuccessFilter('todos');
    setExpandedSkuDetail(null);
    showToast('🔄 Filtros analíticos restablecidos a Total Empresa.');
  };

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

  // Filtrado reactivo en tiempo real de productos del Kardex (reduce a medida que se teclean letras o números)
  const filteredKardex = useMemo(() => {
    if (!skuSearchQuery.trim()) return kardexCatalog.slice(0, 8);
    const q = skuSearchQuery.toLowerCase().trim();
    return kardexCatalog.filter(k => 
      (k.sku || '').toLowerCase().includes(q) ||
      (k.name || '').toLowerCase().includes(q) ||
      (k.category || '').toLowerCase().includes(q)
    );
  }, [kardexCatalog, skuSearchQuery]);

  const filteredNewDealKardex = useMemo(() => {
    if (!newDealSkuSearchQuery.trim()) return kardexCatalog.slice(0, 8);
    const q = newDealSkuSearchQuery.toLowerCase().trim();
    return kardexCatalog.filter(k => 
      (k.sku || '').toLowerCase().includes(q) ||
      (k.name || '').toLowerCase().includes(q) ||
      (k.category || '').toLowerCase().includes(q)
    );
  }, [kardexCatalog, newDealSkuSearchQuery]);

  // Proveedores, Categorías y SKUs únicos para los selectores analíticos
  const availableProviders = useMemo(() => {
    const set = new Set();
    kardexCatalog.forEach(k => { if (k.provider) set.add(k.provider); });
    deals.forEach(d => {
      (d.quote?.items || []).forEach(it => { if (it.provider) set.add(it.provider); });
    });
    return Array.from(set).sort();
  }, [kardexCatalog, deals]);

  const availableCategories = useMemo(() => {
    const set = new Set();
    kardexCatalog.forEach(k => { if (k.category) set.add(k.category); });
    deals.forEach(d => {
      (d.quote?.items || []).forEach(it => { if (it.category) set.add(it.category); });
    });
    return Array.from(set).sort();
  }, [kardexCatalog, deals]);

  const availableSkus = useMemo(() => {
    const map = new Map();
    kardexCatalog.forEach(k => {
      if (k.sku) map.set(k.sku, k.name || k.sku);
    });
    deals.forEach(d => {
      (d.quote?.items || []).forEach(it => {
        if (it.sku && !map.has(it.sku)) map.set(it.sku, it.name || it.sku);
      });
    });
    return Array.from(map.entries()).map(([sku, name]) => ({ sku, name })).sort((a,b) => a.sku.localeCompare(b.sku));
  }, [kardexCatalog, deals]);

  // Motor Analítico de Cotizaciones Generadas vs Vendidas & Pérdidas
  const analyticsData = useMemo(() => {
    const isDateInRange = (dStr) => {
      if (!dStr) return true;
      let normalized = dStr;
      if (/^\d{4}-\d{2}-\d{2}/.test(dStr)) {
        normalized = dStr.slice(0, 10);
      }
      if (analyticsDateFrom && normalized < analyticsDateFrom) return false;
      if (analyticsDateTo && normalized > analyticsDateTo) return false;
      return true;
    };

    const filtered = deals.filter(deal => {
      const dealDate = deal.createdDate || '2026-11-01';
      if (!isDateInRange(dealDate)) return false;
      if (analyticsBranch !== 'TODAS' && deal.branch !== analyticsBranch) return false;
      if (analyticsSeller !== 'TODOS' && deal.assignedTo !== analyticsSeller) return false;

      if (analyticsProvider !== 'TODOS' || analyticsCategory !== 'TODAS' || analyticsSku !== 'TODOS') {
        const items = deal.quote?.items || [];
        const hasMatching = items.some(it => {
          if (analyticsProvider !== 'TODOS' && (it.provider || '') !== analyticsProvider) return false;
          if (analyticsCategory !== 'TODAS' && (it.category || '') !== analyticsCategory) return false;
          if (analyticsSku !== 'TODOS' && it.sku !== analyticsSku) return false;
          return true;
        });
        if (!hasMatching) return false;
      }
      return true;
    });

    let totalQuotations = filtered.length;
    let totalQuotedAmount = 0;
    let totalWonQuotations = 0;
    let totalSoldAmount = 0;
    let totalOpenQuotations = 0;
    let totalPendingAmount = 0;
    let totalLostQuotations = 0;
    let totalLostAmount = 0;
    let totalLostItemsCount = 0;

    const reasonsMap = {};
    LOST_SALE_REASONS.forEach(r => {
      reasonsMap[r] = { reason: r, count: 0, dealIds: new Set(), amount: 0, items: [] };
    });

    const branchMap = {};
    BRANCHES_LIST.forEach(b => {
      branchMap[b] = { branch: b, genCount: 0, genAmount: 0, wonCount: 0, wonAmount: 0, lostCount: 0, lostAmount: 0, openCount: 0, openAmount: 0, lostReasons: {} };
    });

    const sellerMap = {};
    SELLERS_LIST.forEach(s => {
      sellerMap[s] = { seller: s, genCount: 0, genAmount: 0, wonCount: 0, wonAmount: 0, lostCount: 0, lostAmount: 0, openCount: 0, openAmount: 0, lostReasons: {} };
    });

    const providerMap = {};
    const categoryMap = {};
    const skuMap = {};

    filtered.forEach(deal => {
      const bName = deal.branch || 'Sucursal Central (San Salvador)';
      const sName = deal.assignedTo || 'María Asesora';

      if (!branchMap[bName]) {
        branchMap[bName] = { branch: bName, genCount: 0, genAmount: 0, wonCount: 0, wonAmount: 0, lostCount: 0, lostAmount: 0, openCount: 0, openAmount: 0, lostReasons: {} };
      }
      if (!sellerMap[sName]) {
        sellerMap[sName] = { seller: sName, genCount: 0, genAmount: 0, wonCount: 0, wonAmount: 0, lostCount: 0, lostAmount: 0, openCount: 0, openAmount: 0, lostReasons: {} };
      }

      branchMap[bName].genCount += 1;
      sellerMap[sName].genCount += 1;

      let dealQuoted = 0;
      let dealSold = 0;
      let dealLost = 0;
      let dealPending = 0;
      let hasBought = false;
      let hasLost = false;
      let hasPending = false;

      const items = deal.quote?.items || [];
      items.forEach(it => {
        if (analyticsProvider !== 'TODOS' && (it.provider || '') !== analyticsProvider) return;
        if (analyticsCategory !== 'TODAS' && (it.category || '') !== analyticsCategory) return;
        if (analyticsSku !== 'TODOS' && it.sku !== analyticsSku) return;

        const sub = (Number(it.unitPrice) || 0) * (Number(it.quantity) || 1);
        dealQuoted += sub;

        const prov = it.provider || 'Proveedor General';
        const cat = it.category || 'General';
        const skuCode = it.sku;

        if (!providerMap[prov]) {
          providerMap[prov] = { provider: prov, quotedAmount: 0, soldAmount: 0, lostAmount: 0, itemsQuoted: 0, itemsSold: 0, itemsLost: 0 };
        }
        providerMap[prov].quotedAmount += sub;
        providerMap[prov].itemsQuoted += (Number(it.quantity) || 1);

        if (!categoryMap[cat]) {
          categoryMap[cat] = { category: cat, quotedAmount: 0, soldAmount: 0, lostAmount: 0, itemsQuoted: 0, itemsSold: 0, itemsLost: 0 };
        }
        categoryMap[cat].quotedAmount += sub;
        categoryMap[cat].itemsQuoted += (Number(it.quantity) || 1);

        if (!skuMap[skuCode]) {
          skuMap[skuCode] = { 
            sku: skuCode, 
            name: it.name, 
            category: cat, 
            provider: prov, 
            unitPrice: it.unitPrice, 
            quotedAmount: 0, 
            soldAmount: 0, 
            lostAmount: 0, 
            pendingAmount: 0,
            unitsQuoted: 0, 
            unitsSold: 0, 
            unitsLost: 0, 
            unitsPending: 0,
            reasons: {},
            lostCases: []
          };
        }
        skuMap[skuCode].quotedAmount += sub;
        skuMap[skuCode].unitsQuoted += (Number(it.quantity) || 1);

        if (it.status === 'comprado') {
          dealSold += sub;
          hasBought = true;
          providerMap[prov].soldAmount += sub;
          providerMap[prov].itemsSold += (Number(it.quantity) || 1);
          categoryMap[cat].soldAmount += sub;
          categoryMap[cat].itemsSold += (Number(it.quantity) || 1);
          skuMap[skuCode].soldAmount += sub;
          skuMap[skuCode].unitsSold += (Number(it.quantity) || 1);
        } else if (it.status === 'perdido') {
          dealLost += sub;
          hasLost = true;
          totalLostItemsCount += 1;
          providerMap[prov].lostAmount += sub;
          providerMap[prov].itemsLost += (Number(it.quantity) || 1);
          categoryMap[cat].lostAmount += sub;
          categoryMap[cat].itemsLost += (Number(it.quantity) || 1);
          skuMap[skuCode].lostAmount += sub;
          skuMap[skuCode].unitsLost += (Number(it.quantity) || 1);

          const rKey = it.lostReason || 'Otros / Sin especificar';
          if (!reasonsMap[rKey]) {
            reasonsMap[rKey] = { reason: rKey, count: 0, dealIds: new Set(), amount: 0, items: [] };
          }
          reasonsMap[rKey].count += 1;
          reasonsMap[rKey].dealIds.add(deal.id);
          reasonsMap[rKey].amount += sub;
          const lostCaseItem = {
            dealId: deal.id,
            company: deal.company,
            title: deal.title,
            seller: sName,
            branch: bName,
            date: deal.createdDate || deal.date,
            sku: it.sku,
            name: it.name,
            amount: sub,
            quantity: it.quantity,
            notes: it.lostNotes || '',
            reason: rKey
          };
          reasonsMap[rKey].items.push(lostCaseItem);

          branchMap[bName].lostReasons[rKey] = (branchMap[bName].lostReasons[rKey] || 0) + sub;
          sellerMap[sName].lostReasons[rKey] = (sellerMap[sName].lostReasons[rKey] || 0) + sub;
          skuMap[skuCode].reasons[rKey] = (skuMap[skuCode].reasons[rKey] || 0) + (Number(it.quantity) || 1);
          skuMap[skuCode].lostCases.push(lostCaseItem);
        } else {
          dealPending += sub;
          hasPending = true;
          skuMap[skuCode].pendingAmount += sub;
          skuMap[skuCode].unitsPending += (Number(it.quantity) || 1);
        }
      });

      totalQuotedAmount += dealQuoted;
      totalSoldAmount += dealSold;
      totalLostAmount += dealLost;
      totalPendingAmount += dealPending;

      branchMap[bName].genAmount += dealQuoted;
      branchMap[bName].wonAmount += dealSold;
      branchMap[bName].lostAmount += dealLost;
      branchMap[bName].openAmount += dealPending;

      sellerMap[sName].genAmount += dealQuoted;
      sellerMap[sName].wonAmount += dealSold;
      sellerMap[sName].lostAmount += dealLost;
      sellerMap[sName].openAmount += dealPending;

      if (deal.stage === 'Ganado' || hasBought) {
        totalWonQuotations += 1;
        branchMap[bName].wonCount += 1;
        sellerMap[sName].wonCount += 1;
      }
      if (hasLost) {
        totalLostQuotations += 1;
        branchMap[bName].lostCount += 1;
        sellerMap[sName].lostCount += 1;
      }
      if (hasPending || deal.stage === 'Nuevo' || deal.stage === 'Contactado' || deal.stage === 'Calificado' || (deal.stage === 'Cotizado' && !hasBought && !hasLost)) {
        totalOpenQuotations += 1;
        branchMap[bName].openCount += 1;
        sellerMap[sName].openCount += 1;
      }
    });

    const conversionRateQty = totalQuotations > 0 ? ((totalWonQuotations / totalQuotations) * 100).toFixed(1) : '0.0';
    const conversionRateAmount = totalQuotedAmount > 0 ? ((totalSoldAmount / totalQuotedAmount) * 100).toFixed(1) : '0.0';
    const pendingRate = totalQuotations > 0 ? ((totalOpenQuotations / totalQuotations) * 100).toFixed(1) : '0.0';
    const lossRateAmount = totalQuotedAmount > 0 ? ((totalLostAmount / totalQuotedAmount) * 100).toFixed(1) : '0.0';
    const lossRateQty = totalQuotations > 0 ? ((totalLostQuotations / totalQuotations) * 100).toFixed(1) : '0.0';

    const reasonsList = Object.values(reasonsMap).map(r => ({
      ...r,
      dealCount: r.dealIds.size,
      percentOfLoss: totalLostAmount > 0 ? ((r.amount / totalLostAmount) * 100).toFixed(1) : '0.0',
      percentOfTotal: totalQuotedAmount > 0 ? ((r.amount / totalQuotedAmount) * 100).toFixed(1) : '0.0'
    })).sort((a, b) => b.amount - a.amount);

    const getTopReason = (mapObj) => {
      let top = 'Ninguno';
      let max = 0;
      Object.entries(mapObj || {}).forEach(([r, amt]) => {
        if (amt > max) {
          max = amt;
          top = r;
        }
      });
      return top;
    };

    const branchList = Object.values(branchMap).map(b => ({
      ...b,
      winRateQty: b.genCount > 0 ? ((b.wonCount / b.genCount) * 100).toFixed(1) : '0.0',
      winRateAmount: b.genAmount > 0 ? ((b.wonAmount / b.genAmount) * 100).toFixed(1) : '0.0',
      lossRateAmount: b.genAmount > 0 ? ((b.lostAmount / b.genAmount) * 100).toFixed(1) : '0.0',
      topLostReason: getTopReason(b.lostReasons)
    })).sort((a, b) => b.genAmount - a.genAmount);

    const sellerList = Object.values(sellerMap).map(s => ({
      ...s,
      winRateQty: s.genCount > 0 ? ((s.wonCount / s.genCount) * 100).toFixed(1) : '0.0',
      winRateAmount: s.genAmount > 0 ? ((s.wonAmount / s.genAmount) * 100).toFixed(1) : '0.0',
      lossRateAmount: s.genAmount > 0 ? ((s.lostAmount / s.genAmount) * 100).toFixed(1) : '0.0',
      topLostReason: getTopReason(s.lostReasons)
    })).sort((a, b) => b.wonAmount - a.wonAmount);

    const providerList = Object.values(providerMap).map(p => ({
      ...p,
      winRateAmount: p.quotedAmount > 0 ? ((p.soldAmount / p.quotedAmount) * 100).toFixed(1) : '0.0',
      lossRateAmount: p.quotedAmount > 0 ? ((p.lostAmount / p.quotedAmount) * 100).toFixed(1) : '0.0'
    })).sort((a, b) => b.quotedAmount - a.quotedAmount);

    const categoryList = Object.values(categoryMap).map(c => ({
      ...c,
      winRateAmount: c.quotedAmount > 0 ? ((c.soldAmount / c.quotedAmount) * 100).toFixed(1) : '0.0',
      lossRateAmount: c.quotedAmount > 0 ? ((c.lostAmount / c.quotedAmount) * 100).toFixed(1) : '0.0'
    })).sort((a, b) => b.quotedAmount - a.quotedAmount);

    const skuList = Object.values(skuMap).map(s => {
      const winRateQty = s.unitsQuoted > 0 ? ((s.unitsSold / s.unitsQuoted) * 100).toFixed(1) : '0.0';
      const lostRateQty = s.unitsQuoted > 0 ? ((s.unitsLost / s.unitsQuoted) * 100).toFixed(1) : '0.0';
      const pendingRateQty = s.unitsQuoted > 0 ? ((s.unitsPending / s.unitsQuoted) * 100).toFixed(1) : '0.0';
      const winRateAmount = s.quotedAmount > 0 ? ((s.soldAmount / s.quotedAmount) * 100).toFixed(1) : '0.0';
      const lostRateAmount = s.quotedAmount > 0 ? ((s.lostAmount / s.quotedAmount) * 100).toFixed(1) : '0.0';

      const reasonsBreakdown = Object.entries(s.reasons || {}).map(([reason, qty]) => {
        const amt = (s.lostCases || []).filter(c => c.reason === reason).reduce((sum, c) => sum + c.amount, 0);
        const pctOfLoss = s.unitsLost > 0 ? ((qty / s.unitsLost) * 100).toFixed(0) : 0;
        return { reason, qty, amt, pctOfLoss };
      }).sort((a, b) => b.qty - a.qty);

      return {
        ...s,
        winRateQty,
        lostRateQty,
        pendingRateQty,
        winRateAmount,
        lostRateAmount,
        reasonsBreakdown,
        topReason: getTopReason(s.reasons)
      };
    }).sort((a, b) => b.unitsQuoted - a.unitsQuoted);

    const totalDistinctSkusQuoted = Object.keys(skuMap).length;
    const totalSkusWithSales = Object.values(skuMap).filter(s => s.unitsSold > 0).length;
    const totalSkusWithLosses = Object.values(skuMap).filter(s => s.unitsLost > 0).length;
    const totalUnitsQuoted = Object.values(skuMap).reduce((sum, s) => sum + s.unitsQuoted, 0);
    const totalUnitsSold = Object.values(skuMap).reduce((sum, s) => sum + s.unitsSold, 0);
    const totalUnitsLost = Object.values(skuMap).reduce((sum, s) => sum + s.unitsLost, 0);
    const skuOverallWinRateQty = totalUnitsQuoted > 0 ? ((totalUnitsSold / totalUnitsQuoted) * 100).toFixed(1) : '0.0';
    const skuOverallLostRateQty = totalUnitsQuoted > 0 ? ((totalUnitsLost / totalUnitsQuoted) * 100).toFixed(1) : '0.0';

    return {
      summary: {
        totalQuotations,
        totalQuotedAmount,
        totalWonQuotations,
        totalSoldAmount,
        conversionRateQty,
        conversionRateAmount,
        totalOpenQuotations,
        totalPendingAmount,
        pendingRate,
        totalLostQuotations,
        totalLostAmount,
        totalLostItemsCount,
        lossRateAmount,
        lossRateQty,
        totalDistinctSkusQuoted,
        totalSkusWithSales,
        totalSkusWithLosses,
        totalUnitsQuoted,
        totalUnitsSold,
        totalUnitsLost,
        skuOverallWinRateQty,
        skuOverallLostRateQty
      },
      reasonsList,
      branchList,
      sellerList,
      providerList,
      categoryList,
      skuList,
      filteredDealsCount: filtered.length
    };
  }, [deals, analyticsDateFrom, analyticsDateTo, analyticsBranch, analyticsSeller, analyticsProvider, analyticsCategory, analyticsSku]);

  // Acciones de la Bandeja Omnicanal
  const pendingOmnichannelCount = deals.filter(d => (d.resolutionStatus || 'pendiente') === 'pendiente').length;
  const resolvedOmnichannelCount = deals.filter(d => d.resolutionStatus === 'resuelto').length;

  const handleOpenChat = (deal) => {
    setActiveChatDeal(deal);
    setNewChatReplyText('');
  };

  const handleSendChatReply = async () => {
    if (!newChatReplyText.trim() || !activeChatDeal) return;
    const replyMsg = {
      id: Date.now(),
      sender: 'agent',
      channel: activeChatDeal.channel || 'whatsapp',
      text: newChatReplyText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...(activeChatDeal.messages || []), replyMsg];
    const updatedDeal = { ...activeChatDeal, messages: updatedMessages };

    setActiveChatDeal(updatedDeal);
    setDeals(prev => prev.map(d => d.id === updatedDeal.id ? updatedDeal : d));
    setNewChatReplyText('');
    showToast(`📤 Respuesta enviada a ${activeChatDeal.contact || activeChatDeal.company} vía ${(activeChatDeal.channel || 'canal').toUpperCase()}`);

    try {
      await fetch('/api/crm/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dealId: activeChatDeal.id,
          channel: activeChatDeal.channel,
          recipient: activeChatDeal.contact || activeChatDeal.phone || activeChatDeal.email,
          text: replyMsg.text
        })
      });
    } catch (e) {
      // Offline fallback
    }
  };

  const handleOpenResolveModal = (deal) => {
    setDealToResolve(deal);
    setResolveNotesInput(deal.resolutionNotes || (
      deal.requestType === 'cotizacion' 
        ? 'Cotización atendida y acordada con el cliente.' 
        : deal.requestType === 'consulta'
        ? 'Consulta técnica respondida y aclarada.'
        : 'Reclamo investigado y solucionado con satisfacción del cliente.'
    ));
    setIsResolveModalOpen(true);
  };

  const handleConfirmResolve = () => {
    if (!dealToResolve) return;
    const resolvedAtStr = new Date().toLocaleString();
    const updatedDeal = {
      ...dealToResolve,
      resolutionStatus: 'resuelto',
      resolvedAt: resolvedAtStr,
      resolvedBy: dealToResolve.assignedTo || 'María Asesora',
      resolutionNotes: resolveNotesInput.trim() || 'Solicitud finalizada con éxito.'
    };

    setDeals(prev => prev.map(d => d.id === updatedDeal.id ? updatedDeal : d));
    if (activeChatDeal && activeChatDeal.id === updatedDeal.id) {
      setActiveChatDeal(updatedDeal);
    }
    setIsResolveModalOpen(false);
    setDealToResolve(null);
    showToast(`✓ Solicitud de "${updatedDeal.company}" marcada como FINALIZADA y archivada.`);
  };

  const handleReopenRequest = (deal) => {
    const updatedDeal = {
      ...deal,
      resolutionStatus: 'pendiente',
      resolvedAt: null,
      resolvedBy: null,
      resolutionNotes: ''
    };
    setDeals(prev => prev.map(d => d.id === updatedDeal.id ? updatedDeal : d));
    if (activeChatDeal && activeChatDeal.id === updatedDeal.id) {
      setActiveChatDeal(updatedDeal);
    }
    showToast(`↩️ Solicitud de "${deal.company}" reactivada a estado PENDIENTE.`);
  };

  const handleSimulateIncomingMessage = async () => {
    if (!simulatorForm.company.trim() || !simulatorForm.messageText.trim()) {
      showToast('⚠️ Por favor completa el nombre de empresa y el mensaje a simular.');
      return;
    }

    const newDealId = Date.now();
    const nowTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const nowDateStr = new Date().toISOString().slice(0, 10);

    const newIncomingDeal = {
      id: newDealId,
      title: simulatorForm.title.trim() || `Solicitud de ${simulatorForm.requestType.toUpperCase()} - ${simulatorForm.company.trim()}`,
      company: simulatorForm.company.trim(),
      value: simulatorForm.requestType === 'cotizacion' ? '$2,500' : '$0',
      stage: 'Nuevo',
      date: 'Hoy',
      createdDate: nowDateStr,
      branch: 'Sucursal Central (San Salvador)',
      priority: simulatorForm.requestType === 'reclamo' ? 'Alta' : 'Media',
      contact: simulatorForm.contact.trim() || 'Contacto Prospecto',
      email: simulatorForm.channel === 'email' ? simulatorForm.contactHandle.trim() : 'prospecto@empresa.com',
      phone: simulatorForm.channel === 'whatsapp' ? simulatorForm.contactHandle.trim() : '+503 7000-0000',
      assignedTo: 'María Asesora',
      channel: simulatorForm.channel,
      requestType: simulatorForm.requestType,
      resolutionStatus: 'pendiente',
      resolutionNotes: '',
      resolvedAt: null,
      resolvedBy: null,
      slaMinutes: simulatorForm.requestType === 'reclamo' ? 5 : 15,
      messages: [
        {
          id: Date.now() + 1,
          sender: 'client',
          channel: simulatorForm.channel,
          text: simulatorForm.messageText.trim(),
          timestamp: nowTimeStr
        }
      ],
      activities: [],
      quote: {
        paymentTerms: 'Contado',
        deliveryMode: 'Entrega en Sucursal',
        deliveryAddress: '',
        items: []
      }
    };

    setDeals(prev => [newIncomingDeal, ...prev]);
    setIsSimulatorOpen(false);
    showToast(`🔔 ¡Nuevo mensaje recibido de ${simulatorForm.channel.toUpperCase()}! Solicitud agregada como PENDIENTE.`);

    try {
      await fetch('/api/crm/webhook/omnichannel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel: simulatorForm.channel,
          requestType: simulatorForm.requestType,
          contactName: simulatorForm.contact,
          phone: simulatorForm.contactHandle,
          email: simulatorForm.contactHandle,
          messageText: simulatorForm.messageText,
          title: newIncomingDeal.title
        })
      });
    } catch (e) {
      // Offline fallback
    }
  };

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
      provider: kardexItem ? (kardexItem.provider || 'Proveedor General') : 'Proveedor General',
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
      createdDate: formData.createdDate || new Date().toISOString().split('T')[0],
      branch: formData.branch || 'Sucursal Central (San Salvador)',
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

    if (newDealItem.quote.items.length > 0) {
      newDealItem.value = calculateQuoteActiveValue(newDealItem.quote, newDealItem.stage, formattedVal);
    }

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
      provider: kardexItem ? (kardexItem.provider || 'Proveedor General') : 'Proveedor General',
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
        channel.postMessage({ type: 'ORDER_CREATED', orderCode, time: Date.now() });
      } catch (e) {}
      try {
        localStorage.setItem('nytex_new_order_timestamp', String(Date.now()));
        window.dispatchEvent(new Event('storage'));
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

  // Render Auditoria de Motivos de Ventas Perdidas (1 al 5)
  const renderLossReasonsAudit = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-gray-100 pb-3">
        <div>
          <h3 className="text-base font-black text-gray-900 flex items-center space-x-2">
            <i className="fas fa-list-ol text-red-600"></i>
            <span>Motivos de Ventas Perdidas (Razones Estratégicas de No Compra)</span>
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Auditoría de por qué los clientes declinaron o descartaron SKUs cotizados (Fuga total: ${analyticsData.summary.totalLostAmount.toLocaleString()} USD en ${analyticsData.summary.totalLostItemsCount} SKUs).
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold bg-red-50 text-red-700 border border-red-200 px-2.5 py-1 rounded-lg">
            {analyticsData.reasonsList.filter(r => r.amount > 0).length} Motivos con Incidencia Activa
          </span>
          <button
            type="button"
            onClick={() => setAnalyticsActiveTab('sku')}
            className="text-xs font-bold bg-blue-50 text-[#006EAD] border border-blue-200 px-2.5 py-1 rounded-lg hover:bg-blue-100 transition"
          >
            📦 Ver Impacto por Códigos SKU ➔
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {analyticsData.reasonsList.map((r) => {
          const hasLoss = r.amount > 0;
          return (
            <div
              key={r.reason}
              className={`p-4 rounded-xl border transition ${
                hasLoss
                  ? 'bg-red-50/30 border-red-200 hover:border-red-400 hover:shadow-xs'
                  : 'bg-gray-50/50 border-gray-200 opacity-60'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`text-xs font-black ${hasLoss ? 'text-red-900' : 'text-gray-500'}`}>
                  {r.reason}
                </span>
                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                  hasLoss ? 'bg-red-200 text-red-900' : 'bg-gray-200 text-gray-600'
                }`}>
                  {r.percentOfLoss}% de la fuga
                </span>
              </div>

              <div className="flex justify-between items-baseline text-xs mb-2">
                <span className="text-gray-500 font-semibold">{r.count} SKUs ({r.dealCount} cotizaciones)</span>
                <span className={`font-mono font-black text-sm ${hasLoss ? 'text-red-700' : 'text-gray-400'}`}>
                  ${r.amount.toLocaleString()} USD
                </span>
              </div>

              {/* Barra de impacto */}
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mb-2">
                <div 
                  className="bg-red-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, Number(r.percentOfLoss))}%` }}
                ></div>
              </div>

              {hasLoss && (
                <button
                  type="button"
                  onClick={() => setExpandedReason(expandedReason === r.reason ? null : r.reason)}
                  className="text-[11px] font-bold text-red-700 hover:text-red-900 underline flex items-center space-x-1 mt-1"
                >
                  <span>{expandedReason === r.reason ? 'Ocultar Casos ▲' : `Ver ${r.items.length} Casos ▼`}</span>
                </button>
              )}

              {/* Casos expandidos */}
              {expandedReason === r.reason && (
                <div className="mt-3 pt-3 border-t border-red-200 space-y-2 text-[11px]">
                  {r.items.map((it, i) => (
                    <div key={i} className="bg-white p-2.5 rounded-lg border border-red-100 shadow-2xs">
                      <div className="flex justify-between font-bold text-gray-900">
                        <span>{it.company}</span>
                        <span className="text-red-700 font-mono">${it.amount.toLocaleString()}</span>
                      </div>
                      <div className="text-gray-700 text-[11px] mt-0.5">
                        <strong className="text-red-800">{it.sku}</strong> • {it.name} ({it.quantity} un.)
                      </div>
                      <div className="text-gray-400 text-[10px] mt-1 flex flex-wrap gap-2">
                        <span>📍 {it.branch}</span>
                        <span>👤 {it.seller}</span>
                        <span>📅 {it.date}</span>
                      </div>
                      {it.notes && (
                        <div className="text-amber-900 bg-amber-50 p-1.5 rounded mt-1 text-[10px] italic border border-amber-200">
                          "{it.notes}"
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

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
      <div className="flex flex-col border-b border-gray-200 px-6 py-3.5 bg-white sticky top-0 z-10 shrink-0 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center text-lg text-gray-700">
              <span className="cursor-pointer hover:underline text-[#006EAD]" onClick={() => navigate('/portal')}>Portal</span>
              <span className="mx-2 text-gray-400">/</span>
              <span className="font-bold text-[#0A2540]">NyTEX CRM</span>
            </div>

            {/* Selector de Vista Principal: Kanban vs Indicadores & Pérdidas */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-gray-200">
              <button
                type="button"
                onClick={() => setCurrentMainView('kanban')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                  currentMainView === 'kanban'
                    ? 'bg-white text-[#0A2540] shadow-xs'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                <i className="fas fa-columns"></i>
                <span>Tablero Kanban</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentMainView('omnichannel')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                  currentMainView === 'omnichannel'
                    ? 'bg-[#006EAD] text-white shadow-xs'
                    : 'text-gray-600 hover:text-[#006EAD]'
                }`}
              >
                <i className="fas fa-comments"></i>
                <span>Bandeja Omnicanal</span>
                {pendingOmnichannelCount > 0 ? (
                  <span className="bg-amber-400 text-slate-900 text-[10px] font-black px-1.5 py-0.2 rounded-full animate-pulse">
                    {pendingOmnichannelCount}
                  </span>
                ) : (
                  <span className="bg-emerald-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">✓</span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setCurrentMainView('analytics')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                  currentMainView === 'analytics'
                    ? 'bg-[#006EAD] text-white shadow-xs'
                    : 'text-gray-600 hover:text-[#006EAD]'
                }`}
              >
                <i className="fas fa-chart-pie"></i>
                <span>Indicadores: Cotizaciones vs Vendidas</span>
                <span className="bg-emerald-400 text-slate-900 text-[10px] font-black px-1.5 py-0.2 rounded-full">BI</span>
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {currentMainView === 'kanban' && (
              <button 
                onClick={() => setShowFilterBar(!showFilterBar)}
                className={`border px-3.5 py-2 rounded-md text-xs font-semibold transition-colors shadow-sm flex items-center ${
                  showFilterBar ? 'bg-blue-50 border-[#006EAD] text-[#006EAD]' : 'bg-white border-gray-300 hover:bg-gray-50 text-gray-700'
                }`}
              >
                <i className="fas fa-filter mr-1.5"></i>Filtrar
              </button>
            )}
            <button 
              onClick={handleOpenModal}
              className="bg-[#006EAD] hover:bg-[#005587] text-white px-3.5 py-2 rounded-md text-xs font-bold transition-all shadow-sm flex items-center active:scale-95"
            >
              <i className="fas fa-plus mr-1.5"></i>NUEVA OPORTUNIDAD
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
        {currentMainView === 'kanban' && (
          <>
            {/* Banner de Conversión Comercial con acceso directo a BI */}
            <div className="bg-gradient-to-r from-[#0A2540] via-slate-900 to-[#006EAD] text-white p-4 rounded-xl shadow-sm mb-6 flex flex-wrap items-center justify-between gap-4 border border-blue-900 min-w-[800px]">
              <div className="flex items-center space-x-3">
                <div className="w-11 h-11 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-xl text-blue-300">
                  <i className="fas fa-chart-line"></i>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold text-blue-300 uppercase tracking-wider">
                      Métrica de Conversión Lead-to-Order
                    </span>
                    <span className="text-gray-400 text-xs">•</span>
                    <span className="text-xs text-blue-100 font-medium">Cotizaciones Generadas vs Vendidas</span>
                  </div>
                  <h3 className="text-base font-black text-white flex items-center space-x-2 mt-0.5">
                    <span>Efectividad Comercial:</span>
                    <span className="text-emerald-300 font-bold bg-emerald-950/70 border border-emerald-500/40 px-2 py-0.5 rounded text-sm">
                      {analyticsData.summary.conversionRateQty}% ({analyticsData.summary.totalWonQuotations} vendidas de {analyticsData.summary.totalQuotations} generadas)
                    </span>
                    <span className="text-xs font-mono text-gray-300 ml-2">
                      | ${analyticsData.summary.totalSoldAmount.toLocaleString()} de ${analyticsData.summary.totalQuotedAmount.toLocaleString()} USD
                    </span>
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCurrentMainView('analytics')}
                className="bg-white hover:bg-blue-50 text-[#0A2540] px-4 py-2 rounded-lg font-bold text-xs shadow-md transition flex items-center space-x-2"
              >
                <span>Ver Indicadores, Motivos de Pérdida & Filtros</span>
                <i className="fas fa-arrow-right text-[#006EAD]"></i>
              </button>
            </div>

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
            <div className="flex space-x-4 min-w-[1200px] h-[calc(100%-190px)]">
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
          </>
        )}

        {/* ========================================================= */}
        {/* VISTA: BANDEJA OMNICANAL (WhatsApp, Instagram, Email, Web) */}
        {/* Solicitudes de Cotización, Consultas y Reclamos           */}
        {/* ========================================================= */}
        {currentMainView === 'omnichannel' && (() => {
          // Filtrado de solicitudes omnicanal
          const filteredOmnichannelDeals = deals.filter(deal => {
            const reqStatus = deal.resolutionStatus || 'pendiente';
            const reqType = deal.requestType || 'cotizacion';
            const reqChannel = deal.channel || 'direct';

            // 1. Filtro de Estado (¡SOLO PENDIENTES POR DEFECTO!)
            if (omnichannelFilterStatus !== 'todos' && reqStatus !== omnichannelFilterStatus) {
              return false;
            }

            // 2. Filtro por Tipo (Cotización, Consulta, Reclamo)
            if (omnichannelFilterType !== 'todos' && reqType !== omnichannelFilterType) {
              return false;
            }

            // 3. Filtro por Canal (WhatsApp, Instagram, Email, Web)
            if (omnichannelFilterChannel !== 'todos' && reqChannel !== omnichannelFilterChannel) {
              return false;
            }

            // 4. Búsqueda por texto
            if (omnichannelSearch.trim()) {
              const q = omnichannelSearch.toLowerCase();
              const matchCompany = (deal.company || '').toLowerCase().includes(q);
              const matchContact = (deal.contact || '').toLowerCase().includes(q);
              const matchPhone = (deal.phone || '').toLowerCase().includes(q);
              const matchEmail = (deal.email || '').toLowerCase().includes(q);
              const matchTitle = (deal.title || '').toLowerCase().includes(q);
              const matchNotes = (deal.resolutionNotes || '').toLowerCase().includes(q);
              const matchMsg = (deal.messages || []).some(m => (m.text || '').toLowerCase().includes(q));
              if (!matchCompany && !matchContact && !matchPhone && !matchEmail && !matchTitle && !matchNotes && !matchMsg) {
                return false;
              }
            }

            return true;
          });

          // Conteo de métricas
          const countPendientes = deals.filter(d => (d.resolutionStatus || 'pendiente') === 'pendiente').length;
          const countResueltos = deals.filter(d => d.resolutionStatus === 'resuelto').length;
          const countCotizaciones = deals.filter(d => (d.requestType || 'cotizacion') === 'cotizacion').length;
          const countConsultas = deals.filter(d => d.requestType === 'consulta').length;
          const countReclamos = deals.filter(d => d.requestType === 'reclamo').length;

          return (
            <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-fadeIn">
              
              {/* Header y Acciones de la Bandeja */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 space-y-4">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 border-b border-gray-100 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-500 via-[#006EAD] to-indigo-600 flex items-center justify-center text-white text-xl shadow-xs">
                      <i className="fas fa-headset"></i>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase px-2 py-0.5 rounded-md flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          Omnichannel Live Hub
                        </span>
                        <span className="text-xs text-gray-400">|</span>
                        <span className="text-xs text-gray-500 font-medium">WhatsApp Business • Instagram Direct • Correo • Web</span>
                      </div>
                      <h2 className="text-xl font-black text-[#0A2540] mt-0.5">
                        Bandeja de Solicitudes Comerciales & Atención al Cliente
                      </h2>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsSimulatorOpen(true)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-black hover:from-purple-700 hover:to-indigo-700 transition shadow-md flex items-center space-x-2"
                    >
                      <i className="fas fa-flask"></i>
                      <span>Simular Mensaje Entrante</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCurrentMainView('kanban')}
                      className="px-3.5 py-2 rounded-xl border border-gray-300 text-gray-700 text-xs font-bold hover:bg-gray-100 transition flex items-center space-x-1.5"
                    >
                      <i className="fas fa-columns"></i>
                      <span>Ver Kanban</span>
                    </button>
                  </div>
                </div>

                {/* Tarjetas KPI de Estado de Solicitudes */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div 
                    onClick={() => setOmnichannelFilterStatus('pendiente')}
                    className={`p-3.5 rounded-xl border cursor-pointer transition ${
                      omnichannelFilterStatus === 'pendiente' 
                        ? 'bg-amber-50/80 border-amber-400 ring-2 ring-amber-300 shadow-xs' 
                        : 'bg-slate-50 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-[10px] font-black text-amber-800 uppercase tracking-wider block mb-1">
                      ⏳ Solo Pendientes
                    </span>
                    <div className="flex items-baseline space-x-1.5">
                      <span className="text-2xl font-black text-amber-700">{countPendientes}</span>
                      <span className="text-xs text-amber-900 font-semibold">activas</span>
                    </div>
                    <span className="text-[10px] text-gray-500 mt-1 block">Requieren gestión</span>
                  </div>

                  <div 
                    onClick={() => setOmnichannelFilterStatus('resuelto')}
                    className={`p-3.5 rounded-xl border cursor-pointer transition ${
                      omnichannelFilterStatus === 'resuelto' 
                        ? 'bg-emerald-50/80 border-emerald-400 ring-2 ring-emerald-300 shadow-xs' 
                        : 'bg-slate-50 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-[10px] font-black text-emerald-800 uppercase tracking-wider block mb-1">
                      ✓ Solo Finalizadas
                    </span>
                    <div className="flex items-baseline space-x-1.5">
                      <span className="text-2xl font-black text-emerald-700">{countResueltos}</span>
                      <span className="text-xs text-emerald-900 font-semibold">resueltas</span>
                    </div>
                    <span className="text-[10px] text-gray-500 mt-1 block">Historial cerrado</span>
                  </div>

                  <div 
                    onClick={() => setOmnichannelFilterType('cotizacion')}
                    className={`p-3.5 rounded-xl border cursor-pointer transition ${
                      omnichannelFilterType === 'cotizacion' 
                        ? 'bg-blue-50/80 border-blue-400 ring-2 ring-blue-300 shadow-xs' 
                        : 'bg-slate-50 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-[10px] font-black text-blue-800 uppercase tracking-wider block mb-1">
                      💰 Cotizaciones
                    </span>
                    <div className="flex items-baseline space-x-1.5">
                      <span className="text-2xl font-black text-[#006EAD]">{countCotizaciones}</span>
                      <span className="text-xs text-blue-900 font-semibold">leads</span>
                    </div>
                    <span className="text-[10px] text-gray-500 mt-1 block">Para venta o cierre</span>
                  </div>

                  <div 
                    onClick={() => setOmnichannelFilterType('consulta')}
                    className={`p-3.5 rounded-xl border cursor-pointer transition ${
                      omnichannelFilterType === 'consulta' 
                        ? 'bg-sky-50/80 border-sky-400 ring-2 ring-sky-300 shadow-xs' 
                        : 'bg-slate-50 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-[10px] font-black text-sky-800 uppercase tracking-wider block mb-1">
                      ❓ Consultas
                    </span>
                    <div className="flex items-baseline space-x-1.5">
                      <span className="text-2xl font-black text-sky-700">{countConsultas}</span>
                      <span className="text-xs text-sky-900 font-semibold">dudas</span>
                    </div>
                    <span className="text-[10px] text-gray-500 mt-1 block">Soporte preventa</span>
                  </div>

                  <div 
                    onClick={() => setOmnichannelFilterType('reclamo')}
                    className={`p-3.5 rounded-xl border cursor-pointer transition ${
                      omnichannelFilterType === 'reclamo' 
                        ? 'bg-red-50/80 border-red-400 ring-2 ring-red-300 shadow-xs' 
                        : 'bg-slate-50 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-[10px] font-black text-red-800 uppercase tracking-wider block mb-1">
                      ⚠️ Reclamos
                    </span>
                    <div className="flex items-baseline space-x-1.5">
                      <span className="text-2xl font-black text-red-700">{countReclamos}</span>
                      <span className="text-xs text-red-900 font-semibold">incidencias</span>
                    </div>
                    <span className="text-[10px] text-red-600 font-bold mt-1 block">Con SLA de atención</span>
                  </div>
                </div>

                {/* Barra de Filtros Principales (EL FILTRO DE SOLAMENTE LAS PENDIENTES) */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    
                    {/* Selector de Estado Principal */}
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-black text-gray-700 uppercase tracking-wider flex items-center">
                        <i className="fas fa-filter text-[#006EAD] mr-1.5"></i>
                        Ver Solicitudes:
                      </span>
                      <div className="inline-flex rounded-lg border border-gray-300 bg-white p-0.5 shadow-2xs">
                        <button
                          type="button"
                          onClick={() => setOmnichannelFilterStatus('pendiente')}
                          className={`px-3 py-1.5 text-xs font-black rounded-md transition flex items-center space-x-1.5 ${
                            omnichannelFilterStatus === 'pendiente'
                              ? 'bg-amber-500 text-white shadow-xs'
                              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                          }`}
                        >
                          <span>⏳ Solo Pendientes</span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                            omnichannelFilterStatus === 'pendiente' ? 'bg-amber-700 text-white' : 'bg-gray-200 text-gray-700'
                          }`}>
                            {countPendientes}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setOmnichannelFilterStatus('resuelto')}
                          className={`px-3 py-1.5 text-xs font-bold rounded-md transition flex items-center space-x-1.5 ${
                            omnichannelFilterStatus === 'resuelto'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                          }`}
                        >
                          <span>✓ Solo Finalizadas</span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                            omnichannelFilterStatus === 'resuelto' ? 'bg-emerald-800 text-white' : 'bg-gray-200 text-gray-700'
                          }`}>
                            {countResueltos}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setOmnichannelFilterStatus('todos')}
                          className={`px-3 py-1.5 text-xs font-bold rounded-md transition ${
                            omnichannelFilterStatus === 'todos'
                              ? 'bg-gray-800 text-white shadow-xs'
                              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                          }`}
                        >
                          Todas ({deals.length})
                        </button>
                      </div>
                    </div>

                    {/* Buscador de Solicitudes */}
                    <div className="relative min-w-[240px] flex-1 max-w-md">
                      <i className="fas fa-search absolute left-3 top-2.5 text-gray-400 text-xs"></i>
                      <input
                        type="text"
                        value={omnichannelSearch}
                        onChange={(e) => setOmnichannelSearch(e.target.value)}
                        placeholder="Buscar por cliente, @usuario, teléfono o mensaje..."
                        className="w-full pl-9 pr-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006EAD] focus:border-[#006EAD] bg-white"
                      />
                      {omnichannelSearch && (
                        <button
                          type="button"
                          onClick={() => setOmnichannelSearch('')}
                          className="absolute right-2.5 top-2 text-gray-400 hover:text-gray-600 text-xs"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                  </div>

                  {/* Filtros Secundarios por Tipo y Canal */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200 text-xs">
                    
                    {/* Filtro por Tipo */}
                    <div className="flex items-center space-x-1.5">
                      <span className="text-gray-500 font-bold">Tipo:</span>
                      {[
                        { id: 'todos', label: 'Todos' },
                        { id: 'cotizacion', label: '💰 Cotización' },
                        { id: 'consulta', label: '❓ Consulta' },
                        { id: 'reclamo', label: '⚠️ Reclamo' }
                      ].map(t => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setOmnichannelFilterType(t.id)}
                          className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition ${
                            omnichannelFilterType === t.id
                              ? 'bg-[#006EAD] text-white shadow-xs'
                              : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>

                    {/* Filtro por Canal */}
                    <div className="flex items-center space-x-1.5">
                      <span className="text-gray-500 font-bold">Canal:</span>
                      {[
                        { id: 'todos', label: 'Todos' },
                        { id: 'whatsapp', label: '💬 WhatsApp' },
                        { id: 'instagram', label: '📸 Instagram' },
                        { id: 'email', label: '📧 Correo' },
                        { id: 'web', label: '🌐 Web' }
                      ].map(c => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setOmnichannelFilterChannel(c.id)}
                          className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition ${
                            omnichannelFilterChannel === c.id
                              ? 'bg-gray-800 text-white shadow-xs'
                              : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {c.label}
                        </button>
                      ))}
                    </div>

                  </div>
                </div>
              </div>

              {/* Listado de Solicitudes Omnicanal */}
              {filteredOmnichannelDeals.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center text-2xl border border-emerald-200">
                    <i className="fas fa-check-circle"></i>
                  </div>
                  <h3 className="text-lg font-black text-gray-900">
                    {omnichannelFilterStatus === 'pendiente' 
                      ? '¡Bandeja al día! No tienes solicitudes pendientes por resolver' 
                      : 'No se encontraron solicitudes con los filtros aplicados'}
                  </h3>
                  <p className="text-xs text-gray-500 max-w-md mx-auto">
                    {omnichannelFilterStatus === 'pendiente'
                      ? 'Todas las solicitudes comerciales, consultas y reclamos han sido finalizadas con éxito por los asesores. Cualquier nuevo mensaje recibido por WhatsApp, Instagram o Correo aparecerá aquí automáticamente.'
                      : 'Prueba cambiando los criterios de filtro de tipo, canal o búsqueda.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsSimulatorOpen(true)}
                    className="mt-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold rounded-lg hover:shadow-md transition"
                  >
                    <i className="fas fa-flask mr-1.5"></i>Simular un Mensaje Entrante para Probar
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredOmnichannelDeals.map((deal) => {
                    const isPending = (deal.resolutionStatus || 'pendiente') === 'pendiente';
                    const reqType = deal.requestType || 'cotizacion';
                    const channel = deal.channel || 'whatsapp';
                    const lastMsg = deal.messages && deal.messages.length > 0 
                      ? deal.messages[deal.messages.length - 1] 
                      : null;

                    return (
                      <div
                        key={deal.id}
                        className={`bg-white rounded-xl border p-4 shadow-sm transition hover:shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                          isPending
                            ? reqType === 'reclamo' 
                              ? 'border-red-300 bg-red-50/10 border-l-4 border-l-red-500' 
                              : reqType === 'consulta'
                              ? 'border-sky-200 border-l-4 border-l-sky-500'
                              : 'border-blue-200 border-l-4 border-l-[#006EAD]'
                            : 'border-gray-200 bg-slate-50/50 opacity-90'
                        }`}
                      >
                        {/* Columna 1: Canal, Tipo y Datos Principales */}
                        <div className="space-y-1.5 flex-1 min-w-[300px]">
                          <div className="flex flex-wrap items-center gap-1.5">
                            {/* Badge Canal */}
                            {channel === 'whatsapp' && (
                              <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                                <i className="fab fa-whatsapp text-emerald-600"></i> WhatsApp
                              </span>
                            )}
                            {channel === 'instagram' && (
                              <span className="bg-gradient-to-r from-pink-100 to-purple-100 text-pink-800 border border-pink-300 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                                <i className="fab fa-instagram text-pink-600"></i> Instagram DM
                              </span>
                            )}
                            {channel === 'email' && (
                              <span className="bg-blue-100 text-blue-800 border border-blue-300 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                                <i className="fas fa-envelope text-blue-600"></i> Correo
                              </span>
                            )}
                            {channel === 'web' && (
                              <span className="bg-purple-100 text-purple-800 border border-purple-300 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                                <i className="fas fa-globe text-purple-600"></i> Formulario Web
                              </span>
                            )}

                            {/* Badge Tipo */}
                            {reqType === 'cotizacion' && (
                              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-md">
                                💰 Cotización
                              </span>
                            )}
                            {reqType === 'consulta' && (
                              <span className="bg-sky-50 text-sky-800 border border-sky-200 text-[10px] font-bold px-2 py-0.5 rounded-md">
                                ❓ Consulta Comercial
                              </span>
                            )}
                            {reqType === 'reclamo' && (
                              <span className="bg-red-100 text-red-900 border border-red-300 text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1">
                                <i className="fas fa-exclamation-triangle text-red-600"></i> Reclamo / Incidencia
                              </span>
                            )}

                            {/* Badge Estado de Resolución */}
                            {isPending ? (
                              <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
                                PENDIENTE
                              </span>
                            ) : (
                              <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                <i className="fas fa-check text-emerald-600"></i> FINALIZADA
                              </span>
                            )}

                            {/* SLA si es reclamo */}
                            {reqType === 'reclamo' && isPending && (
                              <span className="bg-red-50 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded border border-red-200">
                                SLA: Prioridad Alta
                              </span>
                            )}
                          </div>

                          {/* Título y Cliente */}
                          <div>
                            <h4 className="text-sm font-black text-gray-900 hover:text-[#006EAD] cursor-pointer" onClick={() => handleOpenChat(deal)}>
                              {deal.title}
                            </h4>
                            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600 mt-0.5">
                              <span className="font-bold text-gray-900">{deal.company}</span>
                              <span className="text-gray-300">•</span>
                              <span>👤 {deal.contact}</span>
                              <span className="text-gray-300">•</span>
                              <span className="font-mono text-gray-500">{deal.phone || deal.email}</span>
                              <span className="text-gray-300">•</span>
                              <span className="text-[#006EAD] font-semibold">📍 {deal.branch}</span>
                            </div>
                          </div>

                          {/* Último mensaje intercambiado */}
                          {lastMsg && (
                            <div className="bg-gray-50 p-2 rounded-lg border border-gray-200 text-xs text-gray-700 flex items-start space-x-2 mt-1">
                              <span className="text-[10px] font-black uppercase text-gray-400 mt-0.5">
                                {lastMsg.sender === 'client' ? 'Cliente:' : 'Asesor:'}
                              </span>
                              <p className="line-clamp-2 italic text-gray-800">
                                "{lastMsg.text}"
                              </p>
                              <span className="ml-auto text-[10px] text-gray-400 whitespace-nowrap">{lastMsg.timestamp}</span>
                            </div>
                          )}

                          {/* Notas de resolución si está finalizado */}
                          {!isPending && deal.resolutionNotes && (
                            <div className="bg-emerald-50/70 p-2 rounded-lg border border-emerald-200 text-xs text-emerald-900 space-y-0.5">
                              <div className="flex justify-between items-center text-[10px] font-bold text-emerald-800">
                                <span>✓ Resolución registrada por {deal.resolvedBy || 'Asesor'}:</span>
                                <span>{deal.resolvedAt}</span>
                              </div>
                              <p className="font-medium">"{deal.resolutionNotes}"</p>
                            </div>
                          )}
                        </div>

                        {/* Columna 2: Asesor y Acciones Rápidas */}
                        <div className="flex flex-col sm:flex-row md:flex-col items-end justify-between gap-2 shrink-0 self-stretch md:self-auto border-t md:border-t-0 pt-2 md:pt-0">
                          <div className="text-right text-xs">
                            <span className="text-[10px] font-bold text-gray-400 uppercase block">Atendido por:</span>
                            <span className="font-bold text-gray-800">{deal.assignedTo}</span>
                            {reqType === 'cotizacion' && deal.value && (
                              <span className="font-mono font-black text-sm text-[#006EAD] block mt-0.5">{deal.value} USD</span>
                            )}
                          </div>

                          <div className="flex items-center space-x-2 mt-auto">
                            {/* Botón Abrir Chat */}
                            <button
                              type="button"
                              onClick={() => handleOpenChat(deal)}
                              className="px-3 py-1.5 rounded-lg bg-[#006EAD] text-white text-xs font-bold hover:bg-blue-800 transition flex items-center space-x-1.5 shadow-xs"
                            >
                              <i className="fas fa-comment-dots"></i>
                              <span>Ver Chat ({deal.messages ? deal.messages.length : 0})</span>
                            </button>

                            {/* Botón Finalizar / Reabrir */}
                            {isPending ? (
                              <button
                                type="button"
                                onClick={() => handleOpenResolveModal(deal)}
                                className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition flex items-center space-x-1 shadow-xs"
                                title="Marcar como finalizada/resuelta"
                              >
                                <i className="fas fa-check"></i>
                                <span>Finalizar</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleReopenRequest(deal)}
                                className="px-2.5 py-1.5 rounded-lg border border-gray-300 text-gray-600 text-xs font-bold hover:bg-gray-100 transition"
                                title="Reactivar solicitud a pendiente"
                              >
                                <i className="fas fa-undo"></i>
                                <span>Reabrir</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          );
        })()}

        {currentMainView === 'analytics' && (
          /* ========================================================= */
          /* VISTA ANALÍTICA DE COTIZACIONES VS VENDIDAS & PÉRDIDAS    */
          /* ========================================================= */
          <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-fadeIn">
            
            {/* Header del Panel Analítico y Filtros */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 space-y-4">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 border-b border-gray-100 pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="bg-blue-100 text-[#006EAD] text-[11px] font-black uppercase px-2 py-0.5 rounded-md">
                      Módulo 1 CRM • Business Intelligence
                    </span>
                    <span className="text-xs text-gray-400">|</span>
                    <span className="text-xs text-gray-500 font-medium">Control de Tasa de Cierre y Fugas Comerciales</span>
                  </div>
                  <h2 className="text-xl font-black text-[#0A2540] mt-1 flex items-center space-x-2">
                    <i className="fas fa-chart-line text-[#006EAD]"></i>
                    <span>Cotizaciones Generadas vs Cotizaciones Vendidas & Pérdidas</span>
                  </h2>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleResetAnalyticsFilters}
                    className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-100 transition flex items-center space-x-1.5"
                  >
                    <i className="fas fa-undo text-gray-400"></i>
                    <span>Restablecer Filtros</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentMainView('kanban')}
                    className="px-3.5 py-1.5 rounded-lg bg-[#0A2540] text-white text-xs font-bold hover:bg-[#006EAD] transition flex items-center space-x-1.5"
                  >
                    <i className="fas fa-columns"></i>
                    <span>Ver Tablero Kanban</span>
                  </button>
                </div>
              </div>

              {/* Filtros Dinámicos */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <i className="fas fa-calendar-alt text-[#006EAD] text-sm"></i>
                    <span className="text-xs font-black text-gray-700 uppercase tracking-wider">
                      Filtro por Rango de Fechas:
                    </span>
                  </div>

                  {/* Atajos Rápidos */}
                  <div className="flex flex-wrap gap-1">
                    {[
                      { id: 'all', label: 'Histórico Completo' },
                      { id: 'year', label: 'Año 2026' },
                      { id: 'thisMonth', label: 'Este Mes' },
                      { id: 'last30', label: 'Últimos 30 días' },
                      { id: 'last7', label: 'Últimos 7 días' },
                      { id: 'today', label: 'Hoy' }
                    ].map(p => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleApplyDatePreset(p.id)}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition ${
                          analyticsDatePreset === p.id
                            ? 'bg-[#006EAD] text-white shadow-xs'
                            : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 pt-2 border-t border-slate-200/70">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Fecha Desde</label>
                    <input
                      type="date"
                      value={analyticsDateFrom}
                      onChange={(e) => { setAnalyticsDateFrom(e.target.value); setAnalyticsDatePreset('custom'); }}
                      className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs font-semibold bg-white focus:outline-none focus:border-[#006EAD]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Fecha Hasta</label>
                    <input
                      type="date"
                      value={analyticsDateTo}
                      onChange={(e) => { setAnalyticsDateTo(e.target.value); setAnalyticsDatePreset('custom'); }}
                      className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs font-semibold bg-white focus:outline-none focus:border-[#006EAD]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Sucursal</label>
                    <select
                      value={analyticsBranch}
                      onChange={(e) => setAnalyticsBranch(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs font-semibold bg-white focus:outline-none focus:border-[#006EAD]"
                    >
                      <option value="TODAS">🏢 Total Empresa (Todas)</option>
                      {BRANCHES_LIST.map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Vendedor / Asesor</label>
                    <select
                      value={analyticsSeller}
                      onChange={(e) => setAnalyticsSeller(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs font-semibold bg-white focus:outline-none focus:border-[#006EAD]"
                    >
                      <option value="TODOS">👤 Todos los Asesores</option>
                      {SELLERS_LIST.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Proveedor / Fabricante</label>
                    <select
                      value={analyticsProvider}
                      onChange={(e) => setAnalyticsProvider(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs font-semibold bg-white focus:outline-none focus:border-[#006EAD]"
                    >
                      <option value="TODOS">🏭 Todos los Proveedores</option>
                      {availableProviders.map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Categoría Producto</label>
                    <select
                      value={analyticsCategory}
                      onChange={(e) => setAnalyticsCategory(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs font-semibold bg-white focus:outline-none focus:border-[#006EAD]"
                    >
                      <option value="TODAS">🏷️ Todas las Categorías</option>
                      {availableCategories.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between text-xs text-gray-500 pt-1">
                  <span>
                    Mostrando resultados para: <strong>{analyticsBranch === 'TODAS' ? 'Total Empresa' : analyticsBranch}</strong>
                    {analyticsSeller !== 'TODOS' && ` • Vendedor: ${analyticsSeller}`}
                    {analyticsProvider !== 'TODOS' && ` • Proveedor: ${analyticsProvider}`}
                    {analyticsCategory !== 'TODAS' && ` • Categoría: ${analyticsCategory}`}
                    {analyticsSku !== 'TODOS' && ` • SKU: ${analyticsSku}`}
                  </span>
                  <span className="font-bold text-[#006EAD]">
                    {analyticsData.filteredDealsCount} cotizaciones evaluadas en este filtro
                  </span>
                </div>
              </div>
            </div>

            {/* ========================================================= */}
            {/* INDICADORES CLAVE (COTIZACIONES GENERADAS VS VENDIDAS)    */}
            {/* ========================================================= */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* 1. Cotizaciones Generadas */}
              <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm relative overflow-hidden border-t-4 border-t-blue-600">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-gray-500 font-bold uppercase text-[11px] tracking-wider">
                    Cotizaciones Generadas
                  </span>
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-base">
                    <i className="fas fa-file-invoice-dollar"></i>
                  </div>
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-black text-gray-900">
                    {analyticsData.summary.totalQuotations}
                  </span>
                  <span className="text-xs font-bold text-gray-400">cotizaciones</span>
                </div>
                <div className="mt-2 text-xs font-mono font-bold text-blue-800 bg-blue-50 px-2.5 py-1 rounded-md inline-block">
                  ${analyticsData.summary.totalQuotedAmount.toLocaleString()} USD
                </div>
                <p className="text-[11px] text-gray-400 mt-2">
                  100% volumen bruto cotizado en el rango seleccionado.
                </p>
              </div>

              {/* 2. Cotizaciones Vendidas (Cierre) */}
              <div className="bg-white rounded-2xl p-5 border border-emerald-200 shadow-sm relative overflow-hidden border-t-4 border-t-emerald-500 bg-emerald-50/20">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-emerald-800 font-bold uppercase text-[11px] tracking-wider">
                    Cotizaciones Vendidas (Cierre)
                  </span>
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-base">
                    <i className="fas fa-check-double"></i>
                  </div>
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-black text-emerald-700">
                    {analyticsData.summary.totalWonQuotations}
                  </span>
                  <span className="text-xs font-bold text-emerald-600">vendidas</span>
                  <span className="ml-auto text-sm font-black bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-300">
                    {analyticsData.summary.conversionRateQty}%
                  </span>
                </div>
                <div className="mt-2 text-xs font-mono font-bold text-emerald-900 bg-emerald-100/70 px-2.5 py-1 rounded-md inline-block">
                  ${analyticsData.summary.totalSoldAmount.toLocaleString()} USD ({analyticsData.summary.conversionRateAmount}% monto)
                </div>

                {/* Barra de progreso de conversión */}
                <div className="mt-2.5 w-full bg-emerald-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Number(analyticsData.summary.conversionRateQty))}%` }}
                  ></div>
                </div>
                <p className="text-[11px] text-emerald-700 mt-1 font-semibold">
                  Tasa de efectividad de cotizaciones a compras reales.
                </p>
              </div>

              {/* 3. Cotizaciones en Negociación / Abiertas */}
              <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm relative overflow-hidden border-t-4 border-t-amber-500">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-amber-800 font-bold uppercase text-[11px] tracking-wider">
                    En Negociación / Abiertas
                  </span>
                  <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-base">
                    <i className="fas fa-hourglass-half"></i>
                  </div>
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-black text-amber-700">
                    {analyticsData.summary.totalOpenQuotations}
                  </span>
                  <span className="text-xs font-bold text-amber-600">en proceso</span>
                  <span className="ml-auto text-sm font-black bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                    {analyticsData.summary.pendingRate}%
                  </span>
                </div>
                <div className="mt-2 text-xs font-mono font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md inline-block">
                  ${analyticsData.summary.totalPendingAmount.toLocaleString()} USD
                </div>
                <p className="text-[11px] text-gray-400 mt-2">
                  Cotizaciones en curso pendientes de decisión final.
                </p>
              </div>

              {/* 4. Ventas Perdidas / Fuga */}
              <div className="bg-white rounded-2xl p-5 border border-red-200 shadow-sm relative overflow-hidden border-t-4 border-t-red-500 bg-red-50/20">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-red-800 font-bold uppercase text-[11px] tracking-wider">
                    Ventas Perdidas / Fuga
                  </span>
                  <div className="w-9 h-9 rounded-lg bg-red-100 text-red-700 flex items-center justify-center text-base">
                    <i className="fas fa-exclamation-triangle"></i>
                  </div>
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-black text-red-700">
                    {analyticsData.summary.totalLostQuotations}
                  </span>
                  <span className="text-xs font-bold text-red-600">cotiz. ({analyticsData.summary.totalLostItemsCount} SKUs)</span>
                  <span className="ml-auto text-sm font-black bg-red-100 text-red-800 px-2 py-0.5 rounded-full border border-red-200">
                    {analyticsData.summary.lossRateAmount}%
                  </span>
                </div>
                <div className="mt-2 text-xs font-mono font-bold text-red-800 bg-red-100/70 px-2.5 py-1 rounded-md inline-block">
                  -${analyticsData.summary.totalLostAmount.toLocaleString()} USD fugados
                </div>
                <p className="text-[11px] text-red-700 font-semibold mt-2">
                  Rechazos clasificados por los 5 motivos de no compra.
                </p>
              </div>
            </div>

            {/* ========================================================= */}
            {/* BARRA DESTACADA DE DIMENSIONES & ACCESO DIRECTO           */}
            {/* ========================================================= */}
            <div className="bg-gradient-to-r from-[#0A2540] via-blue-900 to-indigo-950 text-white p-3.5 rounded-2xl shadow-md flex flex-wrap items-center justify-between gap-3 border border-blue-800">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-blue-500/30 border border-blue-400/30 flex items-center justify-center text-blue-300">
                  <i className="fas fa-layer-group text-sm"></i>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-blue-300">Dimensiones de Auditoría</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-black text-white">
                    Clasificación de Cotizaciones vs Vendidas (SKU, Sucursal, Vendedor, Proveedor, Empresa)
                  </h4>
                </div>
              </div>

              {/* Botones de Acceso Rápido */}
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setAnalyticsActiveTab('sku')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center space-x-1.5 transition shadow-xs ${
                    analyticsActiveTab === 'sku'
                      ? 'bg-blue-500 text-white ring-2 ring-white'
                      : 'bg-white/10 hover:bg-white/20 text-blue-200 border border-white/10'
                  }`}
                >
                  <span>📦 Por Códigos (SKU)</span>
                  <span className="bg-blue-400/30 text-white text-[10px] px-1.5 py-0.2 rounded-full">
                    {analyticsData.skuList.length} SKUs
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setAnalyticsActiveTab('total_empresa')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition ${
                    analyticsActiveTab === 'total_empresa'
                      ? 'bg-blue-500 text-white ring-2 ring-white shadow-xs'
                      : 'bg-white/10 hover:bg-white/20 text-gray-200 border border-white/10'
                  }`}
                >
                  <span>🏢 Total Empresa</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAnalyticsActiveTab('motivos')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition ${
                    analyticsActiveTab === 'motivos'
                      ? 'bg-red-600 text-white ring-2 ring-white shadow-xs'
                      : 'bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-400/30'
                  }`}
                >
                  <span>⚠️ 5 Motivos de Pérdida</span>
                </button>
              </div>
            </div>

            {/* ========================================================= */}
            {/* CLASIFICACIÓN MULTIDIMENSIONAL                            */}
            {/* SKU | Total Empresa | Sucursal | Vendedor | Proveedor     */}
            {/* ========================================================= */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              
              {/* Pestañas de Clasificación */}
              <div className="flex flex-wrap border-b border-gray-200 bg-slate-50 px-4 pt-3 gap-1.5 text-xs font-bold">
                {[
                  { id: 'sku', label: '📦 Por Códigos (SKU)', count: analyticsData.skuList.length, highlight: true },
                  { id: 'total_empresa', label: '🏢 Total Empresa', count: null },
                  { id: 'sucursal', label: '📍 Por Sucursal', count: analyticsData.branchList.length },
                  { id: 'vendedor', label: '👤 Por Vendedor', count: analyticsData.sellerList.length },
                  { id: 'proveedor', label: '🏭 Por Proveedor', count: analyticsData.providerList.length },
                  { id: 'categoria', label: '🏷️ Por Categoría', count: analyticsData.categoryList.length },
                  { id: 'motivos', label: '⚠️ Motivos de Pérdida (1 al 5)', count: analyticsData.reasonsList.filter(r => r.amount > 0).length }
                ].map(tab => {
                  const isActive = analyticsActiveTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setAnalyticsActiveTab(tab.id)}
                      className={`py-2.5 px-4 rounded-t-xl transition-all flex items-center space-x-2 border-t border-l border-r ${
                        isActive
                          ? 'bg-white border-gray-300 text-[#006EAD] border-b-2 border-b-white -mb-[1px] shadow-xs font-black'
                          : tab.highlight
                          ? 'border-blue-200 bg-blue-50/70 text-blue-900 hover:bg-blue-100'
                          : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-slate-100'
                      }`}
                    >
                      <span>{tab.label}</span>
                      {tab.count !== null && (
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                          isActive
                            ? 'bg-blue-100 text-[#006EAD]'
                            : tab.highlight
                            ? 'bg-blue-200 text-blue-900'
                            : 'bg-gray-200 text-gray-700'
                        }`}>
                          {tab.count}
                        </span>
                      )}
                      {tab.highlight && !isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping"></span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Contenido de la Clasificación Seleccionada */}
              <div className="p-6">
                
                {/* 1. TOTAL EMPRESA */}
                {analyticsActiveTab === 'total_empresa' && (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-5 rounded-xl shadow-xs">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300">
                            Consolidado Estratégico General
                          </span>
                          <h4 className="text-lg font-black text-white mt-1">
                            Salud Comercial & Conversión Total de la Compañía
                          </h4>
                          <p className="text-xs text-blue-100 mt-1 max-w-2xl">
                            Evaluación holística de la efectividad comercial entre cotizaciones emitidas, contratos o compras ganadas, y causas detectadas de venta perdida en todas las sucursales.
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-black text-emerald-400">
                            {analyticsData.summary.conversionRateQty}%
                          </span>
                          <span className="text-[10px] uppercase font-bold text-gray-300 block">Efectividad Global</span>
                        </div>
                      </div>
                    </div>

                    {/* Comparativa Rápida en Tarjetas */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 rounded-xl border border-gray-200 bg-slate-50/70">
                        <span className="text-[11px] font-bold text-gray-500 uppercase block mb-1">
                          📍 Sucursal con Mayor Cierre
                        </span>
                        <h5 className="text-base font-black text-gray-900">
                          {analyticsData.branchList[0]?.branch || 'N/A'}
                        </h5>
                        <p className="text-xs text-emerald-700 font-bold mt-1">
                          {analyticsData.branchList[0]?.winRateQty || 0}% efectividad (${analyticsData.branchList[0]?.wonAmount.toLocaleString()} USD)
                        </p>
                      </div>

                      <div className="p-4 rounded-xl border border-gray-200 bg-slate-50/70">
                        <span className="text-[11px] font-bold text-gray-500 uppercase block mb-1">
                          👤 Asesor Comercial Líder
                        </span>
                        <h5 className="text-base font-black text-gray-900">
                          {analyticsData.sellerList[0]?.seller || 'N/A'}
                        </h5>
                        <p className="text-xs text-blue-700 font-bold mt-1">
                          ${analyticsData.sellerList[0]?.wonAmount.toLocaleString()} USD vendidos ({analyticsData.sellerList[0]?.winRateQty || 0}% tasa)
                        </p>
                      </div>

                      <div className="p-4 rounded-xl border border-red-200 bg-red-50/30">
                        <span className="text-[11px] font-bold text-red-700 uppercase block mb-1">
                          ⚠️ Principal Causa de Fuga
                        </span>
                        <h5 className="text-base font-black text-red-900">
                          {analyticsData.reasonsList[0]?.reason || 'Sin pérdidas'}
                        </h5>
                        <p className="text-xs text-red-700 font-bold mt-1">
                          ${analyticsData.reasonsList[0]?.amount.toLocaleString()} USD ({analyticsData.reasonsList[0]?.percentOfLoss}% de las pérdidas)
                        </p>
                      </div>
                    </div>

                    {/* Tabla de Resumen por Sucursales en Total Empresa */}
                    <div className="border border-gray-200 rounded-xl overflow-hidden shadow-2xs">
                      <div className="bg-slate-100 px-4 py-2.5 font-bold text-xs text-gray-700 border-b border-gray-200">
                        Desglose Comparativo por Sucursal (Total Empresa)
                      </div>
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 text-gray-600 uppercase text-[10px] font-bold border-b border-gray-200">
                          <tr>
                            <th className="py-2.5 px-3">Sucursal</th>
                            <th className="py-2.5 px-3 text-center">Cotizaciones</th>
                            <th className="py-2.5 px-3 text-right">Monto Cotizado</th>
                            <th className="py-2.5 px-3 text-center">Vendidas</th>
                            <th className="py-2.5 px-3 text-right">Monto Vendido</th>
                            <th className="py-2.5 px-3 text-center">% Conversión</th>
                            <th className="py-2.5 px-3 text-right">Monto Perdido</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {analyticsData.branchList.map(b => (
                            <tr key={b.branch} className="hover:bg-slate-50 transition">
                              <td className="py-2.5 px-3 font-bold text-gray-900">{b.branch}</td>
                              <td className="py-2.5 px-3 text-center">{b.genCount}</td>
                              <td className="py-2.5 px-3 text-right font-mono">${b.genAmount.toLocaleString()}</td>
                              <td className="py-2.5 px-3 text-center text-emerald-700 font-bold">{b.wonCount}</td>
                              <td className="py-2.5 px-3 text-right font-mono text-emerald-700 font-bold">${b.wonAmount.toLocaleString()}</td>
                              <td className="py-2.5 px-3 text-center font-bold">
                                <span className={`px-2 py-0.5 rounded text-[11px] ${
                                  Number(b.winRateQty) >= 60 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                }`}>
                                  {b.winRateQty}%
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-right font-mono text-red-700 font-bold">
                                {b.lostAmount > 0 ? `-$${b.lostAmount.toLocaleString()}` : '$0'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    {/* Auditoría de Fugas Estratégicas en Consolidado Total Empresa */}
                    <div className="pt-2">
                      {renderLossReasonsAudit()}
                    </div>
                  </div>
                )}


                {/* 2. POR SUCURSAL */}
                {analyticsActiveTab === 'sucursal' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>Rendimiento comercial y fuga segmentado por cada agencia/sucursal de NyTEX.</span>
                      <span className="font-bold text-[#006EAD]">{analyticsData.branchList.length} Sucursales Registradas</span>
                    </div>

                    <div className="border border-gray-200 rounded-xl overflow-hidden shadow-2xs">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 text-gray-700 uppercase text-[10px] font-bold border-b border-gray-200">
                          <tr>
                            <th className="py-3 px-3">Sucursal</th>
                            <th className="py-3 px-3 text-center">Generadas</th>
                            <th className="py-3 px-3 text-right">Monto Cotizado</th>
                            <th className="py-3 px-3 text-center">Vendidas</th>
                            <th className="py-3 px-3 text-right">Monto Vendido</th>
                            <th className="py-3 px-3 text-center">% Efectividad (Cant.)</th>
                            <th className="py-3 px-3 text-center">% Efectividad ($)</th>
                            <th className="py-3 px-3 text-right">Monto Perdido</th>
                            <th className="py-3 px-3">Causa Principal de Pérdida</th>
                            <th className="py-3 px-3 text-center">Acción</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {analyticsData.branchList.map(b => (
                            <tr key={b.branch} className="hover:bg-slate-50 transition">
                              <td className="py-3 px-3 font-black text-gray-900 flex items-center space-x-1.5">
                                <i className="fas fa-store text-blue-600"></i>
                                <span>{b.branch}</span>
                              </td>
                              <td className="py-3 px-3 text-center font-bold text-gray-700">{b.genCount}</td>
                              <td className="py-3 px-3 text-right font-mono">${b.genAmount.toLocaleString()}</td>
                              <td className="py-3 px-3 text-center font-black text-emerald-700">{b.wonCount}</td>
                              <td className="py-3 px-3 text-right font-mono text-emerald-700 font-bold">${b.wonAmount.toLocaleString()}</td>
                              <td className="py-3 px-3 text-center">
                                <span className={`px-2 py-0.5 rounded font-black text-[11px] ${
                                  Number(b.winRateQty) >= 60 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                }`}>
                                  {b.winRateQty}%
                                </span>
                              </td>
                              <td className="py-3 px-3 text-center font-mono text-gray-600 font-semibold">{b.winRateAmount}%</td>
                              <td className="py-3 px-3 text-right font-mono text-red-700 font-bold">
                                {b.lostAmount > 0 ? `-$${b.lostAmount.toLocaleString()}` : '$0'}
                              </td>
                              <td className="py-3 px-3 text-gray-600 text-[11px]">
                                <span className="bg-red-50 text-red-800 px-2 py-0.5 rounded border border-red-100 font-medium">
                                  {b.topLostReason}
                                </span>
                              </td>
                              <td className="py-3 px-3 text-center">
                                <button
                                  type="button"
                                  onClick={() => { setAnalyticsBranch(b.branch); showToast(`📍 Filtrado por ${b.branch}`); }}
                                  className="text-[10px] bg-blue-50 text-[#006EAD] hover:bg-blue-100 font-bold px-2 py-1 rounded"
                                >
                                  Filtrar
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 3. POR VENDEDOR */}
                {analyticsActiveTab === 'vendedor' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>Ranking de desempeño comercial y conversión por asesor de ventas.</span>
                      <span className="font-bold text-[#006EAD]">{analyticsData.sellerList.length} Asesores</span>
                    </div>

                    <div className="border border-gray-200 rounded-xl overflow-hidden shadow-2xs">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 text-gray-700 uppercase text-[10px] font-bold border-b border-gray-200">
                          <tr>
                            <th className="py-3 px-3">Asesor Comercial</th>
                            <th className="py-3 px-3 text-center">Cotizaciones</th>
                            <th className="py-3 px-3 text-right">Monto Cotizado</th>
                            <th className="py-3 px-3 text-center">Vendidas</th>
                            <th className="py-3 px-3 text-right">Monto Vendido</th>
                            <th className="py-3 px-3 text-center">% Tasa de Cierre</th>
                            <th className="py-3 px-3 text-right">Monto Pérdida</th>
                            <th className="py-3 px-3">Principal Rechazo</th>
                            <th className="py-3 px-3 text-center">Acción</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {analyticsData.sellerList.map(s => (
                            <tr key={s.seller} className="hover:bg-slate-50 transition">
                              <td className="py-3 px-3 font-black text-gray-900 flex items-center space-x-2">
                                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold">
                                  {s.seller.charAt(0)}
                                </div>
                                <span>{s.seller}</span>
                              </td>
                              <td className="py-3 px-3 text-center font-bold text-gray-700">{s.genCount}</td>
                              <td className="py-3 px-3 text-right font-mono">${s.genAmount.toLocaleString()}</td>
                              <td className="py-3 px-3 text-center font-black text-emerald-700">{s.wonCount}</td>
                              <td className="py-3 px-3 text-right font-mono text-emerald-700 font-bold">${s.wonAmount.toLocaleString()}</td>
                              <td className="py-3 px-3 text-center">
                                <span className={`px-2 py-0.5 rounded font-black text-[11px] ${
                                  Number(s.winRateQty) >= 60 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                }`}>
                                  {s.winRateQty}%
                                </span>
                              </td>
                              <td className="py-3 px-3 text-right font-mono text-red-700 font-bold">
                                {s.lostAmount > 0 ? `-$${s.lostAmount.toLocaleString()}` : '$0'}
                              </td>
                              <td className="py-3 px-3 text-gray-600 text-[11px]">
                                <span className="bg-red-50 text-red-800 px-2 py-0.5 rounded border border-red-100 font-medium">
                                  {s.topLostReason}
                                </span>
                              </td>
                              <td className="py-3 px-3 text-center">
                                <button
                                  type="button"
                                  onClick={() => { setAnalyticsSeller(s.seller); showToast(`👤 Filtrado por ${s.seller}`); }}
                                  className="text-[10px] bg-blue-50 text-[#006EAD] hover:bg-blue-100 font-bold px-2 py-1 rounded"
                                >
                                  Filtrar
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 4. POR PROVEEDOR */}
                {analyticsActiveTab === 'proveedor' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>Efectividad de cotización y ventas según la marca o proveedor del producto.</span>
                      <span className="font-bold text-[#006EAD]">{analyticsData.providerList.length} Proveedores</span>
                    </div>

                    <div className="border border-gray-200 rounded-xl overflow-hidden shadow-2xs">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 text-gray-700 uppercase text-[10px] font-bold border-b border-gray-200">
                          <tr>
                            <th className="py-3 px-3">Proveedor / Marca</th>
                            <th className="py-3 px-3 text-center">Unidades Cotizadas</th>
                            <th className="py-3 px-3 text-right">Monto Cotizado</th>
                            <th className="py-3 px-3 text-center">Unidades Vendidas</th>
                            <th className="py-3 px-3 text-right">Monto Vendido</th>
                            <th className="py-3 px-3 text-center">% Éxito Marca ($)</th>
                            <th className="py-3 px-3 text-right">Monto Perdido</th>
                            <th className="py-3 px-3 text-center">Acción</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {analyticsData.providerList.map(p => (
                            <tr key={p.provider} className="hover:bg-slate-50 transition">
                              <td className="py-3 px-3 font-bold text-gray-900 flex items-center space-x-1.5">
                                <i className="fas fa-industry text-indigo-600"></i>
                                <span>{p.provider}</span>
                              </td>
                              <td className="py-3 px-3 text-center">{p.itemsQuoted}</td>
                              <td className="py-3 px-3 text-right font-mono">${p.quotedAmount.toLocaleString()}</td>
                              <td className="py-3 px-3 text-center text-emerald-700 font-bold">{p.itemsSold}</td>
                              <td className="py-3 px-3 text-right font-mono text-emerald-700 font-bold">${p.soldAmount.toLocaleString()}</td>
                              <td className="py-3 px-3 text-center font-bold">
                                <span className={`px-2 py-0.5 rounded text-[11px] ${
                                  Number(p.winRateAmount) >= 50 ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-700'
                                }`}>
                                  {p.winRateAmount}%
                                </span>
                              </td>
                              <td className="py-3 px-3 text-right font-mono text-red-700 font-bold">
                                {p.lostAmount > 0 ? `-$${p.lostAmount.toLocaleString()}` : '$0'}
                              </td>
                              <td className="py-3 px-3 text-center">
                                <button
                                  type="button"
                                  onClick={() => { setAnalyticsProvider(p.provider); showToast(`🏭 Filtrado por ${p.provider}`); }}
                                  className="text-[10px] bg-blue-50 text-[#006EAD] hover:bg-blue-100 font-bold px-2 py-1 rounded"
                                >
                                  Filtrar
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 5. POR CATEGORÍA DE PRODUCTOS */}
                {analyticsActiveTab === 'categoria' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>Comportamiento de cotizaciones y ventas por familia de productos y servicios.</span>
                      <span className="font-bold text-[#006EAD]">{analyticsData.categoryList.length} Categorías</span>
                    </div>

                    <div className="border border-gray-200 rounded-xl overflow-hidden shadow-2xs">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 text-gray-700 uppercase text-[10px] font-bold border-b border-gray-200">
                          <tr>
                            <th className="py-3 px-3">Categoría de Producto</th>
                            <th className="py-3 px-3 text-center">Unidades Cotizadas</th>
                            <th className="py-3 px-3 text-right">Monto Cotizado</th>
                            <th className="py-3 px-3 text-center">Unidades Vendidas</th>
                            <th className="py-3 px-3 text-right">Monto Vendido</th>
                            <th className="py-3 px-3 text-center">% Conversión ($)</th>
                            <th className="py-3 px-3 text-right">Monto Fuga</th>
                            <th className="py-3 px-3 text-center">Acción</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {analyticsData.categoryList.map(c => (
                            <tr key={c.category} className="hover:bg-slate-50 transition">
                              <td className="py-3 px-3 font-bold text-gray-900 flex items-center space-x-1.5">
                                <i className="fas fa-tag text-amber-600"></i>
                                <span>{c.category}</span>
                              </td>
                              <td className="py-3 px-3 text-center">{c.itemsQuoted}</td>
                              <td className="py-3 px-3 text-right font-mono">${c.quotedAmount.toLocaleString()}</td>
                              <td className="py-3 px-3 text-center text-emerald-700 font-bold">{c.itemsSold}</td>
                              <td className="py-3 px-3 text-right font-mono text-emerald-700 font-bold">${c.soldAmount.toLocaleString()}</td>
                              <td className="py-3 px-3 text-center font-bold">
                                <span className={`px-2 py-0.5 rounded text-[11px] ${
                                  Number(c.winRateAmount) >= 50 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                }`}>
                                  {c.winRateAmount}%
                                </span>
                              </td>
                              <td className="py-3 px-3 text-right font-mono text-red-700 font-bold">
                                {c.lostAmount > 0 ? `-$${c.lostAmount.toLocaleString()}` : '$0'}
                              </td>
                              <td className="py-3 px-3 text-center">
                                <button
                                  type="button"
                                  onClick={() => { setAnalyticsCategory(c.category); showToast(`🏷️ Filtrado por ${c.category}`); }}
                                  className="text-[10px] bg-blue-50 text-[#006EAD] hover:bg-blue-100 font-bold px-2 py-1 rounded"
                                >
                                  Filtrar
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 6. POR CÓDIGOS (SKU) - INDICADOR DETALLADO: COTIZADOS VS VENDIDOS VS NO VENDIDOS Y MOTIVOS */}
                {analyticsActiveTab === 'sku' && (
                  <div className="space-y-5">
                    
                    {/* Tarjetas de Resumen Rápido por Códigos SKU */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                          📦 Total Códigos Cotizados
                        </span>
                        <div className="flex items-baseline space-x-2">
                          <span className="text-2xl font-black text-gray-900">{analyticsData.summary.totalDistinctSkusQuoted}</span>
                          <span className="text-xs text-gray-500">códigos ({analyticsData.summary.totalUnitsQuoted} unidades)</span>
                        </div>
                        <span className="text-xs font-mono font-bold text-blue-700 mt-1 block">
                          ${analyticsData.summary.totalQuotedAmount.toLocaleString()} USD en demanda
                        </span>
                      </div>

                      <div className="bg-emerald-50/40 p-4 rounded-xl border border-emerald-200">
                        <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block mb-1">
                          ✓ Códigos Vendidos (Cerrados)
                        </span>
                        <div className="flex items-baseline space-x-2">
                          <span className="text-2xl font-black text-emerald-700">{analyticsData.summary.totalSkusWithSales}</span>
                          <span className="text-xs text-emerald-600">códigos ({analyticsData.summary.totalUnitsSold} unidades)</span>
                          <span className="ml-auto text-xs font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">
                            {analyticsData.summary.skuOverallWinRateQty}%
                          </span>
                        </div>
                        <span className="text-xs font-mono font-bold text-emerald-800 mt-1 block">
                          ${analyticsData.summary.totalSoldAmount.toLocaleString()} USD efectivamente vendidos
                        </span>
                      </div>

                      <div className="bg-red-50/40 p-4 rounded-xl border border-red-200">
                        <span className="text-[10px] font-bold text-red-800 uppercase tracking-wider block mb-1">
                          ⚠️ Códigos NO Vendidos (Perdidos)
                        </span>
                        <div className="flex items-baseline space-x-2">
                          <span className="text-2xl font-black text-red-700">{analyticsData.summary.totalSkusWithLosses}</span>
                          <span className="text-xs text-red-600">códigos ({analyticsData.summary.totalUnitsLost} unidades)</span>
                          <span className="ml-auto text-xs font-black bg-red-100 text-red-800 px-2 py-0.5 rounded-full border border-red-300">
                            {analyticsData.summary.skuOverallLostRateQty}%
                          </span>
                        </div>
                        <span className="text-xs font-mono font-bold text-red-800 mt-1 block">
                          -${analyticsData.summary.totalLostAmount.toLocaleString()} USD en pérdidas registradas
                        </span>
                      </div>
                    </div>

                    {/* Barra de Filtros y Controles de Métricas (Cantidad vs % vs Montos) */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-gray-200 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        
                        {/* Selector de Modo de Métrica (Cantidad, %, Montos o Completa) */}
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-black text-gray-700 uppercase tracking-wider flex items-center">
                            <i className="fas fa-eye mr-1.5 text-[#006EAD]"></i>
                            Visualizar Métricas en:
                          </span>
                          <div className="inline-flex rounded-lg border border-gray-300 bg-white p-0.5 shadow-2xs">
                            <button
                              type="button"
                              onClick={() => setSkuMetricMode('all')}
                              className={`px-2.5 py-1 text-xs font-bold rounded-md transition ${
                                skuMetricMode === 'all'
                                  ? 'bg-[#006EAD] text-white shadow-xs'
                                  : 'text-gray-600 hover:text-gray-900'
                              }`}
                            >
                              📊 Completa (Cant, % y $)
                            </button>
                            <button
                              type="button"
                              onClick={() => setSkuMetricMode('qty')}
                              className={`px-2.5 py-1 text-xs font-bold rounded-md transition ${
                                skuMetricMode === 'qty'
                                  ? 'bg-[#006EAD] text-white shadow-xs'
                                  : 'text-gray-600 hover:text-gray-900'
                              }`}
                            >
                              🔢 Cantidad (Unidades)
                            </button>
                            <button
                              type="button"
                              onClick={() => setSkuMetricMode('percent')}
                              className={`px-2.5 py-1 text-xs font-bold rounded-md transition ${
                                skuMetricMode === 'percent'
                                  ? 'bg-[#006EAD] text-white shadow-xs'
                                  : 'text-gray-600 hover:text-gray-900'
                              }`}
                            >
                              ％ Porcentajes (%)
                            </button>
                            <button
                              type="button"
                              onClick={() => setSkuMetricMode('amount')}
                              className={`px-2.5 py-1 text-xs font-bold rounded-md transition ${
                                skuMetricMode === 'amount'
                                  ? 'bg-[#006EAD] text-white shadow-xs'
                                  : 'text-gray-600 hover:text-gray-900'
                              }`}
                            >
                              💲 Montos ($ USD)
                            </button>
                          </div>
                        </div>

                        {/* Buscador de Código SKU */}
                        <div className="w-full sm:w-80">
                          <div className="relative">
                            <i className="fas fa-search absolute left-3 top-2.5 text-gray-400 text-xs"></i>
                            <input
                              type="text"
                              placeholder="Buscar código SKU, nombre o proveedor..."
                              value={skuFilterSearch}
                              onChange={(e) => setSkuFilterSearch(e.target.value)}
                              className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-lg text-xs bg-white focus:outline-none focus:border-[#006EAD]"
                            />
                            {skuFilterSearch && (
                              <button
                                onClick={() => setSkuFilterSearch('')}
                                className="absolute right-2.5 top-2 text-gray-400 hover:text-gray-600 text-xs"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Filtros de Estado y Nivel de Conversión */}
                      <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-200/80 text-xs">
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-500 font-bold uppercase text-[10px]">Filtrar por Estado:</span>
                          <select
                            value={skuStatusFilter}
                            onChange={(e) => setSkuStatusFilter(e.target.value)}
                            className="px-2.5 py-1 border border-gray-300 rounded-md text-xs font-semibold bg-white focus:outline-none focus:border-[#006EAD]"
                          >
                            <option value="todos">Todos los Códigos ({analyticsData.skuList.length})</option>
                            <option value="con_ventas">✓ Solo con Ventas (Vendidos)</option>
                            <option value="con_perdidas">⚠️ Solo con Pérdidas (No Vendidos)</option>
                            <option value="100_vendido">⭐ 100% Vendido (Éxito Total)</option>
                            <option value="100_perdido">📉 100% NO Vendido (Fuga Total)</option>
                          </select>
                        </div>

                        <div className="flex items-center space-x-2">
                          <span className="text-gray-500 font-bold uppercase text-[10px]">Efectividad %:</span>
                          <select
                            value={skuSuccessFilter}
                            onChange={(e) => setSkuSuccessFilter(e.target.value)}
                            className="px-2.5 py-1 border border-gray-300 rounded-md text-xs font-semibold bg-white focus:outline-none focus:border-[#006EAD]"
                          >
                            <option value="todos">Todos los porcentajes</option>
                            <option value="gt75">Alta conversión (≥ 75%)</option>
                            <option value="50_75">Media conversión (50% a 74%)</option>
                            <option value="lt50">Baja conversión (&lt; 50%)</option>
                            <option value="zero">Sin ventas logradas (0%)</option>
                          </select>
                        </div>

                        {(skuStatusFilter !== 'todos' || skuSuccessFilter !== 'todos' || skuFilterSearch) && (
                          <button
                            type="button"
                            onClick={() => { setSkuStatusFilter('todos'); setSkuSuccessFilter('todos'); setSkuFilterSearch(''); }}
                            className="text-[11px] text-red-600 hover:text-red-800 font-bold underline ml-auto"
                          >
                            Limpiar filtros de códigos
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Tabla de Indicador por Código (Cotizados vs Vendidos vs No Vendidos + Motivos) */}
                    <div className="border border-gray-200 rounded-xl overflow-hidden shadow-2xs">
                      <div className="bg-slate-100 px-4 py-2.5 font-bold text-xs text-gray-700 border-b border-gray-200 flex justify-between items-center">
                        <span className="flex items-center space-x-2">
                          <i className="fas fa-boxes text-[#006EAD]"></i>
                          <span>Indicador de Conversión y Fuga por Código SKU</span>
                        </span>
                        <span className="text-[11px] text-gray-500 font-normal">
                          Mostrando <strong>{analyticsData.skuList.filter(s => {
                            if (skuFilterSearch.trim()) {
                              const q = skuFilterSearch.toLowerCase();
                              if (!s.sku.toLowerCase().includes(q) && !(s.name || '').toLowerCase().includes(q) && !(s.provider || '').toLowerCase().includes(q)) return false;
                            }
                            if (skuStatusFilter === 'con_ventas' && s.unitsSold <= 0) return false;
                            if (skuStatusFilter === 'con_perdidas' && s.unitsLost <= 0) return false;
                            if (skuStatusFilter === '100_vendido' && (s.unitsLost > 0 || s.unitsPending > 0 || s.unitsSold === 0)) return false;
                            if (skuStatusFilter === '100_perdido' && (s.unitsSold > 0 || s.unitsLost === 0)) return false;
                            const rate = Number(s.winRateQty);
                            if (skuSuccessFilter === 'gt75' && rate < 75) return false;
                            if (skuSuccessFilter === '50_75' && (rate < 50 || rate >= 75)) return false;
                            if (skuSuccessFilter === 'lt50' && (rate >= 50 || rate === 0)) return false;
                            if (skuSuccessFilter === 'zero' && rate > 0) return false;
                            return true;
                          }).length}</strong> de {analyticsData.skuList.length} códigos
                        </span>
                      </div>

                      <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-50 text-gray-700 uppercase text-[10px] font-bold border-b border-gray-200 sticky top-0 z-10 shadow-2xs">
                            <tr>
                              <th className="py-3 px-3">Código SKU & Producto</th>
                              <th className="py-3 px-3 text-center">Proveedor / Familia</th>
                              <th className="py-3 px-3 text-center bg-blue-50/50">
                                {skuMetricMode === 'qty' && 'Cotizados (Unid)'}
                                {skuMetricMode === 'percent' && 'Cotizados (%)'}
                                {skuMetricMode === 'amount' && 'Cotizados ($)'}
                                {skuMetricMode === 'all' && 'Cotizados (Cant. y $)'}
                              </th>
                              <th className="py-3 px-3 text-center bg-emerald-50/50">
                                {skuMetricMode === 'qty' && 'Vendidos (Unid)'}
                                {skuMetricMode === 'percent' && '% Efectividad Vendida'}
                                {skuMetricMode === 'amount' && 'Vendidos ($)'}
                                {skuMetricMode === 'all' && 'Vendidos (Cant., $ y %)'}
                              </th>
                              <th className="py-3 px-3 text-center bg-red-50/50">
                                {skuMetricMode === 'qty' && 'NO Vendidos (Unid)'}
                                {skuMetricMode === 'percent' && '% Fuga NO Vendida'}
                                {skuMetricMode === 'amount' && 'NO Vendidos ($)'}
                                {skuMetricMode === 'all' && 'NO Vendidos (Cant., $ y %)'}
                              </th>
                              <th className="py-3 px-3 text-center">Pendientes</th>
                              <th className="py-3 px-3 min-w-[280px]">
                                Motivo(s) por el que NO se vendió este código
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {analyticsData.skuList
                              .filter(s => {
                                if (skuFilterSearch.trim()) {
                                  const q = skuFilterSearch.toLowerCase();
                                  if (!s.sku.toLowerCase().includes(q) && !(s.name || '').toLowerCase().includes(q) && !(s.provider || '').toLowerCase().includes(q)) return false;
                                }
                                if (skuStatusFilter === 'con_ventas' && s.unitsSold <= 0) return false;
                                if (skuStatusFilter === 'con_perdidas' && s.unitsLost <= 0) return false;
                                if (skuStatusFilter === '100_vendido' && (s.unitsLost > 0 || s.unitsPending > 0 || s.unitsSold === 0)) return false;
                                if (skuStatusFilter === '100_perdido' && (s.unitsSold > 0 || s.unitsLost === 0)) return false;
                                const rate = Number(s.winRateQty);
                                if (skuSuccessFilter === 'gt75' && rate < 75) return false;
                                if (skuSuccessFilter === '50_75' && (rate < 50 || rate >= 75)) return false;
                                if (skuSuccessFilter === 'lt50' && (rate >= 50 || rate === 0)) return false;
                                if (skuSuccessFilter === 'zero' && rate > 0) return false;
                                return true;
                              })
                              .map(s => {
                                const isExpanded = expandedSkuDetail === s.sku;
                                const hasLoss = s.unitsLost > 0;
                                return (
                                  <React.Fragment key={s.sku}>
                                    <tr className={`hover:bg-slate-50 transition ${isExpanded ? 'bg-amber-50/30' : ''}`}>
                                      
                                      {/* SKU & Producto */}
                                      <td className="py-3 px-3">
                                        <div className="flex items-center space-x-2">
                                          <span className="font-mono font-black text-xs text-[#006EAD] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                                            {s.sku}
                                          </span>
                                        </div>
                                        <div className="font-bold text-gray-900 text-xs mt-1" title={s.name}>
                                          {s.name}
                                        </div>
                                        <div className="text-gray-400 text-[10px]">
                                          Precio unitario de lista: ${Number(s.unitPrice).toLocaleString()} USD
                                        </div>
                                      </td>

                                      {/* Proveedor y Categoría */}
                                      <td className="py-3 px-3 text-center text-[11px]">
                                        <span className="font-semibold text-gray-700 block">{s.provider}</span>
                                        <span className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.2 rounded inline-block mt-0.5">{s.category}</span>
                                      </td>

                                      {/* COTIZADOS */}
                                      <td className="py-3 px-3 text-center bg-blue-50/30 font-semibold">
                                        {skuMetricMode === 'qty' && (
                                          <span className="text-gray-900 font-bold">{s.unitsQuoted} un.</span>
                                        )}
                                        {skuMetricMode === 'percent' && (
                                          <span className="text-blue-800 font-bold">100%</span>
                                        )}
                                        {skuMetricMode === 'amount' && (
                                          <span className="font-mono font-bold text-gray-900">${s.quotedAmount.toLocaleString()}</span>
                                        )}
                                        {skuMetricMode === 'all' && (
                                          <div>
                                            <span className="font-black text-gray-900 block">{s.unitsQuoted} un.</span>
                                            <span className="text-[10px] font-mono text-gray-500">${s.quotedAmount.toLocaleString()} USD</span>
                                          </div>
                                        )}
                                      </td>

                                      {/* VENDIDOS */}
                                      <td className="py-3 px-3 text-center bg-emerald-50/30">
                                        {skuMetricMode === 'qty' && (
                                          <span className="text-emerald-700 font-black">{s.unitsSold} un.</span>
                                        )}
                                        {skuMetricMode === 'percent' && (
                                          <span className={`px-2 py-0.5 rounded font-black text-[11px] ${
                                            Number(s.winRateQty) >= 60 ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-700'
                                          }`}>
                                            {s.winRateQty}%
                                          </span>
                                        )}
                                        {skuMetricMode === 'amount' && (
                                          <span className="font-mono font-bold text-emerald-700">${s.soldAmount.toLocaleString()}</span>
                                        )}
                                        {skuMetricMode === 'all' && (
                                          <div>
                                            <div className="flex items-center justify-center space-x-1">
                                              <span className="font-black text-emerald-700">{s.unitsSold} un.</span>
                                              <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                                                Number(s.winRateQty) >= 60 ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                                              }`}>
                                                {s.winRateQty}%
                                              </span>
                                            </div>
                                            <span className="text-[10px] font-mono text-emerald-600 font-semibold block mt-0.5">
                                              ${s.soldAmount.toLocaleString()} USD
                                            </span>
                                          </div>
                                        )}
                                      </td>

                                      {/* NO VENDIDOS (Perdidos) */}
                                      <td className="py-3 px-3 text-center bg-red-50/30">
                                        {skuMetricMode === 'qty' && (
                                          <span className={`font-black ${hasLoss ? 'text-red-600' : 'text-gray-400'}`}>
                                            {s.unitsLost} un.
                                          </span>
                                        )}
                                        {skuMetricMode === 'percent' && (
                                          <span className={`px-2 py-0.5 rounded font-black text-[11px] ${
                                            hasLoss ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-500'
                                          }`}>
                                            {s.lostRateQty}%
                                          </span>
                                        )}
                                        {skuMetricMode === 'amount' && (
                                          <span className={`font-mono font-bold ${hasLoss ? 'text-red-700' : 'text-gray-400'}`}>
                                            {hasLoss ? `-$${s.lostAmount.toLocaleString()}` : '$0'}
                                          </span>
                                        )}
                                        {skuMetricMode === 'all' && (
                                          <div>
                                            <div className="flex items-center justify-center space-x-1">
                                              <span className={`font-black ${hasLoss ? 'text-red-600' : 'text-gray-400'}`}>
                                                {s.unitsLost} un.
                                              </span>
                                              {hasLoss && (
                                                <span className="text-[10px] font-bold bg-red-100 text-red-800 px-1.5 py-0.2 rounded">
                                                  {s.lostRateQty}% fuga
                                                </span>
                                              )}
                                            </div>
                                            <span className={`text-[10px] font-mono block mt-0.5 ${hasLoss ? 'text-red-700 font-semibold' : 'text-gray-400'}`}>
                                              {hasLoss ? `-$${s.lostAmount.toLocaleString()} USD` : '$0 USD'}
                                            </span>
                                          </div>
                                        )}
                                      </td>

                                      {/* PENDIENTES */}
                                      <td className="py-3 px-3 text-center text-gray-500 text-[11px]">
                                        {s.unitsPending > 0 ? (
                                          <span className="text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                            {s.unitsPending} un. ({s.pendingRateQty}%)
                                          </span>
                                        ) : (
                                          <span className="text-gray-300">-</span>
                                        )}
                                      </td>

                                      {/* MOTIVO(S) POR EL QUE NO SE VENDIÓ */}
                                      <td className="py-3 px-3">
                                        {!hasLoss ? (
                                          <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold text-[10px] inline-flex items-center">
                                            <i className="fas fa-check-circle mr-1"></i>100% Vendido / Sin fugas
                                          </span>
                                        ) : (
                                          <div className="space-y-1">
                                            {/* Desglose de motivos específicos de este código */}
                                            <div className="flex flex-wrap gap-1">
                                              {s.reasonsBreakdown.map(rb => (
                                                <span
                                                  key={rb.reason}
                                                  className="bg-red-50 text-red-900 border border-red-200 rounded px-1.5 py-0.5 text-[10px] font-semibold flex items-center space-x-1"
                                                >
                                                  <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                                  <span>{rb.reason}</span>
                                                  <strong className="text-red-700 font-bold ml-1">({rb.qty} un. • {rb.pctOfLoss}%)</strong>
                                                </span>
                                              ))}
                                            </div>

                                            {/* Botón para expandir detalles y notas */}
                                            <button
                                              type="button"
                                              onClick={() => setExpandedSkuDetail(isExpanded ? null : s.sku)}
                                              className="text-[10px] font-bold text-[#006EAD] hover:underline flex items-center space-x-1 mt-1"
                                            >
                                              <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'} text-[9px]`}></i>
                                              <span>{isExpanded ? 'Ocultar casos' : `Ver ${s.lostCases.length} cotización(es) con rechazo`}</span>
                                            </button>
                                          </div>
                                        )}
                                      </td>
                                    </tr>

                                    {/* Fila Acordeón Expandida de Casos y Motivos */}
                                    {isExpanded && (
                                      <tr className="bg-amber-50/40 border-b-2 border-b-amber-200">
                                        <td colSpan={7} className="p-4">
                                          <div className="bg-white p-4 rounded-xl border border-amber-200 space-y-3 shadow-xs">
                                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-100 pb-2">
                                              <div className="flex items-center space-x-2">
                                                <i className="fas fa-exclamation-triangle text-amber-600"></i>
                                                <span className="font-bold text-xs text-gray-800 uppercase">
                                                  Auditoría de No Compra para el SKU: <strong>{s.sku}</strong> ({s.name})
                                                </span>
                                              </div>
                                              <button
                                                type="button"
                                                onClick={() => { setAnalyticsSku(s.sku); showToast(`📦 Dashboard filtrado por SKU "${s.sku}"`); }}
                                                className="bg-[#006EAD] text-white text-[10px] font-bold px-2.5 py-1 rounded-md hover:bg-blue-800 transition"
                                              >
                                                Filtrar todo el Dashboard por este SKU
                                              </button>
                                            </div>

                                            {/* Listado de casos reales con notas del vendedor */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                                              {s.lostCases.map((c, idx) => (
                                                <div key={idx} className="p-3 rounded-lg border border-red-100 bg-red-50/20 space-y-1.5">
                                                  <div className="flex justify-between items-start font-bold">
                                                    <span className="text-gray-900">{c.company}</span>
                                                    <span className="text-red-700 font-mono">-${c.amount.toLocaleString()} USD ({c.quantity} un.)</span>
                                                  </div>
                                                  <div className="text-[11px] text-red-800 font-semibold flex items-center">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-red-600 mr-1.5"></span>
                                                    {c.reason}
                                                  </div>
                                                  <div className="text-gray-400 text-[10px] flex flex-wrap gap-2">
                                                    <span>📍 {c.branch}</span>
                                                    <span>👤 {c.seller}</span>
                                                    <span>📅 {c.date}</span>
                                                  </div>
                                                  {c.notes && (
                                                    <div className="bg-white p-2 rounded border border-amber-200 text-amber-900 text-[11px] italic mt-1">
                                                      "{c.notes}"
                                                    </div>
                                                  )}
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        </td>
                                      </tr>
                                    )}
                                  </React.Fragment>
                                );
                              })}
                          </tbody>
                        </table>
                      </div>
                    </div>

                  </div>
                )}

              
                {/* 7. AUDITORÍA DE MOTIVOS DE VENTAS PERDIDAS (1 AL 5) */}
                {analyticsActiveTab === 'motivos' && (
                  <div className="space-y-4">
                    {renderLossReasonsAudit()}
                  </div>
                )}
              </div>
            </div>

          </div>
        )}
      </div>


      {/* ========================================================= */}
      {/* DRAWER / MODAL: CHAT BIDIRECCIONAL OMNICANAL              */}
      {/* ========================================================= */}
      {activeChatDeal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col h-[85vh] overflow-hidden animate-fadeIn border border-gray-100">
            
            {/* Header del Chat */}
            <div className="px-5 py-3.5 border-b border-gray-200 flex justify-between items-center bg-[#0A2540] text-white shrink-0">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg text-white ${
                  activeChatDeal.channel === 'whatsapp' ? 'bg-emerald-600' :
                  activeChatDeal.channel === 'instagram' ? 'bg-gradient-to-tr from-pink-500 to-purple-600' :
                  activeChatDeal.channel === 'email' ? 'bg-blue-600' : 'bg-purple-600'
                }`}>
                  {activeChatDeal.channel === 'whatsapp' && <i className="fab fa-whatsapp"></i>}
                  {activeChatDeal.channel === 'instagram' && <i className="fab fa-instagram"></i>}
                  {activeChatDeal.channel === 'email' && <i className="fas fa-envelope"></i>}
                  {activeChatDeal.channel === 'web' && <i className="fas fa-globe"></i>}
                  {!['whatsapp', 'instagram', 'email', 'web'].includes(activeChatDeal.channel) && <i className="fas fa-comments"></i>}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-sm font-bold text-white">{activeChatDeal.contact || activeChatDeal.company}</h3>
                    <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold uppercase">
                      {activeChatDeal.channel || 'whatsapp'}
                    </span>
                    {(activeChatDeal.resolutionStatus || 'pendiente') === 'pendiente' ? (
                      <span className="text-[10px] bg-amber-400 text-slate-900 px-2 py-0.5 rounded-full font-black">
                        PENDIENTE
                      </span>
                    ) : (
                      <span className="text-[10px] bg-emerald-400 text-slate-900 px-2 py-0.5 rounded-full font-bold">
                        ✓ RESUELTO
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-blue-200">
                    {activeChatDeal.company} • Asesor: {activeChatDeal.assignedTo} • {activeChatDeal.phone || activeChatDeal.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {(activeChatDeal.resolutionStatus || 'pendiente') === 'pendiente' ? (
                  <button
                    type="button"
                    onClick={() => handleOpenResolveModal(activeChatDeal)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition flex items-center space-x-1"
                  >
                    <i className="fas fa-check"></i>
                    <span>Finalizar Solicitud</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleReopenRequest(activeChatDeal)}
                    className="bg-white/20 hover:bg-white/30 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg transition"
                  >
                    Reabrir
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setActiveChatDeal(null)}
                  className="text-gray-300 hover:text-white text-xl font-bold p-1"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Banner de Resolución si ya está finalizado */}
            {activeChatDeal.resolutionStatus === 'resuelto' && (
              <div className="bg-emerald-50 border-b border-emerald-200 p-3 text-xs text-emerald-900 flex items-start space-x-2 shrink-0">
                <i className="fas fa-check-circle text-emerald-600 mt-0.5"></i>
                <div className="flex-1">
                  <span className="font-bold block">✓ Solicitud Finalizada el {activeChatDeal.resolvedAt} por {activeChatDeal.resolvedBy}:</span>
                  <p className="italic">"{activeChatDeal.resolutionNotes || 'Sin notas adicionales.'}"</p>
                </div>
              </div>
            )}

            {/* Hilo de Mensajes */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-100">
              {(!activeChatDeal.messages || activeChatDeal.messages.length === 0) ? (
                <div className="text-center py-12 text-gray-400 text-xs">
                  <i className="fas fa-comments text-3xl mb-2 block"></i>
                  No hay mensajes registrados aún en este hilo.
                </div>
              ) : (
                activeChatDeal.messages.map((msg, i) => {
                  const isAgent = msg.sender === 'agent';
                  return (
                    <div
                      key={msg.id || i}
                      className={`flex ${isAgent ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[78%] rounded-2xl p-3 text-xs shadow-2xs space-y-1 ${
                          isAgent
                            ? 'bg-[#006EAD] text-white rounded-br-none'
                            : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] opacity-75 mb-0.5 space-x-2">
                          <span className="font-bold">
                            {isAgent ? `👤 ${activeChatDeal.assignedTo} (NyTEX)` : `💬 ${activeChatDeal.contact || 'Cliente'}`}
                          </span>
                          <span>{msg.timestamp || ''}</span>
                        </div>
                        <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Respuestas Rápidas Predefinidas */}
            <div className="bg-slate-50 px-4 py-2 border-t border-gray-200 flex flex-wrap gap-1.5 text-[11px] shrink-0">
              <span className="text-[10px] font-bold text-gray-400 self-center mr-1">Plantillas:</span>
              <button
                type="button"
                onClick={() => setNewChatReplyText('¡Hola! Con gusto te envío la cotización detallada de los artículos solicitados.')}
                className="bg-white hover:bg-gray-100 text-gray-700 px-2 py-1 rounded border border-gray-200 transition"
              >
                Cotización lista
              </button>
              <button
                type="button"
                onClick={() => setNewChatReplyText('Hemos recibido tu consulta, con gusto verifico existencias en almacén y te respondo en unos momentos.')}
                className="bg-white hover:bg-gray-100 text-gray-700 px-2 py-1 rounded border border-gray-200 transition"
              >
                Consulta recibida
              </button>
              <button
                type="button"
                onClick={() => setNewChatReplyText('Lamentamos el inconveniente con tu pedido. De inmediato coordinamos la inspección y solución.')}
                className="bg-white hover:bg-gray-100 text-gray-700 px-2 py-1 rounded border border-gray-200 transition"
              >
                Atención a reclamo
              </button>
            </div>

            {/* Formulario de Envío de Respuesta */}
            <div className="p-3.5 border-t border-gray-200 bg-white flex items-end space-x-2 shrink-0">
              <textarea
                rows={2}
                value={newChatReplyText}
                onChange={(e) => setNewChatReplyText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendChatReply();
                  }
                }}
                placeholder={`Escribe tu respuesta para ${activeChatDeal.contact || 'el cliente'} vía ${(activeChatDeal.channel || 'canal').toUpperCase()}...`}
                className="flex-1 p-2.5 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#006EAD] focus:border-[#006EAD] resize-none"
              />
              <button
                type="button"
                onClick={handleSendChatReply}
                disabled={!newChatReplyText.trim()}
                className={`px-4 py-2.5 rounded-xl text-xs font-black text-white transition flex items-center space-x-1.5 h-[42px] ${
                  newChatReplyText.trim() ? 'bg-[#006EAD] hover:bg-blue-800 shadow-md' : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                <span>Enviar</span>
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: FINALIZAR / RESOLVER SOLICITUD OMNICANAL           */}
      {/* ========================================================= */}
      {isResolveModalOpen && dealToResolve && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fadeIn border border-gray-100">
            <div className="px-6 py-4 bg-[#0A2540] text-white flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <i className="fas fa-check-circle text-emerald-400 text-lg"></i>
                <h3 className="font-bold text-base">Finalizar y Resolver Solicitud</h3>
              </div>
              <button onClick={() => setIsResolveModalOpen(false)} className="text-gray-300 hover:text-white text-lg">✕</button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between font-bold text-gray-900">
                  <span>{dealToResolve.company}</span>
                  <span className="text-[#006EAD] uppercase">{dealToResolve.channel}</span>
                </div>
                <p className="text-gray-600">{dealToResolve.title}</p>
                <div className="text-[10px] text-gray-400 flex items-center gap-2 pt-1 border-t border-slate-200 mt-1">
                  <span>👤 {dealToResolve.contact}</span>
                  <span>•</span>
                  <span>Asesor: {dealToResolve.assignedTo}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-gray-700 uppercase mb-1">
                  Notas de Resolución / Cierre *
                </label>
                <textarea
                  rows={3}
                  value={resolveNotesInput}
                  onChange={(e) => setResolveNotesInput(e.target.value)}
                  placeholder="Detalla la solución brindada al cliente (ej. Cotización acordada, duda técnica aclarada, cambio de producto autorizado)..."
                  className="w-full p-2.5 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
                <p className="text-[10px] text-gray-400 mt-1">
                  Esta solicitud se archivará como <strong>Finalizada</strong> y se ocultará automáticamente de la vista de pendientes.
                </p>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsResolveModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-100 transition"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmResolve}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-black transition shadow-md flex items-center space-x-1.5"
                >
                  <i className="fas fa-check"></i>
                  <span>Confirmar y Finalizar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: SIMULADOR DE MENSAJES ENTRANTES OMNICANAL          */}
      {/* ========================================================= */}
      {isSimulatorOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden animate-fadeIn border border-gray-100">
            <div className="px-6 py-4 bg-gradient-to-r from-purple-800 to-indigo-900 text-white flex justify-between items-center">
              <div className="flex items-center space-x-2.5">
                <i className="fas fa-flask text-purple-300 text-lg"></i>
                <div>
                  <h3 className="font-bold text-base">Simulador de Mensajes Entrantes</h3>
                  <p className="text-xs text-purple-200">Prueba cómo ingresan solicitudes desde WhatsApp, Instagram, Email y Web</p>
                </div>
              </div>
              <button onClick={() => setIsSimulatorOpen(false)} className="text-gray-300 hover:text-white text-lg">✕</button>
            </div>

            <div className="p-6 space-y-4">
              
              {/* Selector de Canal */}
              <div>
                <label className="block text-xs font-black text-gray-700 uppercase mb-1">
                  1. Canal de Origen
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'whatsapp', label: 'WhatsApp', icon: 'fab fa-whatsapp', color: 'border-emerald-500 bg-emerald-50 text-emerald-800' },
                    { id: 'instagram', label: 'Instagram', icon: 'fab fa-instagram', color: 'border-pink-500 bg-pink-50 text-pink-800' },
                    { id: 'email', label: 'Correo', icon: 'fas fa-envelope', color: 'border-blue-500 bg-blue-50 text-blue-800' },
                    { id: 'web', label: 'Web', icon: 'fas fa-globe', color: 'border-purple-500 bg-purple-50 text-purple-800' }
                  ].map(ch => (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => setSimulatorForm(prev => ({ ...prev, channel: ch.id }))}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition ${
                        simulatorForm.channel === ch.id ? `${ch.color} ring-2 shadow-xs` : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <i className={`${ch.icon} text-base`}></i>
                      <span>{ch.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Selector de Tipo */}
              <div>
                <label className="block text-xs font-black text-gray-700 uppercase mb-1">
                  2. Tipo de Solicitud
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { 
                      id: 'cotizacion', 
                      label: '💰 Cotización', 
                      sampleText: 'Hola buenas tardes, quisiéramos cotizar 150 yardas de tela Oxford azul y 50 conos de hilo poliéster para entregar en San Salvador.' 
                    },
                    { 
                      id: 'consulta', 
                      label: '❓ Consulta Comercial', 
                      sampleText: 'Hola, ¿cuál es el horario de atención en la sucursal de San Miguel y si cuentan con catálogo de frazadas térmicas?' 
                    },
                    { 
                      id: 'reclamo', 
                      label: '⚠️ Reclamo / Incidencia', 
                      sampleText: 'Buenas tardes, recibimos el pedido #481 con 2 cajas que presentan empaque dañado y mercancía manchada. Requerimos reposición inmediata.' 
                    }
                  ].map(tp => (
                    <button
                      key={tp.id}
                      type="button"
                      onClick={() => setSimulatorForm(prev => ({ 
                        ...prev, 
                        requestType: tp.id,
                        messageText: tp.sampleText,
                        title: `Solicitud de ${tp.id.toUpperCase()} - ${prev.company}`
                      }))}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition text-center ${
                        simulatorForm.requestType === tp.id 
                          ? 'border-[#006EAD] bg-blue-50 text-[#006EAD] ring-2 ring-blue-300' 
                          : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      {tp.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Datos del Cliente */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Empresa / Razón Social *</label>
                  <input
                    type="text"
                    value={simulatorForm.company}
                    onChange={(e) => setSimulatorForm(prev => ({ ...prev, company: e.target.value }))}
                    className="w-full p-2 text-xs border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Contacto Principal *</label>
                  <input
                    type="text"
                    value={simulatorForm.contact}
                    onChange={(e) => setSimulatorForm(prev => ({ ...prev, contact: e.target.value }))}
                    className="w-full p-2 text-xs border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              {/* Mensaje del Cliente */}
              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  Mensaje Enviado por el Cliente *
                </label>
                <textarea
                  rows={3}
                  value={simulatorForm.messageText}
                  onChange={(e) => setSimulatorForm(prev => ({ ...prev, messageText: e.target.value }))}
                  className="w-full p-2.5 text-xs border border-gray-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSimulatorOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-100 transition"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSimulateIncomingMessage}
                  className="px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg text-xs font-black transition shadow-md flex items-center space-x-1.5"
                >
                  <i className="fas fa-paper-plane"></i>
                  <span>Simular y Recibir en CRM</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

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
                    {SELLERS_LIST.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Sucursal de Registro *
                  </label>
                  <select
                    value={formData.branch}
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#006EAD] text-sm font-medium"
                  >
                    {BRANCHES_LIST.map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Fecha de Creación
                  </label>
                  <input
                    type="date"
                    value={formData.createdDate || '2026-11-12'}
                    onChange={(e) => setFormData({ ...formData, createdDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006EAD] text-sm"
                  />
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
                    
                    <div className="bg-white p-3 rounded-xl border border-gray-200 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <label className="block text-[11px] font-bold text-gray-700 uppercase">
                          Producto / Servicio (Kardex) <span className="text-red-500">*</span>
                        </label>
                        {/* Selector de Pestañas */}
                        <div className="inline-flex bg-gray-200 p-0.5 rounded-lg text-[11px] font-bold self-start sm:self-auto">
                          <button
                            type="button"
                            onClick={() => setNewDealSkuTab('search')}
                            className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                              newDealSkuTab === 'search'
                                ? 'bg-[#006EAD] text-white shadow-xs'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                          >
                            <i className="fas fa-search text-[10px]"></i>
                            <span>Buscador por Código / Texto</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setNewDealSkuTab('list')}
                            className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                              newDealSkuTab === 'list'
                                ? 'bg-[#006EAD] text-white shadow-xs'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                          >
                            <i className="fas fa-list text-[10px]"></i>
                            <span>Lista Completa</span>
                          </button>
                        </div>
                      </div>

                      {newDealSkuTab === 'search' ? (
                        <div className="space-y-2">
                          {newDealSkuForm.selectedSku ? (
                            (() => {
                              const sel = kardexCatalog.find(k => k.sku === newDealSkuForm.selectedSku) || { name: newDealSkuForm.selectedSku, unitPrice: newDealSkuForm.unitPrice, stock: 0 };
                              return (
                                <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded-lg flex items-center justify-between">
                                  <div className="flex items-center space-x-2">
                                    <span className="font-mono font-bold text-xs bg-emerald-700 text-white px-2 py-0.5 rounded">
                                      {newDealSkuForm.selectedSku}
                                    </span>
                                    <div>
                                      <p className="font-bold text-xs text-emerald-950 leading-tight">{sel.name}</p>
                                      <span className="text-[10px] text-emerald-700 font-semibold">
                                        Precio: ${Number(newDealSkuForm.unitPrice || sel.unitPrice).toLocaleString()} • Stock: {sel.stock} {sel.unit || 'unidades'}
                                      </span>
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setNewDealSkuForm(prev => ({ ...prev, selectedSku: '', unitPrice: '' }));
                                      setNewDealSkuSearchQuery('');
                                    }}
                                    className="px-2 py-1 text-[11px] bg-white text-red-600 hover:bg-red-50 border border-red-200 font-bold rounded shadow-2xs transition"
                                  >
                                    ✕ Cambiar
                                  </button>
                                </div>
                              );
                            })()
                          ) : (
                            <div className="space-y-1.5">
                              <div className="relative">
                                <input
                                  type="text"
                                  value={newDealSkuSearchQuery}
                                  onChange={(e) => setNewDealSkuSearchQuery(e.target.value)}
                                  placeholder="🔎 Escriba letras o números para buscar código o descripción (ej. TEL, 01, SRV, Alfa)..."
                                  className="w-full pl-8 pr-7 py-2 border border-gray-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#006EAD] font-medium"
                                />
                                <span className="absolute left-2.5 top-2.5 text-gray-400 text-xs">
                                  <i className="fas fa-search"></i>
                                </span>
                                {newDealSkuSearchQuery && (
                                  <button
                                    type="button"
                                    onClick={() => setNewDealSkuSearchQuery('')}
                                    className="absolute right-2.5 top-2 text-gray-400 hover:text-gray-700 text-xs font-bold"
                                  >
                                    ✕
                                  </button>
                                )}
                              </div>

                              <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg bg-white divide-y divide-gray-100 shadow-inner">
                                {filteredNewDealKardex.length === 0 ? (
                                  <div className="p-2.5 text-center text-xs text-gray-400">
                                    No se encontraron productos coincidentes con "{newDealSkuSearchQuery}".
                                  </div>
                                ) : (
                                  filteredNewDealKardex.map(item => (
                                    <div
                                      key={item.sku}
                                      onClick={() => {
                                        setNewDealSkuForm(prev => ({
                                          ...prev,
                                          selectedSku: item.sku,
                                          unitPrice: item.unitPrice
                                        }));
                                        setNewDealSkuSearchQuery('');
                                      }}
                                      className="p-2 hover:bg-blue-50/70 cursor-pointer transition flex items-center justify-between text-xs group"
                                    >
                                      <div className="flex items-center space-x-2">
                                        <span className="font-mono font-bold text-[11px] bg-slate-100 text-[#006EAD] group-hover:bg-[#006EAD] group-hover:text-white border border-blue-200 px-1.5 py-0.5 rounded transition">
                                          {item.sku}
                                        </span>
                                        <p className="font-semibold text-gray-800 leading-tight group-hover:text-[#006EAD] transition">{item.name}</p>
                                      </div>
                                      <span className="font-mono font-bold text-[#006EAD] text-xs shrink-0 ml-2">
                                        ${Number(item.unitPrice).toLocaleString()}
                                      </span>
                                    </div>
                                  ))
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
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
                      )}
                    </div>

                    {/* Fila Cantidad, Precio Unitario y Botón */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end pt-1">
                      <div className="sm:col-span-4">
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

                      <div className="sm:col-span-4">
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

                      <div className="sm:col-span-4">
                        <button
                          type="button"
                          onClick={handleAddNewDealSku}
                          className="w-full py-2 px-3 bg-[#006EAD] hover:bg-[#005587] text-white rounded-lg font-bold text-xs shadow-xs transition"
                        >
                          + Agregar SKU a la Propuesta
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
                    
                    {/* Selector con Pestañas y Buscador Reactivo por Código / Texto */}
                    <div className="bg-slate-50/80 p-3 rounded-xl border border-gray-200 space-y-2.5">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <label className="block text-[11px] font-bold text-gray-700 uppercase">
                          Seleccionar SKU del Kardex <span className="text-red-500">*</span>
                        </label>
                        {/* Selector de Pestañas: Buscador por Código vs Lista Desplegable */}
                        <div className="inline-flex bg-gray-200 p-0.5 rounded-lg text-[11px] font-bold self-start sm:self-auto">
                          <button
                            type="button"
                            onClick={() => setSkuSelectTab('search')}
                            className={`px-3 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                              skuSelectTab === 'search'
                                ? 'bg-[#006EAD] text-white shadow-xs'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                          >
                            <i className="fas fa-search text-[10px]"></i>
                            <span>Buscador por Código / Texto</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setSkuSelectTab('list')}
                            className={`px-3 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                              skuSelectTab === 'list'
                                ? 'bg-[#006EAD] text-white shadow-xs'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                          >
                            <i className="fas fa-list text-[10px]"></i>
                            <span>Lista Completa</span>
                          </button>
                        </div>
                      </div>

                      {/* PESTAÑA 1: Buscador Reactivo (Filtra a medida que se escriben letras o números) */}
                      {skuSelectTab === 'search' ? (
                        <div className="space-y-2">
                          {quoteForm.selectedSku ? (
                            (() => {
                              const sel = kardexCatalog.find(k => k.sku === quoteForm.selectedSku) || { name: quoteForm.selectedSku, unitPrice: quoteForm.unitPrice, stock: 0 };
                              return (
                                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg flex items-center justify-between">
                                  <div className="flex items-center space-x-2.5">
                                    <span className="font-mono font-bold text-xs bg-emerald-700 text-white px-2 py-0.5 rounded">
                                      {quoteForm.selectedSku}
                                    </span>
                                    <div>
                                      <p className="font-bold text-xs text-emerald-950 leading-tight">{sel.name}</p>
                                      <span className="text-[10px] text-emerald-700 font-semibold">
                                        Precio Catálogo: ${Number(quoteForm.unitPrice || sel.unitPrice).toLocaleString()} • Stock: {sel.stock} {sel.unit || 'unidades'} • {sel.category || 'General'}
                                      </span>
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setQuoteForm(prev => ({ ...prev, selectedSku: '', unitPrice: '' }));
                                      setSkuSearchQuery('');
                                    }}
                                    className="px-2.5 py-1 text-xs bg-white text-red-600 hover:bg-red-50 border border-red-200 font-bold rounded shadow-2xs transition flex items-center gap-1"
                                  >
                                    <span>✕</span> Cambiar SKU
                                  </button>
                                </div>
                              );
                            })()
                          ) : (
                            <div className="space-y-1.5">
                              <div className="relative">
                                <input
                                  type="text"
                                  value={skuSearchQuery}
                                  onChange={(e) => setSkuSearchQuery(e.target.value)}
                                  placeholder="🔎 Escriba letras o números para buscar código o descripción (ej. TEL, 01, SRV, Alfa)..."
                                  className="w-full pl-8 pr-7 py-2 border border-gray-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#006EAD] font-medium"
                                  autoFocus
                                />
                                <span className="absolute left-2.5 top-2.5 text-gray-400 text-xs">
                                  <i className="fas fa-search"></i>
                                </span>
                                {skuSearchQuery && (
                                  <button
                                    type="button"
                                    onClick={() => setSkuSearchQuery('')}
                                    className="absolute right-2.5 top-2 text-gray-400 hover:text-gray-700 text-xs font-bold"
                                  >
                                    ✕
                                  </button>
                                )}
                              </div>

                              {/* Resultados coincidentes interactivos */}
                              <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg bg-white divide-y divide-gray-100 shadow-inner">
                                {filteredKardex.length === 0 ? (
                                  <div className="p-3 text-center text-xs text-gray-400">
                                    No se encontraron productos o servicios que coincidan con "{skuSearchQuery}".
                                  </div>
                                ) : (
                                  filteredKardex.map(item => (
                                    <div
                                      key={item.sku}
                                      onClick={() => {
                                        setQuoteForm(prev => ({
                                          ...prev,
                                          selectedSku: item.sku,
                                          unitPrice: item.unitPrice
                                        }));
                                        setSkuSearchQuery('');
                                      }}
                                      className="p-2 hover:bg-blue-50/70 cursor-pointer transition flex items-center justify-between text-xs group"
                                    >
                                      <div className="flex items-center space-x-2">
                                        <span className="font-mono font-bold text-[11px] bg-slate-100 text-[#006EAD] group-hover:bg-[#006EAD] group-hover:text-white border border-blue-200 px-1.5 py-0.5 rounded transition">
                                          {item.sku}
                                        </span>
                                        <div>
                                          <p className="font-semibold text-gray-800 leading-tight group-hover:text-[#006EAD] transition">{item.name}</p>
                                          <span className="text-[10px] text-gray-400">
                                            {item.category || 'General'} • Stock: {item.stock} {item.unit || 'unidades'}
                                          </span>
                                        </div>
                                      </div>
                                      <span className="font-mono font-bold text-[#006EAD] text-xs shrink-0 ml-2">
                                        ${Number(item.unitPrice).toLocaleString()}
                                      </span>
                                    </div>
                                  ))
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        /* PESTAÑA 2: Selector Tradicional (Lista Desplegable) */
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
                      )}
                    </div>

                    {/* Fila Cantidad, Precio Unitario y Botón Agregar SKU */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end pt-1">
                      <div className="sm:col-span-4">
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

                      <div className="sm:col-span-4">
                        <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                          Precio Unitario ($) <span className="text-gray-400 font-normal">(Ajustable)</span>
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

                      <div className="sm:col-span-4">
                        <button
                          type="submit"
                          className="w-full py-2 px-3 bg-[#006EAD] hover:bg-[#005587] text-white rounded-lg font-bold text-xs shadow-xs transition flex items-center justify-center space-x-1"
                        >
                          <i className="fas fa-cart-plus"></i>
                          <span>Agregar SKU a Cotización</span>
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
