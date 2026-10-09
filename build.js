const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting NyTEX Portal deployment build process...');

const publicDir = path.join(__dirname, 'portal-backend', 'public');
const distDir = path.join(__dirname, 'portal-frontend', 'dist');

// Check if we are on Render with pre-compiled assets
const isRender = process.env.RENDER === 'true';
const hasPublicAssets = fs.existsSync(path.join(publicDir, 'index.html')) && fs.existsSync(path.join(publicDir, 'assets'));

if (isRender && hasPublicAssets) {
  console.log('⚡ Render cloud environment detected with pre-compiled bundle. Skipping heavy Vite compile to prevent OOM memory limits.');
} else {
  console.log('📦 Installing frontend dependencies and compiling Vite bundle...');
  execSync('npm install --include=dev', { cwd: path.join(__dirname, 'portal-frontend'), stdio: 'inherit' });
  execSync('npm run build', { cwd: path.join(__dirname, 'portal-frontend'), stdio: 'inherit' });

  console.log('📂 Syncing portal-frontend/dist into portal-backend/public...');
  if (fs.existsSync(publicDir)) {
    fs.rmSync(publicDir, { recursive: true, force: true });
  }
  fs.cpSync(distDir, publicDir, { recursive: true });
}

// Ensure backend dependencies are installed
console.log('📦 Installing backend production dependencies...');
execSync('npm install --production', { cwd: path.join(__dirname, 'portal-backend'), stdio: 'inherit' });

console.log('✅ NyTEX ERP Portal build complete and ready for deployment!');
