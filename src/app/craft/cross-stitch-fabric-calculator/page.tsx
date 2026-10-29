import { ToolJsonLd } from '@/components/tools/ToolJsonLd';
import { buildPageMetadata } from '@/lib/seo';
import CrossStitchClient from './CrossStitchClient';

const path = '/craft/cross-stitch-fabric-calculator';
const description =
  'Calculates Aida or evenweave cut size from stitch counts, fabric count, over 1 or over 2, and a framing margin in inches and centimetres.';

export const metadata = buildPageMetadata({
  title: 'Cross Stitch Fabric Calculator',
  description,
  path,
  keywords: ['cross stitch fabric calculator', 'cross stitch fabric calculator cm', 'cross stitch fabric calculator uk', 'aida fabric calculator'],
});

export default function Page() {
  return (
    <>
      <ToolJsonLd
        name="Cross Stitch Fabric Calculator"
        description={description}
        path={path}
        steps={[
          { name: 'Enter stitches', text: 'Use the pattern width and height in stitches.' },
          { name: 'Set count and over', text: 'Aida is usually over 1. 28-count evenweave is often over 2.' },
          { name: 'Add a margin', text: 'Three inches per side is a common hoop allowance.' },
        ]}
        faqs={[
          {
            question: 'How large is 140 stitches on 14-count Aida?',
            answer: '140 / 14 = 10 inches (25.4 cm) plus twice the chosen margin for the cut size.',
          },
        ]}
        breadcrumbs={[
          { name: 'Craft calculators', url: '/craft' },
          { name: 'Cross stitch fabric calculator', url: path },
        ]}
      />
      <CrossStitchClient />
    </>
  );
}
