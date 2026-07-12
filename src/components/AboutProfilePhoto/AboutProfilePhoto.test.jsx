import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  SITE_FULL_NAME,
  SITE_PROFILE_ALT,
  SITE_TAGLINE,
} from "../../config/site";
import AboutProfilePhoto from "./AboutProfilePhoto";

describe("AboutProfilePhoto", () => {
  it("renders the profile portrait with name and tagline", () => {
    render(<AboutProfilePhoto />);

    const portrait = screen.getByTestId("about-profile-photo");
    expect(portrait).toBeInTheDocument();
    expect(screen.getByAltText(SITE_PROFILE_ALT)).toBeInTheDocument();
    expect(portrait).toHaveTextContent(SITE_FULL_NAME);
    expect(portrait).toHaveTextContent(SITE_TAGLINE);
  });
});
