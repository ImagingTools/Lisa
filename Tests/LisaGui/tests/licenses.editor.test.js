// License EDITOR - full functional coverage.
//
// A license definition belongs to a product and decides two things (see pages/LicenseEditorPage.js):
// which of that product's features it grants, and which other licenses of the same product it
// inherits from. Both are empty until a product is chosen, by design - the feature tree comes from the
// product, and only licenses of the same product can be inherited.
//
// The "product features" block below is expected to be RED against the current server, for the same
// reason as the product editor's: LicenseItem itself answers correctly (verified live - it returns
// the license's own feature ids), but the TREE it is rendered against comes from the product, and
// ProductItem answers `features: ""` for any product it loaded from the database. So the Features
// page has nothing to draw for any license of a fixture product. The tests assert what the page is
// supposed to show rather than what it currently does.

const { test, expect, newUserPage } = require('../fixtures/test');
const { CollectionPage, LicenseEditorPage, COLLECTION_FILTERS, MASK_COLUMNS } = require('../pages');
const gui = require('imtcore-gui-testkit/lib/gui');
const { refuse } = require('../fixtures/refuse');

// Marker for every row this suite creates, so a fixture row and a test row are never confused.
//
// A CONSTANT, not a timestamp. It is typed into fields that are then screenshotted, so anything
// varying per run lands in the baseline and every later run fails on those few pixels - which is
// exactly what happened while this was Date.now(): the shots only ever 'passed' in the same run that
// rewrote them. Reruns cannot collide on it either, because Run-CiTests.ps1 restores both databases
// before every run.
const RUN_ID = 'GuiTest';
const EDIT_FIXTURE = 'RTV.3d License';

function licensesPage(page) {
  return new CollectionPage(page, 'Licenses', { filters: COLLECTION_FILTERS, maskColumns: MASK_COLUMNS });
}

// No reload() in either opener: open() navigates through the menu, and gui.openPage closes whatever
// document tabs the previous block left behind, which is the only state these need reset. A reload
// would do the same thing by booting the whole Qt/WASM app again - around twelve seconds per block.
async function openNewEditor(page) {
  const licenses = licensesPage(page);
  if (!(await licenses.isAvailable())) refuse('the Licenses page is not in the menu');
  await licenses.open();
  if (!(await licenses.commands.isAvailable('New'))) refuse('the Licenses collection offers no New command');
  await licenses.newItem();
  return new LicenseEditorPage(page);
}

async function openEditEditor(page, search = EDIT_FIXTURE) {
  const licenses = licensesPage(page);
  if (!(await licenses.isAvailable())) refuse('the Licenses page is not in the menu');
  await licenses.open();
  await licenses.selectRecord(search);
  await licenses.editItem();
  return new LicenseEditorPage(page);
}

test.describe('Licenses / editor', () => {
  // One context, and therefore one Qt/WASM boot, for the whole file. The blocks below used to take one
  // each, which cost more than the tests inside them: a block's tests run in under a second on a page
  // that is already up, against roughly twelve seconds to bring one up.
  let page;

  test.beforeAll(async ({ browser }, testInfo) => {
    ({ page } = await newUserPage(browser, testInfo));
    // newUserPage() only opens a blank page - this is the one navigation that boots the app.
    await licensesPage(page).reload();
  });

  test.afterAll(async () => {
    if (page) await page.context().close();
  });

  test.describe.serial('new document', () => {
    let editor;

    test.beforeAll(async () => {
      editor = await openNewEditor(page);
    });

    test('empty new editor', async () => {
      await gui.checkScreenshot(page, 'license-editor-new-empty');
    });

    // Both pages that depend on a product say so instead of showing an empty table with no
    // explanation - "Pick a product on the General page first".
    test('the product-dependent pages say a product is needed first', async () => {
      await editor.openInheritance();
      expect(await editor.inheritedLicenses.isPlaceholderShown(), 'no product chosen yet').toBe(true);
      await gui.checkScreenshot(page, 'license-editor-new-inheritance-placeholder');
    });

    test('the id is derived from the name when left empty', async () => {
      await editor.fillGeneral({ name: `${RUN_ID} License` });
      expect(await editor.licenseId.value(), 'the empty id should be filled in from the name').toBe(
        `${RUN_ID}License`
      );
    });

    test('fill the rest of the General page', async () => {
      await editor.fillGeneral({ id: `${RUN_ID}Id`, description: 'Created by the Lisa GUI suite' });
      await gui.checkScreenshot(page, 'license-editor-new-filled');
    });

    test('choosing a product', async () => {
      const options = await editor.productOptionCount();
      test.skip(options === 0, 'no products to pick from');
      await editor.selectProductByIndex(0);
      await gui.checkScreenshot(page, 'license-editor-new-product-selected');
    });

    test('the inheritance page lists other licenses of the same product', async () => {
      await editor.openInheritance();
      test.skip(!(await editor.inheritedLicenses.hasRows()), 'this product has no other licenses to inherit from');
      await gui.checkScreenshot(page, 'license-editor-new-inheritance-listed');
    });

    test('inheriting a license, then clearing', async () => {
      test.skip(!(await editor.inheritedLicenses.hasRows()), 'this product has no other licenses to inherit from');
      await editor.inheritedLicenses.toggleRow(0);
      await gui.checkScreenshot(page, 'license-editor-inheritance-ticked');

      // What an inherited license grants shows up read-only beside the Features table.
      await editor.openFeatures();
      await gui.checkScreenshot(page, 'license-editor-inherited-features');

      await editor.clearInheritedLicenses();
      await gui.checkScreenshot(page, 'license-editor-inheritance-cleared');
    });

    test('the inheritance search filters the list', async () => {
      test.skip(!(await editor.inheritedLicenses.hasRows()), 'nothing to filter');
      const before = await editor.inheritedLicenses.rowCount();
      await editor.inheritedLicenses.filter('RTV');
      expect(await editor.inheritedLicenses.rowCount(), 'a search should narrow the list').toBeLessThanOrEqual(before);
      await gui.checkScreenshot(page, 'license-editor-inheritance-filtered');
      await editor.inheritedLicenses.filter('');
    });

    // Self-contained, because the two phases run as separate Playwright invocations: in phase 2 the
    // non-@mutating tests above are filtered out, so this opens on an untouched document and has to
    // fill it in itself rather than lean on a step that only exists in the other phase.
    test('save the new license', { tag: '@mutating' }, async () => {
      await editor.fillGeneral({ name: `${RUN_ID} License`, description: 'Created by the Lisa GUI suite' });
      if ((await editor.productOptionCount()) > 0) await editor.selectProductByIndex(0);
      await editor.save();
      await gui.checkScreenshot(page, 'license-editor-new-saved');
    });

    test('the saved license is in the collection', { tag: '@mutating' }, async () => {
      await editor.closeDocument();
      const licenses = licensesPage(page);
      await licenses.open();
      await licenses.search(RUN_ID);
      expect(await licenses.table.visibleRowCount(), 'the license just saved should be findable').toBeGreaterThan(0);
      await gui.checkScreenshot(page, 'license-editor-new-in-collection', await licenses.masks());
    });
  });

  test.describe.serial('existing document', () => {
    let editor;

    test.beforeAll(async () => {
      editor = await openEditEditor(page);
    });

    test('the editor loads the selected license', async () => {
      await editor.openGeneral();
      expect(await editor.licenseName.value(), 'the editor should load the row it was opened on').not.toBe('');
      await gui.checkScreenshot(page, 'license-editor-edit-loaded');
    });

    test('the inheritance page lists the product siblings', async () => {
      await editor.openInheritance();
      test.skip(!(await editor.inheritedLicenses.hasRows()), 'this product has no other licenses');
      await gui.checkScreenshot(page, 'license-editor-edit-inheritance');
    });

    test('editing the description and saving', { tag: '@mutating' }, async () => {
      await editor.fillGeneral({ description: `Edited by the Lisa GUI suite (${RUN_ID})` });
      await editor.save();
      await gui.checkScreenshot(page, 'license-editor-edit-saved');
    });

    test('reopening shows what was saved', { tag: '@mutating' }, async () => {
      await editor.closeDocument();
      const reopened = await openEditEditor(page);
      await reopened.openGeneral();
      await gui.checkScreenshot(page, 'license-editor-edit-reopened');
    });
  });

  // Their own block: a describe.serial block stops at its first failure, so leaving these inside the
  // blocks above would take the inheritance and save coverage down with them. Not .serial either, so
  // the second assertion is not hidden behind the first.
  test.describe('product features', () => {
    let editor;

    test.beforeAll(async () => {
      editor = await openEditEditor(page);
    });

    test('an existing license lists the features it grants', async () => {
      await editor.openFeatures();
      expect(
        await editor.features.rowCount(),
        "an existing license must list its product's features"
      ).toBeGreaterThan(0);
      await gui.checkScreenshot(page, 'license-editor-edit-features');
    });

    // The same thing from the other direction: a brand-new license that has just been pointed at a
    // product must pick up that product's feature tree.
    test('a newly chosen product brings its features in', async () => {
      const licenses = licensesPage(page);
      await licenses.open();
      await licenses.newItem();
      const fresh = new LicenseEditorPage(page);
      const options = await fresh.productOptionCount();
      test.skip(options === 0, 'no products to pick from');

      // Which product sits at which position is fixture data, and several of them - the hardware
      // ones - legitimately carry no features at all, so picking index 0 asserts nothing. The claim
      // is made over the collection instead: SOME product must bring a feature tree in.
      let rowCount = 0;
      for (let index = 0; index < options && rowCount === 0; index++) {
        await fresh.selectProductByIndex(index);
        await fresh.openFeatures();
        rowCount = await fresh.features.rowCount();
      }
      expect(rowCount, "choosing a product must bring that product's features in").toBeGreaterThan(0);
      await gui.checkScreenshot(page, 'license-editor-new-features');
    });
  });
});
