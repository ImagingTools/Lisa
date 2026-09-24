// Global setup: create the seeded fixture users, then produce one storageState per ACTIVE user by
// logging in.
//
// The kit's createGlobalSetup only LOGS users in - it says so itself, and deliberately: fixture users
// are expected to already exist. ProLife meets that by baking them into a derived database backup;
// Lisa creates them here instead (see fixtures/seed.js), which leaves the backup alone at the cost of
// a couple of requests. Run-CiTests.ps1 restores puma_test before every run, so they are always made
// fresh, and seeding runs BEFORE the kit's logins because those logins are what mints their tokens.

const { request } = require('@playwright/test');
const { createGlobalSetup } = require('imtcore-gui-testkit/globalSetup/createGlobalSetup');
const { activeUsers, authFile, byKey } = require('./fixtures/users');
const { seedUsers, authorizeSu } = require('./fixtures/seed');

const baseUrl = process.env.LISA_BASE_URL || 'http://localhost:17776';
const reuseExistingAuth = process.env.LISA_GUI_REUSE_AUTH === '1';

const login = createGlobalSetup({
  activeUsers,
  authFile,
  rootDir: __dirname,
  baseUrl,
  // Run-CiTests.ps1 invokes "npx playwright test" twice per run (read-only phase, then @mutating
  // phase) against the SAME still-running server - set for the second invocation only, once the first
  // has already produced fresh storageState moments ago.
  reuseExistingAuth,
});

module.exports = async (config) => {
  if (!reuseExistingAuth && activeUsers().some((u) => u.seed)) {
    const su = byKey('su');
    const api = await request.newContext();
    try {
      const token = await authorizeSu(api, baseUrl, su.login, su.password);
      await seedUsers(api, baseUrl, token);
    } finally {
      await api.dispose();
    }
  }
  return login(config);
};
