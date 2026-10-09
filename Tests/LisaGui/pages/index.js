// Lisa's own page objects, plus the generic ImtCore ones re-exported so a spec has one import.
//
// Features and Licenses need no page object of their own: they are standard Imt collections, so their
// specs declare the filters and the masked columns and use CollectionPage directly. Products has one
// because Import/Export are its alone.

const {
  BasePage,
  CollectionPage: KitCollectionPage,
  AdministrationPage,
  OrganizationsPage,
  SearchPage,
  RoleCollectionPage: KitRoleCollectionPage,
  RoleEditorPage,
  UserCollectionPage: KitUserCollectionPage,
  UserEditorPage,
  GroupCollectionPage: KitGroupCollectionPage,
  GroupEditorPage,
} = require('imtcore-gui-testkit/pages');

const { settled } = require('./settledCollection');

// Every collection Lisa drives goes through settled() - see settledCollection.js for why it is here
// and not in the kit. The wrapper only adds a wait, so nothing else about these classes changes.
const CollectionPage = settled(KitCollectionPage);
const RoleCollectionPage = settled(KitRoleCollectionPage);
const UserCollectionPage = settled(KitUserCollectionPage);
const GroupCollectionPage = settled(KitGroupCollectionPage);

const {
  ProductCollectionPage: LisaProductCollectionPage,
  FILTERS: PRODUCT_FILTERS,
  MASK_COLUMNS,
} = require('./ProductCollectionPage');
const ProductCollectionPage = settled(LisaProductCollectionPage);
const { FeatureEditorPage } = require('./FeatureEditorPage');
const { ProductEditorPage, CATEGORY_SOFTWARE, CATEGORY_HARDWARE } = require('./ProductEditorPage');
const { LicenseEditorPage } = require('./LicenseEditorPage');

// Every Lisa collection carries the same two non-deterministic columns (see the *Page.acc HeaderIds:
// "added"/"timeStamp" on Features, Products and Licenses alike) and the same single date filter.
const COLLECTION_FILTERS = { creationDate: 'CreationDateFilter' };

module.exports = {
  BasePage,
  CollectionPage,
  AdministrationPage,
  OrganizationsPage,
  SearchPage,
  RoleCollectionPage,
  RoleEditorPage,
  UserCollectionPage,
  UserEditorPage,
  GroupCollectionPage,
  GroupEditorPage,

  ProductCollectionPage,
  PRODUCT_FILTERS,
  FeatureEditorPage,
  ProductEditorPage,
  LicenseEditorPage,
  CATEGORY_SOFTWARE,
  CATEGORY_HARDWARE,

  COLLECTION_FILTERS,
  MASK_COLUMNS,
};
