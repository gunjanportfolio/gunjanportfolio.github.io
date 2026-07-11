import { Canvas } from "@react-three/fiber";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";

import ExploreControls from "../components/ExploreControls";
import {
  CameraFollow,
  FlightDriver,
} from "../components/ExplorationScene";
import InteriorPanel from "../components/InteriorPanel";
import { Loader } from "../components";
import useExplorationFlight from "../hooks/useExplorationFlight";
import { Bird, Island, Plane, Sky } from "../models";
import { PORTFOLIO_AREA_IDS } from "../constants/portfolioAreas";
import {
  getBiplaneScreenAdjustments,
  getIslandScreenAdjustments,
} from "../utils";
import {
  RETURN_FLIGHT_ARC_HEIGHT,
  RETURN_FLIGHT_DURATION_SECONDS,
  getHeadingY,
  getWaypointForArea,
  localWaypointToWorld,
} from "../utils/explorationFlight";
import { getTargetRotationForArea } from "../utils/islandInteraction";

const RETURN_FLIGHT_AREA_ID = PORTFOLIO_AREA_IDS.HOME;

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
  const blockCanvasDragRef = useRef(false);
  const pendingInteriorAreaIdRef = useRef(null);
  const isReturningHomeRef = useRef(false);

  const [currentStage, setCurrentStage] = useState(1);
  const [isRotating, setIsRotating] = useState(false);
  const [creaturesControlled, setCreaturesControlled] = useState(false);
  const [isInside, setIsInside] = useState(false);
  const [isExitingInterior, setIsExitingInterior] = useState(false);
  const [interiorAreaId, setInteriorAreaId] = useState(null);
  const [isTravelingToInterior, setIsTravelingToInterior] = useState(false);

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

  const getWorldWaypoint = useCallback(
    (areaId) => {
      return localWaypointToWorld(
        getWaypointForArea(areaId),
        toPositionObject(island.position),
        getTargetRotationForArea(areaId),
        toScaleObject(island.scale)
      );
    },
    [island.position, island.scale]
  );

  const getPlaneStartPosition = useCallback(() => {
    return (
      planePoseRef.current?.position ||
      lastPlanePositionRef.current ||
      toPositionObject(biplane.position)
    );
  }, [biplane.position]);

  const seedFlightPoses = useCallback((fromPosition, destination) => {
    const startHeadingY = getHeadingY(fromPosition, destination);
    const startPose = {
      position: fromPosition,
      headingY: startHeadingY,
    };
    planePoseRef.current = startPose;
    birdPoseRef.current = startPose;
    lookAtRef.current = destination;
    lastPlanePositionRef.current = fromPosition;
  }, []);

  const handleRotateLeft = () => {
    if (isInside || isExitingInterior || isTravelingToInterior || isFlying) {
      return;
    }

    islandControlsRef.current?.rotateLeft();
  };

  const handleRotateRight = () => {
    if (isInside || isExitingInterior || isTravelingToInterior || isFlying) {
      return;
    }

    islandControlsRef.current?.rotateRight();
  };

  const handleStopRotate = () => {
    islandControlsRef.current?.stopRotating();
  };

  const handleManualInteraction = useCallback(() => {
    if (isTravelingToInterior || isInside || isExitingInterior) {
      return;
    }

    cancelFlight();
  }, [cancelFlight, isExitingInterior, isInside, isTravelingToInterior]);

  const handleStageChange = useCallback(
    (stage) => {
      if (
        isFlying ||
        isInside ||
        isExitingInterior ||
        isTravelingToInterior
      ) {
        return;
      }

      setCurrentStage(stage);
      markArrivedAtCurrentArea(stage);
    },
    [
      isExitingInterior,
      isFlying,
      isInside,
      isTravelingToInterior,
      markArrivedAtCurrentArea,
    ]
  );

  const handleSettleComplete = useCallback(() => {
    clearSettling();
    if (isReturningHomeRef.current) {
      isReturningHomeRef.current = false;
      setIsExitingInterior(false);
      setInteriorAreaId(null);
      setCreaturesControlled(false);
      planePoseRef.current = null;
      birdPoseRef.current = null;
      lastPlanePositionRef.current = null;
    }
  }, [clearSettling]);

  const handleFlightArrived = useCallback(
    (areaId, planePose, birdPose) => {
      if (planePose) {
        planePoseRef.current = planePose;
        lastPlanePositionRef.current = planePose.position;
      }

      if (birdPose) {
        birdPoseRef.current = birdPose;
      }

      setCreaturesControlled(true);

      if (
        pendingInteriorAreaIdRef.current !== null &&
        pendingInteriorAreaIdRef.current === areaId
      ) {
        pendingInteriorAreaIdRef.current = null;
        setIsTravelingToInterior(false);
        setInteriorAreaId(areaId);
        setCurrentStage(areaId);
        markArrivedAtCurrentArea(areaId);
        setIsInside(true);
        clearSettling();
        return;
      }

      if (isReturningHomeRef.current) {
        setCurrentStage(RETURN_FLIGHT_AREA_ID);
        markArrivedAtCurrentArea(RETURN_FLIGHT_AREA_ID);
      }
    },
    [clearSettling, markArrivedAtCurrentArea]
  );

  const enterInterior = useCallback(
    (areaId) => {
      cancelFlight({ settle: false });
      clearSettling();
      blockCanvasDragRef.current = false;
      isReturningHomeRef.current = false;
      setIsExitingInterior(false);
      setIsInside(false);
      setInteriorAreaId(null);

      const destination = getWorldWaypoint(areaId);
      const fromPosition = getPlaneStartPosition();
      const started = startFlight(areaId, fromPosition, destination, {
        allowSameArea: true,
        settleOnArrive: false,
      });

      if (!started) {
        return;
      }

      seedFlightPoses(fromPosition, destination);
      setCreaturesControlled(true);
      pendingInteriorAreaIdRef.current = areaId;
      setIsTravelingToInterior(true);
      setCurrentStage(areaId);
      islandControlsRef.current?.goToArea(areaId);
    },
    [
      cancelFlight,
      clearSettling,
      getPlaneStartPosition,
      getWorldWaypoint,
      seedFlightPoses,
      startFlight,
    ]
  );

  const handleEnterArea = useCallback(
    (areaId) => {
      if (isInside || isExitingInterior || isTravelingToInterior || isFlying) {
        return;
      }

      enterInterior(areaId);
    },
    [
      enterInterior,
      isExitingInterior,
      isFlying,
      isInside,
      isTravelingToInterior,
    ]
  );

  const handleBackToIsland = useCallback(() => {
    if (!isInside && !isTravelingToInterior) {
      return;
    }

    blockCanvasDragRef.current = false;
    pendingInteriorAreaIdRef.current = null;
    setIsInside(false);
    setIsTravelingToInterior(false);
    setIsExitingInterior(true);
    isReturningHomeRef.current = true;

    const homePad = toPositionObject(biplane.position);
    const fromPosition = getPlaneStartPosition();
    cancelFlight({ settle: false });
    clearSettling();

    const started = startFlight(
      RETURN_FLIGHT_AREA_ID,
      fromPosition,
      homePad,
      {
        allowSameArea: true,
        settleOnArrive: true,
        durationSeconds: RETURN_FLIGHT_DURATION_SECONDS,
        arcHeight: RETURN_FLIGHT_ARC_HEIGHT,
      }
    );

    if (started) {
      seedFlightPoses(fromPosition, homePad);
      setCreaturesControlled(true);
    } else {
      isReturningHomeRef.current = false;
      setIsExitingInterior(false);
      setInteriorAreaId(null);
      setCreaturesControlled(false);
    }

    setCurrentStage(RETURN_FLIGHT_AREA_ID);
    markArrivedAtCurrentArea(RETURN_FLIGHT_AREA_ID);
    islandControlsRef.current?.goToArea(RETURN_FLIGHT_AREA_ID);
  }, [
    biplane.position,
    cancelFlight,
    clearSettling,
    getPlaneStartPosition,
    isInside,
    isTravelingToInterior,
    markArrivedAtCurrentArea,
    seedFlightPoses,
    startFlight,
  ]);

  const outdoorControlsVisible =
    !isInside && !isExitingInterior && !isTravelingToInterior;
  const shouldFollowPlane =
    isFlying || isTravelingToInterior || (isInside && !isExitingInterior);

  return (
    <section className="w-full h-screen relative" data-testid="home-page">
      {interiorAreaId && (isInside || isExitingInterior) ? (
        <InteriorPanel
          areaId={interiorAreaId}
          onBack={handleBackToIsland}
          isFading={isExitingInterior}
        />
      ) : null}

      {isTravelingToInterior ? (
        <div className="pointer-events-none absolute top-24 left-0 right-0 z-20 flex justify-center px-4">
          <p
            className="rounded-lg bg-white/90 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm"
            data-testid="traveling-hint"
          >
            Flying to this island area…
          </p>
        </div>
      ) : null}

      <Canvas
        className={`w-full h-screen bg-transparent ${
          isInside || isExitingInterior || isTravelingToInterior
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
            enabled={shouldFollowPlane}
            isSettling={isSettling && isExitingInterior}
            planePoseRef={planePoseRef}
            lookAtRef={lookAtRef}
            onSettleComplete={handleSettleComplete}
          />

          <Bird isControlled={creaturesControlled} poseRef={birdPoseRef} />
          <Sky isRotating={isRotating || isFlying} />
          <Island
            ref={islandControlsRef}
            isRotating={isRotating}
            setIsRotating={setIsRotating}
            setCurrentStage={handleStageChange}
            suppressStageUpdates={
              isFlying ||
              isInside ||
              isExitingInterior ||
              isTravelingToInterior
            }
            rotationEnabled={
              !isInside &&
              !isExitingInterior &&
              !isTravelingToInterior &&
              !isFlying
            }
            hitboxesEnabled={
              !isInside &&
              !isExitingInterior &&
              !isTravelingToInterior &&
              !isFlying
            }
            onManualInteraction={handleManualInteraction}
            onEnterArea={handleEnterArea}
            blockCanvasDragRef={blockCanvasDragRef}
            position={island.position}
            rotation={[0.1, 4.7077, 0]}
            scale={island.scale}
          />
          <Plane
            isRotating={isRotating}
            isFlying={isFlying || isTravelingToInterior}
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
          onGoToArea={handleEnterArea}
        />
      ) : null}
    </section>
  );
};

export default Home;
