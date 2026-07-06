// ============================================================
// SILLAGE — fragrance lines (pure)
// Detects flanker families from the data itself: within one
// brand, a scent whose name extends another's at a word
// boundary is a flanker of it ("Cool Water" -> "Cool Water
// Intense"). The shortest such name is the line's root.
// ============================================================

import type { Perfume } from './types.ts';

export interface FragranceLine {
  rootId: string;
  rootName: string;
  memberIds: string[]; // includes the root, sorted root-first then by year
}

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

/** True when `child` extends `parent` at a word boundary. */
function isFlankerName(parent: string, child: string): boolean {
  if (parent.length < 3) return false; // "Y" must not own a line
  if (child === parent) return false;
  return child.startsWith(parent + ' ');
}

/** Build line membership for every perfume id that belongs to a line of >=2. */
export function buildLines(perfumes: Perfume[]): Map<string, FragranceLine> {
  const byBrand = new Map<string, Perfume[]>();
  for (const p of perfumes) {
    const key = norm(p.brand);
    const list = byBrand.get(key) ?? [];
    list.push(p);
    byBrand.set(key, list);
  }

  const out = new Map<string, FragranceLine>();

  for (const group of byBrand.values()) {
    const withNorm = group.map((p) => ({ p, n: norm(p.name) }));

    for (const root of withNorm) {
      // a root must not itself be a flanker of something shorter
      const isChild = withNorm.some((o) => isFlankerName(o.n, root.n));
      if (isChild) continue;

      const members = withNorm.filter(
        (o) => o.n === root.n || isFlankerName(root.n, o.n),
      );
      if (members.length < 2) continue;

      const sorted = [
        root.p,
        ...members
          .filter((m) => m.p.id !== root.p.id)
          .map((m) => m.p)
          .sort((a, b) => (a.year ?? 9999) - (b.year ?? 9999)),
      ];
      const line: FragranceLine = {
        rootId: root.p.id,
        rootName: root.p.name,
        memberIds: sorted.map((m) => m.id),
      };
      for (const m of sorted) out.set(m.id, line);
    }
  }
  return out;
}
