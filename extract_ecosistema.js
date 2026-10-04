const fs = require('fs');
const html = fs.readFileSync('../Diagnóstico de preguntas revela fugas operativas/index.html', 'utf8');

const start = html.indexOf('<!-- Marco de Ecosistema NyTEX y Áreas Funcionales -->');
const nextSection = html.indexOf('<!-- 11. ROADMAP (Visual) -->');
const end = html.lastIndexOf('</section>', nextSection);

console.log('start:', start, 'end:', end);
if (start > -1 && end > -1) {
    const block = html.substring(start, end);
    fs.writeFileSync('ecosistema_full.html', block);
    console.log('Saved ecosistema_full.html, length:', block.length);
} else {
    console.log('Could not find markers');
}
