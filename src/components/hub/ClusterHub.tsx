'use client';

import { GamingHub } from '@/components/gaming/GamingHub';
import { PUBLISHER_READY_TOOLS as TOOLS } from '@/lib/tools';

export function ClusterHub({
  prefix,
  prefixes,
  eyebrow,
  title,
  highlight,
  subtitle,
  groupTitle,
  groupDescription,
  searchPlaceholder = 'Search gauge, yarn, filament, pans, bpm…',
}: {
  prefix?: string;
  prefixes?: string[];
  eyebrow: string;
  title: string;
  highlight: string;
  subtitle: string;
  groupTitle: string;
  groupDescription: string;
  searchPlaceholder?: string;
}) {
  const keys = prefixes ?? (prefix ? [prefix] : []);
  const tools = TOOLS.filter((tool) => keys.some((key) => tool.href.startsWith(key)));
  return (
    <GamingHub
      eyebrow={eyebrow}
      title={title}
      highlight={highlight}
      subtitle={subtitle}
      groups={[{ title: groupTitle, description: groupDescription, tools }]}
      searchPlaceholder={searchPlaceholder}
    />
  );
}
