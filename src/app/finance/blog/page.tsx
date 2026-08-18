import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpen, CalendarDays, Sparkles, Target, TrendingUp } from 'lucide-react';
import { JSONLD } from '@/components/ui/JSONLD';
import { Footer } from '@/components/layout/Footer';
import { financeBlogKeywords, financeBlogPosts } from '@/lib/finance-blog-content';
import { financeEditorialPosts } from '@/lib/finance-editorial-content';

const allFinanceBlogKeywords = Array.from(new Set([
  ...financeBlogKeywords,
  ...financeEditorialPosts.flatMap((post) => post.keywords),
]));

export const metadata: Metadata = {
  title: 'Finance Blog | SIP, Retirement, Loan Payoff & Savings Guides | Toolioz',
  description:
    'Research-backed finance articles on step-up SIP, lumpsum vs SIP, retirement corpus planning, loan prepayment, and inflation-adjusted savings goals.',
  keywords: allFinanceBlogKeywords,
  alternates: {
    canonical: 'https://toolioz.com/finance/blog',
  },
  openGraph: {
    title: 'Finance Blog | Toolioz',
    description:
      'Practical finance guides for investing, retirement, debt payoff, and savings planning.',
    url: 'https://toolioz.com/finance/blog',
    type: 'website',
    images: [{ url: '/tooliozLogo.png', width: 512, height: 512, alt: 'Toolioz Finance Blog' }],
  },
};

export default function FinanceBlogIndexPage() {
  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: [...financeEditorialPosts, ...financeBlogPosts].map((post, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `https://toolioz.com/finance/blog/${post.slug}`,
      name: post.title,
    })),
  };

  return (
    <main className="bg-[linear-gradient(180deg,#fffdf9_0%,#f8fafc_100%)] text-[var(--text-primary)]">
      <JSONLD data={itemListJsonLd} />

      <section className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(37,99,235,0.08)_0%,transparent_35%),radial-gradient(circle_at_90%_20%,rgba(16,185,129,0.08)_0%,transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.7),rgba(248,250,252,0.2))]" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-20">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-blue-700 shadow-sm">
              <Sparkles size={14} />
              Finance Blog
            </div>
            <h1 className="max-w-4xl text-4xl font-black leading-[1.02] tracking-[-0.03em] sm:text-5xl lg:text-7xl">
              Practical money guides that answer the questions people actually search
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              These articles are built around long-tail finance intent like step-up SIP planning,
              lump sum vs SIP comparisons, retirement corpus estimates, loan prepayment savings,
              and inflation-aware goal setting.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {['Step-Up SIP', 'Lumpsum vs SIP', 'Retirement Corpus', 'Loan Prepayment', 'Inflation Goals'].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-600 shadow-sm"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/finance"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
              >
                Back to Finance Tools <ArrowRight size={16} />
              </Link>
              <Link
                href="/finance/sip-calculator"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-800 transition hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-700"
              >
                Open SIP Calculator <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-6 -top-6 hidden rounded-3xl bg-blue-100 px-4 py-3 text-sm font-bold text-blue-800 shadow-sm lg:block">
              Research-led, not generic
            </div>
            <div className="rounded-[2rem] border border-slate-200 bg-slate-950 p-8 text-white shadow-[0_30px_90px_-50px_rgba(15,23,42,0.85)]">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold uppercase tracking-[0.18em] text-blue-300">
                    Focus areas
                  </div>
                  <div className="mt-2 text-2xl font-black">Search-friendly finance topics</div>
                </div>
                <div className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-white/80">
                  {financeEditorialPosts.length + financeBlogPosts.length} Guides
                </div>
              </div>

              <div className="space-y-4">
                {[
                  'How a small step-up can grow a SIP faster',
                  'When a lump sum beats a monthly plan',
                  'How inflation changes retirement targets',
                  'How extra EMI payments reduce interest',
                  'Why budget-first savings goals work',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl bg-white/8 px-4 py-3">
                    <TrendingUp size={18} className="mt-0.5 text-emerald-300" />
                    <span className="text-sm leading-6 text-white/85">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-2 text-sm font-bold text-blue-200">
                  <BookOpen size={16} />
                  Built from official sources
                </div>
                <p className="mt-2 text-sm leading-6 text-white/70">
                  Investor.gov, CFPB, BLS, and consumer.gov guidance helps anchor the advice
                  in practical, dependable financial fundamentals.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-blue-700">
                <CalendarDays size={18} />
                Expert Financial Guides
              </div>
              <h2 className="text-4xl font-black tracking-[-0.02em] md:text-5xl">
                Master your money with our latest articles
              </h2>
            </div>
            <div className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-600 shadow-sm">
              100% data-backed financial planning
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {[...financeEditorialPosts, ...financeBlogPosts].map((post) => (
              <Link
                key={post.slug}
                href={`/finance/blog/${post.slug}`}
                className="group flex h-full flex-col justify-between rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-blue-300 hover:shadow-2xl"
              >
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-blue-700">
                      {post.readTime}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                      Updated {post.updated}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black tracking-[-0.02em] text-slate-950 transition-colors group-hover:text-blue-700">
                    {post.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{post.description}</p>
                </div>

                <div className="mt-6">
                  <div className="mb-4 flex flex-wrap gap-2">
                    {post.keywords.slice(0, 2).map((keyword) => (
                      <span
                        key={keyword}
                        className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[0.7rem] font-semibold text-slate-600"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                  <div className="inline-flex items-center gap-2 text-sm font-bold text-blue-700">
                    {post.toolLabel}
                    <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50 px-6 py-16 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <div className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-emerald-700">
              <Target size={16} />
              Why these topics
            </div>
            <h2 className="text-3xl font-black tracking-[-0.02em] text-slate-950">
              Useful questions, clear intent, strong internal linking
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              These guides support the site&apos;s calculator pages with practical explanations
              around compounding, retirement planning, loan repayment, and inflation-aware savings.
            </p>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-slate-950 p-8 text-white shadow-sm">
            <div className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-blue-200">
              <BookOpen size={16} />
              Official reference mix
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {['Investor.gov', 'CFPB', 'BLS', 'consumer.gov'].map((source) => (
                <div key={source} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white/85">
                  {source}
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm leading-6 text-white/70">
              Each article links back to the matching calculator so readers can move from
              explanation to action in one click.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl rounded-[2rem] bg-slate-950 p-8 text-white md:p-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h2 className="text-3xl font-black tracking-[-0.02em] md:text-5xl">
                Want the calculator instead of just the article?
              </h2>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">
                Open the corresponding tool after reading the guide and turn the idea into a real
                plan with live numbers.
              </p>
            </div>
            <Link
              href="/finance"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-black text-slate-950 transition hover:bg-blue-100"
            >
              Browse Finance Tools <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
