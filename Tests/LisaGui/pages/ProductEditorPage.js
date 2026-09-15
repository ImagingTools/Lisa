// ProductEditorPage - the document editor opened from the Products page (New / Edit).
//
// A product is a name, a category, and a set of references INTO the shared feature collection
// (ImtCore/Qml/imtlicgui/ProductView.qml). Nothing about a feature is typed here: features are picked
// from the collection through the "Select features" dialog (FeaturesDialog.qml), and the only decision
// the product itself makes is which of a feature's OPTIONAL parts it takes - the ticks in the
// "Feature content" panel beside the table.
//
// MultiPageView pages ("Page_<id>"):
//   General  - product name, category (Software / Hardware - ProductView.qml's categoryModel)
//   Features - a TreeExplorerView of the product's features, with the Feature content side panel
//
// The Features page's toolbar commands are the product's own: "Add feature" opens the picker,
// "Remove" drops the selected root feature (ProductViewCommandsDelegate.qml).

const { BasePage } = require('imtcore-gui-testkit/pages/BasePage');
const { TextInput, ComboBox, TreeExplorer, CheckableListPanel, Dialog } = require('imtcore-gui-testkit/controls');
const gui = require('imtcore-gui-testkit/lib/gui');

// ProductView.qml's categoryModel, in order. A source-level list, not data - safe to address by index.
const CATEGORY_SOFTWARE = 0;
const CATEGORY_HARDWARE = 1;

class ProductEditorPage extends BasePage {
  constructor(page) {
    super(page, 'Products');

    // General page
    this.productName = new TextInput(page, ['ProductNameInput']);
    this.category = new ComboBox(page, ['CategoryCombo']);

    // Features page
    this.features = new TreeExplorer(page, 'ProductFeaturesExplorer');
    this.featureContent = this.features.panel('FeatureContentPanel');

    // The "Select features" picker (FeaturesDialog.qml) - its body is a CheckableListPanel of its own.
    this.picker = new CheckableListPanel(page, 'AvailableFeaturesPanel');
    this.dialog = new Dialog(page);
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

  // --- General page -----------------------------------------------------------------------------

  /**
   * The product id is not a field: ProductView.qml's updateModel derives it from the name with the
   * spaces stripped. So a test that needs a known id sets a known name.
   */
  async fillGeneral({ name, category } = {}) {
    await this.openGeneral();
    // The name is written into the document by `onEditingFinished`, which runs when the field is
    // LEFT, not while it is typed into - so typing alone leaves the document unchanged. Leaving it is
    // a click on the page's own nav item; see FeatureEditorPage.fillAndCommit for why not a Tab.
    if (name !== undefined) {
      await this.productName.fill(name);
      await gui.clickButton(this.page, ['Page_General']);
    }
    if (category !== undefined) await this.category.selectIndex(category);
    return this;
  }

  setSoftwareCategory() {
    return this.fillGeneral({ category: CATEGORY_SOFTWARE });
  }

  setHardwareCategory() {
    return this.fillGeneral({ category: CATEGORY_HARDWARE });
  }

  // --- editor commands --------------------------------------------------------------------------

  undo() {
    return this.runCommand('Undo');
  }

  redo() {
    return this.runCommand('Redo');
  }

  // --- Features page ----------------------------------------------------------------------------

  /** Open the "Select features" picker (the explorer's "Add feature"). */
  async openFeaturePicker() {
    await this.openFeatures();
    await this.features.create();
    return this;
  }

  /**
   * Pick features in the open picker and confirm. "Add" stays disabled until at least one row is
   * ticked (FeaturesDialog.qml), so confirming without a tick is not a flow that exists.
   * @param {number[]} indexes rows of the picker to tick
   */
  async addFeatures(indexes = [0]) {
    for (const index of indexes) await this.picker.toggleRow(index);
    await this.dialog.clickButtonByText('Add');
    return this;
  }

  cancelFeaturePicker() {
    return this.dialog.clickButtonByText('Cancel');
  }

  /** Drop a feature from the product (the explorer's Remove, on the selected root feature). */
  async removeFeature(index = 0) {
    await this.features.selectRow(index);
    await this.features.removeRows();
    return this;
  }

  /**
   * Select a feature so the Feature content panel describes it. Until something is selected the panel
   * shows its placeholder instead of a list, which is a real state worth asserting rather than a
   * loading artefact.
   */
  selectFeature(index = 0) {
    return this.features.selectRow(index);
  }

  /** Take / drop one of the selected feature's optional parts. Mandatory parts are ticked and locked. */
  toggleOptionalPart(index) {
    return this.featureContent.toggleRow(index);
  }

  /** The panel's header command: "Take all" when nothing optional is taken, "Clear" when all is. */
  toggleAllOptionalParts() {
    return this.featureContent.runAction();
  }
}

module.exports = { ProductEditorPage, CATEGORY_SOFTWARE, CATEGORY_HARDWARE };
