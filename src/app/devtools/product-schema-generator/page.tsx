import Link from 'next/link';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'Product schema generator',
  description: 'Alias of the schema generator. Product JSON-LD needs a name, price, and currency.',
  path: '/devtools/product-schema-generator',
});

export default function ProductSchemaAliasPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">Product schema generator</h1>
      <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
        This address is a permanent alias of the schema markup generator. One page can emit FAQ, HowTo, or Product JSON-LD. Product needs a name, price, and currency.
      </p>
      <p className="mt-6">
        <Link href="/devtools/schema-markup-generator" className="font-semibold text-[#0072F5] underline underline-offset-2">
          Open the schema generator
        </Link>
      </p>
    </main>
  );
}
