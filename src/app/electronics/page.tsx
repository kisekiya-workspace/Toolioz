import { JSONLD } from '@/components/ui/JSONLD';
import { buildCollectionPageJsonLd, buildPageMetadata } from '@/lib/seo';
import { ClusterHub } from '@/components/hub/ClusterHub';

export const metadata = buildPageMetadata({
  title: 'Electronics Calculators',
  description:
    'Resistor color code calculator for 4, 5, and 6 band parts, plus LED series resistor and voltage divider math.',
  path: '/electronics',
  keywords: ['resistor color code calculator', 'led resistor calculator', 'voltage divider calculator'],
});

export default function Page() {
  return (
    <>
      <JSONLD
        data={buildCollectionPageJsonLd({
          name: 'Electronics calculators',
          description: 'Resistor color codes, LED resistors, and voltage dividers.',
          path: '/electronics',
        })}
      />
      <ClusterHub
        prefix="/electronics"
        eyebrow="Electronics cluster"
        title="Electronics"
        highlight="calculators"
        subtitle="IEC 60062 resistor colors, LED current-limiting resistors, and two-resistor dividers. These are circuit-planning figures, not a substitute for a datasheet."
        groupTitle="Resistors and LEDs"
        groupDescription="Band decoding and Ohm’s law for a single series string."
      />
    </>
  );
}
