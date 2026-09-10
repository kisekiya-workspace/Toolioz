'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/badge';
import { Mail, Send } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { secondaryPageStyles as styles } from '@/app/SecondaryPage.styles';
import Link from 'next/link';

export default function ContactClient() {
  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Badge variant="outline" size="sm" className="mb-4 font-mono text-[11px]">
            Corrections, tool requests, privacy
          </Badge>
          <h1 className={styles.title}>Contact Toolioz</h1>
          <p className={styles.subtitle}>
            Email is the only support channel. Include the page URL when the issue is a number, a PDF, or a parse error.
          </p>
        </div>
      </header>

      <section className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-12 sm:px-6 sm:py-16 flex-1">
        <Card className="border-border bg-card p-8 sm:p-10">
          <div className="mb-6 flex justify-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:bg-blue-950/40">
              <Mail size={28} />
            </div>
          </div>
          <h2 className="mb-3 text-center text-xl font-bold tracking-tight text-foreground">support@toolioz.com</h2>
          <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
            Use this address for formula mismatches, broken downloads, privacy questions, and copyright notices. There is
            no chat widget and no phone line. Mail is read by the same team that maintains the calculators.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="mailto:support@toolioz.com"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-4 py-2.5 text-sm font-semibold"
            >
              <Mail size={16} className="text-blue-600" />
              <span>support@toolioz.com</span>
            </a>
            <a
              href="mailto:support@toolioz.com?subject=Formula%20correction"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              <Send size={14} />
              <span>Report a formula issue</span>
            </a>
          </div>
        </Card>

        <div className="space-y-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">What to include</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>The full URL (for example /finance/sip-calculator).</li>
            <li>The exact inputs and the result the page showed.</li>
            <li>The result you expected and, for tax or GST, a link to the official circular or portal calculator.</li>
            <li>Browser and device if a PDF or image tool failed.</li>
          </ul>
          <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">What we will not do by email</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>Prepare or file an income-tax return, GST return, or loan application.</li>
            <li>Give personalised investment advice or a “best fund” list.</li>
            <li>Open attachments that look like executable software. Send screenshots or a description instead of .exe files.</li>
          </ul>
          <p>
            Editorial standards are on the <Link href="/editorial-policy" className="text-blue-600 hover:underline">editorial policy</Link>{' '}
            page. How data is handled is on the <Link href="/privacy-policy" className="text-blue-600 hover:underline">privacy policy</Link>.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
