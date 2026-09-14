// The multi-tab document workspace (ImtCore/Qml/imtcolgui/MultiDocumentCollectionView.qml +
// TabDelegate.qml), exercised through Features purely because it is a convenient, well-instrumented
// vehicle - the behaviour under test is not Features-specific.
//
// What makes this worth its own spec rather than a line in an editor spec: the workspace is SERVER
// state, keyed per user. Tabs survive a page reload, and that is exactly the property a test suite
// has to get right (every openPage() in the kit closes leftovers for the same reason).

const { test, expect, newUserPage } = require('../fixtures/test');
const { CollectionPage, FeatureEditorPage, COLLECTION_FILTERS, MASK_COLUMNS } = require('../pages');
const gui = require('imtcore-gui-testkit/lib/gui');

function featuresPage(page) {
  return new CollectionPage(page, 'Features', { filters: COLLECTION_FILTERS, maskColumns: MASK_COLUMNS });
}

test.describe.serial('Document tabs', () => {
  let page, features, available;

  test.beforeAll(async ({ browser }, testInfo) => {
    ({ page } = await newUserPage(browser, testInfo));
    features = featuresPage(page);
    await features.reload();
    available = await features.isAvailable();
    if (available) await features.open();
  });

  test.afterAll(async () => {
    if (page) await page.context().close();
  });

  test.beforeEach(() => {
    test.skip(!available, 'Features is not available to this user');
  });

  // Tab0 is the pinned collection tab and has no close button; document tabs are Tab1, Tab2, ...
  test('opening two documents gives two tabs beside the collection tab', async () => {
    test.skip(!(await features.table.hasRows()), 'the collection is empty');
    // Sorted by immutable creation metadata, so the two rows picked below stay the same two however
    // many features earlier @mutating tests have added or touched.
    await features.table.sortBy('added');
    test.skip((await features.table.visibleRowCount()) < 2, 'two documents need two rows');
    await features.selectRow(0);
    await features.editItem();
    await gui.expectVisible(page, ['Tab1'], 'the first document should get a tab');

    await features.switchToTab(0);
    await features.selectRow(1);
    await features.editItem();
    await gui.expectVisible(page, ['Tab2'], 'the second document should get its own tab');
    await gui.checkScreenshot(page, 'document-tabs-two-open');
  });

  test('switching tabs switches the document under them', async () => {
    const editor = new FeatureEditorPage(page);

    await features.switchToTab(1);
    await editor.openGeneral();
    const first = await editor.featureName.value();

    await features.switchToTab(2);
    await editor.openGeneral();
    const second = await editor.featureName.value();

    expect(second, 'each tab should hold its own document').not.toBe(first);
    await gui.checkScreenshot(page, 'document-tabs-second-active');
  });

  // The collection tab is pinned: it must stay whatever else is closed. Asked of what is OFFERED, not
  // of what is in the DOM - TabDelegate keeps a close button on every tab and hides it on the pinned
  // one (which is also why closeAllDocumentTabs filters on [visible] rather than on presence).
  test('the collection tab offers no close button', async () => {
    expect(
      await gui.countVisible(page, ['Tab0', 'CloseButton']),
      'the pinned collection tab must not offer a close button'
    ).toBe(0);
    await gui.expectVisible(page, ['Tab1', 'CloseButton'], '... while a document tab does');
  });

  test('closing every tab leaves the collection', async () => {
    await gui.closeAllDocumentTabs(page);
    await gui.expectHidden(page, ['Tab1'], 'no document tabs should be left');
    await features.expectOpen();
    await gui.checkScreenshot(page, 'document-tabs-all-closed', await features.masks());
  });

  // Lisa's open-document tabs are per SESSION: a reload comes back on the plain collection rather than
  // reopening what was on screen. Worth pinning, because it is the opposite of what the sibling ProLife
  // suite sees from the same components (there a reload restores the tabs, which is why the kit's
  // openPage() closes leftovers defensively) - so a test written against that assumption would be
  // wrong here, and a change in either direction should be a deliberate one.
  test('a reload comes back on the collection, not on the open documents', async () => {
    await features.selectRow(0);
    await features.editItem();
    await gui.expectVisible(page, ['Tab1'], 'a document tab to reload with');

    await gui.reload(page);
    await gui.expectHidden(page, ['Tab1'], 'the document tab should not come back');
    await features.expectOpen();
    await gui.checkScreenshot(page, 'document-tabs-after-reload', await features.masks());
  });
});
