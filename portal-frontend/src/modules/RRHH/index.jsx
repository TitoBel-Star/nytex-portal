import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RRHH() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('directorio'); // 'directorio', 'incidencias', 'departamentos'

  // Modal para nuevo empleado
  const [showEmpModal, setShowEmpModal] = useState(false);
  const [newEmp, setNewEmp] = useState({
    fullName: '',
    department: 'Producción Fabril',
    jobTitle: '',
    rfc: '',
    nss: '',
    dailySalary: 500,
    bankName: 'Banorte',
    bankAccount: ''
  });

  // Modal para nueva incidencia
  const [showIncModal, setShowIncModal] = useState(false);
  const [newInc, setNewInc] = useState({
    employeeCode: '',
    date: new Date().toISOString().split('T')[0],
    type: 'Horas Extra Dobles',
    hours: 2,
    notes: '',
    periodCode: 'NOM-2026-Q18'
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resEmp, resInc] = await Promise.all([
        fetch('/api/rrhh/employees'),
        fetch('/api/rrhh/incidents?periodCode=NOM-2026-Q18')
      ]);

      if (resEmp.ok) {
        const empJson = await resEmp.json();
        setEmployees(empJson.employees || []);
        setMetrics(empJson.metrics || null);
        if (empJson.employees?.length > 0 && !newInc.employeeCode) {
          setNewInc(prev => ({ ...prev, employeeCode: empJson.employees[0].employeeCode }));
        }
      }
      if (resInc.ok) {
        const incJson = await resInc.json();
        setIncidents(incJson || []);
      }
    } catch (err) {
      console.error('Error fetching RRHH data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateEmployee = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/rrhh/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEmp)
      });
      if (res.ok) {
        setShowEmpModal(false);
        fetchData();
      }
    } catch (err) {
      console.error('Error al registrar empleado:', err);
    }
  };

  const handleCreateIncident = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/rrhh/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newInc)
      });
      if (res.ok) {
        setShowIncModal(false);
        setNewInc(prev => ({ ...prev, hours: 2, notes: '' }));
        fetchData();
      }
    } catch (err) {
      console.error('Error al registrar incidencia:', err);
    }
  };

  const handleDeleteIncident = async (code) => {
    if (!window.confirm(`¿Eliminar la incidencia ${code}?`)) return;
    try {
      const res = await fetch(`/api/rrhh/incidents/${code}`, {
        method: 'DELETE'
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error('Error al eliminar incidencia:', err);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#f8fafc] overflow-hidden w-full">
      {/* Barra Superior */}
      <div className="flex flex-col border-b border-gray-200 px-6 py-4 bg-white sticky top-0 z-10 shrink-0 shadow-sm w-full">
        <div className="flex justify-between items-center">
          <div className="flex items-center text-lg text-gray-700">
            <span className="cursor-pointer hover:underline text-[#006EAD]" onClick={() => navigate('/portal')}>Portal</span>
            <span className="mx-2 text-gray-400">/</span>
            <span className="font-bold text-[#0A2540] flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs bg-indigo-100 text-indigo-800 font-bold rounded-full">[13] RRHH</span>
              Gestión de Talento Humano & Asistencias
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => navigate('/app/nomina')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
            >
              <span>💳</span> Ir a Cálculo de Nómina [14]
            </button>
            <button 
              onClick={() => navigate('/app/circuito-nomina')}
              className="bg-[#0A2540] hover:bg-[#1E3A8A] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-all"
            >
              Monitor Circuito Talento ➔
            </button>
          </div>
        </div>

        {/* Pestañas de Navegación Interna */}
        <div className="flex gap-4 mt-4 text-xs font-semibold text-gray-500 border-b border-gray-100 pb-2">
          <button 
            onClick={() => setActiveTab('directorio')}
            className={`pb-1 px-2 border-b-2 transition-colors ${activeTab === 'directorio' ? 'border-[#006EAD] text-[#006EAD] font-bold' : 'border-transparent hover:text-gray-800'}`}
          >
            👥 Directorio de Colaboradores ({employees.length})
          </button>
          <button 
            onClick={() => setActiveTab('incidencias')}
            className={`pb-1 px-2 border-b-2 transition-colors ${activeTab === 'incidencias' ? 'border-[#006EAD] text-[#006EAD] font-bold' : 'border-transparent hover:text-gray-800'}`}
          >
            ⏱️ Incidencias & Asistencia (Q18: {incidents.length})
          </button>
          <button 
            onClick={() => setActiveTab('departamentos')}
            className={`pb-1 px-2 border-b-2 transition-colors ${activeTab === 'departamentos' ? 'border-[#006EAD] text-[#006EAD] font-bold' : 'border-transparent hover:text-gray-800'}`}
          >
            🏢 Estructura Organizacional
          </button>
        </div>
      </div>

      {/* Contenido Principal con Scroll */}
      <div className="flex-1 overflow-auto p-6 space-y-6">
        
        {/* Banner de Métricas de Personal */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-bold">
              👥
            </div>
            <div>
              <div className="text-xs text-gray-500 font-semibold uppercase">Plantilla Activa</div>
              <div className="text-xl font-black text-gray-900">{metrics?.totalActive || 0} Colaboradores</div>
              <div className="text-[11px] text-emerald-600 font-medium">100% formalizados IMSS</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl font-bold">
              💵
            </div>
            <div>
              <div className="text-xs text-gray-500 font-semibold uppercase">Masa Salarial Mensual</div>
              <div className="text-xl font-black text-gray-900">${(metrics?.totalMonthlyPayroll || 0).toLocaleString()} USD</div>
              <div className="text-[11px] text-gray-500">Sueldo Base Promedio: ${(metrics?.averageDailySalary || 0).toLocaleString()}/día</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-xl font-bold">
              ⏱️
            </div>
            <div>
              <div className="text-xs text-gray-500 font-semibold uppercase">Incidencias Periodo Q18</div>
              <div className="text-xl font-black text-amber-700">{incidents.length} Registradas</div>
              <div className="text-[11px] text-gray-500">Impactan nómina en tiempo real</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center text-xl font-bold">
              🛡️
            </div>
            <div>
              <div className="text-xs text-gray-500 font-semibold uppercase">Cumplimiento IMSS / STPS</div>
              <div className="text-xl font-black text-purple-900">Clase III Fabril</div>
              <div className="text-[11px] text-gray-500">Riesgo Textil Integrado</div>
            </div>
          </div>
        </div>

        {/* TAB 1: DIRECTORIO DE COLABORADORES */}
        {activeTab === 'directorio' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Padrón Oficial de Colaboradores de NyTEX</h3>
                <p className="text-xs text-gray-500">Expedientes digitales con datos fiscales, salario diario integrado y cuentas de dispersión bancaria.</p>
              </div>
              <button 
                onClick={() => setShowEmpModal(true)}
                className="bg-[#006EAD] hover:bg-[#005a8e] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
              >
                <span>➕</span> Alta de Colaborador
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider">
                    <th className="py-2.5 px-3">Código / Nombre</th>
                    <th className="py-2.5 px-3">Puesto & Departamento</th>
                    <th className="py-2.5 px-3">RFC / NSS</th>
                    <th className="py-2.5 px-3 text-right">Salario Base (SBD)</th>
                    <th className="py-2.5 px-3 text-right">Salario Diario Integ. (SDI)</th>
                    <th className="py-2.5 px-3 text-right">Sueldo Mensual</th>
                    <th className="py-2.5 px-3">Banco / Cuenta Dispersión</th>
                    <th className="py-2.5 px-3 text-center">Estatus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {employees.map(emp => (
                    <tr key={emp.employeeCode} className="hover:bg-blue-50/40 transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <span className="text-xl bg-gray-100 p-1.5 rounded-lg">{emp.avatar || '👤'}</span>
                          <div>
                            <span className="font-bold text-gray-900 block">{emp.fullName}</span>
                            <span className="text-[10px] text-gray-400 font-mono">{emp.employeeCode}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-semibold text-gray-800 block">{emp.jobTitle}</span>
                        <span className="text-[11px] text-blue-600 font-medium">{emp.department}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-mono text-gray-700 block">{emp.rfc}</span>
                        <span className="font-mono text-[10px] text-gray-400">NSS: {emp.nss}</span>
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-gray-900">
                        ${emp.dailySalary?.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-semibold text-indigo-700">
                        ${emp.integratedDailySalary?.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-emerald-700">
                        ${emp.monthlySalary?.toLocaleString()}
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-semibold text-gray-700 block">{emp.bankName}</span>
                        <span className="font-mono text-[10px] text-gray-400">{emp.bankAccount}</span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {emp.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: INCIDENCIAS & ASISTENCIA */}
        {activeTab === 'incidencias' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Registro de Asistencia e Incidencias (Periodo NOM-2026-Q18)</h3>
                <p className="text-xs text-gray-500">Las horas extras y faltas registradas aquí impactan automáticamente los importes en el cálculo de nómina.</p>
              </div>
              <button 
                onClick={() => setShowIncModal(true)}
                className="bg-amber-600 hover:bg-amber-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
              >
                <span>⏱️</span> Registrar Nueva Incidencia
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider">
                    <th className="py-2.5 px-3">Folio Incidencia</th>
                    <th className="py-2.5 px-3">Colaborador</th>
                    <th className="py-2.5 px-3">Fecha</th>
                    <th className="py-2.5 px-3">Tipo de Incidencia</th>
                    <th className="py-2.5 px-3 text-center">Horas / Días</th>
                    <th className="py-2.5 px-3">Motivo / Notas</th>
                    <th className="py-2.5 px-3 text-center">Estatus</th>
                    <th className="py-2.5 px-3 text-center">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {incidents.map(inc => (
                    <tr key={inc.incidentCode} className="hover:bg-amber-50/30 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-gray-700">
                        {inc.incidentCode}
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-gray-900 block">{inc.employeeName}</span>
                        <span className="text-[10px] text-gray-400 font-mono">{inc.employeeCode}</span>
                      </td>
                      <td className="py-3 px-3 font-mono text-gray-600">
                        {inc.date}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          inc.type.includes('Horas Extra') ? 'bg-indigo-100 text-indigo-800' :
                          inc.type.includes('Falta') ? 'bg-rose-100 text-rose-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {inc.type}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center font-bold font-mono">
                        {inc.hours > 0 ? `${inc.hours} hrs (${inc.multiplier}x)` : '1 día'}
                      </td>
                      <td className="py-3 px-3 text-gray-600 max-w-xs truncate">
                        {inc.notes || 'Sin observaciones'}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {inc.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button 
                          onClick={() => handleDeleteIncident(inc.incidentCode)}
                          className="text-rose-600 hover:text-rose-800 font-bold text-xs"
                          title="Eliminar incidencia"
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                  {incidents.length === 0 && (
                    <tr>
                      <td colSpan="8" className="py-6 text-center text-gray-400">
                        No hay incidencias reportadas en el periodo actual.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ESTRUCTURA ORGANIZACIONAL */}
        {activeTab === 'departamentos' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {metrics?.byDepartment && Object.entries(metrics.byDepartment).map(([dept, count]) => {
              const deptEmps = employees.filter(e => e.department === dept);
              const deptSalary = deptEmps.reduce((s, e) => s + (e.monthlySalary || 0), 0);
              return (
                <div key={dept} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-3">
                  <div className="flex justify-between items-center border-b pb-2">
                    <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                      <span>🏢</span> {dept}
                    </h4>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                      {count} Colaborador{count > 1 ? 'es' : ''}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 flex justify-between">
                    <span>Masa Salarial Depto:</span>
                    <span className="font-mono font-bold text-gray-900">${deptSalary.toLocaleString()} USD</span>
                  </div>
                  <div className="space-y-1 pt-2">
                    {deptEmps.map(e => (
                      <div key={e.employeeCode} className="flex justify-between items-center text-xs py-1 px-2 rounded bg-gray-50">
                        <span className="font-medium text-gray-800">{e.fullName}</span>
                        <span className="text-gray-500 font-mono">${e.monthlySalary?.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* MODAL: ALTA DE COLABORADOR */}
      {showEmpModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                <span>👤</span> Registro de Nuevo Colaborador
              </h3>
              <button onClick={() => setShowEmpModal(false)} className="text-gray-400 hover:text-gray-600 text-lg">✕</button>
            </div>
            <form onSubmit={handleCreateEmployee} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-gray-700 block mb-1">Nombre Completo</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej: Lic. Fernando Soto Mendoza"
                  value={newEmp.fullName}
                  onChange={e => setNewEmp({ ...newEmp, fullName: e.target.value })}
                  className="w-full border rounded-lg p-2 text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Puesto / Cargo</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Ej: Operador de Calidad"
                    value={newEmp.jobTitle}
                    onChange={e => setNewEmp({ ...newEmp, jobTitle: e.target.value })}
                    className="w-full border rounded-lg p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Departamento</label>
                  <select 
                    value={newEmp.department}
                    onChange={e => setNewEmp({ ...newEmp, department: e.target.value })}
                    className="w-full border rounded-lg p-2 text-xs"
                  >
                    <option value="Producción Fabril">Producción Fabril</option>
                    <option value="Logística & WMS">Logística & WMS</option>
                    <option value="Ventas & Comercial">Ventas & Comercial</option>
                    <option value="Administración & Finanzas">Administración & Finanzas</option>
                    <option value="Dirección Técnica">Dirección Técnica</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">RFC</label>
                  <input 
                    type="text" 
                    required
                    placeholder="SOMF901020TX1"
                    value={newEmp.rfc}
                    onChange={e => setNewEmp({ ...newEmp, rfc: e.target.value })}
                    className="w-full border rounded-lg p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">NSS</label>
                  <input 
                    type="text" 
                    required
                    placeholder="48109028371"
                    value={newEmp.nss}
                    onChange={e => setNewEmp({ ...newEmp, nss: e.target.value })}
                    className="w-full border rounded-lg p-2 text-xs"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Salario Base Diario (SBD $)</label>
                  <input 
                    type="number" 
                    required
                    value={newEmp.dailySalary}
                    onChange={e => setNewEmp({ ...newEmp, dailySalary: e.target.value })}
                    className="w-full border rounded-lg p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Banco de Dispersión</label>
                  <select 
                    value={newEmp.bankName}
                    onChange={e => setNewEmp({ ...newEmp, bankName: e.target.value })}
                    className="w-full border rounded-lg p-2 text-xs"
                  >
                    <option value="Banorte">Banorte</option>
                    <option value="BBVA">BBVA</option>
                    <option value="Santander">Santander</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="font-semibold text-gray-700 block mb-1">Cuenta / CLABE de Nómina</label>
                <input 
                  type="text" 
                  placeholder="072910001928374615"
                  value={newEmp.bankAccount}
                  onChange={e => setNewEmp({ ...newEmp, bankAccount: e.target.value })}
                  className="w-full border rounded-lg p-2 text-xs font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button 
                  type="button"
                  onClick={() => setShowEmpModal(false)}
                  className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50 font-bold"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-[#006EAD] hover:bg-[#005a8e] text-white rounded-lg font-bold shadow"
                >
                  Guardar y Dar de Alta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: REGISTRAR INCIDENCIA */}
      {showIncModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                <span>⏱️</span> Registrar Incidencia de Asistencia
              </h3>
              <button onClick={() => setShowIncModal(false)} className="text-gray-400 hover:text-gray-600 text-lg">✕</button>
            </div>
            <form onSubmit={handleCreateIncident} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-gray-700 block mb-1">Colaborador</label>
                <select 
                  value={newInc.employeeCode}
                  onChange={e => setNewInc({ ...newInc, employeeCode: e.target.value })}
                  className="w-full border rounded-lg p-2 text-xs"
                >
                  {employees.map(emp => (
                    <option key={emp.employeeCode} value={emp.employeeCode}>
                      {emp.fullName} ({emp.employeeCode} - {emp.department})
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Tipo de Incidencia</label>
                  <select 
                    value={newInc.type}
                    onChange={e => setNewInc({ ...newInc, type: e.target.value })}
                    className="w-full border rounded-lg p-2 text-xs"
                  >
                    <option value="Horas Extra Dobles">Horas Extra Dobles (2x)</option>
                    <option value="Horas Extra Triples">Horas Extra Triples (3x)</option>
                    <option value="Falta Injustificada">Falta Injustificada (-Sueldo)</option>
                    <option value="Falta Justificada">Falta Justificada</option>
                    <option value="Retardo">Retardo</option>
                    <option value="Incapacidad IMSS">Incapacidad IMSS</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Horas Extras (si aplica)</label>
                  <input 
                    type="number" 
                    min="1"
                    max="12"
                    value={newInc.hours}
                    onChange={e => setNewInc({ ...newInc, hours: e.target.value })}
                    className="w-full border rounded-lg p-2 text-xs font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="font-semibold text-gray-700 block mb-1">Fecha</label>
                <input 
                  type="date" 
                  value={newInc.date}
                  onChange={e => setNewInc({ ...newInc, date: e.target.value })}
                  className="w-full border rounded-lg p-2 text-xs"
                />
              </div>
              <div>
                <label className="font-semibold text-gray-700 block mb-1">Observaciones / Justificante</label>
                <textarea 
                  rows="2"
                  placeholder="Detalles de la incidencia..."
                  value={newInc.notes}
                  onChange={e => setNewInc({ ...newInc, notes: e.target.value })}
                  className="w-full border rounded-lg p-2 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button 
                  type="button"
                  onClick={() => setShowIncModal(false)}
                  className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50 font-bold"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold shadow"
                >
                  Registrar Incidencia
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}