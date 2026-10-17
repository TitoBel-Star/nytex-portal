// Heuristic Miner Algorithm for Process Mining (Pure JavaScript)

export const FALLBACK_CRM_CSV = `case_id,activity,timestamp,resource,amount,lost_reason
OPP-001,Crear Lead,2026-07-01 08:00:00,Ana Gomez,18000,
OPP-001,Contactar Cliente,2026-07-01 10:00:00,Ana Gomez,18000,
OPP-001,Calificar Lead,2026-07-02 09:00:00,Ana Gomez,18000,
OPP-001,Enviar Cotizacion,2026-07-03 11:00:00,Ana Gomez,18000,
OPP-001,Agendar Demo,2026-07-04 09:00:00,Ana Gomez,18000,
OPP-001,Realizar Demo,2026-07-05 14:00:00,Ana Gomez,18000,
OPP-001,Enviar Propuesta,2026-07-06 10:00:00,Ana Gomez,18000,
OPP-001,Negociacion,2026-07-08 15:00:00,Carlos Mendoza,18000,
OPP-001,Cerrar Ganado,2026-07-10 09:00:00,Carlos Mendoza,18000,
OPP-002,Crear Lead,2026-07-01 09:00:00,Luis Perez,25000,
OPP-002,Contactar Cliente,2026-07-01 11:30:00,Luis Perez,25000,
OPP-002,Calificar Lead,2026-07-02 14:00:00,Luis Perez,25000,
OPP-002,Enviar Cotizacion,2026-07-03 10:00:00,Luis Perez,25000,
OPP-002,Agendar Demo,2026-07-04 10:00:00,Luis Perez,25000,
OPP-002,Realizar Demo,2026-07-05 15:00:00,Luis Perez,25000,
OPP-002,Enviar Propuesta,2026-07-06 11:00:00,Luis Perez,25000,
OPP-002,Negociacion,2026-07-08 09:00:00,Carlos Mendoza,25000,
OPP-002,Cerrar Ganado,2026-07-10 16:00:00,Carlos Mendoza,25000,
OPP-003,Crear Lead,2026-07-02 08:30:00,Maria Rodriguez,12000,
OPP-003,Contactar Cliente,2026-07-02 10:30:00,Maria Rodriguez,12000,
OPP-003,Calificar Lead,2026-07-03 09:00:00,Maria Rodriguez,12000,
OPP-003,Enviar Cotizacion,2026-07-04 11:00:00,Maria Rodriguez,12000,
OPP-003,Prospecto acepto cotizacion,2026-07-05 10:00:00,Maria Rodriguez,12000,
OPP-003,Enviar Propuesta,2026-07-06 09:30:00,Maria Rodriguez,12000,
OPP-003,Negociacion,2026-07-07 15:00:00,Elena Silva,12000,
OPP-003,Cerrar Ganado,2026-07-09 10:00:00,Elena Silva,12000,
OPP-004,Crear Lead,2026-07-02 09:00:00,Juan Martinez,32000,
OPP-004,Contactar Cliente,2026-07-02 11:00:00,Juan Martinez,32000,
OPP-004,Calificar Lead,2026-07-03 10:00:00,Juan Martinez,32000,
OPP-004,Enviar Cotizacion,2026-07-04 09:00:00,Juan Martinez,32000,
OPP-004,Agendar Demo,2026-07-05 09:00:00,Juan Martinez,32000,
OPP-004,Realizar Demo,2026-07-07 14:00:00,Juan Martinez,32000,
OPP-004,Enviar Propuesta,2026-07-08 10:00:00,Juan Martinez,32000,
OPP-004,Negociacion,2026-07-10 15:00:00,Carlos Mendoza,32000,
OPP-004,Cerrar Ganado,2026-07-12 09:00:00,Carlos Mendoza,32000,
OPP-005,Crear Lead,2026-07-03 08:00:00,Ana Gomez,9500,
OPP-005,Contactar Cliente,2026-07-03 10:00:00,Ana Gomez,9500,
OPP-005,Calificar Lead,2026-07-04 09:30:00,Ana Gomez,9500,
OPP-005,Enviar Cotizacion,2026-07-05 11:00:00,Ana Gomez,9500,
OPP-005,Prospecto acepto cotizacion,2026-07-06 09:00:00,Ana Gomez,9500,
OPP-005,Enviar Propuesta,2026-07-07 10:00:00,Ana Gomez,9500,
OPP-005,Negociacion,2026-07-08 15:00:00,Elena Silva,9500,
OPP-005,Cerrar Ganado,2026-07-10 11:00:00,Elena Silva,9500,
OPP-006,Crear Lead,2026-07-03 09:00:00,Luis Perez,14000,
OPP-006,Contactar Cliente,2026-07-03 11:00:00,Luis Perez,14000,
OPP-006,Calificar Lead,2026-07-04 10:00:00,Luis Perez,14000,
OPP-006,Enviar Cotizacion,2026-07-05 09:00:00,Luis Perez,14000,
OPP-006,Agendar Demo,2026-07-06 10:00:00,Luis Perez,14000,
OPP-006,Realizar Demo,2026-07-07 15:00:00,Luis Perez,14000,
OPP-006,Enviar Propuesta,2026-07-08 11:00:00,Luis Perez,14000,
OPP-006,Negociacion,2026-07-10 09:00:00,Carlos Mendoza,14000,
OPP-006,Cerrar Ganado,2026-07-12 15:00:00,Carlos Mendoza,14000,
OPP-007,Crear Lead,2026-07-04 08:30:00,Maria Rodriguez,21000,
OPP-007,Contactar Cliente,2026-07-04 10:30:00,Maria Rodriguez,21000,
OPP-007,Calificar Lead,2026-07-05 09:00:00,Maria Rodriguez,21000,
OPP-007,Enviar Cotizacion,2026-07-06 11:00:00,Maria Rodriguez,21000,
OPP-007,Agendar Demo,2026-07-07 09:00:00,Maria Rodriguez,21000,
OPP-007,Realizar Demo,2026-07-08 14:00:00,Maria Rodriguez,21000,
OPP-007,Enviar Propuesta,2026-07-09 10:00:00,Maria Rodriguez,21000,
OPP-007,Negociacion,2026-07-11 15:00:00,Elena Silva,21000,
OPP-007,Cerrar Ganado,2026-07-13 09:00:00,Elena Silva,21000,
OPP-008,Crear Lead,2026-07-05 08:00:00,Juan Martinez,16000,
OPP-008,Contactar Cliente,2026-07-05 10:00:00,Juan Martinez,16000,
OPP-008,Calificar Lead,2026-07-06 09:30:00,Juan Martinez,16000,
OPP-008,Enviar Cotizacion,2026-07-07 11:00:00,Juan Martinez,16000,
OPP-008,Prospecto acepto cotizacion,2026-07-08 10:00:00,Juan Martinez,16000,
OPP-008,Enviar Propuesta,2026-07-09 09:00:00,Juan Martinez,16000,
OPP-008,Negociacion,2026-07-11 15:00:00,Carlos Mendoza,16000,
OPP-008,Cerrar Ganado,2026-07-13 10:00:00,Carlos Mendoza,16000,
OPP-009,Crear Lead,2026-07-05 09:00:00,Ana Gomez,28000,
OPP-009,Contactar Cliente,2026-07-05 11:30:00,Ana Gomez,28000,
OPP-009,Calificar Lead,2026-07-06 14:00:00,Ana Gomez,28000,
OPP-009,Enviar Cotizacion,2026-07-07 10:00:00,Ana Gomez,28000,
OPP-009,Agendar Demo,2026-07-08 09:00:00,Ana Gomez,28000,
OPP-009,Realizar Demo,2026-07-09 14:00:00,Ana Gomez,28000,
OPP-009,Enviar Propuesta,2026-07-10 11:00:00,Ana Gomez,28000,
OPP-009,Negociacion,2026-07-12 15:00:00,Carlos Mendoza,28000,
OPP-009,Cerrar Ganado,2026-07-14 09:00:00,Carlos Mendoza,28000,
OPP-010,Crear Lead,2026-07-06 08:30:00,Luis Perez,19000,
OPP-010,Contactar Cliente,2026-07-06 10:30:00,Luis Perez,19000,
OPP-010,Calificar Lead,2026-07-07 09:00:00,Luis Perez,19000,
OPP-010,Enviar Cotizacion,2026-07-08 11:00:00,Luis Perez,19000,
OPP-010,Prospecto acepto cotizacion,2026-07-09 10:00:00,Luis Perez,19000,
OPP-010,Enviar Propuesta,2026-07-10 09:00:00,Luis Perez,19000,
OPP-010,Negociacion,2026-07-12 15:00:00,Elena Silva,19000,
OPP-010,Cerrar Ganado,2026-07-14 10:00:00,Elena Silva,19000,
OPP-011,Crear Lead,2026-07-07 08:00:00,Maria Rodriguez,11000,
OPP-011,Contactar Cliente,2026-07-07 10:00:00,Maria Rodriguez,11000,
OPP-011,Calificar Lead,2026-07-08 09:30:00,Maria Rodriguez,11000,
OPP-011,Enviar Cotizacion,2026-07-09 11:00:00,Maria Rodriguez,11000,
OPP-011,Agendar Demo,2026-07-10 09:00:00,Maria Rodriguez,11000,
OPP-011,Realizar Demo,2026-07-11 14:00:00,Maria Rodriguez,11000,
OPP-011,Enviar Propuesta,2026-07-12 10:00:00,Maria Rodriguez,11000,
OPP-011,Negociacion,2026-07-14 15:00:00,Carlos Mendoza,11000,
OPP-011,Negociacion,2026-07-16 10:00:00,Carlos Mendoza,11000,
OPP-011,Cerrar Ganado,2026-07-17 09:00:00,Carlos Mendoza,11000,
OPP-012,Crear Lead,2026-07-01 09:00:00,Juan Martinez,8000,
OPP-012,Contactar Cliente,2026-07-01 11:00:00,Juan Martinez,8000,
OPP-012,Calificar Lead,2026-07-02 10:00:00,Juan Martinez,8000,
OPP-012,Enviar Cotizacion,2026-07-03 09:00:00,Juan Martinez,8000,
OPP-012,Prospecto no acepto cotizacion,2026-07-04 15:00:00,Juan Martinez,8000,Precio alto
OPP-012,Cerrar Perdido,2026-07-04 15:30:00,Juan Martinez,8000,Precio alto
OPP-013,Crear Lead,2026-07-02 08:00:00,Ana Gomez,15000,
OPP-013,Contactar Cliente,2026-07-02 10:00:00,Ana Gomez,15000,
OPP-013,Calificar Lead,2026-07-03 09:00:00,Ana Gomez,15000,
OPP-013,Enviar Cotizacion,2026-07-04 11:00:00,Ana Gomez,15000,
OPP-013,Agendar Demo,2026-07-05 09:00:00,Ana Gomez,15000,
OPP-013,Realizar Demo,2026-07-06 14:00:00,Ana Gomez,15000,
OPP-013,Enviar Propuesta,2026-07-07 10:00:00,Ana Gomez,15000,
OPP-013,Negociacion,2026-07-09 15:00:00,Carlos Mendoza,15000,
OPP-013,Cerrar Perdido,2026-07-09 17:00:00,Carlos Mendoza,15000,No quiere esa marca o calidad
OPP-014,Crear Lead,2026-07-03 08:30:00,Luis Perez,22000,
OPP-014,Contactar Cliente,2026-07-03 10:30:00,Luis Perez,22000,
OPP-014,Calificar Lead,2026-07-04 09:00:00,Luis Perez,22000,
OPP-014,Enviar Cotizacion,2026-07-05 11:00:00,Luis Perez,22000,
OPP-014,Prospecto no acepto cotizacion,2026-07-06 14:00:00,Luis Perez,22000,No tiene credito
OPP-014,Cerrar Perdido,2026-07-06 14:30:00,Luis Perez,22000,No tiene credito
OPP-015,Crear Lead,2026-07-04 08:00:00,Maria Rodriguez,17000,
OPP-015,Contactar Cliente,2026-07-04 10:00:00,Maria Rodriguez,17000,
OPP-015,Calificar Lead,2026-07-05 09:30:00,Maria Rodriguez,17000,
OPP-015,Enviar Cotizacion,2026-07-06 11:00:00,Maria Rodriguez,17000,
OPP-015,Agendar Demo,2026-07-07 09:00:00,Maria Rodriguez,17000,
OPP-015,Realizar Demo,2026-07-08 14:00:00,Maria Rodriguez,17000,
OPP-015,Enviar Propuesta,2026-07-09 10:00:00,Maria Rodriguez,17000,
OPP-015,Negociacion,2026-07-11 15:00:00,Elena Silva,17000,
OPP-015,Cerrar Perdido,2026-07-11 17:00:00,Elena Silva,17000,No hay existencias
OPP-016,Crear Lead,2026-07-05 09:00:00,Juan Martinez,13000,
OPP-016,Contactar Cliente,2026-07-05 11:00:00,Juan Martinez,13000,
OPP-016,Calificar Lead,2026-07-06 10:00:00,Juan Martinez,13000,
OPP-016,Enviar Cotizacion,2026-07-07 09:00:00,Juan Martinez,13000,
OPP-016,Prospecto no acepto cotizacion,2026-07-08 15:00:00,Juan Martinez,13000,Mala experiencia anterior con empresa
OPP-016,Cerrar Perdido,2026-07-08 15:30:00,Juan Martinez,13000,Mala experiencia anterior con empresa
OPP-017,Crear Lead,2026-07-06 08:00:00,Ana Gomez,20000,
OPP-017,Contactar Cliente,2026-07-06 10:00:00,Ana Gomez,20000,
OPP-017,Calificar Lead,2026-07-07 09:00:00,Ana Gomez,20000,
OPP-017,Enviar Cotizacion,2026-07-08 11:00:00,Ana Gomez,20000,
OPP-017,Prospecto acepto cotizacion,2026-07-09 10:00:00,Ana Gomez,20000,
OPP-017,Enviar Propuesta,2026-07-10 09:00:00,Ana Gomez,20000,
OPP-017,Negociacion,2026-07-12 15:00:00,Carlos Mendoza,20000,
OPP-017,Cerrar Perdido,2026-07-12 17:00:00,Carlos Mendoza,20000,Precio alto
OPP-018,Crear Lead,2026-07-07 08:30:00,Luis Perez,30000,
OPP-018,Contactar Cliente,2026-07-07 10:30:00,Luis Perez,30000,
OPP-018,Calificar Lead,2026-07-08 09:00:00,Luis Perez,30000,
OPP-018,Enviar Cotizacion,2026-07-09 11:00:00,Luis Perez,30000,
OPP-018,Agendar Demo,2026-07-10 09:00:00,Luis Perez,30000,
OPP-018,Realizar Demo,2026-07-11 14:00:00,Luis Perez,30000,
OPP-018,Enviar Propuesta,2026-07-12 10:00:00,Luis Perez,30000,
OPP-018,Negociacion,2026-07-14 15:00:00,Carlos Mendoza,30000,
OPP-018,Cerrar Ganado,2026-07-16 09:00:00,Carlos Mendoza,30000,
OPP-019,Crear Lead,2026-07-08 08:00:00,Maria Rodriguez,10000,
OPP-019,Contactar Cliente,2026-07-08 10:00:00,Maria Rodriguez,10000,
OPP-019,Calificar Lead,2026-07-09 09:30:00,Maria Rodriguez,10000,
OPP-019,Enviar Cotizacion,2026-07-10 11:00:00,Maria Rodriguez,10000,
OPP-019,Prospecto acepto cotizacion,2026-07-11 10:00:00,Maria Rodriguez,10000,
OPP-019,Enviar Propuesta,2026-07-12 09:00:00,Maria Rodriguez,10000,
OPP-019,Negociacion,2026-07-14 15:00:00,Elena Silva,10000,
OPP-019,Cerrar Ganado,2026-07-16 10:00:00,Elena Silva,10000,
OPP-020,Crear Lead,2026-07-09 08:00:00,Juan Martinez,26000,
OPP-020,Contactar Cliente,2026-07-09 10:00:00,Juan Martinez,26000,
OPP-020,Calificar Lead,2026-07-10 09:00:00,Juan Martinez,26000,
OPP-020,Enviar Cotizacion,2026-07-11 11:00:00,Juan Martinez,26000,
OPP-020,Agendar Demo,2026-07-12 09:00:00,Juan Martinez,26000,
OPP-020,Realizar Demo,2026-07-13 14:00:00,Juan Martinez,26000,
OPP-020,Enviar Propuesta,2026-07-14 10:00:00,Juan Martinez,26000,
OPP-020,Negociacion,2026-07-16 15:00:00,Carlos Mendoza,26000,
OPP-020,Cerrar Ganado,2026-07-18 09:00:00,Carlos Mendoza,26000,`;

export const FALLBACK_ERP_CSV = `case_id,activity,timestamp,resource,amount,lost_reason
PED-2026-001,1. Cotizacion Registrada en CRM/Ventas,2026-10-01 08:00:00,Maria Asesora,12500,
PED-2026-001,2. Pedido Aprobado por Credito,2026-10-01 08:45:00,Contralor,12500,
PED-2026-001,3. Surtido y Picking en WMS,2026-10-01 10:00:00,Carlos Almacenista,12500,
PED-2026-001,4. Despacho y Transporte en Logistica,2026-10-01 13:30:00,Transportes Express,12500,
PED-2026-001,5. Factura Emitida en CxC,2026-10-01 14:00:00,Facturacion,12500,
PED-2026-001,6. Cobro Liquidado en Tesoreria,2026-10-01 14:30:00,C.P. Mariana Garza,12500,
PED-2026-002,1. Cotizacion Registrada en CRM/Ventas,2026-10-02 08:30:00,Maria Asesora,18400,
PED-2026-002,2. Pedido Aprobado por Credito,2026-10-02 09:05:00,Contralor,18400,
PED-2026-002,3. Surtido y Picking en WMS,2026-10-02 10:05:00,Carlos Almacenista,18400,
PED-2026-002,4. Despacho y Transporte en Logistica,2026-10-02 13:20:00,Transportes Express,18400,
PED-2026-002,5. Factura Emitida en CxC,2026-10-02 13:35:00,Facturacion,18400,
PED-2026-002,6. Cobro Liquidado en Tesoreria,2026-10-02 14:00:00,C.P. Mariana Garza,18400,
PED-2026-003,1. Cotizacion Registrada en CRM/Ventas,2026-10-03 09:00:00,Alejandro Castillo,9800,
PED-2026-003,2. Pedido Aprobado por Credito,2026-10-03 11:30:00,Direccion Finanzas,9800,
PED-2026-003,3. Surtido y Picking en WMS,2026-10-03 12:25:00,Carlos Almacenista,9800,
PED-2026-003,4. Despacho y Transporte en Logistica,2026-10-03 13:55:00,Javier Treviño,9800,
PED-2026-003,5. Factura Emitida en CxC,2026-10-03 14:15:00,Facturacion,9800,
PED-2026-003,6. Cobro Liquidado en Tesoreria,2026-10-03 14:40:00,C.P. Mariana Garza,9800,
PED-2026-004,1. Cotizacion Registrada en CRM/Ventas,2026-10-04 08:00:00,Maria Asesora,34000,
PED-2026-004,2. Pedido Aprobado por Credito,2026-10-04 08:30:00,Contralor,34000,
PED-2026-004,3. Surtido y Picking en WMS,2026-10-04 09:40:00,Carlos Almacenista,34000,
PED-2026-004,4. Despacho y Transporte en Logistica,2026-10-04 14:10:00,Transportes Express,34000,
PED-2026-004,5. Factura Emitida en CxC,2026-10-04 14:35:00,Facturacion,34000,
PED-2026-004,6. Cobro Liquidado en Tesoreria,2026-10-04 15:00:00,C.P. Mariana Garza,34000,
PED-2026-005,1. Cotizacion Registrada en CRM/Ventas,2026-10-05 08:30:00,Alejandro Castillo,15200,
PED-2026-005,2. Pedido Aprobado por Credito,2026-10-05 09:10:00,Contralor,15200,
PED-2026-005,3. Surtido y Picking en WMS,2026-10-05 10:20:00,Carlos Almacenista,15200,
PED-2026-005,4. Despacho y Transporte en Logistica,2026-10-05 14:30:00,Transportes Express,15200,
PED-2026-005,5. Factura Emitida en CxC,2026-10-05 14:50:00,Facturacion,15200,
PED-2026-005,6. Cobro Liquidado en Tesoreria,2026-10-05 15:15:00,C.P. Mariana Garza,15200,
PED-2026-006,1. Cotizacion Registrada en CRM/Ventas,2026-10-06 09:00:00,Maria Asesora,21000,
PED-2026-006,2. Pedido Aprobado por Credito,2026-10-06 09:40:00,Contralor,21000,
PED-2026-006,3. Surtido y Picking en WMS,2026-10-06 10:50:00,Carlos Almacenista,21000,
PED-2026-006,4. Despacho y Transporte en Logistica,2026-10-06 14:45:00,Transportes Express,21000,
PED-2026-006,5. Factura Emitida en CxC,2026-10-06 15:05:00,Facturacion,21000,
PED-2026-006,6. Cobro Liquidado en Tesoreria,2026-10-06 15:30:00,C.P. Mariana Garza,21000,`;

export function parseCSV(csvData) {
  if (!csvData) return [];
  const lines = csvData.split('\n').filter(l => l.trim().length > 0);
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
  return lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim().replace(/^["']|["']$/g, ''));
    const row = {};
    headers.forEach((h, i) => { row[h] = values[i] || ''; });
    return row;
  }).filter(r => Object.values(r).some(v => v));
}

export function runHeuristicMiner(
  csvData,
  caseIdColumn = 'case_id',
  activityColumn = 'activity',
  timestampColumn = 'timestamp',
  dependencyThreshold = 0.5,
  loopTwoThreshold = 0.5
) {
  const rows = parseCSV(csvData);
  if (!rows.length) throw new Error('CSV vacío o sin datos válidos.');

  const events = rows
    .filter(r => r[caseIdColumn] && r[activityColumn] && r[timestampColumn])
    .map(r => ({
      case_id: r[caseIdColumn],
      activity: r[activityColumn],
      timestamp: new Date(r[timestampColumn]),
      resource: r.resource || 'N/A',
      amount: parseFloat(r.amount) || 0,
      lost_reason: r.lost_reason || ''
    }))
    .filter(e => !isNaN(e.timestamp.getTime()));

  if (!events.length) throw new Error('No se encontraron eventos válidos en las columnas indicadas.');

  const cases = new Map();
  events.forEach(ev => {
    if (!cases.has(ev.case_id)) cases.set(ev.case_id, []);
    cases.get(ev.case_id).push(ev);
  });
  cases.forEach(evts => evts.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()));

  const actFreq = new Map();
  const startActs = new Map();
  const endActs = new Map();
  const dfg = new Map();

  cases.forEach(evts => {
    if (!evts.length) return;
    startActs.set(evts[0].activity, (startActs.get(evts[0].activity) || 0) + 1);
    endActs.set(evts[evts.length - 1].activity, (endActs.get(evts[evts.length - 1].activity) || 0) + 1);
    evts.forEach((ev, i) => {
      actFreq.set(ev.activity, (actFreq.get(ev.activity) || 0) + 1);
      if (i < evts.length - 1) {
        const k = `${ev.activity}->${evts[i + 1].activity}`;
        dfg.set(k, (dfg.get(k) || 0) + 1);
      }
    });
  });

  const activities = Array.from(actFreq.keys());
  const depMatrix = new Map();
  activities.forEach(a => activities.forEach(b => {
    const ab = dfg.get(`${a}->${b}`) || 0;
    const ba = dfg.get(`${b}->${a}`) || 0;
    depMatrix.set(`${a}->${b}`, a === b ? ab / (ab + 1) : (ab - ba) / (ab + ba + 1));
  }));

  const nodes = activities.map(act => ({
    id: act,
    label: act,
    frequency: actFreq.get(act) || 0,
    is_start: startActs.has(act),
    is_end: endActs.has(act)
  }));

  const edges = [];
  const edgeSet = new Set();

  activities.forEach(a => {
    activities.forEach(b => {
      if (a === b) return;
      const dep = depMatrix.get(`${a}->${b}`) || 0;
      const freq = dfg.get(`${a}->${b}`) || 0;
      if (dep >= dependencyThreshold && freq > 0 && !edgeSet.has(`${a}->${b}`)) {
        edges.push({
          id: `${a}->${b}`,
          source: a,
          target: b,
          frequency: freq,
          dependency: Math.round(dep * 10000) / 10000,
          type: 'normal'
        });
        edgeSet.add(`${a}->${b}`);
      }
      const ab = dfg.get(`${a}->${b}`) || 0;
      const ba = dfg.get(`${b}->${a}`) || 0;
      if (ab > 0 && ba > 0 && (ab + ba) / (ab + ba + 1) >= loopTwoThreshold && !edgeSet.has(`${b}->${a}`)) {
        const dep2 = depMatrix.get(`${b}->${a}`) || 0;
        edges.push({
          id: `${b}->${a}`,
          source: b,
          target: a,
          frequency: ba,
          dependency: Math.round(dep2 * 10000) / 10000,
          type: 'loop_length_two'
        });
        edgeSet.add(`${b}->${a}`);
      }
    });
  });

  // Calculate transition average times
  const edgeTimeSums = {};
  const edgeTimeCounts = {};
  cases.forEach(evts => {
    for (let i = 0; i < evts.length - 1; i++) {
      const k = `${evts[i].activity}->${evts[i + 1].activity}`;
      const t1 = evts[i].timestamp.getTime();
      const t2 = evts[i + 1].timestamp.getTime();
      if (!isNaN(t1) && !isNaN(t2) && t2 >= t1) {
        edgeTimeSums[k] = (edgeTimeSums[k] || 0) + (t2 - t1);
        edgeTimeCounts[k] = (edgeTimeCounts[k] || 0) + 1;
      }
    }
  });

  return {
    nodes,
    edges,
    edgeTimeSums,
    edgeTimeCounts,
    stats: {
      total_cases: cases.size,
      total_events: events.length,
      avg_events_per_case: cases.size > 0 ? Math.round((events.length / cases.size) * 100) / 100 : 0,
      activity_count: activities.length
    }
  };
}
