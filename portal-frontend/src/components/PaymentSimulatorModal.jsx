import React, { useState } from 'react';

const PaymentSimulatorModal = ({ isOpen, onClose, phaseInfo, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1 = checkout, 2 = success con credenciales
  const [clientEmail, setClientEmail] = useState('demo@consultores-nyt.com');
  const [copied, setCopied] = useState(false);
  const [credentials, setCredentials] = useState(null);
  const [showDistribution, setShowDistribution] = useState(false);

  if (!isOpen || !phaseInfo) return null;

  // Normalización de textos y montos
  const planTitle = phaseInfo.name || phaseInfo.title || 'Plan Empresarial NyTEX';
  const phaseId = phaseInfo.phaseId || phaseInfo.id || 1;
  const modulesText = phaseInfo.modulesText || 
    (Array.isArray(phaseInfo.modulesArray) ? phaseInfo.modulesArray.join(', ') : 
    (Array.isArray(phaseInfo.modules) ? phaseInfo.modules.join(', ') : 'Módulos operativos incluidos'));
  
  // Determinación de valores de Implementación y 1ª Cuota de Licencia
  let impVal = 0;
  let licVal = 35;
  let impDisplay = '$0 USD';
  let licDisplay = '$35 USD / mes';

  if (phaseId === 1) {
    impVal = 0;
    licVal = 35;
    impDisplay = '$0 USD (Sin costo inicial)';
    licDisplay = '$35 USD / mes';
  } else if (phaseId === 2) {
    impVal = 1500;
    licVal = 149;
    impDisplay = '$1,500 USD';
    licDisplay = '$149 USD / mes';
  } else if (phaseId === 3) {
    impVal = 4500;
    licVal = 299;
    impDisplay = '$4,500 USD';
    licDisplay = '$299 USD / mes';
  } else if (phaseId === 4) {
    if (typeof phaseInfo.impAmount === 'number' && phaseInfo.impAmount > 0) {
      impVal = phaseInfo.impAmount;
      impDisplay = `$${impVal.toLocaleString()} USD`;
    } else if (typeof phaseInfo.amount === 'number' && phaseInfo.amount > 499) {
      impVal = phaseInfo.amount - 499;
      impDisplay = `$${impVal.toLocaleString()} USD`;
    } else {
      impVal = 0;
      impDisplay = phaseInfo.imp || 'Cotización a Medida';
    }
    licVal = 499;
    licDisplay = '$499 USD / mes';
  } else if (phaseId === 'custom') {
    const count = phaseInfo.modulesArray?.length || phaseInfo.modules?.length || 1;
    impVal = typeof phaseInfo.impAmount === 'number' ? phaseInfo.impAmount : (count * 400);
    licVal = typeof phaseInfo.licAmount === 'number' ? phaseInfo.licAmount : (count * 20);
    impDisplay = `$${impVal.toLocaleString()} USD`;
    licDisplay = `$${licVal.toLocaleString()} USD / mes`;
  } else {
    impVal = typeof phaseInfo.impAmount === 'number' ? phaseInfo.impAmount : (parseInt(String(phaseInfo.imp || '').replace(/[^0-9]/g, ''), 10) || 0);
    licVal = typeof phaseInfo.licAmount === 'number' ? phaseInfo.licAmount : (parseInt(String(phaseInfo.lic || '').replace(/[^0-9]/g, ''), 10) || 35);
    impDisplay = phaseInfo.imp || (impVal > 0 ? `$${impVal.toLocaleString()} USD` : '$0 USD');
    licDisplay = phaseInfo.lic || `$${licVal.toLocaleString()} USD / mes`;
  }

  // Total a pagar hoy: Implementación (pago único) + Primera Cuota de Licencia Mensual (Mes 1)
  const totalDueToday = impVal + licVal;
  const totalDueTodayFormatted = `$${totalDueToday.toLocaleString()} USD`;

  // ==============================================================
  // DISTRIBUCIÓN FINANCIERA (REVENUE SPLIT DE VENTANILLA):
  // - 100% Implementación: Para el Partner Asignado
  // - 20% Licencia Mensual: Para el Partner (Comisión recurrente)
  // - 80% Licencia Mensual: Para NyTEX (Infraestructura SaaS Core)
  // ==============================================================
  const partnerImpAmount = Number(impVal.toFixed(2));
  const partnerLicAmount = Number((licVal * 0.20).toFixed(2));
  const partnerTotalInitial = Number((partnerImpAmount + partnerLicAmount).toFixed(2));

  const nytexLicAmount = Number((licVal * 0.80).toFixed(2));
  const nytexTotalInitial = Number(nytexLicAmount.toFixed(2));

  const handlePay = async (e) => {
    e.preventDefault();
    setLoading(true);

    const modulesToUnlock = phaseInfo.modulesArray || phaseInfo.modules || [];

    setTimeout(async () => {
      let finalSubscriptions = modulesToUnlock;

      try {
        const response = await fetch('/api/payments/simulate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: clientEmail,
            newModules: modulesToUnlock,
            phaseId: phaseId
          })
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.subscriptions) {
            finalSubscriptions = data.subscriptions;
          }
        }
      } catch (error) {
        console.warn('Simulación de pago en modo offline/fallback local:', error);
      }

      // Generar los Códigos de Acceso Oficiales para el Cliente
      const randomPin = Math.floor(1000 + Math.random() * 9000);
      const generatedCreds = {
        roleName: 'Cliente Final',
        roleKey: 'Client',
        email: clientEmail,
        password: `NyTEX-Pass-${randomPin}`,
        licenseKey: `LIC-NYTEX-F${phaseId}-${Date.now().toString(36).toUpperCase()}`,
        phaseId: phaseId,
        phaseName: planTitle,
        impDisplay,
        licDisplay,
        totalPaidFormatted: totalDueTodayFormatted,
        partnerImpAmount,
        partnerLicAmount,
        partnerTotalInitial,
        nytexLicAmount,
        nytexTotalInitial,
        finalSubscriptions
      };

      setCredentials(generatedCreds);
      setLoading(false);
      setStep(2); // Mostrar Voucher de Códigos de Acceso
    }, 1500);
  };

  const handleCopyCredentials = () => {
    if (!credentials) return;
    const textToCopy = `=== CREDENCIALES DE ACCESO NyTEX ERP ===
1. Tipo de Usuario: ${credentials.roleName}
2. Usuario: ${credentials.email}
3. Clave de Acceso: ${credentials.password}
4. Fase Contratada: ${credentials.phaseName} (Fase ${credentials.phaseId})
5. Liquidación Total Pagada: ${credentials.totalPaidFormatted}
--- CLASIFICACIÓN Y DISTRIBUCIÓN FINANCIERA ---
• Partner Asignado (100% Imp + 20% Lic): $${credentials.partnerTotalInitial?.toFixed(2)} USD
  - Implementación (100%): $${credentials.partnerImpAmount?.toFixed(2)} USD
  - Comisión 1ª Licencia (20%): $${credentials.partnerLicAmount?.toFixed(2)} USD (Recurrente 20% mensual)
• Plataforma NyTEX SaaS (80% Lic): $${credentials.nytexTotalInitial?.toFixed(2)} USD
  - Infraestructura Cloud (80%): $${credentials.nytexLicAmount?.toFixed(2)} USD (Recurrente 80% mensual)
---
6. Licencia Criptográfica: ${credentials.licenseKey}
Portal: https://nytex-erp-portal.onrender.com/login`;
    
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }).catch(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleEnterWorkspace = () => {
    if (onSuccess && credentials) {
      onSuccess(credentials.finalSubscriptions, phaseInfo, credentials);
    }
    setStep(1);
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm transition-opacity p-4 font-sans">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden relative animate-fade-in border border-slate-200">
        
        {/* Botón Cerrar (en paso 1 o 2) */}
        {!loading && (
          <button 
            type="button"
            onClick={onClose} 
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 z-10 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            ✕
          </button>
        )}

        {/* ============================================================== */}
        {/* PASO 1: FORMULARIO DE PAGO CON TARJETA (STRIPE SIMULADO)       */}
        {/* ============================================================== */}
        {step === 1 && (
          <div className="p-6 sm:p-8">
            <div className="flex justify-center mb-4">
              <div className="text-[#635BFF] font-bold text-2xl tracking-tighter flex items-center gap-2">
                <span className="font-black text-3xl">stripe</span>
                <span className="text-[10px] text-gray-500 font-mono font-bold border border-gray-300 rounded px-1.5 py-0.5 tracking-normal bg-gray-50">
                  TEST MODE
                </span>
              </div>
            </div>

            <h2 className="text-xl font-extrabold text-[#0A2540] mb-1">
              Contratar {planTitle}
            </h2>
            <p className="text-xs text-gray-500 mb-4 leading-relaxed">
              <strong className="text-gray-700">Módulos:</strong> {modulesText}
            </p>

            {/* DESGLOSE CLARO DE IMPLEMENTACIÓN + PRIMERA CUOTA DE LICENCIA */}
            <div className="bg-slate-50 p-4 rounded-xl mb-4 border border-slate-200 shadow-inner">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2.5 pb-1.5 border-b border-slate-200 flex justify-between items-center">
                <span>Desglose de Liquidación Inicial</span>
                <span className="text-[10px] bg-blue-100 text-blue-800 font-extrabold px-2 py-0.5 rounded">
                  Fase {phaseId}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                {/* Concepto 1: Implementación */}
                <div className="flex justify-between items-center text-gray-700">
                  <span className="flex items-center gap-1.5 font-medium">
                    <span className="text-slate-400">🔧</span>
                    <span>Servicio de Implementación (Pago único):</span>
                  </span>
                  <span className="font-extrabold text-gray-900">{impDisplay}</span>
                </div>

                {/* Concepto 2: Primera cuota mensual de licencia */}
                <div className="flex justify-between items-center text-gray-700 pb-2 border-b border-dashed border-slate-200">
                  <span className="flex items-center gap-1.5 font-medium">
                    <span className="text-emerald-600">💳</span>
                    <span>1ª Cuota de Licencia Mensual (Mes 1):</span>
                  </span>
                  <span className="font-extrabold text-emerald-600">{licDisplay}</span>
                </div>
              </div>

              {/* Total a pagar hoy */}
              <div className="flex justify-between items-center pt-2.5 mt-1">
                <span className="font-black text-xs text-gray-800 uppercase tracking-wide">
                  Total a pagar hoy:
                </span>
                <span className="text-2xl font-black text-[#0A2540]">
                  {totalDueTodayFormatted}
                </span>
              </div>
              <p className="text-[10px] text-gray-400 text-right mt-1">
                * Puesta en marcha + 1er mes de servicio. Cuota mensual regular ({licDisplay}) aplica a partir del mes 2.
              </p>

              {/* Botón para Desplegar Clasificación de Repartición (Partner / NyTEX) */}
              <div className="mt-3 pt-2.5 border-t border-slate-200/80">
                <button
                  type="button"
                  onClick={() => setShowDistribution(!showDistribution)}
                  className="w-full py-1.5 px-2.5 bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 rounded-lg text-[11px] font-bold transition-all flex items-center justify-between"
                >
                  <span className="flex items-center gap-1.5">
                    <span>⚖️</span>
                    <span>Ver Clasificación de Distribución (Partner / NyTEX)</span>
                  </span>
                  <span className="text-[10px] text-purple-700 font-extrabold">{showDistribution ? '▲ Ocultar' : '▼ Ver Desglose'}</span>
                </button>

                {showDistribution && (
                  <div className="mt-2 p-2.5 bg-slate-900 text-white rounded-lg border border-purple-400/30 text-xs space-y-2 animate-fade-in">
                    <div className="text-[10px] font-black uppercase tracking-wider text-purple-300 border-b border-slate-800 pb-1 flex justify-between">
                      <span>Distribución Contable de este Cobro</span>
                      <span className="text-emerald-400 font-mono text-[9px]">100% Conciliado</span>
                    </div>

                    {/* Partner */}
                    <div className="bg-slate-950/80 p-2 rounded border border-slate-800">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="font-extrabold text-purple-300">🤝 Para el Partner (100% Imp + 20% Lic):</span>
                        <strong className="text-emerald-300 font-mono text-xs">${partnerTotalInitial.toFixed(2)} USD</strong>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1 pl-2 space-y-0.5">
                        <div>• 100% Implementación: <strong className="text-slate-200 font-mono">${partnerImpAmount.toFixed(2)} USD</strong></div>
                        <div>• 20% Comisión Licencia (Mes 1): <strong className="text-slate-200 font-mono">${partnerLicAmount.toFixed(2)} USD</strong> (Recurrente 20% en meses 2+)</div>
                      </div>
                    </div>

                    {/* NyTEX */}
                    <div className="bg-slate-950/80 p-2 rounded border border-slate-800">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="font-extrabold text-cyan-300">🏢 Para NyTEX SaaS (80% Lic):</span>
                        <strong className="text-cyan-300 font-mono text-xs">${nytexTotalInitial.toFixed(2)} USD</strong>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1 pl-2">
                        <div>• 80% Infraestructura Core y Servidores: <strong className="text-slate-200 font-mono">${nytexLicAmount.toFixed(2)} USD</strong> (Recurrente 80% en meses 2+)</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <form onSubmit={handlePay}>
              <div className="mb-3.5">
                <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                  Correo Electrónico del Cliente
                </label>
                <input 
                  type="email" 
                  value={clientEmail} 
                  onChange={(e) => setClientEmail(e.target.value)}
                  required 
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#635BFF]" 
                />
              </div>

              <div className="mb-4">
                <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                  Información de la Tarjeta (Simulada)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">💳</span>
                  <input 
                    type="text" 
                    defaultValue="4242 4242 4242 4242" 
                    required 
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-t-lg focus:outline-none focus:ring-2 focus:ring-[#635BFF] font-mono text-xs" 
                  />
                </div>
                <div className="flex">
                  <input 
                    type="text" 
                    defaultValue="12 / 28" 
                    required 
                    className="w-1/2 px-3 py-2 border border-t-0 border-r-0 border-gray-300 rounded-bl-lg focus:outline-none focus:ring-2 focus:ring-[#635BFF] text-xs font-mono text-center" 
                  />
                  <input 
                    type="text" 
                    defaultValue="888" 
                    required 
                    className="w-1/2 px-3 py-2 border border-t-0 border-gray-300 rounded-br-lg focus:outline-none focus:ring-2 focus:ring-[#635BFF] text-xs font-mono text-center" 
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className={`w-full py-3.5 px-4 rounded-xl text-white font-extrabold text-sm shadow-lg transition-all flex items-center justify-center gap-2 ${
                  loading 
                    ? 'bg-[#635BFF]/80 cursor-wait' 
                    : 'bg-[#635BFF] hover:bg-[#5249ea] hover:shadow-indigo-500/25 active:scale-[0.99]'
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Procesando pago con tarjeta...</span>
                  </>
                ) : (
                  <span>Pagar {totalDueTodayFormatted}</span>
                )}
              </button>
              
              <div className="mt-3.5 text-center text-[10px] text-gray-400 flex items-center justify-center gap-1.5">
                <span>🔒</span>
                <span>Transacción segura y encriptada (Ambiente de pruebas)</span>
              </div>
            </form>
          </div>
        )}

        {/* ============================================================== */}
        {/* PASO 2: ENTREGA FORMAL DE CÓDIGOS DE ACCESO A LA FASE          */}
        {/* ============================================================== */}
        {step === 2 && credentials && (
          <div className="p-6 sm:p-8 animate-fade-in flex flex-col">
            <div className="text-center mb-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-2 font-black shadow-inner">
                ✓
              </div>
              <h2 className="text-xl font-black text-[#0A2540]">
                ¡Pago Exitoso & Suscripción Activada!
              </h2>
              <p className="text-xs text-emerald-700 font-bold uppercase tracking-wider mt-0.5">
                {credentials.phaseName}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                A continuación se han generado sus <strong>códigos de acceso oficiales</strong> a la plataforma:
              </p>
            </div>

            {/* FICHA TÉCNICA DE CREDENCIALES DE ACCESO */}
            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4 text-white shadow-xl mb-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                <span className="text-[10px] uppercase font-black tracking-widest text-cyan-400 flex items-center gap-1">
                  <span>🔐</span> Ficha de Acceso de Seguridad
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded font-mono font-bold">
                  Activa
                </span>
              </div>

              <div className="space-y-2 text-xs">
                {/* 1. Tipo de Usuario */}
                <div className="flex justify-between items-center bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-400 font-bold text-[11px]">1. Tipo de Usuario:</span>
                  <span className="font-extrabold text-cyan-300">
                    🏢 {credentials.roleName}
                  </span>
                </div>

                {/* 2. Usuario */}
                <div className="flex justify-between items-center bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-400 font-bold text-[11px]">2. Usuario / Correo:</span>
                  <span className="font-mono font-bold text-white text-[11px] truncate max-w-[200px]">
                    {credentials.email}
                  </span>
                </div>

                {/* 3. Clave de Acceso */}
                <div className="flex justify-between items-center bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-400 font-bold text-[11px]">3. Clave Temporal:</span>
                  <span className="font-mono font-black text-amber-300 tracking-wider">
                    {credentials.password}
                  </span>
                </div>

                {/* Fase y Licencia */}
                <div className="flex justify-between items-center bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-400 font-bold text-[11px]">Fase Contratada:</span>
                  <span className="font-bold text-emerald-400 text-[11px]">
                    Fase {credentials.phaseId} ({credentials.finalSubscriptions.length} Módulos)
                  </span>
                </div>

                {/* Liquidación Pagada y Distribución */}
                <div className="bg-slate-950/80 p-2.5 rounded-xl border border-purple-500/30 text-xs">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-slate-300 font-bold text-[11px]">Total Liquidado en Ventanilla:</span>
                    <span className="font-black text-emerald-400 text-xs font-mono">
                      {credentials.totalPaidFormatted}
                    </span>
                  </div>

                  <div className="border-t border-slate-800 pt-1.5 space-y-1.5">
                    {/* Split Partner */}
                    <div className="bg-slate-900/90 p-1.5 rounded border border-slate-800 flex justify-between items-center">
                      <div>
                        <span className="font-extrabold text-purple-300 text-[11px]">🤝 Partner (100% Imp + 20% Lic):</span>
                        <div className="text-[9px] text-slate-400">
                          Imp: ${credentials.partnerImpAmount?.toFixed(2)} + Lic: ${credentials.partnerLicAmount?.toFixed(2)}
                        </div>
                      </div>
                      <span className="font-mono font-black text-purple-200 text-xs">
                        ${credentials.partnerTotalInitial?.toFixed(2)} USD
                      </span>
                    </div>

                    {/* Split NyTEX */}
                    <div className="bg-slate-900/90 p-1.5 rounded border border-slate-800 flex justify-between items-center">
                      <div>
                        <span className="font-extrabold text-cyan-300 text-[11px]">🏢 NyTEX SaaS (80% Lic):</span>
                        <div className="text-[9px] text-slate-400">
                          Infraestructura Cloud & Plataforma Core
                        </div>
                      </div>
                      <span className="font-mono font-black text-cyan-200 text-xs">
                        ${credentials.nytexTotalInitial?.toFixed(2)} USD
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-400 font-bold text-[10px]">Licencia SHA-256:</span>
                  <span className="font-mono text-[10px] text-slate-400">
                    {credentials.licenseKey}
                  </span>
                </div>
              </div>
            </div>

            {/* BOTONES DE ACCIÓN */}
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={handleCopyCredentials}
                className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-all border border-slate-300 flex items-center justify-center gap-2"
              >
                <span>{copied ? '✅ ¡Copiado al portapapeles!' : '📋 Copiar Códigos de Acceso'}</span>
              </button>

              <button
                type="button"
                onClick={handleEnterWorkspace}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 hover:shadow-xl hover:-translate-y-0.5"
              >
                <span>🚀 Ingresar a mi Espacio de Trabajo con mis Credenciales ➔</span>
              </button>
            </div>

            <p className="text-[10px] text-center text-slate-400 mt-3">
              Sus credenciales han quedado registradas en el sistema para futuros inicios de sesión.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default PaymentSimulatorModal;
