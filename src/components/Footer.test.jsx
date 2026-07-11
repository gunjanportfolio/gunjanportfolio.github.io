import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import Footer from "./Footer";
import { SITE_FULL_NAME, SITE_LINKEDIN_URL } from "../config/site";

describe("Footer", () => {
  it("renders copyright with site name", () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    expect(screen.getByTestId("site-footer")).toHaveTextContent(SITE_FULL_NAME);
  });

  it("links to LinkedIn externally", () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    expect(screen.getByRole("link", { name: /linkedin/i })).toHaveAttribute(
      "href",
      SITE_LINKEDIN_URL
    );
  });
});
