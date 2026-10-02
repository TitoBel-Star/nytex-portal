import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function IaAssistantView() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState([
    {
      role: 'assistant',
      category: 'Diagnóstico Ejecutivo Global',
      text: 'Bienvenido al Copilot de Inteligencia Artificial de NyTEX. He sincronizado la base de datos viva del ERP (Ventas, WMS, Telares, CxC y Tesorería). ¿Qué consulta estratégica o diagnóstico de planta desea realizar?',
      recommendations: [
        'Auditar inventario de materia prima previo a órdenes de tejeduría.',
        'Evaluar la probabilidad de mora en la cartera de clientes con crédito.',
        'Revisar la utilización de capacidad mensual de los telares circulares.'
      ],
      keyMetrics: [
        { label: 'Estatus del Motor', value: 'Conectado a SQLite' },
        { label: 'Módulos Auditados', value: '26 Aplicaciones' },
        { label: 'Tiempo de Respuesta', value: '< 200 ms' }
      ]
    }
  ]);

  const quickPrompts = [
    { label: '📊 Diagnóstico General & Tesorería', prompt: '¿Cuál es el diagnóstico general del negocio y nuestra posición de liquidez en bancos?' },
    { label: '🧵 Inventario & Compras de Hilatura', prompt: '¿Cómo estamos en inventario de hilaturas y qué compras debemos hacer para producción?' },
    { label: '⚠️ Riesgo de Mora en CxC', prompt: '¿Qué clientes en CxC presentan mayor probabilidad de mora según los modelos predictivos?' },
    { label: '⚙️ Capacidad Fabril de Telares', prompt: '¿Cuál es la utilización actual de los telares Mayer & Cie y nuestra capacidad fabril?' }
  ];

  const handleSendPrompt = async (textToSend) => {
    const q = textToSend || prompt;
    if (!q.trim()) return;

    const userMessage = { role: 'user', text: q };
    setConversation(prev => [...prev, userMessage]);
    setPrompt('');
    setLoading(true);

    try {
      const res = await fetch('/api/fase6/ia/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: q })
      });
      if (res.ok) {
        const json = await res.json();
        setConversation(prev => [
          ...prev,
          {
            role: 'assistant',
            category: json.category,
            text: json.reply,
            recommendations: json.recommendations,
            keyMetrics: json.keyMetrics
          }
        ]);
      }
    } catch (err) {
      console.error('Error en consulta de IA:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#f8fafc] overflow-hidden w-full">
      {/* Top Header */}
      <div className="flex flex-col border-b border-gray-200 px-6 py-4 bg-white sticky top-0 z-10 shrink-0 shadow-sm w-full">
        <div className="flex justify-between items-center">
          <div className="flex items-center text-lg text-gray-700">
            <span className="cursor-pointer hover:underline text-[#006EAD]" onClick={() => navigate('/portal')}>Portal</span>
            <span className="mx-2 text-gray-400">/</span>
            <span className="font-bold text-[#0A2540] flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs bg-rose-100 text-rose-900 font-bold rounded-full">[23] IA</span>
              Copilot Cognitivo de Inteligencia Artificial Textil
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => navigate('/app/predictivos')}
              className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm"
            >
              [24] Predictivos
            </button>
            <button 
              onClick={() => navigate('/app/planeacion')}
              className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm"
            >
              [25] Planeación S&OP
            </button>
            <button 
              onClick={() => navigate('/app/dashboards')}
              className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm"
            >
              [19] Dashboards
            </button>
            <button 
              onClick={() => navigate('/app/circuito-ia-planeacion')}
              className="bg-[#0A2540] hover:bg-[#1E3A8A] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-all"
            >
              Monitor Circuito 6 ➔
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 overflow-auto p-6 space-y-6 max-w-5xl mx-auto w-full">

        {/* Quick Prompts */}
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSendPrompt(qp.prompt)}
              className="bg-white hover:bg-rose-50 border border-gray-200 hover:border-rose-300 text-gray-800 text-xs px-3.5 py-2 rounded-xl shadow-sm transition-all font-semibold flex items-center gap-1.5"
            >
              {qp.label}
            </button>
          ))}
        </div>

        {/* Historial de Respuestas / Chat */}
        <div className="space-y-4">
          {conversation.map((msg, index) => (
            <div 
              key={index} 
              className={`p-5 rounded-2xl border transition-all ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white ml-auto max-w-2xl border-blue-700 shadow-md' 
                  : 'bg-white text-gray-900 border-gray-200 shadow-sm space-y-3'
              }`}
            >
              {msg.role === 'assistant' ? (
                <>
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="text-xs font-bold text-rose-700 uppercase flex items-center gap-1.5">
                      <span>🤖</span> NyTEX Copilot • {msg.category}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">Motor de Inferencia LLM + ERP</span>
                  </div>

                  <p className="text-xs leading-relaxed text-gray-800">
                    {msg.text}
                  </p>

                  {/* Métricas detectadas */}
                  {msg.keyMetrics && msg.keyMetrics.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 pt-2">
                      {msg.keyMetrics.map((km, i) => (
                        <div key={i} className="bg-gray-50 p-2.5 rounded-xl border border-gray-100 text-center">
                          <span className="text-[10px] text-gray-500 uppercase font-bold block">{km.label}</span>
                          <span className="font-mono font-bold text-xs text-gray-900 mt-0.5 block">{km.value}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Recomendaciones */}
                  {msg.recommendations && msg.recommendations.length > 0 && (
                    <div className="bg-rose-50/50 p-3 rounded-xl border border-rose-100 text-xs space-y-1">
                      <span className="font-bold text-rose-900 block text-[11px] uppercase">
                        Acciones Recomendadas por la IA:
                      </span>
                      <ul className="list-disc list-inside space-y-0.5 text-gray-700 text-[11px]">
                        {msg.recommendations.map((rec, rIdx) => (
                          <li key={rIdx}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-xs font-medium">
                  {msg.text}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="p-4 bg-white rounded-2xl border border-gray-200 shadow-sm flex items-center gap-3 text-xs text-gray-500">
              <span className="animate-spin text-lg">⚙️</span> Analizando datos transaccionales del ERP con IA...
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="sticky bottom-0 bg-[#f8fafc] pt-2 pb-4">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSendPrompt(); }}
            className="flex gap-2"
          >
            <input 
              type="text" 
              placeholder="Pregunte a la IA sobre inventarios, cobranza en CxC, capacidad de telares o pronóstico de ventas..."
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              className="flex-1 bg-white border border-gray-300 rounded-xl px-4 py-3 text-xs shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
            <button 
              type="submit"
              disabled={loading || !prompt.trim()}
              className="bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl text-xs font-bold shadow transition-all flex items-center gap-1.5"
            >
              <span>Consultar</span> ➔
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
