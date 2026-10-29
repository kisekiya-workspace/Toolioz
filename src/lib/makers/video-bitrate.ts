import { clampNumber, roundTo } from '@/lib/makers/format';

export const BITRATE_PRESETS = [
  { id: '1080-8', label: '1080p 8 Mbps', kbps: 8000 },
  { id: '1080-12', label: '1080p 12 Mbps', kbps: 12000 },
  { id: '1440-16', label: '1440p 16 Mbps', kbps: 16000 },
  { id: '4k-25', label: '4K 25 Mbps', kbps: 25000 },
  { id: '4k-50', label: '4K 50 Mbps', kbps: 50000 },
] as const;

export function videoSizeBytes(kbps: number, durationSec: number): number {
  return clampNumber(kbps, 1, 200000) * 1000 * clampNumber(durationSec, 0, 86400 * 7) / 8;
}

export function bitrateFromSize(bytes: number, durationSec: number): number {
  const sec = clampNumber(durationSec, 1, 86400 * 7);
  return roundTo((clampNumber(bytes, 0, 1e13) * 8) / 1000 / sec, 1);
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${roundTo(bytes, 0)} B`;
  if (bytes < 1024 ** 2) return `${roundTo(bytes / 1024, 1)} KB`;
  if (bytes < 1024 ** 3) return `${roundTo(bytes / 1024 ** 2, 2)} MB`;
  return `${roundTo(bytes / 1024 ** 3, 2)} GB`;
}
