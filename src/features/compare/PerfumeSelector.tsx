// ============================================================
// SILLAGE — PerfumeSelector (§4.1)
// Accessible listbox to choose a perfume for a role. Scoped to
// originals or inspired scents so a pair is always valid.
// Keyboard: ↑/↓ move, Enter selects, Esc closes.
// ============================================================

import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PERFUMES, PERFUME_BY_ID } from '@/data/perfumes';
import { ease } from '@/shared/motion/motion';
import { BottleVisual } from '@/shared/ui/BottleVisual';

export function PerfumeSelector({
  role,
  value,
  onChange,
}: {
  role: 'original' | 'clone';
  value: string | null;
  onChange: (id: string) => void;
}) {
  const options = useMemo(() => PERFUMES.filter((p) => p.type === role), [role]);
  const selected = value ? PERFUME_BY_ID[value] ?? null : null;

  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = `selector-${role}`;

  const accent = role === 'original' ? '#B0702F' : '#B5786E';
  const roleLabel = role === 'original' ? 'Original' : 'Inspired';

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
      const idx = options.findIndex((p) => p.id === value);
      setHighlight(idx >= 0 ? idx : 0);
    }
  }, [open, options, value]);

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
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const opt = options[highlight];
      if (opt) choose(opt.id);
    }
  };

  return (
    <div ref={rootRef} className="relative">
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
        onKeyDown={onKeyDown}
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
              Choose {role === 'original' ? 'an original' : 'an interpretation'}…
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
          <motion.ul
            id={listId}
            role="listbox"
            aria-label={`${roleLabel} fragrances`}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: ease.enter }}
            className="scrollbar-thin absolute z-20 mt-2 max-h-[320px] w-full overflow-y-auto rounded-input border border-[var(--line)] bg-espresso p-1.5 shadow-e2"
          >
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
                    style={{
                      background: isHigh ? 'rgba(176,132,60,0.14)' : 'transparent',
                    }}
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
                    {isSelected && (
                      <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: accent }} />
                    )}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
