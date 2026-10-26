import Link from 'next/link';
import { buildPageMetadata } from '@/lib/seo';

const copy = 'This address is a permanent alias of the schema markup generator. One page can emit FAQ, HowTo, or Product JSON-LD. FAQ needs questions and answers. HowTo needs steps. Product needs a name, price, and currency.';

export const metadata = buildPageMetadata({
  title: 'FAQ schema generator',
  description: 'Alias of the schema generator. FAQ JSON-LD is one of the three types on that page.',
  path: '/devtools/faq-schema-generator',
});

export default function FaqSchemaAliasPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">FAQ schema generator</h1>
      <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">{copy}</p>
      <p className="mt-6">
        <Link href="/devtools/schema-markup-generator" className="font-semibold text-[#0072F5] underline underline-offset-2">
          Open the schema generator
        </Link>
      </p>
    </main>
  );
}
