import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import SceneLoadingOverlay from "./SceneLoadingOverlay";
import { LOADING_ISLAND_MESSAGE } from "../../constants/exploreUi";

describe("SceneLoadingOverlay", () => {
  it("shows the island loading message", () => {
    render(<SceneLoadingOverlay />);

    expect(screen.getByTestId("scene-loading-overlay")).toHaveTextContent(
      LOADING_ISLAND_MESSAGE
    );
    expect(screen.getByTestId("scene-loading-overlay")).toHaveAttribute(
      "data-fading",
      "false"
    );
  });

  it("marks fading state while disappearing", () => {
    render(<SceneLoadingOverlay isFading />);

    expect(screen.getByTestId("scene-loading-overlay")).toHaveAttribute(
      "data-fading",
      "true"
    );
  });

  it("renders nothing when hidden", () => {
    const { queryByTestId } = render(
      <SceneLoadingOverlay isVisible={false} />
    );

    expect(queryByTestId("scene-loading-overlay")).not.toBeInTheDocument();
  });
});
