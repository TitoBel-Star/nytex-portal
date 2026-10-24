import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CxpView() {
  const navigate = useNavigate();
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  
  // Modal de Pago / Dispersión
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [payingBill, setPayingBill] = useState(null);
  const [payAmount, setPayAmount] = useState('');
  const [payMethod, setPayMethod] = useState('Transferencia Bancaria SPEI');
  const [payReference, setPayReference] = useState('');

  // Modal Historial de Pagos
  const [selectedBill, setSelectedBill] = useState(null);

  // Modal Voucher Oficial de Pago SPEI
  const [voucherModalOpen, setVoucherModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [voucherBill, setVoucherBill] = useState(null);

  // Modal Antigüedad de Saldos (Aging)
  const [agingModalOpen, setAgingModalOpen] = useState(false);

  // Modal Registrar Factura Proveedor con Retenciones y UUID
  const [createBillModalOpen, setCreateBillModalOpen] = useState(false);
  const [partners, setPartners] = useState([]);
  const [vendorCode, setVendorCode] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [uuid, setUuid] = useState('');
  const [creditDays, setCreditDays] = useState(30);
  const [subtotal, setSubtotal] = useState('25000');
  const [retentionType, setRetentionType] = useState('Ninguna');
  const [concept, setConcept] = useState('Compra de Materia Prima / Hilo');

  const fetchBills = async () => {
    try {
      const [resBills, resBp] = await Promise.all([
        fetch('/api/cxp/bills'),
        fetch('/api/business-partners')
      ]);
      if (resBills.ok) {
        const data = await resBills.json();
        setBills(data);
      }
      if (resBp.ok) {
        const bpData = await resBp.json();
        const vendors = bpData.filter(b => b.type === 'Proveedor');
        setPartners(vendors.length > 0 ? vendors : bpData);
        if (vendors.length > 0 && !vendorCode) {
          setVendorCode(vendors[0].code);
        }
      }
    } catch (err) {
      console.error('Error fetching CxP bills:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const generateUuid = () => {
    const hex = (len) => Math.random().toString(16).substring(2, 2 + len).toUpperCase();
    const newUuid = `${hex(8)}-${hex(4)}-4${hex(3)}-${hex(4)}-${hex(12)}`;
    setUuid(newUuid);
  };

  const handleOpenCreateModal = () => {
    generateUuid();
    setInvoiceNumber(`FAC-PRV-${Math.floor(10000 + Math.random() * 90000)}`);
    setCreateBillModalOpen(true);
  };

  // Cálculos tributarios en tiempo real para el registro de factura
  const subNum = parseFloat(subtotal) || 0;
  const ivaNum = Math.round(subNum * 0.13 * 100) / 100;
  let retentionCalc = 0;
  if (retentionType === 'Retención IVA Flete (4%)') {
    retentionCalc = Math.round(subNum * 0.04 * 100) / 100;
  } else if (retentionType === 'Retención Servicios (10% ISR + 10.67% IVA)') {
    retentionCalc = Math.round(subNum * 0.2067 * 100) / 100;
  } else if (retentionType === 'Retención RESICO (1.25% ISR)') {
    retentionCalc = Math.round(subNum * 0.0125 * 100) / 100;
  }
  const totalPasivoCalc = Math.round((subNum + ivaNum - retentionCalc) * 100) / 100;

  const handleCreateBill = async (e) => {
    e.preventDefault();
    const selVendor = partners.find(p => p.code === vendorCode) || { name: 'Proveedor General' };
    try {
      const res = await fetch('/api/cxp/bills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendorCode: vendorCode || 'PRV-001',
          vendorName: selVendor.name,
          invoiceNumber: invoiceNumber || `FPROV-${Math.floor(100000 + Math.random() * 900000)}`,
          uuid: uuid || `SAT-${Date.now()}`,
          concept,
          subtotal: subNum,
          retentionType,
          creditDays: parseInt(creditDays, 10) || 30
        })
      });
      const data = await res.json();
      if (res.ok) {
        setActionMessage(data.message);
        setTimeout(() => setActionMessage(''), 8000);
        setCreateBillModalOpen(false);
        setInvoiceNumber('');
        setUuid('');
        fetchBills();
      } else {
        alert(data.error || 'Error al registrar factura de proveedor');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openPayModal = (bill) => {
    setPayingBill(bill);
    setPayAmount(bill.balance.toString());
    setPayReference(`EGR-SPEI-${Math.floor(100000 + Math.random() * 900000)}`);
    setPayModalOpen(true);
  };

  const handleApplyPayment = async (e) => {
    e.preventDefault();
    if (!payingBill) return;

    try {
      const res = await fetch(`/api/cxp/bills/${payingBill.billCode}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(payAmount),
          method: payMethod,
          reference: payReference
        })
      });
      const result = await res.json();
      if (res.ok) {
        setActionMessage(result.message);
        setTimeout(() => setActionMessage(''), 7000);
        setPayModalOpen(false);
        fetchBills();
      } else {
        alert(result.error || 'Error al aplicar pago a proveedor');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openVoucher = (bill, payment) => {
    setVoucherBill(bill);
    setSelectedPayment(payment);
    setVoucherModalOpen(true);
  };

  // Filtros combinados (Estado + Buscador Predictivo)
  const filteredBills = bills.filter(b => {
    const matchesStatus = filterStatus === 'Todos' || b.status === filterStatus;
    if (!matchesStatus) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (b.billCode && b.billCode.toLowerCase().includes(q)) ||
      (b.poCode && b.poCode.toLowerCase().includes(q)) ||
      (b.invoiceNumber && b.invoiceNumber.toLowerCase().includes(q)) ||
      (b.vendorName && b.vendorName.toLowerCase().includes(q)) ||
      (b.vendorCode && b.vendorCode.toLowerCase().includes(q)) ||
      (b.uuid && b.uuid.toLowerCase().includes(q))
    );
  });

  const totalBalance = bills.reduce((sum, b) => sum + (b.balance || 0), 0);
  const totalPaid = bills.reduce((sum, b) => sum + (b.paidAmount || 0), 0);
  const overdueCount = bills.filter(b => b.status === 'Vencida').length;

  // Cálculo del Aging de Pasivos (Antigüedad de Saldos)
  const today = new Date();
  const aging = {
    current: 0,
    days1to30: 0,
    days31to60: 0,
    daysOver60: 0
  };

  bills.forEach(b => {
    if (b.balance > 0) {
      const due = new Date(b.dueDate);
      const diffDays = Math.floor((today - due) / (1000 * 60 * 60 * 24));
      if (diffDays <= 0) {
        aging.current += b.balance;
      } else if (diffDays <= 30) {
        aging.days1to30 += b.balance;
      } else if (diffDays <= 60) {
        aging.days31to60 += b.balance;
      } else {
        aging.daysOver60 += b.balance;
      }
    }
  });

  // Exportar a Excel (CSV con codificación UTF-8)
  const exportToCsv = () => {
    const headers = [
      'Folio CxP',
      'Orden Compra',
      'Factura Proveedor',
      'UUID SAT',
      'Codigo Proveedor',
      'Proveedor',
      'Fecha Emision',
      'Fecha Vencimiento',
      'Subtotal USD',
      'IVA USD',
      'Retenciones USD',
      'Importe Total USD',
      'Saldo Pendiente USD',
      'Estado Pasivo'
    ];

    const rows = filteredBills.map(b => [
      `"${b.billCode || ''}"`,
      `"${b.poCode || ''}"`,
      `"${b.invoiceNumber || ''}"`,
      `"${b.uuid || 'N/A'}"`,
      `"${b.vendorCode || ''}"`,
      `"${(b.vendorName || '').replace(/"/g, '""')}"`,
      `"${b.issueDate || ''}"`,
      `"${b.dueDate || ''}"`,
      (b.subtotal || b.totalAmount / 1.13 || 0).toFixed(2),
      (b.tax || (b.totalAmount - (b.totalAmount / 1.13)) || 0).toFixed(2),
      (b.retentionAmount || 0).toFixed(2),
      (b.totalAmount || 0).toFixed(2),
      (b.balance || 0).toFixed(2),
      `"${b.status || ''}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `NyTEX_Cuentas_por_Pagar_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Al Corriente': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Por Vencer': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Vencida': return 'bg-red-100 text-red-800 border-red-300 font-bold';
      case 'Pagada': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
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
              <span className="px-2 py-0.5 text-xs bg-red-100 text-red-800 font-bold rounded">Módulo [9]</span>
              NyTEX CxP (Cuentas por Pagar & Pasivos Integrados)
            </span>
          </div>
          <div className="flex items-center flex-wrap gap-2">
            <button 
              onClick={() => navigate('/app/compras')}
              className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded-md text-xs font-semibold shadow-sm transition"
            >
              Ir a Compras [3]
            </button>
            <button 
              onClick={() => navigate('/app/businesspartners')}
              className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded-md text-xs font-semibold shadow-sm transition"
            >
              Ver Proveedores en BP [23]
            </button>
            <button 
              onClick={() => setAgingModalOpen(true)}
              className="bg-slate-800 hover:bg-slate-900 text-white px-3 py-1.5 rounded-md text-xs font-bold shadow-sm transition flex items-center gap-1.5"
            >
              <span>📊</span> Antigüedad de Saldos (Aging)
            </button>
            <button 
              onClick={exportToCsv}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-md text-xs font-bold shadow-sm transition flex items-center gap-1.5"
            >
              <span>📥</span> Exportar Excel (CSV)
            </button>
            <button 
              onClick={() => window.print()}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1.5 rounded-md text-xs font-bold shadow-sm transition flex items-center gap-1.5"
            >
              <span>🖨️</span> Imprimir Corte
            </button>
            <button 
              onClick={handleOpenCreateModal}
              className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-md text-sm font-bold shadow-sm transition flex items-center gap-1.5"
            >
              <span>+</span> Registrar Factura Proveedor
            </button>
            <button 
              onClick={fetchBills}
              className="bg-[#006EAD] hover:bg-[#005587] text-white px-4 py-2 rounded-md text-sm font-bold shadow-sm transition"
            >
              ↻ Refrescar Pasivos
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 text-gray-800 w-full space-y-6">
        {/* Banner de Mensaje */}
        {actionMessage && (
          <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-r-lg shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl">💳</span>
              <div>
                <p className="text-sm font-bold text-emerald-900">Operación Contable y de Dispersión Exitosa</p>
                <p className="text-xs text-emerald-700">{actionMessage}</p>
              </div>
            </div>
            <button onClick={() => setActionMessage('')} className="text-emerald-700 hover:text-emerald-900 text-xs font-bold">✕ Cerrar</button>
          </div>
        )}

        {/* KPIs de CxP */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center justify-between">
            <div>
              <span className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Pasivo Total Pendiente</span>
              <span className="block text-2xl font-extrabold text-red-600 font-mono">
                ${totalBalance.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </span>
              <span className="text-xs text-gray-400">Por pagar a proveedores</span>
            </div>
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center text-xl font-bold">
              📉
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center justify-between">
            <div>
              <span className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Pagos Dispersados</span>
              <span className="block text-2xl font-extrabold text-emerald-600 font-mono">
                ${totalPaid.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </span>
              <span className="text-xs text-emerald-500 font-semibold">Total liquidado</span>
            </div>
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center text-xl font-bold">
              💸
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center justify-between">
            <div>
              <span className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Facturas de Proveedor</span>
              <span className="block text-3xl font-extrabold text-[#006EAD]">{bills.length}</span>
              <span className="text-xs text-gray-400">Con timbre fiscal y CFDI</span>
            </div>
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold">
              📑
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center justify-between">
            <div>
              <span className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Facturas Vencidas</span>
              <span className={`block text-3xl font-extrabold ${overdueCount > 0 ? 'text-red-600' : 'text-gray-400'}`}>
                {overdueCount}
              </span>
              <span className="text-xs text-gray-400">Exceden plazo de crédito</span>
            </div>
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center text-xl font-bold">
              ⏳
            </div>
          </div>
        </div>

        {/* Resumen Compacto de Antigüedad de Saldos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1.5">
              <span>📊</span> Resumen Ejecutivo de Antigüedad de Saldos (Aging de Pasivos)
            </span>
            <button 
              onClick={() => setAgingModalOpen(true)}
              className="text-xs text-[#006EAD] hover:underline font-bold"
            >
              Ver Detalle Completo por Proveedor ➔
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-lg">
              <span className="text-gray-500 font-bold block">Al Corriente (Vigente)</span>
              <span className="text-base font-extrabold text-blue-900 font-mono block">
                ${aging.current.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </span>
              <span className="text-[10px] text-blue-700">
                {totalBalance > 0 ? ((aging.current / totalBalance) * 100).toFixed(1) : 0}% del pasivo
              </span>
            </div>
            <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-lg">
              <span className="text-gray-500 font-bold block">Vencido 1 a 30 días</span>
              <span className="text-base font-extrabold text-amber-900 font-mono block">
                ${aging.days1to30.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </span>
              <span className="text-[10px] text-amber-700">
                {totalBalance > 0 ? ((aging.days1to30 / totalBalance) * 100).toFixed(1) : 0}% del pasivo
              </span>
            </div>
            <div className="p-3 bg-orange-50/60 border border-orange-200 rounded-lg">
              <span className="text-gray-500 font-bold block">Vencido 31 a 60 días</span>
              <span className="text-base font-extrabold text-orange-900 font-mono block">
                ${aging.days31to60.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </span>
              <span className="text-[10px] text-orange-700">
                {totalBalance > 0 ? ((aging.days31to60 / totalBalance) * 100).toFixed(1) : 0}% del pasivo
              </span>
            </div>
            <div className="p-3 bg-red-50/60 border border-red-200 rounded-lg">
              <span className="text-gray-500 font-bold block">Vencido +60 días (Crítico)</span>
              <span className="text-base font-extrabold text-red-900 font-mono block">
                ${aging.daysOver60.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </span>
              <span className="text-[10px] text-red-700">
                {totalBalance > 0 ? ((aging.daysOver60 / totalBalance) * 100).toFixed(1) : 0}% del pasivo
              </span>
            </div>
          </div>
        </div>

        {/* Tabla de Facturas por Pagar con Buscador Predictivo */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="flex flex-wrap items-center justify-between border-b border-gray-100 px-6 py-4 bg-gray-50/50 gap-4">
            
            {/* Filtros de Estado Pasivo */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold text-gray-500 uppercase mr-1">Estado:</span>
              {['Todos', 'Al Corriente', 'Por Vencer', 'Vencida', 'Pagada'].map(st => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    filterStatus === st 
                      ? 'bg-[#006EAD] text-white shadow-sm' 
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Buscador Predictivo en Tiempo Real */}
            <div className="flex items-center gap-3">
              <div className="relative w-72">
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por folio, factura, proveedor o UUID..."
                  className="w-full pl-8 pr-3 py-1.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#006EAD] focus:outline-none"
                />
                <span className="absolute left-2.5 top-2 text-gray-400 text-xs">🔍</span>
              </div>
              <div className="text-xs text-gray-500">
                Mostrando <strong className="text-gray-800">{filteredBills.length}</strong> facturas
              </div>
            </div>

          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold border-b border-gray-100">
                <tr>
                  <th className="px-5 py-3.5">Folio CxP & UUID</th>
                  <th className="px-5 py-3.5">Orden / Factura Prov.</th>
                  <th className="px-5 py-3.5">Proveedor (Business Partner)</th>
                  <th className="px-5 py-3.5">Vencimiento</th>
                  <th className="px-5 py-3.5 text-right">Importe Factura</th>
                  <th className="px-5 py-3.5 text-right">Saldo por Pagar</th>
                  <th className="px-5 py-3.5 text-center">Estado</th>
                  <th className="px-5 py-3.5 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-8 text-center text-gray-400">Cargando cuentas por pagar...</td>
                  </tr>
                ) : filteredBills.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-8 text-center text-gray-400">No se encontraron facturas con el criterio seleccionado.</td>
                  </tr>
                ) : (
                  filteredBills.map(b => (
                    <tr key={b.id} className="hover:bg-red-50/20 transition">
                      <td className="px-5 py-4">
                        <div className="font-mono font-bold text-red-700">{b.billCode}</div>
                        <div className="text-[10px] font-mono text-gray-400 truncate max-w-[140px]" title={b.uuid || 'SAT-GENERIC'}>
                          🏷️ {b.uuid || 'SAT-CFDI-TIMBRADO'}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-semibold text-gray-800 text-xs">{b.invoiceNumber || 'FPROV-S/N'}</div>
                        <div className="text-xs text-gray-400 font-mono">{b.poCode}</div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-semibold text-gray-900 text-xs">{b.vendorName}</div>
                        <div className="text-[11px] font-mono text-gray-400">{b.vendorCode}</div>
                      </td>
                      <td className="px-5 py-4 text-xs text-gray-600">
                        <div>📅 {b.dueDate}</div>
                        <div className="text-[10px] text-gray-400">{b.creditDays || 30} días crédito</div>
                      </td>
                      <td className="px-5 py-4 text-right font-mono text-xs">
                        <div className="font-bold text-gray-900">
                          ${b.totalAmount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                        </div>
                        {b.retentionAmount > 0 && (
                          <div className="text-[10px] text-amber-700 font-semibold">
                            Ret: -${b.retentionAmount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right font-mono font-bold text-red-600">
                        ${b.balance.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(b.status)}`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedBill(b)}
                            className="px-2.5 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded"
                          >
                            Pagos ({b.paymentsLog ? b.paymentsLog.length : 0})
                          </button>
                          {b.balance > 0 ? (
                            <button
                              onClick={() => openPayModal(b)}
                              className="px-3 py-1 text-xs bg-red-600 hover:bg-red-700 text-white font-bold rounded shadow-sm transition"
                            >
                              💳 Programar Pago
                            </button>
                          ) : (
                            <span className="px-2.5 py-1 text-xs bg-emerald-50 text-emerald-700 font-bold rounded">
                              ✓ Liquidada
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ======================================================== */}
        {/* MODAL REGISTRAR FACTURA PROVEEDOR (CON RETENCIONES Y UUID) */}
        {/* ======================================================== */}
        {createBillModalOpen && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📥</span>
                  <div>
                    <h3 className="text-lg font-bold text-[#0A2540]">Registrar Factura de Proveedor</h3>
                    <p className="text-xs text-gray-500">Módulo [9] Cuentas por Pagar & Pasivos Integrados</p>
                  </div>
                </div>
                <button onClick={() => setCreateBillModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl font-bold">✕</button>
              </div>

              <form onSubmit={handleCreateBill} className="space-y-4 text-xs">
                
                {/* Proveedor */}
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Proveedor Emisor (Business Partner)</label>
                  <select
                    value={vendorCode}
                    onChange={(e) => setVendorCode(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                    required
                  >
                    {partners.map(p => (
                      <option key={p.code} value={p.code}>
                        {p.code} - {p.name} (RFC: {p.taxId || 'Generico'}) | {p.bankName || 'Banco Registrado'}
                      </option>
                    ))}
                    {partners.length === 0 && (
                      <option value="PRV-001">PRV-001 - Hilos & Algodones de México S.A.</option>
                    )}
                  </select>
                </div>

                {/* Folio Factura y Timbre Fiscal UUID SAT */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 uppercase mb-1">Folio / N° Factura Proveedor</label>
                    <input
                      type="text"
                      value={invoiceNumber}
                      onChange={(e) => setInvoiceNumber(e.target.value)}
                      placeholder="Ej. F-98421"
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-sm font-mono focus:ring-2 focus:ring-red-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="font-bold text-gray-700 uppercase">Folio Fiscal Digital (UUID SAT)</label>
                      <button 
                        type="button" 
                        onClick={generateUuid} 
                        className="text-[10px] text-blue-600 hover:underline font-bold"
                      >
                        ⚡ Generar UUID
                      </button>
                    </div>
                    <input
                      type="text"
                      value={uuid}
                      onChange={(e) => setUuid(e.target.value)}
                      placeholder="XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-xs font-mono focus:ring-2 focus:ring-red-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Importes, Plazo y Retenciones Fiscales */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 uppercase mb-1">Subtotal Compra (USD)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="1"
                      value={subtotal}
                      onChange={(e) => setSubtotal(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-sm font-mono font-bold focus:ring-2 focus:ring-red-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 uppercase mb-1">Plazo de Crédito (Días)</label>
                    <select
                      value={creditDays}
                      onChange={(e) => setCreditDays(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-sm"
                    >
                      <option value="15">15 días</option>
                      <option value="30">30 días (Estándar)</option>
                      <option value="45">45 días</option>
                      <option value="60">60 días</option>
                      <option value="90">90 días</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 uppercase mb-1">Régimen de Retención Fiscal</label>
                    <select
                      value={retentionType}
                      onChange={(e) => setRetentionType(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-sm font-semibold"
                    >
                      <option value="Ninguna">Ninguna (Compra Regular)</option>
                      <option value="Retención IVA Flete (4%)">Retención IVA Flete (4%)</option>
                      <option value="Retención Servicios (10% ISR + 10.67% IVA)">Retención Servicios (10% ISR + 10.67% IVA)</option>
                      <option value="Retención RESICO (1.25% ISR)">Retención RESICO (1.25% ISR)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Concepto del Gasto / Compra</label>
                  <input
                    type="text"
                    value={concept}
                    onChange={(e) => setConcept(e.target.value)}
                    placeholder="Ej. Adquisición de Hilatura y Químicos de Teñido"
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                    required
                  />
                </div>

                {/* Resumen Fiscal Calculado Automáticamente */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1.5 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal base compra:</span>
                    <span className="font-mono font-bold">${subNum.toLocaleString('es-MX', { minimumFractionDigits: 2 })} USD</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>IVA Acreditable (13%):</span>
                    <span className="font-mono font-bold text-blue-700">+${ivaNum.toLocaleString('es-MX', { minimumFractionDigits: 2 })} USD</span>
                  </div>
                  {retentionCalc > 0 && (
                    <div className="flex justify-between text-amber-800 font-bold bg-amber-50 p-1.5 rounded">
                      <span>(-) {retentionType}:</span>
                      <span className="font-mono">-${retentionCalc.toLocaleString('es-MX', { minimumFractionDigits: 2 })} USD</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-extrabold text-[#0A2540] border-t border-slate-200 pt-1.5">
                    <span>Pasivo Neto Total Exigible en CxP:</span>
                    <span className="font-mono text-red-700">${totalPasivoCalc.toLocaleString('es-MX', { minimumFractionDigits: 2 })} USD</span>
                  </div>
                </div>

                <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-900 flex items-start gap-2">
                  <span>ℹ️</span>
                  <span>Se creará el pasivo formal en <strong>CxP</strong> a {creditDays} días y se generará la <strong>Póliza Contable de Diario</strong> cuadrada afectando cuentas de compras, IVA y retenciones correspondientes.</span>
                </div>

                <div className="flex justify-end space-x-3 pt-3 border-t">
                  <button
                    type="button"
                    onClick={() => setCreateBillModalOpen(false)}
                    className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-sm bg-red-700 hover:bg-red-800 text-white font-bold rounded-lg shadow-md transition"
                  >
                    Registrar en CxP y Contabilizar ➔
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* MODAL DISPERSAR PAGO A PROVEEDOR */}
        {/* ======================================================== */}
        {payModalOpen && payingBill && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <div>
                  <h3 className="text-lg font-bold text-[#0A2540]">Dispersar Pago a Proveedor</h3>
                  <p className="text-xs text-gray-500">Factura: {payingBill.billCode} | {payingBill.vendorName}</p>
                </div>
                <button onClick={() => setPayModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl font-bold">✕</button>
              </div>

              <form onSubmit={handleApplyPayment} className="space-y-4 text-sm">
                <div className="p-3 bg-red-50 rounded-lg flex justify-between items-center">
                  <span className="text-xs text-red-900 font-bold uppercase">Saldo Pasivo Actual:</span>
                  <span className="text-base font-extrabold text-red-900 font-mono">
                    ${payingBill.balance.toLocaleString('es-MX', { minimumFractionDigits: 2 })} USD
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Monto a Dispersar ($ USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    max={payingBill.balance}
                    required
                    value={payAmount}
                    onChange={(e) => setPayAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono font-bold text-lg text-gray-800 focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Método de Dispersión Bancaria</label>
                  <select
                    value={payMethod}
                    onChange={(e) => setPayMethod(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-red-600"
                  >
                    <option value="Transferencia Bancaria SPEI">Transferencia Bancaria SPEI</option>
                    <option value="Transferencia Internacional SWIFT">Transferencia Internacional SWIFT</option>
                    <option value="Cheque Nominativo">Cheque Nominativo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Referencia / Rastreo Bancario</label>
                  <input
                    type="text"
                    required
                    value={payReference}
                    onChange={(e) => setPayReference(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 font-mono text-sm focus:outline-none focus:border-red-600"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t">
                  <button
                    type="button"
                    onClick={() => setPayModalOpen(false)}
                    className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-sm bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-sm transition"
                  >
                    Confirmar Dispersión y Actualizar Saldo BP
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* MODAL HISTORIAL DE PAGOS & VOUCHERS */}
        {/* ======================================================== */}
        {selectedBill && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <div>
                  <h3 className="text-lg font-bold text-[#0A2540]">Historial de Egresos - {selectedBill.billCode}</h3>
                  <p className="text-xs text-gray-500">Proveedor: {selectedBill.vendorName} | Factura: {selectedBill.invoiceNumber}</p>
                </div>
                <button onClick={() => setSelectedBill(null)} className="text-gray-400 hover:text-gray-600 text-xl font-bold">✕</button>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {selectedBill.paymentsLog && selectedBill.paymentsLog.length > 0 ? (
                  selectedBill.paymentsLog.map((p, idx) => (
                    <div key={idx} className="p-3 bg-gray-50 rounded-lg border flex justify-between items-center text-xs">
                      <div>
                        <div className="font-bold text-gray-800">{p.method}</div>
                        <div className="text-gray-400 font-mono">Ref: {p.reference} | {new Date(p.date).toLocaleDateString()}</div>
                      </div>
                      <div className="text-right flex items-center gap-3">
                        <div className="font-mono font-bold text-red-600 text-sm">
                          -${p.amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                        </div>
                        <button
                          onClick={() => openVoucher(selectedBill, p)}
                          className="px-2 py-1 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded text-[10px]"
                          title="Ver Comprobante Oficial SPEI"
                        >
                          🖨️ Voucher
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-4 text-gray-400 text-xs">No se han registrado pagos para esta factura aún.</p>
                )}
              </div>

              <div className="flex justify-end pt-3 border-t">
                <button
                  onClick={() => setSelectedBill(null)}
                  className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* MODAL VOUCHER OFICIAL SPEI / COMPROBANTE DE DISPERSIÓN */}
        {/* ======================================================== */}
        {voucherModalOpen && selectedPayment && voucherBill && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🏦</span>
                  <div>
                    <h3 className="text-base font-bold text-[#0A2540]">Comprobante Oficial de Dispersión Bancaria</h3>
                    <p className="text-[10px] text-gray-400 font-mono">NyTEX Tesorería Corporativa | SPEI / SWIFT</p>
                  </div>
                </div>
                <button onClick={() => setVoucherModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl font-bold">✕</button>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="font-bold text-[#006EAD]">NyTEX Textil de México S.A. de C.V.</span>
                  <span className="font-mono text-gray-500">RFC: NTM180612TX4</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-gray-600">
                  <div>
                    <span className="block text-[10px] text-gray-400 uppercase">Referencia SPEI / Rastreo</span>
                    <span className="font-mono font-bold text-gray-800">{selectedPayment.reference}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-gray-400 uppercase">Fecha y Hora de Emisión</span>
                    <span className="font-mono font-bold text-gray-800">{new Date(selectedPayment.date).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-gray-400 uppercase">Cuenta Ordenante (Emisora)</span>
                    <span className="font-mono text-gray-800">BBVA Bancomer (•9912)</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-gray-400 uppercase">Método Aplicado</span>
                    <span className="font-semibold text-emerald-800">{selectedPayment.method}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <span className="block text-[10px] text-gray-400 uppercase">Beneficiario / Proveedor Destino</span>
                  <span className="font-bold text-gray-900 block text-sm">{voucherBill.vendorName}</span>
                  <span className="text-[10px] text-gray-500 font-mono">Código: {voucherBill.vendorCode} | Factura Amparada: {voucherBill.invoiceNumber}</span>
                </div>

                <div className="p-3 bg-white rounded-lg border border-slate-200 flex justify-between items-center">
                  <span className="font-bold text-gray-700 uppercase text-xs">Monto Liquidado:</span>
                  <span className="text-xl font-extrabold font-mono text-emerald-700">
                    ${selectedPayment.amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })} USD
                  </span>
                </div>

                <div className="text-[9px] font-mono text-gray-400 break-all bg-slate-100 p-2 rounded">
                  CADENA DIGITAL: ||{selectedPayment.reference}|{voucherBill.billCode}|{selectedPayment.amount}|{selectedPayment.date}||SHA256:7f8a9b2c3d4e5f6a1b2c3d4e5f6a7b8c
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 text-xs bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-lg flex items-center gap-1.5"
                >
                  <span>🖨️</span> Imprimir Voucher Oficial
                </button>
                <button
                  onClick={() => setVoucherModalOpen(false)}
                  className="px-4 py-2 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* MODAL DETALLE DE ANTIGÜEDAD DE SALDOS (AGING) */}
        {/* ======================================================== */}
        {agingModalOpen && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📊</span>
                  <div>
                    <h3 className="text-lg font-bold text-[#0A2540]">Reporte de Antigüedad de Saldos (Aging de CxP)</h3>
                    <p className="text-xs text-gray-500">Corte Analítico de Pasivos por Vencimiento</p>
                  </div>
                </div>
                <button onClick={() => setAgingModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl font-bold">✕</button>
              </div>

              {/* Cubos de Aging */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <span className="text-gray-500 font-bold block mb-1">0 a 30 Días (Al Corriente)</span>
                  <span className="text-xl font-black text-blue-900 font-mono block">
                    ${aging.current.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-[11px] text-blue-700 font-semibold">Vigente / Sin riesgo</span>
                </div>
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <span className="text-gray-500 font-bold block mb-1">1 a 30 Días Vencido</span>
                  <span className="text-xl font-black text-amber-900 font-mono block">
                    ${aging.days1to30.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-[11px] text-amber-700 font-semibold">Prioridad de tesorería</span>
                </div>
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl">
                  <span className="text-gray-500 font-bold block mb-1">31 a 60 Días Vencido</span>
                  <span className="text-xl font-black text-orange-900 font-mono block">
                    ${aging.days31to60.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-[11px] text-orange-700 font-semibold">Gestión con proveedor</span>
                </div>
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <span className="text-gray-500 font-bold block mb-1">+60 Días Vencido</span>
                  <span className="text-xl font-black text-red-900 font-mono block">
                    ${aging.daysOver60.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-[11px] text-red-700 font-semibold">Riesgo de corte de abasto</span>
                </div>
              </div>

              {/* Tabla Detallada de Facturas con Antigüedad */}
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-100 text-gray-600 uppercase font-bold">
                    <tr>
                      <th className="px-4 py-2.5">Folio CxP</th>
                      <th className="px-4 py-2.5">Proveedor</th>
                      <th className="px-4 py-2.5">Vencimiento</th>
                      <th className="px-4 py-2.5 text-center">Días Mora</th>
                      <th className="px-4 py-2.5 text-right">Saldo Deudor</th>
                      <th className="px-4 py-2.5 text-center">Segmento Aging</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {bills.filter(b => b.balance > 0).map(b => {
                      const due = new Date(b.dueDate);
                      const diffDays = Math.floor((today - due) / (1000 * 60 * 60 * 24));
                      const segment = diffDays <= 0 ? 'Vigente' : diffDays <= 30 ? '1-30 Días' : diffDays <= 60 ? '31-60 Días' : '+60 Días';
                      const segmentColor = diffDays <= 0 ? 'bg-blue-100 text-blue-800' : diffDays <= 30 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800';

                      return (
                        <tr key={b.id} className="hover:bg-gray-50">
                          <td className="px-4 py-2 font-mono font-bold text-red-700">{b.billCode}</td>
                          <td className="px-4 py-2 font-semibold text-gray-800">{b.vendorName}</td>
                          <td className="px-4 py-2 font-mono text-gray-600">{b.dueDate}</td>
                          <td className="px-4 py-2 text-center font-mono font-bold">
                            {diffDays > 0 ? `+${diffDays} d` : `${Math.abs(diffDays)} d rest`}
                          </td>
                          <td className="px-4 py-2 text-right font-mono font-bold text-red-600">
                            ${b.balance.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="px-4 py-2 text-center">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${segmentColor}`}>
                              {segment}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center pt-3 border-t">
                <button
                  onClick={exportToCsv}
                  className="px-4 py-2 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg flex items-center gap-1.5"
                >
                  <span>📥</span> Descargar Cartera en Excel
                </button>
                <button
                  onClick={() => setAgingModalOpen(false)}
                  className="px-5 py-2 text-xs bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-lg"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
