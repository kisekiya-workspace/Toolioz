'use client';

import { GamingHub } from '@/components/gaming/GamingHub';
import { PUBLISHER_READY_TOOLS as TOOLS } from '@/lib/tools';

export default function DndHubClient() {
  return (
    <GamingHub
      eyebrow="5e tables that do not move"
      title="D&D"
      highlight="dice & encounters"
      subtitle="A D&D dice roller for 5e notation and a 2014 encounter calculator. Dice grammar and XP thresholds are not tied to a monster-book revision."
      groups={[
        {
          title: 'D&D tools',
          description: 'Roll notation and 2014 Dungeon Master\'s Guide encounter budgets.',
          tools: TOOLS.filter((tool) => tool.href.startsWith('/dnd')),
        },
      ]}
    />
  );
}
