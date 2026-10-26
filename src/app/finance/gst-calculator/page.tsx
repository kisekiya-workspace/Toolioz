import React from 'react';
import { JSONLD } from '@/components/ui/JSONLD';
import GSTClient from './GSTClient';
import type { Metadata } from 'next';
import { buildCalculatorJsonLd, buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'GST Calculator',
  description: 'Calculates GST-inclusive and exclusive amounts and splits tax into CGST plus SGST or IGST for the selected rate.',
  path: '/finance/gst-calculator',
  keywords: 'gst calculator, cgst sgst split, igst calculator, gst inclusive exclusive',
  robots: { index: false, follow: true },
});

export default function GSTCalculatorPage() {
  const jsonLd = buildCalculatorJsonLd({
    name: "GST Calculator",
    description: "Calculate GST inclusive and exclusive amounts with CGST, SGST, and IGST breakdown.",
    path: "/finance/gst-calculator",
    applicationCategory: "FinanceApplication",
  });

  return (
    <>
      <JSONLD data={jsonLd} />
      <GSTClient />
    </>
  );
}
