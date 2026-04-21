/**
 * Domain types for Lisa.
 *
 * These mirror the entities defined by the Lisa server (see
 * `Impl/LisaServer/Resources/Database/CreateTables.sql`) and the Acf/Partitura
 * domain configuration in `Partitura/LisaVoce.arp/*` and
 * `Partitura/LisaGraphQlVoce.arp/LisaGQLEngine.acc`.
 *
 * They also align with the data shapes produced by the QML
 * `imtlicProductsSdl` / `imtlicLicensesSdl` / `imtlicFeaturesSdl` SDL
 * collections used in `ImtCore/Qml/imtlicgui/*`.
 */

/** Stable string identifier (free-form, not a UUID). */
export type Id = string;

/** ISO-8601 timestamp returned by the server. */
export type Timestamp = string;

/**
 * Audit / system metadata attached to every persisted document.
 *
 * In QML this is exposed via the `MetaInfo` of `MultiDocCollectionPage` items
 * and via `RevisionInfo` / `DataMetaInfo` on the underlying domain objects.
 */
export interface DocumentMetaInfo {
  /** Stable document UUID (separate from the business `id`). */
  uuid: Id;
  /** Document type, e.g. `"Product"`, `"License"`, `"Feature"`. */
  typeId: string;
  /** Last-modification timestamp. */
  lastModified: Timestamp;
  /** Creation timestamp. */
  created: Timestamp;
  /** Owner / last editor of the document, if known. */
  owner?: string;
  /** Monotonic revision counter incremented on every server-side mutation. */
  revision: number;
}

/** Categorization of a product, mirrored from the QML `categoryComboBox`. */
export type ProductCategory = 'Software' | 'Hardware';

/** Product entity. */
export interface Product {
  id: Id;
  name: string;
  description: string;
  categoryId: ProductCategory;
  /** License definitions exposed by this product. */
  licenses: LicenseRef[];
  /**
   * Selected feature ids for this product.
   *
   * The QML `ProductView` encodes the selection as a `;`-separated string
   * with optional `<rootUuid>/<featureId>` entries for optional sub-features.
   * The web app keeps the same encoding to stay binary-compatible with the
   * existing GraphQL contract; helpers in `features/products/featureSelection.ts`
   * convert to/from the structured form.
   */
  features: string;
  meta: DocumentMetaInfo;
}

/** Lightweight reference to a license, used inside `Product.licenses`. */
export interface LicenseRef {
  id: Id;
  name: string;
}

/** Feature node — features form a tree (sub-features). */
export interface Feature {
  /** Stable UUID (the QML side calls it `ObjectUuid`). */
  uuid: Id;
  /** Business feature id, e.g. `"EditFeature"`. */
  featureId: Id;
  /** Human-readable feature name. */
  featureName: string;
  description?: string;
  /** Logical package this feature belongs to. */
  packageId: Id;
  /** True if the feature is selectable per-license rather than always-on. */
  optional: boolean;
  /** True if the feature actually maps to an authorization permission. */
  isPermission: boolean;
  /** Other featureIds this feature requires. */
  dependencies: Id[];
  /** Sub-features (tree structure). */
  subFeatures: Feature[];
  meta?: DocumentMetaInfo;
}

/** Logical container of features (StandardFramework, RTVisionFramework, …). */
export interface FeaturePackage {
  id: Id;
  name: string;
  description?: string;
  features: Feature[];
  meta?: DocumentMetaInfo;
}

/** A license definition (a "SKU") for a given product. */
export interface License {
  id: Id;
  productId: Id;
  name: string;
  description: string;
  /** Feature ids granted by this license. */
  features: Id[];
  meta: DocumentMetaInfo;
}

/** End-customer / company / private account. */
export interface Account {
  id: Id;
  name: string;
  description?: string;
  type: 'private' | 'company';
  ownerMail: string;
  ownerFirstName: string;
  ownerLastName: string;
  meta?: DocumentMetaInfo;
}

/** Authenticated principal (`AuthorizationController` in QML). */
export interface SessionUser {
  id: Id;
  login: string;
  displayName: string;
  /** Permission ids granted to the user (see `PermissionsController`). */
  permissions: string[];
  /** Last successful login. */
  lastConnection?: Timestamp;
}

/**
 * The complete set of permission ids known to Lisa (mirrors
 * `LisaFeatures.h` and `Partitura/LisaVoce.arp/*Permissions.acc`).
 *
 * These are the *command* permissions checked at runtime by the QML side via
 * `PermissionsController.checkPermission(...)`.
 */
export const PERMISSION_IDS = [
  // Products
  'ViewProducts',
  'AddProduct',
  'ChangeProduct',
  'RemoveProduct',
  // Licenses
  'ViewLicenses',
  'AddLicense',
  'ChangeLicense',
  'RemoveLicense',
  // Features
  'ViewFeatures',
  'AddFeature',
  'EditFeature',
  'ChangeFeature',
  'RemoveFeature',
  // Administration
  'Administration',
] as const;

export type PermissionId = (typeof PERMISSION_IDS)[number];
