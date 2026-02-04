# Running Linux Containers on Windows

This guide explains how to run Lisa tests in Linux containers on Windows using Docker Desktop.

## Why Run Linux Containers on Windows?

- **Cross-platform testing**: Test your application in Linux environment without leaving Windows
- **CI/CD compatibility**: Match your local tests with Linux-based CI/CD pipelines (GitHub Actions, GitLab CI, etc.)
- **Better compatibility**: Many web frameworks and tools work better in Linux
- **Consistent environment**: Same container works on all platforms (Linux, macOS, Windows)

## Prerequisites

1. **Windows 10/11 Pro, Enterprise, or Education** (or Windows Server)
   - Home edition works too, but requires WSL 2

2. **Docker Desktop for Windows** installed
   - Download from: https://www.docker.com/products/docker-desktop/
   - Make sure WSL 2 backend is enabled (default on modern installations)

3. **Hyper-V** or **WSL 2** enabled
   - Docker Desktop will prompt you to enable these if needed

## Step-by-Step Guide

### Step 1: Verify Docker Desktop Installation

Open PowerShell or Command Prompt and run:

```cmd
docker --version
```

You should see output like: `Docker version 24.0.x, build xxxxxxx`

### Step 2: Check Docker Desktop Mode

Docker Desktop can run in two modes:
- **Linux containers mode** (default) - what we need
- **Windows containers mode** - for Windows-specific containers

To check current mode:

```cmd
docker info | findstr "OSType"
```

**Expected output:** `OSType: linux`

If you see `OSType: windows`, switch to Linux mode:

1. Right-click Docker Desktop icon in system tray
2. Select **"Switch to Linux containers..."**
3. Wait for Docker to restart (may take 1-2 minutes)

### Step 3: Navigate to Tests Directory

```cmd
cd C:\path\to\Lisa\Tests
```

### Step 4: Run Tests in Linux Container

You have three options:

#### Option A: Build and Run (Recommended for First Time)

```cmd
Scripts\run-docker-tests-linux.bat build-and-run
```

This will:
1. Build the Linux Docker image
2. Run tests inside the container
3. Copy test results to your host machine
4. Clean up the container

#### Option B: Build Only

```cmd
Scripts\run-docker-tests-linux.bat build
```

Build the image for later use.

#### Option C: Run Only (Using Existing Image)

```cmd
Scripts\run-docker-tests-linux.bat run
```

Run tests using a previously built image.

### Step 5: View Test Results

After tests complete, view the HTML report:

```cmd
start Docker\test-results\playwright-report\index.html
```

## What the Script Does

The `run-docker-tests-linux.bat` script:

1. ✅ Checks if Docker is installed
2. ✅ Verifies Docker is in Linux containers mode
3. ✅ Builds the Linux Docker image (if needed)
4. ✅ Runs tests inside the container
5. ✅ Mounts test results directory to host
6. ✅ Cleans up containers after completion
7. ✅ Exits with appropriate error codes

## Complete Example Session

```cmd
C:\Users\YourName> cd C:\Projects\Lisa\Tests

C:\Projects\Lisa\Tests> Scripts\run-docker-tests-linux.bat build-and-run

Building Linux Docker image...
[+] Building 45.2s (14/14) FINISHED
 => [internal] load build definition from Dockerfile.linux
 => [internal] load .dockerignore
 => [internal] load metadata for docker.io/library/node:18-bullseye
 => [1/9] FROM docker.io/library/node:18-bullseye
 => [2/9] RUN apt-get update && apt-get install -y ...
 => [3/9] WORKDIR /app/tests
 => [4/9] COPY Tests/package*.json ./
 => [5/9] RUN npm install
 => [6/9] RUN npx playwright install --with-deps
 => [7/9] COPY Tests/ ./
 => [8/9] RUN mkdir -p test-results/...
 => [9/9] COPY Tests/Docker/entrypoint.sh /app/entrypoint.sh
 => exporting to image
 => => naming to docker.io/library/lisa-tests:linux

Build complete

Running tests in Linux Docker container...
[+] Running 1/0
 ✔ Container tests  Created                                      0.0s
Attaching to tests
tests  | ========================================
tests  | Starting Test Environment
tests  | ========================================
tests  | Step 1: PostgreSQL startup skipped
tests  | Step 2: No custom applications to start
tests  | Step 3: Starting tests...
tests  | ========================================
tests  |
tests  | > lisa-tests@1.0.0 test
tests  | > npm run test:gui && npm run test:api
tests  |
tests  | Running 5 tests using 3 workers
tests  |   5 passed (12.3s)
tests  |
tests  | To open last HTML report run:
tests  |   npx playwright show-report
tests  |
tests exited with code 0

C:\Projects\Lisa\Tests> start Docker\test-results\playwright-report\index.html
```

## Troubleshooting

### Error: "Docker is not installed or not running"

**Solution:**
1. Install Docker Desktop from https://www.docker.com/products/docker-desktop/
2. Start Docker Desktop
3. Wait for it to fully start (icon will turn green)

### Error: "Docker Desktop appears to be in Windows containers mode"

**Solution:**
1. Right-click Docker Desktop tray icon
2. Select "Switch to Linux containers..."
3. Wait for Docker to restart
4. Run the script again

### Error: "The system cannot find the path specified"

**Solution:** Make sure you're in the correct directory:
```cmd
cd C:\path\to\Lisa\Tests
```

### Build is very slow

**First build** is slow (5-10 minutes) because it downloads:
- Node.js base image (~300 MB)
- System dependencies
- npm packages
- Playwright browsers

**Subsequent builds** are much faster (1-2 minutes) due to Docker caching.

**Tip:** Keep Docker Desktop running in the background for faster startups.

### Error: "Cannot connect to Docker daemon"

**Solution:**
1. Make sure Docker Desktop is running
2. Check system tray for Docker icon
3. Restart Docker Desktop if needed

### Tests fail inside container but pass locally

**Possible causes:**
1. **Different base URLs**: Check environment variables in `docker-compose.linux.yml`
2. **Network issues**: Container needs to access your app
3. **Missing dependencies**: Add them to `Dockerfile.linux`

**Debug steps:**
1. Check container logs
2. Run tests with verbose output
3. Access running container: `docker exec -it <container-id> /bin/bash`

## Advanced Usage

### Custom Environment Variables

Edit `Tests/Docker/docker-compose.linux.yml`:

```yaml
environment:
  - BASE_URL=http://your-app-url:port
  - TEST_USERNAME=your-username
  - TEST_PASSWORD=your-password
```

### Run Specific Tests

```cmd
REM Build image first
Scripts\run-docker-tests-linux.bat build

REM Run specific test file
docker run --rm lisa-tests:linux npx playwright test GUI/specific-test.spec.js
```

### Keep Container Running for Debugging

```cmd
docker run -it --rm ^
  -v %CD%\Docker\test-results:/app/tests/test-results ^
  lisa-tests:linux /bin/bash
```

Inside the container, you can run tests manually:
```bash
npm run test:gui
npm run test:api
```

## Comparison: Linux vs Windows Containers

| Feature | Linux Containers | Windows Containers |
|---------|------------------|-------------------|
| **Host OS** | Windows, Linux, macOS | Windows only |
| **Script** | `run-docker-tests-linux.bat` | `run-docker-tests-windows.bat` |
| **Base Image** | Debian Linux | Windows Server Core |
| **Build Time** | ~5 min first, ~1 min later | ~15 min first, ~5 min later |
| **Image Size** | ~1.5 GB | ~5 GB |
| **Performance** | Fast (native on Linux, WSL2 on Windows) | Slower (Windows overhead) |
| **CI/CD** | Works everywhere | Windows agents only |
| **Use Case** | General testing, CI/CD | Windows-specific testing |

**Recommendation:** Use Linux containers for most cases. They're faster, smaller, and work everywhere.

## Integration with CI/CD

Your local Linux container tests will match CI/CD environments:

### GitHub Actions
```yaml
- name: Run tests in Docker
  run: |
    docker build -f Tests/Docker/Dockerfile.linux -t lisa-tests:linux .
    docker-compose -f Tests/Docker/docker-compose.linux.yml up --abort-on-container-exit
```

### GitLab CI
```yaml
test:
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker build -f Tests/Docker/Dockerfile.linux -t lisa-tests:linux .
    - docker-compose -f Tests/Docker/docker-compose.linux.yml up --abort-on-container-exit
```

The **exact same Docker configuration** works locally on Windows and in CI/CD.

## Performance Tips

1. **Keep Docker Desktop running** - Reduces startup time
2. **Allocate more resources** - Docker Desktop Settings → Resources
   - Increase CPUs (4+ recommended)
   - Increase Memory (8GB+ recommended)
3. **Use SSD** - Docker performance depends heavily on disk speed
4. **Close other applications** - Free up system resources
5. **Enable BuildKit** - Faster Docker builds (enabled by default in modern versions)

## Summary

Running Linux containers on Windows is now fully supported:

✅ **Easy setup** - One script to run everything  
✅ **Automatic detection** - Script checks Docker mode automatically  
✅ **Cross-platform** - Same tests work on Windows, Linux, macOS  
✅ **CI/CD compatible** - Match your pipeline environment  
✅ **Well documented** - Clear error messages and troubleshooting  

**Get Started:**
```cmd
cd C:\path\to\Lisa\Tests
Scripts\run-docker-tests-linux.bat build-and-run
```

**Need help?** See README.md for comprehensive documentation.

---

**Happy Testing on Windows! 🎉**
