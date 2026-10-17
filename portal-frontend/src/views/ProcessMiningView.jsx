import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import cytoscape from 'cytoscape';
import {
  FALLBACK_CRM_CSV,
  FALLBACK_ERP_CSV,
  parseCSV,
  runHeuristicMiner
} from '../services/heuristicMiner';

export default function ProcessMiningView() {
  const navigate = useNavigate();

  // Selected dataset type: 'crm' | 'erp' | 'custom'
  const [datasetType, setDatasetType] = useState('crm');
  const [csvContent, setCsvContent] = useState(FALLBACK_CRM_CSV);
  const [customFileName, setCustomFileName] = useState('');

  // Column mapping & filters
  const [colCase, setColCase] = useState('case_id');
  const [colActivity, setColActivity] = useState('activity');
  const [colTimestamp, setColTimestamp] = useState('timestamp');
  const [colResource, setColResource] = useState('resource');

  const [selectedResource, setSelectedResource] = useState('ALL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [depThreshold, setDepThreshold] = useState(0.50);
  const [loopThreshold, setLoopThreshold] = useState(0.50);

  // Mining state
  const [loading, setLoading] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Mined data state
  const [minedResult, setMinedResult] = useState(null);
  const [parsedCases, setParsedCases] = useState({});
  const [activeFilterTitle, setActiveFilterTitle] = useState('Todos los casos');
  const [activeMatchingCaseIds, setActiveMatchingCaseIds] = useState(new Set());
  const [activeDeviationFilter, setActiveDeviationFilter] = useState(null);

  // Cytoscape references
  const cyContainerRef = useRef(null);
  const cyRef = useRef(null);
  const fileInputRef = useRef(null);

  // 1. Initial Dataset Setup
  const handleSelectDataset = (type) => {
    setDatasetType(type);
    setActiveDeviationFilter(null);
    if (type === 'crm') {
      setCsvContent(FALLBACK_CRM_CSV);
      setColCase('case_id');
      setColActivity('activity');
      setColTimestamp('timestamp');
      setColResource('resource');
      setSelectedResource('ALL');
    } else if (type === 'erp') {
      setCsvContent(FALLBACK_ERP_CSV);
      setColCase('case_id');
      setColActivity('activity');
      setColTimestamp('timestamp');
      setColResource('resource');
      setSelectedResource('ALL');
    }
  };

  // 2. Fetch live ERP event logs from backend to enrich ERP dataset
  const fetchLiveErpData = async () => {
    try {
      const res = await fetch('/api/process/mining/summary');
      if (res.ok) {
        const json = await res.json();
        if (json.recentCases && json.recentCases.length > 0) {
          // Convert recent backend cases to CSV
          let erpCsv = 'case_id,activity,timestamp,resource,amount,lost_reason\n';
          json.recentCases.forEach(c => {
            (c.events || []).forEach(e => {
              erpCsv += `"${c.caseId}","${e.activity}","${e.timestamp}","${e.resource || 'Operador'}","${e.amount || 15000}","${e.isBottleneck ? 'Cuello de botella en Logística' : ''}"\n`;
            });
          });
          if (datasetType === 'erp') {
            setCsvContent(erpCsv);
          }
        }
      }
    } catch (err) {
      console.warn('Usando dataset ERP estático integrado:', err.message);
    }
  };

  useEffect(() => {
    fetchLiveErpData();
  }, []);

  // 3. Extract unique resources for the filter dropdown
  const availableResources = useMemo(() => {
    if (!csvContent) return [];
    const rows = parseCSV(csvContent);
    const resSet = new Set();
    rows.forEach(r => {
      if (r[colResource]) resSet.add(r[colResource].trim());
    });
    return Array.from(resSet).sort();
  }, [csvContent, colResource]);

  // 4. Auto-detect date bounds from CSV
  useEffect(() => {
    if (!csvContent) return;
    const rows = parseCSV(csvContent);
    let minD = null;
    let maxD = null;
    rows.forEach(r => {
      if (r[colTimestamp]) {
        const d = new Date(r[colTimestamp]);
        if (!isNaN(d.getTime())) {
          if (!minD || d < minD) minD = d;
          if (!maxD || d > maxD) maxD = d;
        }
      }
    });
    if (minD && maxD) {
      const formatYMD = (date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
      };
      setStartDate(formatYMD(minD));
      setEndDate(formatYMD(maxD));
    }
  }, [csvContent, colTimestamp]);

  // 5. Parse cases map from CSV
  const parseCasesMap = useCallback((rawCsv) => {
    const rows = parseCSV(rawCsv);
    const map = {};
    rows.forEach(r => {
      const caseId = r[colCase];
      const activity = r[colActivity];
      const timestamp = r[colTimestamp];
      const resource = r[colResource] || 'N/A';
      const amount = parseFloat(r.amount) || 0;
      const lostReason = r.lost_reason || '';

      if (caseId && activity && timestamp) {
        if (!map[caseId]) map[caseId] = [];
        map[caseId].push({
          caseId,
          activity,
          timestamp,
          resource,
          amount,
          lostReason
        });
      }
    });

    // Chronological order within each case
    Object.keys(map).forEach(cId => {
      map[cId].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    });

    return map;
  }, [colCase, colActivity, colTimestamp, colResource]);

  // 6. Execute Process Discovery (Heuristic Miner) & Render Diagram
  const executeProcessMining = useCallback(() => {
    if (!csvContent) return;

    setLoading(true);
    try {
      // Apply Date & Resource Filters on the CSV
      const rows = parseCSV(csvContent);
      const startLimit = startDate ? new Date(startDate + 'T00:00:00') : null;
      const endLimit = endDate ? new Date(endDate + 'T23:59:59') : null;

      // Filter rows
      let filteredRows = rows.filter(r => {
        if (!r[colTimestamp]) return true;
        const d = new Date(r[colTimestamp]);
        if (isNaN(d.getTime())) return true;
        if (startLimit && d < startLimit) return false;
        if (endLimit && d > endLimit) return false;
        return true;
      });

      // Filter by resource at case level
      if (selectedResource !== 'ALL') {
        const matchingCasesForResource = new Set();
        filteredRows.forEach(r => {
          if (r[colResource] === selectedResource && r[colCase]) {
            matchingCasesForResource.add(r[colCase]);
          }
        });
        filteredRows = filteredRows.filter(r => matchingCasesForResource.has(r[colCase]));
      }

      // Rebuild CSV for Heuristic Miner
      const headers = Object.keys(rows[0] || {});
      const filteredCsv = [
        headers.join(','),
        ...filteredRows.map(r => headers.map(h => `"${(r[h] || '').toString().replace(/"/g, '""')}"`).join(','))
      ].join('\n');

      const result = runHeuristicMiner(
        filteredCsv,
        colCase,
        colActivity,
        colTimestamp,
        depThreshold,
        loopThreshold
      );

      const casesMap = parseCasesMap(filteredCsv);
      setParsedCases(casesMap);
      setMinedResult(result);

      const allCaseIds = new Set(Object.keys(casesMap));
      setActiveMatchingCaseIds(allCaseIds);
      setActiveFilterTitle('Todos los casos');
      setActiveDeviationFilter(null);

      // Render Cytoscape Graph
      renderCytoscapeGraph(result, casesMap);
    } catch (err) {
      console.error('Error in Heuristic Miner:', err);
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  }, [
    csvContent,
    colCase,
    colActivity,
    colTimestamp,
    colResource,
    startDate,
    endDate,
    selectedResource,
    depThreshold,
    loopThreshold,
    parseCasesMap
  ]);

  // Run on mount or when switching dataset
  useEffect(() => {
    executeProcessMining();
  }, [datasetType, csvContent]);

  // 7. Render Cytoscape Graph
  const renderCytoscapeGraph = (minerResult, casesMap) => {
    if (!cyContainerRef.current) return;

    if (cyRef.current) {
      cyRef.current.destroy();
      cyRef.current = null;
    }

    const { nodes, edges, edgeTimeSums, edgeTimeCounts } = minerResult;

    // Determine happy path nodes based on median frequency
    const freqs = nodes.map(n => n.frequency);
    const sortedFreqs = [...freqs].sort((a, b) => a - b);
    const medianFreq = sortedFreqs[Math.floor(sortedFreqs.length / 2)] || 1;

    const elements = [];

    // Cytoscape Nodes
    nodes.forEach(n => {
      // Is start or regular
      const isStart = n.is_start && !n.is_end;
      const isHappy = n.frequency >= medianFreq;
      elements.push({
        data: {
          id: n.id,
          label: isStart ? 'Inicio' : n.label,
          frequency: n.frequency,
          isStart: isStart,
          isEnd: n.is_end,
          isHappy: isHappy
        }
      });
    });

    // Cytoscape Edges
    const maxFreqEdge = Math.max(...edges.map(e => e.frequency), 1);
    edges.forEach(e => {
      const ratio = e.frequency / maxFreqEdge;
      const edgeWidth = 1.8 + ratio * 3.5;
      const isLoop = e.type === 'loop_length_two';
      const isBottleneck = ratio < 0.20 && e.frequency > 0;

      const edgeKey = `${e.source}->${e.target}`;
      const labelParts = [`${e.frequency} Eventos`];

      if (edgeTimeCounts[edgeKey] > 0) {
        const avgMs = edgeTimeSums[edgeKey] / edgeTimeCounts[edgeKey];
        const avgDays = (avgMs / 86400000).toFixed(1);
        if (parseFloat(avgDays) >= 1) {
          labelParts.push(`T. Promedio: ${avgDays} días`);
        } else {
          const avgHours = (avgMs / 3600000).toFixed(1);
          if (parseFloat(avgHours) >= 1) {
            labelParts.push(`T. Promedio: ${avgHours} h`);
          } else {
            labelParts.push(`T. Promedio: ${Math.round(avgMs / 60000)} min`);
          }
        }
      }

      if (isBottleneck) {
        labelParts.push('⚠️ Cuello de botella');
      }

      elements.push({
        data: {
          id: e.id,
          source: e.source,
          target: e.target,
          label: labelParts.join('\n'),
          width: edgeWidth,
          isLoop: isLoop,
          isBottleneck: isBottleneck
        }
      });
    });

    const cy = cytoscape({
      container: cyContainerRef.current,
      elements: elements,
      boxSelectionEnabled: false,
      autounselectify: true,
      style: [
        // Standard Nodes (Deviations or Secondary in soft Red/Rose)
        {
          selector: 'node',
          style: {
            'content': 'data(label)',
            'text-wrap': 'wrap',
            'text-valign': 'center',
            'text-halign': 'center',
            'font-size': '11px',
            'font-weight': '600',
            'font-family': 'Inter, system-ui, sans-serif',
            'color': '#b91c1c',
            'background-color': '#fee2e2',
            'border-width': '2px',
            'border-color': '#ef4444',
            'width': 148,
            'height': 44,
            'shape': 'roundrectangle',
            'transition-property': 'background-color, border-color, opacity',
            'transition-duration': '0.2s'
          }
        },
        // Happy Path Nodes (Green)
        {
          selector: 'node[?isHappy]',
          style: {
            'color': '#15803d',
            'background-color': '#dcfce7',
            'border-color': '#22c55e'
          }
        },
        // Start Node (Circle gray/slate)
        {
          selector: 'node[?isStart]',
          style: {
            'shape': 'ellipse',
            'width': 64,
            'height': 64,
            'color': '#334155',
            'background-color': '#f8fafc',
            'border-color': '#94a3b8',
            'border-width': '2px',
            'label': 'Inicio',
            'font-weight': '700'
          }
        },
        // Edges (Orthogonal Taxi Curves downward)
        {
          selector: 'edge',
          style: {
            'label': 'data(label)',
            'font-size': '9px',
            'font-weight': '500',
            'font-family': 'Inter, system-ui, sans-serif',
            'color': '#475569',
            'width': 'data(width)',
            'line-color': '#94a3b8',
            'target-arrow-color': '#94a3b8',
            'target-arrow-shape': 'triangle',
            'curve-style': 'taxi',
            'taxi-direction': 'downward',
            'taxi-turn': 40,
            'text-background-opacity': 0.95,
            'text-background-color': '#ffffff',
            'text-background-padding': '3px',
            'text-background-shape': 'roundrectangle',
            'text-border-width': '0.5px',
            'text-border-color': '#cbd5e1',
            'line-style': 'solid',
            'text-wrap': 'wrap'
          }
        },
        // Bottleneck Edges (Dashed Orange)
        {
          selector: 'edge[?isBottleneck]',
          style: {
            'line-color': '#f97316',
            'target-arrow-color': '#f97316',
            'line-style': 'dashed',
            'color': '#c2410c',
            'text-background-color': '#fff7ed',
            'text-border-color': '#fdba74'
          }
        },
        // Loop Edges (Pink)
        {
          selector: 'edge[?isLoop]',
          style: {
            'line-color': '#ec4899',
            'target-arrow-color': '#ec4899',
            'line-style': 'dashed',
            'color': '#be185d'
          }
        }
      ],
      layout: {
        name: 'breadthfirst',
        directed: true,
        padding: 50,
        spacingFactor: 1.45,
        avoidOverlap: true,
        animate: false,
        roots: nodes.filter(n => n.is_start).map(n => n.id)
      }
    });

    // Tap node: Highlight neighborhood & filter drill-down table
    cy.on('tap', 'node', function (evt) {
      const node = evt.target;
      const activityName = node.id();

      cy.elements().style('opacity', 0.2);
      node.style('opacity', 1);
      node.neighborhood().style('opacity', 1);

      const matching = new Set();
      Object.keys(casesMap).forEach(caseId => {
        if (casesMap[caseId].some(e => e.activity === activityName)) {
          matching.add(caseId);
        }
      });
      setActiveMatchingCaseIds(matching);
      setActiveFilterTitle(`Casos que pasaron por: "${activityName}"`);
      setActiveDeviationFilter(null);
    });

    // Tap edge: Highlight transition & filter table
    cy.on('tap', 'edge', function (evt) {
      const edge = evt.target;
      const src = edge.data('source');
      const tgt = edge.data('target');

      cy.elements().style('opacity', 0.15);
      edge.style('opacity', 1);
      edge.source().style('opacity', 1);
      edge.target().style('opacity', 1);

      const matching = new Set();
      Object.keys(casesMap).forEach(caseId => {
        const evts = casesMap[caseId];
        for (let i = 0; i < evts.length - 1; i++) {
          if (evts[i].activity === src && evts[i + 1].activity === tgt) {
            matching.add(caseId);
            break;
          }
        }
      });
      setActiveMatchingCaseIds(matching);
      setActiveFilterTitle(`Transición: "${src}" ➔ "${tgt}"`);
      setActiveDeviationFilter(null);
    });

    // Tap canvas background: Reset highlighting & restore all cases
    cy.on('tap', function (evt) {
      if (evt.target === cy) {
        cy.elements().style('opacity', 1);
        setActiveMatchingCaseIds(new Set(Object.keys(casesMap)));
        setActiveFilterTitle('Todos los casos');
        setActiveDeviationFilter(null);
      }
    });

    cy.ready(() => {
      setTimeout(() => {
        cy.resize();
        cy.fit();
        cy.center();
      }, 150);
    });

    cyRef.current = cy;
  };

  // Zoom / Fit Controls
  const handleZoomIn = () => cyRef.current && cyRef.current.zoom(cyRef.current.zoom() * 1.2);
  const handleZoomOut = () => cyRef.current && cyRef.current.zoom(cyRef.current.zoom() / 1.2);
  const handleFit = () => cyRef.current && cyRef.current.fit() && cyRef.current.center();

  // 8. Conformance Checking Metrics
  const conformanceAnalysis = useMemo(() => {
    const allIds = Object.keys(parsedCases);
    let happyCount = 0;

    const devCases = {
      rejectedQuote: new Set(),
      lostNegotiation: new Set(),
      logisticsBottleneck: new Set(),
      loopRework: new Set()
    };

    allIds.forEach(cId => {
      const events = parsedCases[cId] || [];
      const acts = events.map(e => e.activity);

      let caseHasDeviation = false;

      // Check CRM deviations
      if (acts.includes('Prospecto no acepto cotizacion')) {
        devCases.rejectedQuote.add(cId);
        caseHasDeviation = true;
      }
      if (acts.includes('Cerrar Perdido') && !acts.includes('Prospecto no acepto cotizacion')) {
        devCases.lostNegotiation.add(cId);
        caseHasDeviation = true;
      }
      const negCount = acts.filter(a => a === 'Negociacion' || a === 'Negociación').length;
      if (negCount > 1) {
        devCases.loopRework.add(cId);
        caseHasDeviation = true;
      }

      // Check ERP deviations (Logistics delay)
      if (acts.some(a => a.toLowerCase().includes('despacho') || a.toLowerCase().includes('logistica'))) {
        const bottleEvent = events.find(e => (e.lostReason || '').toLowerCase().includes('cuello') || e.isBottleneck);
        if (bottleEvent) {
          devCases.logisticsBottleneck.add(cId);
          caseHasDeviation = true;
        }
      }

      if (!caseHasDeviation) happyCount++;
    });

    const total = allIds.length || 1;
    const rate = Math.round((happyCount / total) * 1000) / 10;
    const totalDeviations =
      devCases.rejectedQuote.size +
      devCases.lostNegotiation.size +
      devCases.logisticsBottleneck.size +
      devCases.loopRework.size;

    return {
      rate,
      totalDeviations,
      devCases
    };
  }, [parsedCases]);

  // Handle Conformance Deviation Filter Click
  const handleFilterDeviation = (devType) => {
    if (activeDeviationFilter === devType) {
      // Clear filter
      setActiveDeviationFilter(null);
      setActiveMatchingCaseIds(new Set(Object.keys(parsedCases)));
      setActiveFilterTitle('Todos los casos');
      if (cyRef.current) cyRef.current.elements().style('opacity', 1);
    } else {
      setActiveDeviationFilter(devType);
      const matching = conformanceAnalysis.devCases[devType] || new Set();
      setActiveMatchingCaseIds(matching);

      let label = 'Desviación';
      if (devType === 'rejectedQuote') label = 'Prospecto no aceptó cotización';
      if (devType === 'lostNegotiation') label = 'Venta perdida en Negociación';
      if (devType === 'logisticsBottleneck') label = 'Cuello de botella en Despacho/Logística';
      if (devType === 'loopRework') label = 'Bucle de Negociación (Re-trabajo)';

      setActiveFilterTitle(`Casos con desvío: ${label}`);
      if (cyRef.current) cyRef.current.elements().style('opacity', 1);
    }
  };

  // 9. Table Cases List
  const casesInTable = useMemo(() => {
    const ids = Array.from(activeMatchingCaseIds);
    return ids.map(cId => {
      const events = parsedCases[cId] || [];
      const latest = events[events.length - 1] || {};
      const owner = events[0] ? events[0].resource : 'N/A';
      const lostEv = events.find(e => e.lostReason);
      return {
        caseId: cId,
        lastActivity: latest.activity || 'N/A',
        resource: owner,
        amount: latest.amount || 0,
        lostReason: lostEv ? lostEv.lostReason : '-',
        timestamp: latest.timestamp || 'N/A'
      };
    }).sort((a, b) => a.caseId.localeCompare(b.caseId));
  }, [activeMatchingCaseIds, parsedCases]);

  // 10. Export to Excel (CSV with UTF-8 BOM)
  const handleExportExcel = () => {
    if (!casesInTable || casesInTable.length === 0) {
      alert('No hay casos en la tabla para exportar.');
      return;
    }

    let csv = '\uFEFF'; // UTF-8 BOM
    csv += 'ID Caso,Actividad,Vendedor / Recurso,Monto,Causa Desvio / Observacion,Fecha y Hora\n';

    casesInTable.forEach(c => {
      const events = parsedCases[c.caseId] || [];
      events.forEach(ev => {
        csv += `"${c.caseId}","${ev.activity}","${ev.resource}","${ev.amount || 0}","${ev.lostReason || ''}","${ev.timestamp}"\n`;
      });
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mineria_procesos_${activeFilterTitle.replace(/[\s\W]+/g, '_').toLowerCase()}_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // 11. File Upload Handler
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCustomFileName(file.name);
      setDatasetType('custom');
      const reader = new FileReader();
      reader.onload = (evt) => {
        setCsvContent(evt.target.result);
        setFeedback({ type: 'success', message: `Archivo ${file.name} cargado correctamente.` });
      };
      reader.readAsText(file);
    }
  };

  // 12. Simulate Live Case on ERP
  const handleSimulateCase = async () => {
    try {
      setSimulating(true);
      const res = await fetch('/api/process/mining/simulate-case', { method: 'POST' });
      const json = await res.json();
      if (res.ok) {
        setFeedback({ type: 'success', message: json.message });
        await fetchLiveErpData();
        setDatasetType('erp');
      } else {
        setFeedback({ type: 'error', message: json.error });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#0b1329] text-slate-100 overflow-hidden w-full font-sans">
      {/* Top Header */}
      <div className="flex flex-col border-b border-slate-800 px-6 py-3.5 bg-[#0f172a] sticky top-0 z-20 shrink-0 shadow-md">
        <div className="flex justify-between items-center">
          <div className="flex items-center text-sm md:text-base text-slate-300">
            <span className="cursor-pointer hover:text-cyan-400 text-sky-400 font-semibold" onClick={() => navigate('/portal')}>
              Portal
            </span>
            <span className="mx-2 text-slate-600">/</span>
            <span className="font-bold text-white flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 font-bold rounded-full">
                [16] Process Mining
              </span>
              Minería de Procesos, Descubrimiento & Conformance Checking
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigate('/app/processsuite')}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all"
            >
              [15] Process Suite
            </button>
            <button
              onClick={() => navigate('/app/circuito-procesos')}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-all"
            >
              Monitor Gobernanza ➔
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto p-5 md:p-6 space-y-5">
        {/* Top Control Bar: Datasets & Live Simulation */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#111c38] p-3.5 rounded-xl border border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-2">Dataset de Proceso:</span>
            <button
              onClick={() => handleSelectDataset('crm')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                datasetType === 'crm'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span>💼</span> Proceso Comercial CRM (Synex Cloud)
            </button>
            <button
              onClick={() => handleSelectDataset('erp')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                datasetType === 'erp'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span>🏭</span> Order-to-Cash ERP (NyTEX)
            </button>
            <button
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                datasetType === 'custom'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span>📁</span> {customFileName ? customFileName : 'Subir Archivo CSV'}
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".csv"
              className="hidden"
            />
          </div>

          <button
            disabled={simulating}
            onClick={handleSimulateCase}
            className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-md transition-all flex items-center gap-2"
          >
            <span>⚡</span> {simulating ? 'Simulando...' : 'Simular Caso en Vivo (ERP)'}
          </button>
        </div>

        {feedback && (
          <div
            className={`p-3.5 rounded-xl text-xs font-bold flex justify-between items-center shadow-sm ${
              feedback.type === 'error'
                ? 'bg-rose-950/70 text-rose-300 border border-rose-800'
                : 'bg-emerald-950/70 text-emerald-300 border border-emerald-800'
            }`}
          >
            <span>{feedback.type === 'error' ? '❌' : '✓'} {feedback.message}</span>
            <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-white font-bold ml-4">✕</button>
          </div>
        )}

        {/* 3 KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#111c38] border border-slate-800 rounded-xl p-4 text-center shadow-sm">
            <div className="text-3xl font-black font-mono text-white mb-1">
              {minedResult?.stats?.total_cases || 0}
            </div>
            <div className="text-[11px] font-bold tracking-wider uppercase text-slate-400">
              CASOS ANALIZADOS
            </div>
          </div>

          <div className="bg-[#111c38] border border-emerald-900/50 rounded-xl p-4 text-center shadow-sm">
            <div className="text-3xl font-black font-mono text-emerald-400 mb-1">
              {conformanceAnalysis.rate}%
            </div>
            <div className="text-[11px] font-bold tracking-wider uppercase text-emerald-300">
              CONFORMIDAD (HAPPY PATH)
            </div>
          </div>

          <div className="bg-[#111c38] border border-rose-900/50 rounded-xl p-4 text-center shadow-sm">
            <div className="text-3xl font-black font-mono text-rose-400 mb-1">
              {conformanceAnalysis.totalDeviations}
            </div>
            <div className="text-[11px] font-bold tracking-wider uppercase text-rose-300">
              DESVIACIONES CRÍTICAS DETECTADAS
            </div>
          </div>
        </div>

        {/* GRAPH & SIDEBAR MAIN AREA */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Controls Sidebar (matching Synex Cloud CRM layout) */}
          <aside className="lg:col-span-3 bg-[#0f172a] rounded-xl border border-slate-800 p-4 space-y-4 shadow-sm">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2 flex items-center gap-2">
              <span>⚙️</span> Parámetros del Minero
            </h4>

            {/* Column Resource Input */}
            <div className="space-y-1">
              <label className="text-xs text-slate-400 block font-medium">Columna Vendedor / Recurso</label>
              <input
                type="text"
                value={colResource}
                onChange={(e) => setColResource(e.target.value)}
                className="w-full bg-[#0b1329] border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            {/* Filter by Resource */}
            <div className="space-y-1">
              <label className="text-xs text-slate-400 block font-medium">Filtrar por Vendedor</label>
              <select
                value={selectedResource}
                onChange={(e) => setSelectedResource(e.target.value)}
                className="w-full bg-[#0b1329] border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 outline-none focus:border-cyan-500"
              >
                <option value="ALL">Todos los vendedores</option>
                {availableResources.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[11px] text-slate-400 block font-medium">Fecha Desde</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-[#0b1329] border border-slate-700 text-slate-200 text-xs rounded-lg px-2 py-1.5 outline-none focus:border-cyan-500 font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-slate-400 block font-medium">Fecha Hasta</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-[#0b1329] border border-slate-700 text-slate-200 text-xs rounded-lg px-2 py-1.5 outline-none focus:border-cyan-500 font-mono"
                />
              </div>
            </div>

            <hr className="border-slate-800 my-2" />

            {/* Dependency Threshold Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs text-slate-300 font-medium">Umbral de Dependencia</label>
                <span className="text-xs font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-800 px-2 py-0.5 rounded">
                  {depThreshold.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={depThreshold}
                onChange={(e) => setDepThreshold(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            {/* Loop L2 Threshold Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs text-slate-300 font-medium">Umbral Bucles L2</label>
                <span className="text-xs font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-800 px-2 py-0.5 rounded">
                  {loopThreshold.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={loopThreshold}
                onChange={(e) => setLoopThreshold(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            {/* Run Button */}
            <button
              onClick={executeProcessMining}
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black py-2.5 px-4 rounded-xl text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 mt-4"
            >
              <span>▶</span> {loading ? 'Minando Proceso...' : 'Descubrir Proceso'}
            </button>
          </aside>

          {/* Graph Visualization Panel with White Grid Background */}
          <div className="lg:col-span-9 bg-white rounded-xl border border-slate-300 shadow-md overflow-hidden flex flex-col">
            {/* Panel Header */}
            <div className="bg-[#f8fafc] px-4 py-3 border-b border-slate-200 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-blue-600 font-bold text-sm">
                  <i className="fa-solid fa-network-wired mr-1"></i> Mapa de Procesos (Heuristic Net)
                </span>
                <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                  • {minedResult?.nodes?.length || 0} Actividades, {minedResult?.edges?.length || 0} Transiciones
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-1.5">
                <button
                  onClick={handleZoomIn}
                  title="Acercar Zoom"
                  className="bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 px-2.5 py-1 rounded text-xs font-bold shadow-sm"
                >
                  <i className="fa-solid fa-magnifying-glass-plus"></i>
                </button>
                <button
                  onClick={handleZoomOut}
                  title="Alejar Zoom"
                  className="bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 px-2.5 py-1 rounded text-xs font-bold shadow-sm"
                >
                  <i className="fa-solid fa-magnifying-glass-minus"></i>
                </button>
                <button
                  onClick={handleFit}
                  title="Ajustar y Centrar"
                  className="bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 px-3 py-1 rounded text-xs font-bold shadow-sm flex items-center gap-1"
                >
                  <i className="fa-solid fa-compress"></i> Ajustar
                </button>
              </div>
            </div>

            {/* Cytoscape Canvas with White Grid Pattern */}
            <div
              ref={cyContainerRef}
              className="pm-canvas-white w-full h-[520px] relative cursor-grab active:cursor-grabbing"
              style={{ minHeight: '520px' }}
            >
              {loading && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 text-slate-700">
                  <div className="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-600 rounded-full animate-spin mb-3"></div>
                  <p className="text-xs font-bold">Ejecutando algoritmo Heuristic Miner...</p>
                </div>
              )}
            </div>

            {/* Bottom Caption */}
            <div className="bg-[#f8fafc] px-4 py-2 border-t border-slate-200 text-[11px] text-slate-500 flex justify-between items-center">
              <span>💡 Haz clic en cualquier nodo o arista para filtrar los casos asociados en la tabla inferior.</span>
              <span className="font-semibold text-slate-600">Clic en el fondo para reiniciar vista</span>
            </div>
          </div>
        </div>

        {/* BOTTOM LAYOUT: CONFORMANCE CHECKING & CASE DRILL-DOWN TABLE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-2">
          {/* Conformance Checking Panel (Left) */}
          <div className="lg:col-span-4 bg-[#0f172a] rounded-xl border border-slate-800 p-5 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <span className="text-emerald-400">✓</span> Conformidad de Proceso
            </h3>

            {/* Score Card */}
            <div className="bg-[#0b1329] border border-slate-800 rounded-xl p-4 flex justify-between items-center">
              <div>
                <span className="text-[11px] text-slate-400 uppercase tracking-wider font-bold block">
                  Calidad del Proceso
                </span>
                <h4 className="text-sm font-bold text-slate-200">
                  {conformanceAnalysis.rate >= 80
                    ? 'Cumplimiento Alto'
                    : conformanceAnalysis.rate >= 50
                    ? 'Cumplimiento Medio'
                    : 'Cumplimiento Bajo'}
                </h4>
              </div>
              <div
                className={`text-2xl font-black font-mono px-3 py-1 rounded-lg ${
                  conformanceAnalysis.rate >= 80
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : conformanceAnalysis.rate >= 50
                    ? 'bg-amber-950 text-amber-400 border border-amber-800'
                    : 'bg-rose-950 text-rose-400 border border-rose-800'
                }`}
              >
                {conformanceAnalysis.rate}%
              </div>
            </div>

            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider pt-1">
              Desviaciones y Alertas Detectadas:
            </div>

            {/* Deviations List */}
            <div className="space-y-2">
              {/* Alerta 1: No aceptó cotización */}
              <div
                onClick={() => handleFilterDeviation('rejectedQuote')}
                className={`p-3 rounded-lg border cursor-pointer transition-all flex justify-between items-center ${
                  activeDeviationFilter === 'rejectedQuote'
                    ? 'bg-amber-900/30 border-amber-500 ring-1 ring-amber-500'
                    : 'bg-[#0b1329] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <span>⚠️</span> No aceptó cotización
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Prospecto rechazó la cotización enviada.</div>
                </div>
                <div className="text-xs font-mono font-bold bg-amber-950 text-amber-300 px-2 py-0.5 rounded border border-amber-800">
                  {conformanceAnalysis.devCases.rejectedQuote.size}
                </div>
              </div>

              {/* Alerta 2: Perdido en Negociación */}
              <div
                onClick={() => handleFilterDeviation('lostNegotiation')}
                className={`p-3 rounded-lg border cursor-pointer transition-all flex justify-between items-center ${
                  activeDeviationFilter === 'lostNegotiation'
                    ? 'bg-rose-900/30 border-rose-500 ring-1 ring-rose-500'
                    : 'bg-[#0b1329] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                    <span>⛔</span> Perdido en Negociación
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Venta perdida tras llegar a negociar.</div>
                </div>
                <div className="text-xs font-mono font-bold bg-rose-950 text-rose-300 px-2 py-0.5 rounded border border-rose-800">
                  {conformanceAnalysis.devCases.lostNegotiation.size}
                </div>
              </div>

              {/* Alerta 3: Despacho / Logística (SLA retrasado en ERP) */}
              <div
                onClick={() => handleFilterDeviation('logisticsBottleneck')}
                className={`p-3 rounded-lg border cursor-pointer transition-all flex justify-between items-center ${
                  activeDeviationFilter === 'logisticsBottleneck'
                    ? 'bg-rose-900/30 border-rose-500 ring-1 ring-rose-500'
                    : 'bg-[#0b1329] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                    <span>⏳</span> Demora en Despacho Logístico
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Superó el SLA de preparación y transporte.</div>
                </div>
                <div className="text-xs font-mono font-bold bg-rose-950 text-rose-300 px-2 py-0.5 rounded border border-rose-800">
                  {conformanceAnalysis.devCases.logisticsBottleneck.size}
                </div>
              </div>

              {/* Alerta 4: Bucle de Negociación */}
              <div
                onClick={() => handleFilterDeviation('loopRework')}
                className={`p-3 rounded-lg border cursor-pointer transition-all flex justify-between items-center ${
                  activeDeviationFilter === 'loopRework'
                    ? 'bg-purple-900/30 border-purple-500 ring-1 ring-purple-500'
                    : 'bg-[#0b1329] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-purple-400 flex items-center gap-1.5">
                    <span>🔄</span> Bucle de Negociación
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Negociación repetida más de una vez (re-trabajo).</div>
                </div>
                <div className="text-xs font-mono font-bold bg-purple-950 text-purple-300 px-2 py-0.5 rounded border border-purple-800">
                  {conformanceAnalysis.devCases.loopRework.size}
                </div>
              </div>
            </div>

            {activeDeviationFilter && (
              <button
                onClick={() => handleFilterDeviation(activeDeviationFilter)}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold py-2 rounded-lg border border-slate-700 transition-all flex items-center justify-center gap-1"
              >
                <span>✕</span> Quitar filtro de desviación
              </button>
            )}
          </div>

          {/* Drill-down Cases Detail Table (Right) */}
          <div className="lg:col-span-8 bg-[#0f172a] rounded-xl border border-slate-800 p-5 space-y-4 shadow-sm flex flex-col">
            <div className="flex flex-wrap justify-between items-center gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-blue-400 text-base">📑</span>
                <h3 className="text-sm font-bold text-white">
                  {activeFilterTitle}
                </h3>
                <span className="bg-blue-950 text-blue-300 border border-blue-800 text-xs px-2.5 py-0.5 rounded-full font-mono font-bold">
                  {casesInTable.length} casos
                </span>
              </div>

              <button
                onClick={handleExportExcel}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
              >
                <i className="fa-solid fa-file-excel"></i> Exportar Excel
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto flex-1 max-h-[380px]">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#0b1329] border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="py-2.5 px-3">Caso (ID)</th>
                    <th className="py-2.5 px-3">Última Actividad</th>
                    <th className="py-2.5 px-3">Vendedor / Recurso</th>
                    <th className="py-2.5 px-3 text-right">Monto ($)</th>
                    <th className="py-2.5 px-3">Causa Pérdida / Obs</th>
                    <th className="py-2.5 px-3 text-right">Fecha Registro</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {casesInTable.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-slate-500">
                        No hay casos que coincidan con la selección o filtro actual.
                      </td>
                    </tr>
                  ) : (
                    casesInTable.map(c => (
                      <tr key={c.caseId} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-2.5 px-3 font-mono font-bold text-cyan-400">
                          {c.caseId}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="bg-indigo-950/70 text-indigo-300 border border-indigo-800/60 px-2 py-0.5 rounded text-[11px] font-semibold">
                            {c.lastActivity}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-300">
                          {c.resource}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-400">
                          {c.amount > 0 ? `$${c.amount.toLocaleString()}` : '-'}
                        </td>
                        <td className="py-2.5 px-3 text-rose-400 text-[11px]">
                          {c.lostReason}
                        </td>
                        <td className="py-2.5 px-3 text-right text-slate-400 font-mono text-[11px]">
                          {c.timestamp}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
