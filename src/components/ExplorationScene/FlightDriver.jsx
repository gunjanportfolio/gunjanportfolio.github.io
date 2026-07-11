import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";

/**
 * Advances exploration flight and drives the phoenix (bird) traveler only.
 * The biplane stays parked and is not updated here.
 */
export default function FlightDriver({
  tick,
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
      birdPoseRef.current = result.plane;
      // Keep the camera looking at the dragon so the return flight feels continuous.
      lookAtRef.current = {
        x: result.plane.position.x,
        y: result.plane.position.y + 0.4,
        z: result.plane.position.z,
      };
    } else if (result.lookAt) {
      lookAtRef.current = result.lookAt;
    }

    if (result.arrived && onArrivedRef.current) {
      onArrivedRef.current(result.targetAreaId, result.plane);
    }
  });

  return null;
}
