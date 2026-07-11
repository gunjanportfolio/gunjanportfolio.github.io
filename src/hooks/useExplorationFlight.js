import { useCallback, useRef, useState } from "react";

import {
  advanceFlightProgress,
  areSameArea,
  copyVector3,
  getGuideProgress,
  getHeadingY,
  sampleFlightPath,
} from "../utils/explorationFlight";

const LOOK_AHEAD_PROGRESS = 0.02;

function createIdleFlightState() {
  return {
    active: false,
    progress: 0,
    from: { x: 0, y: 0, z: 0 },
    to: { x: 0, y: 0, z: 0 },
    targetAreaId: null,
    settleOnArrive: true,
  };
}

export function sampleFlightPose(flightState, progress) {
  const position = sampleFlightPath(
    flightState.from,
    flightState.to,
    progress
  );
  const lookTarget = sampleFlightPath(
    flightState.from,
    flightState.to,
    Math.min(progress + LOOK_AHEAD_PROGRESS, 1)
  );
  const headingY = getHeadingY(position, lookTarget);

  return {
    position,
    headingY,
  };
}

export default function useExplorationFlight() {
  const [isFlying, setIsFlying] = useState(false);
  const [isSettling, setIsSettling] = useState(false);
  const [targetAreaId, setTargetAreaId] = useState(null);
  const [arrivedAreaId, setArrivedAreaId] = useState(null);

  const flightRef = useRef(createIdleFlightState());
  const currentAreaIdRef = useRef(null);

  const startFlight = useCallback(
    (areaId, fromPosition, toPosition, options) => {
      const allowSameArea = Boolean(options?.allowSameArea);
      const settleOnArrive = options?.settleOnArrive !== false;

      if (
        !allowSameArea &&
        areSameArea(areaId, currentAreaIdRef.current) &&
        !flightRef.current.active
      ) {
        return false;
      }

      flightRef.current = {
        active: true,
        progress: 0,
        from: copyVector3(fromPosition),
        to: copyVector3(toPosition),
        targetAreaId: areaId,
        settleOnArrive,
      };

      setIsFlying(true);
      setIsSettling(false);
      setTargetAreaId(areaId);
      setArrivedAreaId(null);
      return true;
    },
    []
  );

  const cancelFlight = useCallback((options) => {
    const wasActive = flightRef.current.active;
    const shouldSettle = options?.settle !== false;
    flightRef.current = createIdleFlightState();
    setIsFlying(false);
    setTargetAreaId(null);

    if (wasActive && shouldSettle) {
      setIsSettling(true);
    }

    return wasActive;
  }, []);

  const clearSettling = useCallback(() => {
    setIsSettling(false);
  }, []);

  const markArrivedAtCurrentArea = useCallback((areaId) => {
    currentAreaIdRef.current = areaId;
  }, []);

  const tick = useCallback((deltaSeconds) => {
    const flightState = flightRef.current;

    if (!flightState.active) {
      return {
        arrived: false,
        isActive: false,
        plane: null,
        bird: null,
        lookAt: null,
        targetAreaId: null,
      };
    }

    const nextProgress = advanceFlightProgress(
      flightState.progress,
      deltaSeconds
    );
    flightState.progress = nextProgress;

    const planePose = sampleFlightPose(flightState, nextProgress);
    const birdPose = sampleFlightPose(
      flightState,
      getGuideProgress(nextProgress)
    );

    if (nextProgress >= 1) {
      const arrivedAreaIdValue = flightState.targetAreaId;
      const shouldSettle = flightState.settleOnArrive;
      const lookAt = copyVector3(flightState.to);
      flightRef.current = createIdleFlightState();
      currentAreaIdRef.current = arrivedAreaIdValue;
      setIsFlying(false);
      setIsSettling(shouldSettle);
      setTargetAreaId(null);
      setArrivedAreaId(arrivedAreaIdValue);

      return {
        arrived: true,
        isActive: false,
        plane: planePose,
        bird: birdPose,
        lookAt,
        targetAreaId: arrivedAreaIdValue,
      };
    }

    return {
      arrived: false,
      isActive: true,
      plane: planePose,
      bird: birdPose,
      lookAt: copyVector3(flightState.to),
      targetAreaId: flightState.targetAreaId,
    };
  }, []);

  const getSnapshotPositions = useCallback(() => {
    const flightState = flightRef.current;

    if (!flightState.active) {
      return null;
    }

    const planePose = sampleFlightPose(flightState, flightState.progress);
    const birdPose = sampleFlightPose(
      flightState,
      getGuideProgress(flightState.progress)
    );

    return {
      plane: planePose,
      bird: birdPose,
      lookAt: copyVector3(flightState.to),
      targetAreaId: flightState.targetAreaId,
      progress: flightState.progress,
    };
  }, []);

  return {
    isFlying,
    isSettling,
    targetAreaId,
    arrivedAreaId,
    startFlight,
    cancelFlight,
    clearSettling,
    markArrivedAtCurrentArea,
    tick,
    getSnapshotPositions,
    flightRef,
  };
}
