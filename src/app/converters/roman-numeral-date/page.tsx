import { ToolJsonLd } from '@/components/tools/ToolJsonLd';
import { buildPageMetadata } from '@/lib/seo';
import RomanClient from './RomanClient';

const path = '/converters/roman-numeral-date';
const description =
  'Converts dates of birth to Roman numerals with a tattoo-style preview and PNG export. Also decodes numerals back to numbers.';

export const metadata = buildPageMetadata({
  title: 'Roman Numeral Date Converter',
  description,
  path,
  keywords: ['roman numeral converter date', 'roman numeral date of birth', 'roman numeral tattoo date'],
});

export default function Page() {
  return (
    <>
      <ToolJsonLd
        name="Roman Numeral Date Converter"
        description={description}
        path={path}
        steps={[
          { name: 'Enter the date', text: 'Day, month, and year convert separately.' },
          { name: 'Preview and export', text: 'PNG stays in the browser.' },
        ]}
        faqs={[{ question: 'How is 29 July 1994 written in Roman numerals?', answer: 'XXIX · VII · MCMXCIV with a middle-dot separator.' }]}
        breadcrumbs={[
          { name: 'Converters', url: '/converters' },
          { name: 'Roman numeral date', url: path },
        ]}
      />
      <RomanClient />
    </>
  );
}
