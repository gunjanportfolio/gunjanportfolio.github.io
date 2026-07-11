import { useEffect, useRef } from "react";
import { useProgress } from "@react-three/drei";

/**
 * Reports when Canvas GLB assets have finished loading so Home can fade the overlay.
 */
export default function LoadingTracker({ onReady }) {
  const { active, progress } = useProgress();
  const hasSignaledRef = useRef(false);
  const onReadyRef = useRef(onReady);

  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  useEffect(() => {
    if (hasSignaledRef.current) {
      return;
    }

    if (!active && progress >= 100) {
      hasSignaledRef.current = true;
      if (onReadyRef.current) {
        onReadyRef.current();
      }
    }
  }, [active, progress]);

  return null;
}
