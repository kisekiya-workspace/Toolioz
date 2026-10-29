import { ToolJsonLd } from '@/components/tools/ToolJsonLd';
import { buildPageMetadata } from '@/lib/seo';
import CupsGramsClient from '../cups-to-grams/CupsGramsClient';

const path = '/kitchen/cups-to-grams-sugar';
const description = 'Converts cups to grams for granulated sugar at 200 g per US cup, with UK and Australian cup sizes.';

export const metadata = buildPageMetadata({
  title: 'Cups to Grams Sugar',
  description,
  path,
  keywords: ['cups to grams sugar', 'sugar cup in grams', 'grams to cups sugar'],
});

export default function Page() {
  return (
    <>
      <ToolJsonLd
        name="Cups to Grams Sugar"
        description={description}
        path={path}
        steps={[{ name: 'Enter cups', text: 'Granulated sugar is 200 g per US cup.' }]}
        faqs={[{ question: 'How many grams is 1 cup of sugar?', answer: '200 g of granulated sugar per US cup.' }]}
        breadcrumbs={[
          { name: 'Kitchen calculators', url: '/kitchen' },
          { name: 'Cups to grams sugar', url: path },
        ]}
      />
      <CupsGramsClient slug="sugar" />
    </>
  );
}
