import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function BigDataView() {
  const [telemetry, setTelemetry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isIngesting, setIsIngesting] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const fetchTelemetry = async () => {
    try {
      const res = await fetch('/api/fase7/bigdata/telemetry');
      const json = await res.json();
      setTelemetry(json);
    } catch (err) {
      console.error('Error fetching Big Data telemetry:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 3500); // Polling suave cada 3.5 segundos
    return () => clearInterval(interval);
  }, []);

  const handleIngestBatch = async () => {
    setIsIngesting(true);
    try {
      const res = await fetch('/api/fase7/bigdata/ingest-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ batchSize: 10000 })
      });
      const json = await res.json();
      if (json.success) {
        setToastMessage(`✓ ${json.message}`);
        setTimeout(() => setToastMessage(null), 4000);
        fetchTelemetry();
      }
    } catch (err) {
      console.error('Error ingesting batch:', err);
    } finally {
      setIsIngesting(false);
    }
  };

  if (loading && !telemetry) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-emerald-500 border-t-transparent mb-4"></div>
          <p className="text-gray-300 font-semibold">Conectando al Data Lake & Broker MQTT Kafka...</p>
        </div>
      </div>
    );
  }

  const { lakeStats = {}, machines = [], recentAlerts = [] } = telemetry || {};

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Notificación Toast */}
        {toastMessage && (
          <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl font-bold text-sm animate-bounce border border-emerald-400">
            {toastMessage}
          </div>
        )}

        {/* Cabecera */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
          <div>
            <div className="flex items-center gap-3">
              <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider border border-emerald-500/30">
                Módulo [21] • Big Data
              </span>
              <span className="text-xs text-slate-400">Data Lakehouse Parquet • Kafka Stream</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white mt-1">
              Data Lake Industrial & Telemetría IoT en Tiempo Real
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Ingesta masiva continua de sensores de tejeduría circular y autoclaves de tintorería a alta frecuencia.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleIngestBatch}
              disabled={isIngesting}
              className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold px-4 py-2 rounded-xl text-sm transition-all shadow-lg shadow-emerald-900/40 flex items-center gap-2"
            >
              <span>⚡</span> {isIngesting ? 'Ingiriendo Lote...' : 'Ingestar +10,000 Pulsos'}
            </button>
            <Link 
              to="/app/circuito-gobernanza" 
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl text-sm font-semibold transition-all border border-slate-700"
            >
              Circuito 7 ➔
            </Link>
          </div>
        </div>

        {/* Métricas Principales del Data Lake */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-2 h-full bg-emerald-500"></div>
            <span className="text-xs font-semibold text-slate-400 uppercase">Eventos IoT Almacenados</span>
            <div className="text-2xl font-black text-white mt-1 font-mono">
              {lakeStats.totalIngestedRecords?.toLocaleString()}
            </div>
            <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-bold">
              <span className="animate-pulse">●</span> Registro inmutable de telemetría
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-2 h-full bg-cyan-500"></div>
            <span className="text-xs font-semibold text-slate-400 uppercase">Volumen en Data Lake</span>
            <div className="text-2xl font-black text-cyan-400 mt-1 font-mono">
              {lakeStats.dataLakeSizeGb} <span className="text-xs text-slate-500">GB</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Formato columnar Delta / Parquet</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-2 h-full bg-indigo-500"></div>
            <span className="text-xs font-semibold text-slate-400 uppercase">Tasa de Ingesta en Vivo</span>
            <div className="text-2xl font-black text-indigo-400 mt-1 font-mono">
              {lakeStats.ingestionRatePerSec?.toLocaleString()} <span className="text-xs text-slate-500">ev/seg</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Pipeline: MQTT Broker ➔ Kafka ➔ S3</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-2 h-full bg-amber-500"></div>
            <span className="text-xs font-semibold text-slate-400 uppercase">Sensores de Planta Activos</span>
            <div className="text-2xl font-black text-amber-400 mt-1 font-mono">
              {lakeStats.activeIoTSensors} <span className="text-xs text-slate-500">nodos</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Monitoreo térmico, vibración y tensión</p>
          </div>
        </div>

        {/* Grid de Máquinas Industriales en Tiempo Real */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-white text-lg flex items-center gap-2">
              <span>🏭</span> Telemetría de Maquinaria en Piso de Producción
            </h3>
            <span className="text-xs text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800 px-3 py-1 rounded-full flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              Transmisión en Vivo (3.5s refresh)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {machines.map(m => {
              const isWarning = m.status.includes('Advertencia');
              return (
                <div 
                  key={m.id} 
                  className={`bg-slate-900 rounded-2xl border p-5 transition-all shadow-md ${
                    isWarning ? 'border-amber-500/70 bg-amber-950/20' : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider block">
                        {m.id}
                      </span>
                      <h4 className="font-extrabold text-white text-sm mt-0.5">{m.name}</h4>
                      <span className="text-xs text-slate-400">{m.type}</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      isWarning 
                        ? 'bg-amber-900/60 text-amber-300 border-amber-600 animate-pulse' 
                        : 'bg-emerald-950 text-emerald-400 border-emerald-800'
                    }`}>
                      {m.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-800/80 font-mono text-xs">
                    {m.rpm > 0 && (
                      <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-500 uppercase block font-sans">Velocidad</span>
                        <strong className="text-white text-sm">{m.rpm}</strong> <span className="text-[10px] text-slate-400">RPM</span>
                      </div>
                    )}
                    <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-500 uppercase block font-sans">Temperatura</span>
                      <strong className={`text-sm ${m.tempC > 78 ? 'text-amber-400 font-bold' : 'text-white'}`}>{m.tempC}°C</strong>
                    </div>
                    {m.tensionCn > 0 && (
                      <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-500 uppercase block font-sans">Tensión Trama</span>
                        <strong className={`text-sm ${m.tensionCn > 20 ? 'text-rose-400 font-bold' : 'text-cyan-300'}`}>{m.tensionCn}</strong> <span className="text-[10px] text-slate-400">cN</span>
                      </div>
                    )}
                    <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-500 uppercase block font-sans">Vibración RMS</span>
                      <strong className="text-purple-300 text-sm">{m.vibrationMmS}</strong> <span className="text-[10px] text-slate-400">mm/s</span>
                    </div>
                    {m.bathPressureBar !== undefined && (
                      <>
                        <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                          <span className="text-[10px] text-slate-500 uppercase block font-sans">Presión Baño</span>
                          <strong className="text-cyan-300 text-sm">{m.bathPressureBar}</strong> <span className="text-[10px] text-slate-400">bar</span>
                        </div>
                        <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                          <span className="text-[10px] text-slate-500 uppercase block font-sans">pH Baño</span>
                          <strong className="text-emerald-400 text-sm">{m.bathPh}</strong>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Alertas de Anomalía Detectadas */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <h3 className="font-bold text-white text-base mb-3 flex items-center gap-2">
            <span>🚨</span> Registro de Detección de Anomalías (Eventos Recientes)
          </h3>
          <div className="space-y-2">
            {recentAlerts.map(alt => (
              <div key={alt.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-950/70 border border-slate-800 p-3 rounded-xl gap-2">
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                    alt.severity === 'Warning' ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-blue-950 text-blue-300 border border-blue-800'
                  }`}>
                    {alt.severity}
                  </span>
                  <div>
                    <strong className="text-white text-xs font-mono">{alt.machine}: </strong>
                    <span className="text-xs text-slate-300">{alt.type} ({alt.value})</span>
                  </div>
                </div>
                <span className="text-[11px] text-slate-500 font-mono">{alt.timestamp}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
