import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, Clock } from 'lucide-react';
import { JSONLD } from '@/components/ui/JSONLD';
import { ReadingProgressBar } from '@/components/ui/ReadingProgressBar';
import { Footer } from '@/components/layout/Footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import { top5Articles, getTop5Article } from '@/lib/top5-content';
import { buildArticleMetadata, SITE_URL } from '@/lib/seo';

type Top5PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return top5Articles.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Top5PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getTop5Article(slug);

  if (!post) {
    return {};
  }

  return buildArticleMetadata({
    title: `${post.title} | Toolioz`,
    description: post.description,
    path: `/top5/${post.slug}`,
    keywords: post.keywords,
    modifiedTime: post.updatedIso,
  });
}

export default async function Top5BlogPostPage({ params }: Top5PageProps) {
  const { slug } = await params;
  const post = getTop5Article(slug);

  if (!post) {
    notFound();
  }

  const otherArticles = top5Articles
    .filter((entry) => entry.slug !== post.slug)
    .slice(0, 3);

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    dateModified: post.updatedIso,
    author: {
      '@type': 'Organization',
      name: 'Toolioz Editorial Team',
      url: `${SITE_URL}/editorial-policy`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Toolioz',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/tooliozLogo.png`,
      },
    },
    mainEntityOfPage: `${SITE_URL}/top5/${post.slug}`,
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: post.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}` },
      { '@type': 'ListItem', position: 2, name: 'Top 5 Lists', item: `${SITE_URL}/top5` },
      { '@type': 'ListItem', position: 3, name: post.title, item: `${SITE_URL}/top5/${post.slug}` },
    ],
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 antialiased selection:bg-indigo-600 selection:text-white dark:bg-zinc-950 dark:text-zinc-100">
      <JSONLD data={[articleJsonLd, faqJsonLd, breadcrumbJsonLd]} />
      <ReadingProgressBar />

      {/* Article Header */}
      <header className="pt-8 pb-6 border-b border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="mb-3 flex items-center justify-between">
            <Link
              href="/top5"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 transition-colors"
            >
              <ArrowLeft size={13} /> Back to Top 5 Reviews
            </Link>
            <div className="flex items-center gap-3 text-xs font-mono text-zinc-400">
              <Link href="/editorial-policy" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                Toolioz Editorial Team
              </Link>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock size={12} /> {post.readTime}
              </span>
              <span>•</span>
              <span>{post.updated}</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50 leading-snug">
            {post.title}
          </h1>

          <p className="mt-3 text-sm sm:text-base text-zinc-600 dark:text-zinc-300 leading-relaxed">
            {post.description}
          </p>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8 sm:py-12 lg:grid lg:grid-cols-[180px_1fr] lg:gap-10 lg:items-start">
        
        {/* Sticky Sidebar */}
        <aside className="hidden lg:block lg:sticky lg:top-20 space-y-4">
          <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400 mb-2">
            Sections
          </p>
          <nav className="space-y-1.5 border-l border-zinc-200 dark:border-zinc-800 pl-2.5">
            <a
              href="#comparison-table"
              className="block text-xs text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors leading-snug"
            >
              Matrix
            </a>
            <a
              href="#top-picks"
              className="block text-xs text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors leading-snug"
            >
              Ranked Picks
            </a>
            {post.sections.map((section, idx) => (
              <a
                key={section.heading}
                href={`#guide-section-${idx + 1}`}
                className="block text-xs text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors leading-snug line-clamp-2"
              >
                {section.heading}
              </a>
            ))}
            <a
              href="#faqs"
              className="block text-xs text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors pt-1"
            >
              Q&A
            </a>
          </nav>
        </aside>

        {/* Main Article Body */}
        <article className="max-w-2xl">
          
          {/* Executive Summary */}
          <div className="mb-8 border-l-2 border-indigo-600 pl-3.5 py-0.5">
            <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
              Summary
            </p>
            <p className="text-sm sm:text-base text-zinc-800 dark:text-zinc-200 leading-relaxed font-medium">
              {post.tldr}
            </p>
          </div>

          {/* Comparison Table Section */}
          <section id="comparison-table" className="scroll-mt-20 mb-10">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 mb-4">
              Comparison Matrix
            </h2>

            <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
                  <tr>
                    <th className="py-2.5 px-3.5 font-bold text-zinc-900 dark:text-zinc-100">Tool / Feature</th>
                    {post.tableHeaders.map((header) => (
                      <th key={header} className="py-2.5 px-3.5 font-bold text-zinc-900 dark:text-zinc-100">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {post.tableRows.map((row) => (
                    <tr key={row.toolName} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                      <td className="py-2.5 px-3.5 font-semibold text-zinc-950 dark:text-zinc-50">{row.toolName}</td>
                      {row.values.map((val, vIdx) => (
                        <td key={vIdx} className="py-2.5 px-3.5 text-zinc-600 dark:text-zinc-400">
                          {val}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Top Tools Ranked Breakdown */}
          <section id="top-picks" className="scroll-mt-20 mb-10 space-y-5">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 mb-4">
              Detailed Evaluations
            </h2>

            {post.tools.map((tool) => (
              <div
                key={tool.id}
                className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 sm:p-5"
              >
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="flex size-6 items-center justify-center rounded-full bg-indigo-600 text-white font-mono text-xs font-bold">
                      {tool.rank}
                    </span>
                    <h3 className="text-base font-bold text-zinc-950 dark:text-zinc-50">
                      {tool.title}
                    </h3>
                  </div>

                  <Badge variant="mono" size="sm">
                    {tool.bestFor}
                  </Badge>
                </div>

                <p className="text-xs sm:text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 mt-2">
                  {tool.description}
                </p>

                <div className="mt-3 pt-2.5 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">
                    <strong className="text-zinc-900 dark:text-zinc-100 font-medium">Why:</strong> {tool.whyItMatters}
                  </div>
                  <Button asChild size="sm" className="ml-3 shrink-0 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">
                    <Link href={tool.href}>
                      Launch <ArrowRight size={11} className="ml-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </section>

          {/* Mathematical Proof or Technical Architecture */}
          {post.mathematicalProof && (
            <section className="mb-10 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-4 sm:p-5">
              <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
                Verification Formula
              </div>
              <h3 className="text-base font-bold text-zinc-950 dark:text-zinc-50 mb-2">
                Algorithm & Proof
              </h3>
              {post.mathematicalProof.formula && (
                <div className="my-2 rounded-md bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3 font-mono text-xs overflow-x-auto text-zinc-900 dark:text-zinc-100">
                  {post.mathematicalProof.formula}
                </div>
              )}
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {post.mathematicalProof.explanation}
              </p>
            </section>
          )}

          {/* Context Sections */}
          {post.sections.map((section, idx) => (
            <section
              key={section.heading}
              id={`guide-section-${idx + 1}`}
              className="scroll-mt-20 mb-10 border-b border-zinc-100 dark:border-zinc-800/80 pb-8 last:border-0"
            >
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 mb-3">
                {section.heading}
              </h2>

              <div className="space-y-3 text-zinc-700 dark:text-zinc-300 text-sm sm:text-base leading-relaxed">
                {section.body.map((paragraph, pIdx) => (
                  <p key={pIdx}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}

          {/* Frequently Asked Questions */}
          <section id="faqs" className="scroll-mt-20 mt-10 pt-8 border-t border-zinc-200 dark:border-zinc-800">
            <div className="mb-4">
              <h2 className="text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {post.faqs.map((faq) => (
                <div key={faq.question} className="py-4">
                  <h3 className="text-sm sm:text-base font-semibold text-zinc-950 dark:text-zinc-50">
                    {faq.question}
                  </h3>
                  <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Related Articles */}
          <section className="mt-10 pt-6 border-t border-zinc-200 dark:border-zinc-800">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
                More Top 5 Guides
              </h2>
              <Link href="/top5" className="text-xs font-semibold text-indigo-600 hover:underline">
                View all →
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {otherArticles.map((related) => (
                <Link
                  key={related.slug}
                  href={`/top5/${related.slug}`}
                  className="group block rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3.5 hover:border-zinc-400 transition-all"
                >
                  <span className="text-[10px] font-mono text-zinc-400">
                    {related.readTime}
                  </span>
                  <h3 className="mt-1 text-xs font-semibold leading-snug text-zinc-950 dark:text-zinc-50 group-hover:text-indigo-600 transition-colors line-clamp-2">
                    {related.title}
                  </h3>
                </Link>
              ))}
            </div>
          </section>

        </article>
      </div>

      <Footer />
    </div>
  );
}
