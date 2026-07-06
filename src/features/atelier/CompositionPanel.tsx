// ============================================================
// SILLAGE — CompositionPanel (the living pyramid)
// The draft as a physical object: name it, place notes in
// top / heart / base, weight each one, watch the flacon tint
// itself. Save and share live here.
// ============================================================

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { NotePosition, Perfume } from '@/domain/types';
import { TIER_CAP, TIERS } from '@/domain/creation';
import { encodeCreation } from '@/domain/shareCodec';
import { NOTES } from '@/data/notes';
import { useAtelier } from '@/store/atelierStore';
import { BottleVisual } from '@/shared/ui/BottleVisual';
import { spring } from '@/shared/motion/motion';

const TIER_LABEL: Record<NotePosition, string> = { top: 'Top', heart: 'Heart', base: 'Base' };
const TIER_HINT: Record<NotePosition, string> = {
  top: 'the opening — fleeting, bright',
  heart: 'the character — what it is',
  base: 'the dry-down — what lingers',
};

function shareUrlFor(name: string, description: string, pyramid: Parameters<typeof encodeCreation>[0]['pyramid']) {
  const code = encodeCreation({ name: name || 'Untitled', description: description || undefined, pyramid });
  return `${window.location.origin}${window.location.pathname}#/c/${code}`;
}

export function CompositionPanel({ draftPerfume }: { draftPerfume: Perfume }) {
  const draft = useAtelier((s) => s.draft);
  const toggleDraftNote = useAtelier((s) => s.toggleDraftNote);
  const setNoteTier = useAtelier((s) => s.setNoteTier);
  const setNoteIntensity = useAtelier((s) => s.setNoteIntensity);
  const setActiveTier = useAtelier((s) => s.setActiveTier);
  const setDraftName = useAtelier((s) => s.setDraftName);
  const clearDraft = useAtelier((s) => s.clearDraft);
  const saveDraft = useAtelier((s) => s.saveDraft);

  const [savedFlash, setSavedFlash] = useState(false);
  const [copied, setCopied] = useState(false);
  const [dragOverTier, setDragOverTier] = useState<NotePosition | null>(null);
  const count = draft.pyramid.top.length + draft.pyramid.heart.length + draft.pyramid.base.length;

  const onSave = () => {
    const id = saveDraft();
    if (id) {
      setSavedFlash(true);
      window.setTimeout(() => setSavedFlash(false), 2200);
    }
  };

  const onShare = async () => {
    const url = shareUrlFor(draft.name, draft.description, draft.pyramid);
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.prompt('Copy your share link:', url);
    }
  };

  return (
    <section className="glass rounded-panel p-6 sm:p-7" aria-label="Your composition">
      {/* name + flacon */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <label className="mb-1 block font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
            Your composition
          </label>
          <input
            value={draft.name}
            onChange={(e) => setDraftName(e.target.value)}
            placeholder="Name your scent…"
            className="w-full border-b border-[var(--line)] bg-transparent pb-1.5 font-display text-[clamp(24px,3.4vw,32px)] leading-tight text-parchment placeholder:text-muted outline-none transition-colors focus:border-champagne"
          />
        </div>
        <div className="h-[92px] w-[72px] shrink-0 overflow-hidden rounded-[14px] border border-[var(--line)] bg-white shadow-e1">
          <BottleVisual perfume={draftPerfume} variant="tile" />
        </div>
      </div>

      {/* tier destination selector */}
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <span className="mr-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
          New notes go to
        </span>
        {TIERS.map((tier) => {
          const active = draft.activeTier === tier;
          const full = draft.pyramid[tier].length >= TIER_CAP;
          return (
            <button
              key={tier}
              type="button"
              onClick={() => setActiveTier(tier)}
              aria-pressed={active}
              className="rounded-chip border px-3.5 py-1.5 font-sans text-[12px] outline-none transition-colors"
              style={{
                borderColor: active ? '#B0843C' : 'var(--line)',
                background: active ? 'rgba(176,132,60,0.14)' : 'transparent',
                color: active ? '#8A6526' : '#6E6456',
                opacity: full ? 0.5 : 1,
              }}
            >
              {TIER_LABEL[tier]}
              <span className="ml-1.5 font-mono text-[10px] text-muted">
                {draft.pyramid[tier].length}/{TIER_CAP}
              </span>
            </button>
          );
        })}
      </div>

      {/* the pyramid — rows are draggable between tiers (buttons remain the
          accessible path); a hovered tier glows as a drop target */}
      <div className="mt-6 flex flex-col gap-5">
        {TIERS.map((tier) => (
          <div
            key={tier}
            onDragOver={(e) => {
              if (e.dataTransfer.types.includes('text/sillage-note')) {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                if (dragOverTier !== tier) setDragOverTier(tier);
              }
            }}
            onDragLeave={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                setDragOverTier((t) => (t === tier ? null : t));
              }
            }}
            onDrop={(e) => {
              e.preventDefault();
              const id = e.dataTransfer.getData('text/sillage-note');
              if (id) setNoteTier(id, tier);
              setDragOverTier(null);
            }}
            className="rounded-[16px] p-1.5 transition-colors"
            style={{
              background: dragOverTier === tier ? 'rgba(176,132,60,0.10)' : 'transparent',
              outline: dragOverTier === tier ? '1.5px dashed rgba(176,132,60,0.5)' : 'none',
            }}
          >
            <div className="mb-2 flex items-baseline justify-between">
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-champagne">
                {TIER_LABEL[tier]}
              </span>
              <span className="font-sans text-[11px] italic text-muted">{TIER_HINT[tier]}</span>
            </div>

            <div className="flex flex-col gap-2">
              <AnimatePresence initial={false}>
                {draft.pyramid[tier].length === 0 && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="rounded-input border border-dashed border-[var(--line)] px-3 py-2.5 font-sans text-[12px] italic text-muted"
                  >
                    Empty — pick a note from the left.
                  </motion.p>
                )}
                {draft.pyramid[tier].map((ref) => {
                  const note = NOTES[ref.noteId];
                  return (
                    <motion.div
                      key={ref.noteId}
                      layout
                      initial={{ opacity: 0, y: 6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={spring.chip}
                    >
                    {/* native HTML5 drag lives on a plain div — framer-motion
                        reserves onDragStart/onDragEnd for its own gestures */}
                    <div
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('text/sillage-note', ref.noteId);
                        e.dataTransfer.effectAllowed = 'move';
                      }}
                      onDragEnd={() => setDragOverTier(null)}
                      title="Drag to another tier"
                      className="flex cursor-grab items-center gap-3 rounded-input border border-[var(--line)] bg-white/80 px-3 py-2 active:cursor-grabbing"
                    >
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ background: note?.color ?? '#9A9082', boxShadow: `0 0 6px ${note?.color ?? 'transparent'}` }}
                      />
                      <span className="w-[92px] shrink-0 truncate font-sans text-[13px] text-parchment">
                        {note?.name ?? ref.noteId}
                      </span>

                      <input
                        type="range"
                        min={10}
                        max={100}
                        value={Math.round(ref.intensity * 100)}
                        onChange={(e) => setNoteIntensity(ref.noteId, Number(e.target.value) / 100)}
                        aria-label={`${note?.name ?? ref.noteId} intensity`}
                        className="h-1 min-w-0 flex-1 cursor-pointer"
                        style={{ accentColor: note?.color ?? '#B0843C' }}
                      />

                      {/* tier mover */}
                      <div className="flex shrink-0 gap-0.5" role="group" aria-label={`Move ${note?.name} to tier`}>
                        {TIERS.map((t) => (
                          <button
                            key={t}
                            type="button"
                            title={`Move to ${TIER_LABEL[t]}`}
                            onClick={() => setNoteTier(ref.noteId, t)}
                            className="grid h-6 w-6 place-items-center rounded-[7px] font-mono text-[10px] outline-none transition-colors"
                            style={{
                              background: t === tier ? 'rgba(176,132,60,0.16)' : 'transparent',
                              color: t === tier ? '#8A6526' : '#9A9082',
                            }}
                          >
                            {TIER_LABEL[t][0]}
                          </button>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleDraftNote(ref.noteId)}
                        aria-label={`Remove ${note?.name ?? ref.noteId}`}
                        className="shrink-0 px-1 text-[15px] leading-none text-muted outline-none transition-colors hover:text-champagne-bright"
                      >
                        ×
                      </button>
                    </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>

      {/* actions */}
      <div className="mt-7 flex flex-wrap items-center gap-3 border-t border-[var(--line)] pt-5">
        <button
          type="button"
          onClick={onSave}
          disabled={count === 0}
          className="rounded-chip bg-champagne px-5 py-2.5 font-sans text-[13px] font-medium text-ink outline-none transition-colors hover:bg-champagne-bright hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          {savedFlash ? 'Saved to your shelf ✓' : draft.id ? 'Update on shelf' : 'Bottle it — save'}
        </button>
        <button
          type="button"
          onClick={onShare}
          disabled={count === 0}
          className="rounded-chip border border-[var(--line)] px-5 py-2.5 font-sans text-[13px] text-parchment-dim outline-none transition-colors hover:border-champagne hover:text-champagne-bright disabled:cursor-not-allowed disabled:opacity-40"
        >
          {copied ? 'Link copied ✓' : 'Share'}
        </button>
        {count > 0 && (
          <button
            type="button"
            onClick={clearDraft}
            className="ml-auto rounded-chip px-3 py-2 font-sans text-[12px] text-muted outline-none transition-colors hover:text-champagne-bright"
          >
            Start over
          </button>
        )}
      </div>
    </section>
  );
}
