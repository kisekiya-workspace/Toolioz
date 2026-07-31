import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { JSONLD } from '@/components/ui/JSONLD';
import { biodataPosts, getBiodataPost } from '@/lib/biodata-content';
import { buildBreadcrumbJsonLd } from '@/lib/seo';
import { Sparkles } from 'lucide-react';

type BlogPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return biodataPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBiodataPost(slug);

  if (!post) {
    return {};
  }

  return {
    title: `${post.title} | Toolioz`,
    description: post.description,
    keywords: post.keywords,
    alternates: {
      canonical: `https://toolioz.com/biodata/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://toolioz.com/biodata/blog/${post.slug}`,
      type: 'article',
      images: [{ url: '/tooliozLogo.png', width: 512, height: 512, alt: post.title }],
    },
  };
}

export default async function BiodataBlogPostPage({ params }: BlogPageProps) {
  const { slug } = await params;
  const post = getBiodataPost(slug);

  if (!post) {
    notFound();
  }

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    dateModified: post.updated,
    author: {
      '@type': 'Organization',
      name: 'Toolioz',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Toolioz',
      logo: {
        '@type': 'ImageObject',
        url: 'https://toolioz.com/tooliozLogo.png',
      },
    },
    mainEntityOfPage: `https://toolioz.com/biodata/blog/${post.slug}`,
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
    { name: 'Biodata', url: '/biodata' },
    { name: 'Blog', url: '/biodata/blog' },
    { name: post.title, url: `/biodata/blog/${post.slug}` },
  ]);

  return (
    <main className="bg-white text-[var(--text-primary)]">
      <JSONLD data={[articleJsonLd, faqJsonLd, breadcrumbJsonLd]} />

      <article className="mx-auto max-w-4xl px-6 py-16 md:py-24">
        <Link href="/biodata/blog" className="mb-10 inline-flex items-center gap-2 text-sm font-bold text-pink-700">
          <ArrowLeft size={16} />
          Back to Biodata Blog
        </Link>

        <div className="rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm md:p-12">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-pink-700">
              {post.readTime}
            </span>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-emerald-700">
              Updated {post.updated}
            </span>
          </div>

          <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-[-0.03em] md:text-6xl">
            {post.title}
          </h1>

          {/* Direct Answer / Quick Takeaway Block for AEO Extraction */}
          <section className="mt-6 rounded-2xl border border-pink-200 bg-pink-50/70 p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-pink-800 mb-2">
              <Sparkles size={16} className="text-pink-600 shrink-0" />
              <span>Direct Answer / Quick Takeaway</span>
            </h2>
            <p className="text-base font-bold leading-relaxed text-pink-950">
              {post.description}
            </p>
          </section>

          <div className="mt-10 flex flex-wrap gap-2">
            {post.keywords.map((keyword) => (
              <span key={keyword} className="rounded-full border border-pink-100 bg-pink-50 px-3 py-1 text-xs font-semibold text-pink-700">
                {keyword}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-20 space-y-20">
          {post.sections.map((section) => (
            <section key={section.heading} className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm md:p-10">
              <h2 className="text-3xl font-black tracking-[-0.02em] md:text-4xl">{section.heading}</h2>
              <div className="mt-6 space-y-6">
                {section.body.map((paragraph) => (
                  <p key={paragraph} className="text-lg leading-8 text-[var(--text-secondary)]">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <section className="mt-20 rounded-[2.5rem] border border-pink-100 bg-pink-50 p-8 md:p-12">
          <h2 className="text-3xl font-black tracking-tight">Create your biodata PDF</h2>
          <p className="mt-4 text-lg text-[var(--text-secondary)]">
            Use the free editor to choose a template, add a photo, preview the A4 layout, and export the PDF. No login required.
          </p>
          <Link
            href="/biodata/biodata-generator"
            className="mt-8 inline-flex items-center gap-3 rounded-full bg-pink-600 px-8 py-4 text-base font-bold text-white transition hover:bg-pink-700 hover:shadow-lg"
          >
            Open Biodata Generator <ArrowRight size={20} />
          </Link>
        </section>

        <section className="mt-20">
          <h2 className="text-3xl font-black tracking-tight mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {post.faqs.map((faq) => (
              <div key={faq.question} className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900">{faq.question}</h3>
                <p className="mt-4 text-lg leading-8 text-[var(--text-secondary)]">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </article>
    </main>
  );
}
