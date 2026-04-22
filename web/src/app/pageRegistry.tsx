/**
 * Page registry — the React equivalent of the QML `PagesDataController`
 * source/startItem indirection.
 *
 * The QML server returns each page as `{ source, startItem }` where
 *   * `source`    — the page-shell view (for example
 *                   `qrc:/qml/imtguigql/GqlCollectionDocManagerPageView.qml`
 *                   or `qrc:/qml/imtdocgui/MultiDocWorkspacePageView.qml`),
 *   * `startItem` — the actual content view inside that shell (for example
 *                   `qrc:/qml/imtlicgui/ProductsMultiDocView.qml`).
 *
 * On the React side we resolve both fields by the QML resource basename
 * (without `.qml`) so that any new page added on the server side just plugs
 * into the existing shells without code changes here, mirroring how the QML
 * client dynamically loads the view.
 */
import type { ComponentType, SVGProps } from 'react';
import type { ReactNode } from 'react';
import { ProductsPage } from '@/features/products/ProductsPage';
import { LicensesPage } from '@/features/licenses/LicensesPage';
import { FeaturesPage } from '@/features/features/FeaturesPage';
import { AccountsPage } from '@/features/accounts/AccountsPage';
import {
  AccountsIcon,
  FeaturesIcon,
  LicensesIcon,
  ProductsIcon,
} from '@/components/icons';
import { GqlCollectionDocManagerPageView } from '@/components/shells/GqlCollectionDocManagerPageView';
import { MultiDocWorkspacePageView } from '@/components/shells/MultiDocWorkspacePageView';

export type PageContent = ComponentType;

export interface PageShellProps {
  /** Resolved page content, picked up via `startItem` on the descriptor. */
  children: ReactNode;
  /** Display title — useful when the shell renders its own header bar. */
  title?: string;
}

export type PageShell = ComponentType<PageShellProps>;

export type PageIcon = ComponentType<SVGProps<SVGSVGElement>>;

/**
 * Strip the `qrc:/qml/.../FooView.qml` wrapper and return `FooView`.
 * Falls back to the input string if it doesn't look like a QML path.
 */
export function qmlBasename(value: string | undefined | null): string {
  if (!value) return '';
  const slash = value.lastIndexOf('/');
  const tail = slash >= 0 ? value.slice(slash + 1) : value;
  return tail.replace(/\.qml$/i, '');
}

/**
 * `startItem` basename → React content component.
 * Add new pages by adding an entry here (and on the server).
 */
const CONTENT_REGISTRY: Record<string, PageContent> = {
  ProductsMultiDocView: ProductsPage,
  LicensesMultiDocView: LicensesPage,
  PackagesMultiDocView: FeaturesPage,
  FeaturesMultiDocView: FeaturesPage,
  AccountsMultiDocView: AccountsPage,
};

/**
 * `source` basename → React shell component. Defaults to a transparent
 * passthrough so an unknown shell still renders its content.
 */
const SHELL_REGISTRY: Record<string, PageShell> = {
  GqlCollectionDocManagerPageView,
  MultiDocWorkspacePageView,
  // SingleDocumentWorkspacePageView is currently a passthrough — pages that
  // use it render their own chrome.
  SingleDocumentWorkspacePageView: ({ children }) => <>{children}</>,
};

const ICON_REGISTRY: Record<string, PageIcon> = {
  Product: ProductsIcon,
  Products: ProductsIcon,
  License: LicensesIcon,
  Licenses: LicensesIcon,
  Feature: FeaturesIcon,
  Features: FeaturesIcon,
  FeaturePackage: FeaturesIcon,
  Account: AccountsIcon,
  Accounts: AccountsIcon,
};

export function resolvePageContent(startItem: string | undefined | null): PageContent | null {
  const key = qmlBasename(startItem);
  return CONTENT_REGISTRY[key] ?? null;
}

export function resolvePageShell(source: string | undefined | null): PageShell {
  const key = qmlBasename(source);
  return SHELL_REGISTRY[key] ?? SHELL_REGISTRY.SingleDocumentWorkspacePageView;
}

export function resolvePageIcon(icon: string | undefined | null): PageIcon | null {
  if (!icon) return null;
  if (ICON_REGISTRY[icon]) return ICON_REGISTRY[icon];
  // Handle 'Icons/Product' or '../../Icons/Product_On_Selected.svg' style
  const cleaned = icon.replace(/\.[a-z0-9]+$/i, '').split('/').pop() ?? '';
  const head = cleaned.split('_')[0] ?? cleaned;
  return ICON_REGISTRY[head] ?? null;
}
