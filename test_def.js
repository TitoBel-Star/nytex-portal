const fs = require('fs');
const code = fs.readFileSync('portal-frontend/src/components/NytexEcosistemaDiagram.jsx', 'utf8');
const start = code.indexOf('const diagramDefinition = `');
const end = code.indexOf('`;', start);
const def = code.substring(start + 27, end);

console.log('Total lines:', def.split('\n').length);
const openB = (def.match(/\[/g) || []).length;
const closeB = (def.match(/\]/g) || []).length;
console.log('Brackets open/close:', openB, closeB);

const nodes = [...def.matchAll(/^([A-Z0-9_]+)\[/gm)].map(m => m[1]);
console.log('Total nodes defined:', nodes.length);
console.log('Nodes:', nodes);
