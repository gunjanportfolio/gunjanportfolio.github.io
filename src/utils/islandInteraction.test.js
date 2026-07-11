import { describe, expect, it } from "vitest";

import { PORTFOLIO_AREA_IDS } from "../constants/portfolioAreas";
import {
  getAngularDistance,
  getShortestRotationDelta,
  getStageFromIslandRotation,
  getTargetRotationForArea,
  lerpIslandRotation,
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

describe("getAngularDistance", () => {
  it("returns the shortest circular distance", () => {
    expect(getAngularDistance(0, 0.1)).toBeCloseTo(0.1);
    expect(getAngularDistance(0.1, 2 * Math.PI - 0.1)).toBeCloseTo(0.2);
  });
});

describe("getStageFromIslandRotation", () => {
  it("maps known area centers to the matching stage", () => {
    expect(getStageFromIslandRotation(4.5)).toBe(PORTFOLIO_AREA_IDS.HOME);
    expect(getStageFromIslandRotation(2.5)).toBe(PORTFOLIO_AREA_IDS.ABOUT);
    expect(getStageFromIslandRotation(1.05)).toBe(PORTFOLIO_AREA_IDS.PROJECTS);
    expect(getStageFromIslandRotation(5.65)).toBe(PORTFOLIO_AREA_IDS.CONTACT);
  });

  it("always returns the nearest area instead of null gaps", () => {
    expect(getStageFromIslandRotation(0)).toBe(PORTFOLIO_AREA_IDS.CONTACT);
    expect(getStageFromIslandRotation(3)).toBe(PORTFOLIO_AREA_IDS.ABOUT);
  });
});

describe("getTargetRotationForArea", () => {
  it("returns the configured rotation for each area", () => {
    expect(getTargetRotationForArea(PORTFOLIO_AREA_IDS.HOME)).toBe(4.5);
    expect(getTargetRotationForArea(PORTFOLIO_AREA_IDS.ABOUT)).toBe(2.5);
    expect(getTargetRotationForArea(999)).toBe(4.5);
  });
});

describe("getShortestRotationDelta", () => {
  it("returns the signed shortest delta across the wrap boundary", () => {
    expect(getShortestRotationDelta(0, 0.2)).toBeCloseTo(0.2);
    expect(getShortestRotationDelta(0.1, 2 * Math.PI - 0.1)).toBeCloseTo(-0.2);
    expect(getShortestRotationDelta(5.5, 1)).toBeCloseTo(1 - 5.5 + 2 * Math.PI);
  });
});

describe("lerpIslandRotation", () => {
  it("interpolates along the shortest angular path", () => {
    expect(lerpIslandRotation(0, Math.PI / 2, 0.5)).toBeCloseTo(Math.PI / 4);
    expect(lerpIslandRotation(0.1, 2 * Math.PI - 0.1, 1)).toBeCloseTo(-0.1);
  });
});
