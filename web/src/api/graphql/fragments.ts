import { gql } from '@apollo/client';

/**
 * Reusable fragments. The naming intentionally matches the QML
 * `MetaInfo` / `RevisionInfo` shapes used by the underlying Acf models.
 */
export const META_FIELDS = gql`
  fragment MetaFields on DocumentMetaInfo {
    uuid
    typeId
    lastModified
    created
    owner
    revision
  }
`;

export const PRODUCT_FIELDS = gql`
  ${META_FIELDS}
  fragment ProductFields on Product {
    id
    name
    description
    categoryId
    features
    licenses {
      id
      name
    }
    meta {
      ...MetaFields
    }
  }
`;

export const LICENSE_FIELDS = gql`
  ${META_FIELDS}
  fragment LicenseFields on License {
    id
    productId
    name
    description
    features
    meta {
      ...MetaFields
    }
  }
`;

export const FEATURE_FIELDS = gql`
  fragment FeatureFields on Feature {
    uuid
    featureId
    featureName
    description
    packageId
    optional
    isPermission
    dependencies
  }
`;

export const FEATURE_TREE = gql`
  ${FEATURE_FIELDS}
  fragment FeatureTree on Feature {
    ...FeatureFields
    subFeatures {
      ...FeatureFields
      subFeatures {
        ...FeatureFields
        subFeatures {
          ...FeatureFields
        }
      }
    }
  }
`;
