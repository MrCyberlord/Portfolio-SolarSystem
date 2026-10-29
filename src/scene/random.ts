// Deterministic background sampling, extracted from the retired neural geometry.
export function seededRandom(seed: number) {
  let value = seed
  return () => { value = (value * 1664525 + 1013904223) >>> 0; return value / 4294967296 }
}
