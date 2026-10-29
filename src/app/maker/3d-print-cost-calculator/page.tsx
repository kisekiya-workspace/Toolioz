import { ToolJsonLd } from '@/components/tools/ToolJsonLd';
import { buildPageMetadata } from '@/lib/seo';
import PrintCostClient from './PrintCostClient';

const path = '/maker/3d-print-cost-calculator';
const description =
  'Estimates 3D print cost from filament grams, printer watts, kWh rate, and optional slicer g-code comments. Files stay in the browser.';

export const metadata = buildPageMetadata({
  title: '3D Print Cost Calculator',
  description,
  path,
  keywords: ['3d print cost calculator', '3d print cost calculator free', 'bambu print cost calculator'],
});

export default function Page() {
  return (
    <>
      <ToolJsonLd
        name="3D Print Cost Calculator"
        description={description}
        path={path}
        steps={[
          { name: 'Enter mass and time', text: 'Use slicer estimates, or drop a g-code file with filament-used comments.' },
          { name: 'Set prices', text: 'Spool price per kg and local electricity rate are user inputs.' },
        ]}
        faqs={[
          {
            question: 'How is 3D print cost calculated?',
            answer: 'Filament is grams/1000 × price per kg. Electricity is watts/1000 × hours × kWh rate.',
          },
        ]}
        breadcrumbs={[
          { name: 'Making calculators', url: '/maker' },
          { name: '3D print cost calculator', url: path },
        ]}
      />
      <PrintCostClient />
    </>
  );
}
