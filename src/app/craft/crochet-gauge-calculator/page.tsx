import { ToolJsonLd } from '@/components/tools/ToolJsonLd';
import { buildPageMetadata } from '@/lib/seo';
import GaugeClient from '../knitting-gauge-calculator/GaugeClient';

const path = '/craft/crochet-gauge-calculator';
const description =
  'Converts a blocked crochet gauge swatch into stitches per inch or centimetre, a starting chain count, and a pattern adjustment factor.';

export const metadata = buildPageMetadata({
  title: 'Crochet Gauge Calculator',
  description,
  path,
  keywords: ['crochet gauge calculator', 'crochet gauge converter', 'crochet gauge swatch', 'filet crochet gauge'],
});

export default function Page() {
  return (
    <>
      <ToolJsonLd
        name="Crochet Gauge Calculator"
        description={description}
        path={path}
        steps={[
          { name: 'Block the swatch', text: 'Make a swatch in the stitch pattern, then block it.' },
          { name: 'Count stitches', text: 'Count stitches and rows across 4 inches or 10 cm.' },
          { name: 'Enter the target width', text: 'Starting chains equal stitches per unit times finished width, plus turning chains if the pattern uses them.' },
        ]}
        faqs={[
          {
            question: 'How does a crochet gauge calculator work?',
            answer:
              'Stitches per unit equal swatch stitches divided by swatch width. The starting width in stitches is that rate times the finished width.',
          },
        ]}
        breadcrumbs={[
          { name: 'Craft calculators', url: '/craft' },
          { name: 'Crochet gauge calculator', url: path },
        ]}
      />
      <GaugeClient craft="crochet" />
    </>
  );
}
