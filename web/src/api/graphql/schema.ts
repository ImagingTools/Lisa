/**
 * Local GraphQL schema (SDL).
 *
 * This SDL is a faithful reconstruction of the contract implied by the QML
 * client code (see `ImtCore/Qml/imtlicgui/*` and
 * `Partitura/LisaGraphQlVoce.arp/LisaGQLEngine.acc`). It is intentionally
 * kept in this single file so that:
 *
 *   1. The dev-time mock server (`api/mock/server.ts`) and the production
 *      Apollo client share the exact same shape.
 *   2. When a real Lisa GraphQL endpoint is wired in, only the transport
 *      changes — the operations, fragments and types on the client stay the
 *      same, which is how the original QML side is structured (the SDL types
 *      `imtlicProductsSdl` / `imtlicLicensesSdl` / `imtlicFeaturesSdl` are
 *      generated from the equivalent server-side schema).
 */
export const typeDefs = /* GraphQL */ `
  scalar DateTime

  enum ProductCategory {
    Software
    Hardware
  }

  enum AccountType {
    private
    company
  }

  type DocumentMetaInfo {
    uuid: ID!
    typeId: String!
    lastModified: DateTime!
    created: DateTime!
    owner: String
    revision: Int!
  }

  type LicenseRef {
    id: ID!
    name: String!
  }

  type Product {
    id: ID!
    name: String!
    description: String!
    categoryId: ProductCategory!
    licenses: [LicenseRef!]!
    features: String!
    meta: DocumentMetaInfo!
  }

  type Feature {
    uuid: ID!
    featureId: ID!
    featureName: String!
    description: String
    packageId: ID!
    optional: Boolean!
    isPermission: Boolean!
    dependencies: [ID!]!
    subFeatures: [Feature!]!
  }

  type FeaturePackage {
    id: ID!
    name: String!
    description: String
    features: [Feature!]!
  }

  type License {
    id: ID!
    productId: ID!
    name: String!
    description: String!
    features: [ID!]!
    meta: DocumentMetaInfo!
  }

  type Account {
    id: ID!
    name: String!
    description: String
    type: AccountType!
    ownerMail: String!
    ownerFirstName: String!
    ownerLastName: String!
  }

  type SessionUser {
    id: ID!
    login: String!
    displayName: String!
    permissions: [String!]!
    lastConnection: DateTime
  }

  type AuthPayload {
    user: SessionUser!
    token: String!
  }

  input ProductInput {
    id: ID
    name: String!
    description: String
    categoryId: ProductCategory!
    features: String!
  }

  input LicenseInput {
    id: ID
    productId: ID!
    name: String!
    description: String
    features: [ID!]!
  }

  input FeatureInput {
    uuid: ID
    featureId: ID!
    featureName: String!
    description: String
    packageId: ID!
    optional: Boolean!
    isPermission: Boolean!
    dependencies: [ID!]!
    parentFeatureUuid: ID
  }

  type Query {
    me: SessionUser
    productsList: [Product!]!
    productItem(id: ID!): Product
    licensesList(productId: ID): [License!]!
    licenseItem(id: ID!, productId: ID!): License
    packagesList: [FeaturePackage!]!
    featuresList: [Feature!]!
    featureItem(uuid: ID!): Feature
    getFeatureDependencies(featureId: ID!): [ID!]!
    accountsList: [Account!]!
  }

  type Mutation {
    login(login: String!, password: String!): AuthPayload!
    logout: Boolean!
    productAdd(input: ProductInput!): Product!
    productUpdate(input: ProductInput!): Product!
    productRemove(id: ID!): Boolean!
    licenseAdd(input: LicenseInput!): License!
    licenseUpdate(input: LicenseInput!): License!
    licenseRemove(id: ID!, productId: ID!): Boolean!
    featureAdd(input: FeatureInput!): Feature!
    featureUpdate(input: FeatureInput!): Feature!
    featureRemove(uuid: ID!): Boolean!
  }
`;
