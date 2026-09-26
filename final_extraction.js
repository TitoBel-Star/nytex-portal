const fs = require('fs');

const marketingHtml = fs.readFileSync('../Diagnóstico de preguntas revela fugas operativas/index.html', 'utf8');

// Find the exact block
const match = marketingHtml.match(/<!-- Marco de Ecosistema NyTEX y Áreas Funcionales -->[\s\S]*?<!-- TERMINA DIAGRAMA -->/);

if (match) {
    let diagramHtml = match[0];
    
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

    // Because this is injected via dangerouslySetInnerHTML, we leave class= as class= !
    
    // Reset Dashboard to clean state first
    fs.copyFileSync('portal-frontend/src/components/Dashboard.jsx.backup', 'portal-frontend/src/components/Dashboard.jsx');
    
    let dashboard = fs.readFileSync('portal-frontend/src/components/Dashboard.jsx', 'utf8');
    
    const diag = `\n\n      {/* DIAGRAMA AQUI */}
      <div dangerouslySetInnerHTML={{ __html: \`${diagramHtml.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\` }} />\n`;

    if (dashboard.includes('{/* Mini Admin Panel para Pruebas')) {
        dashboard = dashboard.replace('{/* Mini Admin Panel para Pruebas', diag + '\n      {/* Mini Admin Panel para Pruebas');
    }
    
    dashboard = dashboard.replace(/moduleCount:\s*'24 M\\"DULOS:'/g, "moduleCount: '24 MÓDULOS:'");
    dashboard = dashboard.replace("border-[var(--nytex-cyan)] ring-4 ring-[var(--nytex-cyan)] shadow-[0_0_20px_rgba(9,169,232,0.8)] transform scale-105 z-20", 
        "border-[#15A36A] ring-4 ring-[#15A36A] shadow-[0_0_20px_rgba(21,163,106,0.8)] transform scale-105 z-20");
    dashboard = dashboard.replace("SELECCIONADO", "ADQUIRIDO");
    
    dashboard = dashboard.replace("const handleContratar = (phaseId, phaseModules) => {", 
        "useEffect(() => { setTimeout(() => { if (window.mermaid) { window.mermaid.init(undefined, document.querySelectorAll('.mermaid')); } }, 500); }, []);\n\n  const handleContratar = (phaseId, phaseModules) => {");
    
    fs.writeFileSync('portal-frontend/src/components/Dashboard.jsx', dashboard);
    console.log("Success");
} else {
    console.log("Match not found");
}
