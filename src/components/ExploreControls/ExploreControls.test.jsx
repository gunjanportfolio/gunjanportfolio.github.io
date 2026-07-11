import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import ExploreControls from "./ExploreControls";
import { PORTFOLIO_AREA_IDS } from "../../constants/portfolioAreas";

describe("ExploreControls", () => {
  it("renders area navigator and explore hint", () => {
    render(
      <ExploreControls
        currentStage={PORTFOLIO_AREA_IDS.HOME}
        onRotateLeft={vi.fn()}
        onRotateRight={vi.fn()}
        onStopRotate={vi.fn()}
        onGoToArea={vi.fn()}
      />
    );

    expect(screen.getByTestId("explore-controls")).toHaveTextContent(
      /click a building on the island/i
    );
    expect(screen.getByTestId("area-navigator")).toBeInTheDocument();
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

  it("jumps to a selected portfolio area", () => {
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
  });
});
