import { describe, expect, it } from "vitest";

import {
  getStageFromIslandRotation,
  normalizeIslandRotation,
} from "./islandInteraction";

describe("normalizeIslandRotation", () => {
  it("keeps values within 0 and 2π", () => {
    expect(normalizeIslandRotation(0)).toBe(0);
    expect(normalizeIslandRotation(Math.PI * 3)).toBeCloseTo(Math.PI);
    expect(normalizeIslandRotation(-Math.PI / 2)).toBeCloseTo(
      (3 * Math.PI) / 2
    );
  });
});

describe("getStageFromIslandRotation", () => {
  it("maps known rotation bands to stages", () => {
    expect(getStageFromIslandRotation(4.5)).toBe(1);
    expect(getStageFromIslandRotation(2.5)).toBe(2);
    expect(getStageFromIslandRotation(1.0)).toBe(3);
    expect(getStageFromIslandRotation(5.6)).toBe(4);
  });

  it("returns null outside stage bands", () => {
    expect(getStageFromIslandRotation(0)).toBeNull();
    expect(getStageFromIslandRotation(3)).toBeNull();
  });
});
