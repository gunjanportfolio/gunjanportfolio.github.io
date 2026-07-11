import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import HomeInfo from "./HomeInfo";
import { SITE_NAME } from "../config/site";

function renderHomeInfo(currentStage) {
  return render(
    <MemoryRouter>
      <HomeInfo currentStage={currentStage} />
    </MemoryRouter>
  );
}

describe("HomeInfo", () => {
  it("renders intro stage with site name", () => {
    renderHomeInfo(1);
    expect(screen.getByTestId("home-stage-1")).toHaveTextContent(SITE_NAME);
  });

  it("renders about CTA on stage 2", () => {
    renderHomeInfo(2);
    expect(screen.getByTestId("home-stage-2")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /learn more/i })).toHaveAttribute(
      "href",
      "/about"
    );
  });

  it("renders projects CTA on stage 3", () => {
    renderHomeInfo(3);
    expect(screen.getByTestId("home-stage-3")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /visit my portfolio/i })
    ).toHaveAttribute("href", "/projects");
  });

  it("renders contact CTA on stage 4", () => {
    renderHomeInfo(4);
    expect(screen.getByTestId("home-stage-4")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /let's talk/i })).toHaveAttribute(
      "href",
      "/contact"
    );
  });

  it("renders nothing for unknown stages", () => {
    const { container } = renderHomeInfo(99);
    expect(container).toBeEmptyDOMElement();
  });
});
