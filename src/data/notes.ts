// ============================================================
// SILLAGE — Notes dictionary
// Every note keyed by id. Color resolves from its accord family
// (consistent with the §2 tokens, deepened for the ivory theme).
// `wheel: true` surfaces a note on the curated Fragrance Wheel;
// every note is still available in the List view and matching.
// ============================================================

import type { AccordFamily, FragranceNote } from '../domain/types.ts';

/** Accord family -> accent. Deepened so colors read on warm ivory. */
export const FAMILY_COLOR: Record<AccordFamily, string> = {
  citrus: '#C9A53C',
  fresh: '#5E9E86',
  floral: '#C77E92',
  woody: '#9A6B45',
  spicy: '#C2542A',
  sweet: '#C98A3D',
  aromatic: '#6B9156',
  amber: '#B5803F',
  leather: '#7A4A3A',
};

export const FAMILY_LABEL: Record<AccordFamily, string> = {
  citrus: 'Citrus',
  fresh: 'Fresh',
  floral: 'Floral',
  aromatic: 'Aromatic',
  spicy: 'Spicy',
  sweet: 'Sweet',
  woody: 'Woody',
  amber: 'Amber',
  leather: 'Leather',
};

export const FAMILY_ORDER: AccordFamily[] = [
  'citrus',
  'fresh',
  'aromatic',
  'floral',
  'spicy',
  'sweet',
  'amber',
  'woody',
  'leather',
];

function n(
  id: string,
  name: string,
  family: AccordFamily,
  wheel = false,
  description?: string,
  synonyms?: string[],
): FragranceNote {
  return { id, name, family, color: FAMILY_COLOR[family], wheel, description, synonyms };
}

export const NOTES_LIST: FragranceNote[] = [
  // ---------------- citrus ----------------
  n('bergamot', 'Bergamot', 'citrus', true, 'Bright, lifted, faintly bitter — the classic opening.', ['bergamotto']),
  n('lemon', 'Lemon', 'citrus', true, 'Sharp and effervescent.'),
  n('grapefruit', 'Grapefruit', 'citrus', true, 'Tart pink zest with a bitter edge.', ['pamplemousse']),
  n('mandarin', 'Mandarin', 'citrus', true, 'Sweet, juicy, sunlit.', ['tangerine']),
  n('orange', 'Orange', 'citrus', false, 'Round, sweet citrus.'),
  n('blood-orange', 'Blood Orange', 'citrus', false, 'Deep, almost red citrus.'),
  n('lime', 'Lime', 'citrus', false, 'Green, zingy citrus.'),
  n('petitgrain', 'Petitgrain', 'citrus', false, 'Bitter green twig of the orange tree.'),
  n('yuzu', 'Yuzu', 'citrus', false, 'Aromatic Japanese citrus.'),
  n('bitter-orange', 'Bitter Orange', 'citrus', false, 'Sharp, peel-like citrus.'),

  // ---------------- fresh / fruity / aquatic ----------------
  n('aquatic', 'Sea Notes', 'fresh', true, 'Ozonic, salt-spray freshness.', ['marine', 'calone', 'aquatic']),
  n('apple', 'Green Apple', 'fresh', true, 'Crisp and watery.'),
  n('blackcurrant', 'Blackcurrant', 'fresh', true, 'Tart, slightly catty berry.', ['cassis']),
  n('pear', 'Pear', 'fresh', true, 'Dewy and soft.'),
  n('peach', 'Peach', 'fresh', true, 'Velvety stone fruit.'),
  n('plum', 'Plum', 'fresh', false, 'Jammy dark fruit.'),
  n('pineapple', 'Pineapple', 'fresh', true, 'Candied tropical fruit.', ['ananas']),
  n('melon', 'Melon', 'fresh', false, 'Cool and watery.'),
  n('coconut', 'Coconut', 'fresh', true, 'Creamy tropical milk.'),
  n('fig', 'Fig', 'fresh', true, 'Green, milky, sun-warm fruit.'),
  n('raspberry', 'Raspberry', 'fresh', false, 'Bright tart berry.'),
  n('lychee', 'Lychee', 'fresh', false, 'Rosy, juicy fruit.'),
  n('watermelon', 'Watermelon', 'fresh', false, 'Clean, watery sweetness.'),
  n('strawberry', 'Strawberry', 'fresh', false, 'Soft red berry.'),
  n('red-berries', 'Red Berries', 'fresh', false, 'A jammy berry medley.'),
  n('mango', 'Mango', 'fresh', false, 'Lush tropical fruit.'),
  n('sea-salt', 'Sea Salt', 'fresh', false, 'Saline, skin-like minerality.'),
  n('green-notes', 'Green Notes', 'fresh', true, 'Crushed leaf and stem.', ['galbanum']),
  n('aldehydes', 'Aldehydes', 'fresh', true, 'Champagne-fizz sparkle — soapy, radiant, abstract.', ['aldehyde', 'aldehydic notes']),

  // ---------------- aromatic / herbal ----------------
  n('lavender', 'Lavender', 'aromatic', true, 'Clean, barbershop herb.'),
  n('mint', 'Mint', 'aromatic', true, 'Cooling and green.'),
  n('sage', 'Sage', 'aromatic', true, 'Dry, silvery, savory.', ['clary sage']),
  n('rosemary', 'Rosemary', 'aromatic', false, 'Resinous Mediterranean herb.'),
  n('basil', 'Basil', 'aromatic', false, 'Peppery green herb.'),
  n('thyme', 'Thyme', 'aromatic', false, 'Warm, dry herb.'),
  n('artemisia', 'Artemisia', 'aromatic', false, 'Bitter, silvery wormwood.'),
  n('geranium', 'Geranium', 'aromatic', true, 'Rosy-green and metallic.'),

  // ---------------- floral ----------------
  n('rose', 'Rose', 'floral', true, 'The queen — jammy or dewy by treatment.'),
  n('jasmine', 'Jasmine', 'floral', true, 'Indolic, narcotic white floral.'),
  n('orange-blossom', 'Orange Blossom', 'floral', true, 'Honeyed, sunlit white floral.', ['neroli']),
  n('neroli', 'Neroli', 'floral', true, 'Bittersweet orange-flower distillate.'),
  n('ylang-ylang', 'Ylang-Ylang', 'floral', false, 'Creamy, banana-tinged bloom.'),
  n('iris', 'Iris', 'floral', true, 'Powdery, cool, suede-like.', ['orris']),
  n('violet', 'Violet', 'floral', true, 'Powder and green leaf.'),
  n('lily', 'Lily', 'floral', false, 'Heady, dewy white floral.'),
  n('lily-of-the-valley', 'Lily of the Valley', 'floral', true, 'Dewy, green-white floral.', ['muguet']),
  n('tuberose', 'Tuberose', 'floral', true, 'Opulent, creamy, narcotic.'),
  n('gardenia', 'Gardenia', 'floral', false, 'Lush, buttery white floral.'),
  n('peony', 'Peony', 'floral', true, 'Fresh, dewy pink petals.'),
  n('magnolia', 'Magnolia', 'floral', false, 'Lemony, soft bloom.'),
  n('freesia', 'Freesia', 'floral', false, 'Light, peppery floral.'),
  n('osmanthus', 'Osmanthus', 'floral', false, 'Apricot-leather floral.'),
  n('heliotrope', 'Heliotrope', 'floral', false, 'Almond-powder bloom.'),
  n('mimosa', 'Mimosa', 'floral', false, 'Powdery, honeyed yellow floral.'),
  n('orchid', 'Orchid', 'floral', true, 'Dark, opulent abstract bloom.'),

  // ---------------- spicy ----------------
  n('pink-pepper', 'Pink Pepper', 'spicy', true, 'Sparkling, rosy heat.', ['baies roses']),
  n('black-pepper', 'Black Pepper', 'spicy', true, 'Dry, biting spice.'),
  n('cardamom', 'Cardamom', 'spicy', true, 'Cool, aromatic, green-spicy.'),
  n('cinnamon', 'Cinnamon', 'spicy', true, 'Warm, sweet bark.'),
  n('saffron', 'Saffron', 'spicy', true, 'Leathery, suede-soft spice.'),
  n('nutmeg', 'Nutmeg', 'spicy', false, 'Warm and slightly narcotic.'),
  n('ginger', 'Ginger', 'spicy', true, 'Zesty, fizzy root.'),
  n('clove', 'Clove', 'spicy', false, 'Dark, numbing, dental-warm.'),
  n('star-anise', 'Star Anise', 'spicy', false, 'Sweet liquorice spice.'),
  n('coriander', 'Coriander', 'spicy', false, 'Soft, aldehydic spice.'),
  n('pimento', 'Pimento', 'spicy', false, 'Allspice warmth.'),
  n('juniper', 'Juniper Berry', 'spicy', false, 'Gin-like, resinous berry.'),

  // ---------------- sweet / gourmand ----------------
  n('vanilla', 'Vanilla', 'sweet', true, 'Warm, creamy, comforting.'),
  n('tonka-bean', 'Tonka Bean', 'sweet', true, 'Almond-hay, sweet-coumarin.', ['tonka']),
  n('caramel', 'Caramel', 'sweet', true, 'Burnt sugar warmth.'),
  n('honey', 'Honey', 'sweet', true, 'Golden, animalic sweetness.'),
  n('praline', 'Praline', 'sweet', false, 'Toasted-nut confection.'),
  n('chocolate', 'Chocolate', 'sweet', true, 'Dark cocoa richness.', ['cacao']),
  n('coffee', 'Coffee', 'sweet', true, 'Roasted, bitter-sweet beans.'),
  n('almond', 'Almond', 'sweet', true, 'Marzipan, cherry-pit nuttiness.'),
  n('milk', 'Milk', 'sweet', false, 'Soft, lactonic creaminess.'),
  n('cotton-candy', 'Cotton Candy', 'sweet', false, 'Spun-sugar sweetness.', ['ethyl maltol']),
  n('toffee', 'Toffee', 'sweet', false, 'Buttery burnt sugar.'),
  n('marshmallow', 'Marshmallow', 'sweet', false, 'Pillowy vanilla sugar.'),
  n('sugar', 'Sugar', 'sweet', false, 'Plain sweetness.'),
  n('rum', 'Rum', 'sweet', false, 'Boozy, spiced sugarcane warmth.', ['cognac']),

  // ---------------- amber / resin / musk ----------------
  n('amber', 'Amber', 'amber', true, 'Golden, resinous, glowing.'),
  n('ambroxan', 'Ambroxan', 'amber', true, 'Salty-woody amber, radiant and modern.', ['ambrox', 'amberwood', 'ambroxide']),
  n('labdanum', 'Labdanum', 'amber', false, 'Dark, leathery resin.'),
  n('benzoin', 'Benzoin', 'amber', false, 'Vanillic balsamic resin.'),
  n('incense', 'Incense', 'amber', true, 'Smoky, churchy frankincense.', ['olibanum']),
  n('myrrh', 'Myrrh', 'amber', false, 'Bittersweet medicinal resin.'),
  n('opoponax', 'Opoponax', 'amber', false, 'Sweet myrrh, balsamic.'),
  n('tolu-balsam', 'Tolu Balsam', 'amber', false, 'Cinnamon-vanilla resin.'),
  n('ambergris', 'Ambergris', 'amber', false, 'Salty, animalic warmth.'),
  n('musk', 'Musk', 'amber', true, 'Soft, skin-like, clean warmth.', ['white musk']),

  // ---------------- woody ----------------
  n('cedar', 'Cedar', 'woody', true, 'Dry, pencil-shaving wood.', ['cedarwood']),
  n('sandalwood', 'Sandalwood', 'woody', true, 'Creamy, milky, soft wood.', ['santal']),
  n('vetiver', 'Vetiver', 'woody', true, 'Earthy, smoky, rooty grass.'),
  n('oud', 'Oud', 'woody', true, 'Resinous, animalic agarwood.', ['agarwood', 'oudh']),
  n('patchouli', 'Patchouli', 'woody', true, 'Damp earth and dark chocolate.'),
  n('birch', 'Birch', 'woody', false, 'Smoky, tar-leather wood.'),
  n('oakmoss', 'Oakmoss', 'woody', true, 'Green, inky forest floor — the chypre soul.', ['mousse de chêne']),
  n('guaiac-wood', 'Guaiac Wood', 'woody', false, 'Smoky, rosy, tarry wood.'),
  n('papyrus', 'Papyrus', 'woody', false, 'Dry, smoky reed.'),
  n('cashmeran', 'Cashmeran', 'woody', false, 'Musky, velvety woods.', ['cashmere wood']),
  n('hinoki', 'Hinoki', 'woody', false, 'Clean Japanese cypress.'),
  n('teakwood', 'Teakwood', 'woody', false, 'Warm, dry hardwood.'),
  n('pine', 'Pine', 'woody', false, 'Resinous, green conifer.'),

  // ---------------- leather / tobacco ----------------
  n('leather', 'Leather', 'leather', true, 'Smoky hide, suede to tar.'),
  n('suede', 'Suede', 'leather', false, 'Soft, powdery leather.'),
  n('tobacco', 'Tobacco', 'leather', true, 'Cured leaf — honeyed and dry.'),
  n('styrax', 'Styrax', 'leather', false, 'Smoky, resinous leather.'),
];

export const NOTES: Record<string, FragranceNote> = Object.fromEntries(
  NOTES_LIST.map((note) => [note.id, note]),
);

export const WHEEL_NOTES: FragranceNote[] = NOTES_LIST.filter((note) => note.wheel);
