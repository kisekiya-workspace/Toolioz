'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from './ThemeProvider';
import { Sun, Moon, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ThemeToggleProps {
  className?: string;
  variant?: 'ghost' | 'outline' | 'default';
  size?: 'sm' | 'default' | 'icon' | 'icon-sm';
  showLabel?: boolean;
}

export function ThemeToggle({
  className = '',
  variant = 'ghost',
  size = 'icon-sm',
  showLabel = false,
}: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Toggle theme"
        className={`flex size-8 items-center justify-center rounded-md border border-zinc-200 text-zinc-400 dark:border-zinc-800 ${className}`}
      >
        <span className="size-4 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
      </button>
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Current: ${theme} mode (Click to toggle)`}
      className={`relative flex size-8 items-center justify-center rounded-md border border-zinc-200/80 bg-white text-zinc-700 transition-all duration-150 hover:border-zinc-300 hover:bg-zinc-100 hover:text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 ${className}`}
    >
      {isDark ? (
        <Sun size={15} className="text-amber-400 transition-transform duration-200 rotate-0 hover:rotate-45" />
      ) : (
        <Moon size={15} className="text-zinc-700 transition-transform duration-200 rotate-0 hover:-rotate-12" />
      )}
      {showLabel && (
        <span className="ml-2 text-xs font-medium capitalize">
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </span>
      )}
    </button>
  );
}
