import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { SITE_CV_FILE_NAME, SITE_CV_LABEL, getSiteCvHref } from "../config/site";
import Navbar from "./Navbar";

describe("Navbar", () => {
  it("renders About, Projects, and Download CV links", () => {
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

    const downloadLink = screen.getByTestId("download-cv-button");
    expect(downloadLink).toHaveTextContent(SITE_CV_LABEL);
    expect(downloadLink).toHaveAttribute("href", getSiteCvHref());
    expect(downloadLink).toHaveAttribute("download", SITE_CV_FILE_NAME);
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
