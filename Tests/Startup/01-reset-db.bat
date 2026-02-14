@echo off
setlocal enabledelayedexpansion

REM Set PostgreSQL connection parameters
if not defined PGUSER set PGUSER=postgres
if not defined PGPASSWORD set PGPASSWORD=root
if not defined PGHOST set PGHOST=localhost
if not defined PGPORT set PGPORT=5432

set LISA_BACKUP_FILE=C:\app\resources\backups\lisa.backup
set PUMA_BACKUP_FILE=C:\app\resources\backups\puma.backup

set LISA_DB_NAME=lisa
set PUMA_DB_NAME=puma

REM Drop and create Lisa database
echo [startup] Resetting Lisa database...
psql -h %PGHOST% -p %PGPORT% -U %PGUSER% -v ON_ERROR_STOP=1 -c "DROP DATABASE IF EXISTS %LISA_DB_NAME%;"
if errorlevel 1 goto :error

psql -h %PGHOST% -p %PGPORT% -U %PGUSER% -v ON_ERROR_STOP=1 -c "CREATE DATABASE %LISA_DB_NAME% OWNER %PGUSER%;"
if errorlevel 1 goto :error

REM Drop and create Puma database
echo [startup] Resetting Puma database...
psql -h %PGHOST% -p %PGPORT% -U %PGUSER% -v ON_ERROR_STOP=1 -c "DROP DATABASE IF EXISTS %PUMA_DB_NAME%;"
if errorlevel 1 goto :error

psql -h %PGHOST% -p %PGPORT% -U %PGUSER% -v ON_ERROR_STOP=1 -c "CREATE DATABASE %PUMA_DB_NAME% OWNER %PGUSER%;"
if errorlevel 1 goto :error

REM Check if backup files exist
if not exist "%LISA_BACKUP_FILE%" (
    echo [startup] ERROR: Lisa backup file not found: %LISA_BACKUP_FILE%
    exit /b 1
)

if not exist "%PUMA_BACKUP_FILE%" (
    echo [startup] ERROR: Puma backup file not found: %PUMA_BACKUP_FILE%
    exit /b 1
)

REM Restore databases from backups
echo [startup] Restoring Lisa database from backup...
pg_restore -h %PGHOST% -p %PGPORT% -U %PGUSER% -d %LISA_DB_NAME% --verbose "%LISA_BACKUP_FILE%"
if errorlevel 1 goto :error

echo [startup] Restoring Puma database from backup...
pg_restore -h %PGHOST% -p %PGPORT% -U %PGUSER% -d %PUMA_DB_NAME% --verbose "%PUMA_BACKUP_FILE%"
if errorlevel 1 goto :error

echo [startup] Database reset completed successfully.
exit /b 0

:error
echo [startup] ERROR: Database reset failed!
exit /b 1
