import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, BookOpen, ExternalLink } from 'lucide-react';
import { JSONLD } from '@/components/ui/JSONLD';
import { Footer } from '@/components/layout/Footer';
import { devtoolsBlogPosts, getDevtoolsBlogPost } from '@/lib/devtools-blog-content';

type BlogPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return devtoolsBlogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getDevtoolsBlogPost(slug);

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    alternates: {
      canonical: `https://toolioz.com/devtools/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://toolioz.com/devtools/blog/${post.slug}`,
      type: 'article',
      images: [{ url: '/tooliozLogo.png', width: 512, height: 512, alt: post.title }],
    },
  };
}

export default async function DevToolsBlogPostPage({ params }: BlogPageProps) {
  const { slug } = await params;
  const post = getDevtoolsBlogPost(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = devtoolsBlogPosts
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
        url: 'https://toolioz.com/tooliozLogo.png',
      },
    },
    mainEntityOfPage: `https://toolioz.com/devtools/blog/${post.slug}`,
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
    <main className="bg-[linear-gradient(180deg,#fffaf0_0%,#f8fafc_100%)] text-[var(--text-primary)]">
      <JSONLD data={articleJsonLd} />
      <JSONLD data={faqJsonLd} />

      <article className="mx-auto max-w-4xl px-6 py-16 md:py-24">
        <Link href="/devtools/blog" className="mb-10 inline-flex items-center gap-2 text-sm font-bold text-amber-700">
          <ArrowLeft size={16} />
          Back to DevTools Blog
        </Link>

        <div className="rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm md:p-12">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-amber-700">
              {post.readTime}
            </span>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-emerald-700">
              Updated {post.updated}
            </span>
          </div>

          <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-[-0.03em] md:text-6xl">
            {post.title}
          </h1>
          <p className="mt-8 max-w-3xl text-xl leading-9 text-[var(--text-secondary)]">
            {post.description}
          </p>

          <div className="mt-10 flex flex-wrap gap-2">
            {post.keywords.map((keyword) => (
              <span
                key={keyword}
                className="rounded-full border border-amber-100 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700"
              >
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

        <section className="mt-14 rounded-[2rem] border border-amber-100 bg-amber-50 p-6 md:p-8">
          <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-amber-700">
            <BookOpen size={16} />
            Open the matching tool
          </div>
          <h2 className="mt-3 text-2xl font-extrabold">{post.toolLabel}</h2>
          <p className="mt-3 max-w-2xl text-[var(--text-secondary)]">
            Take the idea from the article and turn it into a live calculation or transformation
            with one click.
          </p>
          <Link
            href={post.toolHref}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-amber-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-amber-800"
          >
            Open tool <ArrowRight size={15} />
          </Link>
        </section>

        <section className="mt-14 rounded-[2rem] border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-emerald-700">
            <ExternalLink size={16} />
            Research sources
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {post.sources.map((source) => (
              <a
                key={source.href}
                href={source.href}
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-amber-200 hover:bg-amber-50 hover:text-amber-800"
              >
                {source.label}
              </a>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-extrabold">FAQs</h2>
          <div className="mt-5 space-y-4">
            {post.faqs.map((faq) => (
              <div key={faq.question} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="font-bold">{faq.question}</h3>
                <p className="mt-2 leading-7 text-[var(--text-secondary)]">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <div className="mb-5 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-slate-500">
            <ArrowRight size={14} />
            More guides
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {relatedPosts.map((related) => (
              <Link
                key={related.slug}
                href={`/devtools/blog/${related.slug}`}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-amber-200 hover:shadow-lg"
              >
                <div className="text-xs font-bold uppercase tracking-[0.12em] text-amber-600">
                  {related.readTime}
                </div>
                <h3 className="mt-2 text-lg font-black leading-snug">{related.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
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
