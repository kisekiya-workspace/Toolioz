import { JSONLD } from '@/components/ui/JSONLD';
import { buildCollectionPageJsonLd, buildPageMetadata } from '@/lib/seo';
import { ClusterHub } from '@/components/hub/ClusterHub';

export const metadata = buildPageMetadata({
  title: 'Knitting and Crochet Calculators',
  description:
    'Knitting gauge calculator, crochet gauge converter, yarn estimator, needle size chart, cross stitch fabric, and quilt size tools.',
  path: '/craft',
  keywords: ['knitting gauge calculator', 'crochet gauge calculator', 'yarn calculator for blanket', 'cross stitch fabric calculator'],
});

export default function Page() {
  return (
    <>
      <JSONLD
        data={buildCollectionPageJsonLd({
          name: 'Craft calculators',
          description: 'Gauge, yarn, needle sizes, cross stitch fabric, and quilt layout.',
          path: '/craft',
        })}
      />
      <ClusterHub
        prefix="/craft"
        eyebrow="Craft cluster"
        title="Craft"
        highlight="calculators"
        subtitle="Knitting and crochet gauge, yarn for blankets, needle size conversion, cross stitch fabric, and quilt layout. The arithmetic does not depend on a yarn-brand app."
        groupTitle="Knitting, crochet, and fabric"
        groupDescription="Swatch math, yardage estimates, and cut sizes with inches and centimetres."
      />
    </>
  );
}
