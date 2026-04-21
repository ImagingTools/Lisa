/**
 * GraphQL operation names from the ImtCore SDL.
 *
 * Source: ImtCore/Sdl/imtauth/1.0/* and ImtCore/Sdl/imtlic/1.0/*
 *
 * These are the exact operation names defined in the canonical SDL files.
 * Keeping the names in one place lets us swap the transport (real GraphQL
 * server vs. local mock) without touching call sites.
 */
export const OPERATIONS = {
  // Auth (imtauth/1.0/Authorization.sdl)
  Authorization: 'Authorization',
  UserToken: 'UserToken',
  GetPermissions: 'GetPermissions',
  Logout: 'Logout',

  // Users (imtauth/1.0/Users.sdl)
  UsersList: 'UsersList',
  UserItem: 'UserItem',
  UserAdd: 'UserAdd',
  UserUpdate: 'UserUpdate',
  ChangePassword: 'ChangePassword',

  // Roles (imtauth/1.0/Roles.sdl)
  RolesList: 'RolesList',
  RoleItem: 'RoleItem',
  RoleAdd: 'RoleAdd',
  RoleUpdate: 'RoleUpdate',

  // Groups (imtauth/1.0/Groups.sdl)
  GroupsList: 'GroupsList',
  GroupItem: 'GroupItem',
  GroupAdd: 'GroupAdd',
  GroupUpdate: 'GroupUpdate',

  // Profile (imtauth/1.0/Profile.sdl)
  GetProfile: 'GetProfile',
  SetProfile: 'SetProfile',

  // Products (imtlic/1.0/Products.sdl)
  ProductsList: 'ProductsList',
  ProductItem: 'ProductItem',
  ProductAdd: 'ProductAdd',
  ProductUpdate: 'ProductUpdate',

  // Licenses (imtlic/1.0/Licenses.sdl)
  LicensesList: 'LicensesList',
  LicenseItem: 'LicenseItem',
  LicenseAdd: 'LicenseAdd',
  LicenseUpdate: 'LicenseUpdate',

  // Features (imtlic/1.0/Features.sdl)
  FeaturesList: 'FeaturesList',
  GetFeatureItem: 'GetFeatureItem',
  AddFeature: 'AddFeature',
  UpdateFeature: 'UpdateFeature',

  // Generic collection operations (imtbase/1.0/ImtCollection.sdl)
  RemoveElements: 'RemoveElements',
} as const;

export type OperationId = (typeof OPERATIONS)[keyof typeof OPERATIONS];
