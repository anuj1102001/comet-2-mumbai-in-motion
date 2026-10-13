"use client";
import { useSyncExternalStore } from "react";
import type { Colorway } from "./colorways";

/** The one piece of shared state: which edition the visitor is looking at. */
type State = { colorway: Colorway["id"] };

let state: State = { colorway: "local" };
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
  return useSyncExternalStore(store.subscribe, () => select(store.get()), () => select(serverState));
}
