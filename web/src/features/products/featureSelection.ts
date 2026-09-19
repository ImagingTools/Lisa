/**
 * Encoding helpers for `Product.features`.
 *
 * The QML `ProductView` (see ImtCore `Qml/imtlicgui/ProductView.qml`) stores
 * the assigned features in a single `;`-separated string. Optional sub-features
 * are encoded as `<rootFeatureUuid>/<featureId>`. We keep this exact wire
 * format so the web client stays interoperable with the existing server.
 */

export interface FeatureSelection {
  /** Plain top-level feature ids (e.g. `"#PatchInspection"`). */
  ids: Set<string>;
  /** Selected optional sub-features keyed by `rootUuid → set of featureIds`. */
  optional: Map<string, Set<string>>;
}

export function parseFeatureSelection(raw: string | null | undefined): FeatureSelection {
  const ids = new Set<string>();
  const optional = new Map<string, Set<string>>();
  if (!raw) return { ids, optional };
  for (const entry of raw.split(';')) {
    const trimmed = entry.trim();
    if (!trimmed) continue;
    const slash = trimmed.indexOf('/');
    if (slash >= 0) {
      const rootUuid = trimmed.slice(0, slash);
      const featureId = trimmed.slice(slash + 1);
      const bag = optional.get(rootUuid) ?? new Set<string>();
      bag.add(featureId);
      optional.set(rootUuid, bag);
    } else {
      ids.add(trimmed);
    }
  }
  return { ids, optional };
}

export function serializeFeatureSelection(selection: FeatureSelection): string {
  const parts: string[] = [];
  for (const id of selection.ids) parts.push(id);
  for (const [rootUuid, bag] of selection.optional) {
    for (const featureId of bag) parts.push(`${rootUuid}/${featureId}`);
  }
  return parts.join(';');
}

export function toggleFeatureId(
  selection: FeatureSelection,
  featureId: string,
): FeatureSelection {
  const next: FeatureSelection = {
    ids: new Set(selection.ids),
    optional: new Map([...selection.optional].map(([k, v]) => [k, new Set(v)])),
  };
  if (next.ids.has(featureId)) next.ids.delete(featureId);
  else next.ids.add(featureId);
  return next;
}
