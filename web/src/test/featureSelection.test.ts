import { describe, expect, it } from 'vitest';
import {
  parseFeatureSelection,
  serializeFeatureSelection,
  toggleFeatureId,
} from '../features/products/featureSelection';

describe('featureSelection', () => {
  it('parses an empty value to empty selection', () => {
    const sel = parseFeatureSelection('');
    expect(sel.ids.size).toBe(0);
    expect(sel.optional.size).toBe(0);
  });

  it('parses plain feature ids', () => {
    const sel = parseFeatureSelection('#A;#B;#C');
    expect([...sel.ids]).toEqual(['#A', '#B', '#C']);
    expect(sel.optional.size).toBe(0);
  });

  it('parses optional sub-features under a root uuid', () => {
    const sel = parseFeatureSelection('#A;root-uuid/#Sub1;root-uuid/#Sub2');
    expect([...sel.ids]).toEqual(['#A']);
    expect(sel.optional.get('root-uuid')).toBeDefined();
    expect([...(sel.optional.get('root-uuid') as Set<string>)]).toEqual([
      '#Sub1',
      '#Sub2',
    ]);
  });

  it('round-trips through serialize/parse', () => {
    const original = '#A;#B;root-uuid/#Sub1';
    const re = serializeFeatureSelection(parseFeatureSelection(original));
    // order is preserved enough for set semantics — compare as sets of parts.
    expect(re.split(';').sort()).toEqual(original.split(';').sort());
  });

  it('toggles ids without mutating the source', () => {
    const sel = parseFeatureSelection('#A');
    const next = toggleFeatureId(sel, '#B');
    expect([...sel.ids]).toEqual(['#A']);
    expect([...next.ids].sort()).toEqual(['#A', '#B']);
    const next2 = toggleFeatureId(next, '#A');
    expect([...next2.ids]).toEqual(['#B']);
  });

  it('ignores empty entries safely', () => {
    const sel = parseFeatureSelection(';;#A;');
    expect([...sel.ids]).toEqual(['#A']);
  });
});
