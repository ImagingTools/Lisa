// Create the fixture roles + users this suite needs, through Lisa's own GraphQL endpoint.
//
// Ported from ProLife's Tests/ProLifeGui/fixtures/seed.js, which uses the same imtauth mutations
// (ImtCore/Sdl/imtauth/1.0/Users.sdl) - they are served by Lisa too, verified against a live server:
// unauthenticated UserAdd answers "Invalid permissions for the user ''", and with a superuser token it
// gets as far as validating the payload. ProLife bakes its users into a derived database backup
// instead; Lisa seeds at global-setup time, which keeps the backup untouched and costs a handful of
// requests. Run-CiTests.ps1 restores puma_test before every run, so this always creates them fresh.
//
// Idempotent: "already exists" style failures are tolerated, so a re-run against a warm database is
// fine, as is the second Playwright invocation of a two-phase CI run.

const { seededUsers } = require('./users');

const GQL_PATH = '/Lisa/graphql';
const PRODUCT_ID = 'Lisa';

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

async function gql(request, baseURL, token, query) {
  const res = await request.post(baseURL + GQL_PATH, {
    headers: { 'content-type': 'application/json', 'x-authentication-token': token || '' },
    data: JSON.stringify({ query }),
  });
  return res.json().catch(() => ({}));
}

/**
 * Authenticate the superuser and return its token.
 * @returns {Promise<string>}
 */
async function authorizeSu(request, baseURL, login, password) {
  const q = `query Authorization { Authorization(input: { login: "${login}", password: "${password}", productId: "${PRODUCT_ID}" }) { token userId } }`;
  const json = await gql(request, baseURL, '', q);
  const auth = json && json.data && json.data.Authorization;
  if (!auth || !auth.token) throw new Error('seed: superuser authorization failed: ' + JSON.stringify(json));
  return auth.token;
}

function pickId(json, field) {
  try {
    return json.data[field].addedNotification.id;
  } catch (_) {
    return null;
  }
}

// "Already exists" is success on a re-seed; anything else is a real failure and must not pass quietly -
// a user that was not created logs in as nobody, and every permission-gated test then skips green.
function assertTolerable(json, label) {
  const errs = (json && json.errors) || [];
  const msg = JSON.stringify(json);
  if (errs.length && !/already exists|duplicate|exists/i.test(msg)) {
    throw new Error(`seed: ${label} failed unexpectedly: ${msg}`);
  }
}

/**
 * Create a role and a user for every fixture user carrying `seed: true`.
 * @param {import('@playwright/test').APIRequestContext} request
 * @param {string} baseURL
 * @param {string} suToken
 */
async function seedUsers(request, baseURL, suToken) {
  await assertPermissionsExist(request, baseURL, suToken);
  for (const user of seededUsers()) {
    const roleUuid = uuid();
    const permissions = user.permissions.join(';');
    const roleAdd = `mutation RoleAdd { RoleAdd(input: { typeId: "Role", productId: "${PRODUCT_ID}", id: "${roleUuid}", item: { id: "${roleUuid}", name: "${user.roleName}", description: "LisaGui seeded role", roleId: "${user.roleId}", productId: "${PRODUCT_ID}", parentRoles: "", permissions: "${permissions}", isDefault: false, isGuest: false } }) { addedNotification { id } } }`;
    const roleRes = await gql(request, baseURL, suToken, roleAdd);
    const roleId = pickId(roleRes, 'RoleAdd') || roleUuid;
    assertTolerable(roleRes, `RoleAdd(${user.roleName})`);

    const userUuid = uuid();
    const userAdd = `mutation UserAdd { UserAdd(input: { typeId: "User", productId: "${PRODUCT_ID}", id: "${userUuid}", item: { id: "${userUuid}", productId: "${PRODUCT_ID}", name: "${user.title}", username: "${user.login}", password: "${user.password}", email: "${user.login}@lisagui.test", groups: [], roles: ["${roleId}"], permissions: "", systemInfos: [] } }) { addedNotification { id } } }`;
    const userRes = await gql(request, baseURL, suToken, userAdd);
    assertTolerable(userRes, `UserAdd(${user.login})`);
  }
}

/**
 * Fail loudly on a permission id the product does not define.
 *
 * RoleAdd accepts ANY string, so a stale or invented id is stored, granted, and does nothing: the user
 * logs in, the collection loads, and only the missing command gives it away. That is how "EditFeature"
 * - which Pages.acc lists but the server does not define - went unnoticed. The server's own tree is the
 * only authority, so ask it.
 */
async function assertPermissionsExist(request, baseURL, suToken) {
  const q = `query { GetProductPermissions(input: { productId: "${PRODUCT_ID}" }) { groups { entries { permissionId } } } }`;
  const json = await gql(request, baseURL, suToken, q);
  const payload = json && json.data && json.data.GetProductPermissions;
  if (!payload || !payload.groups) throw new Error('seed: GetProductPermissions returned nothing: ' + JSON.stringify(json));
  const known = new Set(payload.groups.flatMap((g) => (g.entries || []).map((e) => e.permissionId)));
  for (const user of seededUsers()) {
    const unknown = user.permissions.filter((p) => !known.has(p));
    if (unknown.length) {
      throw new Error(
        `seed: user "${user.key}" declares permissions the product does not define: ${unknown.join(', ')}. ` +
          `Known: ${[...known].sort().join(', ')}`
      );
    }
  }
}

module.exports = { seedUsers, authorizeSu, gql, uuid };
