"use client";
/**
 * React hook for managing drawing stroke state and undo/redo history.
 * Based on drawesome by Benji Taylor (MIT License)
 */
import { useCallback, useMemo, useRef, useState } from "react";
import type { Stroke } from "./types";

export type DrawingController = {
  strokes: Stroke[];
  canUndo: boolean;
  canRedo: boolean;
  commit: (next: Stroke[]) => void;
  begin: () => void;
  update: (next: Stroke[] | ((prev: Stroke[]) => Stroke[])) => void;
  end: () => void;
  undo: () => void;
  redo: () => void;
  clear: () => void;
  reset: (next: Stroke[]) => void;
};

export function useDrawing(initial: Stroke[] = []): DrawingController {
  const [strokes, setStrokes] = useState<Stroke[]>(initial);
  const [past, setPast] = useState<Stroke[][]>([]);
  const [future, setFuture] = useState<Stroke[][]>([]);

  const snapshot = useRef<Stroke[] | null>(null);
  const latest = useRef(strokes);
  latest.current = strokes;

  const commit = useCallback((next: Stroke[]) => {
    setPast((p) => [...p, latest.current]);
    setFuture([]);
    setStrokes(next);
  }, []);

  const begin = useCallback(() => {
    snapshot.current = latest.current;
  }, []);

  const update = useCallback(
    (next: Stroke[] | ((prev: Stroke[]) => Stroke[])) => setStrokes(next),
    []
  );

  const end = useCallback(() => {
    const before = snapshot.current;
    snapshot.current = null;
    if (!before || before === latest.current) return;
    setPast((p) => [...p, before]);
    setFuture([]);
  }, []);

  const undo = useCallback(() => {
    if (!past.length) return;
    setStrokes(past[past.length - 1]);
    setPast(past.slice(0, -1));
    setFuture([strokes, ...future]);
  }, [past, future, strokes]);

  const redo = useCallback(() => {
    if (!future.length) return;
    setStrokes(future[0]);
    setFuture(future.slice(1));
    setPast([...past, strokes]);
  }, [past, future, strokes]);

  const clear = useCallback(() => {
    if (!latest.current.length) return;
    commit([]);
  }, [commit]);

  const reset = useCallback((next: Stroke[]) => {
    setStrokes(next);
    setPast([]);
    setFuture([]);
  }, []);

  return useMemo(
    () => ({
      strokes,
      canUndo: past.length > 0,
      canRedo: future.length > 0,
      commit,
      begin,
      update,
      end,
      undo,
      redo,
      clear,
      reset,
    }),
    [
      strokes,
      past.length,
      future.length,
      commit,
      begin,
      update,
      end,
      undo,
      redo,
      clear,
      reset,
    ]
  );
}
