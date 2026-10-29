import { JSONLD } from '@/components/ui/JSONLD';
import { buildBreadcrumbJsonLd, buildCalculatorJsonLd, buildHowToJsonLd } from '@/lib/seo';
import { buildFaqJsonLd } from '@/lib/gaming/jsonld';

export function ToolJsonLd({
  name,
  description,
  path,
  applicationCategory = 'UtilitiesApplication',
  steps,
  faqs,
  breadcrumbs,
}: {
  name: string;
  description: string;
  path: string;
  applicationCategory?: string;
  steps: Array<{ name: string; text: string }>;
  faqs: Array<{ question: string; answer: string }>;
  breadcrumbs: Array<{ name: string; url: string }>;
}) {
  return (
    <JSONLD
      data={[
        buildCalculatorJsonLd({ name, description, path, applicationCategory }),
        buildHowToJsonLd({ name: `How to use the ${name}`, description, path, steps }),
        buildFaqJsonLd(faqs),
        buildBreadcrumbJsonLd(breadcrumbs),
      ]}
    />
  );
}
