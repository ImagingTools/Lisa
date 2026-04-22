/**
 * `MultiDocWorkspacePageView` — React port of the QML page-shell of the same
 * name (`ImtCore/Qml/imtdocgui/MultiDocWorkspacePageView.qml`).
 *
 * In QML this shell hosts an arbitrary set of opened documents inside a
 * tabbed workspace (the first tab being the workspace's start item). Pages
 * that opt into this shell already manage their own `PageTabs`, so on the
 * React side the shell stays a transparent host — the actual multi-document
 * behaviour comes from the content via `usePageTabs` + `PageTabs`.
 */
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  title?: string;
}

export function MultiDocWorkspacePageView({ children }: Props) {
  return <div className="page-shell page-shell--multi-doc-workspace">{children}</div>;
}
