const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting NyTEX Portal unified build process...');

try {
  // 1. Build Frontend
  console.log('📦 Installing frontend dependencies and compiling Vite bundle...');
  execSync('npm install --include=dev', { cwd: path.join(__dirname, 'portal-frontend'), stdio: 'inherit' });
  execSync('npm run build', { cwd: path.join(__dirname, 'portal-frontend'), stdio: 'inherit' });

  // 2. Install Backend dependencies
  console.log('📦 Installing backend dependencies...');
  execSync('npm install', { cwd: path.join(__dirname, 'portal-backend'), stdio: 'inherit' });

  // 3. Sync frontend dist into backend public directory
  console.log('📂 Syncing portal-frontend/dist into portal-backend/public...');
  const publicDir = path.join(__dirname, 'portal-backend', 'public');
  const distDir = path.join(__dirname, 'portal-frontend', 'dist');

  if (fs.existsSync(publicDir)) {
    fs.rmSync(publicDir, { recursive: true, force: true });
  }
  fs.cpSync(distDir, publicDir, { recursive: true });

  console.log('✅ NyTEX ERP Portal build complete and ready for deployment!');
} catch (error) {
  console.error('❌ Build failed:', error);
  process.exit(1);
}
