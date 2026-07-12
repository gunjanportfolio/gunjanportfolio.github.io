import { describe, expect, it } from "vitest";

import {
  SITE_GITHUB_URL,
  SITE_INSTAGRAM_URL,
  SITE_LINKEDIN_URL,
  SITE_X_URL,
} from "../config/site";
import { HOME_SOCIAL_LINKS, HOME_SOCIAL_LINK_NAMES } from "./homeSocialLinks";

describe("homeSocialLinks", () => {
  it("defines clickable LinkedIn, GitHub, Instagram, and X links", () => {
    expect(HOME_SOCIAL_LINKS).toHaveLength(4);

    const linkNames = HOME_SOCIAL_LINKS.map((link) => link.name);
    expect(linkNames).toEqual([
      HOME_SOCIAL_LINK_NAMES.LINKEDIN,
      HOME_SOCIAL_LINK_NAMES.GITHUB,
      HOME_SOCIAL_LINK_NAMES.INSTAGRAM,
      HOME_SOCIAL_LINK_NAMES.X,
    ]);

    expect(HOME_SOCIAL_LINKS[0].href).toBe(SITE_LINKEDIN_URL);
    expect(HOME_SOCIAL_LINKS[1].href).toBe(SITE_GITHUB_URL);
    expect(HOME_SOCIAL_LINKS[2].href).toBe(SITE_INSTAGRAM_URL);
    expect(HOME_SOCIAL_LINKS[3].href).toBe(SITE_X_URL);

    HOME_SOCIAL_LINKS.forEach((link) => {
      expect(link.iconUrl).toBeTruthy();
      expect(link.href.startsWith("https://")).toBe(true);
    });
  });
});
