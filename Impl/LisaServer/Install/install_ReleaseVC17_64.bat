@echo on
for /f "delims=" %%i in ('..\..\..\..\ImtCore\3rdParty\Python\3.8\python.exe ..\..\..\..\ImtCore\Build\GetSvnVersion.py -D ..\..\..\ ') do set APP_VERSION=%%i

set LISA_BUILD_DIR=%LISADIR%\Bin\Release_Qt6_VC17_x64
iscc LisaServer.iss
pause

