/**
 * Product management operations.
 * Source: ImtCore/Sdl/imtlic/1.0/Products.sdl
 */
export const ProductsSDL = `
  input ProductsListInput {
    viewParams: CollectionViewParams
  }

  type LicenseData {
    id: ID
    name: String
    licenseId: ID
    licenseName: String
  }

  type ProductItem {
    id: ID!
    name: String!
    productName: String!
    typeId: ID!
    productId: ID!
    categoryId: ID!
    description: String
    features: ID
    licenses: [LicenseData]
    added: String
    timeStamp: String
  }

  type ProductsListPayload {
    items: [ProductItem]
    notification: NotificationItem
  }

  type ProductData {
    id: ID
    name: String
    productName: String
    description: String
    productId: ID
    categoryId: ID
    features: ID
  }

  input ProductDataInput {
    id: ID!
    item: ProductData
  }

  input ProductItemInput {
    id: ID!
  }
`;
