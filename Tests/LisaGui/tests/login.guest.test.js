// Guest (unauthenticated) login flow - runs ONLY under the `guest` Playwright project.
//
// playwright.config.js gives the guest project no storageState and matches only *.guest.test.js, so
// this is the one spec that exercises the actual AuthorizationPage. Field objectNames (LoginInput /
// PasswordInput / LoginButton) come from ImtCore/Qml/imtauthgui/AuthorizationPage.qml and are the same
// ones global-setup uses to mint the superuser's storageState, so they are known-present.

const { test } = require('../fixtures/test');
const { byKey } = require('../fixtures/users');

// Every shot here goes through gui.settleLoginFocus (imtcore-gui-testkit/lib/actions), which waits
// out AuthorizationPage.qml's decoratorPause - a 500ms PauseAnimation whose onFinished forces focus
// back onto the username field. That animation, not repaint timing, is what made these shots flaky:
// a click on the password field landed before it on a fast run and after it on a slow one, so the
// focus ring showed up under a different field each time (~1272 pixels). Waiting it out first fixes
// the starting point; { field } then puts the ring where the shot expects it.
const PASSWORD_FOCUS = { field: ['PasswordInput'] };
const USERNAME_FOCUS = { field: ['LoginInput'] };

test.describe('Guest / login', () => {
  test.beforeEach(async ({ page, gui }) => {
    await gui.reload(page);
  });

  test('login form is shown', async ({ page, gui }) => {
    await gui.expectVisible(page, ['LoginInput'], 'login field should be visible for a guest');
    await gui.expectVisible(page, ['PasswordInput'], 'password field should be visible for a guest');
    await gui.expectVisible(page, ['LoginButton'], 'sign-in button should be visible for a guest');
    // Username, because that is the field the form focuses itself - the shot is still "the form as it
    // greets a visitor". Clicking it is what makes the ring appear at all: Qt paints it only for a
    // focused window, and a headless page nobody has clicked is not one.
    await gui.settleLoginFocus(page, USERNAME_FOCUS);
    await gui.checkScreenshot(page, 'login-form');
  });

  test('invalid credentials keep the user on the login page', async ({ page, gui }) => {
    await gui.login(page, 'definitely-not-a-user', 'wrong-password');
    await gui.expectVisible(page, ['LoginInput'], 'still on the login page after a failed sign-in');
    await gui.settleLoginFocus(page, PASSWORD_FOCUS);
    await gui.checkScreenshot(page, 'login-invalid');
  });

  test('superuser can sign in', async ({ page, gui }) => {
    const su = byKey('su');
    await gui.login(page, su.login, su.password);
    await gui.expectVisible(page, ['MenuPanel'], 'the app menu should appear after a successful sign-in');
    await gui.checkScreenshot(page, 'login-success');
  });

  // The show/hide toggle is a client-side UI toggle - no submission, no navigation - so it is driven
  // for real. PasswordInput's underlying TextInput renders as a canvas-backed div with no `type`
  // attribute to assert on, so the three screenshots (dots vs plain text) ARE the check.
  //
  // Each one is taken with the password field deliberately focused. The focus ring is drawn by Qt,
  // not by the DOM (activeElement stays on <body> throughout - measured), and the form re-asserts its
  // own initial focus asynchronously after the connection check settles. Left to chance, that lands
  // before the test's click on one run and after it on the next, and the ring shows up under
  // *Username* instead - a 1272-pixel diff that says nothing about masking. Pinning the focus makes
  // all three shots describe the same state: a user standing in the password field.
  test('eye button toggles password visibility', async ({ page, gui }) => {
    await gui.fill(page, ['PasswordInput'], 'SomeSecret123');
    await gui.settleLoginFocus(page, PASSWORD_FOCUS);
    await gui.checkScreenshot(page, 'login-password-masked');

    await gui.clickButton(page, ['EyeButton']);
    await gui.settleLoginFocus(page, PASSWORD_FOCUS);
    await gui.checkScreenshot(page, 'login-password-visible');

    // Toggle back, so the form is left in the default state every other test here starts from.
    await gui.clickButton(page, ['EyeButton']);
    await gui.settleLoginFocus(page, PASSWORD_FOCUS);
    await gui.checkScreenshot(page, 'login-password-masked-again');
  });

  test('remember me is checked by default and can be toggled', async ({ page, gui }) => {
    await gui.settleLoginFocus(page, USERNAME_FOCUS);
    await gui.checkScreenshot(page, 'login-remember-me-default');
    await gui.clickButton(page, ['RememberMeCheckBox']);
    await gui.checkScreenshot(page, 'login-remember-me-unchecked');
  });

  // Lisa turns password recovery OFF (Lisa/Include/lisaqml/Qml/LisaMain.qml: `canRecoveryPassword:
  // false`), so the link AuthorizationPage otherwise shows is not offered here. That is a product
  // decision rather than a missing feature, and it is worth pinning: if the flag is ever flipped by
  // accident, this fails instead of the suite quietly never covering the recovery dialog.
  test('password recovery is not offered', async ({ page, gui }) => {
    await gui.expectHidden(page, ['PasswordRecoveryLink'], 'Lisa disables password recovery');
  });

  // Sign up opens AuthorizationPage's inline registration dialog. Dismissed via "Close"
  // (Enums.close) - NEVER via "Sign up" (Enums.save), which is the button that actually emits
  // registerUser(userData) and would create an account. Button objectNames are auto-derived from the
  // (localized) text with spaces stripped - imtcontrols/Buttons/Button.qml - so "Close" -> CloseButton.
  test('sign up link opens the registration dialog, Close dismisses it without registering', async ({ page, gui }) => {
    // Settle first: decoratorPause would otherwise fire while the dialog is already up and move the
    // focus ring on the form behind it.
    await gui.settleLoginFocus(page);
    // RegisterUser is a bare MouseArea carrying its own objectName, with no wrapper holding a nested
    // [objectName="MouseArea"], so click() cannot be used on it - clickSelf clicks the node itself.
    await gui.clickSelf(page, ['RegisterUser']);
    await gui.expectVisible(page, ['Dialog'], 'registration dialog should open');

    // Fill every field to prove the form accepts input, still without ever submitting. Scoped under
    // ['Dialog', ...]: UserGeneralEditor's own "PasswordInput" collides with the login form's field of
    // the same name, which is still in the DOM behind the modal.
    await gui.fill(page, ['Dialog', 'UsernameInput'], 'guest_test_signup');
    await gui.fill(page, ['Dialog', 'UserNameInput'], 'Guest Test Signup');
    await gui.fill(page, ['Dialog', 'MailInput'], 'guest-signup@example.com');
    await gui.fill(page, ['Dialog', 'PasswordInput'], 'GuestTest_2026!');
    await gui.fill(page, ['Dialog', 'ConfirmPasswordInput'], 'GuestTest_2026!');
    await gui.checkScreenshot(page, 'login-signup-dialog');

    await gui.clickButton(page, ['CloseButton']);
    await gui.expectHidden(page, ['Dialog'], 'registration dialog should close after Close');
    await gui.expectVisible(page, ['LoginInput'], 'back on the login form after closing');
  });
});
