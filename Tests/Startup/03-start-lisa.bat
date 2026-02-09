@echo off

REM Check if installer exists in resources
set INSTALLER=C:\app\resources\LisaServerSetup.exe
if exist "%INSTALLER%" (
    echo [startup] Installing LisaServer from %INSTALLER%...
    "%INSTALLER%" /VERYSILENT /NORESTART
    echo [startup] LisaServer installed.
)

echo [startup] Starting LisaServer...
start "" /B "C:\Program Files\ImagingTools\Lisa\LisaServer.exe"

exit /b 0
