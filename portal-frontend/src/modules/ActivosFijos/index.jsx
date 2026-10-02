import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ActivosFijos() {
  const navigate = useNavigate();
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState('');

  // Modal Alta Activo
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Maquinaria & Equipo Fabril');
  const [acquisitionCost, setAcquisitionCost] = useState('');
  const [usefulLifeYears, setUsefulLifeYears] = useState(10);
  const [assignedTo, setAssignedTo] = useState('Planta 1 - Tejeduría');

  const fetchAssets = async () => {
    try {
      const res = await fetch('/api/activos/list');
      if (res.ok) setAssets(await res.json());
    } catch (err) {
      console.error('Error fetching assets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleCreateAsset = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/activos/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          category,
          acquisitionCost: parseFloat(acquisitionCost),
          usefulLifeYears: parseInt(usefulLifeYears, 10),
          assignedTo
        })
      });
      const data = await res.json();
      if (res.ok) {
        setActionMessage(`Activo fijo ${data.assetCode} registrado en el padrón corporativo.`);
        setTimeout(() => setActionMessage(''), 6000);
        setModalOpen(false);
        setName('');
        setAcquisitionCost('');
        fetchAssets();
      } else {
        alert(data.error || 'Error al registrar activo');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ACCIÓN INTEGRADA: Correr Depreciación Mensual Automática
  const handleDepreciateAll = async () => {
    try {
      const res = await fetch('/api/activos/depreciate-all', {
        method: 'POST'
      });
      const result = await res.json();
      if (res.ok) {
        setActionMessage(result.message);
        setTimeout(() => setActionMessage(''), 8000);
        fetchAssets();
      } else {
        alert(result.error || 'Error al correr depreciación');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const totalCost = assets.reduce((sum, a) => sum + (a.acquisitionCost || 0), 0);
  const totalDep = assets.reduce((sum, a) => sum + (a.accumulatedDepreciation || 0), 0);
  const totalBookValue = assets.reduce((sum, a) => sum + (a.bookValue || 0), 0);

  return (
    <div className="h-full flex flex-col bg-[#f4f7f9] overflow-hidden w-full">
      {/* Top Header */}
      <div className="flex flex-col border-b border-gray-200 px-6 py-4 bg-white sticky top-0 z-10 shrink-0 shadow-sm w-full">
        <div className="flex justify-between items-center">
          <div className="flex items-center text-lg text-gray-700">
            <span className="cursor-pointer hover:underline text-[#006EAD]" onClick={() => navigate('/portal')}>Portal</span>
            <span className="mx-2 text-gray-400">/</span>
            <span className="font-bold text-[#0A2540] flex items-center gap-2">
              <span className="px-2 py-0.5 text-xs bg-indigo-100 text-indigo-800 font-bold rounded">Módulo [11]</span>
              NyTEX Activos Fijos & Depreciaciones
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => navigate('/app/contabilidad')}
              className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded-md text-xs font-semibold shadow-sm transition"
            >
              Ver Contabilidad [12]
            </button>
            <button 
              onClick={handleDepreciateAll}
              className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-md text-xs font-bold shadow-sm transition flex items-center gap-1.5"
              title="Calcula la depreciación mensual y genera la póliza contable"
            >
              ⚡ Correr Depreciación Mensual ➔ Contabilidad
            </button>
            <button 
              onClick={() => setModalOpen(true)}
              className="bg-[#006EAD] hover:bg-[#005587] text-white px-4 py-2 rounded-md text-sm font-bold shadow-sm transition flex items-center gap-1.5"
            >
              <span>+</span> ALTA DE ACTIVO FIJO
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 text-gray-800 w-full space-y-6">
        {/* Banner Mensaje */}
        {actionMessage && (
          <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-lg shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl">⚙️</span>
              <div>
                <p className="text-sm font-bold text-purple-900">Operación de Activos Contabilizada</p>
                <p className="text-xs text-purple-700">{actionMessage}</p>
              </div>
            </div>
            <button onClick={() => setActionMessage('')} className="text-purple-700 hover:text-purple-900 text-xs font-bold">✕ Cerrar</button>
          </div>
        )}

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center justify-between">
            <div>
              <span className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Costo Original de Activos</span>
              <span className="block text-2xl font-extrabold text-[#0A2540] font-mono">
                ${totalCost.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </span>
              <span className="text-xs text-gray-400">Inversión histórica en bienes</span>
            </div>
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold">
              🏗️
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center justify-between">
            <div>
              <span className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Depreciación Acumulada</span>
              <span className="block text-2xl font-extrabold text-amber-600 font-mono">
                ${totalDep.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </span>
              <span className="text-xs text-amber-600 font-semibold">Desgaste fiscal acumulado</span>
            </div>
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center text-xl font-bold">
              📉
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center justify-between">
            <div>
              <span className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Valor en Libros Neto</span>
              <span className="block text-2xl font-extrabold text-emerald-600 font-mono">
                ${totalBookValue.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </span>
              <span className="text-xs text-emerald-600 font-semibold">Valor contable real actual</span>
            </div>
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center text-xl font-bold">
              💵
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center justify-between">
            <div>
              <span className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Activos en Operación</span>
              <span className="block text-3xl font-extrabold text-indigo-600">
                {assets.filter(a => a.status === 'En Operación').length}
              </span>
              <span className="text-xs text-gray-400">Total registrados: {assets.length}</span>
            </div>
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center text-xl font-bold">
              🏭
            </div>
          </div>
        </div>

        {/* Tabla de Activos Fijos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="flex border-b border-gray-100 px-6 py-4 bg-gray-50/50 justify-between items-center">
            <h3 className="font-bold text-gray-800 text-sm">Padrón Corporativo de Activos Fijos y Maquinaria</h3>
            <span className="text-xs text-gray-500">Mostrando {assets.length} bienes patrimoniales</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3.5">Código Activo</th>
                  <th className="px-6 py-3.5">Descripción del Bien</th>
                  <th className="px-6 py-3.5">Categoría & Ubicación</th>
                  <th className="px-6 py-3.5 text-right">Costo Original</th>
                  <th className="px-6 py-3.5 text-center">Tasa Dep. Anual</th>
                  <th className="px-6 py-3.5 text-right">Depreciación Acum.</th>
                  <th className="px-6 py-3.5 text-right">Valor Neto Libros</th>
                  <th className="px-6 py-3.5 text-center">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-8 text-center text-gray-400">Cargando activos fijos...</td>
                  </tr>
                ) : assets.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-8 text-center text-gray-400">No hay activos registrados.</td>
                  </tr>
                ) : (
                  assets.map(a => (
                    <tr key={a.id} className="hover:bg-indigo-50/20 transition">
                      <td className="px-6 py-4 font-mono font-bold text-indigo-700">
                        {a.assetCode}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">{a.name}</div>
                        <div className="text-xs text-gray-400">Adquirido: {a.acquisitionDate}</div>
                      </td>
                      <td className="px-6 py-4 text-xs">
                        <span className="font-semibold text-gray-800">{a.category}</span>
                        <div className="text-gray-400">📍 {a.assignedTo}</div>
                      </td>
                      <td className="px-6 py-4 text-right font-mono font-bold text-gray-900">
                        ${a.acquisitionCost.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 text-center font-mono font-bold text-gray-600 text-xs">
                        {a.depreciationRateAnnual}% / año
                        <div className="text-[10px] text-gray-400">({a.usefulLifeYears} años vida útil)</div>
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-amber-700 font-bold">
                        ${a.accumulatedDepreciation.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 text-right font-mono font-extrabold text-emerald-700 text-base">
                        ${a.bookValue.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          {a.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Alta Activo */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <div>
                  <h3 className="text-lg font-bold text-[#0A2540]">Alta de Activo Fijo</h3>
                  <p className="text-xs text-gray-500">Padrón patrimonial para control fiscal y contable</p>
                </div>
                <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl font-bold">✕</button>
              </div>

              <form onSubmit={handleCreateAsset} className="space-y-4 text-sm">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Descripción del Bien / Equipo</label>
                  <input
                    type="text"
                    required
                    placeholder="ej. Máquina Tejedora Recta Shima Seiki"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 text-sm focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Categoría</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-indigo-600"
                    >
                      <option value="Maquinaria & Equipo Fabril">Maquinaria Fabril</option>
                      <option value="Vehículos de Transporte">Vehículos de Flota</option>
                      <option value="Equipo de Cómputo">Equipo de Cómputo</option>
                      <option value="Mobiliario de Oficina">Mobiliario</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Vida Útil (Años)</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={usefulLifeYears}
                      onChange={(e) => setUsefulLifeYears(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Costo de Adquisición ($ USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={acquisitionCost}
                    onChange={(e) => setAcquisitionCost(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono font-bold text-lg text-gray-800 focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Ubicación / Asignación</label>
                  <input
                    type="text"
                    required
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800 text-sm"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-sm transition"
                  >
                    Guardar Activo Fijo
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}