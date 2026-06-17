/**
 * `GqlCollectionDocManagerPageView` — React port of the QML page-shell of
 * the same name (`ImtCore/Qml/imtguigql/GqlCollectionDocManagerPageView.qml`).
 *
 * In QML this shell wraps a `MultiDocCollectionPage` (collection table on the
 * first tab + opened editor documents on subsequent tabs) and bridges it to
 * the `Gql*Collection` controllers. On the React side the heavy lifting is
 * already done by the individual page contents (`ProductsPage`, …) which
 * compose `PageTabs` + `CollectionLayout` themselves; this shell is therefore
 * a thin, transparent host that gives every page the same outer layout and
 * makes the indirection explicit (i.e. the server-supplied `source` value
 * actually maps to a real React component).
 */
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  title?: string;
}

export function GqlCollectionDocManagerPageView({ children }: Props) {
  return <div className="page-shell page-shell--collection-doc-manager">{children}</div>;
}
