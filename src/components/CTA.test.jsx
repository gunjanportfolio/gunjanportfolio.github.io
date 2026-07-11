import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import CTA from "./CTA";

describe("CTA", () => {
  it("links to the contact page", () => {
    render(
      <MemoryRouter>
        <CTA />
      </MemoryRouter>
    );

    expect(screen.getByRole("link", { name: /contact/i })).toHaveAttribute(
      "href",
      "/contact"
    );
  });
});
