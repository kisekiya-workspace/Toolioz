interface ContentSectionProps {
    title: string;
    children: React.ReactNode;
}

export function ToolContentSection({ title, children }: ContentSectionProps) {
    return (
        <section className="space-y-4 py-8 border-t first:border-t-0">
            <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
            <div className="prose prose-zinc dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
                {children}
            </div>
        </section>
    );
}

export function ToolFAQ({ questions }: { questions: { q: string; a: string }[] }) {
    return (
        <ToolContentSection title="Frequently Asked Questions">
            <div className="grid gap-6">
                {questions.map((item, i) => (
                    <div key={i} className="space-y-2">
                        <h3 className="font-semibold text-foreground text-lg">{item.q}</h3>
                        <p>{item.a}</p>
                    </div>
                ))}
            </div>
        </ToolContentSection>
    );
}
