import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpen, Sparkles, Landmark, Code, FileText, Shield } from 'lucide-react';
import { JSONLD } from '@/components/ui/JSONLD';
import { Footer } from '@/components/layout/Footer';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/Card';
import { top5Articles } from '@/lib/top5-content';
import { SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Top Tools Guides | Best Financial & Web Developer Utilities | Toolioz',
  description:
    'Read our curated Top 5 reviews for personal finance calculators, web developer utilities, PDF document tools, and encryption helpers to streamline your digital workflows.',
  keywords: [
    'best tools list',
    'top 5 finance calculators',
    'essential developer tools',
    'top online pdf utilities',
    'best security tools developer'
  ],
  alternates: {
    canonical: `${SITE_URL}/top5`,
  },
  openGraph: {
    title: 'Top Tools Guides | Toolioz',
    description:
      'Curated lists of top finance calculators, developer formatting scripts, PDF utilities, and hashing generators.',
    url: `${SITE_URL}/top5`,
    type: 'website',
  },
};

const categoryIcons: Record<string, any> = {
  finance: Landmark,
  devtools: Code,
  pdftools: FileText,
  security: Shield,
};

export default function Top5IndexPage() {
  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Toolioz Top Tools Guides',
    description: 'Curated lists of top finance calculators, developer formatting scripts, PDF utilities, and hashing generators.',
    url: `${SITE_URL}/top5`,
    numberOfItems: top5Articles.length,
    itemListElement: top5Articles.map((post, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${SITE_URL}/top5/${post.slug}`,
      name: post.title,
    })),
  };

  return (
    <main className="min-h-screen bg-white text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50 flex flex-col justify-between">
      <JSONLD data={itemListJsonLd} />

      <div>
        {/* Hero Section */}
        <section className="relative border-b border-zinc-200 bg-white vercel-grid py-16 sm:py-20 md:py-28 text-center dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <Badge variant="outline" dot pulse size="sm" className="mb-4 font-mono text-[11px]">
              <Sparkles size={12} className="mr-1 text-amber-500" />
              Curated Top 5 Comparisons
            </Badge>

            <h1 className="mb-5 text-4xl font-extrabold tracking-tight text-zinc-950 sm:text-6xl dark:text-zinc-50">
              Streamline Your Workflow with the Best Browser Tools
            </h1>

            <p className="mx-auto max-w-2xl text-base leading-relaxed text-zinc-600 sm:text-lg dark:text-zinc-400">
              Expert comparisons evaluating free developer utilities, finance engines, PDF systems, and cryptography helpers.
            </p>
          </div>
        </section>

        {/* Grid of Articles */}
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mb-10 flex items-center justify-between border-b border-zinc-200/80 pb-4 dark:border-zinc-800">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-zinc-950 sm:text-3xl dark:text-zinc-50">
                In-Depth Comparison Lists
              </h2>
              <p className="text-xs text-zinc-500 sm:text-sm mt-1 dark:text-zinc-400">
                Benchmark reviews comparing performance, privacy, and feature sets.
              </p>
            </div>
            <Badge variant="mono" size="sm">
              {top5Articles.length} Guides
            </Badge>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {top5Articles.map((article) => {
              const Icon = categoryIcons[article.category] || BookOpen;

              return (
                <Link
                  key={article.slug}
                  href={`/top5/${article.slug}`}
                  className="group block h-full"
                >
                  <Card hoverable className="h-full p-6 flex flex-col justify-between">
                    <div>
                      <div className="mb-3 flex items-center justify-between">
                        <Badge variant="secondary" size="sm" className="gap-1 font-mono text-[10px]">
                          <Icon size={11} />
                          <span>{article.category}</span>
                        </Badge>
                        <span className="text-[11px] font-mono text-zinc-400">
                          {article.readTime}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-zinc-950 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2 leading-snug line-clamp-2 dark:text-zinc-50">
                        {article.title}
                      </h3>

                      <p className="text-xs text-zinc-500 line-clamp-3 leading-relaxed dark:text-zinc-400">
                        {article.description}
                      </p>
                    </div>

                    <div className="mt-6 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {article.keywords.slice(0, 2).map((kw) => (
                          <span key={kw} className="font-mono text-[10px] text-zinc-400">
                            #{kw}
                          </span>
                        ))}
                      </div>
                      <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:underline inline-flex items-center gap-0.5">
                        Compare <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </main>
      </div>

      <Footer />
    </main>
  );
}
