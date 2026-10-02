import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CircuitoNominaView() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [runningAction, setRunningAction] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const fetchSummary = async () => {
    try {
      const res = await fetch('/api/circuit/nomina/summary');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error('Error fetching nomina summary:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
    const interval = setInterval(fetchSummary, 5000);
    return () => clearInterval(interval);
  }, []);

  // Ejecución del paso 1: Calcular
  const handleStepCalculate = async () => {
    try {
      setRunningAction(true);
      const res = await fetch('/api/nomina/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ periodCode: 'NOM-2026-Q18' })
      });
      const json = await res.json();
      if (res.ok) {
        setFeedback({ type: 'success', message: 'Nómina recalculada con incidencias de RRHH.' });
        fetchSummary();
      } else {
        setFeedback({ type: 'error', message: json.error });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setRunningAction(false);
    }
  };

  // Ejecución del paso 2: Dispersar en Tesorería
  const handleStepDisburse = async () => {
    try {
      setRunningAction(true);
      const res = await fetch('/api/nomina/disburse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ periodCode: 'NOM-2026-Q18', bankCode: 'BCO-BNTE-02' })
      });
      const json = await res.json();
      if (res.ok) {
        setFeedback({ type: 'success', message: json.message });
        fetchSummary();
      } else {
        setFeedback({ type: 'error', message: json.error });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setRunningAction(false);
    }
  };

  // Ejecución del paso 3: Contabilizar
  const handleStepAccounting = async () => {
    try {
      setRunningAction(true);
      const res = await fetch('/api/nomina/post-accounting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ periodCode: 'NOM-2026-Q18' })
      });
      const json = await res.json();
      if (res.ok) {
        setFeedback({ type: 'success', message: json.message });
        fetchSummary();
      } else {
        setFeedback({ type: 'error', message: json.error });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setRunningAction(false);
    }
  };

  const currentPeriod = data?.currentPeriod;
  const metrics = data?.metrics;

  return (
    <div className="h-full flex flex-col bg-[#f8fafc] overflow-hidden w-full">
      {/* Top Header */}
      <div className="flex flex-col border-b border-gray-200 px-6 py-4 bg-white sticky top-0 z-10 shrink-0 shadow-sm w-full">
        <div className="flex justify-between items-center">
          <div className="flex items-center text-lg text-gray-700">
            <span className="cursor-pointer hover:underline text-[#006EAD]" onClick={() => navigate('/portal')}>Portal</span>
            <span className="mx-2 text-gray-400">/</span>
            <span className="font-bold text-[#0A2540] flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs bg-emerald-100 text-emerald-800 font-bold rounded-full">Fase 4: Talento Humano</span>
              Monitor Integral de RRHH, Nómina, Dispersión Bancaria & Contabilidad
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
              onClick={() => navigate('/app/nomina')}
              className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm"
            >
              [14] Nómina
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
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 text-gray-800 w-full space-y-6">
        
        {/* Banner Ilustrativo del Circuito */}
        <div className="bg-gradient-to-r from-[#064e3b] via-[#047857] to-[#10b981] rounded-2xl p-6 text-white shadow-md">
          <div className="max-w-4xl space-y-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 text-white uppercase tracking-wider">
              Circuito de Talento Humano & Dispersión
            </span>
            <h2 className="text-2xl font-black">Ciclo Completo de Nómina & Cargas Sociales</h2>
            <p className="text-sm text-emerald-100 leading-relaxed">
              Interconexión operativa de extremo a extremo: <strong>[13] RRHH</strong> reporta incidencias y asistencias; <strong>[14] Nómina</strong> calcula deducciones progresivas ISR SAT y cuota IMSS; <strong>[10] Tesorería</strong> dispersa el neto bancario vía SPEI; y <strong>[12] Contabilidad</strong> registra de forma automática la póliza de nómina con partida doble cuadrada al centavo.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-4 border-t border-white/20">
            <div>
              <span className="text-xs text-emerald-200 font-bold uppercase">1. Colaboradores Activos</span>
              <div className="text-xl font-bold font-mono">
                {metrics?.activeEmployees || 0} Trabajadores
              </div>
              <div className="text-xs text-emerald-200">100% formalizados</div>
            </div>
            <div>
              <span className="text-xs text-emerald-200 font-bold uppercase">2. Neto Quincenal</span>
              <div className="text-xl font-bold font-mono">
                ${(metrics?.totalNetToPay || 0).toLocaleString()} USD
              </div>
              <div className="text-xs text-emerald-200">Importe a dispersar</div>
            </div>
            <div>
              <span className="text-xs text-emerald-200 font-bold uppercase">3. Saldo en Banorte</span>
              <div className="text-xl font-bold font-mono">
                ${(metrics?.bankLiquidity || 0).toLocaleString()} USD
              </div>
              <div className="text-xs text-emerald-200">Liquidez disponible</div>
            </div>
            <div>
              <span className="text-xs text-emerald-200 font-bold uppercase">4. Estatus Circuito</span>
              <div className="text-xl font-bold text-amber-200">
                {currentPeriod?.status || 'Borrador'}
              </div>
              <div className="text-xs text-emerald-200">
                {currentPeriod?.journalEntryCode ? `Póliza: ${currentPeriod.journalEntryCode}` : 'En proceso'}
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div className={`p-4 rounded-xl text-xs font-bold flex justify-between items-center shadow-sm ${
            feedback.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}>
            <span>✓ {feedback.message}</span>
            <button onClick={() => setFeedback(null)} className="text-gray-400 hover:text-gray-600 font-bold ml-4">✕</button>
          </div>
        )}

        {/* Diagrama Interactivo de Flujo de Nómina */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
            <span>🔄</span> Flujo Interactivo de Datos entre Módulos
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
            {/* Paso 1: RRHH */}
            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-200 text-blue-900">
                    Paso 1
                  </span>
                  <span className="text-xs text-blue-700 font-mono font-bold">[13] RRHH</span>
                </div>
                <h4 className="font-black text-gray-900 text-sm mt-2">Incidencias & Asistencia</h4>
                <p className="text-[11px] text-gray-600 mt-1">
                  Control biométrico de faltas, retardos y horas extras dobles de producción textil.
                </p>
                <div className="mt-3 bg-white p-2 rounded border border-blue-100 text-[11px] space-y-1">
                  <div className="text-gray-600">Incidencias activas: <strong>{data?.incidents?.length || 0}</strong></div>
                  <div className="text-blue-800 font-bold">1 falta (-sueldo) • 7 hrs extras (+2x)</div>
                </div>
              </div>
              <button 
                onClick={() => navigate('/app/rrhh')}
                className="w-full bg-blue-700 hover:bg-blue-800 text-white py-1.5 rounded-lg text-xs font-bold transition-all"
              >
                Abrir RRHH ➔
              </button>
            </div>

            {/* Paso 2: Nómina */}
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-200 text-emerald-900">
                    Paso 2
                  </span>
                  <span className="text-xs text-emerald-700 font-mono font-bold">[14] Nómina</span>
                </div>
                <h4 className="font-black text-gray-900 text-sm mt-2">Cálculo Fiscal SAT/IMSS</h4>
                <p className="text-[11px] text-gray-600 mt-1">
                  Deducción de ISR Art. 96 LISR, Cuota obrera IMSS y premios de asistencia.
                </p>
                <div className="mt-3 bg-white p-2 rounded border border-emerald-100 text-[11px] space-y-1">
                  <div className="text-gray-600">Bruto: <strong>${(currentPeriod?.totalGross || 0).toLocaleString()}</strong></div>
                  <div className="text-rose-600 font-bold">Deduc: -${(currentPeriod?.totalDeductions || 0).toLocaleString()}</div>
                  <div className="text-emerald-700 font-bold">Neto: ${(currentPeriod?.totalNet || 0).toLocaleString()}</div>
                </div>
              </div>
              <button 
                disabled={runningAction}
                onClick={handleStepCalculate}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-1.5 rounded-lg text-xs font-bold transition-all"
              >
                Recalcular Motor ⚙️
              </button>
            </div>

            {/* Paso 3: Tesorería */}
            <div className="p-4 rounded-xl border border-cyan-200 bg-cyan-50/40 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-cyan-200 text-cyan-900">
                    Paso 3
                  </span>
                  <span className="text-xs text-cyan-700 font-mono font-bold">[10] Tesorería</span>
                </div>
                <h4 className="font-black text-gray-900 text-sm mt-2">Dispersión SPEI</h4>
                <p className="text-[11px] text-gray-600 mt-1">
                  Débito automático al saldo líquido de Banorte Nómina (0729-1029-4411).
                </p>
                <div className="mt-3 bg-white p-2 rounded border border-cyan-100 text-[11px] space-y-1">
                  <div className="text-gray-600">Folio: <strong>{currentPeriod?.disbursementTxCode || 'Pendiente'}</strong></div>
                  <div className="text-gray-600">Saldo Banco: <strong>${(data?.bankAccount?.balance || 0).toLocaleString()}</strong></div>
                  <div className="text-cyan-800 font-bold">
                    {currentPeriod?.status === 'Dispersada' || currentPeriod?.status === 'Contabilizada' ? '✓ Dispersado' : 'Listo para dispersar'}
                  </div>
                </div>
              </div>
              <button 
                disabled={runningAction || currentPeriod?.status === 'Dispersada' || currentPeriod?.status === 'Contabilizada'}
                onClick={handleStepDisburse}
                className={`w-full py-1.5 rounded-lg text-xs font-bold transition-all ${
                  currentPeriod?.status === 'Dispersada' || currentPeriod?.status === 'Contabilizada'
                    ? 'bg-gray-100 text-gray-400 cursor-default'
                    : 'bg-cyan-700 hover:bg-cyan-800 text-white'
                }`}
              >
                {currentPeriod?.status === 'Dispersada' || currentPeriod?.status === 'Contabilizada' ? 'Dispersión Realizada ✓' : 'Dispersar Salarios 🏦'}
              </button>
            </div>

            {/* Paso 4: Contabilidad */}
            <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/40 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-200 text-purple-900">
                    Paso 4
                  </span>
                  <span className="text-xs text-purple-700 font-mono font-bold">[12] Contabilidad</span>
                </div>
                <h4 className="font-black text-gray-900 text-sm mt-2">Póliza de Partida Doble</h4>
                <p className="text-[11px] text-gray-600 mt-1">
                  Reconocimiento del gasto bruto, retenciones por enterar y salida de bancos.
                </p>
                <div className="mt-3 bg-white p-2 rounded border border-purple-100 text-[11px] space-y-1">
                  <div className="text-gray-600">Folio: <strong>{currentPeriod?.journalEntryCode || 'Pendiente'}</strong></div>
                  <div className="text-purple-800 font-bold">10 Cuentas Contables</div>
                  <div className="text-emerald-600 font-bold">✓ Debe = Haber Cuadrado</div>
                </div>
              </div>
              <button 
                disabled={runningAction || currentPeriod?.status === 'Contabilizada' || currentPeriod?.status !== 'Dispersada'}
                onClick={handleStepAccounting}
                className={`w-full py-1.5 rounded-lg text-xs font-bold transition-all ${
                  currentPeriod?.status === 'Contabilizada'
                    ? 'bg-purple-100 text-purple-800 cursor-default'
                    : currentPeriod?.status === 'Dispersada'
                    ? 'bg-purple-700 hover:bg-purple-800 text-white'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {currentPeriod?.status === 'Contabilizada' ? 'Contabilizado ✓' : 'Generar Póliza 📑'}
              </button>
            </div>
          </div>
        </div>

        {/* Detalle de Cuentas y Colaboradores Procesados */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Cuentas Bancarias de Tesorería */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <span>🏦</span> Cuenta Bancaria de Dispersión en Tesorería
              </h3>
              <button onClick={() => navigate('/app/tesoreria')} className="text-xs text-[#006EAD] hover:underline font-bold">
                Ver Tesorería ➔
              </button>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl space-y-2 border border-gray-200">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-900 text-sm">{data?.bankAccount?.bankName}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                  {data?.bankAccount?.type}
                </span>
              </div>
              <div className="text-xs text-gray-500 font-mono">
                No. Cuenta: {data?.bankAccount?.accountNumber} ({data?.bankAccount?.currency})
              </div>
              <div className="pt-2 flex justify-between items-end border-t border-gray-200">
                <span className="text-xs text-gray-500 uppercase font-semibold">Saldo Disponible:</span>
                <span className="text-xl font-black font-mono text-gray-900">
                  ${(data?.bankAccount?.balance || 0).toLocaleString()} USD
                </span>
              </div>
            </div>

            <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded-lg border border-blue-100">
              ℹ️ Cada dispersión salarial genera automáticamente un movimiento de egreso reconciliado en Tesorería, actualizando el saldo bancario de la empresa en tiempo real.
            </div>
          </div>

          {/* Plantilla y Resumen de Colaboradores */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <span>👥</span> Plantilla de Colaboradores en la Nómina
              </h3>
              <button onClick={() => navigate('/app/nomina')} className="text-xs text-[#006EAD] hover:underline font-bold">
                Ver Recibos Digitales ➔
              </button>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {data?.employees?.map(emp => (
                <div key={emp.employeeCode} className="flex justify-between items-center p-2.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{emp.avatar || '👤'}</span>
                    <div>
                      <span className="font-bold text-gray-800 block">{emp.fullName}</span>
                      <span className="text-[10px] text-gray-500">{emp.jobTitle} • {emp.department}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-gray-900 block">${emp.dailySalary}/día</span>
                    <span className="text-[10px] text-emerald-600 font-medium">Banorte • {emp.bankAccount?.slice(-4)}</span>
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
