import { Canvas } from "@react-three/fiber";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";

import ExploreControls from "../components/ExploreControls";
import {
  CameraFollow,
  FlightDriver,
  InteriorCamera,
} from "../components/ExplorationScene";
import InteriorPanel from "../components/InteriorPanel";
import { Loader } from "../components";
import useExplorationFlight from "../hooks/useExplorationFlight";
import { Bird, Island, Plane, Sky } from "../models";
import { getPortfolioAreaById } from "../constants/portfolioAreas";
import {
  getBiplaneScreenAdjustments,
  getIslandScreenAdjustments,
} from "../utils";
import {
  computeInteriorCameraTarget,
  getHeadingY,
  getWaypointForArea,
  localWaypointToWorld,
} from "../utils/explorationFlight";
import { getTargetRotationForArea } from "../utils/islandInteraction";

function toPositionObject(positionArray) {
  return {
    x: positionArray[0],
    y: positionArray[1],
    z: positionArray[2],
  };
}

function toScaleObject(scaleArray) {
  return {
    x: scaleArray[0],
    y: scaleArray[1],
    z: scaleArray[2],
  };
}

const Home = () => {
  const islandControlsRef = useRef(null);
  const planePoseRef = useRef(null);
  const birdPoseRef = useRef(null);
  const lookAtRef = useRef(null);
  const lastPlanePositionRef = useRef(null);

  const [currentStage, setCurrentStage] = useState(1);
  const [isRotating, setIsRotating] = useState(false);
  const [creaturesControlled, setCreaturesControlled] = useState(false);
  const [isInside, setIsInside] = useState(false);
  const [isExitingInterior, setIsExitingInterior] = useState(false);
  const [interiorAreaId, setInteriorAreaId] = useState(null);

  const {
    isFlying,
    isSettling,
    startFlight,
    cancelFlight,
    clearSettling,
    markArrivedAtCurrentArea,
    tick,
  } = useExplorationFlight();

  useEffect(() => {
    markArrivedAtCurrentArea(1);
  }, [markArrivedAtCurrentArea]);

  const biplane = getBiplaneScreenAdjustments(window.innerWidth);
  const island = getIslandScreenAdjustments(window.innerWidth);
  const islandPosition = toPositionObject(island.position);
  const islandScale = toScaleObject(island.scale);

  const interiorCameraTarget = useMemo(() => {
    if (!interiorAreaId) {
      return null;
    }

    const area = getPortfolioAreaById(interiorAreaId);
    const lookAt = localWaypointToWorld(
      getWaypointForArea(interiorAreaId),
      islandPosition,
      getTargetRotationForArea(interiorAreaId),
      islandScale
    );

    return computeInteriorCameraTarget(
      lookAt,
      undefined,
      area.interiorApproach
    );
  }, [interiorAreaId, islandPosition, islandScale]);

  const handleRotateLeft = () => {
    if (isInside || isExitingInterior) {
      return;
    }

    islandControlsRef.current?.rotateLeft();
  };

  const handleRotateRight = () => {
    if (isInside || isExitingInterior) {
      return;
    }

    islandControlsRef.current?.rotateRight();
  };

  const handleStopRotate = () => {
    islandControlsRef.current?.stopRotating();
  };

  const handleManualInteraction = useCallback(() => {
    cancelFlight();
  }, [cancelFlight]);

  const handleStageChange = useCallback(
    (stage) => {
      if (isFlying || isInside) {
        return;
      }

      setCurrentStage(stage);
      markArrivedAtCurrentArea(stage);
    },
    [isFlying, isInside, markArrivedAtCurrentArea]
  );

  const handleFlightArrived = useCallback(
    (areaId, planePose, birdPose) => {
      if (planePose) {
        planePoseRef.current = planePose;
        lastPlanePositionRef.current = planePose.position;
      }

      if (birdPose) {
        birdPoseRef.current = birdPose;
      }

      setCurrentStage(areaId);
      markArrivedAtCurrentArea(areaId);
      setCreaturesControlled(true);
    },
    [markArrivedAtCurrentArea]
  );

  const handleSettleComplete = useCallback(() => {
    clearSettling();
  }, [clearSettling]);

  const enterInterior = useCallback(
    (areaId) => {
      cancelFlight();
      clearSettling();
      setIsExitingInterior(false);
      setInteriorAreaId(areaId);
      setCurrentStage(areaId);
      markArrivedAtCurrentArea(areaId);
      setIsInside(true);
      islandControlsRef.current?.goToArea(areaId);
    },
    [cancelFlight, clearSettling, markArrivedAtCurrentArea]
  );

  const handleEnterArea = useCallback(
    (areaId) => {
      if (isInside || isExitingInterior || isFlying) {
        return;
      }

      enterInterior(areaId);
    },
    [enterInterior, isExitingInterior, isFlying, isInside]
  );

  const handleBackToIsland = useCallback(() => {
    if (!isInside) {
      return;
    }

    setIsInside(false);
    setIsExitingInterior(true);
  }, [isInside]);

  const handleInteriorExitComplete = useCallback(() => {
    setIsExitingInterior(false);
    setInteriorAreaId(null);
  }, []);

  const handleGoToArea = (areaId) => {
    if (isInside || isExitingInterior) {
      return;
    }

    const destination = localWaypointToWorld(
      getWaypointForArea(areaId),
      islandPosition,
      getTargetRotationForArea(areaId),
      islandScale
    );

    const fromPosition =
      planePoseRef.current?.position ||
      lastPlanePositionRef.current ||
      toPositionObject(biplane.position);

    const started = startFlight(areaId, fromPosition, destination);

    if (!started) {
      return;
    }

    const startHeadingY = getHeadingY(fromPosition, destination);
    const startPose = {
      position: fromPosition,
      headingY: startHeadingY,
    };
    planePoseRef.current = startPose;
    birdPoseRef.current = startPose;
    lookAtRef.current = destination;
    lastPlanePositionRef.current = fromPosition;

    setCreaturesControlled(true);
    islandControlsRef.current?.goToArea(areaId);
  };

  const outdoorControlsVisible = !isInside && !isExitingInterior;

  return (
    <section className="w-full h-screen relative" data-testid="home-page">
      {isInside && interiorAreaId ? (
        <InteriorPanel areaId={interiorAreaId} onBack={handleBackToIsland} />
      ) : null}

      <Canvas
        className={`w-full h-screen bg-transparent ${
          isInside || isExitingInterior
            ? "cursor-default"
            : isRotating
              ? "cursor-grabbing"
              : "cursor-grab"
        }`}
        camera={{ near: 0.1, far: 1000 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        style={{ touchAction: "none" }}
      >
        <Suspense fallback={<Loader />}>
          <directionalLight position={[1, 1, 1]} intensity={2} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 5, 10]} intensity={2} />
          <spotLight
            position={[0, 50, 10]}
            angle={0.15}
            penumbra={1}
            intensity={2}
          />
          <hemisphereLight
            skyColor="#b1e1ff"
            groundColor="#000000"
            intensity={1}
          />

          <FlightDriver
            tick={tick}
            planePoseRef={planePoseRef}
            birdPoseRef={birdPoseRef}
            lookAtRef={lookAtRef}
            onArrived={handleFlightArrived}
          />
          <CameraFollow
            enabled={isFlying && !isInside}
            isSettling={isSettling && !isInside && !isExitingInterior}
            planePoseRef={planePoseRef}
            lookAtRef={lookAtRef}
            onSettleComplete={handleSettleComplete}
          />
          <InteriorCamera
            active={isInside && Boolean(interiorCameraTarget)}
            isExiting={isExitingInterior}
            targetPosition={interiorCameraTarget?.position}
            targetLookAt={interiorCameraTarget?.lookAt}
            onExitComplete={handleInteriorExitComplete}
          />

          <Bird isControlled={creaturesControlled} poseRef={birdPoseRef} />
          <Sky isRotating={isRotating || isFlying} />
          <Island
            ref={islandControlsRef}
            isRotating={isRotating}
            setIsRotating={setIsRotating}
            setCurrentStage={handleStageChange}
            suppressStageUpdates={isFlying || isInside}
            rotationEnabled={!isInside && !isExitingInterior}
            hitboxesEnabled={!isInside && !isExitingInterior && !isFlying}
            onManualInteraction={handleManualInteraction}
            onEnterArea={handleEnterArea}
            position={island.position}
            rotation={[0.1, 4.7077, 0]}
            scale={island.scale}
          />
          <Plane
            isRotating={isRotating}
            isFlying={isFlying}
            isControlled={creaturesControlled}
            poseRef={planePoseRef}
            position={biplane.position}
            rotation={[0, 20.1, 0]}
            scale={biplane.scale}
          />
        </Suspense>
      </Canvas>

      {outdoorControlsVisible ? (
        <ExploreControls
          currentStage={currentStage}
          onRotateLeft={handleRotateLeft}
          onRotateRight={handleRotateRight}
          onStopRotate={handleStopRotate}
          onGoToArea={handleGoToArea}
        />
      ) : null}
    </section>
  );
};

export default Home;
