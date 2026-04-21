/**
 * GraphQL operation IDs expected by the Lisa server.
 *
 * This list mirrors `Partitura/LisaGraphQlVoce.arp/LisaGQLEngine.acc`
 * (the `CommandIds` attribute) and the `gqlGetCommandId` / `gqlAddCommandId`
 * / `gqlUpdateCommandId` properties used by the QML
 * `GqlRequestDocumentDataController` instances in `ImtCore/Qml/imtlicgui/*`.
 *
 * Keeping the names in one place lets us swap the transport (real GraphQL
 * server vs. local mock) without touching call sites.
 */
export const OPERATIONS = {
  // Products
  ProductsList: 'ProductsList',
  ProductItem: 'ProductItem',
  ProductAdd: 'ProductAdd',
  ProductUpdate: 'ProductUpdate',
  ProductRemove: 'ProductRemove',
  // Licenses
  LicensesList: 'LicensesList',
  LicenseItem: 'LicenseItem',
  LicenseAdd: 'LicenseAdd',
  LicenseUpdate: 'LicenseUpdate',
  LicenseRemove: 'LicenseRemove',
  // Features / Packages
  FeaturesList: 'FeaturesList',
  PackagesList: 'PackagesList',
  FeatureItem: 'FeatureItem',
  FeatureAdd: 'FeatureAdd',
  FeatureUpdate: 'FeatureUpdate',
  FeatureRemove: 'FeatureRemove',
  GetFeatureDependencies: 'GetFeatureDependencies',
  // Accounts
  AccountsList: 'AccountsList',
  // Auth
  Login: 'Login',
  Logout: 'Logout',
  Me: 'Me',
  // Subscriptions
  OnProductsCollectionChanged: 'OnProductsCollectionChanged',
  OnLicensesCollectionChanged: 'OnLicensesCollectionChanged',
  OnFeaturesCollectionChanged: 'OnFeaturesCollectionChanged',
  PumaWsConnection: 'PumaWsConnection',
  LisaWsConnection: 'LisaWsConnection',
} as const;

export type OperationId = (typeof OPERATIONS)[keyof typeof OPERATIONS];
