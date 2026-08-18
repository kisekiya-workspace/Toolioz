"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
    label: string;
    href: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.label,
            "item": `https://toolioz.com${item.href}`
        }))
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <nav aria-label="Breadcrumb" className="flex items-center text-sm font-medium text-muted-foreground mb-6 overflow-x-auto whitespace-nowrap pb-2 md:pb-0">
                <Link
                    href="/"
                    className="flex items-center gap-1 hover:text-primary transition-colors hover:underline underline-offset-4"
                >
                    <Home className="h-4 w-4" />
                    <span>Home</span>
                </Link>

                {items.map((item, index) => (
                    <div key={item.href} className="flex items-center">
                        <ChevronRight className="h-4 w-4 mx-2 opacity-50 flex-shrink-0" />
                        {index === items.length - 1 ? (
                            <span className="text-foreground font-semibold" aria-current="page">
                                {item.label}
                            </span>
                        ) : (
                            <Link
                                href={item.href}
                                className="hover:text-primary transition-colors hover:underline underline-offset-4"
                            >
                                {item.label}
                            </Link>
                        )}
                    </div>
                ))}
            </nav>
        </>
    );
}
