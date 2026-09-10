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
  BookOpen,
  FileText,
  Briefcase,
  Wrench,
  Search,
  Boxes,
} from 'lucide-react';
import { CATEGORIES as TOOL_CATEGORIES, PUBLISHER_READY_TOOLS as TOOLS } from '@/lib/tools';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

const PRIMARY_NAV = [
  { name: 'Finance', href: '/finance' },
  { name: 'DevTools', href: '/devtools' },
  { name: 'Design', href: '/design' },
  { name: 'PDF', href: '/pdftools' },
];

const MORE_NAV = [
  { name: 'Guides', href: '/blog', icon: BookOpen },
  { name: 'How-To', href: '/how-to', icon: FileText },
  { name: 'Resume Builder', href: '/resume-builder', icon: Briefcase },
];

function navItemClass(active: boolean) {
  return [
    'shrink-0 rounded-[6px] px-3 py-2 text-sm whitespace-nowrap xl:px-3.5',
    active
      ? 'bg-[#ebebeb] text-[#171717] dark:bg-[#262626] dark:text-[#ededed]'
      : 'text-[#4d4d4d] hover:bg-[#ebebeb] hover:text-[#171717] dark:text-[#a1a1a1] dark:hover:bg-[#262626] dark:hover:text-[#ededed]',
  ].join(' ');
}

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [closeTimeout, setCloseTimeout] = useState<NodeJS.Timeout | null>(null);

  const pathname = usePathname();

  const currentCategoryId = TOOL_CATEGORIES.find(
    (category) => pathname === `/${category.id}` || pathname.startsWith(`/${category.id}/`),
  )?.id;
  const currentCategory = TOOL_CATEGORIES.find((category) => category.id === currentCategoryId);
  const categoryTools = TOOLS.filter((tool) => tool.category === currentCategoryId);
  const moreActive = MORE_NAV.some(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
  );

  const handleMouseEnter = (id: string) => {
    if (closeTimeout) clearTimeout(closeTimeout);
    setActiveDropdown(id);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => setActiveDropdown(null), 150);
    setCloseTimeout(timeout);
  };

  useEffect(() => {
    return () => {
      if (closeTimeout) clearTimeout(closeTimeout);
    };
  }, [closeTimeout]);

  useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <header
      className="sticky top-0 z-50 w-full bg-[#fafafa]/90 backdrop-blur-md dark:bg-[#0a0a0a]/90"
      style={{ boxShadow: 'var(--header-border-bottom)' }}
    >
      <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center gap-4 px-4 sm:px-6">
        <Link href="/" className="flex min-w-0 shrink-0 items-center gap-2">
          <Image
            src="/tooliozLogo.svg"
            alt="Toolioz logo"
            width={32}
            height={40}
            className="h-8 w-8 shrink-0 object-contain"
            priority
          />
          <span className="truncate text-base font-semibold tracking-tight text-[#171717] dark:text-[#ededed]">
            Toolioz
          </span>
        </Link>

        <Link
          href="/tools"
          className="hidden min-w-0 items-center gap-2 rounded-[6px] bg-[#f2f2f2] px-3.5 py-2 text-xs text-[#8f8f8f] hover:bg-[#ebebeb] hover:text-[#171717] xl:flex dark:bg-[#171717] dark:hover:bg-[#262626] dark:hover:text-[#ededed]"
        >
          <Search size={13} className="shrink-0" />
          <span className="truncate">Search tools…</span>
        </Link>

        <nav className="ml-auto hidden min-w-0 items-center gap-1 lg:flex xl:gap-2">
          <div
            className="relative"
            onMouseEnter={() => handleMouseEnter('tools')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              className={`flex items-center gap-1.5 ${navItemClass(Boolean(currentCategoryId) || pathname === '/tools')}`}
              aria-expanded={activeDropdown === 'tools'}
            >
              <Wrench size={14} />
              Tools
              <ChevronDown size={12} className={activeDropdown === 'tools' ? 'rotate-180' : ''} />
            </button>

            {activeDropdown === 'tools' && (
              <div className="ds-menu absolute right-0 top-[calc(100%+8px)] z-50 w-[min(40rem,calc(100vw-1.5rem))] rounded-[12px] bg-white p-4 text-[#171717] dark:bg-[#111] dark:text-[#ededed]">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <Boxes size={16} className="shrink-0 text-[#171717] dark:text-[#ededed]" />
                    <span className="truncate text-xs font-medium uppercase tracking-wider text-[#8f8f8f]">
                      Suites
                    </span>
                  </div>
                  <Link href="/tools" className="shrink-0 text-xs text-[#0072F5]">
                    Directory ({TOOLS.length})
                  </Link>
                </div>
                <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
                  {TOOL_CATEGORIES.map((category) => (
                    <Link
                      key={category.id}
                      href={`/${category.id}`}
                      className={[
                        'flex items-start gap-3 rounded-[8px] p-3 hover:bg-[#fafafa] dark:hover:bg-[#171717]',
                        currentCategoryId === category.id ? 'bg-[#f2f2f2] dark:bg-[#171717]' : '',
                      ].join(' ')}
                    >
                      <div
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] text-sm"
                        style={{ backgroundColor: `${category.color}15`, color: category.color }}
                      >
                        <category.icon size={17} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate text-sm font-medium text-[#171717] dark:text-[#ededed]">
                            {category.title}
                          </span>
                          <span className="shrink-0 font-mono text-[11px] text-[#8f8f8f]">
                            {TOOLS.filter((t) => t.category === category.id).length}
                          </span>
                        </div>
                        <p className="mt-0.5 line-clamp-1 text-xs text-[#8f8f8f]">{category.desc}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {PRIMARY_NAV.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link key={item.href} href={item.href} className={navItemClass(isActive)}>
                {item.name}
              </Link>
            );
          })}

          <div
            className="relative"
            onMouseEnter={() => handleMouseEnter('more')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              className={`flex items-center gap-1.5 ${navItemClass(moreActive)}`}
              aria-expanded={activeDropdown === 'more'}
            >
              More
              <ChevronDown size={12} className={activeDropdown === 'more' ? 'rotate-180' : ''} />
            </button>
            {activeDropdown === 'more' && (
              <div className="ds-menu absolute right-0 top-[calc(100%+8px)] z-50 w-52 rounded-[12px] bg-white p-2 dark:bg-[#111]">
                {MORE_NAV.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-2 rounded-[6px] px-3 py-2 text-sm ${
                        isActive
                          ? 'bg-[#f2f2f2] text-[#171717] dark:bg-[#262626] dark:text-[#ededed]'
                          : 'text-[#4d4d4d] hover:bg-[#fafafa] hover:text-[#171717] dark:text-[#a1a1a1] dark:hover:bg-[#171717] dark:hover:text-[#ededed]'
                      }`}
                    >
                      <Icon size={14} className="shrink-0" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          <ThemeToggle className="ml-2" />
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2 lg:hidden">
          <ThemeToggle />
          <Link
            href="/tools"
            className="flex size-9 items-center justify-center rounded-[6px] text-[#4d4d4d] hover:bg-[#ebebeb] hover:text-[#171717] dark:text-[#a1a1a1] dark:hover:bg-[#262626] dark:hover:text-[#ededed]"
            aria-label="Search tools"
          >
            <Search size={18} />
          </Link>
          <button
            type="button"
            className="flex size-9 items-center justify-center rounded-[6px] text-[#171717] hover:bg-[#ebebeb] dark:text-[#ededed] dark:hover:bg-[#262626]"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto bg-[#fafafa] p-4 lg:hidden dark:bg-[#0a0a0a]">
          <div className="mx-auto flex max-w-lg flex-col gap-6 pb-10">
            <Link
              href="/resume-builder"
              onClick={() => setIsOpen(false)}
              className="flex h-12 items-center justify-center gap-2 rounded-[6px] bg-[#171717] text-sm text-white dark:bg-white dark:text-[#171717]"
            >
              <Briefcase size={16} />
              ATS Resume Builder
            </Link>

            <div>
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-[#8f8f8f]">
                Tool Categories
              </p>
              <div className="grid grid-cols-1 gap-2">
                {TOOL_CATEGORIES.map((category) => (
                  <Link
                    key={category.id}
                    href={`/${category.id}`}
                    className="flex items-center gap-3 rounded-[8px] bg-white p-3 ds-surface dark:bg-[#111]"
                    onClick={() => setIsOpen(false)}
                  >
                    <div
                      className="flex size-8 items-center justify-center rounded-[6px]"
                      style={{ backgroundColor: `${category.color}15`, color: category.color }}
                    >
                      <category.icon size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="block text-sm font-medium text-[#171717] dark:text-[#ededed]">
                        {category.title}
                      </span>
                      <span className="block truncate text-xs text-[#8f8f8f]">{category.desc}</span>
                    </div>
                    <ChevronRight size={14} className="shrink-0 text-[#8f8f8f]" />
                  </Link>
                ))}
              </div>
            </div>

            {currentCategoryId && categoryTools.length > 0 && (
              <div>
                <p className="mb-3 text-xs font-medium uppercase tracking-wider text-[#8f8f8f]">
                  In {currentCategory?.title}
                </p>
                <div className="grid grid-cols-1 gap-1">
                  {categoryTools.slice(0, 8).map((tool) => (
                    <Link
                      key={tool.id}
                      href={tool.href}
                      className="flex items-center justify-between rounded-[6px] p-2 text-sm text-[#4d4d4d] hover:bg-[#f2f2f2] hover:text-[#171717] dark:text-[#a1a1a1] dark:hover:bg-[#171717] dark:hover:text-[#ededed]"
                      onClick={() => setIsOpen(false)}
                    >
                      <span className="truncate">{tool.title}</span>
                      <ChevronRight size={12} className="shrink-0" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-[#8f8f8f]">
                More
              </p>
              <div className="grid grid-cols-1 gap-2">
                {MORE_NAV.map(({ name, href, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center gap-3 rounded-[8px] bg-white p-3 text-sm text-[#171717] ds-surface dark:bg-[#111] dark:text-[#ededed]"
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon size={16} className="shrink-0 text-[#4d4d4d] dark:text-[#a1a1a1]" />
                    <span className="flex-1">{name}</span>
                    <ChevronRight size={14} className="text-[#8f8f8f]" />
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
