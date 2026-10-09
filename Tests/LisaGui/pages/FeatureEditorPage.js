// FeatureEditorPage - the document editor opened from the Features page (New / Edit).
//
// Flow (ImtCore/Qml/imtlicgui/FeatureCollectionView.qml + FeatureEditor.qml):
//   * "New"  -> the Collection Document Service opens a fresh document and a tab bound to an empty
//              FeatureData.
//   * "Edit" -> opens the selected row's document; GqlRequestDocumentDataController fetches it and
//              fills the editor's FeatureData model.
//   * "Save"/"Undo"/"Redo" are the document command bar (PackagesPage.acc's StandardDocumentCommands).
//   * "InsertFeature"/"RemoveFeature" are command-bar commands too, and they act on the Sub-features
//     page's explorer (FeatureEditor.qml's commandsDelegateComp routes them there) - so they only do
//     anything while that page is the one on screen.
//
// MultiPageView pages (nav items are "Page_<id>"):
//   General      - name, id, description, Optional, Permission
//   Sub-features - a TreeExplorerView of the feature's own tree, with a Dependencies side panel
//
// A feature needs BOTH a name and an id before it may own sub-features (FeatureEditor.qml's
// itemIsComplete); the explorer's create command stays inactive until then, and says so in its hint.

const { BasePage } = require('imtcore-gui-testkit/pages/BasePage');
const { TextInput, Switch, TreeExplorer } = require('imtcore-gui-testkit/controls');
const gui = require('imtcore-gui-testkit/lib/gui');

class FeatureEditorPage extends BasePage {
  constructor(page) {
    // The editor is a document tab, not a menu page; the pageId is only what BasePage would navigate
    // back to, and the command bar / tab handling is what is actually reused here.
    super(page, 'Features');

    // General page
    this.featureName = new TextInput(page, ['FeatureNameInput']);
    this.featureId = new TextInput(page, ['FeatureIdInput']);
    this.description = new TextInput(page, ['DescriptionInput']);
    this.optional = new Switch(page, ['OptionalSwitch']);
    this.permission = new Switch(page, ['PermissionSwitch']);

    // Sub-features page
    this.subfeatures = new TreeExplorer(page, 'SubfeaturesExplorer');
    this.dependencies = this.subfeatures.panel('DependenciesPanel');
  }

  // --- MultiPageView navigation -----------------------------------------------------------------

  async openEditorPage(pageId) {
    await gui.clickButton(this.page, [`Page_${pageId}`]);
    return this;
  }

  openGeneral() {
    return this.openEditorPage('General');
  }

  openSubfeatures() {
    return this.openEditorPage('Subfeatures');
  }

  // --- General page -----------------------------------------------------------------------------

  /**
   * Fill the whole General page. The id is derived from the name when it is left empty, and every
   * field writes into the document, but both happen on `onEditingFinished` - i.e. when the field is
   * LEFT, not while it is being typed into. Typing alone therefore changes nothing: the id stays
   * empty and the document stays clean. Tab is what a user presses (the fields declare
   * KeyNavigation.tab between them for exactly this), so each fill is followed by one.
   */
  async fillGeneral({ name, id, description } = {}) {
    await this.openGeneral();
    if (name !== undefined) await this.fillAndCommit(this.featureName, name);
    if (id !== undefined) await this.fillAndCommit(this.featureId, id);
    if (description !== undefined) await this.fillAndCommit(this.description, description);
    return this;
  }

  /**
   * Type into a field and then LEAVE it, which is what makes onEditingFinished run.
   *
   * Leaving is a click elsewhere, not a Tab keypress. The WASM bridge overlays a real DOM <input> on
   * the canvas, so a Tab sent to the page moves DOM focus rather than reliably reaching Qt's own
   * KeyNavigation - it commits the field sometimes and silently does nothing other times (seen live:
   * the same sequence derived the id when driven by hand and left it empty inside the spec). Clicking
   * the page's own nav item always blurs, changes nothing else (the page is already the current one),
   * and cannot open a popup the way clicking a neighbouring combo would.
   */
  async fillAndCommit(field, text) {
    await field.fill(text);
    await gui.clickButton(this.page, ['Page_General']);
    return this;
  }

  async toggleOptional() {
    await this.openGeneral();
    await this.optional.toggle();
    return this;
  }

  async togglePermission() {
    await this.openGeneral();
    await this.permission.toggle();
    return this;
  }

  // --- editor commands --------------------------------------------------------------------------

  undo() {
    return this.runCommand('Undo');
  }

  redo() {
    return this.runCommand('Redo');
  }

  /**
   * Add a sub-feature at the level the explorer is currently showing, then fill it in.
   *
   * "New sub-feature" creates a COMPLETE row rather than a blank one: createSubFeature() gives it a
   * generated, unique name and id ("Feature Name" / "FeatureName", numbered when taken) and leaves it
   * closed and unselected - deliberately, so it does not steal whatever the user had ticked. Typing
   * into it is therefore a second step: select it, open it with Edit, type, commit. Passing no values
   * exercises just the creation, which is a real flow of its own.
   *
   * Both routes to creating one exist in the product - the command bar's "InsertFeature" and the
   * explorer's own button - and end in the same createSubFeature(). This drives the explorer's, the
   * one a user reaches for while looking at the table.
   *
   * @param {number} index where the new row lands; it is appended, so the caller passes the old count
   */
  async addSubFeature({ name, id, description, index } = {}) {
    await this.openSubfeatures();
    const before = index === undefined ? await this.subfeatures.rowCount() : index;
    await this.subfeatures.create();
    if (name === undefined && id === undefined && description === undefined) return this;
    await this.editSubFeatureRow(before);
    await this.fillOpenSubFeatureRow({ name, id, description });
    await this.commitSubFeatureRow();
    return this;
  }

  /**
   * Type into the row the explorer currently has open for editing. The cells only become text fields
   * in edit mode (EditableTableCell), so this is not usable on a closed row.
   */
  async fillOpenSubFeatureRow({ name, id, description } = {}) {
    if (name !== undefined) await gui.fill(this.page, ['SubfeatureNameCell'], name);
    if (id !== undefined) await gui.fill(this.page, ['SubfeatureIdCell'], id);
    if (description !== undefined) await gui.fill(this.page, ['SubfeatureDescriptionCell'], description);
    return this;
  }

  /** Open a row for inline editing (the toolbar's Edit; F2 and the row's pencil do the same). */
  async editSubFeatureRow(index) {
    await this.subfeatures.selectRow(index);
    await this.subfeatures.editRow();
    return this;
  }

  /** Apply the open row's drafts - one model change, so one undo step (FeatureEditor's commitEditing). */
  commitSubFeatureRow() {
    return this.subfeatures.commitRow();
  }

  /** Drop the open row's drafts. */
  cancelSubFeatureRow() {
    return this.subfeatures.cancelRow();
  }

  /**
   * Descend into a row's own sub-features via its count chip - there is no separate open button on the
   * row, the chip is the way down (FeatureEditor.qml's subfeaturesCell).
   */
  async openSubFeatureLevel(index) {
    await gui.click(this.page, [`ExplorerRow_${index}`, 'SubfeatureCountCell'], {
      what: `the sub-features chip of row ${index}`,
    });
    return this;
  }

  /** Remove the ticked rows (or the selected one when nothing is ticked). */
  async removeSubFeatures(index = 0) {
    await this.subfeatures.selectRow(index);
    await this.subfeatures.removeRows();
    return this;
  }

  /**
   * Whether the sub-feature at `index` currently reads as Optional. The switch is driven by hand
   * rather than bound (see FeatureEditor.qml's syncSwitches), so this asks the rendered control.
   */
  isSubFeatureOptional(index) {
    return gui.dom.isVisible(this.page, [`ExplorerRow_${index}`, 'SubfeatureOptionalCell', 'SwitchButton'], 1000);
  }

  /** Toggle the open row's Optional switch. Only a leaf row carries one. */
  toggleSubFeatureOptional(index) {
    return gui.click(this.page, [`ExplorerRow_${index}`, 'SubfeatureOptionalCell', 'SwitchButton'], {
      what: `row ${index} Optional switch`,
    });
  }

  /** Toggle the open row's Permission switch. */
  toggleSubFeaturePermission(index) {
    return gui.click(this.page, [`ExplorerRow_${index}`, 'SubfeaturePermissionCell', 'SwitchButton'], {
      what: `row ${index} Permission switch`,
    });
  }
}

module.exports = { FeatureEditorPage };
