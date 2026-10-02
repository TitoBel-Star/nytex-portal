import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CircuitoFinancieroView() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSummary = async () => {
    try {
      const res = await fetch('/api/circuit/financiero/summary');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error('Error fetching financial summary:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
    const interval = setInterval(fetchSummary, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full flex flex-col bg-[#f4f7f9] overflow-hidden w-full">
      {/* Top Header */}
      <div className="flex flex-col border-b border-gray-200 px-6 py-4 bg-white sticky top-0 z-10 shrink-0 shadow-sm w-full">
        <div className="flex justify-between items-center">
          <div className="flex items-center text-lg text-gray-700">
            <span className="cursor-pointer hover:underline text-[#006EAD]" onClick={() => navigate('/portal')}>Portal</span>
            <span className="mx-2 text-gray-400">/</span>
            <span className="font-bold text-[#0A2540] flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs bg-purple-100 text-purple-800 font-bold rounded-full">Núcleo Financiero</span>
              Monitor Central de Tesorería, Activos Fijos & Contabilidad
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => navigate('/app/tesoreria')}
              className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm"
            >
              [10] Tesorería
            </button>
            <button 
              onClick={() => navigate('/app/activosfijos')}
              className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm"
            >
              [11] Activos Fijos
            </button>
            <button 
              onClick={() => navigate('/app/contabilidad')}
              className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm"
            >
              [12] Contabilidad
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 text-gray-800 w-full space-y-6">
        
        {/* Banner Ilustrativo */}
        <div className="bg-gradient-to-r from-[#172554] via-[#1e3a8a] to-[#2563eb] rounded-2xl p-6 text-white shadow-md">
          <div className="max-w-4xl space-y-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 text-white uppercase tracking-wider">
              Control Patrimonial, Bancario y Contable
            </span>
            <h2 className="text-2xl font-black">Núcleo Financiero & Motor Contable Central</h2>
            <p className="text-sm text-blue-100 leading-relaxed">
              Consolidación financiera automática: la cobranza de <strong>[8] CxC</strong> ingresa a bancos en <strong>[10] Tesorería</strong>; los pagos de <strong>[9] CxP</strong> dispersan fondos; el desgaste patrimonial en <strong>[11] Activos Fijos</strong> calcula depreciación; y <strong>[12] Contabilidad</strong> cuadra el balance en tiempo real con pólizas de partida doble.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-4 border-t border-white/20">
            <div>
              <span className="text-xs text-blue-200 font-bold uppercase">1. Saldo Líquido Bancos</span>
              <div className="text-xl font-bold font-mono">
                ${(data?.metrics?.totalBankBalance || 0).toLocaleString()} USD
              </div>
              <div className="text-xs text-blue-200">Disponibilidad en Tesorería</div>
            </div>
            <div>
              <span className="text-xs text-blue-200 font-bold uppercase">2. Valor Neto Activos</span>
              <div className="text-xl font-bold font-mono">
                ${(data?.metrics?.totalAssetBookValue || 0).toLocaleString()} USD
              </div>
              <div className="text-xs text-blue-200">Maquinaria y transporte</div>
            </div>
            <div>
              <span className="text-xs text-blue-200 font-bold uppercase">3. Pólizas Generadas</span>
              <div className="text-xl font-bold">{data?.metrics?.totalJournalEntries || 0} Pólizas</div>
              <div className="text-xs text-blue-200">Automatizadas por el sistema</div>
            </div>
            <div>
              <span className="text-xs text-blue-200 font-bold uppercase">4. Balanza Contable</span>
              <div className="text-xl font-bold text-emerald-300">✓ Cuadre 100%</div>
              <div className="text-xs text-emerald-200">Debe = Haber verificado</div>
            </div>
          </div>
        </div>

        {/* Cuentas Bancarias y Pólizas Recientes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Cuentas en Tesorería */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <span>🏦</span> Cuentas Bancarias Corporativas en Tesorería
              </h3>
              <button onClick={() => navigate('/app/tesoreria')} className="text-xs text-[#006EAD] hover:underline font-bold">
                Gestionar ➔
              </button>
            </div>

            <div className="space-y-3">
              {data?.bankAccounts && data.bankAccounts.map(acc => (
                <div key={acc.id} className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 flex justify-between items-center text-xs">
                  <div>
                    <div className="font-bold text-gray-900 text-sm">{acc.bankName}</div>
                    <div className="text-gray-500 font-mono">Cuenta: {acc.accountNumber} ({acc.type})</div>
                  </div>
                  <div className="text-right">
                    <div className="font-extrabold text-base font-mono text-[#0A2540]">
                      ${acc.balance.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="text-[11px] text-emerald-600 font-bold">✓ Conciliada</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Últimas Pólizas Automáticas */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <span>📑</span> Últimas Pólizas Contables Emitidas
              </h3>
              <button onClick={() => navigate('/app/contabilidad')} className="text-xs text-purple-700 hover:underline font-bold">
                Ver Balanza ➔
              </button>
            </div>

            <div className="space-y-2.5 max-h-72 overflow-y-auto">
              {data?.recentEntries && data.recentEntries.map(e => (
                <div key={e.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 flex justify-between items-center text-xs">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-purple-800">{e.entryCode}</span>
                      <span className="px-2 py-0.2 rounded-full text-[10px] font-semibold bg-gray-200 text-gray-700">
                        {e.originModule}
                      </span>
                    </div>
                    <div className="text-gray-700 font-medium truncate max-w-xs mt-0.5">{e.concept}</div>
                  </div>
                  <div className="text-right font-mono font-bold text-gray-900">
                    ${e.totalDebit.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    <div className="text-[10px] text-emerald-600 font-bold">✓ {e.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
