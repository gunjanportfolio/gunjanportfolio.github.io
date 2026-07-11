import {
  EXPLORE_HINT_SEEN_VALUE,
  EXPLORE_HINT_STORAGE_KEY,
} from "../constants/exploreUi";

export function hasSeenExploreHint(storage = globalThis.localStorage) {
  if (!storage) {
    return false;
  }

  try {
    return storage.getItem(EXPLORE_HINT_STORAGE_KEY) === EXPLORE_HINT_SEEN_VALUE;
  } catch {
    return false;
  }
}

export function markExploreHintSeen(storage = globalThis.localStorage) {
  if (!storage) {
    return;
  }

  try {
    storage.setItem(EXPLORE_HINT_STORAGE_KEY, EXPLORE_HINT_SEEN_VALUE);
  } catch {
    // Private mode / blocked storage should not break exploration.
  }
}
