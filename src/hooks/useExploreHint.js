import { useCallback, useState } from "react";

import {
  hasSeenExploreHint,
  markExploreHintSeen,
} from "../utils/exploreHintStorage";

export default function useExploreHint() {
  const [showExploreHint, setShowExploreHint] = useState(() => {
    return !hasSeenExploreHint();
  });

  const dismissExploreHint = useCallback(() => {
    markExploreHintSeen();
    setShowExploreHint(false);
  }, []);

  return {
    showExploreHint,
    dismissExploreHint,
  };
}
