@echo off
REM Script to run tests in Linux Docker container on Windows
REM 
REM This script allows Windows users to run tests in Linux containers
REM Docker Desktop must be installed and configured for Linux containers
REM 
REM Usage:
REM   run-docker-tests-linux.bat [build|run|build-and-run]
REM
REM Options:
REM   build          - Build the Docker image only
REM   run            - Run tests in existing Docker image
REM   build-and-run  - Build image and run tests (default)
REM
REM Prerequisites:
REM   - Docker Desktop for Windows
REM   - Docker Desktop switched to Linux containers mode
REM   - If using Windows containers, switch with: Right-click Docker Desktop tray icon -> "Switch to Linux containers..."

setlocal

set SCRIPT_DIR=%~dp0
set TESTS_DIR=%SCRIPT_DIR%..
set PROJECT_ROOT=%TESTS_DIR%\..

cd /d "%PROJECT_ROOT%"

set ACTION=%~1
if "%ACTION%"=="" set ACTION=build-and-run

REM Check if Docker is available
docker version >nul 2>&1
if errorlevel 1 (
    echo Error: Docker is not installed or not running
    echo Please install Docker Desktop for Windows
    exit /b 1
)

REM Check if Docker is in Linux mode
docker info | findstr /C:"OSType: linux" >nul 2>&1
if errorlevel 1 (
    echo.
    echo Warning: Docker Desktop appears to be in Windows containers mode
    echo To run Linux containers, please switch Docker Desktop to Linux containers mode:
    echo   1. Right-click Docker Desktop tray icon
    echo   2. Select "Switch to Linux containers..."
    echo   3. Wait for Docker to restart
    echo   4. Run this script again
    echo.
    exit /b 1
)

if /i "%ACTION%"=="build" goto build
if /i "%ACTION%"=="run" goto run
if /i "%ACTION%"=="build-and-run" goto build-and-run

echo Unknown action: %ACTION%
echo Usage: %~nx0 [build^|run^|build-and-run]
exit /b 1

:build
echo Building Linux Docker image...
docker build -f Tests\Docker\Dockerfile.linux -t lisa-tests:linux .
if errorlevel 1 (
    echo Build failed
    exit /b 1
)
echo Build complete
goto end

:run
echo Running tests in Linux Docker container...
docker-compose -f Tests\Docker\docker-compose.linux.yml up --abort-on-container-exit
set EXIT_CODE=%ERRORLEVEL%
docker-compose -f Tests\Docker\docker-compose.linux.yml down
exit /b %EXIT_CODE%

:build-and-run
echo Building Linux Docker image...
docker build -f Tests\Docker\Dockerfile.linux -t lisa-tests:linux .
if errorlevel 1 (
    echo Build failed
    exit /b 1
)
echo Running tests in Linux Docker container...
docker-compose -f Tests\Docker\docker-compose.linux.yml up --abort-on-container-exit
set EXIT_CODE=%ERRORLEVEL%
docker-compose -f Tests\Docker\docker-compose.linux.yml down
exit /b %EXIT_CODE%

:end
exit /b 0
