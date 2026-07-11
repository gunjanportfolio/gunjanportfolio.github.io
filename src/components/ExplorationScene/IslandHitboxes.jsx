import { useCallback, useEffect, useRef } from "react";

import { PORTFOLIO_AREAS } from "../../constants/portfolioAreas";

const CURSOR_POINTER = "pointer";
const CURSOR_GRAB = "grab";

/**
 * Clickable zones over island buildings/areas.
 * Uses onPointerDown (not onClick) so canvas drag handlers cannot swallow the interaction.
 */
export default function IslandHitboxes({
  enabled = true,
  onEnterArea,
  blockCanvasDragRef,
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
      if (blockCanvasDragRef) {
        blockCanvasDragRef.current = false;
      }
    };
  }, [blockCanvasDragRef]);

  const handlePointerDown = useCallback(
    (areaId) => {
      return (event) => {
        event.stopPropagation();
        if (blockCanvasDragRef) {
          blockCanvasDragRef.current = true;
        }

        if (!enabledRef.current || !onEnterAreaRef.current) {
          return;
        }

        onEnterAreaRef.current(areaId);
      };
    },
    [blockCanvasDragRef]
  );

  const handlePointerOver = useCallback((event) => {
    event.stopPropagation();
    document.body.style.cursor = CURSOR_POINTER;
  }, []);

  const handlePointerOut = useCallback(() => {
    document.body.style.cursor = enabledRef.current ? CURSOR_GRAB : "default";
    if (blockCanvasDragRef) {
      blockCanvasDragRef.current = false;
    }
  }, [blockCanvasDragRef]);

  if (!enabled) {
    return null;
  }

  return (
    <group>
      {PORTFOLIO_AREAS.map((area) => {
        const onPointerDown = handlePointerDown(area.id);

        return (
          <mesh
            key={area.key}
            position={[area.waypoint.x, area.waypoint.y * 0.35, area.waypoint.z]}
            onPointerDown={onPointerDown}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
          >
            <boxGeometry args={area.hitboxSize || [12, 10, 12]} />
            <meshBasicMaterial
              transparent
              opacity={0.001}
              depthWrite={false}
            />
          </mesh>
        );
      })}
    </group>
  );
}
