import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Nomina() {
  const navigate = useNavigate();
  const [period, setPeriod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Recibo seleccionado para ver en modal
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const fetchPeriodData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/nomina/periods/NOM-2026-Q18');
      if (res.ok) {
        const json = await res.json();
        setPeriod(json);
      }
    } catch (err) {
      console.error('Error fetching payroll period:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPeriodData();
  }, []);

  // 1. Calcular Nómina
  const handleCalculatePayroll = async () => {
    try {
      setActionLoading(true);
      const res = await fetch('/api/nomina/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ periodCode: 'NOM-2026-Q18' })
      });
      const json = await res.json();
      if (res.ok) {
        setPeriod(json.period);
        setFeedback({ type: 'success', message: json.message });
      } else {
        setFeedback({ type: 'error', message: json.error });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  // 2. Dispersar en Tesorería
  const handleDisbursePayroll = async () => {
    try {
      setActionLoading(true);
      const res = await fetch('/api/nomina/disburse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ periodCode: 'NOM-2026-Q18', bankCode: 'BCO-BNTE-02' })
      });
      const json = await res.json();
      if (res.ok) {
        setPeriod(json.period);
        setFeedback({ type: 'success', message: json.message });
      } else {
        setFeedback({ type: 'error', message: json.error });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  // 3. Contabilizar Nómina
  const handlePostAccounting = async () => {
    try {
      setActionLoading(true);
      const res = await fetch('/api/nomina/post-accounting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ periodCode: 'NOM-2026-Q18' })
      });
      const json = await res.json();
      if (res.ok) {
        setPeriod(json.period);
        setFeedback({ type: 'success', message: json.message });
      } else {
        setFeedback({ type: 'error', message: json.error });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#f8fafc] overflow-hidden w-full">
      {/* Barra Superior */}
      <div className="flex flex-col border-b border-gray-200 px-6 py-4 bg-white sticky top-0 z-10 shrink-0 shadow-sm w-full">
        <div className="flex justify-between items-center">
          <div className="flex items-center text-lg text-gray-700">
            <span className="cursor-pointer hover:underline text-[#006EAD]" onClick={() => navigate('/portal')}>Portal</span>
            <span className="mx-2 text-gray-400">/</span>
            <span className="font-bold text-[#0A2540] flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs bg-emerald-100 text-emerald-800 font-bold rounded-full">[14] Nómina</span>
              Motor Fiscal de Nómina, Percepciones & Deducciones
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => navigate('/app/rrhh')}
              className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm"
            >
              [13] RRHH
            </button>
            <button 
              onClick={() => navigate('/app/tesoreria')}
              className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm"
            >
              [10] Tesorería
            </button>
            <button 
              onClick={() => navigate('/app/contabilidad')}
              className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm"
            >
              [12] Contabilidad
            </button>
            <button 
              onClick={() => navigate('/app/circuito-nomina')}
              className="bg-[#0A2540] hover:bg-[#1E3A8A] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-all"
            >
              Monitor Circuito Talento ➔
            </button>
          </div>
        </div>
      </div>

      {/* Contenido Principal con Scroll */}
      <div className="flex-1 overflow-auto p-6 space-y-6">

        {/* Mensaje de Feedback */}
        {feedback && (
          <div className={`p-4 rounded-xl text-xs font-bold flex justify-between items-center shadow-sm ${
            feedback.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}>
            <span className="flex items-center gap-2">
              <span>{feedback.type === 'success' ? '✓' : '⚠️'}</span>
              {feedback.message}
            </span>
            <button onClick={() => setFeedback(null)} className="text-gray-400 hover:text-gray-600 font-bold ml-4">✕</button>
          </div>
        )}

        {/* Header del Periodo y Botonera del Flujo */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs px-2.5 py-1 rounded bg-gray-100 text-gray-700 font-bold">
                  {period?.periodCode || 'NOM-2026-Q18'}
                </span>
                <h2 className="text-xl font-black text-gray-900">
                  {period?.periodName || '2da Quincena Septiembre 2026'}
                </h2>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider ${
                  period?.status === 'Contabilizada' ? 'bg-purple-100 text-purple-800' :
                  period?.status === 'Dispersada' ? 'bg-blue-100 text-blue-800' :
                  period?.status === 'Calculada' ? 'bg-emerald-100 text-emerald-800' :
                  'bg-amber-100 text-amber-800'
                }`}>
                  ● {period?.status || 'Borrador'}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Periodo del {period?.startDate} al {period?.endDate} • Fecha de pago: {period?.payDate} • Banco emisor: {period?.bankSourceAccount}
              </p>
            </div>

            {/* Acciones del Circuito */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                disabled={actionLoading}
                onClick={handleCalculatePayroll}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-xs font-bold shadow transition-all flex items-center gap-1.5"
              >
                <span>⚙️</span> Recalcular Nómina (RRHH)
              </button>

              <button
                disabled={actionLoading || !period || period.status === 'Dispersada' || period.status === 'Contabilizada'}
                onClick={handleDisbursePayroll}
                className={`px-4 py-2 rounded-xl text-xs font-bold shadow transition-all flex items-center gap-1.5 ${
                  period?.status === 'Dispersada' || period?.status === 'Contabilizada'
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                <span>🏦</span> Dispersar en Tesorería (SPEI)
              </button>

              <button
                disabled={actionLoading || !period || period.status !== 'Dispersada'}
                onClick={handlePostAccounting}
                className={`px-4 py-2 rounded-xl text-xs font-bold shadow transition-all flex items-center gap-1.5 ${
                  period?.status === 'Contabilizada'
                    ? 'bg-purple-50 text-purple-700 border border-purple-200 cursor-default'
                    : period?.status === 'Dispersada'
                    ? 'bg-purple-700 hover:bg-purple-800 text-white'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                <span>📑</span> {period?.status === 'Contabilizada' ? `Contabilizada (${period.journalEntryCode})` : 'Generar Póliza Contable'}
              </button>
            </div>
          </div>

          {/* Tarjetas de Resumen Financiero de la Nómina */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6 pt-6 border-t border-gray-100">
            <div>
              <span className="text-[11px] text-gray-500 font-bold uppercase block">1. Percepciones Brutas</span>
              <div className="text-lg font-black font-mono text-gray-900">
                ${(period?.totalGross || 0).toLocaleString()} USD
              </div>
              <div className="text-[11px] text-gray-400">
                Inc. Horas Extra (${(period?.totalOvertime || 0).toLocaleString()})
              </div>
            </div>

            <div>
              <span className="text-[11px] text-gray-500 font-bold uppercase block">2. Retenciones Fiscales</span>
              <div className="text-lg font-black font-mono text-rose-600">
                -${(period?.totalDeductions || 0).toLocaleString()} USD
              </div>
              <div className="text-[11px] text-gray-400">
                ISR: ${(period?.totalIsr || 0).toLocaleString()} • IMSS: ${(period?.totalImssWorker || 0).toLocaleString()}
              </div>
            </div>

            <div className="bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100">
              <span className="text-[11px] text-emerald-800 font-black uppercase block">3. Neto a Dispersar</span>
              <div className="text-xl font-black font-mono text-emerald-700">
                ${(period?.totalNet || 0).toLocaleString()} USD
              </div>
              <div className="text-[10px] text-emerald-600 font-medium">
                {period?.disbursementTxCode ? `Folio SPEI: ${period.disbursementTxCode}` : 'Pendiente de dispersión'}
              </div>
            </div>

            <div>
              <span className="text-[11px] text-gray-500 font-bold uppercase block">4. Cargas Patronales</span>
              <div className="text-lg font-black font-mono text-indigo-700">
                ${((period?.totalEmployerImss || 0) + (period?.totalEmployerInfonavit || 0) + (period?.totalStateTax || 0)).toLocaleString()} USD
              </div>
              <div className="text-[11px] text-gray-400">
                IMSS + Infonavit + ISN 3%
              </div>
            </div>

            <div>
              <span className="text-[11px] text-gray-500 font-bold uppercase block">5. Costo Empresa</span>
              <div className="text-lg font-black font-mono text-[#0A2540]">
                ${(period?.totalCompanyCost || 0).toLocaleString()} USD
              </div>
              <div className="text-[11px] text-purple-600 font-bold">
                {period?.journalEntryCode ? `Póliza: ${period.journalEntryCode}` : 'Por contabilizar'}
              </div>
            </div>
          </div>
        </div>

        {/* Tabla de Prenómina por Colaborador */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-gray-900 text-sm">
                Desglose Quincenal por Colaborador ({period?.breakdown?.length || 0} Empleados)
              </h3>
              <p className="text-xs text-gray-500">
                Cálculo automatizado con base en asistencias de [13] RRHH, tablas ISR SAT 2026 y cuotas obreras IMSS.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider">
                  <th className="py-2.5 px-3">Colaborador</th>
                  <th className="py-2.5 px-3 text-center">Días / Faltas</th>
                  <th className="py-2.5 px-3 text-right">Sueldo Base</th>
                  <th className="py-2.5 px-3 text-right">Horas Extra</th>
                  <th className="py-2.5 px-3 text-right">Bono Asist.</th>
                  <th className="py-2.5 px-3 text-right">Percep. Bruta</th>
                  <th className="py-2.5 px-3 text-right text-rose-600">ISR (SAT)</th>
                  <th className="py-2.5 px-3 text-right text-rose-600">IMSS Obrero</th>
                  <th className="py-2.5 px-3 text-right text-emerald-700 font-black">Neto a Cobrar</th>
                  <th className="py-2.5 px-3 text-center">Recibo CFDI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {period?.breakdown?.map(item => (
                  <tr key={item.employeeCode} className="hover:bg-blue-50/40 transition-colors">
                    <td className="py-3 px-3">
                      <span className="font-bold text-gray-900 block">{item.fullName}</span>
                      <span className="text-[10px] text-gray-500">{item.jobTitle} • {item.department}</span>
                    </td>
                    <td className="py-3 px-3 text-center font-mono">
                      <span className="font-bold text-gray-800">{item.daysWorked}d</span>
                      {item.absences > 0 ? (
                        <span className="text-[10px] text-rose-600 font-bold block">({item.absences} falta)</span>
                      ) : (
                        <span className="text-[10px] text-emerald-600 font-bold block">(100% asist.)</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-medium text-gray-700">
                      ${item.basePay?.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right font-mono">
                      {item.otPay > 0 ? (
                        <span className="font-bold text-indigo-700">+${item.otPay?.toLocaleString()}</span>
                      ) : (
                        <span className="text-gray-400">$0</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right font-mono">
                      {item.attendanceBonus > 0 ? (
                        <span className="font-bold text-emerald-600">+${item.attendanceBonus?.toLocaleString()}</span>
                      ) : (
                        <span className="text-gray-400">$0</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-gray-900">
                      ${item.grossEarnings?.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-rose-600 font-medium">
                      -${item.isrAmount?.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-rose-600 font-medium">
                      -${item.imssWorkerAmount?.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-black text-emerald-700 text-sm">
                      ${item.netPay?.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button 
                        onClick={() => setSelectedReceipt(item)}
                        className="bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 text-[#006EAD] px-2.5 py-1 rounded-lg text-[11px] font-bold shadow-sm transition-all"
                      >
                        📄 Ver Recibo
                      </button>
                    </td>
                  </tr>
                ))}
                {(!period?.breakdown || period.breakdown.length === 0) && (
                  <tr>
                    <td colSpan="10" className="py-8 text-center text-gray-400">
                      Haga clic en "Recalcular Nómina" para generar el desglose por colaborador.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* MODAL: RECIBO DE NÓMINA DIGITAL (CFDI TIMBRADO) */}
      {selectedReceipt && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            {/* Header del Recibo */}
            <div className="flex justify-between items-start border-b pb-4">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 uppercase">
                  CFDI Nómina Versión 4.0 (Simulada)
                </span>
                <h3 className="font-black text-gray-900 text-lg mt-1">NyTEX Soluciones Textiles S.A. de C.V.</h3>
                <p className="text-xs text-gray-500">RFC: NTE180420TX9 • Régimen General de Ley Personas Morales</p>
              </div>
              <button onClick={() => setSelectedReceipt(null)} className="text-gray-400 hover:text-gray-600 text-xl font-bold">
                ✕
              </button>
            </div>

            {/* Datos del Trabajador */}
            <div className="bg-gray-50 p-4 rounded-xl grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-gray-400 uppercase text-[10px] font-bold block">Colaborador</span>
                <span className="font-bold text-gray-900">{selectedReceipt.fullName}</span>
                <span className="text-gray-500 block">Clave: {selectedReceipt.employeeCode}</span>
              </div>
              <div>
                <span className="text-gray-400 uppercase text-[10px] font-bold block">Puesto & Departamento</span>
                <span className="font-bold text-gray-900">{selectedReceipt.jobTitle}</span>
                <span className="text-gray-500 block">{selectedReceipt.department}</span>
              </div>
              <div>
                <span className="text-gray-400 uppercase text-[10px] font-bold block">Salario Base & SDI</span>
                <span className="font-mono text-gray-800 font-bold">${selectedReceipt.dailySalary} / día</span>
                <span className="text-gray-500 block font-mono">SDI: ${selectedReceipt.integratedDailySalary}</span>
              </div>
              <div>
                <span className="text-gray-400 uppercase text-[10px] font-bold block">Dispersión Bancaria</span>
                <span className="font-bold text-gray-900">{selectedReceipt.bankName}</span>
                <span className="text-gray-500 block font-mono">Cuenta: {selectedReceipt.bankAccount}</span>
              </div>
            </div>

            {/* Tabla Percepciones vs Deducciones */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              {/* Percepciones */}
              <div className="border border-emerald-100 rounded-xl p-3 bg-emerald-50/30 space-y-2">
                <span className="font-bold text-emerald-800 block border-b border-emerald-100 pb-1 uppercase tracking-wider text-[11px]">
                  (+) Percepciones
                </span>
                <div className="flex justify-between">
                  <span className="text-gray-700">001 Sueldo Base ({selectedReceipt.daysWorked} días):</span>
                  <span className="font-mono font-bold">${selectedReceipt.basePay?.toLocaleString()}</span>
                </div>
                {selectedReceipt.otPay > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-700">019 Horas Extra ({selectedReceipt.otHours} hrs):</span>
                    <span className="font-mono font-bold">${selectedReceipt.otPay?.toLocaleString()}</span>
                  </div>
                )}
                {selectedReceipt.attendanceBonus > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-700">038 Bono Puntualidad y Asist.:</span>
                    <span className="font-mono font-bold">${selectedReceipt.attendanceBonus?.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-emerald-200 font-black text-emerald-800">
                  <span>Total Percepciones:</span>
                  <span className="font-mono">${selectedReceipt.grossEarnings?.toLocaleString()}</span>
                </div>
              </div>

              {/* Deducciones */}
              <div className="border border-rose-100 rounded-xl p-3 bg-rose-50/30 space-y-2">
                <span className="font-bold text-rose-800 block border-b border-rose-100 pb-1 uppercase tracking-wider text-[11px]">
                  (-) Deducciones
                </span>
                <div className="flex justify-between">
                  <span className="text-gray-700">002 Retención ISR (Art. 96):</span>
                  <span className="font-mono font-bold text-rose-700">-${selectedReceipt.isrAmount?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">001 Seguridad Social (IMSS):</span>
                  <span className="font-mono font-bold text-rose-700">-${selectedReceipt.imssWorkerAmount?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-rose-200 font-black text-rose-800">
                  <span>Total Deducciones:</span>
                  <span className="font-mono">-${selectedReceipt.totalDeductions?.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Total Neto a Recibir */}
            <div className="bg-emerald-600 text-white p-4 rounded-xl flex justify-between items-center shadow-sm">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-emerald-100 block">
                  Neto Efectivo Depositado en Cuenta
                </span>
                <span className="text-xs text-emerald-200">
                  Folio Fiscal UUID: {selectedReceipt.cfdiUuid}
                </span>
              </div>
              <div className="text-2xl font-black font-mono">
                ${selectedReceipt.netPay?.toLocaleString()} USD
              </div>
            </div>

            {/* Cargas Patronales (Informativo para la empresa) */}
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-[11px] text-gray-600 flex justify-between items-center">
              <span><strong>Cargas Patronales Adicionales:</strong> IMSS Patronal: ${selectedReceipt.employerImss} • INFONAVIT: ${selectedReceipt.employerInfonavit} • ISN 3%: ${selectedReceipt.stateTax}</span>
              <span className="font-bold text-gray-900 font-mono">Costo Empresa: ${selectedReceipt.companyCost?.toLocaleString()}</span>
            </div>

            <div className="flex justify-end pt-2">
              <button 
                onClick={() => setSelectedReceipt(null)}
                className="bg-[#0A2540] hover:bg-[#1E3A8A] text-white px-5 py-2 rounded-xl text-xs font-bold"
              >
                Cerrar Visor de Recibo
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}