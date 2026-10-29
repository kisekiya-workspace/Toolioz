'use client';

import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ToolPageShell } from '@/components/tools/ToolPageShell';
import { ResultCard } from '@/components/tools/ResultCard';
import { convertIngredient, CUP_ML, INGREDIENTS, ingredientBySlug, type CupStandard } from '@/lib/makers/ingredients';
import { fmtNum } from '@/lib/makers/format';
import { calculatorPageStyles as styles } from '@/app/finance/compound-interest/page.styles';
import Link from 'next/link';

const LINKS: Record<string, string> = {
  butter: '/kitchen/butter-grams-to-cups',
  flour: '/kitchen/cups-to-grams-flour',
  sugar: '/kitchen/cups-to-grams-sugar',
  rice: '/kitchen/cups-to-grams-rice',
};

export default function CupsGramsClient({ slug }: { slug?: string }) {
  const locked = slug ? ingredientBySlug(slug) : null;
  const [ingredientSlug, setIngredientSlug] = useState(locked?.slug ?? 'flour');
  const ingredient = locked ?? ingredientBySlug(ingredientSlug);
  const [cup, setCup] = useState<CupStandard>('us');
  const [cups, setCups] = useState(1);
  const [grams, setGrams] = useState(ingredient.gramsPerUsCup);
  const fromCups = useMemo(() => convertIngredient({ ingredient, cups, cup }), [ingredient, cups, cup]);
  const fromGrams = useMemo(() => convertIngredient({ ingredient, grams, cup }), [ingredient, grams, cup]);
  const title = locked
    ? `${locked.name} Cups to Grams`
    : 'Cups to Grams Converter';

  return (
    <ToolPageShell
      title={title}
      subtitle={`${ingredient.name} is ${ingredient.gramsPerUsCup} g per US cup (${ingredient.note}). A ${cup.toUpperCase()} cup is ${CUP_ML[cup]} ml, so grams scale with cup size. UK and Australian cups are larger than the US legal cup of 240 ml.`}
      directAnswerTitle={`How many grams are in a cup of ${ingredient.name.toLowerCase()}?`}
      directAnswer={`One US cup of ${ingredient.name.toLowerCase()} is ${ingredient.gramsPerUsCup} g. A UK cup (${CUP_ML.uk} ml) is ${fmtNum(ingredient.gramsPerUsCup * (CUP_ML.uk / 240), 0)} g. ${ingredient.note}`}
      takeaways={[
        'Spoon-and-level flour is 120 g per US cup, not 150 g scooped.',
        'Butter is 227 g per US cup (two sticks).',
        'Rice figures are for uncooked grain.',
        'Weighing beats cups for bread dough.',
      ]}
      categoryName="Kitchen"
      seoTitle={`${ingredient.name} cups to grams`}
      seoDescription={`${ingredient.name} uses ${ingredient.gramsPerUsCup} grams per US 240 ml cup. UK 284 ml and Australian 250 ml cups scale that density. ${ingredient.note}`}
      howToUse={[
        'Pick the ingredient and cup standard.',
        'Enter cups to read grams, or grams to read cups.',
        'Open the dedicated flour, butter, sugar, or rice page for a keyword landing.',
      ]}
      benefits={[
        'US, UK, and Australian cups are explicit millilitre standards.',
        'Each ingredient page keeps a unique density, not a generic 240 g cup.',
        'Related pan scaling lives next door.',
      ]}
      formula="grams = cups × gramsPerUSCup × (cupMl / 240)"
      faqs={[
        {
          question: `How many grams is 1 cup of ${ingredient.name.toLowerCase()}?`,
          answer: `${ingredient.gramsPerUsCup} g per US cup. ${ingredient.note}`,
        },
        {
          question: 'Is an Australian cup 250 ml?',
          answer: 'Yes. This page uses 250 ml for AU, 240 ml for US, and 284 ml for UK.',
        },
      ]}
      currentToolId="cups-to-grams"
      relatedIds={['baking-pan', 'sourdough-hydration', 'cake-servings', 'coffee-ratio']}
      breadcrumbs={[
        { name: 'Home', url: '/' },
        { name: 'Kitchen calculators', url: '/kitchen' },
        { name: title, url: LINKS[ingredient.slug] ?? '/kitchen/cups-to-grams' },
      ]}
    >
      <div className={styles.grid}>
        <Card className={styles.inputCard}>
          <div className={styles.inputGroup}>
            {!locked && (
              <select className={styles.select} value={ingredientSlug} onChange={(e) => setIngredientSlug(e.target.value)}>
                {INGREDIENTS.map((row) => (
                  <option key={row.slug} value={row.slug}>{row.name}</option>
                ))}
              </select>
            )}
            <div className="flex gap-2">
              {(['us', 'uk', 'au'] as const).map((id) => (
                <Button key={id} type="button" size="sm" variant={cup === id ? 'default' : 'outline'} onClick={() => setCup(id)}>
                  {id.toUpperCase()} cup
                </Button>
              ))}
            </div>
            <Input label="Cups" type="number" min={0} step={0.25} value={cups} onChange={(e) => setCups(Number(e.target.value) || 0)} />
            <Input label="Grams" type="number" min={0} value={grams} onChange={(e) => setGrams(Number(e.target.value) || 0)} />
            <div className="flex flex-wrap gap-2 text-xs">
              {Object.entries(LINKS).map(([key, href]) => (
                <Link key={key} href={href} className="text-blue-600 underline-offset-2 hover:underline dark:text-blue-400">{key}</Link>
              ))}
            </div>
          </div>
        </Card>
        <div className={styles.resultCol}>
          <ResultCard
            label={`${fmtNum(cups, 2)} ${cups === 1 ? 'cup' : 'cups'}`}
            value={`${fmtNum(fromCups.grams, 0)} g`}
            gradient="linear-gradient(160deg,#a16207 0%,#78350f 55%,#1c1917 100%)"
            stats={[
              [`${fmtNum(grams, 0)} g`, `${fmtNum(fromGrams.cups, 2)} cups`],
              ['g per cup', fmtNum(fromCups.gramsPerCup, 1)],
              ['ml', fmtNum(fromCups.ml, 0)],
            ]}
          />
        </div>
      </div>
    </ToolPageShell>
  );
}
