import { JSONLD } from '@/components/ui/JSONLD';
import { BreadcrumbJsonLd } from '@/components/ui/BreadcrumbJsonLd';
import BiodataStudioClient from '@/app/devtools/biodata-generator/BiodataStudioClient';
import { biodataFaqs, biodataKeywords } from '@/lib/biodata-content';
import { buildCalculatorJsonLd, buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Marriage Biodata Maker — Live Editor, PDF Download',
  description:
    'Builds an A4 PDF by embedding a PNG of the preview at pixel ratio 3 on a 595.28×841.89 point page.',
  path: '/biodata',
  keywords: biodataKeywords,
});

export default function BiodataPage() {
  const howToJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to create a marriage biodata PDF',
    description: 'Choose a template, fill the form, preview A4, and download a PDF.',
    step: [
      { '@type': 'HowToStep', name: 'Choose a template', text: 'There are 16 named templates. Communities are Hindu, Muslim, Sikh, Gujarati, and universal.' },
      { '@type': 'HowToStep', name: 'Fill details', text: 'Add photo, personal, family, and optional horoscope fields. Empty fields stay off the page.' },
      { '@type': 'HowToStep', name: 'Download', text: 'PNG uses html-to-image at pixel ratio 3. PDF places that PNG on a 595.28 by 841.89 point page.' },
    ],
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: biodataFaqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Marriage Biodata Maker', url: '/biodata' },
        ]}
      />
      <JSONLD
        data={buildCalculatorJsonLd({
          name: 'Marriage Biodata Maker',
          description: 'Browser-based marriage biodata editor with live A4 preview and PDF download.',
          path: '/biodata',
          applicationCategory: 'BusinessApplication',
        })}
      />
      <JSONLD data={howToJsonLd} />
      <JSONLD data={faqJsonLd} />
      <h1 className="sr-only">Marriage biodata maker</h1>
      <p className="sr-only">A marriage biodata is a one-page profile. This editor fills a template and downloads an A4 PDF. The form stays in this browser.</p>
      <BiodataStudioClient />
    </>
  );
}
