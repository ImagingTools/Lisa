// Workspace - the landing page (pageId "Workspace"): a collection of USER ACTIONS, with a per-user
// filter and the creation-date filter every Lisa collection carries.
//
// It is a standard collection view, so most of it is declared. The one thing worth spelling out is
// that it is legitimately EMPTY on a freshly restored database: nothing has been done yet, so there
// are no actions to list. Every test that needs a row therefore asks first and skips on a genuinely
// empty collection rather than failing on it - see Table.hasRows, which distinguishes "empty" from
// "slow to paint".

const fixtures = require('../fixtures/test');
const { defineCollectionSpec } = require('imtcore-gui-testkit/specs/collectionSpec');

const { test } = fixtures;

defineCollectionSpec({ ...fixtures, defineTest: (...args) => fixtures.test(...args) }, {
  title: 'Workspace / user actions',
  pageId: 'Workspace',
  requires: 'ViewWorkspace',
  prefix: 'workspace',
  filters: { user: 'userId', creationDate: 'CreationDateFilter' },
  // "Last Modified" is when the action happened - different on every run by definition.
  maskColumns: ['timeStamp'],
  scenarios: [
    { name: 'filter-text', title: 'filter - text search', search: 'Created' },
    {
      name: 'filter-creation-date',
      title: 'filter - creation date preset',
      dateFilter: 'creationDate',
      preset: 'Year_Current',
    },
    // The user filter is populated from the users that actually appear in the action log, so on a
    // database where nothing has been done yet it offers nothing - `optionIndex` with the scenario
    // guarded below is the honest way to drive it.
    { name: 'filter-cleared', title: 'filter - clear all', clearAll: true, apply: [{ search: 'Created' }] },
    { name: 'sort-action-type', title: 'sort by action type', sort: 'actionType' },
    { name: 'pagination', title: 'pagination - page size and navigation', pagination: { size: 50, page: 2 } },
  ],

  extra: (ctx) => {
    ctx.test('the user filter lists whoever appears in the action log', async () => {
      const workspace = ctx.collection;
      const options = await workspace.filters.combo(workspace.filterId('user')).optionCount();
      // Zero is a real state, not a failure: an untouched database has no actions and therefore no
      // users to filter by. Asserting a fixed number here would just encode today's fixture data.
      test.skip(options === 0, 'no user actions recorded yet, so the user filter has nothing to offer');
      await workspace.selectFilterOptionByIndex('user', 0);
      await ctx.gui.checkScreenshot(ctx.page, 'workspace-filter-user', await workspace.masks());
    });
  },
});
