// Administration - Roles / Users / Groups.
//
// The whole area belongs to ImtCore, not to Lisa (imtauthgui/AdministrationView.qml and the three
// collection views it hosts), so what is worth covering here is that Lisa actually wires it up and
// that each subpage's collection and editor work in this app: Lisa declares the page in
// Pages.acc's AdministrationPermissions, and nothing else app-specific.
//
// Each subpage is gated independently of the others, so whether one is reachable is asked of the
// sidebar the client rendered rather than assumed.

const { test, expect, newUserPage } = require('../fixtures/test');
const {
  AdministrationPage,
  RoleCollectionPage,
  RoleEditorPage,
  UserCollectionPage,
  UserEditorPage,
  GroupCollectionPage,
  GroupEditorPage,
} = require('../pages');
const gui = require('imtcore-gui-testkit/lib/gui');

// Marker for every row this suite creates, so a fixture row and a test row are never confused.
//
// A CONSTANT, not a timestamp. It is typed into fields that are then screenshotted, so anything
// varying per run lands in the baseline and every later run fails on those few pixels - which is
// exactly what happened while this was Date.now(): the shots only ever 'passed' in the same run that
// rewrote them. Reruns cannot collide on it either, because Run-CiTests.ps1 restores both databases
// before every run.
const RUN_ID = 'GuiTest';

/** Land on an Administration subpage, or report that this user cannot reach it. */
async function openSubPage(admin, pageId) {
  if (!(await admin.isAvailable())) return false;
  await admin.open();
  if (!(await admin.hasSubPage(pageId))) return false;
  await admin.openSubPage(pageId);
  return true;
}

test.describe('Administration', () => {
  // Its own describe so the reload does not also fire for the shared-page blocks below: an outer
  // beforeEach runs for nested describes too, booting a whole app instance per nested test that
  // nothing then uses.
  test.describe('cold load', () => {
    test.beforeEach(async ({ page }) => {
      await new AdministrationPage(page).reload();
    });

    test('landing', async ({ page, gui: g }) => {
      const admin = new AdministrationPage(page);
      test.skip(!(await admin.isAvailable()), 'Administration is not available to this user');
      await admin.open();
      await admin.expectLoaded();
      await g.checkScreenshot(page, 'administration-landing');
    });
  });

  test.describe.serial('subpages', () => {
    let page, admin, available;

    test.beforeAll(async ({ browser }, testInfo) => {
      ({ page } = await newUserPage(browser, testInfo));
      admin = new AdministrationPage(page);
      // newUserPage() only opens a blank page - nothing has navigated to the app yet.
      await admin.reload();
      available = await admin.isAvailable();
      if (available) await admin.open();
    });

    test.afterAll(async () => {
      if (page) await page.context().close();
    });

    test.beforeEach(() => {
      test.skip(!available, 'Administration is not available to this user');
    });

    test('Roles subpage opens', async () => {
      test.skip(!(await admin.hasSubPage('Roles')), 'Roles is not available to this user');
      await admin.openSubPage('Roles');
      await gui.expectVisible(page, ['TableHeaders', 'roleName'], 'the roles table should render');
      await gui.checkScreenshot(page, 'administration-roles-subpage');
    });

    test('Users subpage opens', async () => {
      test.skip(!(await admin.hasSubPage('Users')), 'Users is not available to this user');
      await admin.openSubPage('Users');
      await gui.checkScreenshot(page, 'administration-users-subpage');
    });

    test('Groups subpage opens', async () => {
      test.skip(!(await admin.hasSubPage('Groups')), 'Groups is not available to this user');
      await admin.openSubPage('Groups');
      await gui.checkScreenshot(page, 'administration-groups-subpage');
    });

    test('a subpage collection filters like any other', async () => {
      test.skip(!(await admin.hasSubPage('Roles')), 'Roles is not available to this user');
      await admin.openSubPage('Roles');
      const roles = new RoleCollectionPage(page);
      await roles.search('su');
      await gui.checkScreenshot(page, 'administration-roles-filtered');
      await roles.clearAllFilters();
    });
  });

  // --- editors ------------------------------------------------------------------------------------
  //
  // These open DOCUMENT TABS, whose workspace the server keys per user. With one fixture user the
  // whole suite already runs on a single worker (see playwright.config.js), so they cannot collide
  // with another spec's tabs - but they still get their own block and their own page, and each one
  // closes what it opened.
  test.describe.serial('role editor', () => {
    let page, admin, available;

    test.beforeAll(async ({ browser }, testInfo) => {
      ({ page } = await newUserPage(browser, testInfo));
      admin = new AdministrationPage(page);
      await admin.reload();
      available = await openSubPage(admin, 'Roles');
    });

    test.afterAll(async () => {
      if (page) await page.context().close();
    });

    test.beforeEach(() => {
      test.skip(!available, 'Roles is not available to this user');
    });

    test('New opens an empty role editor', async () => {
      await new RoleCollectionPage(page).newItem();
      await gui.expectVisible(page, ['RoleNameInput'], 'the role editor should open');
      await gui.checkScreenshot(page, 'role-editor-new-empty');
    });

    test('filling the role editor derives its id', async () => {
      const editor = new RoleEditorPage(page);
      await editor.setRoleName(`${RUN_ID} Role`);
      await editor.setDescription('Created by the Lisa GUI suite');
      await gui.checkScreenshot(page, 'role-editor-new-filled');
    });

    // Self-contained, because the two phases run as separate Playwright invocations: in phase 2 the
    // two tests above are filtered out, so this one opens the editor and fills it itself.
    test('save the new role', { tag: '@mutating' }, async () => {
      const editor = new RoleEditorPage(page);
      if (!(await gui.dom.isVisible(page, ['RoleNameInput']))) await new RoleCollectionPage(page).newItem();
      await editor.setRoleName(`${RUN_ID} Role`);
      await editor.setDescription('Created by the Lisa GUI suite');
      await editor.save();
      await gui.checkScreenshot(page, 'role-editor-new-saved');
    });

    test('the saved role is in the collection', { tag: '@mutating' }, async () => {
      await new RoleEditorPage(page).closeDocument();
      const roles = new RoleCollectionPage(page);
      await roles.search(RUN_ID);
      expect(await roles.table.visibleRowCount(), 'the role just saved should be findable').toBeGreaterThan(0);
      await gui.checkScreenshot(page, 'role-editor-new-in-collection');
      await roles.clearAllFilters();
    });
  });

  test.describe.serial('user editor', () => {
    let page, admin, available;

    test.beforeAll(async ({ browser }, testInfo) => {
      ({ page } = await newUserPage(browser, testInfo));
      admin = new AdministrationPage(page);
      await admin.reload();
      available = await openSubPage(admin, 'Users');
    });

    test.afterAll(async () => {
      if (page) await page.context().close();
    });

    test.beforeEach(() => {
      test.skip(!available, 'Users is not available to this user');
    });

    test('New opens an empty user editor', async () => {
      await new UserCollectionPage(page).newItem();
      await gui.expectVisible(page, ['UsernameInput'], 'the user editor should open');
      await gui.checkScreenshot(page, 'user-editor-new-empty');
    });

    test('filling the General page', async () => {
      const editor = new UserEditorPage(page);
      await editor.setUsername(`${RUN_ID.toLowerCase()}_user`);
      await editor.setName(`${RUN_ID} User`);
      await editor.setEmail(`${RUN_ID.toLowerCase()}@lisagui.test`);
      await gui.checkScreenshot(page, 'user-editor-new-general-filled');
    });

    // Left unsaved on purpose: creating a user is a real account in the shared Puma database, and
    // nothing in this suite needs one. Closing a dirty tab asks first; No discards.
    test('closing the unsaved user discards it', async () => {
      await new UserEditorPage(page).closeDocument();
      await gui.expectVisible(page, ['Dialog'], 'closing a dirty document should ask first');
      await gui.clickButton(page, ['NoButton']);
      await gui.expectHidden(page, ['Dialog'], 'the confirm should close');
    });
  });

  test.describe.serial('group editor', () => {
    let page, admin, available;

    test.beforeAll(async ({ browser }, testInfo) => {
      ({ page } = await newUserPage(browser, testInfo));
      admin = new AdministrationPage(page);
      await admin.reload();
      available = await openSubPage(admin, 'Groups');
    });

    test.afterAll(async () => {
      if (page) await page.context().close();
    });

    test.beforeEach(() => {
      test.skip(!available, 'Groups is not available to this user');
    });

    test('New opens an empty group editor', async () => {
      await new GroupCollectionPage(page).newItem();
      await gui.checkScreenshot(page, 'group-editor-new-empty');
    });

    // Opens the editor itself when it is not already open - see the note on the role save above: in
    // phase 2 the test that opens it is filtered out, so this one cannot lean on it.
    test('filling and saving a group', { tag: '@mutating' }, async () => {
      const editor = new GroupEditorPage(page);
      if (!(await gui.dom.isVisible(page, ['GroupNameInput']))) await new GroupCollectionPage(page).newItem();
      await editor.setName(`${RUN_ID} Group`);
      await gui.checkScreenshot(page, 'group-editor-new-filled');
      await editor.save();
      await gui.checkScreenshot(page, 'group-editor-new-saved');
    });
  });
});
