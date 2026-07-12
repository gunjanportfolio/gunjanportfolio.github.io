import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import ExploreControls from "./ExploreControls";
import { PORTFOLIO_AREA_IDS } from "../../constants/portfolioAreas";
import {
  EXPLORE_HINT_MESSAGE,
  EXPLORE_HINT_STORAGE_KEY,
  EXPLORE_HINT_TITLE,
} from "../../constants/exploreUi";

function createMemoryStorage() {
  const values = new Map();

  return {
    getItem(key) {
      return values.has(key) ? values.get(key) : null;
    },
    setItem(key, value) {
      values.set(key, String(value));
    },
    removeItem(key) {
      values.delete(key);
    },
  };
}

describe("ExploreControls", () => {
  beforeEach(() => {
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      value: createMemoryStorage(),
    });
  });

  it("renders a first-visit explore hint and area navigator", () => {
    render(
      <ExploreControls
        currentStage={PORTFOLIO_AREA_IDS.HOME}
        onRotateLeft={vi.fn()}
        onRotateRight={vi.fn()}
        onStopRotate={vi.fn()}
        onGoToArea={vi.fn()}
      />
    );

    expect(screen.getByTestId("explore-first-visit-hint")).toHaveTextContent(
      EXPLORE_HINT_TITLE
    );
    expect(screen.getByTestId("explore-hint-message")).toHaveTextContent(
      EXPLORE_HINT_MESSAGE
    );
    expect(screen.getByTestId("explore-hint-message").className).toMatch(
      /explore-gradient-text/
    );
    expect(screen.getByTestId("area-navigator")).toBeInTheDocument();
    expect(screen.getByTestId("area-about").className).toMatch(
      /explore-area-pulse/
    );
    expect(screen.getByTestId("area-home")).toHaveAttribute(
      "aria-current",
      "true"
    );
  });

  it("starts and stops rotate handlers from the control buttons", () => {
    const onRotateLeft = vi.fn();
    const onRotateRight = vi.fn();
    const onStopRotate = vi.fn();

    render(
      <ExploreControls
        currentStage={PORTFOLIO_AREA_IDS.HOME}
        onRotateLeft={onRotateLeft}
        onRotateRight={onRotateRight}
        onStopRotate={onStopRotate}
        onGoToArea={vi.fn()}
      />
    );

    fireEvent.mouseDown(screen.getByTestId("explore-left"));
    fireEvent.mouseUp(screen.getByTestId("explore-left"));
    fireEvent.mouseDown(screen.getByTestId("explore-right"));
    fireEvent.mouseUp(screen.getByTestId("explore-right"));

    expect(onRotateLeft).toHaveBeenCalled();
    expect(onRotateRight).toHaveBeenCalled();
    expect(onStopRotate).toHaveBeenCalledTimes(2);
  });

  it("jumps to a selected portfolio area and dismisses the first-visit hint", () => {
    const onGoToArea = vi.fn();

    render(
      <ExploreControls
        currentStage={PORTFOLIO_AREA_IDS.HOME}
        onRotateLeft={vi.fn()}
        onRotateRight={vi.fn()}
        onStopRotate={vi.fn()}
        onGoToArea={onGoToArea}
      />
    );

    fireEvent.click(screen.getByTestId("area-projects"));
    expect(onGoToArea).toHaveBeenCalledWith(PORTFOLIO_AREA_IDS.PROJECTS);
    expect(
      screen.queryByTestId("explore-first-visit-hint")
    ).not.toBeInTheDocument();
    expect(window.localStorage.getItem(EXPLORE_HINT_STORAGE_KEY)).toBe("1");
  });
});
