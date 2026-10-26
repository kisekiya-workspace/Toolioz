import React from 'react';
import { JSONLD } from '@/components/ui/JSONLD';
import PortalClient from './PortalClient';
import { buildItemListJsonLd, buildPageMetadata, buildWebsiteJsonLd, allToolItems } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Free Finance Calculators, Developer & PDF Tools',
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
        text: 'Yes. Listed calculators and utilities can be used without an account or paywall. Advertising, when approved, does not change calculator outputs.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is user data secure on Toolioz?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'When a page is labelled local processing, tool inputs and files stay in the browser. The site still loads page assets and analytics. The privacy policy lists those requests.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do Toolioz financial formulas match real-world bank standards?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Toolioz documents the formula and assumptions used by its published financial calculators. Results are educational estimates and should be checked against current rules or a qualified professional before a financial decision.',
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
