import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function WmsView() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [filterStatus, setFilterStatus] = useState('Todos');
  const [actionMessage, setActionMessage] = useState('');

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/wms/tasks');
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
    } catch (err) {
      console.error('Error fetching WMS tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAdvanceStatus = async (taskCode) => {
    try {
      const res = await fetch(`/api/wms/tasks/${taskCode}/advance`, {
        method: 'POST'
      });
      const result = await res.json();
      if (res.ok) {
        setActionMessage(result.message);
        setTimeout(() => setActionMessage(''), 6000);
        fetchTasks();
      } else {
        alert(result.error || 'Error al actualizar tarea');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredTasks = tasks.filter(t => {
    if (filterStatus === 'Todos') return true;
    return t.status === filterStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pendiente':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'En Picking':
        return 'bg-blue-100 text-blue-800 border-blue-300 animate-pulse';
      case 'Empacado':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Listo para Despacho':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getNextActionLabel = (status) => {
    switch (status) {
      case 'Pendiente':
        return '▶ Iniciar Picking';
      case 'En Picking':
        return '📦 Finalizar Empaque';
      case 'Empacado':
        return '🚀 Liberar a Despacho';
      case 'Listo para Despacho':
        return '✅ En Manos de Logística';
      default:
        return 'Avanzar';
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#f4f7f9] overflow-hidden w-full">
      {/* Top Header */}
      <div className="flex flex-col border-b border-gray-200 px-6 py-4 bg-white sticky top-0 z-10 shrink-0 shadow-sm w-full">
        <div className="flex justify-between items-center">
          <div className="flex items-center text-lg text-gray-700">
            <span className="cursor-pointer hover:underline text-[#006EAD]" onClick={() => navigate('/portal')}>Portal</span>
            <span className="mx-2 text-gray-400">/</span>
            <span className="font-bold text-[#0A2540] flex items-center gap-2">
              <span className="px-2 py-0.5 text-xs bg-emerald-100 text-emerald-800 font-bold rounded">Módulo [5]</span>
              NyTEX WMS (Warehouse Management)
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => navigate('/app/ventas')}
              className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded-md text-xs font-semibold shadow-sm transition"
            >
              Ir a Ventas [2]
            </button>
            <button 
              onClick={() => navigate('/app/logistica')}
              className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded-md text-xs font-semibold shadow-sm transition"
            >
              Ir a Logística [6]
            </button>
            <button 
              onClick={fetchTasks}
              className="bg-[#006EAD] hover:bg-[#005587] text-white px-4 py-2 rounded-md text-sm font-bold shadow-sm transition"
            >
              ↻ Refrescar Tareas
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 text-gray-800 w-full space-y-6">
        {/* Banner de Mensaje de Acción / Automatización */}
        {actionMessage && (
          <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-r-lg shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl">⚡</span>
              <div>
                <p className="text-sm font-bold text-emerald-900">Integración de Circuito Activa</p>
                <p className="text-xs text-emerald-700">{actionMessage}</p>
              </div>
            </div>
            <button onClick={() => setActionMessage('')} className="text-emerald-700 hover:text-emerald-900 text-xs font-bold">✕ Cerrar</button>
          </div>
        )}

        {/* KPIs de Almacén */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center justify-between">
            <div>
              <span className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Tareas Totales</span>
              <span className="block text-3xl font-extrabold text-[#0A2540]">{tasks.length}</span>
              <span className="text-xs text-gray-400">Órdenes de Surtido</span>
            </div>
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold">
              📋
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center justify-between">
            <div>
              <span className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">En Picking Activo</span>
              <span className="block text-3xl font-extrabold text-blue-600">
                {tasks.filter(t => t.status === 'En Picking').length}
              </span>
              <span className="text-xs text-blue-500 font-semibold">En pasillos de racks</span>
            </div>
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center text-xl font-bold">
              🛒
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center justify-between">
            <div>
              <span className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Empacados</span>
              <span className="block text-3xl font-extrabold text-purple-600">
                {tasks.filter(t => t.status === 'Empacado').length}
              </span>
              <span className="text-xs text-purple-500 font-semibold">Listos para etiquetar</span>
            </div>
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center text-xl font-bold">
              📦
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center justify-between">
            <div>
              <span className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Listos p/ Despacho</span>
              <span className="block text-3xl font-extrabold text-emerald-600">
                {tasks.filter(t => t.status === 'Listo para Despacho').length}
              </span>
              <span className="text-xs text-emerald-500 font-semibold">En andén de carga</span>
            </div>
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center text-xl font-bold">
              🚛
            </div>
          </div>
        </div>

        {/* Filtros y Contenedor Principal */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="flex flex-wrap items-center justify-between border-b border-gray-100 px-6 py-4 bg-gray-50/50 gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-500 uppercase">Filtrar por Estado:</span>
              {['Todos', 'Pendiente', 'En Picking', 'Empacado', 'Listo para Despacho'].map(st => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    filterStatus === st 
                      ? 'bg-[#006EAD] text-white shadow-sm' 
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
            <div className="text-xs text-gray-500">
              Mostrando <strong className="text-gray-800">{filteredTasks.length}</strong> tareas de almacén
            </div>
          </div>

          {/* Tabla de Tareas WMS */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3.5">Folio WMS</th>
                  <th className="px-6 py-3.5">Orden de Venta</th>
                  <th className="px-6 py-3.5">Cliente Destino</th>
                  <th className="px-6 py-3.5">Ubicación / Rack</th>
                  <th className="px-6 py-3.5">Operador</th>
                  <th className="px-6 py-3.5 text-center">Estado WMS</th>
                  <th className="px-6 py-3.5 text-right">Acción de Circuito</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-400">Cargando tareas de almacén...</td>
                  </tr>
                ) : filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-400">No hay tareas en este estado.</td>
                  </tr>
                ) : (
                  filteredTasks.map(task => (
                    <tr key={task.id} className="hover:bg-blue-50/40 transition">
                      <td className="px-6 py-4 font-mono font-bold text-[#006EAD]">
                        {task.taskCode}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-800">{task.orderCode}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-800">{task.clientName}</div>
                        <div className="text-xs text-gray-400">{task.warehouse}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-gray-100 border border-gray-200 rounded text-xs font-mono text-gray-700">
                          {task.zone}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-600">
                        👤 {task.operator}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(task.status)}`}>
                          {task.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setSelectedTask(task)}
                            className="px-2.5 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded"
                          >
                            Ver Ítems ({task.items ? task.items.length : 0})
                          </button>
                          {task.status !== 'Listo para Despacho' ? (
                            <button
                              onClick={() => handleAdvanceStatus(task.taskCode)}
                              className="px-3 py-1 text-xs bg-[#006EAD] hover:bg-[#005587] text-white font-bold rounded shadow-sm transition"
                            >
                              {getNextActionLabel(task.status)}
                            </button>
                          ) : (
                            <button
                              onClick={() => navigate('/app/logistica')}
                              className="px-3 py-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded shadow-sm transition"
                            >
                              Ver en Logística ➔
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal de Ítems a Pickear */}
        {selectedTask && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <div>
                  <h3 className="text-lg font-bold text-[#0A2540]">Lista de Picking - {selectedTask.taskCode}</h3>
                  <p className="text-xs text-gray-500">Orden asociada: {selectedTask.orderCode} | Cliente: {selectedTask.clientName}</p>
                </div>
                <button onClick={() => setSelectedTask(null)} className="text-gray-400 hover:text-gray-600 text-xl font-bold">✕</button>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto">
                {selectedTask.items && selectedTask.items.length > 0 ? (
                  selectedTask.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100 text-sm">
                      <div>
                        <div className="font-bold text-gray-800">{it.description || it.sku}</div>
                        <div className="text-xs font-mono text-gray-400">SKU: {it.sku}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-extrabold text-[#006EAD]">{it.quantity} unidades</div>
                        <div className="text-xs text-emerald-600 font-semibold">✓ Ubicación confirmada</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400 text-center py-4">No hay ítems registrados en esta tarea.</p>
                )}
              </div>

              <div className="flex justify-end pt-3 border-t">
                <button
                  onClick={() => setSelectedTask(null)}
                  className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
