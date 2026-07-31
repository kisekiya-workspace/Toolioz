import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, BookOpen, Clock, ExternalLink, List, ShieldCheck, Sparkles } from 'lucide-react';
import { JSONLD } from '@/components/ui/JSONLD';
import { ReadingProgressBar } from '@/components/ui/ReadingProgressBar';
import { Footer } from '@/components/layout/Footer';
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
      name: 'Toolioz Quantitative Research',
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
    <main className="min-h-screen bg-white text-slate-900 antialiased selection:bg-blue-600 selection:text-white">
      <JSONLD data={[articleJsonLd, faqJsonLd, breadcrumbJsonLd]} />
      <ReadingProgressBar />

      {/* Glassmorphic Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-3.5">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-blue-700 transition hover:text-blue-900"
          >
            <ArrowLeft size={16} /> All Masterclass Articles
          </Link>
          <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
            <span className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-slate-700">
              <Clock size={13} className="text-blue-600" /> {post.readTime}
            </span>
            <span className="hidden sm:inline-block text-slate-300">•</span>
            <span className="hidden sm:inline-block font-semibold text-slate-400">Updated {post.updated}</span>
          </div>
        </div>
      </header>

      {/* Hero Header Section */}
      <section className="border-b border-slate-100 bg-slate-50/50 py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-4 py-1.5 text-xs font-black uppercase tracking-[0.16em] text-blue-800 border border-blue-200">
              <Sparkles size={13} /> Masterclass Essay
            </span>
            <span className="rounded-full bg-slate-200/70 px-3.5 py-1 text-xs font-bold text-slate-700">
              Toolioz Research Series
            </span>
          </div>

          <h1 className="text-3xl font-black leading-[1.12] tracking-[-0.035em] text-slate-950 sm:text-5xl lg:text-6xl">
            {post.title}
          </h1>

          {/* Direct Answer / Quick Takeaway Block for AEO Extraction */}
          <section className="mt-6 rounded-2xl border border-blue-200 bg-blue-50/70 p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-blue-800 mb-2">
              <Sparkles size={16} className="text-blue-600 shrink-0" />
              <span>Direct Answer / Quick Takeaway</span>
            </h2>
            <p className="text-base font-bold leading-relaxed text-blue-950">
              {post.description}
            </p>
          </section>

          <div className="mt-8 flex flex-wrap gap-2 pt-2 border-t border-slate-200/60">
            {post.keywords.map((keyword) => (
              <span
                key={keyword}
                className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-600 shadow-2xs"
              >
                #{keyword}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Main Reading Layout */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:grid lg:grid-cols-[280px_1fr] lg:gap-16 lg:items-start">
        
        {/* Left Sticky Sidebar */}
        <aside className="hidden lg:block lg:sticky lg:top-24 space-y-6 lg:pr-2">
          
          {/* Table of Contents */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5">
            <h2 className="mb-4 flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-slate-500">
              <List size={14} className="text-blue-600" /> Chapters
            </h2>
            <nav className="space-y-3 text-xs leading-5">
              {post.sections.map((section, idx) => (
                <a
                  key={section.heading}
                  href={`#chapter-${idx + 1}`}
                  className="group flex items-start gap-2 font-semibold text-slate-600 transition hover:text-blue-700"
                >
                  <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[0.65rem] font-bold text-blue-800 shrink-0 group-hover:bg-blue-600 group-hover:text-white transition">
                    0{idx + 1}
                  </span>
                  <span className="group-hover:translate-x-0.5 transition-transform line-clamp-2">{section.heading}</span>
                </a>
              ))}
            </nav>
          </div>

          {/* Interactive Tool Widget */}
          <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-slate-900 to-blue-950 p-5 text-white shadow-md">
            <div className="text-[0.7rem] font-black uppercase tracking-[0.18em] text-blue-300 mb-2">
              Interactive Execution Engine
            </div>
            <div className="text-sm font-black text-white">{post.toolLabel}</div>
            <p className="mt-2 text-xs leading-5 text-slate-300">
              Run live calculations or image conversions using our privacy-first client tool.
            </p>
            <Link
              href={post.toolHref}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2 text-xs font-black text-white shadow-sm transition hover:bg-blue-500"
            >
              Launch Engine <ArrowRight size={14} />
            </Link>
          </div>

          {/* Client-Side Privacy Badge */}
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-950">
              <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
              <span>100% Client-Side Privacy</span>
            </div>
            <p className="mt-2 text-[0.75rem] leading-5 text-emerald-800">
              Calculations and processing operate strictly inside local browser tab memory.
            </p>
          </div>

        </aside>

        {/* Right Main Article Article Flow (No Cards Wrapper) */}
        <main className="max-w-3xl space-y-16">
          
          {/* Chapter Sections (Natural Prose Flow) */}
          {post.sections.map((section, idx) => (
            <section
              key={section.heading}
              id={`chapter-${idx + 1}`}
              className="scroll-mt-28 border-b border-slate-200/80 pb-12 last:border-0"
            >
              <div className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-blue-600">
                <span>Chapter 0{idx + 1}</span>
                <span>•</span>
                <span className="text-slate-400 font-semibold">Masterclass</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-[-0.03em] text-slate-950 mb-6 leading-tight">
                {section.heading}
              </h2>

              <div className="space-y-6 text-base sm:text-lg leading-8 sm:leading-9 text-slate-700 font-normal">
                {section.body.map((paragraph, pIdx) => (
                  <p key={pIdx}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}

          {/* Interactive Tool Execution Banner */}
          <section className="my-12 rounded-3xl border border-blue-200 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 p-8 sm:p-10 text-white shadow-xl">
            <div className="mb-3 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-blue-300">
              <BookOpen size={14} /> Practical Tool Execution
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-white">
              {post.toolLabel}
            </h3>

            <p className="mt-3 text-base leading-7 text-slate-300">
              Apply the mathematical model or visual transformation from this guide using our fast, privacy-first interactive engine.
            </p>

            <div className="mt-6">
              <Link
                href={post.toolHref}
                className="inline-flex items-center gap-2 rounded-full bg-blue-500 px-7 py-3.5 text-sm font-black text-white shadow-md transition hover:bg-blue-400"
              >
                Launch Interactive Tool <ArrowRight size={16} />
              </Link>
            </div>
          </section>

          {/* FAQ Section (Clean Natural Layout) */}
          <section className="pt-4 border-t border-slate-200">
            <div className="mb-8">
              <div className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">
                Questions & Answers
              </div>
              <h2 className="mt-1 text-2xl sm:text-3xl font-black text-slate-950">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-6">
              {post.faqs.map((faq) => (
                <div
                  key={faq.question}
                  className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6"
                >
                  <h3 className="text-base sm:text-lg font-bold text-slate-950">
                    {faq.question}
                  </h3>
                  <p className="mt-2 text-sm sm:text-base leading-7 text-slate-600">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Research & Bibliography */}
          <section className="pt-8 border-t border-slate-200">
            <h2 className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-emerald-700 mb-6">
              <ExternalLink size={14} /> Research Sources & Academic Bibliography
            </h2>

            <div className="grid gap-3 sm:grid-cols-2">
              {post.sources.map((source) => (
                <a
                  key={`${source.label}-${source.href}`}
                  href={source.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-xs font-bold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-900"
                >
                  <span className="truncate pr-2">{source.label}</span>
                  <ExternalLink size={14} className="shrink-0 text-slate-400" />
                </a>
              ))}
            </div>
          </section>

          {/* Related Masterclasses */}
          <section className="pt-8 border-t border-slate-200">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                More Flagship Masterclasses
              </h2>
              <Link href="/blog" className="text-xs font-bold text-blue-700 transition hover:text-blue-900">
                View All Articles →
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              {relatedPosts.map((related) => (
                <Link
                  key={related.slug}
                  href={`/blog/${related.slug}`}
                  className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-md"
                >
                  <div>
                    <span className="text-[0.7rem] font-bold uppercase tracking-wider text-blue-600">
                      {related.readTime}
                    </span>
                    <h3 className="mt-2 text-sm font-black leading-snug text-slate-950 group-hover:text-blue-700">
                      {related.title}
                    </h3>
                  </div>

                  <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.14em] text-blue-700">
                    Read Essay <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </div>
          </section>

        </main>
      </div>

      <Footer />
    </main>
  );
}
