import { ToolJsonLd } from '@/components/tools/ToolJsonLd';
import { buildPageMetadata } from '@/lib/seo';
import FilamentClient from './FilamentClient';

const path = '/maker/filament-weight-calculator';
const description =
  'Converts 3D printer filament grams to metres using material density and 1.75 mm or 2.85 mm diameter, including leftover spool length.';

export const metadata = buildPageMetadata({
  title: 'Filament Weight to Length Calculator',
  description,
  path,
  keywords: ['filament weight to length calculator', 'pla weight to length', 'how long is 1kg of filament'],
});

export default function Page() {
  return (
    <>
      <ToolJsonLd
        name="Filament Weight to Length Calculator"
        description={description}
        path={path}
        steps={[
          { name: 'Choose material', text: 'PLA, PETG, ABS, and other published densities are listed.' },
          { name: 'Enter mass or length', text: 'Either field converts using the circular cross-section.' },
          { name: 'Check remaining spool', text: 'Leftover grams convert to leftover metres.' },
        ]}
        faqs={[
          {
            question: 'How long is 1 kg of PLA filament?',
            answer: 'About 335 metres at 1.75 mm and 1.24 g/cm³.',
          },
        ]}
        breadcrumbs={[
          { name: 'Making calculators', url: '/maker' },
          { name: 'Filament weight to length', url: path },
        ]}
      />
      <FilamentClient />
    </>
  );
}
