'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import { Mail, MessageSquare, Send, Sparkles } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { secondaryPageStyles as styles } from '@/app/SecondaryPage.styles';

export default function ContactClient() {
  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Badge variant="outline" dot pulse size="sm" className="mb-4 font-mono text-[11px]">
            <Sparkles size={12} className="mr-1 text-blue-600" />
            Support & Tool Requests
          </Badge>
          <h1 className={styles.title}>Contact & Feedback</h1>
          <p className={styles.subtitle}>
            Have an idea for a new calculator, found a formula discrepancy, or need a custom utility? Reach out anytime.
          </p>
        </div>
      </header>

      <section className="mx-auto flex max-w-xl flex-col gap-6 px-4 py-12 sm:px-6 sm:py-16 flex-1">
        <Card className="border-border bg-card p-8 sm:p-10 text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:bg-blue-950/40">
              <Mail size={28} />
            </div>
          </div>
          <h2 className="mb-2 text-xl font-bold tracking-tight text-foreground">Direct Engineering Inbox</h2>
          <p className="mb-8 text-xs sm:text-sm text-muted-foreground leading-relaxed">
            We actively build features requested by our community. Send your questions or suggestions directly to our team.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="mailto:support@toolioz.com"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-border-strong hover:bg-muted"
            >
              <Mail size={16} className="text-blue-600" />
              <span>support@toolioz.com</span>
            </a>
            <Button asChild size="default" className="gap-2">
              <a href="mailto:support@toolioz.com?subject=Tool%20Suggestion">
                <Send size={14} />
                <span>Send Suggestion</span>
              </a>
            </Button>
          </div>
        </Card>
      </section>

      <Footer />
    </div>
  );
}
