import type { Metadata } from 'next';
import { JSONLD } from '@/components/ui/JSONLD';
import TimestampConverterClient from './TimestampConverterClient';

export const metadata: Metadata = {
  title: 'Unix Timestamp Converter | Seconds, Milliseconds & Date Time',
  description:
    'Convert Unix timestamps into readable dates or turn date strings back into epoch seconds and milliseconds.',
  keywords: [
    'unix timestamp converter',
    'epoch time converter',
    'timestamp to date',
    'seconds to milliseconds converter',
    'date to epoch converter',
  ],
  alternates: {
    canonical: 'https://toolioz.com/devtools/timestamp-converter',
  },
  openGraph: {
    title: 'Unix Timestamp Converter | Toolioz',
    description: 'Client-side timestamp conversion for seconds, milliseconds, and local time.',
    url: 'https://toolioz.com/devtools/timestamp-converter',
    siteName: 'Toolioz DevTools',
    type: 'website',
    images: [
      {
        url: '/tooliozLogo.png',
        width: 512,
        height: 512,
        alt: 'Toolioz Timestamp Converter',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Unix Timestamp Converter | Toolioz',
    description: 'Convert epoch seconds, milliseconds, and date strings in the browser.',
    images: ['/tooliozLogo.png'],
  },
};

export default function TimestampConverterPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Unix Timestamp Converter',
    url: 'https://toolioz.com/devtools/timestamp-converter',
    description:
      'Client-side Unix timestamp converter for seconds, milliseconds, and local time.',
  };

  return (
    <>
      <JSONLD data={jsonLd} />
      <TimestampConverterClient />
    </>
  );
}
