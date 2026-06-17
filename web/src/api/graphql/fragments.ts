import { gql } from '@apollo/client';

/**
 * Reusable fragments matching the ImtCore SDL types.
 */

// Products
export const PRODUCT_ITEM_FIELDS = gql`
  fragment ProductItemFields on ProductItem {
    id
    name
    productName
    typeId
    productId
    categoryId
    description
    features
    licenses {
      id
      name
      licenseId
      licenseName
    }
    added
    timeStamp
  }
`;

export const PRODUCT_DATA_FIELDS = gql`
  fragment ProductDataFields on ProductData {
    id
    name
    productName
    description
    productId
    categoryId
    features
  }
`;

// Licenses
export const LICENSE_ITEM_FIELDS = gql`
  fragment LicenseItemFields on LicenseItem {
    id
    typeId
    licenseId
    licenseName
    description
    productId
    productUuid
    parentLicenses
    features
    added
    timeStamp
  }
`;

export const LICENSE_DEFINITION_DATA_FIELDS = gql`
  fragment LicenseDefinitionDataFields on LicenseDefinitionData {
    id
    licenseName
    description
    productId
    licenseId
    features
    parentLicenses
  }
`;

// Features
export const FEATURE_DATA_FIELDS = gql`
  fragment FeatureDataFields on FeatureData {
    id
    featureId
    name
    featureName
    description
    optional
    isPermission
    dependencies
  }
`;

export const FEATURE_DATA_TREE = gql`
  ${FEATURE_DATA_FIELDS}
  fragment FeatureDataTree on FeatureData {
    ...FeatureDataFields
    subFeatures {
      ...FeatureDataFields
      subFeatures {
        ...FeatureDataFields
        subFeatures {
          ...FeatureDataFields
        }
      }
    }
  }
`;

export const FEATURE_ITEM_FIELDS = gql`
  ${FEATURE_DATA_TREE}
  fragment FeatureItemFields on FeatureItem {
    id
    name
    featureName
    typeId
    featureId
    description
    optional
    isPermission
    dependencies
    added
    timeStamp
    subFeatures {
      ...FeatureDataTree
    }
  }
`;

// Users
export const USER_ITEM_DATA_FIELDS = gql`
  fragment UserItemDataFields on UserItemData {
    id
    typeId
    userId
    name
    description
    mail
    systemId
    systemName
    roles
    groups
    added
    lastModified
    lastConnection
  }
`;

export const USER_DATA_FIELDS = gql`
  fragment UserDataFields on UserData {
    id
    productId
    name
    username
    email
    groups
    roles
    permissions
    systemInfos {
      id
      name
      enabled
    }
  }
`;

// Roles
export const ROLE_ITEM_DATA_FIELDS = gql`
  fragment RoleItemDataFields on RoleItemData {
    typeId
    id
    roleName
    roleId
    productId
    parentRoles
    roleDescription
    added
    lastModified
  }
`;

export const ROLE_DATA_FIELDS = gql`
  fragment RoleDataFields on RoleData {
    id
    name
    description
    roleId
    productId
    parentRoles
    permissions
    isDefault
    isGuest
  }
`;

// Groups
export const GROUP_ITEM_DATA_FIELDS = gql`
  fragment GroupItemDataFields on GroupItemData {
    id
    typeId
    name
    description
    roles
    users
    parentGroups
    added
    lastModified
  }
`;

export const GROUP_DATA_FIELDS = gql`
  fragment GroupDataFields on GroupData {
    id
    productId
    name
    description
    roles
    users
    parentGroups
  }
`;
