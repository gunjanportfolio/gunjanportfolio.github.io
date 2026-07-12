import { describe, expect, it } from "vitest";

import {
  CONTACT_TO_EMAIL,
  FORMCARRY_ENDPOINT,
  SITE_BIO,
  SITE_CV_FILE_NAME,
  SITE_CV_LABEL,
  SITE_CV_PATH,
  SITE_FULL_NAME,
  SITE_GITHUB_URL,
  SITE_INSTAGRAM_URL,
  SITE_LINKEDIN_URL,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_X_URL,
  SITE_PROFILE_ALT,
  getSiteCvHref,
} from "./site";

describe("site config", () => {
  it("exposes required branding fields", () => {
    expect(SITE_NAME.length).toBeGreaterThan(0);
    expect(SITE_FULL_NAME).toBe("Gunjan Bandekar");
    expect(SITE_TAGLINE).toMatch(/Treatment Coordinator/i);
    expect(SITE_BIO).toMatch(/Happy Kids Dental Clinic/i);
    expect(CONTACT_TO_EMAIL).toBe("gunjanbandekar20@gmail.com");
    expect(SITE_LINKEDIN_URL).toBe(
      "https://www.linkedin.com/in/gunjanbandekar1320/"
    );
    expect(SITE_GITHUB_URL).toBe("https://github.com/gunjanportfolio");
    expect(SITE_INSTAGRAM_URL).toBe("https://www.instagram.com/gunjaaan2/");
    expect(SITE_X_URL).toBe("https://x.com");
    expect(FORMCARRY_ENDPOINT).toBe("https://formcarry.com/s/BO_V3AU0Jro");
    expect(SITE_PROFILE_ALT).toContain(SITE_FULL_NAME);
  });

  it("builds a downloadable CV href for root and nested bases", () => {
    expect(SITE_CV_LABEL).toBe("Download CV");
    expect(SITE_CV_FILE_NAME).toBe("Gunjan_Bandekar_CV.pdf");
    expect(SITE_CV_PATH).toBe(`cv/${SITE_CV_FILE_NAME}`);
    expect(getSiteCvHref("/")).toBe(`/cv/${SITE_CV_FILE_NAME}`);
    expect(getSiteCvHref("/portfolio/")).toBe(
      `/portfolio/cv/${SITE_CV_FILE_NAME}`
    );
    expect(getSiteCvHref("/portfolio")).toBe(
      `/portfolio/cv/${SITE_CV_FILE_NAME}`
    );
  });
});
