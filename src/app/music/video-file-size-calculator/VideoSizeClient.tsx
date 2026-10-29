'use client';

import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ToolPageShell } from '@/components/tools/ToolPageShell';
import { ResultCard } from '@/components/tools/ResultCard';
import { BITRATE_PRESETS, bitrateFromSize, formatBytes, videoSizeBytes } from '@/lib/makers/video-bitrate';
import { fmtNum } from '@/lib/makers/format';
import { calculatorPageStyles as styles } from '@/app/finance/compound-interest/page.styles';

export default function VideoSizeClient() {
  const [kbps, setKbps] = useState(8000);
  const [minutes, setMinutes] = useState(10);
  const [targetMb, setTargetMb] = useState(500);
  const bytes = useMemo(() => videoSizeBytes(kbps, minutes * 60), [kbps, minutes]);
  const needed = useMemo(() => bitrateFromSize(targetMb * 1024 * 1024, minutes * 60), [targetMb, minutes]);

  return (
    <ToolPageShell
      title="Video File Size Calculator"
      subtitle="A video file size calculator multiplies bitrate by duration. Size in bytes is kbps × 1000 / 8 × seconds. Presets are generic 1080p and 4K rates, not a promise from OBS, H.264, or H.265. Audio is ignored unless folded into the typed bitrate."
      directAnswerTitle="How large is 10 minutes at 8 Mbps?"
      directAnswer="8,000 kbps × 600 s / 8 = 600,000,000 bytes, about 572 MB. At 25 Mbps 4K the same duration is about 1.79 GB. To stay under 500 MB in 10 minutes, bitrate must stay near 7.0 Mbps."
      takeaways={[
        'File size is bitrate × time. Codec name does not change the formula.',
        'Presets are planning numbers, not platform caps.',
        'OBS and hardware encoders still need headroom for I-frames.',
        'Audio at 320 kbps is small next to 8 Mbps video.',
      ]}
      categoryName="Music"
      seoTitle="Video bitrate and file size"
      seoDescription="Bytes = bitrate_kbps × 1000 × seconds / 8. Reverse the formula to hit a size cap. H.264 versus H.265 changes quality at a bitrate, not the size formula itself."
      howToUse={['Pick a preset or type kbps.', 'Enter minutes.', 'Optionally set a size cap to read the max bitrate.']}
      benefits={['4K and 1080p presets are labelled as generic, not as YouTube or Twitch policy.', 'MB and GB are formatted from the same byte count.']}
      formula="bytes = kbps × 1000 × seconds / 8"
      faqs={[
        { question: 'Does H.265 shrink the file at the same bitrate?', answer: 'No. Same bitrate, same size. H.265 can look better at that bitrate.' },
        { question: 'Are streaming platform caps included?', answer: 'No. Those change. Type the cap as a target size or bitrate instead.' },
      ]}
      accuracyNote="Size is video bitrate × time. Audio, container overhead, and variable bitrate peaks are not included."
      currentToolId="video-file-size"
      relatedIds={['bpm-to-ms', 'frequency-to-note', 'photo-print-size']}
      breadcrumbs={[
        { name: 'Home', url: '/' },
        { name: 'Music calculators', url: '/music' },
        { name: 'Video file size calculator', url: '/music/video-file-size-calculator' },
      ]}
    >
      <div className={styles.grid}>
        <Card className={styles.inputCard}>
          <div className={styles.inputGroup}>
            <div className="flex flex-wrap gap-2">
              {BITRATE_PRESETS.map((row) => (
                <Button key={row.id} type="button" size="sm" variant={kbps === row.kbps ? 'default' : 'outline'} onClick={() => setKbps(row.kbps)}>
                  {row.label}
                </Button>
              ))}
            </div>
            <Input label="Video bitrate (kbps)" type="number" value={kbps} onChange={(e) => setKbps(Number(e.target.value) || 0)} />
            <Input label="Duration (minutes)" type="number" min={0} step={0.5} value={minutes} onChange={(e) => setMinutes(Number(e.target.value) || 0)} />
            <Input label="Size cap (MB)" type="number" value={targetMb} onChange={(e) => setTargetMb(Number(e.target.value) || 0)} />
          </div>
        </Card>
        <div className={styles.resultCol}>
          <ResultCard
            label="Estimated size"
            value={formatBytes(bytes)}
            gradient="linear-gradient(160deg,#1e3a8a 0%,#172554 55%,#1c1917 100%)"
            stats={[
              ['Max bitrate for cap', `${fmtNum(needed, 0)} kbps`],
              ['Seconds', fmtNum(minutes * 60, 0)],
            ]}
          />
        </div>
      </div>
    </ToolPageShell>
  );
}
