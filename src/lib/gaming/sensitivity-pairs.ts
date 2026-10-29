import {
  convertSensitivity,
  formatFactor,
  formatSens,
  SENS_GAME_MAP,
  type SensGame,
} from '@/lib/gaming/sensitivity';

export interface SensitivityPair {
  slug: string;
  fromId: string;
  toId: string;
  title: string;
  description: string;
  keywords: string[];
  lead: string;
  directAnswer: string;
  takeaways: string[];
  formula: string;
  exampleSens: number;
  exampleDpi: number;
  faqs: Array<{ question: string; answer: string }>;
  howTo: string[];
}

function pair(
  fromId: string,
  toId: string,
  extra: { lead: string; ads: string; searchPhrase: string; exampleSens?: number },
): SensitivityPair {
  const from = SENS_GAME_MAP[fromId];
  const to = SENS_GAME_MAP[toId];
  const demo = convertSensitivity({ fromId, toId, fromSens: extra.exampleSens ?? 1.5, fromDpi: 800 })!;
  const factor = formatFactor(demo.factor);
  const reverse = formatFactor(1 / demo.factor);
  const title = `${from.shortName} to ${to.shortName} Sens Converter`;
  const description = `Converts ${from.name} sensitivity to ${to.name} with yaw ${from.yaw} → ${to.yaw} and matching eDPI.`;
  const clipped =
    description.length <= 150
      ? description
      : `Converts ${from.shortName} sensitivity to ${to.shortName} using yaw ${from.yaw} and ${to.yaw}, then reports eDPI.`;

  return {
    slug: `${fromId}-to-${toId}-sens`,
    fromId,
    toId,
    title,
    description: clipped.slice(0, 150),
    keywords: [
      `${from.shortName} to ${to.shortName} sens`,
      `${from.name} to ${to.name} sensitivity`,
      extra.searchPhrase,
      `${from.shortName} ${to.shortName} eDPI`,
    ],
    lead: `${extra.lead} ${from.shortName} ${formatSens(demo.fromSens)} at ${demo.fromDpi} DPI is ${to.shortName} ${formatSens(demo.toSens)}, eDPI ${Math.round(demo.fromEdpi)}, ${demo.cm360.toFixed(1)} cm per 360°.`,
    directAnswer: `${from.shortName} hipfire sensitivity converts to ${to.shortName} by multiplying by ${factor} at the same DPI. ${from.shortName} ${formatSens(demo.fromSens)} at ${demo.fromDpi} DPI becomes ${to.shortName} ${formatSens(demo.toSens)}, with eDPI ${Math.round(demo.fromEdpi)} and ${demo.cm360.toFixed(2)} cm/360.`,
    takeaways: [
      `Multiply ${from.shortName} sensitivity by ${factor} when DPI stays the same.`,
      `The reverse factor is ${reverse} for ${to.shortName} back to ${from.shortName}.`,
      extra.ads,
      'cm/360 uses the source game yaw, so feel matches even when the two sensitivity numbers differ.',
    ],
    formula: `newSens = oldSens × (${from.yaw} / ${to.yaw}) × (oldDPI / newDPI)`,
    exampleSens: extra.exampleSens ?? 1.5,
    exampleDpi: 800,
    howTo: [
      `Enter the ${from.name} hipfire sensitivity.`,
      'Enter mouse DPI. Leave the destination DPI equal unless the mouse is changed.',
      `Read the ${to.name} sensitivity, eDPI, and cm/360.`,
      'Copy ADS or zoom sliders separately. This page converts hipfire yaw only.',
    ],
    faqs: [
      {
        question: `What is the ${from.shortName} to ${to.shortName} sensitivity conversion?`,
        answer: `${from.name} hipfire converts to ${to.name} by multiplying by ${factor} at the same DPI, because ${from.shortName} yaw is ${from.yaw}° per count and ${to.shortName} yaw is ${to.yaw}° per count.`,
      },
      {
        question: `Does ${from.shortName} ${formatSens(demo.fromSens)} at 800 DPI match ${to.shortName}?`,
        answer: `Yes for hipfire. ${from.shortName} ${formatSens(demo.fromSens)} at 800 DPI is ${to.shortName} ${formatSens(demo.toSens)} at 800 DPI, eDPI ${Math.round(demo.fromEdpi)}, about ${demo.cm360.toFixed(2)} cm per 360°.`,
      },
      {
        question: `Is eDPI the same after a ${from.shortName} to ${to.shortName} convert?`,
        answer: `eDPI equals sensitivity times DPI. After the yaw conversion, ${to.shortName} eDPI is ${Math.round(demo.toEdpi)} when ${from.shortName} eDPI is ${Math.round(demo.fromEdpi)} at the same DPI. The two eDPI figures are not supposed to be identical across games with different yaw.`,
      },
      {
        question: `Does this ${from.shortName} to ${to.shortName} converter include ADS?`,
        answer: extra.ads,
      },
    ],
  };
}

type PairExtra = { lead: string; ads: string; searchPhrase: string; exampleSens?: number };

function make(fromId: string, toId: string, extra: PairExtra): SensitivityPair {
  return pair(fromId, toId, extra);
}

export const SENSITIVITY_PAIRS: SensitivityPair[] = [
  make('cs2', 'valorant', {
    searchPhrase: 'cs2 to valorant sens',
    exampleSens: 1.5,
    lead: 'CS2 to Valorant sensitivity uses the Source m_yaw of 0.022 against Valorant yaw 0.07. At the same DPI, CS2 sensitivity is multiplied by 0.314286.',
    ads: 'CS2 scoped zoom_sensitivity_ratio_mouse and Valorant ADS sliders are not converted. Hipfire yaw is the shared figure.',
  }),
  make('valorant', 'cs2', {
    searchPhrase: 'valorant to cs2 sens',
    exampleSens: 0.5,
    lead: 'Valorant to CS2 sensitivity uses yaw 0.07 against Source m_yaw 0.022. At the same DPI, Valorant sensitivity is multiplied by 3.181818.',
    ads: 'Valorant ADS and CS2 zoom_sensitivity_ratio_mouse stay on their own sliders after hipfire is matched.',
  }),
  make('csgo', 'valorant', {
    searchPhrase: 'csgo to valorant sensitivity',
    exampleSens: 2,
    lead: 'CS:GO to Valorant sensitivity uses the same m_yaw 0.022 as CS2. Players who still search CS:GO can use this page; CS2 hipfire is identical at the same number.',
    ads: 'CS:GO and CS2 share hipfire yaw. Scoped ratios still differ by game and are left unchanged.',
  }),
  make('apex', 'valorant', {
    searchPhrase: 'apex to valorant sens',
    exampleSens: 1.8,
    lead: 'Apex Legends hipfire uses Source m_yaw 0.022, the same constant as CS2. Optic ADS multipliers in Apex do not move with this hipfire conversion.',
    ads: 'Apex 1x through 4x ADS multipliers stay in the Apex settings menu. Only hipfire yaw is converted to Valorant.',
  }),
  make('valorant', 'apex', {
    searchPhrase: 'valorant to apex sens',
    exampleSens: 0.45,
    lead: 'Valorant to Apex hipfire multiplies by 3.181818 at the same DPI because Apex uses Source yaw 0.022. Copy each Apex optic ADS slider separately after hipfire matches.',
    ads: 'Apex per-optic ADS is not a single yaw number. Match hipfire here, then set ADS in Apex.',
  }),
  make('fortnite', 'valorant', {
    searchPhrase: 'fortnite to valorant sens',
    exampleSens: 6,
    lead: 'Fortnite hipfire yaw is 0.005555… versus Valorant 0.07, so Fortnite sensitivity is multiplied by 0.079365 at the same DPI. Build and edit multipliers stay in Fortnite.',
    ads: 'Fortnite build and edit sensitivity are extra sliders. This page converts looking / hipfire yaw only.',
  }),
  make('valorant', 'fortnite', {
    searchPhrase: 'valorant to fortnite sens',
    exampleSens: 0.4,
    lead: 'Valorant to Fortnite hipfire multiplies by 12.6 at the same DPI. The larger Fortnite number is the yaw gap, not a faster turn, when DPI is unchanged.',
    ads: 'After hipfire is matched, set Fortnite build and edit multipliers in that game. They are not yaw conversions.',
  }),
  make('overwatch', 'valorant', {
    searchPhrase: 'overwatch to valorant sens',
    exampleSens: 5,
    lead: 'Overwatch 2 hipfire yaw is 0.0066 versus Valorant 0.07, so Overwatch sensitivity is multiplied by 0.094286 at the same DPI. Hero relative aim is not included.',
    ads: 'Overwatch hero relative aim and scoped zoom are extra multipliers. Convert hipfire, then copy those sliders in Overwatch.',
  }),
  make('valorant', 'overwatch', {
    searchPhrase: 'valorant to overwatch sens',
    exampleSens: 0.5,
    lead: 'Valorant to Overwatch 2 hipfire multiplies by 10.606061 at the same DPI. The larger Overwatch number keeps the same cm/360 because yaw 0.0066 is smaller than 0.07.',
    ads: 'Overwatch scoped heroes still use a zoom slider on top of this hipfire match.',
  }),
  make('cs2', 'overwatch', {
    searchPhrase: 'cs2 to overwatch sens',
    exampleSens: 1.2,
    lead: 'CS2 to Overwatch 2 hipfire multiplies by 3.333333 at the same DPI (0.022 / 0.0066). Both figures describe the same turn speed in cm/360.',
    ads: 'CS2 zoom_sensitivity_ratio_mouse and Overwatch scoped hero sliders remain separate after hipfire is aligned.',
  }),
  make('cod', 'valorant', {
    searchPhrase: 'cod to valorant sens',
    exampleSens: 6,
    lead: 'Call of Duty Modern Warfare and Warzone hipfire yaw 0.0066 converts to Valorant 0.07 by multiplying by 0.094286 at the same DPI. Relative aim and ADS sliders stay in COD.',
    ads: 'Warzone relative aim and ADS fields are not this hipfire yaw. Convert hipfire, then copy those COD sliders.',
  }),
  make('r6', 'valorant', {
    searchPhrase: 'r6 to valorant sens',
    exampleSens: 12,
    lead: 'Rainbow Six Siege hipfire yaw 0.00572958 converts to Valorant 0.07 by multiplying by 0.081851 at the same DPI. The 1x–12x ADS table in Siege is not part of this hipfire step.',
    ads: 'Siege ADS uses a sight-by-sight table. Match hipfire here, then keep or rebuild that ADS table in Siege.',
  }),
];

export function getSensitivityPair(slug: string): SensitivityPair | undefined {
  return SENSITIVITY_PAIRS.find((item) => item.slug === slug);
}

export function reversePairSlug(pair: SensitivityPair): string | undefined {
  return SENSITIVITY_PAIRS.find((item) => item.fromId === pair.toId && item.toId === pair.fromId)?.slug;
}

export function pairGames(pair: SensitivityPair): { from: SensGame; to: SensGame } {
  return { from: SENS_GAME_MAP[pair.fromId], to: SENS_GAME_MAP[pair.toId] };
}
