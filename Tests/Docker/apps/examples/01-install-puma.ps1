# Example installer script for Puma (Windows)
# This is a template - modify according to your Puma installation method

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Installing Puma" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# Method 1: Using installer from resources directory
$installer = "C:\app\custom-apps\resources\puma-installer.exe"
if (Test-Path $installer) {
    Write-Host "Installing from resources\puma-installer.exe..." -ForegroundColor Yellow
    & $installer /S /D="C:\Program Files\Puma"
    Write-Host "Puma installed to C:\Program Files\Puma" -ForegroundColor Green
}

# Method 2: Using archive from resources
$archive = "C:\app\custom-apps\resources\puma.zip"
if (Test-Path $archive) {
    Write-Host "Extracting Puma from resources\puma.zip..." -ForegroundColor Yellow
    $destination = "C:\Program Files\Puma"
    New-Item -ItemType Directory -Path $destination -Force | Out-Null
    Expand-Archive -Path $archive -DestinationPath $destination -Force
    Write-Host "Puma extracted to $destination" -ForegroundColor Green
}

# Method 3: Using SQL script from resources for database setup
$sqlScript = "C:\app\custom-apps\resources\puma-setup.sql"
if (Test-Path $sqlScript) {
    Write-Host "Running database setup from resources\puma-setup.sql..." -ForegroundColor Yellow
    $pgBin = Get-ChildItem "C:\Program Files\PostgreSQL" -Directory -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($pgBin) {
        $psqlPath = Join-Path $pgBin.FullName "bin\psql.exe"
        & $psqlPath -U postgres -f $sqlScript 2>&1 | Out-Null
        Write-Host "Database setup completed" -ForegroundColor Green
    } else {
        Write-Host "PostgreSQL not found, skipping database setup" -ForegroundColor Yellow
    }
}

# Set up environment variables
[Environment]::SetEnvironmentVariable("PUMA_HOME", "C:\Program Files\Puma", "Machine")
$currentPath = [Environment]::GetEnvironmentVariable("Path", "Machine")
if ($currentPath -notlike "*Puma*") {
    [Environment]::SetEnvironmentVariable("Path", "$currentPath;C:\Program Files\Puma\bin", "Machine")
}

# Create log directory
New-Item -ItemType Directory -Path "C:\ProgramData\Puma\logs" -Force | Out-Null

Write-Host "Puma installation completed" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
