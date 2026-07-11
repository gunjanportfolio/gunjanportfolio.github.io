import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useAnimations, useGLTF } from "@react-three/drei";

import birdScene from "../assets/3d/bird.glb";

const AMBIENT_START_POSITION = [-5, 2, 1];
const BIRD_SCALE = [0.003, 0.003, 0.003];

export function Bird({ isControlled = false, poseRef }) {
  const birdRef = useRef();
  const { scene, animations } = useGLTF(birdScene);
  const { actions } = useAnimations(animations, birdRef);

  useEffect(() => {
    actions["Take 001"].play();
  }, [actions]);

  useFrame(({ clock, camera }) => {
    if (!birdRef.current) {
      return;
    }

    if (isControlled && poseRef?.current?.position) {
      const { position, headingY } = poseRef.current;
      birdRef.current.position.x = position.x;
      birdRef.current.position.y =
        position.y + Math.sin(clock.elapsedTime * 2) * 0.15;
      birdRef.current.position.z = position.z;
      birdRef.current.rotation.y = headingY;
      return;
    }

    birdRef.current.position.y = Math.sin(clock.elapsedTime) * 0.2 + 2;

    if (birdRef.current.position.x > camera.position.x + 10) {
      birdRef.current.rotation.y = Math.PI;
    } else if (birdRef.current.position.x < camera.position.x - 10) {
      birdRef.current.rotation.y = 0;
    }

    if (birdRef.current.rotation.y === 0) {
      birdRef.current.position.x += 0.01;
      birdRef.current.position.z -= 0.01;
    } else {
      birdRef.current.position.x -= 0.01;
      birdRef.current.position.z += 0.01;
    }
  });

  return (
    <mesh
      ref={birdRef}
      position={AMBIENT_START_POSITION}
      scale={BIRD_SCALE}
      data-testid="exploration-bird"
    >
      <primitive object={scene} />
    </mesh>
  );
}

useGLTF.preload(birdScene);
