@echo off
title NyTEX ERP - Capacitacion Fase 1 Starter ($35 USD/mes)
color 0B
if exist "%~dp0demo_por_fases.js" (cd /d "%~dp0") else (cd /d "%~dp0..")

echo =======================================================================
echo          NyTEX ERP - CAPACITACION FASE 1: STARTER ($35 USD/mes)
echo                     Control Transaccional (7 Modulos)
echo =======================================================================
echo.
echo  Modulos a demostrar de forma independiente:
echo   - [1] Ventas y Cotizaciones
echo   - [3] Control de Inventario y SKUs
echo   - [4] Compras y Abastecimiento
echo   - [8] Cuentas por Cobrar (CxC)
echo   - [9] Cuentas por Pagar (CxP)
echo   - [10] Tesoreria y Bancos
echo   - [12] Contabilidad Central Automatica
echo.
echo  * La locutora explicara cada ventana, boton y campo a capturar.
echo  * FFmpeg integrara automaticamente el video y la voz en MP4.
echo =======================================================================
echo.
echo Presione cualquier tecla para iniciar la demostracion de la FASE 1...
pause >nul
echo.
echo Ejecutando... Observe su pantalla y escuche la explicacion.
echo.
node demo_por_fases.js --fase=1
echo.
echo =======================================================================
echo  Demostracion de FASE 1 finalizada!
echo  Abriendo carpeta con su video MP4...
echo =======================================================================
start "" "%cd%\demos_grabados"
pause
