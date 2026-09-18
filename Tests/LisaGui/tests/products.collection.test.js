// Products COLLECTION view.
//
// Standard where it is standard (declared), and then the two commands only Products has: Import and
// Export (ImtCore/Qml/imtlicgui/ProductCollectionViewCommandsDelegate.qml). Both end in a NATIVE file
// dialog, which is outside Playwright's DOM - so what is actually testable is the warning Import shows
// BEFORE the picker, and the fact that Export is offered for a selected row and not otherwise.

const fixtures = require('../fixtures/test');
const { defineCollectionSpec } = require('imtcore-gui-testkit/specs/collectionSpec');
const { ProductCollectionPage } = require('../pages');
const { refuse } = require('../fixtures/refuse');

const { test, expect } = fixtures;

// The distinct values of a column, in the order they first appear. A sorted column visits each value
// exactly once - so if this has no repeats, equal rows are contiguous, which is what "sorted" means
// here without having to know HOW the server compares two strings. It does not use the same rules as
// JavaScript: the server returns "RTV.3d Hardware" < "RTV.3dSoftware" < "RTV.tSoftware", while
// localeCompare puts the last one first. Asserting against a comparator of our own would be asserting
// our guess about the collation, not the product's behaviour.
function valueRuns(values) {
  const runs = [];
  for (const value of values) {
    if (runs.length === 0 || runs[runs.length - 1] !== value) runs.push(value);
  }
  return runs;
}

defineCollectionSpec({ ...fixtures, defineTest: (...args) => fixtures.test(...args) }, {
  title: 'Products / collection',
  pageId: 'Products',
  requires: 'ViewProducts',
  prefix: 'products',
  createPage: (page) => new ProductCollectionPage(page),
  stableSort: 'productName',
  scenarios: [
    { name: 'filter-text', title: 'filter - text search', search: 'RTV.3d' },
    {
      name: 'filter-creation-date',
      title: 'filter - creation date preset',
      dateFilter: 'creationDate',
      preset: 'Year_Last',
    },
    { name: 'filter-cleared', title: 'filter - clear all', clearAll: true, apply: [{ search: 'RTV.3d' }] },
    { name: 'sort-product-name', title: 'sort by product name', sort: 'productName' },
    { name: 'pagination', title: 'pagination - page size and navigation', pagination: { size: 50, page: 2 } },
    { name: 'remove-dialog', title: 'remove confirmation dialog', command: 'Remove', requires: 'RemoveProduct' },
  ],

  extra: (ctx) => {
    // Category is asserted, not screenshotted: it holds two values across the whole collection, so the
    // rows that tie come back in no defined order and the picture differs between runs while the sort
    // is correct. Ordering is what the test means - see the same treatment of Product-ID in
    // licenses.collection.test.js.
    ctx.test('sort by category orders the column', async () => {
      const collection = ctx.collection;
      if (!(await collection.table.hasRows())) refuse('the Products collection came back empty');

      // Asserted over the rows that are ON SCREEN, and only in ways that hold for them.
      //
      // The whole ordering is not readable: the table is paginated AND virtualised, so the DOM only
      // ever holds the handful of rows currently rendered - raising the page size does not add them
      // (measured). Ascending and descending therefore show different subsets, which rules out
      // comparing one against the reverse of the other.
      //
      // What does hold on any subset of a sorted list: equal values sit together, so no value appears
      // in two separate runs. And flipping the direction must change which value comes first.
      await collection.table.sortBy('categoryId');
      const up = valueRuns(await collection.table.columnValues('categoryId'));
      expect(up.length, 'a sorted column visits each value once, so equal rows sit together').toBe(
        new Set(up).size
      );
      test.skip(up.length < 2, 'every row on screen shares one value, so there is no order to see');

      await collection.table.sortBy('categoryId');
      const down = valueRuns(await collection.table.columnValues('categoryId'));
      expect(down.length, 'still grouped after the second click').toBe(new Set(down).size);
      expect(down[0], 'a second click sorts the other way round').not.toBe(up[0]);
    });

    // The warning is the point of this flow, not a formality: importing a product always writes the
    // features the file carries into the SHARED feature collection, replacing the ones already there,
    // so other products and licenses using them get the replacement too. Cancelled deliberately - Yes
    // opens the native file dialog, which no browser-driven test can answer.
    ctx.test('import warns about overwriting features before opening the file picker', async () => {
      const products = ctx.collection;
      await products.importProduct();
      await ctx.gui.expectVisible(ctx.page, ['Dialog'], 'import should warn before touching anything');
      await ctx.gui.checkScreenshot(ctx.page, 'products-import-warning');
      await ctx.gui.dismissDialog(ctx.page);
    });

    ctx.test('export is offered for a selected product', async () => {
      const products = ctx.collection;
      if (!(await products.table.hasRows())) refuse('the Products collection came back empty');
      await products.selectRow(0);
      await ctx.gui.expectVisible(ctx.page, ['CommandsView', 'ExportButton'], 'Export should be offered for a row');
      // Clicking it opens the native save dialog, outside the DOM - this records the state it is
      // invoked from, which is as far as a browser-driven test can honestly go.
      await ctx.gui.checkScreenshot(ctx.page, 'products-before-export', await products.masks());
    });

    // Column configuration, exercised READ-ONLY: every path ends in Cancel or No.
    //
    // The layout these dialogs edit is stored per USER on the server, and the whole suite is signed in
    // as one user - so an Apply here is immediately visible to every test running beside this one. It
    // was: an applied reorder put a differently-arranged table behind an unrelated editor screenshot,
    // a 28987-pixel diff with nothing wrong in either view. What Apply itself does is therefore not
    // covered; the dialog's own behaviour is.
    test.describe.serial('column configuration (header right-click)', () => {
      ctx.test('opens via header right-click', async () => {
        const dialog = await ctx.collection.openColumnConfig('productName');
        await ctx.gui.checkScreenshot(ctx.page, 'products-column-config-dialog');
        await dialog.cancel();
      });

      // "Last Modified" (timeStamp) is last in the page's header list, so it is the dialog's last row
      // whatever the current order is.
      ctx.test('unticking a column then Cancel leaves the table alone', async () => {
        const dialog = await ctx.collection.openColumnConfig('productName');
        await dialog.toggleColumn((await dialog.rowCount()) - 1);
        await dialog.cancel();
        await ctx.gui.expectVisible(ctx.page, ['TableHeaders', 'timeStamp'], 'Cancel must not apply the unticked column');
      });

      ctx.test('Reset asks first, and No leaves the layout as it was', async () => {
        const collection = ctx.collection;
        const headersBefore = await collection.table.headerOrder();

        const dialog = await collection.openColumnConfig('productName');
        await dialog.reset();
        await ctx.gui.expectVisible(ctx.page, ['YesButton'], 'Reset should ask before discarding the layout');
        await ctx.gui.checkScreenshot(ctx.page, 'products-column-reset-confirm');

        await dialog.cancelReset();
        await dialog.cancel();
        expect(await collection.table.headerOrder(), 'declining the reset must change nothing').toEqual(
          headersBefore
        );
      });
    });
  },
});
