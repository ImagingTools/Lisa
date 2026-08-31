/**
 * Authorization operations.
 * Source: ImtCore/Sdl/imtauth/1.0/Authorization.sdl
 */
export const AuthorizationSDL = `
  type AuthorizationPayload {
    userId: ID
    username: ID
    token: ID
    refreshToken: ID
    systemId: ID
    permissions: ID
  }

  input AuthorizationInput {
    login: String!
    password: String!
    productId: ID
  }

  input TokenInput {
    accessToken: ID!
  }

  type LogoutPayload {
    ok: Boolean
  }

  type PermissionList {
    permissions: [ID]!
  }
`;
