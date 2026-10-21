import React from 'react';
import TermsClient from './TermsClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Terms of Service | Legal Framework",
  description: "Read the terms and conditions for using Toolioz. Understand your rights and responsibilities when using our free utility tools.",
  keywords: 'Terms of service, legal usage agreement, tool usage terms',
  alternates: {
    canonical: 'https://toolioz.com/terms',
  },
  openGraph: {
    title: 'Terms & Conditions of Usage | Toolioz',
    description: 'Standard legal terms for accessing our free professional utility suite.',
    url: 'https://toolioz.com/terms',
    type: 'website',
  }
};

export default function TermsPage() {
  return <TermsClient />;
}
