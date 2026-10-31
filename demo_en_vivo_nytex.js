/**
 * DEMO EN VIVO CON VOZ NARRATIVA - RECORRIDO INTEGRAL NyTEX ERP
 * Automatización visual con Playwright en Microsoft Edge
 * Incluye locución en español sincronizada y generación de video en ./demos_grabados/
 */

const { chromium } = require('playwright');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Asegurar carpeta de salida de videos
const outputDir = path.join(__dirname, 'demos_grabados');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Helper para pausas
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Locución de voz profesional en español en segundo plano sincronizado
function narrate(text) {
  return new Promise((resolve) => {
    try {
      const cleanText = text.replace(/["'´`]/g, '').replace(/[\r\n]+/g, ' ');
      const psCmd = `
        Add-Type -AssemblyName System.Speech;
        $s = New-Object System.Speech.Synthesis.SpeechSynthesizer;
        try { $s.SelectVoice('Microsoft Helena Desktop'); } catch {}
        $s.Rate = 0;
        $s.Speak('${cleanText}');
      `;
      const child = exec(`powershell -NoProfile -Command "${psCmd.replace(/\n/g, ' ')}"`, (error) => {
        resolve();
      });
    } catch (e) {
      resolve();
    }
  });
}

// Inyector de HUD Visual para presentación comercial
async function updateHUD(page, moduleNumber, moduleName, description, icon = '🚀') {
  try {
    await page.evaluate(({ moduleNumber, moduleName, description, icon }) => {
      let hud = document.getElementById('nytex-sales-hud');
      if (!hud) {
        hud = document.createElement('div');
        hud.id = 'nytex-sales-hud';
        hud.style.cssText = `
          position: fixed;
          bottom: 25px;
          right: 25px;
          z-index: 9999999;
          background: linear-gradient(135deg, #0A2540 0%, #0d3861 100%);
          color: #ffffff;
          padding: 16px 24px;
          border-radius: 14px;
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(0, 212, 255, 0.35);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          max-width: 520px;
          border-left: 6px solid #00d4ff;
          pointer-events: none;
          animation: nytexFadeIn 0.4s ease-out;
        `;
        
        const style = document.createElement('style');
        style.innerHTML = `
          @keyframes nytexFadeIn {
            from { opacity: 0; transform: translateY(12px) scale(0.98); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
        `;
        document.head.appendChild(style);
        document.body.appendChild(hud);
      }

      hud.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
          <span style="background: #00d4ff; color: #0a2540; font-weight: 900; font-size: 11px; padding: 3px 9px; border-radius: 6px; letter-spacing: 0.5px;">
            DEMO EN VIVO • MÓDULO ${moduleNumber}
          </span>
          <span style="font-size: 11px; color: #94a3b8; font-weight: 600;">NyTEX Integral ERP</span>
        </div>
        <div style="font-size: 17px; font-weight: 700; color: #ffffff; display: flex; items-center; gap: 8px; margin-bottom: 4px;">
          <span>${icon}</span> <span>${moduleName}</span>
        </div>
        <div style="font-size: 13px; color: #e2e8f0; line-height: 1.45; opacity: 0.95;">
          ${description}
        </div>
      `;
    }, { moduleNumber, moduleName, description, icon });
  } catch (err) {}
}

// Helper para scroll suave y contemplativo de venta
async function smoothScrollDown(page, pixels = 400, steps = 15) {
  try {
    for (let i = 0; i < steps; i++) {
      await page.evaluate((px) => window.scrollBy(0, px), pixels / steps);
      await sleep(40);
    }
  } catch (e) {}
}

async function smoothScrollUp(page, pixels = 400, steps = 15) {
  try {
    for (let i = 0; i < steps; i++) {
      await page.evaluate((px) => window.scrollBy(0, -px), pixels / steps);
      await sleep(40);
    }
  } catch (e) {}
}

async function runDemo() {
  console.log('===========================================================');
  console.log('   INICIANDO DEMO EN VIVO CON LOCUCIÓN - ERP NyTEX         ');
  console.log('===========================================================');
  console.log('-> Locución por voz activada (Español).');
  console.log('-> Grabando video en alta resolución en ./demos_grabados');
  console.log('-> Abriendo Microsoft Edge a pantalla completa...\n');

  const browser = await chromium.launch({
    channel: 'msedge',
    headless: false,
    slowMo: 100,
    args: ['--start-maximized']
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: {
      dir: outputDir,
      size: { width: 1920, height: 1080 }
    }
  });

  const page = await context.newPage();
  let videoHandle = page.video();

  try {
    // -------------------------------------------------------------
    // FASE 0: ACCESO Y SEGURIDAD MULTI-ROL
    // -------------------------------------------------------------
    console.log('0. Inicio y Login con Perfil Administrador...');
    await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
    await sleep(1000);

    await updateHUD(page, '00', 'Seguridad y Acceso por Roles', 'Control de permisos granular. Iniciando sesión como Administrador General con acceso a todo el ecosistema.', '🔐');
    const voice0 = narrate('Bienvenido a la demostración integral de NyTEX ERP. El sistema cuenta con control de accesos por roles. Iniciamos sesión con el perfil de Administrador General.');
    await sleep(1500);

    try {
      await page.selectOption('select', 'Admin');
      await sleep(800);
      const submitBtn = await page.$('button[type="submit"]');
      if (submitBtn) {
        await submitBtn.click();
      }
    } catch (e) {}
    await voice0;
    await sleep(1000);

    // -------------------------------------------------------------
    // FASE 1: MENÚ GENERAL (PORTAL DE LOS 24 MÓDULOS)
    // -------------------------------------------------------------
    console.log('1. Portal de Ecosistema Completo...');
    await page.goto('http://localhost:5173/portal', { waitUntil: 'domcontentloaded' });
    await updateHUD(page, '01', 'Ecosistema Integral (24 Módulos)', 'Visión holística de la empresa: Comercial, Cadena de Suministro, Finanzas, Manufactura e Inteligencia Artificial.', '🏢');
    const voice1 = narrate('Este es el portal central donde convergen los veinticuatro módulos de NyTEX. La arquitectura está diseñada para integrar todas las áreas de su empresa en un único flujo de información.');
    await sleep(1000);
    await smoothScrollDown(page, 700);
    await sleep(1200);
    await smoothScrollUp(page, 700);
    await voice1;
    await sleep(1000);

    // -------------------------------------------------------------
    // FASE 2: CRM & PROSPECCIÓN COMERCIAL
    // -------------------------------------------------------------
    console.log('2. Módulo de CRM...');
    await page.goto('http://localhost:5173/app/crm', { waitUntil: 'domcontentloaded' });
    await updateHUD(page, '02', 'CRM & Embudo de Oportunidades', 'Pipeline de ventas en tiempo real, valor estimado de cartera y seguimiento de prospectos comerciales.', '🎯');
    const voice2 = narrate('Módulo uno. Gestión de Relaciones con Clientes o CRM. Aquí el equipo comercial supervisa el embudo de ventas, prospectos y oportunidades en tiempo real, evaluando el valor de la cartera y la probabilidad de cierre.');
    await sleep(1000);
    await smoothScrollDown(page, 350);
    await sleep(1500);
    await smoothScrollUp(page, 350);
    await voice2;
    await sleep(1000);

    // -------------------------------------------------------------
    // FASE 3: BUSINESS PARTNERS (PADRÓN DE CLIENTES Y PROVEEDORES)
    // -------------------------------------------------------------
    console.log('3. Módulo Business Partners...');
    await page.goto('http://localhost:5173/app/businesspartners', { waitUntil: 'domcontentloaded' });
    await updateHUD(page, '03', 'Business Partners (Socios de Negocio)', 'Expediente único de Clientes y Proveedores, límite de crédito, saldos vivos y condiciones comerciales.', '🤝');
    const voice3 = narrate('Módulo dos. Socios de Negocio. Centraliza el padrón de clientes y proveedores, con control estricto de límites de crédito, plazos de pago otorgados y datos fiscales para facturación.');
    await sleep(1000);
    await smoothScrollDown(page, 450);
    await sleep(1500);
    await smoothScrollUp(page, 450);
    await voice3;
    await sleep(1000);

    // -------------------------------------------------------------
    // FASE 4: VENTAS Y PEDIDOS (ORDER-TO-CASH)
    // -------------------------------------------------------------
    console.log('4. Módulo de Ventas...');
    await page.goto('http://localhost:5173/app/ventas', { waitUntil: 'domcontentloaded' });
    await updateHUD(page, '04', 'Ventas & Cotizaciones Industriales', 'Generación de pedidos con SKUs de productos terminados e insumos. Disparo automático al almacén WMS.', '🧾');
    const voice4 = narrate('Módulo tres. Ventas y Cotizaciones. Permite generar pedidos con catálogo por rollos y metraje. Al confirmar una orden, el sistema envía automáticamente el surtido al almacén.');
    await sleep(1000);
    await smoothScrollDown(page, 450);
    await sleep(1500);
    await smoothScrollUp(page, 450);
    await voice4;
    await sleep(1000);

    // -------------------------------------------------------------
    // FASE 5: CATÁLOGO DE INVENTARIO Y STOCK EN VIVO
    // -------------------------------------------------------------
    console.log('5. Módulo de Inventario...');
    await page.goto('http://localhost:5173/app/inventario', { waitUntil: 'domcontentloaded' });
    await updateHUD(page, '05', 'Control de Inventario & Stock Físico', 'Valuación de existencias en tiempo real, alertas de stock mínimo, materias primas y producto terminado.', '📦');
    const voice5 = narrate('Módulo cuatro. Control de Inventarios. Monitoreo constante de existencias físicas, materias primas y producto terminado, con alertas de stock mínimo y valuación de almacén a costo promedio.');
    await sleep(1000);
    await smoothScrollDown(page, 500);
    await sleep(1500);
    await smoothScrollUp(page, 500);
    await voice5;
    await sleep(1000);

    // -------------------------------------------------------------
    // FASE 6: WMS (GESTIÓN DE ALMACENES, RACKS Y SURTIDO)
    // -------------------------------------------------------------
    console.log('6. Módulo WMS...');
    await page.goto('http://localhost:5173/app/wms', { waitUntil: 'domcontentloaded' });
    await updateHUD(page, '06', 'WMS (Warehouse Management)', 'Surtido de órdenes, picking con código de barras, ubicación en estanterías y preparación de embarques.', '🏬');
    const voice6 = narrate('Módulo cinco. Gestión de Almacenes WMS. Administra la recepción física, estanterías y surtido de pedidos mediante escaneo de código de barras para garantizar cero errores en despacho.');
    await sleep(1000);
    await smoothScrollDown(page, 400);
    await sleep(1500);
    await smoothScrollUp(page, 400);
    await voice6;
    await sleep(1000);

    // -------------------------------------------------------------
    // FASE 7: FACTURACIÓN & CUENTAS POR COBRAR (CxC)
    // -------------------------------------------------------------
    console.log('7. Módulo de CxC & Facturación...');
    await page.goto('http://localhost:5173/app/cxc', { waitUntil: 'domcontentloaded' });
    await updateHUD(page, '07', 'Facturación Electrónica Digital & CxC', 'Emisión fiscal inmediata, antigüedad de saldos y aplicación automática de pagos bancarios.', '💳');
    const voice7 = narrate('Módulo seis. Facturación y Cuentas por Cobrar. Emisión fiscal electrónica en segundos, control de antigüedad de saldos de clientes y conciliación automática de cobros.');
    await sleep(1000);
    await smoothScrollDown(page, 450);
    await sleep(1500);
    await smoothScrollUp(page, 450);
    await voice7;
    await sleep(1000);

    // -------------------------------------------------------------
    // FASE 8: COMPRAS & PROVEEDORES (PROCURE-TO-PAY)
    // -------------------------------------------------------------
    console.log('8. Módulo de Compras...');
    await page.goto('http://localhost:5173/app/compras', { waitUntil: 'domcontentloaded' });
    await updateHUD(page, '08', 'Compras & Abastecimiento', 'Órdenes de compra a proveedores de hilado, tintes y avíos con recepción directa en muelle de almacén.', '🛍️');
    const voice8 = narrate('Módulo siete. Compras y Abastecimiento. Emite órdenes de compra a proveedores de hilo, tintes e insumos, con seguimiento de entregas y recepción directa en almacén.');
    await sleep(1000);
    await smoothScrollDown(page, 400);
    await sleep(1500);
    await smoothScrollUp(page, 400);
    await voice8;
    await sleep(1000);

    // -------------------------------------------------------------
    // FASE 9: CUENTAS POR PAGAR (CxP)
    // -------------------------------------------------------------
    console.log('9. Módulo de CxP...');
    await page.goto('http://localhost:5173/app/cxp', { waitUntil: 'domcontentloaded' });
    await updateHUD(page, '09', 'Cuentas por Pagar (CxP)', 'Programación de pasivos, calendario de pagos para flujo de caja y comprobantes fiscales recibidos.', '📑');
    const voice9 = narrate('Módulo ocho. Cuentas por Pagar. Programación oportuna de pagos a proveedores, cuidando la liquidez y evitando cargos o interrupciones en la cadena de suministro.');
    await sleep(1000);
    await smoothScrollDown(page, 400);
    await sleep(1500);
    await smoothScrollUp(page, 400);
    await voice9;
    await sleep(1000);

    // -------------------------------------------------------------
    // FASE 10: PRODUCCIÓN & MANUFACTURA INDUSTRIAL
    // -------------------------------------------------------------
    console.log('10. Módulo de Producción...');
    await page.goto('http://localhost:5173/app/produccion', { waitUntil: 'domcontentloaded' });
    await updateHUD(page, '10', 'Producción & Planta Fabril', 'Plan Maestro de Producción, estado de maquinaria en vivo, explosión de materiales (BOM) y avance.', '⚙️');
    const voice10 = narrate('Módulo nueve. Producción y Manufactura. Plan Maestro de Producción y monitoreo en línea de la maquinaria industrial, controlando mermas, tiempos y avance de órdenes.');
    await sleep(1000);
    await smoothScrollDown(page, 450);
    await sleep(1500);
    await smoothScrollUp(page, 450);
    await voice10;
    await sleep(1000);

    // -------------------------------------------------------------
    // FASE 11: LOGÍSTICA & FLOTA
    // -------------------------------------------------------------
    console.log('11. Módulo de Logística...');
    await page.goto('http://localhost:5173/app/logistica', { waitUntil: 'domcontentloaded' });
    await updateHUD(page, '11', 'Logística & Despacho', 'Rutas de entrega, monitoreo de unidades de transporte y confirmación de recepción del cliente.', '🚚');
    const voice11 = narrate('Módulo diez. Logística y Distribución. Planificación de rutas de reparto, asignación de unidades de transporte y registro de evidencia de entrega al cliente.');
    await sleep(1000);
    await smoothScrollDown(page, 400);
    await sleep(1500);
    await smoothScrollUp(page, 400);
    await voice11;
    await sleep(1000);

    // -------------------------------------------------------------
    // FASE 12: TESORERÍA & CUENTAS BANCARIAS
    // -------------------------------------------------------------
    console.log('12. Módulo de Tesorería...');
    await page.goto('http://localhost:5173/app/tesoreria', { waitUntil: 'domcontentloaded' });
    await updateHUD(page, '12', 'Tesorería & Cuentas Bancarias', 'Posición financiera en tiempo real (Bancos Operativos y Efectivo), transferencias electrónicas y conciliación.', '🏦');
    const voice12 = narrate('Módulo once. Tesorería y Bancos. Posición financiera en tiempo real en todas sus cuentas bancarias, con conciliación de transferencias y control de flujo de efectivo.');
    await sleep(1000);
    await smoothScrollDown(page, 400);
    await sleep(1500);
    await smoothScrollUp(page, 400);
    await voice12;
    await sleep(1000);

    // -------------------------------------------------------------
    // FASE 13: CONTABILIDAD CENTRAL & PÓLIZAS AUTOMÁTICAS
    // -------------------------------------------------------------
    console.log('13. Módulo de Contabilidad...');
    await page.goto('http://localhost:5173/app/contabilidad', { waitUntil: 'domcontentloaded' });
    await updateHUD(page, '13', 'Contabilidad Automatizada (Sin Captura Manual)', 'Cada venta, cobro, compra o depreciación crea su póliza contable con cargo y abono balanceado en segundos.', '⚖️');
    const voice13 = narrate('Módulo doce. Contabilidad Central Automatizada. Cada venta, compra, cobro o pago genera automáticamente sus pólizas contables, eliminando por completo la doble captura manual.');
    await sleep(1000);
    await smoothScrollDown(page, 450);
    await sleep(1500);
    await smoothScrollUp(page, 450);
    await voice13;
    await sleep(1000);

    // -------------------------------------------------------------
    // FASE 14: RECURSOS HUMANOS & PLANTILLA
    // -------------------------------------------------------------
    console.log('14. Módulo de RRHH...');
    await page.goto('http://localhost:5173/app/rrhh', { waitUntil: 'domcontentloaded' });
    await updateHUD(page, '14', 'Recursos Humanos & Estructura Fabril', 'Padrón de operarios y colaboradores, expedientes digitales y supervisión de turnos de manufactura.', '👥');
    const voice14 = narrate('Módulo trece. Recursos Humanos. Gestión de expedientes de operarios, turnos de planta fabril y control de asistencias del personal.');
    await sleep(1000);
    await smoothScrollDown(page, 400);
    await sleep(1500);
    await smoothScrollUp(page, 400);
    await voice14;
    await sleep(1000);

    // -------------------------------------------------------------
    // FASE 15: NÓMINA CORPORATIVA
    // -------------------------------------------------------------
    console.log('15. Módulo de Nómina...');
    await page.goto('http://localhost:5173/app/nomina', { waitUntil: 'domcontentloaded' });
    await updateHUD(page, '15', 'Nómina & Dispersión Salarial', 'Cálculo de percepciones, deducciones de ley, horas extra y generación de dispersión bancaria.', '💵');
    const voice15 = narrate('Módulo catorce. Nómina. Cálculo automatizado de salarios, percepciones, deducciones de ley y generación de listas de dispersión bancaria.');
    await sleep(1000);
    await smoothScrollDown(page, 400);
    await sleep(1500);
    await smoothScrollUp(page, 400);
    await voice15;
    await sleep(1000);

    // -------------------------------------------------------------
    // FASE 16: ACTIVOS FIJOS & MAQUINARIA
    // -------------------------------------------------------------
    console.log('16. Módulo de Activos Fijos...');
    await page.goto('http://localhost:5173/app/activosfijos', { waitUntil: 'domcontentloaded' });
    await updateHUD(page, '16', 'Activos Fijos & Depreciación IFRS / NIC 16', 'Control patrimonial de equipos y líneas industriales, montacargas y depreciación automática por horas de uso.', '🏗️');
    const voice16 = narrate('Módulo quince. Activos Fijos. Control del patrimonio en maquinaria industrial y cálculo mensual de depreciación contable según las normas internacionales.');
    await sleep(1000);
    await smoothScrollDown(page, 400);
    await sleep(1500);
    await smoothScrollUp(page, 400);
    await voice16;
    await sleep(1000);

    // -------------------------------------------------------------
    // FASE 17: GOBERNANZA & MINERÍA DE PROCESOS (SYNEX BPM)
    // -------------------------------------------------------------
    console.log('17. Módulos de Procesos & Minería...');
    await page.goto('http://localhost:5173/app/processsuite', { waitUntil: 'domcontentloaded' });
    await updateHUD(page, '17', 'Synex Process Suite (BPMN)', 'Diagramas y orquestación de flujos de trabajo estándar para asegurar la certificación ISO y calidad.', '🔄');
    const voice17 = narrate('Módulo dieciséis. Gobernanza y Minería de Procesos. Facilita la estandarización y auditoría de procedimientos operativos bajo normas internacionales de calidad.');
    await sleep(1000);
    await smoothScrollDown(page, 400);
    await sleep(1500);
    await smoothScrollUp(page, 400);
    await voice17;
    await sleep(1000);

    // -------------------------------------------------------------
    // FASE 18: INTELIGENCIA ARTIFICIAL & MODELOS PREDICTIVOS
    // -------------------------------------------------------------
    console.log('18. IA y Asistente Predictivo...');
    await page.goto('http://localhost:5173/app/ia', { waitUntil: 'domcontentloaded' });
    await updateHUD(page, '18', 'Copiloto de IA Empresarial', 'Consultas en lenguaje natural sobre existencias, proyecciones financieras y optimización operativa.', '🤖');
    const voice18 = narrate('Módulo diecisiete. Asistente de Inteligencia Artificial. Copiloto inteligente para consultar datos en lenguaje natural y predecir tendencias de demanda.');
    await sleep(1000);
    await smoothScrollDown(page, 400);
    await sleep(1500);
    await smoothScrollUp(page, 400);
    await voice18;
    await sleep(1000);

    // -------------------------------------------------------------
    // FASE 19: BUSINESS INTELLIGENCE & CUADRO DE MANDO EJECUTIVO
    // -------------------------------------------------------------
    console.log('19. Dashboards Ejecutivos y BI...');
    await page.goto('http://localhost:5173/app/dashboards', { waitUntil: 'domcontentloaded' });
    await updateHUD(page, '19', 'Business Intelligence & KPIs Ejecutivos', 'Métricas de rentabilidad, volumen de venta, cumplimiento de producción y flujo neto consolidado.', '📊');
    const voice19 = narrate('Módulo dieciocho. Cuadro de Mando Integral y Analítica. Visión ejecutiva en tiempo real con los indicadores clave de rendimiento del negocio.');
    await sleep(1000);
    await smoothScrollDown(page, 500);
    await sleep(1500);
    await smoothScrollUp(page, 500);
    await voice19;
    await sleep(1000);

    // -------------------------------------------------------------
    // FASE 20: CIERRE COMERCIAL EN WORKSPACE INTEGRADO
    // -------------------------------------------------------------
    console.log('20. Espacio de Trabajo Unificado...');
    await page.goto('http://localhost:5173/app/workspace', { waitUntil: 'domcontentloaded' });
    await updateHUD(page, '20', 'NyTEX ERP: Su Empresa 100% Conectada', 'Solución llave en mano para transformar digitalmente su operación de punta a punta.', '⭐');
    const voice20 = narrate('NyTEX ERP es la solución integral definitiva para transformar digitalmente su empresa y operaciones industriales. Gracias por su atención.');
    await sleep(1000);
    await smoothScrollDown(page, 400);
    await sleep(1500);
    await smoothScrollUp(page, 400);
    await voice20;
    await sleep(2000);

    console.log('\n===========================================================');
    console.log('   ¡DEMOSTRACIÓN CON LOCUCIÓN COMPLETADA CON ÉXITO!        ');
    console.log('===========================================================');
  } catch (error) {
    console.error('Error durante la demostración en vivo:', error);
  } finally {
    try {
      await sleep(1000);
      await page.close();
      await context.close();
      await browser.close();

      if (videoHandle) {
        const rawVideoPath = await videoHandle.path();
        if (rawVideoPath && fs.existsSync(rawVideoPath)) {
          const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
          const friendlyPath = path.join(outputDir, `Demo_NyTEX_ERP_24_Modulos_${timestamp}.webm`);
          fs.renameSync(rawVideoPath, friendlyPath);
          console.log(`\n=====================================================`);
          console.log(` VIDEO GUARDADO CON ÉXITO:`);
          console.log(friendlyPath);
          console.log(`=====================================================\n`);
        }
      }
    } catch (e) {
      console.error('Error finalizando video:', e);
    }
  }
}

runDemo();
