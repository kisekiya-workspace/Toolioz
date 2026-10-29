export type PortalDimension = 'overworld' | 'nether';

export interface PortalCoords {
  x: number;
  y: number;
  z: number;
}

export interface PortalLink {
  from: PortalDimension;
  source: PortalCoords;
  destination: PortalCoords;
  searchRadius: number;
  /** Java integer division truncates toward zero. */
  note: string;
}

const OVERWORLD_SEARCH = 128;
const NETHER_SEARCH = 16;
const SCALE = 8;

function truncDiv8(value: number): number {
  return Math.trunc(value / SCALE);
}

export function convertPortal(source: PortalCoords, from: PortalDimension): PortalLink {
  const destination: PortalCoords =
    from === 'overworld'
      ? { x: truncDiv8(source.x), y: source.y, z: truncDiv8(source.z) }
      : { x: source.x * SCALE, y: source.y, z: source.z * SCALE };

  const searchRadius = from === 'overworld' ? NETHER_SEARCH : OVERWORLD_SEARCH;
  const destName = from === 'overworld' ? 'Nether' : 'Overworld';
  const note =
    from === 'overworld'
      ? `Overworld X and Z are divided by 8 with truncation toward zero. Y is unchanged. Java Edition then looks for a portal within ${NETHER_SEARCH} blocks of the Nether point.`
      : `Nether X and Z are multiplied by 8. Y is unchanged. Java Edition then looks for a portal within ${OVERWORLD_SEARCH} blocks of the Overworld point.`;

  return {
    from,
    source,
    destination,
    searchRadius,
    note: `${note} Matching both ends of a ${destName} pair keeps the two portals linked.`,
  };
}

export function suggestedReturn(source: PortalCoords, from: PortalDimension): PortalCoords {
  return convertPortal(source, from).destination;
}

export { OVERWORLD_SEARCH, NETHER_SEARCH, SCALE };
