"use client";

import Link from "next/link";
import { ArrowUpRight, BookOpen } from "lucide-react";
import { usePathname } from "next/navigation";
import { getTooliozGuidesForPath } from "@/lib/toolioz-blog-index";

export function RelatedGuides() {
  const pathname = usePathname();
  const guides = getTooliozGuidesForPath(pathname);

  if (!guides.length) return null;

  return (
    <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm" aria-labelledby="related-guides-heading">
      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-slate-500">
        <BookOpen size={15} className="text-blue-600" /> Helpful guide for this tool
      </div>
      <h2 id="related-guides-heading" className="mt-2 text-xl font-black text-slate-900">Learn it, then use it</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {guides.map((guide) => (
          <Link key={guide.href} href={guide.href} className="group rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-blue-300 hover:bg-blue-50">
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-blue-700">{guide.category}</span>
            <span className="mt-2 block text-sm font-bold leading-6 text-slate-800 group-hover:text-blue-800">{guide.title}</span>
            <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-blue-700">Read guide <ArrowUpRight size={13} /></span>
          </Link>
        ))}
      </div>
    </section>
  );
}
