import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function DataMiningView() {
  const [activeTab, setActiveTab] = useState('clustering');
  const [clusterData, setClusterData] = useState(null);
  const [rulesData, setRulesData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMiningData();
  }, []);

  const fetchMiningData = async () => {
    try {
      const [resClust, resRules] = await Promise.all([
        fetch('/api/fase7/datamining/clusters'),
        fetch('/api/fase7/datamining/rules')
      ]);
      const jsonClust = await resClust.json();
      const jsonRules = await resRules.json();
      setClusterData(jsonClust);
      setRulesData(jsonRules);
    } catch (err) {
      console.error('Error fetching Data Mining data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-purple-500 border-t-transparent mb-4"></div>
          <p className="text-gray-300 font-semibold">Ejecutando Modelos de Minería de Datos (K-Means & Apriori)...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Cabecera */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
          <div>
            <div className="flex items-center gap-3">
              <span className="bg-purple-500/20 text-purple-400 text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider border border-purple-500/30">
                Módulo [22] • Minería de Datos
              </span>
              <span className="text-xs text-slate-400">Machine Learning no Supervisado</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white mt-1">
              Descubrimiento de Patrones & Algoritmos de Minería
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Segmentación algorítmica de clientes mediante K-Means RFM y reglas de asociación de mercado con Apriori.
            </p>
          </div>

          <div className="flex gap-3">
            <Link 
              to="/app/circuito-gobernanza" 
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-md shadow-indigo-900/40"
            >
              Circuito 7 Gobernanza ➔
            </Link>
            <Link 
              to="/portal" 
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl text-sm font-semibold transition-all border border-slate-700"
            >
              Portal
            </Link>
          </div>
        </div>

        {/* Selector de Pestañas */}
        <div className="flex gap-3 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('clustering')}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
              activeTab === 'clustering'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <span>🎯</span> Clustering K-Means (Segmentación RFM)
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
              activeTab === 'rules'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <span>🛒</span> Reglas de Asociación Apriori (Canasta Textil)
          </button>
        </div>

        {/* PESTAÑA 1: CLUSTERING K-MEANS */}
        {activeTab === 'clustering' && clusterData && (
          <div className="space-y-6">
            
            {/* Banner de Calidad del Modelo */}
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider block">
                  {clusterData.model}
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  Vector de Características: {clusterData.metric}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Se evaluaron {clusterData.totalAnalyzedPartners} socios comerciales clasificados en 4 centroides óptimos.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Coeficiente Silhouette</span>
                  <strong className="text-2xl font-black text-emerald-400 font-mono">
                    {clusterData.silhouetteScore}
                  </strong>
                </div>
                <div className="px-3 py-1 bg-emerald-950 border border-emerald-800 rounded-xl text-xs font-bold text-emerald-300">
                  Separación Excelente
                </div>
              </div>
            </div>

            {/* Grid de Clusters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {clusterData.clusters?.map(cl => (
                <div 
                  key={cl.id} 
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-md relative overflow-hidden"
                >
                  <div className="w-full h-1.5 absolute top-0 left-0" style={{ backgroundColor: cl.color }}></div>
                  <div>
                    <span className="text-xs font-bold font-mono px-2 py-0.5 rounded" style={{ backgroundColor: `${cl.color}20`, color: cl.color }}>
                      {cl.count} Clientes
                    </span>
                    <h4 className="font-extrabold text-white text-base mt-2">{cl.name}</h4>
                    
                    <div className="mt-4 space-y-1.5 text-xs font-mono text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                      <div>Recencia media: <strong className="text-white">{cl.avgRecencyDays} días</strong></div>
                      <div>Frecuencia media: <strong className="text-white">{cl.avgFrequencyOrders} pedidos</strong></div>
                      <div>Monto prom: <strong className="text-white">${cl.avgMonetaryAmount.toLocaleString()}</strong></div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Estrategia Comercial:</span>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">{cl.strategy}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Mapa de Dispersión Visual (Scatter Plot Simplificado) */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h3 className="font-bold text-white text-base mb-1">
                Mapa de Posicionamiento RFM de Cuentas Clave
              </h3>
              <p className="text-xs text-slate-400 mb-6">
                Eje Horizontal: Recencia (días desde último pedido) • Eje Vertical: Valor Monetario ($ USD)
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {clusterData.scatterPoints?.map((pt, idx) => {
                  const clusterObj = clusterData.clusters.find(c => c.id === pt.cluster) || { color: '#888' };
                  return (
                    <div 
                      key={idx} 
                      className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl flex items-center justify-between hover:border-slate-700 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <span 
                          className="w-3.5 h-3.5 rounded-full flex-shrink-0" 
                          style={{ backgroundColor: clusterObj.color }}
                        ></span>
                        <div>
                          <strong className="text-white text-xs block">{pt.name}</strong>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {pt.recency}d recencia • {pt.frequency} pedidos
                          </span>
                        </div>
                      </div>
                      <div className="text-right font-mono">
                        <span className="text-xs font-bold text-emerald-400">${pt.monetary.toLocaleString()}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* PESTAÑA 2: REGLAS DE ASOCIACIÓN APRIORI */}
        {activeTab === 'rules' && rulesData && (
          <div className="space-y-6">
            
            {/* Resumen del Algoritmo Apriori */}
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider block">
                  Algoritmo Apriori • Canasta Textil Industrial
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  Reglas de Afinidad de Materiales & Pedidos Combinados
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Umbrales mínimos: Soporte &gt;= {(rulesData.minSupport * 100).toFixed(0)}% • Confianza &gt;= {(rulesData.minConfidence * 100).toFixed(0)}% • Transacciones: {rulesData.totalTransactionsAnalyzed}
                </p>
              </div>
              <div className="px-3 py-1.5 bg-purple-950 border border-purple-800 rounded-xl text-xs font-bold text-purple-300">
                Lift Máximo: 3.28x
              </div>
            </div>

            {/* Tabla de Reglas */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Regla</th>
                      <th className="py-3 px-4">Antecedente (Compra A)</th>
                      <th className="py-3 px-4">Consecuente (Compra B)</th>
                      <th className="py-3 px-4 text-center">Soporte</th>
                      <th className="py-3 px-4 text-center">Confianza</th>
                      <th className="py-3 px-4 text-center">Lift</th>
                      <th className="py-3 px-4">Implicación Operativa / S&OP</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {rulesData.rules?.map(r => (
                      <tr key={r.id} className="hover:bg-slate-800/50 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-purple-400">{r.id}</td>
                        <td className="py-3 px-4 font-semibold text-white">
                          {r.antecedent.map((a, i) => (
                            <span key={i} className="inline-block bg-slate-800 px-2 py-0.5 rounded mr-1 text-[11px]">
                              {a}
                            </span>
                          ))}
                        </td>
                        <td className="py-3 px-4 font-semibold text-cyan-300">
                          {r.consequent.map((c, i) => (
                            <span key={i} className="inline-block bg-cyan-950/70 border border-cyan-800 px-2 py-0.5 rounded mr-1 text-[11px]">
                              ➔ {c}
                            </span>
                          ))}
                        </td>
                        <td className="py-3 px-4 text-center font-mono font-bold text-slate-300">
                          {(r.support * 100).toFixed(0)}%
                        </td>
                        <td className="py-3 px-4 text-center font-mono font-bold text-emerald-400">
                          {(r.confidence * 100).toFixed(0)}%
                        </td>
                        <td className="py-3 px-4 text-center font-mono font-black text-amber-400">
                          {r.lift}x
                        </td>
                        <td className="py-3 px-4 text-slate-300 text-[11px] leading-relaxed">
                          {r.insight}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
