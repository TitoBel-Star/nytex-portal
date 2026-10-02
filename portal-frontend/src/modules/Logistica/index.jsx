import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Logistica() {
  const navigate = useNavigate();
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('Todos');
  const [actionMessage, setActionMessage] = useState('');
  const [selectedShipment, setSelectedShipment] = useState(null);

  const fetchShipments = async () => {
    try {
      const res = await fetch('/api/logistica/shipments');
      if (res.ok) {
        const data = await res.json();
        setShipments(data);
      }
    } catch (err) {
      console.error('Error fetching shipments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  const handleAdvanceStatus = async (trackingCode) => {
    try {
      const res = await fetch(`/api/logistica/shipments/${trackingCode}/advance`, {
        method: 'POST'
      });
      const result = await res.json();
      if (res.ok) {
        setActionMessage(result.message);
        setTimeout(() => setActionMessage(''), 6000);
        fetchShipments();
      } else {
        alert(result.error || 'Error al actualizar envío');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredShipments = shipments.filter(s => {
    if (filterStatus === 'Todos') return true;
    return s.status === filterStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Programado':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'En Tránsito':
        return 'bg-amber-100 text-amber-800 border-amber-300 animate-pulse';
      case 'En Reparto':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Entregado':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getNextActionLabel = (status) => {
    switch (status) {
      case 'Programado':
        return '🚛 Iniciar Ruta de Tránsito';
      case 'En Tránsito':
        return '📍 Entrar en Zona de Reparto';
      case 'En Reparto':
        return '✅ Confirmar Entrega al Cliente';
      case 'Entregado':
        return '✓ Concluido con Éxito';
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
              <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 font-bold rounded">Módulo [6]</span>
              NyTEX Logística y Despachos
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => navigate('/app/wms')}
              className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded-md text-xs font-semibold shadow-sm transition"
            >
              Ir a WMS [5]
            </button>
            <button 
              onClick={() => navigate('/app/cxc')}
              className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded-md text-xs font-semibold shadow-sm transition"
            >
              Ir a CxC [8]
            </button>
            <button 
              onClick={fetchShipments}
              className="bg-[#006EAD] hover:bg-[#005587] text-white px-4 py-2 rounded-md text-sm font-bold shadow-sm transition"
            >
              ↻ Refrescar Despachos
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 text-gray-800 w-full space-y-6">
        {/* Banner de Mensaje de Acción */}
        {actionMessage && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl">🚛</span>
              <div>
                <p className="text-sm font-bold text-blue-900">Actualización Logística</p>
                <p className="text-xs text-blue-700">{actionMessage}</p>
              </div>
            </div>
            <button onClick={() => setActionMessage('')} className="text-blue-700 hover:text-blue-900 text-xs font-bold">✕ Cerrar</button>
          </div>
        )}

        {/* KPIs Logísticos */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center justify-between">
            <div>
              <span className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Envíos Totales</span>
              <span className="block text-3xl font-extrabold text-[#0A2540]">{shipments.length}</span>
              <span className="text-xs text-gray-400">Guías generadas</span>
            </div>
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold">
              📦
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center justify-between">
            <div>
              <span className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">En Tránsito</span>
              <span className="block text-3xl font-extrabold text-amber-600">
                {shipments.filter(s => s.status === 'En Tránsito').length}
              </span>
              <span className="text-xs text-amber-500 font-semibold">En carretera / ruta</span>
            </div>
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center text-xl font-bold">
              🛣️
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center justify-between">
            <div>
              <span className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">En Reparto Local</span>
              <span className="block text-3xl font-extrabold text-purple-600">
                {shipments.filter(s => s.status === 'En Reparto').length}
              </span>
              <span className="text-xs text-purple-500 font-semibold">Última milla</span>
            </div>
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center text-xl font-bold">
              📍
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center justify-between">
            <div>
              <span className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Entregados</span>
              <span className="block text-3xl font-extrabold text-emerald-600">
                {shipments.filter(s => s.status === 'Entregado').length}
              </span>
              <span className="text-xs text-emerald-500 font-semibold">Acuse firmado</span>
            </div>
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center text-xl font-bold">
              ✅
            </div>
          </div>
        </div>

        {/* Tabla de Despachos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="flex flex-wrap items-center justify-between border-b border-gray-100 px-6 py-4 bg-gray-50/50 gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-500 uppercase">Estado de Envío:</span>
              {['Todos', 'Programado', 'En Tránsito', 'En Reparto', 'Entregado'].map(st => (
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
              Mostrando <strong className="text-gray-800">{filteredShipments.length}</strong> guías de transporte
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3.5">Guía / Tracking</th>
                  <th className="px-6 py-3.5">Orden de Venta</th>
                  <th className="px-6 py-3.5">Cliente & Destino</th>
                  <th className="px-6 py-3.5">Transportista / Chofer</th>
                  <th className="px-6 py-3.5">Entrega Estimada</th>
                  <th className="px-6 py-3.5 text-center">Estado Ruta</th>
                  <th className="px-6 py-3.5 text-right">Gestión de Tránsito</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-400">Cargando despachos logísticos...</td>
                  </tr>
                ) : filteredShipments.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-400">No hay despachos registrados en este estado.</td>
                  </tr>
                ) : (
                  filteredShipments.map(s => (
                    <tr key={s.id} className="hover:bg-blue-50/40 transition">
                      <td className="px-6 py-4 font-mono font-bold text-[#006EAD]">
                        {s.trackingCode}
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-800">
                        {s.orderCode}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-800">{s.clientName}</div>
                        <div className="text-xs text-gray-500 truncate max-w-xs">{s.destination}</div>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-700">
                        <div className="font-semibold text-gray-900">{s.carrier}</div>
                        <div className="text-gray-500">Chofer: {s.driver} | Placas: <span className="font-mono text-gray-700 font-bold">{s.vehiclePlate}</span></div>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-600">
                        ⏱ {s.estimatedDelivery}
                        {s.deliveredAt && (
                          <div className="text-emerald-600 font-bold text-[11px] mt-0.5">
                            Entregado: {new Date(s.deliveredAt).toLocaleTimeString()}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(s.status)}`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setSelectedShipment(s)}
                            className="px-2.5 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded"
                          >
                            Carta Porte
                          </button>
                          {s.status !== 'Entregado' ? (
                            <button
                              onClick={() => handleAdvanceStatus(s.trackingCode)}
                              className="px-3 py-1 text-xs bg-[#006EAD] hover:bg-[#005587] text-white font-bold rounded shadow-sm transition"
                            >
                              {getNextActionLabel(s.status)}
                            </button>
                          ) : (
                            <span className="px-3 py-1 text-xs bg-emerald-100 text-emerald-800 font-bold rounded">
                              ✓ Entregado
                            </span>
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

        {/* Modal de Detalle de Carta Porte */}
        {selectedShipment && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <div>
                  <h3 className="text-lg font-bold text-[#0A2540]">Carta Porte Digital - {selectedShipment.trackingCode}</h3>
                  <p className="text-xs text-gray-500">Orden de Venta: {selectedShipment.orderCode}</p>
                </div>
                <button onClick={() => setSelectedShipment(null)} className="text-gray-400 hover:text-gray-600 text-xl font-bold">✕</button>
              </div>

              <div className="space-y-3 text-sm">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <span className="text-xs font-bold text-gray-400 uppercase">Destinatario</span>
                  <div className="font-bold text-gray-800 text-base">{selectedShipment.clientName}</div>
                  <div className="text-xs text-gray-600 mt-0.5">{selectedShipment.destination}</div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-gray-50 rounded-lg">
                    <span className="text-gray-400 font-bold uppercase">Empresa Transportista</span>
                    <div className="font-bold text-gray-800 mt-1">{selectedShipment.carrier}</div>
                  </div>
                  <div className="p-2.5 bg-gray-50 rounded-lg">
                    <span className="text-gray-400 font-bold uppercase">Operador Asignado</span>
                    <div className="font-bold text-gray-800 mt-1">{selectedShipment.driver}</div>
                  </div>
                  <div className="p-2.5 bg-gray-50 rounded-lg">
                    <span className="text-gray-400 font-bold uppercase">Placas Vehiculares</span>
                    <div className="font-mono font-bold text-gray-800 mt-1">{selectedShipment.vehiclePlate}</div>
                  </div>
                  <div className="p-2.5 bg-gray-50 rounded-lg">
                    <span className="text-gray-400 font-bold uppercase">Estado Actual</span>
                    <div className="font-bold text-blue-600 mt-1">{selectedShipment.status}</div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 border-t">
                <span className="text-xs text-gray-400">Verificado por NyTEX Business Partners [23]</span>
                <button
                  onClick={() => setSelectedShipment(null)}
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