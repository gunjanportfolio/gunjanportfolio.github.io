import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import Navbar from "./Navbar";

describe("Navbar", () => {
  it("renders About and Projects links", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByRole("link", { name: /about/i })).toHaveAttribute(
      "href",
      "/about"
    );
    expect(screen.getByRole("link", { name: /projects/i })).toHaveAttribute(
      "href",
      "/projects"
    );
  });

  it("applies active styles on the About route", () => {
    render(
      <MemoryRouter initialEntries={["/about"]}>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByRole("link", { name: /about/i })).toHaveClass(
      "text-blue-600"
    );
    expect(screen.getByRole("link", { name: /projects/i })).toHaveClass(
      "text-black"
    );
  });
});
