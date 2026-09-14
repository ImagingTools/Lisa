// Global setup: produce one storageState per ACTIVE fixture user by logging in - nothing gets CREATED
// here. The superuser is bootstrapped by Run-CiTests.ps1 (CreateSuperuser) against the restored
// puma_test database before Playwright ever starts.
//
// The login/retry/token-wait machinery is generic (imtcore-gui-testkit); this file just wires it to
// Lisa's own fixtures/users.js and base URL.

const { createGlobalSetup } = require('imtcore-gui-testkit/globalSetup/createGlobalSetup');
const { activeUsers, authFile } = require('./fixtures/users');

module.exports = createGlobalSetup({
  activeUsers,
  authFile,
  rootDir: __dirname,
  baseUrl: process.env.LISA_BASE_URL || 'http://localhost:17776',
  // Run-CiTests.ps1 invokes "npx playwright test" twice per run (read-only phase, then @mutating
  // phase) against the SAME still-running server - set for the second invocation only, once the first
  // has already produced fresh storageState moments ago.
  reuseExistingAuth: process.env.LISA_GUI_REUSE_AUTH === '1',
});
