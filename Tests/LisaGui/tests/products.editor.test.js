// Product EDITOR - full functional coverage.
//
// A product is a name, a category, and a set of references into the shared feature collection (see
// pages/ProductEditorPage.js). Features are never typed here: they are picked from the collection
// through the "Select features" dialog, and the only thing the product itself decides is which of a
// feature's OPTIONAL parts it takes.
//
// KNOWN DEFECT, and the reason one block below is expected to be RED: the server's ProductItem query
// answers `features: ""` for a product it LOADED FROM THE DATABASE - verified directly against the
// running server, where a product holding 20 feature ids came back with an empty string. A product
// created and saved in the same server session is fine ("reopening the saved product still shows its
// feature" below passes), so what is lost is the deserialisation of the stored `Features` array into
// the product's own feature collection, not the query. Every product that came from the fixture
// backup therefore opens with an empty Features page, and the license editor - which lists ITS
// product's features - is empty for the same reason.
//
// The tests assert what the product is supposed to do rather than the broken behaviour: softening
// them would hide exactly the feature that is broken.

const { test, expect, newUserPage } = require('../fixtures/test');
const { ProductCollectionPage, ProductEditorPage, CATEGORY_SOFTWARE } = require('../pages');
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

// No reload() in either opener: open() navigates through the menu, and gui.openPage closes whatever
// document tabs the previous block left behind, which is the only state these need reset. A reload
// would do the same thing by booting the whole Qt/WASM app again - around twelve seconds per block.
async function openNewEditor(page) {
  const products = new ProductCollectionPage(page);
  if (!(await products.isAvailable())) refuse('the Products page is not in the menu');
  await products.open();
  if (!(await products.commands.isAvailable('New'))) refuse('the Products collection offers no New command');
  await products.newItem();
  return new ProductEditorPage(page);
}

/**
 * Open the editor on the first row, optionally after narrowing the collection to `search`.
 *
 * Every way out of here is a failure. The page being out of reach is one (see refuse above), and so
 * is a search that finds nothing: the term is a product this suite's own fixture backup is known to
 * contain, so "no rows" means the data or the search is broken, not that there is nothing to test.
 * That distinction matters - hasRows()'s default 6s poll once expired before a search had landed, the
 * test skipped, its baseline was left stale, and the next run failed against that stale image instead
 * of against anything real.
 */
async function openEditEditor(page, search) {
  const products = new ProductCollectionPage(page);
  if (!(await products.isAvailable())) refuse('the Products page is not in the menu');
  await products.open();
  await products.selectRecord(search);
  await products.editItem();
  return new ProductEditorPage(page);
}

test.describe('Products / editor', () => {
  // One context, and therefore one Qt/WASM boot, for the whole file. The blocks below used to take one
  // each, which cost more than the tests inside them: a block's tests run in under a second on a page
  // that is already up, against roughly twelve seconds to bring one up.
  let page;

  test.beforeAll(async ({ browser }, testInfo) => {
    ({ page } = await newUserPage(browser, testInfo));
    // newUserPage() only opens a blank page - this is the one navigation that boots the app.
    await new ProductCollectionPage(page).reload();
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
      await gui.checkScreenshot(page, 'product-editor-new-empty');
    });

    test('fill the General page', async () => {
      await editor.fillGeneral({ name: `${RUN_ID} Product`, category: CATEGORY_SOFTWARE });
      expect(await editor.productName.value(), 'the name should hold what was typed').toBe(`${RUN_ID} Product`);
      await gui.checkScreenshot(page, 'product-editor-new-filled');
    });

    test('an empty product says so on its Features page', async () => {
      await editor.openFeatures();
      await page.getByText('No features added').first().waitFor({ state: 'visible', timeout: 10000 });
      await gui.checkScreenshot(page, 'product-editor-new-features-empty');
    });

    test('the picker lists the shared feature collection', async () => {
      await editor.openFeaturePicker();
      await gui.expectVisible(page, ['Dialog'], '"Select features" should open');
      expect(await editor.picker.hasRows(), 'the picker should list the shared feature collection').toBe(true);
      await gui.checkScreenshot(page, 'product-editor-feature-picker');
    });

    // "Add" stays disabled until at least one row is ticked (FeaturesDialog.qml), so ticking is what
    // makes the dialog completable - worth its own screenshot before confirming.
    //
    // Narrowed to a feature that actually HAS optional parts first, so the "optional parts" test below
    // exercises the decision rather than skipping. The narrowing is adaptive: on data where that
    // feature is absent the search is cleared and the first row taken, and the later test skips - the
    // same way a data-driven filter scenario does.
    test('ticking a feature enables Add, and Add puts it into the product', async () => {
      await editor.picker.filter('REST-API');
      if ((await editor.picker.rowCount()) === 0) {
        await editor.picker.filter('');
      }
      await editor.picker.toggleRow(0);
      await gui.checkScreenshot(page, 'product-editor-feature-picker-ticked');

      await editor.dialog.clickButtonByText('Add');
      await gui.expectHidden(page, ['Dialog'], 'the picker should close after Add');
      expect(await editor.features.rowCount(), 'the picked feature should be in the product').toBe(1);
      await gui.checkScreenshot(page, 'product-editor-feature-added');
    });

    test('an already-picked feature is not offered again', async () => {
      await editor.openFeaturePicker();
      const titles = await editor.picker.rowTitles();
      const added = await editor.features.page
        .locator('[objectName="ProductFeatureNameCell"]')
        .first()
        .textContent();
      expect(titles, 'the picker excludes what the product already has').not.toContain((added || '').trim());
      await editor.cancelFeaturePicker();
    });

    test('selecting a feature fills the Feature content panel', async () => {
      // Before anything is selected the panel shows its placeholder - a real state with its own
      // message, not a loading artefact.
      expect(await editor.featureContent.isPlaceholderShown(), 'nothing selected yet').toBe(true);
      await gui.checkScreenshot(page, 'product-editor-content-placeholder');

      await editor.selectFeature(0);
      await gui.checkScreenshot(page, 'product-editor-content-listed');
    });

    // The panel lists every part a feature brings, mandatory ones included - so having rows is not the
    // same as having a decision to make. It offers its "Take all"/"Clear" command only when there is
    // at least one OPTIONAL part, which is the real precondition here.
    test('optional parts can be taken and dropped', async () => {
      test.skip(!(await editor.featureContent.hasAction()), 'this feature has no optional parts to decide about');
      await editor.toggleAllOptionalParts();
      await gui.checkScreenshot(page, 'product-editor-optional-all');
      await editor.toggleAllOptionalParts();
      await gui.checkScreenshot(page, 'product-editor-optional-none');
    });

    test('removing the feature empties the product again', async () => {
      await editor.removeFeature(0);
      expect(await editor.features.rowCount(), 'the product should be empty again').toBe(0);
      await gui.checkScreenshot(page, 'product-editor-feature-removed');
    });

    test('undo brings the removed feature back, redo takes it away', async () => {
      await editor.undo();
      await gui.checkScreenshot(page, 'product-editor-after-undo');
      await editor.redo();
      await gui.checkScreenshot(page, 'product-editor-after-redo');
    });

    // Self-contained, because the two phases run as separate Playwright invocations: in phase 2 the
    // non-@mutating tests above are filtered out, so this opens on an untouched document and has to
    // fill it in itself rather than lean on a step that only exists in the other phase.
    test('save the new product', { tag: '@mutating' }, async () => {
      await editor.fillGeneral({ name: `${RUN_ID} Product`, category: CATEGORY_SOFTWARE });
      // A feature too: a product with none is a legal but uninteresting thing to save, and the point
      // of saving here is that the picked features survive the round trip.
      await editor.openFeaturePicker();
      await editor.addFeatures([0]);
      await editor.save();
      await gui.checkScreenshot(page, 'product-editor-new-saved');
    });

    test('the saved product is in the collection', { tag: '@mutating' }, async () => {
      await editor.closeDocument();
      const products = new ProductCollectionPage(page);
      await products.open();
      await products.search(RUN_ID);
      expect(await products.table.visibleRowCount(), 'the product just saved should be findable').toBeGreaterThan(0);
      await gui.checkScreenshot(page, 'product-editor-new-in-collection', await products.masks());
    });

    // Reopening is where the ProductItem defect described at the top of this file shows: the features
    // saved a moment ago come back as an empty list. Asserted as it should behave.
    test('reopening the saved product still shows its feature', { tag: '@mutating' }, async () => {
      const reopened = await openEditEditor(page, RUN_ID);
      await reopened.openFeatures();
      expect(
        await reopened.features.rowCount(),
        'a saved product must come back with the features it was saved with (ProductItem returns features: "")'
      ).toBe(1);
    });
  });

  // --- an existing, fixture-data product ----------------------------------------------------------
  test.describe.serial('existing document', () => {
    let editor;

    test.beforeAll(async () => {
      // "RTV.3d Software" is the largest fixture product (20 features in its stored document), so it
      // is the clearest subject for "an existing product shows what it contains".
      editor = await openEditEditor(page, 'RTV.3d Software');
    });

    test('the editor loads the selected product', async () => {
      await editor.openGeneral();
      expect(await editor.productName.value(), 'the editor should load the row it was opened on').not.toBe('');
      await gui.checkScreenshot(page, 'product-editor-edit-loaded');
    });

    test('renaming the product and saving it', { tag: '@mutating' }, async () => {
      await editor.fillGeneral({ name: `${RUN_ID} Renamed` });
      await editor.save();
      await gui.checkScreenshot(page, 'product-editor-edit-saved');
    });
  });

  // Its own block, so a failure here does not take the rename/save coverage in the serial block above
  // down with it.
  test.describe('existing document - stored features', () => {
    let editor;

    test.beforeAll(async () => {
      editor = await openEditEditor(page, 'RTV.3d Software');
    });

    // This product's stored document is in the pre-11786 archive format, which carries feature IDs
    // and nothing else - reconstructing the features from them needs the FeatureInfoProvider the
    // repository now wires into its document factory. Without it the page renders "No features
    // added" while the document holds 20 of them.
    test('an existing product lists the features it contains', async () => {
      await editor.openFeatures();
      expect(
        await editor.features.rowCount(),
        'an existing product must list its stored features'
      ).toBeGreaterThan(0);
      await gui.checkScreenshot(page, 'product-editor-edit-features');
    });
  });
});
