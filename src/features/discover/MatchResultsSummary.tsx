// ============================================================
// SILLAGE — MatchResultsSummary (§4.2)
// Live result count + exact-match count, with the match-mode,
// type and pair-linking controls. Numbers roll on change.
// ============================================================

import { motion } from 'framer-motion';
import type { AccordFamily } from '@/domain/types';
import type { MatchMode, TypeFilter } from '@/store/discoveryStore';
import { FAMILY_COLOR, FAMILY_LABEL, FAMILY_ORDER } from '@/data/notes';
import { AnimatedNumber } from '@/shared/ui/AnimatedNumber';

interface SegOption<T extends string> {
  value: T;
  label: string;
}

function Segmented<T extends string>({
  value,
  options,
  onChange,
  ariaLabel,
}: {
  value: T;
  options: SegOption<T>[];
  onChange: (v: T) => void;
  ariaLabel: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className="inline-flex rounded-chip border border-[var(--line)] bg-[#FFFFFF] p-0.5"
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.value)}
            className="relative rounded-chip px-3 py-1.5 font-sans text-[12px] outline-none transition-colors"
            style={{ color: active ? '#1B1611' : '#6E6456' }}
          >
            {active && (
              <motion.span
                layoutId={`seg-${ariaLabel}`}
                className="absolute inset-0 rounded-chip"
                style={{ background: '#B0843C' }}
                transition={{ type: 'spring', stiffness: 320, damping: 30 }}
              />
            )}
            <span className="relative z-10">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export function MatchResultsSummary({
  total,
  exactCount,
  matchMode,
  typeFilter,
  linkClones,
  selectedAccords,
  onMatchMode,
  onTypeFilter,
  onToggleLink,
  onToggleAccord,
}: {
  total: number;
  exactCount: number;
  matchMode: MatchMode;
  typeFilter: TypeFilter;
  linkClones: boolean;
  selectedAccords: AccordFamily[];
  onMatchMode: (m: MatchMode) => void;
  onTypeFilter: (t: TypeFilter) => void;
  onToggleLink: () => void;
  onToggleAccord: (f: AccordFamily) => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-baseline gap-3">
        <span className="flex items-baseline gap-2 font-display text-[clamp(34px,5vw,52px)] leading-none text-parchment">
          <AnimatedNumber value={total} />
          <span className="font-sans text-[15px] tracking-tightish text-parchment-dim">
            {total === 1 ? 'fragrance' : 'fragrances'}
          </span>
        </span>
        {exactCount > 0 && (
          <span className="flex items-baseline gap-1.5 font-mono text-[13px] text-champagne-bright">
            ·<AnimatedNumber value={exactCount} /> exact
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
            Match
          </span>
          <Segmented
            ariaLabel="Match mode"
            value={matchMode}
            onChange={onMatchMode}
            options={[
              { value: 'partial', label: 'Any' },
              { value: 'exact', label: 'All' },
            ]}
          />
        </div>

        <div className="flex items-center gap-2.5">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
            Type
          </span>
          <Segmented
            ariaLabel="Type filter"
            value={typeFilter}
            onChange={onTypeFilter}
            options={[
              { value: 'all', label: 'All' },
              { value: 'original', label: 'Original' },
              { value: 'clone', label: 'Inspired' },
            ]}
          />
        </div>

        <button
          type="button"
          onClick={onToggleLink}
          aria-pressed={linkClones}
          className="inline-flex items-center gap-2 rounded-chip border px-3 py-1.5 font-sans text-[12px] outline-none transition-colors"
          style={{
            borderColor: linkClones ? '#B0843C' : 'var(--line)',
            color: linkClones ? '#8A6526' : '#6E6456',
            background: linkClones ? 'rgba(176,132,60,0.14)' : 'transparent',
          }}
        >
          <span
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{ background: linkClones ? '#B0843C' : '#9A9082' }}
          />
          Link pairs
        </button>
      </div>

      {/* olfactive family filter — results must carry every chosen family */}
      <div className="flex flex-col gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
          Families
        </span>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by olfactive family">
          {FAMILY_ORDER.map((family) => {
            const active = selectedAccords.includes(family);
            const color = FAMILY_COLOR[family];
            return (
              <button
                key={family}
                type="button"
                aria-pressed={active}
                onClick={() => onToggleAccord(family)}
                className="inline-flex items-center gap-1.5 rounded-chip border px-2.5 py-1 font-sans text-[11.5px] outline-none transition-all"
                style={{
                  borderColor: active ? color : 'var(--line)',
                  background: active ? `${color}1F` : 'transparent',
                  color: active ? color : '#6E6456',
                }}
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
                {FAMILY_LABEL[family]}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
