import { ToolJsonLd } from '@/components/tools/ToolJsonLd';
import { buildPageMetadata } from '@/lib/seo';
import GaugeClient from './GaugeClient';

const path = '/craft/knitting-gauge-calculator';
const description =
  'Converts a blocked knitting gauge swatch into stitches per inch or centimetre, a cast-on count, and a pattern adjustment factor.';

export const metadata = buildPageMetadata({
  title: 'Knitting Gauge Calculator',
  description,
  path,
  keywords: ['knitting gauge calculator', 'knitting gauge converter', 'knitting gauge calculator for beginners', 'knitting gauge calculator free'],
});

export default function Page() {
  return (
    <>
      <ToolJsonLd
        name="Knitting Gauge Calculator"
        description={description}
        path={path}
        steps={[
          { name: 'Block the swatch', text: 'Wash and dry the swatch the way the garment will be finished.' },
          { name: 'Count stitches', text: 'Count stitches and rows across 4 inches or 10 cm.' },
          { name: 'Enter the target width', text: 'The calculator multiplies stitches per unit by the finished width.' },
        ]}
        faqs={[
          {
            question: 'How does a knitting gauge calculator work?',
            answer:
              'Stitches per unit equal swatch stitches divided by swatch width. Cast-on stitches equal that rate times the finished width.',
          },
        ]}
        breadcrumbs={[
          { name: 'Craft calculators', url: '/craft' },
          { name: 'Knitting gauge calculator', url: path },
        ]}
      />
      <GaugeClient craft="knitting" />
    </>
  );
}
