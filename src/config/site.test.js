import { describe, expect, it } from "vitest";

import { SITE_NAME, SITE_FULL_NAME, SITE_BIO } from "./site";

describe("site config", () => {
  it("exposes required branding fields", () => {
    expect(SITE_NAME.length).toBeGreaterThan(0);
    expect(SITE_FULL_NAME.length).toBeGreaterThan(0);
    expect(SITE_BIO.length).toBeGreaterThan(0);
  });
});
