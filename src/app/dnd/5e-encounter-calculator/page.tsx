import { JSONLD } from '@/components/ui/JSONLD';
import { buildBreadcrumbJsonLd, buildCalculatorJsonLd, buildHowToJsonLd, buildPageMetadata } from '@/lib/seo';
import { buildFaqJsonLd } from '@/lib/gaming/jsonld';
import EncounterClient from './EncounterClient';

const path = '/dnd/5e-encounter-calculator';
const description =
  'Rates a Dungeons and Dragons 5e encounter as Easy, Medium, Hard, or Deadly using the 2014 Dungeon Master\'s Guide XP table.';

export const metadata = buildPageMetadata({
  title: 'D&D 5e Encounter Calculator',
  description,
  path,
  keywords: ['5e encounter calculator', 'dnd encounter xp', 'deadly encounter 5e', 'cr xp calculator'],
});

export default function Page() {
  return (
    <>
      <JSONLD
        data={[
          buildCalculatorJsonLd({
            name: 'D&D 5e Encounter Calculator',
            description,
            path,
            applicationCategory: 'GameApplication',
          }),
          buildHowToJsonLd({
            name: 'How to rate a 5e encounter',
            description,
            path,
            steps: [
              { name: 'Enter the party', text: 'Set party size and character level.' },
              { name: 'Add monsters', text: 'Choose challenge rating and count for each group.' },
              { name: 'Read the band', text: 'Adjusted XP is compared with Easy, Medium, Hard, and Deadly budgets from the 2014 table.' },
            ],
          }),
          buildFaqJsonLd([
            {
              question: 'How is a 5e encounter rated Easy, Medium, Hard, or Deadly?',
              answer:
                'Party XP thresholds from the 2014 Dungeon Master\'s Guide are summed. Monster XP is multiplied by a count factor and compared with those budgets.',
            },
          ]),
          buildBreadcrumbJsonLd([
            { name: 'D&D tools', url: '/dnd' },
            { name: '5e encounter calculator', url: path },
          ]),
        ]}
      />
      <EncounterClient />
    </>
  );
}
