import React from 'react';
import { JSONLD } from '@/components/ui/JSONLD';
import GSTClient from './GSTClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "GST Calculator 2026 | CGST SGST IGST Split & ITC Guide | Toolioz",
  description: "Calculate GST with CGST/SGST and IGST split. Includes GST filing deadlines, ITC rules, composition scheme guide, and HSN code lookup tips for Indian businesses.",
  keywords: 'gst calculator with cgst sgst split, igst calculator inter state, gst inclusive exclusive calculator india, gst filing deadline gstr-1 gstr-3b, input tax credit itc rules 2026, gst composition scheme limit, gst for freelancers india, hsn code gst rate finder, reverse charge mechanism calculator',
  alternates: {
    canonical: 'https://toolioz.com/finance/gst-calculator',
  },
  openGraph: {
    title: 'GST Calculator 2026 — CGST/SGST Split & Compliance Guide | Toolioz',
    description: 'Calculate GST amounts with CGST/SGST or IGST split. Get filing deadlines, ITC rules, and pro tips for GST compliance.',
    url: 'https://toolioz.com/finance/gst-calculator',
    type: 'website',
  }
};

export default function GSTCalculatorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FinancialCalculator",
    "name": "Unified GST Calculator",
    "description": "Calculate GST inclusive and exclusive amounts.",
    "url": "https://toolioz.com/finance/gst-calculator",
    "brand": {
      "@type": "Brand",
      "name": "Toolioz / FinanceCalc"
    },

    "offers": {

      "@type": "Offer",

      "price": "0.00",

      "priceCurrency": "USD"

    }

  };

return (
    <>
      <JSONLD data={jsonLd} />
      <GSTClient />
    </>
  );
}
