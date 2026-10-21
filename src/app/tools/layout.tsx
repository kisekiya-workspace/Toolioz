import type { Metadata } from 'next';
import { Footer } from '@/components/layout/Footer';
import { ToolNotifications } from '@/components/sociials-tools/ToolNotifications';

export const metadata: Metadata = {
  robots: {
    index: true,
    follow: true,
  },
};

export default function LegacyToolsLayout({ children }: { children: React.ReactNode }) {
  return <div className="bg-[#fafafa] text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">{children}<Footer /><ToolNotifications /></div>;
}
