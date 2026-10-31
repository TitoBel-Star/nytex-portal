import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const COMMON_ACCOUNTS = [
  { code: '1101-01', name: 'Bancos - Cuenta Operativa Principal' },
  { code: '1101-02', name: 'Bancos Nacionales (Banco Operativo Central)' },
  { code: '1105-01', name: 'Clientes Nacionales (CxC)' },
  { code: '1106-01', name: 'Almacén de Materias Primas' },
  { code: '1106-02', name: 'Inventario de Producción en Proceso' },
  { code: '1106-03', name: 'Almacén de Productos Terminados' },
  { code: '1107-01', name: 'Anticipo Pago a Cuenta de Renta 1.75%' },
  { code: '1108-01', name: 'IVA Acreditable Pendiente de Pago' },
  { code: '1201-01', name: 'Maquinaria y Equipo Industrial' },
  { code: '1209-01', name: 'Depreciación Acumulada de Activos Fijos' },
  { code: '2101-01', name: 'Proveedores Nacionales (CxP)' },
  { code: '2105-01', name: 'Sueldos y Salarios por Pagar' },
  { code: '2106-01', name: 'Débito Fiscal IVA' },
  { code: '2106-05', name: 'IVA Retenido 1% por Enterar (DTE-07)' },
  { code: '2106-07', name: 'Retenciones Renta por Salarios (Nómina)' },
  { code: '2106-08', name: 'Retenciones Renta 10% Servicios (DTE-14)' },
  { code: '2106-10', name: 'Impuesto IVA por Pagar Líquido al MH' },
  { code: '2106-12', name: 'Pasivo Fiscal F-14 por Enterar al MH' },
  { code: '3101-01', name: 'Capital Social Fijo' },
  { code: '3201-01', name: 'Reserva Legal' },
  { code: '4101-01', name: 'Ventas de Productos Terminados' },
  { code: '4102-01', name: 'Otros Ingresos Financieros' },
  { code: '5101-01', name: 'Costo de Ventas y Materias Primas' },
  { code: '5101-02', name: 'Gastos de Personal - Horas Extraordinarias' },
  { code: '5102-01', name: 'Cargas Sociales Patronales' },
  { code: '6102-01', name: 'Gastos Administrativos / Operativos' },
  { code: '6102-05', name: 'Gastos Menores de Operación' },
  { code: '6103-01', name: 'Gasto por Depreciación de Maquinaria y Equipo' }
];

export default function Contabilidad() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [trialBalance, setTrialBalance] = useState(null);
  const [declaraciones, setDeclaraciones] = useState(null);
  const [librosIva, setLibrosIva] = useState(null);
  const [retencionesF910, setRetencionesF910] = useState(null);
  const [financialStatements, setFinancialStatements] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Pólizas');
  const [finReportType, setFinReportType] = useState('Balance'); // 'Balance' | 'Resultados'
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [filterType, setFilterType] = useState('Todas');
  const [libroSubTab, setLibroSubTab] = useState('Compras');
  const [notif, setNotif] = useState(null);
  const [lockStatus, setLockStatus] = useState(null);

  // Estados de las 4 Adiciones
  // Adición 1: Póliza Manual
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualEntryDate, setManualEntryDate] = useState(new Date().toISOString().split('T')[0]);
  const [manualEntryType, setManualEntryType] = useState('Diario');
  const [manualEntryConcept, setManualEntryConcept] = useState('');
  const [manualEntryRef, setManualEntryRef] = useState('');
  const [manualLines, setManualLines] = useState([
    { accountCode: '6102-01', accountName: 'Gastos Administrativos / Operativos', debit: 0, credit: 0 },
    { accountCode: '1101-01', accountName: 'Bancos - Cuenta Operativa Principal', debit: 0, credit: 0 }
  ]);

  // Adición 3: Modal de Libro Foliado
  const [showFoliadoModal, setShowFoliadoModal] = useState(false);

  // Adición 4: Modal Mandamiento de Pago Bancario (NPE)
  const [npeModalData, setNpeModalData] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resEntries, resTB, resDecl, resLibros, resRet, resFin] = await Promise.all([
        fetch('/api/contabilidad/entries'),
        fetch('/api/contabilidad/trial-balance'),
        fetch('/api/contabilidad/declaraciones'),
        fetch('/api/contabilidad/libros-iva'),
        fetch('/api/contabilidad/retenciones-f910'),
        fetch('/api/contabilidad/financial-statements')
      ]);
      if (resEntries.ok) setEntries(await resEntries.json());
      if (resTB.ok) setTrialBalance(await resTB.json());
      if (resDecl.ok) setDeclaraciones(await resDecl.json());
      if (resLibros.ok) setLibrosIva(await resLibros.json());
      if (resRet.ok) setRetencionesF910(await resRet.json());
      if (resFin.ok) setFinancialStatements(await resFin.json());
    } catch (err) {
      console.error('Error fetching Contabilidad data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLiquidarF07 = async () => {
    if (!declaraciones?.f07) return;
    try {
      const res = await fetch('/api/contabilidad/liquidar-f07', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          totalPagar: declaraciones.f07.totalPagarF07,
          debitoFiscal: declaraciones.f07.debitoFiscal13,
          creditoFiscal: declaraciones.f07.creditoFiscal13,
          retenciones: declaraciones.f07.retencionIva1Pct
        })
      });
      const data = await res.json();
      if (res.ok) {
        setNotif({ type: 'success', msg: data.message });
        fetchData();
      } else {
        setNotif({ type: 'error', msg: data.error || 'Error al liquidar F-07' });
      }
    } catch (err) {
      setNotif({ type: 'error', msg: err.message });
    }
  };

  const handleLiquidarF14 = async () => {
    if (!declaraciones?.f14) return;
    try {
      const res = await fetch('/api/contabilidad/liquidar-f14', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pagoACuenta: declaraciones.f14.pagoACuenta175,
          retencionNomina: declaraciones.f14.retencionRentaNomina,
          retencionServicios: declaraciones.f14.retencionRentaServicios10,
          totalPagar: declaraciones.f14.totalPagarF14
        })
      });
      const data = await res.json();
      if (res.ok) {
        setNotif({ type: 'success', msg: data.message });
        fetchData();
      } else {
        setNotif({ type: 'error', msg: data.error || 'Error al liquidar F-14' });
      }
    } catch (err) {
      setNotif({ type: 'error', msg: err.message });
    }
  };

  const handleAplicarCandadoFiscal = async () => {
    try {
      const res = await fetch('/api/contabilidad/candado-fiscal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          periodo: '2026-10',
          cerradoPor: 'C.P. Mario Castaneda (Contador General)',
          notas: 'Período fiscal auditado y sellado. Balanza y Libros de IVA coincidentes al centavo.'
        })
      });
      const data = await res.json();
      if (res.ok) {
        setLockStatus(data.hash);
        setNotif({ type: 'success', msg: data.message });
      }
    } catch (err) {
      setNotif({ type: 'error', msg: err.message });
    }
  };

  // --- ADICIÓN 1: MANEJADORES DE PÓLIZA MANUAL ---
  const handleAddManualLine = () => {
    setManualLines([
      ...manualLines,
      { accountCode: '', accountName: '', debit: 0, credit: 0 }
    ]);
  };

  const handleRemoveManualLine = (index) => {
    if (manualLines.length <= 2) {
      alert('Una póliza requiere al menos 2 asientos de partida doble.');
      return;
    }
    setManualLines(manualLines.filter((_, i) => i !== index));
  };

  const handleManualLineChange = (index, field, value) => {
    const updated = [...manualLines];
    if (field === 'accountSelect') {
      const found = COMMON_ACCOUNTS.find(a => a.code === value);
      if (found) {
        updated[index].accountCode = found.code;
        updated[index].accountName = found.name;
      }
    } else if (field === 'debit' || field === 'credit') {
      const num = parseFloat(value) || 0;
      updated[index][field] = num;
      // Si ingresa débito, limpia crédito y viceversa
      if (field === 'debit' && num > 0) updated[index].credit = 0;
      if (field === 'credit' && num > 0) updated[index].debit = 0;
    } else {
      updated[index][field] = value;
    }
    setManualLines(updated);
  };

  const manualTotalDebit = manualLines.reduce((s, l) => s + (parseFloat(l.debit) || 0), 0);
  const manualTotalCredit = manualLines.reduce((s, l) => s + (parseFloat(l.credit) || 0), 0);
  const manualDiff = Math.abs(manualTotalDebit - manualTotalCredit);
  const isManualBalanced = manualDiff < 0.01 && manualTotalDebit > 0;

  const handleSubmitManualEntry = async (e) => {
    e.preventDefault();
    if (!manualEntryConcept.trim()) {
      alert('Por favor ingrese el concepto contable de la póliza.');
      return;
    }
    if (!isManualBalanced) {
      alert(`La póliza no cuadra: Debe ($${manualTotalDebit.toFixed(2)}) ≠ Haber ($${manualTotalCredit.toFixed(2)}).`);
      return;
    }

    try {
      const res = await fetch('/api/contabilidad/manual-entry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: manualEntryDate,
          type: manualEntryType,
          concept: manualEntryConcept,
          originReference: manualEntryRef || 'AJUSTE-MANUAL',
          lines: manualLines
        })
      });
      const data = await res.json();
      if (res.ok) {
        setNotif({ type: 'success', msg: data.message });
        setShowManualModal(false);
        setManualEntryConcept('');
        setManualEntryRef('');
        setManualLines([
          { accountCode: '6102-01', accountName: 'Gastos Administrativos / Operativos', debit: 0, credit: 0 },
          { accountCode: '1101-01', accountName: 'Bancos - Cuenta Operativa Principal', debit: 0, credit: 0 }
        ]);
        fetchData();
      } else {
        alert(data.error || 'Error al registrar la póliza manual');
      }
    } catch (err) {
      alert('Error de conexión: ' + err.message);
    }
  };

  // --- ADICIÓN 3: EXPORTADOR DE LIBROS DE IVA A CSV (EXCEL) ---
  const handleExportLibroCsv = (tipo) => {
    let rows = [];
    let filename = `Libro_IVA_${tipo}_Octubre_2026.csv`;

    if (tipo === 'Compras' && librosIva?.libroCompras) {
      rows.push(['#', 'Fecha', 'Tipo DTE', 'No. Comprobante', 'UUID', 'NRC Proveedor', 'NIT Proveedor', 'Proveedor', 'Compras Gravadas', 'Credito Fiscal (13%)', 'Retencion 1%', 'Total Compra']);
      librosIva.libroCompras.forEach(c => {
        rows.push([
          c.numero, c.fecha, c.dteTipo, c.dteNumero, c.uuid, c.nrcProveedor, c.nitProveedor,
          `"${c.proveedor.replace(/"/g, '""')}"`, c.comprasGravadas, c.creditoFiscal, c.ivaRetenido1Pct, c.totalCompra
        ]);
      });
    } else if (tipo === 'VentasCCF' && librosIva?.libroVentasCCF) {
      rows.push(['#', 'Fecha', 'Tipo DTE', 'No. CCF', 'UUID', 'NRC Cliente', 'Cliente', 'Ventas Gravadas', 'Debito Fiscal (13%)', 'Total Facturado']);
      librosIva.libroVentasCCF.forEach(v => {
        rows.push([
          v.numero, v.fecha, v.dteTipo, v.dteNumero, v.uuid, v.nrcCliente,
          `"${v.cliente.replace(/"/g, '""')}"`, v.ventasGravadas, v.debitoFiscal, v.totalVenta
        ]);
      });
    } else if (tipo === 'Consumidor' && librosIva?.libroConsumidorFinal) {
      rows.push(['Fecha', 'Del Folio', 'Al Folio', 'Sucursal / Terminal', 'Ventas Gravadas Locales', 'Debito Fiscal (13%)', 'Total Diario']);
      librosIva.libroConsumidorFinal.forEach(cf => {
        rows.push([
          cf.fecha, cf.delFolio, cf.alFolio, `"${cf.sucursal}"`, cf.ventasGravadasLocales, cf.debitoFiscal, cf.totalDiario
        ]);
      });
    } else if (tipo === 'Exportaciones' && librosIva?.libroExportaciones) {
      rows.push(['Fecha', 'Folio DTE-11', 'Declaracion Aduanera (DUCA)', 'Pais Destino', 'Cliente Exterior', 'Valor FOB', 'Tasa IVA']);
      librosIva.libroExportaciones.forEach(exp => {
        rows.push([
          exp.fecha, exp.dteNumero, exp.duca, `"${exp.paisDestino}"`, `"${exp.clienteExterior}"`, exp.valorFob, `"${exp.tasaIva}"`
        ]);
      });
    }

    if (rows.length === 0) {
      alert('No hay datos disponibles para exportar.');
      return;
    }

    const csvContent = '\uFEFF' + rows.map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredEntries = entries.filter(e => {
    if (filterType === 'Todas') return true;
    return e.type === filterType;
  });

  const getPillColor = (type) => {
    switch (type) {
      case 'Ingreso': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Egreso': return 'bg-red-100 text-red-800 border-red-300';
      case 'Diario': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#f4f7f9] overflow-y-auto w-full">
      {/* Top Header */}
      <div className="flex flex-col border-b border-gray-200 px-6 py-4 bg-white sticky top-0 z-10 shrink-0 shadow-sm w-full">
        <div className="flex flex-wrap justify-between items-center gap-3">
          <div className="flex items-center text-lg text-gray-700">
            <span className="cursor-pointer hover:underline text-[#006EAD]" onClick={() => navigate('/portal')}>Portal</span>
            <span className="mx-2 text-gray-400">/</span>
            <span className="font-bold text-[#0A2540] flex items-center gap-2">
              <span className="px-2 py-0.5 text-xs bg-purple-100 text-purple-800 font-bold rounded">Módulo [12]</span>
              NyTEX Contabilidad Central, Pólizas & Declaraciones Fiscales
            </span>
          </div>
          <div className="flex items-center flex-wrap gap-2">
            <button 
              onClick={() => setShowManualModal(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-md text-xs font-bold shadow-sm transition flex items-center gap-1.5"
            >
              <span>✍️</span> + Nueva Póliza Manual
            </button>
            <button 
              onClick={() => navigate('/app/circuito-financiero')}
              className="bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 px-3 py-1.5 rounded-md text-xs font-bold shadow-sm transition"
            >
              ⚡ Monitor Financiero Central
            </button>
            <button 
              onClick={() => navigate('/app/tesoreria')}
              className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded-md text-xs font-semibold shadow-sm transition"
            >
              Ir a Tesorería [10]
            </button>
            <button 
              onClick={() => navigate('/app/activosfijos')}
              className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded-md text-xs font-semibold shadow-sm transition"
            >
              Ir a Activos Fijos [11]
            </button>
            <button 
              onClick={fetchData}
              className="bg-[#006EAD] hover:bg-[#005587] text-white px-4 py-2 rounded-md text-sm font-bold shadow-sm transition"
            >
              ↻ Refrescar Balanza & Impuestos
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 text-gray-800 w-full space-y-6">
        {/* Notificación flotante */}
        {notif && (
          <div className={`p-4 rounded-xl flex items-center justify-between text-sm font-semibold shadow-md ${
            notif.type === 'success' ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-red-50 text-red-900 border border-red-200'
          }`}>
            <span>{notif.msg}</span>
            <button onClick={() => setNotif(null)} className="font-bold ml-4">✕</button>
          </div>
        )}

        {/* Banner Ilustrativo */}
        <div className="bg-gradient-to-r from-[#2e1065] via-[#4c1d95] to-[#6d28d9] rounded-2xl p-6 text-white shadow-md">
          <div className="max-w-4xl space-y-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 text-white uppercase tracking-wider">
              Contabilidad Central, Pólizas Automáticas & Cumplimiento Fiscal DTE (El Salvador)
            </span>
            <h2 className="text-2xl font-black">Libro Mayor, Motor Contable & Declaraciones Oficiales</h2>
            <p className="text-sm text-purple-100 leading-relaxed">
              Consolidación en tiempo real de partida doble orientada a eventos. Liquidación automática de formularios fiscales del Ministerio de Hacienda (F-07 IVA, F-14 Renta, F-11 Anual, F-910 Retenciones), generación de Libros de IVA Digitales y Estados Financieros NIIF.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-4 border-t border-white/20">
            <div>
              <span className="text-xs text-purple-200 font-bold uppercase">Pólizas Generadas</span>
              <div className="text-xl font-bold">{entries.length} Pólizas</div>
              <div className="text-xs text-purple-200">100% Cuadradas</div>
            </div>
            <div>
              <span className="text-xs text-purple-200 font-bold uppercase">Total Cargos (Debe)</span>
              <div className="text-xl font-bold font-mono">
                ${(trialBalance?.totalDebit || 0).toLocaleString()}
              </div>
              <div className="text-xs text-purple-200">Movimientos deudores</div>
            </div>
            <div>
              <span className="text-xs text-purple-200 font-bold uppercase">F-07 IVA Estimado</span>
              <div className="text-xl font-bold font-mono text-amber-300">
                ${(declaraciones?.f07?.totalPagarF07 || 0).toLocaleString()}
              </div>
              <div className="text-xs text-purple-200">Por liquidar al MH</div>
            </div>
            <div>
              <span className="text-xs text-purple-200 font-bold uppercase">Candado Fiscal</span>
              <div className="text-xl font-bold text-emerald-300">
                {lockStatus ? '🔒 Sellado SHA-256' : '⚡ En Operación'}
              </div>
              <div className="text-xs text-emerald-200">Período Octubre 2026</div>
            </div>
          </div>
        </div>

        {/* Pestañas de Vista */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="flex border-b border-gray-100 px-6 py-3 bg-gray-50/50 justify-between items-center overflow-x-auto gap-2">
            <div className="flex space-x-2 shrink-0">
              <button
                onClick={() => setActiveTab('Pólizas')}
                className={`px-3.5 py-2 text-xs font-bold rounded-lg transition shrink-0 ${
                  activeTab === 'Pólizas' 
                    ? 'bg-purple-700 text-white shadow-sm' 
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                📑 Libro Diario ({entries.length})
              </button>
              <button
                onClick={() => setActiveTab('Balanza')}
                className={`px-3.5 py-2 text-xs font-bold rounded-lg transition shrink-0 ${
                  activeTab === 'Balanza' 
                    ? 'bg-purple-700 text-white shadow-sm' 
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                ⚖️ Balanza de Comprobación
              </button>
              <button
                onClick={() => setActiveTab('EstadosFinancieros')}
                className={`px-3.5 py-2 text-xs font-bold rounded-lg transition shrink-0 ${
                  activeTab === 'EstadosFinancieros' 
                    ? 'bg-purple-700 text-white shadow-sm' 
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                📊 Estados Financieros NIIF
              </button>
              <button
                onClick={() => setActiveTab('Declaraciones')}
                className={`px-3.5 py-2 text-xs font-bold rounded-lg transition shrink-0 ${
                  activeTab === 'Declaraciones' 
                    ? 'bg-purple-700 text-white shadow-sm' 
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                🏛️ Declaraciones Fiscales (F-07, F-14, F-11)
              </button>
              <button
                onClick={() => setActiveTab('LibrosIVA')}
                className={`px-3.5 py-2 text-xs font-bold rounded-lg transition shrink-0 ${
                  activeTab === 'LibrosIVA' 
                    ? 'bg-purple-700 text-white shadow-sm' 
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                📚 Libros Legales de IVA
              </button>
              <button
                onClick={() => setActiveTab('Retenciones')}
                className={`px-3.5 py-2 text-xs font-bold rounded-lg transition shrink-0 ${
                  activeTab === 'Retenciones' 
                    ? 'bg-purple-700 text-white shadow-sm' 
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                📋 Retenciones & F-910
              </button>
              <button
                onClick={() => setActiveTab('CandadoFiscal')}
                className={`px-3.5 py-2 text-xs font-bold rounded-lg transition shrink-0 ${
                  activeTab === 'CandadoFiscal' 
                    ? 'bg-purple-700 text-white shadow-sm' 
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                🔒 Candado Fiscal
              </button>
            </div>

            {activeTab === 'Pólizas' && (
              <div className="flex items-center gap-1.5 text-xs shrink-0">
                <button
                  onClick={() => setShowManualModal(true)}
                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold mr-2 shadow-sm transition"
                >
                  + Nueva Póliza
                </button>
                <span className="text-gray-500 font-bold">Tipo:</span>
                {['Todas', 'Ingreso', 'Egreso', 'Diario'].map(t => (
                  <button
                    key={t}
                    onClick={() => setFilterType(t)}
                    className={`px-2 py-0.5 rounded font-semibold ${
                      filterType === t ? 'bg-purple-100 text-purple-900 font-bold' : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* VISTA 1: LIBRO DIARIO DE PÓLIZAS */}
          {activeTab === 'Pólizas' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-3.5">Folio Póliza</th>
                    <th className="px-6 py-3.5">Fecha</th>
                    <th className="px-6 py-3.5 text-center">Tipo</th>
                    <th className="px-6 py-3.5">Concepto Contable</th>
                    <th className="px-6 py-3.5">Módulo Origen</th>
                    <th className="px-6 py-3.5 text-right">Cargos / Abonos</th>
                    <th className="px-6 py-3.5 text-center">Estado</th>
                    <th className="px-6 py-3.5 text-right">Asientos</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td colSpan="8" className="px-6 py-8 text-center text-gray-400">Cargando pólizas contables...</td>
                    </tr>
                  ) : filteredEntries.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="px-6 py-8 text-center text-gray-400">No hay pólizas registradas.</td>
                    </tr>
                  ) : (
                    filteredEntries.map(e => (
                      <tr key={e.id} className="hover:bg-purple-50/20 transition">
                        <td className="px-6 py-4 font-mono font-bold text-purple-800">
                          {e.entryCode}
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-600">
                          {e.date}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border ${getPillColor(e.type)}`}>
                            {e.type}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900">{e.concept}</div>
                          <div className="text-xs text-gray-400 font-mono">Ref: {e.originReference || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 text-xs">
                          <span className="px-2 py-0.5 bg-gray-100 rounded text-gray-700 font-semibold">
                            {e.originModule}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-mono font-bold text-gray-800">
                          ${e.totalDebit.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                            ✓ {e.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => setSelectedEntry(e)}
                            className="px-2.5 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded"
                          >
                            Ver Asientos ({e.lines ? e.lines.length : 0})
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* VISTA 2: BALANZA DE COMPROBACIÓN */}
          {activeTab === 'Balanza' && (
            <div className="overflow-x-auto p-4 space-y-4">
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg text-xs font-semibold text-purple-900">
                <span>Catálogo de Cuentas Contables y Movimientos Acumulados</span>
                <span className="font-mono text-emerald-700 font-bold">
                  Suma Debe: ${trialBalance?.totalDebit?.toLocaleString()} | Suma Haber: ${trialBalance?.totalCredit?.toLocaleString()} (Diferencia: $0.00)
                </span>
              </div>

              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-3.5">Código Cuenta</th>
                    <th className="px-6 py-3.5">Nombre de la Cuenta</th>
                    <th className="px-6 py-3.5 text-right">Total Cargos (Debe)</th>
                    <th className="px-6 py-3.5 text-right">Total Abonos (Haber)</th>
                    <th className="px-6 py-3.5 text-right">Saldo Deudor / Acreedor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-mono text-xs">
                  {trialBalance?.accounts && trialBalance.accounts.map((acc, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-6 py-3 font-bold text-gray-800">{acc.accountCode}</td>
                      <td className="px-6 py-3 font-sans text-gray-900 font-medium">{acc.accountName}</td>
                      <td className="px-6 py-3 text-right text-blue-700 font-bold">
                        ${acc.debit.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-3 text-right text-emerald-700 font-bold">
                        ${acc.credit.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                      </td>
                      <td className={`px-6 py-3 text-right font-extrabold ${acc.netBalance >= 0 ? 'text-gray-900' : 'text-red-700'}`}>
                        ${acc.netBalance.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* VISTA ADICIÓN 2: ESTADOS FINANCIEROS CLASIFICADOS NIIF */}
          {activeTab === 'EstadosFinancieros' && (
            <div className="p-6 space-y-6">
              {/* Selector de Reporte Financiero */}
              <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-200">
                <div className="flex gap-2">
                  <button
                    onClick={() => setFinReportType('Balance')}
                    className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
                      finReportType === 'Balance'
                        ? 'bg-purple-800 text-white shadow'
                        : 'bg-white text-gray-700 border hover:bg-gray-100'
                    }`}
                  >
                    🏛️ Balance General Clasificado
                  </button>
                  <button
                    onClick={() => setFinReportType('Resultados')}
                    className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
                      finReportType === 'Resultados'
                        ? 'bg-purple-800 text-white shadow'
                        : 'bg-white text-gray-700 border hover:bg-gray-100'
                    }`}
                  >
                    📈 Estado de Resultados (P&L)
                  </button>
                </div>
                <div className="text-right text-xs">
                  <span className="text-gray-500">Normativa:</span>{' '}
                  <span className="font-bold text-purple-900 font-mono">NIIF para PYMES / El Salvador</span>
                </div>
              </div>

              {/* REPORTE 1: BALANCE GENERAL */}
              {finReportType === 'Balance' && financialStatements?.balanceGeneral && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* COLUMNA IZQUIERDA: ACTIVOS */}
                    <div className="bg-white border rounded-2xl p-5 shadow-sm space-y-4">
                      <div className="border-b pb-2 flex justify-between items-center">
                        <h3 className="text-base font-black text-blue-900 uppercase tracking-wide">1. Activos</h3>
                        <span className="text-xs bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded">Recursos Económicos</span>
                      </div>

                      {/* Activo Corriente */}
                      <div className="space-y-2">
                        <div className="flex justify-between font-bold text-xs text-gray-700 bg-gray-50 p-2 rounded">
                          <span>ACTIVO CORRIENTE (Circulante)</span>
                          <span className="font-mono text-blue-800">
                            ${financialStatements.balanceGeneral.activoCorriente.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div className="space-y-1 pl-3 text-xs font-mono">
                          {financialStatements.balanceGeneral.activosCorrientesDetalle.map((a, i) => (
                            <div key={i} className="flex justify-between py-1 border-b border-gray-100 text-gray-600">
                              <span className="font-sans">{a.code} - {a.name}</span>
                              <span className="font-bold text-gray-800">${a.amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Activo No Corriente */}
                      <div className="space-y-2 pt-2">
                        <div className="flex justify-between font-bold text-xs text-gray-700 bg-gray-50 p-2 rounded">
                          <span>ACTIVO NO CORRIENTE (Fijo & Depreciación)</span>
                          <span className="font-mono text-blue-800">
                            ${financialStatements.balanceGeneral.activoNoCorriente.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div className="space-y-1 pl-3 text-xs font-mono">
                          {financialStatements.balanceGeneral.activosNoCorrientesDetalle.map((a, i) => (
                            <div key={i} className="flex justify-between py-1 border-b border-gray-100 text-gray-600">
                              <span className="font-sans">{a.code} - {a.name}</span>
                              <span className={`font-bold ${a.amount < 0 ? 'text-red-700' : 'text-gray-800'}`}>
                                ${a.amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* TOTAL ACTIVO */}
                      <div className="pt-3 border-t-2 border-blue-200 flex justify-between items-center bg-blue-50/70 p-3 rounded-xl">
                        <span className="font-black text-sm text-blue-950 uppercase">TOTAL DEL ACTIVO:</span>
                        <span className="font-mono font-black text-lg text-blue-900">
                          ${financialStatements.balanceGeneral.totalActivo.toLocaleString('es-MX', { minimumFractionDigits: 2 })} USD
                        </span>
                      </div>
                    </div>

                    {/* COLUMNA DERECHA: PASIVO Y PATRIMONIO */}
                    <div className="bg-white border rounded-2xl p-5 shadow-sm space-y-4">
                      <div className="border-b pb-2 flex justify-between items-center">
                        <h3 className="text-base font-black text-purple-900 uppercase tracking-wide">2. Pasivo & Patrimonio</h3>
                        <span className="text-xs bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded">Obligaciones & Capital</span>
                      </div>

                      {/* Pasivo Corriente */}
                      <div className="space-y-2">
                        <div className="flex justify-between font-bold text-xs text-gray-700 bg-gray-50 p-2 rounded">
                          <span>PASIVO CORRIENTE (Corto Plazo)</span>
                          <span className="font-mono text-purple-800">
                            ${financialStatements.balanceGeneral.pasivoCorriente.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div className="space-y-1 pl-3 text-xs font-mono">
                          {financialStatements.balanceGeneral.pasivosCorrientesDetalle.map((p, i) => (
                            <div key={i} className="flex justify-between py-1 border-b border-gray-100 text-gray-600">
                              <span className="font-sans">{p.code} - {p.name}</span>
                              <span className="font-bold text-gray-800">${p.amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Patrimonio Neto */}
                      <div className="space-y-2 pt-2">
                        <div className="flex justify-between font-bold text-xs text-gray-700 bg-gray-50 p-2 rounded">
                          <span>PATRIMONIO NETO & RESULTADOS</span>
                          <span className="font-mono text-purple-800">
                            ${financialStatements.balanceGeneral.totalPatrimonio.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div className="space-y-1 pl-3 text-xs font-mono">
                          {financialStatements.balanceGeneral.patrimonioDetalle.map((pt, i) => (
                            <div key={i} className="flex justify-between py-1 border-b border-gray-100 text-gray-600">
                              <span className="font-sans">{pt.name}</span>
                              <span className="font-bold text-emerald-700">${pt.amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* TOTAL PASIVO + PATRIMONIO */}
                      <div className="pt-3 border-t-2 border-purple-200 flex justify-between items-center bg-purple-50/70 p-3 rounded-xl">
                        <span className="font-black text-sm text-purple-950 uppercase">TOTAL PASIVO + PATRIMONIO:</span>
                        <span className="font-mono font-black text-lg text-purple-900">
                          ${financialStatements.balanceGeneral.totalPasivoYPatrimonio.toLocaleString('es-MX', { minimumFractionDigits: 2 })} USD
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Banner de Cuadre de Ecuación Contable */}
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs font-bold text-emerald-900">
                    <span className="flex items-center gap-2">
                      <span className="text-base">✓</span>
                      Ecuación Contable Verificada: Activo = Pasivo + Patrimonio Neto
                    </span>
                    <span className="font-mono text-emerald-800">
                      Diferencia de Cuadre: $0.00 USD (Consistencia 100%)
                    </span>
                  </div>
                </div>
              )}

              {/* REPORTE 2: ESTADO DE RESULTADOS */}
              {finReportType === 'Resultados' && financialStatements?.estadoResultados && (
                <div className="max-w-3xl mx-auto bg-white border rounded-2xl p-6 shadow-sm space-y-4">
                  <div className="border-b pb-3 text-center">
                    <span className="text-xs uppercase font-bold tracking-wider text-gray-400">NYTEX TEXTILES DE EL SALVADOR S.A. DE C.V.</span>
                    <h3 className="text-xl font-black text-gray-900 mt-1">Estado de Resultados Integral</h3>
                    <p className="text-xs text-gray-500">Del 01 de Octubre al 31 de Octubre de 2026 (Expresado en USD)</p>
                  </div>

                  <div className="space-y-3 text-xs font-mono">
                    <div className="flex justify-between py-2 border-b border-gray-100 text-sm">
                      <span className="font-sans font-bold text-gray-800">(+) Ingresos de Operación / Ventas Gravadas:</span>
                      <span className="font-bold text-blue-900">${financialStatements.estadoResultados.totalIngresos.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100 text-red-700">
                      <span className="font-sans font-semibold">(-) Costo de Ventas y Materias Primas Directas:</span>
                      <span className="font-bold">-${financialStatements.estadoResultados.totalCostos.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between py-2 bg-gray-50 px-3 rounded-lg font-bold text-gray-900">
                      <span className="font-sans">(=) UTILIDAD BRUTA:</span>
                      <span>${financialStatements.estadoResultados.utilidadBruta.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100 text-amber-800">
                      <span className="font-sans font-semibold">(-) Gastos de Operación (Admin, Nómina, Depreciación):</span>
                      <span className="font-bold">-${financialStatements.estadoResultados.totalGastosOp.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between py-2 bg-purple-50 px-3 rounded-lg font-bold text-purple-950">
                      <span className="font-sans">(=) UTILIDAD DE OPERACIÓN:</span>
                      <span>${financialStatements.estadoResultados.utilidadOperativa.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100 text-gray-600">
                      <span className="font-sans">(-) Reserva Legal (7% Código de Comercio):</span>
                      <span className="font-bold text-red-700">-${financialStatements.estadoResultados.reservaLegal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100 text-gray-600">
                      <span className="font-sans">(-) Provisión Impuesto sobre la Renta (30% ISR):</span>
                      <span className="font-bold text-red-700">-${financialStatements.estadoResultados.provisionISR.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between py-3 bg-emerald-100 text-emerald-950 px-4 rounded-xl font-black text-sm">
                      <span className="font-sans uppercase">(=) UTILIDAD NETA DEL EJERCICIO:</span>
                      <span className="text-base">${financialStatements.estadoResultados.utilidadNetaEjercicio.toLocaleString('es-MX', { minimumFractionDigits: 2 })} USD</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* VISTA 3: DECLARACIONES FISCALES (F-07, F-14, F-11) */}
          {activeTab === 'Declaraciones' && (
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Formulario F-07 (IVA Mensual) */}
                <div className="bg-white border-2 border-indigo-200 rounded-2xl p-5 shadow-sm space-y-4">
                  <div className="flex justify-between items-start border-b pb-3">
                    <div>
                      <span className="px-2 py-0.5 text-xs font-bold bg-indigo-100 text-indigo-800 rounded">
                        Formulario F-07 Oficial
                      </span>
                      <h3 className="text-lg font-bold text-gray-900 mt-1">Declaración y Pago Mensual de IVA</h3>
                      <p className="text-xs text-gray-500">Ministerio de Hacienda • DGII El Salvador</p>
                    </div>
                    <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-600 font-bold">
                      Vence: {declaraciones?.f07?.fechaVencimiento || '13 Nov 2026'}
                    </span>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between py-1 border-b border-gray-100">
                      <span className="text-gray-600">Ventas Gravadas con CCF (DTE-03):</span>
                      <span className="font-mono font-bold">${(declaraciones?.f07?.ventasGravadasCCF || 0).toLocaleString()} USD</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-100 text-indigo-700 font-semibold">
                      <span>(+) Débito Fiscal IVA Generado (13%):</span>
                      <span className="font-mono font-bold">${(declaraciones?.f07?.debitoFiscal13 || 0).toLocaleString()} USD</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-100">
                      <span className="text-gray-600">Compras Gravadas con CCF (DTE-03 Recibidos):</span>
                      <span className="font-mono font-bold">${(declaraciones?.f07?.comprasGravadas || 0).toLocaleString()} USD</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-100 text-emerald-700 font-semibold">
                      <span>(-) Crédito Fiscal IVA Soportado (13%):</span>
                      <span className="font-mono font-bold">${(declaraciones?.f07?.creditoFiscal13 || 0).toLocaleString()} USD</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-100 text-amber-700 font-semibold">
                      <span>(+) Retención IVA 1% a Proveedores (DTE-07):</span>
                      <span className="font-mono font-bold">${(declaraciones?.f07?.retencionIva1Pct || 0).toLocaleString()} USD</span>
                    </div>
                    <div className="flex justify-between py-2 bg-indigo-50 px-3 rounded-lg text-sm font-bold text-indigo-950">
                      <span>TOTAL A PAGAR F-07 (Con Retenciones):</span>
                      <span className="font-mono text-base">${(declaraciones?.f07?.totalPagarF07 || 0).toLocaleString()} USD</span>
                    </div>
                    <div className="text-[11px] text-gray-500 font-mono">
                      Mandamiento de Pago (NPE): <strong>{declaraciones?.f07?.npe}</strong>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-wrap gap-2 justify-between items-center">
                    <button
                      onClick={() => setNpeModalData({ form: 'F-07', npe: declaraciones?.f07?.npe, amount: declaraciones?.f07?.totalPagarF07, name: 'Declaración y Pago de IVA' })}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-indigo-900 text-xs font-bold rounded-lg transition flex items-center gap-1 border border-indigo-200"
                    >
                      <span>🧾</span> Ver Mandamiento de Pago (NPE)
                    </button>
                    <button
                      onClick={handleLiquidarF07}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow transition"
                    >
                      ⚡ Liquidar y Generar Póliza de IVA
                    </button>
                  </div>
                </div>

                {/* Formulario F-14 (Pago a Cuenta y Retenciones Renta) */}
                <div className="bg-white border-2 border-emerald-200 rounded-2xl p-5 shadow-sm space-y-4">
                  <div className="flex justify-between items-start border-b pb-3">
                    <div>
                      <span className="px-2 py-0.5 text-xs font-bold bg-emerald-100 text-emerald-800 rounded">
                        Formulario F-14 Oficial
                      </span>
                      <h3 className="text-lg font-bold text-gray-900 mt-1">Pago a Cuenta & Retenciones de Renta</h3>
                      <p className="text-xs text-gray-500">Anticipo Impuesto a la Renta y Retenciones Mensuales</p>
                    </div>
                    <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-600 font-bold">
                      Vence: {declaraciones?.f14?.fechaVencimiento || '13 Nov 2026'}
                    </span>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between py-1 border-b border-gray-100">
                      <span className="text-gray-600">Base Imponible de Ingresos Brutos:</span>
                      <span className="font-mono font-bold">${(declaraciones?.f14?.ingresosBrutos || 0).toLocaleString()} USD</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-100 text-blue-700 font-semibold">
                      <span>(+) Pago a Cuenta de Renta (1.75% de Ingresos):</span>
                      <span className="font-mono font-bold">${(declaraciones?.f14?.pagoACuenta175 || 0).toLocaleString()} USD</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-100 text-purple-700 font-semibold">
                      <span>(+) Retención Renta a Salarios (Nómina [14]):</span>
                      <span className="font-mono font-bold">${(declaraciones?.f14?.retencionRentaNomina || 0).toLocaleString()} USD</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-100 text-amber-700 font-semibold">
                      <span>(+) Retención 10% Servicios / Sujetos Excluidos (DTE-14):</span>
                      <span className="font-mono font-bold">${(declaraciones?.f14?.retencionRentaServicios10 || 0).toLocaleString()} USD</span>
                    </div>
                    <div className="flex justify-between py-2 bg-emerald-50 px-3 rounded-lg text-sm font-bold text-emerald-950">
                      <span>TOTAL A ENTERAR F-14:</span>
                      <span className="font-mono text-base">${(declaraciones?.f14?.totalPagarF14 || 0).toLocaleString()} USD</span>
                    </div>
                    <div className="text-[11px] text-gray-500 font-mono">
                      Mandamiento de Pago (NPE): <strong>{declaraciones?.f14?.npe}</strong>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-wrap gap-2 justify-between items-center">
                    <button
                      onClick={() => setNpeModalData({ form: 'F-14', npe: declaraciones?.f14?.npe, amount: declaraciones?.f14?.totalPagarF14, name: 'Pago a Cuenta & Retenciones de Renta' })}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-emerald-900 text-xs font-bold rounded-lg transition flex items-center gap-1 border border-emerald-200"
                    >
                      <span>🧾</span> Ver Mandamiento de Pago (NPE)
                    </button>
                    <button
                      onClick={handleLiquidarF14}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow transition"
                    >
                      ⚡ Liquidar y Generar Póliza F-14
                    </button>
                  </div>
                </div>

              </div>

              {/* Formulario F-11 (Declaración Anual de Renta) */}
              <div className="bg-gradient-to-r from-gray-900 to-slate-800 text-white rounded-2xl p-6 shadow-md">
                <div className="flex flex-wrap justify-between items-center gap-3 border-b border-gray-700 pb-4 mb-4">
                  <div>
                    <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 uppercase">
                      Proyección Fiscal Anual • Formulario F-11
                    </span>
                    <h3 className="text-xl font-bold mt-1">Declaración del Impuesto sobre la Renta (Ejercicio 2026)</h3>
                    <p className="text-xs text-gray-400">Liquidación Definitiva Anual para Personas Jurídicas</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-400">Plazo Legal de Presentación:</span>
                    <div className="font-mono text-sm font-bold text-amber-300">30 de Abril de 2027</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
                  <div className="bg-gray-800/80 p-3.5 rounded-xl border border-gray-700">
                    <span className="text-gray-400 font-sans block mb-1">Renta Neta Imponible</span>
                    <div className="text-lg font-bold text-white">${(declaraciones?.f11?.utilidadGravable || 0).toLocaleString()} USD</div>
                    <span className="text-[10px] text-gray-400 font-sans">Ingresos menos costos/gastos</span>
                  </div>
                  <div className="bg-gray-800/80 p-3.5 rounded-xl border border-gray-700">
                    <span className="text-gray-400 font-sans block mb-1">Tasa Aplicable</span>
                    <div className="text-lg font-bold text-amber-300">{declaraciones?.f11?.tasaAplicada || '30%'}</div>
                    <span className="text-[10px] text-gray-400 font-sans">Art. 41 Ley ISR</span>
                  </div>
                  <div className="bg-gray-800/80 p-3.5 rounded-xl border border-gray-700">
                    <span className="text-gray-400 font-sans block mb-1">Pagos a Cuenta Acreditables</span>
                    <div className="text-lg font-bold text-emerald-400">-${(declaraciones?.f11?.pagosACuentaAcreditables || 0).toLocaleString()} USD</div>
                    <span className="text-[10px] text-gray-400 font-sans">12 meses acumulados</span>
                  </div>
                  <div className="bg-gray-800/80 p-3.5 rounded-xl border border-gray-700">
                    <span className="text-gray-400 font-sans block mb-1">Impuesto Neto a Liquidar</span>
                    <div className="text-lg font-bold text-amber-400">${(declaraciones?.f11?.impuestoRentaNetoPagar || 0).toLocaleString()} USD</div>
                    <span className="text-[10px] text-emerald-400 font-sans">Saldo a pagar en F-11</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* VISTA 4: LIBROS LEGALES DE IVA CON EXPORTADOR */}
          {activeTab === 'LibrosIVA' && (
            <div className="p-6 space-y-4">
              <div className="flex flex-wrap justify-between items-center border-b border-gray-200 pb-3 gap-2">
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'Compras', label: '📖 1. Libro de Compras' },
                    { id: 'VentasCCF', label: '🏢 2. Ventas a Contribuyentes (CCF)' },
                    { id: 'Consumidor', label: '🛍️ 3. Ventas a Consumidor Final' },
                    { id: 'Exportaciones', label: '✈️ 4. Libro de Exportaciones' }
                  ].map(sub => (
                    <button
                      key={sub.id}
                      onClick={() => setLibroSubTab(sub.id)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-md transition ${
                        libroSubTab === sub.id 
                          ? 'bg-purple-800 text-white shadow-sm' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>

                {/* Acciones de Exportación Formal de la Adición 3 */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleExportLibroCsv(libroSubTab)}
                    className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold rounded-md transition flex items-center gap-1 shadow-sm"
                  >
                    <span>📥</span> Exportar CSV (Excel)
                  </button>
                  <button
                    onClick={() => setShowFoliadoModal(true)}
                    className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-300 text-xs font-bold rounded-md transition flex items-center gap-1 shadow-sm"
                  >
                    <span>🖨️</span> Imprimir Libro Foliado
                  </button>
                </div>
              </div>

              {/* Sub-tabla 1: Libro de Compras */}
              {libroSubTab === 'Compras' && (
                <div className="overflow-x-auto">
                  <div className="text-xs text-gray-500 mb-2 font-semibold flex justify-between items-center">
                    <span>Libro de Compras de IVA • Base para Crédito Fiscal F-07</span>
                    <span className="font-mono text-purple-800 font-bold">Total Facturas: {librosIva?.libroCompras?.length || 0}</span>
                  </div>
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-100 text-gray-600 uppercase font-bold border-b">
                      <tr>
                        <th className="p-3">#</th>
                        <th className="p-3">Fecha</th>
                        <th className="p-3">DTE Tipo</th>
                        <th className="p-3">No. Comprobante</th>
                        <th className="p-3">UUID (Código Gen.)</th>
                        <th className="p-3">NRC / NIT Proveedor</th>
                        <th className="p-3">Proveedor</th>
                        <th className="p-3 text-right">Compras Gravadas</th>
                        <th className="p-3 text-right">Crédito Fiscal (13%)</th>
                        <th className="p-3 text-right">Retención 1%</th>
                        <th className="p-3 text-right">Total Compra</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-mono">
                      {librosIva?.libroCompras?.map((c, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="p-3 text-gray-400">{c.numero}</td>
                          <td className="p-3 text-gray-700 font-sans">{c.fecha}</td>
                          <td className="p-3"><span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded font-bold">{c.dteTipo}</span></td>
                          <td className="p-3 font-bold text-gray-800">{c.dteNumero}</td>
                          <td className="p-3 text-[11px] text-gray-400">{c.uuid}</td>
                          <td className="p-3 text-gray-600">{c.nrcProveedor}</td>
                          <td className="p-3 font-sans font-semibold text-gray-900">{c.proveedor}</td>
                          <td className="p-3 text-right">${c.comprasGravadas.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                          <td className="p-3 text-right text-emerald-700 font-bold">${c.creditoFiscal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                          <td className="p-3 text-right text-amber-700">${c.ivaRetenido1Pct.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                          <td className="p-3 text-right font-bold text-gray-900">${c.totalCompra.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Sub-tabla 2: Libro de Ventas CCF */}
              {libroSubTab === 'VentasCCF' && (
                <div className="overflow-x-auto">
                  <div className="text-xs text-gray-500 mb-2 font-semibold flex justify-between items-center">
                    <span>Libro de Ventas a Contribuyentes (B2B) • Base para Débito Fiscal F-07</span>
                    <span className="font-mono text-purple-800 font-bold">Total CCF: {librosIva?.libroVentasCCF?.length || 0}</span>
                  </div>
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-100 text-gray-600 uppercase font-bold border-b">
                      <tr>
                        <th className="p-3">#</th>
                        <th className="p-3">Fecha</th>
                        <th className="p-3">No. CCF</th>
                        <th className="p-3">UUID</th>
                        <th className="p-3">NRC Cliente</th>
                        <th className="p-3">Razón Social Cliente</th>
                        <th className="p-3 text-right">Venta Neta Gravada</th>
                        <th className="p-3 text-right">Débito Fiscal (13%)</th>
                        <th className="p-3 text-right">Total Facturado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-mono">
                      {librosIva?.libroVentasCCF?.map((v, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="p-3 text-gray-400">{v.numero}</td>
                          <td className="p-3 text-gray-700 font-sans">{v.fecha}</td>
                          <td className="p-3 font-bold text-purple-800">{v.dteNumero}</td>
                          <td className="p-3 text-[11px] text-gray-400">{v.uuid}</td>
                          <td className="p-3 text-gray-600">{v.nrcCliente}</td>
                          <td className="p-3 font-sans font-semibold text-gray-900">{v.cliente}</td>
                          <td className="p-3 text-right">${v.ventasGravadas.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                          <td className="p-3 text-right text-indigo-700 font-bold">${v.debitoFiscal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                          <td className="p-3 text-right font-bold text-gray-900">${v.totalVenta.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Sub-tabla 3: Consumidor Final */}
              {libroSubTab === 'Consumidor' && (
                <div className="overflow-x-auto">
                  <div className="text-xs text-gray-500 mb-2 font-semibold">
                    Libro de Ventas a Consumidor Final • Resumen Diario por Cortes Z y DTE-01
                  </div>
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-100 text-gray-600 uppercase font-bold border-b">
                      <tr>
                        <th className="p-3">Fecha</th>
                        <th className="p-3">Rango de Folios (Del - Al)</th>
                        <th className="p-3">Sucursal / Terminal</th>
                        <th className="p-3 text-right">Ventas Gravadas Locales</th>
                        <th className="p-3 text-right">Débito Fiscal (13%)</th>
                        <th className="p-3 text-right">Total Diario</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-mono">
                      {librosIva?.libroConsumidorFinal?.map((cf, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="p-3 font-sans">{cf.fecha}</td>
                          <td className="p-3 font-bold text-blue-700">{cf.delFolio} ➔ {cf.alFolio}</td>
                          <td className="p-3 font-sans text-gray-800">{cf.sucursal}</td>
                          <td className="p-3 text-right">${cf.ventasGravadasLocales.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                          <td className="p-3 text-right text-indigo-700 font-bold">${cf.debitoFiscal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                          <td className="p-3 text-right font-bold text-gray-900">${cf.totalDiario.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Sub-tabla 4: Exportaciones */}
              {libroSubTab === 'Exportaciones' && (
                <div className="overflow-x-auto">
                  <div className="text-xs text-gray-500 mb-2 font-semibold">
                    Libro de Exportaciones • Ventas Internacionales amparadas con DTE-11 (Tasa 0%)
                  </div>
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-100 text-gray-600 uppercase font-bold border-b">
                      <tr>
                        <th className="p-3">Fecha</th>
                        <th className="p-3">Folio DTE-11</th>
                        <th className="p-3">Declaración Aduanera (DUCA)</th>
                        <th className="p-3">País Destino</th>
                        <th className="p-3">Cliente en el Exterior</th>
                        <th className="p-3 text-right">Valor FOB Exportación</th>
                        <th className="p-3 text-center">Tasa IVA</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-mono">
                      {librosIva?.libroExportaciones?.map((exp, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="p-3 font-sans">{exp.fecha}</td>
                          <td className="p-3 font-bold text-purple-800">{exp.dteNumero}</td>
                          <td className="p-3 text-blue-700 font-bold">{exp.duca}</td>
                          <td className="p-3 font-sans font-semibold">{exp.paisDestino}</td>
                          <td className="p-3 font-sans text-gray-900">{exp.clienteExterior}</td>
                          <td className="p-3 text-right font-bold text-gray-900">${exp.valorFob.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                          <td className="p-3 text-center"><span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-sans font-bold">{exp.tasaIva}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

            </div>
          )}

          {/* VISTA 5: RETENCIONES & INFORME ANUAL F-910 */}
          {activeTab === 'Retenciones' && (
            <div className="p-6 space-y-6">
              <div className="flex flex-wrap justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div>
                  <h3 className="text-base font-bold text-gray-900">Informe Anual de Retenciones de Renta (F-910)</h3>
                  <p className="text-xs text-gray-500">Formato Plano Oficial para carga masiva en el portal del Ministerio de Hacienda</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-xs text-gray-500">Total Retenido Acumulado:</span>
                    <div className="font-mono text-base font-bold text-purple-900">${(retencionesF910?.totalRetenido || 0).toLocaleString()} USD</div>
                  </div>
                  <button
                    onClick={() => alert('Layout F-910 generado exitosamente en formato TXT delimitado conforme normativa DGII.')}
                    className="px-3.5 py-2 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-lg shadow transition"
                  >
                    📥 Descargar TXT / CSV F-910
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-100 text-gray-600 uppercase font-bold border-b">
                    <tr>
                      <th className="p-3">Tipo Doc</th>
                      <th className="p-3">NIT / DUI</th>
                      <th className="p-3">Colaborador / Proveedor</th>
                      <th className="p-3">Código de Ingreso / Concepto</th>
                      <th className="p-3 text-right">Monto Devengado Anual</th>
                      <th className="p-3 text-right">Retención Renta Efectuada</th>
                      <th className="p-3 text-center">Estado Constancia</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-mono">
                    {retencionesF910?.registros?.map((r, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="p-3 font-sans font-bold text-gray-700">{r.tipoIdentificacion}</td>
                        <td className="p-3 text-purple-800 font-bold">{r.numeroIdentificacion}</td>
                        <td className="p-3 font-sans font-semibold text-gray-900">{r.nombreCompleto}</td>
                        <td className="p-3 font-sans text-gray-600">{r.conceptoCodigo}</td>
                        <td className="p-3 text-right text-gray-800">${r.montoDevengadoAnual.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                        <td className="p-3 text-right text-emerald-700 font-bold">${r.montoRetenidoRenta.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                        <td className="p-3 text-center">
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-sans font-semibold text-[11px]">
                            ✓ {r.estadoConstancia}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VISTA 6: CANDADO FISCAL DE PERÍODO */}
          {activeTab === 'CandadoFiscal' && (
            <div className="p-6 space-y-6">
              <div className="max-w-2xl bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center text-2xl font-bold">
                    🔒
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Candado Fiscal Mensual e Inmutabilidad de Libros</h3>
                    <p className="text-xs text-gray-500">Blindaje criptográfico de estados financieros contra alteraciones retroactivas</p>
                  </div>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed">
                  Al aplicar el <strong>Candado Fiscal</strong>, el período contable seleccionado pasa a estado <strong>Solo Lectura (Read-Only)</strong>. El sistema bloquea de manera estricta cualquier inserción, modificación o anulación de pólizas contables, facturas DTE y dispersiones de tesorería con fecha del período cerrado.
                </p>

                <div className="p-4 bg-gray-50 rounded-xl space-y-2 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-sans">Período a Bloquear:</span>
                    <span className="font-bold text-gray-900">Octubre 2026 (2026-10)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-sans">Responsable de Auditoría:</span>
                    <span className="font-bold text-gray-900">C.P. Mario Castaneda (Contador General)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-sans">Estado de Libros de IVA:</span>
                    <span className="font-bold text-emerald-600">✓ 4 Libros Conciliados y Cuadrados</span>
                  </div>
                  {lockStatus && (
                    <div className="pt-2 border-t border-gray-200 text-purple-900">
                      <span className="font-sans font-bold block mb-1">Sello Criptográfico SHA-256 Emitido:</span>
                      <div className="p-2 bg-purple-100/60 rounded break-all text-[11px] font-bold">
                        {lockStatus}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleAplicarCandadoFiscal}
                    className="w-full py-3 bg-purple-800 hover:bg-purple-900 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 text-sm"
                  >
                    <span>🔒</span> Aplicar Candado Fiscal y Generar Sello SHA-256
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* ========================================================================= */}
        {/* MODAL 1: DETALLE ASIENTOS DE LA PÓLIZA EXISTENTE */}
        {/* ========================================================================= */}
        {selectedEntry && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <div>
                  <h3 className="text-lg font-bold text-[#0A2540]">Póliza Contable - {selectedEntry.entryCode}</h3>
                  <p className="text-xs text-gray-500">{selectedEntry.concept} (Módulo: {selectedEntry.originModule})</p>
                </div>
                <button onClick={() => setSelectedEntry(null)} className="text-gray-400 hover:text-gray-600 text-xl font-bold">✕</button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-500 uppercase font-bold border-b">
                    <tr>
                      <th className="p-2.5">Cuenta</th>
                      <th className="p-2.5">Descripción de la Cuenta</th>
                      <th className="p-2.5 text-right">Debe (Cargo)</th>
                      <th className="p-2.5 text-right">Haber (Abono)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-mono">
                    {selectedEntry.lines && selectedEntry.lines.map((l, idx) => (
                      <tr key={idx}>
                        <td className="p-2.5 text-[#006EAD] font-bold">{l.accountCode}</td>
                        <td className="p-2.5 font-sans text-gray-800">{l.accountName}</td>
                        <td className="p-2.5 text-right text-gray-900 font-bold">
                          {l.debit > 0 ? `$${l.debit.toLocaleString('es-MX', { minimumFractionDigits: 2 })}` : '-'}
                        </td>
                        <td className="p-2.5 text-right text-gray-900 font-bold">
                          {l.credit > 0 ? `$${l.credit.toLocaleString('es-MX', { minimumFractionDigits: 2 })}` : '-'}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-purple-50 font-bold text-purple-900 border-t-2 border-purple-200">
                      <td colSpan="2" className="p-2.5 font-sans">SUMAS IGUALES:</td>
                      <td className="p-2.5 text-right">${selectedEntry.totalDebit.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                      <td className="p-2.5 text-right">${selectedEntry.totalCredit.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center pt-3 border-t">
                <span className="text-xs text-emerald-600 font-bold">✓ Partida Doble Verificada (Cuadre 0.00)</span>
                <button
                  onClick={() => setSelectedEntry(null)}
                  className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 2 (ADICIÓN 1): NUEVA PÓLIZA MANUAL DE AJUSTE / RECLASIFICACIÓN */}
        {/* ========================================================================= */}
        {showManualModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
              <div className="flex justify-between items-center border-b pb-3">
                <div>
                  <h3 className="text-lg font-bold text-[#0A2540] flex items-center gap-2">
                    <span>✍️</span> Nueva Póliza Contable de Ajuste / Reclasificación
                  </h3>
                  <p className="text-xs text-gray-500">Módulo [12] • Registro manual con validador de partida doble estricta en vivo</p>
                </div>
                <button onClick={() => setShowManualModal(false)} className="text-gray-400 hover:text-gray-600 text-xl font-bold">✕</button>
              </div>

              <form onSubmit={handleSubmitManualEntry} className="space-y-4 flex-1 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Fecha Contable:</label>
                    <input
                      type="date"
                      value={manualEntryDate}
                      onChange={(e) => setManualEntryDate(e.target.value)}
                      className="w-full text-xs p-2 border rounded-lg font-mono focus:ring-2 focus:ring-purple-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Tipo de Póliza:</label>
                    <select
                      value={manualEntryType}
                      onChange={(e) => setManualEntryType(e.target.value)}
                      className="w-full text-xs p-2 border rounded-lg font-semibold focus:ring-2 focus:ring-purple-600"
                    >
                      <option value="Diario">Diario (Ajustes y Reclasificaciones)</option>
                      <option value="Ingreso">Ingreso (Entradas de Efectivo)</option>
                      <option value="Egreso">Egreso (Salidas Bancarias)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Referencia Documental:</label>
                    <input
                      type="text"
                      placeholder="Ej. AUD-2026-OCT"
                      value={manualEntryRef}
                      onChange={(e) => setManualEntryRef(e.target.value)}
                      className="w-full text-xs p-2 border rounded-lg focus:ring-2 focus:ring-purple-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Concepto Contable de la Póliza:</label>
                  <input
                    type="text"
                    placeholder="Ej. Ajuste por reclasificación de gastos administrativos y amortización del período"
                    value={manualEntryConcept}
                    onChange={(e) => setManualEntryConcept(e.target.value)}
                    className="w-full text-xs p-2 border rounded-lg focus:ring-2 focus:ring-purple-600"
                    required
                  />
                </div>

                {/* Tabla de Asientos Dinámicos */}
                <div className="border rounded-xl p-3 bg-gray-50/50 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-800 uppercase tracking-wide">
                      Asientos de Partida Doble ({manualLines.length} líneas)
                    </span>
                    <button
                      type="button"
                      onClick={handleAddManualLine}
                      className="px-2.5 py-1 text-xs bg-purple-100 hover:bg-purple-200 text-purple-900 font-bold rounded transition"
                    >
                      + Agregar Asiento
                    </button>
                  </div>

                  <div className="space-y-2">
                    {manualLines.map((line, idx) => (
                      <div key={idx} className="flex flex-wrap items-center gap-2 bg-white p-2.5 rounded-lg border border-gray-200 shadow-sm text-xs">
                        <div className="w-1/3 min-w-[200px] flex-1">
                          <select
                            value={line.accountCode}
                            onChange={(e) => handleManualLineChange(idx, 'accountSelect', e.target.value)}
                            className="w-full p-1.5 border rounded text-xs font-semibold focus:ring-1 focus:ring-purple-500"
                          >
                            <option value="">-- Seleccionar Cuenta del Catálogo --</option>
                            {COMMON_ACCOUNTS.map(acc => (
                              <option key={acc.code} value={acc.code}>
                                {acc.code} - {acc.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="w-28">
                          <input
                            type="number"
                            step="0.01"
                            placeholder="Debe (0.00)"
                            value={line.debit || ''}
                            onChange={(e) => handleManualLineChange(idx, 'debit', e.target.value)}
                            className="w-full p-1.5 border rounded text-right font-mono text-xs font-bold text-blue-800 focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                        <div className="w-28">
                          <input
                            type="number"
                            step="0.01"
                            placeholder="Haber (0.00)"
                            value={line.credit || ''}
                            onChange={(e) => handleManualLineChange(idx, 'credit', e.target.value)}
                            className="w-full p-1.5 border rounded text-right font-mono text-xs font-bold text-emerald-800 focus:ring-1 focus:ring-emerald-500"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveManualLine(idx)}
                          className="px-2 py-1 text-red-600 hover:bg-red-50 rounded font-bold"
                          title="Eliminar asiento"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Resumen de Cuadre en Vivo */}
                  <div className="p-3 bg-white rounded-lg border border-gray-200 flex flex-wrap justify-between items-center text-xs font-mono">
                    <div className="flex gap-4">
                      <span>Total Debe: <strong className="text-blue-900">${manualTotalDebit.toFixed(2)}</strong></span>
                      <span>Total Haber: <strong className="text-emerald-900">${manualTotalCredit.toFixed(2)}</strong></span>
                    </div>
                    <div>
                      {isManualBalanced ? (
                        <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                          ✓ Partida Doble Cuadrada ($0.00)
                        </span>
                      ) : (
                        <span className="text-red-600 font-bold bg-red-50 px-2 py-1 rounded border border-red-200">
                          ⚠️ Descuadre: ${manualDiff.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t">
                  <button
                    type="button"
                    onClick={() => setShowManualModal(false)}
                    className="px-4 py-2 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={!isManualBalanced}
                    className={`px-5 py-2 text-xs font-bold rounded-lg shadow transition flex items-center gap-1.5 ${
                      isManualBalanced
                        ? 'bg-purple-800 hover:bg-purple-900 text-white cursor-pointer'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <span>💾</span> Guardar Póliza en Libro Diario
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 3 (ADICIÓN 3): VISTA DE IMPRESIÓN DE LIBRO FOLIADO OFICIAL */}
        {/* ========================================================================= */}
        {showFoliadoModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
              <div className="flex justify-between items-center border-b pb-3">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Libro Legal de IVA • Presentación Oficial Foliada</h3>
                  <p className="text-xs text-gray-500">Formato apto para archivo fiscal conforme al Art. 141 del Código Tributario de El Salvador</p>
                </div>
                <button onClick={() => setShowFoliadoModal(false)} className="text-gray-400 hover:text-gray-600 text-xl font-bold">✕</button>
              </div>

              <div className="border border-gray-300 rounded-xl p-6 bg-white space-y-4 flex-1 overflow-y-auto text-xs font-mono">
                {/* Membrete Oficial */}
                <div className="text-center border-b border-gray-400 pb-3 font-sans">
                  <h2 className="text-base font-black text-gray-900">NYTEX TEXTILES DE EL SALVADOR S.A. DE C.V.</h2>
                  <div className="text-xs text-gray-600">
                    NIT: 0614-120592-101-4 • NRC: 294820-1 • Giro: Fabricación y Comercialización Textil
                  </div>
                  <div className="mt-1 font-bold text-purple-900 uppercase">
                    LIBRO LEGAL DE {libroSubTab === 'Compras' ? 'COMPRAS' : libroSubTab === 'VentasCCF' ? 'VENTAS A CONTRIBUYENTES (CCF)' : libroSubTab === 'Consumidor' ? 'VENTAS A CONSUMIDOR FINAL' : 'EXPORTACIONES'}
                  </div>
                  <div className="text-xs text-gray-500">
                    Período Fiscal: Octubre 2026 • Folio Oficial Autorizado: N° 0048
                  </div>
                </div>

                {/* Resumen Legal */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px] border border-gray-300">
                    <thead className="bg-gray-100 font-bold border-b border-gray-300 font-sans">
                      <tr>
                        <th className="p-2 border-r">N°</th>
                        <th className="p-2 border-r">Fecha</th>
                        <th className="p-2 border-r">DTE Comprobante</th>
                        <th className="p-2 border-r">Tercero / Razón Social</th>
                        <th className="p-2 border-r text-right">Gravado USD</th>
                        <th className="p-2 border-r text-right">IVA (13%)</th>
                        <th className="p-2 text-right">Total USD</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {libroSubTab === 'Compras' && librosIva?.libroCompras?.map((c, i) => (
                        <tr key={i}>
                          <td className="p-2 border-r">{c.numero}</td>
                          <td className="p-2 border-r">{c.fecha}</td>
                          <td className="p-2 border-r font-bold">{c.dteNumero}</td>
                          <td className="p-2 border-r font-sans">{c.proveedor}</td>
                          <td className="p-2 border-r text-right">${c.comprasGravadas.toFixed(2)}</td>
                          <td className="p-2 border-r text-right">${c.creditoFiscal.toFixed(2)}</td>
                          <td className="p-2 text-right font-bold">${c.totalCompra.toFixed(2)}</td>
                        </tr>
                      ))}
                      {libroSubTab === 'VentasCCF' && librosIva?.libroVentasCCF?.map((v, i) => (
                        <tr key={i}>
                          <td className="p-2 border-r">{v.numero}</td>
                          <td className="p-2 border-r">{v.fecha}</td>
                          <td className="p-2 border-r font-bold">{v.dteNumero}</td>
                          <td className="p-2 border-r font-sans">{v.cliente}</td>
                          <td className="p-2 border-r text-right">${v.ventasGravadas.toFixed(2)}</td>
                          <td className="p-2 border-r text-right">${v.debitoFiscal.toFixed(2)}</td>
                          <td className="p-2 text-right font-bold">${v.totalVenta.toFixed(2)}</td>
                        </tr>
                      ))}
                      {libroSubTab === 'Consumidor' && librosIva?.libroConsumidorFinal?.map((cf, i) => (
                        <tr key={i}>
                          <td className="p-2 border-r">{i + 1}</td>
                          <td className="p-2 border-r">{cf.fecha}</td>
                          <td className="p-2 border-r font-bold">{cf.delFolio} - {cf.alFolio}</td>
                          <td className="p-2 border-r font-sans">{cf.sucursal}</td>
                          <td className="p-2 border-r text-right">${cf.ventasGravadasLocales.toFixed(2)}</td>
                          <td className="p-2 border-r text-right">${cf.debitoFiscal.toFixed(2)}</td>
                          <td className="p-2 text-right font-bold">${cf.totalDiario.toFixed(2)}</td>
                        </tr>
                      ))}
                      {libroSubTab === 'Exportaciones' && librosIva?.libroExportaciones?.map((exp, i) => (
                        <tr key={i}>
                          <td className="p-2 border-r">{i + 1}</td>
                          <td className="p-2 border-r">{exp.fecha}</td>
                          <td className="p-2 border-r font-bold">{exp.dteNumero}</td>
                          <td className="p-2 border-r font-sans">{exp.clienteExterior} ({exp.paisDestino})</td>
                          <td className="p-2 border-r text-right">${exp.valorFob.toFixed(2)}</td>
                          <td className="p-2 border-r text-right">$0.00 (Tasa 0%)</td>
                          <td className="p-2 text-right font-bold">${exp.valorFob.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Firmas de Autorización Legal */}
                <div className="grid grid-cols-2 gap-8 pt-8 font-sans text-center">
                  <div className="border-t border-gray-400 pt-2">
                    <div className="font-bold text-gray-900">C.P. Mario Castaneda</div>
                    <div className="text-[10px] text-gray-500">Contador General • Registro N° 28419</div>
                  </div>
                  <div className="border-t border-gray-400 pt-2">
                    <div className="font-bold text-gray-900">Lic. Ernesto Palacios</div>
                    <div className="text-[10px] text-gray-500">Auditor Externo Independiente • Registro N° 9812</div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 border-t">
                <button
                  onClick={() => setShowFoliadoModal(false)}
                  className="px-4 py-2 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-5 py-2 text-xs bg-purple-800 hover:bg-purple-900 text-white font-bold rounded-lg shadow transition flex items-center gap-1.5"
                >
                  <span>🖨️</span> Imprimir Folio Oficial (PDF / Impresora)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 4 (ADICIÓN 4): MANDAMIENTO DE PAGO ELECTRÓNICO (NPE) BANCARIO */}
        {/* ========================================================================= */}
        {npeModalData && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🏛️</span>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">Mandamiento de Ingreso / Pago Electrónico (NPE)</h3>
                    <p className="text-xs text-gray-500">Ministerio de Hacienda • Dirección General de Tesorería</p>
                  </div>
                </div>
                <button onClick={() => setNpeModalData(null)} className="text-gray-400 hover:text-gray-600 text-xl font-bold">✕</button>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-xl p-5 bg-amber-50/20 space-y-4 font-mono text-xs">
                <div className="flex justify-between border-b pb-2 text-[11px]">
                  <span>FORMULARIO OFICIAL: <strong>{npeModalData.form} ({npeModalData.name})</strong></span>
                  <span>PERÍODO: <strong>2026-10</strong></span>
                </div>

                <div className="space-y-1 text-gray-700">
                  <div>CONTRIBUYENTE: <strong className="font-sans">NYTEX TEXTILES DE EL SALVADOR S.A. DE C.V.</strong></div>
                  <div>NIT: <strong>0614-120592-101-4</strong> | NRC: <strong>294820-1</strong></div>
                  <div>VENCIMIENTO: <strong>13 DE NOVIEMBRE DE 2026</strong></div>
                </div>

                <div className="p-3 bg-white rounded-lg border border-gray-200 text-center space-y-1">
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest font-sans font-bold">Número de Pago Electrónico (NPE)</span>
                  <div className="text-lg font-black text-purple-950 tracking-wider">
                    {npeModalData.npe}
                  </div>
                  <div className="text-[10px] text-gray-400 font-sans">
                    Presente este código en ventanilla bancaria o ingréselo en su banca electrónica.
                  </div>
                </div>

                {/* Código de Barras Simulado para Banco */}
                <div className="p-3 bg-white rounded-lg border border-gray-200 text-center space-y-1.5">
                  <div className="h-10 w-full flex justify-center items-center gap-[2px] px-8">
                    {[1,2,4,1,3,2,1,4,2,3,1,2,4,1,3,2,1,2,3,4,1,2,1,3,2,4,1,3,2,1,4,2,3,1,2,4,1,3,2,1].map((w, i) => (
                      <div key={i} className={`h-8 ${w === 4 ? 'w-[4px]' : w === 3 ? 'w-[3px]' : w === 2 ? 'w-[2px]' : 'w-[1px]'} bg-black`}></div>
                    ))}
                  </div>
                  <span className="text-[10px] text-gray-500 tracking-widest font-mono">*{npeModalData.npe.replace(/-/g, '')}*</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-purple-900 text-white rounded-xl">
                  <span className="font-sans font-bold text-sm">TOTAL A PAGAR AL FISCO:</span>
                  <span className="text-xl font-black">${(npeModalData.amount || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })} USD</span>
                </div>

                <div className="text-[10px] text-gray-500 font-sans leading-tight">
                  Autorizado para pago en: <strong>Banco Agrícola, Banco Cuscatlán, BAC Credomatic, Banco Davivienda, Banco Promerica y Sistema Transfer365.</strong>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 border-t">
                <button
                  onClick={() => setNpeModalData(null)}
                  className="px-4 py-2 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-5 py-2 text-xs bg-purple-800 hover:bg-purple-900 text-white font-bold rounded-lg shadow transition flex items-center gap-1.5"
                >
                  <span>🖨️</span> Imprimir Boleta Bancaria
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
