import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";

/**
 * Advances exploration flight each frame and writes poses into shared refs.
 */
export default function FlightDriver({
  tick,
  planePoseRef,
  birdPoseRef,
  lookAtRef,
  onArrived,
}) {
  const onArrivedRef = useRef(onArrived);
  const tickRef = useRef(tick);

  useEffect(() => {
    onArrivedRef.current = onArrived;
  }, [onArrived]);

  useEffect(() => {
    tickRef.current = tick;
  }, [tick]);

  useFrame((_, delta) => {
    const result = tickRef.current(delta);

    if (result.plane) {
      planePoseRef.current = result.plane;
    }

    if (result.bird) {
      birdPoseRef.current = result.bird;
    }

    if (result.lookAt) {
      lookAtRef.current = result.lookAt;
    }

    if (result.arrived && onArrivedRef.current) {
      onArrivedRef.current(result.targetAreaId, result.plane, result.bird);
    }
  });

  return null;
}
