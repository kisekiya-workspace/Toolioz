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
      className={`relative flex size-8 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition-colors duration-150 hover:border-[var(--border-strong)] hover:bg-accent hover:text-accent-foreground ${className}`}
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
