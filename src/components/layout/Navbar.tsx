'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  ChevronDown,
  Menu,
  X,
  ChevronRight,
  LayoutGrid,
  BookOpen,
  FileText,
  ExternalLink,
  Briefcase,
  Wrench,
} from 'lucide-react';
import { CATEGORIES as TOOL_CATEGORIES, TOOLS } from '@/lib/tools';

const MAIN_NAV = [
  { name: 'Guides', href: '/blog', id: 'guides', icon: BookOpen, color: '#2563eb' },
  { name: 'How-To', href: '/how-to', id: 'how-to', icon: FileText, color: '#06b6d4' },
  { name: 'Comparisons', href: '/top5', id: 'comparisons', icon: LayoutGrid, color: '#f59e0b' },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [closeTimeout, setCloseTimeout] = useState<NodeJS.Timeout | null>(null);

  const pathname = usePathname();

  const currentCategoryId = TOOL_CATEGORIES.find((category) =>
    pathname === `/${category.id}` || pathname.startsWith(`/${category.id}/`)
  )?.id;
  const currentCategory = TOOL_CATEGORIES.find((category) => category.id === currentCategoryId);
  const categoryTools = TOOLS.filter((tool) => tool.category === currentCategoryId);

  const handleMouseEnter = () => {
    if (closeTimeout) clearTimeout(closeTimeout);
    setActiveDropdown('tools');
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
    setCloseTimeout(timeout);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (closeTimeout) clearTimeout(closeTimeout);
    };
  }, [closeTimeout]);

  return (
    <nav
      className={[
        'sticky top-0 z-[100] flex items-center border-b border-transparent bg-[var(--bg-primary)] transition-all duration-300',
        scrolled
          ? 'h-16 border-b-[var(--border)] shadow-[0_4px_20px_-5px_rgba(0,0,0,0.05)]'
          : 'h-[72px]',
      ].join(' ')}
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="flex min-w-0 items-center gap-2 py-2 text-xl font-extrabold text-[var(--text-primary)] transition-opacity hover:opacity-80 sm:gap-3 sm:text-[1.35rem]"
          >
            <Image
              src="/tooliozLogo.svg"
              alt="Toolioz logo"
              width={48}
              height={48}
              className="h-9 w-9 shrink-0 rounded-md object-contain sm:h-12 sm:w-12"
              priority
            />
            <span>Toolioz</span>
          </Link>

          <div className="hidden items-center gap-3 md:flex lg:gap-4">
            <div
              className="relative flex h-full items-center"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className={[
                  'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all',
                  currentCategoryId || pathname === '/tools'
                    ? 'bg-[rgba(37,99,235,0.1)] text-[var(--primary)]'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--primary)]',
                ].join(' ')}
                aria-expanded={activeDropdown === 'tools'}
              >
                <Wrench size={16} className="text-blue-600" />
                <span>Tools</span>
                <ChevronDown
                  size={14}
                  className={activeDropdown === 'tools' ? 'rotate-180 transition-transform' : 'transition-transform'}
                />
              </button>

              {activeDropdown === 'tools' && (
                <div className="absolute left-0 top-[calc(100%+10px)] z-[1000] w-[680px] rounded-3xl border border-[var(--border)] bg-white p-6 shadow-[0_24px_60px_-18px_rgba(15,23,42,0.22)]">
                  <div className="mb-5 flex items-end justify-between border-b border-[var(--border)] pb-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">Toolioz toolbox</p>
                      <h4 className="mt-1 text-xl font-black text-[var(--text-primary)]">Choose a tool category</h4>
                    </div>
                    <Link href="/tools" className="flex items-center gap-1 text-sm font-bold text-[var(--primary)] hover:underline">
                      View all tools <ChevronRight size={14} />
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {TOOL_CATEGORIES.map((category) => (
                      <Link
                        key={category.id}
                        href={`/${category.id}`}
                        className={[
                          'flex items-center gap-3 rounded-2xl border p-3 transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:bg-[var(--bg-secondary)]',
                          currentCategoryId === category.id ? 'border-blue-200 bg-blue-50/60' : 'border-transparent',
                        ].join(' ')}
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--bg-secondary)]" style={{ color: category.color }}>
                          <category.icon size={18} />
                        </div>
                        <div className="min-w-0">
                          <span className="block text-sm font-bold text-[var(--text-primary)]">{category.title}</span>
                          <span className="block truncate text-xs text-[var(--text-secondary)]">{category.desc}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {MAIN_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  'flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-semibold transition-colors',
                  pathname.startsWith(item.href)
                    ? 'bg-[rgba(37,99,235,0.1)] text-[var(--primary)]'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--primary)]',
                ].join(' ')}
              >
                <item.icon size={16} className="opacity-70" style={{ color: item.color }} />
                <span>{item.name}</span>
              </Link>
            ))}

            <Link
              href="/resume-builder"
              className="hidden lg:flex items-center gap-2 rounded-full bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-blue-700"
            >
              <Briefcase size={16} />
              <span>Resume Builder</span>
            </Link>
          </div>

          <button className="z-[2100] block md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <div
        className={[
          'fixed inset-0 z-[2000] overflow-y-auto bg-[var(--glass)] pb-10 pt-[100px] backdrop-blur-[20px] transition-transform duration-300 md:hidden',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        ].join(' ')}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col gap-10">
            {currentCategoryId && (
              <div>
                <h4 className="mb-4 pl-2 text-xs font-bold uppercase text-[var(--text-secondary)]">
                  {currentCategory?.title}
                </h4>
                <div className="flex flex-col gap-2">
                  {categoryTools.map((tool) => (
                    <Link
                      key={tool.id}
                      href={tool.href}
                      className="flex items-center gap-4 rounded-xl bg-[var(--bg-secondary)] p-4 font-semibold text-[var(--text-primary)]"
                      onClick={() => setIsOpen(false)}
                    >
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-white"
                        style={{ color: tool.color }}
                      >
                        <tool.icon size={20} />
                      </div>
                      <span className="flex-1">{tool.title}</span>
                      <ExternalLink size={12} />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div>
              <Link
                href="/resume-builder"
                className="mb-8 flex items-center gap-4 rounded-xl bg-[var(--primary)] p-4 font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
                onClick={() => setIsOpen(false)}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-white/20">
                  <Briefcase size={20} />
                </div>
                <span className="flex-1">ATS Resume Builder</span>
                <ChevronRight size={14} />
              </Link>
              
              <h4 className="mb-4 pl-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--text-secondary)]">
                Explore
              </h4>
              <div className="mb-5 grid grid-cols-1 gap-2">
                {[
                  { label: 'All guides', href: '/blog', icon: BookOpen },
                  { label: 'How-to tutorials', href: '/how-to', icon: FileText },
                  { label: 'Tool comparisons', href: '/top5', icon: LayoutGrid },
                ].map(({ label, href, icon: Icon }) => (
                  <Link key={href} href={href} className="flex items-center gap-4 rounded-xl bg-white/70 p-4 font-semibold text-[var(--text-primary)]" onClick={() => setIsOpen(false)}>
                    <Icon size={20} className="text-blue-600" />
                    <span className="flex-1">{label}</span>
                    <ChevronRight size={14} />
                  </Link>
                ))}
              </div>
              <h4 className="mb-4 pl-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--text-secondary)]">
                Tool categories
              </h4>
              <div className="flex flex-col gap-2">
                {TOOL_CATEGORIES.map((category) => (
                  <Link
                    key={category.id}
                    href={`/${category.id}`}
                    className={[
                      'flex items-center gap-4 rounded-xl p-4 font-semibold',
                      pathname === `/${category.id}`
                        ? 'bg-[rgba(37,99,235,0.08)] text-[var(--primary)]'
                        : 'bg-[var(--bg-secondary)] text-[var(--text-primary)]',
                    ].join(' ')}
                    onClick={() => setIsOpen(false)}
                  >
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-white"
                      style={{ color: category.color }}
                    >
                      <category.icon size={20} />
                    </div>
                    <span className="flex-1">{category.title} Hub</span>
                    <ChevronRight size={14} />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
