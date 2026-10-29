'use client';

import { GamingHub } from '@/components/gaming/GamingHub';
import { SENSITIVITY_PAIRS } from '@/lib/gaming/sensitivity-pairs';
import { PUBLISHER_READY_TOOLS as TOOLS } from '@/lib/tools';

export default function GamingHubClient() {
  const gaming = TOOLS.filter((tool) => tool.category === 'gaming');
  return (
    <GamingHub
      eyebrow="Evergreen game math"
      title="Gaming"
      highlight="calculators"
      subtitle="Minecraft, FPS sensitivity, Pokemon types, and D&D 5e tools whose formulas do not change with patches. Palworld breeding is not on this hub."
      groups={[
        {
          title: 'Minecraft',
          description: 'Circle and sphere maps, nether portal coordinates, and shulker box stacks.',
          href: '/minecraft',
          tools: gaming.filter((tool) => tool.href.startsWith('/minecraft')),
        },
        {
          title: 'Mouse sensitivity',
          description: 'Hipfire yaw conversion with eDPI and cm/360. Pair pages cover CS2 to Valorant sens and related searches.',
          href: '/gaming/mouse-sensitivity-converter',
          tools: gaming.filter((tool) => tool.href.startsWith('/gaming')),
        },
        {
          title: 'Pokemon',
          description: 'Dual-type weakness using the Generation 6 type chart frozen since 2013.',
          href: '/pokemon',
          tools: gaming.filter((tool) => tool.href.startsWith('/pokemon')),
        },
        {
          title: 'Dungeons & Dragons',
          description: 'Dice notation and the 2014 5e encounter XP table.',
          href: '/dnd',
          tools: gaming.filter((tool) => tool.href.startsWith('/dnd')),
        },
      ]}
      extraLinks={SENSITIVITY_PAIRS.map((pair) => ({
        title: pair.title,
        href: `/gaming/${pair.slug}`,
        description: pair.description,
      }))}
    />
  );
}
