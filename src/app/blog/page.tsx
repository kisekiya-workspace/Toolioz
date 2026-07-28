import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpen, Clock, Layers, ShieldCheck, Sparkles, TrendingUp, Zap } from 'lucide-react';
import { JSONLD } from '@/components/ui/JSONLD';
import { Footer } from '@/components/layout/Footer';
import { standaloneBlogs } from '@/../blogs';

export const metadata: Metadata = {
  title: 'Research Blog & Technical Guides | Toolioz Knowledge Portal',
  description:
    'Masterclass articles on quantitative financial engineering, privacy-first client-side web architecture, retro dithering algorithms, and high-performance WebAssembly.',
  alternates: {
    canonical: 'https://toolioz.com/blog',
  },
  openGraph: {
    title: 'Toolioz Masterclass Blog & Research Portal',
    description:
      'Deep, research-backed guides on financial math, browser security, retro graphics, and web utility engineering.',
    url: 'https://toolioz.com/blog',
    type: 'website',
  },
};

export default function BlogIndexPage() {
  const featuredPost = standaloneBlogs[0]; // Financial Engineering Masterclass
  const secondaryFeatured = standaloneBlogs[1]; // Client-Side Engineering Masterclass
  const remainingBlogs = standaloneBlogs.slice(2);

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: standaloneBlogs.map((post, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `https://toolioz.com/blog/${post.slug}`,
      name: post.title,
    })),
  };

  return (
    <main className="bg-slate-950 text-slate-100 min-h-screen antialiased selection:bg-blue-500 selection:text-white">
      <JSONLD data={itemListJsonLd} />

      {/* Hero Header with Glow Gradients */}
      <section className="relative overflow-hidden border-b border-slate-800/80 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(37,99,235,0.25),rgba(255,255,255,0))] py-20 lg:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(16,185,129,0.08)_0%,transparent_40%)]" />
        
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-blue-400 backdrop-blur-md">
              <Sparkles size={14} className="animate-pulse text-blue-400" />
              Toolioz Research Portal
            </div>

            <h1 className="text-4xl font-black leading-[1.05] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
              Quantitative Engineering, Retro Graphics & Privacy
            </h1>

            <p className="mt-6 text-lg leading-8 text-slate-400 sm:text-xl sm:leading-9">
              Long-form masterclass essays on financial mathematics, browser security sandboxing,
              zero-latency WebAssembly, and interactive calculation engines.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              {[
                { label: 'Quantitative Finance', icon: TrendingUp },
                { label: 'Client-Side Privacy', icon: ShieldCheck },
                { label: 'Retro Graphics', icon: Layers },
                { label: 'Web Performance', icon: Zap },
              ].map(({ label, icon: Icon }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-4 py-2 text-xs font-bold text-slate-300 backdrop-blur-md transition hover:border-blue-500/50 hover:text-white"
                >
                  <Icon size={14} className="text-blue-400" />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Masterclass Banner Spotlight */}
      {featuredPost && (
        <section className="relative -mt-10 px-6 z-10">
          <div className="mx-auto max-w-7xl">
            <div className="relative overflow-hidden rounded-[2.5rem] border border-blue-500/30 bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950/40 p-8 shadow-[0_20px_70px_-15px_rgba(37,99,235,0.25)] lg:p-12">
              <div className="absolute right-0 top-0 -mr-20 -mt-20 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />

              <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
                <div>
                  <div className="mb-4 flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-blue-500/20 px-3.5 py-1 text-xs font-black uppercase tracking-[0.16em] text-blue-300 border border-blue-400/30">
                      ★ Featured Masterclass
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                      <Clock size={14} /> {featuredPost.readTime}
                    </span>
                  </div>

                  <h2 className="text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
                    <Link
                      href={`/blog/${featuredPost.slug}`}
                      className="transition hover:text-blue-400"
                    >
                      {featuredPost.title}
                    </Link>
                  </h2>

                  <p className="mt-6 text-base leading-8 text-slate-300 sm:text-lg">
                    {featuredPost.description}
                  </p>

                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    <Link
                      href={`/blog/${featuredPost.slug}`}
                      className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-7 py-3.5 text-sm font-black text-white shadow-lg transition hover:scale-105 hover:bg-blue-500"
                    >
                      Read Full Masterclass <ArrowRight size={16} />
                    </Link>
                    <Link
                      href={featuredPost.toolHref}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-6 py-3.5 text-sm font-bold text-slate-200 transition hover:border-slate-500 hover:text-white"
                    >
                      <BookOpen size={16} /> Launch Interactive Tool
                    </Link>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 backdrop-blur-xl">
                  <div className="text-xs font-black uppercase tracking-[0.16em] text-blue-400 mb-4">
                    Masterclass Chapters & Topics
                  </div>
                  <div className="space-y-3">
                    {featuredPost.sections.slice(0, 4).map((section, idx) => (
                      <div
                        key={section.heading}
                        className="flex items-start gap-3 rounded-2xl bg-slate-950/60 p-3.5 text-xs font-semibold text-slate-300 border border-slate-800/60"
                      >
                        <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-[0.7rem] font-bold text-blue-300 shrink-0">
                          0{idx + 1}
                        </span>
                        <span className="leading-5">{section.heading}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Masterclasses Grid */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-slate-800 pb-6">
            <div>
              <div className="text-xs font-black uppercase tracking-[0.18em] text-blue-400">
                Explore Library
              </div>
              <h2 className="mt-2 text-3xl font-black text-white sm:text-4xl">
                All Masterclass Essays & Guides
              </h2>
            </div>
            <div className="rounded-full border border-slate-800 bg-slate-900 px-4 py-2 text-xs font-bold text-slate-400">
              {standaloneBlogs.length} Published Articles
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {standaloneBlogs.map((post) => (
              <article
                key={post.slug}
                className="group flex flex-col justify-between rounded-[2rem] border border-slate-800 bg-slate-900/60 p-8 transition-all duration-300 hover:-translate-y-2 hover:border-blue-500/40 hover:bg-slate-900 hover:shadow-2xl hover:shadow-blue-500/10"
              >
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <span className="rounded-full bg-blue-500/10 border border-blue-500/20 px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-blue-400">
                      {post.readTime}
                    </span>
                    <span className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-slate-500">
                      {post.updated}
                    </span>
                  </div>

                  <h3 className="text-xl font-black leading-snug text-white transition-colors group-hover:text-blue-400">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>

                  <p className="mt-4 text-xs leading-6 text-slate-400 line-clamp-3">
                    {post.description}
                  </p>
                </div>

                <div className="mt-8 border-t border-slate-800/80 pt-6">
                  <div className="mb-4 flex flex-wrap gap-1.5">
                    {post.keywords.slice(0, 2).map((keyword) => (
                      <span
                        key={keyword}
                        className="rounded-full bg-slate-950 px-2.5 py-1 text-[0.65rem] font-semibold text-slate-400 border border-slate-800"
                      >
                        #{keyword}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-blue-400 transition group-hover:translate-x-1"
                  >
                    Read Masterclass <ArrowRight size={14} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy Guarantee Footer Section */}
      <section className="px-6 pb-20">
        <div className="mx-auto max-w-7xl rounded-[2.5rem] border border-emerald-500/30 bg-gradient-to-r from-slate-900 via-emerald-950/30 to-slate-900 p-8 sm:p-12">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="rounded-full bg-emerald-500/20 p-4 border border-emerald-500/30 shrink-0">
              <ShieldCheck size={32} className="text-emerald-400" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-white">100% Client-Side Data Privacy Architecture</h3>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                All Toolioz tools, financial engines, image dithering routines, and document utilities run 100% locally inside your browser tab memory. No numbers, files, or inputs are transmitted to external servers.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
