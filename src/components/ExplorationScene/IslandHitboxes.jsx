import { useCallback, useEffect, useRef } from "react";

import { PORTFOLIO_AREAS } from "../../constants/portfolioAreas";

const CURSOR_POINTER = "pointer";
const CURSOR_GRAB = "grab";

function createEnterHandler(areaId, onEnterArea) {
  return (event) => {
    event.stopPropagation();
    onEnterArea(areaId);
  };
}

function createHoverEnterHandler() {
  return (event) => {
    event.stopPropagation();
    document.body.style.cursor = CURSOR_POINTER;
  };
}

function createHoverLeaveHandler(isInteractionEnabled) {
  return () => {
    document.body.style.cursor = isInteractionEnabled
      ? CURSOR_GRAB
      : "default";
  };
}

/**
 * Invisible clickable zones over island buildings/areas.
 * Must be rendered as children of the island group so they rotate with it.
 * Do not put data-testid on these meshes (breaks R3F prop parsing).
 */
export default function IslandHitboxes({
  enabled = true,
  onEnterArea,
}) {
  const enabledRef = useRef(enabled);
  const onEnterAreaRef = useRef(onEnterArea);

  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);

  useEffect(() => {
    onEnterAreaRef.current = onEnterArea;
  }, [onEnterArea]);

  useEffect(() => {
    return () => {
      document.body.style.cursor = "default";
    };
  }, []);

  const handleEnter = useCallback((areaId) => {
    if (!enabledRef.current || !onEnterAreaRef.current) {
      return;
    }

    onEnterAreaRef.current(areaId);
  }, []);

  if (!enabled) {
    return null;
  }

  return (
    <group>
      {PORTFOLIO_AREAS.map((area) => {
        const handleClick = createEnterHandler(area.id, handleEnter);
        const handlePointerOver = createHoverEnterHandler();
        const handlePointerOut = createHoverLeaveHandler(enabled);

        return (
          <mesh
            key={area.key}
            position={[area.waypoint.x, area.waypoint.y, area.waypoint.z]}
            onClick={handleClick}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
          >
            <boxGeometry args={area.hitboxSize || [7, 6, 7]} />
            <meshBasicMaterial
              transparent
              opacity={0}
              depthWrite={false}
            />
          </mesh>
        );
      })}
    </group>
  );
}
