const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

async function renderPdf() {
  console.log('🚀 Iniciando renderizado de PDF para Módulo [2] NyTEX CRM...');

  const baseDir = path.join(__dirname, 'Manuales de usuarios NyTEX');
  const dirExpress = path.join(baseDir, 'Fase 2 Express', 'Modulo 2 NyTEX CRM');
  const dirConsolidated = path.join(baseDir, 'Manuales de Usuario NyTEX - Fases 1 a 4', 'Fase 2 - Express (Operación y Cadena Completa)', 'Modulo 2 NyTEX CRM');
  const dirRoot = baseDir;

  const htmlPath = path.join(dirExpress, 'NyTEX_Modulo_2_CRM_(Embudo_de_Ventas_&_Oportunidades)_Imprimible.html');

  if (!fs.existsSync(htmlPath)) {
    console.error('❌ Archivo HTML no encontrado:', htmlPath);
    process.exit(1);
  }

  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();

  const fileUrl = 'file:///' + htmlPath.replace(/\\/g, '/');
  console.log('🌐 Navegando a:', fileUrl);
  await page.goto(fileUrl, { waitUntil: 'load' });
  await page.waitForTimeout(1000);

  const primaryPdf = path.join(dirExpress, 'Módulo 2 NyTEX CRM (Embudo de Ventas & Oportunidades) - Manual de usuario.pdf');

  await page.pdf({
    path: primaryPdf,
    format: 'A4',
    margin: {
      top: '20mm',
      bottom: '20mm',
      left: '16mm',
      right: '16mm'
    },
    displayHeaderFooter: true,
    headerTemplate: '<div style="font-family: Arial, sans-serif; font-size: 8pt; color: #8C8C8C; text-align: right; width: 100%; padding-right: 16mm;">ERP NyTEX 4.0 — Módulo [2] CRM (Embudo de Ventas & Oportunidades) — Fase 2: Express</div>',
    footerTemplate: '<div style="font-family: Arial, sans-serif; font-size: 8pt; color: #8C8C8C; text-align: center; width: 100%;">Página <span class="pageNumber"></span> de <span class="totalPages"></span> • Manual Oficial NyTEX • Confidencial</div>',
    printBackground: true
  });

  console.log('✅ PDF principal generado con éxito:', primaryPdf);

  // Copias de distribución
  const copyTargets = [
    path.join(dirExpress, 'NyTEX_Modulo_2_CRM_(Embudo_de_Ventas_&_Oportunidades).pdf'),
    path.join(dirExpress, 'NyTEX_Modulo_2_Manual_CRM_(Embudo_de_Ventas_&_Oportunidades).pdf'),
    path.join(dirConsolidated, 'Módulo 2 NyTEX CRM (Embudo de Ventas & Oportunidades) - Manual de usuario.pdf'),
    path.join(dirConsolidated, 'NyTEX_Modulo_2_CRM_(Embudo_de_Ventas_&_Oportunidades).pdf'),
    path.join(dirConsolidated, 'NyTEX_Modulo_2_Manual_CRM_(Embudo_de_Ventas_&_Oportunidades).pdf'),
    path.join(dirRoot, 'Módulo 2 NyTEX CRM (Embudo de Ventas & Oportunidades) - Manual de usuario.pdf')
  ];

  for (const target of copyTargets) {
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(primaryPdf, target);
    console.log('  📄 Copia guardada en:', target);
  }

  await browser.close();
  console.log('🎉 Renderizado de PDFs para Módulo [2] CRM completado con éxito!');
}

renderPdf().catch(err => {
  console.error('❌ Error generando PDF:', err);
  process.exit(1);
});
