// ============================================================
// SILLAGE — targeted photo sourcing for the expansion scents.
// Stricter than source-photos.mjs: a hit is only kept if the
// Commons title actually contains the brand or a distinctive
// name token. Does NOT touch photoIds.ts (curate first), and
// never overwrites an existing file.
// Run: node scripts/source-new.mjs
// ============================================================

import { execSync } from 'node:child_process';
import { writeFileSync, existsSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const OUT = join(root, 'public', 'photos');
const { RAW } = await import(join(root, 'src/data/catalogData.ts'));

const NEW = new Set([
  'dior-homme', 'noir-extreme', 'tuscan-leather', 'neroli-portofino', 'ysl-lhomme',
  'kouros', 'creed-viking', 'millesime-imperial', 'guerlain-lhomme-ideal', 'habit-rouge',
  'cedrat-boise', 'intense-cafe', 'angels-share', 'gypsy-water', 'azzaro-chrome',
  'montblanc-legend', 'ch-212-vip-men', 'versace-pour-homme', 'a-men', 'prada-lhomme',
  'spicebomb-extreme', 'bvlgari-man-in-black', 'afnan-9pm', 'afnan-supremacy-not-only', 'amber-oud-carbon',
]);

const UA = 'SillageDemo/1.0 (educational demo; contact@example.org)';
const BAD = /campaign|advert|poster|logo|store|shelf|model|wikipedia|magazine|billboard|mannequin|drawing|patent|memorial|war|mountain|landscape|church|album|manuscript|fashion plate|map|book/i;
const STOP = new Set(['the', 'pour', 'homme', 'de', 'la', 'le', 'man', 'men', 'intense', 'extreme', 'edition', 'eau', 'parfum', 'extrait', 'not', 'only', 'by', 'des', 'no']);

function norm(s) { return s.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim(); }
function curlJSON(url) {
  try { return JSON.parse(execSync(`curl -s -m 25 -H ${JSON.stringify('User-Agent: ' + UA)} ${JSON.stringify(url)}`, { encoding: 'utf8', maxBuffer: 2e7 })); }
  catch { return null; }
}
function search(term) {
  const p = new URLSearchParams({ action: 'query', generator: 'search', gsrsearch: term, gsrnamespace: '6', gsrlimit: '8', prop: 'imageinfo', iiprop: 'url|mime|size', iiurlwidth: '900', format: 'json' });
  const d = curlJSON('https://commons.wikimedia.org/w/api.php?' + p.toString());
  const pages = d?.query?.pages; if (!pages) return [];
  return Object.values(pages).map((x) => ({ title: (x.title || '').slice(5), ii: (x.imageinfo || [])[0] }))
    .filter((x) => x.ii && x.ii.mime === 'image/jpeg' && x.ii.thumbwidth && x.ii.thumbheight)
    .filter((x) => { const ar = x.ii.thumbwidth / x.ii.thumbheight; return ar >= 0.45 && ar <= 1.5 && !BAD.test(x.title); });
}
function download(url, dest) {
  try { execSync(`curl -s -m 30 -o ${JSON.stringify(dest)} -H ${JSON.stringify('User-Agent: ' + UA)} -H ${JSON.stringify('Accept: image/jpeg,*/*')} ${JSON.stringify(url)}`, { stdio: 'ignore' });
    return existsSync(dest) && statSync(dest).size > 9000; } catch { return false; }
}

const got = [];
for (const p of RAW) {
  if (!NEW.has(p.id)) continue;
  const dest = join(OUT, `${p.id}.jpg`);
  if (existsSync(dest)) { got.push(p.id); continue; }
  const brandTok = norm(p.brand).split(' ').filter((w) => w.length > 2 && !STOP.has(w));
  const nameTok = norm(p.name).split(' ').filter((w) => w.length > 2 && !STOP.has(w));
  let picked = null;
  for (const term of [`${p.brand} ${p.name}`, `${p.name} ${p.brand}`]) {
    const hits = search(term);
    for (const h of hits) {
      const tl = norm(h.title);
      const brandOk = brandTok.some((w) => tl.includes(w));
      const nameOk = nameTok.some((w) => tl.includes(w));
      // STRICT: require a name token AND (brand token OR a 2nd name token)
      const nameHits = nameTok.filter((w) => tl.includes(w)).length;
      if (nameOk && (brandOk || nameHits >= 2)) { picked = h; break; }
    }
    if (picked) break;
  }
  if (picked && download(picked.ii.thumburl, dest)) { got.push(p.id); process.stdout.write(`  ✓ ${p.id}  ←  ${picked.title}\n`); }
  else process.stdout.write(`  ·  ${p.id}  (no confident match)\n`);
}

// contact sheet of NEW downloads only (for manual verification)
const newGot = got.filter((id) => NEW.has(id));
const tiles = newGot.map((id) => {
  const p = RAW.find((r) => r.id === id);
  return `<div class=t><img src="/photos/${id}.jpg"><b>${p.name} — ${p.brand}</b><span>${id}</span></div>`;
}).join('');
writeFileSync(join(root, 'public', '_new.html'),
  `<!doctype html><meta charset=utf8><style>body{margin:0;background:#FAF8F4;font-family:system-ui;padding:14px}.g{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.t{background:#fff;border:1px solid #ddd;border-radius:10px;overflow:hidden}.t img{width:100%;height:280px;object-fit:contain;background:#f4f2ec;display:block}.t b{display:block;font-size:14px;padding:8px 10px 2px}.t span{display:block;font-size:11px;padding:0 10px 8px;color:#888}</style><div class=g>${tiles}</div>`);
console.log(`\nNew downloads to verify: ${newGot.length} -> ${newGot.join(', ')}`);
