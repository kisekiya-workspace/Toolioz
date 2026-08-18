import { ToolContentSection, ToolFAQ } from "./ToolContent";

interface ToolGuideProps {
    title: string;
    sections: { title: string; content: React.ReactNode }[];
    faqs?: { q: string; a: string }[];
}

export function ToolGuide({ title, sections, faqs }: ToolGuideProps) {
    const faqSchema = faqs ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.q,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.a
            }
        }))
    } : null;

    return (
        <div className="max-w-4xl mx-auto space-y-12 mt-20 pt-12 border-t border-border/40">
            {faqSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
                />
            )}

            <div className="space-y-4 text-center mb-16">
                <h2 className="text-3xl font-black tracking-tightest">In-Depth Guide: {title}</h2>
                <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs">Everything you need to know</p>
                <div className="h-1 w-12 bg-primary mx-auto rounded-full" />
            </div>

            <div className="grid grid-cols-1 gap-12">
                {sections.map((section, i) => (
                    <ToolContentSection key={i} title={section.title}>
                        <div className="prose prose-zinc dark:prose-invert max-w-none text-muted-foreground font-medium leading-relaxed">
                            {section.content}
                        </div>
                    </ToolContentSection>
                ))}
            </div>

            {faqs && faqs.length > 0 && (
                <div className="pt-12 border-t border-border/40">
                    <ToolFAQ questions={faqs} />
                </div>
            )}
        </div>
    );
}
