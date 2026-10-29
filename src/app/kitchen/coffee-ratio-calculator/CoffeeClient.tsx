'use client';

import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ToolPageShell } from '@/components/tools/ToolPageShell';
import { ResultCard } from '@/components/tools/ResultCard';
import { COFFEE_METHODS, coffeeFromRatio } from '@/lib/makers/coffee';
import { fmtNum } from '@/lib/makers/format';
import { calculatorPageStyles as styles } from '@/app/finance/compound-interest/page.styles';

export default function CoffeeClient() {
  const [method, setMethod] = useState<(typeof COFFEE_METHODS)[number]['id']>('pour-over');
  const preset = COFFEE_METHODS.find((row) => row.id === method) ?? COFFEE_METHODS[0];
  const [ratio, setRatio] = useState<number>(preset.ratio);
  const [coffee, setCoffee] = useState(15);
  const [lock, setLock] = useState<'coffee' | 'water'>('coffee');
  const result = useMemo(() => coffeeFromRatio(coffee, coffee * ratio, ratio, lock), [coffee, ratio, lock]);

  return (
    <ToolPageShell
      title="Coffee Ratio Calculator"
      subtitle="A coffee ratio calculator sets brew water as coffee grams times ratio. Pour-over starts at 1:16, French press at 1:15, cold brew concentrate at 1:8, and espresso at 1:2. All figures are grams, not scoops."
      directAnswerTitle="What is a 1:16 pour-over?"
      directAnswer="15 g of coffee at 1:16 uses 240 g of water. That is a typical V60 mug. French press at 1:15 with the same dose uses 225 g. Espresso at 1:2 with an 18 g dose yields 36 g in the cup."
      takeaways={[
        'Ratio is water / coffee by mass.',
        'Cold brew 1:8 is concentrate and is usually diluted later.',
        'Espresso yield is beverage mass, not kettle water.',
        'Grind and time still decide extraction.',
      ]}
      categoryName="Kitchen"
      seoTitle="Coffee brew ratio"
      seoDescription="Mass ratio is the only input. Presets match common V60, French press, cold brew, and espresso starting points. A scale in grams is assumed. Tablespoons are not converted."
      howToUse={[
        'Pick a method or type a custom ratio.',
        'Lock coffee dose or lock water.',
        'Weigh both sides in grams.',
      ]}
      benefits={['V60, press, cold brew, and espresso share one form.', 'Grams avoid scoop density arguments.']}
      formula="water_g = coffee_g × ratio"
      faqs={[
        { question: 'What ratio is V60?', answer: '1:16 is a common starting pour-over. Adjust toward 1:15 for a stronger cup.' },
        { question: 'Is cold brew 1:8 drinkable as-is?', answer: 'Usually no. 1:8 is a concentrate; dilute toward 1:1 with water or milk.' },
      ]}
      accuracyNote="Ratio is mass only. Grind, time, and brew method still decide extraction. Espresso yield is beverage mass, not kettle water."
      currentToolId="coffee-ratio"
      relatedIds={['cups-to-grams', 'sourdough-hydration', 'cake-servings']}
      breadcrumbs={[
        { name: 'Home', url: '/' },
        { name: 'Kitchen calculators', url: '/kitchen' },
        { name: 'Coffee ratio calculator', url: '/kitchen/coffee-ratio-calculator' },
      ]}
    >
      <div className={styles.grid}>
        <Card className={styles.inputCard}>
          <div className={styles.inputGroup}>
            <div className="flex flex-wrap gap-2">
              {COFFEE_METHODS.map((row) => (
                <Button
                  key={row.id}
                  type="button"
                  size="sm"
                  variant={method === row.id ? 'default' : 'outline'}
                  onClick={() => {
                    setMethod(row.id);
                    setRatio(row.ratio);
                  }}
                >
                  {row.label}
                </Button>
              ))}
            </div>
            <p className="text-xs text-zinc-500">{preset.note}</p>
            <Input label="Ratio (water : 1 coffee)" type="number" min={1} step={0.5} value={ratio} onChange={(e) => setRatio(Number(e.target.value) || 0)} />
            <Input label="Coffee (g)" type="number" min={1} value={result.coffeeG} onChange={(e) => { setLock('coffee'); setCoffee(Number(e.target.value) || 0); }} />
            <Input label="Water (g)" type="number" min={1} value={result.waterG} onChange={(e) => { setLock('water'); setCoffee((Number(e.target.value) || 0) / ratio); }} />
          </div>
        </Card>
        <div className={styles.resultCol}>
          <ResultCard
            label={`1:${fmtNum(result.ratio, 1)}`}
            value={`${fmtNum(result.coffeeG, 1)} g → ${fmtNum(result.waterG, 0)} g`}
            gradient="linear-gradient(160deg,#78350f 0%,#431407 55%,#1c1917 100%)"
          />
        </div>
      </div>
    </ToolPageShell>
  );
}
