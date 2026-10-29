'use client';

import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { ToolPageShell } from '@/components/tools/ToolPageShell';
import { ResultCard } from '@/components/tools/ResultCard';
import { calculatePrintCost, parseGcodeUsage } from '@/lib/makers/print-cost';
import { FILAMENT_MATERIALS } from '@/lib/makers/filament';
import { fmtNum } from '@/lib/makers/format';
import { calculatorPageStyles as styles } from '@/app/finance/compound-interest/page.styles';

export default function PrintCostClient() {
  const [grams, setGrams] = useState(48);
  const [hours, setHours] = useState(3.5);
  const [pricePerKg, setPricePerKg] = useState(20);
  const [watts, setWatts] = useState(120);
  const [kwhRate, setKwhRate] = useState(0.15);
  const [extra, setExtra] = useState(0);
  const [density, setDensity] = useState(1.24);
  const [note, setNote] = useState('');
  const result = useMemo(
    () => calculatePrintCost({ grams, hours, pricePerKg, watts, kwhRate, extra }),
    [grams, hours, pricePerKg, watts, kwhRate, extra],
  );

  const onFile = async (file: File) => {
    const text = await file.text();
    const parsed = parseGcodeUsage(text, density, 1.75);
    if (!parsed) {
      setNote('No filament-used comment was found. Enter grams from the slicer estimate.');
      return;
    }
    setGrams(parsed.grams);
    if (parsed.hours) setHours(parsed.hours);
    setNote(parsed.note);
  };

  return (
    <ToolPageShell
      title="3D Print Cost Calculator"
      subtitle="A 3D print cost calculator multiplies filament grams by price per kilogram, then adds electricity as printer watts × hours × the local kWh rate. Slicer comments such as filament used [g] can be read in the browser. Marketplace fees are omitted because they drift."
      directAnswerTitle="How is 3D print cost calculated?"
      directAnswer="Filament cost is grams / 1000 × price per kg. Electricity is (watts / 1000) × hours × kWh rate. A 48 g PLA part at $20/kg on a 120 W printer for 3.5 h at $0.15/kWh is about $0.96 filament plus $0.06 power."
      takeaways={[
        'Electricity is a user rate, not a live utility tariff.',
        'G-code is parsed locally for common Cura, Prusa, and Bambu comments.',
        'Labour, failure reprints, and marketplace fees are left out on purpose.',
        'India, US, and other currencies work as long as price and kWh use the same unit.',
      ]}
      categoryName="Making"
      seoTitle="3D print cost calculator math"
      seoDescription="Cost is filament mass plus energy. Energy uses nameplate watts, which overstate average draw on a bed that has already heated. Treat the total as a floor, then add failed prints. No cloud API is called."
      howToUse={[
        'Paste grams and hours from the slicer, or drop a .gcode/.3mf text export.',
        'Enter spool price per kg, printer watts, and kWh rate.',
        'Add an extra line for packaging if needed.',
      ]}
      benefits={[
        'Comments stay in the tab; the file is not uploaded.',
        'Watts remain an input so a heated enclosure can be modelled.',
        'Related filament length lives on the weight converter.',
      ]}
      formula="total = grams/1000 × pricePerKg + (watts/1000) × hours × kWhRate + extra"
      faqs={[
        {
          question: 'Can a 3D print cost calculator read Bambu g-code?',
          answer:
            'If the file contains filament used [g] or filament used [mm], those comments are used. Binary .3mf packages without a text g-code part cannot be parsed here.',
        },
        {
          question: 'Why omit Etsy fees?',
          answer:
            'Fee schedules change. Adding a stale percentage would mis-price a listing. Enter extra as a cash amount if a fee is known.',
        },
        {
          question: 'Is printer idle heat included?',
          answer: 'Only the typed hours. Preheat and cooling after the job are extra time if they matter.',
        },
      ]}
      accuracyNote="G-code is read from slicer comments only, not a full toolpath. Nameplate watts overstate average draw after the bed is hot."
      currentToolId="print-cost"
      relatedIds={['filament-weight', 'epoxy-resin', 'candle-wax']}
      breadcrumbs={[
        { name: 'Home', url: '/' },
        { name: 'Making calculators', url: '/maker' },
        { name: '3D print cost calculator', url: '/maker/3d-print-cost-calculator' },
      ]}
    >
      <div className={styles.grid}>
        <Card className={styles.inputCard}>
          <div className={styles.inputGroup}>
            <Input label="Filament (g)" type="number" min={0} value={grams} onChange={(e) => setGrams(Number(e.target.value) || 0)} />
            <Input label="Print time (h)" type="number" min={0} step={0.1} value={hours} onChange={(e) => setHours(Number(e.target.value) || 0)} />
            <Input label="Price per kg" type="number" min={0} step={0.5} value={pricePerKg} onChange={(e) => setPricePerKg(Number(e.target.value) || 0)} />
            <Input label="Printer watts" type="number" min={0} value={watts} onChange={(e) => setWatts(Number(e.target.value) || 0)} />
            <Input label="kWh rate" type="number" min={0} step={0.01} value={kwhRate} onChange={(e) => setKwhRate(Number(e.target.value) || 0)} />
            <Input label="Extra cost" type="number" min={0} value={extra} onChange={(e) => setExtra(Number(e.target.value) || 0)} />
            <label className={styles.label} htmlFor="density">Density for mm comments</label>
            <select id="density" className={styles.select} value={density} onChange={(e) => setDensity(Number(e.target.value))}>
              {FILAMENT_MATERIALS.map((row) => (
                <option key={row.id} value={row.density}>{row.label}</option>
              ))}
            </select>
            <input
              type="file"
              accept=".gcode,.gco,.txt,.3mf"
              className="text-xs"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void onFile(file);
              }}
            />
            {note ? <p className="text-xs text-zinc-500">{note}</p> : null}
          </div>
        </Card>
        <div className={styles.resultCol}>
          <ResultCard
            label="Print cost"
            value={fmtNum(result.total, 2)}
            gradient="linear-gradient(160deg,#115e59 0%,#134e4a 55%,#1c1917 100%)"
            stats={[
              ['Filament', fmtNum(result.filament, 2)],
              ['Electricity', fmtNum(result.electricity, 2)],
              ['kWh', fmtNum(result.kwh, 3)],
              ['Extra', fmtNum(result.extra, 2)],
            ]}
          />
        </div>
      </div>
    </ToolPageShell>
  );
}
