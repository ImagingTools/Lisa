// Lisa-only: make clearAllFilters() wait for the collection to come back.
//
// Three specs failed on the build agent and the failing test moved from run to run, but every one
// died in the same place - the sortBy() immediately after clearAllFilters():
//
//     GUI target not found: [TableHeaders > productName] after 10000ms
//         TableHeaders: present but not visible (2 in DOM)
//
// Two TableHeaders in the DOM is the tell. Clearing filters is server-persisted and re-queries the
// collection, so the view is still being rebuilt when the next click lands. That click waits for a
// header AND a named column, which is stricter than what exists mid-rebuild, so it burns its whole
// 10s. Waiting for "TableHeaders" alone first is enough.
//
// Deliberately NOT in imtcore-gui-testkit, although clearAllFilters() lives there: ProLife calls it
// from 7 places and from four multiuser specs that run as restricted users, where a collection may
// legitimately render no table at all - there this wait would end in a throw and turn passing tests
// red. Agentino never calls it. The failure has only ever been seen in Lisa, so the fix stays here.

const gui = require('imtcore-gui-testkit/lib/gui');

const SETTLE_TIMEOUT = 5000;

/**
 * Wrap a collection page class so clearAllFilters() returns only once the table is back.
 * @param {Function} Base a CollectionPage (or subclass) constructor
 */
function settled(Base) {
  return class extends Base {
    async clearAllFilters() {
      await super.clearAllFilters();
      await gui.dom.isVisible(this.page, ['TableHeaders'], SETTLE_TIMEOUT);
      return this;
    }
  };
}

module.exports = { settled, SETTLE_TIMEOUT };
