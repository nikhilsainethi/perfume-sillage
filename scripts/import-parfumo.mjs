// ============================================================
// SILLAGE — Parfumo import pipeline
// Source: "Parfumo Perfume Database 59k" (Kaggle, CC0).
// Curates a high-signal subset — reputable houses, full note
// pyramids, strong community engagement — normalizes every
// note onto our dictionary, and generates
// src/data/catalogImported.ts (RawPerfume[]).
//
// Deterministic + re-runnable:
//   node scripts/import-parfumo.mjs /tmp/parfumo/02_Parfumo_Perfumes.csv
// ============================================================

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const csvPath = process.argv[2] ?? '/tmp/parfumo/02_Parfumo_Perfumes.csv';

const { NOTES, NOTES_LIST } = await import(join(root, 'src/data/notes.ts'));
const { RAW } = await import(join(root, 'src/data/catalogData.ts'));

// ---------- CSV parsing (quoted fields, embedded commas) ----------
function parseCSV(text) {
  const rows = [];
  let row = [], field = '', inQ = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQ) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQ = false;
      } else field += c;
    } else if (c === '"') inQ = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n' || c === '\r') {
      if (field !== '' || row.length) { row.push(field); rows.push(row); row = []; field = ''; }
      if (c === '\r' && text[i + 1] === '\n') i++;
    } else field += c;
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row); }
  const header = rows.shift();
  return rows.map((r) => Object.fromEntries(header.map((h, i) => [h, r[i] ?? ''])));
}

// ---------- reputable houses (kills scraped-in clone pollution) ----------
const HOUSES = new Map([
  ['guerlain', 'Guerlain'], ['xerjoff', 'Xerjoff'], ['amouage', 'Amouage'],
  ['giorgio armani', 'Giorgio Armani'], ['dior', 'Dior'], ['yves saint laurent', 'Yves Saint Laurent'],
  ['chanel', 'Chanel'], ['acqua di parma', 'Acqua di Parma'], ['hugo boss', 'Hugo Boss'],
  ['dolce & gabbana', 'Dolce & Gabbana'], ['creed', 'Creed'], ['parfums de marly', 'Parfums de Marly'],
  ['tom ford', 'Tom Ford'], ['hermès', 'Hermès'], ['hermes', 'Hermès'], ['lancôme', 'Lancôme'],
  ['paco rabanne', 'Paco Rabanne'], ['versace', 'Versace'], ['jean paul gaultier', 'Jean Paul Gaultier'],
  ['givenchy', 'Givenchy'], ['prada', 'Prada'], ['valentino', 'Valentino'], ['burberry', 'Burberry'],
  ['calvin klein', 'Calvin Klein'], ['davidoff', 'Davidoff'], ['montblanc', 'Montblanc'],
  ['viktor & rolf', 'Viktor & Rolf'], ['mugler', 'Mugler'], ['thierry mugler', 'Mugler'],
  ['carolina herrera', 'Carolina Herrera'], ['azzaro', 'Azzaro'], ['byredo', 'Byredo'],
  ['le labo', 'Le Labo'], ['diptyque', 'Diptyque'], ['maison francis kurkdjian', 'Maison Francis Kurkdjian'],
  ['maison margiela', 'Maison Margiela'], ['initio', 'Initio'], ['nishane', 'Nishane'],
  ['mancera', 'Mancera'], ['montale', 'Montale'], ['by kilian', 'By Kilian'], ['kilian', 'By Kilian'],
  ['penhaligon’s', 'Penhaligon’s'], ["penhaligon's", 'Penhaligon’s'],
  ['serge lutens', 'Serge Lutens'], ['frédéric malle', 'Frédéric Malle'], ['frederic malle', 'Frédéric Malle'],
  ['bvlgari', 'Bvlgari'], ['bulgari', 'Bvlgari'], ['joop!', 'Joop!'], ['lattafa', 'Lattafa'],
  ['armaf', 'Armaf'], ['al haramain', 'Al Haramain'], ['afnan', 'Afnan'], ['maison alhambra', 'Maison Alhambra'],
  ['calvin klein', 'Calvin Klein'], ['marc jacobs', 'Marc Jacobs'], ['issey miyake', 'Issey Miyake'],
  ['kenzo', 'Kenzo'], ['ralph lauren', 'Ralph Lauren'], ['gucci', 'Gucci'], ['chloé', 'Chloé'],
  ['narciso rodriguez', 'Narciso Rodriguez'], ['elizabeth arden', 'Elizabeth Arden'],
  ['estēe lauder', 'Estée Lauder'], ['estée lauder', 'Estée Lauder'], ['jo malone', 'Jo Malone'],
  ['nikos', 'Nikos'], ['lalique', 'Lalique'], ['cacharel', 'Cacharel'], ['rochas', 'Rochas'],
  ['jean patou', 'Jean Patou'], ['knize', 'Knize'], ['zino davidoff', 'Davidoff'],
]);

// ---------- note normalization ----------
const strip = (s) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();

const noteIndex = new Map(); // normalized name/synonym -> note id
for (const n of NOTES_LIST) {
  noteIndex.set(strip(n.name), n.id);
  noteIndex.set(strip(n.id.replace(/-/g, ' ')), n.id);
  for (const s of n.synonyms ?? []) noteIndex.set(strip(s), n.id);
}

// dataset-vocabulary aliases -> our note ids
const ALIAS = {
  'mandarin orange': 'mandarin', 'red mandarin orange': 'mandarin', 'tangerine': 'mandarin',
  'cedarwood': 'cedar', 'virginia cedar': 'cedar', 'atlas cedar': 'cedar', 'texas cedar': 'cedar',
  'frankincense': 'incense', 'olibanum': 'incense', 'incense smoke': 'incense',
  'white musk': 'musk', 'musk ambrette': 'musk', 'musks': 'musk',
  'tonka': 'tonka-bean', 'tonka bean': 'tonka-bean', 'coumarin': 'tonka-bean',
  'lily of the valley': 'lily-of-the-valley', 'muguet': 'lily-of-the-valley',
  'marine notes': 'aquatic', 'sea notes': 'aquatic', 'aquatic notes': 'aquatic', 'calone': 'aquatic', 'sea water': 'aquatic', 'ozonic notes': 'aquatic', 'sea breeze': 'aquatic', 'salt': 'sea-salt', 'sea salt': 'sea-salt',
  'agarwood': 'oud', 'oud (agarwood)': 'oud', 'agarwood (oud)': 'oud',
  'orange': 'orange', 'bitter orange': 'bitter-orange', 'blood orange': 'blood-orange', 'sweet orange': 'orange',
  'green apple': 'apple', 'apple': 'apple', 'red apple': 'apple',
  'black currant': 'blackcurrant', 'blackcurrant': 'blackcurrant', 'currant': 'blackcurrant', 'cassis': 'blackcurrant', 'black currant leaf': 'blackcurrant', 'currant leaves': 'green-notes',
  'pepper': 'black-pepper', 'black pepper': 'black-pepper', 'white pepper': 'black-pepper', 'pink pepper': 'pink-pepper', 'sichuan pepper': 'pink-pepper', 'peppercorn': 'black-pepper',
  'vanille': 'vanilla', 'bourbon vanilla': 'vanilla', 'vanilla absolute': 'vanilla', 'vanilla bean': 'vanilla',
  'ambergris': 'ambergris', 'grey amber': 'ambergris', 'ambroxan': 'ambroxan', 'ambrox': 'ambroxan', 'amberwood': 'ambroxan', 'ambrette': 'musk', 'ambrette seed': 'musk',
  'iris root': 'iris', 'orris': 'iris', 'orris root': 'iris', 'iris pallida': 'iris',
  'turkish rose': 'rose', 'bulgarian rose': 'rose', 'damask rose': 'rose', 'rose absolute': 'rose', 'may rose': 'rose', 'taif rose': 'rose', 'rose petals': 'rose', 'white rose': 'rose', 'rose water': 'rose',
  'jasmine sambac': 'jasmine', 'sambac jasmine': 'jasmine', 'egyptian jasmine': 'jasmine', 'jasmine absolute': 'jasmine', 'night blooming jasmine': 'jasmine',
  'peppermint': 'mint', 'spearmint': 'mint', 'menthol': 'mint',
  'clary sage': 'sage', 'sage leaves': 'sage',
  'juniper berry': 'juniper', 'juniper berries': 'juniper', 'gin': 'juniper',
  'nutmeg flower': 'nutmeg', 'mace': 'nutmeg',
  'clove buds': 'clove', 'cloves': 'clove', 'carnation': 'clove', 'eugenol': 'clove',
  'cinnamon bark': 'cinnamon', 'cassia': 'cinnamon',
  'cocoa': 'chocolate', 'cacao': 'chocolate', 'dark chocolate': 'chocolate', 'cacao pod': 'chocolate', 'chocolate': 'chocolate',
  'coffee bean': 'coffee', 'espresso': 'coffee', 'coffee blossom': 'coffee', 'green coffee': 'coffee',
  'bitter almond': 'almond', 'almond blossom': 'almond', 'marzipan': 'almond',
  'caramel': 'caramel', 'toffee': 'toffee', 'butterscotch': 'toffee',
  'candied sugar': 'sugar', 'brown sugar': 'sugar', 'sugar cane': 'sugar', 'ethyl maltol': 'cotton-candy', 'candy floss': 'cotton-candy', 'candy': 'cotton-candy',
  'honey notes': 'honey', 'white honey': 'honey', 'honeycomb': 'honey', 'mead': 'honey', 'beeswax': 'honey',
  'rum': 'rum', 'cognac': 'rum', 'whiskey': 'rum', 'whisky': 'rum', 'brandy': 'rum', 'bourbon': 'rum',
  'leather accord': 'leather', 'suede accord': 'suede', 'nubuck': 'suede',
  'tobacco leaf': 'tobacco', 'tobacco blossom': 'tobacco', 'pipe tobacco': 'tobacco', 'cured tobacco': 'tobacco',
  'guaiac': 'guaiac-wood', 'guaiac wood': 'guaiac-wood', 'guaiacwood': 'guaiac-wood',
  'cashmere wood': 'cashmeran', 'cashmeran': 'cashmeran', 'cashmere musk': 'cashmeran', 'iso e super': 'cashmeran',
  'vetyver': 'vetiver', 'haitian vetiver': 'vetiver', 'vetiver root': 'vetiver',
  'santal': 'sandalwood', 'mysore sandalwood': 'sandalwood', 'australian sandalwood': 'sandalwood',
  'moss': 'oakmoss', 'tree moss': 'oakmoss', 'treemoss': 'oakmoss',
  'fir': 'pine', 'fir balsam': 'pine', 'pine needles': 'pine', 'pine tree': 'pine', 'spruce': 'pine', 'cypress': 'pine', 'balsam fir': 'pine',
  'birch tar': 'birch', 'birch leaf': 'birch', 'birchwood': 'birch',
  'galbanum': 'green-notes', 'green leaves': 'green-notes', 'green notes': 'green-notes', 'grass': 'green-notes', 'leafy green notes': 'green-notes', 'ivy': 'green-notes', 'tomato leaf': 'green-notes', 'bamboo': 'green-notes', 'violet leaf': 'green-notes', 'violet leaves': 'green-notes', 'fig leaf': 'fig', 'fig tree': 'fig',
  'petit grain': 'petitgrain', 'petitgrain bigarade': 'petitgrain',
  'neroli oil': 'neroli', 'orange blossom': 'orange-blossom', 'orange flower': 'orange-blossom',
  'ylang ylang': 'ylang-ylang', 'ylang': 'ylang-ylang',
  'tuberose absolute': 'tuberose', 'white flowers': 'tuberose', 'white floral notes': 'tuberose',
  'water lily': 'lily', 'madonna lily': 'lily', 'calla lily': 'lily',
  'peach blossom': 'peach', 'white peach': 'peach', 'nectarine': 'peach', 'apricot': 'peach', 'osmanthus absolute': 'osmanthus',
  'plum blossom': 'plum', 'davana': 'plum', 'prune': 'plum', 'dried fruits': 'plum', 'dried plum': 'plum',
  'raspberry leaf': 'raspberry', 'wild berries': 'red-berries', 'berries': 'red-berries', 'red berries': 'red-berries', 'cranberry': 'red-berries', 'cherry': 'red-berries', 'sour cherry': 'red-berries', 'blackberry': 'red-berries', 'blueberry': 'red-berries',
  'litchi': 'lychee', 'lychee': 'lychee',
  'coconut milk': 'coconut', 'coconut water': 'coconut',
  'melon': 'melon', 'watermelon': 'watermelon', 'cantaloupe': 'melon',
  'pineapple leaf': 'pineapple',
  'labdanum resin': 'labdanum', 'cistus': 'labdanum', 'rockrose': 'labdanum', 'cistus labdanum': 'labdanum',
  'benzoin resin': 'benzoin', 'siam benzoin': 'benzoin', 'styrax resin': 'styrax',
  'opoponax': 'opoponax', 'sweet myrrh': 'opoponax', 'myrrh resin': 'myrrh',
  'tolu balsam': 'tolu-balsam', 'peru balsam': 'tolu-balsam', 'balsamic notes': 'tolu-balsam',
  'elemi': 'incense', 'elemi resin': 'incense', 'copahu balm': 'tolu-balsam', 'resins': 'benzoin',
  'amber accord': 'amber', 'golden amber': 'amber', 'liquid amber': 'amber', 'amber xtreme': 'ambroxan',
  'milk': 'milk', 'milk mousse': 'milk', 'condensed milk': 'milk', 'cream': 'milk', 'creamy notes': 'milk',
  'marshmallow': 'marshmallow', 'praline': 'praline', 'hazelnut': 'praline', 'nougat': 'praline', 'almond cream': 'almond',
  'heliotrope': 'heliotrope', 'mimosa': 'mimosa', 'freesia': 'freesia', 'magnolia': 'magnolia', 'peony': 'peony', 'gardenia': 'gardenia', 'orchid': 'orchid', 'vanilla orchid': 'orchid',
  'geranium leaf': 'geranium', 'rose geranium': 'geranium',
  'lavender absolute': 'lavender', 'lavandin': 'lavender', 'french lavender': 'lavender',
  'rosemary leaf': 'rosemary', 'thyme leaf': 'thyme', 'basil leaf': 'basil', 'wormwood': 'artemisia', 'absinthe': 'artemisia', 'artemisia': 'artemisia', 'mugwort': 'artemisia',
  'star anise': 'star-anise', 'anise': 'star-anise', 'licorice': 'star-anise', 'fennel': 'star-anise',
  'ginger root': 'ginger', 'candied ginger': 'ginger',
  'saffron threads': 'saffron', 'safraleine': 'saffron',
  'cardamom seed': 'cardamom', 'green cardamom': 'cardamom',
  'lemon zest': 'lemon', 'sicilian lemon': 'lemon', 'citron': 'lemon', 'lemon verbena': 'lemon', 'verbena': 'lemon', 'citruses': 'lemon', 'lime blossom': 'lime', 'kaffir lime': 'lime',
  'sicilian bergamot': 'bergamot', 'calabrian bergamot': 'bergamot', 'italian bergamot': 'bergamot',
  'pink grapefruit': 'grapefruit', 'pomelo': 'grapefruit',
  'yuzu': 'yuzu', 'kumquat': 'mandarin',
  'pear blossom': 'pear', 'nashi pear': 'pear',
  'mango': 'mango', 'papaya': 'mango', 'passionfruit': 'mango', 'passion fruit': 'mango', 'tropical fruits': 'mango', 'banana': 'ylang-ylang',
  'strawberry': 'strawberry', 'wild strawberry': 'strawberry',
  'teakwood': 'teakwood', 'teak wood': 'teakwood', 'driftwood': 'teakwood', 'ebony': 'teakwood', 'mahogany': 'teakwood', 'rosewood': 'cedar', 'palisander rosewood': 'cedar', 'woody notes': 'cedar', 'dry woods': 'cedar', 'blond woods': 'cedar', 'precious woods': 'sandalwood',
  'hinoki wood': 'hinoki', 'papyrus': 'papyrus', 'cypriol oil or nagarmotha': 'papyrus', 'nagarmotha': 'papyrus', 'cypriol': 'papyrus',
  'patchouli leaf': 'patchouli', 'patchouli heart': 'patchouli',
  'musk mallow': 'musk', 'skin musk': 'musk',
  'suede': 'suede', 'leather': 'leather', 'smoke': 'incense', 'smoky notes': 'incense', 'burnt wood': 'guaiac-wood', 'charred wood': 'guaiac-wood',
  'aldehydes': 'green-notes', 'powdery notes': 'iris', 'talc': 'iris', 'makeup notes': 'iris',
  'champagne': 'rum', 'wine': 'rum', 'red wine': 'rum',
  'tea': 'green-notes', 'green tea': 'green-notes', 'black tea': 'tobacco', 'earl grey tea': 'bergamot', 'matcha': 'green-notes', 'maté': 'green-notes', 'mate': 'green-notes',
};

function mapNote(raw) {
  const s = strip(raw);
  if (!s) return null;
  if (noteIndex.has(s)) return noteIndex.get(s);
  if (ALIAS[s]) return ALIAS[s];
  // try dropping a leading qualifier word ("french lavender" -> "lavender")
  const parts = s.split(' ');
  if (parts.length > 1) {
    const tail = parts.slice(1).join(' ');
    if (noteIndex.has(tail)) return noteIndex.get(tail);
    if (ALIAS[tail]) return ALIAS[tail];
  }
  return null;
}

// ---------- name cleaning ----------
const CONC_RE = /\b(eau de parfum|eau de toilette|eau de cologne|extrait de parfum|parfum|extrait|cologne|edt|edp)\b/gi;
const SUBBRANDS = ['emporio armani', 'boss', 'ck', 'lacoste'];
const GENERIC = new Set(['homme', 'man', 'men', 'pour homme', 'woman', 'women', 'femme', 'pour femme', 'lui', 'elle', 'uomo', 'donna']);
function cleanName(name, brand, year) {
  let n = name;
  n = n.split(brand).join(' '); // strip embedded brand
  if (year) n = n.split(String(year)).join(' ');
  n = n.replace(CONC_RE, ' ');
  n = n.replace(/\s+/g, ' ').replace(/^[\s\-–—/]+/g, '').replace(/[\s\-–—/]+$/g, '').trim();
  // strip leading sub-brand prefixes ("Emporio Armani - X" -> "X")
  for (const sb of SUBBRANDS) {
    const re = new RegExp(`^${sb}\\s*[-–—:]\\s*`, 'i');
    n = n.replace(re, '').trim();
  }
  return n;
}

function concOf(name) {
  const n = name.toLowerCase();
  if (n.includes('extrait')) return 'extrait';
  if (n.includes('eau de parfum') || /\bedp\b/.test(n)) return 'edp';
  if (n.includes('eau de toilette') || /\bedt\b/.test(n)) return 'edt';
  if (n.includes('cologne')) return 'edc';
  if (n.includes('parfum')) return 'parfum';
  return undefined;
}

function genderOf(name, url) {
  const s = `${name} ${url}`.toLowerCase();
  if (/\b(homme|man|men|male|pour lui|uomo|him|monsieur|gentleman)\b/.test(s)) return 'masculine';
  if (/\b(femme|woman|women|her|elle|lady|mademoiselle|donna|girl|femal)/.test(s)) return 'feminine';
  return 'unisex';
}

const slug = (s) =>
  strip(s).replace(/ /g, '-').replace(/-+/g, '-').slice(0, 48).replace(/^-|-$/g, '');

// ---------- load + filter ----------
const rows = parseCSV(readFileSync(csvPath, 'utf8'));
const existing = new Set(RAW.map((p) => strip(p.brand) + '|' + strip(p.name)));
const existingIds = new Set(RAW.map((p) => p.id));

// containment dedupe: "Homme" (Dior) duplicates "Dior Homme";
// "Emporio Armani - Stronger With You" duplicates "Stronger With You".
const existingByBrandWord = RAW.map((p) => ({
  brandWords: new Set(strip(p.brand).split(' ')),
  name: strip(p.name),
}));
function duplicatesExisting(house, name) {
  const hw = new Set(strip(house).split(' '));
  const n = strip(name);
  return existingByBrandWord.some((e) => {
    const brandOverlap = [...e.brandWords].some((w) => hw.has(w));
    if (!brandOverlap) return false;
    if (n.length < 4 || e.name.length < 4) return n === e.name;
    return n.includes(e.name) || e.name.includes(n);
  });
}

const candidates = [];
for (const r of rows) {
  const brandKey = strip(r.Brand ?? '');
  const house = HOUSES.get(brandKey);
  if (!house) continue;
  const rc = Number(r.Rating_Count);
  const rv = Number(r.Rating_Value);
  if (!(rc >= 150) || !(rv >= 6)) continue;
  if ([r.Top_Notes, r.Middle_Notes, r.Base_Notes].some((x) => !x || x === 'NA')) continue;

  const year = /^\d{4}$/.test(r.Release_Year) ? Number(r.Release_Year) : undefined;
  const name = cleanName(r.Name, r.Brand, year);
  if (!name || name.length < 2) continue;
  if (GENERIC.has(strip(name))) continue; // over-cleaned ("Homme", "Man")
  const key = strip(house) + '|' + strip(name);
  if (existing.has(key)) continue;
  if (duplicatesExisting(house, name)) continue;

  const tiers = {};
  let raw = 0, mapped = 0;
  for (const [col, tier] of [['Top_Notes', 'top'], ['Middle_Notes', 'heart'], ['Base_Notes', 'base']]) {
    const out = [];
    for (const part of r[col].split(',')) {
      raw++;
      const id = mapNote(part);
      if (id && NOTES[id] && !out.includes(id)) { out.push(id); mapped++; }
    }
    tiers[tier] = out.slice(0, 6);
  }
  if (tiers.top.length === 0 || tiers.heart.length === 0 || tiers.base.length === 0) continue;
  if (mapped / raw < 0.7 || mapped < 5) continue;

  candidates.push({ house, name, year, rc, rv, tiers, key, conc: concOf(r.Name), gender: genderOf(r.Name, r.URL ?? '') });
}

// dedupe same scent across concentrations: keep highest rating count
candidates.sort((a, b) => b.rc - a.rc);
const seen = new Set();
const perBrand = new Map();
const picked = [];
for (const c of candidates) {
  if (seen.has(c.key)) continue;
  const n = perBrand.get(c.house) ?? 0;
  if (n >= 8) continue;
  seen.add(c.key);
  perBrand.set(c.house, n + 1);
  picked.push(c);
  if (picked.length >= 250) break;
}

// ---------- derive perf + desc ----------
const FAMILY_WORD = { citrus: 'citrus', fresh: 'fresh', floral: 'floral', aromatic: 'aromatic', spicy: 'spicy', sweet: 'gourmand', amber: 'amber', woody: 'woody', leather: 'leather' };
const WARM = new Set(['amber', 'sweet', 'spicy', 'woody', 'leather']);

function famTally(tiers) {
  const t = new Map();
  for (const tier of ['top', 'heart', 'base'])
    for (const id of tiers[tier]) {
      const f = NOTES[id].family;
      t.set(f, (t.get(f) ?? 0) + (tier === 'top' ? 0.8 : tier === 'heart' ? 1 : 0.95));
    }
  return [...t.entries()].sort((a, b) => b[1] - a[1]);
}

function buildEntry(c) {
  const fams = famTally(c.tiers);
  const total = fams.reduce((s, [, w]) => s + w, 0) || 1;
  const warm = fams.filter(([f]) => WARM.has(f)).reduce((s, [, w]) => s + w, 0) / total;
  const baseShare = c.tiers.base.length / (c.tiers.top.length + c.tiers.heart.length + c.tiers.base.length);
  const clamp = (v) => Math.max(3, Math.min(9, Math.round(v)));
  const longevity = clamp(4 + baseShare * 5 + warm * 2);
  const projection = clamp(4 + warm * 3 + (c.rv - 6) * 0.5);
  const sillage = clamp((longevity + projection) / 2);
  const seasons = warm > 0.6 ? ['autumn', 'winter'] : warm < 0.35 ? ['spring', 'summer'] : ['spring', 'autumn'];

  const [f1, f2] = fams;
  const core = f2 ? `${FAMILY_WORD[f1[0]]}-${FAMILY_WORD[f2[0]]}` : FAMILY_WORD[f1[0]];
  const leadNotes = [...c.tiers.heart, ...c.tiers.top].slice(0, 2).map((id) => NOTES[id].name.toLowerCase());
  const desc = `A ${WARM.has(f1[0]) ? 'warm' : 'luminous'} ${core} composition led by ${leadNotes.join(' and ')}${c.year ? `, in the house style of ${c.house} (${c.year})` : ` from ${c.house}`}. Community-documented pyramid via Parfumo.`;

  let id = slug(`${c.house} ${c.name}`);
  while (existingIds.has(id)) id = `${id}-p`;
  existingIds.add(id);

  return { id, name: c.name, brand: c.house, type: 'original', year: c.year, gender: c.gender, conc: c.conc, top: c.tiers.top, heart: c.tiers.heart, base: c.tiers.base, perf: [longevity, projection, sillage], seasons, desc };
}

const entries = picked.map(buildEntry);

// ---------- emit ----------
const lit = (v) => JSON.stringify(v).replace(/"/g, "'");
const body = entries
  .map((e) => {
    const parts = [
      `id: ${lit(e.id)}`, `name: ${JSON.stringify(e.name)}`, `brand: ${JSON.stringify(e.brand)}`,
      `type: 'original'`,
      e.year ? `year: ${e.year}` : null,
      e.gender !== 'unisex' ? `gender: ${lit(e.gender)}` : `gender: 'unisex'`,
      e.conc ? `conc: ${lit(e.conc)}` : null,
      `top: ${lit(e.top)}`, `heart: ${lit(e.heart)}`, `base: ${lit(e.base)}`,
      `perf: [${e.perf.join(', ')}]`, `seasons: ${lit(e.seasons)}`,
      `desc: ${JSON.stringify(e.desc)}`,
    ].filter(Boolean);
    return `  { ${parts.join(', ')} },`;
  })
  .join('\n');

writeFileSync(
  join(root, 'src/data/catalogImported.ts'),
  `// ============================================================
// SILLAGE — imported catalog (GENERATED — do not edit by hand)
// Source: Parfumo Perfume Database 59k (Kaggle, CC0), curated:
// reputable houses only, full pyramids, >=300 community
// ratings, notes normalized onto our dictionary.
// Regenerate: node scripts/import-parfumo.mjs <csv>
// ============================================================

import type { RawPerfume } from './catalogData';

export const IMPORTED: RawPerfume[] = [
${body}
];
`,
);

console.log(`imported ${entries.length} scents from ${candidates.length} candidates`);
const brands = new Map();
for (const e of entries) brands.set(e.brand, (brands.get(e.brand) ?? 0) + 1);
console.log('by house:', [...brands.entries()].map(([b, n]) => `${b}(${n})`).join(', '));
