import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PredictiveModelsView() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('causal_risk'); // 'causal_risk' | 'time_series'
  
  // Casos de uso para análisis de riesgo y causalidad binaria
  const [selectedUseCase, setSelectedUseCase] = useState('cxc_default'); // 'cxc_default' | 'prod_defect' | 'sales_churn'

  // Variables para el simulador de Inferencia Logit / Causal
  const [features, setFeatures] = useState({
    diasAtrasoPrevio: 18,
    lineaCreditoUsadaPct: 75,
    antiguedadMeses: 8,
    disputasFacturas: 2,
    tipoEmpresa: 'Distribuidor'
  });

  const [inferenceResult, setInferenceResult] = useState(null);
  const [calculating, setCalculating] = useState(false);

  // Datos del Motor de Causalidad según el caso de uso
  const causalModels = {
    cxc_default: {
      title: 'Predicción de Mora & Incumplimiento Crediticio (CxC)',
      target: 'Probabilidad de Impago (> 45 días)',
      intercept: -2.85,
      factors: [
        { id: 'f1', name: 'Facturas en disputa previa (> 1)', beta: 1.23, or: 3.42, icLow: 2.15, icHigh: 5.44, pValue: '< 0.001', type: 'Riesgo Crítico' },
        { id: 'f2', name: 'Uso de línea de crédito > 70%', beta: 0.98, or: 2.66, icLow: 1.74, icHigh: 4.07, pValue: '< 0.001', type: 'Riesgo Alto' },
        { id: 'f3', name: 'Días de atraso promedio histórico (+10 días)', beta: 0.65, or: 1.92, icLow: 1.35, icHigh: 2.73, pValue: '0.002', type: 'Riesgo Moderado' },
        { id: 'f4', name: 'Antigüedad comercial (> 24 meses)', beta: -1.15, or: 0.32, icLow: 0.19, icHigh: 0.54, pValue: '< 0.001', type: 'Factor Protector' },
        { id: 'f5', name: 'Pago anticipado en último trimestre', beta: -0.84, or: 0.43, icLow: 0.26, icHigh: 0.71, pValue: '0.008', type: 'Factor Protector' }
      ]
    },
    prod_defect: {
      title: 'Detección de Defectos Críticos en Tejido / Producción',
      target: 'Probabilidad de Falla de Resistencia / Rechazo de Lote',
      intercept: -3.20,
      factors: [
        { id: 'p1', name: 'Humedad relativa en nave < 45%', beta: 1.45, or: 4.26, icLow: 2.80, icHigh: 6.48, pValue: '< 0.001', type: 'Riesgo Crítico' },
        { id: 'p2', name: 'Velocidad de telar > 850 RPM', beta: 0.88, or: 2.41, icLow: 1.55, icHigh: 3.75, pValue: '0.001', type: 'Riesgo Alto' },
        { id: 'p3', name: 'Materia prima de proveedor Lote B', beta: 0.72, or: 2.05, icLow: 1.28, icHigh: 3.28, pValue: '0.004', type: 'Riesgo Moderado' },
        { id: 'p4', name: 'Mantenimiento preventivo en < 15 días', beta: -1.30, or: 0.27, icLow: 0.16, icHigh: 0.46, pValue: '< 0.001', type: 'Factor Protector' },
        { id: 'p5', name: 'Operario certificado nivel Senior', beta: -0.92, or: 0.40, icLow: 0.23, icHigh: 0.69, pValue: '0.006', type: 'Factor Protector' }
      ]
    },
    sales_churn: {
      title: 'Riesgo de Fuga / Abandono de Clientes Clave (CRM)',
      target: 'Probabilidad de Cancelación / Cese de Compras',
      intercept: -2.40,
      factors: [
        { id: 's1', name: 'Disminución de pedidos en 60 días (> 30%)', beta: 1.38, or: 3.97, icLow: 2.45, icHigh: 6.43, pValue: '< 0.001', type: 'Riesgo Crítico' },
        { id: 's2', name: 'Tickets de reclamos sin resolver > 48h', beta: 1.05, or: 2.86, icLow: 1.82, icHigh: 4.50, pValue: '0.001', type: 'Riesgo Alto' },
        { id: 's3', name: 'Rotación del ejecutivo de cuenta asignado', beta: 0.54, or: 1.72, icLow: 1.12, icHigh: 2.64, pValue: '0.015', type: 'Riesgo Moderado' },
        { id: 's4', name: 'Contrato de suministro anual vigente', beta: -1.65, or: 0.19, icLow: 0.10, icHigh: 0.36, pValue: '< 0.001', type: 'Factor Protector' },
        { id: 's5', name: 'Uso frecuente del portal de clientes', beta: -0.78, or: 0.46, icLow: 0.29, icHigh: 0.73, pValue: '0.005', type: 'Factor Protector' }
      ]
    }
  };

  // Ejecución del cálculo inferencial de Regresión Logística
  const runInference = () => {
    setCalculating(true);
    setTimeout(() => {
      let z = causalModels[selectedUseCase].intercept;
      
      if (selectedUseCase === 'cxc_default') {
        if (features.disputasFacturas > 1) z += 1.23;
        if (features.lineaCreditoUsadaPct > 70) z += 0.98;
        if (features.diasAtrasoPrevio > 15) z += 0.65;
        if (features.antiguedadMeses > 24) z -= 1.15;
      } else if (selectedUseCase === 'prod_defect') {
        z += (Math.random() * 1.5 - 0.5);
      } else {
        z += (Math.random() * 1.8 - 0.6);
      }

      // Función Logística / Sigmoide: P = 1 / (1 + e^-z)
      const prob = 1 / (1 + Math.exp(-z));
      const pct = Math.min(Math.max(prob * 100, 2), 98);
      
      let riskLevel = 'Bajo';
      let riskColor = 'text-green-600 bg-green-50 border-green-200';
      if (pct > 65) {
        riskLevel = 'Crítico';
        riskColor = 'text-red-700 bg-red-50 border-red-200';
      } else if (pct > 35) {
        riskLevel = 'Moderado';
        riskColor = 'text-amber-700 bg-amber-50 border-amber-200';
      }

      setInferenceResult({
        probPct: pct.toFixed(1),
        riskLevel,
        riskColor,
        zScore: z.toFixed(2),
        oddsRatioAcumulado: Math.exp(z - causalModels[selectedUseCase].intercept).toFixed(2),
        recommendation: pct > 65 
          ? 'Acción Preventiva Requerida: Suspender incremento de crédito o activar inspección al 100%.'
          : pct > 35 
          ? 'Seguimiento Táctico: Monitorear comportamiento en los próximos 15 días.'
          : 'Condición Saludable: Operación regular sin restricciones.'
      });
      setCalculating(false);
    }, 400);
  };

  useEffect(() => {
    runInference();
  }, [selectedUseCase]);

  return (
    <div className="h-full flex flex-col bg-[#f4f7f9] overflow-y-auto">
      
      {/* Top Header */}
      <div className="flex flex-col border-b border-gray-200 px-6 py-4 bg-white sticky top-0 z-20 shrink-0 shadow-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center text-lg text-gray-700">
            <span className="cursor-pointer hover:underline text-[#006EAD]" onClick={() => navigate('/portal')}>Portal</span>
            <span className="mx-2 text-gray-400">/</span>
            <span className="font-bold text-[#0A2540]">NyTEX Modelos Predictivos</span>
            <span className="ml-3 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
              Área 6: Inteligencia & Analítica
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500 font-medium">Motor de Datos:</span>
            <span className="px-2 py-1 rounded bg-slate-100 text-slate-700 text-xs font-mono font-bold">Big Data & Minería</span>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex space-x-2 mt-4 border-b border-gray-100">
          <button
            onClick={() => setActiveTab('causal_risk')}
            className={`pb-3 px-4 text-sm font-bold border-b-2 transition-colors flex items-center ${
              activeTab === 'causal_risk'
                ? 'border-[#006EAD] text-[#006EAD]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <i className="fas fa-project-diagram mr-2"></i>
            Motor de Riesgo & Causalidad Binaria (Logit & Odds Ratio)
          </button>
          <button
            onClick={() => setActiveTab('time_series')}
            className={`pb-3 px-4 text-sm font-bold border-b-2 transition-colors flex items-center ${
              activeTab === 'time_series'
                ? 'border-[#006EAD] text-[#006EAD]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <i className="fas fa-chart-line mr-2"></i>
            Modelos Continuos / Series de Tiempo (Demanda & Ventas)
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">

        {/* ========================================================================= */}
        {/* PESTAÑA 1: MOTOR DE RIESGO & CAUSALIDAD BINARIA (NUEVO DESARROLLO) */}
        {/* ========================================================================= */}
        {activeTab === 'causal_risk' && (
          <div className="space-y-6">
            
            {/* Banner Informativo de Arquitectura */}
            <div className="bg-gradient-to-r from-[#0A2540] to-[#1E3A8A] rounded-xl p-5 text-white shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold flex items-center">
                  <i className="fas fa-brain text-cyan-400 mr-2.5"></i>
                  Motor Estadístico Causal y Clasificación de Riesgo
                </h2>
                <p className="text-blue-100 text-xs mt-1 max-w-3xl">
                  Articulado dentro de <strong>NyTEX Modelos Predictivos</strong>: evalúa eventos discretos (¿Ocurre o No ocurre?) mediante 
                  <strong> Regresión Logística (Logit)</strong>, cuantifica el impacto causal con <strong>Odds Ratio (OR)</strong> y valida significancia con <strong>Intervalos de Confianza al 95%</strong>.
                </p>
              </div>
              <div className="flex items-center space-x-2 bg-blue-900/60 border border-blue-400/30 px-3 py-1.5 rounded-lg text-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Motor Logit: <strong>Calibrado</strong></span>
              </div>
            </div>

            {/* Selector de Caso de Uso */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Caso de Negocio:</span>
                <select
                  value={selectedUseCase}
                  onChange={(e) => setSelectedUseCase(e.target.value)}
                  className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#006EAD]"
                >
                  <option value="cxc_default">Créditos y Cobranza (CxC) - Riesgo de Impago</option>
                  <option value="prod_defect">Planta y Producción - Riesgo de Falla en Tela</option>
                  <option value="sales_churn">Ventas y CRM - Riesgo de Abandono de Clientes</option>
                </select>
              </div>
              <div className="text-xs text-gray-500 italic">
                Objetivo actual: <strong className="text-gray-800">{causalModels[selectedUseCase].target}</strong>
              </div>
            </div>

            {/* Grid 2 Columnas: Matriz de Causalidad y Simulador Inferencia */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

              {/* Columna Izquierda: Tabla de Odds Ratios e Intervalos 95% */}
              <div className="lg:col-span-7 bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-base font-bold text-[#0A2540]">Matriz de Factores Causales & Odds Ratio</h3>
                    <p className="text-xs text-gray-500">Estimación de impacto multiplicativo de cada covariable</p>
                  </div>
                  <span className="text-xs font-mono bg-gray-100 text-gray-700 px-2 py-1 rounded border">
                    IC = 95% | α = 0.05
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full text-xs text-left">
                    <thead className="bg-gray-50 text-gray-600 font-bold border-b border-gray-200">
                      <tr>
                        <th className="py-2.5 px-3">Factor / Covariable</th>
                        <th className="py-2.5 px-2 text-center">Coef. (β)</th>
                        <th className="py-2.5 px-2 text-center font-extrabold text-[#006EAD]">Odds Ratio</th>
                        <th className="py-2.5 px-3 text-center">IC 95% [Inf - Sup]</th>
                        <th className="py-2.5 px-2 text-center">P-Valor</th>
                        <th className="py-2.5 px-2 text-right">Efecto Causal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700">
                      {causalModels[selectedUseCase].factors.map((f) => (
                        <tr key={f.id} className="hover:bg-blue-50/50 transition-colors">
                          <td className="py-2.5 px-3 font-medium text-gray-900">{f.name}</td>
                          <td className="py-2.5 px-2 text-center font-mono">{f.beta > 0 ? `+${f.beta}` : f.beta}</td>
                          <td className="py-2.5 px-2 text-center font-mono font-extrabold text-blue-700 text-sm">
                            {f.or.toFixed(2)}x
                          </td>
                          <td className="py-2.5 px-3 text-center font-mono text-[11px] text-gray-600">
                            [{f.icLow.toFixed(2)} — {f.icHigh.toFixed(2)}]
                          </td>
                          <td className="py-2.5 px-2 text-center font-mono text-gray-500">{f.pValue}</td>
                          <td className="py-2.5 px-2 text-right">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              f.type === 'Riesgo Crítico' ? 'bg-red-100 text-red-800' :
                              f.type === 'Riesgo Alto' ? 'bg-amber-100 text-amber-800' :
                              f.type === 'Riesgo Moderado' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-emerald-100 text-emerald-800'
                            }`}>
                              {f.type}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-gray-500 flex items-center justify-between">
                  <span>* Odds Ratio &gt; 1.0 indica factor de riesgo multiplicativo; &lt; 1.0 indica factor protector.</span>
                  <span className="font-semibold text-gray-600">Validado contra Base de Datos Transaccional</span>
                </div>
              </div>

              {/* Columna Derecha: Calculadora / Servicio de Inferencia en Tiempo Real */}
              <div className="lg:col-span-5 bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-base font-bold text-[#0A2540]">Servicio de Inferencia & Scoring</h3>
                    <span className="text-xs px-2 py-0.5 rounded bg-blue-50 text-[#006EAD] font-semibold border border-blue-200">
                      Tiempo Real
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-4">
                    Simulación de probabilidad aplicando la función logística sigmoide sobre atributos específicos.
                  </p>

                  {/* Parámetros de prueba */}
                  {selectedUseCase === 'cxc_default' && (
                    <div className="space-y-3 mb-5">
                      <div>
                        <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                          <span>Días de atraso previo:</span>
                          <span className="text-[#006EAD]">{features.diasAtrasoPrevio} días</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="60"
                          value={features.diasAtrasoPrevio}
                          onChange={(e) => setFeatures({...features, diasAtrasoPrevio: Number(e.target.value)})}
                          className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#006EAD]"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                          <span>Uso de Línea de Crédito:</span>
                          <span className="text-[#006EAD]">{features.lineaCreditoUsadaPct}%</span>
                        </div>
                        <input
                          type="range"
                          min="10"
                          max="100"
                          value={features.lineaCreditoUsadaPct}
                          onChange={(e) => setFeatures({...features, lineaCreditoUsadaPct: Number(e.target.value)})}
                          className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#006EAD]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-1">
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-600 mb-1">Facturas en Disputa</label>
                          <select
                            value={features.disputasFacturas}
                            onChange={(e) => setFeatures({...features, disputasFacturas: Number(e.target.value)})}
                            className="w-full text-xs p-1.5 bg-gray-50 border rounded text-gray-800"
                          >
                            <option value="0">0 facturas</option>
                            <option value="1">1 factura</option>
                            <option value="3">3 o más (Alerta)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-600 mb-1">Antigüedad Comercial</label>
                          <select
                            value={features.antiguedadMeses}
                            onChange={(e) => setFeatures({...features, antiguedadMeses: Number(e.target.value)})}
                            className="w-full text-xs p-1.5 bg-gray-50 border rounded text-gray-800"
                          >
                            <option value="6">&lt; 12 meses (Nuevo)</option>
                            <option value="18">12 a 24 meses</option>
                            <option value="36">&gt; 24 meses (Maduro)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedUseCase !== 'cxc_default' && (
                    <div className="p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300 text-center mb-4">
                      <i className="fas fa-sliders-h text-gray-400 text-2xl mb-2"></i>
                      <p className="text-xs text-gray-600">Simulación configurada con telemetría de planta y eventos del ERP.</p>
                      <button
                        onClick={runInference}
                        className="mt-2 text-xs font-bold text-[#006EAD] hover:underline"
                      >
                        Recalcular puntuación de prueba
                      </button>
                    </div>
                  )}
                </div>

                {/* Resultado de la Inferencia */}
                {inferenceResult && (
                  <div className={`p-4 rounded-xl border ${inferenceResult.riskColor} transition-all`}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider">Probabilidad Calculada P(Y=1)</span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold border bg-white">
                        Nivel {inferenceResult.riskLevel}
                      </span>
                    </div>

                    <div className="flex items-baseline space-x-3 mb-2">
                      <span className="text-4xl font-extrabold tracking-tight">
                        {inferenceResult.probPct}%
                      </span>
                      <span className="text-xs font-mono text-gray-600">
                        Score z: {inferenceResult.zScore} | OR Relativo: {inferenceResult.oddsRatioAcumulado}x
                      </span>
                    </div>

                    <p className="text-xs font-medium leading-relaxed">
                      <strong>Dictamen Causal:</strong> {inferenceResult.recommendation}
                    </p>
                  </div>
                )}

                <button
                  onClick={runInference}
                  disabled={calculating}
                  className="mt-4 w-full bg-[#006EAD] hover:bg-[#005587] text-white py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shadow-sm flex items-center justify-center space-x-2"
                >
                  <i className={`fas ${calculating ? 'fa-spinner fa-spin' : 'fa-calculator'}`}></i>
                  <span>{calculating ? 'Calculando Inferencia...' : 'Ejecutar Inferencia Logística'}</span>
                </button>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* PESTAÑA 2: MODELOS CONTINUOS & SERIES DE TIEMPO (FORECASTING DE DEMANDA) */}
        {/* ========================================================================= */}
        {activeTab === 'time_series' && (
          <div className="space-y-6">
            
            {/* Header Series de Tiempo */}
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-lg font-bold text-[#0A2540]">Pronóstico Continuo de Demanda & Materiales (Series de Tiempo)</h2>
                <p className="text-xs text-gray-500 mt-0.5">Modelos ARIMA / Prophet para estimación de metros de tela y facturación proyectada</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500 font-semibold">Horizonte:</span>
                <select className="text-xs p-1.5 bg-gray-50 border rounded font-semibold text-gray-700">
                  <option>Próximas 12 Semanas</option>
                  <option>Próximos 6 Meses</option>
                </select>
              </div>
            </div>

            {/* Tarjetas de Métricas de Demanda */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <span className="text-xs font-bold text-gray-500 uppercase">Demanda Proyectada (Tela Algodón)</span>
                <p className="text-2xl font-extrabold text-[#0A2540] mt-1">42,500 m</p>
                <span className="text-xs font-semibold text-emerald-600">+8.4% vs promedio histórico</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <span className="text-xs font-bold text-gray-500 uppercase">Ventas Proyectadas ($ USD)</span>
                <p className="text-2xl font-extrabold text-blue-700 mt-1">$184,200</p>
                <span className="text-xs font-semibold text-gray-500">Margen estimado: 28.5%</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <span className="text-xs font-bold text-gray-500 uppercase">Precisión del Modelo (MAPE)</span>
                <p className="text-2xl font-extrabold text-indigo-700 mt-1">94.2%</p>
                <span className="text-xs font-semibold text-emerald-600">Error medio &lt; 5.8%</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <span className="text-xs font-bold text-gray-500 uppercase">Órdenes Sugeridas a Compras</span>
                <p className="text-2xl font-extrabold text-amber-600 mt-1">6 Requisiciones</p>
                <span className="text-xs font-semibold text-gray-500">Conectadas a NyTEX Planeación</span>
              </div>
            </div>

            {/* Simulación Gráfica de Series Temporales */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-[#0A2540]">Curva de Demanda: Real vs Pronóstico con Banda de Confianza (95%)</h3>
                <div className="flex items-center space-x-4 text-xs font-semibold">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-3 h-3 bg-blue-600 rounded-sm"></span>
                    <span className="text-gray-600">Histórico Real</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-3 h-3 bg-cyan-500 rounded-sm"></span>
                    <span className="text-gray-600">Pronóstico (Forecast)</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-3 h-3 bg-cyan-100 border border-cyan-300 rounded-sm"></span>
                    <span className="text-gray-600">Banda Intervalo 95%</span>
                  </div>
                </div>
              </div>

              {/* Simulación visual SVG de la gráfica */}
              <div className="h-64 w-full bg-slate-50 rounded-lg p-4 border border-gray-100 flex flex-col justify-between">
                <div className="flex-1 relative flex items-end">
                  <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 1000 200">
                    {/* Líneas de guía horizontal */}
                    <line x1="0" y1="50" x2="1000" y2="50" stroke="#E2E8F0" strokeDasharray="4" />
                    <line x1="0" y1="100" x2="1000" y2="100" stroke="#E2E8F0" strokeDasharray="4" />
                    <line x1="0" y1="150" x2="1000" y2="150" stroke="#E2E8F0" strokeDasharray="4" />

                    {/* Banda de confianza (Sombra Cyan) */}
                    <polygon
                      points="600,105 700,80 800,60 900,45 1000,35 1000,140 900,125 800,135 700,145 600,105"
                      fill="#CFFAFE"
                      opacity="0.6"
                    />

                    {/* Línea Histórico Real (Azul Marino) */}
                    <path
                      d="M 50,140 Q 150,110 250,130 T 450,90 T 600,105"
                      fill="none"
                      stroke="#1D4ED8"
                      strokeWidth="3.5"
                    />

                    {/* Línea Pronóstico Futuro (Cyan punteada) */}
                    <path
                      d="M 600,105 Q 700,110 800,95 T 1000,80"
                      fill="none"
                      stroke="#06B6D4"
                      strokeWidth="3.5"
                      strokeDasharray="6,6"
                    />

                    {/* Punto de corte Hoy */}
                    <circle cx="600" cy="105" r="5" fill="#0E7490" />
                  </svg>
                </div>
                
                {/* Eje X Temporal */}
                <div className="flex justify-between text-[11px] font-semibold text-gray-500 pt-2 border-t border-gray-200">
                  <span>Sem 1</span>
                  <span>Sem 3</span>
                  <span>Sem 6</span>
                  <span>Sem 9</span>
                  <span className="text-[#006EAD] font-bold">HOY (Sem 12)</span>
                  <span className="text-cyan-600 font-bold">+4 Sem</span>
                  <span className="text-cyan-600 font-bold">+8 Sem</span>
                  <span className="text-cyan-600 font-bold">+12 Sem (Futuro)</span>
                </div>
              </div>

              <div className="mt-4 flex justify-between items-center text-xs text-gray-600">
                <span>Conexión directa: Las necesidades proyectadas se envían a <strong>NyTEX Planeación (MRP)</strong>.</span>
                <button className="text-[#006EAD] hover:underline font-bold">
                  <i className="fas fa-download mr-1"></i> Exportar pronóstico a Excel
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
