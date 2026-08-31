/**
 * Group management operations.
 * Source: ImtCore/Sdl/imtauth/1.0/Groups.sdl
 */
export const GroupsSDL = `
  type GroupItemData {
    id: ID!
    typeId: ID!
    name: String!
    description: String
    roles: ID
    users: ID
    parentGroups: ID
    added: String
    lastModified: String
  }

  type GroupsListPayload {
    items: [GroupItemData]
    notification: NotificationItem
  }

  type GroupData {
    id: ID
    productId: ID
    name: String
    description: String
    roles: [ID]
    users: [ID]
    parentGroups: [ID]
  }

  input GroupDataInput {
    id: ID!
    typeId: ID!
    productId: ID!
    item: GroupData
    name: String
    description: String
  }

  input GroupItemInput {
    id: ID!
    productId: ID!
  }

  input GroupsListInput {
    productId: ID
    viewParams: CollectionViewParams
  }
`;
