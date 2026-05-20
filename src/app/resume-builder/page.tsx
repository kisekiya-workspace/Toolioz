import React from 'react';
import Link from 'next/link';
import { ArrowRight, FileText, CheckCircle, Search, ShieldCheck, Zap } from 'lucide-react';
import { JSONLD } from '@/components/ui/JSONLD';
import { buildCalculatorJsonLd, buildPageMetadata } from '@/lib/seo';
import { resumeBlogPosts } from '@/lib/resume-blog-content';

export const metadata = buildPageMetadata({
  title: 'Free ATS-Friendly Resume Builder 2026 | Vector PDF | Toolioz',
  description:
    'Create a professional, ATS-optimized vector PDF resume in minutes. Visual templates or LaTeX mode—free download, no signup.',
  path: '/resume-builder',
  keywords: [
    'resume builder',
    'ats friendly resume',
    'latex resume builder',
    'free resume generator',
    'resume format for freshers india',
  ],
});

const RESUME_APP_PATH = '/pdftools/resume-generator';

export default function ResumeBuilderLanding() {
  return (
    <>
      <JSONLD
        data={buildCalculatorJsonLd({
          name: 'ATS Resume Builder',
          description: 'Free resume maker with vector PDF export for applicant tracking systems.',
          path: RESUME_APP_PATH,
          applicationCategory: 'BusinessApplication',
        })}
      />
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">

      {/* Hero Section (Solid Colors, No Gradients) */}
      <section className="bg-slate-900 py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Build a Resume That Actually Passes the <span className="text-blue-400">ATS</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
            Stop losing out to automated resume scanners. Generate a flawless, vector-based PDF that recruiters and ATS bots love. Free, instant, and fully private.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href={RESUME_APP_PATH}
              className="inline-flex h-14 items-center justify-center rounded-lg bg-blue-600 px-8 text-lg font-semibold text-white shadow-sm transition-colors hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              Create My Free Resume
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="#features"
              className="inline-flex h-14 items-center justify-center rounded-lg bg-slate-800 px-8 text-lg font-semibold text-white transition-colors hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              Learn More
            </Link>
          </div>
          
          <div className="mt-12 flex items-center justify-center gap-8 text-sm font-medium text-slate-400 sm:mt-16">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-400" /> No Sign-up Required
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-400" /> 100% Private
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-400" /> Vector PDFs
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Everything you need to get hired</h2>
            <p className="mt-4 text-lg text-slate-600">We rebuilt the resume creation process from the ground up to prioritize parsing accuracy.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <Search className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-slate-900">ATS-Optimized Output</h3>
              <p className="text-slate-600">
                Instead of using messy HTML printing, our engine generates true vector PDFs using PDF-lib. This means ATS software can highlight, parse, and understand your data perfectly.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100">
                <Code2Icon className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-slate-900">Dual Editing Modes</h3>
              <p className="text-slate-600">
                Choose the Visual mode for easy form-filling with colorful themes, or switch to LaTeX mode for pixel-perfect, academic-grade customization via our remote compiler.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-slate-200">
                <ShieldCheck className="h-6 w-6 text-slate-700" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-slate-900">Local Persistence</h3>
              <p className="text-slate-600">
                Your data never leaves your browser unless you use the LaTeX compiler. Everything is saved locally in your browser storage so you can safely close the tab and return later.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats/Preview Callout */}
      <section className="bg-blue-600 py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <Zap className="mx-auto mb-6 h-12 w-12 text-blue-200" />
          <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl">
            Stop worrying about formatting. Start applying.
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-blue-100">
            Our templates are based on what FAANG recruiters actually look for. Clean structures, bold headings, and zero unparseable elements.
          </p>
          <Link
            href={RESUME_APP_PATH}
            className="inline-flex h-14 items-center justify-center rounded-lg bg-white px-8 text-lg font-bold text-blue-600 transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
          >
            Launch Builder
          </Link>
        </div>
      </section>

      {/* Blogs / Resources Section */}
      <section className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">Career Resources</h2>
              <p className="mt-2 text-slate-600">Expert advice on crafting the perfect application.</p>
            </div>
            <Link href="/resume-builder/blog" className="hidden font-semibold text-blue-600 hover:text-blue-700 sm:block">
              View all articles &rarr;
            </Link>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {resumeBlogPosts.map((post) => (
              <article key={post.slug} className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-shadow hover:shadow-md">
                <div className="flex-1 p-8">
                  <div className="mb-4 flex items-center gap-3 text-sm text-slate-500">
                    <span className="font-bold uppercase tracking-wider text-blue-600">{post.readTime}</span>
                    <span>•</span>
                    <span className="font-medium">Updated {post.updated}</span>
                  </div>
                  <h3 className="mb-4 text-2xl font-bold text-slate-900 leading-tight">
                    {post.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {post.description}
                  </p>
                </div>
                <div className="bg-slate-50 px-8 py-5 border-t border-slate-100">
                  <Link href={`/resume-builder/blog/${post.slug}`} className="font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-2">
                    Read article <ArrowRight size={16} />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-12 text-center sm:hidden">
            <Link href="/resume-builder/blog" className="inline-flex items-center font-semibold text-blue-600 hover:text-blue-700">
              View all articles &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <FileText className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold text-slate-900">ResumeBuilder</span>
          </div>
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Toolioz Suite. All rights reserved. Built for accuracy.
          </p>
        </div>
      </footer>
    </div>
    </>
  );
}

function Code2Icon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}
