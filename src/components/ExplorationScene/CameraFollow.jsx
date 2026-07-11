import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";

import {
  CAMERA_FOLLOW_DAMPING,
  CAMERA_SETTLE_DAMPING,
  DEFAULT_CAMERA_LOOK_AT,
  DEFAULT_CAMERA_POSITION,
  computeCameraFollowTarget,
  dampVector3,
} from "../../utils/explorationFlight";

export default function CameraFollow({
  enabled = false,
  isSettling = false,
  planePoseRef,
  lookAtRef,
  onSettleComplete,
}) {
  const { camera } = useThree();
  const settleFramesRef = useRef(0);
  const onSettleCompleteRef = useRef(onSettleComplete);

  useEffect(() => {
    onSettleCompleteRef.current = onSettleComplete;
  }, [onSettleComplete]);

  useEffect(() => {
    if (isSettling) {
      settleFramesRef.current = 0;
    }
  }, [isSettling]);

  useFrame((_, delta) => {
    if (!enabled && !isSettling) {
      return;
    }

    if (enabled && planePoseRef?.current?.position) {
      const planePose = planePoseRef.current;
      const followTarget = computeCameraFollowTarget(
        planePose.position,
        planePose.headingY
      );
      const nextPosition = dampVector3(
        {
          x: camera.position.x,
          y: camera.position.y,
          z: camera.position.z,
        },
        followTarget,
        CAMERA_FOLLOW_DAMPING,
        delta
      );

      camera.position.set(nextPosition.x, nextPosition.y, nextPosition.z);

      const lookAtTarget = lookAtRef?.current;
      if (lookAtTarget) {
        camera.lookAt(lookAtTarget.x, lookAtTarget.y, lookAtTarget.z);
      }

      return;
    }

    if (!isSettling) {
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

    const distanceToDefault = Math.hypot(
      camera.position.x - DEFAULT_CAMERA_POSITION.x,
      camera.position.y - DEFAULT_CAMERA_POSITION.y,
      camera.position.z - DEFAULT_CAMERA_POSITION.z
    );

    settleFramesRef.current += 1;

    if (distanceToDefault < 0.05 || settleFramesRef.current > 180) {
      if (onSettleCompleteRef.current) {
        onSettleCompleteRef.current();
      }
    }
  });

  return null;
}
