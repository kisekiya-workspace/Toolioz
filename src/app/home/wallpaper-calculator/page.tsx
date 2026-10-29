import { ToolJsonLd } from '@/components/tools/ToolJsonLd';
import { buildPageMetadata } from '@/lib/seo';
import WallpaperClient from './WallpaperClient';

const path = '/home/wallpaper-calculator';
const description =
  'Estimates wallpaper rolls with pattern repeat, straight match or half-drop, and EU, UK, or US roll sizes.';

export const metadata = buildPageMetadata({
  title: 'Wallpaper Calculator with Pattern Repeat',
  description,
  path,
  keywords: ['wallpaper calculator with pattern repeat', 'wallpaper calculator with repeat', 'wallpaper calculator uk'],
});

export default function Page() {
  return (
    <>
      <ToolJsonLd
        name="Wallpaper Calculator"
        description={description}
        path={path}
        steps={[
          { name: 'Measure the wall', text: 'Width and height in metres.' },
          { name: 'Set repeat', text: 'Straight or half-drop adds extra drop height.' },
        ]}
        faqs={[{ question: 'How does pattern repeat change roll count?', answer: 'Longer drops mean fewer drops per roll, so more rolls.' }]}
        breadcrumbs={[
          { name: 'Home calculators', url: '/home' },
          { name: 'Wallpaper calculator', url: path },
        ]}
      />
      <WallpaperClient />
    </>
  );
}
