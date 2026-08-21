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
      <nav aria-label="Breadcrumb" className="flex items-center text-xs font-medium text-muted-foreground mb-6 overflow-x-auto whitespace-nowrap pb-1">
        <Link
          href="/"
          className="flex items-center gap-1 hover:text-foreground transition-colors"
        >
          <Home className="size-3.5" />
          <span>Home</span>
        </Link>

        {items.map((item, index) => (
          <div key={item.href} className="flex items-center">
            <ChevronRight className="size-3 mx-2 text-muted-foreground/60 shrink-0" />
            {index === items.length - 1 ? (
              <span className="text-foreground font-semibold" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="hover:text-foreground transition-colors"
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
