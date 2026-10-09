@echo off
title NyTEX ERP - Capacitacion Fase 1 Starter ($35 USD/mes) - v4.0
color 0B
if exist "%~dp0demo_por_fases.js" (cd /d "%~dp0") else (cd /d "%~dp0..")

echo =======================================================================
echo          NyTEX ERP - CAPACITACION FASE 1: STARTER ($35 USD/mes)
echo             Control Transaccional Base (7 Modulos) - v4.0
echo =======================================================================
echo.
echo  Modulos a demostrar de forma independiente y literal a la Guia v4.0:
echo   - [1] Ventas (Order-to-Cash, Cotizaciones, Confirmacion WMS y Facturas)
echo   - [2] CRM Comercial (Embudo Kanban, Oportunidades y Pipeline)
echo   - [3] Inventario y Stock (Alta de SKUs, Kardex y Ajustes Fisicos)
echo   - [4] Compras (Procure-to-Pay, POs a Proveedores y Recepcion en Almacen)
echo   - [5] Produccion Textil (Manufactura, BOM, Consumo de Hilo y Telares)
echo   - [6] Business Partners (Directorio Central de Clientes y Proveedores)
echo   - [17] WMS (Gestion de Almacenes, Picking con Codigo de Barras y Empaque)
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
