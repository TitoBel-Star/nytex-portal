import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function BIyReportes() {
  const [reportList, setReportList] = useState([]);
  const [selectedType, setSelectedType] = useState('pnl');
  const [selectedPeriod, setSelectedPeriod] = useState('2026-Q3');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchReportList();
    fetchReport(selectedType, selectedPeriod);
  }, []);

  const fetchReportList = async () => {
    try {
      const res = await fetch('/api/fase7/reports/list');
      const json = await res.json();
      setReportList(json);
    } catch (err) {
      console.error('Error fetching report list:', err);
    }
  };

  const fetchReport = async (type, period) => {
    setGenerating(true);
    try {
      const res = await fetch(`/api/fase7/reports/generate?reportType=${type}&period=${period}`);
      const json = await res.json();
      setReportData(json);
    } catch (err) {
      console.error('Error generating report:', err);
    } finally {
      setGenerating(false);
      setLoading(false);
    }
  };

  const handleSelectReport = (type) => {
    setSelectedType(type);
    fetchReport(type, selectedPeriod);
  };

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    fetchReport(selectedType, period);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportCsv = () => {
    if (!reportData || !reportData.rows) return;
    let csv = `${reportData.title} - ${reportData.period}\n\n`;
    csv += (reportData.headers || []).join(',') + '\n';
    reportData.rows.forEach(r => {
      const vals = Object.values(r).map(v => typeof v === 'string' && v.includes(',') ? `"${v}"` : v);
      csv += vals.join(',') + '\n';
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${selectedType}_${selectedPeriod}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Cabecera */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-blue-100 text-blue-700 text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                Módulo [18] • BI y Reportes
              </span>
              <span className="text-xs text-slate-500">Motor de Emisión NIF, SAT e IFRS</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 mt-1">
              Centro de Reportes Ejecutivos & Fiscales
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Generación en tiempo real de estados financieros, balanzas de comprobación y reportes de eficiencia fabril auditados.
            </p>
          </div>

          <div className="flex gap-3">
            <Link 
              to="/app/bi" 
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm"
            >
              Ver Cubo OLAP [20] ➔
            </Link>
            <Link 
              to="/portal" 
              className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
            >
              Portal
            </Link>
          </div>
        </div>

        {/* Panel Superior: Catálogo de Reportes & Filtros */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Selector de Tipo de Reporte */}
          <div className="lg:col-span-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Seleccione Plantilla Institucional de Reporte
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {reportList.map(rep => (
                <button
                  key={rep.id}
                  onClick={() => handleSelectReport(rep.id)}
                  className={`p-4 rounded-xl text-left border transition-all ${
                    selectedType === rep.id
                      ? 'border-blue-600 bg-blue-50/70 shadow-sm ring-2 ring-blue-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600">
                      {rep.code}
                    </span>
                    <span className="text-[10px] font-bold text-blue-600">{rep.category}</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 leading-snug">{rep.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{rep.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Opciones de Salida y Periodo */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Parámetros de Generación
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Ejercicio / Periodo:</label>
                  <select 
                    value={selectedPeriod}
                    onChange={(e) => handlePeriodChange(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm text-slate-800 font-semibold focus:outline-none focus:border-blue-500"
                  >
                    <option value="2026-Q1">2026 - Primer Trimestre (Q1)</option>
                    <option value="2026-Q2">2026 - Segundo Trimestre (Q2)</option>
                    <option value="2026-Q3">2026 - Tercer Trimestre (Q3 - Actual)</option>
                    <option value="2026-Q4">2026 - Cuarto Trimestre (Q4 Proy.)</option>
                  </select>
                </div>
                <div className="text-xs text-slate-500">
                  Moneda: <strong className="text-slate-800">USD (Dólares Americanos)</strong>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
              <button 
                onClick={handleExportCsv}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <span>📊</span> Exportar a Excel / CSV
              </button>
              <button 
                onClick={handlePrint}
                className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <span>🖨️</span> Imprimir / Guardar PDF
              </button>
            </div>
          </div>
        </div>

        {/* Hoja de Reporte Imprimible / Vista Previa */}
        {loading || generating ? (
          <div className="bg-white p-16 rounded-2xl border border-slate-200 text-center shadow-sm">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent mb-3"></div>
            <p className="text-sm font-semibold text-slate-600">Compilando datos del libro mayor y módulos operativos...</p>
          </div>
        ) : reportData ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-8 md:p-12 space-y-8 font-sans">
            
            {/* Membrete Oficial */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 border-b-2 border-slate-900 gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <div className="bg-slate-950 text-white font-black text-xl px-3 py-1 rounded">NyTEX</div>
                  <div>
                    <h2 className="font-extrabold text-base text-slate-900">NyTEX Textil de México S.A. de C.V.</h2>
                    <p className="text-xs text-slate-500">RFC: NTM180612TX4 • Régimen 601 General de Ley Personas Morales</p>
                  </div>
                </div>
              </div>
              <div className="text-left md:text-right">
                <span className="inline-block text-xs font-mono font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded border border-slate-300">
                  {reportData.code}
                </span>
                <div className="text-xs text-slate-500 mt-1">Periodo Evaluado: <strong>{reportData.period}</strong></div>
              </div>
            </div>

            {/* Título del Reporte */}
            <div className="text-center">
              <h3 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tight">
                {reportData.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1 font-mono">
                Cifras expresadas en Dólares (USD) • Nivel de Consolidación Corporativo
              </p>
            </div>

            {/* Tabla de Datos del Reporte */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-y border-slate-300 text-slate-700 text-xs uppercase font-bold tracking-wider">
                    {reportData.headers?.map((h, i) => (
                      <th key={i} className={`py-3 px-4 ${i > 0 ? 'text-right' : ''}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {/* Caso P&L */}
                  {selectedType === 'pnl' && reportData.rows?.map((row, idx) => (
                    <tr 
                      key={idx} 
                      className={`${
                        row.isFinalTotal 
                          ? 'bg-blue-50 font-black text-blue-900 border-t-2 border-b-2 border-slate-900 text-base' 
                          : row.isTotal 
                            ? 'bg-slate-50 font-bold text-slate-900 border-t border-slate-300' 
                            : 'hover:bg-slate-50/50'
                      }`}
                    >
                      <td className="py-3 px-4 font-medium">{row.concept}</td>
                      <td className={`py-3 px-4 text-right font-mono ${row.amount < 0 ? 'text-rose-600' : 'text-slate-900'}`}>
                        ${Math.abs(row.amount).toLocaleString()} {row.amount < 0 ? 'CR' : 'DB'}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-xs text-slate-600">{row.pct}</td>
                    </tr>
                  ))}

                  {/* Caso Balanza de Comprobación */}
                  {selectedType === 'trial_balance' && reportData.rows?.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono font-bold text-blue-700">{row.code}</td>
                      <td className="py-3 px-4 font-medium text-slate-900">{row.name}</td>
                      <td className="py-3 px-4 text-right font-mono text-slate-600">${row.init.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right font-mono text-emerald-700 font-semibold">${row.debit.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right font-mono text-rose-700 font-semibold">${row.credit.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">${row.final.toLocaleString()}</td>
                    </tr>
                  ))}

                  {/* Caso OEE */}
                  {selectedType === 'oee' && reportData.rows?.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-bold text-slate-900">{row.name}</td>
                      <td className="py-3 px-4 text-right font-mono text-slate-700">{row.disp}</td>
                      <td className="py-3 px-4 text-right font-mono text-slate-700">{row.rend}</td>
                      <td className="py-3 px-4 text-right font-mono text-slate-700">{row.cal}</td>
                      <td className="py-3 px-4 text-right font-mono font-black text-emerald-600 text-base">{row.oee}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Sello de Auditoría y Dictamen Digital */}
            {reportData.stamp && (
              <div className="pt-6 border-t border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50 p-4 rounded-xl">
                <div>
                  <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider block">
                    Dictamen de Auditoría Digital
                  </span>
                  <p className="text-xs font-bold text-slate-800 mt-0.5">{reportData.stamp.auditor}</p>
                  <p className="text-[10px] font-mono text-slate-500">Folio Certificador: {reportData.stamp.certNumber}</p>
                </div>
                <div className="text-left md:text-right">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100/70 border border-emerald-300 px-3 py-1 rounded-full">
                    <span>✓</span> Reporte Validado e Inmutable
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1">Generado: {new Date(reportData.stamp.verifiedAt).toLocaleString()}</p>
                </div>
              </div>
            )}

          </div>
        ) : null}

      </div>
    </div>
  );
}