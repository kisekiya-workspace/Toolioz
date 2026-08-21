import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, BookOpen, Clock, Calendar, ExternalLink, ShieldCheck } from 'lucide-react';
import { JSONLD } from '@/components/ui/JSONLD';
import { ReadingProgressBar } from '@/components/ui/ReadingProgressBar';
import { Footer } from '@/components/layout/Footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { standaloneBlogs, getStandaloneBlog } from '@/../blogs';
import { buildArticleMetadata, buildBreadcrumbJsonLd } from '@/lib/seo';

type BlogPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return standaloneBlogs.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getStandaloneBlog(slug);

  if (!post) {
    return {};
  }

  return buildArticleMetadata({
    title: `${post.title} | Toolioz Research`,
    description: post.description,
    path: `/blog/${post.slug}`,
    keywords: post.keywords,
    modifiedTime: post.updatedIso,
  });
}

export default async function StandaloneBlogPostPage({ params }: BlogPageProps) {
  const { slug } = await params;
  const post = getStandaloneBlog(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = standaloneBlogs
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
      name: 'Toolioz Research',
      url: 'https://toolioz.com/about',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Toolioz',
      logo: {
        '@type': 'ImageObject',
        url: 'https://toolioz.com/tooliozLogo.png',
      },
    },
    mainEntityOfPage: `https://toolioz.com/blog/${post.slug}`,
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

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog' },
    { name: post.title, url: `/blog/${post.slug}` },
  ]);

  return (
    <div className="min-h-screen bg-white text-zinc-900 antialiased selection:bg-blue-600 selection:text-white dark:bg-zinc-950 dark:text-zinc-100">
      <JSONLD data={[articleJsonLd, faqJsonLd, breadcrumbJsonLd]} />
      <ReadingProgressBar />

      {/* Article Header */}
      <header className="pt-8 pb-6 border-b border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="mb-3 flex items-center justify-between">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 transition-colors"
            >
              <ArrowLeft size={13} /> Back to Articles
            </Link>
            <div className="flex items-center gap-3 text-xs font-mono text-zinc-400">
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

          {/* Lead Abstract */}
          <p className="mt-3 text-sm sm:text-base text-zinc-600 dark:text-zinc-300 leading-relaxed">
            {post.description}
          </p>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8 sm:py-12 lg:grid lg:grid-cols-[180px_1fr] lg:gap-10 lg:items-start">
        
        {/* Sticky Minimal Table of Contents */}
        <aside className="hidden lg:block lg:sticky lg:top-20 space-y-4">
          <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400 mb-2">
            Chapters
          </p>
          <nav className="space-y-1.5 border-l border-zinc-200 dark:border-zinc-800 pl-2.5">
            {post.sections.map((section, idx) => (
              <a
                key={section.heading}
                href={`#chapter-${idx + 1}`}
                className="block text-xs text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors leading-snug line-clamp-2"
              >
                0{idx + 1}. {section.heading}
              </a>
            ))}
            <a
              href="#faqs"
              className="block text-xs text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors pt-1"
            >
              Q&A
            </a>
            <a
              href="#references"
              className="block text-xs text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
            >
              References
            </a>
          </nav>

          <div className="pt-3">
            <Button asChild size="sm" className="w-full text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white">
              <Link href={post.toolHref}>
                Launch Tool <ArrowRight size={12} className="ml-1" />
              </Link>
            </Button>
          </div>
        </aside>

        {/* Article Prose Flow */}
        <article className="max-w-2xl">
          
          {post.sections.map((section, idx) => (
            <section
              key={section.heading}
              id={`chapter-${idx + 1}`}
              className="scroll-mt-20 mb-10 border-b border-zinc-100 dark:border-zinc-800/80 pb-8 last:border-0"
            >
              <div className="mb-1 text-[11px] font-mono font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Chapter 0{idx + 1}
              </div>

              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 mb-4 leading-tight">
                {section.heading}
              </h2>

              <div className="space-y-4 text-zinc-700 dark:text-zinc-300 text-[15px] sm:text-base leading-relaxed">
                {section.body.map((paragraph, pIdx) => (
                  <p key={pIdx}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}

          {/* Clean Interactive Action Banner */}
          <div className="my-8 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1 text-xs font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-0.5">
                <BookOpen size={13} /> Interactive Tool
              </div>
              <h3 className="text-base font-bold text-zinc-950 dark:text-zinc-50">
                {post.toolLabel}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Run live calculations in browser RAM with 0 latency.
              </p>
            </div>

            <Button asChild size="sm" className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white font-semibold">
              <Link href={post.toolHref}>
                Open Tool <ArrowRight size={13} className="ml-1" />
              </Link>
            </Button>
          </div>

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

          {/* Academic / Documentation Sources */}
          <section id="references" className="scroll-mt-20 mt-10 pt-6 border-t border-zinc-200 dark:border-zinc-800">
            <h2 className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 mb-3">
              <ExternalLink size={13} /> References
            </h2>

            <div className="grid gap-2 sm:grid-cols-2">
              {post.sources.map((source) => (
                <a
                  key={`${source.label}-${source.href}`}
                  href={source.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 transition-colors"
                >
                  <span className="truncate pr-2">{source.label}</span>
                  <ExternalLink size={11} className="shrink-0 text-zinc-400" />
                </a>
              ))}
            </div>
          </section>

          {/* Related Articles */}
          <section className="mt-10 pt-6 border-t border-zinc-200 dark:border-zinc-800">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
                Related Articles
              </h2>
              <Link href="/blog" className="text-xs font-semibold text-blue-600 hover:underline">
                View all →
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {relatedPosts.map((related) => (
                <Link
                  key={related.slug}
                  href={`/blog/${related.slug}`}
                  className="group block rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3.5 hover:border-zinc-400 transition-all"
                >
                  <span className="text-[10px] font-mono text-zinc-400">
                    {related.readTime}
                  </span>
                  <h3 className="mt-1 text-xs font-semibold leading-snug text-zinc-950 dark:text-zinc-50 group-hover:text-blue-600 transition-colors line-clamp-2">
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
