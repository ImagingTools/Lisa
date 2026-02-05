# Example installer script for Lisa (Windows)
# This is a template - modify according to your Lisa installation method

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Installing Lisa" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# Method 1: Using installer from resources directory
$installer = "C:\app\custom-apps\resources\lisa-installer.exe"
if (Test-Path $installer) {
    Write-Host "Installing from resources\lisa-installer.exe..." -ForegroundColor Yellow
    & $installer /S /D="C:\Program Files\Lisa"
    Write-Host "Lisa installed to C:\Program Files\Lisa" -ForegroundColor Green
}

# Method 2: Using archive from resources
$archive = "C:\app\custom-apps\resources\lisa.zip"
if (Test-Path $archive) {
    Write-Host "Extracting Lisa from $archive..." -ForegroundColor Yellow
    $destination = "C:\Program Files\Lisa"
    New-Item -ItemType Directory -Path $destination -Force | Out-Null
    Expand-Archive -Path $archive -DestinationPath $destination -Force
    Write-Host "Lisa extracted to $destination" -ForegroundColor Green
}

# Method 3: Copy binaries from resources
$binariesDir = "C:\app\custom-apps\resources\lisa-binaries"
if (Test-Path $binariesDir) {
    Write-Host "Copying Lisa binaries from resources..." -ForegroundColor Yellow
    $destination = "C:\Program Files\Lisa"
    New-Item -ItemType Directory -Path $destination -Force | Out-Null
    Copy-Item -Path "$binariesDir\*" -Destination $destination -Recurse -Force
    Write-Host "Lisa binaries copied to $destination" -ForegroundColor Green
}

# Method 4: Apply database migrations from resources
$migrationsScript = "C:\app\custom-apps\resources\lisa-migrations.sql"
if (Test-Path $migrationsScript) {
    Write-Host "Applying database migrations from resources\lisa-migrations.sql..." -ForegroundColor Yellow
    $pgBin = Get-ChildItem "C:\Program Files\PostgreSQL" -Directory -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($pgBin) {
        $psqlPath = Join-Path $pgBin.FullName "bin\psql.exe"
        & $psqlPath -U postgres -d lisa_test -f $migrationsScript 2>&1 | Out-Null
        Write-Host "Database migrations completed" -ForegroundColor Green
    } else {
        Write-Host "PostgreSQL not found, skipping migrations" -ForegroundColor Yellow
    }
}

# Method 5: Copy configuration from resources
$configFile = "C:\app\custom-apps\resources\lisa-config.json"
if (Test-Path $configFile) {
    Write-Host "Copying Lisa configuration from resources..." -ForegroundColor Yellow
    $configDir = "C:\Program Files\Lisa\config"
    New-Item -ItemType Directory -Path $configDir -Force | Out-Null
    Copy-Item -Path $configFile -Destination "$configDir\config.json" -Force
    Write-Host "Configuration copied" -ForegroundColor Green
}

# Set up environment variables
[Environment]::SetEnvironmentVariable("LISADIR", "C:\Program Files\Lisa", "Machine")
$currentPath = [Environment]::GetEnvironmentVariable("Path", "Machine")
if ($currentPath -notlike "*Lisa*") {
    [Environment]::SetEnvironmentVariable("Path", "$currentPath;C:\Program Files\Lisa\bin", "Machine")
}

# Create directories for Lisa
New-Item -ItemType Directory -Path "C:\ProgramData\Lisa\logs" -Force | Out-Null
New-Item -ItemType Directory -Path "C:\ProgramData\Lisa\data" -Force | Out-Null

Write-Host "Lisa installation completed" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
