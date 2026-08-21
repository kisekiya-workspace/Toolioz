import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpen, Clock, Layers, ShieldCheck, Sparkles, TrendingUp, Zap } from 'lucide-react';
import { JSONLD } from '@/components/ui/JSONLD';
import { Footer } from '@/components/layout/Footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { standaloneBlogs } from '@/../blogs';
import { allTooliozBlogPosts } from '@/lib/toolioz-blog-index';

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
  const featuredPost = standaloneBlogs[0];

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: allTooliozBlogPosts.map((post, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `https://toolioz.com${post.href}`,
      name: post.title,
    })),
  };

  return (
    <main className="min-h-screen bg-white text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50 flex flex-col justify-between">
      <JSONLD data={itemListJsonLd} />

      <div>
        {/* Skimmed Hero Header */}
        <section className="bg-white pt-8 pb-6 text-center dark:bg-zinc-950">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-3 inline-flex items-center gap-2">
              <Badge variant="outline" dot pulse size="sm" className="font-mono text-xs">
                Toolioz Technical Library
              </Badge>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-4xl dark:text-zinc-50">
              Quantitative Engineering, <br className="hidden sm:block" />
              <span className="text-blue-600">Retro Graphics & Privacy</span>
            </h1>

            <p className="mx-auto mt-2 max-w-2xl text-xs sm:text-sm text-zinc-500 leading-relaxed dark:text-zinc-400">
              Long-form masterclass essays on financial mathematics, browser security sandboxing,
              zero-latency WebAssembly, and interactive calculation engines.
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              {[
                { label: 'Quantitative Finance', icon: TrendingUp },
                { label: 'Client-Side Privacy', icon: ShieldCheck },
                { label: 'Retro Graphics', icon: Layers },
                { label: 'Web Performance', icon: Zap },
              ].map(({ label, icon: Icon }) => (
                <Badge key={label} variant="secondary" size="default" className="gap-1.5 py-1 px-3">
                  <Icon size={13} className="text-blue-600" />
                  <span>{label}</span>
                </Badge>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Masterclass Spotlight */}
        {featuredPost && (
          <section className="py-8 sm:py-12 border-b border-zinc-100 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-950/50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-10 relative overflow-hidden dark:border-zinc-800 dark:bg-zinc-900">
                <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
                  <div>
                    <div className="mb-3 flex items-center gap-2">
                      <Badge variant="info" size="sm">
                        Featured Masterclass
                      </Badge>
                      <span className="flex items-center gap-1 text-xs font-mono text-zinc-400">
                        <Clock size={13} /> {featuredPost.readTime}
                      </span>
                    </div>

                    <h2 className="text-xl font-bold tracking-tight text-zinc-950 sm:text-2xl mb-3 dark:text-zinc-50">
                      <Link href={`/blog/${featuredPost.slug}`} className="hover:text-blue-600 transition-colors">
                        {featuredPost.title}
                      </Link>
                    </h2>

                    <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed mb-5 dark:text-zinc-400">
                      {featuredPost.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-3">
                      <Button asChild size="default" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                        <Link href={`/blog/${featuredPost.slug}`}>
                          Read Masterclass <ArrowRight size={14} className="ml-1" />
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="default" className="font-semibold text-zinc-800 dark:text-zinc-200 border-zinc-300 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800">
                        <Link href={featuredPost.toolHref}>
                          <BookOpen size={14} className="mr-1.5" />
                          Launch Interactive Tool
                        </Link>
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-zinc-200 bg-zinc-50/60 p-5 dark:border-zinc-800 dark:bg-zinc-950/40">
                    <p className="text-xs font-mono font-bold text-blue-600 uppercase tracking-wider mb-2.5">
                      Chapters Covered
                    </p>
                    <div className="space-y-1.5">
                      {featuredPost.sections.slice(0, 4).map((section, idx) => (
                        <div
                          key={section.heading}
                          className="flex items-start gap-2 rounded-lg bg-white p-2.5 text-xs text-zinc-950 border border-zinc-200 dark:bg-zinc-900 dark:text-zinc-50 dark:border-zinc-800"
                        >
                          <span className="rounded bg-blue-500/10 px-1.5 py-0.5 font-mono text-[10px] font-bold text-blue-600 shrink-0">
                            0{idx + 1}
                          </span>
                          <span className="line-clamp-1 leading-snug">{section.heading}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* All Articles Grid */}
        <section className="py-12 sm:py-16 bg-white dark:bg-zinc-950">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
              <div>
                <h2 className="text-xl font-extrabold tracking-tight text-zinc-950 sm:text-2xl dark:text-zinc-50">
                  All Masterclass Essays & Guides
                </h2>
                <p className="text-xs text-zinc-500 mt-0.5 dark:text-zinc-400">
                  Deep-dive research on algorithms, math, and browser tools.
                </p>
              </div>
              <Badge variant="mono" size="sm">
                {allTooliozBlogPosts.length} Articles
              </Badge>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {allTooliozBlogPosts.map((post) => (
                <Link key={post.slug} href={post.href} className="group block">
                  <Card hoverable className="h-full p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="mono" size="sm">
                          {post.category}
                        </Badge>
                        <span className="text-[10px] font-mono text-zinc-400">{post.readTime}</span>
                      </div>

                      <h3 className="text-base font-bold text-zinc-950 transition-colors group-hover:text-blue-600 line-clamp-2 mb-1.5 dark:text-zinc-50 dark:group-hover:text-blue-400">
                        {post.title}
                      </h3>

                      <p className="text-xs text-zinc-500 leading-relaxed line-clamp-3 dark:text-zinc-400">
                        {post.description}
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {post.keywords.slice(0, 2).map((keyword) => (
                          <span key={keyword} className="font-mono text-[10px] text-zinc-400">
                            #{keyword}
                          </span>
                        ))}
                      </div>
                      <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:underline inline-flex items-center gap-0.5">
                        Read <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
