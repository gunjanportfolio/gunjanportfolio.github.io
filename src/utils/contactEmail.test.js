import { describe, expect, it } from "vitest";

import {
  buildContactEmailPayload,
  getBiplaneScreenAdjustments,
  getIslandScreenAdjustments,
} from "../utils/contactEmail";

describe("buildContactEmailPayload", () => {
  it("builds a valid payload from form data", () => {
    const payload = buildContactEmailPayload(
      { name: "  Ada  ", email: " ada@example.com ", message: " Hello " },
      { toName: "Gunjan", toEmail: "hello@example.com" }
    );

    expect(payload).toEqual({
      from_name: "Ada",
      to_name: "Gunjan",
      from_email: "ada@example.com",
      to_email: "hello@example.com",
      message: "Hello",
    });
  });

  it("throws when form is missing", () => {
    expect(() =>
      buildContactEmailPayload(null, {
        toName: "Gunjan",
        toEmail: "hello@example.com",
      })
    ).toThrow("Contact form data is required");
  });

  it("throws when name is empty", () => {
    expect(() =>
      buildContactEmailPayload(
        { name: "   ", email: "a@b.com", message: "hi" },
        { toName: "Gunjan", toEmail: "hello@example.com" }
      )
    ).toThrow("Name is required");
  });

  it("throws when email is empty", () => {
    expect(() =>
      buildContactEmailPayload(
        { name: "Ada", email: "", message: "hi" },
        { toName: "Gunjan", toEmail: "hello@example.com" }
      )
    ).toThrow("Email is required");
  });

  it("throws when recipient config is incomplete", () => {
    expect(() =>
      buildContactEmailPayload(
        { name: "Ada", email: "a@b.com", message: "hi" },
        { toName: "", toEmail: "hello@example.com" }
      )
    ).toThrow("Recipient configuration is required");
  });
});

describe("getIslandScreenAdjustments", () => {
  it("returns mobile adjustments under 768px", () => {
    expect(getIslandScreenAdjustments(500)).toEqual({
      scale: [0.9, 0.9, 0.9],
      position: [0, -6.5, -43.4],
    });
  });

  it("returns desktop adjustments at 768px and above", () => {
    expect(getIslandScreenAdjustments(1024)).toEqual({
      scale: [1, 1, 1],
      position: [0, -6.5, -43.4],
    });
  });
});

describe("getBiplaneScreenAdjustments", () => {
  it("returns mobile adjustments under 768px", () => {
    expect(getBiplaneScreenAdjustments(375)).toEqual({
      scale: [1.5, 1.5, 1.5],
      position: [0, -1.5, 0],
    });
  });

  it("returns desktop adjustments at 768px and above", () => {
    expect(getBiplaneScreenAdjustments(1440)).toEqual({
      scale: [3, 3, 3],
      position: [0, -4, -4],
    });
  });
});
