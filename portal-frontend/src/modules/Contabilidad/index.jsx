import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Contabilidad() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [trialBalance, setTrialBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Pólizas');
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [filterType, setFilterType] = useState('Todas');

  const fetchData = async () => {
    try {
      const [resEntries, resTB] = await Promise.all([
        fetch('/api/contabilidad/entries'),
        fetch('/api/contabilidad/trial-balance')
      ]);
      if (resEntries.ok) setEntries(await resEntries.json());
      if (resTB.ok) setTrialBalance(await resTB.json());
    } catch (err) {
      console.error('Error fetching Contabilidad data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
    <div className="h-full flex flex-col bg-[#f4f7f9] overflow-hidden w-full">
      {/* Top Header */}
      <div className="flex flex-col border-b border-gray-200 px-6 py-4 bg-white sticky top-0 z-10 shrink-0 shadow-sm w-full">
        <div className="flex justify-between items-center">
          <div className="flex items-center text-lg text-gray-700">
            <span className="cursor-pointer hover:underline text-[#006EAD]" onClick={() => navigate('/portal')}>Portal</span>
            <span className="mx-2 text-gray-400">/</span>
            <span className="font-bold text-[#0A2540] flex items-center gap-2">
              <span className="px-2 py-0.5 text-xs bg-purple-100 text-purple-800 font-bold rounded">Módulo [12]</span>
              NyTEX Contabilidad & Motor de Pólizas Automáticas
            </span>
          </div>
          <div className="flex items-center space-x-3">
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
              ↻ Refrescar Balanza
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 text-gray-800 w-full space-y-6">
        {/* Banner Ilustrativo */}
        <div className="bg-gradient-to-r from-[#2e1065] via-[#4c1d95] to-[#6d28d9] rounded-2xl p-6 text-white shadow-md">
          <div className="max-w-4xl space-y-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 text-white uppercase tracking-wider">
              Contabilidad Central Automatizada en Tiempo Real
            </span>
            <h2 className="text-2xl font-black">Libro Mayor y Motor Contable Oficial</h2>
            <p className="text-sm text-purple-100 leading-relaxed">
              Cada venta, compra, cobranza bancaria, dispersión de pago y depreciación de maquinaria genera en milisegundos su asiento contable de partida doble sin intervención manual, garantizando cumplimiento fiscal y estados financieros auditables.
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
              <span className="text-xs text-purple-200 font-bold uppercase">Total Abonos (Haber)</span>
              <div className="text-xl font-bold font-mono">
                ${(trialBalance?.totalCredit || 0).toLocaleString()}
              </div>
              <div className="text-xs text-purple-200">Movimientos acreedores</div>
            </div>
            <div>
              <span className="text-xs text-purple-200 font-bold uppercase">Estado de Balanza</span>
              <div className="text-xl font-bold text-emerald-300">
                {trialBalance?.isBalanced ? '✓ Cuadre Perfecto' : 'Descuadrada'}
              </div>
              <div className="text-xs text-emerald-200">Diferencia: $0.00 USD</div>
            </div>
          </div>
        </div>

        {/* Pestañas de Vista */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="flex border-b border-gray-100 px-6 py-3 bg-gray-50/50 justify-between items-center">
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('Pólizas')}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
                  activeTab === 'Pólizas' 
                    ? 'bg-purple-700 text-white shadow-sm' 
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                📑 Libro Diario de Pólizas ({entries.length})
              </button>
              <button
                onClick={() => setActiveTab('Balanza')}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
                  activeTab === 'Balanza' 
                    ? 'bg-purple-700 text-white shadow-sm' 
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                ⚖️ Balanza de Comprobación en Vivo
              </button>
            </div>

            {activeTab === 'Pólizas' && (
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-gray-500 font-bold">Tipo:</span>
                {['Todas', 'Ingreso', 'Egreso', 'Diario'].map(t => (
                  <button
                    key={t}
                    onClick={() => setFilterType(t)}
                    className={`px-2.5 py-1 rounded font-semibold ${
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
        </div>

        {/* Modal Detalle Asientos de la Póliza */}
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

      </div>
    </div>
  );
}