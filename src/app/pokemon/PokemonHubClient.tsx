'use client';

import { GamingHub } from '@/components/gaming/GamingHub';
import { PUBLISHER_READY_TOOLS as TOOLS } from '@/lib/tools';

export default function PokemonHubClient() {
  return (
    <GamingHub
      eyebrow="Type chart since 2013"
      title="Pokemon"
      highlight="type tools"
      subtitle="Dual-type weakness using the Generation 6 Pokemon type chart. Fairy was the last type added. The grid does not change with later games."
      groups={[
        {
          title: 'Pokemon tools',
          description: 'Defensive matchups for single-type and dual-type Pokemon.',
          tools: TOOLS.filter((tool) => tool.href.startsWith('/pokemon')),
        },
      ]}
    />
  );
}
