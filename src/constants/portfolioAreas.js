export const PORTFOLIO_AREA_IDS = {
  HOME: 1,
  ABOUT: 2,
  PROJECTS: 3,
  CONTACT: 4,
};

export const PORTFOLIO_AREAS = [
  {
    id: PORTFOLIO_AREA_IDS.HOME,
    key: "home",
    label: "Home",
    targetRotation: 4.5,
  },
  {
    id: PORTFOLIO_AREA_IDS.ABOUT,
    key: "about",
    label: "About",
    targetRotation: 2.5,
  },
  {
    id: PORTFOLIO_AREA_IDS.PROJECTS,
    key: "projects",
    label: "Projects",
    targetRotation: 1.05,
  },
  {
    id: PORTFOLIO_AREA_IDS.CONTACT,
    key: "contact",
    label: "Contact",
    targetRotation: 5.65,
  },
];

export function getPortfolioAreaById(areaId) {
  return (
    PORTFOLIO_AREAS.find((area) => area.id === areaId) || PORTFOLIO_AREAS[0]
  );
}
