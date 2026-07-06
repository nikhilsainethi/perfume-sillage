// ============================================================
// SILLAGE — Compact catalog (authoring source)
// ~78 popular originals from top houses + ~24 of the most-cited
// dupes. Kept compact on purpose: intensities, accords and the
// per-bottle accent are DERIVED in the builder (perfumes.ts) so
// there are no hand-maintained accord tables to drift.
//
// Note ids must exist in notes.ts and `inspiredBy` must point at
// an original id — both are enforced by scripts/validate-catalog.mjs.
// ============================================================

import type { Concentration, Gender, PerfumeType, Season } from '../domain/types.ts';

export interface RawPerfume {
  id: string;
  name: string;
  brand: string;
  house?: string;
  perfumer?: string;
  type: PerfumeType;
  year?: number;
  gender?: Gender;
  conc?: Concentration;
  inspiredBy?: string; // original id, for clones
  top: string[];
  heart: string[];
  base: string[];
  perf: [number, number, number]; // longevity, projection, sillage (0..10)
  seasons?: Season[];
  moods?: string[];
  occasions?: string[];
  desc: string;
}

export const RAW: RawPerfume[] = [
  // ============================= CREED =============================
  {
    id: 'aventus', name: 'Aventus', brand: 'Creed', house: 'House of Creed', perfumer: 'Olivier Creed',
    type: 'original', year: 2010, gender: 'masculine', conc: 'edp',
    top: ['pineapple', 'bergamot', 'blackcurrant', 'apple'], heart: ['birch', 'patchouli', 'rose', 'jasmine'], base: ['oakmoss', 'ambroxan', 'vanilla'],
    perf: [8, 8, 8], seasons: ['spring', 'autumn'],
    desc: 'The smoky-fruity benchmark: candied pineapple and blackcurrant over a birch-and-moss spine. A modern chypre that wears like a statement.',
  },
  {
    id: 'green-irish-tweed', name: 'Green Irish Tweed', brand: 'Creed', house: 'House of Creed',
    type: 'original', year: 1985, gender: 'masculine', conc: 'edp',
    top: ['lemon', 'mint', 'violet'], heart: ['violet', 'iris'], base: ['sandalwood', 'ambergris', 'musk'],
    perf: [7, 7, 7], seasons: ['spring', 'summer'],
    desc: 'A green, violet-leaf classic — fresh-cut grass and crisp herbs over soft sandalwood. The blueprint for the "fougère gentleman".',
  },
  {
    id: 'silver-mountain-water', name: 'Silver Mountain Water', brand: 'Creed', house: 'House of Creed',
    type: 'original', year: 1995, gender: 'unisex', conc: 'edp',
    top: ['bergamot', 'mandarin'], heart: ['green-notes', 'blackcurrant'], base: ['musk', 'sandalwood'],
    perf: [6, 6, 6], seasons: ['spring', 'summer'],
    desc: 'Cool alpine air bottled — tea-green freshness and tart blackcurrant over clean musk. Effortless and glassy.',
  },

  // ============================= DIOR =============================
  {
    id: 'sauvage', name: 'Sauvage', brand: 'Dior', house: 'Parfums Christian Dior', perfumer: 'François Demachy',
    type: 'original', year: 2015, gender: 'masculine', conc: 'edt',
    top: ['bergamot', 'pink-pepper', 'black-pepper'], heart: ['lavender', 'geranium', 'ginger'], base: ['ambroxan', 'cedar', 'labdanum'],
    perf: [7, 8, 7], seasons: ['spring', 'summer'],
    desc: 'Radiant bergamot over a blast of ambroxan — raw, clean and magnetic. The fragrance that defined the last decade of masculines.',
  },
  {
    id: 'sauvage-elixir', name: 'Sauvage Elixir', brand: 'Dior', house: 'Parfums Christian Dior',
    type: 'original', year: 2021, gender: 'masculine', conc: 'parfum',
    top: ['grapefruit', 'cinnamon', 'cardamom'], heart: ['lavender', 'nutmeg'], base: ['ambroxan', 'star-anise', 'sandalwood'],
    perf: [9, 8, 8], seasons: ['autumn', 'winter'],
    desc: 'The concentrated, spiced-lavender heart of Sauvage — denser, boozier and far longer-lived. A cold-weather powerhouse.',
  },
  {
    id: 'dior-homme-intense', name: 'Dior Homme Intense', brand: 'Dior', house: 'Parfums Christian Dior',
    type: 'original', year: 2011, gender: 'masculine', conc: 'edp',
    top: ['bergamot', 'lavender'], heart: ['iris', 'cardamom'], base: ['vetiver', 'cedar', 'leather'],
    perf: [8, 7, 7], seasons: ['autumn', 'winter'],
    desc: 'Powdery iris made romantic and serious — makeup-soft orris over a quiet leather-and-vetiver base. Endlessly elegant.',
  },
  {
    id: 'eau-sauvage', name: 'Eau Sauvage', brand: 'Dior', house: 'Parfums Christian Dior', perfumer: 'Edmond Roudnitska',
    type: 'original', year: 1966, gender: 'masculine', conc: 'edt',
    top: ['lemon', 'bergamot', 'basil'], heart: ['jasmine', 'rosemary'], base: ['oakmoss', 'vetiver', 'musk'],
    perf: [6, 5, 5], seasons: ['spring', 'summer'],
    desc: 'The original citrus-chypre gentleman — bright lemon and herbs laced with a jasmine that hums under the freshness.',
  },
  {
    id: 'fahrenheit', name: 'Fahrenheit', brand: 'Dior', house: 'Parfums Christian Dior',
    type: 'original', year: 1988, gender: 'masculine', conc: 'edt',
    top: ['mandarin', 'bergamot'], heart: ['violet', 'nutmeg'], base: ['leather', 'vetiver', 'tonka-bean'],
    perf: [8, 8, 7], seasons: ['autumn', 'winter'],
    desc: 'The famous petrol-and-violet enigma — gasoline rasp wrapped in powdery violet and warm leather. Unmistakable.',
  },
  {
    id: 'jadore', name: "J'adore", brand: 'Dior', house: 'Parfums Christian Dior',
    type: 'original', year: 1999, gender: 'feminine', conc: 'edp',
    top: ['pear', 'melon', 'mandarin'], heart: ['jasmine', 'rose', 'tuberose', 'plum'], base: ['musk', 'vanilla', 'cedar'],
    perf: [7, 7, 6], seasons: ['spring', 'summer'],
    desc: 'A glowing white-floral bouquet — ripe fruit into jasmine, rose and tuberose. Polished, feminine, universally flattering.',
  },
  {
    id: 'miss-dior', name: 'Miss Dior', brand: 'Dior', house: 'Parfums Christian Dior',
    type: 'original', year: 2017, gender: 'feminine', conc: 'edp',
    top: ['bergamot', 'blood-orange'], heart: ['rose', 'peony', 'jasmine'], base: ['patchouli', 'musk'],
    perf: [7, 7, 6], seasons: ['spring', 'autumn'],
    desc: 'A modern rose with a chypre wink — dewy peony and rose grounded by clean patchouli. Romantic but not sweet.',
  },
  {
    id: 'hypnotic-poison', name: 'Hypnotic Poison', brand: 'Dior', house: 'Parfums Christian Dior',
    type: 'original', year: 1998, gender: 'feminine', conc: 'edt',
    top: ['coconut', 'plum'], heart: ['almond', 'jasmine'], base: ['vanilla', 'musk', 'sandalwood'],
    perf: [8, 7, 7], seasons: ['autumn', 'winter'],
    desc: 'A hypnotic almond-vanilla veil — bitter-almond and coconut melting into creamy vanilla. Comforting and a little dangerous.',
  },

  // ============================= CHANEL =============================
  {
    id: 'bleu-de-chanel', name: 'Bleu de Chanel', brand: 'Chanel', house: 'Chanel', perfumer: 'Jacques Polge',
    type: 'original', year: 2010, gender: 'masculine', conc: 'edp',
    top: ['grapefruit', 'lemon', 'mint', 'pink-pepper'], heart: ['ginger', 'nutmeg', 'jasmine'], base: ['incense', 'vetiver', 'cedar', 'sandalwood'],
    perf: [7, 7, 6], seasons: ['spring', 'autumn'],
    desc: 'Citrus and mint snapping over a smoky incense-and-vetiver base. The blueprint for the modern versatile masculine.',
  },
  {
    id: 'coco-mademoiselle', name: 'Coco Mademoiselle', brand: 'Chanel', house: 'Chanel',
    type: 'original', year: 2001, gender: 'feminine', conc: 'edp',
    top: ['orange', 'bergamot'], heart: ['rose', 'jasmine', 'lychee'], base: ['patchouli', 'vetiver', 'vanilla', 'musk'],
    perf: [8, 7, 7], seasons: ['spring', 'autumn'],
    desc: 'The crisp rose-patchouli signature of a generation — sparkling orange into a clean, confident chypre drydown.',
  },
  {
    id: 'chanel-no5', name: 'N°5', brand: 'Chanel', house: 'Chanel', perfumer: 'Ernest Beaux',
    type: 'original', year: 1921, gender: 'feminine', conc: 'parfum',
    top: ['bergamot', 'neroli', 'lemon'], heart: ['rose', 'jasmine', 'lily-of-the-valley'], base: ['sandalwood', 'vanilla', 'musk'],
    perf: [8, 7, 7], seasons: ['autumn', 'winter'],
    desc: 'The most famous perfume on earth — aldehydic abstraction over rose and jasmine. Not a flower, but the idea of one.',
  },
  {
    id: 'allure-homme-sport', name: 'Allure Homme Sport', brand: 'Chanel', house: 'Chanel',
    type: 'original', year: 2004, gender: 'masculine', conc: 'edt',
    top: ['orange', 'mandarin', 'sea-salt'], heart: ['black-pepper', 'cedar'], base: ['tonka-bean', 'vetiver', 'amber'],
    perf: [7, 7, 6], seasons: ['spring', 'summer'],
    desc: 'Clean citrus and sea-air over a soft tonka warmth — the effortless, never-wrong daytime masculine.',
  },
  {
    id: 'chance-eau-tendre', name: 'Chance Eau Tendre', brand: 'Chanel', house: 'Chanel',
    type: 'original', year: 2010, gender: 'feminine', conc: 'edp',
    top: ['grapefruit', 'pear'], heart: ['jasmine', 'lily-of-the-valley'], base: ['musk', 'amber', 'cedar'],
    perf: [7, 6, 6], seasons: ['spring', 'summer'],
    desc: 'Soft, fruity-floral and impossibly easy — grapefruit and pear into a clean jasmine musk. A crowd-pleaser.',
  },

  // ============================= TOM FORD =============================
  {
    id: 'oud-wood', name: 'Oud Wood', brand: 'Tom Ford', house: 'Tom Ford Private Blend',
    type: 'original', year: 2007, gender: 'unisex', conc: 'edp',
    top: ['cardamom', 'pink-pepper'], heart: ['oud', 'sandalwood', 'cedar'], base: ['vanilla', 'amber', 'tonka-bean'],
    perf: [8, 6, 6], seasons: ['autumn', 'winter'],
    desc: 'The oud that made oud wearable in the West — smoky agarwood smoothed by creamy sandalwood and soft vanilla-amber.',
  },
  {
    id: 'tobacco-vanille', name: 'Tobacco Vanille', brand: 'Tom Ford', house: 'Tom Ford Private Blend',
    type: 'original', year: 2007, gender: 'unisex', conc: 'edp',
    top: ['tobacco', 'cardamom'], heart: ['vanilla', 'tonka-bean', 'honey'], base: ['cedar', 'labdanum', 'praline'],
    perf: [9, 8, 8], seasons: ['autumn', 'winter'],
    desc: 'A spiced honey-tobacco bound to creamy vanilla and tonka — the gourmand-leather benchmark. Wears like a cashmere coat.',
  },
  {
    id: 'black-orchid', name: 'Black Orchid', brand: 'Tom Ford', house: 'Tom Ford',
    type: 'original', year: 2006, gender: 'unisex', conc: 'edp',
    top: ['blackcurrant', 'bergamot', 'ylang-ylang'], heart: ['orchid', 'jasmine', 'patchouli'], base: ['vanilla', 'amber', 'sandalwood', 'incense'],
    perf: [8, 7, 7], seasons: ['autumn', 'winter'],
    desc: 'Dark, opulent and unmistakable — truffle-rich florals over patchouli, vanilla and incense. A nocturnal statement.',
  },
  {
    id: 'lost-cherry', name: 'Lost Cherry', brand: 'Tom Ford', house: 'Tom Ford Private Blend',
    type: 'original', year: 2018, gender: 'unisex', conc: 'edp',
    top: ['red-berries', 'almond', 'plum'], heart: ['rose', 'jasmine'], base: ['tonka-bean', 'vanilla', 'sandalwood'],
    perf: [8, 7, 7], seasons: ['autumn', 'winter'],
    desc: 'Boozy black-cherry liqueur and bitter almond over a creamy tonka base — sweet, sticky and unapologetically loud.',
  },
  {
    id: 'ombre-leather', name: 'Ombré Leather', brand: 'Tom Ford', house: 'Tom Ford',
    type: 'original', year: 2018, gender: 'unisex', conc: 'edp',
    top: ['cardamom'], heart: ['leather', 'jasmine'], base: ['amber', 'patchouli', 'vetiver'],
    perf: [8, 7, 7], seasons: ['autumn', 'winter'],
    desc: 'Soft suede-leather and a desert-floral heart — rugged but refined. Leather for people who don’t like leather.',
  },
  {
    id: 'soleil-blanc', name: 'Soleil Blanc', brand: 'Tom Ford', house: 'Tom Ford Private Blend',
    type: 'original', year: 2016, gender: 'unisex', conc: 'edp',
    top: ['bergamot', 'cardamom'], heart: ['tuberose', 'ylang-ylang'], base: ['coconut', 'amber', 'tonka-bean'],
    perf: [7, 6, 6], seasons: ['spring', 'summer'],
    desc: 'Suntan-oil glamour — coconut and tuberose over warm amber. Beach holiday distilled into a bottle.',
  },

  // ============================= MFK =============================
  {
    id: 'baccarat-rouge-540', name: 'Baccarat Rouge 540', brand: 'Maison Francis Kurkdjian', house: 'MFK Paris', perfumer: 'Francis Kurkdjian',
    type: 'original', year: 2015, gender: 'unisex', conc: 'edp',
    top: ['saffron', 'jasmine'], heart: ['ambroxan', 'amber', 'honey'], base: ['cedar', 'benzoin', 'labdanum'],
    perf: [8, 9, 9], seasons: ['autumn', 'winter'],
    desc: 'Crystalline and jammy at once — saffron and jasmine lit by a luminous amberwood that seems to glow on skin.',
  },
  {
    id: 'grand-soir', name: 'Grand Soir', brand: 'Maison Francis Kurkdjian', house: 'MFK Paris',
    type: 'original', year: 2016, gender: 'unisex', conc: 'edp',
    top: ['amber', 'bergamot'], heart: ['benzoin', 'tonka-bean', 'vanilla'], base: ['labdanum', 'tolu-balsam', 'musk'],
    perf: [8, 7, 7], seasons: ['autumn', 'winter'],
    desc: 'Amber turned up to gold — benzoin, tonka and vanilla in a warm, boozy, after-dark glow. Pure comfort, beautifully done.',
  },
  {
    id: 'oud-satin-mood', name: 'Oud Satin Mood', brand: 'Maison Francis Kurkdjian', house: 'MFK Paris',
    type: 'original', year: 2015, gender: 'unisex', conc: 'edp',
    top: ['violet'], heart: ['rose', 'oud'], base: ['vanilla', 'benzoin', 'amber'],
    perf: [8, 8, 8], seasons: ['autumn', 'winter'],
    desc: 'Velvety rose and oud wrapped in violet and vanilla — plush, opulent and almost edible. Middle-Eastern luxe.',
  },

  // ============================= YSL =============================
  {
    id: 'la-nuit-de-lhomme', name: "La Nuit de L'Homme", brand: 'Yves Saint Laurent', house: 'YSL',
    type: 'original', year: 2009, gender: 'masculine', conc: 'edt',
    top: ['cardamom', 'bergamot'], heart: ['lavender', 'cedar'], base: ['tonka-bean', 'vetiver'],
    perf: [7, 7, 6], seasons: ['autumn', 'spring'],
    desc: 'Seductive cardamom and lavender over sweet coumarin — restrained, sexy and date-night reliable.',
  },
  {
    id: 'y-edp', name: 'Y Eau de Parfum', brand: 'Yves Saint Laurent', house: 'YSL',
    type: 'original', year: 2018, gender: 'masculine', conc: 'edp',
    top: ['apple', 'ginger', 'bergamot'], heart: ['sage', 'geranium'], base: ['ambroxan', 'tonka-bean', 'cedar'],
    perf: [8, 8, 7], seasons: ['spring', 'autumn'],
    desc: 'Fresh-and-sweet done sharply — green apple and sage over an ambroxan-tonka base. A modern crowd-magnet.',
  },
  {
    id: 'black-opium', name: 'Black Opium', brand: 'Yves Saint Laurent', house: 'YSL',
    type: 'original', year: 2014, gender: 'feminine', conc: 'edp',
    top: ['pink-pepper', 'pear'], heart: ['coffee', 'jasmine', 'orange-blossom'], base: ['vanilla', 'patchouli'],
    perf: [8, 7, 7], seasons: ['autumn', 'winter'],
    desc: 'Black-coffee and vanilla with a sweet floral jolt — addictive, nocturnal and unmistakably modern.',
  },
  {
    id: 'libre', name: 'Libre', brand: 'Yves Saint Laurent', house: 'YSL',
    type: 'original', year: 2019, gender: 'feminine', conc: 'edp',
    top: ['mandarin', 'lavender'], heart: ['orange-blossom', 'jasmine'], base: ['vanilla', 'musk', 'amber'],
    perf: [8, 7, 7], seasons: ['spring', 'autumn'],
    desc: 'A lavender-and-orange-blossom twist on the floral — the tension of masculine herb and feminine bloom.',
  },
  {
    id: 'myslf', name: 'MYSLF', brand: 'Yves Saint Laurent', house: 'YSL',
    type: 'original', year: 2023, gender: 'masculine', conc: 'edp',
    top: ['bergamot'], heart: ['orange-blossom', 'ginger'], base: ['patchouli', 'cedar', 'ambroxan'],
    perf: [8, 7, 7], seasons: ['spring', 'autumn'],
    desc: 'A clean, modern orange-blossom masculine — bright bloom over patchouli and ambrofix. Soft-spoken but distinctive.',
  },

  // ============================= PACO RABANNE =============================
  {
    id: '1-million', name: '1 Million', brand: 'Paco Rabanne', house: 'Paco Rabanne',
    type: 'original', year: 2008, gender: 'masculine', conc: 'edt',
    top: ['grapefruit', 'blood-orange', 'mint'], heart: ['rose', 'cinnamon'], base: ['leather', 'amber', 'tonka-bean'],
    perf: [8, 8, 7], seasons: ['autumn', 'winter'],
    desc: 'Brash, fun and unmistakable — spicy cinnamon-rose over a sweet leather-amber. The party masculine.',
  },
  {
    id: 'invictus', name: 'Invictus', brand: 'Paco Rabanne', house: 'Paco Rabanne',
    type: 'original', year: 2013, gender: 'masculine', conc: 'edt',
    top: ['grapefruit', 'aquatic', 'mandarin'], heart: ['sage', 'jasmine'], base: ['ambergris', 'guaiac-wood', 'oakmoss'],
    perf: [7, 8, 7], seasons: ['spring', 'summer'],
    desc: 'Fresh-marine and salty-sweet — grapefruit and sea-spray over a clean ambergris base. The gym-bag crowd-pleaser.',
  },
  {
    id: 'phantom', name: 'Phantom', brand: 'Paco Rabanne', house: 'Paco Rabanne',
    type: 'original', year: 2021, gender: 'masculine', conc: 'edt',
    top: ['lemon', 'lavender'], heart: ['apple', 'sage'], base: ['vanilla', 'patchouli'],
    perf: [7, 7, 6], seasons: ['spring', 'summer'],
    desc: 'A bright lavender-vanilla with a fizzy lemon top — clean, friendly and easy to wear anywhere.',
  },
  {
    id: 'pure-xs', name: 'Pure XS', brand: 'Paco Rabanne', house: 'Paco Rabanne',
    type: 'original', year: 2017, gender: 'masculine', conc: 'edt',
    top: ['ginger', 'bergamot'], heart: ['cinnamon', 'vanilla'], base: ['amber', 'vetiver', 'myrrh'],
    perf: [8, 7, 7], seasons: ['autumn', 'winter'],
    desc: 'A warm, sweet-spicy vanilla with a metallic ginger edge — sleek and seductive after dark.',
  },
  {
    id: 'lady-million', name: 'Lady Million', brand: 'Paco Rabanne', house: 'Paco Rabanne',
    type: 'original', year: 2010, gender: 'feminine', conc: 'edp',
    top: ['raspberry', 'neroli'], heart: ['orange-blossom', 'jasmine'], base: ['honey', 'patchouli', 'amber'],
    perf: [8, 7, 7], seasons: ['autumn', 'spring'],
    desc: 'Honeyed neroli and jasmine with a tart berry sparkle — glamorous, a little brazen, hard to ignore.',
  },

  // ============================= ARMANI =============================
  {
    id: 'acqua-di-gio', name: 'Acqua di Giò', brand: 'Giorgio Armani', house: 'Armani',
    type: 'original', year: 1996, gender: 'masculine', conc: 'edt',
    top: ['bergamot', 'lime', 'green-notes'], heart: ['jasmine', 'aquatic', 'rosemary'], base: ['patchouli', 'cedar', 'musk'],
    perf: [6, 6, 6], seasons: ['spring', 'summer'],
    desc: 'The aquatic that launched a thousand others — sea-breeze freshness and citrus over soft woods. Eternally summer.',
  },
  {
    id: 'acqua-di-gio-profumo', name: 'Acqua di Giò Profumo', brand: 'Giorgio Armani', house: 'Armani',
    type: 'original', year: 2015, gender: 'masculine', conc: 'parfum',
    top: ['bergamot', 'aquatic'], heart: ['geranium', 'sage'], base: ['incense', 'patchouli', 'musk'],
    perf: [8, 7, 7], seasons: ['spring', 'autumn'],
    desc: 'The aquatic gone smoky and grown-up — marine freshness shadowed by incense. Elegant, versatile, refined.',
  },
  {
    id: 'si', name: 'Sì', brand: 'Giorgio Armani', house: 'Armani',
    type: 'original', year: 2013, gender: 'feminine', conc: 'edp',
    top: ['blackcurrant', 'bergamot'], heart: ['rose', 'freesia'], base: ['vanilla', 'patchouli', 'amber'],
    perf: [8, 7, 7], seasons: ['autumn', 'winter'],
    desc: 'A modern chypre-gourmand — blackcurrant and rose over a vanilla-patchouli purr. Polished and sophisticated.',
  },
  {
    id: 'stronger-with-you', name: 'Stronger With You', brand: 'Giorgio Armani', house: 'Armani',
    type: 'original', year: 2017, gender: 'masculine', conc: 'edt',
    top: ['cardamom', 'pink-pepper'], heart: ['sage', 'lavender'], base: ['vanilla', 'chocolate', 'amber'],
    perf: [7, 7, 6], seasons: ['autumn', 'winter'],
    desc: 'Sweet-spicy and cozy — cardamom and sage melting into a chestnut-vanilla warmth. A reliable charmer.',
  },
  {
    id: 'armani-code', name: 'Armani Code', brand: 'Giorgio Armani', house: 'Armani',
    type: 'original', year: 2004, gender: 'masculine', conc: 'edt',
    top: ['bergamot', 'lemon'], heart: ['orange-blossom', 'star-anise'], base: ['leather', 'tonka-bean', 'tobacco'],
    perf: [7, 7, 6], seasons: ['autumn', 'winter'],
    desc: 'A suave evening masculine — orange-blossom and anise over warm tonka-tobacco. Smooth, dressed-up, classic.',
  },

  // ============================= VERSACE =============================
  {
    id: 'eros', name: 'Eros', brand: 'Versace', house: 'Versace',
    type: 'original', year: 2012, gender: 'masculine', conc: 'edt',
    top: ['mint', 'apple', 'lemon'], heart: ['tonka-bean', 'geranium'], base: ['vanilla', 'vetiver', 'cedar'],
    perf: [8, 8, 8], seasons: ['autumn', 'winter'],
    desc: 'Icy mint and green apple over a candied vanilla-tonka base — loud, sweet and built to project. A club classic.',
  },
  {
    id: 'eros-flame', name: 'Eros Flame', brand: 'Versace', house: 'Versace',
    type: 'original', year: 2018, gender: 'masculine', conc: 'edp',
    top: ['mandarin', 'black-pepper'], heart: ['rose', 'geranium'], base: ['tonka-bean', 'vanilla', 'sandalwood'],
    perf: [8, 8, 7], seasons: ['autumn', 'winter'],
    desc: 'The warmer, redder Eros — peppery citrus and rose over a rich vanilla-wood base. Cozy but still bold.',
  },
  {
    id: 'dylan-blue', name: 'Dylan Blue', brand: 'Versace', house: 'Versace',
    type: 'original', year: 2016, gender: 'masculine', conc: 'edt',
    top: ['bergamot', 'grapefruit', 'aquatic'], heart: ['violet', 'papyrus', 'black-pepper'], base: ['musk', 'tonka-bean', 'amber'],
    perf: [8, 7, 7], seasons: ['spring', 'autumn'],
    desc: 'Fresh-meets-woody — aquatic citrus over papyrus and a soft musky amber. A versatile daily workhorse.',
  },
  {
    id: 'bright-crystal', name: 'Bright Crystal', brand: 'Versace', house: 'Versace',
    type: 'original', year: 2006, gender: 'feminine', conc: 'edt',
    top: ['red-berries', 'yuzu'], heart: ['peony', 'magnolia'], base: ['musk', 'amber', 'cedar'],
    perf: [7, 6, 6], seasons: ['spring', 'summer'],
    desc: 'Sheer, fruity-floral and breezy — pomegranate and peony over clean musk. Light, pretty and easy.',
  },

  // ============================= JEAN PAUL GAULTIER =============================
  {
    id: 'le-male', name: 'Le Mâle', brand: 'Jean Paul Gaultier', house: 'Jean Paul Gaultier',
    type: 'original', year: 1995, gender: 'masculine', conc: 'edt',
    top: ['mint', 'lavender', 'bergamot'], heart: ['cinnamon', 'orange-blossom'], base: ['vanilla', 'tonka-bean', 'sandalwood'],
    perf: [8, 7, 7], seasons: ['autumn', 'winter'],
    desc: 'The sailor in the can — fresh mint-lavender over a sweet vanilla-tonka heart. A defining 90s masculine.',
  },
  {
    id: 'le-male-elixir', name: 'Le Mâle Elixir', brand: 'Jean Paul Gaultier', house: 'Jean Paul Gaultier',
    type: 'original', year: 2023, gender: 'masculine', conc: 'parfum',
    top: ['lavender', 'mint'], heart: ['honey', 'cinnamon'], base: ['vanilla', 'benzoin', 'tonka-bean'],
    perf: [9, 8, 8], seasons: ['autumn', 'winter'],
    desc: 'Le Mâle drenched in honey — sticky, boozy lavender-vanilla with serious depth and stamina. A beast.',
  },
  {
    id: 'ultra-male', name: 'Ultra Male', brand: 'Jean Paul Gaultier', house: 'Jean Paul Gaultier',
    type: 'original', year: 2015, gender: 'masculine', conc: 'edt',
    top: ['pear', 'lavender', 'mint'], heart: ['cinnamon', 'orange-blossom'], base: ['vanilla', 'amber', 'cedar'],
    perf: [9, 8, 8], seasons: ['autumn', 'winter'],
    desc: 'Le Mâle’s rowdy younger brother — juicy pear and lavender over a huge sweet vanilla. Loud and addictive.',
  },
  {
    id: 'scandal', name: 'Scandal', brand: 'Jean Paul Gaultier', house: 'Jean Paul Gaultier',
    type: 'original', year: 2017, gender: 'feminine', conc: 'edp',
    top: ['blood-orange', 'mandarin'], heart: ['honey', 'gardenia'], base: ['patchouli', 'star-anise'],
    perf: [8, 7, 7], seasons: ['autumn', 'winter'],
    desc: 'A honeyed floral with a dark patchouli base — sweet and bold, a little scandalous as promised.',
  },

  // ============================= PARFUMS DE MARLY =============================
  {
    id: 'layton', name: 'Layton', brand: 'Parfums de Marly', house: 'Parfums de Marly',
    type: 'original', year: 2016, gender: 'unisex', conc: 'edp',
    top: ['apple', 'bergamot', 'lavender'], heart: ['geranium', 'violet'], base: ['vanilla', 'sandalwood', 'cardamom'],
    perf: [9, 8, 8], seasons: ['autumn', 'winter'],
    desc: 'Crowd-stopping apple-and-lavender over a creamy vanilla-spice base — refined, versatile and a guaranteed compliment-getter.',
  },
  {
    id: 'herod', name: 'Herod', brand: 'Parfums de Marly', house: 'Parfums de Marly',
    type: 'original', year: 2012, gender: 'masculine', conc: 'edp',
    top: ['cinnamon', 'black-pepper'], heart: ['tobacco', 'osmanthus'], base: ['vanilla', 'vetiver', 'cedar'],
    perf: [9, 8, 8], seasons: ['autumn', 'winter'],
    desc: 'Sweet, spicy tobacco-vanilla with a cinnamon bite — cold-weather warmth that fills a room.',
  },
  {
    id: 'pegasus', name: 'Pegasus', brand: 'Parfums de Marly', house: 'Parfums de Marly',
    type: 'original', year: 2011, gender: 'masculine', conc: 'edp',
    top: ['bergamot', 'heliotrope'], heart: ['almond', 'lavender'], base: ['vanilla', 'sandalwood', 'amber'],
    perf: [8, 8, 7], seasons: ['autumn', 'spring'],
    desc: 'Creamy almond-vanilla and heliotrope over sandalwood — soft, nutty and beautifully comforting.',
  },
  {
    id: 'delina', name: 'Delina', brand: 'Parfums de Marly', house: 'Parfums de Marly',
    type: 'original', year: 2017, gender: 'feminine', conc: 'edp',
    top: ['lychee', 'bergamot'], heart: ['rose', 'peony'], base: ['vanilla', 'musk', 'cashmeran'],
    perf: [8, 8, 8], seasons: ['spring', 'autumn'],
    desc: 'A glistening lychee-rose with cashmeran warmth — the modern feminine that everyone asks about.',
  },

  // ============================= MAISON MARGIELA REPLICA =============================
  {
    id: 'jazz-club', name: 'Replica Jazz Club', brand: 'Maison Margiela', house: 'Maison Margiela Replica',
    type: 'original', year: 2013, gender: 'masculine', conc: 'edt',
    top: ['pink-pepper', 'lemon'], heart: ['tonka-bean', 'sage'], base: ['tobacco', 'vanilla', 'styrax'],
    perf: [7, 7, 6], seasons: ['autumn', 'winter'],
    desc: 'A whisky-bar in a bottle — rum, tobacco and tonka over smoky styrax. Warm, boozy and atmospheric.',
  },
  {
    id: 'by-the-fireplace', name: 'Replica By the Fireplace', brand: 'Maison Margiela', house: 'Maison Margiela Replica',
    type: 'original', year: 2015, gender: 'unisex', conc: 'edt',
    top: ['clove', 'pink-pepper', 'mandarin'], heart: ['guaiac-wood', 'chocolate'], base: ['vanilla', 'cashmeran', 'tolu-balsam'],
    perf: [7, 7, 6], seasons: ['autumn', 'winter'],
    desc: 'Roasted chestnuts and woodsmoke wrapped in vanilla — the smell of a winter hearth. Cozy and nostalgic.',
  },
  {
    id: 'beach-walk', name: 'Replica Beach Walk', brand: 'Maison Margiela', house: 'Maison Margiela Replica',
    type: 'original', year: 2012, gender: 'unisex', conc: 'edt',
    top: ['bergamot', 'lemon'], heart: ['coconut', 'ylang-ylang'], base: ['musk', 'benzoin', 'cedar'],
    perf: [6, 6, 6], seasons: ['spring', 'summer'],
    desc: 'Coconut sunscreen, salt air and a sunlit ylang — a day at the shore captured with uncanny realism.',
  },

  // ============================= HERMÈS =============================
  {
    id: 'terre-dhermes', name: "Terre d'Hermès", brand: 'Hermès', house: 'Hermès', perfumer: 'Jean-Claude Ellena',
    type: 'original', year: 2006, gender: 'masculine', conc: 'edt',
    top: ['orange', 'grapefruit'], heart: ['black-pepper', 'geranium'], base: ['vetiver', 'cedar', 'patchouli'],
    perf: [8, 7, 7], seasons: ['spring', 'autumn'],
    desc: 'Mineral orange and flinty vetiver — earth and citrus in perfect tension. A masterclass in restraint.',
  },
  {
    id: 'twilly-dhermes', name: "Twilly d'Hermès", brand: 'Hermès', house: 'Hermès',
    type: 'original', year: 2017, gender: 'feminine', conc: 'edp',
    top: ['ginger'], heart: ['tuberose', 'jasmine'], base: ['sandalwood', 'vanilla'],
    perf: [7, 7, 6], seasons: ['spring', 'autumn'],
    desc: 'Spicy ginger against a creamy tuberose — playful, modern and a little bit cheeky.',
  },

  // ============================= GUERLAIN =============================
  {
    id: 'shalimar', name: 'Shalimar', brand: 'Guerlain', house: 'Guerlain', perfumer: 'Jacques Guerlain',
    type: 'original', year: 1925, gender: 'feminine', conc: 'edp',
    top: ['bergamot', 'lemon'], heart: ['iris', 'jasmine', 'rose'], base: ['vanilla', 'tonka-bean', 'leather'],
    perf: [9, 8, 8], seasons: ['autumn', 'winter'],
    desc: 'The original oriental — a smoky, leathery vanilla over bright bergamot. Nearly a century old and still seductive.',
  },
  {
    id: 'mon-guerlain', name: 'Mon Guerlain', brand: 'Guerlain', house: 'Guerlain',
    type: 'original', year: 2017, gender: 'feminine', conc: 'edp',
    top: ['bergamot', 'lavender'], heart: ['jasmine', 'iris'], base: ['vanilla', 'tonka-bean', 'sandalwood'],
    perf: [8, 7, 7], seasons: ['spring', 'autumn'],
    desc: 'A modern lavender-vanilla — soft, powdery and clean. Comfortable elegance for any day.',
  },

  // ============================= LE LABO =============================
  {
    id: 'santal-33', name: 'Santal 33', brand: 'Le Labo', house: 'Le Labo',
    type: 'original', year: 2011, gender: 'unisex', conc: 'edp',
    top: ['cardamom', 'violet'], heart: ['iris', 'sandalwood', 'ambroxan'], base: ['cedar', 'leather', 'vetiver'],
    perf: [7, 6, 6], seasons: ['spring', 'autumn'],
    desc: 'The cult creamy-woody signature — dry cedar and leather around milky sandalwood and powdery iris.',
  },

  // ============================= INITIO =============================
  {
    id: 'oud-for-greatness', name: 'Oud for Greatness', brand: 'Initio', house: 'Initio Parfums Privés',
    type: 'original', year: 2018, gender: 'unisex', conc: 'edp',
    top: ['saffron', 'lavender'], heart: ['oud', 'patchouli'], base: ['musk', 'cedar'],
    perf: [9, 9, 9], seasons: ['autumn', 'winter'],
    desc: 'A saffron-and-oud monster softened by lavender — loud, dark and luxurious. Confidence in a bottle.',
  },

  // ============================= CAROLINA HERRERA =============================
  {
    id: 'good-girl', name: 'Good Girl', brand: 'Carolina Herrera', house: 'Carolina Herrera',
    type: 'original', year: 2016, gender: 'feminine', conc: 'edp',
    top: ['almond', 'coffee'], heart: ['tuberose', 'jasmine'], base: ['tonka-bean', 'chocolate', 'vanilla'],
    perf: [8, 8, 8], seasons: ['autumn', 'winter'],
    desc: 'The stiletto bottle’s promise made real — roasted coffee and tuberose over cocoa-tonka. Sweet, dark and bold.',
  },
  {
    id: 'bad-boy', name: 'Bad Boy', brand: 'Carolina Herrera', house: 'Carolina Herrera',
    type: 'original', year: 2019, gender: 'masculine', conc: 'edt',
    top: ['bergamot', 'pink-pepper'], heart: ['sage', 'cedar'], base: ['tonka-bean', 'chocolate', 'amber'],
    perf: [7, 7, 6], seasons: ['autumn', 'winter'],
    desc: 'Good Girl’s counterpart — peppery sage over a cocoa-tonka warmth. Playful, sweet and easy to like.',
  },

  // ============================= LANCÔME =============================
  {
    id: 'la-vie-est-belle', name: 'La Vie Est Belle', brand: 'Lancôme', house: 'Lancôme',
    type: 'original', year: 2012, gender: 'feminine', conc: 'edp',
    top: ['blackcurrant', 'pear'], heart: ['iris', 'jasmine'], base: ['praline', 'vanilla', 'patchouli'],
    perf: [9, 8, 8], seasons: ['autumn', 'winter'],
    desc: 'The praline-iris juggernaut — sweet, powdery and enormous. A modern feminine icon for a reason.',
  },
  {
    id: 'idole', name: 'Idôle', brand: 'Lancôme', house: 'Lancôme',
    type: 'original', year: 2019, gender: 'feminine', conc: 'edp',
    top: ['pear', 'bergamot'], heart: ['rose', 'jasmine'], base: ['vanilla', 'musk', 'cedar'],
    perf: [7, 6, 6], seasons: ['spring', 'summer'],
    desc: 'A clean, modern rose — fresh, airy and second-skin soft. Minimalist by design.',
  },

  // ============================= VIKTOR & ROLF =============================
  {
    id: 'flowerbomb', name: 'Flowerbomb', brand: 'Viktor & Rolf', house: 'Viktor & Rolf',
    type: 'original', year: 2005, gender: 'feminine', conc: 'edp',
    top: ['bergamot', 'green-notes'], heart: ['jasmine', 'rose', 'orchid'], base: ['patchouli', 'vanilla', 'musk'],
    perf: [8, 8, 7], seasons: ['autumn', 'spring'],
    desc: 'An explosion of sweet florals over vanilla-patchouli — lavish, hyper-feminine and unmistakable.',
  },
  {
    id: 'spicebomb', name: 'Spicebomb', brand: 'Viktor & Rolf', house: 'Viktor & Rolf',
    type: 'original', year: 2012, gender: 'masculine', conc: 'edt',
    top: ['bergamot', 'pink-pepper'], heart: ['cinnamon', 'saffron'], base: ['tobacco', 'leather', 'vetiver'],
    perf: [8, 8, 7], seasons: ['autumn', 'winter'],
    desc: 'A grenade of spice — cinnamon and pepper over warm tobacco-leather. Bold cold-weather drama.',
  },

  // ============================= MUGLER =============================
  {
    id: 'angel', name: 'Angel', brand: 'Mugler', house: 'Mugler', perfumer: 'Olivier Cresp',
    type: 'original', year: 1992, gender: 'feminine', conc: 'edp',
    top: ['bergamot', 'red-berries'], heart: ['honey', 'peach'], base: ['patchouli', 'chocolate', 'vanilla'],
    perf: [9, 9, 9], seasons: ['autumn', 'winter'],
    desc: 'The first true gourmand — a polarizing, gigantic praline-patchouli that rewrote perfumery. Love it or flee it.',
  },
  {
    id: 'alien', name: 'Alien', brand: 'Mugler', house: 'Mugler',
    type: 'original', year: 2005, gender: 'feminine', conc: 'edp',
    top: ['jasmine', 'mandarin'], heart: ['jasmine', 'cashmeran'], base: ['amber', 'cedar'],
    perf: [9, 9, 9], seasons: ['autumn', 'winter'],
    desc: 'Radiant indolic jasmine over warm amber-woods — hypnotic, dense and otherworldly. A signature-scent magnet.',
  },

  // ============================= DOLCE & GABBANA =============================
  {
    id: 'light-blue', name: 'Light Blue', brand: 'Dolce & Gabbana', house: 'Dolce & Gabbana',
    type: 'original', year: 2001, gender: 'feminine', conc: 'edt',
    top: ['lemon', 'apple'], heart: ['jasmine', 'rose'], base: ['cedar', 'amber', 'musk'],
    perf: [6, 6, 5], seasons: ['spring', 'summer'],
    desc: 'Crisp Granny-Smith apple and Sicilian lemon — the definitive bright, breezy summer scent.',
  },
  {
    id: 'the-one', name: 'The One', brand: 'Dolce & Gabbana', house: 'Dolce & Gabbana',
    type: 'original', year: 2008, gender: 'masculine', conc: 'edt',
    top: ['grapefruit', 'coriander'], heart: ['ginger', 'cardamom'], base: ['amber', 'tobacco', 'cedar'],
    perf: [7, 7, 6], seasons: ['autumn', 'winter'],
    desc: 'A spicy-warm tobacco-amber — refined, slightly sweet and office-to-evening versatile.',
  },

  // ============================= PRADA =============================
  {
    id: 'luna-rossa-carbon', name: 'Luna Rossa Carbon', brand: 'Prada', house: 'Prada',
    type: 'original', year: 2017, gender: 'masculine', conc: 'edt',
    top: ['bergamot', 'lavender'], heart: ['black-pepper', 'patchouli'], base: ['ambroxan', 'cedar'],
    perf: [8, 7, 7], seasons: ['spring', 'autumn'],
    desc: 'A metallic, minty-lavender freshness over clean ambroxan-patchouli — sleek, modern and very wearable.',
  },

  // ============================= AZZARO =============================
  {
    id: 'azzaro-wanted', name: 'Wanted', brand: 'Azzaro', house: 'Azzaro',
    type: 'original', year: 2016, gender: 'masculine', conc: 'edt',
    top: ['lemon', 'ginger', 'cardamom'], heart: ['vetiver', 'geranium'], base: ['tonka-bean', 'amber', 'cedar'],
    perf: [7, 7, 6], seasons: ['spring', 'autumn'],
    desc: 'A spicy, fizzy citrus over woody tonka — energetic and friendly, an easy daily signature.',
  },

  // ============================= VALENTINO =============================
  {
    id: 'born-in-roma-uomo', name: 'Uomo Born in Roma', brand: 'Valentino', house: 'Valentino',
    type: 'original', year: 2019, gender: 'masculine', conc: 'edt',
    top: ['bergamot', 'sage'], heart: ['vetiver', 'cashmeran'], base: ['musk', 'cedar'],
    perf: [7, 7, 6], seasons: ['spring', 'autumn'],
    desc: 'Mineral-salty woods and sage — a sleek, modern "skin scent with volume". Trendy and very likeable.',
  },

  // ============================= GIVENCHY =============================
  {
    id: 'gentleman-givenchy', name: 'Gentleman', brand: 'Givenchy', house: 'Givenchy',
    type: 'original', year: 2017, gender: 'masculine', conc: 'edp',
    top: ['pear', 'cardamom'], heart: ['iris', 'lavender'], base: ['leather', 'patchouli', 'vanilla'],
    perf: [8, 7, 7], seasons: ['autumn', 'winter'],
    desc: 'Juicy pear and powdery iris over a soft black-vanilla leather — dapper, smooth and grown-up.',
  },

  // ============================= XERJOFF =============================
  {
    id: 'naxos', name: 'Naxos', brand: 'Xerjoff', house: 'Xerjoff',
    type: 'original', year: 2015, gender: 'masculine', conc: 'edp',
    top: ['bergamot', 'lavender'], heart: ['honey', 'cinnamon'], base: ['tobacco', 'vanilla', 'tonka-bean'],
    perf: [9, 8, 8], seasons: ['autumn', 'winter'],
    desc: 'A luxurious honey-tobacco fougère — sweet, ambery and refined. Comfort scent with a designer-beating polish.',
  },

  // ============================= MONTBLANC =============================
  {
    id: 'mb-explorer', name: 'Explorer', brand: 'Montblanc', house: 'Montblanc',
    type: 'original', year: 2019, gender: 'masculine', conc: 'edp',
    top: ['bergamot', 'pink-pepper'], heart: ['vetiver', 'leather'], base: ['patchouli', 'ambroxan'],
    perf: [8, 8, 7], seasons: ['spring', 'autumn'],
    desc: 'An Aventus-adjacent crowd-pleaser — bright pepper-bergamot over smoky vetiver and clean ambroxan. Great value.',
  },

  // ============================= NISHANE =============================
  {
    id: 'hacivat', name: 'Hacivat', brand: 'Nishane', house: 'Nishane',
    type: 'original', year: 2017, gender: 'unisex', conc: 'extrait',
    top: ['pineapple', 'bergamot', 'grapefruit'], heart: ['cedar', 'jasmine', 'patchouli'], base: ['oakmoss', 'musk'],
    perf: [8, 8, 7], seasons: ['spring', 'autumn'],
    desc: 'A bright pineapple-and-oakmoss chypre — fresh, fruity and sophisticated. The niche darling of the genre.',
  },

  // =====================================================================
  // ============================= DUPES / INSPIRED ======================
  // =====================================================================
  {
    id: 'club-de-nuit-intense', name: 'Club de Nuit Intense Man', brand: 'Armaf', type: 'clone', year: 2015, gender: 'masculine', conc: 'edt',
    inspiredBy: 'aventus',
    top: ['pineapple', 'lemon', 'blackcurrant', 'apple'], heart: ['birch', 'jasmine', 'rose'], base: ['ambroxan', 'vetiver', 'oakmoss', 'vanilla'],
    perf: [9, 9, 9], seasons: ['spring', 'summer', 'autumn'],
    desc: 'The interpretation everyone cites: the same smoky-pineapple arc, louder and longer, with a brighter citrus opening.',
  },
  {
    id: 'al-haramain-laventure', name: "L'Aventure", brand: 'Al Haramain', type: 'clone', year: 2018, gender: 'masculine', conc: 'edp',
    inspiredBy: 'aventus',
    top: ['lemon', 'apple', 'bergamot', 'pineapple'], heart: ['rose', 'patchouli', 'oakmoss'], base: ['musk', 'vanilla', 'ambroxan'],
    perf: [8, 8, 8], seasons: ['spring', 'autumn'],
    desc: 'A smoother, more rounded take on the fruity-smoky icon — slightly sweeter and very easy to wear.',
  },
  {
    id: 'maison-rouge-540', name: 'Rouge 540 Extrait', brand: 'Maison Alhambra', type: 'clone', year: 2021, gender: 'unisex', conc: 'extrait',
    inspiredBy: 'baccarat-rouge-540',
    top: ['saffron', 'jasmine'], heart: ['ambroxan', 'amber', 'honey'], base: ['cedar', 'vanilla'],
    perf: [6, 7, 7], seasons: ['autumn', 'winter'],
    desc: 'A faithful read on the celestial amber, leaning a touch sweeter with a vanilla base. Closer to skin, shorter-lived.',
  },
  {
    id: 'armaf-untold', name: 'Club de Nuit Untold', brand: 'Armaf', type: 'clone', year: 2020, gender: 'unisex', conc: 'edp',
    inspiredBy: 'baccarat-rouge-540',
    top: ['saffron', 'jasmine', 'bergamot'], heart: ['ambroxan', 'amber'], base: ['cedar', 'musk'],
    perf: [7, 8, 8], seasons: ['autumn', 'winter'],
    desc: 'The luminous-amber effect captured impressively for the money — airy, sweet and surprisingly potent.',
  },
  {
    id: 'maison-savage', name: 'Savage', brand: 'Maison Alhambra', type: 'clone', year: 2020, gender: 'masculine', conc: 'edp',
    inspiredBy: 'sauvage',
    top: ['bergamot', 'pink-pepper', 'lemon'], heart: ['lavender', 'geranium'], base: ['ambroxan', 'cedar', 'vetiver'],
    perf: [6, 7, 6], seasons: ['spring', 'summer'],
    desc: 'The bergamot-and-ambroxan handshake, near for near — a lemony lift and vetiver edge keep it from being a carbon copy.',
  },
  {
    id: 'lattafa-asad', name: 'Asad', brand: 'Lattafa', type: 'clone', year: 2021, gender: 'masculine', conc: 'edp',
    inspiredBy: 'sauvage-elixir',
    top: ['grapefruit', 'cinnamon', 'pink-pepper'], heart: ['lavender', 'nutmeg'], base: ['ambroxan', 'amber', 'tonka-bean'],
    perf: [8, 8, 7], seasons: ['autumn', 'winter'],
    desc: 'A spicy, ambery riff in the Elixir direction — boozy-sweet and powerful. Astonishing value for the projection.',
  },
  {
    id: 'armaf-tres-nuit', name: 'Tres Nuit', brand: 'Armaf', type: 'clone', year: 2015, gender: 'masculine', conc: 'edt',
    inspiredBy: 'bleu-de-chanel',
    top: ['grapefruit', 'lemon', 'mint'], heart: ['ginger', 'jasmine'], base: ['cedar', 'vetiver', 'musk'],
    perf: [6, 6, 5], seasons: ['spring', 'autumn'],
    desc: 'A budget take on the citrus-woody office staple — fresh and inoffensive, if lighter and shorter than the original.',
  },
  {
    id: 'lattafa-fakhar-black', name: 'Fakhar Black', brand: 'Lattafa', type: 'clone', year: 2021, gender: 'masculine', conc: 'edp',
    inspiredBy: 'bleu-de-chanel',
    top: ['grapefruit', 'lemon', 'pink-pepper'], heart: ['ginger', 'nutmeg'], base: ['incense', 'vetiver', 'cedar', 'amber'],
    perf: [8, 7, 7], seasons: ['spring', 'autumn'],
    desc: 'A remarkably close, longer-lasting Bleu reading — the smoky-woody base is all there. A standout value.',
  },
  {
    id: 'lazuli-homme', name: 'Lazuli Pour Homme', brand: 'Armaf', type: 'clone', year: 2018, gender: 'masculine', conc: 'edp',
    inspiredBy: 'bleu-de-chanel',
    top: ['grapefruit', 'lemon', 'mint', 'pink-pepper'], heart: ['ginger', 'nutmeg'], base: ['incense', 'vetiver', 'cedar', 'ambroxan'],
    perf: [6, 6, 5], seasons: ['spring', 'autumn'],
    desc: 'The crisp citrus-mint top and smoky base, with ambroxan in place of sandalwood. A reliable budget office driver.',
  },
  {
    id: 'oud-mood', name: 'Oud Mood Elixir', brand: 'Lattafa', type: 'clone', year: 2019, gender: 'unisex', conc: 'edp',
    inspiredBy: 'oud-wood',
    top: ['cardamom', 'saffron'], heart: ['oud', 'sandalwood', 'rose'], base: ['vanilla', 'amber', 'tonka-bean'],
    perf: [9, 8, 8], seasons: ['autumn', 'winter'],
    desc: 'A richer, louder oud reading — the same agarwood-sandalwood core dressed with saffron and rose. Projects hard.',
  },
  {
    id: 'tobacco-honey', name: 'Honey Tobacco', brand: 'Lattafa', type: 'clone', year: 2021, gender: 'unisex', conc: 'edp',
    inspiredBy: 'tobacco-vanille',
    top: ['tobacco', 'cinnamon'], heart: ['vanilla', 'tonka-bean', 'honey'], base: ['cedar', 'praline', 'caramel'],
    perf: [7, 7, 7], seasons: ['autumn', 'winter'],
    desc: 'The honeyed-tobacco-vanilla heart almost intact, pushed sweeter with cinnamon and caramel. Incredible value.',
  },
  {
    id: 'lattafa-khamrah', name: 'Khamrah', brand: 'Lattafa', type: 'clone', year: 2022, gender: 'unisex', conc: 'edp',
    inspiredBy: 'tobacco-vanille',
    top: ['cinnamon', 'nutmeg'], heart: ['praline', 'tonka-bean', 'plum'], base: ['vanilla', 'tobacco', 'myrrh'],
    perf: [9, 8, 8], seasons: ['autumn', 'winter'],
    desc: 'A spiced-date gourmand in the warm-tobacco family — cinnamon, praline and vanilla. The viral cozy crowd-pleaser.',
  },
  {
    id: 'noir-orchid', name: 'Orchid Noir', brand: 'Maison Alhambra', type: 'clone', year: 2022, gender: 'unisex', conc: 'edp',
    inspiredBy: 'black-orchid',
    top: ['blackcurrant', 'bergamot', 'ylang-ylang'], heart: ['orchid', 'jasmine', 'patchouli'], base: ['vanilla', 'amber', 'sandalwood', 'caramel'],
    perf: [6, 6, 6], seasons: ['autumn', 'winter'],
    desc: 'The dark floral-and-vanilla mood captured closely, sweetened with caramel and shorn of the original’s smoky incense.',
  },
  {
    id: 'santalum-31', name: 'Santalum 31', brand: 'Maison Alhambra', type: 'clone', year: 2022, gender: 'unisex', conc: 'edp',
    inspiredBy: 'santal-33',
    top: ['cardamom', 'pink-pepper'], heart: ['iris', 'sandalwood', 'violet'], base: ['cedar', 'leather', 'vanilla'],
    perf: [6, 5, 5], seasons: ['spring', 'autumn'],
    desc: 'The creamy cedar-and-sandalwood silhouette, softened with vanilla and a pink-pepper sparkle. A gentler take.',
  },
  {
    id: 'lattafa-yara', name: 'Yara', brand: 'Lattafa', type: 'clone', year: 2020, gender: 'feminine', conc: 'edp',
    inspiredBy: 'delina',
    top: ['orchid', 'heliotrope'], heart: ['tuberose', 'lychee'], base: ['vanilla', 'musk', 'sandalwood'],
    perf: [9, 8, 8], seasons: ['spring', 'autumn'],
    desc: 'A creamy orchid-and-fruit sweet floral in the Delina mood — soft, milky and hugely popular. A teen-and-up favorite.',
  },
  {
    id: 'lattafa-maahir', name: 'Maahir', brand: 'Lattafa', type: 'clone', year: 2021, gender: 'unisex', conc: 'edp',
    inspiredBy: 'ombre-leather',
    top: ['saffron', 'bergamot'], heart: ['leather', 'rose', 'jasmine'], base: ['amber', 'patchouli', 'vetiver'],
    perf: [8, 7, 7], seasons: ['autumn', 'winter'],
    desc: 'A saffron-leather-rose in the suede-leather family — smooth, slightly sweet and dressed-up for the price.',
  },
  {
    id: 'club-de-nuit-sillage', name: 'Club de Nuit Sillage', brand: 'Armaf', type: 'clone', year: 2017, gender: 'unisex', conc: 'edp',
    inspiredBy: 'silver-mountain-water',
    top: ['bergamot', 'mandarin', 'lemon'], heart: ['green-notes', 'jasmine', 'blackcurrant'], base: ['musk', 'sandalwood', 'vetiver'],
    perf: [8, 8, 8], seasons: ['spring', 'summer'],
    desc: 'A glassy, tea-fresh citrus-musk in the alpine-water vein — clean, bright and a strong performer.',
  },
  {
    id: 'maison-jorginho', name: 'Jorginho', brand: 'Maison Alhambra', type: 'clone', year: 2021, gender: 'masculine', conc: 'edp',
    inspiredBy: 'le-male',
    top: ['mint', 'lavender', 'bergamot'], heart: ['cinnamon', 'orange-blossom'], base: ['vanilla', 'tonka-bean', 'sandalwood'],
    perf: [7, 7, 6], seasons: ['autumn', 'winter'],
    desc: 'The fresh-mint-over-sweet-vanilla shape of the sailor classic, captured cleanly at a fraction of the price.',
  },
  {
    id: 'lattafa-badee-sublime', name: "Bade'e Al Oud Sublime", brand: 'Lattafa', type: 'clone', year: 2022, gender: 'unisex', conc: 'edp',
    inspiredBy: 'oud-for-greatness',
    top: ['saffron', 'nutmeg', 'lavender'], heart: ['oud', 'patchouli'], base: ['musk', 'cedar', 'amber'],
    perf: [9, 9, 9], seasons: ['autumn', 'winter'],
    desc: 'The saffron-and-oud blast of the niche favorite, rendered loud and long for pocket change. A beast.',
  },
  {
    id: 'al-haramain-amber-oud-rouge', name: 'Amber Oud Rouge', brand: 'Al Haramain', type: 'clone', year: 2019, gender: 'unisex', conc: 'edp',
    inspiredBy: 'baccarat-rouge-540',
    top: ['saffron', 'jasmine', 'amber'], heart: ['ambroxan', 'amber'], base: ['cedar', 'musk', 'vanilla'],
    perf: [8, 8, 8], seasons: ['autumn', 'winter'],
    desc: 'Another well-loved luminous-amber interpretation — slightly sweeter and ambery, with strong reach.',
  },
  {
    id: 'maison-olympic', name: 'Olympic Man', brand: 'Maison Alhambra', type: 'clone', year: 2021, gender: 'masculine', conc: 'edp',
    inspiredBy: 'invictus',
    top: ['grapefruit', 'aquatic', 'mandarin'], heart: ['sage', 'jasmine'], base: ['ambergris', 'guaiac-wood', 'oakmoss'],
    perf: [7, 7, 6], seasons: ['spring', 'summer'],
    desc: 'The salty-fresh, grapefruit-and-ambergris gym favorite captured closely for the budget shelf.',
  },
  {
    id: 'lattafa-ana-abiyedh', name: 'Ana Abiyedh Rouge', brand: 'Lattafa', type: 'clone', year: 2019, gender: 'unisex', conc: 'edp',
    inspiredBy: 'dior-homme-intense',
    top: ['bergamot', 'lavender'], heart: ['iris', 'cardamom'], base: ['vetiver', 'cedar', 'leather'],
    perf: [7, 6, 6], seasons: ['autumn', 'winter'],
    desc: 'A powdery iris masculine in the Dior Homme mould — soft, lipstick-smooth and far cheaper.',
  },
  {
    id: 'armaf-ventana', name: 'Ventana', brand: 'Armaf', type: 'clone', year: 2019, gender: 'masculine', conc: 'edp',
    inspiredBy: 'eros',
    top: ['mint', 'apple', 'lemon'], heart: ['tonka-bean', 'geranium'], base: ['vanilla', 'vetiver', 'cedar'],
    perf: [7, 7, 7], seasons: ['autumn', 'winter'],
    desc: 'The minty-apple-over-sweet-vanilla shape of the club classic — loud and fun at a budget price.',
  },
  {
    id: 'lattafa-eternal-oud', name: 'Eternal Oud', brand: 'Lattafa', type: 'clone', year: 2020, gender: 'unisex', conc: 'edp',
    inspiredBy: 'oud-wood',
    top: ['cardamom', 'pink-pepper', 'bergamot'], heart: ['oud', 'sandalwood'], base: ['amber', 'vanilla', 'patchouli'],
    perf: [8, 7, 7], seasons: ['autumn', 'winter'],
    desc: 'A smooth, sweetish oud-and-sandalwood in the Oud Wood vein — approachable and easy on the wallet.',
  },

  // =====================================================================
  // ===================== EXPANSION (popular canon) =====================
  // Added from a vetted popularity shortlist; pyramids hand-authored.
  // =====================================================================
  {
    id: 'dior-homme', name: 'Dior Homme', brand: 'Dior', house: 'Parfums Christian Dior',
    type: 'original', year: 2020, gender: 'masculine', conc: 'edt',
    top: ['bergamot', 'pink-pepper'], heart: ['iris', 'cardamom', 'cedar'], base: ['vetiver', 'patchouli', 'leather'],
    perf: [7, 7, 6], seasons: ['spring', 'autumn'],
    desc: 'Powdery iris made clean and contemporary — orris and cardamom over a soft cedar-leather. Refined and very wearable.',
  },
  {
    id: 'noir-extreme', name: 'Noir Extreme', brand: 'Tom Ford', house: 'Tom Ford',
    type: 'original', year: 2015, gender: 'masculine', conc: 'edp',
    top: ['cardamom', 'saffron', 'nutmeg', 'mandarin'], heart: ['rose', 'orange-blossom'], base: ['amber', 'vanilla', 'sandalwood'],
    perf: [8, 8, 8], seasons: ['autumn', 'winter'],
    desc: 'A spiced amber-gourmand — cardamom and saffron over a creamy kulfi vanilla. Warm, plush and crowd-pleasing.',
  },
  {
    id: 'tuscan-leather', name: 'Tuscan Leather', brand: 'Tom Ford', house: 'Tom Ford Private Blend',
    type: 'original', year: 2007, gender: 'unisex', conc: 'edp',
    top: ['raspberry', 'saffron', 'thyme'], heart: ['leather', 'jasmine'], base: ['suede', 'amber', 'cedar'],
    perf: [8, 8, 7], seasons: ['autumn', 'winter'],
    desc: 'Raspberry-tinged raw hide — a bold, suede-and-saffron leather with a fruity sheen. Pure Tom Ford swagger.',
  },
  {
    id: 'neroli-portofino', name: 'Neroli Portofino', brand: 'Tom Ford', house: 'Tom Ford Private Blend',
    type: 'original', year: 2011, gender: 'unisex', conc: 'edp',
    top: ['bergamot', 'mandarin', 'lemon', 'lavender'], heart: ['neroli', 'orange-blossom', 'rosemary'], base: ['amber', 'musk'],
    perf: [6, 6, 6], seasons: ['spring', 'summer'],
    desc: 'A sparkling citrus-neroli — bright, soapy and impeccably clean. Mediterranean summer in a bottle.',
  },
  {
    id: 'ysl-lhomme', name: "L'Homme", brand: 'Yves Saint Laurent', house: 'YSL',
    type: 'original', year: 2006, gender: 'masculine', conc: 'edt',
    top: ['ginger', 'bergamot', 'lemon'], heart: ['violet', 'basil', 'black-pepper'], base: ['cedar', 'tonka-bean', 'vetiver'],
    perf: [6, 6, 5], seasons: ['spring', 'autumn'],
    desc: 'Crisp ginger and violet over soft cedar-tonka — polished, gentle and office-friendly. A modern staple.',
  },
  {
    id: 'kouros', name: 'Kouros', brand: 'Yves Saint Laurent', house: 'YSL',
    type: 'original', year: 1981, gender: 'masculine', conc: 'edt',
    top: ['bergamot', 'coriander', 'clove'], heart: ['cinnamon', 'geranium', 'honey'], base: ['leather', 'patchouli', 'musk'],
    perf: [9, 9, 9], seasons: ['autumn', 'winter'],
    desc: 'The clean-yet-animalic powerhouse — honeyed spice over a soapy musk-leather. Divisive, iconic, unforgettable.',
  },
  {
    id: 'creed-viking', name: 'Viking', brand: 'Creed', house: 'House of Creed',
    type: 'original', year: 2017, gender: 'masculine', conc: 'edp',
    top: ['bergamot', 'lemon', 'pink-pepper'], heart: ['lavender', 'rose', 'mint'], base: ['vetiver', 'sandalwood', 'patchouli'],
    perf: [7, 7, 6], seasons: ['spring', 'autumn'],
    desc: 'A peppery, minty rose over smoky vetiver — fresh and assertive. The brash modern Creed.',
  },
  {
    id: 'millesime-imperial', name: 'Millésime Impérial', brand: 'Creed', house: 'House of Creed',
    type: 'original', year: 1995, gender: 'unisex', conc: 'edp',
    top: ['lemon', 'bergamot', 'sea-salt'], heart: ['iris', 'ylang-ylang'], base: ['sandalwood', 'musk'],
    perf: [6, 6, 6], seasons: ['spring', 'summer'],
    desc: 'Salted-melon freshness over creamy iris and sandalwood — elegant, marine and effortlessly expensive-smelling.',
  },
  {
    id: 'guerlain-lhomme-ideal', name: "L'Homme Idéal", brand: 'Guerlain', house: 'Guerlain',
    type: 'original', year: 2014, gender: 'masculine', conc: 'edp',
    top: ['almond', 'bergamot', 'lemon'], heart: ['rosemary', 'cedar'], base: ['tonka-bean', 'leather', 'vanilla'],
    perf: [7, 7, 6], seasons: ['autumn', 'spring'],
    desc: 'Marzipan-almond over a soft leather-tonka — nutty, gourmand and dapper. Comfort with a tailored edge.',
  },
  {
    id: 'habit-rouge', name: 'Habit Rouge', brand: 'Guerlain', house: 'Guerlain',
    type: 'original', year: 1965, gender: 'masculine', conc: 'edt',
    top: ['bergamot', 'lemon', 'orange'], heart: ['rose', 'cinnamon', 'patchouli'], base: ['leather', 'vanilla', 'benzoin'],
    perf: [8, 7, 7], seasons: ['autumn', 'winter'],
    desc: 'An equestrian classic — bright citrus into a powdery rose-leather laced with vanilla. Aristocratic and timeless.',
  },
  {
    id: 'cedrat-boise', name: 'Cedrat Boisé', brand: 'Mancera', house: 'Mancera',
    type: 'original', year: 2011, gender: 'unisex', conc: 'edp',
    top: ['lemon', 'bergamot', 'blackcurrant'], heart: ['cardamom', 'patchouli'], base: ['cedar', 'amber', 'musk', 'vanilla'],
    perf: [9, 8, 8], seasons: ['spring', 'autumn'],
    desc: 'Zesty citron over a sweet amber-woods base — fresh up top, beastly in the dry-down. Huge value performer.',
  },
  {
    id: 'intense-cafe', name: 'Intense Café', brand: 'Montale', house: 'Montale',
    type: 'original', year: 2013, gender: 'unisex', conc: 'edp',
    top: ['rose', 'bergamot'], heart: ['coffee', 'rose'], base: ['vanilla', 'amber', 'musk'],
    perf: [9, 8, 8], seasons: ['autumn', 'winter'],
    desc: 'Sweet espresso and Turkish rose over warm vanilla-amber — a rich, addictive coffee-rose gourmand.',
  },
  {
    id: 'angels-share', name: "Angels' Share", brand: 'By Kilian', house: 'By Kilian',
    type: 'original', year: 2020, gender: 'unisex', conc: 'edp',
    top: ['rum', 'cinnamon'], heart: ['tonka-bean', 'praline', 'cedar'], base: ['vanilla', 'sandalwood'],
    perf: [8, 7, 7], seasons: ['autumn', 'winter'],
    desc: 'Cognac, oak and praline — a boozy, toasty gourmand that smells like dessert by a fireplace. Deservedly viral.',
  },
  {
    id: 'gypsy-water', name: 'Gypsy Water', brand: 'Byredo', house: 'Byredo',
    type: 'original', year: 2008, gender: 'unisex', conc: 'edp',
    top: ['bergamot', 'lemon', 'black-pepper', 'juniper'], heart: ['incense', 'pine', 'iris'], base: ['sandalwood', 'amber', 'vanilla'],
    perf: [6, 5, 5], seasons: ['spring', 'autumn'],
    desc: 'A campfire-and-pine freshness softened by vanilla and sandalwood — the bohemian, hipster-woody signature.',
  },
  {
    id: 'azzaro-chrome', name: 'Chrome', brand: 'Azzaro', house: 'Azzaro',
    type: 'original', year: 1996, gender: 'masculine', conc: 'edt',
    top: ['lemon', 'bergamot', 'pineapple', 'rosemary'], heart: ['jasmine', 'oakmoss', 'cardamom'], base: ['musk', 'sandalwood', 'cedar'],
    perf: [6, 6, 5], seasons: ['spring', 'summer'],
    desc: 'Soapy citrus-musk freshness — clean, summery and friendly. The classic shower-fresh masculine.',
  },
  {
    id: 'montblanc-legend', name: 'Legend', brand: 'Montblanc', house: 'Montblanc',
    type: 'original', year: 2011, gender: 'masculine', conc: 'edt',
    top: ['bergamot', 'lavender', 'pineapple'], heart: ['geranium', 'rose', 'apple'], base: ['tonka-bean', 'oakmoss', 'sandalwood'],
    perf: [7, 7, 6], seasons: ['spring', 'autumn'],
    desc: 'A crisp fougère with a fruity wink — lavender and apple over tonka and moss. An easy daily compliment-getter.',
  },
  {
    id: 'ch-212-vip-men', name: '212 VIP Men', brand: 'Carolina Herrera', house: 'Carolina Herrera',
    type: 'original', year: 2011, gender: 'masculine', conc: 'edt',
    top: ['lime', 'ginger'], heart: ['black-pepper', 'amber'], base: ['leather', 'vanilla'],
    perf: [7, 7, 6], seasons: ['autumn', 'winter'],
    desc: 'Vodka-and-lime party energy over warm amber-leather — sweetish, clubby and unmistakably nightlife.',
  },
  {
    id: 'versace-pour-homme', name: 'Versace pour Homme', brand: 'Versace', house: 'Versace',
    type: 'original', year: 2008, gender: 'masculine', conc: 'edt',
    top: ['lemon', 'bergamot', 'neroli'], heart: ['geranium', 'lily-of-the-valley'], base: ['cedar', 'musk', 'amber'],
    perf: [6, 6, 5], seasons: ['spring', 'summer'],
    desc: 'A clean Mediterranean fresh — citrus and neroli over soft cedar-musk. Inoffensive, versatile, always appropriate.',
  },
  {
    id: 'a-men', name: 'A*Men', brand: 'Mugler', house: 'Mugler',
    type: 'original', year: 1996, gender: 'masculine', conc: 'edt',
    top: ['lavender', 'mint', 'bergamot'], heart: ['coffee', 'caramel', 'patchouli'], base: ['chocolate', 'vanilla', 'tonka-bean'],
    perf: [9, 8, 8], seasons: ['autumn', 'winter'],
    desc: 'The original gourmand powerhouse for men — coffee, caramel and chocolate over tar-like patchouli. Enormous and divisive.',
  },
  {
    id: 'prada-lhomme', name: "L'Homme Prada", brand: 'Prada', house: 'Prada',
    type: 'original', year: 2016, gender: 'masculine', conc: 'edt',
    top: ['neroli', 'black-pepper', 'cardamom'], heart: ['iris', 'geranium'], base: ['amber', 'cedar', 'patchouli'],
    perf: [7, 6, 6], seasons: ['spring', 'autumn'],
    desc: 'Powdery iris-and-neroli over soft amber-woods — soapy, refined and quietly elegant. A clean-cut gentleman.',
  },
  {
    id: 'spicebomb-extreme', name: 'Spicebomb Extreme', brand: 'Viktor & Rolf', house: 'Viktor & Rolf',
    type: 'original', year: 2015, gender: 'masculine', conc: 'edp',
    top: ['black-pepper', 'cinnamon'], heart: ['tobacco', 'cardamom'], base: ['vanilla', 'tonka-bean', 'vetiver'],
    perf: [9, 8, 8], seasons: ['autumn', 'winter'],
    desc: 'The grenade reloaded — spicy tobacco and cinnamon over a thick vanilla-tonka. Sweeter, darker and longer than the original.',
  },
  {
    id: 'bvlgari-man-in-black', name: 'Man in Black', brand: 'Bvlgari', house: 'Bvlgari',
    type: 'original', year: 2014, gender: 'masculine', conc: 'edp',
    top: ['rum', 'cinnamon'], heart: ['leather', 'tuberose', 'iris'], base: ['tonka-bean', 'benzoin', 'amber'],
    perf: [8, 7, 7], seasons: ['autumn', 'winter'],
    desc: 'Boozy spiced rum over a soft leather-and-tuberose — sweet, ambery and grown-up. A cozy evening signature.',
  },

  {
    id: 'cool-water', name: 'Cool Water', brand: 'Davidoff', house: 'Zino Davidoff', perfumer: 'Pierre Bourdon',
    type: 'original', year: 1988, gender: 'masculine', conc: 'edt',
    top: ['green-notes', 'lavender', 'mint', 'rosemary', 'coriander'],
    heart: ['geranium', 'neroli', 'sandalwood', 'jasmine'],
    base: ['cedar', 'oakmoss', 'musk', 'amber', 'tobacco'],
    perf: [6, 6, 6], seasons: ['spring', 'summer'],
    desc: 'The aquatic-fougère archetype — icy lavender-mint over oakmoss, musk and a whisper of tobacco. 1988, and still the smell of cold sea air.',
  },

  // ---- expansion dupes ----
  {
    id: 'afnan-9pm', name: '9PM', brand: 'Afnan', type: 'clone', year: 2020, gender: 'masculine', conc: 'edp',
    inspiredBy: 'stronger-with-you',
    top: ['apple', 'cinnamon'], heart: ['lavender', 'vanilla'], base: ['amber', 'tonka-bean', 'patchouli'],
    perf: [8, 8, 8], seasons: ['autumn', 'winter'],
    desc: 'A sweet apple-cinnamon-vanilla in the Stronger With You family — cozy, ambery and a viral budget favorite.',
  },
  {
    id: 'afnan-supremacy-not-only', name: 'Supremacy Not Only Intense', brand: 'Afnan', type: 'clone', year: 2019, gender: 'masculine', conc: 'edp',
    inspiredBy: 'aventus',
    top: ['pineapple', 'bergamot', 'blackcurrant', 'apple'], heart: ['birch', 'patchouli', 'jasmine'], base: ['oakmoss', 'musk', 'vanilla'],
    perf: [8, 8, 8], seasons: ['spring', 'autumn'],
    desc: 'Another well-regarded smoky-pineapple interpretation of the fruity-chypre icon — fresh, bold and inexpensive.',
  },
  {
    id: 'amber-oud-carbon', name: 'Amber Oud Carbon Edition', brand: 'Al Haramain', type: 'clone', year: 2019, gender: 'masculine', conc: 'edp',
    inspiredBy: 'bleu-de-chanel',
    top: ['grapefruit', 'lemon', 'mint'], heart: ['ginger', 'nutmeg', 'pink-pepper'], base: ['vetiver', 'cedar', 'ambroxan'],
    perf: [8, 7, 7], seasons: ['spring', 'autumn'],
    desc: 'A fresh citrus-and-woods reading in the Bleu de Chanel vein — clean, versatile and a strong-value daily option.',
  },
];
