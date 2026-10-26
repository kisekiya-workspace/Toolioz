import type { Metadata } from 'next';
import { JSONLD } from '@/components/ui/JSONLD';
import { allToolItems, buildItemListJsonLd, buildPageMetadata } from '@/lib/seo';
import ToolsLibraryClient from './ToolsLibraryClient';

export const metadata: Metadata = buildPageMetadata({
  title: 'Calculators and Developer Utilities',
  description:
    'Lists Toolioz calculators, converters, generators, PDF utilities, design tools, and developer utilities.',
  path: '/tools',
  keywords: [
    'free online tools',
    'online calculators',
    'developer tools',
    'image converters',
    'PDF tools',
    'text tools',
  ],
});

export default function ToolsLibraryPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Toolioz Free Online Tools Library',
    description: metadata.description,
    url: 'https://toolioz.com/tools',
    mainEntity: buildItemListJsonLd({
      name: 'Toolioz online tools',
      description: 'Free browser-based tools for finance, development, design, media, and productivity.',
      path: '/tools',
      items: Array.from(new Map(allToolItems.map((tool) => [tool.url, tool])).values()),
    }),
  };

  return <><JSONLD data={jsonLd} /><ToolsLibraryClient /></>;
}
