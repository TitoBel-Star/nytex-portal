@echo off
title NyTEX ERP - Demostracion en Vivo con Locucion y Video
color 0B
echo ================================================================
echo    NYTEX ERP - DEMOSTRACION EN VIVO CON LOCUCION Y VIDEO HD
echo ================================================================
echo.
echo  1. Servidores verificados y activos.
echo  2. Motor de locucion por voz en espanol activado.
echo  3. El navegador Microsoft Edge se abrira en pantalla completa.
echo  4. Escuchara la voz explicando cada modulo en tiempo real.
echo  5. El video se guardara automaticamente en: ./demos_grabados/
echo.
echo  [RECOMENDACION]: Asegurese de tener el volumen de sus bocinas
echo  o audifonos encendido para escuchar la explicacion.
echo.
echo  [GRABACION CON VOZ]: Si usa OBS Studio, Camtasia o Win + Alt + R,
echo  asegurese de activar "Audio del sistema" para que la grabacion
echo  capture la voz de la explicacion.
echo ================================================================
echo.
echo Presione cualquier tecla para iniciar el recorrido guiado por voz...
pause >nul
echo.
echo Iniciando demostracion con voz... Por favor observe su pantalla y escuche.
echo.
node demo_en_vivo_nytex.js
echo.
echo ================================================================
echo  Demostracion finalizada con exito!
echo  Su video esta disponible en la carpeta "demos_grabados".
echo ================================================================
echo.
pause
