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
  Briefcase,
  Wrench,
  Search,
  Layers,
  Command,
  Boxes,
} from 'lucide-react';
import { CATEGORIES as TOOL_CATEGORIES, TOOLS } from '@/lib/tools';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

const MAIN_NAV = [
  { name: 'Finance', href: '/finance', id: 'finance' },
  { name: 'DevTools', href: '/devtools', id: 'devtools' },
  { name: 'PDF Tools', href: '/pdftools', id: 'pdftools' },
  { name: 'Guides', href: '/blog', id: 'guides', icon: BookOpen },
  { name: 'How-To', href: '/how-to', id: 'how-to', icon: FileText },
  { name: 'Top 5', href: '/top5', id: 'comparisons', icon: LayoutGrid },
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
    const handleScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (closeTimeout) clearTimeout(closeTimeout);
    };
  }, [closeTimeout]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <header
      className={[
        'sticky top-0 z-50 w-full border-b border-zinc-200/80 bg-white/90 backdrop-blur-md transition-all duration-200 dark:border-zinc-800/80 dark:bg-zinc-950/90',
        scrolled ? 'h-16' : 'h-[72px]',
      ].join(' ')}
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-3 py-1 transition-opacity hover:opacity-90"
          >
            <Image
              src="/tooliozLogo.svg"
              alt="Toolioz logo"
              width={40}
              height={40}
              className="h-9 w-9 shrink-0 rounded-lg object-contain"
              priority
            />
            <span className="text-xl font-black tracking-tight text-zinc-950 dark:text-zinc-50">
              Toolioz
            </span>
          </Link>

          {/* Desktop Search / Quick Action Pill */}
          <Link
            href="/tools"
            className="hidden md:flex items-center gap-2 rounded-full border border-zinc-200/80 bg-zinc-50/80 px-3.5 py-1.5 text-xs text-zinc-500 transition-colors hover:border-zinc-300 hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          >
            <Search size={13} className="shrink-0 text-zinc-400" />
            <span>Search 60+ tools…</span>
            <kbd className="pointer-events-none hidden h-4 select-none items-center gap-0.5 rounded border border-zinc-200 bg-white px-1.5 font-mono text-[10px] font-medium text-zinc-500 opacity-100 lg:inline-flex dark:border-zinc-700 dark:bg-zinc-800">
              <Command size={10} /> K
            </kbd>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex lg:gap-1.5">
          {/* Tools Mega-Menu Dropdown */}
          <div
            className="relative flex h-full items-center"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button
              className={[
                'relative flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all cursor-pointer border',
                currentCategoryId || pathname === '/tools'
                  ? 'border-zinc-200 dark:border-zinc-700/80 bg-zinc-100 dark:bg-zinc-800/90 text-zinc-950 dark:text-zinc-50 font-bold after:absolute after:bottom-1 after:left-2.5 after:right-2.5 after:h-[2px] after:rounded-full after:bg-zinc-900 dark:after:bg-zinc-100'
                  : 'border-transparent text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-800/80 dark:hover:text-zinc-50',
              ].join(' ')}
              aria-expanded={activeDropdown === 'tools'}
            >
              <Wrench size={15} className="opacity-80" />
              <span>Tools</span>
              <ChevronDown
                size={13}
                className={activeDropdown === 'tools' ? 'rotate-180 transition-transform duration-200' : 'transition-transform duration-200'}
              />
            </button>

            {activeDropdown === 'tools' && (
              <div className="absolute left-0 top-[calc(100%+8px)] z-50 w-[640px] rounded-2xl border border-zinc-200 bg-white p-5 text-zinc-950 animate-in fade-in-0 zoom-in-95 duration-150 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50">
                <div className="mb-4 flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
                  <div className="flex items-center gap-2">
                    <Boxes size={16} className="text-zinc-900 dark:text-zinc-100" />
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      Explore Utility Suites
                    </span>
                  </div>
                  <Link
                    href="/tools"
                    className="flex items-center gap-1 text-xs font-semibold text-zinc-700 hover:text-zinc-950 hover:underline dark:text-zinc-300 dark:hover:text-zinc-100"
                  >
                    View directory ({TOOLS.length}) <ChevronRight size={13} />
                  </Link>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {TOOL_CATEGORIES.map((category) => (
                    <Link
                      key={category.id}
                      href={`/${category.id}`}
                      className={[
                        'flex items-start gap-3 rounded-xl border p-3 transition-all duration-150 hover:border-zinc-300 hover:bg-zinc-50 dark:hover:border-zinc-700 dark:hover:bg-zinc-800/60',
                        currentCategoryId === category.id
                          ? 'border-zinc-300 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800/80'
                          : 'border-transparent bg-transparent',
                      ].join(' ')}
                    >
                      <div
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-semibold"
                        style={{ backgroundColor: `${category.color}15`, color: category.color }}
                      >
                        <category.icon size={17} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">{category.title}</span>
                          <span className="text-[11px] font-mono text-zinc-400">
                            {TOOLS.filter((t) => t.category === category.id).length}
                          </span>
                        </div>
                        <p className="line-clamp-1 text-xs text-zinc-500 mt-0.5">{category.desc}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {MAIN_NAV.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  'relative rounded-lg px-3 py-1.5 text-sm font-medium transition-all border',
                  isActive
                    ? 'border-zinc-200 dark:border-zinc-700/80 bg-zinc-100 dark:bg-zinc-800/90 text-zinc-950 dark:text-zinc-50 font-bold after:absolute after:bottom-1 after:left-2.5 after:right-2.5 after:h-[2px] after:rounded-full after:bg-zinc-900 dark:after:bg-zinc-100'
                    : 'border-transparent text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-800/80 dark:hover:text-zinc-50',
                ].join(' ')}
              >
                {item.name}
              </Link>
            );
          })}

          {/* Clean Styled Action Button & Theme Toggle */}
          <div className="ml-2 pl-2 flex items-center gap-2 border-l border-zinc-200 dark:border-zinc-800">
            <Button
              asChild
              size="sm"
              variant="outline"
              className="gap-1.5 border-zinc-200 bg-zinc-50 hover:bg-zinc-100 hover:border-zinc-300 text-zinc-800 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800 font-semibold"
            >
              <Link href="/resume-builder">
                <Briefcase size={14} className="text-zinc-600 dark:text-zinc-400" />
                <span>Resume Builder</span>
              </Link>
            </Button>
            <ThemeToggle />
          </div>
        </nav>

        {/* Mobile Controls */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Link href="/tools" className="p-2 text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50">
            <Search size={20} />
          </Link>
          <button
            className="flex size-9 items-center justify-center rounded-md border border-zinc-200 text-zinc-950 hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-800 cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-x-0 top-[72px] bottom-0 z-40 overflow-y-auto bg-white/95 p-6 backdrop-blur-xl md:hidden border-t border-zinc-200 dark:bg-zinc-950/95 dark:border-zinc-800">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full justify-center gap-2 border-zinc-200 bg-zinc-100 text-zinc-900 hover:bg-zinc-200 font-semibold dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
              >
                <Link href="/resume-builder" onClick={() => setIsOpen(false)}>
                  <Briefcase size={16} />
                  <span>ATS Resume Builder</span>
                </Link>
              </Button>
            </div>

            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-zinc-400">
                Tool Categories
              </p>
              <div className="grid grid-cols-1 gap-2">
                {TOOL_CATEGORIES.map((category) => (
                  <Link
                    key={category.id}
                    href={`/${category.id}`}
                    className={[
                      'flex items-center gap-3 rounded-xl border p-3 font-medium transition-colors',
                      pathname === `/${category.id}`
                        ? 'border-zinc-300 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800/80 text-zinc-950 dark:text-zinc-50 font-semibold'
                        : 'border-zinc-200 bg-white text-zinc-950 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800',
                    ].join(' ')}
                    onClick={() => setIsOpen(false)}
                  >
                    <div
                      className="flex size-8 items-center justify-center rounded-md"
                      style={{ backgroundColor: `${category.color}15`, color: category.color }}
                    >
                      <category.icon size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="block text-sm font-semibold">{category.title}</span>
                      <span className="block truncate text-xs text-zinc-500">{category.desc}</span>
                    </div>
                    <ChevronRight size={14} className="text-zinc-400" />
                  </Link>
                ))}
              </div>
            </div>

            {currentCategoryId && categoryTools.length > 0 && (
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-zinc-400">
                  In this category ({currentCategory?.title})
                </p>
                <div className="grid grid-cols-1 gap-1.5">
                  {categoryTools.slice(0, 8).map((tool) => (
                    <Link
                      key={tool.id}
                      href={tool.href}
                      className="flex items-center justify-between rounded-md p-2 text-sm text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
                      onClick={() => setIsOpen(false)}
                    >
                      <span className="truncate">{tool.title}</span>
                      <ChevronRight size={12} />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-zinc-400">
                Resources & Articles
              </p>
              <div className="grid grid-cols-1 gap-1.5">
                {[
                  { label: 'All Guides & Articles', href: '/blog', icon: BookOpen },
                  { label: 'Step-by-Step How-To', href: '/how-to', icon: FileText },
                  { label: 'Tool Comparisons & Top 5', href: '/top5', icon: LayoutGrid },
                  { label: 'All 60+ Tools Directory', href: '/tools', icon: Wrench },
                ].map(({ label, href, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-3 text-sm font-medium text-zinc-950 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800"
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon size={16} className="text-zinc-700 dark:text-zinc-300 shrink-0" />
                    <span className="flex-1">{label}</span>
                    <ChevronRight size={14} className="text-zinc-400" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
