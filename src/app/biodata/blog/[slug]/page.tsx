import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { JSONLD } from '@/components/ui/JSONLD';
import { biodataPosts, getBiodataPost } from '@/lib/biodata-content';

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

  return (
    <main className="bg-white text-[var(--text-primary)]">
      <JSONLD data={articleJsonLd} />
      <JSONLD data={faqJsonLd} />

      <article className="mx-auto max-w-4xl px-6 py-12 md:py-18">
        <Link href="/biodata" className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-pink-700">
          <ArrowLeft size={15} />
          Biodata tools
        </Link>

        <div className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-pink-600">
          {post.updated} / {post.readTime}
        </div>
        <h1 className="text-4xl font-black leading-tight tracking-[-0.02em] md:text-6xl">{post.title}</h1>
        <p className="mt-6 text-xl leading-9 text-[var(--text-secondary)]">{post.description}</p>

        <div className="mt-8 flex flex-wrap gap-2">
          {post.keywords.map((keyword) => (
            <span key={keyword} className="rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold text-pink-700">
              {keyword}
            </span>
          ))}
        </div>

        <div className="mt-12 space-y-12">
          {post.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-2xl font-extrabold tracking-[-0.01em] md:text-3xl">{section.heading}</h2>
              <div className="mt-4 space-y-4">
                {section.body.map((paragraph) => (
                  <p key={paragraph} className="text-lg leading-8 text-[var(--text-secondary)]">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <section className="mt-14 rounded-[28px] border border-pink-100 bg-pink-50 p-6 md:p-8">
          <h2 className="text-2xl font-extrabold">Create your biodata PDF</h2>
          <p className="mt-3 text-[var(--text-secondary)]">
            Use the free editor to choose a template, add a photo, preview the A4 layout, and export the PDF.
          </p>
          <Link
            href="/biodata/biodata-generator"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-pink-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-pink-700"
          >
            Open Biodata Generator <ArrowRight size={15} />
          </Link>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-extrabold">FAQs</h2>
          <div className="mt-5 space-y-4">
            {post.faqs.map((faq) => (
              <div key={faq.question} className="rounded-2xl border border-[var(--border)] p-5">
                <h3 className="font-bold">{faq.question}</h3>
                <p className="mt-2 leading-7 text-[var(--text-secondary)]">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </article>
    </main>
  );
}
