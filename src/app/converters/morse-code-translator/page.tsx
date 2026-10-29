import { ToolJsonLd } from '@/components/tools/ToolJsonLd';
import { buildPageMetadata } from '@/lib/seo';
import MorseClient from './MorseClient';

const path = '/converters/morse-code-translator';
const description = 'Encodes and decodes ITU Morse code and plays the pattern as a 600 Hz tone in the browser.';

export const metadata = buildPageMetadata({
  title: 'Morse Code Translator',
  description,
  path,
  keywords: ['morse code translator audio', 'morse code translator to text', 'morse code audio'],
});

export default function Page() {
  return (
    <>
      <ToolJsonLd
        name="Morse Code Translator"
        description={description}
        path={path}
        steps={[{ name: 'Type text', text: 'Read Morse, then play the tone pattern.' }]}
        faqs={[{ question: 'Does this decode Morse from a microphone?', answer: 'No. Playback and typed Morse only.' }]}
        breadcrumbs={[
          { name: 'Converters', url: '/converters' },
          { name: 'Morse code translator', url: path },
        ]}
      />
      <MorseClient />
    </>
  );
}
