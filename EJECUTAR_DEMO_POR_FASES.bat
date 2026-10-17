@echo off
title NyTEX ERP - Centro de Capacitacion y Demos por Fases
color 0B

:MENU
cls
echo =======================================================================
echo          NyTEX ERP - CENTRO DE DEMOSTRACION Y CAPACITACION
echo                     (GUIADO POR VOZ Y PANTALLA)
echo =======================================================================
echo.
echo   Seleccione el Paquete Comercial que desea demostrar o capacitar:
echo.
echo   [1] FASE 1: STARTER ($35 USD/mes)
echo       Ciclo Operativo Base (7 Modulos: Ventas, CRM, Inventario, Compras,
echo       Produccion Textil, Portal Partners y WMS Almacenes)
echo.
echo   [2] FASE 2: EXPRESS ($149 USD/mes)
echo       Manufactura, Cadena y Finanzas (15 Modulos: Logistica, ROP Dinamico,
echo       CxC, CxP, Tesoreria 4 Pestanas y 8 Tareas, Activos Fijos NIF C-6,
echo       Contabilidad IFRS, RRHH, Nomina Quincenal)
echo.
echo   [3] FASE 3: ADVANCED ($299 USD/mes)
echo       Inteligencia & Gobernanza de Procesos (20 Modulos: Process Suite BPMN,
echo       Process Mining, Dashboards Ejecutivos, Cubo OLAP Multidimensional,
echo       Planeacion S&OP / MRP II)
echo.
echo   [4] FASE 4: ENTERPRISE ($499 USD/mes)
echo       Ecosistema Total, Big Data & IA (25 Modulos: BI y Reportes Financieros,
echo       Big Data IoT en 96 Telares, Data Mining K-Means, Copilot Asistente IA,
echo       Modelos Predictivos Logit/ARIMA, Localizacion Fiscal y Auditoria SHA-256)
echo.
echo   [5] RECORRIDO COMPLETO (Las 4 Fases Integradas de punta a punta)
echo.
echo   [0] Salir
echo.
echo =======================================================================
set /p OPCION="Ingrese el numero de su eleccion [1 - 5]: "

if "%OPCION%"=="1" goto FASE1
if "%OPCION%"=="2" goto FASE2
if "%OPCION%"=="3" goto FASE3
if "%OPCION%"=="4" goto FASE4
if "%OPCION%"=="5" goto TODAS
if "%OPCION%"=="0" exit
goto MENU

:FASE1
echo.
echo =======================================================================
echo Iniciando Capacitacion FASE 1: STARTER (7 Modulos)...
echo Narracion literal segun Guia de Simulacion v4.0 (Ventas, CRM, Stock, Compras, Produccion, Partners, WMS)
echo =======================================================================
node demo_por_fases.js --fase=1
pause
goto MENU

:FASE2
echo.
echo =======================================================================
echo Iniciando Capacitacion FASE 2: EXPRESS (15 Modulos)...
echo Narracion literal segun Guia de Simulacion v4.0 (Logistica, ROP, CxC, CxP, Tesoreria 4 Pestanas/8 Tareas, Activos, Contabilidad, RRHH, Nomina)
echo =======================================================================
node demo_por_fases.js --fase=2
pause
goto MENU

:FASE3
echo.
echo =======================================================================
echo Iniciando Capacitacion FASE 3: ADVANCED (20 Modulos)...
echo Narracion literal segun Guia de Simulacion v4.0 (Process Suite BPMN, Process Mining, Dashboards, Cubo OLAP, Planeacion S&OP)
echo =======================================================================
node demo_por_fases.js --fase=3
pause
goto MENU

:FASE4
echo.
echo =======================================================================
echo Iniciando Capacitacion FASE 4: ENTERPRISE (25 Modulos)...
echo Narracion literal segun Guia de Simulacion v4.0 (BI Reportes NIF, Big Data IoT, Data Mining, Copilot IA, Modelos Predictivos, Localizacion Fiscal y Auditoria SHA-256)
echo =======================================================================
node demo_por_fases.js --fase=4
pause
goto MENU

:TODAS
echo.
echo =======================================================================
echo Iniciando Capacitacion COMPLETA (Las 4 Fases Integradas)...
echo =======================================================================
node demo_por_fases.js --fase=all
pause
goto MENU
