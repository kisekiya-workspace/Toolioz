'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { CATEGORIES, TOOLS } from '@/lib/tools';

export const Breadcrumbs = () => {
  const pathname = usePathname();
  if (pathname === '/' || pathname === '/resume-builder') return null;

  const pathSegments = pathname.split('/').filter(Boolean);
  
  // Construct breadcrumb items
  const items: { name: string; href: string; icon?: any }[] = [
    { name: 'Home', href: '/', icon: Home }
  ];

  let currentLink = '';
  pathSegments.forEach((segment, index) => {
    currentLink += `/${segment}`;
    
    // Check if segment is a category
    const category = CATEGORIES.find(c => c.id === segment);
    if (category) {
      items.push({ name: category.title, href: currentLink, icon: undefined });
      return;
    }

    // Check if segment is a tool
    const tool = TOOLS.find(t => t.href === currentLink);
    if (tool) {
      items.push({ name: tool.title, href: currentLink, icon: undefined });
      return;
    }

    // Fallback: capitalize segment
    const name = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
    items.push({ name, href: currentLink, icon: undefined });
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
      <nav aria-label="Breadcrumb" className="border-b border-[var(--border)] bg-[var(--bg-secondary)] py-4">
        <div className="mx-auto max-w-6xl px-6">
          <ol className="flex flex-wrap items-center">
            {items.map((item, index) => {
              const isLast = index === items.length - 1;
              
              return (
                <li key={item.href} className="flex items-center text-[0.8125rem]">
                  {index > 0 && <ChevronRight size={14} className="mx-3 text-[var(--text-tertiary)]" />}
                  {isLast ? (
                    <span className="font-semibold text-[var(--text-primary)]" aria-current="page">
                      {item.name}
                    </span>
                  ) : (
                    <Link
                      href={item.href}
                      className="flex items-center gap-1.5 text-[var(--text-secondary)] transition-colors hover:text-[var(--primary)]"
                    >
                      {item.icon && <item.icon size={14} className="mb-px" />}
                      <span className={item.icon ? 'hidden sm:inline' : ''}>{item.name}</span>
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
