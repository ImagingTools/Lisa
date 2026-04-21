/**
 * Local GraphQL schema (SDL).
 *
 * This SDL is taken verbatim from ImtCore (https://github.com/ImagingTools/ImtCore)
 * SDL files under `Sdl/imtauth/1.0/`, `Sdl/imtlic/1.0/`, and `Sdl/imtbase/1.0/`.
 *
 * The original imt SDL uses custom schema directives (`namespace:`, `version:`)
 * that are not part of the standard GraphQL spec. For the mock server, we
 * concatenate all SDL fragments and define the necessary scalars so that
 * Apollo's parser accepts the document.
 *
 * When a real Lisa GraphQL endpoint is wired in, only the transport changes —
 * the operations, fragments and types on the client stay the same.
 */
import { ImtBaseTypesSDL } from './sdl/ImtBaseTypes.sdl';
import { ImtCollectionSDL } from './sdl/ImtCollection.sdl';
import { AuthorizationSDL } from './sdl/Authorization.sdl';
import { UsersSDL } from './sdl/Users.sdl';
import { RolesSDL } from './sdl/Roles.sdl';
import { GroupsSDL } from './sdl/Groups.sdl';
import { ProfileSDL } from './sdl/Profile.sdl';
import { ProductsSDL } from './sdl/Products.sdl';
import { LicensesSDL } from './sdl/Licenses.sdl';
import { FeaturesSDL } from './sdl/Features.sdl';

export const typeDefs = /* GraphQL */ `
  ${ImtBaseTypesSDL}
  ${ImtCollectionSDL}

  type Query {
    # Authorization
    Authorization(input: AuthorizationInput): AuthorizationPayload!
    UserToken(input: AuthorizationInput): AuthorizationPayload!
    GetPermissions(input: TokenInput): PermissionList!

    # Products
    ProductsList(input: ProductsListInput): ProductsListPayload!
    ProductItem(input: ProductItemInput): ProductData!

    # Licenses
    LicensesList(input: LicensesListInput): LicensesListPayload!
    LicenseItem(input: LicenseItemInput): LicenseDefinitionData!

    # Features
    FeaturesList(input: FeaturesListInput): FeaturesListPayload!
    GetFeatureItem(input: FeatureItemInput): FeatureData!

    # Users
    UsersList(input: UsersListInput): UsersListPayload!
    UserItem(input: UserItemInput): UserData!

    # Roles
    RolesList(input: RolesListInput): RolesListPayload!
    RoleItem(input: RoleItemInput): RoleData!

    # Groups
    GroupsList(input: GroupsListInput): GroupsListPayload!
    GroupItem(input: GroupItemInput): GroupData!

    # Profile
    GetProfile(input: GetProfileInput): ProfileData!
  }

  type Mutation {
    # Authorization
    Logout(input: TokenInput): LogoutPayload!

    # Products
    ProductAdd(input: ProductDataInput): AddedNotificationPayload!
    ProductUpdate(input: ProductDataInput): UpdatedNotificationPayload!

    # Licenses
    LicenseAdd(input: LicenseDataInput): AddedNotificationPayload!
    LicenseUpdate(input: LicenseDataInput): UpdatedNotificationPayload!

    # Features
    AddFeature(input: FeatureDataInput): AddedNotificationPayload!
    UpdateFeature(input: FeatureDataInput): UpdatedNotificationPayload!

    # Users
    UserAdd(input: UserDataInput): AddedNotificationPayload!
    UserUpdate(input: UserDataInput): UpdatedNotificationPayload!
    ChangePassword(input: ChangePasswordInput): ChangePasswordPayload!

    # Roles
    RoleAdd(input: RoleDataInput): AddedNotificationPayload!
    RoleUpdate(input: RoleDataInput): UpdatedNotificationPayload!

    # Groups
    GroupAdd(input: GroupDataInput): AddedNotificationPayload!
    GroupUpdate(input: GroupDataInput): UpdatedNotificationPayload!

    # Profile
    SetProfile(input: SetProfileInput): SetProfileResponse!

    # Generic collection operations
    RemoveElements(input: RemoveElementsInput): RemoveElementsPayload
  }

  ${AuthorizationSDL}
  ${UsersSDL}
  ${RolesSDL}
  ${GroupsSDL}
  ${ProfileSDL}
  ${ProductsSDL}
  ${LicensesSDL}
  ${FeaturesSDL}
`;
