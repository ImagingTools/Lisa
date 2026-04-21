/**
 * Domain types for Lisa.
 *
 * These mirror the GraphQL types defined in ImtCore SDL files
 * (https://github.com/ImagingTools/ImtCore under Sdl/imtauth/1.0/ and
 * Sdl/imtlic/1.0/ and Sdl/imtbase/1.0/).
 */

/** Stable string identifier. */
export type Id = string;

// ===========================================================================
// Collection infrastructure (imtbase/1.0/ImtCollection.sdl)
// ===========================================================================

export interface NotificationItem {
  pagesCount: number;
  totalCount?: number;
}

export interface CollectionViewParams {
  count?: number;
  offset?: number;
  filterModel?: unknown;
  documentFilterModel?: unknown;
}

// ===========================================================================
// Auth (imtauth/1.0/Authorization.sdl)
// ===========================================================================

export interface AuthorizationPayload {
  userId?: string;
  username?: string;
  token?: string;
  refreshToken?: string;
  systemId?: string;
  /** Delimited string of permission IDs (e.g. "perm1;perm2;perm3") */
  permissions?: string;
}

export interface PermissionList {
  permissions: string[];
}

// ===========================================================================
// Users (imtauth/1.0/Users.sdl)
// ===========================================================================

export interface UserItemData {
  id: string;
  typeId: string;
  userId?: string;
  name?: string;
  description?: string;
  mail?: string;
  systemId?: string;
  systemName?: string;
  roles?: string;
  groups?: string;
  added?: string;
  lastModified?: string;
  lastConnection?: string;
}

export interface UsersListPayload {
  items?: UserItemData[];
  notification?: NotificationItem;
}

export interface SystemInfo {
  id?: string;
  name?: string;
  enabled?: boolean;
}

export interface UserData {
  id?: string;
  productId?: string;
  name?: string;
  username?: string;
  password?: string;
  email?: string;
  groups?: string[];
  roles?: string[];
  permissions?: string[];
  systemInfos?: SystemInfo[];
}

// ===========================================================================
// Roles (imtauth/1.0/Roles.sdl)
// ===========================================================================

export interface RoleItemData {
  typeId: string;
  id: string;
  roleName: string;
  roleId?: string;
  productId?: string;
  parentRoles?: string;
  roleDescription?: string;
  added?: string;
  lastModified?: string;
}

export interface RolesListPayload {
  items?: RoleItemData[];
  notification?: NotificationItem;
}

export interface RoleData {
  id?: string;
  name?: string;
  description?: string;
  roleId?: string;
  productId?: string;
  parentRoles?: string[];
  permissions?: string;
  isDefault?: boolean;
  isGuest?: boolean;
}

// ===========================================================================
// Groups (imtauth/1.0/Groups.sdl)
// ===========================================================================

export interface GroupItemData {
  id: string;
  typeId: string;
  name: string;
  description?: string;
  roles?: string;
  users?: string;
  parentGroups?: string;
  added?: string;
  lastModified?: string;
}

export interface GroupsListPayload {
  items?: GroupItemData[];
  notification?: NotificationItem;
}

export interface GroupData {
  id?: string;
  productId?: string;
  name?: string;
  description?: string;
  roles?: string[];
  users?: string[];
  parentGroups?: string[];
}

// ===========================================================================
// Profile (imtauth/1.0/Profile.sdl)
// ===========================================================================

export interface RoleInfo {
  id?: string;
  name?: string;
  description?: string;
}

export interface GroupInfo {
  id?: string;
  name?: string;
  description?: string;
}

export interface PermissionInfo {
  id?: string;
  name?: string;
  description?: string;
}

export interface ProfileData {
  id?: string;
  systemId?: string;
  username?: string;
  name?: string;
  email?: string;
  roles?: RoleInfo[];
  groups?: GroupInfo[];
  permissions?: PermissionInfo[];
}

// ===========================================================================
// Products (imtlic/1.0/Products.sdl)
// ===========================================================================

export interface LicenseData {
  id?: string;
  name?: string;
  licenseId?: string;
  licenseName?: string;
}

export interface ProductItem {
  id: string;
  name: string;
  productName: string;
  typeId: string;
  productId: string;
  categoryId: string;
  description?: string;
  features?: string;
  licenses?: LicenseData[];
  added?: string;
  timeStamp?: string;
}

export interface ProductsListPayload {
  items?: ProductItem[];
  notification?: NotificationItem;
}

export interface ProductData {
  id?: string;
  name?: string;
  productName?: string;
  description?: string;
  productId?: string;
  categoryId?: string;
  features?: string;
}

// ===========================================================================
// Licenses (imtlic/1.0/Licenses.sdl)
// ===========================================================================

export interface LicenseItem {
  id: string;
  typeId: string;
  licenseId: string;
  licenseName: string;
  description?: string;
  productId?: string;
  productUuid?: string;
  parentLicenses?: string;
  features?: string;
  added?: string;
  timeStamp?: string;
}

export interface LicensesListPayload {
  items?: LicenseItem[];
  notification?: NotificationItem;
}

export interface LicenseDefinitionData {
  id?: string;
  licenseName?: string;
  description?: string;
  productId?: string;
  licenseId?: string;
  features?: string;
  parentLicenses?: string;
}

// ===========================================================================
// Features (imtlic/1.0/Features.sdl)
// ===========================================================================

export interface FeatureData {
  id?: string;
  featureId?: string;
  name?: string;
  featureName?: string;
  description?: string;
  optional?: boolean;
  isPermission?: boolean;
  /** Delimited string of feature IDs (e.g. "feat1;feat2") */
  dependencies?: string;
  subFeatures?: FeatureData[];
}

export interface FeatureItem {
  id: string;
  name: string;
  featureName: string;
  typeId: string;
  featureId: string;
  description?: string;
  optional?: boolean;
  isPermission?: boolean;
  /** Delimited string of feature IDs */
  dependencies?: string;
  added?: string;
  timeStamp?: string;
  subFeatures?: FeatureData[];
}

export interface FeaturesListPayload {
  items?: FeatureItem[];
  notification?: NotificationItem;
}

// ===========================================================================
// Application-level types
// ===========================================================================

/**
 * The complete set of permission IDs known to Lisa (mirrors
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
  // Users
  'ViewUsers',
  'AddUser',
  'ChangeUser',
  'RemoveUser',
  // Administration
  'Administration',
] as const;

export type PermissionId = (typeof PERMISSION_IDS)[number];
