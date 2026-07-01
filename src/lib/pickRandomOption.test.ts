import { describe, it, expect, vi } from "vitest";
import { pickRandomOption, getSecureRandomInt, shuffleArray } from "./pickRandomOption";

describe("pickRandomOption", () => {
  it("throws on empty options", () => {
    expect(() => pickRandomOption([])).toThrow();
  });

  it("returns the only option when array has length 1", () => {
    const result = pickRandomOption(["Solo"]);
    expect(result.option).toBe("Solo");
    expect(result.index).toBe(0);
  });

  it("always returns an option present in the input array", () => {
    const options = ["A", "B", "C", "D"];
    for (let i = 0; i < 50; i += 1) {
      const result = pickRandomOption(options);
      expect(options).toContain(result.option);
      expect(options[result.index]).toBe(result.option);
    }
  });

  it("excludes recently picked options when possible", () => {
    const options = ["A", "B"];
    // With "A" excluded, the only possible result is "B".
    for (let i = 0; i < 20; i += 1) {
      const result = pickRandomOption(options, ["A"]);
      expect(result.option).toBe("B");
    }
  });

  it("falls back to full pool if exclusion would empty it", () => {
    const options = ["A", "B", "C"];
    // Excluding everything should not throw and should still return a valid option.
    const result = pickRandomOption(options, ["A", "B", "C"]);
    expect(options).toContain(result.option);
  });

  it("does not mutate the input array", () => {
    const options = ["A", "B", "C"];
    const copy = [...options];
    pickRandomOption(options, ["A"]);
    expect(options).toEqual(copy);
  });

  it("produces a roughly uniform distribution over many draws", () => {
    const options = ["A", "B", "C", "D"];
    const counts: Record<string, number> = { A: 0, B: 0, C: 0, D: 0 };
    const trials = 4000;
    for (let i = 0; i < trials; i += 1) {
      const { option } = pickRandomOption(options);
      counts[option] += 1;
    }
    // Each option should land roughly within +/- 40% of the expected 1/4 share.
    const expected = trials / options.length;
    for (const key of options) {
      expect(counts[key]).toBeGreaterThan(expected * 0.6);
      expect(counts[key]).toBeLessThan(expected * 1.4);
    }
  });
});

describe("getSecureRandomInt", () => {
  it("returns 0 for max <= 1", () => {
    expect(getSecureRandomInt(0)).toBe(0);
    expect(getSecureRandomInt(1)).toBe(0);
  });

  it("returns values within [0, max)", () => {
    for (let i = 0; i < 100; i += 1) {
      const v = getSecureRandomInt(7);
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(7);
    }
  });

  it("falls back to Math.random when crypto is unavailable", () => {
    vi.stubGlobal("crypto", undefined);
    const spy = vi.spyOn(Math, "random").mockReturnValue(0.5);
    expect(getSecureRandomInt(10)).toBe(5);
    spy.mockRestore();
    vi.unstubAllGlobals();
  });
});

describe("shuffleArray", () => {
  it("does not mutate the input", () => {
    const arr = [1, 2, 3, 4, 5];
    const copy = [...arr];
    shuffleArray(arr);
    expect(arr).toEqual(copy);
  });

  it("returns an array with the same elements", () => {
    const arr = [1, 2, 3, 4, 5];
    const shuffled = shuffleArray(arr);
    expect(shuffled.sort()).toEqual([...arr].sort());
  });
});
