// ============================================================
// SILLAGE — The Scent Finder (/#/finder)
// Five quiet questions, three answers from the atlas. An
// editorial wizard: one question per screen, then the verdict —
// bottles, match strength, and the reasons in plain words.
// ============================================================

import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  findScents,
  type Audience,
  type Character,
  type Climate,
  type FinderAnswers,
  type Loudness,
} from '@/domain/finder';
import { NOTES } from '@/data/notes';
import { PERFUMES } from '@/data/perfumes';
import { useDiscovery } from '@/store/discoveryStore';
import { BottleVisual } from '@/shared/ui/BottleVisual';
import { OriginalCloneBadge } from '@/shared/ui/OriginalCloneBadge';
import { ease, spring } from '@/shared/motion/motion';

type Draft = Partial<FinderAnswers>;

interface StepOption {
  value: string;
  label: string;
  desc: string;
}
interface Step {
  key: keyof FinderAnswers;
  eyebrow: string;
  title: string;
  options: StepOption[];
}

const STEPS: Step[] = [
  {
    key: 'audience',
    eyebrow: 'One of five',
    title: 'Who is this scent for?',
    options: [
      { value: 'him', label: 'For him', desc: 'Masculine and unisex bottles' },
      { value: 'her', label: 'For her', desc: 'Feminine and unisex bottles' },
      { value: 'any', label: 'No labels', desc: 'The whole atlas, unfiltered' },
    ],
  },
  {
    key: 'climate',
    eyebrow: 'Two of five',
    title: 'When will it be worn?',
    options: [
      { value: 'warm', label: 'Warm days', desc: 'Spring sun, summer air' },
      { value: 'cold', label: 'Cold evenings', desc: 'Autumn coats, winter nights' },
      { value: 'any', label: 'Everywhere', desc: 'One scent for all seasons' },
    ],
  },
  {
    key: 'character',
    eyebrow: 'Three of five',
    title: 'What should it feel like?',
    options: [
      { value: 'fresh', label: 'Fresh & clean', desc: 'Citrus, sea air, crisp herbs' },
      { value: 'warm-sweet', label: 'Warm & sweet', desc: 'Amber, vanilla, golden things' },
      { value: 'dark-bold', label: 'Dark & bold', desc: 'Woods, leather, spice' },
      { value: 'floral', label: 'Romantic & floral', desc: 'Rose, jasmine, white petals' },
    ],
  },
  {
    key: 'loudness',
    eyebrow: 'Four of five',
    title: 'How loudly should it speak?',
    options: [
      { value: 'soft', label: 'A whisper', desc: 'Close to the skin, yours alone' },
      { value: 'balanced', label: 'Present', desc: 'Noticed at arm’s length' },
      { value: 'loud', label: 'Announce me', desc: 'Fills the room, leaves a trail' },
    ],
  },
  {
    key: 'lovedNoteId',
    eyebrow: 'Five of five',
    title: 'A note you already love?',
    options: [
      ...[
        'vanilla', 'rose', 'oud', 'bergamot',
        'tobacco', 'iris', 'coconut', 'coffee',
        'sandalwood', 'vetiver', 'leather', 'amber',
      ].map(
        (id) => ({
          value: id,
          label: NOTES[id]?.name ?? id,
          desc: NOTES[id]?.description ?? '',
        }),
      ),
      { value: '', label: 'Surprise me', desc: 'Let the atlas decide' },
    ],
  },
];

export function FinderPage() {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Draft>({});
  const navigate = useNavigate();
  const setComparisonOriginal = useDiscovery((s) => s.setComparisonOriginal);
  const setComparisonClone = useDiscovery((s) => s.setComparisonClone);

  const done = step >= STEPS.length;
  const answers: FinderAnswers | null = done
    ? {
        audience: (draft.audience ?? 'any') as Audience,
        climate: (draft.climate ?? 'any') as Climate,
        character: (draft.character ?? 'warm-sweet') as Character,
        loudness: (draft.loudness ?? 'balanced') as Loudness,
        lovedNoteId: draft.lovedNoteId || null,
      }
    : null;

  const picks = useMemo(
    () => (answers ? findScents(answers, PERFUMES, NOTES) : []),
    [answers],
  );

  const choose = (key: keyof FinderAnswers, value: string) => {
    setDraft((d) => ({ ...d, [key]: value }));
    setStep((s) => s + 1);
  };

  const retake = () => {
    setDraft({});
    setStep(0);
  };

  const compareTopTwo = () => {
    if (picks.length < 2) return;
    setComparisonOriginal(picks[0].perfume.id);
    setComparisonClone(picks[1].perfume.id);
    navigate('/discover', { state: { scrollTo: 'compare' } });
  };

  const current = STEPS[step];

  return (
    <main className="mx-auto w-full max-w-[880px] px-5 pb-28 pt-12 sm:px-8">
      {/* progress */}
      <div className="mb-10 flex items-center gap-2" aria-hidden>
        {STEPS.map((_, i) => (
          <span
            key={i}
            className="h-1 flex-1 rounded-full transition-colors duration-300"
            style={{
              background:
                i < step || done ? '#B0843C' : i === step ? 'rgba(176,132,60,0.4)' : 'rgba(124,115,103,0.2)',
            }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {!done ? (
          <motion.section
            key={step}
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.4, ease: ease.enter }}
            aria-label={current.title}
          >
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-champagne-bright">
              {current.eyebrow}
            </span>
            <h1 className="mt-3 max-w-[18ch] font-display text-[clamp(30px,5.6vw,48px)] leading-[1.05] text-parchment">
              {current.title}
            </h1>

            <div
              className={`mt-8 grid gap-3 ${
                current.key === 'lovedNoteId' ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-3'
              }`}
            >
              {current.options.map((opt) => (
                <motion.button
                  key={opt.value || 'surprise'}
                  type="button"
                  onClick={() => choose(current.key, opt.value)}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.965 }}
                  transition={spring.hover}
                  className="group flex flex-col gap-1.5 rounded-panel border border-[var(--line)] bg-white p-5 text-left shadow-e1 outline-none transition-[border-color,box-shadow] hover:border-champagne hover:shadow-e2"
                >
                  <span className="flex items-center gap-2 font-display text-[19px] leading-tight text-parchment transition-colors group-hover:text-champagne-bright">
                    {current.key === 'lovedNoteId' && opt.value && (
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ background: NOTES[opt.value]?.color }}
                      />
                    )}
                    {opt.label}
                  </span>
                  {opt.desc && (
                    <span className="font-sans text-[12.5px] leading-snug text-parchment-dim">
                      {opt.desc}
                    </span>
                  )}
                </motion.button>
              ))}
            </div>

            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="mt-8 font-sans text-[13px] text-muted outline-none transition-colors hover:text-champagne-bright"
              >
                ← Back
              </button>
            )}
          </motion.section>
        ) : (
          <motion.section
            key="results"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: ease.enter }}
            aria-label="Your scents"
          >
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-champagne-bright">
              The verdict
            </span>
            <h1 className="mt-3 max-w-[18ch] font-display text-[clamp(30px,5.6vw,48px)] leading-[1.05] text-parchment">
              The atlas chose three.
            </h1>

            <ul className="mt-9 flex flex-col gap-5">
              {picks.map(({ perfume, matchPct, reasons }, i) => (
                <motion.li
                  key={perfume.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: ease.enter, delay: 0.15 + i * 0.12 }}
                  className="flex flex-col gap-4 rounded-panel border border-[var(--line)] bg-white p-5 shadow-e1 sm:flex-row sm:items-center"
                >
                  <div className="h-[150px] w-[110px] shrink-0 self-center overflow-hidden rounded-[14px] border border-[var(--line)] sm:self-auto">
                    <BottleVisual perfume={perfume} variant="tile" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h2 className="font-display text-[24px] leading-tight text-parchment">
                        {perfume.name}
                      </h2>
                      {perfume.type === 'clone' && <OriginalCloneBadge type="clone" />}
                    </div>
                    <p className="font-sans text-[13px] text-parchment-dim">
                      {perfume.brand}
                      {perfume.year ? ` · ${perfume.year}` : ''}
                    </p>
                    <ul className="mt-3 flex flex-col gap-1">
                      {reasons.map((r) => (
                        <li key={r} className="flex gap-2 font-sans text-[13.5px] leading-snug text-parchment-dim">
                          <span aria-hidden className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-champagne" />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex shrink-0 items-center gap-4 sm:flex-col sm:items-end">
                    <span className="font-display text-[34px] leading-none text-champagne-bright">
                      {matchPct}
                      <span className="ml-0.5 font-sans text-[13px] text-muted">%</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => navigate(`/s/${perfume.id}`)}
                      className="rounded-chip bg-champagne px-4 py-2 font-sans text-[12.5px] font-medium text-ink outline-none transition-colors hover:bg-champagne-bright hover:text-white"
                    >
                      View
                    </button>
                  </div>
                </motion.li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              {picks.length >= 2 && (
                <button
                  type="button"
                  onClick={compareTopTwo}
                  className="rounded-chip border border-[var(--line)] px-5 py-2.5 font-sans text-[13px] text-parchment-dim outline-none transition-colors hover:border-champagne hover:text-champagne-bright"
                >
                  Compare my top two
                </button>
              )}
              <button
                type="button"
                onClick={retake}
                className="rounded-chip px-4 py-2.5 font-sans text-[13px] text-muted outline-none transition-colors hover:text-champagne-bright"
              >
                ↺ Start over
              </button>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}
