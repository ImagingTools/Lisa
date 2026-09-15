# Lisa GUI tests

End-to-end tests for the Lisa web client (Qt/QML compiled to JavaScript and served by
`LisaServerTest.exe`), driven with Playwright.

Built on **`imtcore-gui-testkit`** (`ImtCore/Tests/GuiTestKit`), the framework extracted from ProLife's
GUI suite. Everything generic - the objectName locator engine, the collection/editor page-object base
classes, the fixture/global-setup/config factories - lives there. What is here is only Lisa's own:
its three document editors, its fixture user, and its CI script.

```
LisaGui/
  fixtures/users.js        the fixture users (su only, for now)
  fixtures/test.js         the test/expect/gui/newUserPage bundle
  global-setup.js          logs each fixture user in once and saves its storageState
  playwright.config.js     projects, timeouts, snapshot paths, worker count
  pages/                   Lisa's own page objects (the three editors + Products)
  tests/                   the specs
  Run-CiTests.ps1          restore DBs -> start servers -> run both phases -> tear down
```

## Running it

The whole thing, from a clean database:

```powershell
.\Run-CiTests.ps1
```

That restores `puma_test` and `lisa_test` from `Lisa/Tests/Resources/backups/`, starts
`PumaServerPgTest.exe` and `LisaServerTest.exe`, bootstraps the `su` superuser, runs Playwright in two
phases, and stops everything again.

Against servers that are already running (the fast loop while writing a test):

```powershell
$env:LISA_BASE_URL = "http://localhost:17776"
npx playwright test tests/features.editor.test.js
npx playwright test --update-snapshots          # (re)generate the screenshot baselines
```

Baselines live in `tests/__screenshots__/<project>/` and are keyed by the fixture user, so they must be
generated against a **restored** database - an un-restored rerun produces deterministic data drift that
looks exactly like flakiness.

## The two phases

Every test runs as the same fixture user against one shared database, so a test that MUTATES data
changes rows other tests are looking at. `Run-CiTests.ps1` therefore invokes Playwright twice against
the one running server:

* **phase 1** - everything except `@mutating`
* **phase 2** - only `@mutating`, `--workers=1`

The suite passes only if both do.

Everything a run writes goes under one directory:

    test-output/
      phase1-readonly/   artifacts/ (only for failures) + junit.xml
      phase2-mutating/   artifacts/ + junit.xml

Per PHASE because Playwright clears its output dir and truncates its junit file at the start of every
invocation, so one shared pair would let phase 2 wipe phase 1's evidence. The HTML report is off:
it duplicates the junit file and the diff PNGs and cost a directory per phase to say it - set
`PLAYWRIGHT_HTML_OUTPUT_DIR` to bring it back.

Read a run from `test-output/<phase>/junit.xml`. Skip reasons live there and NOT in the terminal:
Playwright prints a bare `-` for a `test.skip()` in a hook, while the XML carries
`<property name="skip" value="...">`.

## Workers

`playwright.config.js` runs the read-only phase on **four** workers, even though every spec runs as the
same single fixture user. ProLife pins one worker per user because its server keys the open-documents
workspace by userId and fans every open/close out to all of that user's sessions; Lisa measurably does
not - two concurrent `su` sessions kept their filters, their document tabs and their editor fields to
themselves, and a reload restored no tabs at all. Tabs and view state here are per SESSION.

Measured: ~250s at four workers against ~540s at one, same failures either way. The `@mutating` phase
stays serial regardless, because those tests share one database.

Adding restricted fixture users (one Playwright project each) would additionally turn the per-user
screenshots into a real permission matrix - worth doing, but unrelated to worker count here.

## Known failures

None, and no skips either: 122 passed in phase 1, 12 in phase 2, with every test actually running.

Getting there took two fixes, both worth keeping in mind before trusting a green run again.

**A crashed auth server used to look like a permission decision.** `PumaServerPgTest.exe` died with an
access violation mid-run - `imtrest::CWebSocketServerComp::SetConnectionStatus` inserted into a QMap
from a per-socket thread while the main thread removed from it under a lock. When it went down, Lisa
had no auth, the client rendered an empty menu, and every availability probe answered "not offered" -
so the suite reported 12, 26, 34, 48, once 100 tests SKIPPED and called the run green. Fixed in
ImtCore; the tell, if it ever comes back, is a dump under `%LOCALAPPDATA%CrashDumps` and a teardown
that stops only the Lisa server because Puma is already gone.

**Availability probes are anchored now.** `dom.isOffered` waits for the SIBLINGS of what it is looking
for - the other buttons on the bar, the other items in the menu - before answering, so "not offered"
can no longer mean "not painted yet". The old form was `isVisible(path, 2000)`, and the command bar
fills on a round-trip that regularly outruns two seconds under four workers.

**And nothing skips itself green any more.** `fixtures/refuse.js` is the single way out: this suite
signs in as `su` with permissions `['*']`, so a missing page, command or fixture row is a defect, and
it throws. `test.skip` is left only where the answer genuinely varies with the data - a feature with
no optional parts, a licence whose product has no siblings; 12 places, all named.

## Adding a test

A standard collection view is a declaration, not code:

```js
const fixtures = require('../fixtures/test');
const { defineCollectionSpec } = require('imtcore-gui-testkit/specs/collectionSpec');

defineCollectionSpec({ ...fixtures, defineTest: (...args) => fixtures.test(...args) }, {
  title: 'Features / collection',
  pageId: 'Features',
  requires: 'ViewFeatures',
  prefix: 'features',
  filters: { creationDate: 'CreationDateFilter' },
  maskColumns: ['added', 'timeStamp'],
  scenarios: [
    { name: 'filter-text', search: 'Data' },
    { name: 'sort-feature-name', sort: 'featureName' },
    { name: 'remove-dialog', command: 'Remove', requires: 'RemoveFeature' },
  ],
});
```

Anything a declaration cannot express stays an ordinary spec using the same page objects - the two mix
freely in one file via the declaration's `extra` hook.

Tag a test `@mutating` whenever it writes to the database, so it runs in phase 2 rather than racing the
read-only tests.

## Traps worth knowing

* **A field commits when it is LEFT, not while it is typed into.** The editors do their work in
  `onEditingFinished` (including deriving a Feature/License ID from the name), so typing alone changes
  nothing. Leave the field with a click; a Tab keypress is not reliably forwarded from the DOM `<input>`
  the WASM bridge overlays onto the canvas to Qt's own `KeyNavigation`.
* **In a `TreeExplorerView`, selecting and ticking are one set.** A selected row is already a command
  target, and ticking a row that is already selected UNTICKS it - leaving Remove with nothing to act
  on. Use `selectRow()` for the first row and `checkRow()` for each additional one.
* **Explorer rows are `ExplorerRow_<i>`, not `TableRow_<i>`.** Deliberately, so an editor's tree and the
  collection table behind it never collide.
* **Two search boxes carry the name `SearchTextInput`**: a collection's own filter box, and (until it
  was given `GlobalSearchInput`) the global one at the top of the window. `SearchPage.search()`
  addresses the global one by its own name; a page's filter box is reached through `FilterPanel`.
* **The column layout is per-USER state on the SERVER.** Applying a column change from one spec is
  immediately visible to every other spec, because the whole suite is signed in as `su` - an applied
  reorder put a differently-arranged table behind an unrelated editor screenshot, a 28987-pixel diff
  with nothing wrong in either view. The column-configuration tests therefore end in Cancel or No and
  assert the DIALOG's own list (`TableConfigDialog.columnNames()`); what Apply itself does is not
  covered. The same shared state is why the Profile dialog is screenshotted with
  `checkElementScreenshot` instead of full-page.
* **Qt paints the focus ring only for a FOCUSED window.** On the login form that makes "just wait for
  it to settle" useless: an untouched headless page came back with and without a ring on Username
  across two runs. `gui.settleLoginFocus(page, { field })` waits out AuthorizationPage.qml's 500ms
  `decoratorPause` (which re-focuses Username) and then CLICKS the field the shot wants - the click is
  what makes the ring exist at all, so naming a field is effectively mandatory.
* **The kit is COPIED into `node_modules`, not symlinked** (`.npmrc`'s `install-links=true`). An edit to
  `ImtCore/Tests/GuiTestKit/**` is invisible here until it is re-copied - `Run-CiTests.ps1` mirrors it
  before every run; by hand it is
  `robocopy ..\..\..\ImtCore\Tests\GuiTestKit node_modules\imtcore-gui-testkit /MIR`.

## Instrumentation this suite added

Lisa's editors had no `objectName`s at all, so none of the tree/panel UI was addressable. The names were
added upstream, in ImtCore, so every app that uses those controls gets them:

* `Qml/imtcontrols/Views/TreeExplorerView.qml` - breadcrumbs, toolbar commands, search, rows
  (`ExplorerRow_<i>`), row checkbox + its hit area, inline rename field, per-row edit/cancel, overflow
  menu, side panel.
* `Qml/imtcontrols/Views/CheckableListPanel.qml` - title, subtitle, action command, search, rows
  (`PanelRow_<i>`), row checkbox/title/subtitle/badge, placeholder, footer.
* `Qml/imtcontrols/Views/ToolbarButton.qml`, `EditableTableCell.qml` - the clickable surface and the
  cell's display text.
* `Qml/imtlicgui/{FeatureEditor,ProductView,LicenseEditor,FeaturesDialog}.qml` - the named fields, the
  per-row cells of the sub-feature/feature tables, and each side panel.
* `Qml/imtgui/Panels/TopCenterPanelDecorator.qml` - the global search box (`GlobalSearchInput`).

The web client is compiled from those QML sources, so a change to them needs a rebuild before it reaches
a running server:

```powershell
ninja -C Lisa\Build\CMake\build\Qt_6_8_0_msvc2022_64-Debug WebCompilerlisa
ninja -C Lisa\Build\CMake\build\Qt_6_8_0_msvc2022_64-Debug LisaServerTest
```

(from a `vcvars64` shell, with `IMTCOREDIR`/`PUMADIR`/`LISADIR`/`ACFDIR` set using forward slashes, and
with `LisaServerTest.exe` stopped so the linker can replace it).
