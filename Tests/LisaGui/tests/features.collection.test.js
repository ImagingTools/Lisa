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
  scenarios: [
    { name: 'filter-text', title: 'filter - text search', search: 'Data' },
    {
      name: 'filter-creation-date',
      title: 'filter - creation date preset',
      dateFilter: 'creationDate',
      preset: 'Year_Last',
    },
    { name: 'filter-cleared', title: 'filter - clear all', clearAll: true, apply: [{ search: 'Data' }] },
    { name: 'remove-dialog', title: 'remove confirmation dialog', command: 'Remove', requires: 'RemoveFeature' },
  ],

  extra: (ctx) => {
    ctx.test('selecting a row enables Edit', async () => {
      const features = ctx.collection;
      if (!(await features.table.hasRows())) refuse('the Features collection came back empty');
      await features.selectRow(0);
      await ctx.gui.expectVisible(ctx.page, ['CommandsView', 'EditButton'], 'Edit should be offered for a selected row');
      await ctx.gui.checkScreenshot(ctx.page, 'features-row-selected', () => features.masks());
    });
  },
});
