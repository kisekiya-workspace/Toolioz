import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, HelpCircle, CheckCircle2 } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { JSONLD } from '@/components/ui/JSONLD';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { howToPosts } from '@/lib/howto-content';
import { buildCollectionPageJsonLd, buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'How-To Guides & Step-by-Step Tutorials | Toolioz',
  description:
    'Clear, actionable step-by-step guides on PDF compression, mutual fund SIP calculations, JWT token decoding, JSON formatting, and marriage biodata generation.',
  path: '/how-to',
  keywords: [
    'how to guides',
    'step by step tutorials',
    'how to compress pdf',
    'how to calculate sip',
    'how to decode jwt',
    'how to format json',
  ],
});

export default function HowToIndexPage() {
  const collectionJsonLd = buildCollectionPageJsonLd({
    name: 'Toolioz How-To Guides and Step-by-Step Tutorials',
    description: 'Technical, financial, and document step-by-step guides.',
    path: '/how-to',
  });

  return (
    <div className="min-h-screen bg-white text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50 flex flex-col justify-between">
      <JSONLD data={collectionJsonLd} />

      <div>
        {/* Hero Header */}
        <section className="relative border-b border-zinc-200 bg-white vercel-grid py-16 sm:py-20 md:py-28 text-center dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <Badge variant="outline" dot pulse size="sm" className="mb-4 font-mono text-[11px]">
              <HelpCircle size={12} className="mr-1 text-cyan-600" />
              Direct Step-by-Step Solutions
            </Badge>

            <h1 className="mb-5 text-4xl font-extrabold tracking-tight text-zinc-950 sm:text-6xl dark:text-zinc-50">
              How-To Guides & Practical Tutorials
            </h1>

            <p className="mx-auto max-w-2xl text-base leading-relaxed text-zinc-600 sm:text-lg dark:text-zinc-400">
              Actionable tutorials for everyday tasks—from compressing large PDFs under 2MB to calculating investment compound growth and parsing API data.
            </p>
          </div>
        </section>

        {/* Guides Grid */}
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {howToPosts.map((post) => (
              <Link
                key={post.slug}
                href={post.directUrl}
                className="group block h-full"
              >
                <Card hoverable className="h-full p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-3">
                      <Badge variant="mono" size="sm">
                        {post.readTime}
                      </Badge>
                      <span className="text-[11px] font-mono text-zinc-400">Updated {post.updated}</span>
                    </div>

                    <h2 className="text-lg font-bold text-zinc-950 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2 leading-snug dark:text-zinc-50">
                      {post.title}
                    </h2>

                    <p className="text-xs text-zinc-500 line-clamp-3 leading-relaxed mb-4 dark:text-zinc-400">
                      {post.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
                    <span className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
                      <CheckCircle2 size={14} className="text-emerald-500" />
                      <span>{post.steps.length} Step Guide</span>
                    </span>
                    <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Read Tutorial
                      <ArrowRight size={13} />
                    </span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
