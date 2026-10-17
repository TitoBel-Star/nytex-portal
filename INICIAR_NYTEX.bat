@echo off
title Iniciador de NyTEX ERP
echo ==============================================
echo       INICIANDO NYTEX ERP - SERVIDORES
echo ==============================================
echo.
echo 1. Iniciando Servidor Backend (Puerto 3001)...
start "NyTEX Backend" cmd /k "cd /d "%~dp0portal-backend" && node server.js"
timeout /t 3 /nobreak >nul
echo 2. Iniciando Servidor Frontend (Puerto 5173)...
start "NyTEX Frontend" cmd /k "cd /d "%~dp0portal-frontend" && npm run dev -- --host"
timeout /t 3 /nobreak >nul
echo.
echo ==============================================
echo  NyTEX ERP esta listo!
echo  Abriendo: http://localhost:5173/app/workspace
echo ==============================================
start http://localhost:5173/app/workspace
