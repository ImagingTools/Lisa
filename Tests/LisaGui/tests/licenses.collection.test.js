// Licenses COLLECTION view.
//
// The largest of Lisa's three collections, so it is the one where pagination is actually exercised
// rather than skipped for want of a second page. LicensesPage.acc gives it one column the other two
// do not have - "Product-ID" (productId), the product a license definition belongs to - so that is
// sorted here as well.

const fixtures = require('../fixtures/test');
const { defineCollectionSpec } = require('imtcore-gui-testkit/specs/collectionSpec');
const { COLLECTION_FILTERS, MASK_COLUMNS } = require('../pages');

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
  title: 'Licenses / collection',
  pageId: 'Licenses',
  requires: 'ViewLicensesDefinition',
  prefix: 'licenses',
  filters: COLLECTION_FILTERS,
  maskColumns: MASK_COLUMNS,
  // 68 licences and no natural order once the filters are cleared - without this every screenshot of
  // the table is a different arrangement of the same rows. License Name is unique, so it gives one.
  stableSort: 'licenseName',
  scenarios: [
    { name: 'filter-text', title: 'filter - text search', search: 'Camera' },
    {
      name: 'filter-creation-date',
      title: 'filter - creation date preset',
      dateFilter: 'creationDate',
      preset: 'Year_Last',
    },
    { name: 'sort-license-name', title: 'sort by license name', sort: 'licenseName' },
    { name: 'pagination', title: 'pagination - page size and navigation', pagination: { size: 50, page: 2 } },
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
      test.skip(!(await licenses.table.hasRows()), 'this collection is empty');

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
    // Sorting by Product-ID is asserted, not screenshotted. Dozens of licences share one product, and
    // rows that tie come back in no defined order - so the picture differs between runs while the sort
    // is perfectly correct (measured: a 19537-pixel diff on a correctly ordered list). What the test
    // actually means is "the column comes out ordered", so that is what it checks, in both directions.
    ctx.test('sort by product id orders the column', async () => {
      const collection = ctx.collection;
      test.skip(!(await collection.table.hasRows()), 'this collection is empty');

      // Asserted over the rows that are ON SCREEN, and only in ways that hold for them.
      //
      // The whole ordering is not readable: the table is paginated AND virtualised, so the DOM only
      // ever holds the handful of rows currently rendered - raising the page size does not add them
      // (measured). Ascending and descending therefore show different subsets, which rules out
      // comparing one against the reverse of the other.
      //
      // What does hold on any subset of a sorted list: equal values sit together, so no value appears
      // in two separate runs. And flipping the direction must change which value comes first.
      await collection.table.sortBy('productId');
      const up = valueRuns(await collection.table.columnValues('productId'));
      expect(up.length, 'a sorted column visits each value once, so equal rows sit together').toBe(
        new Set(up).size
      );
      test.skip(up.length < 2, 'every row on screen shares one value, so there is no order to see');

      await collection.table.sortBy('productId');
      const down = valueRuns(await collection.table.columnValues('productId'));
      expect(down.length, 'still grouped after the second click').toBe(new Set(down).size);
      expect(down[0], 'a second click sorts the other way round').not.toBe(up[0]);
    });

    ctx.test('selecting a row enables Edit', async () => {
      const licenses = ctx.collection;
      test.skip(!(await licenses.table.hasRows()), 'the license collection is empty');
      await licenses.selectRow(0);
      await ctx.gui.expectVisible(ctx.page, ['CommandsView', 'EditButton'], 'Edit should be offered for a selected row');
      await ctx.gui.checkScreenshot(ctx.page, 'licenses-row-selected', await licenses.masks());
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
        const dialog = await ctx.collection.openColumnConfig('licenseName');
        await ctx.gui.checkScreenshot(ctx.page, 'licenses-column-config-dialog');
        await dialog.cancel();
      });

      // "Last Modified" (timeStamp) is last in the page's header list, so it is the dialog's last row
      // whatever the current order is.
      ctx.test('unticking a column then Cancel leaves the table alone', async () => {
        const dialog = await ctx.collection.openColumnConfig('licenseName');
        await dialog.toggleColumn((await dialog.rowCount()) - 1);
        await dialog.cancel();
        await ctx.gui.expectVisible(ctx.page, ['TableHeaders', 'timeStamp'], 'Cancel must not apply the unticked column');
      });

      ctx.test('Reset asks first, and No leaves the layout as it was', async () => {
        const collection = ctx.collection;
        const headersBefore = await collection.table.headerOrder();

        const dialog = await collection.openColumnConfig('licenseName');
        await dialog.reset();
        await ctx.gui.expectVisible(ctx.page, ['YesButton'], 'Reset should ask before discarding the layout');
        await ctx.gui.checkScreenshot(ctx.page, 'licenses-column-reset-confirm');

        await dialog.cancelReset();
        await dialog.cancel();
        expect(await collection.table.headerOrder(), 'declining the reset must change nothing').toEqual(
          headersBefore
        );
      });
    });
  },
});
