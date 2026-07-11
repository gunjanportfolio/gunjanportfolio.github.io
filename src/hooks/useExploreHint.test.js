import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import {
  EXPLORE_HINT_SEEN_VALUE,
  EXPLORE_HINT_STORAGE_KEY,
} from "../constants/exploreUi";
import useExploreHint from "./useExploreHint";

function createMemoryStorage() {
  const values = new Map();

  return {
    getItem(key) {
      return values.has(key) ? values.get(key) : null;
    },
    setItem(key, value) {
      values.set(key, String(value));
    },
    removeItem(key) {
      values.delete(key);
    },
  };
}

describe("useExploreHint", () => {
  beforeEach(() => {
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      value: createMemoryStorage(),
    });
  });

  it("shows the hint for a first-time visitor", () => {
    const { result } = renderHook(() => useExploreHint());
    expect(result.current.showExploreHint).toBe(true);
  });

  it("hides the hint after dismiss and persists it", () => {
    const { result } = renderHook(() => useExploreHint());

    act(() => {
      result.current.dismissExploreHint();
    });

    expect(result.current.showExploreHint).toBe(false);
    expect(window.localStorage.getItem(EXPLORE_HINT_STORAGE_KEY)).toBe(
      EXPLORE_HINT_SEEN_VALUE
    );
  });

  it("stays dismissed when the hint was already seen", () => {
    window.localStorage.setItem(
      EXPLORE_HINT_STORAGE_KEY,
      EXPLORE_HINT_SEEN_VALUE
    );

    const { result } = renderHook(() => useExploreHint());
    expect(result.current.showExploreHint).toBe(false);
  });
});
