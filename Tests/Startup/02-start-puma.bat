@echo off
setlocal enabledelayedexpansion

set BIN=C:\app\resources\PumaServer.exe
set LOG=C:\temp\puma.log

REM Check if installer exists in resources
set INSTALLER=C:\app\resources\PumaServerSetup.exe
if exist "%INSTALLER%" (
    echo [startup] Installing PumaServer from %INSTALLER%...
    start /wait "" "%INSTALLER%" /S /D=C:\app\resources
    if errorlevel 1 (
        echo [startup] ERROR: PumaServer installation failed!
        exit /b 1
    )
    echo [startup] PumaServer installed successfully.
)

REM Set library paths for Qt and other dependencies
set PATH=C:\app\resources;C:\app\resources\plugins;%PATH%
set QT_PLUGIN_PATH=C:\app\resources\plugins

REM Create temp directory if it doesn't exist
if not exist C:\temp mkdir C:\temp

REM Check if executable exists
if not exist "%BIN%" (
    echo [startup] ERROR: PumaServer executable not found at %BIN%
    exit /b 1
)

echo [startup] Starting PumaServer...
start /B "" "%BIN%" > "%LOG%" 2>&1

REM Get the PID of the started process (approximate)
timeout /t 1 /nobreak > nul

REM Check if process is running
tasklist /FI "IMAGENAME eq PumaServer.exe" 2>nul | find /I "PumaServer.exe" >nul
if errorlevel 1 (
    echo [startup] PumaServer failed to start. Log:
    type "%LOG%"
    exit /b 1
)

echo [startup] PumaServer started successfully.
exit /b 0
