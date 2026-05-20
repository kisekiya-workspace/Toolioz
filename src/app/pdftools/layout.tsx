import type { Metadata } from 'next';
import { DEFAULT_OG_IMAGE } from '@/lib/seo';

export const metadata: Metadata = {
  description:
    'PDF utilities to merge, compress, convert, and optimize documents quickly with browser-safe workflows.',
  keywords: [
    'pdf tools',
    'merge pdf',
    'compress pdf',
    'pdf to image',
    'image compressor',
    'online pdf utility',
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

export default function PdfToolsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
