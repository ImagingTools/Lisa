/**
 * Feature management operations.
 * Source: ImtCore/Sdl/imtlic/1.0/Features.sdl
 */
export const FeaturesSDL = `
  input FeaturesListInput {
    viewParams: CollectionViewParams
  }

  type FeatureData {
    id: ID
    featureId: ID
    name: String
    featureName: String
    description: String
    optional: Bool
    isPermission: Bool
    dependencies: ID
    subFeatures: [FeatureData]
  }

  type FeatureItem {
    id: ID!
    name: String!
    featureName: String!
    typeId: ID!
    featureId: ID!
    description: String
    optional: Bool
    isPermission: Bool
    dependencies: ID
    added: String
    timeStamp: String
    subFeatures: [FeatureData]
  }

  type FeaturesListPayload {
    items: [FeatureItem]
    notification: NotificationItem
  }

  input FeatureDataInput {
    id: ID!
    item: FeatureData
  }

  input FeatureItemInput {
    id: ID!
  }
`;
