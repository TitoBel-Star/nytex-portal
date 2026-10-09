@echo off
title NyTEX ERP - Capacitacion Fase 3 Advanced ($299 USD/mes) - v4.0
color 0B
if exist "%~dp0demo_por_fases.js" (cd /d "%~dp0") else (cd /d "%~dp0..")

echo =======================================================================
echo          NyTEX ERP - CAPACITACION FASE 3: ADVANCED ($299 USD/mes)
echo             Inteligencia & Rentabilidad Estrategica (22 Modulos)
echo =======================================================================
echo.
echo  Modulos a demostrar de forma independiente y literal a la Guia v4.0:
echo   - [18] BI y Reportes Financieros (NIF / IFRS, P&L, Balance y Flujo)
echo   - [19] Dashboards Ejecutivos en Tiempo Real (KPI Cockpit y OEE Planta)
echo   - [20] BI Cubo Multidimensional (OLAP HyperCube, Slice & Dice, Drill-Down)
echo   - [21] Big Data & Telemetria IoT Industrial (Sensores en 96 Telares)
echo   - [22] Mineria de Datos & Machine Learning (Clustering K-Means Clientes)
echo.
echo  * La locutora explicara cada ventana, boton y campo a capturar.
echo  * FFmpeg integrara automaticamente el video y la voz en MP4.
echo =======================================================================
echo.
echo Presione cualquier tecla para iniciar la demostracion de la FASE 3...
pause >nul
echo.
echo Ejecutando... Observe su pantalla y escuche la explicacion.
echo.
node demo_por_fases.js --fase=3
echo.
echo =======================================================================
echo  Demostracion de FASE 3 finalizada!
echo  Abriendo carpeta con su video MP4...
echo =======================================================================
start "" "%cd%\demos_grabados"
pause
