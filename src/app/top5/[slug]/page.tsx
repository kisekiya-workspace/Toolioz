import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, BookOpen, ExternalLink, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { JSONLD } from '@/components/ui/JSONLD';
import { Footer } from '@/components/layout/Footer';
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
      name: 'Toolioz',
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

  return (
    <main className="bg-[linear-gradient(180deg,#fffdf9_0%,#f8fafc_100%)] text-[var(--text-primary)] min-h-screen">
      <JSONLD data={articleJsonLd} />
      <JSONLD data={faqJsonLd} />

      <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <Link href="/top5" className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-blue-700 transition hover:text-blue-800">
          <ArrowLeft size={16} />
          Back to Top Lists
        </Link>

        {/* Article Intro Card */}
        <div className="rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm md:p-12">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-blue-700">
              {post.readTime}
            </span>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-emerald-700">
              Updated {post.updated}
            </span>
            <span className="rounded-full bg-slate-50 border border-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
              Category: {post.category}
            </span>
          </div>

          <h1 className="max-w-3xl text-3xl font-black leading-tight tracking-[-0.03em] md:text-5xl lg:text-6xl">
            {post.title}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-[var(--text-secondary)]">
            {post.description}
          </p>

          <div className="mt-8 flex flex-wrap gap-2">
            {post.keywords.map((keyword) => (
              <span key={keyword} className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                #{keyword}
              </span>
            ))}
          </div>
        </div>

        {/* Direct Answer TL;DR Quick Summary (AEO) */}
        <section className="mt-12 rounded-[2rem] border border-blue-200 bg-blue-50/50 p-8 shadow-sm">
          <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-blue-800">
            <Sparkles size={16} className="text-blue-700 shrink-0 animate-pulse" />
            <span>Direct Answer / TL;DR Quick Summary</span>
          </h2>
          <p className="mt-4 text-lg font-bold leading-8 text-blue-950">
            {post.tldr}
          </p>
        </section>

        {/* Intro Paragraph */}
        <div className="mt-12 rounded-[2rem] border border-slate-200 bg-white p-8 md:p-10 shadow-sm leading-relaxed">
          <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-blue-700 mb-4">
            <Sparkles size={16} />
            Executive Summary
          </h2>
          <p className="text-lg text-[var(--text-secondary)] leading-8">
            {post.intro}
          </p>
        </div>

        {/* Comparison Matrix Table (GEO) */}
        <section className="mt-12 rounded-[2rem] border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
          <h2 className="text-2xl font-black tracking-[-0.02em] mb-6">Comparison Matrix</h2>
          <div className="overflow-x-auto border border-slate-100 rounded-2xl">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-[0.1em] text-slate-500">
                    {post.tableHeaders[0]}
                  </th>
                  {post.tableHeaders.slice(1).map((h) => (
                    <th key={h} className="px-6 py-4 text-xs font-bold uppercase tracking-[0.1em] text-slate-500">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {post.tableRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-slate-900">
                      {row.toolName}
                    </td>
                    {row.values.map((v, vIdx) => (
                      <td key={vIdx} className="px-6 py-4 text-sm text-slate-600">
                        {v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Mathematical/Technical Proof Callout (GEO) */}
        {post.mathematicalProof && (
          <section className="mt-12 rounded-[2rem] border border-slate-200 bg-slate-950 p-8 text-white shadow-md">
            <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-blue-400 mb-4">
              <BookOpen size={16} />
              <span>Technical & Mathematical Proof</span>
            </h2>
            {post.mathematicalProof.formula && (
              <div className="mb-4 rounded-xl bg-white/5 border border-white/10 p-5 font-mono text-center text-lg md:text-xl text-blue-300 overflow-x-auto whitespace-nowrap">
                {post.mathematicalProof.formula}
              </div>
            )}
            <p className="text-sm leading-7 text-white/80">
              {post.mathematicalProof.explanation}
            </p>
          </section>
        )}

        {/* Comparison list section */}
        <div className="mt-16 space-y-12">
          <h2 className="text-3xl font-black tracking-[-0.02em]">
            Ranked Recommendations
          </h2>
          <div className="space-y-8">
            {post.tools.map((tool) => (
              <div key={tool.id} className="relative rounded-[2rem] border border-slate-200 bg-white p-8 shadow-md transition hover:border-slate-300 hover:shadow-lg">
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Rank badge */}
                  <div 
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl font-black text-white"
                    style={{ backgroundColor: tool.color }}
                  >
                    #{tool.rank}
                  </div>

                  <div className="flex-1">
                    <h3 className="text-2xl font-black tracking-[-0.02em]">{tool.title}</h3>
                    
                    <p className="mt-3 text-base leading-7 text-[var(--text-secondary)]">
                      {tool.description}
                    </p>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      <div className="rounded-xl bg-slate-50 border border-slate-100 p-4">
                        <h4 className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500 mb-1">
                          Why It Matters
                        </h4>
                        <p className="text-sm leading-6 text-slate-600">
                          {tool.whyItMatters}
                        </p>
                      </div>

                      <div className="rounded-xl bg-slate-50 border border-slate-100 p-4">
                        <h4 className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500 mb-1">
                          Best For
                        </h4>
                        <p className="text-sm leading-6 text-slate-600">
                          {tool.bestFor}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-5">
                      <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                        <CheckCircle2 size={14} /> Client-Side Safe
                      </span>
                      <Link
                        href={tool.href}
                        className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white transition hover:scale-[1.02]"
                        style={{ backgroundColor: tool.color }}
                      >
                        Open Interactive Tool <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed context articles */}
        <div className="mt-16 space-y-12">
          {post.sections.map((section) => (
            <section key={section.heading} className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm md:p-10">
              <h2 className="text-2xl font-black tracking-[-0.02em] md:text-3xl">{section.heading}</h2>
              <div className="mt-6 space-y-6">
                {section.body.map((paragraph) => (
                  <p key={paragraph} className="text-base leading-8 text-[var(--text-secondary)]">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Glossary Definition List (AEO/GEO) */}
        <section className="mt-12 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-black tracking-[-0.02em] mb-6">Key Term Glossary</h2>
          <dl className="grid gap-6 md:grid-cols-2">
            {post.glossary.map((item) => (
              <div key={item.term} className="rounded-xl border border-slate-100 bg-slate-50/50 p-5">
                <dt className="text-base font-bold text-slate-900 mb-2">
                  <dfn className="not-italic font-black text-blue-800">{item.term}</dfn>
                </dt>
                <dd className="text-sm leading-6 text-slate-600">
                  {item.definition}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Privacy Note */}
        <section className="mt-12 rounded-[2rem] border border-emerald-100 bg-emerald-50/50 p-6 md:p-8">
          <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-emerald-700">
            <ShieldCheck size={18} />
            Data Protection Guarantee
          </h2>
          <h3 className="mt-3 text-xl font-bold">100% Browser-Local Execution</h3>
          <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
            Toolioz runs entirely within your device's browser memory. Your personal text outputs, keys, documents, numbers, and inputs are never uploaded to any remote database. You can read, format, calculate, and compile safely.
          </p>
        </section>

        {/* References Section */}
        <section className="mt-12 rounded-[2rem] border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
          <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-blue-700">
            <ExternalLink size={16} />
            Official Research Sources
          </h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {post.sources.map((source) => (
              <a
                key={`${source.label}-${source.href}`}
                href={source.href}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-800"
              >
                {source.label}
              </a>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mt-12">
          <h2 className="text-2xl font-extrabold mb-5">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {post.faqs.map((faq) => (
              <div key={faq.question} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="font-bold text-base">{faq.question}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Other comparison lists */}
        <section className="mt-16 border-t border-slate-200 pt-12">
          <h2 className="mb-6 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-slate-400">
            <ArrowRight size={14} />
            Explore More Top Lists
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {otherArticles.map((related) => (
              <Link
                key={related.slug}
                href={`/top5/${related.slug}`}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
              >
                <div className="text-xs font-bold uppercase tracking-[0.12em] text-blue-600">
                  {related.readTime}
                </div>
                <h3 className="mt-2 text-base font-black leading-snug">{related.title}</h3>
                <p className="mt-2 text-xs leading-5 text-[var(--text-secondary)] line-clamp-2">
                  {related.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </article>

      <Footer />
    </main>
  );
}
