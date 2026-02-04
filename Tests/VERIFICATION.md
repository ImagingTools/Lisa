# Testing System Verification Checklist

Use this checklist to verify that the testing system is properly set up and working.

## ✅ Initial Setup Verification

### Prerequisites Check
- [ ] Node.js 18+ installed: `node --version`
- [ ] npm 9+ installed: `npm --version`
- [ ] Docker installed (optional): `docker --version`
- [ ] docker-compose installed (optional): `docker-compose --version`

### File Structure Check
```bash
cd Tests
ls -la
```

Expected structure:
- [ ] `package.json` exists
- [ ] `playwright.config.js` exists
- [ ] `README.md` exists
- [ ] `GUI/` directory exists
- [ ] `API/` directory exists
- [ ] `Docker/` directory exists
- [ ] `Scripts/` directory exists

## ✅ Dependency Installation

### Install and Verify
```bash
cd Tests

# Install dependencies
npm install

# Verify package installation
ls node_modules/@playwright
ls node_modules/newman
```

Checks:
- [ ] `npm install` completed without errors
- [ ] `node_modules/` directory created
- [ ] Playwright package installed
- [ ] Newman package installed

### Browser Installation
```bash
npx playwright install --with-deps
```

Checks:
- [ ] Chromium installed successfully
- [ ] Firefox installed successfully
- [ ] WebKit installed successfully
- [ ] No error messages

## ✅ Local Test Execution

### GUI Tests
```bash
cd Tests
npm run test:gui
```

Expected results:
- [ ] Tests start executing
- [ ] Browser launches (if headed mode)
- [ ] Tests complete (pass or fail)
- [ ] Test results generated in `test-results/`
- [ ] HTML report created: `test-results/playwright-report/index.html`

### API Tests
```bash
cd Tests
npm run test:api
```

Expected results:
- [ ] Newman starts
- [ ] Collection loaded successfully
- [ ] Requests executed
- [ ] Test results displayed in console
- [ ] Exit code 0 (or expected failure)

### All Tests Together
```bash
cd Tests
npm test
```

Checks:
- [ ] Both GUI and API tests run
- [ ] Results from both test types appear
- [ ] Overall pass/fail status shown

## ✅ Test Results Verification

### Check Generated Files
```bash
cd Tests
ls -la test-results/
```

Expected files:
- [ ] `playwright-report/` directory
- [ ] `playwright-results.json`
- [ ] `playwright-junit.xml`
- [ ] `screenshots/` directory (if any test failed)
- [ ] `videos/` directory (if any test failed)

### View HTML Report
```bash
# Linux/macOS
open test-results/playwright-report/index.html

# Windows
start test-results\playwright-report\index.html
```

Checks:
- [ ] HTML report opens in browser
- [ ] Test results displayed correctly
- [ ] Can navigate through test cases
- [ ] Screenshots visible (if any)

## ✅ Docker Verification (Linux)

### Build Docker Image
```bash
cd /path/to/Lisa
docker build -f Tests/Docker/Dockerfile.linux -t lisa-tests:linux .
```

Checks:
- [ ] Build starts successfully
- [ ] All layers complete
- [ ] Image created successfully
- [ ] No error messages

### Verify Image
```bash
docker images | grep lisa-tests
```

Expected:
- [ ] Image `lisa-tests:linux` appears in list
- [ ] Reasonable size (< 2GB)

### Run Tests in Docker
```bash
cd Tests
../Scripts/run-docker-tests-linux.sh run
```

Checks:
- [ ] Container starts
- [ ] Tests execute inside container
- [ ] Test results generated
- [ ] Container stops cleanly
- [ ] Exit code indicates test status

### Verify Docker Results
```bash
ls -la Tests/Docker/test-results/
```

Expected:
- [ ] Test results copied from container
- [ ] Reports accessible on host

## ✅ Docker Verification (Windows)

**Note:** Windows containers require Windows 10/11 Pro or Windows Server with Docker Desktop in Windows container mode.

### Switch to Windows Containers
- [ ] Docker Desktop tray icon -> "Switch to Windows containers..."

### Build Windows Image
```cmd
docker build -f Tests\Docker\Dockerfile.windows -t lisa-tests:windows .
```

Checks:
- [ ] Build starts (may take longer than Linux)
- [ ] Chocolatey installs successfully
- [ ] Node.js installs successfully
- [ ] Image created

### Run Windows Tests
```cmd
Scripts\run-docker-tests-windows.bat run
```

Checks:
- [ ] Container starts (slower than Linux)
- [ ] Tests execute
- [ ] Results generated

## ✅ Script Verification

### Test All Scripts

#### Linux/macOS
```bash
cd Tests

# Setup script
./Scripts/setup.sh

# Run all tests script
./Scripts/run-all-tests.sh

# Docker test script
./Scripts/run-docker-tests-linux.sh build
```

Checks:
- [ ] All scripts are executable
- [ ] No permission errors
- [ ] Scripts complete successfully

#### Windows
```cmd
cd Tests

REM Setup script
Scripts\setup.bat

REM Run all tests script
Scripts\run-all-tests.bat

REM Docker test script
Scripts\run-docker-tests-windows.bat build
```

Checks:
- [ ] All scripts run
- [ ] No syntax errors
- [ ] Commands execute properly

## ✅ Configuration Verification

### Playwright Config
```bash
cat playwright.config.js | grep baseURL
```

Checks:
- [ ] `baseURL` is set
- [ ] URL format is correct
- [ ] Port matches your application

### Postman Environment
```bash
cat API/environments/example.postman_environment.json | grep BASE_URL
```

Checks:
- [ ] `BASE_URL` is defined
- [ ] URL matches your API endpoint

### Docker Compose
```bash
cat Docker/docker-compose.linux.yml | grep BASE_URL
```

Checks:
- [ ] Environment variables defined
- [ ] Volumes configured correctly
- [ ] Network settings appropriate

## ✅ CI/CD Examples Verification

### Check Example Files
```bash
ls -la Examples/CI-CD/
```

Expected files:
- [ ] `github-actions.yml`
- [ ] `gitlab-ci.yml`
- [ ] `Jenkinsfile`

### Validate Syntax (GitHub Actions)
```bash
# Requires gh CLI tool
gh workflow validate Examples/CI-CD/github-actions.yml
```

Or manually:
- [ ] Valid YAML syntax
- [ ] Proper indentation
- [ ] Job definitions correct

## ✅ Documentation Verification

### Check All Docs Present
```bash
cd Tests
ls *.md
```

Expected files:
- [ ] `README.md` - Main documentation
- [ ] `ADAPTATION_GUIDE.md` - Migration guide
- [ ] `QUICKSTART.md` - Quick reference
- [ ] `VERIFICATION.md` - This checklist

### Read Key Sections
- [ ] README.md has installation instructions
- [ ] README.md has troubleshooting section
- [ ] ADAPTATION_GUIDE.md has step-by-step guide
- [ ] QUICKSTART.md has quick commands

## ✅ Adaptation for New Project

### Test Copying Process
```bash
# Try copying to temporary location
cp -r Tests /tmp/test-copy
cd /tmp/test-copy

# Verify all files copied
find . -type f | wc -l  # Should match original
```

Checks:
- [ ] All files copied successfully
- [ ] Directory structure preserved
- [ ] Scripts remain executable
- [ ] No broken links

### Test Minimal Configuration Changes
```bash
cd /tmp/test-copy

# Update package.json
sed -i 's/"lisa-tests"/"my-app-tests"/' package.json

# Update playwright.config.js
sed -i 's/localhost:3000/localhost:8080/' playwright.config.js

# Run setup
./Scripts/setup.sh
```

Checks:
- [ ] Setup completes after changes
- [ ] Tests can still run
- [ ] Configuration changes applied

## ✅ Final Verification

### Run Complete Test Suite
```bash
cd Tests
npm test
```

Final checks:
- [ ] All GUI tests run
- [ ] All API tests run
- [ ] Results generated
- [ ] Reports accessible
- [ ] Overall status is as expected

### Clean Up Test
```bash
# Remove generated files
rm -rf test-results/ node_modules/

# Re-run setup
./Scripts/setup.sh

# Re-run tests
npm test
```

Checks:
- [ ] Can clean and restart successfully
- [ ] Setup works repeatedly
- [ ] Tests reproducible

## 📊 Verification Summary

If all items above are checked:
- ✅ Testing system is fully functional
- ✅ Ready for local development
- ✅ Ready for Docker deployment
- ✅ Ready for CI/CD integration
- ✅ Ready to adapt for other projects

## 🐛 If Something Failed

1. **Check Prerequisites**: Ensure Node.js, npm, Docker installed
2. **Review Logs**: Look at error messages carefully
3. **Check README.md**: Review troubleshooting section
4. **Verify Paths**: Ensure working in correct directory
5. **Clean Install**: Remove `node_modules/`, reinstall
6. **Check Permissions**: Ensure scripts are executable
7. **Test Internet**: Some downloads require connectivity

## 📝 Notes

- This checklist can be run partially (e.g., skip Docker if not needed)
- Some tests may legitimately fail if services not running
- Docker tests optional for basic functionality
- Windows container tests require specific Windows configuration

---

**Verification Date:** _______________

**Verified By:** _______________

**Result:** ⬜ Pass ⬜ Fail ⬜ Partial

**Notes:** _______________________________________________
