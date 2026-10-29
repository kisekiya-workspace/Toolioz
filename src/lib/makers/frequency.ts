import { clampNumber, roundTo } from '@/lib/makers/format';

const NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export function midiFromFrequency(hz: number, a4 = 440): number {
  const f = clampNumber(hz, 8, 12000);
  const a = clampNumber(a4, 400, 480);
  return 69 + 12 * Math.log2(f / a);
}

export function frequencyFromMidi(midi: number, a4 = 440): number {
  const a = clampNumber(a4, 400, 480);
  return a * 2 ** ((midi - 69) / 12);
}

export function noteFromFrequency(hz: number, a4 = 440) {
  const midiFloat = midiFromFrequency(hz, a4);
  const midi = Math.round(clampNumber(midiFloat, 0, 127));
  const cents = (midiFloat - midi) * 100;
  const name = NAMES[((midi % 12) + 12) % 12];
  const octave = Math.floor(midi / 12) - 1;
  return {
    midi,
    name: `${name}${octave}`,
    cents: roundTo(cents, 1),
    frequency: roundTo(frequencyFromMidi(midi, a4), 2),
  };
}

export function pianoChart(a4 = 440) {
  const rows = [];
  for (let midi = 21; midi <= 108; midi += 1) {
    const name = NAMES[((midi % 12) + 12) % 12];
    const octave = Math.floor(midi / 12) - 1;
    rows.push({ midi, name: `${name}${octave}`, hz: roundTo(frequencyFromMidi(midi, a4), 2) });
  }
  return rows;
}
