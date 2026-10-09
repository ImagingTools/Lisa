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

const { test } = fixtures;

defineCollectionSpec({ ...fixtures, defineTest: (...args) => fixtures.test(...args) }, {
  title: 'Products / collection',
  pageId: 'Products',
  requires: 'ViewProducts',
  prefix: 'products',
  createPage: (page) => new ProductCollectionPage(page),
  scenarios: [
    { name: 'filter-text', title: 'filter - text search', search: 'RTV.3d' },
    {
      name: 'filter-creation-date',
      title: 'filter - creation date preset',
      dateFilter: 'creationDate',
      preset: 'Year_Last',
    },
    { name: 'filter-cleared', title: 'filter - clear all', clearAll: true, apply: [{ search: 'RTV.3d' }] },
    { name: 'remove-dialog', title: 'remove confirmation dialog', command: 'Remove', requires: 'RemoveProduct' },
  ],

  extra: (ctx) => {

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
      await ctx.gui.checkScreenshot(ctx.page, 'products-before-export', () => products.masks());
    });
  },
});
