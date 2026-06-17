/**
 * User profile operations.
 * Source: ImtCore/Sdl/imtauth/1.0/Profile.sdl
 */
export const ProfileSDL = `
  type RoleInfo {
    id: ID
    name: String
    description: String
  }

  type GroupInfo {
    id: ID
    name: String
    description: String
  }

  type PermissionInfo {
    id: ID
    name: String
    description: String
  }

  type ProfileData {
    id: ID
    systemId: ID
    username: String
    name: String
    email: String
    roles: [RoleInfo]
    groups: [GroupInfo]
    permissions: [PermissionInfo]
  }

  type SetProfileResponse {
    status: Boolean
  }

  input GetProfileInput {
    id: ID!
    productId: ID!
  }

  input SetProfileInput {
    id: ID!
    name: String
    email: String
  }
`;
