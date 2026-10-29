import { JSONLD } from '@/components/ui/JSONLD';
import { buildCollectionPageJsonLd, buildPageMetadata } from '@/lib/seo';
import { ClusterHub } from '@/components/hub/ClusterHub';

export const metadata = buildPageMetadata({
  title: 'Music Calculators',
  description:
    'BPM to milliseconds delay calculator with tap tempo, chord transposer, frequency to note converter, and video file size.',
  path: '/music',
  keywords: ['bpm to ms', 'tap bpm', 'chord transposer', 'frequency to note converter', 'video file size calculator'],
});

export default function Page() {
  return (
    <>
      <JSONLD
        data={buildCollectionPageJsonLd({
          name: 'Music calculators',
          description: 'Tempo, chords, pitch, and video bitrate.',
          path: '/music',
        })}
      />
      <ClusterHub
        prefix="/music"
        eyebrow="Music cluster"
        title="Music"
        highlight="calculators"
        subtitle="Delay times from BPM, transposed chord sheets, A4 note charts, and recording size from bitrate. Audio never leaves the tab."
        groupTitle="Tempo, pitch, and video"
        groupDescription="Millisecond charts, capo-aware transpose, and generic bitrate presets."
      />
    </>
  );
}
