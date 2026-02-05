# Example startup script for Puma (Windows)
# This script starts Puma and waits for it to be ready

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Starting Puma" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# Configuration
$pumaPort = if ($env:PUMA_PORT) { $env:PUMA_PORT } else { 8080 }
$pumaHost = if ($env:PUMA_HOST) { $env:PUMA_HOST } else { "0.0.0.0" }
$pumaLog = "C:\ProgramData\Puma\logs\puma.log"

# Ensure log directory exists
$logDir = Split-Path $pumaLog -Parent
if (-not (Test-Path $logDir)) {
    New-Item -ItemType Directory -Path $logDir -Force | Out-Null
}

# Start Puma in background
Write-Host "Starting Puma on ${pumaHost}:${pumaPort}..." -ForegroundColor Yellow

# Option 1: If Puma has a start script
$pumaExe = "C:\Program Files\Puma\bin\puma.exe"
if (Test-Path $pumaExe) {
    $pumaProcess = Start-Process -FilePath $pumaExe `
        -ArgumentList "--port", $pumaPort, "--host", $pumaHost `
        -RedirectStandardOutput $pumaLog `
        -RedirectStandardError $pumaLog `
        -NoNewWindow `
        -PassThru
    
    Write-Host "Puma started with PID: $($pumaProcess.Id)" -ForegroundColor Green
}

# Wait for Puma to be ready
Write-Host "Waiting for Puma to be ready..." -ForegroundColor Yellow
$maxAttempts = 30
$attempt = 1

while ($attempt -le $maxAttempts) {
    try {
        # Check if Puma is responding
        $response = Invoke-WebRequest -Uri "http://localhost:${pumaPort}/health" -UseBasicParsing -TimeoutSec 2 -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            Write-Host "[OK] Puma is ready and responding on port $pumaPort" -ForegroundColor Green
            Write-Host "==========================================" -ForegroundColor Cyan
            exit 0
        }
    } catch {
        # Not ready yet
    }
    
    # Alternative: Check if process is still running
    if ($pumaProcess -and $pumaProcess.HasExited) {
        Write-Host "[ERROR] Puma process died" -ForegroundColor Red
        if (Test-Path $pumaLog) {
            Get-Content $pumaLog
        }
        exit 1
    }
    
    Write-Host "  Attempt $attempt/$maxAttempts..." -ForegroundColor Gray
    Start-Sleep -Seconds 2
    $attempt++
}

Write-Host "[ERROR] Puma failed to start within the timeout" -ForegroundColor Red
if (Test-Path $pumaLog) {
    Write-Host "Last 20 lines of log:" -ForegroundColor Yellow
    Get-Content $pumaLog -Tail 20
}
exit 1
