import { clampNumber, roundTo } from '@/lib/makers/format';

export type CupStandard = 'us' | 'uk' | 'au';

export const CUP_ML: Record<CupStandard, number> = {
  us: 240,
  uk: 284,
  au: 250,
};

export interface Ingredient {
  slug: string;
  name: string;
  gramsPerUsCup: number;
  note: string;
}

export const INGREDIENTS: Ingredient[] = [
  { slug: 'flour', name: 'All-purpose flour', gramsPerUsCup: 120, note: 'Spooned and levelled, not scooped.' },
  { slug: 'bread-flour', name: 'Bread flour', gramsPerUsCup: 127, note: 'Higher protein, slightly heavier cup.' },
  { slug: 'cake-flour', name: 'Cake flour', gramsPerUsCup: 114, note: 'Sifted cake flour is lighter than this packed figure.' },
  { slug: 'butter', name: 'Butter', gramsPerUsCup: 227, note: 'One US cup is two sticks / 8 oz.' },
  { slug: 'sugar', name: 'Granulated sugar', gramsPerUsCup: 200, note: 'White caster sugar is close to this density.' },
  { slug: 'brown-sugar', name: 'Brown sugar (packed)', gramsPerUsCup: 220, note: 'Packed firmly in the cup.' },
  { slug: 'powdered-sugar', name: 'Powdered sugar', gramsPerUsCup: 120, note: 'Unsifted confectioners’ sugar.' },
  { slug: 'rice', name: 'Uncooked white rice', gramsPerUsCup: 185, note: 'Long-grain uncooked. Cooked rice is much heavier per cup.' },
  { slug: 'cocoa', name: 'Unsweetened cocoa', gramsPerUsCup: 85, note: 'Natural or Dutch-process, spooned.' },
  { slug: 'oats', name: 'Rolled oats', gramsPerUsCup: 90, note: 'Old-fashioned rolled oats, not steel-cut.' },
  { slug: 'honey', name: 'Honey', gramsPerUsCup: 340, note: 'Volume of a sticky liquid, not a dry cup.' },
  { slug: 'milk', name: 'Milk', gramsPerUsCup: 245, note: 'Whole milk at fridge temperature.' },
  { slug: 'water', name: 'Water', gramsPerUsCup: 240, note: 'US legal cup of 240 ml.' },
  { slug: 'olive-oil', name: 'Olive oil', gramsPerUsCup: 216, note: 'Typical extra-virgin density.' },
];

export function ingredientBySlug(slug: string): Ingredient {
  return INGREDIENTS.find((item) => item.slug === slug) ?? INGREDIENTS[0];
}

export function convertIngredient(options: {
  ingredient: Ingredient;
  cups?: number;
  grams?: number;
  cup: CupStandard;
}) {
  const mlPerCup = CUP_ML[options.cup];
  const gramsPerCup = options.ingredient.gramsPerUsCup * (mlPerCup / CUP_ML.us);
  if (options.grams != null) {
    const grams = clampNumber(options.grams, 0, 20000);
    return {
      grams: roundTo(grams, 1),
      cups: roundTo(grams / gramsPerCup, 3),
      ml: roundTo((grams / gramsPerCup) * mlPerCup, 1),
      gramsPerCup: roundTo(gramsPerCup, 1),
    };
  }
  const cups = clampNumber(options.cups ?? 0, 0, 50);
  return {
    grams: roundTo(cups * gramsPerCup, 1),
    cups: roundTo(cups, 3),
    ml: roundTo(cups * mlPerCup, 1),
    gramsPerCup: roundTo(gramsPerCup, 1),
  };
}
