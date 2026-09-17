// Search - the universal page (pageId "Search"), plus the global search box that feeds it.
//
// The Search page is reachable two ways and both are real: the menu button, and simply typing in the
// box at the top of every page - SearchTextInput debounces 500ms, fires "GlobalSearchActivated", and
// the app navigates here on its own with the results already loaded.
//
// The global box is addressed by its own objectName ("GlobalSearchInput", added to
// imtgui/Panels/TopCenterPanelDecorator.qml for exactly this): every Lisa page - Workspace included -
// has a FilterPanel whose own search box carries the generic "SearchTextInput", so the bare name is
// ambiguous here and the text would land in the page's filter instead.

const { test, expect, newUserPage } = require('../fixtures/test');
const { SearchPage, CollectionPage } = require('../pages');
const gui = require('imtcore-gui-testkit/lib/gui');

test.describe.serial('Search', () => {
  let page;

  test.beforeAll(async ({ browser }, testInfo) => {
    ({ page } = await newUserPage(browser, testInfo));
    // newUserPage() only opens a blank page - this is the one navigation that boots the app, and the
    // only one in the file now that the tests below are ordered to leave each other a clean page.
    await new SearchPage(page).reload();
  });

  test.afterAll(async () => {
    // The CONTEXT, not just the page: newUserPage creates one per block.
    if (page) await page.context().close();
  });

  // No availability probe: Search is universal (PagePermissions "*"), so a missing menu button is a
  // real bug and open() hard-failing on it is the point.
  test('opens from the menu', async () => {
    await new SearchPage(page).open();
    await gui.checkScreenshot(page, 'search-view');
  });

  // Runs before the matching search below, not after it, and that ordering is what replaced a reload
  // in beforeEach - a full Qt/WASM boot per test, to arrive at the same empty Search page this one
  // needs. It leaves no result tabs behind, so the test after it still starts clean.
  //
  // Its baseline carries an ENABLED back arrow, and that is order-dependent: a reload used to bring
  // the app up on the page the user last had open (server-side, per user), so navigating to Search
  // added nothing to go back to. Arriving here by menu from the test above does. Reordering this
  // block will move those pixels again - 61 of them, top centre.
  //
  // Driven from the Search page itself, not from a collection page: a term that matches nothing does
  // not navigate anywhere, and a collection page contributes a "Tab0" of its own (its pinned
  // collection tab) that tabCount() would count as a result. The Search page has no TabPanel until
  // there are results, so zero there means zero.
  test('a term that matches nothing returns no result tabs', async () => {
    const search = new SearchPage(page);
    await search.open();
    await search.search('zzz-no-such-thing-zzz');
    await search.waitForResults();
    expect(await search.tabCount(), 'a nonsense term should match nothing').toBe(0);
    await gui.checkScreenshot(page, 'search-global-no-results');
  });

  // LAST in the block: it is the only test here that leaves result tabs on screen, and nothing after
  // it has to care. search() clears the box before typing, so the nonsense term above does not carry.
  test('typing in the global search box auto-navigates to results', async () => {
    // Started from a collection page on purpose: that is where the ambiguity between the global box
    // and the page's own filter box would bite, so driving it from here is what actually proves the
    // global one was the one that got the text.
    const licenses = new CollectionPage(page, 'Licenses');
    await licenses.open();

    const search = new SearchPage(page);
    await search.search('Camera');
    await search.waitForResults();
    await gui.checkScreenshot(page, 'search-global-results');

    // One result tab per matched entity type; how many exist is data, so nothing assumes a count.
    // Each click still hard-fails loudly if a tab is broken.
    const tabCount = await search.tabCount();
    expect(tabCount, 'a term present in the fixture data should match something').toBeGreaterThan(0);
    for (let i = 0; i < tabCount; i++) {
      await search.clickTab(i);
    }
    await gui.checkScreenshot(page, 'search-global-last-tab');
  });
});
