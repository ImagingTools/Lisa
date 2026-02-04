# How to Adapt This Testing System for Your Application

This guide explains how to copy and adapt the Lisa testing system for your own application.

## Quick Start (5-Minute Setup)

### Step 1: Copy the Tests Directory

```bash
# From your project root
cp -r /path/to/Lisa/Tests ./Tests
cd Tests
```

### Step 2: Update package.json

Edit `package.json`:

```json
{
  "name": "your-app-tests",  // Change this
  "description": "Testing system for YourApp...",  // Change this
  "author": "Your Name",  // Change this
  // Keep everything else the same
}
```

### Step 3: Configure Your Application URL

Edit `playwright.config.js` (line 52):

```javascript
baseURL: process.env.BASE_URL || 'http://localhost:YOUR_PORT',
```

Edit `API/environments/example.postman_environment.json`:

```json
{
  "key": "BASE_URL",
  "value": "http://localhost:YOUR_PORT"
}
```

### Step 4: Add Your Tests

#### For GUI Tests:
Replace or modify `GUI/example.spec.js` with your own tests.

#### For API Tests:
1. Export your Postman collection and environment
2. Place them in `API/collections/` and `API/environments/`
3. Update `package.json` scripts to use your files

### Step 5: Run Setup

```bash
./Scripts/setup.sh  # Linux/macOS
# or
Scripts\setup.bat   # Windows
```

### Step 6: Run Tests

```bash
npm test
```

That's it! 🎉

## Detailed Adaptation Guide

### File Checklist

Files you **MUST** modify:
- [ ] `package.json` - Update name, description, author
- [ ] `playwright.config.js` - Update baseURL
- [ ] `API/environments/example.postman_environment.json` - Update BASE_URL
- [ ] `GUI/example.spec.js` - Replace with your tests

Files you **MAY** modify (optional):
- [ ] `Docker/docker-compose.*.yml` - Add your application service
- [ ] `Docker/Dockerfile.*` - Add custom dependencies
- [ ] `README.md` - Update for your application

Files you **SHOULD NOT** modify:
- ✓ `Scripts/*.sh` and `Scripts/*.bat` - These are generic
- ✓ `playwright.config.js` - Only change baseURL
- ✓ `.gitignore` - Already configured properly

## Common Scenarios

### Scenario 1: Simple Web Application

**Your app**: React/Vue/Angular app running on port 3000

**Changes needed**:
1. Update baseURL in `playwright.config.js` to `http://localhost:3000`
2. Add your GUI tests to `GUI/` directory
3. If you have an API, export Postman collection and place in `API/collections/`

**Docker setup** (optional):
```yaml
# Add to docker-compose.linux.yml
services:
  app:
    image: your-app:latest
    ports:
      - "3000:3000"
  
  tests:
    depends_on:
      - app
    environment:
      - BASE_URL=http://app:3000
```

### Scenario 2: API-Only Application (No GUI)

**Your app**: Express/FastAPI/Flask API on port 8080

**Changes needed**:
1. Export your API tests from Postman
2. Place collection in `API/collections/`
3. Update `package.json`:
   ```json
   "scripts": {
     "test": "npm run test:api",
     "test:api": "newman run API/collections/your-api.postman_collection.json ..."
   }
   ```
4. Remove GUI tests if not needed (optional)

### Scenario 3: Desktop Application with API

**Your app**: Electron/Qt app with backend API

**Changes needed**:
1. For GUI tests: Set up test environment for your desktop app
2. For API tests: Export Postman collection
3. Update baseURL to point to your API endpoint
4. May need to start your app before running tests:
   ```javascript
   // In playwright.config.js
   webServer: {
     command: 'npm start',
     url: 'http://localhost:3000',
     reuseExistingServer: !process.env.CI,
   }
   ```

### Scenario 4: Microservices Architecture

**Your app**: Multiple services (auth, api, frontend)

**Changes needed**:
1. Create separate test collections for each service
2. Update `docker-compose.linux.yml`:
   ```yaml
   services:
     auth-service:
       image: your-auth:latest
       ports:
         - "8081:8081"
     
     api-service:
       image: your-api:latest
       ports:
         - "8082:8082"
     
     frontend:
       image: your-frontend:latest
       ports:
         - "3000:3000"
       depends_on:
         - auth-service
         - api-service
     
     tests:
       depends_on:
         - frontend
       environment:
         - BASE_URL=http://frontend:3000
         - API_URL=http://api-service:8082
   ```

3. Update Postman environment with multiple URLs

## Advanced Customization

### Adding Custom npm Packages

If your tests need additional packages:

```json
// In package.json
"devDependencies": {
  "@playwright/test": "^1.40.0",
  "newman": "^6.0.0",
  "your-custom-package": "^1.0.0"  // Add here
}
```

### Adding System Dependencies (Linux Docker)

Edit `Docker/Dockerfile.linux`:

```dockerfile
# After the existing apt-get install
RUN apt-get update && apt-get install -y \
    your-package \
    another-package \
    && rm -rf /var/lib/apt/lists/*
```

### Adding System Dependencies (Windows Docker)

Edit `Docker/Dockerfile.windows`:

```dockerfile
# After the Chocolatey install
RUN choco install -y your-package
```

### Custom Test Configuration

#### Multiple Environments

Create multiple environment files:

```
API/environments/
├── dev.postman_environment.json
├── staging.postman_environment.json
└── production.postman_environment.json
```

Add scripts in `package.json`:

```json
"scripts": {
  "test:api:dev": "newman run API/collections/api.json -e API/environments/dev.json",
  "test:api:staging": "newman run API/collections/api.json -e API/environments/staging.json"
}
```

#### Multiple Test Suites

Organize GUI tests:

```
GUI/
├── auth/
│   ├── login.spec.js
│   └── signup.spec.js
├── dashboard/
│   └── dashboard.spec.js
└── admin/
    └── admin.spec.js
```

Run specific suites:

```bash
# Run only auth tests
npx playwright test GUI/auth

# Run only one test file
npx playwright test GUI/auth/login.spec.js
```

### Database Setup

If your tests need a database:

```yaml
# In docker-compose.linux.yml
services:
  database:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: testpassword
      POSTGRES_DB: testdb
    ports:
      - "5432:5432"
  
  app:
    depends_on:
      - database
    environment:
      DATABASE_URL: postgresql://postgres:testpassword@database:5432/testdb
  
  tests:
    depends_on:
      - app
```

## Migration Checklist

Use this checklist when migrating to a new project:

- [ ] Copy `Tests/` directory to your project
- [ ] Update `package.json` (name, description, author)
- [ ] Update `playwright.config.js` (baseURL)
- [ ] Update API environment file (BASE_URL)
- [ ] Replace `GUI/example.spec.js` with your tests
- [ ] Replace Postman collection with your API tests
- [ ] Update `README.md` with your app-specific info
- [ ] Run `./Scripts/setup.sh` or `Scripts\setup.bat`
- [ ] Test locally: `npm test`
- [ ] Test in Docker: `./Scripts/run-docker-tests-linux.sh`
- [ ] Set up CI/CD (see README.md CI/CD section)
- [ ] Document any custom changes for your team

## Testing Your Setup

After adapting the system:

1. **Verify local tests work**:
   ```bash
   npm test
   ```

2. **Verify Docker tests work**:
   ```bash
   ./Scripts/run-docker-tests-linux.sh build-and-run
   ```

3. **Check test results**:
   ```bash
   # Should see HTML reports
   ls test-results/playwright-report/
   
   # Should see screenshots (if any failures)
   ls test-results/screenshots/
   ```

4. **Verify CI/CD integration** (if applicable):
   - Commit changes
   - Push to repository
   - Check CI/CD pipeline

## Getting Help

If you run into issues:

1. **Check README.md** - Comprehensive troubleshooting section
2. **Check test logs** - `test-results/` directory
3. **Run in debug mode**:
   ```bash
   npm run test:gui:debug  # GUI tests
   npm run test:api:verbose  # API tests
   ```
4. **Check Docker logs**:
   ```bash
   docker-compose -f Docker/docker-compose.linux.yml logs
   ```

## Best Practices

1. **Keep it simple**: Don't modify the core structure unless necessary
2. **Version control**: Commit the entire `Tests/` directory to your repo
3. **Documentation**: Update README.md with app-specific instructions
4. **CI/CD**: Set up automated testing early
5. **Regular updates**: Keep Playwright and Newman updated
6. **Test data**: Use test data that doesn't affect production
7. **Environment variables**: Use `.env` files for sensitive data (add to .gitignore)
8. **Clean up**: Regularly clean test results and Docker images

## Example: Complete Migration for a New Project

```bash
# 1. Copy tests directory
cd ~/my-awesome-app
cp -r ~/Lisa/Tests ./Tests
cd Tests

# 2. Update configuration
# Edit package.json, playwright.config.js, API environment

# 3. Add your tests
# Copy your Postman collection
cp ~/Downloads/my-api.postman_collection.json API/collections/

# Write GUI tests
cat > GUI/homepage.spec.js << 'EOF'
const { test, expect } = require('@playwright/test');

test('homepage loads', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('My Awesome App');
});
EOF

# 4. Setup
./Scripts/setup.sh

# 5. Run tests
npm test

# 6. Commit
git add Tests/
git commit -m "Add testing system"
git push
```

## Summary

The Lisa testing system is designed to be:
- ✅ **Generic**: Works for any web application
- ✅ **Complete**: GUI and API testing included
- ✅ **Portable**: Easy to copy and adapt
- ✅ **Flexible**: Customizable for different architectures
- ✅ **Production-ready**: Docker and CI/CD support included

You should be able to copy the `Tests/` directory to any project and have a working testing system with minimal changes (typically just URLs and test files).
