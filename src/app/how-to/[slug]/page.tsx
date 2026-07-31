import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, HelpCircle, Sparkles } from 'lucide-react';
import { JSONLD } from '@/components/ui/JSONLD';
import { Footer } from '@/components/layout/Footer';
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
    mainEntityOfPage: `${SITE_URL}/how-to/${post.slug}`,
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

  const schemas = [howToSchema, articleSchema, faqSchema].filter(Boolean);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
      <JSONLD data={schemas} />

      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-white group">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              T
            </div>
            <span>Toolioz</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium text-slate-400">
            <Link href="/how-to" className="text-cyan-400 font-semibold">How-To Guides</Link>
            <Link href="/finance" className="hover:text-cyan-400 transition-colors">Finance</Link>
            <Link href="/devtools" className="hover:text-cyan-400 transition-colors">DevTools</Link>
            <Link href="/pdftools" className="hover:text-cyan-400 transition-colors">PDF Tools</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="mb-8">
          <Link
            href="/how-to"
            className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All How-To Guides
          </Link>

          <div className="flex items-center gap-3 text-xs text-slate-400 mb-4">
            <span className="bg-cyan-950/80 text-cyan-400 px-2.5 py-1 rounded-full font-mono border border-cyan-800/50">
              {post.readTime}
            </span>
            <span>Updated {post.updated}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-6">
            {post.title}
          </h1>
          <p className="text-lg text-slate-300 leading-relaxed bg-slate-900/60 p-6 rounded-2xl border border-slate-800/80">
            {post.description}
          </p>
        </div>

        {/* Interactive Tool Banner CTA */}
        <div className="my-8 p-6 rounded-2xl bg-gradient-to-r from-cyan-950/80 via-slate-900 to-blue-950/80 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl shadow-cyan-950/20">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Direct Interactive Tool
            </div>
            <p className="text-base font-bold text-white">Execute this task live in your browser</p>
          </div>
          <Link
            href={post.toolHref}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all flex items-center gap-2 whitespace-nowrap"
          >
            {post.toolLabel}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Step-by-Step Instructions */}
        <section className="my-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-cyan-400" />
            Step-by-Step Guide
          </h2>
          <div className="space-y-6">
            {post.steps.map((step, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 flex gap-4 items-start hover:border-slate-700 transition-colors"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 font-bold flex items-center justify-center text-sm">
                  {idx + 1}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">{step.name}</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Informational Sections */}
        {post.sections.map((section, idx) => (
          <section key={idx} className="my-10">
            <h2 className="text-2xl font-bold text-white mb-4">{section.heading}</h2>
            <div className="space-y-4 text-slate-300 leading-relaxed text-base">
              {section.body.map((para, pIdx) => (
                <p key={pIdx}>{para}</p>
              ))}
            </div>
          </section>
        ))}

        {/* FAQs */}
        {post.faqs && post.faqs.length > 0 && (
          <section className="my-12 pt-8 border-t border-slate-800">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-cyan-400" />
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {post.faqs.map((faq, idx) => (
                <div key={idx} className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <h3 className="text-base font-bold text-white mb-2">{faq.question}</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related Guides */}
        {otherPosts.length > 0 && (
          <section className="my-12 pt-8 border-t border-slate-800">
            <h2 className="text-xl font-bold text-white mb-6">More How-To Guides</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {otherPosts.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/how-to/${rel.slug}`}
                  className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-cyan-500/40 transition-colors group"
                >
                  <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2 mb-2">
                    {rel.title}
                  </h3>
                  <span className="text-xs text-cyan-400 font-semibold inline-flex items-center gap-1">
                    Read Guide <ArrowRight className="w-3 h-3" />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
