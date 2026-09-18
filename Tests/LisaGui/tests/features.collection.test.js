// Features COLLECTION view - declared where it is standard, written where it is not.
//
// The scenarios below are the shape every collection in this product has (filter, sort, paginate, open
// a row's dialog), so they are declared and the kit generates them: the shared page, the filter reset
// between tests and the timestamp masking all come from there.
//
// `extra` is the rest - what a declaration cannot express. Features has no filters of its own beyond
// the creation-date one every collection carries (PackagesPage.acc's FilterableHeaderIds are all
// text columns, served by the search box), so the interesting part here is the column-configuration
// dialog and the fact that Edit opens a document tab.

const fixtures = require('../fixtures/test');
const { defineCollectionSpec } = require('imtcore-gui-testkit/specs/collectionSpec');
const { COLLECTION_FILTERS, MASK_COLUMNS } = require('../pages');
const { refuse } = require('../fixtures/refuse');

const { test, expect } = fixtures;

defineCollectionSpec({ ...fixtures, defineTest: (...args) => fixtures.test(...args) }, {
  title: 'Features / collection',
  pageId: 'Features',
  requires: 'ViewFeatures',
  prefix: 'features',
  filters: COLLECTION_FILTERS,
  maskColumns: MASK_COLUMNS,
  stableSort: 'featureName',
  scenarios: [
    { name: 'filter-text', title: 'filter - text search', search: 'Data' },
    {
      name: 'filter-creation-date',
      title: 'filter - creation date preset',
      dateFilter: 'creationDate',
      preset: 'Year_Last',
    },
    { name: 'filter-cleared', title: 'filter - clear all', clearAll: true, apply: [{ search: 'Data' }] },
    // sortBy addresses a column by its header id, not its visible caption - PackagesPage.acc orders
    // HeaderIds and HeaderNames independently ("Feature-ID" -> "featureId").
    { name: 'sort-feature-name', title: 'sort by feature name', sort: 'featureName' },
    { name: 'sort-feature-id', title: 'sort by feature id', sort: 'featureId' },
    { name: 'pagination', title: 'pagination - page size and navigation', pagination: { size: 50, page: 2 } },
    { name: 'remove-dialog', title: 'remove confirmation dialog', command: 'Remove', requires: 'RemoveFeature' },
  ],

  extra: (ctx) => {
    ctx.test('selecting a row enables Edit', async () => {
      const features = ctx.collection;
      if (!(await features.table.hasRows())) refuse('the Features collection came back empty');
      await features.selectRow(0);
      await ctx.gui.expectVisible(ctx.page, ['CommandsView', 'EditButton'], 'Edit should be offered for a selected row');
      await ctx.gui.checkScreenshot(ctx.page, 'features-row-selected', await features.masks());
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
        const dialog = await ctx.collection.openColumnConfig('featureName');
        await ctx.gui.checkScreenshot(ctx.page, 'features-column-config-dialog');
        await dialog.cancel();
      });

      // "Last Modified" (timeStamp) is last in the page's header list, so it is the dialog's last row
      // whatever the current order is.
      ctx.test('unticking a column then Cancel leaves the table alone', async () => {
        const dialog = await ctx.collection.openColumnConfig('featureName');
        await dialog.toggleColumn((await dialog.rowCount()) - 1);
        await dialog.cancel();
        await ctx.gui.expectVisible(ctx.page, ['TableHeaders', 'timeStamp'], 'Cancel must not apply the unticked column');
      });

      // Asserted on the DIALOG's list, not on the table: reading the table back would need an Apply.
      ctx.test('Move Up reorders the dialog list, and Cancel throws it away', async () => {
        const collection = ctx.collection;
        const headersBefore = await collection.table.headerOrder();

        const dialog = await collection.openColumnConfig('featureName');
        const before = await dialog.columnNames();
        expect(before.length, 'the dialog should list the columns by name').toBeGreaterThan(1);

        await dialog.selectColumn(1);
        await dialog.moveUp();

        const after = await dialog.columnNames();
        expect(after[0], 'Move Up should lift the second column above the first').toBe(before[1]);
        expect(after[1], '... and push the first one after it').toBe(before[0]);

        await dialog.cancel();
        expect(await collection.table.headerOrder(), 'Cancel must leave the table untouched').toEqual(
          headersBefore
        );
      });

      ctx.test('Reset asks first, and No leaves the layout as it was', async () => {
        const collection = ctx.collection;
        const headersBefore = await collection.table.headerOrder();

        const dialog = await collection.openColumnConfig('featureName');
        await dialog.reset();
        await ctx.gui.expectVisible(ctx.page, ['YesButton'], 'Reset should ask before discarding the layout');
        await ctx.gui.checkScreenshot(ctx.page, 'features-column-reset-confirm');

        await dialog.cancelReset();
        await dialog.cancel();
        expect(await collection.table.headerOrder(), 'declining the reset must change nothing').toEqual(
          headersBefore
        );
      });
    });
  },
});
