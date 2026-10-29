import { ToolJsonLd } from '@/components/tools/ToolJsonLd';
import { buildPageMetadata } from '@/lib/seo';
import CupsGramsClient from './CupsGramsClient';

const path = '/kitchen/cups-to-grams';
const description =
  'Converts US, UK, and Australian cups to grams for flour, butter, sugar, rice, and other baking ingredients.';

export const metadata = buildPageMetadata({
  title: 'Cups to Grams Converter',
  description,
  path,
  keywords: ['cups to grams flour', 'cups to grams butter', 'cups to grams sugar', 'cups to grams rice'],
});

export default function Page() {
  return (
    <>
      <ToolJsonLd
        name="Cups to Grams Converter"
        description={description}
        path={path}
        steps={[
          { name: 'Pick an ingredient', text: 'Each food has its own grams per US cup.' },
          { name: 'Pick a cup standard', text: 'US 240 ml, UK 284 ml, or Australian 250 ml.' },
        ]}
        faqs={[
          {
            question: 'How many grams are in a cup of flour?',
            answer: 'All-purpose flour is 120 g per US cup when spooned and levelled.',
          },
        ]}
        breadcrumbs={[
          { name: 'Kitchen calculators', url: '/kitchen' },
          { name: 'Cups to grams', url: path },
        ]}
      />
      <CupsGramsClient />
    </>
  );
}
