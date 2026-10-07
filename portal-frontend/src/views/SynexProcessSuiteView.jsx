import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BpmnInteractiveDesigner from '../components/BpmnInteractiveDesigner';

export default function SynexProcessSuiteView() {
  const navigate = useNavigate();
  const [models, setModels] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('inbox'); // 'inbox', 'models', 'nuevo'
  const [selectedModel, setSelectedModel] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Formulario para nueva tarea / instancia
  const [newTask, setNewTask] = useState({
    processCode: 'WF-COM-01',
    processName: 'Aprobación de Órdenes de Compra Mayores',
    title: '',
    referenceCode: '',
    requester: 'Comprador Textil',
    assignedRole: 'Director de Finanzas',
    priority: 'Alta',
    amount: 65000,
    deadline: '2026-10-05 18:00'
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resModels, resTasks] = await Promise.all([
        fetch('/api/process/models'),
        fetch('/api/process/tasks')
      ]);

      if (resModels.ok) {
        const jsonModels = await resModels.json();
        setModels(jsonModels || []);
        if (jsonModels.length > 0 && !selectedModel) {
          setSelectedModel(jsonModels[0]);
        }
      }
      if (resTasks.ok) {
        const jsonTasks = await resTasks.json();
        setTasks(jsonTasks.tasks || []);
        setPendingCount(jsonTasks.pendingCount || 0);
      }
    } catch (err) {
      console.error('Error fetching ProcessSuite data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleResolveTask = async (taskCode, action) => {
    try {
      setActionLoading(true);
      const res = await fetch(`/api/process/tasks/${taskCode}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, notes: `Resolución directiva: ${action} vía Synex Process Suite` })
      });
      const json = await res.json();
      if (res.ok) {
        setFeedback({ type: 'success', message: json.message });
        fetchData();
      } else {
        setFeedback({ type: 'error', message: json.error });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      const res = await fetch('/api/process/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask)
      });
      if (res.ok) {
        setFeedback({ type: 'success', message: 'Instancia de workflow lanzada exitosamente a la bandeja de aprobación.' });
        setActiveTab('inbox');
        fetchData();
      }
    } catch (err) {
      console.error('Error al lanzar instancia:', err);
    } finally {
      setActionLoading(false);
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
              <span className="px-2.5 py-0.5 text-xs bg-purple-100 text-purple-900 font-bold rounded-full">[15] Process Suite</span>
              Orquestador BPMN 2.0 & Bandeja de Aprobaciones
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => navigate('/app/processmining')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
            >
              <span>🔍</span> Ir a Process Mining [16]
            </button>
            <button 
              onClick={() => navigate('/app/circuito-procesos')}
              className="bg-[#0A2540] hover:bg-[#1E3A8A] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-all"
            >
              Monitor Gobernanza ➔
            </button>
          </div>
        </div>

        {/* Pestañas de Navegación */}
        <div className="flex gap-4 mt-4 text-xs font-semibold text-gray-500 border-b border-gray-100 pb-2">
          <button 
            onClick={() => setActiveTab('inbox')}
            className={`pb-1 px-2 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'inbox' ? 'border-purple-600 text-purple-900 font-bold' : 'border-transparent hover:text-gray-800'
            }`}
          >
            <span>📥</span> Bandeja de Aprobaciones ({pendingCount} pendientes)
          </button>
          <button 
            onClick={() => setActiveTab('models')}
            className={`pb-1 px-2 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'models' ? 'border-purple-600 text-purple-900 font-bold' : 'border-transparent hover:text-gray-800'
            }`}
          >
            <span>📐</span> Catálogo de Modelos BPMN ({models.length})
          </button>
          <button 
            onClick={() => setActiveTab('designer')}
            className={`pb-1 px-2 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'designer' ? 'border-purple-600 text-purple-900 font-bold' : 'border-transparent hover:text-gray-800'
            }`}
          >
            <span>🎨</span> Diseñador BPMN 2.0
            <span className="text-[9px] bg-purple-100 text-purple-800 font-extrabold px-1.5 py-0.5 rounded-full uppercase">Interactivo</span>
          </button>
          <button 
            onClick={() => setActiveTab('nuevo')}
            className={`pb-1 px-2 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'nuevo' ? 'border-purple-600 text-purple-900 font-bold' : 'border-transparent hover:text-gray-800'
            }`}
          >
            <span>➕</span> Lanzar Nueva Solicitud
          </button>
        </div>
      </div>

      {/* Contenido con scroll */}
      <div className="flex-1 overflow-auto p-6 space-y-6">

        {feedback && (
          <div className={`p-4 rounded-xl text-xs font-bold flex justify-between items-center shadow-sm ${
            feedback.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}>
            <span>✓ {feedback.message}</span>
            <button onClick={() => setFeedback(null)} className="text-gray-400 hover:text-gray-600 font-bold ml-4">✕</button>
          </div>
        )}

        {/* TAB 1: BANDEJA DE APROBACIONES */}
        {activeTab === 'inbox' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Tareas e Instancias de Aprobación</h3>
                  <p className="text-xs text-gray-500">Solicitudes que requieren visto bueno gerencial o directivo para desbloquear operaciones en ERP.</p>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-900">
                  {pendingCount} Tareas Requieren Acción
                </span>
              </div>

              <div className="space-y-3">
                {tasks.map(task => (
                  <div 
                    key={task.taskCode} 
                    className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
                      task.status === 'Pendiente' ? 'bg-white border-amber-200 shadow-sm' : 'bg-gray-50/70 border-gray-200 opacity-80'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-gray-200 text-gray-800">
                          {task.taskCode}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                          task.priority === 'Urgente' ? 'bg-rose-100 text-rose-800' :
                          task.priority === 'Alta' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          Prioridad {task.priority}
                        </span>
                        <span className="text-xs text-gray-500 font-medium">
                          Workflow: <strong>{task.processName}</strong>
                        </span>
                      </div>
                      <h4 className="font-black text-gray-900 text-sm">{task.title}</h4>
                      <p className="text-xs text-gray-600">
                        Solicitante: <strong>{task.requester}</strong> • Asignado a: <span className="text-purple-700 font-bold">{task.assignedRole}</span>
                        {task.amount > 0 && <span className="ml-2 font-mono font-bold text-emerald-700">Monto: ${task.amount?.toLocaleString()} USD</span>}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {task.status === 'Pendiente' ? (
                        <>
                          <button
                            disabled={actionLoading}
                            onClick={() => handleResolveTask(task.taskCode, 'Rechazar')}
                            className="bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                          >
                            Rechazar
                          </button>
                          <button
                            disabled={actionLoading}
                            onClick={() => handleResolveTask(task.taskCode, 'Aprobar')}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow transition-all"
                          >
                            ✓ Aprobar Solicitud
                          </button>
                        </>
                      ) : (
                        <div className="text-right">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            task.status === 'Aprobada' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            ● {task.status}
                          </span>
                          <span className="text-[10px] text-gray-400 block mt-1">
                            {task.resolutionNotes || 'Resuelto'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CATÁLOGO DE MODELOS BPMN */}
        {activeTab === 'models' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Lista de Modelos */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-3">
              <div className="flex justify-between items-center border-b pb-2">
                <h3 className="font-bold text-gray-900 text-sm">Workflows Diseñados</h3>
                <button
                  onClick={() => setActiveTab('designer')}
                  className="bg-purple-100 hover:bg-purple-200 text-purple-900 text-[11px] font-black px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 shadow-2xs"
                >
                  <span>🎨</span> + Diseñar Nuevo
                </button>
              </div>
              <div className="space-y-2">
                {models.map(m => (
                  <div
                    key={m.processCode}
                    onClick={() => setSelectedModel(m)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedModel?.processCode === m.processCode
                        ? 'border-purple-600 bg-purple-50/50 shadow-sm'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-mono font-bold text-purple-900">{m.processCode}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-gray-200 font-bold text-gray-700">{m.version}</span>
                    </div>
                    <div className="font-bold text-gray-800 text-xs mt-1">{m.name}</div>
                    <div className="text-[11px] text-gray-500 mt-0.5">{m.category} • SLA: {m.slaHours}h</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Vista Gráfica del Proceso Seleccionado */}
            <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
              <div className="flex justify-between items-start border-b pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700">Modelo Activo BPMN 2.0</span>
                  <h3 className="text-lg font-black text-gray-900 mt-1">{selectedModel?.name}</h3>
                  <p className="text-xs text-gray-500">{selectedModel?.description}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  {selectedModel?.status}
                </span>
              </div>

              {/* Diagrama de Etapas / Secuencia BPMN */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-gray-700 block uppercase">Secuencia de Pasos & Compuertas Lógicas:</span>
                <div className="flex flex-col md:flex-row items-center gap-3 overflow-x-auto py-4">
                  {selectedModel?.steps?.map((st, idx) => (
                    <React.Fragment key={st.step}>
                      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-3 min-w-[160px] text-center shadow-sm">
                        <div className="text-[10px] font-bold text-purple-700 uppercase">Etapa {st.step}</div>
                        <div className="font-bold text-xs text-gray-900 mt-1">{st.name}</div>
                        <div className="text-[10px] text-gray-500 mt-2 bg-white rounded px-2 py-0.5 border border-purple-100 inline-block font-mono">
                          👤 {st.role}
                        </div>
                      </div>
                      {idx < selectedModel.steps.length - 1 && (
                        <div className="text-purple-400 font-black text-lg">➔</div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs text-gray-600 flex flex-wrap justify-between items-center gap-2">
                <span>Tiempo Máximo de SLA Permitido: <strong>{selectedModel?.slaHours} horas</strong></span>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setActiveTab('designer')}
                    className="bg-white hover:bg-gray-100 border border-purple-300 text-purple-800 px-3 py-1.5 rounded-lg text-xs font-bold shadow-2xs transition-all flex items-center gap-1"
                  >
                    <span>🎨</span> Abrir en Diseñador
                  </button>
                  <button 
                    onClick={() => {
                      setNewTask(prev => ({
                        ...prev,
                        processCode: selectedModel.processCode,
                        processName: selectedModel.name,
                        title: `Instancia de ${selectedModel.name}`
                      }));
                      setActiveTab('nuevo');
                    }}
                    className="bg-purple-700 hover:bg-purple-800 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold shadow transition-all flex items-center gap-1"
                  >
                    <span>🚀</span> Ejecutar este Workflow ➔
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: LANZAR NUEVA SOLICITUD */}
        {activeTab === 'nuevo' && (
          <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            <h3 className="font-bold text-gray-900 text-base flex items-center gap-2 border-b pb-3">
              <span>➕</span> Lanzar Nueva Instancia de Proceso BPMN
            </h3>
            <form onSubmit={handleCreateTask} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-gray-700 block mb-1">Workflow a Ejecutar</label>
                <select 
                  value={newTask.processCode}
                  onChange={e => {
                    const sel = models.find(m => m.processCode === e.target.value);
                    setNewTask({
                      ...newTask,
                      processCode: e.target.value,
                      processName: sel?.name || newTask.processName
                    });
                  }}
                  className="w-full border rounded-lg p-2 text-xs"
                >
                  {models.map(m => (
                    <option key={m.processCode} value={m.processCode}>{m.processCode} - {m.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Título de la Solicitud / Asunto</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej: Aprobación de Compra Tintes Reactivos Lote 440"
                  value={newTask.title}
                  onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full border rounded-lg p-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Código de Referencia (OC / Pedido)</label>
                  <input 
                    type="text" 
                    required
                    placeholder="PO-2026-0002"
                    value={newTask.referenceCode}
                    onChange={e => setNewTask({ ...newTask, referenceCode: e.target.value })}
                    className="w-full border rounded-lg p-2 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Monto en Disputa ($ USD)</label>
                  <input 
                    type="number" 
                    value={newTask.amount}
                    onChange={e => setNewTask({ ...newTask, amount: parseFloat(e.target.value) || 0 })}
                    className="w-full border rounded-lg p-2 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Rol Asignado para Autorización</label>
                  <select 
                    value={newTask.assignedRole}
                    onChange={e => setNewTask({ ...newTask, assignedRole: e.target.value })}
                    className="w-full border rounded-lg p-2 text-xs"
                  >
                    <option value="Director de Finanzas">Director de Finanzas</option>
                    <option value="Director General">Director General</option>
                    <option value="Supervisor de Calidad">Supervisor de Calidad</option>
                    <option value="Contador General">Contador General</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Nivel de Prioridad</label>
                  <select 
                    value={newTask.priority}
                    onChange={e => setNewTask({ ...newTask, priority: e.target.value })}
                    className="w-full border rounded-lg p-2 text-xs"
                  >
                    <option value="Media">Media</option>
                    <option value="Alta">Alta</option>
                    <option value="Urgente">Urgente</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <button 
                  type="button"
                  onClick={() => setActiveTab('inbox')}
                  className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50 font-bold"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg font-bold shadow"
                >
                  Lanzar a Bandeja de Tareas
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 4: DISEÑADOR BPMN INTERACTIVO */}
        {activeTab === 'designer' && (
          <div className="h-[calc(100vh-210px)] min-h-[640px] flex flex-col">
            <BpmnInteractiveDesigner 
              onModelSaved={async (savedModel) => {
                await fetchData();
                setSelectedModel(savedModel);
                setNewTask(prev => ({
                  ...prev,
                  processCode: savedModel.processCode,
                  processName: savedModel.name,
                  title: `Instancia de ${savedModel.name}`,
                  assignedRole: savedModel.steps?.[0]?.role || 'Director de Finanzas'
                }));
                setFeedback({ 
                  type: 'success', 
                  message: `¡Proceso "${savedModel.name}" (${savedModel.processCode}) guardado y publicado en NytEX ERP exitosamente! Ya está en el Catálogo y listo para ser ejecutado.` 
                });
                setActiveTab('models');
              }} 
              nextProcessCode={`WF-PRC-${String(models.length + 1).padStart(2, '0')}`}
            />
          </div>
        )}

      </div>
    </div>
  );
}
