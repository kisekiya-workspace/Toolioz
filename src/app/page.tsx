import React from 'react';
import { JSONLD } from '@/components/ui/JSONLD';
import PortalClient from './PortalClient';
import { buildItemListJsonLd, buildPageMetadata, buildWebsiteJsonLd, allToolItems } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Toolioz | Free Finance Calculators, Dev & PDF Utilities',
  description:
    'Free SIP & tax calculators, JSON formatter, PDF merge, marriage biodata maker, and ATS resume builder. Fast, private, client-side web tools.',
  path: '/',
  keywords: [
    'sip calculator india',
    'income tax calculator',
    'x tap to reveal png maker',
    'twitter hidden image maker',
    'marriage biodata maker free',
    'json formatter online',
    'merge pdf online free',
    'ats resume builder free',
    'developer tools online',
    'finance calculator 2026',
  ],
});

const homeFaqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Are Toolioz tools really free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Toolioz provides 100% free online finance calculators, developer utilities, PDF tools, and marriage biodata makers without signups, paywalls, or feature lockouts.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is user data secure on Toolioz?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Calculations and file processing run locally inside your web browser sandbox using JavaScript and WebAssembly. Sensitive inputs and uploaded documents are never stored or transmitted to external servers.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do Toolioz financial formulas match real-world bank standards?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Toolioz uses exact compound interest, systematic investment plan (SIP), loan prepayment amortization, and tax formulas used by financial planning institutions.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can users suggest new developer or finance tools?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Users can submit requests via the contact page to suggest new utilities and calculators for development.',
      },
    },
  ],
};

export default function Home() {
  return (
    <>
      <JSONLD data={buildWebsiteJsonLd()} />
      <JSONLD
        data={buildItemListJsonLd({
          name: 'Toolioz free online tools',
          description: 'Finance, developer, PDF, biodata, and resume utilities.',
          path: '/',
          items: allToolItems,
        })}
      />
      <JSONLD data={homeFaqJsonLd} />
      <PortalClient />
    </>
  );
}
