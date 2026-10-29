import { ToolJsonLd } from '@/components/tools/ToolJsonLd';
import { buildPageMetadata } from '@/lib/seo';
import ChordClient from './ChordClient';

const path = '/music/chord-transposer';
const description = 'Transposes pasted guitar or piano chord sheets by semitones and shows capo-friendly shapes.';

export const metadata = buildPageMetadata({
  title: 'Chord Transposer',
  description,
  path,
  keywords: ['chord transposer', 'chord transposer online', 'guitar chord transposer', 'capo chord transposer'],
});

export default function Page() {
  return (
    <>
      <ToolJsonLd
        name="Chord Transposer"
        description={description}
        path={path}
        steps={[
          { name: 'Paste chords', text: 'Keep chord lines above lyrics.' },
          { name: 'Set semitones', text: 'Optional capo field writes playable shapes.' },
        ]}
        faqs={[{ question: 'How does a chord transposer work?', answer: 'A–G tokens move around the 12-tone circle; other text stays.' }]}
        breadcrumbs={[
          { name: 'Music calculators', url: '/music' },
          { name: 'Chord transposer', url: path },
        ]}
      />
      <ChordClient />
    </>
  );
}
