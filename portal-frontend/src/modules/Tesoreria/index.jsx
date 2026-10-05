import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Tesoreria() {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState('');

  // Modal Nuevo Movimiento
  const [modalOpen, setModalOpen] = useState(false);
  const [bankCode, setBankCode] = useState('');
  const [txType, setTxType] = useState('Ingreso');
  const [category, setCategory] = useState('Operación Comercial');
  const [amount, setAmount] = useState('');
  const [concept, setConcept] = useState('');
  const [reference, setReference] = useState('');

  const fetchData = async () => {
    try {
      const [resAcc, resTx] = await Promise.all([
        fetch('/api/tesoreria/accounts'),
        fetch('/api/tesoreria/transactions')
      ]);
      if (resAcc.ok) {
        const accs = await resAcc.json();
        setAccounts(accs);
        if (accs.length > 0 && !bankCode) setBankCode(accs[0].bankCode);
      }
      if (resTx.ok) setTransactions(await resTx.json());
    } catch (err) {
      console.error('Error fetching Tesoreria data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateTx = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/tesoreria/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bankCode,
          type: txType,
          category,
          amount: parseFloat(amount),
          concept,
          reference: reference || `REF-${Math.floor(100000 + Math.random() * 900000)}`
        })
      });
      const data = await res.json();
      if (res.ok) {
        setActionMessage(`Movimiento bancario registrado exitosamente y póliza contable ${data.journalEntry?.entryCode} generada.`);
        setTimeout(() => setActionMessage(''), 6000);
        setModalOpen(false);
        setAmount('');
        setConcept('');
        fetchData();
      } else {
        alert(data.error || 'Error al registrar movimiento');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const totalBalance = accounts.reduce((sum, a) => sum + (a.balance || 0), 0);
  const totalIngresos = transactions.filter(t => t.type === 'Ingreso').reduce((sum, t) => sum + (t.amount || 0), 0);
  const totalEgresos = transactions.filter(t => t.type === 'Egreso').reduce((sum, t) => sum + (t.amount || 0), 0);
  const netCashFlow = totalIngresos - totalEgresos;

  return (
    <div className="h-full flex flex-col bg-[#f4f7f9] overflow-y-auto w-full">
      {/* Top Header */}
      <div className="flex flex-col border-b border-gray-200 px-6 py-4 bg-white sticky top-0 z-10 shrink-0 shadow-sm w-full">
        <div className="flex flex-wrap justify-between items-center gap-3">
          <div className="flex items-center text-lg text-gray-700">
            <span className="cursor-pointer hover:underline text-[#006EAD]" onClick={() => navigate('/portal')}>Portal</span>
            <span className="mx-2 text-gray-400">/</span>
            <span className="font-bold text-[#0A2540] flex items-center gap-2">
              <span className="px-2 py-0.5 text-xs bg-emerald-100 text-emerald-800 font-bold rounded">Módulo [10]</span>
              NyTEX Tesorería & Flujo de Efectivo
            </span>
          </div>
          <div className="flex items-center flex-wrap gap-2">
            <button 
              onClick={() => navigate('/app/contabilidad')}
              className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded-md text-xs font-semibold shadow-sm transition"
            >
              Ver Contabilidad [12]
            </button>
            <button 
              onClick={() => navigate('/app/activosfijos')}
              className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded-md text-xs font-semibold shadow-sm transition"
            >
              Ver Activos Fijos [11]
            </button>
            <button 
              onClick={() => setModalOpen(true)}
              className="bg-[#006EAD] hover:bg-[#005587] text-white px-4 py-2 rounded-md text-sm font-bold shadow-sm transition flex items-center gap-1.5"
            >
              <span>+</span> REGISTRAR MOVIMIENTO BANCARIO
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 text-gray-800 w-full space-y-6">
        {/* Banner Mensaje */}
        {actionMessage && (
          <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-r-lg shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl">🏛️</span>
              <div>
                <p className="text-sm font-bold text-emerald-900">Operación de Tesorería Aplicada</p>
                <p className="text-xs text-emerald-700">{actionMessage}</p>
              </div>
            </div>
            <button onClick={() => setActionMessage('')} className="text-emerald-700 hover:text-emerald-900 text-xs font-bold">✕ Cerrar</button>
          </div>
        )}

        {/* KPIs de Tesorería */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center justify-between">
            <div>
              <span className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Saldo Total en Bancos</span>
              <span className="block text-2xl font-extrabold text-[#0A2540] font-mono">
                ${totalBalance.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </span>
              <span className="text-xs text-emerald-600 font-semibold">Disponibilidad líquida inmediata</span>
            </div>
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold">
              🏦
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center justify-between">
            <div>
              <span className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Ingresos Registrados</span>
              <span className="block text-2xl font-extrabold text-emerald-600 font-mono">
                +${totalIngresos.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </span>
              <span className="text-xs text-emerald-500 font-semibold">Cobranza y aportaciones</span>
            </div>
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center text-xl font-bold">
              📈
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center justify-between">
            <div>
              <span className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Egresos / Pagos</span>
              <span className="block text-2xl font-extrabold text-red-600 font-mono">
                -${totalEgresos.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </span>
              <span className="text-xs text-red-500 font-semibold">Proveedores y operación</span>
            </div>
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center text-xl font-bold">
              📉
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center justify-between">
            <div>
              <span className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Flujo Neto del Período</span>
              <span className={`block text-2xl font-extrabold font-mono ${netCashFlow >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                ${netCashFlow.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </span>
              <span className="text-xs text-gray-400">Cash Flow reconciliado</span>
            </div>
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center text-xl font-bold">
              📊
            </div>
          </div>
        </div>

        {/* Tarjetas de Cuentas Bancarias */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {accounts.map(acc => (
            <div key={acc.id} className="bg-white rounded-xl p-5 border border-gray-200 shadow-xs flex flex-col justify-between space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-mono font-bold text-[#006EAD] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {acc.bankCode}
                  </span>
                  <h4 className="font-bold text-gray-900 text-sm mt-1">{acc.bankName}</h4>
                  <p className="text-xs text-gray-500 font-mono">Cuenta: {acc.accountNumber}</p>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                  {acc.type}
                </span>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between items-end">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase">Saldo Disponible:</span>
                  <div className="text-xl font-extrabold text-[#0A2540] font-mono">
                    ${acc.balance.toLocaleString('es-MX', { minimumFractionDigits: 2 })} {acc.currency}
                  </div>
                </div>
                <span className="text-xs text-emerald-600 font-bold">✓ Conciliada</span>
              </div>
            </div>
          ))}
        </div>

        {/* Tabla de Movimientos Bancarios */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="flex border-b border-gray-100 px-6 py-4 bg-gray-50/50 justify-between items-center">
            <h3 className="font-bold text-gray-800 text-sm">Libro de Movimientos Bancarios & Conciliación</h3>
            <span className="text-xs text-gray-500">Mostrando {transactions.length} transacciones</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3.5">Folio TX</th>
                  <th className="px-6 py-3.5">Fecha</th>
                  <th className="px-6 py-3.5">Cuenta Bancaria</th>
                  <th className="px-6 py-3.5">Concepto / Referencia</th>
                  <th className="px-6 py-3.5">Categoría</th>
                  <th className="px-6 py-3.5 text-right">Monto</th>
                  <th className="px-6 py-3.5 text-center">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-400">Cargando movimientos bancarios...</td>
                  </tr>
                ) : transactions.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-400">No hay movimientos registrados.</td>
                  </tr>
                ) : (
                  transactions.map(tx => (
                    <tr key={tx.id} className="hover:bg-blue-50/20 transition">
                      <td className="px-6 py-4 font-mono font-bold text-[#006EAD]">
                        {tx.txCode}
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-600">
                        {tx.date}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-gray-700">
                        {tx.bankCode}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-800">{tx.concept}</div>
                        <div className="text-xs text-gray-400 font-mono">Ref: {tx.reference}</div>
                      </td>
                      <td className="px-6 py-4 text-xs">
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full font-semibold">
                          {tx.category}
                        </span>
                      </td>
                      <td className={`px-6 py-4 text-right font-mono font-extrabold text-base ${
                        tx.type === 'Ingreso' ? 'text-emerald-600' : 'text-red-600'
                      }`}>
                        {tx.type === 'Ingreso' ? '+' : '-'}${tx.amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          ✓ Conciliado
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Registrar Movimiento */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <div>
                  <h3 className="text-lg font-bold text-[#0A2540]">Nuevo Movimiento en Tesorería</h3>
                  <p className="text-xs text-gray-500">Con generación automática de póliza contable</p>
                </div>
                <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl font-bold">✕</button>
              </div>

              <form onSubmit={handleCreateTx} className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Tipo de Movimiento</label>
                    <select
                      value={txType}
                      onChange={(e) => setTxType(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-blue-600"
                    >
                      <option value="Ingreso">Ingreso (+)</option>
                      <option value="Egreso">Egreso (-)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Cuenta Bancaria</label>
                    <select
                      value={bankCode}
                      onChange={(e) => setBankCode(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-blue-600"
                    >
                      {accounts.map(acc => (
                        <option key={acc.bankCode} value={acc.bankCode}>
                          {acc.bankName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Monto ($ USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono font-bold text-lg text-gray-800 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Concepto del Movimiento</label>
                  <input
                    type="text"
                    required
                    placeholder="ej. Rendimiento Financiero / Pago de Servicios"
                    value={concept}
                    onChange={(e) => setConcept(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 text-sm focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Referencia Bancaria (Opcional)</label>
                  <input
                    type="text"
                    placeholder="ej. SPEI-892182"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 font-mono text-sm"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-sm bg-[#006EAD] hover:bg-[#005587] text-white font-bold rounded-lg shadow-sm transition"
                  >
                    Confirmar Movimiento y Contabilizar
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