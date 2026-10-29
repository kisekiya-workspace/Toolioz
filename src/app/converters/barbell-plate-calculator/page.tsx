import { ToolJsonLd } from '@/components/tools/ToolJsonLd';
import { buildPageMetadata } from '@/lib/seo';
import BarbellClient from './BarbellClient';

const path = '/converters/barbell-plate-calculator';
const description =
  'Splits a target barbell weight into kg or lb plates on each side and draws the loaded bar.';

export const metadata = buildPageMetadata({
  title: 'Barbell Plate Calculator',
  description,
  path,
  keywords: ['plate calculator kg', 'barbell plate calculator', 'gym plate calculator'],
});

export default function Page() {
  return (
    <>
      <ToolJsonLd
        name="Barbell Plate Calculator"
        description={description}
        path={path}
        steps={[{ name: 'Set bar and target', text: 'Read per-side plates and leftover mass.' }]}
        faqs={[{ question: 'How is 100 kg loaded on a 20 kg bar?', answer: '40 kg per side: 25 + 10 + 5.' }]}
        breadcrumbs={[
          { name: 'Converters', url: '/converters' },
          { name: 'Barbell plate calculator', url: path },
        ]}
      />
      <BarbellClient />
    </>
  );
}
