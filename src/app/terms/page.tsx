import React from 'react';
import TermsClient from './TermsClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Terms of Service | Legal Framework",
  description: "Terms for using Toolioz. Tools can be wrong or outdated, are provided as-is, and are used at the visitor's own risk.",
  keywords: 'Terms of service, legal usage agreement, tool usage terms',
  alternates: {
    canonical: 'https://toolioz.com/terms',
  },
  openGraph: {
    title: 'Terms & Conditions of Usage | Toolioz',
    description: 'Terms for using Toolioz. Tools can be wrong or outdated, are provided as-is, and are used at the visitor\'s own risk.',
    url: 'https://toolioz.com/terms',
    type: 'website',
  }
};

export default function TermsPage() {
  return <TermsClient />;
}
