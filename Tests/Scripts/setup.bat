@echo off
REM Setup script for Lisa Testing System
REM This script installs all dependencies and prepares the testing environment

setlocal

set SCRIPT_DIR=%~dp0
set TESTS_DIR=%SCRIPT_DIR%..
cd /d "%TESTS_DIR%"

echo ========================================
echo   Lisa Testing System Setup
echo ========================================
echo.

REM Check Node.js
echo Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed
    echo Please install Node.js 18.x or higher from https://nodejs.org/
    exit /b 1
)
for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo [OK] Node.js %NODE_VERSION% found

REM Check npm
echo Checking npm installation...
npm --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm is not installed
    exit /b 1
)
for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
echo [OK] npm %NPM_VERSION% found
echo.

REM Install npm dependencies
echo Installing npm dependencies...
call npm install
if errorlevel 1 (
    echo [ERROR] Failed to install dependencies
    exit /b 1
)
echo [OK] Dependencies installed
echo.

REM Install Playwright browsers
echo Installing Playwright browsers...
echo This may take a few minutes...
call npx playwright install --with-deps
if errorlevel 1 (
    echo [WARNING] Failed to install some Playwright browsers
    echo You may need to install them manually
) else (
    echo [OK] Playwright browsers installed
)
echo.

REM Create test results directories
echo Creating test results directories...
if not exist "test-results\screenshots" mkdir test-results\screenshots
if not exist "test-results\videos" mkdir test-results\videos
echo [OK] Directories created
echo.

REM Check Docker (optional)
echo Checking Docker installation (optional)...
docker --version >nul 2>&1
if errorlevel 1 (
    echo [WARNING] Docker not found (needed for Docker tests)
) else (
    for /f "tokens=*" %%i in ('docker --version') do set DOCKER_VERSION=%%i
    echo [OK] !DOCKER_VERSION! found
    
    docker-compose --version >nul 2>&1
    if errorlevel 1 (
        echo [WARNING] docker-compose not found (needed for Docker tests)
    ) else (
        for /f "tokens=*" %%i in ('docker-compose --version') do set COMPOSE_VERSION=%%i
        echo [OK] !COMPOSE_VERSION! found
    )
)
echo.

REM Summary
echo ========================================
echo Setup complete!
echo ========================================
echo.
echo You can now run tests:
echo   npm test                    - Run all tests
echo   npm run test:gui            - Run GUI tests only
echo   npm run test:api            - Run API tests only
echo   Scripts\run-all-tests.bat   - Run all tests (using script)
echo.
echo For Docker tests:
echo   Scripts\run-docker-tests-windows.bat build-and-run
echo.
echo For more information, see README.md
echo.

exit /b 0
