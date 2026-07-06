// ============================================================
// SILLAGE — PerfumeSelector (§4.1)
// Accessible, searchable listbox over the WHOLE atlas — pair
// an original with its interpretation, a flanker with its
// parent, or two rivals. Type to narrow; ↑/↓ move, Enter
// selects, Esc closes.
// ============================================================

import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PERFUMES, PERFUME_BY_ID } from '@/data/perfumes';
import { ease } from '@/shared/motion/motion';
import { BottleVisual } from '@/shared/ui/BottleVisual';
import { OriginalCloneBadge } from '@/shared/ui/OriginalCloneBadge';

const MAX_SHOWN = 48;

const ALL = [...PERFUMES].sort((a, b) =>
  `${a.brand} ${a.name}`.localeCompare(`${b.brand} ${b.name}`),
);

export function PerfumeSelector({
  role,
  value,
  onChange,
}: {
  role: 'original' | 'clone'; // left / right side (visual temperature)
  value: string | null;
  onChange: (id: string) => void;
}) {
  const selected = value ? PERFUME_BY_ID[value] ?? null : null;

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlight, setHighlight] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const accent = role === 'original' ? '#B0702F' : '#B5786E';
  const roleLabel = role === 'original' ? 'Reference' : 'Compared with';

  const options = useMemo(() => {
    const q = query.trim().toLowerCase();
    const pool = q
      ? ALL.filter((p) => `${p.name} ${p.brand}`.toLowerCase().includes(q))
      : ALL;
    return pool.slice(0, MAX_SHOWN);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setHighlight(0);
      // focus the filter box once the dropdown paints
      window.setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  useEffect(() => setHighlight(0), [query]);

  const choose = (id: string) => {
    onChange(id);
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setOpen(false);
      return;
    }
    if (!open && (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      setOpen(true);
      return;
    }
    if (!open) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, options.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const opt = options[highlight];
      if (opt) choose(opt.id);
    }
  };

  return (
    <div ref={rootRef} className="relative" onKeyDown={onKeyDown}>
      <span
        className="mb-2 block font-mono text-[10px] uppercase tracking-[0.18em]"
        style={{ color: accent }}
      >
        {roleLabel}
      </span>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 rounded-input border bg-[#FFFFFF] px-4 py-3 text-left outline-none transition-colors focus-visible:shadow-focus"
        style={{ borderColor: selected ? `${accent}66` : 'var(--line)' }}
      >
        <span className="flex min-w-0 items-center gap-3">
          {selected ? (
            <>
              <span className="h-10 w-8 shrink-0">
                <BottleVisual perfume={selected} variant="thumb" />
              </span>
              <span className="min-w-0">
                <span className="block truncate font-display text-[18px] leading-tight text-parchment">
                  {selected.name}
                </span>
                <span className="block truncate font-sans text-[12px] text-parchment-dim">
                  {selected.brand}
                </span>
              </span>
            </>
          ) : (
            <span className="font-sans text-[14px] text-muted">
              Choose any scent in the atlas…
            </span>
          )}
        </span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
        >
          <path d="M6 9l6 6 6-6" stroke="#6E6456" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: ease.enter }}
            className="absolute z-20 mt-2 w-full overflow-hidden rounded-input border border-[var(--line)] bg-espresso shadow-e2"
          >
            <div className="border-b border-[var(--line)] p-2">
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a name or house…"
                aria-label={`Filter ${roleLabel} scents`}
                className="w-full rounded-[9px] bg-[rgba(176,132,60,0.07)] px-3 py-2 font-sans text-[13px] text-parchment placeholder:text-muted outline-none"
              />
            </div>
            <ul
              role="listbox"
              aria-label={`${roleLabel} fragrances`}
              className="scrollbar-thin max-h-[300px] overflow-y-auto p-1.5"
            >
              {options.length === 0 && (
                <li className="px-3 py-4 text-center font-sans text-[13px] italic text-muted">
                  Nothing in the atlas matches.
                </li>
              )}
              {options.map((p, i) => {
                const isSelected = p.id === value;
                const isHigh = i === highlight;
                return (
                  <li key={p.id} role="option" aria-selected={isSelected}>
                    <button
                      type="button"
                      onClick={() => choose(p.id)}
                      onMouseEnter={() => setHighlight(i)}
                      className="flex w-full items-center gap-3 rounded-[10px] px-3 py-2 text-left outline-none transition-colors"
                      style={{ background: isHigh ? 'rgba(176,132,60,0.14)' : 'transparent' }}
                    >
                      <span className="h-10 w-8 shrink-0">
                        <BottleVisual perfume={p} variant="thumb" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-display text-[17px] leading-tight text-parchment">
                          {p.name}
                        </span>
                        <span className="block truncate font-sans text-[12px] text-parchment-dim">
                          {p.brand}
                        </span>
                      </span>
                      {p.type === 'clone' && <OriginalCloneBadge type="clone" />}
                      {isSelected && (
                        <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: accent }} />
                      )}
                    </button>
                  </li>
                );
              })}
              {options.length === MAX_SHOWN && (
                <li className="px-3 py-2 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                  keep typing to narrow
                </li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
