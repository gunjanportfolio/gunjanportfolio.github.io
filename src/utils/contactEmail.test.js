import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

import {
  buildFormcarryPayload,
  getBiplaneScreenAdjustments,
  getIslandScreenAdjustments,
  submitContactForm,
} from "./contactEmail";

describe("buildFormcarryPayload", () => {
  it("builds a valid payload from form data", () => {
    const payload = buildFormcarryPayload({
      name: "  Ada  ",
      email: " ada@example.com ",
      message: " Hello ",
    });

    expect(payload).toEqual({
      name: "Ada",
      email: "ada@example.com",
      message: "Hello",
    });
  });

  it("throws when form is missing", () => {
    expect(() => buildFormcarryPayload(null)).toThrow(
      "Contact form data is required"
    );
  });

  it("throws when name is empty", () => {
    expect(() =>
      buildFormcarryPayload({
        name: "   ",
        email: "a@b.com",
        message: "hi",
      })
    ).toThrow("Name is required");
  });

  it("throws when email is empty", () => {
    expect(() =>
      buildFormcarryPayload({
        name: "Ada",
        email: "",
        message: "hi",
      })
    ).toThrow("Email is required");
  });

  it("throws when message is empty", () => {
    expect(() =>
      buildFormcarryPayload({
        name: "Ada",
        email: "a@b.com",
        message: "  ",
      })
    ).toThrow("Message is required");
  });
});

describe("submitContactForm", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ code: 200 }),
        })
      )
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("posts JSON payload to Formcarry", async () => {
    await submitContactForm(
      { name: "Ada", email: "ada@example.com", message: "Hello" },
      "https://formcarry.com/s/test"
    );

    expect(fetch).toHaveBeenCalledWith("https://formcarry.com/s/test", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Ada",
        email: "ada@example.com",
        message: "Hello",
      }),
    });
  });

  it("throws when the endpoint responds with an error", async () => {
    fetch.mockResolvedValueOnce({ ok: false });

    await expect(
      submitContactForm(
        { name: "Ada", email: "ada@example.com", message: "Hello" },
        "https://formcarry.com/s/test"
      )
    ).rejects.toThrow("Failed to send message");
  });

  it("throws when endpoint is missing", async () => {
    await expect(
      submitContactForm(
        { name: "Ada", email: "ada@example.com", message: "Hello" },
        ""
      )
    ).rejects.toThrow("Form endpoint is not configured");
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
