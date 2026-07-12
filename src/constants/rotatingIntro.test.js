import { describe, expect, it } from "vitest";

import {
  ROTATING_INTRO_GREETING,
  ROTATING_INTRO_GREETING_TEXT,
  ROTATING_INTRO_SKILLS,
  ROTATING_INTRO_WAVE_EMOJI,
  getNextRotatingIntroIndex,
} from "./rotatingIntro";

describe("rotatingIntro constants", () => {
  it("defines sky-visible colored skills for the home intro", () => {
    expect(ROTATING_INTRO_GREETING_TEXT).toBe("Hi");
    expect(ROTATING_INTRO_WAVE_EMOJI).toBe("👋");
    expect(ROTATING_INTRO_GREETING).toBe("Hi 👋");
    expect(ROTATING_INTRO_SKILLS.length).toBeGreaterThanOrEqual(5);
    ROTATING_INTRO_SKILLS.forEach((skill) => {
      expect(skill.label.length).toBeGreaterThan(0);
      expect(skill.color).toMatch(/^#[0-9a-fA-F]{6}$/);
    });
  });

  it("advances and wraps the skill index", () => {
    expect(getNextRotatingIntroIndex(0, 3)).toBe(1);
    expect(getNextRotatingIntroIndex(2, 3)).toBe(0);
    expect(getNextRotatingIntroIndex(5, 0)).toBe(0);
  });
});
