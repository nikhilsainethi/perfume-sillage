// ============================================================
// SILLAGE — Houses (/#/houses)
// The maisons of the atlas: every house as a card — its
// bottles, its size, its olfactive temperament (aggregate
// accord dots). Clicking a house opens the Atlas filtered
// to it.
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

interface House {
  name: string;
  perfumes: Perfume[];
  topFamilies: AccordFamily[];
  years: [number, number] | null;
}

function buildHouses(): House[] {
  const map = new Map<string, Perfume[]>();
  for (const p of PERFUMES) {
    const list = map.get(p.brand) ?? [];
    list.push(p);
    map.set(p.brand, list);
  }
  return [...map.entries()]
    .map(([name, perfumes]) => {
      const famWeight = new Map<AccordFamily, number>();
      for (const p of perfumes)
        for (const a of p.accords)
          famWeight.set(a.family, (famWeight.get(a.family) ?? 0) + a.weight);
      const topFamilies = [...famWeight.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([f]) => f);
      const years = perfumes.filter((p) => p.year).map((p) => p.year!);
      const span: [number, number] | null = years.length
        ? [Math.min(...years), Math.max(...years)]
        : null;
      return {
        name,
        perfumes: [...perfumes].sort((a, b) => (a.year ?? 9999) - (b.year ?? 9999)),
        topFamilies,
        years: span,
      };
    })
    .sort((a, b) => b.perfumes.length - a.perfumes.length || a.name.localeCompare(b.name));
}

export function HousesPage() {
  const houses = useMemo(buildHouses, []);
  const setSearch = useDiscovery((s) => s.setSearch);
  const navigate = useNavigate();

  const openHouse = (name: string) => {
    setSearch(name);
    navigate('/');
    window.setTimeout(() => {
      document.getElementById('discover')?.scrollIntoView({ behavior: 'instant' as ScrollBehavior });
    }, 120);
  };

  return (
    <main className="mx-auto w-full max-w-[1180px] px-5 pb-28 pt-10 sm:px-8">
      <motion.header
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: ease.enter }}
        className="mb-10 flex flex-col gap-3"
      >
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-champagne">
          The Maisons
        </span>
        <h1 className="max-w-[18ch] font-display text-[clamp(34px,6vw,56px)] leading-[1.03] text-parchment">
          {houses.length} houses, one atlas.
        </h1>
        <p className="max-w-[54ch] font-sans text-[16px] leading-relaxed text-parchment-dim">
          Every maison in the collection, with its size and its olfactive
          temperament. Step into one to browse its shelf.
        </p>
      </motion.header>

      <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {houses.map((house, i) => (
          <motion.li
            key={house.name}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: ease.enter, delay: Math.min(i * 0.03, 0.5) }}
          >
            <button
              type="button"
              onClick={() => openHouse(house.name)}
              className="group flex w-full flex-col gap-4 rounded-panel border border-[var(--line)] bg-white p-5 text-left shadow-e1 outline-none transition-shadow hover:shadow-e2"
            >
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="truncate font-display text-[24px] leading-tight text-parchment transition-colors group-hover:text-champagne-bright">
                  {house.name}
                </h2>
                <span className="shrink-0 font-mono text-[11px] text-muted">
                  {house.perfumes.length} scent{house.perfumes.length === 1 ? '' : 's'}
                  {house.years && house.years[0] !== house.years[1]
                    ? ` · ${house.years[0]}–${house.years[1]}`
                    : ''}
                </span>
              </div>

              {/* three bottles from the shelf */}
              <div className="flex h-[96px] items-stretch gap-2">
                {house.perfumes.slice(0, 3).map((p) => (
                  <span
                    key={p.id}
                    className="flex-1 overflow-hidden rounded-[10px] border border-[var(--line)]"
                  >
                    <BottleVisual perfume={p} variant="tile" />
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-1.5">
                {house.topFamilies.map((f) => (
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
