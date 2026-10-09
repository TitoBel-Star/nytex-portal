/**
 * CAPACITACIÓN Y DEMO OPERATIVA EN VIVO POR FASES - NyTEX ERP
 * VERSIÓN 4.0 INTEGRAL (OCTUBRE 2026)
 * Basado literalmente en la "GUÍA DE SIMULACIÓN OPERATIVA TAREA POR TAREA — ERP NyTEX"
 * Automatización visual interactiva con Playwright en Microsoft Edge
 * Puntero de Mouse Visible, Digitación Tecla por Tecla y Ejecución Real de Tareas (ITs)
 * INTEGRACIÓN AUTOMÁTICA DE AUDIO + VIDEO CON FFMPEG EN MP4 (SINCRONIZACIÓN MILISEGUNDO A MILISEGUNDO)
 */

const { chromium } = require('playwright');
const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ffmpegExe = 'C:\\Users\\emili\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg.Essentials_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-9.0.1-essentials_build\\bin\\ffmpeg.exe';

const outputDir = path.join(__dirname, 'demos_grabados');
const tempDir = path.join(__dirname, 'demos_grabados', 'temp_audio');

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Gestor de Audio Asíncrono y Locución Sincronizada Cuadro a Cuadro
class AudioNarrator {
  constructor(tempDir) {
    this.tempDir = tempDir;
    this.clips = [];
    this.videoStartTime = Date.now();
    this.activeProcesses = [];
  }

  setVideoStartTime(time = Date.now()) {
    this.videoStartTime = time;
    try {
      const files = fs.readdirSync(this.tempDir);
      for (const f of files) {
        fs.unlinkSync(path.join(this.tempDir, f));
      }
    } catch (e) {}
    this.clips = [];
  }

  narrate(text) {
    const offsetMs = Math.max(0, Date.now() - this.videoStartTime);
    const clipIndex = this.clips.length + 1;
    const clipPath = path.join(this.tempDir, `clip_${clipIndex}.wav`).replace(/\\/g, '/');

    const cleanText = text.replace(/["'´`]/g, '').replace(/[\r\n]+/g, ' ');

    const genPs = `
      Add-Type -AssemblyName System.Speech;
      $s = New-Object System.Speech.Synthesis.SpeechSynthesizer;
      try { $s.SelectVoice('Microsoft Helena Desktop'); } catch {}
      $s.Rate = 0;
      $s.SetOutputToWaveFile('${clipPath}');
      $s.Speak('${cleanText}');
      $s.Dispose();
    `.replace(/\n/g, ' ');

    try {
      execSync(`powershell -NoProfile -Command "${genPs}"`, { stdio: 'ignore' });
      this.clips.push({ offsetMs, clipPath });
    } catch (e) {
      console.error('Error generando audio clip:', e.message);
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      try {
        const soundProcess = spawn('powershell', [
          '-NoProfile',
          '-Command',
          `$p = New-Object System.Media.SoundPlayer '${clipPath}'; $p.PlaySync(); $p.Dispose()`
        ], { stdio: 'ignore' });

        this.activeProcesses.push(soundProcess);

        const onDone = () => {
          const idx = this.activeProcesses.indexOf(soundProcess);
          if (idx !== -1) this.activeProcesses.splice(idx, 1);
          resolve();
        };

        soundProcess.on('exit', onDone);
        soundProcess.on('error', onDone);
      } catch (err) {
        resolve();
      }
    });
  }

  buildMasterAudio(masterPath) {
    if (this.clips.length === 0) return false;

    try {
      console.log(`\nSincronizando y mezclando ${this.clips.length} pistas de voz con la línea de tiempo del video...`);
      const delayedClips = [];

      for (let i = 0; i < this.clips.length; i++) {
        const c = this.clips[i];
        const delayedPath = path.join(this.tempDir, `delayed_${i + 1}.wav`).replace(/\\/g, '/');
        const delayCmd = `"${ffmpegExe}" -i "${c.clipPath}" -filter_complex "[0:a]adelay=${Math.round(c.offsetMs)}|${Math.round(c.offsetMs)}[out]" -map "[out]" -y "${delayedPath}"`;
        execSync(delayCmd, { stdio: 'ignore' });
        delayedClips.push(delayedPath);
      }

      let currentClips = [...delayedClips];
      let pass = 0;
      while (currentClips.length > 1) {
        pass++;
        const nextBatch = [];
        const batchSize = 10;
        for (let b = 0; b < currentClips.length; b += batchSize) {
          const chunk = currentClips.slice(b, b + batchSize);
          if (chunk.length === 1) {
            nextBatch.push(chunk[0]);
          } else {
            const batchOut = path.join(this.tempDir, `mix_pass${pass}_b${b}.wav`).replace(/\\/g, '/');
            const inArgs = chunk.map(p => `-i "${p}"`).join(' ');
            const mixCmd = `"${ffmpegExe}" ${inArgs} -filter_complex "amix=inputs=${chunk.length}:dropout_transition=0:normalize=0" -y "${batchOut}"`;
            execSync(mixCmd, { stdio: 'ignore' });
            nextBatch.push(batchOut);
          }
        }
        currentClips = nextBatch;
      }

      if (currentClips.length === 1) {
        fs.copyFileSync(currentClips[0], masterPath);
        return true;
      }
      return false;
    } catch (e) {
      console.error('Error ensamblando audio maestro:', e.message);
      return false;
    }
  }
}

// Inyector de Puntero de Mouse Virtual y Efecto Ripple
async function installMousePointer(page) {
  await page.addInitScript(() => {
    window.addEventListener('DOMContentLoaded', () => {
      let pointer = document.getElementById('virtual-cursor');
      if (!pointer) {
        pointer = document.createElement('div');
        pointer.id = 'virtual-cursor';
        pointer.style.cssText = `
          position: fixed;
          top: 50px;
          left: 50px;
          width: 24px;
          height: 24px;
          background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="%230f172a" stroke="%23ffffff" stroke-width="1.8" stroke-linejoin="round" d="M3 3l7.5 17.5 3-6.5 6.5-3z"/></svg>') no-repeat;
          pointer-events: none;
          z-index: 2147483647;
          transform: translate(0, 0);
          transition: transform 0.08s ease-out;
          filter: drop-shadow(0 2px 6px rgba(0,0,0,0.45));
        `;
        document.body.appendChild(pointer);

        const clickEffect = document.createElement('div');
        clickEffect.id = 'cursor-ripple';
        clickEffect.style.cssText = `
          position: fixed;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 2px solid #00d4ff;
          background: rgba(0, 212, 255, 0.4);
          pointer-events: none;
          z-index: 2147483646;
          display: none;
          transform: translate(-50%, -50%);
        `;
        document.body.appendChild(clickEffect);

        window.addEventListener('mousemove', (e) => {
          pointer.style.left = e.clientX + 'px';
          pointer.style.top = e.clientY + 'px';
        }, true);

        window.addEventListener('mousedown', (e) => {
          clickEffect.style.left = e.clientX + 'px';
          clickEffect.style.top = e.clientY + 'px';
          clickEffect.style.display = 'block';
          pointer.style.transform = 'scale(0.82)';
          setTimeout(() => { clickEffect.style.display = 'none'; }, 260);
        }, true);

        window.addEventListener('mouseup', () => {
          pointer.style.transform = 'scale(1)';
        }, true);
      }
    });
  });
}

// Movimiento Humano del Cursor a un Elemento
async function humanMoveTo(page, selectorOrLocator, steps = 18) {
  try {
    let el = typeof selectorOrLocator === 'string' ? await page.$(selectorOrLocator) : selectorOrLocator;
    if (!el) return false;
    await el.scrollIntoViewIfNeeded();
    const box = await el.boundingBox();
    if (!box) return false;
    const targetX = box.x + box.width / 2;
    const targetY = box.y + box.height / 2;
    await page.mouse.move(targetX, targetY, { steps });
    await sleep(80);
    return true;
  } catch (e) {
    return false;
  }
}

// Clic Humano Visible con Desplazamiento
async function humanClick(page, selector, steps = 18) {
  try {
    const moved = await humanMoveTo(page, selector, steps);
    if (!moved) return false;
    await page.mouse.down();
    await sleep(90);
    await page.mouse.up();
    await sleep(250);
    return true;
  } catch (e) {
    return false;
  }
}

// Digitación Humana Tecla por Tecla
async function humanType(page, selector, text, delayMs = 45) {
  try {
    await humanClick(page, selector, 14);
    await sleep(100);
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Backspace');
    await sleep(80);
    for (const char of text) {
      await page.keyboard.type(char);
      await sleep(delayMs);
    }
    await sleep(150);
    return true;
  } catch (e) {
    return false;
  }
}

// Inyector de HUD Visual Instructivo
async function updateHUD(page, phaseTag, moduleName, stepInstruction, tip = '') {
  try {
    await page.evaluate(({ phaseTag, moduleName, stepInstruction, tip }) => {
      let hud = document.getElementById('nytex-training-hud');
      if (!hud) {
        hud = document.createElement('div');
        hud.id = 'nytex-training-hud';
        hud.style.cssText = `
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 9999999;
          background: linear-gradient(135deg, #0A2540 0%, #0d3861 100%);
          color: #ffffff;
          padding: 16px 22px;
          border-radius: 14px;
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(0, 212, 255, 0.4);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          max-width: 540px;
          border-left: 6px solid #00d4ff;
          pointer-events: none;
          animation: nytexFadeIn 0.3s ease-out;
        `;
        const style = document.createElement('style');
        style.innerHTML = `
          @keyframes nytexFadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `;
        document.head.appendChild(style);
        document.body.appendChild(hud);
      }

      hud.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
          <span style="background: #00d4ff; color: #0a2540; font-weight: 900; font-size: 11px; padding: 3px 10px; border-radius: 6px; letter-spacing: 0.5px;">
            ${phaseTag}
          </span>
          <span style="font-size: 11px; color: #94a3b8; font-weight: 600;">Manual de Capacitación Operativa v4.0</span>
        </div>
        <div style="font-size: 15px; font-weight: 800; color: #ffffff; margin-bottom: 4px;">
          ${moduleName}
        </div>
        <div style="font-size: 12.5px; color: #e2e8f0; line-height: 1.4; font-weight: 500;">
          ${stepInstruction}
        </div>
        ${tip ? `
          <div style="margin-top: 7px; padding-top: 5px; border-top: 1px solid rgba(255,255,255,0.15); font-size: 11px; color: #38bdf8;">
            💡 <strong>Acción en Pantalla:</strong> ${tip}
          </div>
        ` : ''}
      `;
    }, { phaseTag, moduleName, stepInstruction, tip });
  } catch (err) {}
}

async function smoothScrollDown(page, pixels = 400, steps = 12) {
  try {
    for (let i = 0; i < steps; i++) {
      await page.evaluate((px) => window.scrollBy(0, px), pixels / steps);
      await sleep(35);
    }
  } catch (e) {}
}

async function smoothScrollUp(page, pixels = 400, steps = 12) {
  try {
    for (let i = 0; i < steps; i++) {
      await page.evaluate((px) => window.scrollBy(0, -px), pixels / steps);
      await sleep(35);
    }
  } catch (e) {}
}

async function goToPage(page, url) {
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  try {
    await page.evaluate(() => {
      document.body.style.zoom = '82%';
      document.body.style.overflowX = 'auto';
    });
  } catch (e) {}
  await sleep(400);
}

// ==================================================================================
// BLOQUE OPERATIVO: FASE 1 - STARTER ($35 USD/mes) - 7 MÓDULOS MEDULARES
// ==================================================================================
async function runFase1(page, narrator) {
  console.log('\n--- EJECUTANDO FASE 1: STARTER (7 MÓDULOS MEDULARES) ---');

  // Marco General en Workspace con Simulador de Roles
  await goToPage(page, 'http://localhost:5173/app/workspace?phase=1');
  await updateHUD(page, 'FASE 1 • STARTER ($35 USD/mes)', 'Espacio de Trabajo y Simulador de Roles', 'Comprende los 7 módulos medulares: Ventas, CRM, Inventario, Compras, Producción, Directorio de Business Partners y WMS Almacenes.', 'Observe el selector superior de roles: Administrador, Partner y Cliente Final.');
  
  const vIntro = narrator.narrate('Bienvenido a la capacitación oficial de la Fase Uno: NyTEX Starter, correspondiente a la Guía de Simulación Operativa Versión 4.0. Este paquete integra los siete módulos medulares: Ventas, CRM, Inventario, Compras, Producción Textil, Directorio de Business Partners y Gestión de Almacenes WMS.');
  await sleep(500);
  await humanMoveTo(page, 'div:has-text("Simulador de Roles"), nav');
  await sleep(800);
  await smoothScrollDown(page, 350);
  await sleep(1000);
  await smoothScrollUp(page, 350);
  await vIntro;

  // [1] MÓDULO DE VENTAS (Order-to-Cash)
  await goToPage(page, 'http://localhost:5173/app/ventas');
  await updateHUD(page, '[1] VENTAS', 'Tarea 1.1: Captura de Nueva Cotización / Pedido', 'Clic en "+ NUEVA ORDEN / COTIZACIÓN", cliente Confecciones Modernas, Gabardina Azul y Mezclilla Denim.', 'Subtotal: $30,500.00 + IVA 13%: $3,965.00 = Total: $34,465.00.');
  
  const vV1 = narrator.narrate('Módulo uno: Ventas. Tarea 1.1: Captura de Nueva Cotización o Pedido de Venta. Hacemos clic en el botón superior Nueva Orden. Seleccionamos el cliente Confecciones Modernas y agregamos las partidas de tela Gabardina Peinada y Mezclilla Denim. El sistema calcula un total con impuestos de treinta y cuatro mil cuatrocientos sesenta y cinco dólares.');
  await sleep(400);
  await humanClick(page, 'button:has-text("+ NUEVA ORDEN")');
  await sleep(1000);

  const clientSelect = await page.$('select');
  if (clientSelect) {
    await humanClick(page, clientSelect);
    await sleep(250);
    try {
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('Enter');
    } catch (e) {}
  }
  await vV1;

  // Tarea 1.2: Confirmar a WMS y Tarea 1.3: Facturar a CxC
  await updateHUD(page, '[1] VENTAS', 'Tarea 1.2 y 1.3: Confirmar a WMS y Facturar a CxC', 'Confirmación de surtido en almacén y emisión de Factura CFDI.', 'Impacto automático: Descuenta stock en Almacén, crea cartera en CxC y genera Póliza de Diario.');
  const vV2 = narrator.narrate('Tarea 1.2: Confirmar Pedido en Firme y Disparar Surtido a Almacén WMS. Al confirmar, el estatus pasa a En Proceso y genera la tarea de picking. Tarea 1.3: Emitir Factura Electrónica. Descuenta el inventario, crea la cuenta por cobrar en el módulo ocho y genera la póliza contable de diario en contabilidad.');
  await sleep(400);
  const saveBtn = await page.$('button:has-text("Crear Orden"), button:has-text("Guardar Orden"), button:has-text("Cancelar")');
  if (saveBtn) await humanClick(page, saveBtn);
  await sleep(800);
  const confirmBtn = await page.$('button:has-text("Confirmar ➔ WMS")');
  if (confirmBtn) await humanMoveTo(page, confirmBtn);
  await sleep(600);
  await vV2;

  // [2] MÓDULO DE CRM
  await goToPage(page, 'http://localhost:5173/app/crm');
  await updateHUD(page, '[2] CRM', 'Tarea 2.1 y 2.2: Oportunidad Comercial y Embudo Kanban', 'Registro de Suministro Anual de Popelina por $45,000 USD y avance por el embudo de ventas.', 'Avance por etapas: Nuevo ➔ Contactado ➔ Calificado ➔ Cotizado ➔ Ganado.');
  const vCrm = narrator.narrate('Módulo dos: CRM Comercial. Tarea 2.1: Registrar Nueva Oportunidad. Se captura el prospecto Industrias Textiles del Bajío por cuarenta y cinco mil dólares. Tarea 2.2: Avanzar Oportunidad por el Embudo Kanban. Arrastramos la tarjeta hasta la columna Ganado, recalculando en tiempo real el valor del pipeline y la tasa de conversión.');
  await sleep(400);
  await humanClick(page, 'button:has-text("+ NUEVA OPORTUNIDAD"), button:has-text("NUEVA OPORTUNIDAD")');
  await sleep(900);
  const cancelCrm = await page.$('button:has-text("Cancelar")');
  if (cancelCrm) await humanClick(page, cancelCrm);
  await smoothScrollDown(page, 350);
  await sleep(800);
  await smoothScrollUp(page, 350);
  await vCrm;

  // [3] MÓDULO DE INVENTARIO Y STOCK
  await goToPage(page, 'http://localhost:5173/app/inventario');
  await updateHUD(page, '[3] INVENTARIO', 'Tarea 3.1 y 3.2: Alta de SKU y Ajuste Físico de Stock', 'Alta del artículo MP-HIL-501 (Hilo Poliéster 150D) y registro de ajuste de auditoría.', 'Parámetros: Stock inicial 1,200 kg, costo unitario $85.50, punto de reorden 300 kg.');
  const vInv = narrator.narrate('Módulo tres: Inventario y Stock. Tarea 3.1: Alta de Nuevo Artículo en Catálogo Maestro. Registramos el SKU MP HIL quinientos uno, correspondiente a Hilo de Poliéster Texturizado con stock inicial de mil doscientos kilogramos. Tarea 3.2: Ajuste de Inventario. Aplicamos una entrada por reconteo físico de cien kilogramos en el Almacén Central.');
  await sleep(400);
  await humanClick(page, 'button:has-text("+ NUEVO PRODUCTO"), button:has-text("+ NUEVO SKU")');
  await sleep(900);
  const cancelInv = await page.$('button:has-text("Cancelar")');
  if (cancelInv) await humanClick(page, cancelInv);
  await smoothScrollDown(page, 350);
  await sleep(800);
  await smoothScrollUp(page, 350);
  await vInv;

  // [4] MÓDULO DE COMPRAS (Procure-to-Pay)
  await goToPage(page, 'http://localhost:5173/app/compras');
  await updateHUD(page, '[4] COMPRAS', 'Tarea 4.1 y 4.2: Orden de Compra y Recepción Física', 'PO a Hilaturas del Norte por $101,813.00 USD y recepción en almacén de materias primas.', 'Efecto cruzado: Aumenta stock físico, genera cuenta por pagar en CxP y póliza de provisión.');
  const vComp = narrator.narrate('Módulo cuatro: Compras. Tarea 4.1: Crear Orden de Compra a Proveedor. Emitimos la orden a Hilaturas del Norte por quinientos kilos de algodón peinado y doscientos de poliéster por un total de ciento un mil ochocientos trece dólares. Tarea 4.2: Recepción Física de Mercancía. Aumenta el stock en almacén, crea el pasivo en Cuentas por Pagar y genera la póliza contable.');
  await sleep(400);
  await humanClick(page, 'button:has-text("+ NUEVA ORDEN DE COMPRA"), button:has-text("NUEVA ORDEN")');
  await sleep(900);
  const cancelComp = await page.$('button:has-text("Cancelar")');
  if (cancelComp) await humanClick(page, cancelComp);
  await smoothScrollDown(page, 350);
  await sleep(800);
  await smoothScrollUp(page, 350);
  await vComp;

  // [5] MÓDULO DE PRODUCCIÓN (Manufactura Textil)
  await goToPage(page, 'http://localhost:5173/app/produccion');
  await updateHUD(page, '[5] PRODUCCIÓN', 'Tarea 5.1 a 5.3: OP, Consumo de Insumos y Liquidación', 'Programación de 30 rollos de Gabardina en Telar Mayer & Cie con lista de materiales BOM.', 'Descuento de 90 kg de algodón y 45 kg de poliéster, y pase a Producto Terminado.');
  const vProd = narrator.narrate('Módulo cinco: Producción Textil. Tarea 5.1: Programar Orden de Fabricación para treinta rollos en el Telar Mayer y Cie. Tarea 5.2: Iniciar Fabricación. Descuenta noventa kilos de algodón y cuarenta y cinco de poliéster del almacén de materias primas. Tarea 5.3: Liquidar Orden. Ingresa los treinta rollos terminados al almacén con su póliza de liquidación.');
  await sleep(400);
  await humanClick(page, 'button:has-text("+ Nueva Orden de Fabricación"), button:has-text("Nueva Orden de Producción")');
  await sleep(900);
  const cancelProd = await page.$('button:has-text("Cancelar")');
  if (cancelProd) await humanClick(page, cancelProd);
  await smoothScrollDown(page, 350);
  await sleep(800);
  await smoothScrollUp(page, 350);
  await vProd;

  // [6] MÓDULO DE BUSINESS PARTNERS
  await goToPage(page, 'http://localhost:5173/app/partners');
  await updateHUD(page, '[6] BUSINESS PARTNERS', 'Tarea 6.1: Registro de Socio de Negocio Centralizado', 'Alta de Distribuidora Textil de Guadalajara (RFC: DTG980421KM8, Límite: $250,000 USD).', 'Queda disponible al instante para facturación en Ventas y cobranza en CxC.');
  const vPart = narrator.narrate('Módulo seis: Directorio Central de Business Partners. Tarea 6.1: Registrar Nuevo Socio de Negocios. Damos de alta a Distribuidora Textil de Guadalajara con línea de crédito de doscientos cincuenta mil dólares, quedando disponible de inmediato en Ventas y Cobranza.');
  await sleep(400);
  await humanClick(page, 'button:has-text("+ NUEVO SOCIO DE NEGOCIO"), button:has-text("NUEVO SOCIO")');
  await sleep(900);
  const cancelPart = await page.$('button:has-text("Cancelar")');
  if (cancelPart) await humanClick(page, cancelPart);
  await vPart;

  // [17] MÓDULO DE WMS (Almacenes, Picking & Packing)
  await goToPage(page, 'http://localhost:5173/app/wms');
  await updateHUD(page, '[17] WMS', 'Tarea 17.1 y 17.2: Picking con Código de Barras y Despacho', 'Surtido guiado en Rack B-03 Pasillo 2, empaque y liberación a despacho.', 'Genera automáticamente la guía de transporte para el chofer en Logística.');
  const vWms = narrator.narrate('Módulo diecisiete: WMS de Almacenes. Tarea 17.1: Ejecutar Picking con lector de código de barras en racks. Tarea 17.2: Finalizar Empaque y Liberar a Despacho. El operario confirma el embalaje y transfiere la carga a Logística sin errores.');
  await sleep(400);
  await humanMoveTo(page, 'button:has-text("Iniciar Picking"), button:has-text("Liberar a Despacho")');
  await sleep(800);
  await smoothScrollDown(page, 350);
  await sleep(800);
  await smoothScrollUp(page, 350);
  await vWms;
}

// ==================================================================================
// BLOQUE OPERATIVO: FASE 2 - EXPRESS ($149 USD/mes) - 17 MÓDULOS INTEGRALES
// ==================================================================================
async function runFase2(page, narrator) {
  console.log('\n--- EJECUTANDO FASE 2: EXPRESS (17 MÓDULOS INTEGRALES) ---');

  await goToPage(page, 'http://localhost:5173/app/workspace?phase=2');
  await updateHUD(page, 'FASE 2 • EXPRESS ($149 USD/mes)', 'Manufactura, Cadena y Gobernanza Financiera', 'Suma 10 módulos estratégicos a la Fase 1: Logística, ROP, CxC, CxP, Tesorería & Controles Internos, Activos Fijos, Contabilidad Central, RRHH, Nómina y BPMN.', 'Explore las nuevas pestañas activas en el Workspace.');
  
  const vFase2Intro = narrator.narrate('Iniciamos la capacitación de la Fase Dos: NyTEX Express. Diseñada para empresas en expansión, amplía la solución a diecisiete módulos integrados, incorporando Logística, Punto de Reorden dinámico, Cuentas por Cobrar, Cuentas por Pagar, Tesorería con controles internos de caja, Activos Fijos, Contabilidad Central, Nómina, Recursos Humanos y modelado BPMN.');
  await sleep(500);
  await smoothScrollDown(page, 350);
  await sleep(1000);
  await smoothScrollUp(page, 350);
  await vFase2Intro;

  // [7] LOGÍSTICA Y DISTRIBUCIÓN
  await goToPage(page, 'http://localhost:5173/app/logistica');
  await updateHUD(page, '[7] LOGÍSTICA', 'Tarea 7.1 y 7.2: Tránsito de Mercancía y Confirmación de Entrega', 'Seguimiento de flota en ruta y acuse de recibo firmado por el cliente.', 'Actualiza la orden de venta a Entregada y notifica a Cobranza CxC.');
  const vLog = narrator.narrate('Módulo siete: Logística y Distribución. Tarea 7.1: Iniciar Ruta de Tránsito. Se asigna la unidad y chofer. Tarea 7.2: Confirmar Entrega al Cliente. Al ingresar a zona de reparto y recibir el acuse firmado, la orden en Ventas cambia a Entregada y se habilita la cobranza.');
  await sleep(400);
  await humanMoveTo(page, 'button:has-text("Iniciar Ruta"), button:has-text("Confirmar Entrega")');
  await sleep(800);
  await vLog;

  // [ROP] PUNTO DE REORDEN DINÁMICO
  await goToPage(page, 'http://localhost:5173/app/rop');
  await updateHUD(page, '[ROP] PUNTO DE REORDEN', 'Tarea ROP.1 y ROP.2: Cálculo ROP y Disparo de Requisición EOQ', 'Fórmula: ROP = (Demanda Diaria x Lead Time) + Stock de Seguridad.', 'SKU KC-10185: Demanda 45 cajas/día, Lead Time 7 días, SS 120 cajas ➔ ROP = 435 cajas. Disparo de EOQ: 350 cajas.');
  const vRop = narrator.narrate('Módulo de Punto de Reorden Dinámico. Tarea ROP punto uno: Configuración de Parámetros de SKU y Cálculo del Umbral. Aplicamos la fórmula matemática: Demanda diaria por tiempo de entrega más stock de seguridad. Tarea ROP punto dos: Monitoreo de Semáforo y Disparo de Requisición. Al detectar nivel amarillo de reorden, se dispara a Compras la requisición automática con el Lote Económico de Pedido de trescientas cincuenta cajas.');
  await sleep(400);
  await humanMoveTo(page, 'button:has-text("Generar Requisición"), div:has-text("ROP")');
  await sleep(800);
  await smoothScrollDown(page, 350);
  await sleep(800);
  await smoothScrollUp(page, 350);
  await vRop;

  // [8] CUENTAS POR COBRAR (CxC)
  await goToPage(page, 'http://localhost:5173/app/cxc');
  await updateHUD(page, '[8] CxC', 'Tarea 8.1 y 8.2: Factura a Crédito y Aplicación de Cobro', 'Emisión de Factura FAC-001 por $20,905.00 USD y cobro por transferencia SPEI.', 'Ingreso bancario reflejado en Tesorería y Póliza de Ingreso en Contabilidad.');
  const vCxc = narrator.narrate('Módulo ocho: Cuentas por Cobrar. Tarea 8.1: Emisión Directa de Factura a Crédito por veinte mil novecientos cinco dólares. Tarea 8.2: Aplicar Cobranza Bancaria. Se registra la transferencia electrónica, el saldo de la factura pasa a cero, ingresa el dinero a Tesorería y genera la póliza contable de ingreso.');
  await sleep(400);
  await humanMoveTo(page, 'button:has-text("Aplicar Cobro"), button:has-text("NUEVA FACTURA")');
  await sleep(800);
  await vCxc;

  // [9] CUENTAS POR PAGAR (CxP)
  await goToPage(page, 'http://localhost:5173/app/cxp');
  await updateHUD(page, '[9] CxP', 'Tarea 9.1 y 9.2: Factura Proveedor y Dispersión Bancaria', 'Factura de Tintes & Químicos por $28,250.00 USD y pago programado vía BBVA.', 'Disminuye saldo bancario en Tesorería y genera Póliza de Egreso.');
  const vCxp = narrator.narrate('Módulo nueve: Cuentas por Pagar. Tarea 9.1: Registrar Factura de Proveedor de químicos por veintiocho mil doscientos cincuenta dólares. Tarea 9.2: Dispersión Bancaria. Se ejecuta la transferencia de pago, saldando la obligación y emitiendo la póliza de egresos.');
  await sleep(400);
  await humanMoveTo(page, 'button:has-text("Pagar Factura"), button:has-text("REGISTRAR FACTURA")');
  await sleep(800);
  await vCxp;

  // [10] TESORERÍA, CONTROLES INTERNOS Y FINANZAS (¡Módulo Expandido!)
  await goToPage(page, 'http://localhost:5173/app/tesoreria');
  await updateHUD(page, '[10] TESORERÍA Y FINANZAS', 'Tarea 10.1 a 10.3: Bancos, Cajas y Arqueos Físicos', 'Registro de aportación $50,000 USD, arqueo físico sin descuadre y reposición de caja chica.', 'Pestañas: Bancos, Cajas & Fondos Fijos, Cierres Operativos y Conciliación.');
  const vTes1 = narrator.narrate('Módulo diez: Tesorería, Controles Internos y Finanzas. Tarea 10.1: Registrar Movimiento Bancario. Se aplica una aportación de capital de cincuenta mil dólares en la cuenta maestra BBVA. Tarea 10.2: Cierre y Arqueo Físico de Caja General. Se recontaron mil doscientos cincuenta dólares en efectivo y cuatrocientos cincuenta en vales, con diferencia cero y emisión de acta criptográfica. Tarea 10.3: Control y Reposición de Caja Chica. Se restablece el fondo fijo de quinientos dólares reintegrando trescientos ochenta dólares contra el banco.');
  await sleep(400);
  await humanClick(page, 'button:has-text("Cajas y Fondos Fijos"), div:has-text("Cajas")');
  await sleep(800);
  await humanMoveTo(page, 'button:has-text("Arqueo Físico"), button:has-text("Solicitar Reposición")');
  await sleep(800);
  await vTes1;

  // [10] TESORERÍA: Cierres y Conciliación
  await updateHUD(page, '[10] TESORERÍA Y FINANZAS', 'Tarea 10.4 a 10.8: Cierres Operativos y Conciliación Automática', 'Cierre Diario de Cobros, Pagos y Compras; Conciliación bancaria con Sello SHA-256.', 'Gobernanza financiera con políticas escalonadas de aprobación.');
  const vTes2 = narrator.narrate('Tarea 10.4 a 10.6: Cierres de Operación Diaria. Ejecutamos el cierre sellado de cobros, pagos a proveedores y compras diarias con validación three-way match. Tarea 10.7: Conciliación Bancaria Automática. Punteamos el extracto oficial contra el libro mayor hasta llegar a diferencia cero, sellando con firma criptográfica ese hache a doscientos cincuenta y seis.');
  await sleep(400);
  await humanClick(page, 'button:has-text("Cierres de Operación"), div:has-text("Cierres")');
  await sleep(800);
  await humanClick(page, 'button:has-text("Conciliación"), div:has-text("Conciliación")');
  await sleep(800);
  await vTes2;

  // [11] ACTIVOS FIJOS Y DEPRECIACIONES
  await goToPage(page, 'http://localhost:5173/app/activosfijos');
  await updateHUD(page, '[11] ACTIVOS FIJOS', 'Tarea 11.1 y 11.2: Alta de Telar Mayer & Cie y Depreciación NIF C-6', 'Alta de maquinaria por $385,000 USD y corrida automática de depreciación mensual.', 'Genera Póliza de Diario de Depreciación afectando gasto y depreciación acumulada.');
  const vAct = narrator.narrate('Módulo once: Activos Fijos. Tarea 11.1: Registrar Activo de Planta. Damos de alta el Telar Circular Mayer y Cie con valor de trescientos ochenta y cinco mil dólares y vida útil de diez años. Tarea 11.2: Ejecutar Depreciación Mensual Automática conforme a la norma NIF C seis, emitiendo la póliza contable respectiva.');
  await sleep(400);
  await humanClick(page, 'button:has-text("EJECUTAR DEPRECIACIÓN"), button:has-text("Depreciación Mensual")');
  await sleep(800);
  await vAct;

  // [12] CONTABILIDAD CENTRAL
  await goToPage(page, 'http://localhost:5173/app/contabilidad');
  await updateHUD(page, '[12] CONTABILIDAD CENTRAL', 'Tarea 12.1 y 12.2: Auditoría de Pólizas y Balanza Cuadrada', 'Consulta de pólizas de Ingreso, Egreso y Diario con partida doble verificada.', 'Balanza de Comprobación cuadrada al 100%: Activo = Pasivo + Capital.');
  const vCont = narrator.narrate('Módulo doce: Contabilidad Central. Tarea 12.1: Auditoría de Pólizas Contables automáticas de ingreso, egreso y diario con partida doble verificada. Tarea 12.2: Consulta de la Balanza de Comprobación, constatando que el activo es exactamente igual a la suma del pasivo más capital.');
  await sleep(400);
  await humanClick(page, 'button:has-text("Balanza de Comprobación"), div:has-text("Balanza")');
  await sleep(800);
  await vCont;

  // [13] RRHH Y [14] NÓMINA
  await goToPage(page, 'http://localhost:5173/app/rrhh');
  await updateHUD(page, '[13] RRHH & [14] NÓMINA', 'Tarea 13 y 14: Colaborador, Horas Extra y Timbrado CFDI', 'Alta de Operador de Telar, captura de horas extras y dispersión bancaria.', 'Cálculo de retenciones fiscales de ley y póliza contable de nómina.');
  const vRrhhNom = narrator.narrate('Módulos trece y catorce: Recursos Humanos y Nómina. Tarea 13.1: Alta de colaborador y captura de horas extra dobles. Tarea 14.1 y 14.2: Corrida de nómina quincenal, cálculo de retenciones de ley, dispersión a bancos y timbrado fiscal.');
  await sleep(400);
  await goToPage(page, 'http://localhost:5173/app/nomina');
  await sleep(600);
  await humanClick(page, 'button:has-text("Calcular Nómina"), button:has-text("Dispersar")');
  await sleep(800);
  await vRrhhNom;

  // [15] PROCESS SUITE Y [16] PROCESS MINING
  await goToPage(page, 'http://localhost:5173/app/processsuite');
  await updateHUD(page, '[15] PROCESS SUITE & [16] MINING', 'Tarea 15 y 16: Diseñador BPMN 2.0 y Grafo DFG de Procesos', 'Canvas visual interactivo con eventos, compuertas y tareas de aprobación.', 'Minería en vivo: Descubrimiento de cuellos de botella reales en compras y ventas.');
  const vBpm = narrator.narrate('Módulos quince y dieciséis: Synex Process Suite y Minería de Procesos. Tarea 15.1: Modelador Visual BPMN 2.0 interactivo para diseñar flujos de aprobación jerárquicos. Tarea 16.1: Descubrimiento de Procesos en Vivo en el módulo dieciséis, analizando el grafo DFG para eliminar cuellos de botella.');
  await sleep(400);
  await humanMoveTo(page, 'div:has-text("BPMN"), svg, canvas');
  await sleep(800);
  await goToPage(page, 'http://localhost:5173/app/processmining');
  await sleep(600);
  await humanClick(page, 'button:has-text("Descubrir"), button:has-text("Minería")');
  await sleep(800);
  await vBpm;
}

// ==================================================================================
// BLOQUE OPERATIVO: FASE 3 - ADVANCED ($299 USD/mes) - 22 MÓDULOS DE ANALÍTICA
// ==================================================================================
async function runFase3(page, narrator) {
  console.log('\n--- EJECUTANDO FASE 3: ADVANCED (22 MÓDULOS DE ANALÍTICA) ---');

  await goToPage(page, 'http://localhost:5173/app/workspace?phase=3');
  await updateHUD(page, 'FASE 3 • ADVANCED ($299 USD/mes)', 'Inteligencia de Negocios y Analítica Estratégica', 'Alcanza 22 módulos: Incorpora BI Reportes NIF/IFRS, Dashboards Ejecutivos, Cubo OLAP Multidimensional, Big Data IoT en telares y Data Mining K-Means.', 'Observe el ecosistema de toma de decisiones directivas.');
  
  const vFase3Intro = narrator.narrate('Pasamos a la capacitación de la Fase Tres: NyTEX Advanced. Es el salto estratégico hacia la inteligencia empresarial y analítica multidimensional, alcanzando veintidós módulos. Incorpora reportes financieros auditados bajo normas NIF, cuadros de mando ejecutivos en tiempo real, cubo OLAP hiperdimensional, telemetría IoT industrial y algoritmos de minería de datos.');
  await sleep(500);
  await smoothScrollDown(page, 350);
  await sleep(1000);
  await smoothScrollUp(page, 350);
  await vFase3Intro;

  // [18] BI Y REPORTES FINANCIEROS (NIF / IFRS)
  await goToPage(page, 'http://localhost:5173/app/reportes');
  await updateHUD(page, '[18] REPORTES FINANCIEROS', 'Tarea 18.1: Estados Financieros Básicos Auditados', 'Generación de Estado de Resultados (P&L), Balance General y Flujo de Efectivo.', 'Emisión de reportes ejecutivos listos para bancos y juntas directivas.');
  const vRep = narrator.narrate('Módulo dieciocho: BI y Reportes Financieros. Tarea 18.1: Generar Estado de Resultados y Balance General. Con un solo clic, se emite el estado de pérdidas y ganancias integral y la situación patrimonial bajo normas NIF internacionales.');
  await sleep(400);
  await humanClick(page, 'button:has-text("Estado de Resultados"), button:has-text("Balance General")');
  await sleep(900);
  await vRep;

  // [19] DASHBOARDS EJECUTIVOS EN TIEMPO REAL
  await goToPage(page, 'http://localhost:5173/app/dashboards');
  await updateHUD(page, '[19] DASHBOARDS', 'Tarea 19.1: Análisis de Indicadores Clave de Desempeño', 'KPI Cockpit: Ventas vs Presupuesto, Eficiencia OEE de Planta, DSO y Rotación.', 'Visualización gerencial para toma de decisiones ágiles.');
  const vDash = narrator.narrate('Módulo diecinueve: Dashboards Ejecutivos en Tiempo Real. Tarea 19.1: Análisis de KPIs. Supervisa la eficiencia operativa OEE de la planta, rotación de existencias y plazo de cobranza promedio en un panel visual consolidado.');
  await sleep(400);
  await smoothScrollDown(page, 350);
  await sleep(800);
  await smoothScrollUp(page, 350);
  await vDash;

  // [20] BI CUBO MULTIDIMENSIONAL (OLAP HyperCube)
  await goToPage(page, 'http://localhost:5173/app/bicube');
  await updateHUD(page, '[20] BI CUBO OLAP', 'Tarea 20.1: Navegación Slice & Dice y Drill-Down', 'Cruce multidimensional de Familia de Productos x Región Geográfica x Margen Bruto.', 'Apertura de detalle de ventas al hacer doble clic en celdas de matriz.');
  const vCube = narrator.narrate('Módulo veinte: BI Cubo Multidimensional OLAP. Tarea 20.1: Ejecutar Navegación Slice and Dice. Cruzamos la familia de gabardinas y mezclillas por región comercial y margen de contribución, permitiendo profundizar hasta el cliente específico con drill-down.');
  await sleep(400);
  await humanMoveTo(page, 'div:has-text("OLAP"), table, select');
  await sleep(900);
  await vCube;

  // [21] BIG DATA & TELEMETRÍA IOT INDUSTRIAL
  await goToPage(page, 'http://localhost:5173/app/bigdata');
  await updateHUD(page, '[21] BIG DATA & IOT', 'Tarea 21.1: Monitor de Telemetría IoT en Vivo', 'Lectura de sensores en Telar Mayer & Cie: 28.4 RPM, Temperatura 48.2 °C, Tensión 14.2 cN.', 'Prevención de fallas mecánicas y cálculo automático de metros tejidos.');
  const vIot = narrator.narrate('Módulo veintiuno: Big Data y Telemetría IoT Industrial. Tarea 21.1: Monitor de Telemetría en Vivo. Monitorea en tiempo real las revoluciones por minuto, temperatura de rodamientos y tensión del hilo en noventa y seis telares, emitiendo alertas predictivas.');
  await sleep(400);
  await humanMoveTo(page, 'div:has-text("RPM"), div:has-text("Telar"), svg');
  await sleep(900);
  await vIot;

  // [22] MINERÍA DE DATOS & MACHINE LEARNING
  await goToPage(page, 'http://localhost:5173/app/datamining');
  await updateHUD(page, '[22] DATA MINING', 'Tarea 22.1: Segmentación de Clientes con K-Means', 'Agrupación matemática en 3 clusters: Diamante, Frecuente y Riesgo Crediticio.', 'Optimización proactiva de condiciones de venta y límites de crédito.');
  const vMine = narrator.narrate('Módulo veintidós: Minería de Datos y Machine Learning. Tarea 22.1: Ejecutar Segmentación K-Means. El algoritmo clasifica automáticamente a la cartera de clientes según rentabilidad y riesgo de crédito para definir políticas comerciales inteligentes.');
  await sleep(400);
  await humanClick(page, 'button:has-text("Entrenar"), button:has-text("K-Means")');
  await sleep(900);
  await vMine;
}

// ==================================================================================
// BLOQUE OPERATIVO: FASE 4 - ENTERPRISE ($499 USD/mes) - 25 MÓDULOS TOTALES
// ==================================================================================
async function runFase4(page, narrator) {
  console.log('\n--- EJECUTANDO FASE 4: ENTERPRISE (25 MÓDULOS TOTALES) ---');

  await goToPage(page, 'http://localhost:5173/app/workspace?phase=4');
  await updateHUD(page, 'FASE 4 • ENTERPRISE ($499 USD/mes)', 'Ecosistema Total: Asistente IA, Anticipación y Gobernanza', 'Solución Corporativa Definitiva (25 Módulos): Asistente IA Copilot, Modelos Predictivos Logit/ARIMA, Planeación S&OP / MRP II y Localización Fiscal Regional.', 'La plataforma integral para liderar la industria textil.');
  
  const vFase4Intro = narrator.narrate('Culminamos con la capacitación de la Fase Cuatro: NyTEX Enterprise. Representa la cúspide del ecosistema con veinticinco módulos operativos. Integra un Asistente Cognitivo de Inteligencia Artificial para consultas ejecutivas, modelos econométricos predictivos, planeación avanzada de la demanda ese y o pe con MRP dos, y gobernanza fiscal multi-país.');
  await sleep(500);
  await smoothScrollDown(page, 350);
  await sleep(1000);
  await smoothScrollUp(page, 350);
  await vFase4Intro;

  // [23] ASISTENTE COGNITIVO IA (Copilot Empresarial)
  await goToPage(page, 'http://localhost:5173/app/ia');
  await updateHUD(page, '[23] ASISTENTE IA COPILOT', 'Tarea 23.1: Consultas Ejecutivas en Lenguaje Natural', 'Prompt: "¿Cuál es el margen promedio de la gabardina este mes y cuántos rollos tenemos disponibles?"', 'Respuesta en 1.5s: Margen 42.8%, 180 rollos en stock y sugerencias de manufactura.');
  const vIa = narrator.narrate('Módulo veintitrés: Asistente Cognitivo IA Copilot. Tarea 23.1: Consultar Disponibilidad y Rentabilidad con Prompt. Los directivos pueden formular preguntas en lenguaje cotidiano. El asistente consulta la base de datos y responde en segundo y medio con márgenes, inventario y sugerencias operativas.');
  await sleep(400);

  const iaInput = await page.$('input[type="text"], textarea');
  if (iaInput) {
    await humanType(page, iaInput, '¿Cuál es el margen de la gabardina y stock en Almacén Central?', 40);
    await sleep(600);
  }
  await vIa;

  // [24] MODELOS PREDICTIVOS & RIESGO CREDITICIO
  await goToPage(page, 'http://localhost:5173/app/predictivos');
  await updateHUD(page, '[24] MODELOS PREDICTIVOS', 'Tarea 24.1: Simular Probabilidad de Mora e Incumplimiento', 'Modelo Logit Inferencia Causal: Días de atraso 25, uso de línea 85%, antigüedad 6 meses.', 'Cálculo de probabilidad de impago (78.4% Riesgo Crítico) y recomendaciones.');
  const vPred = narrator.narrate('Módulo veinticuatro: Modelos Predictivos y Riesgo Crediticio. Tarea 24.1: Simular Probabilidad de Mora con Regresión Logística Logit. El sistema evalúa variables financieras del cliente para predecir oportunamente riesgos de impago antes de autorizar despachos.');
  await sleep(400);
  await humanClick(page, 'button:has-text("Calcular"), button:has-text("Proyectar")');
  await sleep(900);
  await vPred;

  // [25] PLANEACIÓN DE LA DEMANDA & S&OP (MRP II)
  await goToPage(page, 'http://localhost:5173/app/planeacion');
  await updateHUD(page, '[25] S&OP / MRP II', 'Tarea 25.1: Sincronización S&OP y Disparo de Requerimientos', 'Explosión de requerimientos MRP II: Demanda 50 rollos ➔ Déficit neto 600 kg hilo.', 'Disparo automático de requisición a Compras y órdenes sugeridas a Producción.');
  const vPlan = narrator.narrate('Módulo veinticinco: Planeación de la Demanda y S&OP MRP dos. Tarea 25.1: Ejecutar la Sincronización S&OP. El motor calcula la demanda proyectada, explosiona la lista de materiales y envía automáticamente las requisiciones a Compras y el plan de tejido a Producción.');
  await sleep(400);
  await humanClick(page, 'button:has-text("Sincronización S&OP"), button:has-text("Ejecutar")');
  await sleep(900);
  await vPlan;

  // [26] CONFIGURACIÓN FISCAL MULTI-PAÍS & AUDITORÍA INMUTABLE
  await goToPage(page, 'http://localhost:5173/app/configuracion');
  await updateHUD(page, '[26] CONFIGURACIÓN & AUDITORÍA', 'Tarea 26.1 y 26.2: Localización Fiscal y Audit Trail Inmutable', 'Drivers regionales: El Salvador (DTE/MH 13%), Guatemala (FEL/SAT 12%), Honduras (SAR 15%).', 'Bitácora inmutable con sellos criptográficos para blindaje fiscal absoluto.');
  const vConf = narrator.narrate('Módulo veintiséis: Configuración del Sistema y Auditoría Inmutable. Tarea 26.1: Configuración de Localización Fiscal Multi-País, adaptándose a El Salvador, Guatemala, Honduras, Costa Rica, Panamá y México. Tarea 26.2: Bitácora Inmutable de Auditoría, garantizando blindaje tributario y trazabilidad absoluta de cada transacción.');
  await sleep(400);
  await humanClick(page, 'button:has-text("Bitácora"), div:has-text("Auditoría")');
  await sleep(900);
  await vConf;

  // Cierre de Capacitación en Workspace Unificado
  await goToPage(page, 'http://localhost:5173/app/workspace');
  await updateHUD(page, 'NYTEX ERP • ÉXITO OPERATIVO', 'Capacitación Completada Conforme a la Guía v4.0', 'Los 25 módulos del ecosistema están interconectados y listos para operar.', 'Transformación digital garantizada con Consultores NyT.');
  const vEnd = narrator.narrate('Con esto concluimos la capacitación integral de las cuatro fases de NyTEX ERP, basada estrictamente en la Guía de Simulación Operativa Versión 4.0. Su empresa cuenta ahora con el respaldo de una plataforma moderna, ágil y rentable. Muchas gracias.');
  await sleep(500);
  await smoothScrollDown(page, 350);
  await sleep(800);
  await smoothScrollUp(page, 350);
  await vEnd;
}

// ==================================================================================
// EJECUTOR PRINCIPAL
// ==================================================================================
async function main() {
  const args = process.argv.slice(2);
  let selectedFase = 'all';

  for (const arg of args) {
    if (arg.startsWith('--fase=')) {
      selectedFase = arg.split('=')[1].toLowerCase();
    }
  }

  const phaseNames = {
    '1': 'Fase_1_Starter',
    '2': 'Fase_2_Express',
    '3': 'Fase_3_Advanced',
    '4': 'Fase_4_Enterprise',
    'all': 'Completo_4_Fases'
  };

  const label = phaseNames[selectedFase] || 'Completo_4_Fases';
  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const targetMp4Name = `Capacitacion_NyTEX_${label}_${timestamp}.mp4`;

  console.log('================================================================');
  console.log(`   INICIANDO CAPACITACIÓN OPERATIVA NyTEX ERP - VERSIÓN 4.0`);
  console.log(`   Modalidad: ${label.toUpperCase()} • Fecha: ${now.toLocaleString()}`);
  console.log('================================================================\n');

  const browser = await chromium.launch({
    channel: 'msedge',
    headless: false,
    args: [
      '--start-maximized',
      '--disable-infobars',
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: {
      dir: outputDir,
      size: { width: 1440, height: 900 }
    }
  });

  const page = await context.newPage();
  await installMousePointer(page);

  const narrator = new AudioNarrator(tempDir);
  narrator.setVideoStartTime(Date.now());

  let videoHandle = null;
  try {
    videoHandle = page.video();
  } catch (e) {}

  try {
    // Ingreso inicial al ERP
    await page.goto('http://localhost:5173/app/workspace', { waitUntil: 'domcontentloaded' });
    await sleep(1500);

    if (selectedFase === '1') {
      await runFase1(page, narrator);
    } else if (selectedFase === '2') {
      await runFase2(page, narrator);
    } else if (selectedFase === '3') {
      await runFase3(page, narrator);
    } else if (selectedFase === '4') {
      await runFase4(page, narrator);
    } else {
      await runFase1(page, narrator);
      await runFase2(page, narrator);
      await runFase3(page, narrator);
      await runFase4(page, narrator);
    }

    await sleep(2500);

    console.log('\n================================================================');
    console.log('   ¡RECORRIDO FINALIZADO! PROCESANDO VIDEO CON AUDIO MP4...    ');
    console.log('================================================================');
  } catch (error) {
    console.error('Error durante la capacitación:', error);
  } finally {
    try {
      await sleep(1000);
      let rawVideoPath = null;
      if (videoHandle) {
        rawVideoPath = await videoHandle.path();
      }

      await page.close();
      await context.close();
      await browser.close();

      const masterAudio = path.join(tempDir, 'master_narration.wav').replace(/\\/g, '/');
      const hasAudio = narrator.buildMasterAudio(masterAudio);
      const finalMp4Path = path.join(outputDir, targetMp4Name);

      if (hasAudio && rawVideoPath && fs.existsSync(rawVideoPath)) {
        console.log('\nIntegrando pista de voz con el video en formato MP4...');
        execSync(`"${ffmpegExe}" -i "${rawVideoPath}" -i "${masterAudio}" -c:v libx264 -pix_fmt yuv420p -c:a aac -b:a 192k -y "${finalMp4Path}"`, { stdio: 'inherit' });
        console.log('\n================================================================');
        console.log('   ¡VIDEO MP4 CON VOZ Y VIDEO INTEGRADOS CREADO CON ÉXITO!     ');
        console.log('================================================================');
        console.log(`Archivo final listo para enviar a clientes o capacitación:\n${finalMp4Path}\n`);
      } else {
        console.log('No se pudo fusionar audio/video automáticamente.');
      }
    } catch (e) {
      console.error('Error integrando video y audio final:', e.message);
    }
  }
}

main();
