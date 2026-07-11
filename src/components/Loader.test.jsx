import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@react-three/drei", () => ({
  Html: ({ children }) => <div data-testid="loader-html">{children}</div>,
}));

import Loader from "./Loader";
import { LOADING_ISLAND_MESSAGE } from "../constants/exploreUi";

describe("Loader", () => {
  it("renders a spinner and clear loading instruction", () => {
    render(<Loader />);

    expect(screen.getByTestId("loader-html")).toBeInTheDocument();
    expect(screen.getByTestId("scene-loader")).toHaveTextContent(
      LOADING_ISLAND_MESSAGE
    );
    expect(
      screen.getByTestId("scene-loader").querySelector(".animate-spin")
    ).not.toBeNull();
  });
});
