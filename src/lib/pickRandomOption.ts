/**
 * Pure, unit-test-friendly random selection utilities for "Pick One".
 *
 * `pickRandomOption` never mutates its inputs and has no side effects,
 * making it trivial to unit test with deterministic mocks of
 * `crypto.getRandomValues` or `Math.random`.
 */

export interface PickResult {
  /** The chosen option's text. */
  option: string;
  /** Index of the chosen option within the original `options` array. */
  index: number;
}

/**
 * Generates a cryptographically strong uniform random integer in [0, max).
 * Falls back to `Math.random()` if the Web Crypto API is unavailable
 * (e.g. very old browsers or non-browser test environments).
 *
 * Uses rejection sampling to avoid modulo bias.
 */
export function getSecureRandomInt(max: number): number {
  if (max <= 0) return 0;
  if (max === 1) return 0;

  const hasCrypto =
    typeof crypto !== "undefined" &&
    typeof crypto.getRandomValues === "function";

  if (hasCrypto) {
    const maxUint32 = 0xffffffff;
    // Largest multiple of `max` that fits in a uint32, used to reject
    // out-of-range draws and eliminate modulo bias.
    const limit = maxUint32 - (maxUint32 % max);
    const arr = new Uint32Array(1);
    let rand: number;
    let attempts = 0;
    do {
      crypto.getRandomValues(arr);
      rand = arr[0];
      attempts += 1;
      // Safety valve: after many attempts (astronomically unlikely),
      // fall back to modulo to guarantee termination.
      if (attempts > 1000) return rand % max;
    } while (rand >= limit);
    return rand % max;
  }

  return Math.floor(Math.random() * max);
}

/**
 * Picks a random option from `options`, optionally excluding options that
 * were recently picked (case-sensitive exact match against `excludeRecent`).
 *
 * If excluding recent picks would leave an empty pool, the exclusion is
 * ignored for that draw so a result can always be produced (this happens
 * naturally once every option has been picked at least once).
 *
 * @throws Error if `options` is empty.
 */
export function pickRandomOption(
  options: readonly string[],
  excludeRecent: readonly string[] = []
): PickResult {
  if (options.length === 0) {
    throw new Error("pickRandomOption: options array must not be empty");
  }

  let pool = options;
  if (excludeRecent.length > 0) {
    const excludeSet = new Set(excludeRecent);
    const filtered = options.filter((opt) => !excludeSet.has(opt));
    pool = filtered.length > 0 ? filtered : options;
  }

  const poolIndex = getSecureRandomInt(pool.length);
  const option = pool[poolIndex];
  const index = options.indexOf(option);

  return { option, index };
}

/**
 * Fisher-Yates shuffle using the same secure randomness source. Returns a
 * new array; does not mutate the input.
 */
export function shuffleArray<T>(items: readonly T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = getSecureRandomInt(i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
