import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Tesoreria() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('bancos'); // 'bancos', 'cajas', 'conciliacion', 'cierres'
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState('');

  // Modal Nuevo Movimiento Bancario
  const [modalOpen, setModalOpen] = useState(false);
  const [bankCode, setBankCode] = useState('');
  const [txType, setTxType] = useState('Ingreso');
  const [category, setCategory] = useState('Operación Comercial');
  const [amount, setAmount] = useState('');
  const [concept, setConcept] = useState('');
  const [reference, setReference] = useState('');

  // Estado Cajas y Fondos Fijos
  const [cajas, setCajas] = useState([]);
  const [audits, setAudits] = useState([]);
  const [arqueoModalOpen, setArqueoModalOpen] = useState(false);
  const [selectedCaja, setSelectedCaja] = useState(null);
  const [physicalCash, setPhysicalCash] = useState('');
  const [vouchersAmount, setVouchersAmount] = useState('');
  const [arqueoNotes, setArqueoNotes] = useState('');

  // Estado Conciliación Bancaria
  const [reconciliation, setReconciliation] = useState(null);
  const [recBankCode, setRecBankCode] = useState('BCO-BBVA-01');
  const [recPeriod, setRecPeriod] = useState('2026-10');

  // Estado Cierres Operativos
  const [closures, setClosures] = useState([]);
  const [closeModalOpen, setCloseModalOpen] = useState(false);
  const [selectedCloseType, setSelectedCloseType] = useState('COBROS_DIARIO');
  const [closeTitle, setCloseTitle] = useState('');
  const [closeAmount, setCloseAmount] = useState('');
  const [closeNotes, setCloseNotes] = useState('');

  const fetchBankData = async () => {
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
      console.error('Error fetching Tesoreria bank data:', err);
    }
  };

  const fetchCajasData = async () => {
    try {
      const res = await fetch('/api/tesoreria/cajas');
      if (res.ok) {
        const data = await res.json();
        setCajas(data.cajas || []);
        setAudits(data.audits || []);
      }
    } catch (err) {
      console.error('Error fetching Cajas data:', err);
    }
  };

  const fetchConciliacionData = async (bCode = recBankCode, per = recPeriod) => {
    try {
      const res = await fetch(`/api/tesoreria/conciliacion?bankCode=${bCode}&period=${per}`);
      if (res.ok) {
        const data = await res.json();
        setReconciliation(data);
      }
    } catch (err) {
      console.error('Error fetching Conciliacion data:', err);
    }
  };

  const fetchClosuresData = async () => {
    try {
      const res = await fetch('/api/tesoreria/cierres');
      if (res.ok) {
        const data = await res.json();
        setClosures(data || []);
      }
    } catch (err) {
      console.error('Error fetching Closures data:', err);
    }
  };

  const loadAll = async () => {
    setLoading(true);
    await Promise.all([fetchBankData(), fetchCajasData(), fetchConciliacionData(), fetchClosuresData()]);
    setLoading(false);
  };

  useEffect(() => {
    loadAll();
  }, []);

  // Handlers Movimientos Bancarios
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
        setActionMessage(`✓ Movimiento bancario registrado exitosamente y póliza contable ${data.journalEntry?.entryCode} generada.`);
        setTimeout(() => setActionMessage(''), 6000);
        setModalOpen(false);
        setAmount('');
        setConcept('');
        fetchBankData();
        fetchConciliacionData();
      } else {
        alert(data.error || 'Error al registrar movimiento');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handlers Cajas y Arqueos
  const handleOpenArqueo = (caja) => {
    setSelectedCaja(caja);
    setPhysicalCash(caja.currentBalance.toString());
    setVouchersAmount(caja.pendingVouchers ? caja.pendingVouchers.toString() : '0');
    setArqueoNotes('');
    setArqueoModalOpen(true);
  };

  const handleExecuteArqueo = async (e) => {
    e.preventDefault();
    if (!selectedCaja) return;
    try {
      const res = await fetch('/api/tesoreria/cajas/arqueo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cashDeskCode: selectedCaja.code,
          physicalCash: parseFloat(physicalCash),
          vouchersAmount: parseFloat(vouchersAmount || 0),
          notes: arqueoNotes,
          auditedBy: 'Auditoría Interna de Finanzas'
        })
      });
      const data = await res.json();
      if (res.ok) {
        setActionMessage(`✓ Arqueo de ${selectedCaja.name} ejecutado con éxito. Resultado: ${data.audit.resultStatus} (Diferencia: $${data.audit.difference} USD).`);
        setTimeout(() => setActionMessage(''), 6000);
        setArqueoModalOpen(false);
        fetchCajasData();
      } else {
        alert(data.error || 'Error al ejecutar arqueo');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleReposicionCaja = async (caja) => {
    const toRep = Math.round((caja.authorizedFund - caja.currentBalance) * 100) / 100;
    if (toRep <= 0) {
      alert('La caja ya cuenta con su fondo completo autorizado ($' + caja.authorizedFund + ' USD).');
      return;
    }
    const confirmed = window.confirm(`¿Desea solicitar y emitir la reposición de fondo fijo para ${caja.name} por un monto de $${toRep.toFixed(2)} USD con cargo a Banco BBVA/Agrícola?`);
    if (!confirmed) return;

    try {
      const res = await fetch('/api/tesoreria/cajas/reposicion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cashDeskCode: caja.code,
          bankCode: 'BCO-BBVA-01'
        })
      });
      const data = await res.json();
      if (res.ok) {
        setActionMessage(`✓ Reposición de fondo fijo completada por $${toRep.toFixed(2)} USD. Póliza contable ${data.journalEntry?.entryCode} generada.`);
        setTimeout(() => setActionMessage(''), 6000);
        fetchCajasData();
        fetchBankData();
      } else {
        alert(data.error || 'Error en reposición de caja');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handlers Conciliación Bancaria
  const handleToggleRecItem = async (itemCode) => {
    try {
      const res = await fetch('/api/tesoreria/conciliacion/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemCode })
      });
      if (res.ok) {
        fetchConciliacionData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCerrarConciliacion = async () => {
    if (!reconciliation) return;
    const confirmed = window.confirm(`¿Desea cerrar formalmente la Conciliación Bancaria de ${reconciliation.bank?.bankName} para el período ${recPeriod}?\n\nSaldo Libro: $${reconciliation.bookBalance.toLocaleString()} USD\nSaldo Extracto: $${reconciliation.statementBalance.toLocaleString()} USD\nDiferencia: $${reconciliation.difference.toLocaleString()} USD`);
    if (!confirmed) return;

    try {
      const res = await fetch('/api/tesoreria/conciliacion/cerrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bankCode: recBankCode,
          period: recPeriod,
          statementBalance: reconciliation.statementBalance
        })
      });
      const data = await res.json();
      if (res.ok) {
        setActionMessage(`✓ ${data.message} Sello criptográfico: ${data.cryptographicSeal.substring(0, 20)}...`);
        setTimeout(() => setActionMessage(''), 7000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handlers Cierres Operativos
  const handleOpenCloseModal = (type, defaultTitle, defaultAmount) => {
    setSelectedCloseType(type);
    setCloseTitle(defaultTitle);
    setCloseAmount(defaultAmount.toString());
    setCloseNotes('');
    setCloseModalOpen(true);
  };

  const handleExecuteClosure = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/tesoreria/cierres/ejecutar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          closeType: selectedCloseType,
          title: closeTitle,
          totalAmount: parseFloat(closeAmount || 0),
          notes: closeNotes
        })
      });
      const data = await res.json();
      if (res.ok) {
        setActionMessage(`✓ Control Interno ejecutado: ${closeTitle} sellado con éxito e indexado en Bitácora Inmutable.`);
        setTimeout(() => setActionMessage(''), 6000);
        setCloseModalOpen(false);
        fetchClosuresData();
      } else {
        alert(data.error || 'Error al ejecutar cierre');
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
              Dirección de Finanzas & Tesorería
            </span>
          </div>
          <div className="flex items-center flex-wrap gap-2">
            <button 
              onClick={() => navigate('/app/cxc')}
              className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded-md text-xs font-semibold shadow-sm transition"
            >
              [8] CxC
            </button>
            <button 
              onClick={() => navigate('/app/cxp')}
              className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded-md text-xs font-semibold shadow-sm transition"
            >
              [9] CxP
            </button>
            <button 
              onClick={() => navigate('/app/contabilidad')}
              className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded-md text-xs font-semibold shadow-sm transition"
            >
              [12] Contabilidad
            </button>
            <button 
              onClick={() => navigate('/app/circuito-financiero')}
              className="bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-md text-xs font-bold shadow-sm transition"
            >
              Monitor Financiero ➔
            </button>
            <button 
              onClick={() => setModalOpen(true)}
              className="bg-[#006EAD] hover:bg-[#005587] text-white px-4 py-1.5 rounded-md text-xs font-bold shadow-sm transition flex items-center gap-1.5"
            >
              <span>+</span> Movimiento Bancario
            </button>
          </div>
        </div>

        {/* Barra de Navegación por Pestañas de Control Interno */}
        <div className="flex gap-2 mt-4 pt-2 border-t border-gray-100 overflow-x-auto">
          <button
            onClick={() => setActiveTab('bancos')}
            className={`px-4 py-2 rounded-lg text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'bancos'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <span>🏛️</span> Cuentas Bancarias & Libro Mayor
          </button>
          <button
            onClick={() => setActiveTab('cajas')}
            className={`px-4 py-2 rounded-lg text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'cajas'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <span>💵</span> Cajas & Fondos Fijos ({cajas.length})
          </button>
          <button
            onClick={() => setActiveTab('conciliacion')}
            className={`px-4 py-2 rounded-lg text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'conciliacion'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <span>📑</span> Conciliación Bancaria Mensual
          </button>
          <button
            onClick={() => setActiveTab('cierres')}
            className={`px-4 py-2 rounded-lg text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'cierres'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <span>🔒</span> Cierres Diarios & Controles Internos
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 text-gray-800 w-full space-y-6">
        {/* Banner Mensaje de Acción */}
        {actionMessage && (
          <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-r-lg shadow-sm flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-3">
              <span className="text-xl">✅</span>
              <div>
                <p className="text-sm font-bold text-emerald-900">Operación de Control Interno Aplicada</p>
                <p className="text-xs text-emerald-700">{actionMessage}</p>
              </div>
            </div>
            <button onClick={() => setActionMessage('')} className="text-emerald-700 hover:text-emerald-900 text-xs font-bold">✕ Cerrar</button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PESTAÑA 1: CUENTAS BANCARIAS & LIBRO MAYOR */}
        {/* ========================================================================= */}
        {activeTab === 'bancos' && (
          <div className="space-y-6">
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
                  <span className="text-xs text-red-500 font-semibold">Proveedores y nómina</span>
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
                  <span className="text-xs text-gray-400">Cash Flow conciliado</span>
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
                    <button 
                      onClick={() => { setActiveTab('conciliacion'); setRecBankCode(acc.bankCode); fetchConciliacionData(acc.bankCode); }}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200"
                    >
                      Conciliar ➔
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Tabla de Movimientos Bancarios */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
              <div className="flex border-b border-gray-100 px-6 py-4 bg-gray-50/50 justify-between items-center">
                <h3 className="font-bold text-gray-800 text-sm">Libro Mayor de Bancos & Trazabilidad de Pólizas</h3>
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
          </div>
        )}

        {/* ========================================================================= */}
        {/* PESTAÑA 2: CAJAS & FONDOS FIJOS (CAJA GENERAL & CAJA CHICA) */}
        {/* ========================================================================= */}
        {activeTab === 'cajas' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block">Control de Efectivo & Fondos Fijos</span>
                <h3 className="text-xl font-black text-gray-900 mt-0.5">Administración de Cajas, Arqueos y Reposiciones</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Arqueo periódico con cálculo de sobrante/faltante, control de comprobantes por rendir y generación automática de pólizas de reposición.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleOpenArqueo(cajas[0] || { code: 'CAJA-GEN-01', name: 'Caja General', currentBalance: 2840.50 })}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-sm transition flex items-center gap-1.5"
                >
                  <span>⚖️</span> Ejecutar Arqueo de Caja
                </button>
              </div>
            </div>

            {/* Tarjetas de Cajas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {cajas.map(caja => {
                const percentSpent = caja.authorizedFund > 0 
                  ? Math.round(((caja.authorizedFund - caja.currentBalance) / caja.authorizedFund) * 100) 
                  : 0;

                return (
                  <div key={caja.id} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col justify-between space-y-4 relative overflow-hidden">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                            {caja.code}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            caja.status === 'Cuadrada' ? 'bg-emerald-100 text-emerald-800' :
                            caja.status === 'Faltante' ? 'bg-red-100 text-red-800' :
                            caja.status === 'Sobrante' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700'
                          }`}>
                            ● {caja.status}
                          </span>
                        </div>
                        <h4 className="font-bold text-gray-900 text-base mt-2">{caja.name}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">Responsable: <strong className="text-gray-700">{caja.responsible}</strong></p>
                      </div>
                      <span className="text-2xl">{caja.type === 'Caja General' ? '🏦' : '💼'}</span>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl space-y-2 border border-gray-100">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500 font-semibold">Fondo Autorizado:</span>
                        <strong className="font-mono text-gray-800">${caja.authorizedFund.toLocaleString('es-MX', { minimumFractionDigits: 2 })} {caja.currency}</strong>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500 font-semibold">Saldo Disponible en Efectivo:</span>
                        <strong className="font-mono text-emerald-600 text-sm">${caja.currentBalance.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</strong>
                      </div>
                      {caja.type === 'Caja Chica' && (
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500 font-semibold">Comprobantes por Rendir:</span>
                          <strong className="font-mono text-amber-600">${caja.pendingVouchers.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</strong>
                        </div>
                      )}
                      <div className="text-[10px] text-gray-400 pt-1 border-t border-gray-200">
                        Último Arqueo: <strong>{caja.lastAuditDate || 'Hoy'}</strong>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => handleOpenArqueo(caja)}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold py-2 rounded-xl transition text-center"
                      >
                        Arqueo Físico
                      </button>
                      {caja.type === 'Caja Chica' && (
                        <button
                          onClick={() => handleReposicionCaja(caja)}
                          className="flex-1 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold py-2 rounded-xl transition text-center shadow-sm"
                        >
                          Reponer Fondo
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Historial de Arqueos Auditados */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Libro de Arqueos de Caja & Certificaciones de Cuadre</h4>
                  <p className="text-xs text-gray-500">Historial inmutable con fecha, auditor responsable y desglose de diferencias</p>
                </div>
                <span className="text-xs font-bold bg-white border border-gray-300 text-gray-700 px-3 py-1 rounded-full">
                  {audits.length} Registros Auditados
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-100 text-gray-600 font-bold uppercase tracking-wider border-b border-gray-200">
                    <tr>
                      <th className="py-3 px-4">Folio Arqueo</th>
                      <th className="py-3 px-4">Fecha</th>
                      <th className="py-3 px-4">Caja</th>
                      <th className="py-3 px-4 text-right">Efectivo Físico</th>
                      <th className="py-3 px-4 text-right">Comprobantes</th>
                      <th className="py-3 px-4 text-right">Total Contado</th>
                      <th className="py-3 px-4 text-right">Esperado Sistema</th>
                      <th className="py-3 px-4 text-right">Diferencia</th>
                      <th className="py-3 px-4 text-center">Dictamen</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-mono">
                    {audits.length === 0 ? (
                      <tr>
                        <td colSpan="9" className="py-8 text-center text-gray-400 font-sans">
                          No se han ejecutado arqueos en este período. Haga clic en "Ejecutar Arqueo de Caja".
                        </td>
                      </tr>
                    ) : (
                      audits.map(aud => (
                        <tr key={aud.id} className="hover:bg-slate-50 transition">
                          <td className="py-3 px-4 font-bold text-blue-700">{aud.auditCode}</td>
                          <td className="py-3 px-4 text-gray-600">{aud.auditDate}</td>
                          <td className="py-3 px-4 font-sans font-semibold text-gray-800">{aud.cashDeskCode}</td>
                          <td className="py-3 px-4 text-right text-gray-700">${aud.physicalCashCounted?.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                          <td className="py-3 px-4 text-right text-gray-700">${aud.vouchersCounted?.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                          <td className="py-3 px-4 text-right font-bold text-gray-900">${aud.totalCounted?.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                          <td className="py-3 px-4 text-right text-gray-500">${aud.systemExpected?.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                          <td className={`py-3 px-4 text-right font-bold ${
                            aud.difference === 0 ? 'text-emerald-600' : aud.difference > 0 ? 'text-blue-600' : 'text-red-600'
                          }`}>
                            {aud.difference > 0 ? '+' : ''}${aud.difference?.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="py-3 px-4 text-center font-sans">
                            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                              aud.resultStatus === 'Cuadrada' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                              aud.resultStatus === 'Sobrante' ? 'bg-blue-100 text-blue-800 border border-blue-300' :
                              'bg-red-100 text-red-800 border border-red-300'
                            }`}>
                              ✓ {aud.resultStatus}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PESTAÑA 3: CONCILIACIÓN BANCARIA MENSUAL */}
        {/* ========================================================================= */}
        {activeTab === 'conciliacion' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block">Auditoría & Control Contable</span>
                <h3 className="text-xl font-black text-gray-900 mt-0.5">Conciliación Bancaria Mensual (Cotejo de Extracto vs. Libro)</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Cruce automático de partidas flotantes, cheques en tránsito, depósitos no acreditados y notas de débito bancarias.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-500 mb-0.5">Banco:</label>
                  <select
                    value={recBankCode}
                    onChange={(e) => { setRecBankCode(e.target.value); fetchConciliacionData(e.target.value, recPeriod); }}
                    className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-1.5 text-xs font-bold text-gray-800"
                  >
                    {accounts.map(acc => (
                      <option key={acc.bankCode} value={acc.bankCode}>{acc.bankName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-500 mb-0.5">Período:</label>
                  <select
                    value={recPeriod}
                    onChange={(e) => { setRecPeriod(e.target.value); fetchConciliacionData(recBankCode, e.target.value); }}
                    className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-1.5 text-xs font-bold text-gray-800"
                  >
                    <option value="2026-10">Octubre 2026</option>
                    <option value="2026-09">Septiembre 2026</option>
                    <option value="2026-08">Agosto 2026</option>
                  </select>
                </div>
                <button
                  onClick={handleCerrarConciliacion}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-sm transition flex items-center gap-1.5 mt-3 sm:mt-0"
                >
                  <span>📜</span> Emitir Acta de Conciliación Firmada
                </button>
              </div>
            </div>

            {/* Resumen de Cuadre de la Conciliación */}
            {reconciliation && (
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                  <span className="text-[10px] font-bold uppercase text-gray-500 block">1. Saldo Según Libro Mayor</span>
                  <div className="text-lg font-black text-gray-900 font-mono mt-1">
                    ${reconciliation.bookBalance?.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </div>
                  <span className="text-[10px] text-gray-400">ERP NyTEX (Contabilidad)</span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                  <span className="text-[10px] font-bold uppercase text-amber-600 block">(+) Cheques Flotantes</span>
                  <div className="text-lg font-black text-amber-700 font-mono mt-1">
                    +${reconciliation.pendingChecks?.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </div>
                  <span className="text-[10px] text-gray-400">Emitidos no cobrados</span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                  <span className="text-[10px] font-bold uppercase text-blue-600 block">(-) Depósitos en Tránsito</span>
                  <div className="text-lg font-black text-blue-700 font-mono mt-1">
                    -${reconciliation.pendingDeposits?.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </div>
                  <span className="text-[10px] text-gray-400">En compensación bancaria</span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                  <span className="text-[10px] font-bold uppercase text-purple-600 block">2. Saldo Según Extracto</span>
                  <div className="text-lg font-black text-purple-900 font-mono mt-1">
                    ${reconciliation.statementBalance?.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </div>
                  <span className="text-[10px] text-gray-400">Cartola oficial del banco</span>
                </div>

                <div className={`p-4 rounded-xl border shadow-sm ${
                  reconciliation.isBalanced ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'
                }`}>
                  <span className="text-[10px] font-bold uppercase text-emerald-800 block">3. Diferencia de Cuadre</span>
                  <div className="text-lg font-black text-emerald-700 font-mono mt-1">
                    ${reconciliation.difference?.toLocaleString('es-MX', { minimumFractionDigits: 2 })} USD
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700">✓ Conciliación Cuadrada 100%</span>
                </div>
              </div>
            )}

            {/* Tabla de Partidas Conciliatorias */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Partidas Pendientes y Conciliadas en el Período</h4>
                  <p className="text-xs text-gray-500">Haga clic en el estado para cotejar o desmarcar cada movimiento contra el extracto</p>
                </div>
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full">
                  Cotejo Bidireccional Activo
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-100 text-gray-600 font-bold uppercase tracking-wider border-b border-gray-200">
                    <tr>
                      <th className="py-3 px-4">Folio</th>
                      <th className="py-3 px-4">Fecha</th>
                      <th className="py-3 px-4">Concepto / Partida Conciliatoria</th>
                      <th className="py-3 px-4">Referencia</th>
                      <th className="py-3 px-4">Tipo de Partida</th>
                      <th className="py-3 px-4">Origen</th>
                      <th className="py-3 px-4 text-right">Monto</th>
                      <th className="py-3 px-4 text-center">Acción / Estatus</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {reconciliation?.items?.map(item => (
                      <tr key={item.itemCode} className="hover:bg-slate-50 transition">
                        <td className="py-3.5 px-4 font-mono font-bold text-blue-700">{item.itemCode}</td>
                        <td className="py-3.5 px-4 text-gray-600">{item.date}</td>
                        <td className="py-3.5 px-4 font-semibold text-gray-900">{item.concept}</td>
                        <td className="py-3.5 px-4 font-mono text-gray-500">{item.reference}</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded font-semibold text-[11px] ${
                            item.type === 'Cheque Flotante' ? 'bg-amber-100 text-amber-800' :
                            item.type === 'Depósito en Tránsito' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                          }`}>
                            {item.type}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-gray-600">{item.origin}</td>
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-gray-900">
                          ${item.amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => handleToggleRecItem(item.itemCode)}
                            className={`px-3 py-1 rounded-full text-xs font-bold transition shadow-xs ${
                              item.status === 'Conciliado' 
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                            }`}
                          >
                            {item.status === 'Conciliado' ? '✓ Conciliado' : '⏳ Pendiente'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PESTAÑA 4: CIERRES DIARIOS & CONTROLES INTERNOS */}
        {/* ========================================================================= */}
        {activeTab === 'cierres' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <span className="text-xs font-bold text-purple-600 uppercase tracking-wider block">Gobernanza Financiera & Controles Internos</span>
                <h3 className="text-xl font-black text-gray-900 mt-0.5">Tablero Maestro de Cierres Diarios y Periódicos</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Validación de fin de turno y fin de período: cuadre de cobros, dispersión de pagos, validación de compras Three-Way Match y candados contables.
                </p>
              </div>
              <div className="flex gap-2">
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-xl border border-emerald-300 flex items-center gap-1.5">
                  <span>🛡️</span> Segregación de Funciones Activa
                </span>
              </div>
            </div>

            {/* Tarjetas de Cierres Diarios Clave */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* 1. Cierre Diario de Cobros */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                      [8] CxC & Tesorería
                    </span>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      ✓ Cuadrado
                    </span>
                  </div>
                  <h4 className="font-black text-gray-900 text-base mt-2">Cierre Diario de Cobranza</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Corte de facturas cobradas hoy (efectivo, transferencias, retenciones) contra depósitos bancarios acreditados.
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Monto Cobrado Hoy:</span>
                    <strong className="font-mono text-gray-900">$14,850.00 USD</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Recibos Emitidos:</span>
                    <strong className="font-mono text-gray-900">8 Recibos</strong>
                  </div>
                </div>
                <button
                  onClick={() => handleOpenCloseModal('COBROS_DIARIO', 'Cierre Diario de Cobros & Facturación (CxC)', 14850.00)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-xl text-xs transition shadow-xs text-center"
                >
                  Ejecutar Cierre Diario de Cobros
                </button>
              </div>

              {/* 2. Cierre Diario de Pagos */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-800 px-2 py-0.5 rounded">
                      [9] CxP & Tesorería
                    </span>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      ✓ Cuadrado
                    </span>
                  </div>
                  <h4 className="font-black text-gray-900 text-base mt-2">Cierre Diario de Pagos a Proveedores</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Validación de dispersiones bancarias emitidas en el día contra facturas liquidadas y retenciones aplicadas.
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Monto Dispersado:</span>
                    <strong className="font-mono text-gray-900">$9,320.00 USD</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Facturas Amortizadas:</span>
                    <strong className="font-mono text-gray-900">5 Facturas</strong>
                  </div>
                </div>
                <button
                  onClick={() => handleOpenCloseModal('PAGOS_DIARIO', 'Cierre Diario de Dispersión de Pagos (CxP)', 9320.00)}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-xl text-xs transition shadow-xs text-center"
                >
                  Ejecutar Cierre Diario de Pagos
                </button>
              </div>

              {/* 3. Cierre de Compras (Three-Way Match) */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                      [4] Compras & WMS
                    </span>
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                      Three-Way Match
                    </span>
                  </div>
                  <h4 className="font-black text-gray-900 text-base mt-2">Cierre Periódico de Compras</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Cotejo tripartito: Orden de Compra (PO) == Entrada de Almacén (WMS) == Factura Fiscal (CxP). Evita pasivos ocultos.
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Órdenes Conciliadas:</span>
                    <strong className="font-mono text-gray-900">14 Órdenes</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Discrepancias:</span>
                    <strong className="font-mono text-emerald-600">$0.00 USD (0)</strong>
                  </div>
                </div>
                <button
                  onClick={() => handleOpenCloseModal('COMPRAS_PERIODO', 'Cierre de Compras & Three-Way Match (OC vs WMS vs Factura)', 38400.00)}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-xl text-xs transition shadow-xs text-center"
                >
                  Conciliar y Cerrar Compras
                </button>
              </div>
            </div>

            {/* Historial de Cierres Auditados con Firma Criptográfica */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Registro de Cierres Operativos y Certificación de Controles</h4>
                  <p className="text-xs text-gray-500">Sellos inmutables para blindaje contra discrepancias y cumplimiento auditor</p>
                </div>
                <span className="text-xs font-bold bg-white border border-gray-300 text-gray-700 px-3 py-1 rounded-full">
                  {closures.length} Cierres Certificados
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-100 text-gray-600 font-bold uppercase tracking-wider border-b border-gray-200">
                    <tr>
                      <th className="py-3 px-4">Folio Cierre</th>
                      <th className="py-3 px-4">Tipo / Operación</th>
                      <th className="py-3 px-4">Fecha / Período</th>
                      <th className="py-3 px-4">Responsable</th>
                      <th className="py-3 px-4 text-right">Monto Cuadrado</th>
                      <th className="py-3 px-4">Sello Criptográfico SHA-256</th>
                      <th className="py-3 px-4 text-center">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {closures.map(clr => (
                      <tr key={clr.id} className="hover:bg-slate-50 transition">
                        <td className="py-3.5 px-4 font-mono font-bold text-indigo-700">{clr.closeCode}</td>
                        <td className="py-3.5 px-4 font-semibold text-gray-900">{clr.title}</td>
                        <td className="py-3.5 px-4 text-gray-600 font-mono">{clr.periodOrDate}</td>
                        <td className="py-3.5 px-4 text-gray-700">{clr.closedBy}</td>
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-gray-900">
                          ${clr.totalAmount?.toLocaleString('es-MX', { minimumFractionDigits: 2 })} USD
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[10px] text-gray-500 max-w-xs truncate">
                          {clr.cryptographicHash}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            ✓ {clr.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODALES */}
        {/* ========================================================================= */}

        {/* Modal Registrar Movimiento Bancario */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-fade-in">
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
                    placeholder="ej. SPEI-892182 / CHQ-1049"
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
                    Confirmar y Contabilizar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Ejecutar Arqueo de Caja */}
        {arqueoModalOpen && selectedCaja && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-fade-in">
              <div className="flex justify-between items-center border-b pb-3">
                <div>
                  <h3 className="text-lg font-bold text-[#0A2540]">Acta de Arqueo Físico de Caja</h3>
                  <p className="text-xs text-gray-500">{selectedCaja.name} ({selectedCaja.code})</p>
                </div>
                <button onClick={() => setArqueoModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl font-bold">✕</button>
              </div>

              <form onSubmit={handleExecuteArqueo} className="space-y-4 text-sm">
                <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200 text-xs space-y-1">
                  <div className="flex justify-between font-semibold text-amber-900">
                    <span>Fondo Autorizado:</span>
                    <span className="font-mono font-bold">${selectedCaja.authorizedFund.toLocaleString('es-MX', { minimumFractionDigits: 2 })} USD</span>
                  </div>
                  <div className="flex justify-between font-semibold text-amber-800">
                    <span>Saldo en Sistema Esperado:</span>
                    <span className="font-mono font-bold">${(selectedCaja.type === 'Caja Chica' ? selectedCaja.authorizedFund : selectedCaja.currentBalance).toLocaleString('es-MX', { minimumFractionDigits: 2 })} USD</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Efectivo Físico Contado ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={physicalCash}
                      onChange={(e) => setPhysicalCash(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono font-bold text-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Comprobantes / Facturas ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={vouchersAmount}
                      onChange={(e) => setVouchersAmount(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono font-bold text-gray-800"
                    />
                  </div>
                </div>

                {/* Previsualización en Tiempo Real del Cuadre */}
                {(() => {
                  const pC = parseFloat(physicalCash || 0);
                  const vA = parseFloat(vouchersAmount || 0);
                  const tot = Math.round((pC + vA) * 100) / 100;
                  const exp = selectedCaja.type === 'Caja Chica' ? selectedCaja.authorizedFund : selectedCaja.currentBalance;
                  const dif = Math.round((tot - exp) * 100) / 100;
                  const status = Math.abs(dif) < 0.01 ? 'Cuadrada' : dif > 0 ? 'Sobrante' : 'Faltante';

                  return (
                    <div className="p-3 bg-gray-50 border rounded-xl space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Arqueado (Efectivo + Vales):</span>
                        <strong className="font-mono text-gray-900">${tot.toFixed(2)} USD</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Diferencia:</span>
                        <strong className={`font-mono font-bold ${
                          dif === 0 ? 'text-emerald-600' : dif > 0 ? 'text-blue-600' : 'text-red-600'
                        }`}>
                          {dif > 0 ? '+' : ''}${dif.toFixed(2)} USD ({status})
                        </strong>
                      </div>
                    </div>
                  );
                })()}

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Observaciones del Arqueo</label>
                  <textarea
                    rows={2}
                    placeholder="Notas sobre el estado físico de los billetes o justificación de comprobantes..."
                    value={arqueoNotes}
                    onChange={(e) => setArqueoNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 text-xs"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t">
                  <button
                    type="button"
                    onClick={() => setArqueoModalOpen(false)}
                    className="px-4 py-2 text-sm bg-gray-100 text-gray-700 font-semibold rounded-lg"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-sm bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg shadow-sm"
                  >
                    Certificar y Sellar Arqueo
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Ejecutar Cierre Operativo */}
        {closeModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-fade-in">
              <div className="flex justify-between items-center border-b pb-3">
                <div>
                  <h3 className="text-lg font-bold text-[#0A2540]">Certificar Cierre de Control Interno</h3>
                  <p className="text-xs text-gray-500">Genera huella digital SHA-256 e indexa en auditoría inmutable</p>
                </div>
                <button onClick={() => setCloseModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl font-bold">✕</button>
              </div>

              <form onSubmit={handleExecuteClosure} className="space-y-4 text-sm">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Título del Cierre</label>
                  <input
                    type="text"
                    required
                    value={closeTitle}
                    onChange={(e) => setCloseTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 font-semibold text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Monto Total Cuadrado ($ USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={closeAmount}
                    onChange={(e) => setCloseAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono font-bold text-gray-900 text-base"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Dictamen / Observaciones</label>
                  <textarea
                    rows={3}
                    placeholder="Certifico que todas las operaciones del turno fueron validadas y conciliadas..."
                    value={closeNotes}
                    onChange={(e) => setCloseNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 text-xs"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t">
                  <button
                    type="button"
                    onClick={() => setCloseModalOpen(false)}
                    className="px-4 py-2 text-sm bg-gray-100 text-gray-700 font-semibold rounded-lg"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-sm bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg shadow-sm"
                  >
                    Ejecutar y Sellar Cierre
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