const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk('C:/Users/emili/OneDrive/Desktop/Developer/Implementacion de Partners/portal-frontend/src');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes('http://localhost:3001')) {
        content = content.replace(/http:\/\/localhost:3001/g, '');
        fs.writeFileSync(file, content);
        console.log('Fixed', file);
    }
});
