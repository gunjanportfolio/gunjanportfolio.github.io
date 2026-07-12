import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { SITE_NAME } from "../../config/site";
import {
  ROTATING_INTRO_FADE_MS,
  ROTATING_INTRO_GREETING,
  ROTATING_INTRO_INTERVAL_MS,
  ROTATING_INTRO_SKILLS,
} from "../../constants/rotatingIntro";
import RotatingIntro from "./RotatingIntro";

describe("RotatingIntro", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.doUnmock("../../constants/rotatingIntro");
    vi.resetModules();
  });

  it("renders the intro line with a waving emoji and the first skill color", () => {
    render(<RotatingIntro />);

    expect(screen.getByTestId("rotating-intro")).toHaveTextContent(
      `${ROTATING_INTRO_GREETING} I am ${SITE_NAME} and I am into ${ROTATING_INTRO_SKILLS[0].label}`
    );
    expect(screen.getByTestId("rotating-intro-wave")).toHaveTextContent("👋");
    expect(screen.getByTestId("rotating-intro-wave")).toHaveClass(
      "rotating-intro-wave"
    );
    expect(screen.getByTestId("rotating-intro-skill")).toHaveTextContent(
      ROTATING_INTRO_SKILLS[0].label
    );
    expect(screen.getByTestId("rotating-intro-skill")).toHaveStyle({
      color: ROTATING_INTRO_SKILLS[0].color,
    });
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

  it("renders nothing when skills are empty", async () => {
    vi.resetModules();
    vi.doMock("../../constants/rotatingIntro", () => ({
      ROTATING_INTRO_FADE_MS: 320,
      ROTATING_INTRO_GREETING_TEXT: "Hi",
      ROTATING_INTRO_WAVE_EMOJI: "👋",
      ROTATING_INTRO_GREETING: "Hi 👋",
      ROTATING_INTRO_INTERVAL_MS: 2800,
      ROTATING_INTRO_SKILLS: [],
      getNextRotatingIntroIndex: (currentIndex, skillCount) => {
        if (skillCount <= 0) {
          return 0;
        }

        return (currentIndex + 1) % skillCount;
      },
    }));

    const { default: EmptyRotatingIntro } = await import("./RotatingIntro");
    const { container } = render(<EmptyRotatingIntro />);

    expect(container.firstChild).toBeNull();
  });
});
