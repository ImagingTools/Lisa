@echo off
setlocal enabledelayedexpansion

set PUMA_EXE=C:\Program Files\ImagingTools\PumaServer\PumaServer.exe
set INSTALLER=C:\app\resources\PumaServerInstall.exe

REM Install PumaServer if needed
if exist "%INSTALLER%" (
    echo [startup] Installing PumaServer from %INSTALLER%...
    "%INSTALLER%" /VERYSILENT /NORESTART
    if errorlevel 1 (
        echo [startup] ERROR: PumaServer installation failed
        exit /b 1
    )
    echo [startup] PumaServer installed.
)

if not exist "%PUMA_EXE%" (
    echo [startup] ERROR: PumaServer not found at %PUMA_EXE%
    exit /b 1
)

echo [startup] Starting PumaServer...
start "" /B "%PUMA_EXE%"

REM Wait for PumaServer to initialize (using PowerShell)
powershell -NoProfile -Command "Start-Sleep -Seconds 3"

REM Verify PumaServer is running (try multiple times)
set ATTEMPTS=0
:CHECK_PUMA
set /a ATTEMPTS+=1
if !ATTEMPTS! gtr 10 (
    echo [startup] WARNING: PumaServer may not be running, continuing anyway...
    exit /b 0
)

tasklist /FI "IMAGENAME eq PumaServer.exe" 2>nul | find "PumaServer.exe" >nul
if errorlevel 1 (
    echo [startup] Waiting for PumaServer... Attempt !ATTEMPTS!/10
    powershell -NoProfile -Command "Start-Sleep -Seconds 2"
    goto CHECK_PUMA
)

echo [startup] PumaServer started successfully
exit /b 0
