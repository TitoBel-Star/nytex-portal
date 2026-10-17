const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const docDir = path.join(__dirname, 'Documentos');
if (!fs.existsSync(docDir)) {
  fs.mkdirSync(docDir, { recursive: true });
}

console.log('🚀 Iniciando generación del documento técnico: Ecosistema Contable Automatizado y Controles DTE...');

const htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ecosistema Contable Automatizado y Controles Preventivos de Errores - NyTEX ERP</title>
  <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

    :root {
      --primary: #1e3a8a;
      --primary-dark: #0f172a;
      --secondary: #0284c7;
      --accent: #d97706;
      --success: #059669;
      --danger: #dc2626;
      --warning: #d97706;
      --text: #1e293b;
      --text-muted: #64748b;
      --bg-light: #f8fafc;
      --border: #e2e8f0;
      --border-dark: #cbd5e1;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: var(--text);
      line-height: 1.55;
      font-size: 10.5pt;
      background-color: #ffffff;
      padding: 0;
    }

    .container {
      max-width: 100%;
      margin: 0 auto;
      padding: 10px;
    }

    /* Portada Ejecutiva */
    .cover-page {
      page-break-after: always;
      min-height: 92vh;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      border: 3px solid var(--primary);
      border-radius: 8px;
      padding: 40px;
      background: linear-gradient(145deg, #ffffff 0%, #f0f7ff 100%);
      position: relative;
    }

    .cover-badge {
      display: inline-block;
      background: var(--primary);
      color: #ffffff;
      font-size: 9pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      padding: 6px 16px;
      border-radius: 20px;
      margin-bottom: 20px;
    }

    .cover-title {
      font-size: 26pt;
      font-weight: 800;
      color: var(--primary-dark);
      line-height: 1.15;
      margin-bottom: 12px;
    }

    .cover-subtitle {
      font-size: 13pt;
      font-weight: 500;
      color: var(--secondary);
      margin-bottom: 25px;
      line-height: 1.4;
    }

    .cover-desc {
      font-size: 10pt;
      color: var(--text-muted);
      max-width: 90%;
      border-left: 4px solid var(--accent);
      padding-left: 15px;
      margin-bottom: 30px;
    }

    .cover-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
      margin-top: 20px;
    }

    .cover-card {
      background: #ffffff;
      border: 1px solid var(--border);
      border-radius: 6px;
      padding: 14px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.03);
    }

    .cover-card h4 {
      font-size: 9.5pt;
      color: var(--primary);
      margin-bottom: 4px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .cover-card p {
      font-size: 8.5pt;
      color: var(--text-muted);
    }

    .cover-footer {
      border-top: 1px solid var(--border-dark);
      padding-top: 15px;
      display: flex;
      justify-content: space-between;
      font-size: 8.5pt;
      color: var(--text-muted);
    }

    /* Estructura de Capítulos */
    .chapter {
      margin-bottom: 30px;
    }

    .page-break {
      page-break-before: always;
    }

    .no-break {
      page-break-inside: avoid;
    }

    h1.chapter-title {
      font-size: 16pt;
      font-weight: 800;
      color: var(--primary);
      border-bottom: 2px solid var(--primary);
      padding-bottom: 6px;
      margin-top: 25px;
      margin-bottom: 15px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    h2.section-title {
      font-size: 12.5pt;
      font-weight: 700;
      color: var(--primary-dark);
      margin-top: 18px;
      margin-bottom: 10px;
      border-left: 4px solid var(--secondary);
      padding-left: 10px;
    }

    h3.doc-title {
      font-size: 11pt;
      font-weight: 700;
      color: #0f172a;
      margin-top: 14px;
      margin-bottom: 6px;
      background: #f1f5f9;
      padding: 6px 12px;
      border-radius: 4px;
      border-left: 3px solid var(--accent);
    }

    p {
      margin-bottom: 10px;
      text-align: justify;
    }

    ul, ol {
      margin-left: 20px;
      margin-bottom: 12px;
    }

    li {
      margin-bottom: 5px;
    }

    /* Tarjetas de Documentos */
    .doc-box {
      border: 1px solid var(--border);
      background: #ffffff;
      border-radius: 6px;
      padding: 12px 14px;
      margin-bottom: 14px;
      page-break-inside: avoid;
    }

    .doc-meta {
      display: flex;
      gap: 12px;
      font-size: 8.5pt;
      color: var(--text-muted);
      margin-bottom: 8px;
      padding-bottom: 6px;
      border-bottom: 1px dashed var(--border);
    }

    .badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 7.5pt;
      font-weight: 700;
      text-transform: uppercase;
    }

    .badge-primary { background: #dbeafe; color: #1e40af; }
    .badge-success { background: #d1fae5; color: #065f46; }
    .badge-warning { background: #fef3c7; color: #92400e; }
    .badge-danger { background: #fee2e2; color: #991b1b; }

    /* Asientos Contables Box */
    .asiento-box {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 5px;
      padding: 8px 12px;
      margin: 8px 0;
      font-family: 'JetBrains Mono', monospace;
      font-size: 8.5pt;
    }

    .asiento-header {
      font-weight: 700;
      color: var(--primary);
      margin-bottom: 4px;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 2px;
      font-size: 8pt;
    }

    .asiento-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 2px;
    }

    .asiento-cargo { color: #1e3a8a; padding-left: 0; }
    .asiento-abono { color: #047857; padding-left: 20px; }

    /* Controles Box */
    .control-box {
      background: #fffbeb;
      border: 1px solid #fde68a;
      border-left: 4px solid var(--accent);
      border-radius: 4px;
      padding: 8px 12px;
      margin-top: 8px;
      font-size: 9pt;
    }

    .control-title {
      font-weight: 700;
      color: #92400e;
      margin-bottom: 4px;
      display: flex;
      align-items: center;
      gap: 5px;
    }

    /* Diagramas */
    .diagram-container {
      background: #ffffff;
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 16px;
      margin: 16px 0;
      text-align: center;
      page-break-inside: avoid;
    }

    .diagram-caption {
      font-size: 8.5pt;
      font-weight: 600;
      color: var(--text-muted);
      margin-top: 8px;
      text-align: center;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* Tablas */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 14px 0;
      font-size: 8.5pt;
      page-break-inside: avoid;
    }

    th, td {
      border: 1px solid var(--border-dark);
      padding: 6px 8px;
      text-align: left;
    }

    th {
      background-color: var(--primary);
      color: #ffffff;
      font-weight: 600;
      text-transform: uppercase;
      font-size: 8pt;
      letter-spacing: 0.4px;
    }

    tr:nth-child(even) {
      background-color: #f8fafc;
    }

    .text-center { text-align: center; }
    .text-right { text-align: right; }
    .font-mono { font-family: 'JetBrains Mono', monospace; }
  </style>
</head>
<body>

<div class="container">

  <!-- ==================== PORTADA EJECUTIVA ==================== -->
  <div class="cover-page">
    <div>
      <span class="cover-badge">Manual de Arquitectura y Control Contable</span>
      <h1 class="cover-title">ECOSISTEMA CONTABLE<br>AUTONOMIZADO Y CONTROLES<br>PREVENTIVOS DE ERRORES</h1>
      <h2 class="cover-subtitle">Modelado Técnico de Operaciones Continuas, Determinación de Cuentas y Marco Tributario de El Salvador (DTE / Ministerio de Hacienda)</h2>
      
      <p class="cover-desc">
        Guía integral de arquitectura empresarial que formaliza el funcionamiento de la contabilidad sin intervención humana (Continuous Accounting), la automatización de la partida doble y la implementación de barreras sistemáticas contra descuadres, duplicidades, inconsistencias fiscales y fraudes corporativos.
      </p>

      <div class="cover-grid">
        <div class="cover-card">
          <h4>🏛️ Marco Fiscal El Salvador</h4>
          <p>Integración en tiempo real con la API del Ministerio de Hacienda (DGII), validación de esquemas JSON, Códigos de Generación (UUID), Sellos de Recepción y Libros de IVA (F-07).</p>
        </div>
        <div class="cover-card">
          <h4>⚡ Motor Orientado a Eventos</h4>
          <p>Mapeo algorítmico de eventos operativos (Venta, Compra, Despacho, Pago, Cobro, Nómina) hacia pólizas contables inmediatas y conciliadas al milisegundo.</p>
        </div>
        <div class="cover-card">
          <h4>🛡️ Cruce a 3 Vías (Three-Way Match)</h4>
          <p>Validación obligatoria entre Orden de Compra (PO), Entrada de Almacén (GRN) y Factura de Proveedor para blindar la tesorería antes de cualquier dispersión.</p>
        </div>
        <div class="cover-card">
          <h4>📊 Balanza Cuadrada Ininterrumpida</h4>
          <p>Verificación continua de la ecuación contable (Activo = Pasivo + Capital), tolerancia cero al descuadre y bandeja de excepciones para retención de anomalías.</p>
        </div>
      </div>
    </div>

    <div class="cover-footer">
      <div><strong>Plataforma:</strong> NyTEX ERP & Core Contable</div>
      <div><strong>Localización:</strong> El Salvador (USD / Tasas IVA 13% / Renta 10%)</div>
      <div><strong>Versión Documental:</strong> 4.5 Enterprise • Octubre 2026</div>
    </div>
  </div>

  <!-- ==================== CAPÍTULO 1 ==================== -->
  <div class="chapter page-break">
    <h1 class="chapter-title">Capítulo 1: Fundamentos de la Contabilidad Autónoma (Continuous Accounting)</h1>
    
    <p>
      La contabilidad tradicional opera de forma retrospectiva e históricamente lenta: los documentos se acumulan en papel o correos, los capturistas digitan asientos contables a final de mes y los auditores descubren descuadres semanas después de haber ocurrido los hechos.
    </p>
    <p>
      El modelo de <strong>Contabilidad Autónoma Orientada a Eventos (Event-Driven Accounting)</strong> invierte completamente este paradigma. En este sistema, <strong>ningún usuario digita pólizas manualmente</strong>. Cada hecho operativo real (un camión saliendo de bodega, un cliente pagando por transferencia, el timbrado de una nómina) genera en tiempo real una instrucción contable balanceada.
    </p>

    <div class="diagram-container">
      <div class="mermaid">
flowchart LR
    Op["Operación de Negocio\n(Venta, Compra, Pago, Nómina)"] --> Engine["Motor de Determinación\nde Cuentas (Reglas)"]
    Engine --> Check{"Filtros de Control\nPreventivo"}
    Check -->|Pasa Validaciones| Poliza["Póliza Automática Inmediata\n(Diario, Ingreso, Egreso)"]
    Check -->|Discrepancia / Error| Excep["Bandeja de Cuarentena\n(Alerta a Contraloría)"]
    Poliza --> Balanza["Balanza de Comprobación\nCuadrada en Tiempo Real"]
      </div>
      <div class="diagram-caption">Figura 1.1: Arquitectura de Procesamiento y Filtros Preventivos</div>
    </div>

    <h2 class="section-title">Pilares de la Arquitectura de Control</h2>
    <ul>
      <li><strong>Regla de Oro de Partida Doble:</strong> $\sum \text{Debe} = \sum \text{Haber}$. El sistema bloquea a nivel de transacción de base de datos cualquier póliza con diferencia superior a $\$0.00$.</li>
      <li><strong>Inmutabilidad y Pistas de Auditoría (Audit Trail):</strong> Las pólizas asentadas no pueden modificarse ni eliminarse. Todo ajuste se realiza mediante una póliza de reversión o reclasificación debidamente autorizada.</li>
      <li><strong>Aislamiento en Cuarentena (Exception Management):</strong> Si una transacción presenta una anomalía (ej. falta una subcuenta contable), la transacción se aísla sin detener el resto de las operaciones de la compañía.</li>
    </ul>
  </div>

  <!-- ==================== CAPÍTULO 2 ==================== -->
  <div class="chapter page-break">
    <h1 class="chapter-title">Capítulo 2: Bloque 1 — Documentos Tributarios Electrónicos (DTE - El Salvador)</h1>
    
    <p>
      En El Salvador, la facturación electrónica se rige bajo la normativa del <strong>Ministerio de Hacienda (MH)</strong> y la <strong>Dirección General de Impuestos Internos (DGII)</strong>. Toda operación genera archivos <strong>JSON</strong> firmados electrónicamente mediante el estándar <em>JSON Web Signature (JWS)</em> con un certificado digital autorizado.
    </p>

    <div class="diagram-container">
      <div class="mermaid">
flowchart TD
    DTE_IN["Recepción / Emisión de DTE\n(JSON Firmado con JWS)"] --> VAL_FIRM["1. Verificación Criptográfica\n(Validez de Certificado Digital)"]
    VAL_FIRM --> API_MH["2. Consulta a API Ministerio de Hacienda\n(Verificar Sello de Recepción y Estado 'Procesado')"]
    API_MH --> VAL_PADRON["3. Validación de Padrón Tributario\n(NIT / NRC Vigente y Activo)"]
    VAL_PADRON --> VAL_TAX["4. Validación Aritmética y Retenciones\n(IVA 13%, Retención 1% Gran Contribuyente, Renta 10%)"]
    VAL_TAX -->|100% Correcto| CONTAB["Contabilización Inmediata\n(Póliza + Libro de IVA F-07)"]
    VAL_TAX -->|Fallo o Inconsistencia| HOLD["Bloqueo y Retención de Pago\n(Alerta Fiscal Automática)"]
      </div>
      <div class="diagram-caption">Figura 2.1: Ciclo de Validación Automática con el Ministerio de Hacienda</div>
    </div>

    <!-- DTE-01 -->
    <div class="doc-box">
      <div class="doc-meta">
        <span class="badge badge-primary">DTE-01</span>
        <strong>Factura Electrónica (Consumidor Final / B2C)</strong>
        <span>Impacto: Ventas y Tesorería</span>
      </div>
      <p><strong>Propósito:</strong> Documenta ventas a consumidores finales donde el IVA del 13% ya se encuentra incorporado en el precio unitario y no confiere crédito fiscal.</p>
      
      <div class="asiento-box">
        <div class="asiento-header">Póliza Automática de Ingreso / Venta</div>
        <div class="asiento-row asiento-cargo"><span>(+) 1101-01 Caja General / Bancos</span><span>$113.00</span></div>
        <div class="asiento-row asiento-abono"><span>(-) 4101-01 Ingresos por Venta Local</span><span>$100.00</span></div>
        <div class="asiento-row asiento-abono"><span>(-) 2106-01 Débito Fiscal IVA (13%)</span><span>$13.00</span></div>
        <div class="asiento-row asiento-cargo"><span>(+) 5101-01 Costo de Ventas</span><span>$60.00</span></div>
        <div class="asiento-row asiento-abono"><span>(-) 1105-01 Inventario de Producto Terminado</span><span>$60.00</span></div>
      </div>

      <div class="control-box">
        <div class="control-title">🛡️ Controles Automáticos y Bloqueos</div>
        <ul>
          <li><strong>Regla de Identificación Obligatoria ($\ge \$200.00$ USD):</strong> Según el Código Tributario salvadoreño, si el importe es igual o mayor a $\$200.00$, el sistema exige DUI, pasaporte o carnet de extranjería, nombre completo y dirección. Si faltan datos, el motor bloquea el timbrado.</li>
          <li><strong>Cuadratura Automática contra Corte Z de Caja:</strong> Se valida al cierre que el total acumulado de DTE-01 coincida al centavo con los cobros en efectivo, tarjeta o transferencia recibidos.</li>
        </ul>
      </div>
    </div>

    <!-- DTE-03 -->
    <div class="doc-box">
      <div class="doc-meta">
        <span class="badge badge-primary">DTE-03</span>
        <strong>Comprobante de Crédito Fiscal - CCF (Operaciones B2B)</strong>
        <span>Impacto: Clientes, Proveedores e IVA</span>
      </div>
      <p><strong>Propósito:</strong> Ampara compras y ventas entre contribuyentes registrados en IVA, desglosando obligatoriamente el valor neto y el 13% de IVA para sustentar el crédito fiscal.</p>
      
      <div class="asiento-box">
        <div class="asiento-header">Póliza de Emisión (Venta a Crédito)</div>
        <div class="asiento-row asiento-cargo"><span>(+) 1102-01 Clientes Nacionales (CxC)</span><span>$1,130.00</span></div>
        <div class="asiento-row asiento-abono"><span>(-) 4101-01 Venta a Contribuyentes</span><span>$1,000.00</span></div>
        <div class="asiento-row asiento-abono"><span>(-) 2106-01 Débito Fiscal IVA (13%)</span><span>$130.00</span></div>
      </div>

      <div class="control-box">
        <div class="control-title">🛡️ Controles Automáticos y Bloqueos</div>
        <ul>
          <li><strong>Verificación de NRC en el Padrón de Hacienda:</strong> Valida que el NRC del cliente esté activo y autorizado por el MH para recibir crédito fiscal. Si no es contribuyente activo, rechaza la emisión de CCF y obliga a emitir Factura DTE-01.</li>
          <li><strong>Protección contra Duplicidad de Código de Generación (UUID):</strong> En facturas recibidas de proveedores, el sistema impide almacenar dos veces el mismo Código de Generación, evitando duplicar cuentas por pagar.</li>
          <li><strong>Cálculo Automático de Retención del 1%:</strong> Si el cliente o proveedor es catalogado como Gran Contribuyente, el sistema calcula de inmediato el 1% de retención de IVA para montos iguales o mayores a $\$100.00$.</li>
        </ul>
      </div>
    </div>

    <!-- DTE-04 -->
    <div class="doc-box">
      <div class="doc-meta">
        <span class="badge badge-primary">DTE-04</span>
        <strong>Nota de Remisión Electrónica (Traslado y Tránsito)</strong>
        <span>Impacto: WMS, Logística y Custodia de Inventario</span>
      </div>
      <p><strong>Propósito:</strong> Respaldar legalmente el transporte de mercadería en el territorio salvadoreño sin implicar transferencia de propiedad ni causar IVA de forma directa.</p>
      
      <div class="asiento-box">
        <div class="asiento-header">Póliza de Reclasificación de Inventario</div>
        <div class="asiento-row asiento-cargo"><span>(+) 1105-08 Inventario en Tránsito / Consignación</span><span>$5,000.00</span></div>
        <div class="asiento-row asiento-abono"><span>(-) 1105-01 Inventario Bodega Central</span><span>$5,000.00</span></div>
      </div>

      <div class="control-box">
        <div class="control-title">🛡️ Controles Automáticos y Bloqueos</div>
        <ul>
          <li><strong>Datos Obligatorios de Transporte y Placas:</strong> Bloquea la firma digital si el formulario no cuenta con el número de placa del vehículo, marca y DUI/licencia del conductor.</li>
          <li><strong>Alerta de Caducidad de Traslado:</strong> Si una remisión supera las 72 horas sin vincularse a un CCF (DTE-03) o reingreso al almacén, se dispara una notificación de auditoría por mercancía varada.</li>
        </ul>
      </div>
    </div>

    <!-- DTE-05 -->
    <div class="doc-box">
      <div class="doc-meta">
        <span class="badge badge-primary">DTE-05</span>
        <strong>Nota de Crédito Electrónica (Devoluciones y Rebajas)</strong>
        <span>Impacto: Regularización de IVA y CxC</span>
      </div>
      <p><strong>Propósito:</strong> Ajustar a la baja el valor de un Crédito Fiscal previamente timbrado por concepto de devolución física de bienes, errores en cobro o bonificaciones concedidas.</p>
      
      <div class="asiento-box">
        <div class="asiento-header">Póliza de Rebaja y Reintegro de Débito Fiscal</div>
        <div class="asiento-row asiento-cargo"><span>(+) 4101-05 Devoluciones y Rebajas sobre Ventas</span><span>$200.00</span></div>
        <div class="asiento-row asiento-cargo"><span>(+) 2106-01 Débito Fiscal IVA (Restitución 13%)</span><span>$26.00</span></div>
        <div class="asiento-row asiento-abono"><span>(-) 1102-01 Clientes Nacionales (CxC)</span><span>$226.00</span></div>
        <div class="asiento-row asiento-cargo"><span>(+) 1105-01 Inventario (Reingreso al Costo)</span><span>$120.00</span></div>
        <div class="asiento-row asiento-abono"><span>(-) 5101-01 Costo de Ventas</span><span>$120.00</span></div>
      </div>

      <div class="control-box">
        <div class="control-title">🛡️ Controles Automáticos y Bloqueos</div>
        <ul>
          <li><strong>Enlace Obligatorio al Documento Padre:</strong> Exige registrar el Código de Generación del CCF origen. No permite notas de crédito sin documento de referencia.</li>
          <li><strong>Tope de Valor Máximo Acumulado:</strong> La suma total de notas de crédito aplicadas a una factura jamás puede rebasar el importe original de la factura. El sistema bloquea cualquier excedente.</li>
          <li><strong>Plazo Legal de Restitución de Débito (3 meses):</strong> El sistema advierte si han transcurrido más de 3 meses calendario desde la emisión de la factura de origen, impidiendo la deducción del débito de IVA si venció el término de ley.</li>
        </ul>
      </div>
    </div>

    <!-- DTE-06 -->
    <div class="doc-box">
      <div class="doc-meta">
        <span class="badge badge-primary">DTE-06</span>
        <strong>Nota de Débito Electrónica (Recargos e Intereses)</strong>
        <span>Impacto: Incremento de Cuenta por Cobrar e IVA</span>
      </div>
      <p><strong>Propósito:</strong> Aumentar el saldo exigible al cliente por concepto de penalidades contractuales, intereses moratorios o fletes no contemplados originalmente.</p>
      
      <div class="asiento-box">
        <div class="asiento-header">Póliza de Cargo Adicional</div>
        <div class="asiento-row asiento-cargo"><span>(+) 1102-01 Clientes Nacionales (CxC)</span><span>$113.00</span></div>
        <div class="asiento-row asiento-abono"><span>(-) 4201-01 Otros Ingresos (Intereses / Moras)</span><span>$100.00</span></div>
        <div class="asiento-row asiento-abono"><span>(-) 2106-01 Débito Fiscal IVA (13%)</span><span>$13.00</span></div>
      </div>

      <div class="control-box">
        <div class="control-title">🛡️ Controles Automáticos y Bloqueos</div>
        <ul>
          <li><strong>Cálculo Paramétrico de Intereses:</strong> Calcula automáticamente la tasa contractual pactada sobre los días de atraso, evitando errores de digitación de montos.</li>
          <li><strong>Validación de Estado Activo:</strong> Impide emitir una nota de débito si el documento original fue invalidado o cancelado.</li>
        </ul>
      </div>
    </div>

    <!-- DTE-07 -->
    <div class="doc-box">
      <div class="doc-meta">
        <span class="badge badge-primary">DTE-07</span>
        <strong>Comprobante de Retención de IVA (1% Grandes Contribuyentes)</strong>
        <span>Impacto: Proveedores y Cuentas de Retención Fiscal</span>
      </div>
      <p><strong>Propósito:</strong> Certifica la retención del 1% del valor de compra antes de IVA efectuada a proveedores según el mandato del artículo 162 del Código Tributario.</p>
      
      <div class="asiento-box">
        <div class="asiento-header">Póliza en el Comprador (Gran Contribuyente Retenedor)</div>
        <div class="asiento-row asiento-cargo"><span>(+) 2101-01 Proveedores Locales (CxP)</span><span>$10.00</span></div>
        <div class="asiento-row asiento-abono"><span>(-) 2106-05 IVA Retenido 1% por Enterar al MH</span><span>$10.00</span></div>
      </div>

      <div class="control-box">
        <div class="control-title">🛡️ Controles Automáticos y Bloqueos</div>
        <ul>
          <li><strong>Umbral Legal de Retención ($\ge \$100.00$ USD):</strong> El sistema solo dispara el cálculo del 1% si la suma base de la transacción es igual o superior a $\$100.00$ sin IVA.</li>
          <li><strong>Validación de Clasificación Fiscal:</strong> Cruza los datos con la lista de Grandes Contribuyentes del MH. Si un proveedor también es Gran Contribuyente, el sistema bloquea la retención (entre Grandes Contribuyentes no se aplica retención del 1%).</li>
        </ul>
      </div>
    </div>

    <!-- DTE-08 y DTE-09 -->
    <div class="doc-box">
      <div class="doc-meta">
        <span class="badge badge-primary">DTE-08 / DTE-09</span>
        <strong>Comprobantes de Liquidación y Documentos Contables</strong>
        <span>Impacto: Ventas por Terceros, Seguros y Comisiones</span>
      </div>
      <p><strong>Propósito:</strong> Liquidar formalmente operaciones ejecutadas por cuenta de terceros (consignaciones, remates, mandatos comerciales) y operaciones financieras/aseguradoras.</p>
      <div class="control-box">
        <div class="control-title">🛡️ Controles Automáticos y Bloqueos</div>
        <ul>
          <li><strong>Separación Estricta de Comisión vs. Venta:</strong> El sistema separa contablemente el ingreso propio (la comisión afecta a IVA) del pasivo a pagar al dueño del bien, evitando registrar ventas ajenas como ingresos propios.</li>
        </ul>
      </div>
    </div>

    <!-- DTE-11 -->
    <div class="doc-box">
      <div class="doc-meta">
        <span class="badge badge-primary">DTE-11</span>
        <strong>Factura de Exportación Electrónica</strong>
        <span>Impacto: Ventas Internacionales (Tasa 0% IVA)</span>
      </div>
      <p><strong>Propósito:</strong> Amparar ventas al exterior de mercadería o servicios transfronterizos que gozan de exención o tasa cero de IVA.</p>
      
      <div class="asiento-box">
        <div class="asiento-header">Póliza de Exportación</div>
        <div class="asiento-row asiento-cargo"><span>(+) 1102-02 Clientes en el Extranjero</span><span>$25,000.00</span></div>
        <div class="asiento-row asiento-abono"><span>(-) 4101-02 Ventas de Exportación (Tasa 0%)</span><span>$25,000.00</span></div>
      </div>

      <div class="control-box">
        <div class="control-title">🛡️ Controles Automáticos y Bloqueos</div>
        <ul>
          <li><strong>Blindaje de Tasa 0% de IVA:</strong> El sistema rechaza cualquier intento de añadir débito fiscal local (13%).</li>
          <li><strong>Validación Aduanera (DUCA):</strong> Bloquea la conciliación definitiva de la póliza hasta que se adjunte el número de Declaración Única Centroamericana (DUCA) que valida la salida física de aduanas.</li>
        </ul>
      </div>
    </div>

    <!-- DTE-14 -->
    <div class="doc-box">
      <div class="doc-meta">
        <span class="badge badge-primary">DTE-14</span>
        <strong>Factura de Sujeto Excluido</strong>
        <span>Impacto: Compras a Personas Naturales sin NRC / Renta 10%</span>
      </div>
      <p><strong>Propósito:</strong> Documentar la adquisición de bienes o servicios contratados con personas naturales que no son contribuyentes registrados de IVA (art. 119-B Código Tributario).</p>
      
      <div class="asiento-box">
        <div class="asiento-header">Póliza con Retención de Renta del 10% (Art. 156)</div>
        <div class="asiento-row asiento-cargo"><span>(+) 5202-01 Gastos por Servicios Profesionales</span><span>$500.00</span></div>
        <div class="asiento-row asiento-abono"><span>(-) 2106-08 Retención de ISR 10% por Pagar (F-14)</span><span>$50.00</span></div>
        <div class="asiento-row asiento-abono"><span>(-) 1101-02 Bancos (Importe Líquido Pagado)</span><span>$450.00</span></div>
      </div>

      <div class="control-box">
        <div class="control-title">🛡️ Controles Automáticos y Bloqueos</div>
        <ul>
          <li><strong>Verificación de No Contribuyente en Padrón MH:</strong> Consulta la base de Hacienda con el DUI/NIT del proveedor. Si el individuo posee NRC activo, el sistema **bloquea la emisión del DTE-14** y exige un Crédito Fiscal (DTE-03).</li>
          <li><strong>Aplicación Automática de Retención de Renta:</strong> Aplica de forma obligatoria la retención de Impuesto sobre la Renta correspondiente (10% en servicios) y alimenta el formulario fiscal mensual F-14.</li>
        </ul>
      </div>
    </div>

    <!-- DTE-15 -->
    <div class="doc-box">
      <div class="doc-meta">
        <span class="badge badge-primary">DTE-15</span>
        <strong>Comprobante de Donación Electrónico</strong>
        <span>Impacto: Donaciones Deducibles de Renta</span>
      </div>
      <p><strong>Propósito:</strong> Amparar donaciones recibidas por fundaciones o entidades sin fines de lucro debidamente calificadas por la DGII.</p>
      <div class="control-box">
        <div class="control-title">🛡️ Controles Automáticos y Bloqueos</div>
        <ul>
          <li><strong>Verificación de Calificación de Entidad Donataria:</strong> Valida que la institución cuente con resolución ejecutiva vigente del Ministerio de Hacienda para expedir recibos deducibles de ISR.</li>
        </ul>
      </div>
    </div>
  </div>

  <!-- ==================== CAPÍTULO 3 ==================== -->
  <div class="chapter page-break">
    <h1 class="chapter-title">Capítulo 3: Bloque 2 — Cadena de Suministro, Almacén y Three-Way Matching</h1>
    
    <p>
      El control de compras es la principal línea de defensa financiera contra fraudes internos, sobreprecios y facturación fantasma. El motor contable implementa de forma obligatoria el <strong>Cruce a 3 Vías (Three-Way Matching)</strong>.
    </p>

    <div class="diagram-container">
      <div class="mermaid">
sequenceDiagram
    autonumber
    actor Compras as Dpto. Compras
    actor Almacen as Bodega / WMS
    actor Proveedor as Proveedor Externo
    participant ERP as Motor ERP & Contabilidad
    Compras->>ERP: 1. Emisión de Orden de Compra (PO autorizada)
    Proveedor->>Almacen: 2. Entrega Física + Nota de Remisión
    Almacen->>ERP: 3. Entrada de Almacén (GRN - Conteo Ciego)
    Proveedor->>ERP: 4. Factura Electrónica (DTE-03 en JSON)
    ERP->>ERP: 5. EJECUCIÓN AUTOMÁTICA THREE-WAY MATCHING
    alt Coinciden: Cantidades, Precios y RFC/NRC
        ERP->>ERP: Reconoce Pasivo Oficial (CxP) y Programa Fecha de Pago
    else Discrepancia > Tolerancia (0%)
        ERP->>ERP: BLOQUEO AUTOMÁTICO EN 'HOLD' (Alerta a Auditoría)
    end
      </div>
      <div class="diagram-caption">Figura 3.1: Protocolo de Cruce a 3 Vías (Three-Way Matching)</div>
    </div>

    <div class="doc-box">
      <h3 class="doc-title">Orden de Compra / Pedido (Purchase Order - PO)</h3>
      <p>Documento contractual interno que formaliza los precios unitarios, cantidades acordadas y condiciones de pago pactadas.</p>
      <div class="control-box">
        <div class="control-title">🛡️ Controles Automáticos</div>
        <ul>
          <li><strong>Control Presupuestario en Tiempo Real:</strong> Si el centro de costos que emite la OC no tiene saldo presupuestario disponible para el mes, el sistema deniega la creación del documento.</li>
          <li><strong>Autorización Jerárquica por Firmas Digitales:</strong> Reglas automáticas según el importe (ej. hasta $\$1,000$ jefe de compras; de $\$1,001$ a $\$10,000$ director financiero; más de $\$10,000$ comité directivo).</li>
        </ul>
      </div>
    </div>

    <div class="doc-box">
      <h3 class="doc-title">Entrada de Almacén / Recepción de Mercancía (GRN - Goods Receipt Note)</h3>
      <p>Certificación física de descarga en bodega. Genera la provisión de pasivo puente antes de que el proveedor entregue la factura.</p>
      <div class="asiento-box">
        <div class="asiento-header">Póliza de Provisión de Inventario (Entrada Física)</div>
        <div class="asiento-row asiento-cargo"><span>(+) 1105-01 Inventario de Materias Primas</span><span>$10,000.00</span></div>
        <div class="asiento-row asiento-abono"><span>(-) 2103-01 Pasivo Transitorio por Mercancías por Facturar</span><span>$10,000.00</span></div>
      </div>
      <div class="control-box">
        <div class="control-title">🛡️ Controles Automáticos</div>
        <ul>
          <li><strong>Conteo Ciego (Blind Receiving):</strong> El operario de bodega no ve las cantidades esperadas; digita lo que cuenta físicamente para evitar recepciones automáticas sin conteo real.</li>
          <li><strong>Bloqueo de Sobre-Recepción:</strong> No permite ingresar más unidades que las autorizadas en la Orden de Compra sin una enmienda oficial debidamente autorizada.</li>
        </ul>
      </div>
    </div>

    <div class="doc-box">
      <h3 class="doc-title">Salida de Almacén, Consumos de Producción y Mermas</h3>
      <p>Descargo de materiales para alimentar las órdenes de producción textil/manufactura o bajas por merma técnica.</p>
      <div class="asiento-box">
        <div class="asiento-header">Póliza de Consumo en Línea de Producción</div>
        <div class="asiento-row asiento-cargo"><span>(+) 1105-04 Producción en Proceso (Materia Prima Directa)</span><span>$4,200.00</span></div>
        <div class="asiento-row asiento-abono"><span>(-) 1105-01 Inventario de Materias Primas</span><span>$4,200.00</span></div>
      </div>
      <div class="control-box">
        <div class="control-title">🛡️ Controles Automáticos</div>
        <ul>
          <li><strong>Límite de Tolerancia de Merma:</strong> Si el porcentaje de desperdicio registrado en un lote supera el estándar configurado (ej. 2.0%), la orden se bloquea para requerir justificación técnica de la gerencia de planta.</li>
        </ul>
      </div>
    </div>
  </div>

  <!-- ==================== CAPÍTULO 4 ==================== -->
  <div class="chapter page-break">
    <h1 class="chapter-title">Capítulo 4: Bloque 3 — Tesorería, Pagos y Conciliación Bancaria</h1>
    
    <div class="doc-box">
      <h3 class="doc-title">Recibo de Cobro / Comprobante de Ingreso de Caja</h3>
      <p>Ampara la percepción de fondos por liquidación de cuentas por cobrar a clientes.</p>
      <div class="asiento-box">
        <div class="asiento-header">Póliza de Ingreso Bancario</div>
        <div class="asiento-row asiento-cargo"><span>(+) 1101-02 Banco Agrícola / Cuscatlán</span><span>$1,130.00</span></div>
        <div class="asiento-row asiento-abono"><span>(-) 1102-01 Clientes Nacionales (CxC)</span><span>$1,130.00</span></div>
      </div>
      <div class="control-box">
        <div class="control-title">🛡️ Controles Automáticos</div>
        <ul>
          <li><strong>Amortización Estricta de Folios:</strong> El sistema prohíbe abonar fondos a una cuenta de cliente de forma global; exige asociar el cobro a facturas y notas de débito específicas pendientes.</li>
          <li><strong>Bloqueo de Sobrepago:</strong> Impide que el monto abonado a una factura supere el saldo insoluto de la misma.</li>
        </ul>
      </div>
    </div>

    <div class="doc-box">
      <h3 class="doc-title">Comprobante de Egreso / Dispersión Bancaria (Transferencia / Cheque)</h3>
      <p>Formaliza la liquidación de obligaciones con proveedores, acreedores y servicios públicos.</p>
      <div class="asiento-box">
        <div class="asiento-header">Póliza de Egreso Bancario</div>
        <div class="asiento-row asiento-cargo"><span>(+) 2101-01 Cuentas por Pagar Proveedores</span><span>$5,000.00</span></div>
        <div class="asiento-row asiento-abono"><span>(-) 1101-02 Banco Cuenta Operativa</span><span>$5,000.00</span></div>
      </div>
      <div class="control-box">
        <div class="control-title">🛡️ Controles Automáticos</div>
        <ul>
          <li><strong>Validación de Cuentas Bancarias Autorizadas (Doble Aprobación):</strong> Solo se permite transferir a cuentas bancarias registradas en el expediente del proveedor. Modificar una cuenta requiere aprobación mancomunada para prevenir ataques de suplantación.</li>
          <li><strong>Inhabilitación de Pago por Falta de Three-Way Match:</strong> El botón de dispersión permanece bloqueado si la factura no cuenta con recepción física de bodega y orden de compra conformes.</li>
        </ul>
      </div>
    </div>

    <div class="doc-box">
      <h3 class="doc-title">Conciliación Bancaria Automática con Inteligencia Algorítmica</h3>
      <p>Proceso continuo de confrontación entre los movimientos de los estados de cuenta bancarios (extractos API/MT940) y los libros contables.</p>
      <div class="control-box">
        <div class="control-title">🛡️ Controles Automáticos</div>
        <ul>
          <li><strong>Emparejamiento de Cuatro Factores:</strong> El algoritmo vincula movimientos basándose en: Importe exacto, Fecha (+/- 48 hrs), Referencia bancaria y Contraparte (NIT/NRC).</li>
          <li><strong>Detección de Movimientos Huérfanos:</strong> Todo cargo bancario no respaldado por una póliza se clasifica instantáneamente en la cuenta de <em>Aclaraciones Bancarias</em> y genera una alerta por posibles comisiones no registradas o cargos indebidos.</li>
        </ul>
      </div>
    </div>
  </div>

  <!-- ==================== CAPÍTULO 5 ==================== -->
  <div class="chapter page-break">
    <h1 class="chapter-title">Capítulo 5: Bloque 4 — Nómina, Salarios y Cargas Laborales</h1>
    
    <p>
      El cálculo de nómina en El Salvador está supeditado a los límites máximos cotizables de la legislación laboral vigente: <strong>ISSS (Instituto Salvadoreño del Seguro Social)</strong>, <strong>AFP (Administradoras de Fondos de Pensiones)</strong>, <strong>INSAFORP</strong> y las tablas quincenales del <strong>Impuesto sobre la Renta (F-14)</strong>.
    </p>

    <div class="doc-box">
      <h3 class="doc-title">Planilla de Sueldos y Retenciones de Empleados</h3>
      <p>Genera en un solo evento contable los costos operativos y las obligaciones retenidas a los trabajadores.</p>
      
      <div class="asiento-box">
        <div class="asiento-header">Póliza de Nómina Quincenal</div>
        <div class="asiento-row asiento-cargo"><span>(+) 5102-01 Mano de Obra Directa / Sueldos</span><span>$10,000.00</span></div>
        <div class="asiento-row asiento-abono"><span>(-) 2105-01 Retención ISSS Laboral (3.00% - Techo $1,000)</span><span>$300.00</span></div>
        <div class="asiento-row asiento-abono"><span>(-) 2105-02 Retención AFP Laboral (7.25%)</span><span>$725.00</span></div>
        <div class="asiento-row asiento-abono"><span>(-) 2106-07 Retención Impuesto sobre la Renta (F-14)</span><span>$850.00</span></div>
        <div class="asiento-row asiento-abono"><span>(-) 2105-10 Sueldos Líquidos por Pagar / Bancos</span><span>$8,125.00</span></div>
      </div>

      <div class="control-box">
        <div class="control-title">🛡️ Controles Automáticos</div>
        <ul>
          <li><strong>Aplicación Estricta del Techo Cotizable del ISSS:</strong> La retención del 3% del ISSS se calcula hasta el tope legal de $\$1,000.00$ de salario mensual (retención máxima individual de $\$30.00$). Los salarios superiores a dicho tope están protegidos contra sobre-retenciones.</li>
          <li><strong>Validación con Relojes Biométricos:</strong> Las horas extras registradas deben contar con validación cruzada con el sistema biométrico de control de asistencia antes de ser procesadas.</li>
        </ul>
      </div>
    </div>

    <div class="doc-box">
      <h3 class="doc-title">Planilla de Aportes Patronales (ISSS Patronal 7.5%, AFP Patronal 8.75%, INSAFORP 1%)</h3>
      <p>Reconocimiento mensual de la carga social patronal de la empresa.</p>
      
      <div class="asiento-box">
        <div class="asiento-header">Póliza de Cargas Sociales Patronales</div>
        <div class="asiento-row asiento-cargo"><span>(+) 5102-05 Cuotas Patronales ISSS (7.5%)</span><span>$750.00</span></div>
        <div class="asiento-row asiento-cargo"><span>(+) 5102-06 Cuotas Patronales AFP (8.75%)</span><span>$875.00</span></div>
        <div class="asiento-row asiento-cargo"><span>(+) 5102-07 Aporte Patronal INSAFORP (1.0%)</span><span>$100.00</span></div>
        <div class="asiento-row asiento-abono"><span>(-) 2105-05 Pasivo por Cargas Patronales por Pagar</span><span>$1,725.00</span></div>
      </div>

      <div class="control-box">
        <div class="control-title">🛡️ Controles Automáticos</div>
        <ul>
          <li><strong>Conciliación de Salida con Planilla Única del ISSS/AFP:</strong> El archivo electrónico de nómina se valida de forma automática contra el validador oficial del ISSS antes de liberar los fondos bancarios.</li>
        </ul>
      </div>
    </div>
  </div>

  <!-- ==================== CAPÍTULO 6 ==================== -->
  <div class="chapter page-break">
    <h1 class="chapter-title">Capítulo 6: Bloque 5 — Pólizas de Cierre, Valuación y Ajustes Periódicos</h1>
    
    <p>
      Los cierres de fin de mes y de fin de año se ejecutan mediante <strong>servicios desatendidos (Cron Jobs)</strong> programados para evaluar activos, devengos y regularizaciones de balance.
    </p>

    <div class="diagram-container">
      <div class="mermaid">
flowchart LR
    Cron["Cron Job: Fin de Mes (00:00 hrs)"] --> D1["1. Cálculo de Depreciación\n(Línea Recta / Vida Útil)"]
    Cron --> D2["2. Valuación Moneda Extranjera\n(Tipo de Cambio Oficial BCR)"]
    Cron --> D3["3. Amortización de Seguros / Pagos Anticipados\n(Devengo 1/12)"]
    Cron --> D4["4. Valuación de Costo de Inventario\n(Costo Promedio Ponderado)"]
    D1 --> P1["Póliza de Depreciación"]
    D2 --> P2["Póliza de Diferencial Cambiario"]
    D3 --> P3["Póliza de Amortización"]
    D4 --> P4["Póliza de Regularización de Costo"]
    P1 & P2 & P3 & P4 --> Audit{"Verificación Automática de Balance\nActivo = Pasivo + Capital"}
    Audit -->|Cuadrada al 100%| Lock["Cierre y Bloqueo de Periodo"]
      </div>
      <div class="diagram-caption">Figura 6.1: Flujo de Cierre Automático Periódico</div>
    </div>

    <div class="doc-box">
      <h3 class="doc-title">Póliza de Depreciación de Activos Fijos</h3>
      <p>Reconoce el desgaste económico de la maquinaria industrial, mobiliario y vehículos de transporte.</p>
      <div class="asiento-box">
        <div class="asiento-header">Póliza Mensual de Depreciación</div>
        <div class="asiento-row asiento-cargo"><span>(+) 5301-01 Gasto por Depreciación de Maquinaria Textil</span><span>$2,500.00</span></div>
        <div class="asiento-row asiento-abono"><span>(-) 1205-01 Depreciación Acumulada de Maquinaria</span><span>$2,500.00</span></div>
      </div>
      <div class="control-box">
        <div class="control-title">🛡️ Controles Automáticos</div>
        <ul>
          <li><strong>Tope de Valor de Rescate:</strong> El algoritmo suspende de inmediato la depreciación de un bien cuando su valor neto en libros alcanza el valor de rescate (ej. $\$1.00$). Impide que la depreciación acumulada sobrepase el costo histórico de adquisición.</li>
        </ul>
      </div>
    </div>

    <div class="doc-box">
      <h3 class="doc-title">Póliza de Fluctuación y Diferencial Cambiario (FX)</h3>
      <p>Actualiza a la fecha del balance el valor en dólares (USD) de activos y pasivos monetarios pactados en otras monedas (Euros, Yuanes, Quetzales).</p>
      <div class="control-box">
        <div class="control-title">🛡️ Controles Automáticos</div>
        <ul>
          <li><strong>Conexión con el Banco Central de Reserva (BCR):</strong> Obtiene automáticamente el tipo de cambio oficial publicado al último día hábil del mes, suprimiendo la manipulación arbitraria de tasas.</li>
        </ul>
      </div>
    </div>

    <div class="doc-box">
      <h3 class="doc-title">Póliza de Cierre Anual de Cuentas de Resultados</h3>
      <p>Cancela los saldos de ingresos, costos y gastos al 31 de diciembre para trasladar el resultado neto a la cuenta patrimonial de <em>Utilidad o Pérdida del Ejercicio</em>.</p>
      <div class="control-box">
        <div class="control-title">🛡️ Controles Automáticos</div>
        <ul>
          <li><strong>Bloqueo Inmutable del Ejercicio Fiscal:</strong> Una vez finalizado el asiento de cierre, el ejercicio pasa a estado <strong>Cerrado (Read-Only)</strong> en la base de datos. Ningún usuario tiene privilegios para inyectar transacciones retroactivas sin una apertura formal auditada.</li>
        </ul>
      </div>
    </div>
  </div>

  <!-- ==================== CAPÍTULO 7 ==================== -->
  <div class="chapter page-break">
    <h1 class="chapter-title">Capítulo 7: Matriz Consolidada de Controles y Bloqueos Automáticos</h1>
    
    <p>
      La siguiente tabla reúne la totalidad de los documentos del ecosistema, su disparador operativo, el impacto en la partida doble y la regla de control que previene activamente el error:
    </p>

    <table>
      <thead>
        <tr>
          <th>Documento</th>
          <th>Tipo / Código</th>
          <th>Disparador Operativo</th>
          <th>Asiento Automático</th>
          <th>Control Preventivo / Bloqueo</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Factura Electrónica</strong></td>
          <td><span class="badge badge-primary">DTE-01</span></td>
          <td>Venta B2C / Mostrador</td>
          <td>Caja (+) / Ventas (-) / Débito IVA (-)</td>
          <td>Obliga DUI/Nombre si monto $\ge \$200$. Cuadratura contra corte Z.</td>
        </tr>
        <tr>
          <td><strong>Crédito Fiscal</strong></td>
          <td><span class="badge badge-primary">DTE-03</span></td>
          <td>Facturación B2B</td>
          <td>CxC (+) / Ventas (-) / Débito IVA (-)</td>
          <td>Valida NRC activo en MH y Sello de Recepción. Calcula retención 1%.</td>
        </tr>
        <tr>
          <td><strong>Nota de Remisión</strong></td>
          <td><span class="badge badge-primary">DTE-04</span></td>
          <td>Despacho de Bodega</td>
          <td>Inv. Tránsito (+) / Inv. Central (-)</td>
          <td>Exige placa y conductor. Alerta si no se factura en 72 hrs.</td>
        </tr>
        <tr>
          <td><strong>Nota de Crédito</strong></td>
          <td><span class="badge badge-primary">DTE-05</span></td>
          <td>Devolución / Descuento</td>
          <td>Rebajas (+) / Débito IVA (+) / CxC (-)</td>
          <td>Requiere UUID padre. Importe no puede exceder el CCF origen.</td>
        </tr>
        <tr>
          <td><strong>Nota de Débito</strong></td>
          <td><span class="badge badge-primary">DTE-06</span></td>
          <td>Intereses / Ajuste alza</td>
          <td>CxC (+) / Otros Ingresos (-) / IVA (-)</td>
          <td>Cálculo matemático de mora. Verifica factura de referencia activa.</td>
        </tr>
        <tr>
          <td><strong>Comprobante Retención</strong></td>
          <td><span class="badge badge-primary">DTE-07</span></td>
          <td>Pago a Proveedor</td>
          <td>CxP (+) / IVA Retenido 1% (-)</td>
          <td>Aplica solo si base $\ge \$100$ y emisor es Gran Contribuyente.</td>
        </tr>
        <tr>
          <td><strong>Comprobante Liquidación</strong></td>
          <td><span class="badge badge-primary">DTE-08/09</span></td>
          <td>Venta de Terceros</td>
          <td>Bancos (+) / CxP Tercero (-) / Comisión (-)</td>
          <td>Segrega comisión propia de ingresos de terceros.</td>
        </tr>
        <tr>
          <td><strong>Factura Exportación</strong></td>
          <td><span class="badge badge-primary">DTE-11</span></td>
          <td>Venta Internacional</td>
          <td>CxC Exterior (+) / Ventas Tasa 0% (-)</td>
          <td>Bloquea IVA local del 13%. Requiere folio aduanero DUCA.</td>
        </tr>
        <tr>
          <td><strong>Factura Sujeto Excluido</strong></td>
          <td><span class="badge badge-primary">DTE-14</span></td>
          <td>Compra a no contribuyente</td>
          <td>Gasto (+) / Retención Renta 10% (-) / Bancos (-)</td>
          <td>Verifica que el proveedor NO tenga NRC. Retiene 10% renta ISR.</td>
        </tr>
        <tr>
          <td><strong>Orden de Compra</strong></td>
          <td><span class="badge badge-warning">PO</span></td>
          <td>Requisición aprobada</td>
          <td>Reserva presupuestaria</td>
          <td>Bloquea si el centro de costos superó su presupuesto mensual.</td>
        </tr>
        <tr>
          <td><strong>Entrada Almacén</strong></td>
          <td><span class="badge badge-warning">GRN</span></td>
          <td>Descarga en muelle</td>
          <td>Inventario (+) / Provisión Pasivo (-)</td>
          <td>Conteo ciego. Prohíbe sobre-recepción no autorizada.</td>
        </tr>
        <tr>
          <td><strong>Recibo de Cobro</strong></td>
          <td><span class="badge badge-success">Ingreso</span></td>
          <td>Cobro SPEI / Depósito</td>
          <td>Bancos (+) / CxC Clientes (-)</td>
          <td>Asocia a facturas específicas. Prohíbe sobrepagos erróneos.</td>
        </tr>
        <tr>
          <td><strong>Dispersión de Pago</strong></td>
          <td><span class="badge badge-danger">Egreso</span></td>
          <td>Transferencia a proveedor</td>
          <td>CxP Proveedores (+) / Bancos (-)</td>
          <td>Exige Three-Way Match satisfecho y cuenta bancaria verificada.</td>
        </tr>
        <tr>
          <td><strong>Nómina y Salarios</strong></td>
          <td><span class="badge badge-primary">Planilla</span></td>
          <td>Fin de quincena</td>
          <td>Sueldos (+) / Retenciones ISSS, AFP, Renta (-) / Bancos (-)</td>
          <td>Techo máximo de ISSS ($1,000). Cruce con asistencia biométrica.</td>
        </tr>
        <tr>
          <td><strong>Depreciación Activos</strong></td>
          <td><span class="badge badge-secondary">Ajuste</span></td>
          <td>Cron job fin de mes</td>
          <td>Gasto Deprec. (+) / Deprec. Acumulada (-)</td>
          <td>Freno automático al alcanzar el valor de rescate/residual.</td>
        </tr>
        <tr>
          <td><strong>Cierre de Ejercicio</strong></td>
          <td><span class="badge badge-danger">Cierre</span></td>
          <td>31 de Diciembre</td>
          <td>Cancelación ctas. 4, 5, 6 / Utilidad Ejercicio (-)</td>
          <td>Bloqueo permanente del periodo fiscal cerrado en base de datos.</td>
        </tr>
      </tbody>
    </table>
  </div>

</div>

<script>
  mermaid.initialize({
    startOnLoad: true,
    theme: 'neutral',
    flowchart: {
      useMaxWidth: true,
      htmlLabels: true,
      curve: 'basis'
    },
    sequence: {
      useMaxWidth: true
    }
  });
</script>

</body>
</html>
`;

// Guardar archivo HTML en Documentos
const htmlPath = path.join(docDir, 'Ecosistema_Contable_Automatizado_y_Controles_DTE.html');
fs.writeFileSync(htmlPath, htmlContent, 'utf8');
console.log('✅ Archivo HTML generado exitosamente en:', htmlPath);

// Generar PDF usando Playwright con Microsoft Edge
async function generatePdf() {
  try {
    console.log('🌐 Iniciando navegador para renderizar gráficos Mermaid y generar PDF...');
    const browser = await chromium.launch({ channel: 'msedge', headless: true });
    const page = await browser.newPage();

    const fileUrl = 'file:///' + htmlPath.replace(/\\/g, '/');
    await page.goto(fileUrl, { waitUntil: 'networkidle' });

    // Esperar a que Mermaid renderice los 4 diagramas SVG
    console.log('⏳ Esperando renderizado de diagramas vectoriales...');
    await page.waitForTimeout(3000);

    const pdfPath = path.join(docDir, 'Ecosistema_Contable_Automatizado_y_Controles_DTE.pdf');
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      margin: {
        top: '16mm',
        bottom: '16mm',
        left: '12mm',
        right: '12mm'
      },
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: '<div style="font-size: 8px; font-family: sans-serif; color: #64748b; width: 100%; text-align: right; padding-right: 14mm;">NyTEX ERP • Arquitectura de Contabilidad Autónoma y Controles DTE (El Salvador)</div>',
      footerTemplate: '<div style="font-size: 8px; font-family: sans-serif; color: #64748b; width: 100%; text-align: center;">Página <span class="pageNumber"></span> de <span class="totalPages"></span></div>'
    });

    await browser.close();
    console.log('🎉 Archivo PDF generado exitosamente en:', pdfPath);
    return pdfPath;
  } catch (err) {
    console.error('❌ Error generando PDF:', err);
    process.exit(1);
  }
}

generatePdf();
