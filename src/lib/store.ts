"use client";
import { useSyncExternalStore } from "react";
import type { Colorway } from "./colorways";

/**
 * A tiny shared store. React context would also cross the R3F <Canvas>
 * boundary, but a module store lets the 3D scenes read state inside useFrame
 * without re-rendering.
 */
type State = {
  colorway: Colorway["id"];
  /** id of the open design-breakdown detail, or null */
  detail: string | null;
  /** chapter currently in view in the sneaker story (0 = reveal) */
  chapter: number;
  /** chapter 05: show the flat graphic breakdown instead of the 3D shoe */
  flat: boolean;
};

let state: State = { colorway: "local", detail: null, chapter: 0, flat: false };
const listeners = new Set<() => void>();

export const store = {
  get: () => state,
  set(patch: Partial<State>) {
    state = { ...state, ...patch };
    listeners.forEach((l) => l());
  },
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
};

const serverState = state;
export function useStore<T>(select: (s: State) => T): T {
  return useSyncExternalStore(
    store.subscribe,
    () => select(store.get()),
    () => select(serverState),
  );
}

/** Scroll-driven values the 3D story reads every frame (no React state). */
export const scrollRig = {
  /** continuous chapter position, e.g. 2.4 = 40% through chapter 2 */
  position: 0,
  /** user drag yaw offset in radians */
  yaw: 0,
  /** true while a pointer is dragging the shoe */
  dragging: false,
};

/** Opening-sequence progress (0..1), read by the 3D canvas to wake up in time for the match cut. */
export const journey = { intro: 0 };
