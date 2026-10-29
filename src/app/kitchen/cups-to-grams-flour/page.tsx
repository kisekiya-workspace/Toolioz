import { ToolJsonLd } from '@/components/tools/ToolJsonLd';
import { buildPageMetadata } from '@/lib/seo';
import CupsGramsClient from '../cups-to-grams/CupsGramsClient';

const path = '/kitchen/cups-to-grams-flour';
const description = 'Converts cups to grams for all-purpose flour at 120 g per US cup, with UK and Australian cup sizes.';

export const metadata = buildPageMetadata({
  title: 'Cups to Grams Flour',
  description,
  path,
  keywords: ['cups to grams flour', 'grams to cups flour', 'flour cup in grams'],
});

export default function Page() {
  return (
    <>
      <ToolJsonLd
        name="Cups to Grams Flour"
        description={description}
        path={path}
        steps={[{ name: 'Enter cups', text: 'Spooned and levelled all-purpose flour is 120 g per US cup.' }]}
        faqs={[{ question: 'How many grams is 1 cup of flour?', answer: '120 g per US cup when spooned and levelled.' }]}
        breadcrumbs={[
          { name: 'Kitchen calculators', url: '/kitchen' },
          { name: 'Cups to grams flour', url: path },
        ]}
      />
      <CupsGramsClient slug="flour" />
    </>
  );
}
