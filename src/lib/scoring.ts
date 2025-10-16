import type { Aspect } from "./contracts";

export function nss(posCount: number, negCount: number) {
  const total = Math.max(1, posCount + negCount);
  return ((posCount - negCount) / total) * 100;
}

export function compositeCXI(nssVal: number, vader: number, absa: Record<Aspect, number>) {
  const absaVals = Object.values(absa);
  const absaMean = absaVals.length ? absaVals.reduce((a,b)=>a+b,0)/absaVals.length : 0;
  const raw = 0.4 * (nssVal/100) + 0.3 * absaMean + 0.3 * vader; // -1..1
  const clamped = Math.max(-1, Math.min(1, raw));
  return Math.round(((clamped + 1) / 2) * 100);
}
