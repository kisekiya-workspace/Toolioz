import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpen, Sparkles, Landmark, Code, FileText, Shield } from 'lucide-react';
import { JSONLD } from '@/components/ui/JSONLD';
import { Footer } from '@/components/layout/Footer';
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

const categoryColors: Record<string, string> = {
  finance: 'text-blue-600 bg-blue-50 border-blue-100',
  devtools: 'text-amber-600 bg-amber-50 border-amber-100',
  pdftools: 'text-rose-600 bg-rose-50 border-rose-100',
  security: 'text-emerald-600 bg-emerald-50 border-emerald-100',
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
    <main className="bg-[linear-gradient(180deg,#fffdf9_0%,#f8fafc_100%)] text-[var(--text-primary)] min-h-screen flex flex-col">
      <JSONLD data={itemListJsonLd} />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(37,99,235,0.08)_0%,transparent_35%),radial-gradient(circle_at_90%_20%,rgba(16,185,129,0.08)_0%,transparent_32%)]" />
        <div className="relative mx-auto max-w-6xl px-6 py-16 lg:py-24 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-blue-700 shadow-sm">
            <Sparkles size={14} className="animate-pulse" />
            Curated Top Lists
          </div>
          <h1 className="max-w-4xl mx-auto text-4xl font-black leading-tight tracking-[-0.03em] sm:text-5xl lg:text-6xl">
            Streamline your digital workflow with the best browser-native tools
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg leading-8 text-slate-600">
            Our expert comparison reviews evaluate free online developer utilities, finance planners,
            PDF systems, and cryptography helpers so you can choose the optimal tools for your goals.
          </p>

          <div className="mt-10 flex justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
            >
              Browse All Tools <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Grid of Articles */}
      <section className="flex-1 px-6 py-16 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 text-sm font-bold text-blue-700">
                <BookOpen size={18} />
                Expert Comparison Reviews
              </div>
              <h2 className="text-3xl font-black tracking-[-0.02em] md:text-4xl">
                Read our in-depth lists
              </h2>
            </div>
            <div className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-600 shadow-sm">
              100% Client-Side Processing • Ad-Free
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {top5Articles.map((article) => {
              const Icon = categoryIcons[article.category] || BookOpen;
              const colorClasses = categoryColors[article.category] || 'text-slate-600 bg-slate-50 border-slate-100';

              return (
                <Link
                  key={article.slug}
                  href={`/top5/${article.slug}`}
                  className="group flex h-full flex-col justify-between rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-blue-300 hover:shadow-2xl"
                >
                  <div>
                    <div className="mb-4 flex items-center justify-between">
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] ${colorClasses}`}>
                        <Icon size={12} />
                        {article.category}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">
                        {article.readTime}
                      </span>
                    </div>
                    <h3 className="text-2xl font-black tracking-[-0.02em] text-slate-950 transition-colors group-hover:text-blue-700 leading-snug">
                      {article.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {article.description}
                    </p>
                  </div>

                  <div className="mt-8 border-t border-slate-100 pt-6">
                    <div className="mb-4 flex flex-wrap gap-1.5">
                      {article.keywords.slice(0, 2).map((kw) => (
                        <span
                          key={kw}
                          className="rounded-md bg-slate-50 border border-slate-100 px-2 py-0.5 text-[0.6875rem] font-semibold text-slate-500"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                    <div className="inline-flex items-center gap-2 text-sm font-bold text-blue-700">
                      View Comparison <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
