import { JSONLD } from '@/components/ui/JSONLD';
import { buildBreadcrumbJsonLd, buildCalculatorJsonLd, buildHowToJsonLd, buildPageMetadata } from '@/lib/seo';
import { buildFaqJsonLd } from '@/lib/gaming/jsonld';
import ShulkerBoxClient from './ShulkerBoxClient';

const path = '/minecraft/shulker-box-calculator';
const description =
  'Counts how many items fit in Minecraft shulker boxes at stack sizes of 64, 16, or 1, including a double chest of boxes.';

export const metadata = buildPageMetadata({
  title: 'Minecraft Shulker Box Calculator',
  description,
  path,
  keywords: ['shulker box calculator', 'minecraft shulker stack', 'how many items in shulker box', 'double chest shulkers'],
});

export default function Page() {
  return (
    <>
      <JSONLD
        data={[
          buildCalculatorJsonLd({
            name: 'Minecraft Shulker Box Calculator',
            description,
            path,
            applicationCategory: 'GameApplication',
          }),
          buildHowToJsonLd({
            name: 'How to count shulker box storage',
            description,
            path,
            steps: [
              { name: 'Pick stack size', text: 'Use 64 for most blocks, 16 for ender pearls, or 1 for tools.' },
              { name: 'Enter boxes or items', text: 'Boxes times 27 slots times stack size is capacity. Items round up to whole boxes.' },
            ],
          }),
          buildFaqJsonLd([
            {
              question: 'How many items fit in a Minecraft shulker box?',
              answer: 'A shulker box has 27 slots. At stack 64 that is 1,728 items. A double chest of boxes holds 93,312 of a 64-stack item.',
            },
          ]),
          buildBreadcrumbJsonLd([
            { name: 'Minecraft tools', url: '/minecraft' },
            { name: 'Shulker box calculator', url: path },
          ]),
        ]}
      />
      <ShulkerBoxClient />
    </>
  );
}
