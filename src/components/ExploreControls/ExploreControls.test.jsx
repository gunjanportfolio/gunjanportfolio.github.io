import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import ExploreControls from "./ExploreControls";

describe("ExploreControls", () => {
  it("renders the explore hint", () => {
    render(
      <ExploreControls
        onRotateLeft={vi.fn()}
        onRotateRight={vi.fn()}
        onStopRotate={vi.fn()}
      />
    );

    expect(screen.getByTestId("explore-controls")).toHaveTextContent(
      /drag the island/i
    );
  });

  it("starts and stops rotate handlers from the control buttons", () => {
    const onRotateLeft = vi.fn();
    const onRotateRight = vi.fn();
    const onStopRotate = vi.fn();

    render(
      <ExploreControls
        onRotateLeft={onRotateLeft}
        onRotateRight={onRotateRight}
        onStopRotate={onStopRotate}
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
});
