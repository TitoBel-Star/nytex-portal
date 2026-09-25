import React from 'react';
import { useNavigate } from 'react-router-dom';

const SynexProcessSuiteView = () => {
  const navigate = useNavigate();

  return (
    <div className="h-full flex flex-col bg-[#f9f9f9]">
      {/* Control Panel / Header */}
      <div className="flex flex-col border-b border-gray-200 px-4 py-3 bg-white sticky top-0 z-10 shrink-0">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center text-lg text-gray-700">
            <span className="cursor-pointer hover:underline text-[#714B67]" onClick={() => navigate('/')}>Synex Process Suite</span>
            <span className="mx-2 text-gray-400">/</span>
            <span className="font-semibold text-gray-900">Dashboard de Procesos</span>
          </div>
          <div className="flex space-x-2">
            <button className="bg-[#714B67] hover:bg-[#5a3c52] text-white px-3 py-1.5 rounded text-sm font-medium transition-colors shadow-sm">
              NUEVO PROCESO
            </button>
            <button className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-3 py-1.5 rounded text-sm font-medium transition-colors shadow-sm">
              <i className="fas fa-chart-pie mr-1"></i> Analíticas
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-5 rounded border border-gray-200 shadow-sm border-l-4 border-l-blue-500">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-gray-500 text-sm font-semibold uppercase">Instancias Activas</h3>
                <i className="fas fa-play-circle text-blue-400 text-xl"></i>
              </div>
              <p className="text-3xl font-light text-gray-800">324</p>
              <p className="text-xs text-green-500 mt-2"><i className="fas fa-arrow-up"></i> 12% desde ayer</p>
            </div>
            
            <div className="bg-white p-5 rounded border border-gray-200 shadow-sm border-l-4 border-l-orange-500">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-gray-500 text-sm font-semibold uppercase">Tareas Pendientes</h3>
                <i className="fas fa-tasks text-orange-400 text-xl"></i>
              </div>
              <p className="text-3xl font-light text-gray-800">89</p>
              <p className="text-xs text-red-500 mt-2"><i className="fas fa-arrow-up"></i> 5% cuellos de botella</p>
            </div>

            <div className="bg-white p-5 rounded border border-gray-200 shadow-sm border-l-4 border-l-green-500">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-gray-500 text-sm font-semibold uppercase">Procesos Modelados</h3>
                <i className="fas fa-project-diagram text-green-400 text-xl"></i>
              </div>
              <p className="text-3xl font-light text-gray-800">42</p>
              <p className="text-xs text-gray-400 mt-2">15 en producción</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded border border-gray-200 shadow-sm">
              <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-semibold text-gray-800">Modelos Recientes (BPMN)</h3>
                <button className="text-[#714B67] hover:underline text-sm font-medium">Ver todos</button>
              </div>
              <div className="divide-y divide-gray-100">
                <div className="p-4 hover:bg-gray-50 cursor-pointer flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded bg-blue-50 text-blue-500 flex items-center justify-center mr-4">
                      <i className="fas fa-file-invoice-dollar"></i>
                    </div>
                    <div>
                      <p className="font-medium text-sm">Aprobación de Compras</p>
                      <p className="text-xs text-gray-500">v2.1 • Modificado hace 2 hrs</p>
                    </div>
                  </div>
                  <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">Desplegado</span>
                </div>
                <div className="p-4 hover:bg-gray-50 cursor-pointer flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded bg-orange-50 text-orange-500 flex items-center justify-center mr-4">
                      <i className="fas fa-user-plus"></i>
                    </div>
                    <div>
                      <p className="font-medium text-sm">Onboarding de Empleados</p>
                      <p className="text-xs text-gray-500">v1.0 • Modificado ayer</p>
                    </div>
                  </div>
                  <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded">Borrador</span>
                </div>
                <div className="p-4 hover:bg-gray-50 cursor-pointer flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded bg-purple-50 text-purple-500 flex items-center justify-center mr-4">
                      <i className="fas fa-box-open"></i>
                    </div>
                    <div>
                      <p className="font-medium text-sm">Transferencia de Inventario</p>
                      <p className="text-xs text-gray-500">v3.4 • Modificado hace 5 días</p>
                    </div>
                  </div>
                  <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">Desplegado</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded border border-gray-200 shadow-sm">
              <div className="px-5 py-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-800">Mi Bandeja de Tareas</h3>
              </div>
              <div className="divide-y divide-gray-100">
                <div className="p-4 hover:bg-gray-50 cursor-pointer">
                  <div className="flex justify-between mb-1">
                    <p className="font-medium text-sm text-blue-600">Revisar Orden de Compra #4092</p>
                    <span className="text-xs text-red-500 font-medium">Alta Prioridad</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">Instancia: Aprobación de Compras • Solicitante: Juan Pérez</p>
                  <div className="flex space-x-2">
                    <button className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded">Abrir Tarea</button>
                    <button className="text-xs bg-green-50 text-green-600 hover:bg-green-100 px-2 py-1 rounded">Aprobar Rápido</button>
                  </div>
                </div>
                <div className="p-4 hover:bg-gray-50 cursor-pointer">
                  <div className="flex justify-between mb-1">
                    <p className="font-medium text-sm text-blue-600">Asignar Equipo (Nuevo Ingreso)</p>
                    <span className="text-xs text-gray-400">Normal</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">Instancia: Onboarding IT • Empleado: Carlos Gómez</p>
                  <div className="flex space-x-2">
                    <button className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded">Abrir Tarea</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SynexProcessSuiteView;
