import { ToolJsonLd } from '@/components/tools/ToolJsonLd';
import { buildPageMetadata } from '@/lib/seo';
import LedClient from './LedClient';

const path = '/electronics/led-resistor-calculator';
const description =
  'Sizes a series LED resistor from supply, forward voltage, and current, and solves a two-resistor voltage divider.';

export const metadata = buildPageMetadata({
  title: 'LED Resistor Calculator',
  description,
  path,
  keywords: ['led resistor calculator', 'led resistor calculator 12v', 'voltage divider calculator'],
});

export default function Page() {
  return (
    <>
      <ToolJsonLd
        name="LED Resistor Calculator"
        description={description}
        path={path}
        steps={[
          { name: 'Enter supply and Vf', text: 'Current in milliamps. Optional series count.' },
          { name: 'Divider tab', text: 'Two resistors, or solve R2 for a target Vout.' },
        ]}
        faqs={[{ question: 'What resistor for a 5 V LED at 20 mA?', answer: 'About 145 Ω if Vf is 2.1 V.' }]}
        breadcrumbs={[
          { name: 'Electronics calculators', url: '/electronics' },
          { name: 'LED resistor calculator', url: path },
        ]}
      />
      <LedClient />
    </>
  );
}
