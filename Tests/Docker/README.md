# Docker Test Environment

This directory contains Docker configurations for running tests in containerized environments, supporting both Linux and Windows containers.

## Quick Start

### Linux Containers

```bash
# Build the Docker image
npm run docker:build:linux

# Run tests in container
npm run docker:run:linux
```

### Windows Containers

```bash
# Build the Docker image
npm run docker:build:windows

# Run tests in container
npm run docker:run:windows
```

## Directory Structure

```
Docker/
├── Dockerfile.linux          # Linux container configuration
├── Dockerfile.windows        # Windows container configuration
├── entrypoint.sh             # Linux startup script
├── entrypoint.ps1            # Windows startup script
├── docker-compose.linux.yml  # Linux compose configuration
├── docker-compose.windows.yml# Windows compose configuration
├── .dockerignore             # Files to exclude from Docker build
├── apps/                     # Custom application scripts and resources
│   ├── installers/          # Installation scripts (run once at startup)
│   ├── startup/             # Startup scripts (run in order at startup)
│   ├── resources/           # Resource files (installers, SQL, configs)
│   └── examples/            # Example scripts for reference
└── README.md                 # This file
```

## apps/ Directory - Custom Applications

The `apps/` directory is designed for easy customization of the test environment. It contains three main subdirectories:

### 1. `resources/` - Resource Files
Store all your resource files here:
- **Installers**: `.exe`, `.msi`, `.run`, `.deb`, `.rpm`, `.tar.gz`, `.zip`
- **SQL Scripts**: Database setup, migrations, seed data
- **Configuration Files**: `.json`, `.yaml`, `.xml`, `.ini`, `.conf`
- **Data Files**: Test data, reference data, any other files

**Location in container:**
- Linux: `/app/custom-apps/resources/`
- Windows: `C:\app\custom-apps\resources\`

### 2. `installers/` - Installation Scripts
Place your installation scripts here. They run **once** during container startup, before the startup scripts.

**Naming convention:** Use numbered prefixes to control execution order:
- `01-install-database.sh` / `01-install-database.ps1`
- `02-install-app.sh` / `02-install-app.ps1`

**Example:**
```bash
# Linux: installers/01-install-app.sh
#!/bin/bash
if [ -f "/app/custom-apps/resources/app-installer.run" ]; then
    chmod +x /app/custom-apps/resources/app-installer.run
    /app/custom-apps/resources/app-installer.run --silent
fi
```

```powershell
# Windows: installers/01-install-app.ps1
$installer = "C:\app\custom-apps\resources\app-installer.exe"
if (Test-Path $installer) {
    & $installer /S
}
```

### 3. `startup/` - Startup Scripts
Place your application startup scripts here. They run **in order** after installers.

**Naming convention:** Use numbered prefixes to control execution order:
- `01-start-database.sh` / `01-start-database.ps1`
- `02-start-app.sh` / `02-start-app.ps1`

**Example:**
```bash
# Linux: startup/01-start-app.sh
#!/bin/bash
/opt/myapp/bin/myapp-server --port 3000 &

# Wait for app to be ready
for i in {1..30}; do
    if curl -f http://localhost:3000/health; then
        echo "App is ready"
        exit 0
    fi
    sleep 2
done
```

### 4. `examples/` - Reference Examples
Complete working examples for both Linux (`.sh`) and Windows (`.ps1`) scripts.

## Startup Sequence

The container startup follows this sequence:

1. **PostgreSQL** (optional, if `START_POSTGRESQL=true`)
   - Initializes and starts PostgreSQL
   - Creates database if `POSTGRES_DB` is set

2. **Installer Scripts** (from `apps/installers/`)
   - Runs in alphabetical order (use numbered prefixes)
   - Install dependencies and applications

3. **Startup Scripts** (from `apps/startup/`)
   - Runs in alphabetical order (use numbered prefixes)
   - Start services and applications

4. **Tests** (from `CMD` in docker-compose or docker run)
   - Runs the test suite

## Environment Variables

Configure the test environment using these variables (set in `docker-compose.yml` or `docker run -e`):

### Application Settings
- `BASE_URL` - URL of the application to test (default: `http://localhost:3000`)
- `CI` - CI mode indicator (default: `true`)

### PostgreSQL Settings
- `START_POSTGRESQL` - Start PostgreSQL in container (default: `false`)
- `POSTGRES_DB` - Database name to create (optional)
- `DATABASE_URL` - PostgreSQL connection string (optional)

### Custom Application Settings
Add your own environment variables as needed:
- `PUMA_PORT`, `PUMA_URL` - Example Puma configuration
- `LISA_PORT` - Example Lisa configuration
- `TEST_USERNAME`, `TEST_PASSWORD` - Test credentials

## Customization Examples

### Example 1: Add a PostgreSQL-dependent application

1. **Add SQL setup script to `resources/`:**
   ```sql
   -- resources/myapp-schema.sql
   CREATE TABLE users (id SERIAL, name VARCHAR(100));
   ```

2. **Add installer script:**
   ```bash
   # installers/01-install-myapp.sh
   #!/bin/bash
   psql -U postgres -d mydb -f /app/custom-apps/resources/myapp-schema.sql
   tar -xzf /app/custom-apps/resources/myapp.tar.gz -C /opt/
   ```

3. **Add startup script:**
   ```bash
   # startup/01-start-myapp.sh
   #!/bin/bash
   /opt/myapp/bin/myapp-server &
   ```

4. **Configure in docker-compose.yml:**
   ```yaml
   environment:
     - START_POSTGRESQL=true
     - POSTGRES_DB=mydb
     - DATABASE_URL=postgresql://postgres@localhost:5432/mydb
   ```

### Example 2: Add a web service dependency

1. **Add installer to `resources/`:**
   Place `webservice-installer.run` in `resources/`

2. **Add installer script:**
   ```bash
   # installers/02-install-webservice.sh
   #!/bin/bash
   chmod +x /app/custom-apps/resources/webservice-installer.run
   /app/custom-apps/resources/webservice-installer.run --silent
   ```

3. **Add startup script:**
   ```bash
   # startup/02-start-webservice.sh
   #!/bin/bash
   /usr/local/bin/webservice --port 8080 &
   # Wait for service to be ready
   for i in {1..30}; do
       if curl -f http://localhost:8080/health; then
           exit 0
       fi
       sleep 2
   done
   ```

## Tips and Best Practices

1. **Use numbered prefixes** (01-, 02-, etc.) to control script execution order
2. **Make Linux scripts executable:** `chmod +x apps/installers/*.sh apps/startup/*.sh`
3. **Include health checks** in startup scripts to ensure services are ready
4. **Test scripts locally** before adding to Docker
5. **Use environment variables** for configuration instead of hardcoding
6. **Check logs** with `docker-compose logs tests` for troubleshooting
7. **Keep resources small** - large files should be downloaded during build if possible
8. **Document your scripts** - add comments explaining what they do

## Troubleshooting

### Scripts not running
- **Linux**: Check if scripts are executable (`chmod +x`)
- **Linux**: Check shebang line (`#!/bin/bash`)
- **Windows**: Check file extension (`.ps1`)
- Check script names match the pattern (numbered prefixes)

### Services not starting
- Add verbose logging to your startup scripts
- Check if dependencies are installed
- Verify environment variables are set correctly
- Use health checks to wait for services

### PostgreSQL not available
- Set `START_POSTGRESQL=true` in docker-compose.yml
- Set `POSTGRES_DB` to create a database
- Wait for PostgreSQL to be ready in your scripts

### Resource files not found
- Verify files are in `Tests/Docker/apps/resources/`
- Check file paths in scripts match container paths
- Ensure `.dockerignore` doesn't exclude your files

### View container logs
```bash
# View logs
docker-compose -f Docker/docker-compose.linux.yml logs tests

# Follow logs in real-time
docker-compose -f Docker/docker-compose.linux.yml logs -f tests
```

## Advanced Usage

### Custom Docker Commands

```bash
# Build with custom tag
docker build -f Tests/Docker/Dockerfile.linux -t myapp-tests:v1.0 .

# Run with custom command
docker run --rm myapp-tests:v1.0 npm run test:gui

# Run with interactive shell
docker run -it --rm myapp-tests:v1.0 /bin/bash

# Run specific test file
docker run --rm myapp-tests:v1.0 npx playwright test example.spec.js
```

### Volume Mounting for Development

```yaml
# In docker-compose.yml
volumes:
  - ./test-results:/app/tests/test-results
  - ../GUI:/app/tests/GUI  # Live-reload test files
  - ../API:/app/tests/API
```

### Using Separate Services

Instead of running PostgreSQL in the same container, use a separate service:

```yaml
services:
  postgres:
    image: postgres:15
    environment:
      - POSTGRES_PASSWORD=testpass
      - POSTGRES_DB=testdb
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s

  tests:
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      - DATABASE_URL=postgresql://postgres:testpass@postgres:5432/testdb
```

## See Also

- [apps/README.md](apps/README.md) - Detailed documentation for custom applications
- [apps/resources/README.md](apps/resources/README.md) - Resource files documentation
- [apps/examples/](apps/examples/) - Complete working examples
- [../QUICKSTART.md](../QUICKSTART.md) - Quick start guide for tests
- [../README.md](../README.md) - Main tests documentation
