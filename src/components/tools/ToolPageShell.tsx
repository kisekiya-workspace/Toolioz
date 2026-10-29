'use client';

import type { ReactNode } from 'react';
import { Footer } from '@/components/layout/Footer';
import { DirectAnswerBlock } from '@/components/ui/DirectAnswerBlock';
import { SEOSection } from '@/components/ui/SEOSection';
import { RelatedTools } from '@/components/ui/RelatedTools';
import { BreadcrumbJsonLd } from '@/components/ui/BreadcrumbJsonLd';
import { GamingFaq } from '@/components/gaming/GamingFaq';
import { ToolAccuracyNote } from '@/components/tools/ToolAccuracyNote';
import { calculatorPageStyles as styles } from '@/app/finance/compound-interest/page.styles';

export interface ToolPageShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  directAnswerTitle: string;
  directAnswer: string;
  takeaways: string[];
  categoryName: string;
  seoTitle: string;
  seoDescription: string;
  howToUse: string[];
  benefits: string[];
  formula?: string;
  faqs: Array<{ question: string; answer: string }>;
  currentToolId: string;
  relatedIds?: string[];
  relatedCategoryId?: string;
  breadcrumbs: Array<{ name: string; url: string }>;
  accuracyNote?: string;
}

export function ToolPageShell({
  title,
  subtitle,
  children,
  directAnswerTitle,
  directAnswer,
  takeaways,
  categoryName,
  seoTitle,
  seoDescription,
  howToUse,
  benefits,
  formula,
  faqs,
  currentToolId,
  relatedIds,
  relatedCategoryId = 'makers',
  breadcrumbs,
  accuracyNote,
}: ToolPageShellProps) {
  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />
      <div className="min-h-screen bg-[var(--bg-primary)]">
        <header className={styles.header}>
          <div className="container">
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.subtitle}>{subtitle}</p>
          </div>
        </header>

        <div className="container">
          <DirectAnswerBlock
            title={directAnswerTitle}
            answer={directAnswer}
            keyTakeaways={takeaways}
            categoryName={categoryName}
          />
        </div>

        <section className="container pb-12 pt-2">{children}</section>
        <ToolAccuracyNote extra={accuracyNote} />

        <SEOSection
          title={seoTitle}
          description={seoDescription}
          howToUse={howToUse}
          benefits={benefits}
          formula={formula}
        />
        <GamingFaq faqs={faqs} />
        <RelatedTools currentToolId={currentToolId} categoryId={relatedCategoryId} ids={relatedIds} limit={6} />
        <Footer />
      </div>
    </>
  );
}
