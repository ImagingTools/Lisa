@echo off
REM Script to run tests in Windows Docker container
REM 
REM Usage:
REM   run-docker-tests-windows.bat [build|run|build-and-run]
REM
REM Options:
REM   build          - Build the Docker image only
REM   run            - Run tests in existing Docker image
REM   build-and-run  - Build image and run tests (default)

setlocal

set SCRIPT_DIR=%~dp0
set TESTS_DIR=%SCRIPT_DIR%..
set PROJECT_ROOT=%TESTS_DIR%\..

cd /d "%PROJECT_ROOT%"

set ACTION=%~1
if "%ACTION%"=="" set ACTION=build-and-run

if /i "%ACTION%"=="build" goto build
if /i "%ACTION%"=="run" goto run
if /i "%ACTION%"=="build-and-run" goto build-and-run

echo Unknown action: %ACTION%
echo Usage: %~nx0 [build^|run^|build-and-run]
exit /b 1

:build
echo Building Windows Docker image...
docker build -f Tests\Docker\Dockerfile.windows -t lisa-tests:windows .
if errorlevel 1 (
    echo Build failed
    exit /b 1
)
echo Build complete
goto end

:run
echo Running tests in Windows Docker container...
docker-compose -f Tests\Docker\docker-compose.windows.yml up --abort-on-container-exit
set EXIT_CODE=%ERRORLEVEL%
docker-compose -f Tests\Docker\docker-compose.windows.yml down
exit /b %EXIT_CODE%

:build-and-run
echo Building Windows Docker image...
docker build -f Tests\Docker\Dockerfile.windows -t lisa-tests:windows .
if errorlevel 1 (
    echo Build failed
    exit /b 1
)
echo Running tests in Windows Docker container...
docker-compose -f Tests\Docker\docker-compose.windows.yml up --abort-on-container-exit
set EXIT_CODE=%ERRORLEVEL%
docker-compose -f Tests\Docker\docker-compose.windows.yml down
exit /b %EXIT_CODE%

:end
exit /b 0
