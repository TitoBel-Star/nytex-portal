import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function BiCubeView() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('Todos');
  const [selectedFamily, setSelectedFamily] = useState('Todas');
  const [selectedRegion, setSelectedRegion] = useState('Todas');
  const [selectedSegment, setSelectedSegment] = useState('Todos');

  useEffect(() => {
    fetchCubeData();
  }, []);

  const fetchCubeData = async () => {
    try {
      const res = await fetch('/api/fase7/bi/cube');
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error('Error fetching BI cube data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-cyan-500 border-t-transparent mb-4"></div>
          <p className="text-gray-300 font-semibold">Cargando Cubo Multidimensional OLAP NyTEX...</p>
        </div>
      </div>
    );
  }

  const { dimensions, cubeData = [], kpis = {} } = data || {};

  // Filtrado multidimensional (Slice & Dice)
  const filteredCells = cubeData.filter(cell => {
    if (selectedPeriod !== 'Todos' && cell.period !== selectedPeriod) return false;
    if (selectedFamily !== 'Todas' && cell.family !== selectedFamily) return false;
    if (selectedRegion !== 'Todas' && cell.region !== selectedRegion) return false;
    if (selectedSegment !== 'Todos' && cell.segment !== selectedSegment) return false;
    return true;
  });

  const filteredRevenue = filteredCells.reduce((acc, c) => acc + c.revenue, 0);
  const filteredCost = filteredCells.reduce((acc, c) => acc + c.cost, 0);
  const filteredMargin = filteredRevenue - filteredCost;
  const filteredMarginPct = filteredRevenue > 0 ? ((filteredMargin / filteredRevenue) * 100).toFixed(1) : 0;
  const filteredVolumeKg = filteredCells.reduce((acc, c) => acc + c.volumeKg, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Cabecera y Navegación */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
          <div>
            <div className="flex items-center gap-3">
              <span className="bg-cyan-500/20 text-cyan-400 text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider border border-cyan-500/30">
                Módulo [20] • Business Intelligence
              </span>
              <span className="text-xs text-slate-400">Motor OLAP HyperCube v4.2</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white mt-1">
              Cubo Multidimensional de Inteligencia de Negocios
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Análisis *Slice & Dice* transversal cruzando Líneas de Tejido, Canales de Venta, Zonas Geográficas y Trimestres.
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
              Menú Principal
            </Link>
          </div>
        </div>

        {/* Barra de Filtros OLAP (Slice & Dice Controls) */}
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-lg backdrop-blur">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
              <span>🎛️</span> Dimensiones de Corte (Slice & Dice)
            </h3>
            {(selectedPeriod !== 'Todos' || selectedFamily !== 'Todas' || selectedRegion !== 'Todas' || selectedSegment !== 'Todos') && (
              <button 
                onClick={() => {
                  setSelectedPeriod('Todos');
                  setSelectedFamily('Todas');
                  setSelectedRegion('Todas');
                  setSelectedSegment('Todos');
                }}
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold underline"
              >
                Limpiar filtros
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Dimensión: Tiempo */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Dimensión: Periodo</label>
              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="Todos">Todos los Periodos</option>
                {dimensions?.periods?.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            {/* Dimensión: Familia de Producto */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Dimensión: Familia de Tejido</label>
              <select 
                value={selectedFamily}
                onChange={(e) => setSelectedFamily(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="Todas">Todas las Familias</option>
                {dimensions?.productFamilies?.map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            {/* Dimensión: Región */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Dimensión: Región Geográfica</label>
              <select 
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="Todas">Todas las Regiones</option>
                {dimensions?.regions?.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            {/* Dimensión: Segmento de Cliente */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Dimensión: Segmento Comercial</label>
              <select 
                value={selectedSegment}
                onChange={(e) => setSelectedSegment(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="Todos">Todos los Segmentos</option>
                {dimensions?.customerSegments?.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* KPIs Agregados del Corte */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <span className="text-xs font-semibold text-slate-400 uppercase">Ingresos Facturados</span>
            <div className="text-2xl font-black text-cyan-400 mt-1">
              ${filteredRevenue.toLocaleString()} <span className="text-xs text-slate-500">USD</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Suma agregada del corte actual</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <span className="text-xs font-semibold text-slate-400 uppercase">Costo de Manufactura</span>
            <div className="text-2xl font-black text-rose-400 mt-1">
              ${filteredCost.toLocaleString()} <span className="text-xs text-slate-500">USD</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Materia prima, hilados e insumos</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <span className="text-xs font-semibold text-slate-400 uppercase">Margen Bruto</span>
            <div className="text-2xl font-black text-emerald-400 mt-1">
              ${filteredMargin.toLocaleString()} <span className="text-xs font-bold text-emerald-500">({filteredMarginPct}%)</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Contribución neta a costos fijos</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <span className="text-xs font-semibold text-slate-400 uppercase">Volumen Textil</span>
            <div className="text-2xl font-black text-purple-400 mt-1">
              {filteredVolumeKg.toLocaleString()} <span className="text-xs text-slate-500">kg tejido</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Rendimiento en rollos producidos</p>
          </div>
        </div>

        {/* Tabla Detallada del Cubo OLAP */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-5 border-b border-slate-800 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-white text-base">Matriz de Datos del Cubo OLAP ({filteredCells.length} celdas)</h3>
              <p className="text-xs text-slate-400">Desglose granular por combinación dimensional</p>
            </div>
            <span className="text-xs text-cyan-400 font-bold bg-cyan-950/60 border border-cyan-800 px-3 py-1 rounded-full">
              Motor Activo
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Periodo</th>
                  <th className="py-3 px-4">Familia de Tejido</th>
                  <th className="py-3 px-4">Región</th>
                  <th className="py-3 px-4">Segmento Cliente</th>
                  <th className="py-3 px-4 text-right">Volumen (kg)</th>
                  <th className="py-3 px-4 text-right">Venta (USD)</th>
                  <th className="py-3 px-4 text-right">Costo (USD)</th>
                  <th className="py-3 px-4 text-right">Margen (%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono">
                {filteredCells.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 px-4 font-sans font-semibold text-cyan-300">{row.period}</td>
                    <td className="py-3 px-4 font-sans font-medium text-white">{row.family}</td>
                    <td className="py-3 px-4 font-sans text-slate-300">{row.region}</td>
                    <td className="py-3 px-4 font-sans text-slate-400">{row.segment}</td>
                    <td className="py-3 px-4 text-right text-purple-300">{row.volumeKg.toLocaleString()} kg</td>
                    <td className="py-3 px-4 text-right font-bold text-white">${row.revenue.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right text-rose-400">${row.cost.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right">
                      <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                        {row.marginPct}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
