// Licenses COLLECTION view.
//
// The largest of Lisa's three collections. LicensesPage.acc gives it one column the other two do not
// have - "Product-ID" (productId), the product a license definition belongs to - so that is sorted
// here as well.

const fixtures = require('../fixtures/test');
const { defineCollectionSpec } = require('imtcore-gui-testkit/specs/collectionSpec');
const { COLLECTION_FILTERS, MASK_COLUMNS } = require('../pages');
const { refuse } = require('../fixtures/refuse');

const { test, expect } = fixtures;

defineCollectionSpec({ ...fixtures, defineTest: (...args) => fixtures.test(...args) }, {
  title: 'Licenses / collection',
  pageId: 'Licenses',
  requires: 'ViewLicensesDefinition',
  prefix: 'licenses',
  filters: COLLECTION_FILTERS,
  maskColumns: MASK_COLUMNS,
  // 68 licences and no natural order once the filters are cleared - without this every screenshot of
  // the table is a different arrangement of the same rows. License Name is unique, so it gives one.
  scenarios: [
    { name: 'filter-text', title: 'filter - text search', search: 'Camera' },
    {
      name: 'filter-creation-date',
      title: 'filter - creation date preset',
      dateFilter: 'creationDate',
      preset: 'Year_Last',
    },
    {
      name: 'remove-dialog',
      title: 'remove confirmation dialog',
      command: 'Remove',
      requires: 'RemoveLicenseDefinition',
    },
  ],

  extra: (ctx) => {
    // Counted, not screenshotted. Clearing the filters clears the SORTING too, and an unsorted licence
    // list comes back from the server in no particular order - the same 68 rows in a different
    // sequence on the next run, which is a 32031-pixel diff that says nothing about the filters. The
    // claim here is "clearing brings the whole collection back", and a count says exactly that.
    ctx.test('clearing every filter brings the whole collection back', async () => {
      const licenses = ctx.collection;
      if (!(await licenses.table.hasRows())) refuse('the Licenses collection came back empty');

      // Asserted on the CONTENT of the rows, not on how many there are and not on a picture.
      //
      // A count does not work: the page holds at most 25 rows, and a search that still matches more
      // than that leaves it just as full as before (measured - "Camera" matches most of the licence
      // list). A screenshot does not work either: clearing the filters clears the SORTING with them,
      // and an unsorted list comes back from the server in a different sequence every run.
      //
      // What is true regardless: while the filter is on, every row on screen matches it - and once it
      // is off, rows that do not match are back.
      await licenses.search('Camera');
      const filtered = await licenses.table.columnValues('licenseName');
      expect(filtered.length, 'the search should still leave something on screen').toBeGreaterThan(0);
      expect(
        filtered.filter((name) => !name.toLowerCase().includes('camera')),
        'every row under the filter should match it'
      ).toEqual([]);

      await licenses.clearAllFilters();
      const cleared = await licenses.table.columnValues('licenseName');
      expect(
        cleared.some((name) => !name.toLowerCase().includes('camera')),
        'clearing the filter should bring back rows it was hiding'
      ).toBe(true);
    });

    ctx.test('selecting a row enables Edit', async () => {
      const licenses = ctx.collection;
      if (!(await licenses.table.hasRows())) refuse('the Licenses collection came back empty');
      await licenses.selectRow(0);
      await ctx.gui.expectVisible(ctx.page, ['CommandsView', 'EditButton'], 'Edit should be offered for a selected row');
      await ctx.gui.checkScreenshot(ctx.page, 'licenses-row-selected', () => licenses.masks());
    });
  },
});
