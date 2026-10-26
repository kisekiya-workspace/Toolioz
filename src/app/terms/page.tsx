import React from 'react';
import TermsClient from './TermsClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Terms of Service | Legal Framework",
  description: "States the terms for using Toolioz finance, developer, PDF, and biodata utilities, including liability limits.",
  keywords: 'Terms of service, legal usage agreement, tool usage terms',
  alternates: {
    canonical: 'https://toolioz.com/terms',
  },
  openGraph: {
    title: 'Terms & Conditions of Usage | Toolioz',
    description: 'States the terms for using Toolioz finance, developer, PDF, and biodata utilities, including liability limits.',
    url: 'https://toolioz.com/terms',
    type: 'website',
  }
};

export default function TermsPage() {
  return <TermsClient />;
}
