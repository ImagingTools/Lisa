# Example startup script for Lisa (Windows)
# This script starts Lisa and waits for it to be ready

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Starting Lisa" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# Configuration
$lisaPort = if ($env:LISA_PORT) { $env:LISA_PORT } else { 3000 }
$lisaHost = if ($env:LISA_HOST) { $env:LISA_HOST } else { "0.0.0.0" }
$lisaLog = "C:\ProgramData\Lisa\logs\lisa.log"

# Set up database connection
$env:DATABASE_URL = if ($env:DATABASE_URL) { $env:DATABASE_URL } else { "postgresql://postgres@localhost:5432/lisa_test" }

# Set up Puma connection (if Lisa depends on Puma)
$env:PUMA_URL = if ($env:PUMA_URL) { $env:PUMA_URL } else { "http://localhost:8080" }

# Load configuration from resources if available
$configFile = "C:\app\custom-apps\resources\lisa-config.json"
if (Test-Path $configFile) {
    Write-Host "Loading configuration from $configFile..." -ForegroundColor Yellow
    $env:LISA_CONFIG_FILE = $configFile
}

# Apply any runtime SQL scripts from resources
$seedDataScript = "C:\app\custom-apps\resources\lisa-seed-data.sql"
if (Test-Path $seedDataScript) {
    Write-Host "Loading seed data from resources\lisa-seed-data.sql..." -ForegroundColor Yellow
    $pgBin = Get-ChildItem "C:\Program Files\PostgreSQL" -Directory -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($pgBin) {
        $psqlPath = Join-Path $pgBin.FullName "bin\psql.exe"
        & $psqlPath -U postgres -d lisa_test -f $seedDataScript 2>&1 | Out-Null
        Write-Host "Seed data loaded" -ForegroundColor Green
    }
}

# Ensure log directory exists
$logDir = Split-Path $lisaLog -Parent
if (-not (Test-Path $logDir)) {
    New-Item -ItemType Directory -Path $logDir -Force | Out-Null
}

# Start Lisa in background
Write-Host "Starting Lisa on ${lisaHost}:${lisaPort}..." -ForegroundColor Yellow
Write-Host "Database: $env:DATABASE_URL" -ForegroundColor Gray
Write-Host "Puma: $env:PUMA_URL" -ForegroundColor Gray

# Option 1: If Lisa has a server executable
$lisaExe = "C:\Program Files\Lisa\bin\LisaServer.exe"
if (Test-Path $lisaExe) {
    $lisaProcess = Start-Process -FilePath $lisaExe `
        -ArgumentList "--port", $lisaPort, "--host", $lisaHost `
        -RedirectStandardOutput $lisaLog `
        -RedirectStandardError $lisaLog `
        -NoNewWindow `
        -PassThru
    
    Write-Host "Lisa started with PID: $($lisaProcess.Id)" -ForegroundColor Green
}

# Wait for Lisa to be ready
Write-Host "Waiting for Lisa to be ready..." -ForegroundColor Yellow
$maxAttempts = 30
$attempt = 1

while ($attempt -le $maxAttempts) {
    try {
        # Check if Lisa is responding
        $response = Invoke-WebRequest -Uri "http://localhost:${lisaPort}/health" -UseBasicParsing -TimeoutSec 2 -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            Write-Host "[OK] Lisa is ready and responding on port $lisaPort" -ForegroundColor Green
            Write-Host "==========================================" -ForegroundColor Cyan
            exit 0
        }
    } catch {
        # Try alternative endpoint
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:${lisaPort}/" -UseBasicParsing -TimeoutSec 2 -ErrorAction SilentlyContinue
            if ($response.StatusCode -eq 200) {
                Write-Host "[OK] Lisa is ready and responding on port $lisaPort" -ForegroundColor Green
                Write-Host "==========================================" -ForegroundColor Cyan
                exit 0
            }
        } catch {
            # Not ready yet
        }
    }
    
    # Check if process is still running
    if ($lisaProcess -and $lisaProcess.HasExited) {
        Write-Host "[ERROR] Lisa process died" -ForegroundColor Red
        if (Test-Path $lisaLog) {
            Get-Content $lisaLog
        }
        exit 1
    }
    
    Write-Host "  Attempt $attempt/$maxAttempts..." -ForegroundColor Gray
    Start-Sleep -Seconds 2
    $attempt++
}

Write-Host "[ERROR] Lisa failed to start within the timeout" -ForegroundColor Red
if (Test-Path $lisaLog) {
    Write-Host "Last 20 lines of log:" -ForegroundColor Yellow
    Get-Content $lisaLog -Tail 20
}
exit 1
