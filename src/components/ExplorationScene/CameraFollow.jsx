import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";

import {
  CAMERA_FOLLOW_ABOVE,
  CAMERA_FOLLOW_BEHIND,
  CAMERA_FOLLOW_DAMPING,
  CAMERA_LOOK_AT_DAMPING,
  CAMERA_SETTLE_DAMPING,
  DEFAULT_CAMERA_LOOK_AT,
  DEFAULT_CAMERA_POSITION,
  computeCameraFollowTarget,
  copyVector3,
  dampVector3,
} from "../../utils/explorationFlight";

const SETTLE_COMPLETE_DISTANCE = 0.2;
const SETTLE_MAX_FRAMES = 160;

export default function CameraFollow({
  enabled = false,
  isSettling = false,
  followPoseRef,
  lookAtRef,
  behind = CAMERA_FOLLOW_BEHIND,
  above = CAMERA_FOLLOW_ABOVE,
  followDamping = CAMERA_FOLLOW_DAMPING,
  onSettleComplete,
}) {
  const { camera } = useThree();
  const settleFramesRef = useRef(0);
  const onSettleCompleteRef = useRef(onSettleComplete);
  const lookAtCurrentRef = useRef(copyVector3(DEFAULT_CAMERA_LOOK_AT));
  const hasCompletedSettleRef = useRef(false);

  useEffect(() => {
    onSettleCompleteRef.current = onSettleComplete;
  }, [onSettleComplete]);

  useEffect(() => {
    if (isSettling) {
      settleFramesRef.current = 0;
      hasCompletedSettleRef.current = false;
    }
  }, [isSettling]);

  useFrame((_, delta) => {
    if (!enabled && !isSettling) {
      return;
    }

    if (enabled && followPoseRef?.current?.position) {
      const followPose = followPoseRef.current;
      const followTarget = computeCameraFollowTarget(
        followPose.position,
        followPose.headingY,
        behind,
        above
      );
      const nextPosition = dampVector3(
        {
          x: camera.position.x,
          y: camera.position.y,
          z: camera.position.z,
        },
        followTarget,
        followDamping,
        delta
      );

      camera.position.set(nextPosition.x, nextPosition.y, nextPosition.z);

      const lookAtTarget = lookAtRef?.current || DEFAULT_CAMERA_LOOK_AT;
      lookAtCurrentRef.current = dampVector3(
        lookAtCurrentRef.current,
        lookAtTarget,
        CAMERA_LOOK_AT_DAMPING,
        delta
      );
      camera.lookAt(
        lookAtCurrentRef.current.x,
        lookAtCurrentRef.current.y,
        lookAtCurrentRef.current.z
      );

      return;
    }

    if (!isSettling || hasCompletedSettleRef.current) {
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

    lookAtCurrentRef.current = dampVector3(
      lookAtCurrentRef.current,
      DEFAULT_CAMERA_LOOK_AT,
      CAMERA_LOOK_AT_DAMPING,
      delta
    );
    camera.lookAt(
      lookAtCurrentRef.current.x,
      lookAtCurrentRef.current.y,
      lookAtCurrentRef.current.z
    );

    const distanceToDefault = Math.hypot(
      camera.position.x - DEFAULT_CAMERA_POSITION.x,
      camera.position.y - DEFAULT_CAMERA_POSITION.y,
      camera.position.z - DEFAULT_CAMERA_POSITION.z
    );

    settleFramesRef.current += 1;

    if (
      distanceToDefault < SETTLE_COMPLETE_DISTANCE ||
      settleFramesRef.current > SETTLE_MAX_FRAMES
    ) {
      hasCompletedSettleRef.current = true;
      camera.position.set(
        DEFAULT_CAMERA_POSITION.x,
        DEFAULT_CAMERA_POSITION.y,
        DEFAULT_CAMERA_POSITION.z
      );
      lookAtCurrentRef.current = copyVector3(DEFAULT_CAMERA_LOOK_AT);
      camera.lookAt(
        DEFAULT_CAMERA_LOOK_AT.x,
        DEFAULT_CAMERA_LOOK_AT.y,
        DEFAULT_CAMERA_LOOK_AT.z
      );

      if (onSettleCompleteRef.current) {
        onSettleCompleteRef.current();
      }
    }
  });

  return null;
}
