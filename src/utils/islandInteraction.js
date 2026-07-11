import { PORTFOLIO_AREAS, PORTFOLIO_AREA_IDS } from "../constants/portfolioAreas";

const TWO_PI = 2 * Math.PI;

export function normalizeIslandRotation(rotation) {
  return ((rotation % TWO_PI) + TWO_PI) % TWO_PI;
}

export function getAngularDistance(fromRotation, toRotation) {
  const normalizedFrom = normalizeIslandRotation(fromRotation);
  const normalizedTo = normalizeIslandRotation(toRotation);
  const directDistance = Math.abs(normalizedFrom - normalizedTo);
  return Math.min(directDistance, TWO_PI - directDistance);
}

export function getStageFromIslandRotation(rotation) {
  const normalizedRotation = normalizeIslandRotation(rotation);

  let nearestArea = PORTFOLIO_AREAS[0];
  let nearestDistance = Number.POSITIVE_INFINITY;

  for (const area of PORTFOLIO_AREAS) {
    const distance = getAngularDistance(
      normalizedRotation,
      area.targetRotation
    );

    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestArea = area;
    }
  }

  return nearestArea.id;
}

export function getTargetRotationForArea(areaId) {
  const area = PORTFOLIO_AREAS.find(
    (portfolioArea) => portfolioArea.id === areaId
  );

  return area ? area.targetRotation : PORTFOLIO_AREAS[0].targetRotation;
}

export { PORTFOLIO_AREA_IDS, PORTFOLIO_AREAS };
