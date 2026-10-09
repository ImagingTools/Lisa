// LicenseEditorPage - the document editor opened from the Licenses page (New / Edit).
//
// A license definition belongs to a product and decides two things (ImtCore/Qml/imtlicgui/
// LicenseEditor.qml):
//   * which of that product's features it grants - the ticks on the Features page, where a row is
//     only tickable when it is a root feature or an OPTIONAL leaf; everything else says why instead
//     of showing a box nobody can use;
//   * which other licenses OF THE SAME PRODUCT it inherits from - the Inherited licenses page. What
//     the inherited ones grant shows up, read-only, in the Inherited features panel beside the
//     Features table.
//
// Both of those are empty until a product is chosen on the General page: the feature tree comes from
// the product, and only licenses of the same product can be inherited.
//
// MultiPageView pages ("Page_<id>"):
//   General     - license name, license id, description, product
//   Features    - TreeExplorerView of the product's features + the Inherited features side panel
//   Inheritance - the Inherited licenses panel ("Page_Inheritance")

const { BasePage } = require('imtcore-gui-testkit/pages/BasePage');
const { TextInput, ComboBox, TreeExplorer, CheckableListPanel } = require('imtcore-gui-testkit/controls');
const gui = require('imtcore-gui-testkit/lib/gui');

class LicenseEditorPage extends BasePage {
  constructor(page) {
    super(page, 'Licenses');

    // General page
    this.licenseName = new TextInput(page, ['LicenseNameInput']);
    this.licenseId = new TextInput(page, ['LicenseIdInput']);
    this.description = new TextInput(page, ['DescriptionInput']);
    this.product = new ComboBox(page, ['ProductCombo']);

    // Features page
    this.features = new TreeExplorer(page, 'LicenseFeaturesExplorer');
    this.inheritedFeatures = this.features.panel('InheritedFeaturesPanel');

    // Inherited licenses page
    this.inheritedLicenses = new CheckableListPanel(page, 'InheritedLicensesPanel');
  }

  // --- MultiPageView navigation -----------------------------------------------------------------

  async openEditorPage(pageId) {
    await gui.clickButton(this.page, [`Page_${pageId}`]);
    return this;
  }

  openGeneral() {
    return this.openEditorPage('General');
  }

  openFeatures() {
    return this.openEditorPage('Features');
  }

  openInheritance() {
    return this.openEditorPage('Inheritance');
  }

  // --- General page -----------------------------------------------------------------------------

  /**
   * Fill the General page. The id is derived from the name when left empty, and every field writes
   * into the document - but both happen on `onEditingFinished`, i.e. when the field is LEFT rather
   * than while it is typed into. So each fill is followed by a click that leaves the field.
   */
  async fillGeneral({ name, id, description } = {}) {
    await this.openGeneral();
    if (name !== undefined) await this.fillAndCommit(this.licenseName, name);
    if (id !== undefined) await this.fillAndCommit(this.licenseId, id);
    if (description !== undefined) await this.fillAndCommit(this.description, description);
    return this;
  }

  /**
   * Type into a field and then LEAVE it, which is what makes onEditingFinished run. Leaving is a
   * click elsewhere rather than a Tab keypress - see FeatureEditorPage.fillAndCommit for why a Tab
   * sent to the page does not reliably reach Qt's own KeyNavigation through the WASM bridge.
   */
  async fillAndCommit(field, text) {
    await field.fill(text);
    await gui.clickButton(this.page, ['Page_General']);
    return this;
  }

  /**
   * Pick the product this license belongs to. The combo is filled from the live product collection
   * (CachedProductCollection), so there is no stable caption to hardcode - address it by position.
   */
  async selectProductByIndex(index = 0) {
    await this.openGeneral();
    await this.product.selectIndex(index);
    return this;
  }

  /** How many products the combo currently offers - 0 when the collection is empty for this user. */
  async productOptionCount() {
    await this.openGeneral();
    return this.product.optionCount();
  }

  // --- editor commands --------------------------------------------------------------------------

  undo() {
    return this.runCommand('Undo');
  }

  redo() {
    return this.runCommand('Redo');
  }

  // --- Features page ----------------------------------------------------------------------------

  /**
   * Grant / withdraw the feature in row `index`. The whole first cell is the hit area, and it is
   * enabled only for a row that carries a decision - LicenseEditor.qml's entryIsChangeable.
   */
  toggleFeature(index) {
    return gui.click(this.page, [`ExplorerRow_${index}`, 'LicenseFeatureGrantCell'], {
      what: `the grant box of feature row ${index}`,
    });
  }

  /** Whether row `index` offers a grant box at all (a row without a decision shows a reason instead). */
  isFeatureGrantable(index) {
    return gui.dom.isVisible(
      this.page,
      [`ExplorerRow_${index}`, 'LicenseFeatureGrantCell', 'LicenseFeatureCheckBox'],
      1000
    );
  }

  /**
   * Descend into a granted feature's optional parts via its count chip. Opening is only offered once
   * the feature is granted - there is nothing to decide inside one that is not.
   */
  openFeatureLevel(index) {
    return gui.click(this.page, [`ExplorerRow_${index}`, 'LicenseFeatureSubfeaturesCell'], {
      what: `the sub-features chip of feature row ${index}`,
    });
  }

  // --- Inherited licenses page ------------------------------------------------------------------

  async toggleInheritedLicense(index) {
    await this.openInheritance();
    await this.inheritedLicenses.toggleRow(index);
    return this;
  }

  async clearInheritedLicenses() {
    await this.openInheritance();
    await this.inheritedLicenses.runAction();
    return this;
  }
}

module.exports = { LicenseEditorPage };
