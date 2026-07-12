export const ROTATING_INTRO_INTERVAL_MS = 2800;
export const ROTATING_INTRO_FADE_MS = 320;

export const ROTATING_INTRO_SKILLS = [
  { label: "Data Analytics", color: "#0f766e" },
  { label: "SQL", color: "#1d4ed8" },
  { label: "Power BI / Tableau", color: "#b45309" },
  { label: "Python", color: "#15803d" },
  { label: "Business Analysis", color: "#c2410c" },
  { label: "AI-Driven Analytics", color: "#0e7490" },
  { label: "Stakeholder Management", color: "#be123c" },
  { label: "Process Optimization", color: "#0369a1" },
];

export function getLongestRotatingIntroSkillLabel(skills = ROTATING_INTRO_SKILLS) {
  if (skills.length === 0) {
    return "";
  }

  return skills.reduce((longestLabel, skill) => {
    if (skill.label.length > longestLabel.length) {
      return skill.label;
    }

    return longestLabel;
  }, skills[0].label);
}

export function getNextRotatingIntroIndex(currentIndex, skillCount) {
  if (skillCount <= 0) {
    return 0;
  }

  return (currentIndex + 1) % skillCount;
}
