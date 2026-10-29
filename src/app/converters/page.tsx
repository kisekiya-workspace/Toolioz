import { JSONLD } from '@/components/ui/JSONLD';
import { buildCollectionPageJsonLd, buildPageMetadata } from '@/lib/seo';
import { ClusterHub } from '@/components/hub/ClusterHub';

export const metadata = buildPageMetadata({
  title: 'Converters',
  description:
    'Roman numeral date converter for tattoos, Morse code translator with audio, and a barbell plate calculator.',
  path: '/converters',
  keywords: ['roman numeral converter date', 'morse code translator audio', 'plate calculator kg'],
});

export default function Page() {
  return (
    <>
      <JSONLD
        data={buildCollectionPageJsonLd({
          name: 'Converters',
          description: 'Roman dates, Morse audio, and barbell plates.',
          path: '/converters',
        })}
      />
      <ClusterHub
        prefix="/converters"
        eyebrow="Everyday converters"
        title="Converters"
        highlight="and calculators"
        subtitle="Roman numeral dates with a preview image, Morse encode/decode with playback, and gym plate math in kilograms or pounds."
        groupTitle="Dates, Morse, plates"
        groupDescription="Client-side conversion with a printable or playable result."
      />
    </>
  );
}
