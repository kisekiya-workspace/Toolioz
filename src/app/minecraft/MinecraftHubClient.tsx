'use client';

import { GamingHub } from '@/components/gaming/GamingHub';
import { PUBLISHER_READY_TOOLS as TOOLS } from '@/lib/tools';

export default function MinecraftHubClient() {
  return (
    <GamingHub
      eyebrow="Minecraft cluster"
      title="Minecraft"
      highlight="calculators"
      subtitle="Circle and sphere maps, nether portal coordinates, and shulker box stacks. The math is block-grid geometry and does not change when Minecraft is patched."
      groups={[
        {
          title: 'Minecraft tools',
          description: 'Stable geometry and container math for Java and Bedrock builds.',
          tools: TOOLS.filter((tool) => tool.href.startsWith('/minecraft')),
        },
      ]}
    />
  );
}
