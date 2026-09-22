// Lisa-only: make sure a collection table has actually rendered before a test acts on it.
//
// Two failure sites on the build agent, one cause. Both say the same thing:
//
//     GUI target not found: [TableHeaders > featureName] after 10000ms
//         TableHeaders: present but not visible (2 in DOM)
//
// TWO TableHeaders with neither visible is a view that has not finished building - or has finished
// building wrong: the empty case also came up with no column headers and no command bar at all, and
// it survived a full 10s wait. So waiting longer is not the whole answer; reloading is what brings
// such a view back. Both are here, the wait first because it is free when the view is merely slow.
//
// Deliberately NOT in imtcore-gui-testkit, although clearAllFilters() lives there: ProLife calls it
// from 7 places and from four multiuser specs that run as restricted users, where a collection may
// legitimately render no table at all - there a reload would be wasted work on every one. Agentino
// never calls it. Only Lisa has shown this.

const gui = require('imtcore-gui-testkit/lib/gui');

// Budget, against the suite's 60s per-test timeout: a cold landing test already costs ~25s on the
// agent, and a reload is another ~12s of Qt/WASM boot. Hence a short first look and a longer second
// one, rather than one long wait that would leave no room to retry.
const FIRST_WAIT = 8000;
const RETRY_WAIT = 15000;

/**
 * Wait for a collection table to render, reloading the view once if it does not.
 *
 * Returns whether it is there in the end and never throws: the caller's own assertion should produce
 * the failure message, so this cannot turn a clear error into an obscure one.
 *
 * @param {import('@playwright/test').Page} page
 * @param {() => Promise<unknown>} reopen  reload and re-navigate to the view
 * @param {string[]} [path]  what to wait for; a named column is stricter than the header row alone
 */
async function waitForTable(page, reopen, path = ['TableHeaders']) {
  if (await gui.dom.isVisible(page, path, FIRST_WAIT)) return true;

  // eslint-disable-next-line no-console
  console.warn(`collection table did not render within ${FIRST_WAIT}ms - reloading the view once`);
  await reopen();
  return gui.dom.isVisible(page, path, RETRY_WAIT);
}

/**
 * Wrap a collection page class so clearAllFilters() returns only once the table is back.
 *
 * Clearing is server-persisted and re-queries the collection, and every caller clicks a column header
 * straight after. That click waits for a header AND a named column, stricter than what exists
 * mid-rebuild, so without this it burned its whole 10s and failed.
 *
 * @param {Function} Base a CollectionPage (or subclass) constructor
 */
function settled(Base) {
  return class extends Base {
    async clearAllFilters() {
      await super.clearAllFilters();
      // Gate on a ROW, not on "TableHeaders". The header container was too weak a signal: it went
      // visible while the named column had not rendered, so the reload never fired and the caller's
      // click failed on the column anyway - which is exactly how the agent still failed after the
      // first version of this. A visible row means the columns are laid out. Sound here because
      // clearing filters precedes it, so the collection is unfiltered and Lisa's three always have
      // data.
      await waitForTable(
        this.page,
        async () => {
          await this.reload();
          await this.open();
          await super.clearAllFilters();
        },
        ['TableRow_0']
      );
      return this;
    }
  };
}


/**
 * Screenshot masks covering the editor tab strip.
 *
 * A tab label is the document name plus a "*" while the document counts as modified, and a
 * brand-new empty editor is not reliably one or the other: the SAME build agent produced a tab with
 * the marker and a baseline without it, a 391-pixel failure over nothing else. So the strip cannot
 * be asserted by a screenshot. What the "new empty editor" shots document is the layout of an empty
 * editor, and the sidebar still shows which section is open, so nothing identifying is lost.
 *
 * Rects, not a ["Tab1"] path: Tab1 is the document tab in the role editor but a HIDDEN element in
 * the user editor, where waiting for it to be visible timed out and failed the test. A rect mask
 * also copes with "no tab open at all", which a path cannot.
 *
 * Measured, not assumed: this covers the whole strip including the collection tab. slice(1) was
 * meant to spare that one, but the visible Tab* elements do not come out in the order that assumed,
 * and the rendered result masks the lot. Left as it is because it is stable and the strip carries
 * nothing the sidebar does not.
 *
 * fixedWidth because a tab is only as wide as its label, and the marker changes that width - a tight
 * mask would leave a sliver of the difference exposed at its own edge.
 */
async function documentTabMasks(page, fixedWidth = 260) {
  const rects = await page.evaluate(() =>
    Array.from(document.querySelectorAll('[objectName^="Tab"][visible]'))
      .map((el) => el.getBoundingClientRect())
      .filter((r) => r.width > 0 && r.height > 0)
      .map((r) => ({ x: r.x, y: r.y, width: r.width, height: r.height }))
  );
  return rects.slice(1).map((r) => ({ ...r, fixedWidth }));
}

module.exports = { settled, waitForTable, documentTabMasks, FIRST_WAIT, RETRY_WAIT };
