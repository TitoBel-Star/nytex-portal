const fs = require('fs');

let dashboard = fs.readFileSync('portal-frontend/src/components/Dashboard.jsx', 'utf8');

// The mermaid script from marketing
let diagramHtml = fs.readFileSync('mermaid_html.txt', 'utf8');
diagramHtml = diagramHtml.replace("26 Módulos Conectados", "24 Módulos Conectados");
diagramHtml = diagramHtml.replace("26 aplicaciones", "24 aplicaciones");

// Remove extra modules (Process Mining)
diagramHtml = diagramHtml.replace(/PM\[.*?\]:::core/g, '');
diagramHtml = diagramHtml.replace(/PS --> PM/g, '');
diagramHtml = diagramHtml.replace(/PM --> CONF/g, '');
diagramHtml = diagramHtml.replace(/<style>[\s\S]*?<\/style>/g, '');

diagramHtml = diagramHtml.replace(/class=/g, 'className=');
diagramHtml = diagramHtml.replace(/style="[^"]*"/g, '');
diagramHtml = diagramHtml.replace(/<!--.*?-->/g, '');

const jsxString = `
      {/* Marco de Ecosistema */}
      <div dangerouslySetInnerHTML={{ __html: \`${diagramHtml.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\` }} />
`;

// Inject right before PaymentSimulatorModal
if (!dashboard.includes('Marco de Ecosistema')) {
    const insertPoint = dashboard.indexOf('<PaymentSimulatorModal');
    if (insertPoint > -1) {
        dashboard = dashboard.substring(0, insertPoint) + jsxString + '\n      ' + dashboard.substring(insertPoint);
    }
}

fs.writeFileSync('portal-frontend/src/components/Dashboard.jsx', dashboard);
console.log('Injected Diagram');
