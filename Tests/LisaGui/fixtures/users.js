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

// Everything a seeded fixture user needs to exercise the whole suite, exactly as the SERVER names it:
// this is GetProductPermissions(productId: "Lisa"), group by group. Do not assemble it by grepping the
// QML or the .acc files - "EditFeature" appears in Pages.acc's PagePermissions but is not a permission
// the server knows, and a role granted it simply never gets the New command, with no error anywhere.
// seed.js validates this list against the live product tree, so a stale id fails the run instead.
const FULL_ACCESS = [
  // FeatureManagement
  'ViewFeatures', 'AddFeature', 'ChangeFeature', 'RemoveFeature',
  // ProductManagement
  'ViewProducts', 'AddProduct', 'ChangeProduct', 'RemoveProduct',
  // LicenseDefinitionManagement
  'ViewLicensesDefinition', 'AddLicenseDefinition', 'ChangeLicenseDefinition', 'RemoveLicenseDefinition',
  // Administration
  'ViewUsers', 'AddUser', 'ChangeUser', 'RemoveUser', 'ViewUserHistory',
  'ViewRoles', 'AddRole', 'ChangeRole', 'RemoveRole', 'ViewRoleHistory',
  'ViewGroups', 'AddGroup', 'ChangeGroup', 'RemoveGroup', 'ViewGroupHistory',
  // RevisionManagement
  'ViewRevisions', 'ExportRevision', 'DeleteRevision', 'BackupRevision', 'RestoreRevision',
  // WorkspaceManagement
  'ViewWorkspace', 'ViewUserActions', 'ViewAllUserActions',
];

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
      // Managing user accounts needs the superuser: as a seeded user granted every Lisa permission, the
      // user editor still drops its edits (no undo step, never dirty, closes without asking).
      isolatedSpec: 'administration.test.js',
    },
    // One spec file, one user. Playwright runs different FILES on different workers (fullyParallel is
    // off, so a file is never split), but the server keeps a document workspace PER USER - so two spec
    // files driving tabs as the same user at the same time close each other's documents. Measured on
    // this suite: two workers over two spec files took 14.3 minutes against 2.9 on one, with tests
    // going from 3s to 1.1min while the server sat at zero CPU, waiting. `isolatedSpec` pins this user
    // to exactly one file (see the kit's buildProjects.js) and excludes that file from every other
    // project. Permissions are the FULL set on purpose: a missing one makes its tests skip green
    // instead of fail, and the per-user permission matrix is not what these specs are for.
    {
      key: 'featuresEditor',
      title: 'Features Editor (isolated)',
      login: 'lisagui_featureseditor',
      password: process.env.LISA_GUI_FIXTURE_PASSWORD || '1',
      seed: true,
      roleName: 'LisaGui Features Editor',
      roleId: 'LisaGuiFeaturesEditor',
      permissions: FULL_ACCESS,
      isolatedSpec: 'features.editor.test.js',
    },
    {
      key: 'featuresCollection',
      title: 'Features Collection (isolated)',
      login: 'lisagui_featurescollection',
      password: process.env.LISA_GUI_FIXTURE_PASSWORD || '1',
      seed: true,
      roleName: 'LisaGui Features Collection',
      roleId: 'LisaGuiFeaturesCollection',
      permissions: FULL_ACCESS,
      isolatedSpec: 'features.collection.test.js',
    },
    {
      key: 'licensesCollection',
      title: 'Licenses Collection (isolated)',
      login: 'lisagui_licensescollection',
      password: process.env.LISA_GUI_FIXTURE_PASSWORD || '1',
      seed: true,
      roleName: 'LisaGui Licenses Collection',
      roleId: 'LisaGuiLicensesCollection',
      permissions: FULL_ACCESS,
      isolatedSpec: 'licenses.collection.test.js',
    },
    {
      key: 'licensesEditor',
      title: 'Licenses Editor (isolated)',
      login: 'lisagui_licenseseditor',
      password: process.env.LISA_GUI_FIXTURE_PASSWORD || '1',
      seed: true,
      roleName: 'LisaGui Licenses Editor',
      roleId: 'LisaGuiLicensesEditor',
      permissions: FULL_ACCESS,
      isolatedSpec: 'licenses.editor.test.js',
    },
    {
      key: 'productsCollection',
      title: 'Products Collection (isolated)',
      login: 'lisagui_productscollection',
      password: process.env.LISA_GUI_FIXTURE_PASSWORD || '1',
      seed: true,
      roleName: 'LisaGui Products Collection',
      roleId: 'LisaGuiProductsCollection',
      permissions: FULL_ACCESS,
      isolatedSpec: 'products.collection.test.js',
    },
    {
      key: 'productsEditor',
      title: 'Products Editor (isolated)',
      login: 'lisagui_productseditor',
      password: process.env.LISA_GUI_FIXTURE_PASSWORD || '1',
      seed: true,
      roleName: 'LisaGui Products Editor',
      roleId: 'LisaGuiProductsEditor',
      permissions: FULL_ACCESS,
      isolatedSpec: 'products.editor.test.js',
    },
    {
      key: 'search',
      title: 'Search (isolated)',
      login: 'lisagui_search',
      password: process.env.LISA_GUI_FIXTURE_PASSWORD || '1',
      seed: true,
      roleName: 'LisaGui Search',
      roleId: 'LisaGuiSearch',
      permissions: FULL_ACCESS,
      isolatedSpec: 'search.test.js',
    },
    {
      key: 'userProfile',
      title: 'User Profile (isolated)',
      login: 'lisagui_userprofile',
      password: process.env.LISA_GUI_FIXTURE_PASSWORD || '1',
      seed: true,
      roleName: 'LisaGui User Profile',
      roleId: 'LisaGuiUserProfile',
      permissions: FULL_ACCESS,
      isolatedSpec: 'user-profile.test.js',
    },
    {
      key: 'workspace',
      title: 'Workspace (isolated)',
      login: 'lisagui_workspace',
      password: process.env.LISA_GUI_FIXTURE_PASSWORD || '1',
      seed: true,
      roleName: 'LisaGui Workspace',
      roleId: 'LisaGuiWorkspace',
      permissions: FULL_ACCESS,
      isolatedSpec: 'workspace.test.js',
    },
  ],
  allUsersEnv: 'LISA_GUI_ALL_USERS',
});
