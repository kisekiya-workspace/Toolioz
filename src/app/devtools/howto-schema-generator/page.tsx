import Link from 'next/link';
import { buildPageMetadata } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: 'HowTo schema generator',
  description: 'Alias of the schema generator. HowTo JSON-LD is one of the three types on that page.',
  path: '/devtools/howto-schema-generator',
});

export default function HowToSchemaAliasPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">HowTo schema generator</h1>
      <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
        This address is a permanent alias of the schema markup generator. One page can emit FAQ, HowTo, or Product JSON-LD. HowTo needs a name and steps.
      </p>
      <p className="mt-6">
        <Link href="/devtools/schema-markup-generator" className="font-semibold text-[#0072F5] underline underline-offset-2">
          Open the schema generator
        </Link>
      </p>
    </main>
  );
}
