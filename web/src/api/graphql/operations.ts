import { gql } from '@apollo/client';
import { PRODUCT_FIELDS, LICENSE_FIELDS, FEATURE_TREE, META_FIELDS } from './fragments';

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export const ME_QUERY = gql`
  query Me {
    me {
      id
      login
      displayName
      permissions
      lastConnection
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($login: String!, $password: String!) {
    login(login: $login, password: $password) {
      token
      user {
        id
        login
        displayName
        permissions
        lastConnection
      }
    }
  }
`;

export const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout
  }
`;

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

export const PRODUCTS_LIST = gql`
  ${PRODUCT_FIELDS}
  query ProductsList {
    productsList {
      ...ProductFields
    }
  }
`;

export const PRODUCT_ITEM = gql`
  ${PRODUCT_FIELDS}
  query ProductItem($id: ID!) {
    productItem(id: $id) {
      ...ProductFields
    }
  }
`;

export const PRODUCT_ADD = gql`
  ${PRODUCT_FIELDS}
  mutation ProductAdd($input: ProductInput!) {
    productAdd(input: $input) {
      ...ProductFields
    }
  }
`;

export const PRODUCT_UPDATE = gql`
  ${PRODUCT_FIELDS}
  mutation ProductUpdate($input: ProductInput!) {
    productUpdate(input: $input) {
      ...ProductFields
    }
  }
`;

export const PRODUCT_REMOVE = gql`
  mutation ProductRemove($id: ID!) {
    productRemove(id: $id)
  }
`;

// ---------------------------------------------------------------------------
// Licenses
// ---------------------------------------------------------------------------

export const LICENSES_LIST = gql`
  ${LICENSE_FIELDS}
  query LicensesList($productId: ID) {
    licensesList(productId: $productId) {
      ...LicenseFields
    }
  }
`;

export const LICENSE_ITEM = gql`
  ${LICENSE_FIELDS}
  query LicenseItem($id: ID!, $productId: ID!) {
    licenseItem(id: $id, productId: $productId) {
      ...LicenseFields
    }
  }
`;

export const LICENSE_ADD = gql`
  ${LICENSE_FIELDS}
  mutation LicenseAdd($input: LicenseInput!) {
    licenseAdd(input: $input) {
      ...LicenseFields
    }
  }
`;

export const LICENSE_UPDATE = gql`
  ${LICENSE_FIELDS}
  mutation LicenseUpdate($input: LicenseInput!) {
    licenseUpdate(input: $input) {
      ...LicenseFields
    }
  }
`;

export const LICENSE_REMOVE = gql`
  mutation LicenseRemove($id: ID!, $productId: ID!) {
    licenseRemove(id: $id, productId: $productId)
  }
`;

// ---------------------------------------------------------------------------
// Packages / Features
// ---------------------------------------------------------------------------

export const PACKAGES_LIST = gql`
  ${FEATURE_TREE}
  query PackagesList {
    packagesList {
      id
      name
      description
      features {
        ...FeatureTree
      }
    }
  }
`;

export const FEATURE_ITEM = gql`
  ${FEATURE_TREE}
  ${META_FIELDS}
  query FeatureItem($uuid: ID!) {
    featureItem(uuid: $uuid) {
      ...FeatureTree
    }
  }
`;

export const FEATURE_ADD = gql`
  ${FEATURE_TREE}
  mutation FeatureAdd($input: FeatureInput!) {
    featureAdd(input: $input) {
      ...FeatureTree
    }
  }
`;

export const FEATURE_UPDATE = gql`
  ${FEATURE_TREE}
  mutation FeatureUpdate($input: FeatureInput!) {
    featureUpdate(input: $input) {
      ...FeatureTree
    }
  }
`;

export const FEATURE_REMOVE = gql`
  mutation FeatureRemove($uuid: ID!) {
    featureRemove(uuid: $uuid)
  }
`;

export const GET_FEATURE_DEPENDENCIES = gql`
  query GetFeatureDependencies($featureId: ID!) {
    getFeatureDependencies(featureId: $featureId)
  }
`;

// ---------------------------------------------------------------------------
// Accounts
// ---------------------------------------------------------------------------

export const ACCOUNTS_LIST = gql`
  query AccountsList {
    accountsList {
      id
      name
      description
      type
      ownerMail
      ownerFirstName
      ownerLastName
    }
  }
`;
