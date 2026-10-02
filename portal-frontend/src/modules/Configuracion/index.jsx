import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Configuracion() {
  const [config, setConfig] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [roles, setRoles] = useState([]);
  const [activeTab, setActiveTab] = useState('fiscal');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  // Form state
  const [companyName, setCompanyName] = useState('');
  const [rfc, setRfc] = useState('');
  const [taxRegime, setTaxRegime] = useState('');
  const [fiscalAddress, setFiscalAddress] = useState('');
  const [exchangeRateUsd, setExchangeRateUsd] = useState(19.85);
  const [exchangeRateEur, setExchangeRateEur] = useState(21.40);
  const [vatRate, setVatRate] = useState(13.0);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [resCfg, resLogs, resRoles] = await Promise.all([
        fetch('/api/fase7/config/company'),
        fetch('/api/fase7/config/audit-log'),
        fetch('/api/fase7/config/roles')
      ]);
      const jsonCfg = await resCfg.json();
      const jsonLogs = await resLogs.json();
      const jsonRoles = await resRoles.json();

      setConfig(jsonCfg);
      setAuditLogs(jsonLogs);
      setRoles(jsonRoles);

      if (jsonCfg) {
        setCompanyName(jsonCfg.companyName || '');
        setRfc(jsonCfg.rfc || '');
        setTaxRegime(jsonCfg.taxRegime || '');
        setFiscalAddress(jsonCfg.fiscalAddress || '');
        setExchangeRateUsd(jsonCfg.exchangeRateUsd || 19.85);
        setExchangeRateEur(jsonCfg.exchangeRateEur || 21.40);
        setVatRate(jsonCfg.vatRate || 13.0);
      }
    } catch (err) {
      console.error('Error fetching config data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfig = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/fase7/config/company', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName,
          rfc,
          taxRegime,
          fiscalAddress,
          exchangeRateUsd: parseFloat(exchangeRateUsd),
          exchangeRateEur: parseFloat(exchangeRateEur),
          vatRate: parseFloat(vatRate)
        })
      });
      const updated = await res.json();
      setConfig(updated);
      setMessage('✓ Configuración corporativa y fiscal actualizada con éxito. Evento auditado en bitácora.');
      setTimeout(() => setMessage(null), 4000);
      
      // Refrescar logs
      const resLogs = await fetch('/api/fase7/config/audit-log');
      const jsonLogs = await resLogs.json();
      setAuditLogs(jsonLogs);
    } catch (err) {
      console.error('Error saving config:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-700 border-t-transparent mb-3"></div>
          <p className="text-slate-600 font-semibold">Cargando Parámetros Globales del Sistema...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Notificación */}
        {message && (
          <div className="bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-lg font-bold text-sm flex items-center gap-2">
            <span>✓</span> {message}
          </div>
        )}

        {/* Cabecera */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-slate-200 text-slate-800 text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                Módulo [26] • Configuración Global
              </span>
              <span className="text-xs text-slate-500">Gobernanza, Seguridad & Auditoría SAT</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 mt-1">
              Panel Maestro de Configuración & Parámetros
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Administración de la razón social, certificados fiscales digitales, catálogo de divisas y bitácora de auditoría.
            </p>
          </div>

          <div className="flex gap-3">
            <Link 
              to="/app/circuito-gobernanza" 
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm"
            >
              Circuito 7 Gobernanza ➔
            </Link>
            <Link 
              to="/portal" 
              className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
            >
              Portal
            </Link>
          </div>
        </div>

        {/* Selector de Pestañas */}
        <div className="flex gap-3 border-b border-slate-200 pb-3">
          <button
            onClick={() => setActiveTab('fiscal')}
            className={`px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
              activeTab === 'fiscal'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            🏢 Datos Fiscales & Divisas
          </button>
          <button
            onClick={() => setActiveTab('roles')}
            className={`px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
              activeTab === 'roles'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            👥 Roles y Seguridad RBAC
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
              activeTab === 'audit'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            📜 Bitácora de Auditoría ({auditLogs.length})
          </button>
        </div>

        {/* PESTAÑA 1: DATOS FISCALES & DIVISAS */}
        {activeTab === 'fiscal' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <form onSubmit={handleSaveConfig} className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 pb-2 border-b border-slate-100">
                Información Fiscal de la Empresa
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Razón Social</label>
                  <input 
                    type="text" 
                    value={companyName} 
                    onChange={e => setCompanyName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm text-slate-900 font-semibold focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">RFC</label>
                  <input 
                    type="text" 
                    value={rfc} 
                    onChange={e => setRfc(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm text-slate-900 font-mono font-bold focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Régimen Fiscal (SAT)</label>
                <input 
                  type="text" 
                  value={taxRegime} 
                  onChange={e => setTaxRegime(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Domicilio Fiscal Corporativo</label>
                <input 
                  type="text" 
                  value={fiscalAddress} 
                  onChange={e => setFiscalAddress(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 pt-3 pb-2 border-b border-slate-100">
                Divisas y Parámetros Operativos
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Tipo Cambio USD</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    value={exchangeRateUsd} 
                    onChange={e => setExchangeRateUsd(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Tipo Cambio EUR/USD</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    value={exchangeRateEur} 
                    onChange={e => setExchangeRateEur(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Tasa IVA General (%)</label>
                  <input 
                    type="number" 
                    value={vatRate} 
                    onChange={e => setVatRate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all shadow-md"
                >
                  {saving ? 'Guardando...' : 'Guardar y Auditar Cambios'}
                </button>
              </div>
            </form>

            {/* Certificados SAT & Políticas */}
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Seguridad Fiscal SAT
                </span>
                <h4 className="font-bold text-sm text-slate-900">Certificados de Sello Digital (CSD)</h4>
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs space-y-1 text-emerald-800">
                  <div className="font-bold">✓ Estatus: {config?.fiscalCertificatesStatus}</div>
                  <div className="text-[11px] text-emerald-600 font-mono">No. Certificado: 00001000000508492011</div>
                </div>
                <div className="text-xs text-slate-500">
                  Permite timbrado directo de facturas en CxC, notas de crédito y recibos de nómina CFDI 4.0.
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Gobernanza del Sistema
                </span>
                <h4 className="font-bold text-sm text-slate-900">Políticas de Acceso & Auditoría</h4>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1 font-mono text-slate-700">
                  <div>Modo: <strong className="text-slate-900">{config?.auditMode}</strong></div>
                  <div>Seguridad: <strong className="text-slate-900">{config?.activeSecurityPolicy}</strong></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PESTAÑA 2: ROLES RBAC */}
        {activeTab === 'roles' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {roles.map((r, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-base text-slate-900">{r.role}</h4>
                    <span className="text-xs text-blue-600 font-semibold">{r.usersCount} usuarios asignados</span>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 font-bold text-slate-600">
                    Activo
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{r.description}</p>
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1.5">Permisos Clave:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {r.permissions.map((p, j) => (
                      <span key={j} className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PESTAÑA 3: BITÁCORA DE AUDITORÍA */}
        {activeTab === 'audit' && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Registro Inmutable de Auditoría Global (Audit Trail)</h3>
                <p className="text-xs text-slate-500">Trazabilidad de operaciones críticas, movimientos contables y accesos</p>
              </div>
              <span className="text-xs font-bold text-slate-600 bg-white border border-slate-300 px-3 py-1 rounded-full">
                {auditLogs.length} Registros
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Fecha y Hora</th>
                    <th className="py-3 px-4">Severidad</th>
                    <th className="py-3 px-4">Acción</th>
                    <th className="py-3 px-4">Módulo</th>
                    <th className="py-3 px-4">Usuario & IP</th>
                    <th className="py-3 px-4">Detalle Operativo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {auditLogs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 text-slate-500">{new Date(log.timestamp).toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.severity === 'WARNING' 
                            ? 'bg-amber-100 text-amber-800' 
                            : log.severity === 'CRITICAL' 
                              ? 'bg-rose-100 text-rose-800' 
                              : 'bg-blue-100 text-blue-800'
                        }`}>
                          {log.severity}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-800">{log.action}</td>
                      <td className="py-3 px-4 font-sans font-semibold text-blue-600">{log.module}</td>
                      <td className="py-3 px-4 text-slate-600">
                        <div>{log.user}</div>
                        <div className="text-[10px] text-slate-400">{log.ipAddress}</div>
                      </td>
                      <td className="py-3 px-4 font-sans text-slate-700 text-[11px]">{log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}