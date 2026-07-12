import { useEffect, useState } from "react";

import { SITE_NAME } from "../../config/site";
import {
  ROTATING_INTRO_FADE_MS,
  ROTATING_INTRO_INTERVAL_MS,
  ROTATING_INTRO_SKILLS,
  getLongestRotatingIntroSkillLabel,
  getNextRotatingIntroIndex,
} from "../../constants/rotatingIntro";

const LONGEST_ROTATING_INTRO_SKILL_LABEL =
  getLongestRotatingIntroSkillLabel(ROTATING_INTRO_SKILLS);

function RotatingIntro() {
  const [skillIndex, setSkillIndex] = useState(0);
  const [isSkillVisible, setIsSkillVisible] = useState(true);

  useEffect(() => {
    if (ROTATING_INTRO_SKILLS.length === 0) {
      return undefined;
    }

    let fadeTimeoutId = null;

    const intervalId = window.setInterval(() => {
      setIsSkillVisible(false);

      fadeTimeoutId = window.setTimeout(() => {
        setSkillIndex((currentIndex) =>
          getNextRotatingIntroIndex(currentIndex, ROTATING_INTRO_SKILLS.length)
        );
        setIsSkillVisible(true);
      }, ROTATING_INTRO_FADE_MS);
    }, ROTATING_INTRO_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);

      if (fadeTimeoutId !== null) {
        window.clearTimeout(fadeTimeoutId);
      }
    };
  }, []);

  const activeSkill = ROTATING_INTRO_SKILLS[skillIndex];

  if (!activeSkill) {
    return null;
  }

  return (
    <div
      className="pointer-events-none absolute top-20 left-0 right-0 z-20 flex justify-center px-4"
      data-testid="rotating-intro"
    >
      <p className="rotating-intro-panel max-w-3xl text-center font-poppins text-base font-semibold text-slate-800 sm:text-xl md:text-2xl">
        <span>I am {SITE_NAME} and I am into </span>
        <span
          className="rotating-intro-skill-slot"
          data-testid="rotating-intro-skill-slot"
        >
          <span aria-hidden="true" className="rotating-intro-skill-sizer">
            {LONGEST_ROTATING_INTRO_SKILL_LABEL}
          </span>
          <span
            aria-live="polite"
            className={`rotating-intro-skill ${
              isSkillVisible
                ? "rotating-intro-skill-visible"
                : "rotating-intro-skill-hidden"
            }`}
            data-testid="rotating-intro-skill"
            style={{ color: activeSkill.color }}
          >
            {activeSkill.label}
          </span>
        </span>
      </p>
    </div>
  );
}

export default RotatingIntro;
