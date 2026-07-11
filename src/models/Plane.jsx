import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";

import planeScene from "../assets/3d/plane.glb";

export function Plane({
  isRotating,
  isFlying = false,
  isControlled = false,
  poseRef,
  ...props
}) {
  const ref = useRef();
  const { scene, animations } = useGLTF(planeScene);
  const { actions } = useAnimations(animations, ref);

  useEffect(() => {
    if (isRotating || isFlying) {
      actions["Take 001"].play();
    } else {
      actions["Take 001"].stop();
    }
  }, [actions, isRotating, isFlying]);

  useFrame(() => {
    if (!ref.current || !isControlled || !poseRef?.current?.position) {
      return;
    }

    const { position, headingY } = poseRef.current;
    ref.current.position.x = position.x;
    ref.current.position.y = position.y;
    ref.current.position.z = position.z;
    ref.current.rotation.y = headingY;
  });

  return (
    <mesh {...props} ref={ref} data-testid="exploration-plane">
      <primitive object={scene} />
    </mesh>
  );
}

useGLTF.preload(planeScene);
