export const ROTATING_INTRO_INTERVAL_MS = 2800;
export const ROTATING_INTRO_FADE_MS = 320;
export const ROTATING_INTRO_GREETING_TEXT = "Hi";
export const ROTATING_INTRO_WAVE_EMOJI = "👋";
export const ROTATING_INTRO_GREETING = `${ROTATING_INTRO_GREETING_TEXT} ${ROTATING_INTRO_WAVE_EMOJI}`;

export const ROTATING_INTRO_SKILLS = [
  { label: "Data Analytics", color: "#2dd4bf" },
  { label: "SQL", color: "#fde68a" },
  { label: "Power BI / Tableau", color: "#fdba74" },
  { label: "Python", color: "#86efac" },
  { label: "Business Analysis", color: "#fbbf24" },
  { label: "AI-Driven Analytics", color: "#f9a8d4" },
  { label: "Stakeholder Management", color: "#c4b5fd" },
  { label: "Process Optimization", color: "#7dd3fc" },
];

export function getNextRotatingIntroIndex(currentIndex, skillCount) {
  if (skillCount <= 0) {
    return 0;
  }

  return (currentIndex + 1) % skillCount;
}
