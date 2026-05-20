import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpen, CalendarDays, FileText, Sparkles, Trophy } from 'lucide-react';
import { JSONLD } from '@/components/ui/JSONLD';
import { Footer } from '@/components/layout/Footer';
import { resumeBlogKeywords, resumeBlogPosts } from '@/lib/resume-blog-content';

export const metadata: Metadata = {
  title: 'Resume Writing Guides | ATS Resume Tips & Career Advice | Toolioz',
  description:
    'Master the art of resume writing with our expert guides. Learn how to pass ATS systems, choose the right layout, and highlight your achievements.',
  keywords: resumeBlogKeywords,
  alternates: {
    canonical: 'https://toolioz.com/resume-builder/blog',
  },
  openGraph: {
    title: 'Resume Builder Blog | Toolioz',
    description:
      'Career-focused articles to help you land your next job with a professional resume.',
    url: 'https://toolioz.com/resume-builder/blog',
    type: 'website',
    images: [{ url: '/tooliozLogo.png', width: 512, height: 512, alt: 'Toolioz Resume Blog' }],
  },
};

export default function ResumeBlogIndexPage() {
  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: resumeBlogPosts.map((post, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `https://toolioz.com/resume-builder/blog/${post.slug}`,
      name: post.title,
    })),
  };

  return (
    <main className="bg-[linear-gradient(180deg,#fcfdff_0%,#f8fafc_100%)] text-slate-950">
      <JSONLD data={itemListJsonLd} />

      <section className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(37,99,235,0.06)_0%,transparent_35%),radial-gradient(circle_at_88%_22%,rgba(16,185,129,0.06)_0%,transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.8),rgba(248,250,252,0.2))]" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-24">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-blue-700 shadow-sm">
              <Sparkles size={14} />
              Resume Knowledge Base
            </div>
            <h1 className="max-w-4xl text-4xl font-black leading-[1.02] tracking-[-0.03em] sm:text-5xl lg:text-7xl">
              Write a resume that gets you hired
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Modern recruitment is a game of keywords and clean formatting. Our guides show you 
              how to navigate ATS systems and present your experience in the best possible light.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {['ATS Friendly', 'Action Verbs', 'Resume Layouts', 'One-Page Tips', 'Entry Level'].map((tag) => (
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
                href="/resume-builder"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
              >
                Back to Builder <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-6 -top-6 hidden rounded-3xl bg-blue-100 px-4 py-3 text-sm font-bold text-blue-800 shadow-sm lg:block">
              ATS-Optimized Content
            </div>
            <div className="rounded-[2rem] border border-slate-200 bg-slate-950 p-8 text-white shadow-[0_30px_90px_-50px_rgba(15,23,42,0.85)]">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold uppercase tracking-[0.18em] text-blue-300">
                    Featured Reading
                  </div>
                  <div className="mt-2 text-2xl font-black">Career Development</div>
                </div>
                <div className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-white/80">
                  {resumeBlogPosts.length} Articles
                </div>
              </div>

              <div className="space-y-4">
                {resumeBlogPosts.map((post) => (
                  <div key={post.slug} className="flex items-start gap-3 rounded-2xl bg-white/8 px-4 py-3">
                    <FileText size={18} className="mt-0.5 text-blue-300" />
                    <span className="text-sm leading-6 text-white/85">{post.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-blue-700">
                <CalendarDays size={18} />
                Latest Guides
              </div>
              <h2 className="text-4xl font-black tracking-[-0.02em] md:text-5xl">
                Expert tips for job seekers
              </h2>
            </div>
            <div className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-600 shadow-sm">
              Helping you land your dream job
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {resumeBlogPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/resume-builder/blog/${post.slug}`}
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
                    Read Guide
                    <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50 px-6 py-20 lg:py-32">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <div className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-blue-700">
              <Trophy size={16} />
              Our Standard
            </div>
            <h2 className="text-3xl font-black tracking-[-0.02em] text-slate-950">
              Professionalism without the price tag
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              We believe quality career tools should be accessible to everyone. Our blog provides the 
              same level of insight as premium resume services, completely free.
            </p>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-slate-950 p-8 text-white shadow-sm">
            <div className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-blue-200">
              <BookOpen size={16} />
              Industry Insight
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {['ATS Systems', 'HR Practices', 'Clean Layouts', 'Vector PDFs'].map((feature) => (
                <div key={feature} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white/85">
                  {feature}
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm leading-6 text-white/70">
              We research actual hiring manager preferences to ensure our advice gives you a competitive edge.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
