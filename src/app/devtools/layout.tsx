import type { Metadata } from 'next';
import { DEFAULT_OG_IMAGE } from '@/lib/seo';

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
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    images: [DEFAULT_OG_IMAGE.url],
  },
};

export default function DevToolsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
