import { a } from "@react-spring/three";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";

import IslandHitboxes from "../components/ExplorationScene/IslandHitboxes";
import islandScene from "../assets/3d/island.glb";
import {
  getShortestRotationDelta,
  getStageFromIslandRotation,
  getTargetRotationForArea,
  lerpIslandRotation,
} from "../utils/islandInteraction";

const ROTATION_DRAG_FACTOR = 0.02;
const KEYBOARD_ROTATION_STEP = 0.01 * Math.PI;
const KEYBOARD_ROTATION_SPEED = 0.012;
const CONTROL_ROTATION_STEP = 0.008 * Math.PI;
const DAMPING_FACTOR = 0.95;
const GOTO_ROTATION_LERP = 0.08;
const GOTO_ROTATION_EPSILON = 0.002;
const DRAG_THRESHOLD_PX = 8;

export const Island = forwardRef(function Island(
  {
    isRotating,
    setIsRotating,
    setCurrentStage,
    suppressStageUpdates = false,
    rotationEnabled = true,
    hitboxesEnabled = true,
    onManualInteraction,
    onEnterArea,
    blockCanvasDragRef,
    currentFocusPoint: _currentFocusPoint,
    ...props
  },
  ref
) {
  const islandRef = useRef();
  const { gl, viewport } = useThree();
  const { nodes, materials } = useGLTF(islandScene);

  const lastX = useRef(0);
  const pointerStartX = useRef(0);
  const pointerStartY = useRef(0);
  const isPointerDownRef = useRef(false);
  const hasDraggedRef = useRef(false);
  const rotationSpeed = useRef(0);
  const isRotatingRef = useRef(isRotating);
  const targetRotationRef = useRef(null);
  const suppressStageUpdatesRef = useRef(suppressStageUpdates);
  const rotationEnabledRef = useRef(rotationEnabled);
  const onManualInteractionRef = useRef(onManualInteraction);
  const localBlockDragRef = useRef(false);
  const canvasDragBlockRef = blockCanvasDragRef || localBlockDragRef;

  useEffect(() => {
    isRotatingRef.current = isRotating;
  }, [isRotating]);

  useEffect(() => {
    suppressStageUpdatesRef.current = suppressStageUpdates;
  }, [suppressStageUpdates]);

  useEffect(() => {
    rotationEnabledRef.current = rotationEnabled;
    if (!rotationEnabled) {
      isRotatingRef.current = false;
      setIsRotating(false);
      rotationSpeed.current = 0;
      targetRotationRef.current = null;
    }
  }, [rotationEnabled, setIsRotating]);

  useEffect(() => {
    onManualInteractionRef.current = onManualInteraction;
  }, [onManualInteraction]);

  const notifyManualInteraction = () => {
    if (onManualInteractionRef.current) {
      onManualInteractionRef.current();
    }
  };

  const clearGoToTarget = () => {
    targetRotationRef.current = null;
  };

  const applyManualRotation = (rotationDelta, speed) => {
    if (!islandRef.current || !rotationEnabledRef.current) {
      return;
    }

    clearGoToTarget();
    notifyManualInteraction();

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
    cancelGoToArea: () => {
      clearGoToTarget();
    },
    goToArea: (areaId) => {
      if (!islandRef.current) {
        return;
      }

      isRotatingRef.current = false;
      setIsRotating(false);
      rotationSpeed.current = 0;
      targetRotationRef.current = getTargetRotationForArea(areaId);
    },
    getWorldPosition: () => {
      if (!islandRef.current) {
        return null;
      }

      return {
        x: islandRef.current.position.x,
        y: islandRef.current.position.y,
        z: islandRef.current.position.z,
      };
    },
    getRotationY: () => {
      if (!islandRef.current) {
        return null;
      }

      return islandRef.current.rotation.y;
    },
  }));

  useEffect(() => {
    const canvas = gl.domElement;

    const beginDragRotation = (clientX) => {
      clearGoToTarget();
      notifyManualInteraction();
      isRotatingRef.current = true;
      setIsRotating(true);
      lastX.current = clientX;
    };

    const stopRotation = () => {
      isRotatingRef.current = false;
      setIsRotating(false);
      isPointerDownRef.current = false;
      hasDraggedRef.current = false;
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
      if (!rotationEnabledRef.current || canvasDragBlockRef.current) {
        return;
      }

      event.stopPropagation();
      event.preventDefault();
      isPointerDownRef.current = true;
      hasDraggedRef.current = false;
      pointerStartX.current = event.clientX;
      pointerStartY.current = event.clientY;
      lastX.current = event.clientX;
    };

    const handlePointerUp = (event) => {
      event.stopPropagation();
      event.preventDefault();
      stopRotation();
    };

    const handlePointerMove = (event) => {
      if (!isPointerDownRef.current || !rotationEnabledRef.current) {
        return;
      }

      event.stopPropagation();
      event.preventDefault();

      const distanceX = Math.abs(event.clientX - pointerStartX.current);
      const distanceY = Math.abs(event.clientY - pointerStartY.current);

      if (
        !hasDraggedRef.current &&
        (distanceX > DRAG_THRESHOLD_PX || distanceY > DRAG_THRESHOLD_PX)
      ) {
        hasDraggedRef.current = true;
        beginDragRotation(event.clientX);
      }

      if (hasDraggedRef.current) {
        rotateByDelta(event.clientX);
      }
    };

    const handlePointerLeave = () => {
      if (isPointerDownRef.current || isRotatingRef.current) {
        stopRotation();
      }
    };

    const handleTouchStart = (event) => {
      if (
        !rotationEnabledRef.current ||
        canvasDragBlockRef.current ||
        !event.touches[0]
      ) {
        return;
      }

      event.stopPropagation();
      event.preventDefault();
      isPointerDownRef.current = true;
      hasDraggedRef.current = false;
      pointerStartX.current = event.touches[0].clientX;
      pointerStartY.current = event.touches[0].clientY;
      lastX.current = event.touches[0].clientX;
    };

    const handleTouchEnd = (event) => {
      event.stopPropagation();
      event.preventDefault();
      stopRotation();
    };

    const handleTouchMove = (event) => {
      if (
        !isPointerDownRef.current ||
        !rotationEnabledRef.current ||
        !event.touches[0]
      ) {
        return;
      }

      event.stopPropagation();
      event.preventDefault();

      const touchX = event.touches[0].clientX;
      const touchY = event.touches[0].clientY;
      const distanceX = Math.abs(touchX - pointerStartX.current);
      const distanceY = Math.abs(touchY - pointerStartY.current);

      if (
        !hasDraggedRef.current &&
        (distanceX > DRAG_THRESHOLD_PX || distanceY > DRAG_THRESHOLD_PX)
      ) {
        hasDraggedRef.current = true;
        beginDragRotation(touchX);
      }

      if (hasDraggedRef.current) {
        rotateByDelta(touchX);
      }
    };

    const handleKeyDown = (event) => {
      if (!islandRef.current || !rotationEnabledRef.current) {
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
  }, [gl, setIsRotating, viewport.width, canvasDragBlockRef]);

  useFrame(() => {
    if (!islandRef.current) {
      return;
    }

    if (targetRotationRef.current !== null) {
      const nextRotation = lerpIslandRotation(
        islandRef.current.rotation.y,
        targetRotationRef.current,
        GOTO_ROTATION_LERP
      );
      islandRef.current.rotation.y = nextRotation;

      const remaining = Math.abs(
        getShortestRotationDelta(nextRotation, targetRotationRef.current)
      );

      if (remaining < GOTO_ROTATION_EPSILON) {
        islandRef.current.rotation.y = targetRotationRef.current;
        targetRotationRef.current = null;
      }
    } else if (!isRotatingRef.current) {
      rotationSpeed.current *= DAMPING_FACTOR;

      if (Math.abs(rotationSpeed.current) < 0.001) {
        rotationSpeed.current = 0;
      }

      islandRef.current.rotation.y += rotationSpeed.current;
    }

    if (!suppressStageUpdatesRef.current) {
      const nextStage = getStageFromIslandRotation(
        islandRef.current.rotation.y
      );
      setCurrentStage(nextStage);
    }
  });

  return (
    <a.group ref={islandRef} {...props}>
      <mesh
        raycast={() => null}
        geometry={nodes.polySurface944_tree_body_0.geometry}
        material={materials.PaletteMaterial001}
      />
      <mesh
        raycast={() => null}
        geometry={nodes.polySurface945_tree1_0.geometry}
        material={materials.PaletteMaterial001}
      />
      <mesh
        raycast={() => null}
        geometry={nodes.polySurface946_tree2_0.geometry}
        material={materials.PaletteMaterial001}
      />
      <mesh
        raycast={() => null}
        geometry={nodes.polySurface947_tree1_0.geometry}
        material={materials.PaletteMaterial001}
      />
      <mesh
        raycast={() => null}
        geometry={nodes.polySurface948_tree_body_0.geometry}
        material={materials.PaletteMaterial001}
      />
      <mesh
        raycast={() => null}
        geometry={nodes.polySurface949_tree_body_0.geometry}
        material={materials.PaletteMaterial001}
      />
      <mesh
        raycast={() => null}
        geometry={nodes.pCube11_rocks1_0.geometry}
        material={materials.PaletteMaterial001}
      />
      <IslandHitboxes
        enabled={hitboxesEnabled}
        onEnterArea={onEnterArea}
        blockCanvasDragRef={canvasDragBlockRef}
      />
    </a.group>
  );
});

useGLTF.preload(islandScene);
