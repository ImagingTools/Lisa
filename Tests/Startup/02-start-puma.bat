@echo off

REM Check if installer exists in resources
set INSTALLER=C:\app\resources\PumaServerSetup.exe
if exist "%INSTALLER%" (
    echo [startup] Installing PumaServer from %INSTALLER%...
    "%INSTALLER%" /VERYSILENT /NORESTART
    echo [startup] PumaServer installed.
)

echo [startup] Starting PumaServer...
start "" /B "C:\Program Files\ImagingTools\PumaServer\PumaServer.exe"

exit /b 0
