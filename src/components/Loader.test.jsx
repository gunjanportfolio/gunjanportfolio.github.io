import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@react-three/drei", () => ({
  Html: ({ children }) => <div data-testid="loader-html">{children}</div>,
}));

import Loader from "./Loader";

describe("Loader", () => {
  it("renders a spinner inside Html", () => {
    render(<Loader />);
    expect(screen.getByTestId("loader-html")).toBeInTheDocument();
    expect(
      screen.getByTestId("loader-html").querySelector(".animate-spin")
    ).not.toBeNull();
  });
});
