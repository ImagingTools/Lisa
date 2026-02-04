# Custom Applications Directory

This directory is for adding your own applications to the Docker test environment.

## Directory Structure

```
apps/
├── installers/          # Application installers (run once during startup)
│   ├── 01-install-puma.sh
│   └── 02-install-lisa.sh
├── startup/            # Startup scripts (run in order during container startup)
│   ├── 01-start-puma.sh
│   └── 02-start-lisa.sh
└── README.md           # This file
```

## Usage

### For Linux Containers

1. **Add Installer Scripts** (`installers/` directory):
   - Create shell scripts (`.sh`) that install your applications
   - Name them with prefixes like `01-`, `02-` to control execution order
   - Make them executable: `chmod +x installers/*.sh`

2. **Add Startup Scripts** (`startup/` directory):
   - Create shell scripts (`.sh`) that start your applications
   - Use numbered prefixes to ensure correct startup order
   - Make them executable: `chmod +x startup/*.sh`

### For Windows Containers

1. **Add Installer Scripts** (`installers/` directory):
   - Create PowerShell scripts (`.ps1`) that install your applications
   - Name them with prefixes like `01-`, `02-` to control execution order

2. **Add Startup Scripts** (`startup/` directory):
   - Create PowerShell scripts (`.ps1`) that start your applications
   - Use numbered prefixes to ensure correct startup order

## Example: Lisa Application with Puma

### Linux Example

**installers/01-install-puma.sh:**
```bash
#!/bin/bash
set -e

echo "Installing Puma..."

# Copy Puma installer (if you placed it here)
if [ -f "/app/custom-apps/installers/puma-installer.run" ]; then
    chmod +x /app/custom-apps/installers/puma-installer.run
    /app/custom-apps/installers/puma-installer.run --silent
fi

# Or install from package
# apt-get update && apt-get install -y puma

echo "Puma installed successfully"
```

**installers/02-install-lisa.sh:**
```bash
#!/bin/bash
set -e

echo "Installing Lisa..."

# Copy Lisa installer (if you placed it here)
if [ -f "/app/custom-apps/installers/lisa-installer.run" ]; then
    chmod +x /app/custom-apps/installers/lisa-installer.run
    /app/custom-apps/installers/lisa-installer.run --silent
fi

echo "Lisa installed successfully"
```

**startup/01-start-puma.sh:**
```bash
#!/bin/bash
set -e

echo "Starting Puma..."

# Start Puma in background
/usr/local/bin/puma &

# Wait for Puma to be ready
max_attempts=30
attempt=1
while [ $attempt -le $max_attempts ]; do
    if curl -f http://localhost:8080/health > /dev/null 2>&1; then
        echo "Puma is ready"
        exit 0
    fi
    echo "Waiting for Puma... ($attempt/$max_attempts)"
    sleep 2
    ((attempt++))
done

echo "Puma failed to start"
exit 1
```

**startup/02-start-lisa.sh:**
```bash
#!/bin/bash
set -e

echo "Starting Lisa..."

# Set environment variables for Lisa
export DATABASE_URL="postgresql://postgres@localhost:5432/lisa_test"
export PUMA_URL="http://localhost:8080"

# Start Lisa in background
/usr/local/bin/lisa-server &

# Wait for Lisa to be ready
max_attempts=30
attempt=1
while [ $attempt -le $max_attempts ]; do
    if curl -f http://localhost:3000/health > /dev/null 2>&1; then
        echo "Lisa is ready"
        exit 0
    fi
    echo "Waiting for Lisa... ($attempt/$max_attempts)"
    sleep 2
    ((attempt++))
done

echo "Lisa failed to start"
exit 1
```

### Windows Example

**installers/01-install-puma.ps1:**
```powershell
Write-Host "Installing Puma..." -ForegroundColor Yellow

# Copy Puma installer (if you placed it here)
$installer = "C:\app\custom-apps\installers\puma-installer.exe"
if (Test-Path $installer) {
    & $installer /S
}

Write-Host "Puma installed successfully" -ForegroundColor Green
```

**startup/01-start-puma.ps1:**
```powershell
Write-Host "Starting Puma..." -ForegroundColor Yellow

# Start Puma as background job
Start-Process "C:\Program Files\Puma\puma.exe" -NoNewWindow

# Wait for Puma to be ready
$maxAttempts = 30
for ($i = 1; $i -le $maxAttempts; $i++) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8080/health" -UseBasicParsing
        if ($response.StatusCode -eq 200) {
            Write-Host "Puma is ready" -ForegroundColor Green
            exit 0
        }
    } catch {
        # Not ready yet
    }
    Write-Host "Waiting for Puma... ($i/$maxAttempts)"
    Start-Sleep -Seconds 2
}

Write-Host "Puma failed to start" -ForegroundColor Red
exit 1
```

## Environment Variables

You can use these environment variables in your scripts:

- `START_POSTGRESQL` - Set to "true" to start PostgreSQL automatically
- `POSTGRES_DB` - Name of the database to create
- `BASE_URL` - Base URL for your application
- Add your own environment variables in docker-compose.yml

## Docker Compose Configuration

Update `docker-compose.linux.yml` or `docker-compose.windows.yml`:

```yaml
services:
  tests:
    build:
      context: ../..
      dockerfile: Tests/Docker/Dockerfile.linux
    environment:
      - START_POSTGRESQL=true
      - POSTGRES_DB=lisa_test
      - BASE_URL=http://localhost:3000
      - PUMA_URL=http://localhost:8080
    # ... rest of configuration
```

## Tips

1. **Executable Permissions**: Make sure Linux scripts are executable:
   ```bash
   chmod +x apps/installers/*.sh apps/startup/*.sh
   ```

2. **Dependencies**: Install scripts run before startup scripts, so install all dependencies first

3. **Startup Order**: Use numbered prefixes (01-, 02-, etc.) to control execution order

4. **Health Checks**: Always include health checks in startup scripts to ensure services are ready

5. **Logs**: Scripts output to console, which is captured in Docker logs

6. **Testing Locally**: Test your scripts locally before adding to Docker:
   ```bash
   cd Tests/Docker/apps
   ./installers/01-install-puma.sh
   ./startup/01-start-puma.sh
   ```

## Troubleshooting

- **Script not running**: Check if it's executable and has correct shebang (`#!/bin/bash`)
- **Service not starting**: Add more verbose logging to your startup scripts
- **PostgreSQL not available**: Set `START_POSTGRESQL=true` in docker-compose.yml
- **View logs**: `docker-compose logs tests`

## Examples Directory

Check `Tests/Docker/apps/examples/` for complete working examples.
