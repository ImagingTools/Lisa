# Quick Start Guide - Lisa Testing System

## 🚀 1-Minute Quick Start

```bash
cd Tests
./Scripts/setup.sh      # Install everything
npm test                # Run all tests
```

## 📁 What's Included

```
Tests/
├── GUI/                     # Playwright tests (browser automation)
├── API/                     # Newman tests (API/Postman)
├── Docker/                  # Docker configs (Linux + Windows)
├── Scripts/                 # Utility scripts
├── Examples/                # CI/CD examples
└── README.md                # Full documentation
```

## 🎯 Most Common Commands

### Local Testing
```bash
npm test               # All tests
npm run test:gui       # GUI only
npm run test:api       # API only
npm run test:gui:debug # Debug mode
```

### Docker Testing
```bash
# Linux
./Scripts/run-docker-tests-linux.sh build-and-run

# Windows
Scripts\run-docker-tests-windows.bat build-and-run
```

## 🔧 Adapt for Your App (5 Minutes)

### Step 1: Copy to your project
```bash
cp -r Lisa/Tests YourApp/Tests
```

### Step 2: Update 3 files
1. **package.json** - Change name/description
2. **playwright.config.js** - Line 52: Change baseURL
3. **API/environments/...json** - Change BASE_URL

### Step 3: Add your tests
- GUI: Replace `GUI/example.spec.js`
- API: Export Postman collection to `API/collections/`

### Step 4: Run
```bash
cd Tests
./Scripts/setup.sh
npm test
```

Done! ✅

## 📖 Full Documentation

- **README.md** - Complete guide with troubleshooting
- **ADAPTATION_GUIDE.md** - Detailed migration instructions
- **Examples/CI-CD/** - GitHub Actions, GitLab CI, Jenkins

## 🆘 Help

### Tests not running?
```bash
# Check setup
node --version    # Need 18+
npm --version     # Need 9+

# Reinstall
cd Tests
rm -rf node_modules
npm install
npx playwright install --with-deps
```

### Docker not working?
```bash
# Check Docker
docker --version
docker-compose --version

# Rebuild
docker build -f Docker/Dockerfile.linux -t lisa-tests:linux .
```

## ✨ Key Features

- ✅ Multi-browser testing (Chrome, Firefox, Safari)
- ✅ API testing with Newman/Postman
- ✅ Docker support (Linux & Windows)
- ✅ CI/CD ready (GitHub, GitLab, Jenkins)
- ✅ Screenshots & videos on failure
- ✅ Parallel test execution
- ✅ Mobile viewport testing
- ✅ Generic & reusable for any app

## 🎓 Learn More

1. Read **README.md** for comprehensive guide
2. Read **ADAPTATION_GUIDE.md** for migration details
3. Check **Examples/CI-CD/** for pipeline examples
4. See Playwright docs: https://playwright.dev/
5. See Newman docs: https://learning.postman.com/docs/running-collections/using-newman-cli/

---

**Need help?** Check the Troubleshooting section in README.md
