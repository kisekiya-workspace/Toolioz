import { ToolJsonLd } from '@/components/tools/ToolJsonLd';
import { buildPageMetadata } from '@/lib/seo';
import FrequencyClient from './FrequencyClient';

const path = '/music/frequency-to-note-converter';
const description =
  'Converts hertz to piano note names, cents, and MIDI numbers at A4 = 440 or 432, with a full A0–C8 chart.';

export const metadata = buildPageMetadata({
  title: 'Frequency to Note Converter',
  description,
  path,
  keywords: ['frequency to note converter', 'piano note frequency chart', 'frequency to note calculator', 'a4 432'],
});

export default function Page() {
  return (
    <>
      <ToolJsonLd
        name="Frequency to Note Converter"
        description={description}
        path={path}
        steps={[
          { name: 'Enter hertz', text: 'Choose A4 = 440 or 432.' },
          { name: 'Read the note', text: 'Nearest key, cents, MIDI, and the piano table.' },
        ]}
        faqs={[{ question: 'What note is 440 Hz?', answer: 'A4 at standard pitch, MIDI 69.' }]}
        breadcrumbs={[
          { name: 'Music calculators', url: '/music' },
          { name: 'Frequency to note converter', url: path },
        ]}
      />
      <FrequencyClient />
    </>
  );
}
