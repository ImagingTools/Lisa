// Lisa's GUI suite config. Everything that is the same for every Imt-based app lives in the kit's
// createGuiConfig (per-user snapshot dirs, timeouts, reporters, per-phase output dirs, projects); this
// file only carries what is genuinely Lisa's.

const { createGuiConfig } = require('imtcore-gui-testkit/playwrightConfig/createConfig');
const users = require('./fixtures/users');

module.exports = createGuiConfig({
  rootDir: __dirname,
  // LisaServerTest.acc's DefaultHttpPort. The bare root 301-redirects to the web client's index.html,
  // which Playwright follows, so the port alone is the right base URL.
  baseUrl: process.env.LISA_BASE_URL || 'http://localhost:17776',
  users,
  globalSetup: require.resolve('./global-setup.js'),
  mutatingUserKeys: ['su'],
  // Double the kit default. A cold collection on the build agent sometimes comes up with no rows,
  // and settledCollection then reloads the view: ~8s of looking, ~12s of Qt/WASM boot, another 15s,
  // and checkScreenshot still wants up to 20s of DOM quiet after that. At 60s the agent hit exactly
  // that wall - the table did appear, and the test died in waitForStable with nothing left. Set here
  // rather than per test because the landing tests that need it live in the kit's collectionSpec.
  // A run that needs no reload is unaffected: this is a ceiling, not a delay.
  timeout: 120_000
});
