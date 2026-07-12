import { useEffect, useState } from "react";

import { SITE_NAME } from "../../config/site";
import {
  ROTATING_INTRO_FADE_MS,
  ROTATING_INTRO_GREETING_TEXT,
  ROTATING_INTRO_INTERVAL_MS,
  ROTATING_INTRO_SKILLS,
  ROTATING_INTRO_WAVE_EMOJI,
  getNextRotatingIntroIndex,
} from "../../constants/rotatingIntro";

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
      <p className="rotating-intro-text max-w-3xl text-center font-poppins text-base font-semibold sm:text-xl md:text-2xl">
        <span>
          {ROTATING_INTRO_GREETING_TEXT}{" "}
          <span
            aria-hidden="true"
            className="rotating-intro-wave"
            data-testid="rotating-intro-wave"
          >
            {ROTATING_INTRO_WAVE_EMOJI}
          </span>{" "}
          I am {SITE_NAME} and I am into{" "}
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
      </p>
    </div>
  );
}

export default RotatingIntro;
