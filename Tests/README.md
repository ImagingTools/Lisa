# Lisa Testing System

Comprehensive testing system for Lisa application with support for GUI tests (Playwright) and API tests (Newman/Postman). Includes Docker support for both Linux and Windows containers.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Running Tests Locally](#running-tests-locally)
- [Running Tests in Docker](#running-tests-in-docker)
- [Adapting for Your Application](#adapting-for-your-application)
- [CI/CD Integration](#cicd-integration)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

This testing system provides:
- **GUI Tests**: Automated browser testing using Playwright
- **API Tests**: Backend/API testing using Newman (Postman CLI)
- **Docker Support**: Run tests in isolated Linux and Windows containers
- **Cross-Platform**: Works on Linux, macOS, and Windows
- **CI/CD Ready**: Easy integration with GitHub Actions, GitLab CI, Jenkins, etc.

## ✨ Features

### Playwright (GUI Tests)
- Multi-browser support (Chromium, Firefox, WebKit)
- Mobile device emulation
- Screenshot and video recording on failure
- Parallel test execution
- Trace viewer for debugging
- Multiple report formats (HTML, JSON, JUnit)

### Newman (API Tests)
- Run Postman collections from command line
- Environment variable support
- Detailed test reports
- Request/response logging
- Integration with Newman HTML Extra reporter

### Docker Support
- **Linux containers** - Debian-based with PostgreSQL pre-installed
  - Can be run on Linux, macOS, and **Windows** (via Docker Desktop)
- **Windows containers** - Windows Server Core with PostgreSQL pre-installed  
  - Can be run on Windows only
- Isolated test environments
- Reproducible test runs
- Easy CI/CD integration

## 📦 Prerequisites

### For Local Testing

#### Required
- **Node.js** 18.x or higher
- **npm** 9.x or higher

#### Optional (for specific browsers)
- **Chrome/Chromium** - For Playwright Chrome tests
- **Firefox** - For Playwright Firefox tests
- **Safari** - For Playwright WebKit tests (macOS only)

### For Docker Testing

#### Linux Containers (on any platform)
- **Docker** 20.10 or higher
- **Docker Compose** 2.x or higher
- Works on Linux, macOS, and Windows (via Docker Desktop)

#### Windows Containers (Windows only)
- **Windows 10/11 Pro** or **Windows Server**
- **Docker Desktop** with Windows containers enabled
- **Hyper-V** feature enabled

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd Tests
npm install
npm run install:browsers
```

### 2. Run All Tests

```bash
# Run both GUI and API tests
npm test

# Or use the convenience script
./Scripts/run-all-tests.sh
```

### 3. Run Specific Test Types

```bash
# GUI tests only
npm run test:gui

# API tests only
npm run test:api
```

### 4. View Test Results

After running tests, open the HTML report:

```bash
# On Linux/macOS
open test-results/playwright-report/index.html

# On Windows
start test-results\playwright-report\index.html
```

## 📁 Project Structure

```
Tests/
├── API/                          # API/Backend tests
│   ├── collections/              # Postman collections
│   │   └── example.postman_collection.json
│   └── environments/             # Postman environments
│       └── example.postman_environment.json
├── GUI/                          # GUI/Frontend tests
│   └── example.spec.js           # Example Playwright test
├── Docker/                       # Docker configurations
│   ├── Dockerfile.linux          # Linux container
│   ├── Dockerfile.windows        # Windows container
│   ├── docker-compose.linux.yml  # Linux compose config
│   └── docker-compose.windows.yml # Windows compose config
├── Scripts/                      # Utility scripts
│   ├── run-all-tests.sh          # Run all tests (Linux/macOS)
│   ├── run-all-tests.bat         # Run all tests (Windows)
│   ├── run-docker-tests-linux.sh # Run tests in Linux container
│   └── run-docker-tests-windows.bat # Run tests in Windows container
├── test-results/                 # Test results (generated)
│   ├── playwright-report/        # HTML reports
│   ├── screenshots/              # Screenshots
│   └── videos/                   # Test videos
├── package.json                  # Dependencies and scripts
├── playwright.config.js          # Playwright configuration
└── README.md                     # This file
```

## 🏃 Running Tests Locally

### Prerequisites Check

```bash
# Check Node.js version
node --version  # Should be 18.x or higher

# Check npm version
npm --version   # Should be 9.x or higher
```

### Install and Setup

```bash
cd Tests

# Install dependencies
npm install

# Install Playwright browsers
npm run install:browsers
```

### Run Tests

```bash
# Run all tests (GUI + API)
npm test

# Run GUI tests only
npm run test:gui

# Run GUI tests with visible browser (headed mode)
npm run test:gui:headed

# Run GUI tests in debug mode
npm run test:gui:debug

# Run API tests only
npm run test:api

# Run API tests with verbose output
npm run test:api:verbose
```

### Using Scripts

#### Linux/macOS

```bash
# Run all tests
./Scripts/run-all-tests.sh

# Run GUI tests only
./Scripts/run-all-tests.sh --gui-only

# Run API tests only
./Scripts/run-all-tests.sh --api-only
```

#### Windows

```cmd
REM Run all tests
Scripts\run-all-tests.bat

REM Run GUI tests only
Scripts\run-all-tests.bat --gui-only

REM Run API tests only
Scripts\run-all-tests.bat --api-only
```

## 🐳 Running Tests in Docker

### Adding Custom Applications (NEW!)

**You can now add your own applications to Docker containers!**

The Docker setup supports automatic startup sequencing for custom applications:
1. PostgreSQL starts first (if enabled)
2. Your application installers run (e.g., Puma, Lisa)
3. Your startup scripts run in order
4. Tests execute

**Quick Setup:**
1. Place installers in `Tests/Docker/apps/installers/`
2. Create startup scripts in `Tests/Docker/apps/startup/`
3. Set `START_POSTGRESQL=true` in docker-compose.yml if needed

See `Tests/Docker/apps/README.md` for complete documentation and examples.

**Example Structure:**
```
Tests/Docker/apps/
├── installers/
│   ├── 01-install-puma.sh
│   └── 02-install-lisa.sh
└── startup/
    ├── 01-start-puma.sh
    └── 02-start-lisa.sh
```

### Linux Containers

Linux containers can be run on both Linux/macOS and Windows systems.

#### On Linux/macOS

```bash
# Build Docker image
docker build -f Docker/Dockerfile.linux -t lisa-tests:linux .

# Run tests
docker-compose -f Docker/docker-compose.linux.yml up --abort-on-container-exit

# Or use the convenience script
./Scripts/run-docker-tests-linux.sh build-and-run
```

**Script Options:**

```bash
# Build only
./Scripts/run-docker-tests-linux.sh build

# Run only (using existing image)
./Scripts/run-docker-tests-linux.sh run

# Build and run (default)
./Scripts/run-docker-tests-linux.sh build-and-run
```

#### On Windows

**Prerequisites:**
1. Install Docker Desktop for Windows
2. Ensure Docker Desktop is in **Linux containers mode**:
   - Right-click Docker Desktop tray icon
   - If you see "Switch to Linux containers...", click it
   - Wait for Docker to restart

**Build and Run:**

```cmd
REM Build Docker image (run from the Tests\ directory; use repo root as context)
docker build -f Docker\Dockerfile.linux -t lisa-tests:linux ..

REM Run tests
docker-compose -f Docker\docker-compose.linux.yml up --abort-on-container-exit

REM Or use the convenience script
Scripts\run-docker-tests-linux.bat build-and-run
```

**Script Options:**

```cmd
REM Build only
Scripts\run-docker-tests-linux.bat build

REM Run only (using existing image)
Scripts\run-docker-tests-linux.bat run

REM Build and run (default)
Scripts\run-docker-tests-linux.bat build-and-run
```

### Windows Containers

#### Prerequisites

1. Enable Hyper-V:
```powershell
Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V -All
```

2. Switch Docker to Windows containers:
   - Right-click Docker Desktop tray icon
   - Select "Switch to Windows containers..."

#### Build and Run

```cmd
REM Build Docker image
docker build -f Docker\Dockerfile.windows -t lisa-tests:windows .

REM Run tests
docker-compose -f Docker\docker-compose.windows.yml up --abort-on-container-exit

REM Or use the convenience script
Scripts\run-docker-tests-windows.bat build-and-run
```

#### Script Options

```cmd
REM Build only
Scripts\run-docker-tests-windows.bat build

REM Run only (using existing image)
Scripts\run-docker-tests-windows.bat run

REM Build and run (default)
Scripts\run-docker-tests-windows.bat build-and-run
```

## 🔧 Adapting for Your Application

This testing system is designed to be generic and reusable. Here's how to adapt it for any application:

### 1. Copy the Tests Directory

```bash
# Copy the entire Tests directory to your project
cp -r Lisa/Tests YourProject/Tests
cd YourProject/Tests
```

### 2. Update Configuration

#### package.json
- Update the `name` field
- Adjust `author` and `license` fields
- Keep all dependencies and scripts as-is

#### playwright.config.js
```javascript
// Line 52: Update the base URL
baseURL: process.env.BASE_URL || 'http://localhost:YOUR_PORT',
```

### 3. Update Test Files

#### GUI Tests (Tests/GUI/)
Replace `example.spec.js` with your own tests:

```javascript
const { test, expect } = require('@playwright/test');

test('your test name', async ({ page }) => {
  await page.goto('/');
  // Add your test logic
});
```

#### API Tests (Tests/API/)

1. Export your Postman collection:
   - Open Postman
   - Click "..." next to your collection
   - Export > Collection v2.1
   - Save to `Tests/API/collections/`

2. Export your Postman environment:
   - Click environment selector in Postman
   - Click "..." next to environment
   - Export
   - Save to `Tests/API/environments/`

3. Update package.json scripts:
```json
"test:api": "newman run API/collections/YOUR_COLLECTION.json -e API/environments/YOUR_ENVIRONMENT.json"
```

### 4. Update Docker Configuration

#### docker-compose.linux.yml / docker-compose.windows.yml

```yaml
# Update BASE_URL environment variable
environment:
  - BASE_URL=http://your-app-url:port
```

If your application needs to run in Docker:

```yaml
services:
  # Add your application service
  app:
    image: your-app:latest
    ports:
      - "YOUR_PORT:YOUR_PORT"
    environment:
      - NODE_ENV=test
  
  # Update tests service
  tests:
    depends_on:
      - app
    environment:
      - BASE_URL=http://app:YOUR_PORT
```

### 5. Additional Application Dependencies

If your tests need additional tools or dependencies:

#### For Node.js dependencies
Add to `package.json`:
```json
"devDependencies": {
  "your-package": "^1.0.0"
}
```

#### For system dependencies (Linux)
Add to `Docker/Dockerfile.linux`:
```dockerfile
RUN apt-get update && apt-get install -y \
    your-package \
    && rm -rf /var/lib/apt/lists/*
```

#### For system dependencies (Windows)
Add to `Docker/Dockerfile.windows`:
```dockerfile
RUN choco install -y your-package
```

## 🔄 CI/CD Integration

### GitHub Actions

Create `.github/workflows/tests.yml`:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          cd Tests
          npm install
      
      - name: Install Playwright browsers
        run: |
          cd Tests
          npx playwright install --with-deps
      
      - name: Run tests
        run: |
          cd Tests
          npm test
      
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: Tests/test-results/
```

### GitLab CI

Create `.gitlab-ci.yml`:

```yaml
image: node:18

stages:
  - test

test:
  stage: test
  script:
    - cd Tests
    - npm install
    - npx playwright install --with-deps
    - npm test
  artifacts:
    when: always
    paths:
      - Tests/test-results/
    expire_in: 1 week
```

### Jenkins

```groovy
pipeline {
    agent any
    
    stages {
        stage('Install') {
            steps {
                dir('Tests') {
                    sh 'npm install'
                    sh 'npx playwright install --with-deps'
                }
            }
        }
        
        stage('Test') {
            steps {
                dir('Tests') {
                    sh 'npm test'
                }
            }
        }
    }
    
    post {
        always {
            archiveArtifacts artifacts: 'Tests/test-results/**/*', allowEmptyArchive: true
            publishHTML([
                allowMissing: false,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'Tests/test-results/playwright-report',
                reportFiles: 'index.html',
                reportName: 'Test Report'
            ])
        }
    }
}
```

### Docker in CI/CD

```yaml
# GitHub Actions example with Docker
test-docker:
  runs-on: ubuntu-latest
  
  steps:
    - uses: actions/checkout@v3
    
    - name: Build and run tests
      run: |
        docker build -f Tests/Docker/Dockerfile.linux -t lisa-tests:linux .
        docker-compose -f Tests/Docker/docker-compose.linux.yml up --abort-on-container-exit
    
    - name: Upload test results
      if: always()
      uses: actions/upload-artifact@v3
      with:
        name: docker-test-results
        path: Tests/test-results/
```

## 🐛 Troubleshooting

### Common Issues

#### Issue: Playwright browsers not installed

**Symptom**: Error message "Executable doesn't exist"

**Solution**:
```bash
cd Tests
npx playwright install --with-deps
```

#### Issue: Permission denied on scripts

**Symptom**: Cannot execute .sh scripts

**Solution**:
```bash
chmod +x Scripts/*.sh
```

#### Issue: Shell scripts fail with "bad interpreter" or "exec format error" in Docker

**Symptom**: Docker container fails to start with errors like:
- `exec /app/entrypoint.sh: no such file or directory`
- `exec format error`
- `/bin/bash^M: bad interpreter: No such file or directory`

**Cause**: Shell scripts have CRLF line endings (Windows-style) instead of LF (Unix-style), or contain UTF-8 BOM.

**Solution**: The repository now includes a `.gitattributes` file that automatically enforces LF line endings for all shell scripts. If you're experiencing this issue:

1. Verify your scripts have correct line endings:
   ```bash
   # From the Tests directory
   ./Scripts/validate-shell-scripts.sh
   ```

2. If needed, manually fix line endings:
   ```bash
   # Remove CRLF and BOM from all shell scripts
   find Tests -name "*.sh" -type f -exec dos2unix {} \;
   # Or using sed
   find Tests -name "*.sh" -type f -exec sed -i 's/\r$//' {} \;
   find Tests -name "*.sh" -type f -exec sed -i '1s/^\xEF\xBB\xBF//' {} \;
   ```

3. Ensure Git is configured to respect `.gitattributes`:
   ```bash
   # Re-normalize line endings after pulling
   git add --renormalize .
   ```

**Prevention**: The `.gitattributes` file at the repository root ensures that shell scripts always use LF line endings, regardless of your operating system or Git configuration.

#### Issue: Newman not finding collection

**Symptom**: "Could not find collection file"

**Solution**: Check that the path in package.json matches your file:
```json
"test:api": "newman run API/collections/YOUR_FILE.json ..."
```

#### Issue: Docker build fails on Windows

**Symptom**: "image operating system not matching host"

**Solution**: Switch Docker to Windows containers:
1. Right-click Docker Desktop tray icon
2. Select "Switch to Windows containers..."

#### Issue: Tests fail in Docker but pass locally

**Symptom**: Different behavior in Docker vs local

**Solutions**:
1. Check BASE_URL environment variable
2. Verify network connectivity between containers
3. Check if application is fully started (add health checks)
4. Review Docker logs: `docker-compose logs`

#### Issue: Port already in use

**Symptom**: "Port is already allocated"

**Solution**:
```bash
# Find and kill process using the port (Linux/macOS)
lsof -ti:3000 | xargs kill -9

# Or change the port in docker-compose.yml
```

#### Issue: Slow test execution in Docker

**Solutions**:
1. Use `.dockerignore` to exclude unnecessary files
2. Use Docker volume mounts for faster file access
3. Increase Docker resources (CPU/Memory) in Docker Desktop settings

### Debug Mode

#### Playwright Debug Mode

```bash
# Run single test in debug mode
npx playwright test --debug

# Run specific test file
npx playwright test GUI/example.spec.js --debug

# Run with headed browser
npx playwright test --headed
```

#### Newman Verbose Mode

```bash
# Run with detailed output
npm run test:api:verbose

# Or directly
newman run API/collections/example.postman_collection.json --verbose
```

### Getting Help

1. **Playwright Documentation**: https://playwright.dev/
2. **Newman Documentation**: https://learning.postman.com/docs/running-collections/using-newman-cli/
3. **Docker Documentation**: https://docs.docker.com/

### Useful Commands

```bash
# View Playwright version
npx playwright --version

# View Newman version
npx newman --version

# View Docker version
docker --version
docker-compose --version

# Clean Docker
docker system prune -a

# View Docker logs
docker-compose -f Docker/docker-compose.linux.yml logs

# List Docker images
docker images | grep lisa-tests

# Remove Docker image
docker rmi lisa-tests:linux
```

## 📝 Notes

- Test results are stored in `test-results/` directory
- Screenshots and videos are saved only on test failures
- Docker containers use isolated environments
- All scripts support both Linux and Windows
- The system is designed to be generic and reusable

## 🤝 Contributing

When adapting this testing system:
1. Keep the structure consistent
2. Update documentation with your changes
3. Add new test examples as needed
4. Share improvements back to the community

## 📄 License

This testing system follows the same license as the Lisa project (LGPL).

---

**Happy Testing! 🎉**
