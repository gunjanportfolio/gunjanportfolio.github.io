import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import InteriorPanel from "./InteriorPanel";
import { PORTFOLIO_AREA_IDS } from "../../constants/portfolioAreas";
import { SITE_NAME } from "../../config/site";

describe("InteriorPanel", () => {
  it("shows area details and a back button", () => {
    const onBack = vi.fn();

    render(
      <MemoryRouter>
        <InteriorPanel
          areaId={PORTFOLIO_AREA_IDS.HOME}
          onBack={onBack}
        />
      </MemoryRouter>
    );

    expect(screen.getByTestId("interior-panel")).toBeInTheDocument();
    expect(screen.getByTestId("home-stage-1")).toHaveTextContent(SITE_NAME);
    fireEvent.click(screen.getByTestId("interior-back-button"));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("renders about content inside the panel", () => {
    render(
      <MemoryRouter>
        <InteriorPanel
          areaId={PORTFOLIO_AREA_IDS.ABOUT}
          onBack={vi.fn()}
        />
      </MemoryRouter>
    );

    expect(screen.getByTestId("home-stage-2")).toHaveTextContent(/skills/i);
    expect(
      screen.getByRole("link", { name: /explore full about/i })
    ).toBeInTheDocument();
  });
});
