function u16(n: number): Uint8Array {
  const b = new Uint8Array(2);
  b[0] = n & 255;
  b[1] = (n >> 8) & 255;
  return b;
}

function u32(n: number): Uint8Array {
  const b = new Uint8Array(4);
  b[0] = n & 255;
  b[1] = (n >> 8) & 255;
  b[2] = (n >> 16) & 255;
  b[3] = (n >> 24) & 255;
  return b;
}

export async function pngBlobToIco(pngs: Array<{ size: number; blob: Blob }>): Promise<Blob> {
  const payloads = await Promise.all(pngs.map(async (item) => ({ size: item.size, bytes: new Uint8Array(await item.blob.arrayBuffer()) })));
  const count = payloads.length;
  const headerSize = 6 + 16 * count;
  let offset = headerSize;
  const parts: Uint8Array[] = [];
  parts.push(u16(0), u16(1), u16(count));
  for (const item of payloads) {
    const entry = new Uint8Array(16);
    entry[0] = item.size >= 256 ? 0 : item.size;
    entry[1] = item.size >= 256 ? 0 : item.size;
    entry[2] = 0;
    entry[3] = 0;
    entry.set(u16(1), 4);
    entry.set(u16(32), 6);
    entry.set(u32(item.bytes.length), 8);
    entry.set(u32(offset), 12);
    parts.push(entry);
    offset += item.bytes.length;
  }
  for (const item of payloads) parts.push(item.bytes);
  const total = parts.reduce((sum, p) => sum + p.length, 0);
  const out = new Uint8Array(total);
  let i = 0;
  for (const p of parts) {
    out.set(p, i);
    i += p.length;
  }
  return new Blob([out], { type: 'image/x-icon' });
}

export async function rasterizeToPng(source: CanvasImageSource, size: number, naturalW: number, naturalH: number): Promise<Blob> {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas is unavailable.');
  ctx.clearRect(0, 0, size, size);
  ctx.imageSmoothingEnabled = true;
  const scale = Math.min(size / naturalW, size / naturalH);
  const w = naturalW * scale;
  const h = naturalH * scale;
  ctx.drawImage(source, (size - w) / 2, (size - h) / 2, w, h);
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
  if (!blob) throw new Error('PNG encode failed.');
  return blob;
}
