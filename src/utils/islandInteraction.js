const TWO_PI = 2 * Math.PI;

export function normalizeIslandRotation(rotation) {
  return ((rotation % TWO_PI) + TWO_PI) % TWO_PI;
}

export function getStageFromIslandRotation(rotation) {
  const normalizedRotation = normalizeIslandRotation(rotation);

  if (normalizedRotation >= 5.45 && normalizedRotation <= 5.85) {
    return 4;
  }

  if (normalizedRotation >= 0.85 && normalizedRotation <= 1.3) {
    return 3;
  }

  if (normalizedRotation >= 2.4 && normalizedRotation <= 2.6) {
    return 2;
  }

  if (normalizedRotation >= 4.25 && normalizedRotation <= 4.75) {
    return 1;
  }

  return null;
}
