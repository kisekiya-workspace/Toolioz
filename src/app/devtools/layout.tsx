import type { Metadata } from 'next';

export const metadata: Metadata = {
  description:
    'Practical developer tools for JSON formatting, regex testing, cron parsing, hashing, encoding, timestamps, and API workflow debugging.',
  keywords: [
    'developer tools',
    'json formatter',
    'regex tester',
    'cron parser',
    'hash generator',
    'jwt decoder',
    'curl converter',
    'json diff',
    'timestamp converter',
    'devtools blog',
  ],
  openGraph: {
    siteName: 'Toolioz',
    type: 'website',
    images: [
      {
        url: '/tooliozLogo.png',
        width: 512,
        height: 512,
        alt: 'Toolioz Developer Tools',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/tooliozLogo.png'],
  },
};

export default function DevToolsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
