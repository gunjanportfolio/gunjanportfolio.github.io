import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  HOME_SOCIAL_LINKS,
  HOME_SOCIAL_LINK_NAMES,
} from "../../constants/homeSocialLinks";
import HomeSocialLinks from "./HomeSocialLinks";

describe("HomeSocialLinks", () => {
  it("renders LinkedIn, GitHub, Instagram, and X as external links", () => {
    render(<HomeSocialLinks />);

    expect(screen.getByTestId("home-social-links")).toBeInTheDocument();

    HOME_SOCIAL_LINKS.forEach((socialLink) => {
      const link = screen.getByRole("link", { name: socialLink.name });
      expect(link).toHaveAttribute("href", socialLink.href);
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });

    expect(
      screen.getByTestId(
        `home-social-link-${HOME_SOCIAL_LINK_NAMES.INSTAGRAM.toLowerCase()}`
      )
    ).toHaveAttribute("href", HOME_SOCIAL_LINKS[2].href);
  });
});
