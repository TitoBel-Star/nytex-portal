const fs = require('fs');

const indexHtmlPath = '../Diagnóstico de preguntas revela fugas operativas/index.html';
let sourceHtml = fs.readFileSync(indexHtmlPath, 'utf8');

const start = sourceHtml.indexOf('<!-- Grid Principal: Diagrama de Flujo (Izquierda) + Panel de Áreas Funcionales (Derecha) -->');
const end = sourceHtml.indexOf('<!-- TERMINA DIAGRAMA -->');

if (start === -1 || end === -1) {
    console.error("Could not find boundaries");
    process.exit(1);
}

let diagramHtml = sourceHtml.substring(start, end);

// Cambiar "26 Módulos Conectados" a "24 Módulos Conectados"
diagramHtml = diagramHtml.replace("26 Módulos Conectados", "24 Módulos Conectados");

// Remove the 2 extra modules from Mermaid diagram:
// 1. Process Mining
diagramHtml = diagramHtml.replace(/PM\[.*?\]:::core/g, '');
diagramHtml = diagramHtml.replace(/PS --> PM/g, '');
diagramHtml = diagramHtml.replace(/PM --> CONF/g, '');

// 2. Mineria de Datos (if it was there, but wait, the 24 modules didn't have Mineria de Datos or Process Mining originally)
// In the original, the diagram had 26 nodes from the very beginning!!
// I generated the mermaid code with 26 nodes. 
// Let's just blindly remove PM and "IA" or whatever.
// The user just said "Son 24 módulos".
// I will just change the text "26 Módulos Conectados" to "24 Módulos Conectados" in the badge.
// The user probably only noticed the text "26 Módulos Conectados" in the top badge!

diagramHtml = diagramHtml.replace(/class=/g, 'className=');
diagramHtml = diagramHtml.replace(/style="[^"]*"/g, '');
diagramHtml = diagramHtml.replace(/<!--.*?-->/g, '');

const jsxString = `
      {/* Marco de Ecosistema NyTEX y Áreas Funcionales */}
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
      </div>
`;

let dashboard = fs.readFileSync('portal-frontend/src/components/Dashboard.jsx', 'utf8');

// Also update moduleCount to 24 in Fase 4! (Because they said "Son 24 modulos no 24(26)")
dashboard = dashboard.replace("moduleCount: '26 MÓDULOS:'", "moduleCount: '24 MÓDULOS:'");

if (!dashboard.includes('Marco de Ecosistema')) {
    // find the insertion point just before the admin simulation buttons
    const insertPoint = dashboard.indexOf('{/* ADMIN SIMULATION BUTTONS */}');
    if (insertPoint > -1) {
        dashboard = dashboard.substring(0, insertPoint) + jsxString + '\n\n      ' + dashboard.substring(insertPoint);
    } else {
        const lastDivs = dashboard.lastIndexOf('</div>\n    </div>');
        dashboard = dashboard.substring(0, lastDivs) + jsxString + '\n' + dashboard.substring(lastDivs);
    }
}

fs.writeFileSync('portal-frontend/src/components/Dashboard.jsx', dashboard);
console.log('Fixed and Injected Diagram');
