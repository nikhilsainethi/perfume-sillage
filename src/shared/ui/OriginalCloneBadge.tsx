// ============================================================
// SILLAGE — Original / Inspired marker (§12.10)
// Encoded by temperature, not hierarchy: Original -> amber,
// Clone -> rose. Identical weight, never a cheap ribbon.
// The data keeps type:'clone'; the UI says "Inspired".
// ============================================================

import type { PerfumeType } from '@/domain/types';

export function OriginalCloneBadge({
  type,
  size = 'sm',
}: {
  type: PerfumeType;
  size?: 'sm' | 'md';
}) {
  const isOriginal = type === 'original';
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-chip font-sans font-medium uppercase tracking-[0.12em] ${
        size === 'sm' ? 'px-2.5 py-1 text-[10px]' : 'px-3 py-1.5 text-[12px]'
      }`}
      style={{
        color: isOriginal ? '#9A5A24' : '#9C5C50',
        background: isOriginal ? 'rgba(184,118,62,0.12)' : 'rgba(201,154,146,0.12)',
        border: `1px solid ${isOriginal ? 'rgba(184,118,62,0.35)' : 'rgba(201,154,146,0.35)'}`,
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: isOriginal ? '#B0702F' : '#B5786E' }}
      />
      {isOriginal ? 'Original' : 'Inspired'}
    </span>
  );
}
