import { getPortfolioAreaById } from "../constants/portfolioAreas";

export const FLIGHT_DURATION_SECONDS = 1.5;
export const BIRD_LEAD_OFFSET = 0.18;
export const FLIGHT_ARC_HEIGHT = 4;
export const CAMERA_FOLLOW_BEHIND = 10;
export const CAMERA_FOLLOW_ABOVE = 4;
export const CAMERA_FOLLOW_DAMPING = 4;
export const CAMERA_SETTLE_DAMPING = 2.5;

export const DEFAULT_CAMERA_POSITION = { x: 0, y: 0, z: 5 };
export const DEFAULT_CAMERA_LOOK_AT = { x: 0, y: 0, z: -40 };

export function clamp01(value) {
  if (value <= 0) {
    return 0;
  }

  if (value >= 1) {
    return 1;
  }

  return value;
}

export function easeInOutCubic(progress) {
  const clampedProgress = clamp01(progress);

  if (clampedProgress < 0.5) {
    return 4 * clampedProgress * clampedProgress * clampedProgress;
  }

  return 1 - Math.pow(-2 * clampedProgress + 2, 3) / 2;
}

export function getWaypointForArea(areaId) {
  const area = getPortfolioAreaById(areaId);
  return { ...area.waypoint };
}

export function copyVector3(vector) {
  return {
    x: vector.x,
    y: vector.y,
    z: vector.z,
  };
}

export function localWaypointToWorld(
  waypoint,
  islandPosition,
  islandRotationY,
  islandScale = { x: 1, y: 1, z: 1 }
) {
  const scaleX = Array.isArray(islandScale) ? islandScale[0] : islandScale.x;
  const scaleY = Array.isArray(islandScale) ? islandScale[1] : islandScale.y;
  const scaleZ = Array.isArray(islandScale) ? islandScale[2] : islandScale.z;

  const scaledX = waypoint.x * scaleX;
  const scaledY = waypoint.y * scaleY;
  const scaledZ = waypoint.z * scaleZ;

  const cosYaw = Math.cos(islandRotationY);
  const sinYaw = Math.sin(islandRotationY);

  return {
    x: islandPosition.x + scaledX * cosYaw - scaledZ * sinYaw,
    y: islandPosition.y + scaledY,
    z: islandPosition.z + scaledX * sinYaw + scaledZ * cosYaw,
  };
}

export function sampleFlightPath(from, to, progress, arcHeight = FLIGHT_ARC_HEIGHT) {
  const easedProgress = easeInOutCubic(progress);
  const linearY = from.y + (to.y - from.y) * easedProgress;
  const arcOffset = 4 * arcHeight * easedProgress * (1 - easedProgress);

  return {
    x: from.x + (to.x - from.x) * easedProgress,
    y: linearY + arcOffset,
    z: from.z + (to.z - from.z) * easedProgress,
  };
}

export function getGuideProgress(planeProgress, leadOffset = BIRD_LEAD_OFFSET) {
  return clamp01(planeProgress + leadOffset);
}

export function getHeadingY(from, to) {
  const deltaX = to.x - from.x;
  const deltaZ = to.z - from.z;

  if (Math.abs(deltaX) < 0.0001 && Math.abs(deltaZ) < 0.0001) {
    return 0;
  }

  return Math.atan2(deltaX, deltaZ);
}

export function computeCameraFollowTarget(
  planePosition,
  planeHeadingY,
  behind = CAMERA_FOLLOW_BEHIND,
  above = CAMERA_FOLLOW_ABOVE
) {
  const cosHeading = Math.cos(planeHeadingY);
  const sinHeading = Math.sin(planeHeadingY);

  return {
    x: planePosition.x - sinHeading * behind,
    y: planePosition.y + above,
    z: planePosition.z - cosHeading * behind,
  };
}

export function dampVector3(current, target, damping, deltaSeconds) {
  const alpha = 1 - Math.exp(-damping * deltaSeconds);

  return {
    x: current.x + (target.x - current.x) * alpha,
    y: current.y + (target.y - current.y) * alpha,
    z: current.z + (target.z - current.z) * alpha,
  };
}

export function advanceFlightProgress(currentProgress, deltaSeconds, durationSeconds = FLIGHT_DURATION_SECONDS) {
  if (durationSeconds <= 0) {
    return 1;
  }

  return clamp01(currentProgress + deltaSeconds / durationSeconds);
}

export function areSameArea(areaId, otherAreaId) {
  return areaId === otherAreaId;
}

export const INTERIOR_CAMERA_DAMPING = 3.5;
export const INTERIOR_CAMERA_HEIGHT_BOOST = 1.8;

export function computeInteriorCameraTarget(
  lookAt,
  outdoorCameraPosition = DEFAULT_CAMERA_POSITION,
  approach = 0.62,
  heightBoost = INTERIOR_CAMERA_HEIGHT_BOOST
) {
  const clampedApproach = clamp01(approach);

  return {
    position: {
      x:
        outdoorCameraPosition.x +
        (lookAt.x - outdoorCameraPosition.x) * clampedApproach,
      y: Math.max(
        lookAt.y + heightBoost,
        outdoorCameraPosition.y + heightBoost * 0.5
      ),
      z:
        outdoorCameraPosition.z +
        (lookAt.z - outdoorCameraPosition.z) * clampedApproach,
    },
    lookAt: copyVector3(lookAt),
  };
}

export function getHitboxSizeForArea(areaId) {
  const area = getPortfolioAreaById(areaId);
  return [...(area.hitboxSize || [12, 10, 12])];
}
