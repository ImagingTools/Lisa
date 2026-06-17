/**
 * Collection infrastructure types.
 * Source: ImtCore/Sdl/imtbase/1.0/ImtCollection.sdl
 */
export const ImtCollectionSDL = `
  type HeaderInfo {
    id: ID!
    name: String!
    filterable: Boolean
    sortable: Boolean
  }

  type CollectionViewParams {
    count: Int
    offset: Int
    filterModel: ComplexCollectionFilter
    documentFilterModel: DocumentCollectionFilter
  }

  type NotificationItem {
    pagesCount: Integer!
    totalCount: Integer
  }

  type UpdatedNotificationPayload {
    id: ID!
  }

  type AddedNotificationPayload {
    id: ID!
  }

  type RemovedNotificationPayload {
    elementIds: [ID]
  }

  input InputId {
    id: ID!
  }

  input RemoveElementsInput {
    collectionId: ID!
    elementIds: [ID]
  }

  type RemoveElementsPayload {
    success: Boolean
  }

  input CollectionViewParams {
    count: Int
    offset: Int
    filterModel: ComplexCollectionFilter
    documentFilterModel: DocumentCollectionFilter
  }
`;
