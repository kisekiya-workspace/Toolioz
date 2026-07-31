import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpen, HelpCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { JSONLD } from '@/components/ui/JSONLD';
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
      <JSONLD data={collectionJsonLd} />
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-white group">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              T
            </div>
            <span>Toolioz</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium text-slate-400">
            <Link href="/finance" className="hover:text-cyan-400 transition-colors">Finance</Link>
            <Link href="/devtools" className="hover:text-cyan-400 transition-colors">DevTools</Link>
            <Link href="/pdftools" className="hover:text-cyan-400 transition-colors">PDF Tools</Link>
            <Link href="/biodata" className="hover:text-cyan-400 transition-colors">Biodata</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            Direct Step-by-Step Guides
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4 leading-tight">
            How-To Guides & Tutorials
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed">
            Direct, step-by-step solutions for everyday tasks—from compressing large PDFs under 2MB to calculating investment compound growth and parsing API data.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {howToPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/how-to/${post.slug}`}
              className="group flex flex-col justify-between p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/40 hover:bg-slate-900 transition-all duration-200"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                  <span className="font-mono text-cyan-400 font-semibold bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                    {post.readTime}
                  </span>
                  <span>Updated {post.updated}</span>
                </div>
                <h2 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors mb-3 leading-snug">
                  {post.title}
                </h2>
                <p className="text-sm text-slate-400 line-clamp-3 mb-6 leading-relaxed">
                  {post.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs font-semibold text-cyan-400 group-hover:text-cyan-300">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  {post.steps.length} Step Guide
                </span>
                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Read Tutorial
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
