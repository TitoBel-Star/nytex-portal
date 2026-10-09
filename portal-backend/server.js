const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes, Op } = require('sequelize');
const path = require('path');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Configurar Base de Datos SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false
});

// 2. Definición de Modelos

const User = sequelize.define('User', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  subscriptions: { 
    type: DataTypes.JSON, 
    defaultValue: [] 
  },
  customQuoteAmount: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'Partner'
  }
});

const BusinessPartner = sequelize.define('BusinessPartner', {
  code: { type: DataTypes.STRING, unique: true, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  type: { type: DataTypes.STRING, allowNull: false }, // Cliente, Proveedor, Fletero, Prospecto
  contactName: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING },
  phone: { type: DataTypes.STRING },
  address: { type: DataTypes.STRING },
  creditLimit: { type: DataTypes.FLOAT, defaultValue: 50000 },
  balance: { type: DataTypes.FLOAT, defaultValue: 0 },
  status: { type: DataTypes.STRING, defaultValue: 'Activo' }
});

// ==========================================
// --- MODELOS DEL CIRCUITO COMERCIAL (O2C) ---
// ==========================================

const SaleOrder = sequelize.define('SaleOrder', {
  orderCode: { type: DataTypes.STRING, unique: true, allowNull: false },
  clientCode: { type: DataTypes.STRING, allowNull: false },
  clientName: { type: DataTypes.STRING, allowNull: false },
  deliveryAddress: { type: DataTypes.STRING },
  items: { type: DataTypes.JSON, defaultValue: [] },
  subtotal: { type: DataTypes.FLOAT, defaultValue: 0 },
  tax: { type: DataTypes.FLOAT, defaultValue: 0 },
  total: { type: DataTypes.FLOAT, defaultValue: 0 },
  paymentTerms: { type: DataTypes.STRING, defaultValue: 'Crédito 30 días' },
  status: { 
    type: DataTypes.STRING, 
    defaultValue: 'Cotización' 
  },
  isInvoiced: { type: DataTypes.BOOLEAN, defaultValue: false },
  invoiceCode: { type: DataTypes.STRING, allowNull: true }
});

const WmsTask = sequelize.define('WmsTask', {
  taskCode: { type: DataTypes.STRING, unique: true, allowNull: false },
  orderCode: { type: DataTypes.STRING, allowNull: false },
  clientName: { type: DataTypes.STRING, allowNull: false },
  warehouse: { type: DataTypes.STRING, defaultValue: 'Bodega Central Monterrey' },
  zone: { type: DataTypes.STRING, defaultValue: 'Pasillo A - Racks 01-04' },
  items: { type: DataTypes.JSON, defaultValue: [] },
  operator: { type: DataTypes.STRING, defaultValue: 'Carlos Almacenista' },
  status: { 
    type: DataTypes.STRING, 
    defaultValue: 'Pendiente' 
  }
});

const Shipment = sequelize.define('Shipment', {
  trackingCode: { type: DataTypes.STRING, unique: true, allowNull: false },
  orderCode: { type: DataTypes.STRING, allowNull: false },
  clientName: { type: DataTypes.STRING, allowNull: false },
  destination: { type: DataTypes.STRING, allowNull: false },
  carrier: { type: DataTypes.STRING, defaultValue: 'Transportes Express del Norte' },
  driver: { type: DataTypes.STRING, defaultValue: 'Roberto Méndez' },
  vehiclePlate: { type: DataTypes.STRING, defaultValue: 'NL-849-TX' },
  estimatedDelivery: { type: DataTypes.STRING },
  dispatchedAt: { type: DataTypes.STRING },
  deliveredAt: { type: DataTypes.STRING, allowNull: true },
  status: { 
    type: DataTypes.STRING, 
    defaultValue: 'Programado' 
  }
});

const AccountReceivable = sequelize.define('AccountReceivable', {
  invoiceCode: { type: DataTypes.STRING, unique: true, allowNull: false },
  orderCode: { type: DataTypes.STRING, allowNull: false },
  clientCode: { type: DataTypes.STRING, allowNull: false },
  clientName: { type: DataTypes.STRING, allowNull: false },
  issueDate: { type: DataTypes.STRING },
  dueDate: { type: DataTypes.STRING },
  totalAmount: { type: DataTypes.FLOAT, defaultValue: 0 },
  paidAmount: { type: DataTypes.FLOAT, defaultValue: 0 },
  balance: { type: DataTypes.FLOAT, defaultValue: 0 },
  creditDays: { type: DataTypes.INTEGER, defaultValue: 30 },
  status: { 
    type: DataTypes.STRING, 
    defaultValue: 'Al Corriente' 
  },
  paymentsLog: { type: DataTypes.JSON, defaultValue: [] }
});

// =========================================================================
// --- MODELOS DEL CIRCUITO DE COMPRAS, INVENTARIO Y PRODUCCIÓN (P2P & M) ---
// =========================================================================

const InventoryItem = sequelize.define('InventoryItem', {
  sku: { type: DataTypes.STRING, unique: true, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  category: { 
    type: DataTypes.STRING, 
    defaultValue: 'Materia Prima' 
  },
  stock: { type: DataTypes.FLOAT, defaultValue: 0 },
  reserved: { type: DataTypes.FLOAT, defaultValue: 0 },
  minStock: { type: DataTypes.FLOAT, defaultValue: 10 },
  unit: { type: DataTypes.STRING, defaultValue: 'unidades' },
  unitCost: { type: DataTypes.FLOAT, defaultValue: 0 },
  warehouse: { type: DataTypes.STRING, defaultValue: 'Almacén General Central' },
  location: { type: DataTypes.STRING, defaultValue: 'Rack A-01' },
  status: { 
    type: DataTypes.STRING, 
    defaultValue: 'Óptimo' 
  }
});

const PurchaseOrder = sequelize.define('PurchaseOrder', {
  poCode: { type: DataTypes.STRING, unique: true, allowNull: false },
  vendorCode: { type: DataTypes.STRING, allowNull: false },
  vendorName: { type: DataTypes.STRING, allowNull: false },
  items: { type: DataTypes.JSON, defaultValue: [] },
  subtotal: { type: DataTypes.FLOAT, defaultValue: 0 },
  tax: { type: DataTypes.FLOAT, defaultValue: 0 },
  total: { type: DataTypes.FLOAT, defaultValue: 0 },
  paymentTerms: { type: DataTypes.STRING, defaultValue: 'Crédito 30 días' },
  status: { 
    type: DataTypes.STRING, 
    defaultValue: 'Borrador' 
  },
  deliveryDate: { type: DataTypes.STRING },
  invoiceRef: { type: DataTypes.STRING, allowNull: true },
  isBilled: { type: DataTypes.BOOLEAN, defaultValue: false }
});

const ProductionOrder = sequelize.define('ProductionOrder', {
  opCode: { type: DataTypes.STRING, unique: true, allowNull: false },
  productSku: { type: DataTypes.STRING, allowNull: false },
  productName: { type: DataTypes.STRING, allowNull: false },
  targetQuantity: { type: DataTypes.FLOAT, defaultValue: 1 },
  unit: { type: DataTypes.STRING, defaultValue: 'rollos' },
  bom: { type: DataTypes.JSON, defaultValue: [] },
  operator: { type: DataTypes.STRING, defaultValue: 'Ing. Supervisor Fabril' },
  workcenter: { type: DataTypes.STRING, defaultValue: 'Telar Circular #3 - Planta 1' },
  startDate: { type: DataTypes.STRING },
  finishDate: { type: DataTypes.STRING, allowNull: true },
  scrapsPct: { type: DataTypes.FLOAT, defaultValue: 0 },
  status: { 
    type: DataTypes.STRING, 
    defaultValue: 'Planificada' 
  }
});

const AccountPayable = sequelize.define('AccountPayable', {
  billCode: { type: DataTypes.STRING, unique: true, allowNull: false },
  poCode: { type: DataTypes.STRING, allowNull: false },
  vendorCode: { type: DataTypes.STRING, allowNull: false },
  vendorName: { type: DataTypes.STRING, allowNull: false },
  issueDate: { type: DataTypes.STRING },
  dueDate: { type: DataTypes.STRING },
  totalAmount: { type: DataTypes.FLOAT, defaultValue: 0 },
  paidAmount: { type: DataTypes.FLOAT, defaultValue: 0 },
  balance: { type: DataTypes.FLOAT, defaultValue: 0 },
  status: { 
    type: DataTypes.STRING, 
    defaultValue: 'Al Corriente' 
  },
  paymentsLog: { type: DataTypes.JSON, defaultValue: [] }
});

// =========================================================================
// --- MODELOS DEL NÚCLEO FINANCIERO Y CONTABLE CENTRAL ([10], [11], [12]) ---
// =========================================================================

// [10] NyTEX Tesorería: Cuentas Bancarias y Flujo de Efectivo
const BankAccount = sequelize.define('BankAccount', {
  bankCode: { type: DataTypes.STRING, unique: true, allowNull: false },
  bankName: { type: DataTypes.STRING, allowNull: false },
  accountNumber: { type: DataTypes.STRING, allowNull: false },
  currency: { type: DataTypes.STRING, defaultValue: 'USD' },
  balance: { type: DataTypes.FLOAT, defaultValue: 0 },
  type: { type: DataTypes.STRING, defaultValue: 'Cheques / Operativa' } // 'Cheques / Operativa', 'Inversión', 'Caja'
});

const BankTransaction = sequelize.define('BankTransaction', {
  txCode: { type: DataTypes.STRING, unique: true, allowNull: false },
  bankCode: { type: DataTypes.STRING, allowNull: false },
  type: { type: DataTypes.STRING, allowNull: false }, // 'Ingreso', 'Egreso'
  category: { type: DataTypes.STRING, defaultValue: 'Operación Comercial' },
  amount: { type: DataTypes.FLOAT, defaultValue: 0 },
  date: { type: DataTypes.STRING },
  concept: { type: DataTypes.STRING },
  reference: { type: DataTypes.STRING },
  reconciled: { type: DataTypes.BOOLEAN, defaultValue: true },
  journalEntryCode: { type: DataTypes.STRING, allowNull: true }
});

// [10.1] Controles de Tesorería: Cajas y Fondos Fijos (Caja General y Caja Chica)
const CashDesk = sequelize.define('CashDesk', {
  code: { type: DataTypes.STRING, unique: true, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  type: { type: DataTypes.STRING, defaultValue: 'Caja Chica' }, // 'Caja General', 'Caja Chica'
  currency: { type: DataTypes.STRING, defaultValue: 'USD' },
  authorizedFund: { type: DataTypes.FLOAT, defaultValue: 500 },
  currentBalance: { type: DataTypes.FLOAT, defaultValue: 500 },
  pendingVouchers: { type: DataTypes.FLOAT, defaultValue: 0 },
  responsible: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: 'Abierta' }, // 'Abierta', 'Cuadrada', 'Arqueo Pendiente', 'Cerrada'
  lastAuditDate: { type: DataTypes.STRING }
});

const CashAudit = sequelize.define('CashAudit', {
  auditCode: { type: DataTypes.STRING, unique: true, allowNull: false },
  cashDeskCode: { type: DataTypes.STRING, allowNull: false },
  auditDate: { type: DataTypes.STRING, allowNull: false },
  physicalCashCounted: { type: DataTypes.FLOAT, defaultValue: 0 },
  vouchersCounted: { type: DataTypes.FLOAT, defaultValue: 0 },
  totalCounted: { type: DataTypes.FLOAT, defaultValue: 0 },
  systemExpected: { type: DataTypes.FLOAT, defaultValue: 0 },
  difference: { type: DataTypes.FLOAT, defaultValue: 0 },
  resultStatus: { type: DataTypes.STRING, defaultValue: 'Cuadrada' }, // 'Cuadrada', 'Sobrante', 'Faltante'
  auditedBy: { type: DataTypes.STRING, defaultValue: 'Auditoría Interna' },
  notes: { type: DataTypes.STRING }
});

// [10.2] Controles de Tesorería: Conciliación Bancaria Mensual
const BankReconciliationItem = sequelize.define('BankReconciliationItem', {
  itemCode: { type: DataTypes.STRING, unique: true, allowNull: false },
  bankCode: { type: DataTypes.STRING, allowNull: false },
  period: { type: DataTypes.STRING, allowNull: false },
  date: { type: DataTypes.STRING, allowNull: false },
  concept: { type: DataTypes.STRING, allowNull: false },
  reference: { type: DataTypes.STRING, allowNull: false },
  type: { type: DataTypes.STRING, allowNull: false }, // 'Cheque Flotante', 'Depósito en Tránsito', 'Comisión Bancaria'
  amount: { type: DataTypes.FLOAT, defaultValue: 0 },
  origin: { type: DataTypes.STRING, defaultValue: 'Libro ERP' }, // 'Libro ERP', 'Extracto Bancario'
  status: { type: DataTypes.STRING, defaultValue: 'Pendiente' }, // 'Conciliado', 'Pendiente'
  reconciledAt: { type: DataTypes.STRING, allowNull: true }
});

// [10.3] Controles Internos: Cierres Diarios y Periódicos (Finanzas & Administración)
const InternalClosure = sequelize.define('InternalClosure', {
  closeCode: { type: DataTypes.STRING, unique: true, allowNull: false },
  closeType: { type: DataTypes.STRING, allowNull: false }, // 'COBROS_DIARIO', 'PAGOS_DIARIO', 'COMPRAS_PERIODO', 'CAJA_GENERAL', 'CONTABLE_MENSUAL'
  title: { type: DataTypes.STRING, allowNull: false },
  periodOrDate: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: 'Pendiente' }, // 'Cerrado', 'Pendiente', 'Conciliado'
  totalAmount: { type: DataTypes.FLOAT, defaultValue: 0 },
  recordsCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  closedBy: { type: DataTypes.STRING, defaultValue: 'Dirección Financiera' },
  closedAt: { type: DataTypes.STRING, allowNull: true },
  details: { type: DataTypes.STRING },
  cryptographicHash: { type: DataTypes.STRING, allowNull: true }
});

// [11] NyTEX Activos Fijos: Padrón de Bienes y Depreciación Fiscal/Contable
const FixedAsset = sequelize.define('FixedAsset', {
  assetCode: { type: DataTypes.STRING, unique: true, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  category: { type: DataTypes.STRING, defaultValue: 'Maquinaria & Equipo Fabril' }, // 'Maquinaria & Equipo Fabril', 'Vehículos', 'Equipo de Cómputo', 'Mobiliario'
  acquisitionDate: { type: DataTypes.STRING, allowNull: false },
  acquisitionCost: { type: DataTypes.FLOAT, defaultValue: 0 },
  usefulLifeYears: { type: DataTypes.INTEGER, defaultValue: 10 },
  depreciationRateAnnual: { type: DataTypes.FLOAT, defaultValue: 10 }, // 10% anual
  accumulatedDepreciation: { type: DataTypes.FLOAT, defaultValue: 0 },
  bookValue: { type: DataTypes.FLOAT, defaultValue: 0 },
  assignedTo: { type: DataTypes.STRING, defaultValue: 'Planta Principal' },
  status: { type: DataTypes.STRING, defaultValue: 'En Operación' } // 'En Operación', 'En Mantenimiento', 'Depreciado'
});

// [12] NyTEX Contabilidad: Motor de Pólizas en Tiempo Real y Balanza
const JournalEntry = sequelize.define('JournalEntry', {
  entryCode: { type: DataTypes.STRING, unique: true, allowNull: false },
  type: { type: DataTypes.STRING, defaultValue: 'Diario' }, // 'Ingreso', 'Egreso', 'Diario'
  date: { type: DataTypes.STRING },
  concept: { type: DataTypes.STRING, allowNull: false },
  originModule: { type: DataTypes.STRING, defaultValue: 'Contabilidad' }, // 'CxC', 'CxP', 'Tesorería', 'Activos Fijos', 'Ventas', 'Manual'
  originReference: { type: DataTypes.STRING, allowNull: true },
  lines: { type: DataTypes.JSON, defaultValue: [] }, // [{ accountCode, accountName, debit, credit }]
  totalDebit: { type: DataTypes.FLOAT, defaultValue: 0 },
  totalCredit: { type: DataTypes.FLOAT, defaultValue: 0 },
  status: { type: DataTypes.STRING, defaultValue: 'Cuadrada' }
});

// Helper de Generación Automática de Pólizas Contables
async function createAutoJournalEntry({ type, concept, originModule, originReference, lines }) {
  const count = await JournalEntry.count();
  const entryCode = `POL-2026-${String(count + 1).padStart(4, '0')}`;
  const totalDebit = lines.reduce((sum, l) => sum + (l.debit || 0), 0);
  const totalCredit = lines.reduce((sum, l) => sum + (l.credit || 0), 0);

  const entry = await JournalEntry.create({
    entryCode,
    type,
    date: new Date().toISOString().split('T')[0],
    concept,
    originModule,
    originReference,
    lines,
    totalDebit: Math.round(totalDebit * 100) / 100,
    totalCredit: Math.round(totalCredit * 100) / 100,
    status: Math.abs(totalDebit - totalCredit) < 0.01 ? 'Cuadrada' : 'Descuadrada'
  });
  return entry;
}

// =========================================================================
// --- MODELOS DEL CIRCUITO DE TALENTO HUMANO Y NÓMINA ([13] RRHH & [14] NÓMINA) ---
// =========================================================================

// [13] NyTEX RRHH: Padrón de Colaboradores e Historial de Personal
const Employee = sequelize.define('Employee', {
  employeeCode: { type: DataTypes.STRING, unique: true, allowNull: false },
  fullName: { type: DataTypes.STRING, allowNull: false },
  rfc: { type: DataTypes.STRING, allowNull: false },
  curp: { type: DataTypes.STRING },
  nss: { type: DataTypes.STRING, allowNull: false },
  department: { type: DataTypes.STRING, defaultValue: 'Producción Fabril' }, // 'Producción Fabril', 'Logística & WMS', 'Ventas & Comercial', 'Administración & Finanzas'
  jobTitle: { type: DataTypes.STRING, allowNull: false },
  contractType: { type: DataTypes.STRING, defaultValue: 'Tiempo Indeterminado' },
  dailySalary: { type: DataTypes.FLOAT, defaultValue: 450 }, // SBD (Salario Base Diario)
  integratedDailySalary: { type: DataTypes.FLOAT, defaultValue: 472.5 }, // SDI (Salario Diario Integrado con factor de prestaciones)
  monthlySalary: { type: DataTypes.FLOAT, defaultValue: 13500 },
  bankName: { type: DataTypes.STRING, defaultValue: 'Banorte' },
  bankAccount: { type: DataTypes.STRING, defaultValue: '072910294411' }, // Cuenta / CLABE
  hireDate: { type: DataTypes.STRING, defaultValue: '2024-01-15' },
  status: { type: DataTypes.STRING, defaultValue: 'Activo' }, // 'Activo', 'Incapacidad', 'Vacaciones', 'Baja'
  avatar: { type: DataTypes.STRING, defaultValue: '👤' }
});

// Incidencias de Asistencia (Faltas, Horas Extra, Retardos, Incapacidades)
const AttendanceIncident = sequelize.define('AttendanceIncident', {
  incidentCode: { type: DataTypes.STRING, unique: true, allowNull: false },
  employeeCode: { type: DataTypes.STRING, allowNull: false },
  employeeName: { type: DataTypes.STRING, allowNull: false },
  date: { type: DataTypes.STRING, allowNull: false },
  type: { type: DataTypes.STRING, allowNull: false }, // 'Falta Injustificada', 'Falta Justificada', 'Horas Extra Dobles', 'Horas Extra Triples', 'Retardo', 'Incapacidad IMSS', 'Vacaciones'
  hours: { type: DataTypes.FLOAT, defaultValue: 0 },
  multiplier: { type: DataTypes.FLOAT, defaultValue: 1 },
  notes: { type: DataTypes.STRING },
  status: { type: DataTypes.STRING, defaultValue: 'Aprobada' }, // 'Aprobada', 'Pendiente', 'Rechazada'
  periodCode: { type: DataTypes.STRING, defaultValue: 'NOM-2026-Q18' }
});

// [14] NyTEX Nómina: Periodo de Nómina Quincenal Procesada
const PayrollRun = sequelize.define('PayrollRun', {
  periodCode: { type: DataTypes.STRING, unique: true, allowNull: false },
  periodName: { type: DataTypes.STRING, allowNull: false },
  periodType: { type: DataTypes.STRING, defaultValue: 'Quincenal' },
  startDate: { type: DataTypes.STRING, allowNull: false },
  endDate: { type: DataTypes.STRING, allowNull: false },
  payDate: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: 'Borrador' }, // 'Borrador', 'Calculada', 'Dispersada', 'Contabilizada'
  employeesCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  totalGross: { type: DataTypes.FLOAT, defaultValue: 0 },
  totalOvertime: { type: DataTypes.FLOAT, defaultValue: 0 },
  totalBonuses: { type: DataTypes.FLOAT, defaultValue: 0 },
  totalAbsenceDeductions: { type: DataTypes.FLOAT, defaultValue: 0 },
  totalIsr: { type: DataTypes.FLOAT, defaultValue: 0 },
  totalImssWorker: { type: DataTypes.FLOAT, defaultValue: 0 },
  totalDeductions: { type: DataTypes.FLOAT, defaultValue: 0 },
  totalNet: { type: DataTypes.FLOAT, defaultValue: 0 },
  totalEmployerImss: { type: DataTypes.FLOAT, defaultValue: 0 },
  totalEmployerInfonavit: { type: DataTypes.FLOAT, defaultValue: 0 },
  totalStateTax: { type: DataTypes.FLOAT, defaultValue: 0 }, // 3% ISN
  totalCompanyCost: { type: DataTypes.FLOAT, defaultValue: 0 },
  bankSourceAccount: { type: DataTypes.STRING, defaultValue: 'BCO-BNTE-02' },
  disbursementTxCode: { type: DataTypes.STRING, allowNull: true },
  journalEntryCode: { type: DataTypes.STRING, allowNull: true },
  breakdown: { type: DataTypes.JSON, defaultValue: [] }
});

// =========================================================================
// --- MODELOS DEL CIRCUITO DE GOBERNANZA & MINERÍA ([15] PROCESS SUITE & [16] PROCESS MINING) ---
// =========================================================================

// [15] NyTEX ProcessSuite: Modelos de Procesos BPMN 2.0 y Workflows
const BpmnProcess = sequelize.define('BpmnProcess', {
  processCode: { type: DataTypes.STRING, unique: true, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  category: { type: DataTypes.STRING, defaultValue: 'Compras & Abastecimiento' }, // 'Compras & Abastecimiento', 'Ventas & Crédito', 'Producción & Calidad', 'Talento & Nómina'
  version: { type: DataTypes.STRING, defaultValue: 'v2.1' },
  description: { type: DataTypes.STRING },
  slaHours: { type: DataTypes.INTEGER, defaultValue: 24 },
  activeInstances: { type: DataTypes.INTEGER, defaultValue: 0 },
  steps: { type: DataTypes.JSON, defaultValue: [] },
  status: { type: DataTypes.STRING, defaultValue: 'Desplegado' }, // 'Desplegado', 'Borrador', 'Archivado'
  xml: { type: DataTypes.TEXT, allowNull: true }
});

// [15] Tareas de Workflow e Instancias Pendientes de Aprobación
const ProcessTask = sequelize.define('ProcessTask', {
  taskCode: { type: DataTypes.STRING, unique: true, allowNull: false },
  processCode: { type: DataTypes.STRING, allowNull: false },
  processName: { type: DataTypes.STRING, allowNull: false },
  title: { type: DataTypes.STRING, allowNull: false },
  referenceCode: { type: DataTypes.STRING, allowNull: false }, // PO-2026-0001, PED-2026-001, etc.
  requester: { type: DataTypes.STRING, defaultValue: 'Laura Vega (Compras)' },
  assignedRole: { type: DataTypes.STRING, defaultValue: 'Director de Finanzas' },
  priority: { type: DataTypes.STRING, defaultValue: 'Media' }, // 'Baja', 'Media', 'Alta', 'Crítica'
  amount: { type: DataTypes.FLOAT, defaultValue: 0 },
  deadline: { type: DataTypes.STRING },
  status: { type: DataTypes.STRING, defaultValue: 'Pendiente' }, // 'Pendiente', 'Aprobada', 'Rechazada'
  resolutionNotes: { type: DataTypes.STRING, allowNull: true },
  resolvedAt: { type: DataTypes.STRING, allowNull: true }
});

// [16] NyTEX ProcessMining: Registro de Eventos (Event Logs) para Minería y Cuellos de Botella
const ProcessEventLog = sequelize.define('ProcessEventLog', {
  caseId: { type: DataTypes.STRING, allowNull: false }, // Identificador único de instancia (ej: PED-2026-001)
  processName: { type: DataTypes.STRING, allowNull: false }, // 'Order-to-Cash (O2C)', 'Procure-to-Pay (P2P)'
  activity: { type: DataTypes.STRING, allowNull: false }, // '1. Cotización Registrada', '2. Pedido Aprobado', etc.
  stageOrder: { type: DataTypes.INTEGER, defaultValue: 1 },
  timestamp: { type: DataTypes.STRING, allowNull: false },
  durationMinutes: { type: DataTypes.INTEGER, defaultValue: 30 },
  resource: { type: DataTypes.STRING, defaultValue: 'Operador del Sistema' },
  status: { type: DataTypes.STRING, defaultValue: 'Completado' }, // 'Completado', 'Retrasado', 'Re-trabajado'
  isBottleneck: { type: DataTypes.BOOLEAN, defaultValue: false }
});

// [26] NyTEX Configuración: Configuración Corporativa y Parámetros Fiscales
const CompanyConfig = sequelize.define('CompanyConfig', {
  companyName: { type: DataTypes.STRING, defaultValue: 'NyTEX Textil de Centroamérica S.A. de C.V.' },
  country: { type: DataTypes.STRING, defaultValue: 'El Salvador' },
  taxAuthority: { type: DataTypes.STRING, defaultValue: 'Ministerio de Hacienda (MH)' },
  electronicDocType: { type: DataTypes.STRING, defaultValue: 'DTE (Factura y Crédito Fiscal Electrónico)' },
  rfc: { type: DataTypes.STRING, defaultValue: '0614-180612-102-4' }, // Formato NIT El Salvador / Multi-país
  taxRegime: { type: DataTypes.STRING, defaultValue: 'Régimen General / Mediano Contribuyente' },
  fiscalAddress: { type: DataTypes.STRING, defaultValue: 'Km 10.5 Carretera Panamericana, Complejo Industrial, San Salvador, El Salvador' },
  baseCurrency: { type: DataTypes.STRING, defaultValue: 'USD' },
  exchangeRateUsd: { type: DataTypes.FLOAT, defaultValue: 1.00 },
  exchangeRateEur: { type: DataTypes.FLOAT, defaultValue: 1.08 },
  vatRate: { type: DataTypes.FLOAT, defaultValue: 13.0 },
  fiscalCertificatesStatus: { type: DataTypes.STRING, defaultValue: 'Vigente (Firma Electrónica DTE / Homologado)' },
  auditMode: { type: DataTypes.STRING, defaultValue: 'Enforced (Registro Inmutable)' },
  activeSecurityPolicy: { type: DataTypes.STRING, defaultValue: '2FA Obligatorio + Bloqueo tras 3 intentos' }
});

// [26] Bitácora de Auditoría Global (Audit Log)
const AuditLog = sequelize.define('AuditLog', {
  timestamp: { type: DataTypes.STRING, allowNull: false },
  action: { type: DataTypes.STRING, allowNull: false },
  module: { type: DataTypes.STRING, allowNull: false },
  user: { type: DataTypes.STRING, defaultValue: 'admin@consultores-nyt.com' },
  ipAddress: { type: DataTypes.STRING, defaultValue: '192.168.1.105' },
  details: { type: DataTypes.STRING, allowNull: false },
  severity: { type: DataTypes.STRING, defaultValue: 'INFO' } // 'INFO', 'WARNING', 'CRITICAL'
});

// ==========================================
// --- ENDPOINTS COMUNES Y DE AUTENTICACIÓN ---
// ==========================================

const ALL_26_MODULES = [
  'Ventas', 'CRM', 'Inventario', 'Compras', 'Produccion',
  'Contabilidad', 'CxC', 'CxP', 'Tesoreria', 'ActivosFijos',
  'Logistica', 'RRHH', 'Nomina', 'ProcessSuite', 'ProcessMining',
  'BusinessPartners', 'BIyReportes', 'Configuracion', 'WMS',
  'Dashboards', 'BI', 'BigData', 'MineriaDatos', 'IA', 'Predictivos', 'Planeacion'
];

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, role, phaseId } = req.body;
    let subscriptions = [];
    
    if (role === 'Admin' || role === 'Partner') {
      subscriptions = [...ALL_26_MODULES];
    } else if (role === 'Client') {
      const p1 = ['Ventas', 'Inventario', 'Compras', 'Contabilidad', 'CxC', 'CxP', 'Tesoreria'];
      const p2 = [...p1, 'CRM', 'Rop', 'Produccion', 'Logistica', 'RRHH', 'Nomina', 'ProcessSuite', 'ProcessMining', 'WMS', 'Dashboards'];
      const p3 = [...p2, 'ActivosFijos', 'BIyReportes', 'BigData', 'BI', 'Planeacion'];
      const pVal = parseInt(phaseId, 10) || 1;
      if (pVal === 1) subscriptions = p1;
      else if (pVal === 2) subscriptions = p2;
      else if (pVal === 3) subscriptions = p3;
      else subscriptions = [...ALL_26_MODULES];
    }

    const [user] = await User.findOrCreate({
      where: { email },
      defaults: {
        name: role === 'Admin' ? 'Super Admin' : role === 'Partner' ? 'Distribuidor Partner' : 'Cliente Final',
        subscriptions,
        customQuoteAmount: null,
        role
      }
    });
    user.role = role;
    user.subscriptions = subscriptions;
    await user.save();
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/auth/me', async (req, res) => {
  try {
    const email = req.query.email || 'partner@nytex.com';
    const allModulesList = [
      'Ventas', 'CRM', 'Inventario', 'Compras', 'Produccion',
      'Contabilidad', 'CxC', 'CxP', 'Tesoreria', 'ActivosFijos',
      'Logistica', 'RRHH', 'Nomina', 'ProcessSuite', 'ProcessMining',
      'BusinessPartners', 'BIyReportes', 'Configuracion', 'WMS',
      'Dashboards', 'BI', 'BigData', 'MineriaDatos', 'IA',
      'Predictivos', 'Planeacion'
    ];
    let user = await User.findOne({ where: { email } });
    if (user) {
      user.subscriptions = allModulesList;
      await user.save();
      res.json(user);
    } else {
      user = await User.create({
        name: 'Distribuidor Partner',
        email,
        subscriptions: allModulesList,
        role: 'Partner'
      });
      res.json(user);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/business-partners', async (req, res) => {
  try {
    const partners = await BusinessPartner.findAll();
    res.json(partners);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/business-partners', async (req, res) => {
  try {
    const newPartner = await BusinessPartner.create(req.body);
    res.status(201).json(newPartner);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ==========================================
// --- ENDPOINTS CIRCUITO COMERCIAL (O2C) ---
// ==========================================

app.get('/api/circuit/comercial/summary', async (req, res) => {
  try {
    const orders = await SaleOrder.findAll();
    const wmsTasks = await WmsTask.findAll();
    const shipments = await Shipment.findAll();
    const receivables = await AccountReceivable.findAll();

    const totalOrders = orders.length;
    const totalSalesAmount = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const pendingWms = wmsTasks.filter(t => t.status !== 'Listo para Despacho').length;
    const inTransitShipments = shipments.filter(s => s.status === 'En Tránsito' || s.status === 'En Reparto').length;
    const deliveredShipments = shipments.filter(s => s.status === 'Entregado').length;
    const totalReceivableBalance = receivables.filter(r => r.status !== 'Pagada').reduce((sum, r) => sum + (r.balance || 0), 0);
    const overdueReceivables = receivables.filter(r => r.status === 'Vencida').length;

    const pipeline = orders.map(order => {
      const wms = wmsTasks.find(w => w.orderCode === order.orderCode);
      const ship = shipments.find(s => s.orderCode === order.orderCode);
      const cxc = receivables.find(c => c.orderCode === order.orderCode);
      return {
        orderCode: order.orderCode,
        clientName: order.clientName,
        total: order.total,
        orderStatus: order.status,
        wmsStatus: wms ? wms.status : 'No Iniciado',
        wmsCode: wms ? wms.taskCode : null,
        shipmentStatus: ship ? ship.status : 'No Asignado',
        trackingCode: ship ? ship.trackingCode : null,
        invoiceCode: order.invoiceCode,
        cxcStatus: cxc ? cxc.status : (order.isInvoiced ? 'Facturado' : 'Pendiente Facturar'),
        cxcBalance: cxc ? cxc.balance : 0
      };
    });

    res.json({
      metrics: {
        totalOrders,
        totalSalesAmount,
        pendingWms,
        inTransitShipments,
        deliveredShipments,
        totalReceivableBalance,
        overdueReceivables
      },
      pipeline
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/ventas/orders', async (req, res) => {
  try {
    const orders = await SaleOrder.findAll({ order: [['id', 'DESC']] });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/ventas/orders', async (req, res) => {
  try {
    const { clientCode, clientName, deliveryAddress, items, paymentTerms } = req.body;
    const count = await SaleOrder.count();
    const orderCode = `SO-2026-${String(count + 1).padStart(3, '0')}`;

    let subtotal = 0;
    const formattedItems = (items || []).map(item => {
      const itemSub = (item.quantity || 1) * (item.unitPrice || 0);
      subtotal += itemSub;
      return { ...item, subtotal: itemSub };
    });

    const tax = Math.round(subtotal * 0.13 * 100) / 100;
    const total = Math.round((subtotal + tax) * 100) / 100;

    const newOrder = await SaleOrder.create({
      orderCode,
      clientCode: clientCode || 'BP-001',
      clientName: clientName || 'Cliente General',
      deliveryAddress: deliveryAddress || 'Dirección de Entrega',
      items: formattedItems,
      subtotal,
      tax,
      total,
      paymentTerms: paymentTerms || 'Crédito 30 días',
      status: 'Cotización',
      isInvoiced: false
    });

    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/ventas/orders/:orderCode/confirm', async (req, res) => {
  try {
    const { orderCode } = req.params;
    const order = await SaleOrder.findOne({ where: { orderCode } });
    if (!order) return res.status(404).json({ error: 'Orden no encontrada' });

    order.status = 'En Preparación WMS';
    await order.save();

    const wmsCount = await WmsTask.count();
    const taskCode = `WMS-PK-${String(wmsCount + 1).padStart(3, '0')}`;
    
    const [wmsTask] = await WmsTask.findOrCreate({
      where: { orderCode },
      defaults: {
        taskCode,
        orderCode,
        clientName: order.clientName,
        warehouse: 'Bodega Central Monterrey',
        zone: 'Zona A - Racks 02-05',
        items: order.items,
        operator: 'Carlos Almacenista',
        status: 'Pendiente'
      }
    });

    res.json({
      success: true,
      message: `Orden ${orderCode} confirmada exitosamente. Se generó la orden de preparación ${wmsTask.taskCode} en WMS.`,
      order,
      wmsTask
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Facturación de Venta: Genera CxC Y Póliza Contable de Diario/Ingreso Estimado
app.post('/api/ventas/orders/:orderCode/invoice', async (req, res) => {
  try {
    const { orderCode } = req.params;
    const order = await SaleOrder.findOne({ where: { orderCode } });
    if (!order) return res.status(404).json({ error: 'Orden no encontrada' });

    if (order.isInvoiced) {
      return res.status(400).json({ error: 'Esta orden ya fue facturada con folio ' + order.invoiceCode });
    }

    const cxcCount = await AccountReceivable.count();
    const invoiceCode = `FAC-2026-${String(cxcCount + 1).padStart(4, '0')}`;

    order.isInvoiced = true;
    order.invoiceCode = invoiceCode;
    await order.save();

    const today = new Date();
    const dueDate = new Date();
    dueDate.setDate(today.getDate() + 30);

    const newReceivable = await AccountReceivable.create({
      invoiceCode,
      orderCode,
      clientCode: order.clientCode,
      clientName: order.clientName,
      issueDate: today.toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
      totalAmount: order.total,
      paidAmount: 0,
      balance: order.total,
      creditDays: 30,
      status: 'Al Corriente',
      paymentsLog: []
    });

    const bp = await BusinessPartner.findOne({ where: { code: order.clientCode } });
    if (bp) {
      bp.balance = (bp.balance || 0) + order.total;
      await bp.save();
    }

    // AUTOMATIZACIÓN CONTABLE: Póliza de Provisión de Venta (Diario)
    const autoEntry = await createAutoJournalEntry({
      type: 'Diario',
      concept: `Provisión de Venta s/ Factura ${invoiceCode} - ${order.clientName}`,
      originModule: 'Ventas',
      originReference: invoiceCode,
      lines: [
        { accountCode: '1105-01', accountName: 'Clientes Nacionales (CxC)', debit: order.total, credit: 0 },
        { accountCode: '4101-01', accountName: 'Ventas de Productos Terminados', debit: 0, credit: order.subtotal },
        { accountCode: '2108-01', accountName: 'IVA Trasladado por Cobrar (13%)', debit: 0, credit: order.tax }
      ]
    });

    res.json({
      success: true,
      message: `Factura ${invoiceCode} emitida exitosamente. Se integró a CxC ($${order.total.toLocaleString()} USD) y se generó la Póliza Contable ${autoEntry.entryCode}.`,
      order,
      invoice: newReceivable,
      journalEntry: autoEntry
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/wms/tasks', async (req, res) => {
  try {
    const tasks = await WmsTask.findAll({ order: [['id', 'DESC']] });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/wms/tasks/:taskCode/advance', async (req, res) => {
  try {
    const { taskCode } = req.params;
    const task = await WmsTask.findOne({ where: { taskCode } });
    if (!task) return res.status(404).json({ error: 'Tarea WMS no encontrada' });

    let nextStatus = 'En Picking';
    if (task.status === 'Pendiente') nextStatus = 'En Picking';
    else if (task.status === 'En Picking') nextStatus = 'Empacado';
    else if (task.status === 'Empacado') nextStatus = 'Listo para Despacho';

    task.status = nextStatus;
    await task.save();

    let createdShipment = null;
    if (nextStatus === 'Listo para Despacho') {
      const order = await SaleOrder.findOne({ where: { orderCode: task.orderCode } });
      if (order) {
        order.status = 'Listo para Despacho';
        await order.save();
      }

      const shipCount = await Shipment.count();
      const trackingCode = `TRK-NYT-${String(shipCount + 101).padStart(4, '0')}`;
      
      const [shipment] = await Shipment.findOrCreate({
        where: { orderCode: task.orderCode },
        defaults: {
          trackingCode,
          orderCode: task.orderCode,
          clientName: task.clientName,
          destination: (order && order.deliveryAddress) || 'Dirección de Entrega Cliente',
          carrier: 'Transportes Express del Norte',
          driver: 'Roberto Méndez',
          vehiclePlate: 'NL-849-TX',
          estimatedDelivery: '24 a 48 hrs hábiles',
          dispatchedAt: new Date().toISOString().split('T')[0],
          status: 'Programado'
        }
      });
      createdShipment = shipment;
    }

    res.json({
      success: true,
      message: `Tarea ${taskCode} actualizada a '${nextStatus}'.` + (createdShipment ? ` Generada guía de logística ${createdShipment.trackingCode}.` : ''),
      task,
      shipment: createdShipment
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/logistica/shipments', async (req, res) => {
  try {
    const shipments = await Shipment.findAll({ order: [['id', 'DESC']] });
    res.json(shipments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/logistica/shipments/:trackingCode/advance', async (req, res) => {
  try {
    const { trackingCode } = req.params;
    const shipment = await Shipment.findOne({ where: { trackingCode } });
    if (!shipment) return res.status(404).json({ error: 'Envío no encontrado' });

    let nextStatus = 'En Tránsito';
    if (shipment.status === 'Programado') nextStatus = 'En Tránsito';
    else if (shipment.status === 'En Tránsito') nextStatus = 'En Reparto';
    else if (shipment.status === 'En Reparto') nextStatus = 'Entregado';

    shipment.status = nextStatus;
    if (nextStatus === 'Entregado') {
      shipment.deliveredAt = new Date().toISOString();
      const order = await SaleOrder.findOne({ where: { orderCode: shipment.orderCode } });
      if (order) {
        order.status = 'Entregado';
        await order.save();
      }
    }
    await shipment.save();

    res.json({
      success: true,
      message: `Envío ${trackingCode} actualizado a '${nextStatus}'.`,
      shipment
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/cxc/invoices', async (req, res) => {
  try {
    const invoices = await AccountReceivable.findAll({ order: [['id', 'DESC']] });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Emisión Directa de Factura de Venta desde CxC
app.post('/api/cxc/invoices', async (req, res) => {
  try {
    const { clientCode, clientName, concept, subtotal, paymentTerms = 'Crédito 30 días' } = req.body;
    const sub = parseFloat(subtotal);
    if (isNaN(sub) || sub <= 0) {
      return res.status(400).json({ error: 'El subtotal debe ser un número mayor a cero' });
    }
    const tax = Math.round(sub * 0.13 * 100) / 100;
    const total = Math.round((sub + tax) * 100) / 100;

    const cxcCount = await AccountReceivable.count();
    const invoiceCode = `FAC-2026-${String(cxcCount + 1).padStart(4, '0')}`;
    const orderCode = `DIR-${String(cxcCount + 1).padStart(4, '0')}`;

    const today = new Date();
    const dueDate = new Date();
    dueDate.setDate(today.getDate() + 30);

    const newReceivable = await AccountReceivable.create({
      invoiceCode,
      orderCode,
      clientCode: clientCode || 'CLI-001',
      clientName: clientName || 'Cliente General',
      issueDate: today.toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
      totalAmount: total,
      paidAmount: 0,
      balance: total,
      creditDays: 30,
      status: 'Al Corriente',
      paymentsLog: []
    });

    const bp = await BusinessPartner.findOne({ where: { code: clientCode } });
    if (bp) {
      bp.balance = (bp.balance || 0) + total;
      await bp.save();
    }

    const autoEntry = await createAutoJournalEntry({
      type: 'Diario',
      concept: `Provisión de Venta s/ Factura Directa ${invoiceCode} - ${clientName || 'Cliente'} (${concept || 'Facturación Directa'})`,
      originModule: 'CxC',
      originReference: invoiceCode,
      lines: [
        { accountCode: '1105-01', accountName: 'Clientes Nacionales (CxC)', debit: total, credit: 0 },
        { accountCode: '4101-01', accountName: 'Ventas de Productos Terminados', debit: 0, credit: sub },
        { accountCode: '2108-01', accountName: 'IVA Trasladado por Cobrar (13%)', debit: 0, credit: tax }
      ]
    });

    res.json({
      success: true,
      message: `Factura ${invoiceCode} emitida exitosamente por $${total.toLocaleString()} USD. Póliza Contable ${autoEntry.entryCode} generada.`,
      invoice: newReceivable,
      journalEntry: autoEntry
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cobranza CxC: Aplica cobro, actualiza saldo y DISPARA AUTOMÁTICAMENTE Tesorería y Contabilidad
app.post('/api/cxc/invoices/:invoiceCode/pay', async (req, res) => {
  try {
    const { invoiceCode } = req.params;
    const { amount, method = 'Transferencia SPEI', reference = 'REF-PAGO-001' } = req.body;
    const payAmount = parseFloat(amount);

    if (isNaN(payAmount) || payAmount <= 0) {
      return res.status(400).json({ error: 'El monto de pago debe ser mayor a cero' });
    }

    const invoice = await AccountReceivable.findOne({ where: { invoiceCode } });
    if (!invoice) return res.status(404).json({ error: 'Cuenta por cobrar no encontrada' });

    if (invoice.balance <= 0) {
      return res.status(400).json({ error: 'Esta factura ya está completamente pagada' });
    }

    const appliedAmount = Math.min(payAmount, invoice.balance);
    invoice.paidAmount = Math.round((invoice.paidAmount + appliedAmount) * 100) / 100;
    invoice.balance = Math.round((invoice.totalAmount - invoice.paidAmount) * 100) / 100;

    if (invoice.balance <= 0) {
      invoice.status = 'Pagada';
      invoice.balance = 0;
    }

    const currentLogs = invoice.paymentsLog || [];
    currentLogs.push({
      date: new Date().toISOString(),
      amount: appliedAmount,
      method,
      reference
    });
    invoice.paymentsLog = currentLogs;
    await invoice.save();

    // 1. Actualizar balance de Business Partner
    const bp = await BusinessPartner.findOne({ where: { code: invoice.clientCode } });
    if (bp) {
      bp.balance = Math.max(0, Math.round(((bp.balance || 0) - appliedAmount) * 100) / 100);
      await bp.save();
    }

    // 2. AUTOMATIZACIÓN EN TESORERÍA: Ingreso a cuenta bancaria
    const bank = await BankAccount.findOne();
    if (bank) {
      bank.balance = Math.round((bank.balance + appliedAmount) * 100) / 100;
      await bank.save();

      const txCount = await BankTransaction.count();
      await BankTransaction.create({
        txCode: `TX-ING-${String(txCount + 1).padStart(4, '0')}`,
        bankCode: bank.bankCode,
        type: 'Ingreso',
        category: 'Cobranza Clientes',
        amount: appliedAmount,
        date: new Date().toISOString().split('T')[0],
        concept: `Cobro Factura ${invoiceCode} - ${invoice.clientName}`,
        reference,
        reconciled: true
      });
    }

    // 3. AUTOMATIZACIÓN CONTABLE: Póliza de Ingreso
    const autoEntry = await createAutoJournalEntry({
      type: 'Ingreso',
      concept: `Ingreso Bancario s/ Cobro Factura ${invoiceCode} - ${invoice.clientName}`,
      originModule: 'CxC',
      originReference: invoiceCode,
      lines: [
        { accountCode: '1101-01', accountName: 'Bancos Nacionales (BBVA)', debit: appliedAmount, credit: 0 },
        { accountCode: '1105-01', accountName: 'Clientes Nacionales (CxC)', debit: 0, credit: appliedAmount }
      ]
    });

    res.json({
      success: true,
      message: `Cobro de $${appliedAmount.toLocaleString()} USD registrado. Saldo restante: $${invoice.balance.toLocaleString()} USD. Ingresado a Tesorería y generada Póliza Contable ${autoEntry.entryCode}.`,
      invoice,
      journalEntry: autoEntry
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =========================================================================
// --- ENDPOINTS CIRCUITO DE COMPRAS, INVENTARIO Y PRODUCCIÓN (P2P & M) ---
// =========================================================================

app.get('/api/circuit/produccion/summary', async (req, res) => {
  try {
    const items = await InventoryItem.findAll();
    const poList = await PurchaseOrder.findAll();
    const opList = await ProductionOrder.findAll();
    const payables = await AccountPayable.findAll();

    const totalRawMaterials = items.filter(i => i.category === 'Materia Prima' || i.category === 'Insumo Químico').length;
    const lowStockAlerts = items.filter(i => i.stock <= i.minStock).length;
    const totalFinishedProducts = items.filter(i => i.category === 'Producto Terminado').reduce((sum, i) => sum + (i.stock || 0), 0);
    const activePurchaseOrders = poList.filter(p => p.status !== 'Recibida en Almacén').length;
    const inProcessProduction = opList.filter(o => o.status === 'En Proceso de Fabricación').length;
    const totalPayableBalance = payables.filter(p => p.status !== 'Pagada').reduce((sum, p) => sum + (p.balance || 0), 0);

    res.json({
      metrics: {
        totalRawMaterials,
        lowStockAlerts,
        totalFinishedProducts,
        activePurchaseOrders,
        inProcessProduction,
        totalPayableBalance
      },
      lowStockItems: items.filter(i => i.stock <= i.minStock),
      activeProductionOrders: opList
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/inventario/items', async (req, res) => {
  try {
    const items = await InventoryItem.findAll({ order: [['id', 'ASC']] });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/inventario/items', async (req, res) => {
  try {
    const newItem = await InventoryItem.create(req.body);
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/inventario/items/:id/inbound', async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, reason = 'Ingreso Directo de Almacén' } = req.body;
    const qty = parseFloat(quantity);
    if (isNaN(qty) || qty <= 0) {
      return res.status(400).json({ error: 'La cantidad ingresada debe ser un número mayor a cero' });
    }
    const item = await InventoryItem.findByPk(id);
    if (!item) {
      return res.status(404).json({ error: 'SKU / Material no encontrado en inventario' });
    }

    item.stock = Math.round((item.stock + qty) * 100) / 100;
    item.status = item.stock > item.minStock ? 'Óptimo' : 'Bajo Stock';
    await item.save();

    res.json({
      success: true,
      message: `Se registraron exitosamente +${qty} ${item.unit} al SKU ${item.sku} (${item.name}). Existencia actual: ${item.stock} ${item.unit}. Motivo: ${reason}`,
      item
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Carga Masiva (Batch) de SKUs / Inventario
app.post('/api/inventario/items/batch', async (req, res) => {
  try {
    const { items: newItems } = req.body;
    if (!Array.isArray(newItems) || newItems.length === 0) {
      return res.status(400).json({ error: 'Debe enviar un arreglo de items válido para procesar en batch' });
    }

    let createdCount = 0;
    let updatedCount = 0;

    for (const raw of newItems) {
      if (!raw.sku || !raw.name) continue;
      const cleanSku = String(raw.sku).trim().toUpperCase();
      const stock = parseFloat(raw.stock) || 0;
      const minStock = parseFloat(raw.minStock) || 10;
      const unitCost = parseFloat(raw.unitCost) || 0;
      const status = stock > minStock ? 'Óptimo' : (stock > 0 ? 'Bajo Stock' : 'Agotado');

      const [item, created] = await InventoryItem.findOrCreate({
        where: { sku: cleanSku },
        defaults: {
          sku: cleanSku,
          name: String(raw.name).trim(),
          category: raw.category || 'Materia Prima',
          stock,
          reserved: 0,
          minStock,
          unit: raw.unit || 'kg',
          unitCost,
          warehouse: raw.warehouse || 'Almacén de Materias Primas',
          location: raw.location || 'Rack General',
          status
        }
      });

      if (created) {
        createdCount++;
      } else {
        if (raw.name) item.name = String(raw.name).trim();
        if (raw.category) item.category = raw.category;
        if (raw.stock !== undefined && !isNaN(parseFloat(raw.stock))) item.stock = stock;
        if (raw.minStock !== undefined && !isNaN(parseFloat(raw.minStock))) item.minStock = minStock;
        if (raw.unitCost !== undefined && !isNaN(parseFloat(raw.unitCost))) item.unitCost = unitCost;
        if (raw.unit) item.unit = raw.unit;
        if (raw.warehouse) item.warehouse = raw.warehouse;
        if (raw.location) item.location = raw.location;
        item.status = item.stock > item.minStock ? 'Óptimo' : (item.stock > 0 ? 'Bajo Stock' : 'Agotado');
        await item.save();
        updatedCount++;
      }
    }

    res.json({
      success: true,
      message: `Carga batch procesada con éxito: ${createdCount} nuevos SKUs registrados, ${updatedCount} actualizados.`,
      createdCount,
      updatedCount,
      totalProcessed: createdCount + updatedCount
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/compras/orders', async (req, res) => {
  try {
    const orders = await PurchaseOrder.findAll({ order: [['id', 'DESC']] });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/compras/orders', async (req, res) => {
  try {
    const { vendorCode, vendorName, items, paymentTerms, deliveryDate } = req.body;
    const count = await PurchaseOrder.count();
    const poCode = `PO-2026-${String(count + 1).padStart(3, '0')}`;

    let subtotal = 0;
    const formatted = (items || []).map(it => {
      const sub = (it.quantity || 1) * (it.unitCost || 0);
      subtotal += sub;
      return { ...it, subtotal: sub };
    });
    const tax = Math.round(subtotal * 0.13 * 100) / 100;
    const total = Math.round((subtotal + tax) * 100) / 100;

    const newPO = await PurchaseOrder.create({
      poCode,
      vendorCode: vendorCode || 'BP-003',
      vendorName: vendorName || 'Hilados y Fibras Sintéticas S.A.',
      items: formatted,
      subtotal,
      tax,
      total,
      paymentTerms: paymentTerms || 'Crédito 30 días',
      status: 'Aprobada',
      deliveryDate: deliveryDate || '2026-10-05',
      isBilled: false
    });

    res.status(201).json(newPO);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Recepción en Compras: Actualiza Inventario, crea CxP y genera Póliza de Diario de Provisión
app.post('/api/compras/orders/:poCode/receive', async (req, res) => {
  try {
    const { poCode } = req.params;
    const po = await PurchaseOrder.findOne({ where: { poCode } });
    if (!po) return res.status(404).json({ error: 'Orden de compra no encontrada' });

    if (po.status === 'Recibida en Almacén') {
      return res.status(400).json({ error: 'Esta orden de compra ya fue recibida en almacén' });
    }

    for (const item of (po.items || [])) {
      const invItem = await InventoryItem.findOne({ where: { sku: item.sku } });
      if (invItem) {
        invItem.stock = Math.round((invItem.stock + item.quantity) * 100) / 100;
        invItem.status = invItem.stock > invItem.minStock ? 'Óptimo' : 'Bajo Stock';
        await invItem.save();
      }
    }

    po.status = 'Recibida en Almacén';
    po.isBilled = true;
    const cxpCount = await AccountPayable.count();
    const billCode = `CXP-2026-${String(cxpCount + 1).padStart(3, '0')}`;
    po.invoiceRef = billCode;
    await po.save();

    const today = new Date();
    const dueDate = new Date();
    dueDate.setDate(today.getDate() + 30);

    const newBill = await AccountPayable.create({
      billCode,
      poCode: po.poCode,
      vendorCode: po.vendorCode,
      vendorName: po.vendorName,
      issueDate: today.toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
      totalAmount: po.total,
      paidAmount: 0,
      balance: po.total,
      status: 'Al Corriente',
      paymentsLog: []
    });

    const bp = await BusinessPartner.findOne({ where: { code: po.vendorCode } });
    if (bp) {
      bp.balance = (bp.balance || 0) - po.total;
      await bp.save();
    }

    // AUTOMATIZACIÓN CONTABLE: Póliza de Provisión de Compra / Entrada de Almacén
    const autoEntry = await createAutoJournalEntry({
      type: 'Diario',
      concept: `Entrada Almacén Materia Prima s/ OC ${poCode} - ${po.vendorName}`,
      originModule: 'Compras',
      originReference: poCode,
      lines: [
        { accountCode: '1106-01', accountName: 'Almacén de Materias Primas', debit: po.subtotal, credit: 0 },
        { accountCode: '1108-01', accountName: 'IVA Acreditable Pendiente de Pago', debit: po.tax, credit: 0 },
        { accountCode: '2101-01', accountName: 'Proveedores Nacionales (CxP)', debit: 0, credit: po.total }
      ]
    });

    res.json({
      success: true,
      message: `Recepción confirmada de la orden ${poCode}. Inventario incrementado, pasivo ${billCode} en CxP y Póliza Contable ${autoEntry.entryCode} registrada.`,
      po,
      bill: newBill,
      journalEntry: autoEntry
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/produccion/orders', async (req, res) => {
  try {
    const ops = await ProductionOrder.findAll({ order: [['id', 'DESC']] });
    res.json(ops);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/produccion/orders', async (req, res) => {
  try {
    const { productSku, productName, targetQuantity, unit, bom, workcenter, operator } = req.body;
    const count = await ProductionOrder.count();
    const opCode = `OP-2026-${String(count + 1).padStart(3, '0')}`;

    const newOP = await ProductionOrder.create({
      opCode,
      productSku: productSku || 'PT-TEL-101',
      productName: productName || 'Rollo Tela Gabardina Algodón Peinado',
      targetQuantity: parseFloat(targetQuantity) || 50,
      unit: unit || 'rollos',
      bom: bom || [],
      workcenter: workcenter || 'Telar Circular #3 - Planta 1',
      operator: operator || 'Ing. Supervisor Fabril',
      startDate: new Date().toISOString().split('T')[0],
      scrapsPct: 1.5,
      status: 'Planificada'
    });

    res.status(201).json(newOP);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/produccion/orders/:opCode/start', async (req, res) => {
  try {
    const { opCode } = req.params;
    const op = await ProductionOrder.findOne({ where: { opCode } });
    if (!op) return res.status(404).json({ error: 'Orden de producción no encontrada' });

    if (op.status !== 'Planificada') {
      return res.status(400).json({ error: 'Esta orden ya está en proceso o terminada' });
    }

    const consumedDetails = [];
    let totalCostConsumed = 0;
    for (const b of (op.bom || [])) {
      const required = (b.quantityPerUnit || 1) * op.targetQuantity;
      const inv = await InventoryItem.findOne({ where: { sku: b.sku } });
      if (inv) {
        if (inv.stock < required) {
          return res.status(400).json({ 
            error: `Stock insuficiente de materia prima ${inv.name} (${inv.sku}). Se requieren ${required} ${inv.unit} y solo hay ${inv.stock} en inventario. Genere una Orden de Compra en NyTEX Compras [3].`
          });
        }
        inv.stock = Math.round((inv.stock - required) * 100) / 100;
        inv.status = inv.stock > inv.minStock ? 'Óptimo' : 'Bajo Stock';
        await inv.save();
        const cost = required * (inv.unitCost || 100);
        totalCostConsumed += cost;
        consumedDetails.push({ sku: b.sku, name: b.name, consumed: required, unit: b.unit, cost });
      }
    }

    op.status = 'En Proceso de Fabricación';
    await op.save();

    // AUTOMATIZACIÓN CONTABLE: Traspaso a Producción en Proceso
    const autoEntry = await createAutoJournalEntry({
      type: 'Diario',
      concept: `Consumo de Materia Prima en Fabricación s/ OP ${opCode}`,
      originModule: 'Producción',
      originReference: opCode,
      lines: [
        { accountCode: '1106-02', accountName: 'Inventario de Producción en Proceso', debit: totalCostConsumed, credit: 0 },
        { accountCode: '1106-01', accountName: 'Almacén de Materias Primas', debit: 0, credit: totalCostConsumed }
      ]
    });

    res.json({
      success: true,
      message: `Fabricación de la orden ${opCode} iniciada en planta. Se descontaron los insumos del Inventario y se generó Póliza Contable ${autoEntry.entryCode}.`,
      op,
      consumed: consumedDetails,
      journalEntry: autoEntry
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/produccion/orders/:opCode/complete', async (req, res) => {
  try {
    const { opCode } = req.params;
    const op = await ProductionOrder.findOne({ where: { opCode } });
    if (!op) return res.status(404).json({ error: 'Orden de producción no encontrada' });

    if (op.status === 'Completada en Almacén PT') {
      return res.status(400).json({ error: 'Esta orden ya fue completada previamente' });
    }

    const ptItem = await InventoryItem.findOne({ where: { sku: op.productSku } });
    let totalCostPT = 0;
    if (ptItem) {
      ptItem.stock = Math.round((ptItem.stock + op.targetQuantity) * 100) / 100;
      ptItem.status = ptItem.stock > ptItem.minStock ? 'Óptimo' : 'Bajo Stock';
      await ptItem.save();
      totalCostPT = op.targetQuantity * (ptItem.unitCost || 1200);
    }

    op.status = 'Completada en Almacén PT';
    op.finishDate = new Date().toISOString().split('T')[0];
    await op.save();

    // AUTOMATIZACIÓN CONTABLE: Traspaso a Producto Terminado
    const autoEntry = await createAutoJournalEntry({
      type: 'Diario',
      concept: `Entrada a Producto Terminado de Lote s/ OP ${opCode} - ${op.productName}`,
      originModule: 'Producción',
      originReference: opCode,
      lines: [
        { accountCode: '1106-03', accountName: 'Almacén de Productos Terminados', debit: totalCostPT, credit: 0 },
        { accountCode: '1106-02', accountName: 'Inventario de Producción en Proceso', debit: 0, credit: totalCostPT }
      ]
    });

    res.json({
      success: true,
      message: `Lote de ${op.targetQuantity} ${op.unit} completado e ingresado a Producto Terminado. Generada Póliza Contable ${autoEntry.entryCode}.`,
      op,
      journalEntry: autoEntry
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/cxp/bills', async (req, res) => {
  try {
    const bills = await AccountPayable.findAll({ order: [['id', 'DESC']] });
    res.json(bills);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Registro Directo de Factura de Proveedor desde CxP
app.post('/api/cxp/bills', async (req, res) => {
  try {
    const { vendorCode, vendorName, invoiceNumber, subtotal, concept } = req.body;
    const sub = parseFloat(subtotal);
    if (isNaN(sub) || sub <= 0) {
      return res.status(400).json({ error: 'El subtotal debe ser un número mayor a cero' });
    }
    const tax = Math.round(sub * 0.13 * 100) / 100;
    const total = Math.round((sub + tax) * 100) / 100;

    const cxpCount = await AccountPayable.count();
    const billCode = `CXP-2026-${String(cxpCount + 1).padStart(4, '0')}`;
    const invNum = invoiceNumber || `FPROV-${String(cxpCount + 1).padStart(4, '0')}`;

    const today = new Date();
    const dueDate = new Date();
    dueDate.setDate(today.getDate() + 30);

    const newBill = await AccountPayable.create({
      billCode,
      poCode: 'DIRECTA',
      vendorCode: vendorCode || 'PRV-001',
      vendorName: vendorName || 'Proveedor Nacional',
      invoiceNumber: invNum,
      issueDate: today.toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
      totalAmount: total,
      paidAmount: 0,
      balance: total,
      creditDays: 30,
      status: 'Al Corriente',
      paymentsLog: []
    });

    const bp = await BusinessPartner.findOne({ where: { code: vendorCode } });
    if (bp) {
      bp.balance = (bp.balance || 0) + total;
      await bp.save();
    }

    const autoEntry = await createAutoJournalEntry({
      type: 'Diario',
      concept: `Provisión de Compra s/ Factura Prov. ${invNum} - ${vendorName || 'Proveedor'} (${concept || 'Gasto/Compra Operativa'})`,
      originModule: 'CxP',
      originReference: billCode,
      lines: [
        { accountCode: '5101-01', accountName: 'Compras y Gastos Operativos', debit: sub, credit: 0 },
        { accountCode: '1108-01', accountName: 'IVA Acreditable por Pagar (13%)', debit: tax, credit: 0 },
        { accountCode: '2101-01', accountName: 'Proveedores Nacionales (CxP)', debit: 0, credit: total }
      ]
    });

    res.json({
      success: true,
      message: `Factura de proveedor ${invNum} registrada en CxP ($${total.toLocaleString()} USD). Póliza Contable ${autoEntry.entryCode} generada.`,
      bill: newBill,
      journalEntry: autoEntry
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Pago a Proveedores: Aplica egreso en Tesorería y genera Póliza de Egreso en Contabilidad
app.post('/api/cxp/bills/:billCode/pay', async (req, res) => {
  try {
    const { billCode } = req.params;
    const { amount, method = 'Transferencia Bancaria SPEI', reference = 'EGR-PAGO-001' } = req.body;
    const payAmount = parseFloat(amount);

    if (isNaN(payAmount) || payAmount <= 0) {
      return res.status(400).json({ error: 'El monto de pago debe ser mayor a cero' });
    }

    const bill = await AccountPayable.findOne({ where: { billCode } });
    if (!bill) return res.status(404).json({ error: 'Cuenta por pagar no encontrada' });

    if (bill.balance <= 0) {
      return res.status(400).json({ error: 'Esta factura ya está totalmente liquidada' });
    }

    const appliedAmount = Math.min(payAmount, bill.balance);
    bill.paidAmount = Math.round((bill.paidAmount + appliedAmount) * 100) / 100;
    bill.balance = Math.round((bill.totalAmount - bill.paidAmount) * 100) / 100;

    if (bill.balance <= 0) {
      bill.status = 'Pagada';
      bill.balance = 0;
    }

    const logs = bill.paymentsLog || [];
    logs.push({
      date: new Date().toISOString(),
      amount: appliedAmount,
      method,
      reference
    });
    bill.paymentsLog = logs;
    await bill.save();

    // 1. Actualizar pasivo de Business Partner
    const bp = await BusinessPartner.findOne({ where: { code: bill.vendorCode } });
    if (bp) {
      bp.balance = Math.round(((bp.balance || 0) + appliedAmount) * 100) / 100;
      await bp.save();
    }

    // 2. AUTOMATIZACIÓN EN TESORERÍA: Dispersión de fondos de cuenta bancaria
    const bank = await BankAccount.findOne();
    if (bank) {
      bank.balance = Math.round((bank.balance - appliedAmount) * 100) / 100;
      await bank.save();

      const txCount = await BankTransaction.count();
      await BankTransaction.create({
        txCode: `TX-EGR-${String(txCount + 1).padStart(4, '0')}`,
        bankCode: bank.bankCode,
        type: 'Egreso',
        category: 'Pago Proveedores',
        amount: appliedAmount,
        date: new Date().toISOString().split('T')[0],
        concept: `Dispersión Pago Factura ${billCode} - ${bill.vendorName}`,
        reference,
        reconciled: true
      });
    }

    // 3. AUTOMATIZACIÓN CONTABLE: Póliza de Egreso
    const autoEntry = await createAutoJournalEntry({
      type: 'Egreso',
      concept: `Pago a Proveedor s/ Factura ${billCode} - ${bill.vendorName}`,
      originModule: 'CxP',
      originReference: billCode,
      lines: [
        { accountCode: '2101-01', accountName: 'Proveedores Nacionales (CxP)', debit: appliedAmount, credit: 0 },
        { accountCode: '1101-01', accountName: 'Bancos Nacionales (BBVA)', debit: 0, credit: appliedAmount }
      ]
    });

    res.json({
      success: true,
      message: `Pago de $${appliedAmount.toLocaleString()} USD dispersado al proveedor. Descontado de Tesorería y generada Póliza Contable ${autoEntry.entryCode}.`,
      bill,
      journalEntry: autoEntry
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =========================================================================
// --- ENDPOINTS NÚCLEO FINANCIERO Y CONTABLE ([10], [11], [12]) ---
// =========================================================================

// 1. Resumen Ejecutivo del Núcleo Financiero
app.get('/api/circuit/financiero/summary', async (req, res) => {
  try {
    const bankAccounts = await BankAccount.findAll();
    const assets = await FixedAsset.findAll();
    const entries = await JournalEntry.findAll();
    const transactions = await BankTransaction.findAll();

    const totalBankBalance = bankAccounts.reduce((sum, b) => sum + (b.balance || 0), 0);
    const totalAssetOriginalCost = assets.reduce((sum, a) => sum + (a.acquisitionCost || 0), 0);
    const totalAssetBookValue = assets.reduce((sum, a) => sum + (a.bookValue || 0), 0);
    const totalAccumulatedDepreciation = assets.reduce((sum, a) => sum + (a.accumulatedDepreciation || 0), 0);
    const totalJournalEntries = entries.length;

    // Calcular ingresos y egresos contables a partir de las pólizas
    let totalRevenues = 0;
    let totalExpenses = 0;
    entries.forEach(e => {
      (e.lines || []).forEach(l => {
        if (l.accountCode.startsWith('4')) totalRevenues += (l.credit || 0); // Cuentas de Ingreso (Haber)
        if (l.accountCode.startsWith('5') || l.accountCode.startsWith('6')) totalExpenses += (l.debit || 0); // Gastos / Costos (Debe)
      });
    });

    const netProfit = totalRevenues - totalExpenses;

    res.json({
      metrics: {
        totalBankBalance,
        totalAssetOriginalCost,
        totalAssetBookValue,
        totalAccumulatedDepreciation,
        totalJournalEntries,
        totalRevenues,
        totalExpenses,
        netProfit
      },
      bankAccounts,
      recentEntries: entries.slice(-10).reverse()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// [10] TESORERÍA: Endpoints
app.get('/api/tesoreria/accounts', async (req, res) => {
  try {
    const accounts = await BankAccount.findAll({ order: [['id', 'ASC']] });
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/tesoreria/transactions', async (req, res) => {
  try {
    const txs = await BankTransaction.findAll({ order: [['id', 'DESC']] });
    res.json(txs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/tesoreria/transactions', async (req, res) => {
  try {
    const { bankCode, type, category, amount, concept, reference } = req.body;
    const numAmount = parseFloat(amount);
    const count = await BankTransaction.count();
    const txCode = `TX-${type === 'Ingreso' ? 'ING' : 'EGR'}-${String(count + 1).padStart(4, '0')}`;

    const bank = await BankAccount.findOne({ where: { bankCode } });
    if (!bank) return res.status(404).json({ error: 'Cuenta bancaria no encontrada' });

    if (type === 'Ingreso') {
      bank.balance = Math.round((bank.balance + numAmount) * 100) / 100;
    } else {
      bank.balance = Math.round((bank.balance - numAmount) * 100) / 100;
    }
    await bank.save();

    const tx = await BankTransaction.create({
      txCode,
      bankCode,
      type,
      category: category || 'Operación Manual',
      amount: numAmount,
      date: new Date().toISOString().split('T')[0],
      concept,
      reference: reference || 'REF-MANUAL',
      reconciled: true
    });

    // Póliza contable correspondiente
    const autoEntry = await createAutoJournalEntry({
      type: type === 'Ingreso' ? 'Ingreso' : 'Egreso',
      concept: `Movimiento de Tesorería: ${concept}`,
      originModule: 'Tesorería',
      originReference: txCode,
      lines: type === 'Ingreso' ? [
        { accountCode: '1101-01', accountName: `Bancos Nacionales (${bank.bankName})`, debit: numAmount, credit: 0 },
        { accountCode: '4102-01', accountName: 'Otros Ingresos Financieros', debit: 0, credit: numAmount }
      ] : [
        { accountCode: '6102-01', accountName: 'Gastos Administrativos / Financieros', debit: numAmount, credit: 0 },
        { accountCode: '1101-01', accountName: `Bancos Nacionales (${bank.bankName})`, debit: 0, credit: numAmount }
      ]
    });

    res.status(201).json({ success: true, transaction: tx, journalEntry: autoEntry });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =========================================================================
// --- [10.1] CONTROLES INTERNOS: CAJAS Y FONDOS FIJOS (CAJA GENERAL & CHICA) ---
// =========================================================================

app.get('/api/tesoreria/cajas', async (req, res) => {
  try {
    let count = await CashDesk.count();
    if (count === 0) {
      await CashDesk.bulkCreate([
        {
          code: 'CAJA-GEN-01',
          name: 'Caja General - Cobranza Central & Mostrador',
          type: 'Caja General',
          currency: 'USD',
          authorizedFund: 1000.00,
          currentBalance: 2840.50,
          pendingVouchers: 0,
          responsible: 'Lic. Andrea Morales (Cajera General)',
          status: 'Abierta',
          lastAuditDate: new Date().toISOString().split('T')[0]
        },
        {
          code: 'CAJA-CHIC-01',
          name: 'Caja Chica - Administración & Finanzas',
          type: 'Caja Chica',
          currency: 'USD',
          authorizedFund: 800.00,
          currentBalance: 245.80,
          pendingVouchers: 554.20,
          responsible: 'Lic. Carlos Henríquez (Administración)',
          status: 'Abierta',
          lastAuditDate: new Date().toISOString().split('T')[0]
        },
        {
          code: 'CAJA-CHIC-02',
          name: 'Caja Chica - Planta Textil & Mantenimiento',
          type: 'Caja Chica',
          currency: 'USD',
          authorizedFund: 1200.00,
          currentBalance: 390.00,
          pendingVouchers: 810.00,
          responsible: 'Ing. Roberto Solís (Jefe Planta)',
          status: 'Abierta',
          lastAuditDate: new Date().toISOString().split('T')[0]
        }
      ]);
    }

    const [cajas, audits] = await Promise.all([
      CashDesk.findAll({ order: [['id', 'ASC']] }),
      CashAudit.findAll({ order: [['id', 'DESC']], limit: 15 })
    ]);

    res.json({ cajas, audits });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/tesoreria/cajas/arqueo', async (req, res) => {
  try {
    const { cashDeskCode, physicalCash, vouchersAmount, notes, auditedBy } = req.body;
    const caja = await CashDesk.findOne({ where: { code: cashDeskCode } });
    if (!caja) return res.status(404).json({ error: 'Caja no encontrada' });

    const pCash = parseFloat(physicalCash || 0);
    const vAmount = parseFloat(vouchersAmount || 0);
    const totalCounted = Math.round((pCash + vAmount) * 100) / 100;
    const systemExpected = caja.type === 'Caja Chica' ? caja.authorizedFund : caja.currentBalance;
    const difference = Math.round((totalCounted - systemExpected) * 100) / 100;

    let resultStatus = 'Cuadrada';
    if (difference > 0.05) resultStatus = 'Sobrante';
    if (difference < -0.05) resultStatus = 'Faltante';

    const count = await CashAudit.count();
    const auditCode = `ARQ-${cashDeskCode}-${String(count + 1).padStart(4, '0')}`;
    const today = new Date().toISOString().split('T')[0];

    const audit = await CashAudit.create({
      auditCode,
      cashDeskCode,
      auditDate: today,
      physicalCashCounted: pCash,
      vouchersCounted: vAmount,
      totalCounted,
      systemExpected,
      difference,
      resultStatus,
      auditedBy: auditedBy || 'Auditoría Interna de Finanzas',
      notes: notes || `Arqueo de control interno ordinario - Estatus: ${resultStatus}`
    });

    caja.status = resultStatus;
    caja.lastAuditDate = today;
    if (caja.type === 'Caja Chica') {
      caja.currentBalance = pCash;
      caja.pendingVouchers = vAmount;
    }
    await caja.save();

    await AuditLog.create({
      timestamp: new Date().toISOString(),
      action: 'ARQUEO_CAJA',
      module: 'Tesorería',
      user: auditedBy || 'admin@consultores-nyt.com',
      ipAddress: '192.168.1.105',
      details: `Arqueo ejecutado en ${caja.name} (${auditCode}): Conteo $${totalCounted} USD, Esperado $${systemExpected} USD, Dif: $${difference} USD (${resultStatus}).`,
      severity: resultStatus === 'Cuadrada' ? 'INFO' : 'WARNING'
    });

    res.json({ success: true, audit, caja });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/tesoreria/cajas/reposicion', async (req, res) => {
  try {
    const { cashDeskCode, bankCode } = req.body;
    const caja = await CashDesk.findOne({ where: { code: cashDeskCode } });
    if (!caja) return res.status(404).json({ error: 'Caja no encontrada' });

    const bank = await BankAccount.findOne({ where: { bankCode: bankCode || 'BCO-BBVA-01' } });
    if (!bank) return res.status(404).json({ error: 'Cuenta bancaria de dispersión no encontrada' });

    const amountToReplenish = Math.round((caja.authorizedFund - caja.currentBalance) * 100) / 100;
    if (amountToReplenish <= 0) {
      return res.status(400).json({ error: 'La caja chica se encuentra con su fondo completo, no requiere reposición.' });
    }

    if (bank.balance < amountToReplenish) {
      return res.status(400).json({ error: `Saldo insuficiente en ${bank.bankName} ($${bank.balance} USD) para reponer $${amountToReplenish} USD` });
    }

    // Descontar de banco y restaurar fondo
    bank.balance = Math.round((bank.balance - amountToReplenish) * 100) / 100;
    await bank.save();

    caja.currentBalance = caja.authorizedFund;
    caja.pendingVouchers = 0;
    caja.status = 'Cuadrada';
    await caja.save();

    const txCount = await BankTransaction.count();
    const txCode = `TX-REP-${String(txCount + 1).padStart(4, '0')}`;
    await BankTransaction.create({
      txCode,
      bankCode: bank.bankCode,
      type: 'Egreso',
      category: 'Reposición Fondo Fijo',
      amount: amountToReplenish,
      date: new Date().toISOString().split('T')[0],
      concept: `Cheque / Dispersión por Reposición de ${caja.name}`,
      reference: `REP-${caja.code}`,
      reconciled: true
    });

    const autoEntry = await createAutoJournalEntry({
      type: 'Egreso',
      concept: `Póliza de Reposición de Fondo Fijo: ${caja.name} con cargo a ${bank.bankName}`,
      originModule: 'Tesorería',
      originReference: txCode,
      lines: [
        { accountCode: '6102-05', accountName: 'Gastos Menores Comprobados de Operación', debit: amountToReplenish, credit: 0 },
        { accountCode: '1101-01', accountName: `Bancos Nacionales (${bank.bankName})`, debit: 0, credit: amountToReplenish }
      ]
    });

    await AuditLog.create({
      timestamp: new Date().toISOString(),
      action: 'REPOSICION_CAJA_CHICA',
      module: 'Tesorería',
      user: 'finanzas@consultores-nyt.com',
      ipAddress: '192.168.1.105',
      details: `Reposición de Fondo Fijo efectuada para ${caja.name} por $${amountToReplenish} USD con cargo a ${bank.bankName}. Póliza ${autoEntry.entryCode}.`,
      severity: 'INFO'
    });

    res.json({ success: true, message: `Reposición de $${amountToReplenish} USD completada exitosamente.`, caja, bank, journalEntry: autoEntry });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =========================================================================
// --- [10.2] CONCILIACIÓN BANCARIA MENSUAL ---
// =========================================================================

app.get('/api/tesoreria/conciliacion', async (req, res) => {
  try {
    const bankCode = req.query.bankCode || 'BCO-BBVA-01';
    const period = req.query.period || '2026-10';

    const bank = await BankAccount.findOne({ where: { bankCode } });
    if (!bank) return res.status(404).json({ error: 'Cuenta bancaria no encontrada' });

    let count = await BankReconciliationItem.count({ where: { bankCode, period } });
    if (count === 0) {
      await BankReconciliationItem.bulkCreate([
        {
          itemCode: `REC-${period}-001`,
          bankCode,
          period,
          date: '2026-10-02',
          concept: 'Depósito Cliente Maquilas de Centroamérica (En tránsito de compensación)',
          reference: 'DEP-84920',
          type: 'Depósito en Tránsito',
          amount: 4500.00,
          origin: 'Libro ERP',
          status: 'Pendiente'
        },
        {
          itemCode: `REC-${period}-002`,
          bankCode,
          period,
          date: '2026-10-04',
          concept: 'Cheque #4820 a Proveedor Hilos & Hilazas S.A. (No presentado al cobro)',
          reference: 'CHQ-4820',
          type: 'Cheque Flotante',
          amount: 8750.00,
          origin: 'Libro ERP',
          status: 'Pendiente'
        },
        {
          itemCode: `REC-${period}-003`,
          bankCode,
          period,
          date: '2026-10-05',
          concept: 'Comisión mensual por custodia y token digital bancario',
          reference: 'ND-COM-01',
          type: 'Comisión Bancaria',
          amount: 45.00,
          origin: 'Extracto Bancario',
          status: 'Conciliado',
          reconciledAt: new Date().toISOString()
        }
      ]);
    }

    const items = await BankReconciliationItem.findAll({
      where: { bankCode, period },
      order: [['date', 'ASC']]
    });

    const bookBalance = bank.balance;
    const pendingDeposits = items
      .filter(i => i.type === 'Depósito en Tránsito' && i.status === 'Pendiente')
      .reduce((sum, i) => sum + i.amount, 0);
    const pendingChecks = items
      .filter(i => i.type === 'Cheque Flotante' && i.status === 'Pendiente')
      .reduce((sum, i) => sum + i.amount, 0);

    // Saldo según extracto banco = Saldo Libro + Cheques flotantes - Depósitos en tránsito
    const statementBalance = Math.round((bookBalance + pendingChecks - pendingDeposits) * 100) / 100;
    const reconciledBalance = Math.round((statementBalance + pendingDeposits - pendingChecks) * 100) / 100;
    const difference = Math.round((reconciledBalance - bookBalance) * 100) / 100;

    res.json({
      bank,
      period,
      bookBalance,
      statementBalance,
      pendingDeposits,
      pendingChecks,
      reconciledBalance,
      difference,
      isBalanced: Math.abs(difference) < 0.01,
      items
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/tesoreria/conciliacion/toggle', async (req, res) => {
  try {
    const { itemCode } = req.body;
    const item = await BankReconciliationItem.findOne({ where: { itemCode } });
    if (!item) return res.status(404).json({ error: 'Partida no encontrada' });

    item.status = item.status === 'Conciliado' ? 'Pendiente' : 'Conciliado';
    item.reconciledAt = item.status === 'Conciliado' ? new Date().toISOString() : null;
    await item.save();

    res.json({ success: true, item });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/tesoreria/conciliacion/cerrar', async (req, res) => {
  try {
    const { bankCode, period, statementBalance } = req.body;
    const hash = crypto.createHash('sha256').update(`${bankCode}|${period}|${statementBalance}|${Date.now()}`).digest('hex');

    await AuditLog.create({
      timestamp: new Date().toISOString(),
      action: 'CIERRE_CONCILIACION_BANCARIA',
      module: 'Tesorería',
      user: 'auditoria@consultores-nyt.com',
      ipAddress: '192.168.1.105',
      details: `Conciliación Bancaria Mensual aprobada y cerrada para ${bankCode} período ${period}. Sello digital: ${hash.substring(0, 16)}...`,
      severity: 'INFO'
    });

    res.json({
      success: true,
      message: `Acta Oficial de Conciliación Bancaria generada y sellada con éxito para el período ${period}.`,
      cryptographicSeal: hash,
      status: 'CERRADA_Y_AUDITADA'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =========================================================================
// --- [10.3] TABLERO DE CIERRES DIARIOS Y CONTROLES INTERNOS ---
// =========================================================================

app.get('/api/tesoreria/cierres', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    let closures = await InternalClosure.findAll({ order: [['id', 'DESC']] });

    if (closures.length === 0) {
      closures = await InternalClosure.bulkCreate([
        {
          closeCode: `CLR-COB-${today}`,
          closeType: 'COBROS_DIARIO',
          title: 'Cierre Diario de Cobros & Facturación (CxC)',
          periodOrDate: today,
          status: 'Cerrado',
          totalAmount: 14850.00,
          recordsCount: 8,
          closedBy: 'Lic. Sofía Rivas (Jefa de Crédito y Cobranza)',
          closedAt: `${today} 18:30:00`,
          details: '8 recibos de cobranza auditados y acreditados en bancos. Cero partidas pendientes.',
          cryptographicHash: 'a7f9c8e2b1049281726354182901a8f9c'
        },
        {
          closeCode: `CLR-PAG-${today}`,
          closeType: 'PAGOS_DIARIO',
          title: 'Cierre Diario de Dispersión de Pagos a Proveedores (CxP)',
          periodOrDate: today,
          status: 'Cerrado',
          totalAmount: 9320.00,
          recordsCount: 5,
          closedBy: 'Lic. Fernando Cruz (Tesorero Corporativo)',
          closedAt: `${today} 17:45:00`,
          details: '5 transferencias bancarias validadas con factura fiscal liquidada y retenciones aplicadas.',
          cryptographicHash: 'c4e8b105928172634819201827364512b'
        },
        {
          closeCode: `CLR-COM-${today}`,
          closeType: 'COMPRAS_PERIODO',
          title: 'Cierre de Compras & Three-Way Match (OC vs. WMS vs. Factura)',
          periodOrDate: today,
          status: 'Conciliado',
          totalAmount: 38400.00,
          recordsCount: 14,
          closedBy: 'Ing. Rodrigo Mendoza (Cadena de Suministro)',
          closedAt: `${today} 16:15:00`,
          details: '14 Órdenes de Compra cotejadas al 100% contra recepciones físicas en muelle y facturas CxP.',
          cryptographicHash: 'e9281726354182901928374650192837c'
        },
        {
          closeCode: `CLR-CAJ-${today}`,
          closeType: 'CAJA_GENERAL',
          title: 'Cierre de Caja General & Emisión de Remesa Bancaria',
          periodOrDate: today,
          status: 'Cerrado',
          totalAmount: 2840.50,
          recordsCount: 1,
          closedBy: 'Lic. Andrea Morales (Cajera General)',
          closedAt: `${today} 18:00:00`,
          details: 'Efectivo en mostrador cuadrado. Boleta de remesa al banco BCO-BBVA-01 por $2,340.50 USD (dejando $500 USD de fondo base).',
          cryptographicHash: 'f10293847561029384756102938475610'
        },
        {
          closeCode: `CLR-CTB-2026-09`,
          closeType: 'CONTABLE_MENSUAL',
          title: 'Cierre Contable Mensual & Candado Fiscal de Período',
          periodOrDate: 'Septiembre 2026',
          status: 'Cerrado',
          totalAmount: 2450000.00,
          recordsCount: 184,
          closedBy: 'C.P. Mario Castaneda (Contador General)',
          closedAt: '2026-10-02 20:00:00',
          details: 'Período Septiembre bloqueado contra modificaciones. Balanza cuadrada y depreciaciones ejecutadas.',
          cryptographicHash: 'b5839201948572615482910485726194a'
        }
      ]);
    }

    res.json(closures);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/tesoreria/cierres/ejecutar', async (req, res) => {
  try {
    const { closeType, periodOrDate, title, totalAmount, recordsCount, notes } = req.body;
    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const hash = crypto.createHash('sha256').update(`${closeType}|${periodOrDate}|${totalAmount}|${Date.now()}`).digest('hex');

    const count = await InternalClosure.count();
    const closeCode = `CLR-${closeType.substring(0, 3)}-${Date.now().toString().slice(-4)}`;

    const closure = await InternalClosure.create({
      closeCode,
      closeType: closeType || 'CIERRE_OPERATIVO',
      title: title || `Cierre Operativo de Control Interno`,
      periodOrDate: periodOrDate || today,
      status: 'Cerrado',
      totalAmount: parseFloat(totalAmount || 0),
      recordsCount: parseInt(recordsCount || 1, 10),
      closedBy: 'Dirección Financiera & Control Interno',
      closedAt: now,
      details: notes || `Cierre formal ejecutado con sello inmutable. ${notes || ''}`,
      cryptographicHash: hash
    });

    await AuditLog.create({
      timestamp: new Date().toISOString(),
      action: `CIERRE_${closeType}`,
      module: 'Finanzas & Administración',
      user: 'director.finanzas@consultores-nyt.com',
      ipAddress: '192.168.1.105',
      details: `Ejecución de control interno: ${closure.title} ($${closure.totalAmount} USD, ${closure.recordsCount} ops). Hash de auditoría: ${hash.substring(0, 16)}...`,
      severity: 'INFO'
    });

    res.json({ success: true, closure });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// [11] ACTIVOS FIJOS: Endpoints
app.get('/api/activos/list', async (req, res) => {
  try {
    const assets = await FixedAsset.findAll({ order: [['id', 'ASC']] });
    res.json(assets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/activos/create', async (req, res) => {
  try {
    const { name, category, acquisitionCost, usefulLifeYears, assignedTo } = req.body;
    const count = await FixedAsset.count();
    const assetCode = `AF-${String(count + 1).padStart(3, '0')}`;
    const cost = parseFloat(acquisitionCost) || 100000;
    const lifeYears = parseInt(usefulLifeYears, 10) || 10;
    const rateAnnual = Math.round((100 / lifeYears) * 100) / 100;

    const newAsset = await FixedAsset.create({
      assetCode,
      name,
      category: category || 'Maquinaria & Equipo Fabril',
      acquisitionDate: new Date().toISOString().split('T')[0],
      acquisitionCost: cost,
      usefulLifeYears: lifeYears,
      depreciationRateAnnual: rateAnnual,
      accumulatedDepreciation: 0,
      bookValue: cost,
      assignedTo: assignedTo || 'Planta Principal',
      status: 'En Operación'
    });

    res.status(201).json(newAsset);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ACCIÓN INTEGRADA: Correr Depreciación Mensual Automática y generar Póliza Contable
app.post('/api/activos/depreciate-all', async (req, res) => {
  try {
    const assets = await FixedAsset.findAll({ where: { status: 'En Operación' } });
    let totalMonthlyDepreciation = 0;
    const details = [];

    for (const asset of assets) {
      const annualDep = (asset.acquisitionCost * asset.depreciationRateAnnual) / 100;
      const monthlyDep = Math.round((annualDep / 12) * 100) / 100;
      
      const newAccumulated = Math.min(asset.acquisitionCost, Math.round((asset.accumulatedDepreciation + monthlyDep) * 100) / 100);
      const newBookValue = Math.max(0, Math.round((asset.acquisitionCost - newAccumulated) * 100) / 100);

      asset.accumulatedDepreciation = newAccumulated;
      asset.bookValue = newBookValue;
      if (newBookValue === 0) asset.status = 'Depreciado';
      await asset.save();

      totalMonthlyDepreciation += monthlyDep;
      details.push({
        assetCode: asset.assetCode,
        name: asset.name,
        monthlyDep,
        newBookValue
      });
    }

    // AUTOMATIZACIÓN CONTABLE: Póliza de Diario por Depreciación
    const autoEntry = await createAutoJournalEntry({
      type: 'Diario',
      concept: `Depreciación Contable Mensual de Activos Fijos y Maquinaria Textil`,
      originModule: 'Activos Fijos',
      originReference: `DEP-${new Date().toISOString().substring(0, 7)}`,
      lines: [
        { accountCode: '6103-01', accountName: 'Gasto por Depreciación de Maquinaria y Equipo', debit: totalMonthlyDepreciation, credit: 0 },
        { accountCode: '1209-01', accountName: 'Depreciación Acumulada de Activos Fijos', debit: 0, credit: totalMonthlyDepreciation }
      ]
    });

    res.json({
      success: true,
      message: `Depreciación mensual calculada para ${assets.length} activos ($${totalMonthlyDepreciation.toLocaleString()} USD). Póliza de Diario ${autoEntry.entryCode} registrada automáticamente en Contabilidad.`,
      totalMonthlyDepreciation,
      journalEntry: autoEntry,
      details
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// [12] CONTABILIDAD: Endpoints
app.get('/api/contabilidad/entries', async (req, res) => {
  try {
    const entries = await JournalEntry.findAll({ order: [['id', 'DESC']] });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Balanza de Comprobación en Vivo
app.get('/api/contabilidad/trial-balance', async (req, res) => {
  try {
    const entries = await JournalEntry.findAll();
    const accountsMap = {};

    entries.forEach(entry => {
      (entry.lines || []).forEach(l => {
        if (!accountsMap[l.accountCode]) {
          accountsMap[l.accountCode] = {
            accountCode: l.accountCode,
            accountName: l.accountName,
            debit: 0,
            credit: 0
          };
        }
        accountsMap[l.accountCode].debit += (l.debit || 0);
        accountsMap[l.accountCode].credit += (l.credit || 0);
      });
    });

    const accountsList = Object.values(accountsMap).map(acc => {
      const netBalance = Math.round((acc.debit - acc.credit) * 100) / 100;
      return {
        ...acc,
        debit: Math.round(acc.debit * 100) / 100,
        credit: Math.round(acc.credit * 100) / 100,
        netBalance
      };
    }).sort((a, b) => a.accountCode.localeCompare(b.accountCode));

    const totalDebit = accountsList.reduce((sum, a) => sum + a.debit, 0);
    const totalCredit = accountsList.reduce((sum, a) => sum + a.credit, 0);

    res.json({
      accounts: accountsList,
      totalDebit: Math.round(totalDebit * 100) / 100,
      totalCredit: Math.round(totalCredit * 100) / 100,
      isBalanced: Math.abs(totalDebit - totalCredit) < 0.01
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =========================================================================
// --- [13] NYTEX RRHH & [14] NYTEX NÓMINA: ENDPOINTS E INTEGRACIONES ---
// =========================================================================

// [13] RRHH: Obtener lista de colaboradores y métricas de talento
app.get('/api/rrhh/employees', async (req, res) => {
  try {
    const employees = await Employee.findAll({ order: [['id', 'ASC']] });
    const totalActive = employees.filter(e => e.status === 'Activo').length;
    const totalMonthlyPayroll = employees.reduce((sum, e) => sum + (e.monthlySalary || 0), 0);
    const byDepartment = {};
    employees.forEach(e => {
      byDepartment[e.department] = (byDepartment[e.department] || 0) + 1;
    });

    res.json({
      employees,
      metrics: {
        totalEmployees: employees.length,
        totalActive,
        totalMonthlyPayroll: Math.round(totalMonthlyPayroll * 100) / 100,
        averageDailySalary: employees.length > 0 ? Math.round((totalMonthlyPayroll / (employees.length * 30)) * 100) / 100 : 0,
        byDepartment
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// [13] RRHH: Registrar nuevo colaborador
app.post('/api/rrhh/employees', async (req, res) => {
  try {
    const count = await Employee.count();
    const employeeCode = req.body.employeeCode || `EMP-${String(count + 1).padStart(3, '0')}`;
    const dailySalary = parseFloat(req.body.dailySalary) || 450;
    const integratedDailySalary = parseFloat(req.body.integratedDailySalary) || Math.round(dailySalary * 1.05 * 100) / 100;
    const monthlySalary = parseFloat(req.body.monthlySalary) || Math.round(dailySalary * 30);

    const newEmp = await Employee.create({
      ...req.body,
      employeeCode,
      dailySalary,
      integratedDailySalary,
      monthlySalary
    });
    res.status(201).json(newEmp);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// [13] RRHH: Actualizar colaborador
app.put('/api/rrhh/employees/:code', async (req, res) => {
  try {
    const emp = await Employee.findOne({ where: { employeeCode: req.params.code } });
    if (!emp) return res.status(404).json({ error: 'Colaborador no encontrado' });
    await emp.update(req.body);
    res.json(emp);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// [13] RRHH: Incidencias de Asistencia (Horas Extra, Faltas, Retardos)
app.get('/api/rrhh/incidents', async (req, res) => {
  try {
    const { periodCode } = req.query;
    const where = periodCode ? { periodCode } : {};
    const incidents = await AttendanceIncident.findAll({ where, order: [['id', 'DESC']] });
    res.json(incidents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/rrhh/incidents', async (req, res) => {
  try {
    const count = await AttendanceIncident.count();
    const incidentCode = `INC-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`;
    const { employeeCode, date, type, hours = 0, notes = '', periodCode = 'NOM-2026-Q18' } = req.body;

    const emp = await Employee.findOne({ where: { employeeCode } });
    if (!emp) return res.status(404).json({ error: 'Empleado no encontrado' });

    let multiplier = 1;
    if (type === 'Horas Extra Dobles') multiplier = 2;
    if (type === 'Horas Extra Triples') multiplier = 3;

    const incident = await AttendanceIncident.create({
      incidentCode,
      employeeCode,
      employeeName: emp.fullName,
      date: date || new Date().toISOString().split('T')[0],
      type,
      hours: parseFloat(hours) || 0,
      multiplier,
      notes,
      status: 'Aprobada',
      periodCode
    });

    res.status(201).json(incident);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/rrhh/incidents/:code', async (req, res) => {
  try {
    const incident = await AttendanceIncident.findOne({ where: { incidentCode: req.params.code } });
    if (!incident) return res.status(404).json({ error: 'Incidencia no encontrada' });
    await incident.destroy();
    res.json({ success: true, message: 'Incidencia eliminada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// [14] NÓMINA: Periodos de Nómina Quincenal
app.get('/api/nomina/periods', async (req, res) => {
  try {
    const periods = await PayrollRun.findAll({ order: [['id', 'DESC']] });
    res.json(periods);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/nomina/periods/:periodCode', async (req, res) => {
  try {
    const period = await PayrollRun.findOne({ where: { periodCode: req.params.periodCode } });
    if (!period) return res.status(404).json({ error: 'Periodo de nómina no encontrado' });
    res.json(period);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// [14] NÓMINA: MOTOR DE CÁLCULO DE NÓMINA CON INCIDENCIAS, ISR & IMSS
app.post('/api/nomina/calculate', async (req, res) => {
  try {
    const { periodCode = 'NOM-2026-Q18' } = req.body;
    let period = await PayrollRun.findOne({ where: { periodCode } });
    if (!period) {
      period = await PayrollRun.create({
        periodCode,
        periodName: '2da Quincena Septiembre 2026',
        periodType: 'Quincenal',
        startDate: '2026-09-16',
        endDate: '2026-09-30',
        payDate: '2026-09-30',
        status: 'Borrador'
      });
    }

    const employees = await Employee.findAll({ where: { status: 'Activo' } });
    const incidents = await AttendanceIncident.findAll({ where: { periodCode } });

    let totalGross = 0;
    let totalOvertime = 0;
    let totalBonuses = 0;
    let totalAbsenceDeductions = 0;
    let totalIsr = 0;
    let totalImssWorker = 0;
    let totalDeductions = 0;
    let totalNet = 0;
    let totalEmployerImss = 0;
    let totalEmployerInfonavit = 0;
    let totalStateTax = 0;

    const breakdown = employees.map(emp => {
      const empIncidents = incidents.filter(i => i.employeeCode === emp.employeeCode);
      const absences = empIncidents.filter(i => i.type.includes('Falta')).length;
      const otDoubleHours = empIncidents.filter(i => i.type === 'Horas Extra Dobles').reduce((s, i) => s + (i.hours || 0), 0);
      const otTripleHours = empIncidents.filter(i => i.type === 'Horas Extra Triples').reduce((s, i) => s + (i.hours || 0), 0);

      const daysInPeriod = 15;
      const daysWorked = Math.max(0, daysInPeriod - absences);
      const basePay = Math.round(emp.dailySalary * daysWorked * 100) / 100;
      const hourlyRate = emp.dailySalary / 8;
      const otPay = Math.round((hourlyRate * 2 * otDoubleHours + hourlyRate * 3 * otTripleHours) * 100) / 100;
      
      // Premio de puntualidad y asistencia: 10% si 0 faltas
      const attendanceBonus = absences === 0 ? Math.round(basePay * 0.10 * 100) / 100 : 0;
      const grossEarnings = Math.round((basePay + otPay + attendanceBonus) * 100) / 100;

      // Descuento por falta (informativo)
      const absenceDeduction = Math.round(emp.dailySalary * absences * 100) / 100;

      // Retención ISR progresiva quincenal estimada (~12% promedio según rango de sueldo)
      let isrRate = 0.08;
      if (grossEarnings > 12000) isrRate = 0.17;
      else if (grossEarnings > 8000) isrRate = 0.12;
      else if (grossEarnings > 5000) isrRate = 0.09;
      const isrAmount = Math.round(grossEarnings * isrRate * 100) / 100;

      // Cuota obrera IMSS (~2.725% sobre SDI * días cotizados)
      const imssWorkerAmount = Math.round((emp.integratedDailySalary * daysWorked * 0.02725) * 100) / 100;
      const empTotalDeductions = Math.round((isrAmount + imssWorkerAmount) * 100) / 100;
      const netPay = Math.round((grossEarnings - empTotalDeductions) * 100) / 100;

      // Cargas patronales (Costo Compañía)
      const employerImss = Math.round((emp.integratedDailySalary * daysWorked * 0.185) * 100) / 100; // 18.5% Riesgo Textil
      const employerInfonavit = Math.round((emp.integratedDailySalary * daysWorked * 0.05) * 100) / 100; // 5% Infonavit
      const stateTax = Math.round(grossEarnings * 0.03 * 100) / 100; // 3% ISN
      const companyCost = Math.round((grossEarnings + employerImss + employerInfonavit + stateTax) * 100) / 100;

      totalGross += grossEarnings;
      totalOvertime += otPay;
      totalBonuses += attendanceBonus;
      totalAbsenceDeductions += absenceDeduction;
      totalIsr += isrAmount;
      totalImssWorker += imssWorkerAmount;
      totalDeductions += empTotalDeductions;
      totalNet += netPay;
      totalEmployerImss += employerImss;
      totalEmployerInfonavit += employerInfonavit;
      totalStateTax += stateTax;

      // CFDI Timbrado Fiscal simulado
      const cfdiUuid = `UUID-${Math.random().toString(36).substring(2, 10).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-4A9F-2026`;

      return {
        employeeCode: emp.employeeCode,
        fullName: emp.fullName,
        jobTitle: emp.jobTitle,
        department: emp.department,
        dailySalary: emp.dailySalary,
        integratedDailySalary: emp.integratedDailySalary,
        daysWorked,
        absences,
        otHours: otDoubleHours + otTripleHours,
        basePay,
        otPay,
        attendanceBonus,
        grossEarnings,
        absenceDeduction,
        isrAmount,
        imssWorkerAmount,
        totalDeductions: empTotalDeductions,
        netPay,
        employerImss,
        employerInfonavit,
        stateTax,
        companyCost,
        bankName: emp.bankName,
        bankAccount: emp.bankAccount,
        cfdiUuid,
        timbradoDate: new Date().toISOString()
      };
    });

    const totalCompanyCost = Math.round((totalGross + totalEmployerImss + totalEmployerInfonavit + totalStateTax) * 100) / 100;

    period.employeesCount = employees.length;
    period.totalGross = Math.round(totalGross * 100) / 100;
    period.totalOvertime = Math.round(totalOvertime * 100) / 100;
    period.totalBonuses = Math.round(totalBonuses * 100) / 100;
    period.totalAbsenceDeductions = Math.round(totalAbsenceDeductions * 100) / 100;
    period.totalIsr = Math.round(totalIsr * 100) / 100;
    period.totalImssWorker = Math.round(totalImssWorker * 100) / 100;
    period.totalDeductions = Math.round(totalDeductions * 100) / 100;
    period.totalNet = Math.round(totalNet * 100) / 100;
    period.totalEmployerImss = Math.round(totalEmployerImss * 100) / 100;
    period.totalEmployerInfonavit = Math.round(totalEmployerInfonavit * 100) / 100;
    period.totalStateTax = Math.round(totalStateTax * 100) / 100;
    period.totalCompanyCost = totalCompanyCost;
    period.status = 'Calculada';
    period.breakdown = breakdown;
    await period.save();

    res.json({
      success: true,
      message: `Nómina ${period.periodCode} calculada exitosamente para ${employees.length} colaboradores con motor fiscal IMSS/SAT.`,
      period
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// [14] NÓMINA -> [10] TESORERÍA: DISPERSIÓN BANCARIA AUTOMÁTICA
app.post('/api/nomina/disburse', async (req, res) => {
  try {
    const { periodCode = 'NOM-2026-Q18', bankCode = 'BCO-BNTE-02' } = req.body;
    const period = await PayrollRun.findOne({ where: { periodCode } });
    if (!period) return res.status(404).json({ error: 'Periodo de nómina no encontrado' });
    if (period.status === 'Dispersada' || period.status === 'Contabilizada') {
      return res.status(400).json({ error: `La nómina ya fue dispersada previamente (${period.disbursementTxCode})` });
    }

    const bank = await BankAccount.findOne({ where: { bankCode } });
    if (!bank) return res.status(404).json({ error: 'Cuenta bancaria de dispersión no encontrada' });

    if (bank.balance < period.totalNet) {
      return res.status(400).json({ 
        error: `Saldo insuficiente en Tesorería. Saldo: $${bank.balance.toLocaleString()} USD, Requerido: $${period.totalNet.toLocaleString()} USD` 
      });
    }

    // 1. Debitar fondos de Tesorería
    bank.balance = Math.round((bank.balance - period.totalNet) * 100) / 100;
    await bank.save();

    // 2. Registrar Transacción Bancaria de Egreso
    const txCount = await BankTransaction.count();
    const txCode = `TX-NOM-${String(txCount + 1).padStart(4, '0')}`;
    const tx = await BankTransaction.create({
      txCode,
      bankCode: bank.bankCode,
      type: 'Egreso',
      category: 'Dispersión de Nómina y Salarios',
      amount: period.totalNet,
      date: new Date().toISOString().split('T')[0],
      concept: `Dispersión Salarial SPEI: ${period.periodName} (${period.employeesCount} Colaboradores)`,
      reference: `LAYOUT-SPEI-${period.periodCode}`,
      reconciled: true
    });

    period.status = 'Dispersada';
    period.bankSourceAccount = bank.bankCode;
    period.disbursementTxCode = txCode;
    await period.save();

    res.json({
      success: true,
      message: `Dispersión bancaria ejecutada exitosamente. $${period.totalNet.toLocaleString()} USD debitados de ${bank.bankName} (${bank.bankCode}).`,
      period,
      transaction: tx,
      bankNewBalance: bank.balance
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// [14] NÓMINA -> [12] CONTABILIDAD: PÓLIZA DE NÓMINA DE PARTIDA DOBLE
app.post('/api/nomina/post-accounting', async (req, res) => {
  try {
    const { periodCode = 'NOM-2026-Q18' } = req.body;
    const period = await PayrollRun.findOne({ where: { periodCode } });
    if (!period) return res.status(404).json({ error: 'Periodo de nómina no encontrado' });
    if (period.status === 'Contabilizada') {
      return res.status(400).json({ error: `La nómina ya fue contabilizada en la póliza ${period.journalEntryCode}` });
    }

    // Armado de partida doble contable:
    // CARGOS (DEBE) -> Gastos de Personal y Cargas Patronales
    // ABONOS (HABER) -> Pasivos de Retenciones Fiscales, Pasivos de Seguridad Social y Salida de Bancos
    const baseSalariesExpense = Math.round((period.totalGross - period.totalOvertime - period.totalBonuses) * 100) / 100;
    const totalPatronal = Math.round((period.totalEmployerImss + period.totalEmployerInfonavit) * 100) / 100;

    const lines = [
      // DEBE (Gastos de Nómina)
      { accountCode: '5101-01', accountName: 'Gastos de Personal - Sueldos y Salarios Base', debit: baseSalariesExpense, credit: 0 },
      { accountCode: '5101-02', accountName: 'Gastos de Personal - Horas Extraordinarias', debit: period.totalOvertime, credit: 0 },
      { accountCode: '5101-03', accountName: 'Gastos de Personal - Premios de Asistencia y Puntualidad', debit: period.totalBonuses, credit: 0 },
      { accountCode: '5102-01', accountName: 'Cargas Sociales Patronales - IMSS e INFONAVIT', debit: totalPatronal, credit: 0 },
      { accountCode: '5102-02', accountName: 'Impuestos Locales sobre Nómina (ISN 3%)', debit: period.totalStateTax, credit: 0 },

      // HABER (Retenciones de Impuestos, Pasivos por Enterar y Bancos)
      { accountCode: '2105-01', accountName: 'Impuestos Retenidos por Salarios (ISR SAT por Pagar)', debit: 0, credit: period.totalIsr },
      { accountCode: '2106-01', accountName: 'Seguridad Social - Cuota Obrera IMSS por Pagar', debit: 0, credit: period.totalImssWorker },
      { accountCode: '2107-01', accountName: 'Seguridad Social - Cuotas Patronales IMSS/INFONAVIT por Enterar', debit: 0, credit: totalPatronal },
      { accountCode: '2107-02', accountName: 'Impuesto sobre Nómina (ISN) Estatal por Pagar', debit: 0, credit: period.totalStateTax },
      { accountCode: '1101-02', accountName: 'Bancos Nacionales (Banorte Tesorería & Nómina)', debit: 0, credit: period.totalNet }
    ];

    const autoEntry = await createAutoJournalEntry({
      type: 'Egreso',
      concept: `Póliza de Nómina Quincenal: ${period.periodName} (${period.employeesCount} Colaboradores)`,
      originModule: 'Nómina',
      originReference: period.periodCode,
      lines
    });

    period.status = 'Contabilizada';
    period.journalEntryCode = autoEntry.entryCode;
    await period.save();

    res.json({
      success: true,
      message: `Póliza contable ${autoEntry.entryCode} generada exitosamente. Cargo a Gastos de Nómina y Abono a Retenciones/Bancos con cuadre 100% verificado.`,
      period,
      journalEntry: autoEntry
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// MONITOR CONSOLIDADO: Circuito de Talento Humano y Nómina
app.get('/api/circuit/nomina/summary', async (req, res) => {
  try {
    const employees = await Employee.findAll();
    const incidents = await AttendanceIncident.findAll({ order: [['id', 'DESC']] });
    const currentPeriod = await PayrollRun.findOne({ 
      where: { periodCode: 'NOM-2026-Q18' } 
    }) || await PayrollRun.findOne({ order: [['id', 'DESC']] });
    const bankAccount = await BankAccount.findOne({ where: { bankCode: 'BCO-BNTE-02' } });

    res.json({
      employees,
      incidents,
      currentPeriod,
      bankAccount,
      metrics: {
        totalEmployees: employees.length,
        activeEmployees: employees.filter(e => e.status === 'Activo').length,
        totalIncidents: incidents.length,
        pendingIncidents: incidents.filter(i => i.status === 'Pendiente').length,
        payrollStatus: currentPeriod?.status || 'Borrador',
        totalNetToPay: currentPeriod?.totalNet || 0,
        totalCompanyCost: currentPeriod?.totalCompanyCost || 0,
        bankLiquidity: bankAccount?.balance || 0,
        hasSufficientFunds: (bankAccount?.balance || 0) >= (currentPeriod?.totalNet || 0)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// NyTEX Modelos Predictivos
app.get('/api/predictivos/models', (req, res) => {
  res.json({
    module: 'NyTEX Modelos Predictivos',
    area: 'Área 6: Dirección de Inteligencia de Negocios y Analítica',
    subengines: [
      {
        name: 'Modelos Continuos / Series de Tiempo',
        algorithms: ['ARIMA', 'Prophet', 'Exponential Smoothing'],
        useCases: ['Demanda de tela e insumos', 'Proyección de ventas $', 'Requerimientos MRP']
      },
      {
        name: 'Modelos de Riesgo & Causalidad Binaria',
        algorithms: ['Regresión Logística (Logit)', 'Odds Ratio (OR)', 'Intervalos de Confianza 95%'],
        useCases: ['Mora e Impago en CxC', 'Defectos de Calidad en Producción', 'Abandono de Clientes (Churn)']
      }
    ]
  });
});

app.post('/api/predictivos/inference', (req, res) => {
  try {
    const { useCase = 'cxc_default', features = {} } = req.body;
    let intercept = -2.85;
    let betaSum = 0;

    if (useCase === 'cxc_default') {
      if (features.disputasFacturas > 1) betaSum += 1.23;
      if (features.lineaCreditoUsadaPct > 70) betaSum += 0.98;
      if (features.diasAtrasoPrevio > 15) betaSum += 0.65;
      if (features.antiguedadMeses > 24) betaSum -= 1.15;
    } else {
      betaSum = Math.random() * 1.5 - 0.4;
    }

    const z = intercept + betaSum;
    const prob = 1 / (1 + Math.exp(-z));
    const probPct = (prob * 100).toFixed(1);
    const oddsRatioRelativo = Math.exp(betaSum).toFixed(2);

    res.json({
      useCase,
      probPct: Number(probPct),
      riskScoreZ: Number(z.toFixed(2)),
      oddsRatioRelativo: Number(oddsRatioRelativo),
      riskLevel: probPct > 65 ? 'Crítico' : probPct > 35 ? 'Moderado' : 'Bajo',
      ic95: [(prob * 0.85 * 100).toFixed(1), (Math.min(prob * 1.15 * 100, 100)).toFixed(1)]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =========================================================================
// --- [15] PROCESS SUITE & [16] PROCESS MINING: ENDPOINTS E INTEGRACIONES ---
// =========================================================================

// [15] PROCESS SUITE: Modelos de Procesos BPMN
app.get('/api/process/models', async (req, res) => {
  try {
    const models = await BpmnProcess.findAll({ order: [['id', 'ASC']] });
    res.json(models);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/process/models', async (req, res) => {
  try {
    const count = await BpmnProcess.count();
    const processCode = req.body.processCode || `WF-PRC-${String(count + 1).padStart(2, '0')}`;
    const newProcess = await BpmnProcess.create({
      ...req.body,
      processCode
    });
    res.status(201).json(newProcess);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// [15] PROCESS SUITE: Bandeja de Tareas de Aprobación
app.get('/api/process/tasks', async (req, res) => {
  try {
    const { status } = req.query;
    const where = status ? { status } : {};
    const tasks = await ProcessTask.findAll({ where, order: [['id', 'DESC']] });
    const pendingCount = tasks.filter(t => t.status === 'Pendiente').length;
    res.json({ tasks, pendingCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/process/tasks', async (req, res) => {
  try {
    const count = await ProcessTask.count();
    const taskCode = `TSK-2026-${String(count + 1).padStart(3, '0')}`;
    const task = await ProcessTask.create({
      ...req.body,
      taskCode,
      status: 'Pendiente'
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// [15] RESOLVER TAREA DE APROBACIÓN (Impacto en módulo de origen)
app.post('/api/process/tasks/:code/resolve', async (req, res) => {
  try {
    const { action = 'Aprobar', notes = 'Aprobado conforme a políticas corporativas NyTEX' } = req.body;
    const task = await ProcessTask.findOne({ where: { taskCode: req.params.code } });
    if (!task) return res.status(404).json({ error: 'Tarea de workflow no encontrada' });

    task.status = action === 'Aprobar' ? 'Aprobada' : 'Rechazada';
    task.resolutionNotes = notes;
    task.resolvedAt = new Date().toISOString();
    await task.save();

    // Impacto en módulos conectados
    if (task.referenceCode && task.referenceCode.startsWith('PO-')) {
      const po = await PurchaseOrder.findOne({ where: { poCode: task.referenceCode } });
      if (po) {
        po.status = action === 'Aprobar' ? 'Aprobada' : 'Rechazada';
        await po.save();
      }
    } else if (task.referenceCode && task.referenceCode.startsWith('ORD-')) {
      const order = await SaleOrder.findOne({ where: { orderCode: task.referenceCode } });
      if (order) {
        order.status = action === 'Aprobar' ? 'Confirmado' : 'Rechazado';
        await order.save();
      }
    }

    // Registrar en logs de minería
    await ProcessEventLog.create({
      caseId: task.referenceCode || task.taskCode,
      processName: task.processName,
      activity: `Aprobación Directiva (${task.status})`,
      stageOrder: 3,
      timestamp: new Date().toISOString(),
      durationMinutes: 15,
      resource: task.assignedRole,
      status: task.status === 'Aprobada' ? 'Completado' : 'Re-trabajado',
      isBottleneck: false
    });

    res.json({
      success: true,
      message: `Tarea ${task.taskCode} ${task.status.toLowerCase()} con éxito. Módulo de origen actualizado.`,
      task
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// [16] PROCESS MINING: ANÁLISIS DE MINERÍA DE PROCESOS Y CUELLOS DE BOTELLA
app.get('/api/process/mining/summary', async (req, res) => {
  try {
    const logs = await ProcessEventLog.findAll({ order: [['id', 'ASC']] });
    
    // Agrupar por caseId
    const casesMap = {};
    logs.forEach(l => {
      if (!casesMap[l.caseId]) {
        casesMap[l.caseId] = {
          caseId: l.caseId,
          processName: l.processName,
          events: [],
          totalDurationMinutes: 0,
          hasBottleneck: false
        };
      }
      casesMap[l.caseId].events.push(l);
      casesMap[l.caseId].totalDurationMinutes += l.durationMinutes;
      if (l.isBottleneck) casesMap[l.caseId].hasBottleneck = true;
    });

    const cases = Object.values(casesMap);
    const totalCases = cases.length;
    const avgDurationMinutes = totalCases > 0 ? Math.round(cases.reduce((s, c) => s + c.totalDurationMinutes, 0) / totalCases) : 0;
    const conformingCases = cases.filter(c => !c.hasBottleneck).length;
    const conformanceRate = totalCases > 0 ? Math.round((conformingCases / totalCases) * 100) : 100;

    // Calcular estadísticas por actividad (Detección de Cuellos de Botella)
    const activitiesMap = {};
    logs.forEach(l => {
      if (!activitiesMap[l.activity]) {
        activitiesMap[l.activity] = {
          activity: l.activity,
          processName: l.processName,
          count: 0,
          totalDurationMinutes: 0,
          bottleneckCount: 0
        };
      }
      activitiesMap[l.activity].count += 1;
      activitiesMap[l.activity].totalDurationMinutes += l.durationMinutes;
      if (l.isBottleneck) activitiesMap[l.activity].bottleneckCount += 1;
    });

    const activityStats = Object.values(activitiesMap).map(a => {
      const avgMinutes = Math.round(a.totalDurationMinutes / a.count);
      return {
        ...a,
        avgMinutes,
        avgHours: (avgMinutes / 60).toFixed(1),
        isMajorBottleneck: avgMinutes > 120 || a.bottleneckCount > 0
      };
    }).sort((a, b) => b.avgMinutes - a.avgMinutes);

    // Direct Follows Graph (Transiciones entre nodos)
    const transitionsMap = {};
    cases.forEach(c => {
      for (let i = 0; i < c.events.length - 1; i++) {
        const from = c.events[i].activity;
        const to = c.events[i + 1].activity;
        const key = `${from} ➔ ${to}`;
        if (!transitionsMap[key]) {
          transitionsMap[key] = { from, to, count: 0, totalDuration: 0 };
        }
        transitionsMap[key].count += 1;
        transitionsMap[key].totalDuration += c.events[i + 1].durationMinutes;
      }
    });

    const transitions = Object.values(transitionsMap).map(t => ({
      ...t,
      avgMinutes: Math.round(t.totalDuration / t.count),
      avgHours: (t.totalDuration / (t.count * 60)).toFixed(1)
    }));

    res.json({
      metrics: {
        totalCases,
        totalEvents: logs.length,
        avgDurationMinutes,
        avgDurationHours: (avgDurationMinutes / 60).toFixed(1),
        conformanceRate,
        identifiedBottlenecksCount: activityStats.filter(a => a.isMajorBottleneck).length
      },
      activityStats,
      transitions,
      recentCases: cases.slice(-8).reverse()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// SIMULAR NUEVA INSTANCIA DESCUBIERTA EN PROCESS MINING
app.post('/api/process/mining/simulate-case', async (req, res) => {
  try {
    const count = await ProcessEventLog.count();
    const caseNum = String(Math.floor(Math.random() * 800) + 100);
    const caseId = `PED-2026-${caseNum}`;
    const now = new Date();

    const stageDurations = [15, 45, 180, 240, 30, 20]; // En minutos, con etapa 4 (Embarque) como cuello de botella
    const activities = [
      '1. Cotización Registrada en CRM/Ventas',
      '2. Pedido Aprobado por Crédito',
      '3. Surtido y Picking en WMS',
      '4. Despacho y Transporte en Logística',
      '5. Factura Emitida en CxC',
      '6. Cobro Liquidado en Tesorería'
    ];

    const newLogs = [];
    for (let i = 0; i < activities.length; i++) {
      const isBottleneck = i === 3; // Despacho logístico demorado
      const log = await ProcessEventLog.create({
        caseId,
        processName: 'Order-to-Cash (O2C)',
        activity: activities[i],
        stageOrder: i + 1,
        timestamp: new Date(now.getTime() - (activities.length - i) * 3600000).toISOString(),
        durationMinutes: stageDurations[i],
        resource: i === 2 ? 'Carlos Almacenista' : i === 3 ? 'Transportes Express' : 'Sistema Automático',
        status: isBottleneck ? 'Retrasado' : 'Completado',
        isBottleneck
      });
      newLogs.push(log);
    }

    res.json({
      success: true,
      message: `Nuevo caso ${caseId} procesado en Process Mining. Se detectó cuello de botella en ${activities[3]}.`,
      caseId,
      events: newLogs
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// MONITOR DE GOBERNANZA: Resumen general para la vista integrada
app.get('/api/circuit/procesos/summary', async (req, res) => {
  try {
    const models = await BpmnProcess.findAll();
    const tasks = await ProcessTask.findAll({ order: [['id', 'DESC']] });
    const pendingTasks = tasks.filter(t => t.status === 'Pendiente');
    
    // Obtener métricas de minería
    const logs = await ProcessEventLog.findAll();
    const casesCount = new Set(logs.map(l => l.caseId)).size;
    const bottleneckLogs = logs.filter(l => l.isBottleneck);

    res.json({
      models,
      tasks,
      metrics: {
        totalModels: models.length,
        deployedModels: models.filter(m => m.status === 'Desplegado').length,
        pendingTasksCount: pendingTasks.length,
        totalResolvedTasks: tasks.length - pendingTasks.length,
        analyzedCases: casesCount,
        totalEvents: logs.length,
        bottlenecksDetected: bottleneckLogs.length
      },
      pendingTasks: pendingTasks.slice(0, 5)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =========================================================================
// --- FASE 6: IA, ANALÍTICA PREDICTIVA, PLANEACIÓN S&OP & DASHBOARDS ---
// =========================================================================

// [19] DASHBOARDS OPERATIVOS & EJECUTIVOS (Datos Vivos del ERP)
app.get('/api/fase6/dashboards/metrics', async (req, res) => {
  try {
    const [orders, inventory, production, bankAccounts, cxc, employees, assets] = await Promise.all([
      SaleOrder.findAll(),
      InventoryItem.findAll(),
      ProductionOrder.findAll(),
      BankAccount.findAll(),
      AccountReceivable.findAll(),
      Employee.findAll(),
      FixedAsset.findAll()
    ]);

    const totalSales = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const totalInventoryValue = inventory.reduce((sum, i) => sum + ((i.stock || 0) * (i.unitCost || 0)), 0);
    const lowStockAlerts = inventory.filter(i => (i.stock || 0) <= (i.minStock || 0)).length;
    const totalBankBalance = bankAccounts.reduce((sum, b) => sum + (b.balance || 0), 0);
    const totalReceivables = cxc.reduce((sum, c) => sum + (c.balance || 0), 0);
    const totalAssetBookValue = assets.reduce((sum, a) => sum + (a.bookValue || 0), 0);

    const activeProductionOrders = production.filter(p => p.status !== 'Finalizada').length;
    const completedProductionRolls = production.filter(p => p.status === 'Finalizada').reduce((sum, p) => sum + (p.targetQuantity || 0), 0);

    // Métricas por Área para los Gráficos de Dashboards
    res.json({
      summary: {
        totalSales: Math.round(totalSales * 100) / 100,
        totalSalesOrdersCount: orders.length,
        totalInventoryValue: Math.round(totalInventoryValue * 100) / 100,
        lowStockAlerts,
        totalBankBalance: Math.round(totalBankBalance * 100) / 100,
        totalReceivables: Math.round(totalReceivables * 100) / 100,
        totalActiveEmployees: employees.filter(e => e.status === 'Activo').length,
        totalAssetBookValue: Math.round(totalAssetBookValue * 100) / 100,
        activeProductionOrders,
        completedProductionRolls
      },
      charts: {
        salesByStatus: {
          cotizaciones: orders.filter(o => o.status === 'Cotización').length,
          pedidos: orders.filter(o => o.status === 'Pedido').length,
          facturados: orders.filter(o => o.isInvoiced).length
        },
        inventoryByCategory: {
          materiaPrima: inventory.filter(i => i.category === 'Materia Prima').length,
          productoTerminado: inventory.filter(i => i.category === 'Producto Terminado').length,
          quimicos: inventory.filter(i => i.category.includes('Químicos') || i.category.includes('Insumos')).length
        },
        financialLiquidity: bankAccounts.map(b => ({
          bankName: b.bankName,
          balance: b.balance,
          currency: b.currency
        }))
      },
      recentOrders: orders.slice(-5).reverse(),
      productionSnapshot: production.slice(-5).reverse()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// [25] PLANEACIÓN S&OP / MRP II (Cálculo de Demanda vs Capacidad y Requerimientos de Insumos)
app.get('/api/fase6/planeacion/mrp', async (req, res) => {
  try {
    const orders = await SaleOrder.findAll();
    const inventory = await InventoryItem.findAll();
    const production = await ProductionOrder.findAll();
    const assets = await FixedAsset.findAll();

    // 1. Demanda Comprometida en Pedidos (Rollos de Tela Jersey)
    const confirmedOrders = orders.filter(o => o.status === 'Pedido' || o.status === 'Confirmado' || o.status === 'Entregado');
    let totalRollsDemanded = 0;
    confirmedOrders.forEach(o => {
      (o.items || []).forEach(it => {
        totalRollsDemanded += (parseFloat(it.quantity) || 1);
      });
    });
    if (totalRollsDemanded === 0) totalRollsDemanded = 50; // Base para planeación si es nuevo

    // 2. Parámetros de Transformación Textil (BOM / Telar Circular)
    // 1 Rollo de Tela (20 kg) requiere: 21 kg de Hilatura de Algodón (5% merma técnica) y 2.5 horas de telar
    const kgYarnPerRoll = 21;
    const hoursPerRoll = 2.5;

    const totalYarnRequiredKg = totalRollsDemanded * kgYarnPerRoll;
    const totalLoomHoursRequired = totalRollsDemanded * hoursPerRoll;

    // Stock actual de hilatura en inventario
    const yarnItem = inventory.find(i => i.name.includes('Algodón') || i.sku.includes('HIL')) || {
      sku: 'MAT-HIL-01',
      name: 'Hilatura 100% Algodón Peinado 30/1',
      stock: 450,
      unitCost: 85,
      minStock: 200
    };

    const currentYarnStockKg = yarnItem.stock || 450;
    const yarnDeficitKg = Math.max(0, totalYarnRequiredKg - currentYarnStockKg);
    const purchaseCostRequired = Math.round(yarnDeficitKg * (yarnItem.unitCost || 85));

    // Capacidad instalada mensual (Telares disponibles)
    const looms = assets.filter(a => a.category.includes('Maquinaria') || a.name.includes('Telar'));
    const totalLoomsCount = Math.max(looms.length, 2);
    const monthlyLoomCapacityHours = totalLoomsCount * 24 * 25; // 2 telares * 24h * 25 días útiles = 1200 horas
    const loomUtilizationPct = Math.min(100, Math.round((totalLoomHoursRequired / monthlyLoomCapacityHours) * 100));

    res.json({
      planningPeriod: 'Octubre 2026 (Mensual S&OP)',
      demand: {
        totalRollsDemanded,
        confirmedOrdersCount: confirmedOrders.length,
        leadTimeAvgDays: 14
      },
      mrp: {
        materialSku: yarnItem.sku,
        materialName: yarnItem.name,
        totalRequiredKg: totalYarnRequiredKg,
        currentStockKg: currentYarnStockKg,
        deficitKg: yarnDeficitKg,
        suggestedPurchaseAmount: purchaseCostRequired,
        recommendedSupplier: 'Hilados y Fibras Sintéticas S.A. (BP-003)',
        urgency: yarnDeficitKg > 0 ? 'Requerida Orden de Compra Inmediata' : 'Stock Suficiente'
      },
      capacity: {
        totalLoomHoursRequired,
        monthlyLoomCapacityHours,
        loomUtilizationPct,
        activeLooms: totalLoomsCount,
        status: loomUtilizationPct > 85 ? 'Capacidad Saturada (>85%)' : 'Capacidad Óptima'
      },
      suggestedActions: [
        {
          id: 'act-1',
          type: 'Compras',
          title: `Generar Orden de Compra por ${yarnDeficitKg} kg de ${yarnItem.name}`,
          amount: purchaseCostRequired,
          moduleTarget: 'Compras [4]'
        },
        {
          id: 'act-2',
          type: 'Producción',
          title: `Programar Orden Fabril en Telar Circular Mayer & Cie (${totalRollsDemanded} rollos)`,
          hours: totalLoomHoursRequired,
          moduleTarget: 'Producción [5]'
        }
      ]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// [25] GENERACIÓN AUTOMÁTICA DE ÓRDENES DESDE PLANEACIÓN S&OP
app.post('/api/fase6/planeacion/generate-orders', async (req, res) => {
  try {
    const { rolls = 50, kgYarn = 600 } = req.body;
    
    // 1. Crear Orden de Producción Fabril en [5]
    const opCount = await ProductionOrder.count();
    const opCode = `OP-2026-${String(opCount + 1).padStart(3, '0')}`;
    const newOP = await ProductionOrder.create({
      opCode,
      productSku: 'TEL-JER-01',
      productName: 'Tela de Punto Jersey 100% Algodón Crudo (20kg/rollo)',
      targetQuantity: parseFloat(rolls),
      unit: 'rollos',
      bom: [
        { sku: 'MAT-HIL-01', name: 'Hilo de Algodón Peinado 30/1', requiredQuantity: parseFloat(kgYarn), unit: 'kg' }
      ],
      operator: 'Ing. Supervisor Fabril',
      workcenter: 'Telar Circular Mayer & Cie #3 - Planta 1',
      startDate: new Date().toISOString().split('T')[0],
      finishDate: new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0],
      status: 'Planificada'
    });

    // 2. Crear Orden de Compra en [4]
    const poCount = await PurchaseOrder.count();
    const poCode = `PO-2026-${String(poCount + 1).padStart(4, '0')}`;
    const totalAmount = Math.round(parseFloat(kgYarn) * 85);
    const newPO = await PurchaseOrder.create({
      poCode,
      vendorCode: 'BP-003',
      vendorName: 'Hilados y Fibras Sintéticas S.A.',
      items: [
        { sku: 'MAT-HIL-01', name: 'Hilo de Algodón Peinado 30/1', quantity: parseFloat(kgYarn), unitPrice: 85, total: totalAmount }
      ],
      subtotal: totalAmount,
      tax: Math.round(totalAmount * 0.13),
      total: Math.round(totalAmount * 1.13),
      paymentTerms: 'Crédito 30 días',
      deliveryDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
      status: 'Aprobada'
    });

    res.json({
      success: true,
      message: `Plan S&OP ejecutado con éxito: Se emitieron la Orden Fabril ${opCode} en Producción [5] y la Orden de Compra ${poCode} en Compras [4].`,
      productionOrder: newOP,
      purchaseOrder: newPO
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// [23] IA ASISTENTE TEXTIL & DIAGNÓSTICO COGNITIVO EN VIVO
app.post('/api/fase6/ia/chat', async (req, res) => {
  try {
    const { prompt = '' } = req.body;
    const lower = prompt.toLowerCase();

    // Consultar datos reales del sistema para fundamentar el razonamiento de la IA
    const [orders, inventory, bankAccounts, cxc, production] = await Promise.all([
      SaleOrder.findAll(),
      InventoryItem.findAll(),
      BankAccount.findAll(),
      AccountReceivable.findAll(),
      ProductionOrder.findAll()
    ]);

    const totalBankBalance = bankAccounts.reduce((sum, b) => sum + (b.balance || 0), 0);
    const totalSales = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const totalReceivables = cxc.reduce((sum, c) => sum + (c.balance || 0), 0);
    const lowStockItems = inventory.filter(i => (i.stock || 0) <= (i.minStock || 0));

    let reply = '';
    let category = 'General';
    let recommendations = [];
    let keyMetrics = [];

    if (lower.includes('inventario') || lower.includes('stock') || lower.includes('compras') || lower.includes('materia')) {
      category = 'Inventario & Cadena de Suministro';
      reply = `He auditado el inventario central textil. Actualmente contamos con **${inventory.length} SKUs activos** con una valoración de inventario en almacén. Se detectaron **${lowStockItems.length} insumos en nivel crítico** por debajo del stock mínimo de seguridad. La demanda de tejeduría proyectada requiere asegurar compras inmediatas de hilatura de algodón con el proveedor *Hilados y Fibras Sintéticas (BP-003)* para evitar paros de telar.`;
      recommendations = [
        'Emitir Orden de Compra urgente por hilatura de algodón peinado 30/1.',
        'Revisar el punto de reorden en WMS para programar recepción en Pasillo A - Racks 01.',
        'Verificar condiciones de pago a 30 días para no comprometer flujo de tesorería.'
      ];
      keyMetrics = [
        { label: 'SKUs Críticos', value: `${lowStockItems.length} insumos` },
        { label: 'Stock Hilatura', value: '450 kg disponibles' },
        { label: 'Déficit Proyectado', value: '600 kg requeridos' }
      ];
    } else if (lower.includes('cxc') || lower.includes('mora') || lower.includes('cobranza') || lower.includes('crédito') || lower.includes('riesgo')) {
      category = 'Riesgo Crediticio & CxC';
      reply = `El análisis del modelo predictivo Logit sobre la cartera de cuentas por cobrar revela una cartera total de **$${totalReceivables.toLocaleString()} USD**. El cliente con mayor riesgo detectado es *Distribuidora Textil del Norte* (Score Z: +1.28, probabilidad de mora > 68% debido a disputas previas y línea de crédito al 85%).`;
      recommendations = [
        'Condicionar nuevos despachos comerciales a la liquidación de facturas vencidas.',
        'Activar recordatorio automático de cobro vía notificación antes del vencimiento a 30 días.',
        'No autorizar incremento de línea de crédito sin garantía prendaria o pagaré aval.'
      ];
      keyMetrics = [
        { label: 'Cartera en CxC', value: `$${totalReceivables.toLocaleString()} USD` },
        { label: 'Probabilidad de Mora Max', value: '68.5% (Crítico)' },
        { label: 'Score Z Relativo', value: '+1.28' }
      ];
    } else if (lower.includes('producción') || lower.includes('telar') || lower.includes('capacidad') || lower.includes('fabril')) {
      category = 'Manufactura & Eficiencia Fabril';
      reply = `En Planta 1 de Tejeduría, los telares circulares Mayer & Cie Relanit 3.2 II operan con una utilización estimada del **78% de la capacidad mensual instalada** (936 horas programadas de 1,200 horas disponibles). Los parámetros de tensión y velocidad a 850 RPM se encuentran dentro del rango óptimo, pero es vital asegurar que la humedad relativa en nave no baje del 55% para evitar roturas de hilo.`;
      recommendations = [
        'Mantener programa de lubricación preventiva en agujas cada 120 horas de marcha.',
        'Secuenciar las partidas de tela cruda previo a teñido para reducir tiempos de cambio.',
        'Monitorear el cuello de botella detectado por Process Mining en la liberación hacia transporte.'
      ];
      keyMetrics = [
        { label: 'Utilización Telar', value: '78.2%' },
        { label: 'Órdenes Activas', value: `${production.length} órdenes` },
        { label: 'Horas Máquina', value: '125 h estimadas' }
      ];
    } else {
      category = 'Diagnóstico Ejecutivo Global';
      reply = `Resumen integral del ecosistema NyTEX: Las ventas acumuladas registran **$${totalSales.toLocaleString()} USD**, respaldadas por una liquidez líquida en bancos de **$${totalBankBalance.toLocaleString()} USD** en Tesorería. La balanza contable central cuadra al 100% y el ciclo operativo O2C y P2P opera con 5 circuitos sincronizados.`;
      recommendations = [
        'Coordinar el plan S&OP de octubre entre Ventas y Producción para nivelar carga en telares.',
        'Acelerar la cobranza en CxC para sostener el ritmo de dispersión salarial y compras de materia prima.',
        'Revisar la bandeja de aprobaciones de Process Suite para destrabar órdenes de compra mayores.'
      ];
      keyMetrics = [
        { label: 'Ventas Totales', value: `$${totalSales.toLocaleString()} USD` },
        { label: 'Saldo en Tesorería', value: `$${totalBankBalance.toLocaleString()} USD` },
        { label: 'Balanza Contable', value: 'Cuadre 100% (Debe = Haber)' }
      ];
    }

    res.json({
      prompt,
      category,
      reply,
      recommendations,
      keyMetrics,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// MONITOR DE FASE 6: Resumen Central del Circuito de IA & Planeación
app.get('/api/circuit/ia-planeacion/summary', async (req, res) => {
  try {
    const [orders, inventory, bankAccounts, production, assets] = await Promise.all([
      SaleOrder.findAll(),
      InventoryItem.findAll(),
      BankAccount.findAll(),
      ProductionOrder.findAll(),
      FixedAsset.findAll()
    ]);

    const totalSales = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const totalBankBalance = bankAccounts.reduce((sum, b) => sum + (b.balance || 0), 0);
    const activeProductionCount = production.filter(p => p.status !== 'Finalizada').length;

    res.json({
      metrics: {
        totalSales,
        totalBankBalance,
        activeProductionCount,
        totalSkus: inventory.length,
        loonsCount: assets.filter(a => a.category.includes('Maquinaria')).length || 2,
        iaModelStatus: 'Online (Conectado a BD SQLite)',
        mrpEngineStatus: 'Calculado (S&OP Octubre 2026)',
        predictiveEngineStatus: 'Activo (ARIMA & Logit)'
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =========================================================================
// --- FASE 7: ANALÍTICA MASIVA, BI, DATA MINING & GOBERNANZA CENTRAL ---
// =========================================================================

// [20] BUSINESS INTELLIGENCE (BI): Cubo Multidimensional OLAP
app.get('/api/fase7/bi/cube', async (req, res) => {
  try {
    const orders = await SaleOrder.findAll();
    const inventory = await InventoryItem.findAll();

    const periods = ['2026-Q1', '2026-Q2', '2026-Q3', '2026-Q4 (Proy.)'];
    const productFamilies = ['Jersey 100% Algodón Crudo', 'Rib Spandex Elástano', 'Piqué Deportivo Dry-Fit', 'Felpa Francesa Fleece'];
    const customerSegments = ['Mayoristas Confección', 'Distribuidores Regionales', 'Cadenas Retail / Marcas Propias'];
    const regions = ['Norte (Monterrey)', 'Bajío (León)', 'Centro (CDMX / Puebla)', 'Exportación (Texas / California)'];

    const cubeData = [
      { period: '2026-Q1', family: 'Jersey 100% Algodón Crudo', segment: 'Mayoristas Confección', region: 'Norte (Monterrey)', revenue: 1450000, cost: 980000, margin: 470000, marginPct: 32.4, volumeKg: 17050 },
      { period: '2026-Q1', family: 'Rib Spandex Elástano', segment: 'Cadenas Retail / Marcas Propias', region: 'Centro (CDMX / Puebla)', revenue: 890000, cost: 580000, margin: 310000, marginPct: 34.8, volumeKg: 7410 },
      { period: '2026-Q2', family: 'Piqué Deportivo Dry-Fit', segment: 'Distribuidores Regionales', region: 'Bajío (León)', revenue: 1120000, cost: 720000, margin: 400000, marginPct: 35.7, volumeKg: 9330 },
      { period: '2026-Q2', family: 'Jersey 100% Algodón Crudo', segment: 'Mayoristas Confección', region: 'Centro (CDMX / Puebla)', revenue: 1680000, cost: 1120000, margin: 560000, marginPct: 33.3, volumeKg: 19760 },
      { period: '2026-Q3', family: 'Felpa Francesa Fleece', segment: 'Cadenas Retail / Marcas Propias', region: 'Norte (Monterrey)', revenue: 1340000, cost: 850000, margin: 490000, marginPct: 36.5, volumeKg: 10300 },
      { period: '2026-Q3', family: 'Rib Spandex Elástano', segment: 'Mayoristas Confección', region: 'Exportación (Texas / California)', revenue: 2150000, cost: 1390000, margin: 760000, marginPct: 35.3, volumeKg: 16530 },
      { period: '2026-Q4 (Proy.)', family: 'Jersey 100% Algodón Crudo', segment: 'Distribuidores Regionales', region: 'Norte (Monterrey)', revenue: 1820000, cost: 1210000, margin: 610000, marginPct: 33.5, volumeKg: 21410 },
      { period: '2026-Q4 (Proy.)', family: 'Felpa Francesa Fleece', segment: 'Cadenas Retail / Marcas Propias', region: 'Centro (CDMX / Puebla)', revenue: 1490000, cost: 940000, margin: 550000, marginPct: 36.9, volumeKg: 11460 }
    ];

    const totalRevenue = cubeData.reduce((acc, c) => acc + c.revenue, 0);
    const totalCost = cubeData.reduce((acc, c) => acc + c.cost, 0);
    const totalMargin = totalRevenue - totalCost;
    const avgMarginPct = Math.round((totalMargin / totalRevenue) * 1000) / 10;
    const totalVolumeKg = cubeData.reduce((acc, c) => acc + c.volumeKg, 0);

    res.json({
      dimensions: {
        periods,
        productFamilies,
        customerSegments,
        regions
      },
      cubeData,
      kpis: {
        totalRevenue,
        totalCost,
        totalMargin,
        avgMarginPct,
        totalVolumeKg,
        activeSlicesCount: cubeData.length
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// [18] BI Y REPORTES: Generador de Reportes Financieros y Operativos
app.get('/api/fase7/reports/list', (req, res) => {
  res.json([
    {
      id: 'pnl',
      code: 'REP-FIN-01',
      title: 'Estado de Resultados Integral (P&L Consolidado)',
      category: 'Financiero',
      format: 'NIF B-3 / IFRS',
      description: 'Ingresos netos por ventas, costo de manufactura fabril, margen bruto, gastos de operación (nómina y depreciación) y EBITDA.'
    },
    {
      id: 'trial_balance',
      code: 'REP-FIS-02',
      title: 'Balanza de Comprobación Fiscal SAT (Anexo 24)',
      category: 'Fiscal / Contable',
      format: 'SAT XML / NIF A-5',
      description: 'Catálogo de cuentas agrupador SAT con saldo inicial, movimientos deudores/acreedores y saldo final estrictamente cuadrado.'
    },
    {
      id: 'kardex',
      code: 'REP-OPE-03',
      title: 'Kardex Valuado de Inventario de Hilatura y Fibras',
      category: 'Operativo',
      format: 'Costo Promedio Ponderado',
      description: 'Movimientos de entrada por órdenes de compra, consumo en telares circulares y existencias valuadas por almacén.'
    },
    {
      id: 'oee',
      code: 'REP-IND-04',
      title: 'Reporte de Eficiencia Global de Planta Textil (OEE)',
      category: 'Industrial',
      format: 'World Class Manufacturing',
      description: 'Disponibilidad de telares Mayer & Cie, velocidad real de marcha e índice de calidad de metros sin tara.'
    }
  ]);
});

app.get('/api/fase7/reports/generate', async (req, res) => {
  try {
    const { reportType = 'pnl', period = '2026-Q3' } = req.query;
    const [orders, purchases, entries, assets, employees, payrolls] = await Promise.all([
      SaleOrder.findAll(),
      PurchaseOrder.findAll(),
      JournalEntry.findAll(),
      FixedAsset.findAll(),
      Employee.findAll(),
      PayrollRun.findAll()
    ]);

    const salesTotal = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const purchasesTotal = purchases.reduce((sum, p) => sum + (p.total || 0), 0);
    const payrollTotal = payrolls.reduce((sum, pr) => sum + (pr.totalGross || 0), 0);
    const monthlyDepreciation = assets.reduce((sum, a) => sum + (a.monthlyDepreciation || 0), 0);

    let reportData = {};

    if (reportType === 'pnl') {
      const grossMargin = salesTotal - purchasesTotal * 0.75;
      const opExpenses = payrollTotal + monthlyDepreciation;
      const ebitda = grossMargin - opExpenses;
      const taxes = Math.max(0, ebitda * 0.30);
      const netIncome = ebitda - taxes;

      reportData = {
        title: 'Estado de Resultados Integral (P&L)',
        code: 'REP-FIN-01',
        currency: 'USD',
        period,
        headers: ['Concepto Contable', 'Importe ($ USD)', '% Sobre Ventas'],
        rows: [
          { concept: '(+) Ingresos Netos por Venta de Tejido', amount: salesTotal, pct: '100.0%' },
          { concept: '(-) Costo de Ventas (Materia Prima & Tejeduría)', amount: -Math.round(purchasesTotal * 0.75), pct: `${((purchasesTotal * 0.75 / (salesTotal || 1)) * 100).toFixed(1)}%` },
          { concept: '(=) Utilidad Bruta Industrial', amount: Math.round(grossMargin), pct: `${((grossMargin / (salesTotal || 1)) * 100).toFixed(1)}%`, isTotal: true },
          { concept: '(-) Gastos de Personal y Nómina IMSS/SAT', amount: -Math.round(payrollTotal), pct: `${((payrollTotal / (salesTotal || 1)) * 100).toFixed(1)}%` },
          { concept: '(-) Depreciación Acelerada de Maquinaria y Telares', amount: -Math.round(monthlyDepreciation), pct: `${((monthlyDepreciation / (salesTotal || 1)) * 100).toFixed(1)}%` },
          { concept: '(=) EBITDA Operativo', amount: Math.round(ebitda), pct: `${((ebitda / (salesTotal || 1)) * 100).toFixed(1)}%`, isTotal: true },
          { concept: '(-) Provisión Impuesto Sobre la Renta (ISR 30%)', amount: -Math.round(taxes), pct: '30.0%' },
          { concept: '(=) Utilidad Neta del Ejercicio', amount: Math.round(netIncome), pct: `${((netIncome / (salesTotal || 1)) * 100).toFixed(1)}%`, isFinalTotal: true }
        ],
        stamp: {
          auditor: 'C.P. Mariana Garza - Dirección de Auditoría Interna',
          certNumber: 'SAT-CFDI-40001000000504465028',
          verifiedAt: new Date().toISOString()
        }
      };
    } else if (reportType === 'trial_balance') {
      reportData = {
        title: 'Balanza de Comprobación Fiscal SAT (Anexo 24)',
        code: 'REP-FIS-02',
        period,
        headers: ['Cuenta SAT', 'Descripción', 'Saldo Inicial', 'Debe (Cargos)', 'Haber (Abonos)', 'Saldo Final'],
        rows: [
          { code: '101.01', name: 'Bancos e Instituciones Financieras (BBVA/Banorte)', init: 1200000, debit: salesTotal, credit: payrollTotal + purchasesTotal, final: 1200000 + salesTotal - payrollTotal - purchasesTotal },
          { code: '105.01', name: 'Clientes Nacionales (Cartera CxC)', init: 85000, debit: salesTotal, credit: salesTotal * 0.85, final: 85000 + salesTotal * 0.15 },
          { code: '115.01', name: 'Inventario de Materias Primas e Hilados', init: 140000, debit: purchasesTotal, credit: purchasesTotal * 0.7, final: 140000 + purchasesTotal * 0.3 },
          { code: '152.01', name: 'Maquinaria y Equipo Industrial (Telares Mayer & Cie)', init: 3600000, debit: 0, credit: 0, final: 3600000 },
          { code: '201.01', name: 'Proveedores Nacionales (CxP Fibras)', init: 60000, debit: purchasesTotal * 0.8, credit: purchasesTotal, final: 60000 + purchasesTotal * 0.2 },
          { code: '401.01', name: 'Ventas Gravadas Tasa General 13%', init: 0, debit: 0, credit: salesTotal, final: salesTotal }
        ],
        stamp: {
          auditor: 'Despacho Ruiz & Asociados S.C. - Dictamen Limpio',
          certNumber: 'SAT-FIEL-894729104859012',
          verifiedAt: new Date().toISOString()
        }
      };
    } else {
      reportData = {
        title: 'Reporte Operativo de Eficiencia de Planta (OEE)',
        code: 'REP-IND-04',
        period,
        headers: ['Equipo / Centro de Trabajo', 'Disponibilidad (%)', 'Rendimiento (%)', 'Calidad (%)', 'OEE Final (%)'],
        rows: [
          { name: 'Telar Circular Mayer & Cie Relanit #1', disp: '92.4%', rend: '88.5%', cal: '99.1%', oee: '81.0%' },
          { name: 'Telar Circular Mayer & Cie Relanit #2', disp: '94.1%', rend: '91.2%', cal: '98.7%', oee: '84.7%' },
          { name: 'Autoclave de Teñido a Presión Thies #1', disp: '89.0%', rend: '93.0%', cal: '97.5%', oee: '80.7%' },
          { name: 'Rama Tensora y Secadora Monforts #1', disp: '95.0%', rend: '87.4%', cal: '99.4%', oee: '82.5%' }
        ],
        stamp: {
          auditor: 'Ing. Supervisor Fabril de Calidad ISO 9001',
          certNumber: 'ISO-TEX-2026-CERT-991',
          verifiedAt: new Date().toISOString()
        }
      };
    }

    res.json(reportData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// [21] BIG DATA: Telemetría Industrial IoT & Data Lake de Planta Textil
let dataLakeStats = {
  totalIngestedRecords: 42854910,
  dataLakeSizeGb: 18.64,
  ingestionRatePerSec: 1250,
  activeIoTSensors: 96,
  brokerProtocol: 'MQTT / Apache Kafka / Parquet Lakehouse',
  lastBatchTimestamp: new Date().toISOString()
};

app.get('/api/fase7/bigdata/telemetry', async (req, res) => {
  try {
    const randomVariation = () => (Math.random() - 0.5) * 0.8;
    const machines = [
      { id: 'TEL-MC-01', name: 'Telar Mayer & Cie #1 (Single Jersey)', type: 'Tejeduría Circular', rpm: +(31.2 + randomVariation()).toFixed(1), tempC: +(72.4 + randomVariation()).toFixed(1), tensionCn: +(15.8 + randomVariation()).toFixed(1), vibrationMmS: +(2.4 + randomVariation()).toFixed(2), fabricMMin: +(1.4 + randomVariation() * 0.1).toFixed(2), status: 'Normal' },
      { id: 'TEL-MC-02', name: 'Telar Mayer & Cie #2 (Rib Elástano)', type: 'Tejeduría Circular', rpm: +(29.8 + randomVariation()).toFixed(1), tempC: +(74.1 + randomVariation()).toFixed(1), tensionCn: +(18.2 + randomVariation()).toFixed(1), vibrationMmS: +(2.8 + randomVariation()).toFixed(2), fabricMMin: +(1.2 + randomVariation() * 0.1).toFixed(2), status: 'Normal' },
      { id: 'TEL-MC-03', name: 'Telar Mayer & Cie #3 (Piqué Deportivo)', type: 'Tejeduría Circular', rpm: +(32.0 + randomVariation()).toFixed(1), tempC: +(76.8 + randomVariation()).toFixed(1), tensionCn: +(16.1 + randomVariation()).toFixed(1), vibrationMmS: +(3.1 + randomVariation()).toFixed(2), fabricMMin: +(1.5 + randomVariation() * 0.1).toFixed(2), status: 'Normal' },
      { id: 'TEL-MC-04', name: 'Telar Mayer & Cie #4 (Felpa 3 Hilos)', type: 'Tejeduría Circular', rpm: +(27.5 + randomVariation()).toFixed(1), tempC: +(79.2 + randomVariation()).toFixed(1), tensionCn: +(21.4 + randomVariation()).toFixed(1), vibrationMmS: +(4.3 + randomVariation()).toFixed(2), fabricMMin: +(1.1 + randomVariation() * 0.1).toFixed(2), status: 'Advertencia (Tensión Alta)' },
      { id: 'TEL-MC-05', name: 'Telar Mayer & Cie #5 (Interlock Fino)', type: 'Tejeduría Circular', rpm: +(30.5 + randomVariation()).toFixed(1), tempC: +(71.0 + randomVariation()).toFixed(1), tensionCn: +(14.9 + randomVariation()).toFixed(1), vibrationMmS: +(2.2 + randomVariation()).toFixed(2), fabricMMin: +(1.3 + randomVariation() * 0.1).toFixed(2), status: 'Normal' },
      { id: 'AUT-TH-01', name: 'Autoclave Teñido Thies Jet #1', type: 'Tintorería a Presión', rpm: 0, tempC: +(128.5 + randomVariation()).toFixed(1), tensionCn: 0, vibrationMmS: +(1.1 + randomVariation()).toFixed(2), fabricMMin: 0, status: 'Normal', bathPressureBar: +(3.2 + randomVariation() * 0.1).toFixed(2), bathPh: +(5.8 + randomVariation() * 0.1).toFixed(2) }
    ];

    res.json({
      lakeStats: dataLakeStats,
      activeUnitsCount: machines.length,
      machines,
      recentAlerts: [
        { id: 'ALT-991', machine: 'TEL-MC-04', type: 'Tensión de Trama Elevada', severity: 'Warning', value: '21.4 cN (Límite: 20 cN)', timestamp: 'Hace 4 min' },
        { id: 'ALT-989', machine: 'TEL-MC-02', type: 'Paro Micro-sensor Rotura de Hilo', severity: 'Info', value: 'Alimentador 14 - Auto reanudado', timestamp: 'Hace 38 min' }
      ]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/fase7/bigdata/ingest-batch', async (req, res) => {
  try {
    const { batchSize = 10000 } = req.body;
    dataLakeStats.totalIngestedRecords += batchSize;
    dataLakeStats.dataLakeSizeGb = +(dataLakeStats.dataLakeSizeGb + (batchSize * 0.0004)).toFixed(3);
    dataLakeStats.lastBatchTimestamp = new Date().toISOString();

    await AuditLog.create({
      timestamp: new Date().toISOString(),
      action: 'DATA_LAKE_INGESTION_BATCH',
      module: 'BigData',
      user: 'pipeline-iot@system.nytex.com',
      ipAddress: '10.0.4.12 (Kafka Ingestion Node)',
      details: `Lote de ${batchSize.toLocaleString()} registros de telemetría IoT ingerido en Delta Lake Parquet. Total: ${dataLakeStats.totalIngestedRecords.toLocaleString()} eventos.`,
      severity: 'INFO'
    });

    res.json({
      success: true,
      message: `Lote de ${batchSize.toLocaleString()} lecturas de sensores IoT procesado exitosamente.`,
      updatedLakeStats: dataLakeStats
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// [22] MINERÍA DE DATOS: Clustering K-Means & Reglas de Asociación Apriori
app.get('/api/fase7/datamining/clusters', async (req, res) => {
  try {
    const clusters = [
      {
        id: 0,
        name: 'Cluster 0: Clientes VIP / Alta Fidelidad',
        color: '#10B981',
        count: 14,
        avgRecencyDays: 6,
        avgFrequencyOrders: 22,
        avgMonetaryAmount: 485000,
        strategy: 'Atención personalizada, línea de crédito preferente y entrega prioritaria en 24h.',
        representative: 'Distribuidora Textil del Norte S.A.'
      },
      {
        id: 1,
        name: 'Cluster 1: En Crecimiento / Alto Potencial',
        color: '#3B82F6',
        count: 28,
        avgRecencyDays: 14,
        avgFrequencyOrders: 9,
        avgMonetaryAmount: 142000,
        strategy: 'Venta cruzada con muestras de nuevas telas deportivas y descuentos por volumen.',
        representative: 'Confecciones del Bajío S.A.'
      },
      {
        id: 2,
        name: 'Cluster 2: En Riesgo / Latentes de Abandono',
        color: '#EF4444',
        count: 11,
        avgRecencyDays: 68,
        avgFrequencyOrders: 3,
        avgMonetaryAmount: 45000,
        strategy: 'Campaña de reactivación comercial vía CRM y renegociación de cartera vencida en CxC.',
        representative: 'Manufacturas del Valle'
      },
      {
        id: 3,
        name: 'Cluster 3: Nuevos Compradores Exploratorios',
        color: '#F59E0B',
        count: 19,
        avgRecencyDays: 11,
        avgFrequencyOrders: 1,
        avgMonetaryAmount: 32000,
        strategy: 'Seguimiento post-venta inmediato para incentivar el segundo pedido con bonificación de flete.',
        representative: 'Boutique Diseños Urbanos'
      }
    ];

    const scatterPoints = [
      { name: 'Distribuidora Textil del Norte', recency: 4, frequency: 24, monetary: 540000, cluster: 0 },
      { name: 'Modas y Confecciones El Águila', recency: 7, frequency: 19, monetary: 430000, cluster: 0 },
      { name: 'Confecciones del Bajío', recency: 12, frequency: 11, monetary: 165000, cluster: 1 },
      { name: 'Textiles Guadalajara', recency: 16, frequency: 8, monetary: 120000, cluster: 1 },
      { name: 'Pantalones y Tejidos León', recency: 18, frequency: 7, monetary: 98000, cluster: 1 },
      { name: 'Manufacturas del Valle', recency: 65, frequency: 3, monetary: 48000, cluster: 2 },
      { name: 'Deportivos Puebla', recency: 78, frequency: 2, monetary: 38000, cluster: 2 },
      { name: 'Boutique Diseños Urbanos', recency: 9, frequency: 1, monetary: 34000, cluster: 3 },
      { name: 'Uniformes Industriales San Luis', recency: 13, frequency: 1, monetary: 29000, cluster: 3 }
    ];

    res.json({
      model: 'K-Means Clustering no Supervisado (k=4)',
      metric: 'RFM Normalizado (Recencia, Frecuencia, Valor Monetario)',
      silhouetteScore: 0.784,
      totalAnalyzedPartners: 72,
      clusters,
      scatterPoints
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/fase7/datamining/rules', (req, res) => {
  res.json({
    algorithm: 'Apriori Association Rules Mining',
    minSupport: 0.20,
    minConfidence: 0.75,
    totalTransactionsAnalyzed: 1420,
    rules: [
      {
        id: 'R-01',
        antecedent: ['Tela Jersey 100% Algodón Crudo'],
        consequent: ['Hilo de Algodón Peinado 30/1'],
        support: 0.44,
        confidence: 0.89,
        lift: 2.14,
        insight: 'El 89% de clientes que solicitan tejido Jersey demandan adicionalmente bobinas de hilo peinado para acabados.'
      },
      {
        id: 'R-02',
        antecedent: ['Piqué Deportivo Dry-Fit'],
        consequent: ['Elástano Spandex 40D'],
        support: 0.31,
        confidence: 0.94,
        lift: 3.28,
        insight: 'Fuerte acoplamiento entre confección de telas elásticas y adición de fibra sintética Spandex en tejeduría.'
      },
      {
        id: 'R-03',
        antecedent: ['Tinte Reactivo Azul Marino', 'Fijador de Color'],
        consequent: ['Suavizante Textil Catiónico'],
        support: 0.26,
        confidence: 0.82,
        lift: 2.45,
        insight: 'Los procesos de tintorería por agotamiento con colorantes reactivos compran casi siempre suavizante de terminación.'
      },
      {
        id: 'R-04',
        antecedent: ['Felpa Francesa Fleece'],
        consequent: ['Rib Elástano Spandex (Puños y Cuellos)'],
        support: 0.28,
        confidence: 0.85,
        lift: 2.70,
        insight: 'Fabricantes de sudaderas compran tejido de cuerpo en conjunto con rib complementario para confección integral.'
      }
    ]
  });
});

// [26] CONFIGURACIÓN: Administración Global, Datos Fiscales & Bitácora de Auditoría
app.get('/api/fase7/config/company', async (req, res) => {
  try {
    let [config] = await CompanyConfig.findOrCreate({
      where: { id: 1 },
      defaults: {}
    });
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/fase7/config/company', async (req, res) => {
  try {
    let config = await CompanyConfig.findByPk(1);
    if (!config) {
      config = await CompanyConfig.create(req.body);
    } else {
      await config.update(req.body);
    }

    await AuditLog.create({
      timestamp: new Date().toISOString(),
      action: 'UPDATE_COMPANY_CONFIG',
      module: 'Configuracion',
      user: 'admin@consultores-nyt.com',
      ipAddress: '192.168.1.105',
      details: `Parámetros corporativos y fiscales actualizados: Razón Social="${config.companyName}", RFC="${config.rfc}", Tipo Cambio USD=${config.exchangeRateUsd}`,
      severity: 'WARNING'
    });

    res.json(config);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/fase7/config/audit-log', async (req, res) => {
  try {
    const logs = await AuditLog.findAll({
      order: [['id', 'DESC']],
      limit: 60
    });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/fase7/config/roles', (req, res) => {
  res.json([
    {
      role: 'Super Admin',
      description: 'Acceso irrestricto a los 26 módulos del ecosistema, configuración contable, auditoría y control de seguridad.',
      usersCount: 2,
      permissions: ['ALL_PERMISSIONS', 'AUDIT_VIEW', 'FISCAL_CONFIG', 'PROCESS_DEPLOY']
    },
    {
      role: 'Distribuidor Partner',
      description: 'Gestión comercial extendida, órdenes de venta, compras asociadas, almacén WMS y minería de procesos.',
      usersCount: 5,
      permissions: ['SALES_FULL', 'PURCHASES_FULL', 'WMS_PICKING', 'PROCESS_INBOX']
    },
    {
      role: 'Director Financiero / Contador',
      description: 'Gestión exclusiva de Contabilidad, Pólizas, Tesorería, Balanza Fiscal, CxC, CxP, Activos Fijos y Nómina.',
      usersCount: 3,
      permissions: ['ACCOUNTING_ENTRIES', 'SPEI_DISBURSEMENT', 'FISCAL_REPORTS', 'PAYROLL_POST']
    },
    {
      role: 'Jefe de Planta / Producción',
      description: 'Supervisión de Piso Fabril, Órdenes de Producción, Telemetría Big Data de Telares, S&OP y Mantenimiento.',
      usersCount: 6,
      permissions: ['PRODUCTION_MANUFACTURING', 'TELEMETRY_BIGDATA', 'SOP_PLANNING', 'MAINTENANCE_VIEW']
    }
  ]);
});

// =========================================================================
// --- MONITOR DEL CIRCUITO 7: GOBERNANZA, ANALÍTICA & BIG DATA ---
// =========================================================================
app.get('/api/circuit/gobernanza/summary', async (req, res) => {
  try {
    const [config, auditCount, orders, bankAccounts] = await Promise.all([
      CompanyConfig.findByPk(1),
      AuditLog.count(),
      SaleOrder.findAll(),
      BankAccount.findAll()
    ]);

    const totalSales = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const totalLiquidity = bankAccounts.reduce((sum, b) => sum + (b.balance || 0), 0);

    res.json({
      circuitName: 'Circuito 7: Inteligencia de Negocios, Big Data y Gobernanza Global',
      company: config ? config.companyName : 'NyTEX Textil de Centroamérica S.A. de C.V.',
      country: config ? config.country : 'El Salvador',
      taxAuthority: config ? config.taxAuthority : 'Ministerio de Hacienda (MH)',
      electronicDocType: config ? config.electronicDocType : 'DTE (Facturación Electrónica)',
      rfc: config ? config.rfc : '0614-180612-102-4',
      taxStatus: 'Cumplimiento Tributario Positivo (MH / SAT / DGT)',
      dataLakeVolume: `${dataLakeStats.dataLakeSizeGb} GB (${dataLakeStats.totalIngestedRecords.toLocaleString()} eventos IoT)`,
      auditTrailEvents: auditCount || 24,
      cubeRevenueMxn: totalSales,
      cubeRevenueUsd: totalSales,
      treasuryLiquidity: totalLiquidity,
      ecosystemIntegrity: '100% (26 de 26 Módulos Enlazados)',
      governanceStatus: 'Conforme a Normas NIF, Auditoría Fiscal e ISO 9001'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =========================================================================
// --- LOS 4 CIRCUITOS DE DEMOSTRACIÓN ALINEADOS A LAS 4 FASES COMERCIALES ---
// =========================================================================

// FASE 1: NYTEX STARTER (7 Módulos: Ventas, Inventario, Compras, Contabilidad, CxC, CxP, Tesorería)
app.get('/api/fases/fase1/summary', async (req, res) => {
  try {
    const [orders, inventory, purchases, cxc, cxp, bankAccounts, entries] = await Promise.all([
      SaleOrder.findAll(),
      InventoryItem.findAll(),
      PurchaseOrder.findAll(),
      AccountReceivable.findAll(),
      AccountPayable.findAll(),
      BankAccount.findAll(),
      JournalEntry.findAll()
    ]);

    const totalSales = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const totalInventoryValuation = inventory.reduce((sum, i) => sum + (i.stock * i.unitCost), 0);
    const totalPurchases = purchases.reduce((sum, p) => sum + (p.total || 0), 0);
    const totalCxc = cxc.reduce((sum, c) => sum + (c.balance || 0), 0);
    const totalCxp = cxp.reduce((sum, p) => sum + (p.balance || 0), 0);
    const totalLiquidity = bankAccounts.reduce((sum, b) => sum + (b.balance || 0), 0);

    res.json({
      phaseId: 1,
      phaseName: 'Fase 1: NyTEX Starter',
      subtitle: 'Control Transaccional Núcleo',
      price: '$35 USD / mes',
      implementation: '$0 USD',
      moduleCount: 7,
      modules: ['Ventas', 'Inventario', 'Compras', 'Contabilidad', 'CxC', 'CxP', 'Tesoreria'],
      metrics: {
        totalSales,
        ordersCount: orders.length,
        totalInventoryValuation,
        inventorySkusCount: inventory.length,
        totalPurchases,
        purchasesCount: purchases.length,
        totalCxc,
        totalCxp,
        totalLiquidity,
        bankAccountsCount: bankAccounts.length,
        entriesCount: entries.length,
        accountingStatus: 'Balanza Cuadrada al 100% (Debe = Haber)'
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/fases/fase1/simulate', async (req, res) => {
  try {
    const count = await SaleOrder.count();
    const orderCode = `PED-ST-${String(count + 1).padStart(3, '0')}`;
    const subtotal = 41810.34;
    const tax = Math.round(subtotal * 0.13 * 100) / 100; // 5435.34
    const amount = Math.round((subtotal + tax) * 100) / 100; // 47245.68

    // 1. Crear Venta
    const order = await SaleOrder.create({
      orderCode,
      clientCode: 'BP-001',
      clientName: 'Distribuidora Textil del Norte S.A.',
      clientRfc: 'DTN980312TX1',
      deliveryAddress: 'Parque Industrial Huinalá, Apodaca, N.L.',
      items: [{ sku: 'TEL-JER-01', name: 'Tela Jersey 100% Algodón Crudo', quantity: 20, unitPrice: 2090.52, total: 41810.34 }],
      subtotal,
      tax,
      total: amount,
      paymentTerms: 'Contado Bancario',
      carrier: 'Transportes Express del Norte',
      freightCost: 0,
      status: 'Entregado'
    });

    // 2. Registrar cobro en Tesorería
    const bbva = await BankAccount.findOne({ where: { bankCode: 'BCO-BBVA-01' } });
    if (bbva) {
      await bbva.update({ balance: bbva.balance + amount });
      await BankTransaction.create({
        txCode: `TX-ST-${Date.now().toString().slice(-4)}`,
        bankCode: 'BCO-BBVA-01',
        type: 'Ingreso',
        category: 'Cobranza Clientes',
        amount,
        date: new Date().toISOString().split('T')[0],
        concept: `Cobro en línea Pedido Starter ${orderCode}`,
        reference: orderCode,
        reconciled: true
      });
    }

    // 3. Póliza Contable
    await createAutoJournalEntry({
      type: 'Ingreso',
      concept: `Póliza Transaccional Starter: Venta y Cobro de ${orderCode}`,
      originModule: 'Ventas & Bancos',
      originReference: orderCode,
      lines: [
        { accountCode: '101.01', accountName: 'Bancos - BBVA Bancomer', debit: amount, credit: 0 },
        { accountCode: '401.01', accountName: 'Ventas de Tejido Tasa 13%', debit: 0, credit: subtotal },
        { accountCode: '208.01', accountName: 'IVA Trasladado Cobrado (13%)', debit: 0, credit: tax }
      ]
    });

    res.json({
      success: true,
      message: `Ciclo Starter ejecutado: Venta ${orderCode} facturada, $${amount.toLocaleString()} USD depositados en Tesorería y Póliza contable registrada.`,
      order
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// FASE 2: NYTEX EXPRESS (15 Módulos: Starter + CRM, WMS, Logística, Producción, RRHH, Nómina, Dashboards, Process Suite)
app.get('/api/fases/fase2/summary', async (req, res) => {
  try {
    const [production, employees, payrolls, tasks, logs] = await Promise.all([
      ProductionOrder.findAll(),
      Employee.findAll(),
      PayrollRun.findAll(),
      ProcessTask.findAll(),
      ProcessEventLog.findAll()
    ]);

    const activeLooms = production.filter(p => p.status !== 'Finalizada').length;
    const totalRollsPlanned = production.reduce((sum, p) => sum + (p.targetQuantity || 0), 0);
    const lastPayroll = payrolls[0] || {};
    const pendingBpmTasks = tasks.filter(t => t.status === 'Pendiente').length;

    res.json({
      phaseId: 2,
      phaseName: 'Fase 2: NyTEX Express',
      subtitle: 'Productividad, Cadena Operativa & Nómina',
      price: '$149 USD / mes',
      implementation: '$1,500 USD',
      moduleCount: 15,
      modules: ['Ventas', 'Inventario', 'Compras', 'Contabilidad', 'CxC', 'CxP', 'Tesoreria', 'CRM', 'WMS', 'Logistica', 'Produccion', 'RRHH', 'Nomina', 'Dashboards', 'ProcessSuite'],
      metrics: {
        activeLoomsCount: activeLooms,
        totalRollsPlanned,
        activeEmployeesCount: employees.length,
        lastPayrollDisbursed: lastPayroll.totalNet || 109720,
        pendingBpmTasks,
        wmsPickingZonesCount: 4,
        fleetTrucksActiveCount: 3,
        oeeAverage: '82.4% (Planta Tejeduría)',
        bpmStatus: 'Workflows BPMN 2.0 Operativos'
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/fases/fase2/simulate', async (req, res) => {
  try {
    const opCount = await ProductionOrder.count();
    const opCode = `OP-EXP-${String(opCount + 1).padStart(3, '0')}`;

    // 1. Crear Orden Fabril en Telar
    const op = await ProductionOrder.create({
      opCode,
      productSku: 'TEL-RIB-02',
      productName: 'Rib Elástano Spandex 95/5 (20kg/rollo)',
      targetQuantity: 35,
      unit: 'rollos',
      bom: [
        { sku: 'MAT-HIL-01', name: 'Hilo de Algodón Peinado 30/1', requiredQuantity: 665, unit: 'kg' },
        { sku: 'MAT-SPX-02', name: 'Fibra Spandex 40D', requiredQuantity: 35, unit: 'kg' }
      ],
      operator: 'Ing. Supervisor Fabril',
      workcenter: 'Telar Circular Mayer & Cie #2 - Planta 1',
      startDate: new Date().toISOString().split('T')[0],
      finishDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
      scrapsPct: 1.2,
      status: 'En Proceso'
    });

    // 2. Registrar Tarea BPMN en Process Suite
    await ProcessTask.create({
      taskCode: `TSK-EXP-${Date.now().toString().slice(-4)}`,
      processCode: 'O2C-PROD',
      processName: 'Aprobación de Despacho y Calidad Fabril',
      title: `Liberación de Calidad para ${opCode}`,
      referenceCode: opCode,
      requester: 'Piso de Planta - Tejeduría',
      assignedRole: 'Supervisor de Calidad',
      priority: 'Alta',
      amount: 45000,
      deadline: new Date(Date.now() + 48 * 3600000).toISOString().split('T')[0],
      status: 'Pendiente'
    });

    res.json({
      success: true,
      message: `Ciclo Express ejecutado: Orden Fabril ${opCode} montada en Telar Mayer & Cie #2, asignada a WMS y enviada a bandeja de aprobación BPMN.`,
      op
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// FASE 3: NYTEX ADVANCED (20 Módulos: Express + BI, BI y Reportes, Big Data, Planeación S&OP, Activos Fijos)
app.get('/api/fases/fase3/summary', async (req, res) => {
  try {
    const [assets, orders] = await Promise.all([
      FixedAsset.findAll(),
      SaleOrder.findAll()
    ]);

    const totalAssetsValue = assets.reduce((sum, a) => sum + (a.bookValue || 0), 0);
    const monthlyDepreciation = assets.reduce((sum, a) => sum + (a.monthlyDepreciation || 0), 0);
    const totalSales = orders.reduce((sum, o) => sum + (o.total || 0), 0);

    res.json({
      phaseId: 3,
      phaseName: 'Fase 3: NyTEX Advanced',
      subtitle: 'Inteligencia de Negocios, S&OP & Data Lake',
      price: '$299 USD / mes',
      implementation: '$4,500 USD',
      moduleCount: 20,
      modules: ['Ventas', 'Inventario', 'Compras', 'Contabilidad', 'CxC', 'CxP', 'Tesoreria', 'CRM', 'WMS', 'Logistica', 'Produccion', 'RRHH', 'Nomina', 'Dashboards', 'ProcessSuite', 'BI', 'BIyReportes', 'BigData', 'Planeacion', 'ActivosFijos'],
      metrics: {
        totalAssetsValue,
        assetsCount: assets.length,
        monthlyDepreciation,
        dataLakeSizeGb: dataLakeStats.dataLakeSizeGb,
        iotRecordsCount: dataLakeStats.totalIngestedRecords,
        activeSensorsCount: 96,
        olapQuarterlySales: totalSales,
        olapGrossMarginPct: '34.8%',
        mrpSopStatus: 'Capacidad Fabril Equilibrada (78% utilización)',
        reportsGenerated: 'P&L NIF B-3 y Balanza Fiscal SAT Validados'
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/fases/fase3/simulate', async (req, res) => {
  try {
    // 1. Ingesta Big Data
    dataLakeStats.totalIngestedRecords += 10000;
    dataLakeStats.dataLakeSizeGb = +(dataLakeStats.dataLakeSizeGb + 0.004).toFixed(3);

    // 2. Registrar en auditoría
    await AuditLog.create({
      timestamp: new Date().toISOString(),
      action: 'ADVANCED_SOP_RECALC',
      module: 'Planeacion',
      user: 'planner@consultores-nyt.com',
      ipAddress: '192.168.1.130',
      details: 'Ejecución de motor MRP II con cálculo matricial OLAP y telemetría de 96 sensores IoT.',
      severity: 'INFO'
    });

    res.json({
      success: true,
      message: 'Ciclo Advanced ejecutado: Ingesta de +10,000 registros en Data Lake, recálculo S&OP de capacidad de telares y sincronización del Cubo OLAP.',
      lakeStats: dataLakeStats
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// FASE 4: NYTEX ENTERPRISE (26 Módulos - Ecosistema Completo 100%)
app.get('/api/fases/fase4/summary', async (req, res) => {
  try {
    const [partners, logs, config, orders] = await Promise.all([
      BusinessPartner.findAll(),
      AuditLog.findAll(),
      CompanyConfig.findByPk(1),
      SaleOrder.findAll()
    ]);

    res.json({
      phaseId: 4,
      phaseName: 'Fase 4: NyTEX Enterprise',
      subtitle: 'Anticipación, IA Cognitiva & Escala Global',
      price: '$499 USD / mes',
      implementation: 'Cotización a Medida',
      moduleCount: 26,
      modules: ALL_26_MODULES,
      metrics: {
        totalPartnersCount: partners.length,
        auditLogsCount: logs.length,
        aiAssistantModel: 'NyTEX Textile Copilot v4.2 (SQLite Conectado)',
        predictiveModel: 'ARIMA (Demanda) + Logit (Score de Cobranza)',
        clusteringModel: 'K-Means RFM (k=4, Silhouette 0.784)',
        associationRulesModel: 'Apriori (Lift máx 3.28x)',
        processMiningStatus: 'Direct-Follows Graph (DFG) con detección de cuellos de botella',
        fiscalStatus: 'Cumplimiento Fiscal y Trazabilidad Inmutable (DTE / SAT / SAR / DGI)',
        ecosystemCompleteness: '100% (26 de 26 Módulos Enlazados)'
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/fases/fase4/simulate', async (req, res) => {
  try {
    await AuditLog.create({
      timestamp: new Date().toISOString(),
      action: 'ENTERPRISE_AI_AUDIT',
      module: 'IA',
      user: 'copilot-ia@system.nytex.com',
      ipAddress: '10.0.0.1 (AI Node)',
      details: 'Auditoría cognitiva 360° ejecutada en los 26 módulos: K-Means re-evaluado, proyección ARIMA actualizada y bitácora fiscal inmutable sellada (Cumplimiento DTE / SAT / Regional).',
      severity: 'INFO'
    });

    res.json({
      success: true,
      message: 'Auditoría Enterprise 360° completada: La IA Cognitiva inspeccionó las 26 bases de datos, actualizó predicciones ARIMA de ventas y validó el cumplimiento SAT.',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// --- SINCRONIZACIÓN Y SEEDS COMPLETOS ---
// ==========================================

const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    await sequelize.sync({ alter: true });
    
    // Seed 1: Business Partners
    const bpCount = await BusinessPartner.count();
    if (bpCount === 0) {
      await BusinessPartner.bulkCreate([
        { code: 'BP-001', name: 'Distribuidora Textil del Norte S.A.', type: 'Cliente', contactName: 'María González', email: 'mgonzalez@dtextil.com', phone: '81-8123-4567', address: 'Parque Industrial Apodaca, N.L.', balance: 54200 },
        { code: 'BP-002', name: 'Confecciones del Bajío S.A.', type: 'Cliente', contactName: 'Carlos Ruiz', email: 'cruiz@bajiotextil.com', phone: '47-7890-1234', address: 'León, Guanajuato', balance: 32000 },
        { code: 'BP-003', name: 'Hilados y Fibras Sintéticas S.A.', type: 'Proveedor', contactName: 'John Smith', email: 'jsmith@hilados.com', phone: '55-5555-8888', address: 'Tlalnepantla, Edo. Mex', balance: -45000 },
        { code: 'BP-004', name: 'Transportes Express del Norte', type: 'Fletero', contactName: 'Roberto Méndez', email: 'rmendez@transnorte.com', phone: '81-2345-6789', address: 'Escobedo, N.L.', balance: 0 },
        { code: 'BP-005', name: 'Químicos y Colorantes de México', type: 'Proveedor', contactName: 'Laura Vega', email: 'lvega@quimicosmex.com', phone: '33-3333-2222', address: 'Guadalajara, Jalisco', balance: -18000 }
      ]);
      console.log('Seed: Business Partners insertados.');
    }

    // Seed 2: Cuentas Bancarias en Tesorería
    const bankCount = await BankAccount.count();
    if (bankCount === 0) {
      await BankAccount.bulkCreate([
        { bankCode: 'BCO-BBVA-01', bankName: 'BBVA Bancomer Corporativo', accountNumber: '0129-4820-9912', currency: 'USD', balance: 1450000, type: 'Cheques / Operativa' },
        { bankCode: 'BCO-BNTE-02', bankName: 'Banorte Tesorería & Nómina', accountNumber: '0729-1029-4411', currency: 'USD', balance: 680000, type: 'Cheques / Operativa' },
        { bankCode: 'BCO-CAJA-03', bankName: 'Caja Chica y Efectivo Operativo', accountNumber: 'CAJA-GEN-001', currency: 'USD', balance: 45000, type: 'Caja' }
      ]);

      await BankTransaction.create({
        txCode: 'TX-ING-0001',
        bankCode: 'BCO-BBVA-01',
        type: 'Ingreso',
        category: 'Aportación de Capital',
        amount: 1450000,
        date: '2026-09-01',
        concept: 'Saldo Inicial de Operaciones Corporativas',
        reference: 'APOR-CAP-001',
        reconciled: true
      });
      console.log('Seed: Tesorería insertada.');
    }

    // Seed 3: Activos Fijos
    const assetCount = await FixedAsset.count();
    if (assetCount === 0) {
      await FixedAsset.bulkCreate([
        { assetCode: 'AF-MAQ-01', name: 'Telar Circular Mayer & Cie Relanit 3.2 II', category: 'Maquinaria & Equipo Fabril', acquisitionDate: '2025-01-15', acquisitionCost: 1850000, usefulLifeYears: 10, depreciationRateAnnual: 10, accumulatedDepreciation: 154166.67, bookValue: 1695833.33, assignedTo: 'Planta 1 - Tejeduría', status: 'En Operación' },
        { assetCode: 'AF-VEH-02', name: 'Camión Isuzu Forward 800 (Caja Seca)', category: 'Vehículos de Transporte', acquisitionDate: '2025-06-20', acquisitionCost: 950000, usefulLifeYears: 5, depreciationRateAnnual: 20, accumulatedDepreciation: 158333.33, bookValue: 791666.67, assignedTo: 'Logística & Despachos', status: 'En Operación' },
        { assetCode: 'AF-CMP-03', name: 'Servidor Central Dell PowerEdge R750', category: 'Equipo de Cómputo', acquisitionDate: '2025-11-10', acquisitionCost: 220000, usefulLifeYears: 3, depreciationRateAnnual: 33.33, accumulatedDepreciation: 61105.00, bookValue: 158895.00, assignedTo: 'Centro de Datos NyTEX', status: 'En Operación' }
      ]);
      console.log('Seed: Activos Fijos insertados.');
    }

    // Seed 4: Pólizas Contables Iniciales
    const entryCount = await JournalEntry.count();
    if (entryCount === 0) {
      await JournalEntry.bulkCreate([
        {
          entryCode: 'POL-2026-0001',
          type: 'Ingreso',
          date: '2026-09-01',
          concept: 'Aportación de Capital y Apertura de Cuentas Bancarias',
          originModule: 'Tesorería',
          originReference: 'APOR-CAP-001',
          lines: [
            { accountCode: '1101-01', accountName: 'Bancos Nacionales (BBVA)', debit: 1450000, credit: 0 },
            { accountCode: '3101-01', accountName: 'Capital Social Fijo', debit: 0, credit: 1450000 }
          ],
          totalDebit: 1450000,
          totalCredit: 1450000,
          status: 'Cuadrada'
        },
        {
          entryCode: 'POL-2026-0002',
          type: 'Diario',
          date: '2026-09-15',
          concept: 'Depreciación Acumulada Ejercicio Anterior',
          originModule: 'Activos Fijos',
          originReference: 'AF-INIT-2026',
          lines: [
            { accountCode: '6103-01', accountName: 'Gasto por Depreciación de Maquinaria y Equipo', debit: 373605, credit: 0 },
            { accountCode: '1209-01', accountName: 'Depreciación Acumulada de Activos Fijos', debit: 0, credit: 373605 }
          ],
          totalDebit: 373605,
          totalCredit: 373605,
          status: 'Cuadrada'
        }
      ]);
      console.log('Seed: Pólizas Contables insertadas.');
    }

    // Seed 5: Talento Humano (Colaboradores e Incidencias Iniciales)
    const empCount = await Employee.count();
    if (empCount === 0) {
      await Employee.bulkCreate([
        {
          employeeCode: 'EMP-001',
          fullName: 'Ing. Roberto Morales Garza',
          rfc: 'MOGR850612TX1',
          curp: 'MOGR850612HNLRLR09',
          nss: '48028599120',
          department: 'Producción Fabril',
          jobTitle: 'Supervisor Fabril de Tejeduría',
          contractType: 'Tiempo Indeterminado',
          dailySalary: 850,
          integratedDailySalary: 892.50,
          monthlySalary: 25500,
          bankName: 'Banorte',
          bankAccount: '072910001827361920',
          hireDate: '2023-04-01',
          status: 'Activo',
          avatar: '👨‍🏭'
        },
        {
          employeeCode: 'EMP-002',
          fullName: 'Carlos Ramírez Almacenista',
          rfc: 'RAAC901103NL2',
          curp: 'RAAC901103HNLMC001',
          nss: '48109012345',
          department: 'Logística & WMS',
          jobTitle: 'Encargado de Racks & Picking',
          contractType: 'Tiempo Indeterminado',
          dailySalary: 520,
          integratedDailySalary: 546.00,
          monthlySalary: 15600,
          bankName: 'Banorte',
          bankAccount: '072910004928172635',
          hireDate: '2024-02-15',
          status: 'Activo',
          avatar: '📦'
        },
        {
          employeeCode: 'EMP-003',
          fullName: 'Laura Méndez Vázquez',
          rfc: 'MEVL940820MN3',
          curp: 'MEVL940820MNLNZ002',
          nss: '48149488371',
          department: 'Producción Fabril',
          jobTitle: 'Operadora Especialista de Telar',
          contractType: 'Tiempo Indeterminado',
          dailySalary: 460,
          integratedDailySalary: 483.00,
          monthlySalary: 13800,
          bankName: 'Banorte',
          bankAccount: '072910003819273645',
          hireDate: '2024-06-01',
          status: 'Activo',
          avatar: '👩‍🔧'
        },
        {
          employeeCode: 'EMP-004',
          fullName: 'Lic. Alejandro Castillo Ríos',
          rfc: 'CARA881215TX4',
          curp: 'CARA881215HNLSTL03',
          nss: '48088819284',
          department: 'Ventas & Comercial',
          jobTitle: 'Ejecutivo de Cuentas Clave Textil',
          contractType: 'Tiempo Indeterminado',
          dailySalary: 750,
          integratedDailySalary: 787.50,
          monthlySalary: 22500,
          bankName: 'BBVA',
          bankAccount: '012910007826354182',
          hireDate: '2023-09-10',
          status: 'Activo',
          avatar: '💼'
        },
        {
          employeeCode: 'EMP-005',
          fullName: 'C.P. Mariana Garza Elizondo',
          rfc: 'GAEM920405TX5',
          curp: 'GAEM920405MNLRZ004',
          nss: '48129204918',
          department: 'Administración & Finanzas',
          jobTitle: 'Especialista Contable & Nóminas',
          contractType: 'Tiempo Indeterminado',
          dailySalary: 800,
          integratedDailySalary: 840.00,
          monthlySalary: 24000,
          bankName: 'Banorte',
          bankAccount: '072910009827361524',
          hireDate: '2023-02-01',
          status: 'Activo',
          avatar: '👩‍💼'
        },
        {
          employeeCode: 'EMP-006',
          fullName: 'Javier Treviño Santos',
          rfc: 'TESJ870314NL6',
          curp: 'TESJ870314HNLRL005',
          nss: '48078749281',
          department: 'Logística & Despachos',
          jobTitle: 'Operador de Unidad de Reparto',
          contractType: 'Tiempo Indeterminado',
          dailySalary: 490,
          integratedDailySalary: 514.50,
          monthlySalary: 14700,
          bankName: 'Banorte',
          bankAccount: '072910006718293041',
          hireDate: '2024-03-20',
          status: 'Activo',
          avatar: '🚚'
        }
      ]);

      await AttendanceIncident.bulkCreate([
        {
          incidentCode: 'INC-2026-001',
          employeeCode: 'EMP-003',
          employeeName: 'Laura Méndez Vázquez',
          date: '2026-09-20',
          type: 'Horas Extra Dobles',
          hours: 4,
          multiplier: 2,
          notes: 'Cobertura de guardia nocturna por alta demanda de tejeduría',
          status: 'Aprobada',
          periodCode: 'NOM-2026-Q18'
        },
        {
          incidentCode: 'INC-2026-002',
          employeeCode: 'EMP-002',
          employeeName: 'Carlos Ramírez Almacenista',
          date: '2026-09-18',
          type: 'Falta Injustificada',
          hours: 8,
          multiplier: 1,
          notes: 'Ausencia sin justificante médico reportada por supervisor WMS',
          status: 'Aprobada',
          periodCode: 'NOM-2026-Q18'
        },
        {
          incidentCode: 'INC-2026-003',
          employeeCode: 'EMP-006',
          employeeName: 'Javier Treviño Santos',
          date: '2026-09-22',
          type: 'Horas Extra Dobles',
          hours: 3,
          multiplier: 2,
          notes: 'Retorno tardío de entrega foránea en Saltillo',
          status: 'Aprobada',
          periodCode: 'NOM-2026-Q18'
        }
      ]);

      await PayrollRun.create({
        periodCode: 'NOM-2026-Q18',
        periodName: '2da Quincena Septiembre 2026',
        periodType: 'Quincenal',
        startDate: '2026-09-16',
        endDate: '2026-09-30',
        payDate: '2026-09-30',
        status: 'Borrador',
        employeesCount: 6,
        bankSourceAccount: 'BCO-BNTE-02'
      });

      console.log('Seed: Colaboradores, Incidencias y Periodo de Nómina insertados.');
    }

    // Seed 6: Gobernanza de Procesos & Minería (BPMN y Event Logs)
    const procCount = await BpmnProcess.count();
    if (procCount === 0) {
      await BpmnProcess.bulkCreate([
        {
          processCode: 'WF-COM-01',
          name: 'Aprobación de Órdenes de Compra Mayores (> $50,000 USD)',
          category: 'Compras & Abastecimiento',
          version: 'v2.3',
          description: 'Flujo de autorización escalonada para adquisiciones de materia prima que superen el límite operativo estándar.',
          slaHours: 24,
          activeInstances: 3,
          steps: [
            { step: 1, name: 'Requisición de Compras', role: 'Comprador' },
            { step: 2, name: 'Validación de Presupuesto', role: 'Contralor' },
            { step: 3, name: 'Visto Bueno Dirección', role: 'Director de Finanzas' },
            { step: 4, name: 'Emisión de PO a Proveedor', role: 'Sistema' }
          ],
          status: 'Desplegado'
        },
        {
          processCode: 'WF-VNT-02',
          name: 'Autorización de Crédito Extraordinario a Clientes',
          category: 'Ventas & Crédito',
          version: 'v1.8',
          description: 'Evaluación de solvencia y ampliación de límite de crédito comercial con validación en Buró y score de mora CxC.',
          slaHours: 12,
          activeInstances: 2,
          steps: [
            { step: 1, name: 'Solicitud Comercial', role: 'Ejecutivo de Cuenta' },
            { step: 2, name: 'Score Predictivo CxC', role: 'IA & Analítica' },
            { step: 3, name: 'Autorización Dirección', role: 'Director General' },
            { step: 4, name: 'Actualización en Business Partners', role: 'Sistema' }
          ],
          status: 'Desplegado'
        },
        {
          processCode: 'WF-PRD-03',
          name: 'Liberación de Calidad Fabril & Entrada a Almacén',
          category: 'Producción & Calidad',
          version: 'v3.0',
          description: 'Protocolo de inspección textil de rollos producidos en telar Mayer & Cie previo al etiquetado WMS.',
          slaHours: 6,
          activeInstances: 4,
          steps: [
            { step: 1, name: 'Pesaje e Inspección Visual', role: 'Operador Telar' },
            { step: 2, name: 'Prueba de Resistencia Textil', role: 'Ing. Calidad' },
            { step: 3, name: 'Generación de QR y Ubicación en Racks', role: 'WMS' }
          ],
          status: 'Desplegado'
        },
        {
          processCode: 'WF-NOM-04',
          name: 'Autorización de Nómina & Dispersión SPEI',
          category: 'Talento & Nómina',
          version: 'v1.4',
          description: 'Aprobación directiva del costo patronal y fondos bancarios para la dispersión quincenal de nómina.',
          slaHours: 8,
          activeInstances: 1,
          steps: [
            { step: 1, name: 'Cierre de Incidencias RRHH', role: 'Especialista RRHH' },
            { step: 2, name: 'Auditoría Fiscal SAT/IMSS', role: 'Contador General' },
            { step: 3, name: 'Liberación de SPEI Bancario', role: 'Director de Tesorería' }
          ],
          status: 'Desplegado'
        }
      ]);

      await ProcessTask.bulkCreate([
        {
          taskCode: 'TSK-2026-001',
          processCode: 'WF-COM-01',
          processName: 'Aprobación de Órdenes de Compra Mayores',
          title: 'Aprobar Orden de Compra Hilados de Algodón #PO-2026-0001',
          referenceCode: 'PO-2026-0001',
          requester: 'Laura Vega (Compras)',
          assignedRole: 'Director de Finanzas',
          priority: 'Alta',
          amount: 84500,
          deadline: '2026-09-30 18:00',
          status: 'Pendiente',
          resolutionNotes: null
        },
        {
          taskCode: 'TSK-2026-002',
          processCode: 'WF-VNT-02',
          processName: 'Autorización de Crédito Extraordinario a Clientes',
          title: 'Ampliación de Línea de Crédito: Distribuidora Textil del Norte ($120,000 USD)',
          referenceCode: 'BP-001',
          requester: 'Lic. Alejandro Castillo (Ventas)',
          assignedRole: 'Director General',
          priority: 'Urgente',
          amount: 120000,
          deadline: '2026-09-29 14:00',
          status: 'Pendiente',
          resolutionNotes: null
        },
        {
          taskCode: 'TSK-2026-003',
          processCode: 'WF-PRD-03',
          processName: 'Liberación de Calidad Fabril & Entrada a Almacén',
          title: 'Inspección Lote Tela Jersey Crudo 100% Algodón (OP-2026-001)',
          referenceCode: 'OP-2026-001',
          requester: 'Ing. Roberto Morales (Planta 1)',
          assignedRole: 'Supervisor de Calidad',
          priority: 'Media',
          amount: 500,
          deadline: '2026-09-28 20:00',
          status: 'Aprobada',
          resolutionNotes: 'Cumple especificación de densidad 180 g/m2.',
          resolvedAt: '2026-09-27T14:30:00Z'
        }
      ]);

      // Event Logs históricos para Process Mining
      const now = new Date();
      const casesData = [
        {
          caseId: 'PED-2026-001',
          events: [
            { activity: '1. Cotización Registrada en CRM/Ventas', duration: 25, delayMin: 300, resource: 'María Asesora' },
            { activity: '2. Pedido Aprobado por Crédito', duration: 40, delayMin: 240, resource: 'Contralor' },
            { activity: '3. Surtido y Picking en WMS', duration: 75, delayMin: 180, resource: 'Carlos Almacenista' },
            { activity: '4. Despacho y Transporte en Logística', duration: 210, delayMin: 90, resource: 'Roberto Fletero', isBottleneck: true },
            { activity: '5. Factura Emitida en CxC', duration: 15, delayMin: 40, resource: 'Facturación' },
            { activity: '6. Cobro Liquidado en Tesorería', duration: 20, delayMin: 10, resource: 'C.P. Mariana Garza' }
          ]
        },
        {
          caseId: 'PED-2026-002',
          events: [
            { activity: '1. Cotización Registrada en CRM/Ventas', duration: 20, delayMin: 280, resource: 'María Asesora' },
            { activity: '2. Pedido Aprobado por Crédito', duration: 35, delayMin: 220, resource: 'Contralor' },
            { activity: '3. Surtido y Picking en WMS', duration: 60, delayMin: 150, resource: 'Carlos Almacenista' },
            { activity: '4. Despacho y Transporte en Logística', duration: 195, delayMin: 80, resource: 'Roberto Fletero', isBottleneck: true },
            { activity: '5. Factura Emitida en CxC', duration: 12, delayMin: 30, resource: 'Facturación' },
            { activity: '6. Cobro Liquidado en Tesorería', duration: 18, delayMin: 5, resource: 'C.P. Mariana Garza' }
          ]
        },
        {
          caseId: 'PED-2026-003',
          events: [
            { activity: '1. Cotización Registrada en CRM/Ventas', duration: 30, delayMin: 200, resource: 'Alejandro Castillo' },
            { activity: '2. Pedido Aprobado por Crédito', duration: 150, delayMin: 140, resource: 'Dirección Finanzas', isBottleneck: true },
            { activity: '3. Surtido y Picking en WMS', duration: 55, delayMin: 80, resource: 'Carlos Almacenista' },
            { activity: '4. Despacho y Transporte en Logística', duration: 90, delayMin: 40, resource: 'Javier Treviño' },
            { activity: '5. Factura Emitida en CxC', duration: 15, delayMin: 20, resource: 'Facturación' },
            { activity: '6. Cobro Liquidado en Tesorería', duration: 25, delayMin: 0, resource: 'C.P. Mariana Garza' }
          ]
        }
      ];

      for (const cd of casesData) {
        let order = 1;
        for (const ev of cd.events) {
          await ProcessEventLog.create({
            caseId: cd.caseId,
            processName: 'Order-to-Cash (O2C)',
            activity: ev.activity,
            stageOrder: order++,
            timestamp: new Date(now.getTime() - ev.delayMin * 60000).toISOString(),
            durationMinutes: ev.duration,
            resource: ev.resource,
            status: ev.isBottleneck ? 'Retrasado' : 'Completado',
            isBottleneck: !!ev.isBottleneck
          });
        }
      }

      console.log('Seed: Workflows BPMN, Tareas y Event Logs de Minería insertados.');
    }

    // Seed 7: Configuración Corporativa y Bitácora de Auditoría
    const cfgCount = await CompanyConfig.count();
    if (cfgCount === 0) {
      await CompanyConfig.create({
        companyName: 'NyTEX Textil de México S.A. de C.V.',
        rfc: 'NTM180612TX4',
        taxRegime: '601 - General de Ley Personas Morales',
        fiscalAddress: 'Av. de las Industrias Textiles 450, Parque Industrial Huinalá, Apodaca, N.L. C.P. 66645',
        baseCurrency: 'USD',
        exchangeRateUsd: 19.85,
        exchangeRateEur: 21.40,
        vatRate: 13.0,
        fiscalCertificatesStatus: 'Vigente (Expira SAT: Dic 2028)',
        auditMode: 'Enforced (Registro Inmutable)',
        activeSecurityPolicy: '2FA Obligatorio + Bloqueo tras 3 intentos'
      });
      console.log('Seed: Configuración Corporativa insertada.');
    }

    const logCount = await AuditLog.count();
    if (logCount === 0) {
      await AuditLog.bulkCreate([
        {
          timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
          action: 'USER_LOGIN',
          module: 'Seguridad',
          user: 'admin@consultores-nyt.com',
          ipAddress: '192.168.1.105',
          details: 'Inicio de sesión exitoso con token 2FA.',
          severity: 'INFO'
        },
        {
          timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
          action: 'JOURNAL_ENTRY_POSTED',
          module: 'Contabilidad',
          user: 'cp.garza@consultores-nyt.com',
          ipAddress: '192.168.1.112',
          details: 'Generación de póliza automática POL-NOM-2026-Q18 por dispersión de Nómina.',
          severity: 'INFO'
        },
        {
          timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
          action: 'SPEI_DISBURSEMENT_AUTHORIZED',
          module: 'Tesoreria',
          user: 'admin@consultores-nyt.com',
          ipAddress: '192.168.1.105',
          details: 'Autorización SPEI cuenta BBVA Bancomer por $109,720.00 USD para dispersión salarial.',
          severity: 'WARNING'
        },
        {
          timestamp: new Date(Date.now() - 1800000).toISOString(),
          action: 'MRP_PLANNING_EXECUTED',
          module: 'Planeacion',
          user: 'ing.supervisor@consultores-nyt.com',
          ipAddress: '192.168.1.140',
          details: 'Cálculo MRP II ejecutado para S&OP Octubre 2026. Se programaron órdenes OP y PO.',
          severity: 'INFO'
        }
      ]);
      console.log('Seed: Bitácora de Auditoría inicial insertada.');
    }

    app.use(express.static(path.join(__dirname, 'public')));
    app.use((req, res) => {
      if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
      } else {
        res.status(404).json({ error: 'API route not found' });
      }
    });
    
    app.listen(PORT, () => {
      console.log(`🚀 NyTEX Backend Server corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error al conectar la base de datos:', error);
  }
}

startServer();
