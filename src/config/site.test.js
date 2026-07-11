import { describe, expect, it } from "vitest";

import {
  CONTACT_TO_EMAIL,
  SITE_BIO,
  SITE_FULL_NAME,
  SITE_NAME,
  SITE_TAGLINE,
} from "./site";

describe("site config", () => {
  it("exposes required branding fields", () => {
    expect(SITE_NAME.length).toBeGreaterThan(0);
    expect(SITE_FULL_NAME).toBe("Gunjan Bandekar");
    expect(SITE_TAGLINE).toMatch(/Treatment Coordinator/i);
    expect(SITE_BIO).toMatch(/Happy Kids Dental Clinic/i);
    expect(CONTACT_TO_EMAIL).toBe("gunjanbandekar20@gmail.com");
  });
});
