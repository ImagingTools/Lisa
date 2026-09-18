// Single source of truth for the Lisa GUI test users.
//
// Consumed by:
//   - playwright.config.js  -> one Playwright *project* per user (each with its own storageState)
//   - global-setup.js       -> UI-logs-in each active user and mints its storageState
//   - fixtures/test.js      -> exposes the current user (resolved from the project name) to tests
//
// Only the bootstrap superuser for now. `su` bypasses permission checks server-side and is therefore
// sent an EMPTY permission list, indistinguishable from a user granted nothing - `permissions: ['*']`
// is what tells the two apart, and defineUsers refuses a superuser without it (otherwise every
// permission-gated test in the suite would silently skip for it and the run would go green).
//
// Adding a restricted user later is a matter of listing it here with `seed: true` plus the codes its
// role should be granted (Lisa's own permission ids live in Lisa/Partitura/LisaVoce.arp - ViewFeatures/
// EditFeature, ViewProducts/EditProduct, ViewLicensesDefinition/EditLicenseDefinition, ...) and
// seeding it into the restored test database. Doing so is also what would let this suite run on more
// than one worker again - see the note in playwright.config.js.

const { defineUsers } = require('imtcore-gui-testkit/fixtures/defineUsers');

module.exports = defineUsers({
  users: [
    {
      key: 'su',
      title: 'Superuser',
      login: 'su',
      // Pre-existing superuser: baked into Tests/Resources/backups/puma.backup, and bootstrapped via
      // the CreateSuperuser mutation by Run-CiTests.ps1 as a safety net. Run-CiTests.ps1 exports its
      // -SuPassword as LISA_GUI_SU_PASSWORD so the GUI login uses the very password it bootstrapped
      // with; '1' is the default both sides agree on.
      password: process.env.LISA_GUI_SU_PASSWORD || '1',
      seed: false,
      permissions: ['*'],
    },
  ],
  allUsersEnv: 'LISA_GUI_ALL_USERS',
});
