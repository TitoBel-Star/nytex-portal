import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DEFAULT_CATALOG = [
  { sku: 'PT-TEL-101', name: 'Rollo Tela Gabardina Algodón Peinado (Azul)', price: 1850, stock: 35, unit: 'rollos', category: 'Producto Terminado' },
  { sku: 'PT-POP-102', name: 'Rollo Popelina Estampada Premium', price: 2150, stock: 15, unit: 'rollos', category: 'Producto Terminado' },
  { sku: 'PT-RIB-103', name: 'Rollo Rib 1x1 con Spandex Elastomérico', price: 1950, stock: 22, unit: 'rollos', category: 'Producto Terminado' },
  { sku: 'PT-FLE-104', name: 'Rollo Felpa Francesa Fleece 280g Térmico', price: 2800, stock: 18, unit: 'rollos', category: 'Producto Terminado' },
  { sku: 'PT-PIQ-105', name: 'Rollo Piqué 100% Algodón Tipo Polo', price: 2100, stock: 26, unit: 'rollos', category: 'Producto Terminado' },
  { sku: 'SKU-TEL-01', name: 'Rollo Algodón Peinado 100% 180g (Azul)', price: 1850, stock: 45, unit: 'rollos', category: 'Producto Terminado' },
  { sku: 'SKU-TEL-02', name: 'Rollo Algodón Peinado 100% 180g (Negro)', price: 1850, stock: 32, unit: 'rollos', category: 'Producto Terminado' },
  { sku: 'SKU-TEL-03', name: 'Rollo Algodón Peinado 100% 180g (Blanco Óptico)', price: 1780, stock: 60, unit: 'rollos', category: 'Producto Terminado' },
  { sku: 'SKU-MEZ-01', name: 'Rollo Mezclilla Denim 12oz Índigo Strech', price: 2400, stock: 28, unit: 'rollos', category: 'Producto Terminado' },
  { sku: 'SKU-MEZ-02', name: 'Rollo Mezclilla Denim 14oz Rígida Pesada', price: 2650, stock: 19, unit: 'rollos', category: 'Producto Terminado' },
  { sku: 'SKU-POL-01', name: 'Rollo Poliéster Dry-Fit Transpirable', price: 1450, stock: 55, unit: 'rollos', category: 'Producto Terminado' },
  { sku: 'MP-HIL-01', name: 'Hilo de Algodón Peinado 100% 30/1 (Cono 2.5kg)', price: 380, stock: 120, unit: 'kg', category: 'Materia Prima' },
  { sku: 'MP-POL-02', name: 'Hilo de Poliéster Alta Tenacidad 150D', price: 240, stock: 450, unit: 'kg', category: 'Materia Prima' },
  { sku: 'MP-TIN-03', name: 'Tinte Reactivo Azul Marino Textil', price: 490, stock: 18, unit: 'litros', category: 'Insumo Químico' }
];

export default function CxcView() {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('Todos');
  const [actionMessage, setActionMessage] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  
  // Modal de cobro
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [payingInvoice, setPayingInvoice] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Transferencia SPEI');
  const [paymentReference, setPaymentReference] = useState('');

  // Modal Emitir Nueva Factura Directa
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [partners, setPartners] = useState([]);
  const [catalog, setCatalog] = useState(DEFAULT_CATALOG);
  const [skuSearch, setSkuSearch] = useState('');
  const [skuCategory, setSkuCategory] = useState('Todas');
  const [clientCode, setClientCode] = useState('');
  const [concept, setConcept] = useState('Rollo Algodón Peinado 100% 180g (Azul)');
  const [subtotal, setSubtotal] = useState('18500');
  const [paymentTerms, setPaymentTerms] = useState('Crédito 30 días');

  const fetchInvoices = async () => {
    try {
      const [resInv, resBp, resCat] = await Promise.all([
        fetch('/api/cxc/invoices'),
        fetch('/api/business-partners'),
        fetch('/api/inventario/items')
      ]);
      if (resInv.ok) {
        const data = await resInv.json();
        setInvoices(data);
      }
      if (resBp.ok) {
        const bpData = await resBp.json();
        const clients = bpData.filter(b => b.type === 'Cliente');
        setPartners(clients.length > 0 ? clients : bpData);
        if (clients.length > 0 && !clientCode) {
          setClientCode(clients[0].code);
        }
      }
      if (resCat.ok) {
        const catData = await resCat.json();
        if (Array.isArray(catData) && catData.length > 0) {
          const formatted = catData.map(it => ({
            sku: it.sku,
            name: it.name,
            price: it.unitCost ? Math.round(it.unitCost * 1.35) : 1500,
            unitCost: it.unitCost,
            stock: it.stock,
            unit: it.unit,
            category: it.category
          }));
          const merged = [...formatted];
          DEFAULT_CATALOG.forEach(def => {
            if (!merged.some(m => m.sku.toLowerCase() === def.sku.toLowerCase())) {
              merged.push(def);
            }
          });
          setCatalog(merged);
        }
      }
    } catch (err) {
      console.error('Error fetching CxC invoices:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleCreateDirectInvoice = async (e) => {
    e.preventDefault();
    const selClient = partners.find(p => p.code === clientCode) || { name: 'Cliente General' };
    try {
      const res = await fetch('/api/cxc/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientCode: clientCode || 'CLI-001',
          clientName: selClient.name,
          concept,
          subtotal: parseFloat(subtotal),
          paymentTerms
        })
      });
      const data = await res.json();
      if (res.ok) {
        setActionMessage(data.message);
        setTimeout(() => setActionMessage(''), 8000);
        setCreateModalOpen(false);
        fetchInvoices();
      } else {
        alert(data.error || 'Error al emitir factura');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openPayModal = (inv) => {
    setPayingInvoice(inv);
    setPaymentAmount(inv.balance.toString());
    setPaymentReference(`SPEI-${Math.floor(100000 + Math.random() * 900000)}`);
    setPaymentModalOpen(true);
  };

  const handleApplyPayment = async (e) => {
    e.preventDefault();
    if (!payingInvoice) return;

    try {
      const res = await fetch(`/api/cxc/invoices/${payingInvoice.invoiceCode}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(paymentAmount),
          method: paymentMethod,
          reference: paymentReference
        })
      });
      const result = await res.json();
      if (res.ok) {
        setActionMessage(result.message);
        setTimeout(() => setActionMessage(''), 6000);
        setPaymentModalOpen(false);
        fetchInvoices();
      } else {
        alert(result.error || 'Error al aplicar pago');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredInvoices = invoices.filter(inv => {
    if (filterStatus === 'Todos') return true;
    return inv.status === filterStatus;
  });

  const totalBalance = invoices.reduce((sum, inv) => sum + (inv.balance || 0), 0);
  const totalPaid = invoices.reduce((sum, inv) => sum + (inv.paidAmount || 0), 0);
  const overdueCount = invoices.filter(inv => inv.status === 'Vencida').length;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Al Corriente':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Por Vencer':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Vencida':
        return 'bg-red-100 text-red-800 border-red-300 font-bold';
      case 'Pagada':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
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
              <span className="px-2 py-0.5 text-xs bg-purple-100 text-purple-800 font-bold rounded">Módulo [8]</span>
              NyTEX CxC (Cuentas por Cobrar & Cartera)
            </span>
          </div>
          <div className="flex items-center flex-wrap gap-2">
            <button 
              onClick={() => navigate('/app/ventas')}
              className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded-md text-xs font-semibold shadow-sm transition"
            >
              Ir a Ventas [2]
            </button>
            <button 
              onClick={() => navigate('/app/businesspartners')}
              className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded-md text-xs font-semibold shadow-sm transition"
            >
              Ver Business Partners [23]
            </button>
            <button 
              onClick={() => setCreateModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md text-sm font-bold shadow-sm transition flex items-center gap-1.5"
            >
              <span>+</span> Emitir Factura Directa
            </button>
            <button 
              onClick={fetchInvoices}
              className="bg-[#006EAD] hover:bg-[#005587] text-white px-4 py-2 rounded-md text-sm font-bold shadow-sm transition"
            >
              ↻ Refrescar Cartera
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 text-gray-800 w-full space-y-6">
        {/* Banner de Mensaje */}
        {actionMessage && (
          <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-r-lg shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl">💰</span>
              <div>
                <p className="text-sm font-bold text-emerald-900">Cobranza Aplicada</p>
                <p className="text-xs text-emerald-700">{actionMessage}</p>
              </div>
            </div>
            <button onClick={() => setActionMessage('')} className="text-emerald-700 hover:text-emerald-900 text-xs font-bold">✕ Cerrar</button>
          </div>
        )}

        {/* KPIs de Cartera */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center justify-between">
            <div>
              <span className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Saldo Total en Cartera</span>
              <span className="block text-2xl font-extrabold text-[#0A2540]">
                ${totalBalance.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </span>
              <span className="text-xs text-gray-400">Por cobrar a clientes</span>
            </div>
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center text-xl font-bold">
              💳
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center justify-between">
            <div>
              <span className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Cobranza Recibida</span>
              <span className="block text-2xl font-extrabold text-emerald-600">
                ${totalPaid.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </span>
              <span className="text-xs text-emerald-500 font-semibold">Ingresado a bancos</span>
            </div>
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center text-xl font-bold">
              📥
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center justify-between">
            <div>
              <span className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Facturas Totales</span>
              <span className="block text-3xl font-extrabold text-blue-600">
                {invoices.length}
              </span>
              <span className="text-xs text-blue-500 font-semibold">Generadas desde Ventas</span>
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
              <span className="text-xs text-gray-400">Requieren gestión moratoria</span>
            </div>
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center text-xl font-bold">
              ⚠️
            </div>
          </div>
        </div>

        {/* Contenedor de Facturas */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="flex flex-wrap items-center justify-between border-b border-gray-100 px-6 py-4 bg-gray-50/50 gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-500 uppercase">Estado de Cobro:</span>
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
              Mostrando <strong className="text-gray-800">{filteredInvoices.length}</strong> cuentas por cobrar
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3.5">Folio Factura</th>
                  <th className="px-6 py-3.5">Orden Origen</th>
                  <th className="px-6 py-3.5">Cliente (Business Partner)</th>
                  <th className="px-6 py-3.5">Vencimiento</th>
                  <th className="px-6 py-3.5 text-right">Importe Total</th>
                  <th className="px-6 py-3.5 text-right">Saldo Deudor</th>
                  <th className="px-6 py-3.5 text-center">Estado</th>
                  <th className="px-6 py-3.5 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-8 text-center text-gray-400">Cargando cuentas por cobrar...</td>
                  </tr>
                ) : filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-8 text-center text-gray-400">No hay facturas registradas en este estado.</td>
                  </tr>
                ) : (
                  filteredInvoices.map(inv => (
                    <tr key={inv.id} className="hover:bg-purple-50/30 transition">
                      <td className="px-6 py-4 font-mono font-bold text-purple-700">
                        {inv.invoiceCode}
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-700">
                        {inv.orderCode}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-800">{inv.clientName}</div>
                        <div className="text-xs font-mono text-gray-400">{inv.clientCode}</div>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-600">
                        📅 {inv.dueDate}
                        <div className="text-gray-400 text-[11px]">Plazo: {inv.creditDays} días</div>
                      </td>
                      <td className="px-6 py-4 text-right font-semibold text-gray-800">
                        ${inv.totalAmount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 text-right font-mono font-bold text-red-600">
                        ${inv.balance.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(inv.status)}`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setSelectedInvoice(inv)}
                            className="px-2.5 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded"
                          >
                            Historial ({inv.paymentsLog ? inv.paymentsLog.length : 0})
                          </button>
                          {inv.balance > 0 ? (
                            <button
                              onClick={() => openPayModal(inv)}
                              className="px-3 py-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded shadow-sm transition"
                            >
                              💵 Aplicar Cobro
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

        {/* Modal de Aplicar Cobranza */}
        {paymentModalOpen && payingInvoice && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <div>
                  <h3 className="text-lg font-bold text-[#0A2540]">Registrar Cobro de Cartera</h3>
                  <p className="text-xs text-gray-500">Factura: {payingInvoice.invoiceCode} | {payingInvoice.clientName}</p>
                </div>
                <button onClick={() => setPaymentModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl font-bold">✕</button>
              </div>

              <form onSubmit={handleApplyPayment} className="space-y-4 text-sm">
                <div className="p-3 bg-purple-50 rounded-lg flex justify-between items-center">
                  <span className="text-xs text-purple-900 font-bold uppercase">Saldo Actual Pendiente:</span>
                  <span className="text-base font-extrabold text-purple-900 font-mono">
                    ${payingInvoice.balance.toLocaleString('es-MX', { minimumFractionDigits: 2 })} USD
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Monto a Cobrar ($ USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    max={payingInvoice.balance}
                    required
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono font-bold text-lg text-gray-800 focus:outline-none focus:border-purple-600"
                  />
                  <span className="text-[11px] text-gray-400">Puede registrar abonos parciales o liquidación total.</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Método de Cobro</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-purple-600"
                  >
                    <option value="Transferencia SPEI">Transferencia Bancaria SPEI</option>
                    <option value="Tarjeta de Crédito Corporativa">Tarjeta de Crédito Corporativa</option>
                    <option value="Cheque Nominativo">Cheque Nominativo</option>
                    <option value="Efectivo / Caja">Efectivo / Caja Chica</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Referencia / Rastreo Bancario</label>
                  <input
                    type="text"
                    required
                    value={paymentReference}
                    onChange={(e) => setPaymentReference(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 font-mono text-sm focus:outline-none focus:border-purple-600"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t">
                  <button
                    type="button"
                    onClick={() => setPaymentModalOpen(false)}
                    className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-sm bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm transition"
                  >
                    Confirmar Cobro e Ingresar a Bancos
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal de Historial de Pagos de la Factura */}
        {selectedInvoice && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <div>
                  <h3 className="text-lg font-bold text-[#0A2540]">Historial de Pagos - {selectedInvoice.invoiceCode}</h3>
                  <p className="text-xs text-gray-500">Cliente: {selectedInvoice.clientName}</p>
                </div>
                <button onClick={() => setSelectedInvoice(null)} className="text-gray-400 hover:text-gray-600 text-xl font-bold">✕</button>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto">
                {selectedInvoice.paymentsLog && selectedInvoice.paymentsLog.length > 0 ? (
                  selectedInvoice.paymentsLog.map((p, idx) => (
                    <div key={idx} className="p-3 bg-gray-50 rounded-lg border border-gray-100 flex justify-between items-center text-sm">
                      <div>
                        <div className="font-bold text-gray-800">{p.method}</div>
                        <div className="text-xs text-gray-500 font-mono">Ref: {p.reference} | Fecha: {new Date(p.date).toLocaleDateString()}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-extrabold text-emerald-600 text-base font-mono">
                          +${p.amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                        </div>
                        <div className="text-[11px] text-gray-400">Conciliado</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400 text-center py-4">No se han registrado pagos para esta factura aún.</p>
                )}
              </div>

              <div className="flex justify-end pt-3 border-t">
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Emitir Factura Directa */}
        {createModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📄</span>
                  <div>
                    <h3 className="text-lg font-bold text-[#0A2540]">Emitir Nueva Factura Directa</h3>
                    <p className="text-xs text-gray-500">Módulo [8] Cuentas por Cobrar & Contabilidad</p>
                  </div>
                </div>
                <button onClick={() => setCreateModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl font-bold">✕</button>
              </div>

              <form onSubmit={handleCreateDirectInvoice} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Cliente Receptor (Business Partner)</label>
                  <select
                    value={clientCode}
                    onChange={(e) => setClientCode(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  >
                    {partners.map(p => (
                      <option key={p.code} value={p.code}>
                        {p.code} - {p.name} ({p.taxId || 'RFC Generico'})
                      </option>
                    ))}
                    {partners.length === 0 && (
                      <option value="CLI-001">CLI-001 - Moda Express S.A. de C.V.</option>
                    )}
                  </select>
                </div>

                {/* BUSCADOR RÁPIDO DE CATÁLOGO (SKU / DESCRIPCIÓN) CON PESTAÑAS */}
                <div className="bg-slate-50 border border-blue-200 rounded-xl p-3 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black text-[#0A2540] uppercase flex items-center gap-1.5">
                      <span>🏷️</span> Buscar Producto en Catálogo (Escriba letra o número):
                    </span>
                    <div className="flex gap-1 text-[10px]">
                      {['Todas', 'Producto Terminado', 'Materia Prima'].map(cat => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setSkuCategory(cat)}
                          className={`px-2 py-0.5 rounded font-bold transition-all ${
                            skuCategory === cat ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border'
                          }`}
                        >
                          {cat === 'Producto Terminado' ? 'Telas PT' : cat === 'Materia Prima' ? 'Hilos MP' : 'Todos'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <input
                    type="text"
                    value={skuSearch}
                    onChange={(e) => setSkuSearch(e.target.value)}
                    placeholder="🔍 Escriba una letra o número (ej: T, 1, 01, TEL, Algodón, PT, Gabardina)..."
                    className="w-full px-3 py-1.5 bg-white border border-blue-300 focus:border-blue-600 rounded-lg text-xs font-semibold text-gray-800 placeholder-gray-400 focus:outline-none"
                  />

                  {skuSearch && (
                    <div className="bg-white border border-blue-200 rounded-lg p-1.5 max-h-36 overflow-y-auto divide-y divide-gray-100 shadow-sm text-xs">
                      {catalog
                        .filter(c => {
                          if (skuCategory !== 'Todas' && c.category !== skuCategory) return false;
                          const q = skuSearch.toLowerCase().trim();
                          return (c.sku || '').toLowerCase().includes(q) || (c.name || '').toLowerCase().includes(q);
                        })
                        .map(p => (
                          <div
                            key={p.sku}
                            onClick={() => {
                              setConcept(`[${p.sku}] ${p.name}`);
                              setSubtotal((p.price || Math.round((p.unitCost || 1200) * 1.35) || 1850).toString());
                              setSkuSearch('');
                            }}
                            className="p-1.5 hover:bg-blue-50 rounded cursor-pointer flex justify-between items-center transition"
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-blue-900 bg-blue-100 px-1.5 py-0.5 rounded text-[11px]">{p.sku}</span>
                              <span className="font-semibold text-gray-800">{p.name}</span>
                            </div>
                            <span className="font-mono font-bold text-gray-900 text-xs">${(p.price || Math.round((p.unitCost || 1200) * 1.35) || 1850).toLocaleString('es-MX')} USD ➔</span>
                          </div>
                        ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Concepto / Descripción del Producto o Servicio</label>
                  <input
                    type="text"
                    value={concept}
                    onChange={(e) => setConcept(e.target.value)}
                    placeholder="Ej. Venta de 20 Rollos de Tela Algodón Peinado"
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Subtotal (USD)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="1"
                      value={subtotal}
                      onChange={(e) => setSubtotal(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-sm font-mono font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Condiciones de Pago</label>
                    <select
                      value={paymentTerms}
                      onChange={(e) => setPaymentTerms(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="Contado Inmediato">Contado Inmediato</option>
                      <option value="Crédito 15 días">Crédito 15 días</option>
                      <option value="Crédito 30 días">Crédito 30 días</option>
                      <option value="Crédito 60 días">Crédito 60 días</option>
                    </select>
                  </div>
                </div>

                {/* Resumen Fiscal Calculado Automáticamente */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1.5 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal gravable:</span>
                    <span className="font-mono font-bold">${(parseFloat(subtotal) || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })} USD</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>IVA Trasladado (13%):</span>
                    <span className="font-mono font-bold">${((parseFloat(subtotal) || 0) * 0.13).toLocaleString('es-MX', { minimumFractionDigits: 2 })} USD</span>
                  </div>
                  <div className="flex justify-between text-sm font-extrabold text-[#0A2540] border-t border-slate-200 pt-1.5">
                    <span>Total Factura / DTE:</span>
                    <span className="font-mono text-emerald-700">${((parseFloat(subtotal) || 0) * 1.13).toLocaleString('es-MX', { minimumFractionDigits: 2 })} USD</span>
                  </div>
                </div>

                <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-lg text-[11px] text-blue-900 flex items-start gap-2">
                  <span>ℹ️</span>
                  <span>Al emitir esta factura, el sistema la registrará inmediatamente en <strong>Cartera CxC</strong> y creará la <strong>Póliza Contable de Diario</strong> en partida doble cuadrada.</span>
                </div>

                <div className="flex justify-end space-x-3 pt-3 border-t">
                  <button
                    type="button"
                    onClick={() => setCreateModalOpen(false)}
                    className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-sm bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-md transition"
                  >
                    Emitir y Contabilizar Factura ➔
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
