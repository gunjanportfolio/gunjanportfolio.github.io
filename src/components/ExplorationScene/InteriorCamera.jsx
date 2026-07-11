import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";

import {
  DEFAULT_CAMERA_LOOK_AT,
  DEFAULT_CAMERA_POSITION,
  INTERIOR_CAMERA_DAMPING,
  CAMERA_SETTLE_DAMPING,
  dampVector3,
} from "../../utils/explorationFlight";

export default function InteriorCamera({
  active = false,
  isExiting = false,
  targetPosition,
  targetLookAt,
  onExitComplete,
}) {
  const { camera } = useThree();
  const onExitCompleteRef = useRef(onExitComplete);
  const exitFramesRef = useRef(0);

  useEffect(() => {
    onExitCompleteRef.current = onExitComplete;
  }, [onExitComplete]);

  useEffect(() => {
    if (isExiting) {
      exitFramesRef.current = 0;
    }
  }, [isExiting]);

  useFrame((_, delta) => {
    if (active && targetPosition && targetLookAt) {
      const nextPosition = dampVector3(
        {
          x: camera.position.x,
          y: camera.position.y,
          z: camera.position.z,
        },
        targetPosition,
        INTERIOR_CAMERA_DAMPING,
        delta
      );
      camera.position.set(nextPosition.x, nextPosition.y, nextPosition.z);
      camera.lookAt(targetLookAt.x, targetLookAt.y, targetLookAt.z);
      return;
    }

    if (!isExiting) {
      return;
    }

    const nextPosition = dampVector3(
      {
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z,
      },
      DEFAULT_CAMERA_POSITION,
      CAMERA_SETTLE_DAMPING,
      delta
    );
    camera.position.set(nextPosition.x, nextPosition.y, nextPosition.z);
    camera.lookAt(
      DEFAULT_CAMERA_LOOK_AT.x,
      DEFAULT_CAMERA_LOOK_AT.y,
      DEFAULT_CAMERA_LOOK_AT.z
    );

    const distance = Math.hypot(
      camera.position.x - DEFAULT_CAMERA_POSITION.x,
      camera.position.y - DEFAULT_CAMERA_POSITION.y,
      camera.position.z - DEFAULT_CAMERA_POSITION.z
    );

    exitFramesRef.current += 1;

    if (distance < 0.08 || exitFramesRef.current > 180) {
      if (onExitCompleteRef.current) {
        onExitCompleteRef.current();
      }
    }
  });

  return null;
}
