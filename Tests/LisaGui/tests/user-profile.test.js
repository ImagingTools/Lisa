// The account panel and Logout (ImtCore/Qml/imtauthgui/UserPanel.qml, ProfileView.qml).
//
// The top-right account button is on every page and opens a PopupMenuDialog whose rows are Profile,
// one per organization, and Logout. Profile itself is a modal Dialog hosting the same MultiPageView
// Administration uses, so its subpages are addressable as "Page_<id>".
//
// None of this opens a document tab - it is a plain modal - so the default per-test `page` fixture
// (its own fresh context) is enough, which also means the Logout test cannot affect any other test.
//
// The dialog shots are taken of the DIALOG, not of the page. What sits behind it is a collection
// table whose column layout and open page live on the SERVER, per user - so a test running beside
// this one as the same `su` changes the backdrop, and an identical Profile dialog came back with a
// 21524-pixel diff. The modal is what these tests are about; the table behind it belongs to the
// collection specs.

const { test } = require('../fixtures/test');
const { CollectionPage } = require('../pages');

test.describe('User profile', () => {
  test.beforeEach(async ({ page }) => {
    // Features rather than Workspace: on a freshly restored database Workspace is legitimately empty,
    // and an empty table makes a poor backdrop for screenshots of a modal drawn over it.
    const features = new CollectionPage(page, 'Features');
    await features.reload();
    if (await features.isAvailable()) await features.open();
  });

  // The account menu is a plain PopupMenuDialog bound to a ListModel, not a ComboBox: its default
  // delegate gives rows no text-based objectName, so they are addressed by position. "Profile" is
  // always first; "Logout" is always last, however many organization rows sit between them.
  test('opens and switches between profile tabs', async ({ page, gui }) => {
    await gui.openComboPopup(page, ['UserPanelButton']);
    await gui.clickPopupItemByIndex(page, 0); // Profile
    await gui.expectVisible(page, ['Dialog'], 'Profile must open in a modal dialog');
    await gui.checkElementScreenshot(page, ['Dialog'], 'user-profile-general');

    for (const pageId of ['Organizations', 'AccessTokens', 'Access', 'General']) {
      await gui.click(page, [`Page_${pageId}`], { what: `Profile subpage "${pageId}"` });
    }
    await gui.checkElementScreenshot(page, ['Dialog'], 'user-profile-after-tab-switches');

    await gui.dismissDialog(page);
  });

  // The password card is expanded for real and then collapsed via Cancel, never submitted: a real
  // password change here would break every later test's own login.
  test('the password card expands and collapses without submitting', async ({ page, gui }) => {
    await gui.openComboPopup(page, ['UserPanelButton']);
    await gui.clickPopupItemByIndex(page, 0);
    await gui.expectVisible(page, ['Dialog'], 'Profile must open in a modal dialog');

    await gui.clickButton(page, ['ChangeButton']);
    await gui.expectVisible(page, ['NewPasswordInput'], 'the password card should expand');
    await gui.checkElementScreenshot(page, ['Dialog'], 'user-profile-password-card');

    await gui.clickButton(page, ['CancelButton']);
    await gui.expectHidden(page, ['NewPasswordInput'], 'the password card should collapse after Cancel');
    await gui.dismissDialog(page);
  });

  test('logout returns to the login page', async ({ page, gui }) => {
    await gui.openComboPopup(page, ['UserPanelButton']);
    await gui.clickPopupItemLast(page); // Logout - always the menu's last row
    await gui.expectVisible(page, ['LoginInput'], 'logging out should land back on the login form');
    // The login page is built fresh here, so its decoratorPause is about to move the focus ring - the
    // same race the guest login spec settles, pinned on the same field.
    await gui.settleLoginFocus(page, { field: ['LoginInput'] });
    await gui.checkScreenshot(page, 'user-profile-after-logout');
  });
});
