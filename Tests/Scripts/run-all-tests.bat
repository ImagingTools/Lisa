@echo off
REM Script to run all tests (GUI and API) on Windows
REM This script can be used both locally and in CI/CD pipelines
REM
REM Usage:
REM   run-all-tests.bat [--gui-only | --api-only]

setlocal enabledelayedexpansion

set SCRIPT_DIR=%~dp0
set TESTS_DIR=%SCRIPT_DIR%..
cd /d "%TESTS_DIR%"

REM Parse arguments
set RUN_GUI=true
set RUN_API=true

:parse_args
if "%~1"=="" goto end_parse
if /i "%~1"=="--gui-only" (
    set RUN_API=false
    shift
    goto parse_args
)
if /i "%~1"=="--api-only" (
    set RUN_GUI=false
    shift
    goto parse_args
)
echo Unknown option: %~1
echo Usage: %~nx0 [--gui-only ^| --api-only]
exit /b 1

:end_parse

REM Check if npm dependencies are installed
if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo Failed to install dependencies
        exit /b 1
    )
)

REM Check if Playwright browsers are installed
if "%RUN_GUI%"=="true" (
    npx playwright --version >nul 2>&1
    if errorlevel 1 (
        echo Installing Playwright browsers...
        call npx playwright install --with-deps
    )
)

REM Create results directories
if not exist "test-results\screenshots" mkdir test-results\screenshots
if not exist "test-results\videos" mkdir test-results\videos

REM Run tests
set EXIT_CODE=0

if "%RUN_GUI%"=="true" (
    echo.
    echo Running GUI tests with Playwright...
    call npm run test:gui
    if errorlevel 1 (
        echo [ERROR] GUI tests failed
        set EXIT_CODE=1
    ) else (
        echo [OK] GUI tests passed
    )
)

if "%RUN_API%"=="true" (
    echo.
    echo Running API tests with Newman...
    call npm run test:api
    if errorlevel 1 (
        echo [ERROR] API tests failed
        set EXIT_CODE=1
    ) else (
        echo [OK] API tests passed
    )
)

REM Summary
echo.
echo ==================================
if %EXIT_CODE%==0 (
    echo All tests passed!
) else (
    echo Some tests failed!
)
echo ==================================
echo.
echo Test results available in: test-results\
echo - Playwright HTML report: test-results\playwright-report\
echo - Screenshots: test-results\screenshots\
echo - Videos: test-results\videos\

exit /b %EXIT_CODE%
