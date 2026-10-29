import { JSONLD } from '@/components/ui/JSONLD';
import { buildBreadcrumbJsonLd, buildCalculatorJsonLd, buildHowToJsonLd, buildPageMetadata } from '@/lib/seo';
import { buildFaqJsonLd } from '@/lib/gaming/jsonld';
import DiceRollerClient from './DiceRollerClient';

const path = '/dnd/dice-roller';
const description =
  'Rolls Dungeons and Dragons dice from standard notation such as 4d6kh3, 2d20kh1, and 8d6 plus a modifier.';

export const metadata = buildPageMetadata({
  title: 'D&D Dice Roller',
  description,
  path,
  keywords: ['dnd dice roller', 'd20 roller', '4d6 drop lowest', 'advantage roller 5e'],
});

export default function Page() {
  return (
    <>
      <JSONLD
        data={[
          buildCalculatorJsonLd({
            name: 'D&D Dice Roller',
            description,
            path,
            applicationCategory: 'GameApplication',
          }),
          buildHowToJsonLd({
            name: 'How to roll D&D dice online',
            description,
            path,
            steps: [
              { name: 'Enter notation', text: 'Use 1d20+5, 2d20kh1 for advantage, or 4d6kh3 for ability scores.' },
              { name: 'Roll', text: 'Kept faces are highlighted. History stays in the browser tab.' },
            ],
          }),
          buildFaqJsonLd([
            {
              question: 'How does a D&D dice roller handle advantage?',
              answer: 'Advantage is 2d20kh1. Disadvantage is 2d20kl1. Ability scores use 4d6kh3.',
            },
          ]),
          buildBreadcrumbJsonLd([
            { name: 'D&D tools', url: '/dnd' },
            { name: 'Dice roller', url: path },
          ]),
        ]}
      />
      <DiceRollerClient />
    </>
  );
}
