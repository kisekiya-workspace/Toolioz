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
  Landmark,
  Code,
  FileText,
  ExternalLink,
  UserRound,
  Briefcase,
  Palette,
} from 'lucide-react';
import { CATEGORIES as TOOL_CATEGORIES, TOOLS } from '@/lib/tools';

const MAIN_NAV = [
  { name: 'Finance', href: '/finance', id: 'finance', icon: Landmark, color: '#3b82f6' },
  { name: 'DevTools', href: '/devtools', id: 'devtools', icon: Code, color: '#f59e0b' },
  { name: 'Design Studio', href: '/design', id: 'design', icon: Palette, color: '#06b6d4' },
  { name: 'PDFTools', href: '/pdftools', id: 'pdftools', icon: FileText, color: '#ef4444' },
  { name: 'Biodata', href: '/biodata', id: 'biodata', icon: UserRound, color: '#db2777' },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [closeTimeout, setCloseTimeout] = useState<NodeJS.Timeout | null>(null);

  const pathname = usePathname();

  const currentCategoryId = MAIN_NAV.find((item) => pathname.startsWith(item.href))?.id;
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

          <div className="hidden items-center gap-6 md:flex lg:gap-8">
            {MAIN_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  'flex items-center gap-2 py-2 text-sm font-medium transition-colors',
                  pathname.startsWith(item.href)
                    ? 'text-[var(--primary)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--primary)]',
                ].join(' ')}
              >
                <item.icon size={16} className="opacity-70" style={{ color: item.color }} />
                <span>{item.name}</span>
              </Link>
            ))}

            <div
              className="relative flex h-full items-center"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className={[
                  'flex items-center gap-2 rounded-full bg-[var(--bg-secondary)] px-4 py-2 text-sm font-semibold text-[var(--text-secondary)] transition-all hover:bg-[rgba(37,99,235,0.08)] hover:text-[var(--primary)]',
                  currentCategoryId ? 'bg-[rgba(37,99,235,0.08)] text-[var(--primary)]' : '',
                ].join(' ')}
              >
                <LayoutGrid size={16} />
                <span>{currentCategoryId ? currentCategory?.title : 'Categories'}</span>
                <ChevronDown
                  size={14}
                  className={activeDropdown === 'tools' ? 'rotate-180 transition-transform' : 'transition-transform'}
                />
              </button>

              {activeDropdown === 'tools' && (
                <div className="absolute right-0 top-[calc(100%+10px)] z-[1000] w-[600px] rounded-[var(--radius-xl)] border border-[var(--border)] bg-white p-6 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.1)]">
                  {currentCategoryId ? (
                    <div className="flex flex-col">
                      <div className="mb-4 flex items-center justify-between border-b border-[var(--border)] pb-3">
                        <h4 className="text-sm font-bold uppercase tracking-[0.05em] text-[var(--text-secondary)]">
                          {currentCategory?.title} Collection
                        </h4>
                        <Link
                          href={`/${currentCategoryId}`}
                          className="flex items-center gap-1 text-[0.8125rem] font-semibold text-[var(--primary)]"
                        >
                          View All <ChevronRight size={14} />
                        </Link>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {categoryTools.map((tool) => (
                          <Link
                            key={tool.id}
                            href={tool.href}
                            className="flex items-center gap-3 rounded-[var(--radius-md)] p-3 transition-all hover:translate-x-1 hover:bg-[var(--bg-secondary)]"
                          >
                            <div
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] bg-white"
                              style={{ color: tool.color }}
                            >
                              <tool.icon size={18} />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-semibold text-[var(--text-primary)]">
                                {tool.title}
                              </span>
                              <span className="max-w-[150px] truncate text-xs text-[var(--text-secondary)]">
                                {tool.desc}
                              </span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      {TOOL_CATEGORIES.map((category) => (
                        <Link
                          key={category.id}
                          href={`/${category.id}`}
                          className="flex gap-4 rounded-[var(--radius-lg)] p-4 transition-colors hover:bg-[var(--bg-secondary)]"
                        >
                          <div
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-[var(--bg-secondary)]"
                            style={{ color: category.color }}
                          >
                            <category.icon size={20} />
                          </div>
                          <div>
                            <h4 className="mb-1 text-[0.9375rem] font-bold text-[var(--text-primary)]">
                              {category.title}
                            </h4>
                            <p className="text-[0.8125rem] leading-5 text-[var(--text-secondary)]">
                              {category.desc}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            
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
              
              <h4 className="mb-4 pl-2 text-xs font-bold uppercase text-[var(--text-secondary)]">
                Categories
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
