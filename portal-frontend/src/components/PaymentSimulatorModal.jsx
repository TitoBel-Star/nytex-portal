import React, { useState } from 'react';

const PaymentSimulatorModal = ({ isOpen, onClose, phaseInfo, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1 = checkout, 2 = success

  if (!isOpen || !phaseInfo) return null;

  const handlePay = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulamos un tiempo de procesamiento de la tarjeta (2 segundos)
    setTimeout(async () => {
      // Llamada al backend real
      try {
        const response = await fetch('/api/payments/simulate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'demo@consultores-nyt.com', // Usando el usuario por defecto
            newModules: phaseInfo.modulesArray
          })
        });
        
        const data = await response.json();
        
        if (data.success) {
          setLoading(false);
          setStep(2); // Pasar a la pantalla de éxito
          
          // Refrescar el AuthContext en 3 segundos y cerrar
          setTimeout(() => {
            onSuccess(data.subscriptions);
            setStep(1);
          }, 3000);
        }
      } catch (error) {
        console.error('Error procesando pago:', error);
        setLoading(false);
        alert('Hubo un error de conexión con el servidor. Intenta de nuevo.');
      }
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative animate-fade-in-up">
        
        {/* Close button */}
        {step === 1 && !loading && (
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 z-10">
            <i className="fas fa-times text-xl"></i>
          </button>
        )}

        {/* Step 1: Checkout Form */}
        {step === 1 && (
          <div className="p-8">
            <div className="flex justify-center mb-6">
              {/* Fake Stripe Logo */}
              <div className="text-[#635BFF] font-bold text-2xl tracking-tighter flex items-center">
                <i className="fab fa-stripe fa-2x"></i> <span className="text-xs text-gray-400 ml-2 border border-gray-300 rounded px-1 tracking-normal">TEST MODE</span>
              </div>
            </div>

            <h2 className="text-xl font-extrabold text-[#0A2540] mb-1">Contratar {phaseInfo.name}</h2>
            <p className="text-sm text-gray-500 mb-6">Módulos: {phaseInfo.modulesText}</p>

            <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200 flex justify-between items-center">
              <span className="font-semibold text-gray-700">Total a pagar hoy:</span>
              <span className="text-2xl font-extrabold text-[#0A2540]">{phaseInfo.imp}</span>
            </div>

            <form onSubmit={handlePay}>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Correo Electrónico</label>
                <input type="email" value="demo@consultores-nyt.com" readOnly className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed focus:outline-none" />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Información de la Tarjeta</label>
                <div className="relative">
                  <i className="far fa-credit-card absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  <input type="text" placeholder="4242 4242 4242 4242" required className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-t-md focus:outline-none focus:ring-1 focus:ring-[#635BFF] focus:border-[#635BFF] font-mono" />
                </div>
                <div className="flex">
                  <input type="text" placeholder="MM / AA" required className="w-1/2 px-4 py-3 border border-t-0 border-r-0 border-gray-300 rounded-bl-md focus:outline-none focus:ring-1 focus:ring-[#635BFF] focus:border-[#635BFF]" />
                  <input type="text" placeholder="CVC" required className="w-1/2 px-4 py-3 border border-t-0 border-gray-300 rounded-br-md focus:outline-none focus:ring-1 focus:ring-[#635BFF] focus:border-[#635BFF]" />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className={`w-full py-3 px-4 rounded-md text-white font-bold text-lg shadow-md transition-all ${loading ? 'bg-[#635BFF]/70 cursor-not-allowed' : 'bg-[#635BFF] hover:bg-[#5249ea]'}`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <i className="fas fa-circle-notch fa-spin mr-2"></i> Procesando...
                  </span>
                ) : (
                  `Pagar ${phaseInfo.imp}`
                )}
              </button>
              
              <div className="mt-4 text-center text-xs text-gray-400 flex items-center justify-center">
                <i className="fas fa-lock mr-1"></i> Pagos seguros encriptados
              </div>
            </form>
          </div>
        )}

        {/* Step 2: Success */}
        {step === 2 && (
          <div className="p-10 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center text-4xl mb-6 animate-bounce">
              <i className="fas fa-check"></i>
            </div>
            <h2 className="text-2xl font-extrabold text-[#0A2540] mb-2">¡Pago Exitoso!</h2>
            <p className="text-gray-600 mb-6">Tu pago ha sido procesado correctamente. Los módulos se están desbloqueando...</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full animate-pulse" style={{width: '100%'}}></div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default PaymentSimulatorModal;
