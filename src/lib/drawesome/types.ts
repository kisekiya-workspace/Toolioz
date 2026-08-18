/**
 * Drawesome Vector Drawing Engine Types
 * Based on drawesome by Benji Taylor (MIT License)
 */

export type Point = [number, number, number];

export type PenId =
  | "pencil"
  | "pen"
  | "fineliner"
  | "marker"
  | "highlighter"
  | "brush"
  | "watercolor"
  | "fountain";

export type ToolId = PenId | "eraser";

export type FreehandOptions = {
  size?: number;
  thinning?: number;
  streamline?: number;
  easing?: (t: number) => number;
  simulatePressure?: boolean;
  openAt?: number;
  flatEnds?: boolean;
  taperStart?: number;
  taperEnd?: number;
  nibAngle?: number;
  nibContrast?: number;
  variance?: number;
  last?: boolean;
};

export type Pen = {
  id: PenId;
  name: string;
  key: string;
  defaultSize: number;
  defaultOpacity: number;
  defaultColor?: string;
  blend?: "normal" | "multiply";
  options: (size: number) => FreehandOptions;
};

export type StrokeShape = {
  nibAngle?: number;
  taper?: number;
  simulatePressure?: boolean;
};

export type Stroke = {
  id: number;
  pen: PenId;
  color: string;
  size: number;
  opacity: number;
  points: Point[];
  shape?: StrokeShape;
  erase?: boolean;
};

export type Board = { w: number; h: number };
