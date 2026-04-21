/**
 * Role management operations.
 * Source: ImtCore/Sdl/imtauth/1.0/Roles.sdl
 */
export const RolesSDL = `
  type RoleItemData {
    typeId: ID!
    id: ID!
    roleName: String!
    roleId: ID
    productId: ID
    parentRoles: ID
    roleDescription: String
    added: String
    lastModified: String
  }

  type RolesListPayload {
    items: [RoleItemData]
    notification: NotificationItem
  }

  type RoleData {
    id: ID
    name: String
    description: String
    roleId: ID
    productId: ID
    parentRoles: [ID]
    permissions: ID
    isDefault: Bool
    isGuest: Bool
  }

  input RoleDataInput {
    id: ID!
    typeId: ID!
    productId: ID!
    item: RoleData
    name: String
    description: String
  }

  input RoleItemInput {
    id: ID!
    productId: ID!
  }

  input RolesListInput {
    productId: ID
    viewParams: CollectionViewParams
  }
`;
