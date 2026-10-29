import { ToolJsonLd } from '@/components/tools/ToolJsonLd';
import { buildPageMetadata } from '@/lib/seo';
import CandleClient from './CandleClient';

const path = '/maker/candle-wax-calculator';
const description =
  'Estimates soy, paraffin, or beeswax mass and fragrance load from container water ounces, with grams for kitchen scales.';

export const metadata = buildPageMetadata({
  title: 'Candle Wax Calculator',
  description,
  path,
  keywords: ['candle wax calculator', 'candle wax calculator free', 'candle making calculator', 'candle wax calculator uk'],
});

export default function Page() {
  return (
    <>
      <ToolJsonLd
        name="Candle Wax Calculator"
        description={description}
        path={path}
        steps={[
          { name: 'Enter jar volume', text: 'Use water ounces of the container times how many candles.' },
          { name: 'Set load', text: 'Fragrance percent is of wax weight.' },
        ]}
        faqs={[
          {
            question: 'How much soy wax is in an 8 oz candle?',
            answer: 'About 6.88 oz (195 g) of soy, plus fragrance at the chosen load percent.',
          },
        ]}
        breadcrumbs={[
          { name: 'Making calculators', url: '/maker' },
          { name: 'Candle wax calculator', url: path },
        ]}
      />
      <CandleClient />
    </>
  );
}
