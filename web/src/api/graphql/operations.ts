import { gql } from '@apollo/client';
import {
  PRODUCT_ITEM_FIELDS,
  PRODUCT_DATA_FIELDS,
  LICENSE_ITEM_FIELDS,
  LICENSE_DEFINITION_DATA_FIELDS,
  FEATURE_ITEM_FIELDS,
  FEATURE_DATA_TREE,
  USER_ITEM_DATA_FIELDS,
  USER_DATA_FIELDS,
  ROLE_ITEM_DATA_FIELDS,
  ROLE_DATA_FIELDS,
  GROUP_ITEM_DATA_FIELDS,
  GROUP_DATA_FIELDS,
} from './fragments';

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export const AUTHORIZATION_QUERY = gql`
  query Authorization($input: AuthorizationInput!) {
    Authorization(input: $input) {
      userId
      username
      token
      refreshToken
      systemId
      permissions
    }
  }
`;

export const GET_PERMISSIONS_QUERY = gql`
  query GetPermissions($input: TokenInput!) {
    GetPermissions(input: $input) {
      permissions
    }
  }
`;

export const LOGOUT_MUTATION = gql`
  mutation Logout($input: TokenInput!) {
    Logout(input: $input) {
      ok
    }
  }
`;

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

export const PRODUCTS_LIST = gql`
  ${PRODUCT_ITEM_FIELDS}
  query ProductsList($input: ProductsListInput) {
    ProductsList(input: $input) {
      items {
        ...ProductItemFields
      }
      notification {
        pagesCount
        totalCount
      }
    }
  }
`;

export const PRODUCT_ITEM = gql`
  ${PRODUCT_DATA_FIELDS}
  query ProductItem($input: ProductItemInput!) {
    ProductItem(input: $input) {
      ...ProductDataFields
    }
  }
`;

export const PRODUCT_ADD = gql`
  mutation ProductAdd($input: ProductDataInput!) {
    ProductAdd(input: $input) {
      id
    }
  }
`;

export const PRODUCT_UPDATE = gql`
  mutation ProductUpdate($input: ProductDataInput!) {
    ProductUpdate(input: $input) {
      id
    }
  }
`;

// ---------------------------------------------------------------------------
// Licenses
// ---------------------------------------------------------------------------

export const LICENSES_LIST = gql`
  ${LICENSE_ITEM_FIELDS}
  query LicensesList($input: LicensesListInput) {
    LicensesList(input: $input) {
      items {
        ...LicenseItemFields
      }
      notification {
        pagesCount
        totalCount
      }
    }
  }
`;

export const LICENSE_ITEM = gql`
  ${LICENSE_DEFINITION_DATA_FIELDS}
  query LicenseItem($input: LicenseItemInput!) {
    LicenseItem(input: $input) {
      ...LicenseDefinitionDataFields
    }
  }
`;

export const LICENSE_ADD = gql`
  mutation LicenseAdd($input: LicenseDataInput!) {
    LicenseAdd(input: $input) {
      id
    }
  }
`;

export const LICENSE_UPDATE = gql`
  mutation LicenseUpdate($input: LicenseDataInput!) {
    LicenseUpdate(input: $input) {
      id
    }
  }
`;

// ---------------------------------------------------------------------------
// Features
// ---------------------------------------------------------------------------

export const FEATURES_LIST = gql`
  ${FEATURE_ITEM_FIELDS}
  query FeaturesList($input: FeaturesListInput) {
    FeaturesList(input: $input) {
      items {
        ...FeatureItemFields
      }
      notification {
        pagesCount
        totalCount
      }
    }
  }
`;

export const FEATURE_ITEM = gql`
  ${FEATURE_DATA_TREE}
  query GetFeatureItem($input: FeatureItemInput!) {
    GetFeatureItem(input: $input) {
      ...FeatureDataTree
    }
  }
`;

export const FEATURE_ADD = gql`
  mutation AddFeature($input: FeatureDataInput!) {
    AddFeature(input: $input) {
      id
    }
  }
`;

export const FEATURE_UPDATE = gql`
  mutation UpdateFeature($input: FeatureDataInput!) {
    UpdateFeature(input: $input) {
      id
    }
  }
`;

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------

export const USERS_LIST = gql`
  ${USER_ITEM_DATA_FIELDS}
  query UsersList($input: UsersListInput) {
    UsersList(input: $input) {
      items {
        ...UserItemDataFields
      }
      notification {
        pagesCount
        totalCount
      }
    }
  }
`;

export const USER_ITEM = gql`
  ${USER_DATA_FIELDS}
  query UserItem($input: UserItemInput!) {
    UserItem(input: $input) {
      ...UserDataFields
    }
  }
`;

export const USER_ADD = gql`
  mutation UserAdd($input: UserDataInput!) {
    UserAdd(input: $input) {
      id
    }
  }
`;

export const USER_UPDATE = gql`
  mutation UserUpdate($input: UserDataInput!) {
    UserUpdate(input: $input) {
      id
    }
  }
`;

// ---------------------------------------------------------------------------
// Roles
// ---------------------------------------------------------------------------

export const ROLES_LIST = gql`
  ${ROLE_ITEM_DATA_FIELDS}
  query RolesList($input: RolesListInput) {
    RolesList(input: $input) {
      items {
        ...RoleItemDataFields
      }
      notification {
        pagesCount
        totalCount
      }
    }
  }
`;

export const ROLE_ITEM = gql`
  ${ROLE_DATA_FIELDS}
  query RoleItem($input: RoleItemInput!) {
    RoleItem(input: $input) {
      ...RoleDataFields
    }
  }
`;

export const ROLE_ADD = gql`
  mutation RoleAdd($input: RoleDataInput!) {
    RoleAdd(input: $input) {
      id
    }
  }
`;

export const ROLE_UPDATE = gql`
  mutation RoleUpdate($input: RoleDataInput!) {
    RoleUpdate(input: $input) {
      id
    }
  }
`;

// ---------------------------------------------------------------------------
// Groups
// ---------------------------------------------------------------------------

export const GROUPS_LIST = gql`
  ${GROUP_ITEM_DATA_FIELDS}
  query GroupsList($input: GroupsListInput) {
    GroupsList(input: $input) {
      items {
        ...GroupItemDataFields
      }
      notification {
        pagesCount
        totalCount
      }
    }
  }
`;

export const GROUP_ITEM = gql`
  ${GROUP_DATA_FIELDS}
  query GroupItem($input: GroupItemInput!) {
    GroupItem(input: $input) {
      ...GroupDataFields
    }
  }
`;

export const GROUP_ADD = gql`
  mutation GroupAdd($input: GroupDataInput!) {
    GroupAdd(input: $input) {
      id
    }
  }
`;

export const GROUP_UPDATE = gql`
  mutation GroupUpdate($input: GroupDataInput!) {
    GroupUpdate(input: $input) {
      id
    }
  }
`;

// ---------------------------------------------------------------------------
// Generic collection operations
// ---------------------------------------------------------------------------

export const REMOVE_ELEMENTS = gql`
  mutation RemoveElements($input: RemoveElementsInput!) {
    RemoveElements(input: $input) {
      success
    }
  }
`;

// ---------------------------------------------------------------------------
// Navigation pages
// ---------------------------------------------------------------------------

/**
 * `PagesData` — drives the application's primary (left-rail) navigation.
 *
 * Mirrors the QML `PagesDataController` (`ImtGuiGqlPck`). Each item carries:
 *   * `id` / `name` — page identifier and display label
 *   * `icon` — icon key (resolved via `iconRegistry` on the client)
 *   * `source` — the page-shell QML view (e.g. `GqlCollectionDocManagerPageView.qml`)
 *   * `startItem` — the actual page content QML (e.g. `ProductsMultiDocView.qml`)
 *
 * The React app maps both `source` and `startItem` to React components via
 * `pageRegistry.ts` so adding/removing pages is a server-side concern only.
 */
export const PAGES_DATA_QUERY = gql`
  query PagesData {
    PagesData {
      items {
        id
        pageId
        name
        icon
        description
        source
        startItem
        priority
        alignment
        isEnabled
        isToggled
        visible
        status
      }
    }
  }
`;
