import { describe, expect, it } from 'vitest';
import { qmlBasename, resolvePageContent, resolvePageShell } from '../app/pageRegistry';

describe('pageRegistry', () => {
  it('extracts the QML basename from a qrc path', () => {
    expect(qmlBasename('qrc:/qml/imtlicgui/ProductsMultiDocView.qml')).toBe(
      'ProductsMultiDocView',
    );
    expect(qmlBasename('../imtlicgui/PackagesMultiDocView.qml')).toBe('PackagesMultiDocView');
    expect(qmlBasename('FooView')).toBe('FooView');
    expect(qmlBasename('')).toBe('');
    expect(qmlBasename(undefined)).toBe('');
  });

  it('resolves known content components and returns null for unknown', () => {
    expect(resolvePageContent('qrc:/qml/imtlicgui/ProductsMultiDocView.qml')).toBeTruthy();
    expect(resolvePageContent('qrc:/qml/imtauthgui/AccountsMultiDocView.qml')).toBeTruthy();
    expect(resolvePageContent('qrc:/qml/Unknown.qml')).toBeNull();
  });

  it('resolves known shells and falls back to a passthrough for unknown', () => {
    expect(resolvePageShell('qrc:/qml/imtguigql/GqlCollectionDocManagerPageView.qml')).toBeTruthy();
    expect(resolvePageShell('qrc:/qml/imtdocgui/MultiDocWorkspacePageView.qml')).toBeTruthy();
    // Unknown source still returns a renderable shell (passthrough).
    expect(resolvePageShell('qrc:/qml/SomethingNew.qml')).toBeTruthy();
  });
});
