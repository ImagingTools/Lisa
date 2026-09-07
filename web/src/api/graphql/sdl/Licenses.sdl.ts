/**
 * License management operations.
 * Source: ImtCore/Sdl/imtlic/1.0/Licenses.sdl
 */
export const LicensesSDL = `
  input LicensesListInput {
    viewParams: CollectionViewParams
  }

  type LicenseItem {
    id: ID!
    typeId: ID!
    licenseId: ID!
    licenseName: String!
    description: String
    productId: ID
    productUuid: ID
    parentLicenses: ID
    features: ID
    added: String
    timeStamp: String
  }

  type LicensesListPayload {
    items: [LicenseItem]
    notification: NotificationItem
  }

  type LicenseDefinitionData {
    id: ID
    licenseName: String
    description: String
    productId: ID
    licenseId: ID
    features: ID
    parentLicenses: ID
  }

  input LicenseDataInput {
    id: ID!
    item: LicenseDefinitionData
  }

  input LicenseItemInput {
    id: ID!
  }
`;
