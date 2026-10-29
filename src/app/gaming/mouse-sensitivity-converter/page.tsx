import { JSONLD } from '@/components/ui/JSONLD';
import { buildBreadcrumbJsonLd, buildCalculatorJsonLd, buildHowToJsonLd, buildPageMetadata } from '@/lib/seo';
import { buildFaqJsonLd } from '@/lib/gaming/jsonld';
import SensitivityClient from './SensitivityClient';

const path = '/gaming/mouse-sensitivity-converter';
const description =
  'Converts mouse sensitivity and eDPI between FPS games using each title\'s yaw constant. Pair pages cover CS2, Valorant, and Apex.';

export const metadata = buildPageMetadata({
  title: 'Mouse Sensitivity Converter with eDPI',
  description,
  path,
  keywords: [
    'mouse sensitivity converter',
    'edpi calculator',
    'cs2 to valorant sens',
    'cm/360 calculator',
    'fps sensitivity converter',
  ],
});

export default function Page() {
  return (
    <>
      <JSONLD
        data={[
          buildCalculatorJsonLd({
            name: 'Mouse Sensitivity Converter with eDPI',
            description,
            path,
            applicationCategory: 'GameApplication',
          }),
          buildHowToJsonLd({
            name: 'How to convert mouse sensitivity between games',
            description,
            path,
            steps: [
              { name: 'Pick two games', text: 'Choose the source game and the destination game from the yaw table.' },
              { name: 'Enter sensitivity and DPI', text: 'Use hipfire sensitivity. Change destination DPI only when the mouse DPI will change.' },
              { name: 'Read eDPI and cm/360', text: 'Destination sensitivity is source × yaw ratio × DPI ratio. cm/360 should match when the conversion is correct.' },
            ],
          }),
          buildFaqJsonLd([
            {
              question: 'How does a mouse sensitivity converter with eDPI work?',
              answer:
                'Destination hipfire equals source sensitivity × (source yaw / destination yaw) × (source DPI / destination DPI). eDPI is sensitivity × DPI. cm/360 uses yaw × sensitivity × DPI.',
            },
            {
              question: 'What is the CS2 to Valorant sens factor?',
              answer: 'CS2 m_yaw 0.022 divided by Valorant yaw 0.07 is about 0.314286 at the same DPI.',
            },
          ]),
          buildBreadcrumbJsonLd([
            { name: 'Gaming tools', url: '/gaming' },
            { name: 'Sensitivity converter', url: path },
          ]),
        ]}
      />
      <SensitivityClient />
    </>
  );
}
