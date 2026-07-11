import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import BackToIsland from "./BackToIsland";

describe("BackToIsland", () => {
  it("links back to the island home route", () => {
    render(
      <MemoryRouter>
        <BackToIsland />
      </MemoryRouter>
    );

    const link = screen.getByTestId("back-to-island");
    expect(link).toHaveAttribute("href", "/");
    expect(link).toHaveTextContent(/back to island/i);
  });

  it("appends an optional className", () => {
    render(
      <MemoryRouter>
        <BackToIsland className="mb-4" />
      </MemoryRouter>
    );

    expect(screen.getByTestId("back-to-island").className).toContain("mb-4");
  });
});
