import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { SITE_NAME } from "../../config/site";
import {
  ROTATING_INTRO_FADE_MS,
  ROTATING_INTRO_GREETING,
  ROTATING_INTRO_INTERVAL_MS,
  ROTATING_INTRO_SKILLS,
  getLongestRotatingIntroSkillLabel,
} from "../../constants/rotatingIntro";
import RotatingIntro from "./RotatingIntro";

describe("RotatingIntro", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders the intro line with the first skill color", () => {
    render(<RotatingIntro />);

    expect(screen.getByTestId("rotating-intro")).toHaveTextContent(
      `${ROTATING_INTRO_GREETING} I am ${SITE_NAME} and I am into`
    );
    expect(screen.getByTestId("rotating-intro-skill")).toHaveTextContent(
      ROTATING_INTRO_SKILLS[0].label
    );
    expect(screen.getByTestId("rotating-intro-skill")).toHaveStyle({
      color: ROTATING_INTRO_SKILLS[0].color,
    });
    expect(screen.getByTestId("rotating-intro-skill-slot")).toHaveTextContent(
      getLongestRotatingIntroSkillLabel(ROTATING_INTRO_SKILLS)
    );
  });

  it("rotates to the next skill after the interval", () => {
    render(<RotatingIntro />);

    act(() => {
      vi.advanceTimersByTime(ROTATING_INTRO_INTERVAL_MS);
    });

    act(() => {
      vi.advanceTimersByTime(ROTATING_INTRO_FADE_MS);
    });

    expect(screen.getByTestId("rotating-intro-skill")).toHaveTextContent(
      ROTATING_INTRO_SKILLS[1].label
    );
    expect(screen.getByTestId("rotating-intro-skill")).toHaveStyle({
      color: ROTATING_INTRO_SKILLS[1].color,
    });
  });

  it("wraps back to the first skill after the last one", () => {
    render(<RotatingIntro />);

    const fullCycleMs =
      ROTATING_INTRO_SKILLS.length *
      (ROTATING_INTRO_INTERVAL_MS + ROTATING_INTRO_FADE_MS);

    act(() => {
      vi.advanceTimersByTime(fullCycleMs);
    });

    expect(screen.getByTestId("rotating-intro-skill")).toHaveTextContent(
      ROTATING_INTRO_SKILLS[0].label
    );
  });
});
