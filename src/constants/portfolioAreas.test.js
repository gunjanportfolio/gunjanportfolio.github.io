import { describe, expect, it } from "vitest";

import {
  getPortfolioAreaById,
  PORTFOLIO_AREA_IDS,
  PORTFOLIO_AREAS,
} from "./portfolioAreas";

describe("portfolioAreas", () => {
  it("defines four explore areas", () => {
    expect(PORTFOLIO_AREAS).toHaveLength(4);
    expect(PORTFOLIO_AREAS.map((area) => area.key)).toEqual([
      "home",
      "about",
      "projects",
      "contact",
    ]);
  });

  it("resolves areas by id with a home fallback", () => {
    expect(getPortfolioAreaById(PORTFOLIO_AREA_IDS.PROJECTS).label).toBe(
      "Projects"
    );
    expect(getPortfolioAreaById(999).key).toBe("home");
  });

  it("defines a waypoint for every explore area", () => {
    for (const area of PORTFOLIO_AREAS) {
      expect(area.waypoint).toEqual(
        expect.objectContaining({
          x: expect.any(Number),
          y: expect.any(Number),
          z: expect.any(Number),
        })
      );
      expect(area.hitboxSize).toHaveLength(3);
      expect(area.interiorApproach).toBeGreaterThan(0);
    }
  });
});
