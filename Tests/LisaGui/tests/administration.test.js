// Administration - Roles / Users / Groups.
//
// The whole area belongs to ImtCore, not to Lisa (imtauthgui/AdministrationView.qml and the three
// collection views it hosts), so what is worth covering here is that Lisa actually wires it up and
// that each subpage's collection and editor work in this app: Lisa declares the page in
// Pages.acc's AdministrationPermissions, and nothing else app-specific.
//
// Each subpage is gated independently of the others, so whether one is reachable is asked of the
// sidebar the client rendered rather than assumed.
//
// READ-ONLY, deliberately: nothing here saves. Roles, users and groups live in the PUMA database,
// which is shared with every other app on this machine and is not Lisa's to write into - and a saved
// role or group is also state every other worker of this suite then sees, since they are all signed
// in as the same user. Editors are opened and filled, and left unsaved; what Save does to a role or a
// group belongs to a suite that owns that database.

const { test, newUserPage } = require('../fixtures/test');
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
const { refuse } = require('../fixtures/refuse');
const { waitForTable, documentTabMasks } = require('../pages/settledCollection');

// Marker for every row this suite creates, so a fixture row and a test row are never confused.
//
// A CONSTANT, not a timestamp. It is typed into fields that are then screenshotted, so anything
// varying per run lands in the baseline and every later run fails on those few pixels - which is
// exactly what happened while this was Date.now(): the shots only ever 'passed' in the same run that
// rewrote them. Reruns cannot collide on it either, because Run-CiTests.ps1 restores both databases
// before every run.
const RUN_ID = 'GuiTest';

// The fixture group the Groups screenshot is narrowed to - see the note at that test.
const GROUP_FIXTURE = 'All Partners';

/** Land on an Administration subpage. Not being able to is a failure - see fixtures/refuse.js. */
async function openSubPage(admin, pageId) {
  if (!(await admin.isAvailable())) refuse('the Administration page is not in the menu');
  await admin.open();
  if (!(await admin.hasSubPage(pageId))) {
    refuse(`the ${pageId} subpage is not in the Administration sidebar`);
  }
  await admin.openSubPage(pageId);
}

test.describe('Administration', () => {
  // One context, and therefore one Qt/WASM boot, for every block below except 'cold load'. Each used
  // to take its own, which cost more than the tests inside it. The blocks stay separate - a
  // describe.serial stops at its first failure, and these are four independent stories - but they no
  // longer each pay twelve seconds to bring an app up. Every editor block already ends by discarding
  // the document it opened, and openSubPage() navigates through gui.openPage, which closes leftover
  // document tabs, so each block still starts from the collection it asked for.
  let page, admin;

  test.beforeAll(async ({ browser }, testInfo) => {
    ({ page } = await newUserPage(browser, testInfo));
    admin = new AdministrationPage(page);
    // newUserPage() only opens a blank page - this is the one navigation that boots the app.
    await admin.reload();
  });

  test.afterAll(async () => {
    if (page) await page.context().close();
  });

  // Its own describe, and the only one still on the per-test `page` fixture: a cold load is what it
  // tests, so it has to arrive on a page nothing has visited.
  test.describe('cold load', () => {
    test.beforeEach(async ({ page }) => {
      await new AdministrationPage(page).reload();
    });

    test('landing', async ({ page, gui: g }) => {
      const admin = new AdministrationPage(page);
      if (!(await admin.isAvailable())) refuse('the Administration page is not in the menu');
      await admin.open();
      await admin.expectLoaded();
      // The view container renders long before the subpage inside it does, so the table is what says
      // the landing has actually finished arriving. On a cold load the agent sometimes never gets
      // there - two TableHeaders in the DOM and neither visible - so give the view one reload before
      // asserting. waitForTable never throws; the assertion below still owns the failure message.
      await waitForTable(
        page,
        async () => {
          await admin.reload();
          await admin.open();
          await admin.expectLoaded();
        },
        ['TableHeaders', 'roleName']
      );
      await g.expectVisible(page, ['TableHeaders', 'roleName'], 'the roles table should render');
      await g.checkScreenshot(page, 'administration-landing');
    });
  });

  test.describe.serial('subpages', () => {
    test.beforeAll(async () => {
      if (!(await admin.isAvailable())) refuse('the Administration page is not in the menu');
      await admin.open();
    });

    test('Roles subpage opens', async () => {
      if (!(await admin.hasSubPage('Roles'))) refuse('the Roles subpage is not in the Administration sidebar');
      await admin.openSubPage('Roles');
      await gui.expectVisible(page, ['TableHeaders', 'roleName'], 'the roles table should render');
      await gui.checkScreenshot(page, 'administration-roles-subpage');
    });

    test('Users subpage opens', async () => {
      if (!(await admin.hasSubPage('Users'))) refuse('the Users subpage is not in the Administration sidebar');
      await admin.openSubPage('Users');
      await gui.checkScreenshot(page, 'administration-users-subpage');
    });

    test('Groups subpage opens', async () => {
      if (!(await admin.hasSubPage('Groups'))) refuse('the Groups subpage is not in the Administration sidebar');
      await admin.openSubPage('Groups');
      // Filtered to one fixture group rather than shot whole: this table's headers carry no objectName,
      // so there is no way to pin a sort on it, and the server returns the rows in no guaranteed order.
      const groups = new GroupCollectionPage(page);
      await groups.clearAllFilters();
      await groups.search(GROUP_FIXTURE);
      if ((await groups.table.visibleRowCount()) !== 1) {
        throw new Error(`the fixture group "${GROUP_FIXTURE}" should match exactly one row - the backup or the search is wrong`);
      }
      await gui.checkScreenshot(page, 'administration-groups-subpage');
    });

    test('a subpage collection filters like any other', async () => {
      if (!(await admin.hasSubPage('Roles'))) refuse('the Roles subpage is not in the Administration sidebar');
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
  // with another spec's tabs - and each one still closes what it opened, which is what lets them
  // share the file's page.
  test.describe.serial('role editor', () => {
    test.beforeAll(async () => {
      await openSubPage(admin, 'Roles');
    });

    test('New opens an empty role editor', async () => {
      await new RoleCollectionPage(page).newItem();
      await gui.expectVisible(page, ['RoleNameInput'], 'the role editor should open');
      await gui.checkScreenshot(page, 'role-editor-new-empty', await documentTabMasks(page));
    });

    test('filling the role editor derives its id', async () => {
      const editor = new RoleEditorPage(page);
      await editor.setRoleName(`${RUN_ID} Role`);
      await editor.setDescription('Created by the Lisa GUI suite');
      await gui.checkScreenshot(page, 'role-editor-new-filled');
    });

    // Left unsaved, like the user editor below: closing a dirty tab asks first, No discards. That is
    // also the last word this block has on the document it opened, so nothing is left behind.
    test('closing the unsaved role discards it', async () => {
      await new RoleEditorPage(page).closeDocument();
      await gui.expectVisible(page, ['Dialog'], 'closing a dirty document should ask first');
      await gui.clickButton(page, ['NoButton']);
      await gui.expectHidden(page, ['Dialog'], 'the confirm should close');
    });
  });

  test.describe.serial('user editor', () => {
    test.beforeAll(async () => {
      await openSubPage(admin, 'Users');
    });

    test('New opens an empty user editor', async () => {
      await new UserCollectionPage(page).newItem();
      await gui.expectVisible(page, ['UsernameInput'], 'the user editor should open');
      await gui.checkScreenshot(page, 'user-editor-new-empty', await documentTabMasks(page));
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
    test.beforeAll(async () => {
      await openSubPage(admin, 'Groups');
    });

    test('New opens an empty group editor', async () => {
      await new GroupCollectionPage(page).newItem();
      // Guarded, and not only so the editor is on screen: a brand-new document is marked dirty by a
      // message that arrives AFTER the DOM goes quiet, so a shot taken the moment the tab appears
      // catches the tab without its "*" and the toolbar without an enabled Save - caught live as a
      // 496-pixel diff. Waiting for Save to light up waits for that message.
      await gui.expectVisible(page, ['GroupNameInput'], 'the group editor should open');
      await gui.expectVisible(page, ['CommandsView', 'SaveButton'], 'a new document is dirty, so Save should be offered');
      await gui.checkScreenshot(page, 'group-editor-new-empty', await documentTabMasks(page));
    });

    test('filling the General page', async () => {
      const editor = new GroupEditorPage(page);
      await editor.setName(`${RUN_ID} Group`);
      await gui.checkScreenshot(page, 'group-editor-new-filled');
    });

    test('closing the unsaved group discards it', async () => {
      await new GroupEditorPage(page).closeDocument();
      await gui.expectVisible(page, ['Dialog'], 'closing a dirty document should ask first');
      await gui.clickButton(page, ['NoButton']);
      await gui.expectHidden(page, ['Dialog'], 'the confirm should close');
    });
  });
});
