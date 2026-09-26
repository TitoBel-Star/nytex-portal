const fs = require('fs');

let dashboard = fs.readFileSync('portal-frontend/src/components/Dashboard.jsx', 'utf8');
let mermaidText = fs.readFileSync('mermaid_html.txt', 'utf8');

// Use proper attribute names that mermaid recognizes by replacing className back to class inside the string dynamically
// Wait! If I inject RAW HTML with dangerouslySetInnerHTML, I should NOT change `class=` to `className=`!
// Because dangerouslySetInnerHTML injects RAW DOM, where `class=` is the correct native attribute!
// If I use `className=`, the DOM will have `classname="..."` and CSS/Mermaid will NOT find it!
mermaidText = mermaidText.replace(/style="[^"]*"/g, '');
mermaidText = mermaidText.replace(/<!--.*?-->/g, '');
mermaidText = mermaidText.replace(/`/g, '\\`').replace(/\$/g, '\\$');
mermaidText = mermaidText.replace('26 Módulos Conectados', '24 Módulos Conectados').replace('26 aplicaciones', '24 aplicaciones');

// Remove extra nodes: PM, PS->PM, PM->CONF
mermaidText = mermaidText.replace(/PM\[.*?\]:::core/g, '');
mermaidText = mermaidText.replace(/PS --> PM/g, '');
mermaidText = mermaidText.replace(/PM --> CONF/g, '');

const diag = `\n\n      {/* DIAGRAMA AQUI */}
      <div dangerouslySetInnerHTML={{ __html: \`${mermaidText}\` }} />\n`;

// Insert the diagram at the end, before the mini admin panel
if (dashboard.includes('{/* Mini Admin Panel para Pruebas')) {
    dashboard = dashboard.replace('{/* Mini Admin Panel para Pruebas', diag + '\n      {/* Mini Admin Panel para Pruebas');
} else {
    console.error("Could not find insertion point!");
}

// 24 Modulos text fix
dashboard = dashboard.replace(/moduleCount:\s*'24 M\\"DULOS:'/g, "moduleCount: '24 MÓDULOS:'");

// Highlight color and text fix
dashboard = dashboard.replace("border-[var(--nytex-cyan)] ring-4 ring-[var(--nytex-cyan)] shadow-[0_0_20px_rgba(9,169,232,0.8)] transform scale-105 z-20", 
    "border-[#15A36A] ring-4 ring-[#15A36A] shadow-[0_0_20px_rgba(21,163,106,0.8)] transform scale-105 z-20");
dashboard = dashboard.replace("SELECCIONADO", "ADQUIRIDO");

// Initialize Mermaid
dashboard = dashboard.replace("const handleContratar = (phaseId, phaseModules) => {", 
    "useEffect(() => { setTimeout(() => { if (window.mermaid) { window.mermaid.init(undefined, document.querySelectorAll('.mermaid')); } }, 500); }, []);\n\n  const handleContratar = (phaseId, phaseModules) => {");

fs.writeFileSync('portal-frontend/src/components/Dashboard.jsx', dashboard);

// Inject Mermaid Library into index.html
let indexHtml = fs.readFileSync('portal-frontend/index.html', 'utf8');
if (!indexHtml.includes('mermaid')) {
    indexHtml = indexHtml.replace('</head>', '  <script type="module">import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs"; window.mermaid = mermaid; mermaid.initialize({ startOnLoad: true, theme: "dark" });</script>\n  </head>');
    fs.writeFileSync('portal-frontend/index.html', indexHtml);
}
console.log("Success");
