/**
 * User management operations.
 * Source: ImtCore/Sdl/imtauth/1.0/Users.sdl
 */
export const UsersSDL = `
  input UsersListInput {
    productId: ID
    viewParams: CollectionViewParams
  }

  type UserItemData {
    id: ID!
    typeId: ID!
    userId: ID
    name: String
    description: String
    mail: String
    systemId: ID
    systemName: String
    roles: ID
    groups: ID
    added: String
    lastModified: String
    lastConnection: String
  }

  type UsersListPayload {
    items: [UserItemData]
    notification: NotificationItem
  }

  type SystemInfo {
    id: ID
    name: String
    enabled: Bool
  }

  type UserData {
    id: ID
    productId: ID
    name: String
    username: ID
    password: String
    email: String
    groups: [ID]
    roles: [ID]
    permissions: [ID]
    systemInfos: [SystemInfo]
  }

  input UserDataInput {
    id: ID!
    typeId: ID!
    productId: ID!
    item: UserData
    name: String
    description: String
  }

  input UserItemInput {
    id: ID!
    productId: ID!
  }

  input ChangePasswordInput {
    login: ID
    oldPassword: String
    newPassword: String
  }

  type ChangePasswordPayload {
    success: Boolean
  }
`;
