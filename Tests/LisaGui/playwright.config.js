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
  workers: 1,
});
