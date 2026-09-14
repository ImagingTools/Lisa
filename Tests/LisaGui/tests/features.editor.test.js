// Feature EDITOR - full functional coverage.
//
// The editor is a document tab opened by "New" or "Edit" on the Features page (see
// pages/FeatureEditorPage.js for the Document Service flow). A feature is a name, an id, two flags,
// and a TREE of sub-features - and the tree is the part with real behaviour: a level accepts children
// only once its owner has both a name and an id, rows are edited inline with a draft that Cancel
// throws away, and every leaf carries its own dependency list picked from the shared feature
// collection.
//
// The describe blocks are `.serial` and share ONE page/document across their steps (see
// fixtures/test.js's newUserPage) rather than booting a fresh app per test: "fill this, then that,
// then save" is already a deliberate sequence, and Lisa keeps the document open server-side between
// actions anyway. Trade-off: a failure partway through a block skips the rest of that block.

const { test, expect, newUserPage } = require('../fixtures/test');
const { CollectionPage, FeatureEditorPage, COLLECTION_FILTERS, MASK_COLUMNS } = require('../pages');
const gui = require('imtcore-gui-testkit/lib/gui');

// Marker for every row this suite creates, so a fixture row and a test row are never confused.
//
// A CONSTANT, not a timestamp. It is typed into fields that are then screenshotted, so anything
// varying per run lands in the baseline and every later run fails on those few pixels - which is
// exactly what happened while this was Date.now(): the shots only ever 'passed' in the same run that
// rewrote them. Reruns cannot collide on it either, because Run-CiTests.ps1 restores both databases
// before every run.
const RUN_ID = 'GuiTest';

function featuresPage(page) {
  return new CollectionPage(page, 'Features', { filters: COLLECTION_FILTERS, maskColumns: MASK_COLUMNS });
}

async function openNewEditor(page) {
  const features = featuresPage(page);
  await features.reload();
  if (!(await features.isAvailable())) return null;
  await features.open();
  if (!(await features.commands.isAvailable('New'))) return null;
  await features.newItem();
  return new FeatureEditorPage(page);
}

async function openEditEditor(page) {
  const features = featuresPage(page);
  await features.reload();
  if (!(await features.isAvailable())) return null;
  await features.open();
  // Sort by "added" before picking row 0. The default view is sorted by "Last Modified" descending
  // (FeatureCollectionView.qml's Component.onCompleted), so row 0 changes the moment ANY test in this
  // run saves a feature - and the @mutating phase runs serially after the rest. "added" is immutable
  // creation metadata, so it pins row 0 to the same feature whatever else has run.
  await features.table.sortBy('added');
  if (!(await features.table.hasRows())) return null;
  await features.selectRow(0);
  await features.editItem();
  return new FeatureEditorPage(page);
}

test.describe('Features / editor', () => {
  // --- NEW document: one continuous feature, steps build on each other in order -------------------
  test.describe.serial('new document', () => {
    let page, editor;

    test.beforeAll(async ({ browser }, testInfo) => {
      ({ page } = await newUserPage(browser, testInfo));
      editor = await openNewEditor(page);
    });

    test.afterAll(async () => {
      if (page) await page.context().close();
    });

    test.beforeEach(() => {
      test.skip(!editor, 'creating a feature is not available to this user');
    });

    test('empty new editor', async () => {
      await gui.checkScreenshot(page, 'feature-editor-new-empty');
    });

    // Name and ID are both marked required, and the editor says so where they are rather than leaving
    // the reader to infer it from a command that never lights up: each shows its own red note while it
    // is empty (FeatureEditor.qml's `description` binding on those two fields).
    test('required fields are called out while empty', async () => {
      await page.getByText('Required. A feature needs a name before it can have sub-features.').first().waitFor({
        state: 'visible',
        timeout: 10000,
      });
      await gui.checkScreenshot(page, 'feature-editor-new-required-hints');
    });

    // The Sub-features level refuses children until the feature itself is complete, and the explorer
    // says which page to go and fix it on instead of only greying the command out.
    test('sub-features are refused until the feature has a name and an id', async () => {
      await editor.openSubfeatures();
      await page
        .getByText('Fill in Feature Name and Feature ID on the General page to add sub-features here')
        .first()
        .waitFor({ state: 'visible', timeout: 10000 });
      await gui.checkScreenshot(page, 'feature-editor-new-subfeatures-blocked');
    });

    // The id follows the name until the user types one of their own: leaving it empty fills it in from
    // the name with the spaces stripped (FeatureEditor.qml's onEditingFinished).
    test('the id is derived from the name when left empty', async () => {
      await editor.fillGeneral({ name: `${RUN_ID} Feature` });
      expect(await editor.featureId.value(), 'the empty id should be filled in from the name').toBe(
        `${RUN_ID}Feature`
      );
      await gui.checkScreenshot(page, 'feature-editor-new-name-filled');
    });

    test('fill the rest of the General page', async () => {
      await editor.fillGeneral({ id: `${RUN_ID}Id`, description: 'Created by the Lisa GUI suite' });
      await editor.toggleOptional();
      await editor.togglePermission();
      await gui.checkScreenshot(page, 'feature-editor-new-filled');
    });

    test('the sub-feature level opens once the feature is complete', async () => {
      await editor.openSubfeatures();
      await gui.expectVisible(page, ['SubfeaturesExplorer', 'CreateButton'], 'the create command should be offered');
      await gui.checkScreenshot(page, 'feature-editor-new-subfeatures-empty');
    });

    // Self-contained, because the two phases run as separate Playwright invocations: in phase 2 the
    // non-@mutating tests above are filtered out, so the document this opens on is untouched and
    // nothing would be left to save. Every @mutating test in this suite therefore makes its own change
    // before saving rather than leaning on a step that only exists in the other phase.
    test('save the new feature', { tag: '@mutating' }, async () => {
      await editor.fillGeneral({ name: `${RUN_ID} Feature`, description: 'Created by the Lisa GUI suite' });
      await editor.save();
      await gui.checkScreenshot(page, 'feature-editor-new-saved');
    });

    test('the saved feature is in the collection', { tag: '@mutating' }, async () => {
      await editor.closeDocument();
      const features = featuresPage(page);
      await features.open();
      await features.search(RUN_ID);
      expect(await features.table.visibleRowCount(), 'the feature just saved should be findable').toBeGreaterThan(0);
      await gui.checkScreenshot(page, 'feature-editor-new-in-collection', await features.masks());
    });
  });

  // --- EDIT an existing feature, and exercise the sub-feature tree ---------------------------------
  test.describe.serial('existing document', () => {
    let page, editor;

    test.beforeAll(async ({ browser }, testInfo) => {
      ({ page } = await newUserPage(browser, testInfo));
      editor = await openEditEditor(page);
    });

    test.afterAll(async () => {
      if (page) await page.context().close();
    });

    test.beforeEach(() => {
      test.skip(!editor, 'editing a feature is not available to this user, or the collection is empty');
    });

    test('the editor loads the selected feature', async () => {
      await editor.openGeneral();
      expect(await editor.featureName.value(), 'the editor should load the row it was opened on').not.toBe('');
      await gui.checkScreenshot(page, 'feature-editor-edit-loaded');
    });

    // --- the sub-feature tree ---------------------------------------------------------------------

    test('a new sub-feature arrives complete and closed', async () => {
      await editor.openSubfeatures();
      const before = await editor.subfeatures.rowCount();
      await editor.subfeatures.create();
      expect(await editor.subfeatures.rowCount(), 'the level should have gained a row').toBe(before + 1);
      // It is created with a generated, unique name and id rather than blank - which is what lets it
      // own children straight away - and it is deliberately left unselected.
      await gui.checkScreenshot(page, 'feature-editor-subfeature-created');
    });

    test('editing a row inline and cancelling discards the draft', async () => {
      await editor.editSubFeatureRow(0);
      await gui.expectVisible(page, ['SubfeaturesExplorer', 'CommitRowButton'], 'the row should be open for editing');
      await editor.fillOpenSubFeatureRow({ name: 'Discarded by Cancel' });
      await gui.checkScreenshot(page, 'feature-editor-subfeature-editing');

      await editor.cancelSubFeatureRow();
      const titles = await editor.subfeatures.page.locator('[objectName="SubfeatureNameCell"] [objectName="CellText"]');
      expect(await titles.first().textContent(), 'Cancel must not write the draft to the model').not.toContain(
        'Discarded by Cancel'
      );
      await gui.checkScreenshot(page, 'feature-editor-subfeature-cancelled');
    });

    test('editing a row inline and committing applies the draft', async () => {
      await editor.editSubFeatureRow(0);
      await editor.fillOpenSubFeatureRow({
        name: `${RUN_ID} Sub`,
        id: `${RUN_ID}Sub`,
        description: 'Edited inline by the GUI suite',
      });
      await editor.commitSubFeatureRow();
      await gui.expectHidden(page, ['SubfeaturesExplorer', 'CommitRowButton'], 'the row should be closed again');
      await gui.checkScreenshot(page, 'feature-editor-subfeature-committed');
    });

    // Optional and Permission are drafts too - they belong to the open row, not to the model, until it
    // is committed (FeatureEditor.qml's syncSwitches / commitEditing).
    test('the row switches are part of the same draft', async () => {
      await editor.editSubFeatureRow(0);
      await editor.toggleSubFeatureOptional(0);
      await editor.toggleSubFeaturePermission(0);
      await gui.checkScreenshot(page, 'feature-editor-subfeature-switches-drafted');
      await editor.commitSubFeatureRow();
      await gui.checkScreenshot(page, 'feature-editor-subfeature-switches-committed');
    });

    // The count chip is the way down into a level - there is no separate open button on the row.
    test('descending into a level and coming back up the breadcrumb', async () => {
      const before = await editor.subfeatures.breadcrumbs();
      await editor.openSubFeatureLevel(0);
      const inside = await editor.subfeatures.breadcrumbs();
      expect(inside.length, 'descending should add a breadcrumb segment').toBe(before.length + 1);
      await gui.checkScreenshot(page, 'feature-editor-subfeature-level-open');

      await editor.subfeatures.navigateToDepth(0);
      expect(await editor.subfeatures.breadcrumbs(), 'the breadcrumb root should bring us back').toHaveLength(
        before.length
      );
      await gui.checkScreenshot(page, 'feature-editor-subfeature-level-root');
    });

    test('the explorer search filters the level', async () => {
      await editor.subfeatures.filter(RUN_ID);
      await gui.checkScreenshot(page, 'feature-editor-subfeature-filtered');
      await editor.subfeatures.filter('');
    });

    // --- the dependencies panel -------------------------------------------------------------------

    test('the dependencies panel says why it is empty before a row is picked', async () => {
      // Clicking the breadcrumb root above cleared the selection, so the panel is back to its
      // placeholder - which is a real state with its own message, not a loading artefact.
      expect(await editor.dependencies.isPlaceholderShown(), 'no row picked yet').toBe(true);
      await gui.checkScreenshot(page, 'feature-editor-dependencies-placeholder');
    });

    test('picking a leaf fills the dependencies panel from the shared feature collection', async () => {
      await editor.subfeatures.selectRow(0);
      test.skip(!(await editor.dependencies.hasRows()), 'the shared feature collection is empty');
      await gui.checkScreenshot(page, 'feature-editor-dependencies-listed');
    });

    test('ticking a dependency, then clearing them all', async () => {
      test.skip(!(await editor.dependencies.hasRows()), 'the shared feature collection is empty');
      await editor.dependencies.toggleRow(0);
      await gui.checkScreenshot(page, 'feature-editor-dependency-ticked');

      // The header command is "Clear", and it is only active while something is ticked.
      await editor.dependencies.runAction();
      await gui.checkScreenshot(page, 'feature-editor-dependency-cleared');
    });

    test('the dependencies search filters the list', async () => {
      test.skip(!(await editor.dependencies.hasRows()), 'the shared feature collection is empty');
      const before = await editor.dependencies.rowCount();
      await editor.dependencies.filter('Inspection');
      expect(await editor.dependencies.rowCount(), 'a search should narrow the list').toBeLessThanOrEqual(before);
      await gui.checkScreenshot(page, 'feature-editor-dependencies-filtered');
      await editor.dependencies.filter('');
    });

    // --- removal, undo/redo, save -----------------------------------------------------------------

    // Selecting and ticking are ONE set in this control (TreeExplorerView's selectNode /
    // toggleChecked / commandTargets all read `checkedNodes`), which is what keeps "the commands are
    // lit but nothing is highlighted" impossible. Two consequences a test has to respect: a selected
    // row is already a command target, and ticking a row that is already selected UNTICKS it.
    test('removing the selected sub-feature', async () => {
      await editor.openSubfeatures();
      const before = await editor.subfeatures.rowCount();
      test.skip(before === 0, 'nothing to remove');
      await editor.subfeatures.selectRow(0);
      await gui.checkScreenshot(page, 'feature-editor-subfeature-selected');
      await editor.subfeatures.removeRows();
      expect(await editor.subfeatures.rowCount(), 'the selected row should be gone').toBe(before - 1);
      await gui.checkScreenshot(page, 'feature-editor-subfeature-removed');
    });

    test('ticking a second row makes Remove act on both', async () => {
      const before = await editor.subfeatures.rowCount();
      test.skip(before < 2, 'two rows are needed to remove two');
      await editor.subfeatures.selectRow(0);
      await editor.subfeatures.checkRow(1);
      await gui.checkScreenshot(page, 'feature-editor-subfeature-two-checked');
      await editor.subfeatures.removeRows();
      expect(await editor.subfeatures.rowCount(), 'both rows should be gone').toBe(before - 2);
      await gui.checkScreenshot(page, 'feature-editor-subfeature-two-removed');
    });

    // Every sub-feature edit above went into the document's undo stack as one step each (the row
    // commits its drafts between a single beginChanges/endChanges pair), so Undo walks back through
    // them and Redo returns.
    test('undo and redo walk the document history', async () => {
      await editor.undo();
      await gui.checkScreenshot(page, 'feature-editor-after-undo');
      await editor.redo();
      await gui.checkScreenshot(page, 'feature-editor-after-redo');
    });

    test('save the edited feature', { tag: '@mutating' }, async () => {
      // Its own change first - see the note on the new-document save above.
      await editor.fillGeneral({ description: `Edited by the Lisa GUI suite (${RUN_ID})` });
      await editor.save();
      await gui.checkScreenshot(page, 'feature-editor-edit-saved');
    });

    test('reopening shows what was saved', { tag: '@mutating' }, async () => {
      await editor.closeDocument();
      const reopened = await openEditEditor(page);
      test.skip(!reopened, 'the collection became unavailable');
      await reopened.openSubfeatures();
      await gui.checkScreenshot(page, 'feature-editor-edit-reopened');
    });
  });

  // --- closing a dirty document -------------------------------------------------------------------
  //
  // Its own block with a fresh page: it deliberately ends with an unsaved document, which is exactly
  // the state the blocks above must not inherit.
  test.describe.serial('closing a dirty document', () => {
    let page, editor;

    test.beforeAll(async ({ browser }, testInfo) => {
      ({ page } = await newUserPage(browser, testInfo));
      editor = await openNewEditor(page);
    });

    test.afterAll(async () => {
      if (page) await page.context().close();
    });

    test('a dirty tab asks before closing, and No discards', async () => {
      test.skip(!editor, 'creating a feature is not available to this user');
      await editor.fillGeneral({ name: `${RUN_ID} Discarded` });
      await editor.closeDocument();
      await gui.expectVisible(page, ['Dialog'], 'closing a dirty document should ask first');
      await gui.checkScreenshot(page, 'feature-editor-close-dirty');

      // No = discard. Never Yes here: that would save a throwaway feature into the shared database
      // from a test that is not tagged @mutating.
      await gui.clickButton(page, ['NoButton']);
      await gui.expectHidden(page, ['Dialog'], 'the confirm should close');
      await gui.checkScreenshot(page, 'feature-editor-close-discarded');
    });
  });
});
