// ============================================================
// SILLAGE — SimilarityRadarChart (§12.9)
// Dependency-free SVG radar overlaying two profiles across six
// axes. Original = amber stroke, Inspired = rose; fills ~10%.
// ============================================================

import { motion, useReducedMotion } from 'framer-motion';
import type { RadarAxis } from '@/domain/types';
import { spring } from '@/shared/motion/motion';

export function SimilarityRadarChart({
  axes,
  size = 320,
}: {
  axes: RadarAxis[];
  size?: number;
}) {
  const reduce = useReducedMotion() ?? false;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 44;
  const n = axes.length;

  const point = (val: number, i: number) => {
    const a = (Math.PI * 2 * i) / n - Math.PI / 2;
    return [cx + Math.cos(a) * r * val, cy + Math.sin(a) * r * val] as const;
  };
  const poly = (key: 'original' | 'clone') =>
    axes.map((ax, i) => point(ax[key], i).join(',')).join(' ');

  const reveal = reduce
    ? { initial: { opacity: 1 }, animate: { opacity: 1 } }
    : {
        initial: { scale: 0, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
      };

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className="h-auto w-full max-w-[360px]"
      role="img"
      aria-label="Performance profile comparison between original and inspired"
    >
      {/* grid rings */}
      {[0.25, 0.5, 0.75, 1].map((g) => (
        <circle key={g} cx={cx} cy={cy} r={r * g} fill="none" stroke="rgba(34,28,21,0.08)" />
      ))}

      {/* axes + labels */}
      {axes.map((ax, i) => {
        const [x, y] = point(1, i);
        const [lx, ly] = point(1.2, i);
        return (
          <g key={ax.axis}>
            <line x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(34,28,21,0.08)" />
            <text
              x={lx}
              y={ly}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-parchment-dim font-mono"
              style={{ fontSize: 9.5, letterSpacing: '0.06em' }}
            >
              {ax.axis}
            </text>
          </g>
        );
      })}

      {/* original (amber) */}
      <motion.polygon
        points={poly('original')}
        fill="rgba(184,118,62,0.12)"
        stroke="#B0702F"
        strokeWidth={1.5}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
        {...reveal}
        transition={spring.panel}
      />
      {/* clone (rose) */}
      <motion.polygon
        points={poly('clone')}
        fill="rgba(201,154,146,0.12)"
        stroke="#B5786E"
        strokeWidth={1.5}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
        {...reveal}
        transition={{ ...spring.panel, delay: reduce ? 0 : 0.08 }}
      />

      {/* vertices */}
      {(['original', 'clone'] as const).map((key) =>
        axes.map((ax, i) => {
          const [x, y] = point(ax[key], i);
          return (
            <circle
              key={`${key}-${ax.axis}`}
              cx={x}
              cy={y}
              r={2.2}
              fill={key === 'original' ? '#B0702F' : '#B5786E'}
            />
          );
        }),
      )}
    </svg>
  );
}
