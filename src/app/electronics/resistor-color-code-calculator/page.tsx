import { ToolJsonLd } from '@/components/tools/ToolJsonLd';
import { buildPageMetadata } from '@/lib/seo';
import ResistorClient from './ResistorClient';

const path = '/electronics/resistor-color-code-calculator';
const description =
  'Reads 4, 5, and 6 band resistor colour codes and converts a resistance value back to colours using IEC 60062.';

export const metadata = buildPageMetadata({
  title: 'Resistor Color Code Calculator',
  description,
  path,
  keywords: ['resistor color code calculator', 'resistor color code chart', '4 band resistor calculator'],
});

export default function Page() {
  return (
    <>
      <ToolJsonLd
        name="Resistor Color Code Calculator"
        description={description}
        path={path}
        steps={[{ name: 'Select bands', text: 'Read left to right, or type ohms for reverse colours.' }]}
        faqs={[{ question: 'What is brown black red gold?', answer: '1 kΩ ±5%.' }]}
        breadcrumbs={[
          { name: 'Electronics calculators', url: '/electronics' },
          { name: 'Resistor color code calculator', url: path },
        ]}
      />
      <ResistorClient />
    </>
  );
}
