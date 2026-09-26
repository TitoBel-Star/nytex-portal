const fs = require('fs');

const marketingHtml = fs.readFileSync('../Diagnóstico de preguntas revela fugas operativas/index.html', 'utf8');

const start = marketingHtml.indexOf('<div id="diagramWrapper"');
const endPre = marketingHtml.indexOf('</pre>', start);
const end = marketingHtml.indexOf('</div>', endPre) + 6;

if (start > -1 && end > -1) {
    let diagramHtml = marketingHtml.substring(start, end);
    
    // Convert 26 to 24
    diagramHtml = diagramHtml.replace("26 Módulos Conectados", "24 Módulos Conectados");
    diagramHtml = diagramHtml.replace("26 aplicaciones", "24 aplicaciones");
    
    // Remove PM
    diagramHtml = diagramHtml.replace(/PM\[.*?\]:::core/g, '');
    diagramHtml = diagramHtml.replace(/PS --> PM/g, '');
    diagramHtml = diagramHtml.replace(/PM --> CONF/g, '');
    diagramHtml = diagramHtml.replace(/<style>[\s\S]*?<\/style>/g, '');
    diagramHtml = diagramHtml.replace(/style="[^"]*"/g, '');
    diagramHtml = diagramHtml.replace(/<!--.*?-->/g, '');

    // Reset Dashboard to clean state first
    fs.copyFileSync('portal-frontend/src/components/Dashboard.jsx.backup', 'portal-frontend/src/components/Dashboard.jsx');
    
    let dashboard = fs.readFileSync('portal-frontend/src/components/Dashboard.jsx', 'utf8');
    
    const diag = `\n\n      {/* DIAGRAMA AQUI */}
      <div className="bg-gradient-to-br from-gray-950 via-[#0a0f1d] to-[#0f172a] rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl border border-gray-800 mt-12 mb-16 w-full">
          {/* Encabezado del marco */}
          <div className="text-center max-w-3xl mx-auto mb-10">
              <span className="bg-[#fbc044]/15 text-[#fbc044] border border-[#fbc044]/30 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest inline-block mb-3">
                  Arquitectura Empresarial NyTEX
              </span>
              <h3 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Ecosistema Operativo y Mapeo por Áreas Funcionales</h3>
              <p className="text-gray-400 text-sm md:text-base mt-3 leading-relaxed">
                  Conozca la interconexión viva de las <strong className="text-white font-bold">24 aplicaciones</strong> de nuestro ecosistema, clasificadas según su <strong className="text-[#fbc044]">Dirección Estratégica</strong> y los departamentos que operan día a día.
              </p>
          </div>
          <div dangerouslySetInnerHTML={{ __html: \`${diagramHtml.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\` }} />
      </div>\n`;

    if (dashboard.includes('{/* Mini Admin Panel para Pruebas')) {
        dashboard = dashboard.replace('{/* Mini Admin Panel para Pruebas', diag + '\n      {/* Mini Admin Panel para Pruebas');
    }
    
    dashboard = dashboard.replace(/moduleCount:\s*'24 M\\"DULOS:'/g, "moduleCount: '24 MÓDULOS:'");
    dashboard = dashboard.replace(/moduleCount:\s*'26 M\\"DULOS:'/g, "moduleCount: '24 MÓDULOS:'");
    dashboard = dashboard.replace(/moduleCount:\s*'26 MÓDULOS:'/g, "moduleCount: '24 MÓDULOS:'");
    dashboard = dashboard.replace("border-[var(--nytex-cyan)] ring-4 ring-[var(--nytex-cyan)] shadow-[0_0_20px_rgba(9,169,232,0.8)] transform scale-105 z-20", 
        "border-[#15A36A] ring-4 ring-[#15A36A] shadow-[0_0_20px_rgba(21,163,106,0.8)] transform scale-105 z-20");
    dashboard = dashboard.replace("SELECCIONADO", "ADQUIRIDO");
    
    dashboard = dashboard.replace("const handleContratar = (phaseId, phaseModules) => {", 
        "useEffect(() => { setTimeout(() => { if (window.mermaid) { window.mermaid.init(undefined, document.querySelectorAll('.mermaid')); } }, 500); }, []);\n\n  const handleContratar = (phaseId, phaseModules) => {");
    
    fs.writeFileSync('portal-frontend/src/components/Dashboard.jsx', dashboard);

    // Inject Mermaid Library into index.html
    let indexHtml = fs.readFileSync('portal-frontend/index.html', 'utf8');
    if (!indexHtml.includes('mermaid')) {
        indexHtml = indexHtml.replace('</head>', '  <script type="module">import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs"; window.mermaid = mermaid; mermaid.initialize({ startOnLoad: true, theme: "dark" });</script>\n  </head>');
        fs.writeFileSync('portal-frontend/index.html', indexHtml);
    }

    console.log("Success extracting and injecting");
} else {
    console.log("Match not found again");
}
