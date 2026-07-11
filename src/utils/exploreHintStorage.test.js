import { describe, expect, it, vi } from "vitest";

import {
  EXPLORE_HINT_SEEN_VALUE,
  EXPLORE_HINT_STORAGE_KEY,
} from "../constants/exploreUi";
import {
  hasSeenExploreHint,
  markExploreHintSeen,
} from "./exploreHintStorage";

describe("exploreHintStorage", () => {
  it("reports unseen when storage is empty", () => {
    const storage = {
      getItem: vi.fn(() => null),
      setItem: vi.fn(),
    };

    expect(hasSeenExploreHint(storage)).toBe(false);
  });

  it("marks and reads the explore hint as seen", () => {
    const values = new Map();
    const storage = {
      getItem: vi.fn((key) => values.get(key) ?? null),
      setItem: vi.fn((key, value) => {
        values.set(key, value);
      }),
    };

    markExploreHintSeen(storage);
    expect(storage.setItem).toHaveBeenCalledWith(
      EXPLORE_HINT_STORAGE_KEY,
      EXPLORE_HINT_SEEN_VALUE
    );
    expect(hasSeenExploreHint(storage)).toBe(true);
  });

  it("fails safely when storage throws", () => {
    const storage = {
      getItem: vi.fn(() => {
        throw new Error("blocked");
      }),
      setItem: vi.fn(() => {
        throw new Error("blocked");
      }),
    };

    expect(hasSeenExploreHint(storage)).toBe(false);
    expect(() => markExploreHintSeen(storage)).not.toThrow();
  });
});
