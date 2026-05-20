import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { JSONLD } from '@/components/ui/JSONLD';
import { Footer } from '@/components/layout/Footer';
import { resumeBlogPosts, getResumePost } from '@/lib/resume-blog-content';

type BlogPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return resumeBlogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getResumePost(slug);

  if (!post) {
    return {};
  }

  return {
    title: `${post.title} | Toolioz`,
    description: post.description,
    keywords: post.keywords,
    alternates: {
      canonical: `https://toolioz.com/resume-builder/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://toolioz.com/resume-builder/blog/${post.slug}`,
      type: 'article',
      images: [{ url: '/tooliozLogo.png', width: 512, height: 512, alt: post.title }],
    },
  };
}

export default async function ResumeBlogPostPage({ params }: BlogPageProps) {
  const { slug } = await params;
  const post = getResumePost(slug);

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
    mainEntityOfPage: `https://toolioz.com/resume-builder/blog/${post.slug}`,
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
    <main className="bg-white text-slate-950">
      <JSONLD data={articleJsonLd} />
      <JSONLD data={faqJsonLd} />

      <article className="mx-auto max-w-4xl px-6 py-16 md:py-24">
        <Link href="/resume-builder" className="mb-10 inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-800 transition-colors">
          <ArrowLeft size={16} />
          Back to Resume Tools
        </Link>

        <div className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
          {post.updated} / {post.readTime}
        </div>
        <h1 className="text-4xl font-black leading-tight tracking-[-0.03em] md:text-6xl text-slate-950">
          {post.title}
        </h1>
        <p className="mt-8 text-xl leading-9 text-slate-600">
          {post.description}
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          {post.keywords.map((keyword) => (
            <span key={keyword} className="rounded-full bg-blue-50 px-4 py-1.5 text-xs font-semibold text-blue-700">
              {keyword}
            </span>
          ))}
        </div>

        <div className="mt-16 space-y-16">
          {post.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-3xl font-black tracking-[-0.02em] md:text-4xl text-slate-950">
                {section.heading}
              </h2>
              <div className="mt-6 space-y-6">
                {section.body.map((paragraph) => (
                  <p key={paragraph} className="text-lg leading-8 text-slate-600">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <section className="mt-20 rounded-[2.5rem] border border-blue-100 bg-blue-50 p-8 md:p-12">
          <h2 className="text-3xl font-black text-slate-950">Build your professional resume</h2>
          <p className="mt-4 text-lg leading-7 text-slate-600">
            Put these tips into practice. Our vector-based builder ensures your resume is 100% ATS-friendly and ready to impress.
          </p>
          <Link
            href="/resume-builder"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-blue-600 px-7 py-4 text-sm font-bold text-white transition hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200"
          >
            Start Building Now <ArrowRight size={16} />
          </Link>
        </section>

        {post.faqs.length > 0 && (
          <section className="mt-20">
            <h2 className="text-3xl font-black text-slate-950">Frequently Asked Questions</h2>
            <div className="mt-8 space-y-6">
              {post.faqs.map((faq) => (
                <div key={faq.question} className="rounded-3xl border border-slate-200 bg-slate-50 p-6 md:p-8">
                  <h3 className="text-xl font-bold text-slate-950">{faq.question}</h3>
                  <p className="mt-3 text-lg leading-8 text-slate-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </article>

      <Footer />
    </main>
  );
}
