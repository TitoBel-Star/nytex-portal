import React, { useState } from 'react';

const PaymentSimulatorModal = ({ isOpen, onClose, phaseInfo, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1 = checkout, 2 = success

  if (!isOpen || !phaseInfo) return null;

  // Normalización de textos y montos para evitar cualquier "undefined"
  const planTitle = phaseInfo.name || phaseInfo.title || 'Plan Empresarial NyTEX';
  const modulesText = phaseInfo.modulesText || 
    (Array.isArray(phaseInfo.modulesArray) ? phaseInfo.modulesArray.join(', ') : 
    (Array.isArray(phaseInfo.modules) ? phaseInfo.modules.join(', ') : 'Módulos operativos incluidos'));
  
  let priceText = phaseInfo.imp;
  if (!priceText || priceText === '$0 USD' || priceText === '$0') {
    priceText = phaseInfo.lic || (phaseInfo.amount ? `$${phaseInfo.amount} USD / mes` : '$35 USD / mes');
  }

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
            email: 'demo@consultores-nyt.com',
            newModules: modulesToUnlock,
            phaseId: phaseInfo.phaseId || 1
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

      setLoading(false);
      setStep(2); // Pantalla de éxito

      setTimeout(() => {
        if (onSuccess) {
          onSuccess(finalSubscriptions, phaseInfo);
        }
        setStep(1);
        if (onClose) onClose();
      }, 1800);

    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm transition-opacity p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative animate-fade-in-up border border-slate-200">
        
        {/* Botón Cerrar */}
        {step === 1 && !loading && (
          <button 
            type="button"
            onClick={onClose} 
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 z-10 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            ✕
          </button>
        )}

        {/* Paso 1: Formulario de Pago */}
        {step === 1 && (
          <div className="p-6 sm:p-8">
            <div className="flex justify-center mb-5">
              <div className="text-[#635BFF] font-bold text-2xl tracking-tighter flex items-center gap-2">
                <i className="fab fa-stripe fa-2x"></i> 
                <span className="text-[10px] text-gray-500 font-mono font-bold border border-gray-300 rounded px-1.5 py-0.5 tracking-normal bg-gray-50">
                  TEST MODE
                </span>
              </div>
            </div>

            <h2 className="text-xl font-extrabold text-[#0A2540] mb-1">
              Contratar {planTitle}
            </h2>
            <p className="text-xs text-gray-500 mb-5 leading-relaxed">
              <strong className="text-gray-700">Módulos:</strong> {modulesText}
            </p>

            <div className="bg-slate-50 p-4 rounded-xl mb-5 border border-slate-200 flex justify-between items-center shadow-inner">
              <span className="font-bold text-sm text-gray-700">Total a pagar hoy:</span>
              <span className="text-2xl font-black text-[#0A2540]">{priceText}</span>
            </div>

            <form onSubmit={handlePay}>
              <div className="mb-4">
                <label className="block text-xs font-bold uppercase text-gray-600 mb-1.5">
                  Correo Electrónico
                </label>
                <input 
                  type="email" 
                  value="demo@consultores-nyt.com" 
                  readOnly 
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 text-sm font-medium cursor-not-allowed focus:outline-none" 
                />
              </div>

              <div className="mb-5">
                <label className="block text-xs font-bold uppercase text-gray-600 mb-1.5">
                  Información de la Tarjeta (Simulada)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">💳</span>
                  <input 
                    type="text" 
                    defaultValue="4242 4242 4242 4242" 
                    required 
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-t-lg focus:outline-none focus:ring-2 focus:ring-[#635BFF] font-mono text-sm" 
                  />
                </div>
                <div className="flex">
                  <input 
                    type="text" 
                    defaultValue="12 / 28" 
                    required 
                    className="w-1/2 px-3 py-2.5 border border-t-0 border-r-0 border-gray-300 rounded-bl-lg focus:outline-none focus:ring-2 focus:ring-[#635BFF] text-sm font-mono text-center" 
                  />
                  <input 
                    type="text" 
                    defaultValue="888" 
                    required 
                    className="w-1/2 px-3 py-2.5 border border-t-0 border-gray-300 rounded-br-lg focus:outline-none focus:ring-2 focus:ring-[#635BFF] text-sm font-mono text-center" 
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className={`w-full py-3.5 px-4 rounded-xl text-white font-extrabold text-base shadow-lg transition-all flex items-center justify-center gap-2 ${
                  loading 
                    ? 'bg-[#635BFF]/80 cursor-wait' 
                    : 'bg-[#635BFF] hover:bg-[#5249ea] hover:shadow-indigo-500/25 active:scale-[0.99]'
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Procesando pago con Stripe...</span>
                  </>
                ) : (
                  <span>Pagar {priceText}</span>
                )}
              </button>
              
              <div className="mt-4 text-center text-[11px] text-gray-400 flex items-center justify-center gap-1.5">
                <span>🔒</span>
                <span>Transacción segura y encriptada (Ambiente de pruebas)</span>
              </div>
            </form>
          </div>
        )}

        {/* Paso 2: Pantalla de Éxito */}
        {step === 2 && (
          <div className="p-8 text-center flex flex-col items-center animate-fade-in">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl mb-4 animate-bounce">
              ✓
            </div>
            <h2 className="text-2xl font-black text-[#0A2540] mb-1">
              ¡Pago Exitoso!
            </h2>
            <p className="text-xs text-emerald-700 font-bold mb-2 uppercase tracking-wide">
              {planTitle} Activado
            </p>
            <p className="text-xs text-gray-500 mb-6 max-w-xs">
              Su contratación ha sido confirmada. Abriendo su <strong>Espacio de Trabajo (Workspace)</strong> con todos sus módulos...
            </p>
            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
              <div className="bg-emerald-500 h-2 rounded-full animate-pulse w-full"></div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default PaymentSimulatorModal;
