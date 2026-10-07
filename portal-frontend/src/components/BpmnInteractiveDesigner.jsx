import React, { useState, useRef, useEffect } from 'react';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import './BpmnInteractiveDesigner.css';

const TEMPLATES = {
  blank: {
    name: 'Lienzo en Blanco',
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" targetNamespace="http://bpmn.io/schema/bpmn" id="Definitions_Blank">
  <bpmn:process id="Process_1" isExecutable="true">
    <bpmn:startEvent id="StartEvent_1" name="Inicio del Flujo" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">
        <dc:Bounds x="180" y="180" width="36" height="36" />
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`
  },
  purchases: {
    name: 'Aprobación de Órdenes de Compra (> $50,000 MXN)',
    category: 'Compras & Abastecimiento',
    codePrefix: 'WF-COM',
    description: 'Flujo de autorización escalonada para adquisiciones de materia prima que superen el límite operativo estándar.',
    slaHours: 24,
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" targetNamespace="http://bpmn.io/schema/bpmn" id="Definitions_PO">
  <bpmn:process id="Process_PO" isExecutable="true">
    <bpmn:startEvent id="Start_1" name="Necesidad de Compra">
      <bpmn:outgoing>Flow_1</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:userTask id="Task_Req" name="Requisición y Cotización">
      <bpmn:incoming>Flow_1</bpmn:incoming>
      <bpmn:outgoing>Flow_2</bpmn:outgoing>
    </bpmn:userTask>
    <bpmn:sequenceFlow id="Flow_1" sourceRef="Start_1" targetRef="Task_Req" />
    <bpmn:userTask id="Task_Val" name="Validación Presupuestal">
      <bpmn:incoming>Flow_2</bpmn:incoming>
      <bpmn:outgoing>Flow_3</bpmn:outgoing>
    </bpmn:userTask>
    <bpmn:sequenceFlow id="Flow_2" sourceRef="Task_Req" targetRef="Task_Val" />
    <bpmn:exclusiveGateway id="Gateway_1" name="¿Supera $50,000?">
      <bpmn:incoming>Flow_3</bpmn:incoming>
      <bpmn:outgoing>Flow_Yes</bpmn:outgoing>
      <bpmn:outgoing>Flow_No</bpmn:outgoing>
    </bpmn:exclusiveGateway>
    <bpmn:sequenceFlow id="Flow_3" sourceRef="Task_Val" targetRef="Gateway_1" />
    <bpmn:userTask id="Task_Dir" name="Visto Bueno Dirección">
      <bpmn:incoming>Flow_Yes</bpmn:incoming>
      <bpmn:outgoing>Flow_4</bpmn:outgoing>
    </bpmn:userTask>
    <bpmn:sequenceFlow id="Flow_Yes" name="Sí" sourceRef="Gateway_1" targetRef="Task_Dir" />
    <bpmn:serviceTask id="Task_Emision" name="Emisión de PO a Proveedor">
      <bpmn:incoming>Flow_4</bpmn:incoming>
      <bpmn:incoming>Flow_No</bpmn:incoming>
      <bpmn:outgoing>Flow_5</bpmn:outgoing>
    </bpmn:serviceTask>
    <bpmn:sequenceFlow id="Flow_4" sourceRef="Task_Dir" targetRef="Task_Emision" />
    <bpmn:sequenceFlow id="Flow_No" name="No" sourceRef="Gateway_1" targetRef="Task_Emision" />
    <bpmn:endEvent id="End_1" name="PO Transmitida">
      <bpmn:incoming>Flow_5</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:sequenceFlow id="Flow_5" sourceRef="Task_Emision" targetRef="End_1" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_PO">
    <bpmndi:BPMNPlane id="BPMNPlane_PO" bpmnElement="Process_PO">
      <bpmndi:BPMNShape id="Start_1_di" bpmnElement="Start_1">
        <dc:Bounds x="160" y="162" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_Req_di" bpmnElement="Task_Req">
        <dc:Bounds x="250" y="140" width="140" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_Val_di" bpmnElement="Task_Val">
        <dc:Bounds x="440" y="140" width="140" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Gateway_1_di" bpmnElement="Gateway_1" isMarkerVisible="true">
        <dc:Bounds x="630" y="155" width="50" height="50" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_Dir_di" bpmnElement="Task_Dir">
        <dc:Bounds x="730" y="60" width="150" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_Emision_di" bpmnElement="Task_Emision">
        <dc:Bounds x="930" y="140" width="150" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="End_1_di" bpmnElement="End_1">
        <dc:Bounds x="1130" y="162" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow_1_di" bpmnElement="Flow_1">
        <di:waypoint x="196" y="180" />
        <di:waypoint x="250" y="180" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_2_di" bpmnElement="Flow_2">
        <di:waypoint x="390" y="180" />
        <di:waypoint x="440" y="180" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_3_di" bpmnElement="Flow_3">
        <di:waypoint x="580" y="180" />
        <di:waypoint x="630" y="180" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_Yes_di" bpmnElement="Flow_Yes">
        <di:waypoint x="655" y="155" />
        <di:waypoint x="655" y="100" />
        <di:waypoint x="730" y="100" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_4_di" bpmnElement="Flow_4">
        <di:waypoint x="880" y="100" />
        <di:waypoint x="1005" y="100" />
        <di:waypoint x="1005" y="140" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_No_di" bpmnElement="Flow_No">
        <di:waypoint x="680" y="180" />
        <di:waypoint x="930" y="180" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_5_di" bpmnElement="Flow_5">
        <di:waypoint x="1080" y="180" />
        <di:waypoint x="1130" y="180" />
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`
  },
  quality: {
    name: 'Liberación de Calidad Fabril & Entrada a Almacén',
    category: 'Producción & Calidad',
    codePrefix: 'WF-PRD',
    description: 'Protocolo de inspección textil de rollos producidos en telar Mayer & Cie previo al etiquetado WMS.',
    slaHours: 8,
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" targetNamespace="http://bpmn.io/schema/bpmn" id="Definitions_QC">
  <bpmn:process id="Process_QC" isExecutable="true">
    <bpmn:startEvent id="Start_QC" name="Rollo Producido">
      <bpmn:outgoing>Flow_QC_1</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:userTask id="Task_Insp" name="Pesaje e Inspección Visual">
      <bpmn:incoming>Flow_QC_1</bpmn:incoming>
      <bpmn:outgoing>Flow_QC_2</bpmn:outgoing>
    </bpmn:userTask>
    <bpmn:sequenceFlow id="Flow_QC_1" sourceRef="Start_QC" targetRef="Task_Insp" />
    <bpmn:userTask id="Task_Test" name="Prueba de Resistencia Textil">
      <bpmn:incoming>Flow_QC_2</bpmn:incoming>
      <bpmn:outgoing>Flow_QC_3</bpmn:outgoing>
    </bpmn:userTask>
    <bpmn:sequenceFlow id="Flow_QC_2" sourceRef="Task_Insp" targetRef="Task_Test" />
    <bpmn:serviceTask id="Task_WMS" name="Generación de QR y Ubicación en Racks">
      <bpmn:incoming>Flow_QC_3</bpmn:incoming>
      <bpmn:outgoing>Flow_QC_4</bpmn:outgoing>
    </bpmn:serviceTask>
    <bpmn:sequenceFlow id="Flow_QC_3" sourceRef="Task_Test" targetRef="Task_WMS" />
    <bpmn:endEvent id="End_QC" name="Lote Ubicado en WMS">
      <bpmn:incoming>Flow_QC_4</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:sequenceFlow id="Flow_QC_4" sourceRef="Task_WMS" targetRef="End_QC" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_QC">
    <bpmndi:BPMNPlane id="BPMNPlane_QC" bpmnElement="Process_QC">
      <bpmndi:BPMNShape id="Start_QC_di" bpmnElement="Start_QC">
        <dc:Bounds x="160" y="162" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_Insp_di" bpmnElement="Task_Insp">
        <dc:Bounds x="250" y="140" width="160" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_Test_di" bpmnElement="Task_Test">
        <dc:Bounds x="470" y="140" width="170" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_WMS_di" bpmnElement="Task_WMS">
        <dc:Bounds x="700" y="140" width="180" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="End_QC_di" bpmnElement="End_QC">
        <dc:Bounds x="940" y="162" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow_QC_1_di" bpmnElement="Flow_QC_1">
        <di:waypoint x="196" y="180" />
        <di:waypoint x="250" y="180" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_QC_2_di" bpmnElement="Flow_QC_2">
        <di:waypoint x="410" y="180" />
        <di:waypoint x="470" y="180" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_QC_3_di" bpmnElement="Flow_QC_3">
        <di:waypoint x="640" y="180" />
        <di:waypoint x="700" y="180" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_QC_4_di" bpmnElement="Flow_QC_4">
        <di:waypoint x="880" y="180" />
        <di:waypoint x="940" y="180" />
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`
  }
};

export default function BpmnInteractiveDesigner({ onModelSaved, nextProcessCode = 'WF-NUEVO-05' }) {
  const containerRef = useRef(null);
  const modelerRef = useRef(null);

  // Form State
  const [name, setName] = useState('Nuevo Workflow Automatizado');
  const [processCode, setProcessCode] = useState(nextProcessCode);
  const [category, setCategory] = useState('Compras & Abastecimiento');
  const [slaHours, setSlaHours] = useState(24);
  const [description, setDescription] = useState('Diseño de proceso desarrollado interactivamente en NytEX Process Suite.');
  const [selectedTemplate, setSelectedTemplate] = useState('purchases');

  // UI State
  const [selectedElement, setSelectedElement] = useState(null);
  const [elementProps, setElementProps] = useState({ id: '', name: '', role: '', documentation: '' });
  const [detectedSteps, setDetectedSteps] = useState([]);
  const [saving, setSaving] = useState(false);
  const [designerMessage, setDesignerMessage] = useState(null);

  // Auto-color elements according to Bizagi/Standard palette
  const applyColors = (element, modeling) => {
    if (!element || !modeling) return;
    let stroke, fill;
    if (element.type === 'bpmn:StartEvent') {
      stroke = '#16a34a'; fill = '#dcfce7';
    } else if (element.type === 'bpmn:EndEvent') {
      stroke = '#dc2626'; fill = '#fee2e2';
    } else if (element.type.includes('Gateway')) {
      stroke = '#d97706'; fill = '#fef3c7';
    } else if (element.type.includes('Task') || element.type === 'bpmn:Task') {
      stroke = '#2563eb'; fill = '#eff6ff';
    } else if (element.type.includes('Intermediate')) {
      stroke = '#ea580c'; fill = '#ffedd5';
    }
    if (stroke && fill) {
      try {
        modeling.setColor([element], { stroke, fill });
      } catch (err) {
        // Ignorar si el elemento ya está sincronizado
      }
    }
  };

  // Extraer las etapas del diagrama en tiempo real
  const updateDetectedSteps = (modeler) => {
    if (!modeler) return;
    try {
      const elementRegistry = modeler.get('elementRegistry');
      const all = elementRegistry.getAll();
      const taskElements = all.filter(el => 
        (el.type.includes('Task') || el.type === 'bpmn:Task') && el.businessObject?.name
      ).sort((a, b) => (a.x || 0) - (b.x || 0));

      const steps = taskElements.map((t, idx) => {
        let role = 'Responsable de Proceso';
        if (t.parent && t.parent.type === 'bpmn:Lane' && t.parent.businessObject?.name) {
          role = t.parent.businessObject.name;
        } else {
          const lower = (t.businessObject?.name || '').toLowerCase();
          if (lower.includes('compr') || lower.includes('cotiz')) role = 'Comprador';
          else if (lower.includes('presup') || lower.includes('cont')) role = 'Contralor';
          else if (lower.includes('direc') || lower.includes('geren') || lower.includes('visto')) role = 'Director de Finanzas';
          else if (lower.includes('calidad') || lower.includes('inspec')) role = 'Inspector de Calidad';
          else if (lower.includes('telar') || lower.includes('producc')) role = 'Operador Fabril';
          else if (lower.includes('emisión') || lower.includes('qr') || lower.includes('sistema') || lower.includes('wms')) role = 'Sistema / WMS';
        }
        return {
          step: idx + 1,
          name: t.businessObject.name,
          role
        };
      });

      setDetectedSteps(steps);
    } catch (e) {
      console.warn('Error detectando etapas:', e);
    }
  };

  const loadXmlIntoModeler = async (xmlString) => {
    if (!modelerRef.current) return;
    try {
      await modelerRef.current.importXML(xmlString);
      const canvas = modelerRef.current.get('canvas');
      canvas.zoom('fit-viewport');

      // Aplicar colores
      const elementRegistry = modelerRef.current.get('elementRegistry');
      const modeling = modelerRef.current.get('modeling');
      elementRegistry.getAll().forEach(el => applyColors(el, modeling));

      updateDetectedSteps(modelerRef.current);
    } catch (err) {
      console.error('Error importando XML a BPMN Modeler:', err);
    }
  };

  // Inicializar BPMN Modeler
  useEffect(() => {
    if (!containerRef.current) return;

    const modeler = new BpmnModeler({
      container: containerRef.current,
      keyboard: { bindTo: window }
    });
    modelerRef.current = modeler;

    // Cargar plantilla inicial
    const initialXml = TEMPLATES[selectedTemplate]?.xml || TEMPLATES.purchases.xml;
    loadXmlIntoModeler(initialXml);

    // Eventos de selección y actualización
    modeler.on('selection.changed', (e) => {
      if (e.newSelection && e.newSelection.length === 1) {
        const shape = e.newSelection[0];
        setSelectedElement(shape);
        setElementProps({
          id: shape.id,
          name: shape.businessObject?.name || '',
          role: shape.parent?.type === 'bpmn:Lane' ? shape.parent.businessObject?.name : '',
          documentation: shape.businessObject?.documentation?.[0]?.text || ''
        });
      } else {
        setSelectedElement(null);
      }
    });

    modeler.on('commandStack.changed', () => {
      updateDetectedSteps(modeler);
    });

    // Auto-colorear nuevos elementos creados o reemplazados
    modeler.on('commandStack.shape.create.postExecuted', (e) => {
      if (e.context?.shape) {
        applyColors(e.context.shape, modeler.get('modeling'));
      }
      updateDetectedSteps(modeler);
    });

    modeler.on('commandStack.shape.replace.postExecuted', (e) => {
      if (e.context?.newShape) {
        applyColors(e.context.newShape, modeler.get('modeling'));
      }
      updateDetectedSteps(modeler);
    });

    return () => {
      modeler.destroy();
    };
  }, []);

  // Cambiar plantilla
  const handleSelectTemplate = (templateKey) => {
    setSelectedTemplate(templateKey);
    const tmpl = TEMPLATES[templateKey];
    if (tmpl) {
      if (tmpl.name) setName(tmpl.name);
      if (tmpl.category) setCategory(tmpl.category);
      if (tmpl.slaHours) setSlaHours(tmpl.slaHours);
      if (tmpl.description) setDescription(tmpl.description);
      if (tmpl.codePrefix) setProcessCode(`${tmpl.codePrefix}-${String(Math.floor(Math.random() * 90) + 10)}`);
      loadXmlIntoModeler(tmpl.xml);
    }
  };

  // Modificar propiedades del nodo seleccionado
  const handleUpdateProp = (field, val) => {
    if (!selectedElement || !modelerRef.current) return;
    const modeling = modelerRef.current.get('modeling');
    setElementProps(prev => ({ ...prev, [field]: val }));

    if (field === 'name') {
      modeling.updateLabel(selectedElement, val);
      modeling.updateProperties(selectedElement, { name: val });
    } else if (field === 'documentation') {
      const bpmnFactory = modelerRef.current.get('bpmnFactory');
      const doc = bpmnFactory.create('bpmn:Documentation', { text: val });
      modeling.updateProperties(selectedElement, { documentation: [doc] });
    }
    updateDetectedSteps(modelerRef.current);
  };

  // Generar Pool con Carriles (Lanes)
  const handleAddPoolAndLanes = () => {
    if (!modelerRef.current) return;
    try {
      const modeler = modelerRef.current;
      const modeling = modeler.get('modeling');
      const elementFactory = modeler.get('elementFactory');
      const canvas = modeler.get('canvas');
      const root = canvas.getRootElement();

      const participant = elementFactory.createParticipantShape({ type: 'bpmn:Participant' });
      modeling.createShape(participant, { x: 120, y: 60, width: 850, height: 320 }, root);
      modeling.updateProperties(participant, { name: name || 'Proceso NytEX' });
      modeling.splitLane(participant, 2);

      const lanes = participant.children;
      if (lanes && lanes.length >= 2) {
        modeling.updateProperties(lanes[0], { name: 'Comprador / Solicitante' });
        modeling.updateProperties(lanes[1], { name: 'Dirección & Finanzas' });
      }
      canvas.zoom('fit-viewport');
      updateDetectedSteps(modeler);
    } catch (e) {
      alert('Asegúrate de tener espacio disponible en el lienzo para crear el Pool.');
    }
  };

  // Exportar SVG
  const handleExportSvg = async () => {
    if (!modelerRef.current) return;
    try {
      const { svg } = await modelerRef.current.saveSVG();
      const blob = new Blob([svg], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${processCode || 'proceso'}.svg`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Error exportando SVG');
    }
  };

  // Centrar Vista
  const handleFitViewport = () => {
    if (modelerRef.current) {
      modelerRef.current.get('canvas').zoom('fit-viewport');
    }
  };

  // Guardar y Publicar en NytEX (/api/process/models)
  const handleSaveAndPublish = async () => {
    if (!name.trim()) {
      alert('Por favor ingresa un nombre para el proceso.');
      return;
    }
    if (!processCode.trim()) {
      alert('Por favor especifica un código de proceso (ej: WF-COM-05).');
      return;
    }

    try {
      setSaving(true);
      setDesignerMessage(null);

      // 1. Obtener XML oficial
      const { xml } = await modelerRef.current.saveXML({ format: true });

      // 2. Extraer o armar steps detectados
      let stepsToSave = detectedSteps;
      if (stepsToSave.length === 0) {
        // Fallback si no tiene tareas nombradas explícitas
        stepsToSave = [
          { step: 1, name: 'Requisición / Solicitud Inicial', role: 'Comprador / Solicitante' },
          { step: 2, name: 'Validación de Políticas Corporativas', role: 'Contraloría' },
          { step: 3, name: 'Aprobación Directiva Final', role: 'Director de Finanzas' }
        ];
      }

      // 3. Payload
      const payload = {
        processCode: processCode.trim().toUpperCase(),
        name: name.trim(),
        category,
        version: 'v1.0',
        description: description.trim(),
        slaHours: parseInt(slaHours, 10) || 24,
        steps: stepsToSave,
        status: 'Desplegado',
        xml
      };

      // 4. POST al backend de NytEX
      const res = await fetch('/api/process/models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error al guardar el modelo en el backend.');
      }

      const savedModel = await res.json();
      setDesignerMessage({
        type: 'success',
        text: `¡Proceso ${savedModel.processCode} - "${savedModel.name}" publicado exitosamente en NytEX ERP! Ya está disponible en el Catálogo y listo para ser ejecutado.`
      });

      if (onModelSaved) {
        onModelSaved(savedModel);
      }
    } catch (err) {
      console.error('Error al guardar proceso BPMN:', err);
      setDesignerMessage({
        type: 'error',
        text: `Error al publicar en NytEX: ${err.message}`
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Barra Superior de Control y Metadatos */}
      <div className="p-4 bg-slate-900 text-white border-b border-slate-800 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <span className="p-2 bg-purple-600/30 border border-purple-500 rounded-xl text-lg">🎨</span>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-black tracking-wide text-white">Diseñador BPMN 2.0 Interactivo</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                Sincronización Nativa con NytEX
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Arrastra componentes del menú izquierdo, edita sus propiedades y publica el workflow directamente en el ERP.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Selector de Plantillas */}
          <select 
            value={selectedTemplate}
            onChange={(e) => handleSelectTemplate(e.target.value)}
            className="bg-slate-800 text-slate-200 border border-slate-700 text-xs rounded-lg px-2.5 py-1.5 font-medium hover:border-purple-500 transition-colors"
          >
            <option value="purchases">📋 Plantilla: Aprobación Compras (&gt; $50k)</option>
            <option value="quality">🔬 Plantilla: Calidad Fabril Textil</option>
            <option value="blank">⚪ Plantilla: Lienzo en Blanco</option>
          </select>

          <button
            onClick={handleAddPoolAndLanes}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
            title="Añadir Pool con carriles para dividir responsabilidades"
          >
            <span>🏊</span> + Carriles (Lanes)
          </button>

          <button
            onClick={handleFitViewport}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all"
            title="Ajustar y centrar diagrama"
          >
            🔍 Centrar
          </button>

          <button
            onClick={handleExportSvg}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all"
            title="Descargar diagrama en imagen SVG"
          >
            🖼️ SVG
          </button>

          <button
            onClick={handleSaveAndPublish}
            disabled={saving}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs px-4 py-1.5 rounded-lg shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              <>
                <span className="animate-spin text-sm">⏳</span>
                <span>Publicando...</span>
              </>
            ) : (
              <>
                <span>💾</span>
                <span>Guardar & Publicar en NytEX</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Formulario Rápido de Configuración del Proceso */}
      <div className="bg-slate-50 border-b border-gray-200 px-4 py-2.5 grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">Código del Proceso</label>
          <input 
            type="text" 
            value={processCode}
            onChange={(e) => setProcessCode(e.target.value.toUpperCase())}
            placeholder="WF-COM-05"
            className="w-full bg-white border border-gray-300 rounded px-2 py-1 font-mono font-bold text-purple-900 focus:outline-none focus:border-purple-600"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">Nombre del Workflow</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: Aprobación de Garantías Especiales"
            className="w-full bg-white border border-gray-300 rounded px-2 py-1 font-semibold text-gray-900 focus:outline-none focus:border-purple-600"
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">Categoría ERP</label>
          <select 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded px-2 py-1 text-gray-800 focus:outline-none focus:border-purple-600"
          >
            <option value="Compras & Abastecimiento">Compras & Abastecimiento</option>
            <option value="Ventas & Crédito">Ventas & Crédito</option>
            <option value="Producción & Calidad">Producción & Calidad</option>
            <option value="Talento & Nómina">Talento & Nómina</option>
            <option value="Logística & WMS">Logística & WMS</option>
            <option value="Finanzas & Tesorería">Finanzas & Tesorería</option>
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">SLA Máximo Permitido</label>
          <div className="flex items-center gap-1">
            <input 
              type="number" 
              value={slaHours}
              onChange={(e) => setSlaHours(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded px-2 py-1 font-mono font-semibold text-gray-900 focus:outline-none focus:border-purple-600"
            />
            <span className="text-[11px] text-gray-500 font-bold">hrs</span>
          </div>
        </div>
      </div>

      {/* Banner de Feedback si existe */}
      {designerMessage && (
        <div className={`px-4 py-2 text-xs font-bold flex justify-between items-center border-b ${
          designerMessage.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
            : 'bg-rose-50 text-rose-800 border-rose-200'
        }`}>
          <span>{designerMessage.type === 'success' ? '✓' : '⚠️'} {designerMessage.text}</span>
          <button onClick={() => setDesignerMessage(null)} className="text-gray-400 hover:text-gray-600 font-bold ml-4">✕</button>
        </div>
      )}

      {/* Área Central: Canvas + Panel Lateral */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Lienzo BPMN Canvas */}
        <div className="flex-1 relative h-full">
          <div ref={containerRef} className="bpmn-canvas-wrapper w-full h-full" />
        </div>

        {/* Panel Lateral de Propiedades y Detección de Etapas */}
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col z-10 shadow-sm overflow-y-auto">
          {/* Resumen de Etapas Detectadas en Tiempo Real */}
          <div className="p-4 border-b border-gray-100 bg-purple-50/50">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-900">
                Secuencia Detectada ({detectedSteps.length} Pasos)
              </span>
              <span className="text-[10px] font-mono bg-purple-200/60 text-purple-900 px-1.5 py-0.5 rounded font-bold">
                Auto-NytEX
              </span>
            </div>
            <p className="text-[11px] text-gray-500 mb-2">
              Estas etapas se sincronizarán en la tabla de procesos y alimentarán la trazabilidad en Process Mining:
            </p>
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {detectedSteps.map((st) => (
                <div key={st.step} className="bg-white border border-purple-100 rounded-lg p-2 text-xs shadow-2xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900">{st.step}. {st.name}</span>
                  </div>
                  <div className="text-[10px] text-purple-700 font-semibold mt-0.5 flex items-center gap-1">
                    <span>👤</span> Rol: <strong>{st.role}</strong>
                  </div>
                </div>
              ))}
              {detectedSteps.length === 0 && (
                <div className="text-[11px] text-gray-400 italic text-center py-2">
                  Arrastra o nombra tareas en el lienzo para detectar las etapas.
                </div>
              )}
            </div>
          </div>

          {/* Inspector del Elemento Seleccionado */}
          <div className="p-4 flex-1">
            <h3 className="text-xs font-black uppercase text-gray-700 mb-3 flex items-center gap-1.5">
              <span>⚙️</span> Inspector de Propiedades
            </h3>

            {selectedElement ? (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Tipo de Elemento</label>
                  <div className="font-mono text-[11px] bg-gray-100 text-gray-700 px-2 py-1 rounded border border-gray-200 font-bold">
                    {selectedElement.type}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Nombre / Etiqueta</label>
                  <input
                    type="text"
                    value={elementProps.name}
                    onChange={(e) => handleUpdateProp('name', e.target.value)}
                    placeholder="Ej: Aprobación de Gerencia"
                    className="bpmn-prop-input font-medium text-gray-900"
                  />
                  <span className="text-[10px] text-gray-400 mt-0.5 block">
                    También puedes hacer doble clic sobre la figura en el lienzo.
                  </span>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Documentación / Notas de Política</label>
                  <textarea
                    rows={3}
                    value={elementProps.documentation}
                    onChange={(e) => handleUpdateProp('documentation', e.target.value)}
                    placeholder="Instrucciones operativas para este paso..."
                    className="bpmn-prop-input resize-none"
                  />
                </div>

                <div className="p-2.5 bg-blue-50/60 border border-blue-100 rounded-lg text-[11px] text-blue-900">
                  💡 <strong>Tip:</strong> Puedes conectar tareas haciendo clic en la flecha de la figura y arrastrándola hacia la siguiente etapa.
                </div>
              </div>
            ) : (
              <div className="h-48 flex flex-col items-center justify-center text-center p-4 text-gray-400 border-2 border-dashed border-gray-100 rounded-xl">
                <span className="text-2xl mb-1">👆</span>
                <span className="text-xs font-semibold text-gray-500">Ningún elemento seleccionado</span>
                <span className="text-[11px] text-gray-400 mt-1">Haz clic en cualquier tarea, compuerta o evento en el lienzo para editar sus atributos.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
