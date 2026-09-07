/**
 * Pages-data operations — drives the application's primary navigation.
 *
 * Source: ImtCore `PagesDataController` (`ImtGuiGqlPck`) which exposes a
 * `PagesData` query whose items mirror `imtbase::IGqlRepresentationDataController`
 * page descriptors. Each item carries a `source` (the QML page-shell view —
 * e.g. `MultiDocWorkspacePageView.qml` / `GqlCollectionDocManagerPageView.qml`
 * / `SingleDocumentWorkspacePageView.qml`) and a `startItem` (the actual
 * page content — e.g. `ProductsMultiDocView.qml`).
 *
 * On the React side both fields are looked up in registries (see
 * `src/app/pageRegistry.ts`) to map QML resource paths to React components.
 */
export const PagesSDL = `
  type PageDataItem {
    id: ID!
    pageId: ID
    name: String
    icon: String
    description: String
    source: String
    startItem: String
    priority: Int
    alignment: Int
    isEnabled: Boolean
    isToggled: Boolean
    visible: Boolean
    status: String
  }

  type PagesDataPayload {
    items: [PageDataItem]
    notification: NotificationItem
  }

  input PagesDataInput {
    viewParams: CollectionViewParams
  }
`;
