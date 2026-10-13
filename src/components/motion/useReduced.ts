"use client";
import { useReducedMotion } from "motion/react";
import { useSyncExternalStore } from "react";

const noop = () => () => {};

/**
 * Reduced-motion preference that is safe to branch markup on: it reports
 * `false` during server render and hydration (matching the HTML), then the
 * real preference right after, so the first client render never disagrees
 * with the server.
 */
export function useReduced() {
  const pref = useReducedMotion();
  const hydrated = useSyncExternalStore(noop, () => true, () => false);
  return hydrated && !!pref;
}
