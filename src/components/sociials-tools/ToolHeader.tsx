"use client";

import { usePathname } from "next/navigation";
import { Breadcrumbs } from "@/components/sociials-seo/Breadcrumbs";
import { TOOLS } from "@/data/sociials-tools";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck } from "lucide-react";

interface ToolHeaderProps {
  title: string;
  description: string;
}

export function ToolHeader({ title, description }: ToolHeaderProps) {
  const pathname = usePathname();
  const tool = TOOLS.find((t) => t.href === pathname) ?? TOOLS.find((t) => t.title === title);

  const breadcrumbs = [];

  if (tool) {
    breadcrumbs.push({
      label: tool.category,
      href: `/tools#category-${tool.category}`,
    });
  }

  breadcrumbs.push({
    label: title,
    href: tool?.href || pathname,
  });

  return (
    <header className="mb-8 space-y-4">
      <div>
        <Breadcrumbs items={breadcrumbs} />
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="max-w-3xl space-y-2">
          <div className="flex items-center gap-2">
            {tool && (
              <Badge variant="mono" size="sm">
                {tool.category}
              </Badge>
            )}
            <Badge variant="success" dot pulse size="sm" className="font-mono text-[10px]">
              100% Client-Side
            </Badge>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            {title}
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>

        {/* Privacy Micro-Badge */}
        <div className="hidden shrink-0 rounded-lg border border-emerald-500/20 bg-emerald-50/40 px-3.5 py-2 text-xs dark:bg-emerald-950/20 md:flex md:items-center md:gap-2">
          <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
          <span className="font-medium text-emerald-900 dark:text-emerald-300">
            Browser Sandbox Memory
          </span>
        </div>
      </div>
    </header>
  );
}
