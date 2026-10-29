import { ToolJsonLd } from '@/components/tools/ToolJsonLd';
import { buildPageMetadata } from '@/lib/seo';
import BpmClient from './BpmClient';

const path = '/music/bpm-to-ms-calculator';
const description =
  'Converts BPM to millisecond delay times for straight, dotted, and triplet notes, with tap tempo.';

export const metadata = buildPageMetadata({
  title: 'BPM to MS Calculator',
  description,
  path,
  keywords: ['bpm to ms', 'bpm to ms calculator', 'delay calculator bpm', 'tap bpm online'],
});

export default function Page() {
  return (
    <>
      <ToolJsonLd
        name="BPM to MS Calculator"
        description={description}
        path={path}
        steps={[
          { name: 'Enter BPM', text: 'Or tap the pad to average recent intervals.' },
          { name: 'Read the chart', text: 'Quarter note milliseconds are 60000 / BPM.' },
        ]}
        faqs={[{ question: 'How many ms is 120 BPM?', answer: 'A quarter note is 500 ms.' }]}
        breadcrumbs={[
          { name: 'Music calculators', url: '/music' },
          { name: 'BPM to MS calculator', url: path },
        ]}
      />
      <BpmClient />
    </>
  );
}
