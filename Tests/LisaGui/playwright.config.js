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

  // Four workers, even though every spec runs as the same single fixture user (`su`).
  //
  // ProLife pins one worker per user because ITS server keys the open-documents workspace by userId
  // and fans every open/close out to all of that user's live sessions, so two workers as one user
  // corrupt each other's document tabs. Lisa measurably does not behave that way: driving two
  // concurrent `su` sessions, a filter set in one did not reach the other (1 row against 25), closing
  // every document tab in one left the other's editor tab and its fields untouched, and a reload
  // restored no tabs at all. Tabs and view state here are per SESSION, so the collision that forces
  // ProLife's hand does not exist.
  //
  // Measured on this suite: the read-only phase takes ~250s at four workers against ~540s at one, with
  // the same three (known-defect) failures either way. The @mutating phase stays serial regardless -
  // Run-CiTests.ps1 appends --workers=1 to it - because those tests share one database.
  workers: 4,
});
