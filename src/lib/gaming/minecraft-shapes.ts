export type Cell2 = { x: number; z: number };
export type Cell3 = { x: number; y: number; z: number };

function inRing(dist: number, radius: number, thickness: number, filled: boolean): boolean {
  if (dist > radius) return false;
  if (filled || thickness >= radius) return true;
  return dist > radius - thickness;
}

/**
 * Pixel circle using the block-center distance test used by Minecraft circle maps.
 * Diameter is in blocks. Even diameters are centered between four blocks.
 */
export function generateCircle(
  diameter: number,
  options: { filled?: boolean; thickness?: number } = {},
): Cell2[] {
  const size = Math.max(1, Math.min(256, Math.floor(diameter)));
  const filled = Boolean(options.filled);
  const thickness = Math.max(1, Math.min(size, options.thickness ?? 1));
  const radius = size / 2;
  const center = size / 2;
  const cells: Cell2[] = [];
  const origin = Math.floor(size / 2);

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const dist = Math.hypot(col + 0.5 - center, row + 0.5 - center);
      if (inRing(dist, radius, thickness, filled)) {
        cells.push({ x: col - origin, z: row - origin });
      }
    }
  }
  return cells;
}

export function generateSphere(
  diameter: number,
  options: { filled?: boolean; thickness?: number } = {},
): Cell3[] {
  const size = Math.max(1, Math.min(64, Math.floor(diameter)));
  const filled = Boolean(options.filled);
  const thickness = Math.max(1, Math.min(size, options.thickness ?? 1));
  const radius = size / 2;
  const center = size / 2;
  const cells: Cell3[] = [];
  const origin = Math.floor(size / 2);

  for (let y = 0; y < size; y++) {
    for (let z = 0; z < size; z++) {
      for (let x = 0; x < size; x++) {
        const dist = Math.hypot(x + 0.5 - center, y + 0.5 - center, z + 0.5 - center);
        if (inRing(dist, radius, thickness, filled)) {
          cells.push({ x: x - origin, y: y - origin, z: z - origin });
        }
      }
    }
  }
  return cells;
}

export function layerOf(cells: Cell3[], y: number): Cell2[] {
  return cells.filter((cell) => cell.y === y).map(({ x, z }) => ({ x, z }));
}

export function bounds2(cells: Cell2[]): { minX: number; maxX: number; minZ: number; maxZ: number } {
  if (cells.length === 0) return { minX: 0, maxX: 0, minZ: 0, maxZ: 0 };
  let minX = Infinity;
  let maxX = -Infinity;
  let minZ = Infinity;
  let maxZ = -Infinity;
  for (const cell of cells) {
    if (cell.x < minX) minX = cell.x;
    if (cell.x > maxX) maxX = cell.x;
    if (cell.z < minZ) minZ = cell.z;
    if (cell.z > maxZ) maxZ = cell.z;
  }
  return { minX, maxX, minZ, maxZ };
}

export function asciiGrid(cells: Cell2[], filledChar = '#', emptyChar = '.'): string {
  if (cells.length === 0) return '';
  const { minX, maxX, minZ, maxZ } = bounds2(cells);
  const set = new Set(cells.map((cell) => `${cell.x},${cell.z}`));
  const rows: string[] = [];
  for (let z = minZ; z <= maxZ; z++) {
    let row = '';
    for (let x = minX; x <= maxX; x++) {
      row += set.has(`${x},${z}`) ? filledChar : emptyChar;
    }
    rows.push(row);
  }
  return rows.join('\n');
}

export function coordList(cells: Cell2[] | Cell3[]): string {
  return cells
    .map((cell) => ('y' in cell ? `${cell.x} ${cell.y} ${cell.z}` : `${cell.x} ${cell.z}`))
    .join('\n');
}
