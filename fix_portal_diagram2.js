const fs = require('fs');

let diagramHtml = fs.readFileSync('mermaid_html.txt', 'utf8');

// Cambiar "26 Módulos Conectados" a "24 Módulos Conectados"
diagramHtml = diagramHtml.replace("26 Módulos Conectados", "24 Módulos Conectados");
diagramHtml = diagramHtml.replace("26 aplicaciones", "24 aplicaciones");

// Remove the 2 extra modules from Mermaid diagram:
diagramHtml = diagramHtml.replace(/PM\[.*?\]:::core/g, '');
diagramHtml = diagramHtml.replace(/PS --> PM/g, '');
diagramHtml = diagramHtml.replace(/PM --> CONF/g, '');
diagramHtml = diagramHtml.replace(/<style>[\s\S]*?<\/style>/g, '');

diagramHtml = diagramHtml.replace(/class=/g, 'className=');
diagramHtml = diagramHtml.replace(/style="[^"]*"/g, ''); // React no acepta style strings
diagramHtml = diagramHtml.replace(/<!--.*?-->/g, '');

const jsxString = `
      {/* Marco de Ecosistema NyTEX y Áreas Funcionales */}
      <div dangerouslySetInnerHTML={{ __html: \`${diagramHtml.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\` }} />
`;

let dashboard = fs.readFileSync('portal-frontend/src/components/Dashboard.jsx', 'utf8');

// Update to 24 Modulos
dashboard = dashboard.replace("moduleCount: '26 MÓDULOS:'", "moduleCount: '24 MÓDULOS:'");

if (!dashboard.includes('Marco de Ecosistema')) {
    const lastDivs = dashboard.lastIndexOf('</div>\n    </div>\n  );\n};');
    if (lastDivs > -1) {
        dashboard = dashboard.substring(0, lastDivs) + jsxString + '\n' + dashboard.substring(lastDivs);
    }
}

// Ensure Mermaid is initialized
if (!dashboard.includes('window.mermaid')) {
    dashboard = dashboard.replace("const handleContratar = (phaseId, phaseModules) => {", 
        "useEffect(() => { setTimeout(() => { if (window.mermaid) { window.mermaid.init(undefined, document.querySelectorAll('.mermaid')); } }, 500); }, []);\n\n  const handleContratar = (phaseId, phaseModules) => {");
}

fs.writeFileSync('portal-frontend/src/components/Dashboard.jsx', dashboard);
console.log('Fixed and Injected Diagram');
