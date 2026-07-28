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
      <PortalClient />
    </>
  );
}
