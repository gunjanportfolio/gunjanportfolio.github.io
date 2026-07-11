import { describe, expect, it } from "vitest";

import {
  EXPLORE_HINT_MESSAGE,
  EXPLORE_HINT_TITLE,
  LOADING_ISLAND_MESSAGE,
} from "./exploreUi";

describe("exploreUi", () => {
  it("defines clear loading and explore copy", () => {
    expect(LOADING_ISLAND_MESSAGE).toMatch(/Loading Gunjan's island/i);
    expect(EXPLORE_HINT_TITLE).toMatch(/explore/i);
    expect(EXPLORE_HINT_MESSAGE).toMatch(/About, Projects, or Contact/i);
  });
});
