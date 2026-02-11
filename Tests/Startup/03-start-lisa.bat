@echo off
setlocal enabledelayedexpansion

set LISA_EXE=C:\Program Files\ImagingTools\LisaServer\LisaServer.exe
set INSTALLER=C:\app\resources\LisaServerInstall.exe

REM Kill any existing LisaServer before install
taskkill /F /IM LisaServer.exe >nul 2>&1

REM Install LisaServer if needed
if exist "%INSTALLER%" (
    echo [startup] Installing LisaServer from %INSTALLER%...
    
    REM VERYSILENT is required - SILENT shows GUI which hangs in container
    start /wait "" "%INSTALLER%" /VERYSILENT /NORESTART
    
    set INSTALL_EXIT=!ERRORLEVEL!
    echo [startup] Install exit code: !INSTALL_EXIT!
    
    REM Show log regardless of exit code
    if exist "C:\app\lisa-install.log" (
        echo [startup] === Install log ===
        type "C:\app\lisa-install.log"
        echo [startup] === End of log ===
    )
    
    if !INSTALL_EXIT! neq 0 (
        echo [startup] ERROR: LisaServer installation failed
        exit /b 1
    )
    echo [startup] LisaServer installed.
)

if not exist "%LISA_EXE%" (
    echo [startup] ERROR: LisaServer not found at %LISA_EXE%
    exit /b 1
)

echo [startup] Starting LisaServer...
start "" /B "%LISA_EXE%"

REM Wait for LisaServer to initialize
powershell -NoProfile -Command "Start-Sleep -Seconds 3"

REM Verify LisaServer is running (try multiple times)
set ATTEMPTS=0
:CHECK_LISA
set /a ATTEMPTS+=1
if !ATTEMPTS! gtr 10 (
    echo [startup] WARNING: LisaServer may not be running, continuing anyway...
    exit /b 0
)

tasklist /FI "IMAGENAME eq LisaServer.exe" 2>nul | find "LisaServer.exe" >nul
if errorlevel 1 (
    echo [startup] Waiting for LisaServer... Attempt !ATTEMPTS!/10
    powershell -NoProfile -Command "Start-Sleep -Seconds 2"
    goto CHECK_LISA
)

echo [startup] LisaServer started successfully
exit /b 0
