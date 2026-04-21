# Lisa Web

A production-oriented React/TypeScript port of the Lisa QML desktop/web client
(license & product management). It uses the **ImtCore** repository
(https://github.com/ImagingTools/ImtCore) and the **Lisa** repository as the
canonical source of truth for the domain model, GraphQL contract, screen
inventory and permission/workflow rules.

This project is a P0 implementation: the critical workflows (auth, products,
licenses, features/packages, accounts, permission-aware UI, document metadata)
are fully wired against a typed GraphQL surface. The transport defaults to an
in-process mock that fully mirrors the server contract so the app runs end-to-end
without a backend; pointing the client at the real Lisa GraphQL endpoint is a
single environment-variable switch.

---

## A. Executive Summary

Lisa is a license-and-product management system. The QML desktop client
(`Impl/LisaClient`) and embedded WebAssembly variant (`Impl/LisaQmlExe` +
`Include/lisaqml/Qml/LisaWeb.qml`) sit on top of the Lisa server, talking to it
over HTTPS-GraphQL plus a WebSocket subscription channel (`PumaWsConnection` /
`LisaWsConnection`). The QML UI is composed almost entirely of reusable views
shipped by ImtCore: `imtlicgui` (feature/license/product collection views,
editors, command delegates), `imtcolgui` (`RemoteCollectionView`,
`MultiDocCollectionPage`), `imtdocgui` (document data controllers), `imtgui`
(theme, layout, dialogs), `imtauthgui` (login, permissions), `imtguigql` (the
GraphQL client bindings and `GqlModel`/`CollectionDataProvider`).

**Migration objective.** Preserve every business workflow and permission rule
of the QML client — list/edit/add/remove for **Products**, **Licenses**,
**Features/Packages** and **Accounts** — under an idiomatic web architecture:
React + TypeScript + Vite + React Router + Apollo Client. Wire it against the
GraphQL operation IDs declared in
`Partitura/LisaGraphQlVoce.arp/LisaGQLEngine.acc` and consumed by the
`GqlRequestDocumentDataController`/`CollectionDataProvider` instances in
`ImtCore/Qml/imtlicgui/*`.

**High-level architecture choice.** Single-page app, normalised Apollo cache
(with the same compound keys the server uses), feature-folder structure,
context-driven session/auth/permission gates, route-level guards, theme tokens
mirroring the QML `Style` singleton.

---

## B. Repository Investigation Summary

| Concern                       | Where it lives (canonical)                                                                                                  |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| QML web entry                 | `Include/lisaqml/Qml/LisaWeb.qml` → loads `LisaMain.qml` → `ApplicationMain` from `imtgui`                                  |
| Auth & subscription wiring    | `LisaMain.qml` (`AuthorizationController`, `WebSocketConnectionChecker`, `CachedFeatureCollection.updateModel`)             |
| Page registry                 | `Partitura/LisaQmlVoce.arp/Pages.acc` (Products, Licenses, Features pages → `MultiDocCollectionPage`)                       |
| Page implementations          | `Partitura/LisaQmlVoce.arp/{ProductsPage,LicensesPage,PackagesPage}.acc` (component composition)                            |
| Reusable QML views            | `ImtCore/Qml/imtlicgui/*.qml` (`ProductCollectionView`, `ProductView`, `LicenseCollectionView`, `LicenseEditor`, `FeatureCollectionView`, `FeatureEditor`, `CachedProductCollection`, `LicensesProvider`, command delegates) |
| GraphQL command IDs / engine  | `Partitura/LisaGraphQlVoce.arp/LisaGQLEngine.acc` (`CommandIds`, demultiplexers, subscription managers)                     |
| GraphQL request helpers       | `Impl/LisaServer/Resources/dist/GraphQLRequest_.js` (`GqlRequest`, `GqlObject`, `Field`)                                    |
| Domain repositories (server)  | `Partitura/LisaVoce.arp/{Product,License,Feature}SqlRepository.{acc,accl}`, `RootDataController.acc`, `Repositories.acc`     |
| Permissions                   | `Partitura/LisaVoce.arp/{ProductPermissions,FeaturesPermissions}.{acc,accl}` and `Impl/LisaServer/LisaFeatures.h` (the canonical permission tree) |
| Database schema (ground truth)| `Impl/LisaServer/Resources/Database/CreateTables.sql`                                                                       |
| Theme tokens                  | `Include/lisaqml/lisa_light.theme`, `lisa_dark.theme`, `lisa_decorators.theme`                                              |

Most "logic" in the Lisa repo is wiring (Acf/Partitura XML); the actual
runtime UI logic lives in ImtCore's QML modules. The web app therefore
re-implements the *behaviour* of those QML modules in React rather than the
*XML wiring*.

---

## C. QML Analysis

### C.1 Screen inventory (web-relevant)

| QML page (Pages.acc / ImtCore qml) | Purpose | Source data | Risk |
| --- | --- | --- | --- |
| `ProductsPage` (`MultiDocCollectionPage` + `ProductCollectionView` + `ProductView`) | List/edit products, assign features (tree with optional sub-features) | `ProductsList`, `ProductItem`, `ProductAdd`, `ProductUpdate` | Medium — features encoding is a custom `;`-separated wire format |
| `LicensesPage` (+ `LicenseCollectionView` + `LicenseEditor`) | List/edit licenses (SKUs) per product, choose granted features | `LicensesList`, `LicenseItem`, `LicenseAdd`, `LicenseUpdate` | Low |
| `PackagesPage` / `FeaturesPage` (+ `FeatureCollectionView` + `FeatureEditor` + `FeaturesDependenciesProvider`) | Maintain the permission/feature tree with dependencies | `PackagesList` / `FeaturesList`, `FeatureAdd`, `FeatureUpdate`, `FeatureRemove`, `GetFeatureDependencies` | Medium — recursive tree CRUD |
| Login / `ApplicationMain` auth flow | Session start | `AuthorizationController` (REST/GQL hybrid) | Low |
| Accounts / Administration | Provisioning view (read-only on web P0) | `Accounts` table | Low |
| Server configurator (`LisaServerConfigurator.qml`) | Native Qt-only; not migrated | — | Excluded |

### C.2 Component inventory

* **Layout/shell**: `ApplicationMain`, top toolbar, sidebar nav, theme switcher.
* **Collection view**: `RemoteCollectionView` + `MultiDocCollectionPage` →
  master/detail with toolbar (`commandsDelegateComp`), table sort
  (`setSortingInfo`), per-row commands (Edit/Remove/Export/Rename), metadata
  panel (`visibleMetaInfo`).
* **Editors**: `ProductView`, `LicenseEditor`, `FeatureEditor` → forms with
  feature-tree pickers, permission-aware read-only state
  (`PermissionsController.checkPermission(...)`), delegate-driven command
  dispatch (`InsertFeature`, `RemoveFeature`, …).
* **Cached collections**: `CachedProductCollection`, `CachedFeatureCollection`,
  `CachedLicenseCollection` → in-memory caches refreshed on `loggedIn`/cleared
  on `loggedOut`.
* **Subscription wiring**: `WebSocketConnectionChecker`, `SubscriptionManager`
  (`Subscription/ConnectionStatusProvider`, per-collection subscriber
  controllers).
* **Dialogs**: `MessageDialog`, `ErrorDialog`, `ModalDialogManager`.

### C.3 State, navigation, validation, error & permission models

* **State**: collection-data providers + per-document `documentModel`. No global
  Redux-style store; collections are observables refreshed via the GQL
  subscription channel.
* **Navigation**: `PagesController` builds a `MultiDocCollectionPage` per
  registered page. Each page picks an `Icon`, `Name` and a `Source` QML view.
* **Validation**: implicit, mostly relies on server rejection. Optional
  client-side checks live in command delegates (`InsertFeature` requires a
  selected parent etc.).
* **Errors**: `ErrorDialog` invoked from delegate `onError` handlers; otherwise
  `Log` component.
* **Permissions**: `PermissionsController.checkPermission("ChangeProduct")`
  toggles control read-only or hides commands. Permission ids are derived from
  the same feature tree maintained in `LisaFeatures.h`.

### C.4 Critical workflows

1. Login → cached collections refresh → main menu becomes navigable.
2. Browse Products → select → edit name/category/features → save → cache
   refresh propagates.
3. Add License under a Product → grant features → save.
4. Maintain feature tree, including optional sub-features and dependencies.
5. Logout → caches cleared.

### C.5 Migration risks / simplification candidates

* **Preserve exactly**: feature-id wire format (`;`-separated, optional
  `<rootUuid>/<featureId>`); compound license key (`(productId, id)`); permission
  id strings; subscription-based cache invalidation semantics.
* **Safe to simplify**: native file-based import/export dialogs; Qt-specific
  drag/drop; QML animations; tristate checkbox visuals (we use binary checkbox
  + per-feature optional badge).

---

## D. GraphQL/API/Domain Analysis

### D.1 Entity map

```
Account ── (1)──< ProductInstance >──(1) ── Product ──(1)──< ProductLicense ──(*)──> Feature
                                              │                                  ▲
                                              └─────── productFeatures ─────────┘
                                                            │
                                                Package ──(*)──> Feature ──(*)──> Feature (sub)
                                                                    │
                                                                    └─ FeatureDependencies ─┐
```

### D.2 Operations inventory (mirrors `LisaGQLEngine.acc`)

| Operation | Used by | Notes |
| --- | --- | --- |
| `ProductsList` | Products list | Subscribed to `OnProductsCollectionChanged` |
| `ProductItem` / `ProductAdd` / `ProductUpdate` | Product editor | `GqlRequestDocumentDataController` |
| `LicensesList` / `LicenseItem` / `LicenseAdd` / `LicenseUpdate` | Licenses pages | Same pattern |
| `FeaturesList` / `PackagesList` / `FeatureItem` / `FeatureAdd` / `FeatureUpdate` / `FeatureRemove` / `GetFeatureDependencies` | Feature editor | Recursive tree, with explicit dependency lookup |
| `OnProductsCollectionChanged` / `OnLicensesCollectionChanged` / `OnFeaturesCollectionChanged` | Cache refresh | Subscriptions over the WS channel |
| `LisaWsConnection` / `PumaWsConnection` | Session/WS heartbeat | Drives connection-status pill |
| `CommandsData` / `ProductsInfo` / `ProductsObjectView` | Server-side metadata; not user-facing on web | Excluded from P0 |

### D.3 UI ↔ API mapping (P0)

See section **H. Mapping Table** below.

### D.4 Contract & risk analysis

* **Compound keys**: `License` is keyed by `(productId, id)` (`ProductLicenses`
  PK in SQL). Reflected in Apollo `typePolicies.License.keyFields`.
* **String-encoded selection**: `Product.features` is a `;`-separated list with
  optional `<rootUuid>/<featureId>` entries. Encapsulated in
  `features/products/featureSelection.ts`; do NOT re-encode at call sites.
* **Subscription opportunities**: `OnProductsCollectionChanged` etc. Trivially
  wired by adding a `WebSocketLink` and calling `cache.evict({ fieldName: 'productsList' })` on each event.
* **Nullable trap**: `productItem(id)` may return `null`; the editor guards
  this. `meta` is non-null on persisted entities.
* **Race conditions**: `ProductUpdate` increments `revision`; the cache merges
  by `id` so the latest mutation wins — adequate for single-admin workflows.

---

## E. Migration Strategy

### Maps 1:1
* Domain entities (`Product`, `License`, `Feature`, `FeaturePackage`, `Account`,
  `SessionUser`).
* Operation surface (named, typed, fragment-based).
* Permission semantics (`hasPermission(id)` ≡ `PermissionsController.checkPermission`).
* Feature-id wire format.
* Document metadata panel (`MetaInfoPanel` ≡ QML `visibleMetaInfo`).

### Conceptually migrated, implemented differently
* **Cached collections** (`CachedProductCollection`, …) → Apollo normalised
  cache + `useQuery({ fetchPolicy: 'cache-and-network' })`. The
  `loggedIn`→refresh and `loggedOut`→clear semantics are driven by
  `client.resetStore()` / `clearStore()` inside `SessionContext`.
* **`MultiDocCollectionPage` / `RemoteCollectionView`** → master/detail split
  with shared selection state inside each feature page, instead of a generic
  collection-view runtime.
* **`PermissionsController` ad-hoc gates** → `<RequireAuth permission=…>` route
  guards + `useSession().hasPermission(…)` for in-page gating.
* **Dialogs / `ModalDialogManager`** → small `<ConfirmDialog>` component.

### Simplified
* QML transitions / animations.
* Native file dialogs for product XML import/export (deferred to P1; contract
  noted in mapping table).
* Tristate checkbox styling for sub-feature inheritance (binary checkbox with
  optional badge is functionally equivalent for selection storage).

### Redesigned for web
* Keyboard/focus behaviour now follows web defaults; no `BasicTreeView`
  mouse-only model.
* Theme switcher uses `data-theme` attribute + CSS variables instead of QML's
  `designProvider.setDesignSchema(...)`.

---

## F. Proposed Web Architecture

```
web/
├── package.json             # React 18 / Vite 5 / TypeScript 5.6 / Apollo 3
├── tsconfig*.json
├── vite.config.ts
├── eslint.config.js
├── index.html
└── src/
    ├── main.tsx             # Entry — mounts <App/>
    ├── app/
    │   ├── App.tsx          # ApolloProvider + ThemeProvider + Router + Session
    │   ├── AppShell.tsx     # Sidebar / topbar / outlet
    │   └── ThemeProvider.tsx
    ├── api/
    │   ├── client.ts        # createApolloClient (mock or HttpLink)
    │   ├── operations.ts    # Operation-id registry (mirrors LisaGQLEngine.acc)
    │   ├── graphql/
    │   │   ├── schema.ts    # SDL reconstructed from QML/server analysis
    │   │   ├── fragments.ts # MetaFields / ProductFields / LicenseFields / FeatureTree
    │   │   └── operations.ts# All queries & mutations as `gql` documents
    │   └── mock/
    │       ├── server.ts    # In-memory ApolloLink with full resolver coverage
    │       └── seed.ts      # Seed data taken from CreateTables.sql
    ├── auth/
    │   ├── SessionContext.tsx # `useSession`, `useCurrentUser`, login/logout, token persistence
    │   └── RequireAuth.tsx    # Route guard (auth + optional permission)
    ├── components/
    │   ├── ConfirmDialog.tsx
    │   ├── MetaInfoPanel.tsx
    │   └── feedback/
    │       ├── AppErrorBoundary.tsx
    │       ├── CenteredSpinner.tsx
    │       └── EmptyState.tsx
    ├── features/
    │   ├── auth/LoginPage.tsx
    │   ├── products/
    │   │   ├── ProductsPage.tsx    # list + details + editor + feature picker
    │   │   └── featureSelection.ts # parse/serialize/toggle helpers (wire format)
    │   ├── licenses/LicensesPage.tsx
    │   ├── features/FeaturesPage.tsx  # tree editor, package blocks
    │   └── accounts/AccountsPage.tsx
    ├── routes/AppRoutes.tsx
    ├── styles/{theme.css, components.css}
    ├── test/{setup.ts, featureSelection.test.ts, mockServer.test.ts}
    ├── types/domain.ts        # Strongly typed domain model + permission ids
    └── vite-env.d.ts
```

* **Routing**: nested routes; `/login` is public, everything else lives under
  `<RequireAuth>` and resolves into `<AppShell>`. Per-page guards add
  `permission=…` to gate by `PermissionsController` semantics.
* **State**: server state in Apollo's normalised cache; transient UI state
  (selection, editor mode) is local component state. No global store.
* **Forms**: small uncontrolled-style forms with `useState`. Validation lives
  in the editor itself; `react-hook-form` and `zod` are listed as dependencies
  for P1 expansion (e.g. license-id uniqueness or wizard flows) without
  changing the architecture.
* **Apollo cache typePolicies** mirror server-side primary keys
  (`License: ['productId', 'id']`, etc.) so optimistic updates remain consistent.
* **Theme**: CSS variables on `:root` / `[data-theme="dark"]`, toggled via
  `useTheme()`.
* **Error boundary** at the root + per-query `error` handling with retry banners.
* **Testing**: Vitest + Testing Library (jsdom). Two test suites today
  (`featureSelection`, `mockServer`); they exercise the wire-format helper and
  the entire mock backend (auth + CRUD + filtering).

---

## G. Implementation Plan

| Phase | Item | Status |
| --- | --- | --- |
| **P0** | Project bootstrap (Vite/TS/Apollo/Router) | ✅ Done |
| **P0** | Domain types + GraphQL schema/fragments/operations | ✅ Done |
| **P0** | Mock GraphQL backend + seed data from `CreateTables.sql` | ✅ Done |
| **P0** | Auth (login, logout, persisted token, permission gating) | ✅ Done |
| **P0** | App shell (sidebar, topbar, theme toggle, route outlet) | ✅ Done |
| **P0** | Products (list, details, editor, feature picker, delete) | ✅ Done |
| **P0** | Licenses (list, details, editor with feature picker, delete) | ✅ Done |
| **P0** | Features/Packages (tree view, add/edit/remove) | ✅ Done |
| **P0** | Accounts (read-only list) | ✅ Done |
| **P0** | Loading / empty / error states everywhere | ✅ Done |
| **P0** | Tests (wire format + mock GraphQL) and lint/typecheck/build green | ✅ Done |
| **P1** | Wire `OnXxxCollectionChanged` subscriptions via `WebSocketLink` | Open |
| **P1** | Product XML import/export (binary contract preserved server-side) | Open |
| **P1** | Account CRUD (`AccountAdd`/`AccountUpdate`/`AccountRemove`) | Open |
| **P1** | Optional sub-feature picker UI (currently flat checkbox per feature) | Open |
| **P1** | i18n (`qsTr` strings → `react-intl` or similar) | Open |
| **P2** | E2E tests (Playwright), bundle splitting, observability (`logger`) | Open |

### Risks & mitigations

* **Server-side schema drift** — the SDL in `src/api/graphql/schema.ts` is a
  best-effort reconstruction. When the production server publishes its schema
  (`/Lisa/graphql/schema`), regenerate types via `graphql-codegen`; the
  `OPERATIONS` registry in `src/api/operations.ts` stays the canonical naming.
* **Compound keys** — already encoded in Apollo type policies; if the server
  changes a key, only `api/client.ts` needs updating.
* **Permission drift** — `PERMISSION_IDS` in `src/types/domain.ts` is the
  single source of truth. Adding a permission updates the type union and
  therefore every guard at compile time.

---

## H. Mapping Table

| QML screen / component (ImtCore) | Web module / component | GraphQL ops | Notes / deviations |
| --- | --- | --- | --- |
| `ApplicationMain` (`imtgui`), `LisaMain.qml` | `app/App.tsx` + `app/AppShell.tsx` | — | Replaces QML splash + connection wiring |
| `AuthorizationController` + login dialog | `auth/SessionContext` + `features/auth/LoginPage` | `Login`, `Logout`, `Me` | Token kept in `localStorage`; `client.resetStore()` on login mirrors `loggedIn` cache refresh |
| `PermissionsController.checkPermission` | `useSession().hasPermission` + `<RequireAuth permission=…>` | `Me.permissions` | Exhaustive permission union in `types/domain.ts` |
| `WebSocketConnectionChecker` | (P1) WS link in `api/client.ts` | `PumaWsConnection`, `LisaWsConnection` | Pill placeholder is wired in CSS (`.connection-pill`) |
| `MultiDocCollectionPage` + `RemoteCollectionView` | Page-level master/detail layout (`.split`, `.panel`) | `XxxList` | Unified per page rather than a generic runtime |
| `ProductCollectionView` + `ProductView` (`imtlicgui`) | `features/products/ProductsPage.tsx` | `ProductsList`, `ProductItem`, `ProductAdd`, `ProductUpdate`, `ProductRemove`, `PackagesList` | Tree picker preserves the `;`-separated wire format (`featureSelection.ts`) |
| `ProductCollectionViewCommandsDelegate` | `<ConfirmDialog/>` inside `ProductDetails` | `ProductRemove` | Native file dialogs (XML import/export) deferred to P1 |
| `LicenseCollectionView` + `LicenseEditor` | `features/licenses/LicensesPage.tsx` | `LicensesList`, `LicenseAdd`, `LicenseUpdate`, `LicenseRemove`, `ProductsList`, `PackagesList` | `License` Apollo key = `(productId, id)` |
| `FeatureCollectionView` + `FeatureEditor` | `features/features/FeaturesPage.tsx` | `PackagesList`, `FeatureAdd`, `FeatureUpdate`, `FeatureRemove` | Insert/remove sub-feature commands modeled as toolbar buttons |
| `FeaturesDependenciesProvider` | Same page; dependencies edited inline (comma-separated input) | `GetFeatureDependencies` | UI-side validation deferred to P1 |
| Accounts/Administration | `features/accounts/AccountsPage.tsx` | `AccountsList` | Read-only P0 |
| `MetaInfo` panel (`visibleMetaInfo`) | `components/MetaInfoPanel.tsx` | included in fragments | Always visible in detail panes; toggle is P2 |
| `ErrorDialog` / `MessageDialog` / `ModalDialogManager` | `components/ConfirmDialog.tsx` + per-page error banners | — | One dialog implementation; messages localised in component |
| Theme (`lisa_light.theme`, `lisa_dark.theme`) | `app/ThemeProvider.tsx` + `styles/theme.css` | — | `data-theme` attribute on `<html>`; `prefers-color-scheme` honored |
| `LisaServerConfigurator.qml` | — (excluded) | — | Native admin tool; not a web concern |

---

## I. Assumptions and Open Questions

* **Unknown live schema**: the GraphQL schema is reconstructed from QML usage
  and the SQL DDL. When the production server is reachable, run
  `graphql-codegen` against `/Lisa/graphql` and let it regenerate the types in
  `src/types/generated`; `operations.ts` documents already align.
* **`LicenseRemove` mutation name**: the QML code only exercises `Add`/`Update`
  via `GqlRequestDocumentDataController` and uses `Remove` at the collection
  level. We exposed an explicit `licenseRemove(id, productId)` to avoid
  client-side filtering hacks; this is the safest extensible default.
* **`Product.features` encoding**: kept as the QML wire format (`;` and
  `<rootUuid>/<featureId>`). The helper module is the single owner; if a future
  server version migrates to a structured field, swap the helper without
  touching call sites.
* **Auth token contract**: assumed bearer-token over `Authorization` header.
  Cookie/SSO swap-in is supported by the `setContext` link.
* **Subscriptions**: implementation deferred to P1; the `OPERATIONS` registry
  documents the names and the Apollo client is link-extensible (just `split` on
  `getMainDefinition` and add a `WebSocketLink`).
* **Optional sub-features UI**: the QML `BasicTreeView` uses tristate
  checkboxes against an in-memory `selectedOptionalFeatures` list. We persist
  the same structure but render binary checkboxes per node — selection
  semantics are preserved because the wire format is identical.
* **Account CRUD**: not exposed in the QML page (`Administration` permission
  guards a placeholder), so we ship a read-only list and document the gap.

---

## J. Full Implementation

The complete implementation is in this folder. Highlights:

* `src/api/graphql/schema.ts` — SDL.
* `src/api/graphql/operations.ts` — typed `gql` documents for every operation.
* `src/api/mock/server.ts` — in-memory backend used for development & tests.
* `src/api/client.ts` — Apollo factory that switches transport via env var.
* `src/auth/SessionContext.tsx` — login/logout/session-restore + permission API.
* `src/features/products/featureSelection.ts` — wire-format encoder/decoder.
* `src/features/{products,licenses,features,accounts}/*Page.tsx` — feature
  modules.
* `src/test/*.test.ts` — Vitest unit/integration tests (10 passing).

---

## K. Run / Build / Test Instructions

> Requires Node.js ≥ 20.

```bash
cd web
npm install              # install once

# Development (in-memory mock backend, hot reload)
npm run dev              # → http://localhost:5173
#   Demo accounts: admin / admin   (full access)
#                   viewer / view  (read-only)

# Run against a real Lisa GraphQL server
VITE_LISA_GRAPHQL_URL=https://lisa.example/Lisa/graphql npm run dev

# Production build
npm run build            # → web/dist/
npm run preview          # serve the built bundle

# Quality gates
npm run typecheck        # tsc -b --noEmit
npm run lint             # eslint .
npm test                 # vitest run (10 tests)
```

### Configuration

| Variable | Purpose | Default |
| --- | --- | --- |
| `VITE_LISA_GRAPHQL_URL` | If set, Apollo uses an `HttpLink` to this URL instead of the in-memory mock. | — (mock) |

The mock state is persisted to `localStorage` (`lisa-web.mock-state.v1`);
clear it from devtools to reset to the seed in `src/api/mock/seed.ts`.

### Project status

* `npm run typecheck` — ✅ clean
* `npm test` — ✅ 10/10 passing
* `npm run lint` — ✅ 0 errors (a few non-blocking Fast-Refresh warnings)
* `npm run build` — ✅ production bundle built successfully (~125 kB gzipped)
