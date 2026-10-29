import { ToolJsonLd } from '@/components/tools/ToolJsonLd';
import { buildPageMetadata } from '@/lib/seo';
import VideoSizeClient from './VideoSizeClient';

const path = '/music/video-file-size-calculator';
const description =
  'Estimates video file size from bitrate and duration, or the bitrate needed for a size cap. Codec names do not change the size formula.';

export const metadata = buildPageMetadata({
  title: 'Video File Size Calculator',
  description,
  path,
  keywords: ['video file size calculator', 'video bitrate calculator', '4k video file size', 'h264 file size calculator'],
});

export default function Page() {
  return (
    <>
      <ToolJsonLd
        name="Video File Size Calculator"
        description={description}
        path={path}
        steps={[
          { name: 'Enter bitrate and minutes', text: 'Or pick a generic 1080p/4K preset.' },
          { name: 'Optional size cap', text: 'The reverse formula yields a maximum bitrate.' },
        ]}
        faqs={[{ question: 'How large is 10 minutes at 8 Mbps?', answer: 'About 572 MB.' }]}
        breadcrumbs={[
          { name: 'Music calculators', url: '/music' },
          { name: 'Video file size calculator', url: path },
        ]}
      />
      <VideoSizeClient />
    </>
  );
}
