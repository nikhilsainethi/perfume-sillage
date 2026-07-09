// ============================================================
// SILLAGE — catalog integrity check
// Fails (exit 1) if any note id is unknown, any dupe link is
// invalid, or any perfume id is duplicated.
//
// Run: node scripts/validate-catalog.mjs
// (Node >=23.6 strips TS types; the data files only use
//  type-only imports, which are elided, so this just works.)
// ============================================================

import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const { NOTES } = await import(join(root, 'src/data/notes.ts'));
const { RAW: CURATED } = await import(join(root, 'src/data/catalogData.ts'));
const { IMPORTED } = await import(join(root, 'src/data/catalogImported.ts'));
const RAW = [...CURATED, ...IMPORTED];

const errors = [];
const warnings = [];

const ids = new Set();
const originalIds = new Set(RAW.filter((p) => p.type === 'original').map((p) => p.id));

for (const p of RAW) {
  // duplicate ids
  if (ids.has(p.id)) errors.push(`Duplicate perfume id: ${p.id}`);
  ids.add(p.id);

  // note ids exist
  for (const layer of ['top', 'heart', 'base']) {
    const list = p[layer] ?? [];
    const seen = new Set();
    for (const noteId of list) {
      if (!NOTES[noteId]) errors.push(`[${p.id}] unknown note id in ${layer}: "${noteId}"`);
      if (seen.has(noteId)) warnings.push(`[${p.id}] duplicate note "${noteId}" within ${layer}`);
      seen.add(noteId);
    }
  }
  if ((p.top?.length ?? 0) === 0) warnings.push(`[${p.id}] empty top notes`);
  if ((p.heart?.length ?? 0) === 0) warnings.push(`[${p.id}] empty heart notes`);
  if ((p.base?.length ?? 0) === 0) warnings.push(`[${p.id}] empty base notes`);

  // performance sanity
  if (!Array.isArray(p.perf) || p.perf.length !== 3 || p.perf.some((n) => n < 0 || n > 10)) {
    errors.push(`[${p.id}] perf must be 3 numbers in 0..10`);
  }

  // clone links
  if (p.type === 'clone') {
    if (!p.inspiredBy) errors.push(`[${p.id}] clone is missing inspiredBy`);
    else if (!originalIds.has(p.inspiredBy))
      errors.push(`[${p.id}] inspiredBy "${p.inspiredBy}" is not a known original id`);
  }
  if (p.type === 'original' && p.inspiredBy) {
    warnings.push(`[${p.id}] original should not have inspiredBy`);
  }
}

const originals = RAW.filter((p) => p.type === 'original').length;
const clones = RAW.filter((p) => p.type === 'clone').length;

// note usage coverage
const usedNotes = new Set();
for (const p of RAW) for (const l of ['top', 'heart', 'base']) for (const id of p[l] ?? []) usedNotes.add(id);
const unusedNotes = Object.keys(NOTES).filter((id) => !usedNotes.has(id));

// credit ids must resolve (typo guard)
for (const cid of Object.keys((await import(join(root, 'src/data/perfumerCredits.ts'))).PERFUMER_CREDITS)) {
  if (!ids.has(cid)) errors.push('perfumer credit references unknown id: ' + cid);
}

console.log(`Catalog: ${RAW.length} scents (${originals} originals, ${clones} dupes)`);
console.log(`Notes: ${Object.keys(NOTES).length} defined, ${usedNotes.size} used, ${unusedNotes.length} unused`);

if (warnings.length) {
  console.log(`\n⚠️  ${warnings.length} warning(s):`);
  for (const w of warnings) console.log('  - ' + w);
}

if (errors.length) {
  console.error(`\n❌ ${errors.length} error(s):`);
  for (const e of errors) console.error('  - ' + e);
  process.exit(1);
}

console.log('\n✅ Catalog valid — all note ids and dupe links resolve.');
