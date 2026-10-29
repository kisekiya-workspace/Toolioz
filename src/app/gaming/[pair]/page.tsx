import { notFound } from 'next/navigation';
import { JSONLD } from '@/components/ui/JSONLD';
import { buildBreadcrumbJsonLd, buildCalculatorJsonLd, buildHowToJsonLd, buildPageMetadata } from '@/lib/seo';
import { buildFaqJsonLd } from '@/lib/gaming/jsonld';
import { getSensitivityPair, SENSITIVITY_PAIRS } from '@/lib/gaming/sensitivity-pairs';
import SensitivityClient from '../mouse-sensitivity-converter/SensitivityClient';

export function generateStaticParams() {
  return SENSITIVITY_PAIRS.map((pair) => ({ pair: pair.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ pair: string }> }) {
  const { pair: slug } = await params;
  const pair = getSensitivityPair(slug);
  if (!pair) return {};
  return buildPageMetadata({
    title: pair.title,
    description: pair.description,
    path: `/gaming/${pair.slug}`,
    keywords: pair.keywords,
  });
}

export default async function Page({ params }: { params: Promise<{ pair: string }> }) {
  const { pair: slug } = await params;
  const pair = getSensitivityPair(slug);
  if (!pair) notFound();
  const path = `/gaming/${pair.slug}`;

  return (
    <>
      <JSONLD
        data={[
          buildCalculatorJsonLd({
            name: pair.title,
            description: pair.description,
            path,
            applicationCategory: 'GameApplication',
          }),
          buildHowToJsonLd({
            name: `How to use the ${pair.title}`,
            description: pair.directAnswer,
            path,
            steps: pair.howTo.map((text, index) => ({ name: `Step ${index + 1}`, text })),
          }),
          buildFaqJsonLd(pair.faqs),
          buildBreadcrumbJsonLd([
            { name: 'Gaming tools', url: '/gaming' },
            { name: 'Sensitivity converter', url: '/gaming/mouse-sensitivity-converter' },
            { name: pair.title, url: path },
          ]),
        ]}
      />
      <SensitivityClient pair={pair} />
    </>
  );
}
