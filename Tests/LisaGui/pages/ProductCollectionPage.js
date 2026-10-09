// ProductCollectionPage - the Products collection view.
//
// Everything a standard Imt collection has (table, filter panel, New/Edit/Remove) comes from
// CollectionPage. Products adds the two commands only it has - Import and Export
// (ImtCore/Qml/imtlicgui/ProductCollectionViewCommandsDelegate.qml):
//
//   * Import opens a WARNING dialog first, before any file picker, because importing is not a
//     per-file question: CProductCollectionControllerComp::OnImportObject always writes the features
//     carried in the file into the SHARED feature collection, creating the new ones and replacing the
//     ones already there - other products and licenses that use those features get the replacement
//     too. Answering Yes opens the native file dialog, which is outside the DOM; the warning itself is
//     the part a test can drive.
//   * Export opens the native save dialog directly, so only the state it is invoked from is testable.

const { CollectionPage } = require('imtcore-gui-testkit/pages/CollectionPage');
const { Dialog } = require('imtcore-gui-testkit/controls');

// ProductsPage.acc's FilterableHeaderIds plus the creation-date filter every collection carries.
const FILTERS = { creationDate: 'CreationDateFilter' };

// "Added" / "Last Modified" - real timestamps, different on every restored database and after every
// save, so they are masked out of every screenshot of this collection.
const MASK_COLUMNS = ['added', 'timeStamp'];

class ProductCollectionPage extends CollectionPage {
  constructor(page) {
    super(page, 'Products', { filters: FILTERS, maskColumns: MASK_COLUMNS });
    this.dialog = new Dialog(page);
  }

  /** Open the import warning (the file picker only follows a Yes). */
  importProduct() {
    return this.runCommand('Import');
  }

  /** Answer the import warning with Yes - which hands over to the native file dialog. */
  confirmImport() {
    return this.dialog.confirm();
  }

  exportProduct() {
    return this.runCommand('Export');
  }
}

module.exports = { ProductCollectionPage, FILTERS, MASK_COLUMNS };
