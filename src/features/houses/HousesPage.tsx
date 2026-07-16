// ============================================================
// SILLAGE — Houses & Noses (/#/houses · /#/perfumers)
// One index, two lenses: the maisons of the atlas, and the
// perfumers who composed them (grouped by individual, so a
// collaboration credits every nose). Clicking either opens the
// Atlas filtered to it.
// ============================================================

import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { AccordFamily, Perfume } from '@/domain/types';
import { PERFUMES } from '@/data/perfumes';
import { FAMILY_COLOR, FAMILY_LABEL } from '@/data/notes';
import { useDiscovery } from '@/store/discoveryStore';
import { BottleVisual } from '@/shared/ui/BottleVisual';
import { ease } from '@/shared/motion/motion';

export type IndexMode = 'maisons' | 'noses';

interface IndexEntry {
  name: string;
  meta: string; // "17 scents · 1966–2021" or "for Chanel · Dior"
  perfumes: Perfume[];
  topFamilies: AccordFamily[];
}

function topFamiliesOf(perfumes: Perfume[]): AccordFamily[] {
  const famWeight = new Map<AccordFamily, number>();
  for (const p of perfumes)
    for (const a of p.accords)
      famWeight.set(a.family, (famWeight.get(a.family) ?? 0) + a.weight);
  return [...famWeight.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([f]) => f);
}

const byYear = (a: Perfume, b: Perfume) => (a.year ?? 9999) - (b.year ?? 9999);

function buildMaisons(): IndexEntry[] {
  const map = new Map<string, Perfume[]>();
  for (const p of PERFUMES) {
    const list = map.get(p.brand) ?? [];
    list.push(p);
    map.set(p.brand, list);
  }
  return [...map.entries()]
    .map(([name, perfumes]) => {
      const years = perfumes.filter((p) => p.year).map((p) => p.year!);
      const span =
        years.length && Math.min(...years) !== Math.max(...years)
          ? ` · ${Math.min(...years)}–${Math.max(...years)}`
          : '';
      return {
        name,
        meta: `${perfumes.length} scent${perfumes.length === 1 ? '' : 's'}${span}`,
        perfumes: [...perfumes].sort(byYear),
        topFamilies: topFamiliesOf(perfumes),
      };
    })
    .sort((a, b) => b.perfumes.length - a.perfumes.length || a.name.localeCompare(b.name));
}

/** Split "Anne Flipo, Pierre Wargnye & Dominique Ropion" into individuals. */
function splitPerfumers(credit: string): string[] {
  return credit
    .split(/,|&/)
    .map((s) => s.trim())
    .filter((s) => s.length >= 3);
}

function buildNoses(): IndexEntry[] {
  const map = new Map<string, Perfume[]>();
  for (const p of PERFUMES) {
    if (!p.perfumer) continue;
    for (const nose of splitPerfumers(p.perfumer)) {
      const list = map.get(nose) ?? [];
      list.push(p);
      map.set(nose, list);
    }
  }
  return [...map.entries()]
    .filter(([, perfumes]) => perfumes.length >= 2) // solo credits live on the scent itself
    .map(([name, perfumes]) => {
      const houses = [...new Set(perfumes.map((p) => p.brand))];
      return {
        name,
        meta: `for ${houses.slice(0, 3).join(' · ')}${houses.length > 3 ? ' …' : ''}`,
        perfumes: [...perfumes].sort(byYear),
        topFamilies: topFamiliesOf(perfumes),
      };
    })
    .sort((a, b) => b.perfumes.length - a.perfumes.length || a.name.localeCompare(b.name));
}

export function HousesPage({ mode = 'maisons' }: { mode?: IndexMode }) {
  const entries = useMemo(
    () => (mode === 'maisons' ? buildMaisons() : buildNoses()),
    [mode],
  );
  const setSearch = useDiscovery((s) => s.setSearch);
  const clearNotes = useDiscovery((s) => s.clearNotes);
  const navigate = useNavigate();

  const openInAtlas = (name: string) => {
    setSearch(name);
    clearNotes(); // a navigation click starts fresh — no stale intersections
    // the atlas scrolls itself to the fan once mounted (navigation state);
    // scrolling from here would race AnimatePresence's exit and lose
    navigate('/', { state: { scrollTo: 'browse' } });
  };

  const isMaisons = mode === 'maisons';

  return (
    <main className="mx-auto w-full max-w-[1180px] px-5 pb-28 pt-10 sm:px-8">
      <motion.header
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: ease.enter }}
        className="mb-10 flex flex-col gap-4"
      >
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-champagne-bright">
          {isMaisons ? 'The Maisons' : 'The Noses'}
        </span>
        <h1 className="max-w-[20ch] font-display text-[clamp(34px,6vw,56px)] leading-[1.03] text-parchment">
          {isMaisons
            ? `${entries.length} houses, one atlas.`
            : `${entries.length} perfumers, credited.`}
        </h1>
        <p className="max-w-[56ch] font-sans text-[16px] leading-relaxed text-parchment-dim">
          {isMaisons
            ? 'Every maison in the collection, with its size and its olfactive temperament. Step into one to browse its shelf.'
            : 'The hands behind the bottles — only attributions the literature agrees on. Step into a nose to see everything they composed here.'}
        </p>

        {/* lens toggle */}
        <div
          role="radiogroup"
          aria-label="Index lens"
          className="inline-flex self-start rounded-chip border border-[var(--line)] bg-white p-0.5"
        >
          {(
            [
              ['maisons', 'Maisons', '/houses'],
              ['noses', 'Noses', '/perfumers'],
            ] as const
          ).map(([value, label, to]) => {
            const active = mode === value;
            return (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => navigate(to)}
                className="relative rounded-chip px-4 py-1.5 font-sans text-[12px] outline-none transition-colors"
                style={{ color: active ? '#1B1611' : '#6E6456' }}
              >
                {active && (
                  <motion.span
                    layoutId="index-lens"
                    className="absolute inset-0 rounded-chip"
                    style={{ background: '#B0843C' }}
                    transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{label}</span>
              </button>
            );
          })}
        </div>
      </motion.header>

      <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {entries.map((entry, i) => (
          <motion.li
            key={entry.name}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: ease.enter, delay: Math.min(i * 0.03, 0.5) }}
          >
            <button
              type="button"
              onClick={() => openInAtlas(entry.name)}
              className="group flex w-full flex-col gap-4 rounded-panel border border-[var(--line)] bg-white p-5 text-left shadow-e1 outline-none transition-shadow hover:shadow-e2"
            >
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="truncate font-display text-[24px] leading-tight text-parchment transition-colors group-hover:text-champagne-bright">
                  {entry.name}
                </h2>
                <span className="shrink-0 font-mono text-[11px] text-muted">
                  {isMaisons ? entry.meta : `${entry.perfumes.length} scents`}
                </span>
              </div>

              {!isMaisons && (
                <p className="-mt-2 truncate font-sans text-[12.5px] italic text-parchment-dim">
                  {entry.meta}
                </p>
              )}

              <div className="flex h-[96px] items-stretch gap-2">
                {entry.perfumes.slice(0, 3).map((p) => (
                  <span
                    key={p.id}
                    className="flex-1 overflow-hidden rounded-[10px] border border-[var(--line)]"
                  >
                    <BottleVisual perfume={p} variant="tile" />
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-1.5">
                {entry.topFamilies.map((f) => (
                  <span
                    key={f}
                    className="inline-flex items-center gap-1.5 rounded-chip px-2.5 py-0.5 font-sans text-[11px]"
                    style={{ color: FAMILY_COLOR[f], background: `${FAMILY_COLOR[f]}1A` }}
                  >
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: FAMILY_COLOR[f] }} />
                    {FAMILY_LABEL[f]}
                  </span>
                ))}
              </div>
            </button>
          </motion.li>
        ))}
      </ul>
    </main>
  );
}
