import type { Metadata } from 'next';
import DitheritClient from './DitheritClient';
import { JSONLD } from '@/components/ui/JSONLD';
import { SITE_URL, buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'ditherit ✦ Interactive Dither & ASCII Converter (by Prasanjit Dey)',
  description:
    'Convert images, videos, and GIFs into dithered dot art or ASCII with interactive physics repulsion, WebM export, and React/JS code export. Original tool by Prasanjit Dey (@prasanjit-dey-ux).',
  path: '/devtools/ditherit',
  keywords: [
    'ditherit online',
    'prasanjit dey ditherit',
    'dither dot art generator',
    'ascii video converter',
    'floyd steinberg dither code export',
    'interactive dither physics repulsion',
    'dither react component export',
    'gif dither online',
  ],
});

export default function DitheritPage() {
  const toolJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'ditherit ✦ Interactive Dither & ASCII Studio',
    operatingSystem: 'Any',
    applicationCategory: 'MultimediaApplication',
    author: {
      '@type': 'Person',
      name: 'Prasanjit Dey',
      url: 'https://github.com/prasanjit-dey-ux',
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description:
      'Browser-based tool to convert images, videos, and GIFs into dithered dot art or ASCII with physics-based mouse repulsion, WebM video export, and instant React code export.',
    url: `${SITE_URL}/devtools/ditherit`,
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is ditherit?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ditherit is an open-source browser utility created by Prasanjit Dey (@prasanjit-dey-ux) that turns images, videos, and GIFs into dithered dot art or ASCII art, complete with interactive mouse physics repulsion and React component code export.',
        },
      },
      {
        '@type': 'Question',
        name: 'Who created ditherit?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ditherit was created and built by Prasanjit Dey. You can view the original repository on GitHub at https://github.com/prasanjit-dey-ux/ditherit.',
        },
      },
      {
        '@type': 'Question',
        name: 'How does interactive physics dot repulsion work?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ditherit converts image pixels into dot coordinates. When switching to physics mode, dots respond to mouse hover with spring physics forces, repelling or attracting dots dynamically.',
        },
      },
    ],
  };

  return (
    <>
      <JSONLD data={toolJsonLd} />
      <JSONLD data={faqJsonLd} />
      <DitheritClient />
    </>
  );
}
