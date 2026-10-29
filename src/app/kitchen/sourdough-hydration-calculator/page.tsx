import { ToolJsonLd } from '@/components/tools/ToolJsonLd';
import { buildPageMetadata } from '@/lib/seo';
import SourdoughClient from './SourdoughClient';

const path = '/kitchen/sourdough-hydration-calculator';
const description =
  'Turns baker’s percentages into flour, bowl water, starter, and salt weights, including starter hydration.';

export const metadata = buildPageMetadata({
  title: 'Sourdough Hydration Calculator',
  description,
  path,
  keywords: ['sourdough hydration calculator', 'bakers percentage calculator', 'sourdough hydration calculator free'],
});

export default function Page() {
  return (
    <>
      <ToolJsonLd
        name="Sourdough Hydration Calculator"
        description={description}
        path={path}
        steps={[
          { name: 'Enter flour', text: 'Bread flour is 100% baker’s percent.' },
          { name: 'Set hydration and starter', text: 'Bowl water subtracts water already in the starter.' },
        ]}
        faqs={[
          {
            question: 'What is 72% hydration on 500 g flour?',
            answer: '360 g water in the system. With 20% starter at 100% hydration, bowl water is 310 g.',
          },
        ]}
        breadcrumbs={[
          { name: 'Kitchen calculators', url: '/kitchen' },
          { name: 'Sourdough hydration calculator', url: path },
        ]}
      />
      <SourdoughClient />
    </>
  );
}
