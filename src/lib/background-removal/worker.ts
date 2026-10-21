import { renderCutout, segmentBackground, type Raster, type BrushStroke } from './engine';
export type CutoutRequest = { id: number } & (
  { type: 'analyze'; image: Raster; strength: number } |
  { type: 'render'; image: Raster; analysis: Raster; mask: Float32Array; strokes: BrushStroke[]; softness: number }
);
self.onmessage = (event: MessageEvent<CutoutRequest>) => {
  const request = event.data;
  try {
    if (request.type === 'analyze') {
      const result = segmentBackground(request.image, request.strength);
      self.postMessage({ id: request.id, result }, { transfer: [result.mask.buffer] });
    } else {
      const data = renderCutout(request.image, request.analysis, request.mask, request.strokes, request.softness);
      self.postMessage({ id: request.id, data }, { transfer: [data.buffer] });
    }
  } catch (error) {
    self.postMessage({ id: request.id, error: error instanceof Error ? error.message : 'Processing failed.' });
  }
};
