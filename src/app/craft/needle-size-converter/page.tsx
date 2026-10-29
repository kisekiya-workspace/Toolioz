import { ToolJsonLd } from '@/components/tools/ToolJsonLd';
import { buildPageMetadata } from '@/lib/seo';
import NeedleClient from './NeedleClient';

const path = '/craft/needle-size-converter';
const description =
  'Converts knitting needle and crochet hook sizes among millimetres, US, UK, and Japan using the Craft Yarn Council millimetre chart.';

export const metadata = buildPageMetadata({
  title: 'Knitting Needle Size Converter',
  description,
  path,
  keywords: ['knitting needle size converter', 'knitting needle size chart mm to us', 'crochet hook size chart japan', 'uk knitting needle sizes'],
});

export default function Page() {
  return (
    <>
      <ToolJsonLd
        name="Knitting Needle Size Converter"
        description={description}
        path={path}
        steps={[
          { name: 'Enter millimetres', text: 'Type the shaft diameter stamped on the needle.' },
          { name: 'Read regional labels', text: 'US, UK, Japan, and crochet letters are listed for that millimetre.' },
        ]}
        faqs={[
          {
            question: 'What millimetre is a US 8 knitting needle?',
            answer: 'US 8 is 5.0 mm, which is also UK 6 and a US H-8 crochet hook.',
          },
        ]}
        breadcrumbs={[
          { name: 'Craft calculators', url: '/craft' },
          { name: 'Needle size converter', url: path },
        ]}
      />
      <NeedleClient />
    </>
  );
}
