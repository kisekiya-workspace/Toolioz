import { ToolJsonLd } from '@/components/tools/ToolJsonLd';
import { buildPageMetadata } from '@/lib/seo';
import CupsGramsClient from '../cups-to-grams/CupsGramsClient';

const path = '/kitchen/cups-to-grams-rice';
const description = 'Converts cups to grams for uncooked white rice at 185 g per US cup.';

export const metadata = buildPageMetadata({
  title: 'Cups to Grams Rice',
  description,
  path,
  keywords: ['cups to grams rice', 'uncooked rice grams per cup'],
});

export default function Page() {
  return (
    <>
      <ToolJsonLd
        name="Cups to Grams Rice"
        description={description}
        path={path}
        steps={[{ name: 'Enter cups', text: 'Uncooked long-grain white rice is 185 g per US cup.' }]}
        faqs={[{ question: 'How many grams is 1 cup of uncooked rice?', answer: 'About 185 g per US cup.' }]}
        breadcrumbs={[
          { name: 'Kitchen calculators', url: '/kitchen' },
          { name: 'Cups to grams rice', url: path },
        ]}
      />
      <CupsGramsClient slug="rice" />
    </>
  );
}
