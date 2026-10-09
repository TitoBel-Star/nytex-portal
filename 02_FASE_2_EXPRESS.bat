@echo off
title NyTEX ERP - Capacitacion Fase 2 Express ($149 USD/mes) - v4.0
color 0E
if exist "%~dp0demo_por_fases.js" (cd /d "%~dp0") else (cd /d "%~dp0..")

echo =======================================================================
echo          NyTEX ERP - CAPACITACION FASE 2: EXPRESS ($149 USD/mes)
echo         Manufactura, Cadena y Gobernanza Financiera (17 Modulos)
echo =======================================================================
echo.
echo  Modulos a demostrar de forma independiente y literal a la Guia v4.0:
echo   - [7] Logistica y Distribucion (Rutas, Tracking y Entrega con Acuse)
echo   - [ROP] Punto de Reorden Dinamico (Formula Matematica y Requisicion EOQ)
echo   - [8] Cuentas por Cobrar - CxC (Facturas a Credito y Cobranza Bancaria)
echo   - [9] Cuentas por Pagar - CxP (Facturas Proveedor y Dispersion Bancaria)
echo   - [10] Tesoreria, Controles Internos y Finanzas (Bancos, Cajas, Arqueos,
echo          Cierre Diario de Cobros, Pagos y Compras, Conciliacion SHA-256)
echo   - [11] Activos Fijos (Alta de Telar Mayer & Cie y Depreciacion NIF C-6)
echo   - [12] Contabilidad Central (Polizas Automaticas y Balanza Cuadrada)
echo   - [13] Recursos Humanos - RRHH (Alta de Operarios e Incidencias)
echo   - [14] Nomina & Fiscal (Calculo Quincenal, ISR, IMSS y Timbrado CFDI)
echo   - [15] Synex Process Suite (Disenador Visual BPMN 2.0 y Workflows)
echo   - [16] Process Mining (Mineria de Procesos, Grafo DFG y Cuellos de Botella)
echo.
echo  * La locutora explicara cada ventana, boton y campo a capturar.
echo  * FFmpeg integrara automaticamente el video y la voz en MP4.
echo =======================================================================
echo.
echo Presione cualquier tecla para iniciar la demostracion de la FASE 2...
pause >nul
echo.
echo Ejecutando... Observe su pantalla y escuche la explicacion.
echo.
node demo_por_fases.js --fase=2
echo.
echo =======================================================================
echo  Demostracion de FASE 2 finalizada!
echo  Abriendo carpeta con su video MP4...
echo =======================================================================
start "" "%cd%\demos_grabados"
pause
