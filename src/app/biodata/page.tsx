import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  Download,
  Eye,
  Lock,
  Sparkles,
  UserRound,
} from 'lucide-react';
import { JSONLD } from '@/components/ui/JSONLD';
import { Footer } from '@/components/layout/Footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import { biodataFaqs, biodataKeywords } from '@/lib/biodata-content';

export const metadata: Metadata = {
  title: 'Free Marriage Biodata Maker | PDF Download No Login',
  description:
    'Create marriage biodata online with Hindu, Muslim, Sikh, classic, minimalist, and modern templates. Preview live and download a PDF without login.',
  keywords: biodataKeywords,
  alternates: {
    canonical: 'https://toolioz.com/biodata',
  },
  openGraph: {
    title: 'Free Marriage Biodata Maker | Toolioz',
    description:
      'Build a marriage biodata PDF with photo, family details, horoscope fields, and community templates.',
    url: 'https://toolioz.com/biodata',
    type: 'website',
    images: [{ url: '/tooliozLogo.png', width: 512, height: 512, alt: 'Toolioz Biodata Tools' }],
  },
};

const features = [
  {
    title: 'Live A4 Preview',
    body: 'See the exact biodata layout before you download, including photo crop, borders, and spacing.',
    icon: Eye,
    color: '#2563eb',
  },
  {
    title: 'Instant PDF Download',
    body: 'Export a share-ready biodata PDF from mobile or desktop without waiting for a designer.',
    icon: Download,
    color: '#db2777',
  },
  {
    title: '100% Private Local Drafts',
    body: 'Your draft stays in your browser RAM/storage so you can return and edit without creating an account.',
    icon: Lock,
    color: '#10b981',
  },
];

const templateCards = [
  {
    title: 'Hindu Traditional',
    label: 'Om motif, saffron gold palette',
    mark: 'ॐ',
    color: '#ea580c',
  },
  {
    title: 'Islamic Elegant',
    label: 'Bismillah header, emerald borders',
    mark: 'بسم الله',
    color: '#059669',
  },
  {
    title: 'Sikh Heritage',
    label: 'Ik Onkar motif, navy accents',
    mark: 'ੴ',
    color: '#2563eb',
  },
  {
    title: 'Modern Minimalist',
    label: 'Clean profile, modern typography',
    mark: 'Aa',
    color: '#4f46e5',
  },
];

const steps = [
  ['Choose Template', 'Pick a modern, classic, Hindu, Islamic, Sikh, or minimalist layout.'],
  ['Input Profile', 'Add personal details, horoscope fields, profession, family, and partner expectations.'],
  ['Live Preview', 'Review the pixel-perfect A4 canvas and format photo alignment in real-time.'],
  ['Vector PDF Export', 'Download a crisp, print-ready PDF ready for WhatsApp, email, or print.'],
];

export default function BiodataPage() {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: biodataFaqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <main className="min-h-screen overflow-hidden bg-white text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
        <JSONLD data={faqJsonLd} />

        {/* Skimmed Hero Header */}
        <section className="bg-white pt-8 pb-8 text-left dark:bg-zinc-950">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[1fr_420px] lg:items-center">
              <div>
                <Badge variant="outline" dot pulse size="sm" className="mb-3 font-mono text-xs">
                  <Sparkles size={12} className="mr-1 text-pink-600" />
                  Marriage Biodata Studio
                </Badge>

                <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl text-zinc-950 dark:text-zinc-50">
                  Marriage Biodata Maker for <span className="text-pink-600">Instant PDF Sharing</span>
                </h1>

                <p className="mt-2 max-w-xl text-xs sm:text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                  Create a polished marriage biodata with photo upload, family tree fields, horoscope details,
                  and community-specific templates. 100% free, no login required.
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <Button asChild size="default" className="gap-2">
                    <Link href="/biodata/biodata-generator">
                      Create Biodata Free <ArrowRight size={14} />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="default">
                    <a href="#templates">
                      View Templates
                    </a>
                  </Button>
                </div>

                <div className="mt-6 grid max-w-md grid-cols-3 divide-x divide-zinc-200 rounded-xl border border-zinc-200 bg-zinc-50/50 dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900">
                  {[
                    ['6+', 'Templates'],
                    ['Vector', 'PDF Export'],
                    ['0', 'Signups Needed'],
                  ].map(([value, label]) => (
                    <div key={label} className="p-3 text-center">
                      <div className="text-lg font-extrabold text-zinc-950 dark:text-zinc-50">{value}</div>
                      <div className="mt-0.5 text-[10px] font-mono text-zinc-400 uppercase">{label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Preview Mockup Card */}
              <div className="relative">
                <div className="rounded-2xl border border-zinc-200 bg-white p-6 relative overflow-hidden dark:border-zinc-800 dark:bg-zinc-900">
                  <div className="mb-4 flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
                    <span className="text-2xl font-bold text-pink-600">ॐ</span>
                    <Badge variant="mono" size="sm">
                      Live A4 Preview
                    </Badge>
                  </div>
                  
                  <div className="rounded-xl border border-zinc-200 bg-zinc-50/60 p-5 dark:border-zinc-800 dark:bg-zinc-950/40">
                    <div className="flex items-center gap-4 border-b border-zinc-200 pb-4 dark:border-zinc-800">
                      <div className="flex size-14 items-center justify-center rounded-xl bg-zinc-200 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                        <UserRound size={26} />
                      </div>
                      <div>
                        <div className="text-lg font-bold text-zinc-950 dark:text-zinc-50">Aarav Sharma</div>
                        <div className="text-xs text-zinc-500">Product Engineer · Bengaluru</div>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2">
                      {['Date of Birth', 'Height', 'Religion', 'Education'].map((item) => (
                        <div key={item} className="rounded-md bg-white p-2.5 border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800">
                          <div className="text-[10px] font-mono text-zinc-400 uppercase">{item}</div>
                          <div className="mt-1.5 h-2 w-3/4 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-xs font-semibold text-emerald-600">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 size={16} />
                      <span>Ready for WhatsApp & Print</span>
                    </span>
                    <span className="font-mono text-[11px] text-zinc-400">High DPI Vector</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Cards */}
        <section className="py-16 sm:py-20 bg-zinc-50/50 border-b border-zinc-200 dark:border-zinc-800 dark:bg-zinc-950/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-5 md:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.title} className="rounded-2xl border border-zinc-200 bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700">
                  <div
                    className="flex size-11 items-center justify-center rounded-xl mb-4"
                    style={{ backgroundColor: `${feature.color}15`, color: feature.color }}
                  >
                    <feature.icon size={22} />
                  </div>
                  <h3 className="text-base font-bold text-zinc-950 dark:text-zinc-50">{feature.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">{feature.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Template Showcase */}
        <section id="templates" className="py-16 sm:py-20 border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between border-b border-zinc-200/80 pb-4 dark:border-zinc-800">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-pink-600">
                  Template Library
                </p>
                <h2 className="text-2xl font-extrabold tracking-tight text-zinc-950 sm:text-3xl dark:text-zinc-50 mt-1">
                  Community & Cultural Formats
                </h2>
              </div>
              <Button asChild size="sm" variant="outline">
                <Link href="/biodata/biodata-generator">
                  Open Studio Editor <ArrowRight size={14} className="ml-1" />
                </Link>
              </Button>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {templateCards.map((template) => (
                <div key={template.title} className="rounded-2xl border border-zinc-200 bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700 flex flex-col justify-between">
                  <div>
                    <div className="text-3xl font-black mb-4" style={{ color: template.color }}>
                      {template.mark}
                    </div>
                    <h3 className="text-base font-bold text-zinc-950 dark:text-zinc-50">{template.title}</h3>
                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{template.label}</p>
                  </div>
                  <div className="mt-6 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs font-semibold text-pink-600">
                    <span>Use Template</span>
                    <ArrowRight size={13} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Steps Workflow */}
        <section className="py-16 sm:py-20 border-b border-zinc-200 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-950/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[380px_1fr] lg:items-start">
              <div>
                <Badge variant="outline" size="sm" className="mb-3">
                  Quick Workflow
                </Badge>
                <h2 className="text-2xl font-extrabold tracking-tight text-zinc-950 sm:text-3xl dark:text-zinc-50">
                  From Blank Canvas to PDF in Under 3 Minutes
                </h2>
                <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Engineered with an interactive split workspace: live form inputs on the left, real-time A4 PDF preview on the right.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {steps.map(([title, body], index) => (
                  <div key={title} className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="flex size-8 items-center justify-center rounded-full bg-zinc-950 text-white text-xs font-bold mb-4 dark:bg-zinc-100 dark:text-zinc-950">
                      {index + 1}
                    </div>
                    <h3 className="text-sm font-bold text-zinc-950 dark:text-zinc-50">{title}</h3>
                    <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Guides Section */}
        <section id="guides" className="py-16 sm:py-20 bg-white dark:bg-zinc-950">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 flex items-center justify-between border-b border-zinc-200/80 pb-4 dark:border-zinc-800">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-pink-600">
                  Biodata Guides
                </p>
                <h2 className="text-2xl font-extrabold tracking-tight text-zinc-950 sm:text-3xl dark:text-zinc-50 mt-1">
                  Format Guides & Templates
                </h2>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href="/biodata/blog">
                  View All Guides →
                </Link>
              </Button>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {[
                {
                  title: 'How to Create a Marriage Biodata PDF: Step-by-Step Guide',
                  description: 'Complete tutorial on photo placement, family tree formatting, horoscope fields, and mobile vector PDF export.',
                  href: '/how-to/create-marriage-biodata-pdf',
                  readTime: '6 min read',
                },
                {
                  title: 'Top 5 Marriage Biodata Makers & Template Comparison',
                  description: 'Detailed comparative review of Hindu, Muslim, Sikh, and Modern minimalist matrimony profile generators.',
                  href: '/top5/best-marriage-biodata-makers',
                  readTime: '8 min read',
                },
              ].map((post) => (
                <Link key={post.href} href={post.href} className="group block">
                  <div className="h-full rounded-2xl border border-zinc-200 bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700 flex flex-col justify-between">
                    <div>
                      <Badge variant="mono" size="sm" className="mb-3">
                        {post.readTime}
                      </Badge>
                      <h3 className="text-base font-bold text-zinc-950 transition-colors group-hover:text-pink-600 mb-2 dark:text-zinc-50">
                        {post.title}
                      </h3>
                      <p className="text-xs text-zinc-500 leading-relaxed dark:text-zinc-400">
                        {post.description}
                      </p>
                    </div>
                    <div className="mt-5 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-1 text-xs font-semibold text-pink-600">
                      <span>Read guide</span>
                      <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-16 sm:py-20 bg-zinc-50/50 border-t border-zinc-200 dark:border-zinc-800 dark:bg-zinc-950/50">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
            <div className="rounded-3xl border border-zinc-200 bg-white p-8 sm:p-14 dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="text-2xl font-extrabold tracking-tight text-zinc-950 sm:text-3xl dark:text-zinc-50">
                Ready to Create Your Marriage Biodata?
              </h2>
              <p className="mt-3 text-xs text-zinc-500 sm:text-sm dark:text-zinc-400">
                Choose from 6+ templates, customize details, and download a crisp vector PDF instantly.
              </p>
              <div className="mt-8 flex justify-center">
                <Button asChild size="lg">
                  <Link href="/biodata/biodata-generator">
                    Launch Biodata Studio Free <ArrowRight size={16} className="ml-1.5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
