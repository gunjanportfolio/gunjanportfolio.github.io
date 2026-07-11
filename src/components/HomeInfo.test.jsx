import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import HomeInfo from "./HomeInfo";
import { SITE_NAME } from "../config/site";
import { PORTFOLIO_AREA_IDS } from "../constants/portfolioAreas";

function renderHomeInfo(currentStage, onBack) {
  return render(
    <MemoryRouter>
      <HomeInfo currentStage={currentStage} onBack={onBack} />
    </MemoryRouter>
  );
}

describe("HomeInfo", () => {
  it("renders home area details with site name", () => {
    renderHomeInfo(PORTFOLIO_AREA_IDS.HOME);
    expect(screen.getByTestId("home-stage-1")).toHaveTextContent(SITE_NAME);
    expect(screen.getByTestId("home-stage-1")).toHaveTextContent(/island area/i);
  });

  it("renders about area details and CTA", () => {
    renderHomeInfo(PORTFOLIO_AREA_IDS.ABOUT);
    expect(screen.getByTestId("home-stage-2")).toHaveTextContent(/skills/i);
    expect(
      screen.getByRole("link", { name: /explore full about/i })
    ).toHaveAttribute("href", "/about");
  });

  it("renders projects area details and CTA", () => {
    renderHomeInfo(PORTFOLIO_AREA_IDS.PROJECTS);
    expect(screen.getByTestId("home-stage-3")).toHaveTextContent(
      /featured analytics/i
    );
    expect(
      screen.getByRole("link", { name: /browse all projects/i })
    ).toHaveAttribute("href", "/projects");
  });

  it("places back to island directly under the browse CTA", () => {
    const onBack = vi.fn();
    renderHomeInfo(PORTFOLIO_AREA_IDS.PROJECTS, onBack);

    const stack = screen.getByTestId("interior-cta-stack");
    const browseLink = screen.getByRole("link", {
      name: /browse all projects/i,
    });
    const backButton = screen.getByTestId("interior-back-button");

    expect(stack).toContainElement(browseLink);
    expect(stack).toContainElement(backButton);
    expect(browseLink.compareDocumentPosition(backButton)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING
    );

    fireEvent.click(backButton);
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("renders contact area details and CTA", () => {
    renderHomeInfo(PORTFOLIO_AREA_IDS.CONTACT);
    expect(screen.getByTestId("home-stage-4")).toHaveTextContent(/collaborate/i);
    expect(screen.getByRole("link", { name: /open contact/i })).toHaveAttribute(
      "href",
      "/contact"
    );
  });

  it("renders nothing for unknown stages", () => {
    const { container } = renderHomeInfo(99);
    expect(container).toBeEmptyDOMElement();
  });
});
