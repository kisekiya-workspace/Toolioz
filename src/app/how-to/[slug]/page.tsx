import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, BookOpen, Clock, Calendar, ShieldCheck } from 'lucide-react';
import { JSONLD } from '@/components/ui/JSONLD';
import { ReadingProgressBar } from '@/components/ui/ReadingProgressBar';
import { Footer } from '@/components/layout/Footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { howToPosts, getHowToPost } from '@/lib/howto-content';
import { buildArticleMetadata, SITE_URL } from '@/lib/seo';

type HowToPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return howToPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: HowToPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getHowToPost(slug);

  if (!post) {
    return {};
  }

  return buildArticleMetadata({
    title: `${post.title} | Toolioz`,
    description: post.description,
    path: `/how-to/${post.slug}`,
    keywords: post.keywords,
    modifiedTime: post.updatedIso,
  });
}

export default async function HowToDetailPage({ params }: HowToPageProps) {
  const { slug } = await params;
  const post = getHowToPost(slug);

  if (!post) {
    notFound();
  }

  const otherPosts = howToPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  // HowTo Schema Markup for SERP Rich Snippets
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: post.title,
    description: post.description,
    totalTime: post.totalTime || 'PT3M',
    step: post.steps.map((step, idx) => ({
      '@type': 'HowToStep',
      position: idx + 1,
      name: step.name,
      itemListElement: [
        {
          '@type': 'HowToDirection',
          text: step.text,
        },
      ],
    })),
  };

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    dateModified: post.updatedIso,
    author: {
      '@type': 'Organization',
      name: 'Toolioz Technical Guides',
      url: 'https://toolioz.com/about',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Toolioz',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/tooliozLogo.png`,
      },
    },
    mainEntityOfPage: `${SITE_URL}${post.directUrl}`,
  };

  const faqSchema =
    post.faqs && post.faqs.length > 0
      ? {
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
        }
      : null;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}` },
      { '@type': 'ListItem', position: 2, name: 'How-To Guides', item: `${SITE_URL}/how-to` },
      { '@type': 'ListItem', position: 3, name: post.title, item: `${SITE_URL}/how-to/${post.slug}` },
    ],
  };

  const schemas = [howToSchema, articleSchema, faqSchema, breadcrumbSchema].filter(Boolean);

  return (
    <div className="min-h-screen bg-white text-zinc-900 antialiased selection:bg-emerald-600 selection:text-white dark:bg-zinc-950 dark:text-zinc-100">
      <JSONLD data={schemas} />
      <ReadingProgressBar />

      {/* Article Header */}
      <header className="pt-8 pb-6 border-b border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="mb-3 flex items-center justify-between">
            <Link
              href="/how-to"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 transition-colors"
            >
              <ArrowLeft size={13} /> Back to Guides
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

          <p className="mt-3 text-sm sm:text-base text-zinc-600 dark:text-zinc-300 leading-relaxed">
            {post.description}
          </p>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8 sm:py-12 lg:grid lg:grid-cols-[180px_1fr] lg:gap-10 lg:items-start">
        
        {/* Sticky Table of Contents */}
        <aside className="hidden lg:block lg:sticky lg:top-20 space-y-4">
          <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400 mb-2">
            Contents
          </p>
          <nav className="space-y-1.5 border-l border-zinc-200 dark:border-zinc-800 pl-2.5">
            <a
              href="#step-by-step"
              className="block text-xs text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors leading-snug"
            >
              Step-by-Step
            </a>
            {post.sections.map((section, idx) => (
              <a
                key={section.heading}
                href={`#section-${idx + 1}`}
                className="block text-xs text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors leading-snug line-clamp-2"
              >
                {section.heading}
              </a>
            ))}
            {post.faqs && post.faqs.length > 0 && (
              <a
                href="#faqs"
                className="block text-xs text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors pt-1"
              >
                Q&A
              </a>
            )}
          </nav>

          <div className="pt-3">
            <Button asChild size="sm" className="w-full text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs">
              <Link href={post.toolHref}>
                Launch Tool <ArrowRight size={12} className="ml-1" />
              </Link>
            </Button>
          </div>
        </aside>

        {/* Article Body */}
        <article className="max-w-2xl">
          
          {/* Step by Step Section */}
          <section id="step-by-step" className="scroll-mt-20 mb-10">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 mb-5">
              Step-by-Step Instructions
            </h2>

            <div className="space-y-4">
              {post.steps.map((step, idx) => (
                <div
                  key={step.name}
                  className="flex gap-3.5 items-start p-3.5 rounded-xl border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/50"
                >
                  <div className="flex size-6 items-center justify-center rounded-full bg-emerald-600 text-white font-mono text-xs font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-zinc-950 dark:text-zinc-50">
                      {step.name}
                    </h3>
                    <p className="mt-1 text-xs sm:text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                      {step.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Core Deep-Dive Sections */}
          {post.sections.map((section, idx) => (
            <section
              key={section.heading}
              id={`section-${idx + 1}`}
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

          {/* Interactive Tool Banner */}
          <div className="my-8 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1 text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-0.5">
                <BookOpen size={13} /> Interactive Tool
              </div>
              <h3 className="text-base font-bold text-zinc-950 dark:text-zinc-50">
                {post.toolLabel}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Run this guide directly in your browser with 100% private processing.
              </p>
            </div>

            <Button asChild size="sm" className="shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs">
              <Link href={post.toolHref}>
                Open Tool <ArrowRight size={13} className="ml-1" />
              </Link>
            </Button>
          </div>

          {/* FAQ Section */}
          {post.faqs && post.faqs.length > 0 && (
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
          )}

          {/* Related How-To Guides */}
          <section className="mt-10 pt-6 border-t border-zinc-200 dark:border-zinc-800">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
                More Practical Guides
              </h2>
              <Link href="/how-to" className="text-xs font-semibold text-emerald-600 hover:underline">
                View all →
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {otherPosts.map((related) => (
                <Link
                  key={related.slug}
                  href={related.directUrl}
                  className="group block rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3.5 shadow-2xs hover:border-zinc-400 transition-all"
                >
                  <span className="text-[10px] font-mono text-zinc-400">
                    {related.readTime}
                  </span>
                  <h3 className="mt-1 text-xs font-semibold leading-snug text-zinc-950 dark:text-zinc-50 group-hover:text-emerald-600 transition-colors line-clamp-2">
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
