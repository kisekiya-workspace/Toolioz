"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";

interface ContentSectionProps {
  title: string;
  children: React.ReactNode;
}

export function ToolContentSection({ title, children }: ContentSectionProps) {
  return (
    <section className="space-y-4 py-8 border-t border-border/80 first:border-t-0">
      <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">{title}</h2>
      <div className="prose prose-zinc dark:prose-invert max-w-none text-muted-foreground leading-relaxed text-sm">
        {children}
      </div>
    </section>
  );
}

export function ToolFAQ({ questions }: { questions: { q: string; a: string }[] }) {
  return (
    <ToolContentSection title="Frequently Asked Questions">
      <Card className="border-border bg-card p-6 mt-4">
        <Accordion type="single" collapsible className="w-full">
          {questions.map((item, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger className="text-sm font-semibold text-foreground">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Card>
    </ToolContentSection>
  );
}
