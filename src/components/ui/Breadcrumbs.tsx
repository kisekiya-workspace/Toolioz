'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { CATEGORIES, TOOLS } from '@/lib/tools';

export const Breadcrumbs = () => {
  const pathname = usePathname();
  if (
    pathname === '/' ||
    pathname === '/resume-builder' ||
    pathname.startsWith('/blog/') ||
    pathname.startsWith('/how-to/') ||
    pathname.startsWith('/top5/')
  )
    return null;

  const pathSegments = pathname.split('/').filter(Boolean);
  
  // Construct breadcrumb items
  const items: { name: string; href: string; icon?: React.ComponentType<{ className?: string; size?: number }> }[] = [
    { name: 'Home', href: '/', icon: Home }
  ];

  let currentLink = '';
  pathSegments.forEach((segment) => {
    currentLink += `/${segment}`;
    
    // Check if segment is a category
    const category = CATEGORIES.find(c => c.id === segment);
    if (category) {
      items.push({ name: category.title, href: currentLink });
      return;
    }

    // Check if segment is a tool
    const tool = TOOLS.find(t => t.href === currentLink);
    if (tool) {
      items.push({ name: tool.title, href: currentLink });
      return;
    }

    // Fallback: capitalize segment
    const name = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
    items.push({ name, href: currentLink });
  });

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `https://toolioz.com${item.href}`
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="border-b border-border/80 bg-muted/40 py-2.5 backdrop-blur-xs">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
            {items.map((item, index) => {
              const isLast = index === items.length - 1;
              const Icon = item.icon;
              
              return (
                <li key={item.href} className="flex items-center gap-1.5">
                  {index > 0 && <ChevronRight size={12} className="text-muted-foreground/60 shrink-0" />}
                  {isLast ? (
                    <span className="font-medium text-foreground truncate max-w-[240px] sm:max-w-none" aria-current="page">
                      {item.name}
                    </span>
                  ) : (
                    <Link
                      href={item.href}
                      className="flex items-center gap-1 hover:text-foreground transition-colors"
                    >
                      {Icon && <Icon size={13} className="shrink-0" />}
                      <span className={Icon ? 'hidden sm:inline' : ''}>{item.name}</span>
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </nav>
    </>
  );
};
