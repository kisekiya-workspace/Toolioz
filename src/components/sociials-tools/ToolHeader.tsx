"use client";

import { usePathname } from "next/navigation";
import { Breadcrumbs } from "@/components/sociials-seo/Breadcrumbs";
import { TOOLS } from "@/data/sociials-tools";
import { RelatedGuides } from "./RelatedGuides";

interface ToolHeaderProps {
    title: string;
    description: string;
    // Optional: Pass slug manually if needed, or derive from context/path if we had it. 
    // Since this is a server/client generic component, we rely on title matching or URL matching.
    // However, ToolHeader doesn't know its own URL seamlessly without hooks.
    // We can lookup by title for now.
}

export function ToolHeader({ title, description }: ToolHeaderProps) {
    const pathname = usePathname();
    const tool = TOOLS.find(t => t.href === pathname) ?? TOOLS.find(t => t.title === title);

    // Construct breadcrumbs
    const breadcrumbs = [];

    if (tool) {
        // Add Category
        breadcrumbs.push({
            label: tool.category,
            href: `/tools#category-${tool.category}`
        });
    }

    // Add Current Tool
    breadcrumbs.push({
        label: title,
        // If we found the tool, use its href, otherwise just use # or assume current
        href: tool?.href || pathname
    });

    return (
        <div className="space-y-6 mb-12">
            <div className="mb-4">
                <Breadcrumbs items={breadcrumbs} />
            </div>

        <div className="space-y-4">
                <h1 className="text-4xl font-black tracking-tighter md:text-6xl lg:text-7xl">
                    {title}
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl font-medium leading-relaxed">
                    {description}
                </p>
                <div className="h-1.5 w-20 bg-primary/20 rounded-full" />
            </div>
            <RelatedGuides />
        </div>
    );
}
