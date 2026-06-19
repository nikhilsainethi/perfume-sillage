// ============================================================
// SILLAGE — FragranceWheel (§4.2)
// The signature note-selection surface: notes laid on a radial
// wheel, segmented by accord family. Hovering a family lifts
// and brightens its orbs; the center reads back the focused or
// selected state. A reusable radial selector for any taxonomy.
// ============================================================

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import type { AccordFamily, FragranceNote } from '@/domain/types';
import { FAMILY_COLOR, FAMILY_LABEL, FAMILY_ORDER } from '@/data/notes';
import { spring } from '@/shared/motion/motion';

const ORB_FIELD = 40; // max orb radius, in 0..50 viewBox units
const LABEL_R = 47;

interface Orb {
  note: FragranceNote;
  x: number;
  y: number;
  family: AccordFamily;
}
interface Label {
  family: AccordFamily;
  x: number;
  y: number;
}

export function FragranceWheel({
  notes,
  selectedIds,
  onToggle,
}: {
  notes: FragranceNote[];
  selectedIds: string[];
  onToggle: (id: string) => void;
}) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [hoveredFamily, setHoveredFamily] = useState<AccordFamily | null>(null);
  const selected = new Set(selectedIds);

  const { orbs, labels, dividers, sectors } = useMemo(() => {
    const byFam = FAMILY_ORDER.map((family) => ({
      family,
      items: notes.filter((n) => n.family === family),
    })).filter((g) => g.items.length > 0);

    const total = byFam.reduce((s, g) => s + g.items.length, 0) || 1;
    const TWO_PI = Math.PI * 2;
    const start = -Math.PI / 2;
    const R = ORB_FIELD * 1.12;

    const orbsOut: Orb[] = [];
    const labelsOut: Label[] = [];
    const dividersOut: number[] = [];
    const sectorsOut: { family: AccordFamily; d: string }[] = [];

    let acc = start;
    for (const g of byFam) {
      const span = (g.items.length / total) * TWO_PI;
      const famStart = acc;
      const famEnd = acc + span;
      dividersOut.push(famStart);

      const x0 = 50 + R * Math.cos(famStart);
      const y0 = 50 + R * Math.sin(famStart);
      const x1 = 50 + R * Math.cos(famEnd);
      const y1 = 50 + R * Math.sin(famEnd);
      const largeArc = famEnd - famStart > Math.PI ? 1 : 0;
      sectorsOut.push({
        family: g.family,
        d: `M 50 50 L ${x0.toFixed(2)} ${y0.toFixed(2)} A ${R} ${R} 0 ${largeArc} 1 ${x1.toFixed(2)} ${y1.toFixed(2)} Z`,
      });

      g.items.forEach((note, j) => {
        const a = famStart + ((j + 0.5) / g.items.length) * span;
        const fr = j % 2 === 0 ? 0.96 : 0.66;
        orbsOut.push({
          note,
          family: g.family,
          x: 50 + fr * ORB_FIELD * Math.cos(a),
          y: 50 + fr * ORB_FIELD * Math.sin(a),
        });
      });

      const mid = (famStart + famEnd) / 2;
      labelsOut.push({
        family: g.family,
        x: 50 + (LABEL_R / 50) * 50 * Math.cos(mid),
        y: 50 + (LABEL_R / 50) * 50 * Math.sin(mid),
      });
      acc = famEnd;
    }
    return { orbs: orbsOut, labels: labelsOut, dividers: dividersOut, sectors: sectorsOut };
  }, [notes]);

  const focusedNote = hoveredId ? notes.find((n) => n.id === hoveredId) ?? null : null;

  return (
    <div
      role="group"
      aria-label="Fragrance wheel — select notes"
      className="relative mx-auto aspect-square w-full max-w-[560px]"
    >
      {/* decorative rings + family dividers */}
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        <defs>
          <radialGradient id="wheel-core" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="rgba(176,132,60,0.12)" />
            <stop offset="1" stopColor="rgba(176,132,60,0)" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="49" fill="url(#wheel-core)" />
        {/* family sector wedges — give the wheel its segmented structure */}
        {sectors.map((s) => {
          const active = hoveredFamily === s.family;
          return (
            <path
              key={s.family}
              d={s.d}
              fill={FAMILY_COLOR[s.family]}
              fillOpacity={active ? 0.16 : 0.06}
              stroke={FAMILY_COLOR[s.family]}
              strokeOpacity={active ? 0.3 : 0.12}
              strokeWidth={0.2}
              style={{ transition: 'fill-opacity 0.3s, stroke-opacity 0.3s' }}
            />
          );
        })}
        {[ORB_FIELD * 0.66, ORB_FIELD * 0.96, ORB_FIELD * 1.12].map((r) => (
          <circle
            key={r}
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke="rgba(34,28,21,0.08)"
            strokeWidth={0.2}
          />
        ))}
        {dividers.map((a, i) => (
          <line
            key={i}
            x1={50}
            y1={50}
            x2={50 + ORB_FIELD * 1.12 * Math.cos(a)}
            y2={50 + ORB_FIELD * 1.12 * Math.sin(a)}
            stroke="rgba(34,28,21,0.07)"
            strokeWidth={0.2}
          />
        ))}
      </svg>

      {/* family labels */}
      {labels.map((l) => {
        const active = hoveredFamily === l.family;
        return (
          <span
            key={l.family}
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors duration-300"
            style={{
              left: `${l.x}%`,
              top: `${l.y}%`,
              color: active ? FAMILY_COLOR[l.family] : 'var(--muted)',
            }}
          >
            {FAMILY_LABEL[l.family]}
          </span>
        );
      })}

      {/* center readout */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 flex w-[34%] -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center">
        {focusedNote ? (
          <>
            <span
              className="font-display text-[clamp(18px,4.4vw,26px)] leading-tight text-parchment"
              style={{ textShadow: '0 1px 10px rgba(250,248,244,0.9)' }}
            >
              {focusedNote.name}
            </span>
            <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
              {FAMILY_LABEL[focusedNote.family]}
            </span>
          </>
        ) : (
          <>
            <span className="font-display text-[clamp(22px,5vw,32px)] leading-none text-champagne">
              {selectedIds.length}
            </span>
            <span className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
              {selectedIds.length === 1 ? 'note chosen' : 'notes chosen'}
            </span>
          </>
        )}
      </div>

      {/* interactive note orbs */}
      {orbs.map((orb) => {
        const isSelected = selected.has(orb.note.id);
        const isHovered = hoveredId === orb.note.id;
        const dimmed = hoveredFamily !== null && hoveredFamily !== orb.family;
        return (
          <motion.button
            key={orb.note.id}
            type="button"
            aria-pressed={isSelected}
            aria-label={`${orb.note.name}, ${orb.note.family} note`}
            title={orb.note.name}
            onClick={() => onToggle(orb.note.id)}
            onHoverStart={() => {
              setHoveredId(orb.note.id);
              setHoveredFamily(orb.family);
            }}
            onHoverEnd={() => {
              setHoveredId(null);
              setHoveredFamily(null);
            }}
            onFocus={() => {
              setHoveredId(orb.note.id);
              setHoveredFamily(orb.family);
            }}
            onBlur={() => {
              setHoveredId(null);
              setHoveredFamily(null);
            }}
            className="absolute grid place-items-center rounded-full outline-none"
            style={{
              left: `${orb.x}%`,
              top: `${orb.y}%`,
              x: '-50%',
              y: '-50%',
              width: isSelected ? 30 : 22,
              height: isSelected ? 30 : 22,
            }}
            animate={{
              scale: isHovered ? 1.35 : isSelected ? 1.1 : 1,
              opacity: dimmed ? 0.35 : 1,
            }}
            transition={spring.chip}
          >
            <span
              className="block rounded-full"
              style={{
                width: '100%',
                height: '100%',
                background: orb.note.color,
                opacity: isSelected ? 1 : 0.85,
                boxShadow: isSelected
                  ? `0 0 0 2px #FFFFFF, 0 0 0 3.5px ${orb.note.color}, 0 0 14px ${orb.note.color}`
                  : isHovered
                    ? `0 0 12px ${orb.note.color}`
                    : 'inset 0 0 0 1px rgba(34,28,21,0.18)',
              }}
            />
          </motion.button>
        );
      })}
    </div>
  );
}
