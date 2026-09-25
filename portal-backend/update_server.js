const fs = require('fs');
let code = fs.readFileSync('server.js', 'utf8');

if (!code.includes('express.static')) {
    const staticCode = `
    const path = require('path');
    app.use(express.static(path.join(__dirname, 'public')));
    app.get('*', (req, res) => {
      // Only serve index.html for non-API routes
      if (!req.path.startsWith('/api')) {
         res.sendFile(path.join(__dirname, 'public', 'index.html'));
      } else {
         res.status(404).json({ error: 'API route not found' });
      }
    });
    `;
    code = code.replace('app.listen(PORT', staticCode + '\n    app.listen(PORT');
    fs.writeFileSync('server.js', code);
    console.log("Updated server.js");
}
