import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, Wrench } from 'lucide-react';
import { JSONLD } from '@/components/ui/JSONLD';
import { importedToolItems, importedTools } from '@/lib/sociials-tool-index';
import { buildItemListJsonLd, buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Free Online Tools | Calculators, Converters & Developer Utilities',
  description:
    'Use Toolioz free online calculators, converters, generators, PDF utilities, design tools, and developer utilities. Private browser-based tools with no sign-up.',
  path: '/tools',
  keywords: [
    'free online tools',
    'online calculators',
    'developer tools',
    'image converters',
    'PDF tools',
    'text tools',
  ],
});

export default function ToolsLibraryPage() {
  const categories = [...new Set(importedTools.map((tool) => tool.category))];
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Toolioz Free Online Tools Library',
    description: metadata.description,
    url: 'https://toolioz.com/tools',
    mainEntity: buildItemListJsonLd({
      name: 'Toolioz online tools',
      description: 'Free browser-based tools for finance, development, design, media, and productivity.',
      path: '/tools',
      items: importedToolItems,
    }),
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <JSONLD data={jsonLd} />
      <header className="mb-12 max-w-3xl">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700">
          <Wrench className="h-4 w-4" /> Toolioz Tools Library
        </div>
        <h1 className="text-4xl font-black tracking-tight sm:text-6xl">
          Free online tools for everyday work
        </h1>
        <p className="mt-5 text-lg leading-8 text-slate-600">
          Calculate, convert, generate, format, and create directly in your browser. Your inputs stay on your device whenever the tool supports local processing.
        </p>
      </header>

      <div className="space-y-12">
        {categories.map((category) => (
          <section key={category} aria-labelledby={`category-${category}`}>
            <h2 id={`category-${category}`} className="mb-5 text-2xl font-bold capitalize">
              {category} tools
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {importedTools
                .filter((tool) => tool.category === category)
                .map((tool) => (
                  <Link
                    key={tool.url}
                    href={tool.url}
                    className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-bold text-slate-900">{tool.name}</h3>
                      <ArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-600" />
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{tool.description}</p>
                  </Link>
                ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
