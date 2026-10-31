@echo off
title NyTEX ERP - Capacitacion Fase 4 Enterprise ($499 USD/mes) - v4.0
color 0D
if exist "%~dp0demo_por_fases.js" (cd /d "%~dp0") else (cd /d "%~dp0..")

echo =======================================================================
echo         NyTEX ERP - CAPACITACION FASE 4: ENTERPRISE ($499 USD/mes)
echo         Ecosistema Total & Anticipacion IA (25 Modulos) - v4.0
echo =======================================================================
echo.
echo  Modulos a demostrar de forma independiente y literal a la Guia v4.0:
echo   - [18] BI y Reportes Financieros (IFRS / NIIF, P&L, Balance y Flujo)
echo   - [21] Big Data & Telemetria IoT Industrial (Sensores en 96 Maquinas Industriales)
echo   - [22] Mineria de Datos & Machine Learning (Clustering K-Means Clientes)
echo   - [23] Asistente Cognitivo IA Copilot (Consultas en Lenguaje Natural)
echo   - [24] Modelos Predictivos & Riesgo Crediticio (Logit y Series ARIMA)
echo   - [26] Configuracion del Sistema, Localizacion Fiscal Multi-Pais
echo          (DTE Documentos Tributarios Electronicos - Ministerio de Hacienda / DGII El Salvador)
echo          y Auditoria Inmutable (Audit Trail con Sellos Criptograficos)
echo   - Espacio de Trabajo Unificado (Workspace Integrado)
echo.
echo  * La locutora explicara cada ventana, boton y campo a capturar.
echo  * FFmpeg integrara automaticamente el video y la voz en MP4.
echo =======================================================================
echo.
echo Presione cualquier tecla para iniciar la demostracion de la FASE 4...
pause >nul
echo.
echo Ejecutando... Observe su pantalla y escuche la explicacion.
echo.
node demo_por_fases.js --fase=4
echo.
echo =======================================================================
echo  Demostracion de FASE 4 finalizada!
echo  Abriendo carpeta con su video MP4...
echo =======================================================================
start "" "%cd%\demos_grabados"
pause
