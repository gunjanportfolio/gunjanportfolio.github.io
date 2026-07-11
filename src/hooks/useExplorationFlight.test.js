import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import useExplorationFlight, {
  sampleFlightPose,
} from "./useExplorationFlight";

describe("sampleFlightPose", () => {
  it("samples position and heading along the flight path", () => {
    const pose = sampleFlightPose(
      {
        from: { x: 0, y: 0, z: 0 },
        to: { x: 0, y: 0, z: 10 },
      },
      0
    );

    expect(pose.position).toEqual({ x: 0, y: 0, z: 0 });
    expect(pose.headingY).toBeCloseTo(0);
  });
});

describe("useExplorationFlight", () => {
  it("starts idle", () => {
    const { result } = renderHook(() => useExplorationFlight());

    expect(result.current.isFlying).toBe(false);
    expect(result.current.isSettling).toBe(false);
    expect(result.current.targetAreaId).toBeNull();
  });

  it("starts a flight and advances until arrival", () => {
    const { result } = renderHook(() => useExplorationFlight());

    act(() => {
      const started = result.current.startFlight(
        2,
        { x: 0, y: 0, z: 0 },
        { x: 10, y: 0, z: 0 }
      );
      expect(started).toBe(true);
    });

    expect(result.current.isFlying).toBe(true);
    expect(result.current.targetAreaId).toBe(2);

    let tickResult;
    act(() => {
      tickResult = result.current.tick(0.75);
    });

    expect(tickResult.isActive).toBe(true);
    expect(tickResult.arrived).toBe(false);
    expect(tickResult.plane.position.x).toBeGreaterThan(0);
    expect(tickResult.bird.position.x).toBeGreaterThan(
      tickResult.plane.position.x
    );

    act(() => {
      tickResult = result.current.tick(2);
    });

    expect(tickResult.arrived).toBe(true);
    expect(tickResult.targetAreaId).toBe(2);
    expect(result.current.isFlying).toBe(false);
    expect(result.current.isSettling).toBe(true);
    expect(result.current.arrivedAreaId).toBe(2);
  });

  it("ignores starting the same area again after arrival", () => {
    const { result } = renderHook(() => useExplorationFlight());

    act(() => {
      result.current.startFlight(
        1,
        { x: 0, y: 0, z: 0 },
        { x: 1, y: 0, z: 0 }
      );
      result.current.tick(2);
    });

    let started;
    act(() => {
      started = result.current.startFlight(
        1,
        { x: 1, y: 0, z: 0 },
        { x: 1, y: 0, z: 0 }
      );
    });

    expect(started).toBe(false);
    expect(result.current.isFlying).toBe(false);
  });

  it("allows the same area when allowSameArea is set", () => {
    const { result } = renderHook(() => useExplorationFlight());

    act(() => {
      result.current.startFlight(
        1,
        { x: 0, y: 0, z: 0 },
        { x: 1, y: 0, z: 0 }
      );
      result.current.tick(2);
    });

    let started;
    act(() => {
      started = result.current.startFlight(
        1,
        { x: 1, y: 0, z: 0 },
        { x: 2, y: 0, z: 0 },
        { allowSameArea: true, settleOnArrive: false }
      );
    });

    expect(started).toBe(true);
    expect(result.current.isFlying).toBe(true);
  });

  it("can skip outdoor camera settle on arrival", () => {
    const { result } = renderHook(() => useExplorationFlight());

    act(() => {
      result.current.startFlight(
        2,
        { x: 0, y: 0, z: 0 },
        { x: 10, y: 0, z: 0 },
        { settleOnArrive: false }
      );
      result.current.tick(2);
    });

    expect(result.current.isFlying).toBe(false);
    expect(result.current.isSettling).toBe(false);
    expect(result.current.arrivedAreaId).toBe(2);
  });

  it("can cancel without entering settle", () => {
    const { result } = renderHook(() => useExplorationFlight());

    act(() => {
      result.current.startFlight(
        2,
        { x: 0, y: 0, z: 0 },
        { x: 10, y: 0, z: 0 }
      );
    });

    act(() => {
      result.current.cancelFlight({ settle: false });
    });

    expect(result.current.isFlying).toBe(false);
    expect(result.current.isSettling).toBe(false);
  });

  it("retargets mid-flight when a new area is requested", () => {
    const { result } = renderHook(() => useExplorationFlight());

    act(() => {
      result.current.startFlight(
        2,
        { x: 0, y: 0, z: 0 },
        { x: 10, y: 0, z: 0 }
      );
      result.current.tick(0.5);
      result.current.startFlight(
        3,
        { x: 2, y: 1, z: 0 },
        { x: -5, y: 2, z: 4 }
      );
    });

    expect(result.current.isFlying).toBe(true);
    expect(result.current.targetAreaId).toBe(3);
    expect(result.current.flightRef.current.progress).toBe(0);
  });

  it("cancels an active flight and enters settling", () => {
    const { result } = renderHook(() => useExplorationFlight());

    act(() => {
      result.current.startFlight(
        2,
        { x: 0, y: 0, z: 0 },
        { x: 10, y: 0, z: 0 }
      );
    });

    let wasActive;
    act(() => {
      wasActive = result.current.cancelFlight();
    });

    expect(wasActive).toBe(true);
    expect(result.current.isFlying).toBe(false);
    expect(result.current.isSettling).toBe(true);
    expect(result.current.targetAreaId).toBeNull();
  });

  it("does not enter settling when canceling an idle flight", () => {
    const { result } = renderHook(() => useExplorationFlight());

    let wasActive;
    act(() => {
      wasActive = result.current.cancelFlight();
    });

    expect(wasActive).toBe(false);
    expect(result.current.isSettling).toBe(false);
  });

  it("clears settling and exposes snapshot positions while flying", () => {
    const { result } = renderHook(() => useExplorationFlight());

    act(() => {
      result.current.startFlight(
        2,
        { x: 0, y: 0, z: 0 },
        { x: 10, y: 0, z: 0 }
      );
      result.current.tick(0.3);
    });

    const snapshot = result.current.getSnapshotPositions();
    expect(snapshot).not.toBeNull();
    expect(snapshot.plane.position).toBeDefined();
    expect(snapshot.bird.position).toBeDefined();

    act(() => {
      result.current.clearSettling();
      result.current.markArrivedAtCurrentArea(4);
    });

    expect(result.current.isSettling).toBe(false);
    expect(result.current.getSnapshotPositions()).not.toBeNull();

    act(() => {
      result.current.cancelFlight();
      result.current.clearSettling();
    });

    expect(result.current.getSnapshotPositions()).toBeNull();
  });

  it("returns an inactive tick when no flight is active", () => {
    const { result } = renderHook(() => useExplorationFlight());

    let tickResult;
    act(() => {
      tickResult = result.current.tick(0.16);
    });

    expect(tickResult).toEqual({
      arrived: false,
      isActive: false,
      plane: null,
      bird: null,
      lookAt: null,
      targetAreaId: null,
    });
  });
});
