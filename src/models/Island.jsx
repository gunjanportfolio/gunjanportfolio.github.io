import { a } from "@react-spring/three";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";

import islandScene from "../assets/3d/island.glb";
import {
  getStageFromIslandRotation,
  getTargetRotationForArea,
} from "../utils/islandInteraction";

const ROTATION_DRAG_FACTOR = 0.02;
const KEYBOARD_ROTATION_STEP = 0.01 * Math.PI;
const KEYBOARD_ROTATION_SPEED = 0.012;
const CONTROL_ROTATION_STEP = 0.008 * Math.PI;
const DAMPING_FACTOR = 0.95;

export const Island = forwardRef(function Island(
  {
    isRotating,
    setIsRotating,
    setCurrentStage,
    currentFocusPoint: _currentFocusPoint,
    ...props
  },
  ref
) {
  const islandRef = useRef();
  const { gl, viewport } = useThree();
  const { nodes, materials } = useGLTF(islandScene);

  const lastX = useRef(0);
  const rotationSpeed = useRef(0);
  const isRotatingRef = useRef(isRotating);

  useEffect(() => {
    isRotatingRef.current = isRotating;
  }, [isRotating]);

  const applyManualRotation = (rotationDelta, speed) => {
    if (!islandRef.current) {
      return;
    }

    if (!isRotatingRef.current) {
      isRotatingRef.current = true;
      setIsRotating(true);
    }

    islandRef.current.rotation.y += rotationDelta;
    rotationSpeed.current = speed;
  };

  const applyManualRotationRef = useRef(applyManualRotation);
  applyManualRotationRef.current = applyManualRotation;

  useImperativeHandle(ref, () => ({
    rotateLeft: () => {
      applyManualRotationRef.current(
        CONTROL_ROTATION_STEP,
        KEYBOARD_ROTATION_SPEED
      );
    },
    rotateRight: () => {
      applyManualRotationRef.current(
        -CONTROL_ROTATION_STEP,
        -KEYBOARD_ROTATION_SPEED
      );
    },
    stopRotating: () => {
      isRotatingRef.current = false;
      setIsRotating(false);
    },
    goToArea: (areaId) => {
      if (!islandRef.current) {
        return;
      }

      isRotatingRef.current = false;
      setIsRotating(false);
      rotationSpeed.current = 0;
      islandRef.current.rotation.y = getTargetRotationForArea(areaId);
      setCurrentStage(areaId);
    },
  }));

  useEffect(() => {
    const canvas = gl.domElement;

    const startRotation = (clientX) => {
      isRotatingRef.current = true;
      setIsRotating(true);
      lastX.current = clientX;
    };

    const stopRotation = () => {
      isRotatingRef.current = false;
      setIsRotating(false);
    };

    const rotateByDelta = (clientX) => {
      if (!isRotatingRef.current || !islandRef.current) {
        return;
      }

      const delta = (clientX - lastX.current) / viewport.width;
      const rotationDelta = delta * ROTATION_DRAG_FACTOR * Math.PI;
      islandRef.current.rotation.y += rotationDelta;
      lastX.current = clientX;
      rotationSpeed.current = rotationDelta;
    };

    const handlePointerDown = (event) => {
      event.stopPropagation();
      event.preventDefault();
      startRotation(event.clientX);
    };

    const handlePointerUp = (event) => {
      event.stopPropagation();
      event.preventDefault();
      stopRotation();
    };

    const handlePointerMove = (event) => {
      event.stopPropagation();
      event.preventDefault();
      rotateByDelta(event.clientX);
    };

    const handlePointerLeave = () => {
      if (isRotatingRef.current) {
        stopRotation();
      }
    };

    const handleTouchStart = (event) => {
      event.stopPropagation();
      event.preventDefault();
      startRotation(event.touches[0].clientX);
    };

    const handleTouchEnd = (event) => {
      event.stopPropagation();
      event.preventDefault();
      stopRotation();
    };

    const handleTouchMove = (event) => {
      event.stopPropagation();
      event.preventDefault();
      if (!event.touches[0]) {
        return;
      }
      rotateByDelta(event.touches[0].clientX);
    };

    const handleKeyDown = (event) => {
      if (!islandRef.current) {
        return;
      }

      if (event.key === "ArrowLeft" || event.key === "a" || event.key === "A") {
        event.preventDefault();
        applyManualRotationRef.current(
          KEYBOARD_ROTATION_STEP,
          KEYBOARD_ROTATION_SPEED
        );
        return;
      }

      if (
        event.key === "ArrowRight" ||
        event.key === "d" ||
        event.key === "D"
      ) {
        event.preventDefault();
        applyManualRotationRef.current(
          -KEYBOARD_ROTATION_STEP,
          -KEYBOARD_ROTATION_SPEED
        );
      }
    };

    const handleKeyUp = (event) => {
      if (
        event.key === "ArrowLeft" ||
        event.key === "ArrowRight" ||
        event.key === "a" ||
        event.key === "A" ||
        event.key === "d" ||
        event.key === "D"
      ) {
        stopRotation();
      }
    };

    canvas.style.touchAction = "none";
    canvas.addEventListener("pointerdown", handlePointerDown);
    canvas.addEventListener("pointerup", handlePointerUp);
    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerleave", handlePointerLeave);
    canvas.addEventListener("pointercancel", handlePointerLeave);
    canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
    canvas.addEventListener("touchend", handleTouchEnd, { passive: false });
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("pointerup", handlePointerUp);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerleave", handlePointerLeave);
      canvas.removeEventListener("pointercancel", handlePointerLeave);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchend", handleTouchEnd);
      canvas.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [gl, setIsRotating, viewport.width]);

  useFrame(() => {
    if (!islandRef.current) {
      return;
    }

    if (!isRotatingRef.current) {
      rotationSpeed.current *= DAMPING_FACTOR;

      if (Math.abs(rotationSpeed.current) < 0.001) {
        rotationSpeed.current = 0;
      }

      islandRef.current.rotation.y += rotationSpeed.current;
    }

    const nextStage = getStageFromIslandRotation(islandRef.current.rotation.y);
    setCurrentStage(nextStage);
  });

  return (
    <a.group ref={islandRef} {...props}>
      <mesh
        geometry={nodes.polySurface944_tree_body_0.geometry}
        material={materials.PaletteMaterial001}
      />
      <mesh
        geometry={nodes.polySurface945_tree1_0.geometry}
        material={materials.PaletteMaterial001}
      />
      <mesh
        geometry={nodes.polySurface946_tree2_0.geometry}
        material={materials.PaletteMaterial001}
      />
      <mesh
        geometry={nodes.polySurface947_tree1_0.geometry}
        material={materials.PaletteMaterial001}
      />
      <mesh
        geometry={nodes.polySurface948_tree_body_0.geometry}
        material={materials.PaletteMaterial001}
      />
      <mesh
        geometry={nodes.polySurface949_tree_body_0.geometry}
        material={materials.PaletteMaterial001}
      />
      <mesh
        geometry={nodes.pCube11_rocks1_0.geometry}
        material={materials.PaletteMaterial001}
      />
    </a.group>
  );
});
