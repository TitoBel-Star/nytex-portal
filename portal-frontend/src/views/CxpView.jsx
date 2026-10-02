import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CxpView() {
  const navigate = useNavigate();
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('Todos');
  const [actionMessage, setActionMessage] = useState('');
  
  // Modal de Pago
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [payingBill, setPayingBill] = useState(null);
  const [payAmount, setPayAmount] = useState('');
  const [payMethod, setPayMethod] = useState('Transferencia Bancaria SPEI');
  const [payReference, setPayReference] = useState('');

  // Modal Historial
  const [selectedBill, setSelectedBill] = useState(null);

  // Modal Registrar Factura Proveedor
  const [createBillModalOpen, setCreateBillModalOpen] = useState(false);
  const [partners, setPartners] = useState([]);
  const [vendorCode, setVendorCode] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [subtotal, setSubtotal] = useState('25000');
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
          concept,
          subtotal: parseFloat(subtotal)
        })
      });
      const data = await res.json();
      if (res.ok) {
        setActionMessage(data.message);
        setTimeout(() => setActionMessage(''), 8000);
        setCreateBillModalOpen(false);
        setInvoiceNumber('');
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
        setTimeout(() => setActionMessage(''), 6000);
        setPayModalOpen(false);
        fetchBills();
      } else {
        alert(result.error || 'Error al aplicar pago a proveedor');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredBills = bills.filter(b => {
    if (filterStatus === 'Todos') return true;
    return b.status === filterStatus;
  });

  const totalBalance = bills.reduce((sum, b) => sum + (b.balance || 0), 0);
  const totalPaid = bills.reduce((sum, b) => sum + (b.paidAmount || 0), 0);
  const overdueCount = bills.filter(b => b.status === 'Vencida').length;

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
    <div className="h-full flex flex-col bg-[#f4f7f9] overflow-hidden w-full">
      {/* Top Header */}
      <div className="flex flex-col border-b border-gray-200 px-6 py-4 bg-white sticky top-0 z-10 shrink-0 shadow-sm w-full">
        <div className="flex justify-between items-center">
          <div className="flex items-center text-lg text-gray-700">
            <span className="cursor-pointer hover:underline text-[#006EAD]" onClick={() => navigate('/portal')}>Portal</span>
            <span className="mx-2 text-gray-400">/</span>
            <span className="font-bold text-[#0A2540] flex items-center gap-2">
              <span className="px-2 py-0.5 text-xs bg-red-100 text-red-800 font-bold rounded">Módulo [9]</span>
              NyTEX CxP (Cuentas por Pagar & Pasivos)
            </span>
          </div>
          <div className="flex items-center space-x-3">
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
              onClick={() => setCreateBillModalOpen(true)}
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
                <p className="text-sm font-bold text-emerald-900">Dispersión Registrada</p>
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
              <span className="text-xs text-gray-400">Vinculadas a Órdenes PO</span>
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

        {/* Tabla de Facturas por Pagar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="flex flex-wrap items-center justify-between border-b border-gray-100 px-6 py-4 bg-gray-50/50 gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-500 uppercase">Estado Pasivo:</span>
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
            <div className="text-xs text-gray-500">
              Mostrando <strong className="text-gray-800">{filteredBills.length}</strong> facturas por pagar
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3.5">Folio CxP</th>
                  <th className="px-6 py-3.5">Orden de Compra</th>
                  <th className="px-6 py-3.5">Proveedor (Business Partner)</th>
                  <th className="px-6 py-3.5">Fecha Vencimiento</th>
                  <th className="px-6 py-3.5 text-right">Importe Factura</th>
                  <th className="px-6 py-3.5 text-right">Saldo por Pagar</th>
                  <th className="px-6 py-3.5 text-center">Estado</th>
                  <th className="px-6 py-3.5 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-8 text-center text-gray-400">Cargando cuentas por pagar...</td>
                  </tr>
                ) : filteredBills.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-8 text-center text-gray-400">No hay facturas en este estado.</td>
                  </tr>
                ) : (
                  filteredBills.map(b => (
                    <tr key={b.id} className="hover:bg-red-50/20 transition">
                      <td className="px-6 py-4 font-mono font-bold text-red-700">
                        {b.billCode}
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-700">
                        {b.poCode}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">{b.vendorName}</div>
                        <div className="text-xs font-mono text-gray-400">{b.vendorCode}</div>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-600">
                        📅 {b.dueDate}
                      </td>
                      <td className="px-6 py-4 text-right font-mono font-bold text-gray-900">
                        ${b.totalAmount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 text-right font-mono font-bold text-red-600">
                        ${b.balance.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(b.status)}`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
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

        {/* Modal Aplicar Pago a Proveedor */}
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

        {/* Modal Historial de Pagos */}
        {selectedBill && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <div>
                  <h3 className="text-lg font-bold text-[#0A2540]">Historial de Egresos - {selectedBill.billCode}</h3>
                  <p className="text-xs text-gray-500">Proveedor: {selectedBill.vendorName}</p>
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
                      <div className="text-right font-mono font-bold text-red-600 text-sm">
                        -${p.amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
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

        {/* Modal de Registrar Factura Proveedor */}
        {createBillModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📥</span>
                  <div>
                    <h3 className="text-lg font-bold text-[#0A2540]">Registrar Factura de Proveedor</h3>
                    <p className="text-xs text-gray-500">Módulo [9] Cuentas por Pagar & Pasivos</p>
                  </div>
                </div>
                <button onClick={() => setCreateBillModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl font-bold">✕</button>
              </div>

              <form onSubmit={handleCreateBill} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Proveedor Emisor (Business Partner)</label>
                  <select
                    value={vendorCode}
                    onChange={(e) => setVendorCode(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                    required
                  >
                    {partners.map(p => (
                      <option key={p.code} value={p.code}>
                        {p.code} - {p.name} ({p.taxId || 'RFC Generico'})
                      </option>
                    ))}
                    {partners.length === 0 && (
                      <option value="PRV-001">PRV-001 - Hilos & Algodones de México S.A.</option>
                    )}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Folio / N° Factura Proveedor</label>
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
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Subtotal (USD)</label>
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
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Concepto del Gasto / Compra</label>
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
                    <span>Subtotal compra:</span>
                    <span className="font-mono font-bold">${(parseFloat(subtotal) || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })} USD</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>IVA Acreditable (13%):</span>
                    <span className="font-mono font-bold">${((parseFloat(subtotal) || 0) * 0.13).toLocaleString('es-MX', { minimumFractionDigits: 2 })} USD</span>
                  </div>
                  <div className="flex justify-between text-sm font-extrabold text-[#0A2540] border-t border-slate-200 pt-1.5">
                    <span>Total Pasivo CxP:</span>
                    <span className="font-mono text-red-700">${((parseFloat(subtotal) || 0) * 1.13).toLocaleString('es-MX', { minimumFractionDigits: 2 })} USD</span>
                  </div>
                </div>

                <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-900 flex items-start gap-2">
                  <span>ℹ️</span>
                  <span>Al registrar esta factura, se creará el pasivo exigible en <strong>CxP</strong> a 30 días y se generará la <strong>Póliza Contable de Diario</strong> de provisión de compras.</span>
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

      </div>
    </div>
  );
}
