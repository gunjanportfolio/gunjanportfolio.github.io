import { describe, expect, it } from "vitest";

import { PORTFOLIO_AREA_IDS } from "../constants/portfolioAreas";
import {
  advanceFlightProgress,
  areSameArea,
  clamp01,
  computeCameraFollowTarget,
  computeInteriorCameraTarget,
  copyVector3,
  dampVector3,
  easeInOutCubic,
  getGuideProgress,
  getHeadingY,
  getHitboxSizeForArea,
  getWaypointForArea,
  localWaypointToWorld,
  sampleFlightPath,
} from "./explorationFlight";

describe("clamp01", () => {
  it("clamps values outside the unit interval", () => {
    expect(clamp01(-1)).toBe(0);
    expect(clamp01(0.4)).toBe(0.4);
    expect(clamp01(2)).toBe(1);
  });
});

describe("easeInOutCubic", () => {
  it("starts and ends at the expected bounds", () => {
    expect(easeInOutCubic(0)).toBe(0);
    expect(easeInOutCubic(1)).toBe(1);
    expect(easeInOutCubic(0.5)).toBeCloseTo(0.5);
  });
});

describe("getWaypointForArea", () => {
  it("returns a copy of the configured waypoint", () => {
    const waypoint = getWaypointForArea(PORTFOLIO_AREA_IDS.ABOUT);
    expect(waypoint).toEqual({ x: 8, y: 2.5, z: 2 });

    waypoint.x = 99;
    expect(getWaypointForArea(PORTFOLIO_AREA_IDS.ABOUT).x).toBe(8);
  });

  it("falls back to the home waypoint for unknown ids", () => {
    expect(getWaypointForArea(999)).toEqual({ x: 0, y: 2, z: 8 });
  });
});

describe("localWaypointToWorld", () => {
  it("translates by island position when rotation is zero", () => {
    const world = localWaypointToWorld(
      { x: 1, y: 2, z: 3 },
      { x: 10, y: -6.5, z: -43.4 },
      0,
      [1, 1, 1]
    );

    expect(world).toEqual({ x: 11, y: -4.5, z: -40.4 });
  });

  it("applies yaw rotation around the island origin", () => {
    const world = localWaypointToWorld(
      { x: 1, y: 0, z: 0 },
      { x: 0, y: 0, z: 0 },
      Math.PI / 2,
      { x: 1, y: 1, z: 1 }
    );

    expect(world.x).toBeCloseTo(0);
    expect(world.y).toBeCloseTo(0);
    expect(world.z).toBeCloseTo(1);
  });
});

describe("sampleFlightPath", () => {
  it("returns the start and end points at the progress bounds", () => {
    const from = { x: 0, y: 0, z: 0 };
    const to = { x: 10, y: 0, z: 0 };

    expect(sampleFlightPath(from, to, 0, 4)).toEqual({ x: 0, y: 0, z: 0 });
    expect(sampleFlightPath(from, to, 1, 4)).toEqual({ x: 10, y: 0, z: 0 });
  });

  it("peaks above the linear midpoint", () => {
    const midpoint = sampleFlightPath(
      { x: 0, y: 0, z: 0 },
      { x: 10, y: 0, z: 0 },
      0.5,
      4
    );

    expect(midpoint.x).toBeCloseTo(5);
    expect(midpoint.y).toBeCloseTo(4);
    expect(midpoint.z).toBeCloseTo(0);
  });
});

describe("getGuideProgress", () => {
  it("leads the plane progress and clamps at one", () => {
    expect(getGuideProgress(0.1, 0.2)).toBeCloseTo(0.3);
    expect(getGuideProgress(0.95, 0.2)).toBe(1);
  });
});

describe("getHeadingY", () => {
  it("returns zero when the points are identical", () => {
    expect(getHeadingY({ x: 1, y: 0, z: 1 }, { x: 1, y: 0, z: 1 })).toBe(0);
  });

  it("faces along the travel direction", () => {
    expect(getHeadingY({ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 5 })).toBeCloseTo(
      0
    );
    expect(getHeadingY({ x: 0, y: 0, z: 0 }, { x: 5, y: 0, z: 0 })).toBeCloseTo(
      Math.PI / 2
    );
  });
});

describe("computeCameraFollowTarget", () => {
  it("places the camera behind and above the plane", () => {
    const target = computeCameraFollowTarget(
      { x: 0, y: 1, z: 0 },
      0,
      10,
      4
    );

    expect(target).toEqual({ x: 0, y: 5, z: -10 });
  });
});

describe("dampVector3", () => {
  it("moves toward the target without overshooting past it for large damping", () => {
    const next = dampVector3(
      { x: 0, y: 0, z: 0 },
      { x: 10, y: 0, z: 0 },
      100,
      1
    );

    expect(next.x).toBeGreaterThan(9);
    expect(next.x).toBeLessThanOrEqual(10);
  });
});

describe("advanceFlightProgress", () => {
  it("advances by the duration ratio and clamps at one", () => {
    expect(advanceFlightProgress(0, 0.75, 1.5)).toBeCloseTo(0.5);
    expect(advanceFlightProgress(0.9, 1, 1)).toBe(1);
    expect(advanceFlightProgress(0, 1, 0)).toBe(1);
  });
});

describe("areSameArea", () => {
  it("compares area ids", () => {
    expect(areSameArea(1, 1)).toBe(true);
    expect(areSameArea(1, 2)).toBe(false);
  });
});

describe("copyVector3", () => {
  it("returns an independent copy", () => {
    const source = { x: 1, y: 2, z: 3 };
    const copy = copyVector3(source);
    copy.x = 9;
    expect(source.x).toBe(1);
  });
});

describe("computeInteriorCameraTarget", () => {
  it("moves the camera toward the look-at point", () => {
    const target = computeInteriorCameraTarget(
      { x: 10, y: 2, z: -40 },
      { x: 0, y: 0, z: 5 },
      0.5,
      2
    );

    expect(target.position.x).toBeCloseTo(5);
    expect(target.position.z).toBeCloseTo(-17.5);
    expect(target.position.y).toBeGreaterThanOrEqual(4);
    expect(target.lookAt).toEqual({ x: 10, y: 2, z: -40 });
  });
});

describe("getHitboxSizeForArea", () => {
  it("returns the configured hitbox size", () => {
    expect(getHitboxSizeForArea(PORTFOLIO_AREA_IDS.ABOUT)).toEqual([12, 10, 12]);
  });
});
