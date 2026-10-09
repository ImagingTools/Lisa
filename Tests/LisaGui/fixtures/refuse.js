// One way out of "the client did not offer this".
//
// Every spec here signs in as `su`, whose permissions are ['*'] (fixtures/users.js). So when a page,
// a command or a populated collection is not there, nobody is being refused anything - the client or
// the server failed to produce it, and that is a defect, not a reason to stand down.
//
// This exists because standing down was the default and it was costing the suite its meaning. The
// availability probes answered "not offered" whenever an async round-trip outran a two-second look,
// and a `beforeEach` then skipped a whole `describe.serial` block with no reason in the terminal -
// between 12 and 100 tests a run, on identical code and data. Once it happened while the application
// was completely broken (a server built against mismatched libraries showed an empty menu) and the
// run still reported "All tests passed" for everything it had quietly not done.
//
// The probe itself is fixed upstream - imtcore-gui-testkit/lib/dom.js's isOffered waits for the
// SIBLINGS of what it is looking for before answering. This is the second half: whatever still gets
// through must be loud.
//
// Use test.skip() only where the answer genuinely varies with the data - a product that has no
// optional parts, a licence whose product has no siblings. Not for anything the fixture backup
// guarantees.

function refuse(what) {
  throw new Error(
    `${what} - the suite signs in as "su" with permissions ["*"], so this is the client or the ` +
      'server failing to offer it, not a user who may not have it'
  );
}

module.exports = { refuse };
