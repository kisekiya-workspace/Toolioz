import type { Metadata } from 'next';
import { DEFAULT_OG_IMAGE } from '@/lib/seo';

export const metadata: Metadata = {
  description:
    'Financial calculators for SIP, ROI, mortgage, income tax, GST, inflation, fixed deposits, and savings planning.',
  keywords: [
    'finance calculator',
    'sip calculator',
    'income tax calculator',
    'roi calculator',
    'mortgage calculator',
    'gst calculator',
    'inflation calculator',
    'fd calculator',
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

export default function FinanceLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
