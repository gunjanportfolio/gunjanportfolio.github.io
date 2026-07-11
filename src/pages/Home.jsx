import { Canvas } from "@react-three/fiber";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";

import ExploreControls from "../components/ExploreControls";
import {
  CameraFollow,
  FlightDriver,
  InteriorCamera,
} from "../components/ExplorationScene";
import InteriorPanel from "../components/InteriorPanel";
import { Loader } from "../components";
import useExplorationFlight from "../hooks/useExplorationFlight";
import { Bird, BIRD_AMBIENT_START, Island, Plane, Sky } from "../models";
import { PORTFOLIO_AREA_IDS } from "../constants/portfolioAreas";
import {
  getBiplaneScreenAdjustments,
  getIslandScreenAdjustments,
} from "../utils";
import {
  RETURN_FLIGHT_ARC_HEIGHT,
  RETURN_FLIGHT_DURATION_SECONDS,
  computeInteriorBirdViewingScene,
  copyVector3,
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
  const birdPoseRef = useRef(null);
  const lookAtRef = useRef(null);
  const lastBirdPositionRef = useRef(null);
  const blockCanvasDragRef = useRef(false);
  const pendingInteriorAreaIdRef = useRef(null);
  const isReturningHomeRef = useRef(false);

  const [currentStage, setCurrentStage] = useState(1);
  const [isRotating, setIsRotating] = useState(false);
  const [birdControlled, setBirdControlled] = useState(false);
  const [isInside, setIsInside] = useState(false);
  const [isExitingInterior, setIsExitingInterior] = useState(false);
  const [interiorAreaId, setInteriorAreaId] = useState(null);
  const [isTravelingToInterior, setIsTravelingToInterior] = useState(false);
  const [interiorView, setInteriorView] = useState(null);

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

  const getBirdStartPosition = useCallback(() => {
    return (
      birdPoseRef.current?.position ||
      lastBirdPositionRef.current ||
      copyVector3(BIRD_AMBIENT_START)
    );
  }, []);

  const seedBirdFlight = useCallback((fromPosition, destination) => {
    const startHeadingY = getHeadingY(fromPosition, destination);
    birdPoseRef.current = {
      position: fromPosition,
      headingY: startHeadingY,
    };
    lookAtRef.current = destination;
    lastBirdPositionRef.current = fromPosition;
  }, []);

  const parkBirdFacingCard = useCallback((arrivedPosition) => {
    const viewingScene = computeInteriorBirdViewingScene(arrivedPosition);
    birdPoseRef.current = viewingScene.birdPose;
    lastBirdPositionRef.current = viewingScene.birdPose.position;
    lookAtRef.current = viewingScene.cameraLookAt;
    setInteriorView({
      cameraPosition: viewingScene.cameraPosition,
      cameraLookAt: viewingScene.cameraLookAt,
    });
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
      setInteriorView(null);
      setBirdControlled(false);
      birdPoseRef.current = null;
      lastBirdPositionRef.current = null;
    }
  }, [clearSettling]);

  const handleFlightArrived = useCallback(
    (areaId, birdPose) => {
      if (birdPose) {
        birdPoseRef.current = birdPose;
        lastBirdPositionRef.current = birdPose.position;
      }

      setBirdControlled(true);

      if (
        pendingInteriorAreaIdRef.current !== null &&
        pendingInteriorAreaIdRef.current === areaId
      ) {
        pendingInteriorAreaIdRef.current = null;
        setIsTravelingToInterior(false);
        parkBirdFacingCard(birdPose?.position || getWorldWaypoint(areaId));
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
    [
      clearSettling,
      getWorldWaypoint,
      markArrivedAtCurrentArea,
      parkBirdFacingCard,
    ]
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
      setInteriorView(null);

      const destination = getWorldWaypoint(areaId);
      const fromPosition = getBirdStartPosition();
      const started = startFlight(areaId, fromPosition, destination, {
        allowSameArea: true,
        settleOnArrive: false,
      });

      if (!started) {
        return;
      }

      seedBirdFlight(fromPosition, destination);
      setBirdControlled(true);
      pendingInteriorAreaIdRef.current = areaId;
      setIsTravelingToInterior(true);
      setCurrentStage(areaId);
      islandControlsRef.current?.goToArea(areaId);
    },
    [
      cancelFlight,
      clearSettling,
      getBirdStartPosition,
      getWorldWaypoint,
      seedBirdFlight,
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
    setInteriorView(null);
    isReturningHomeRef.current = true;

    const birdHome = copyVector3(BIRD_AMBIENT_START);
    const fromPosition = getBirdStartPosition();
    cancelFlight({ settle: false });
    clearSettling();

    const started = startFlight(
      RETURN_FLIGHT_AREA_ID,
      fromPosition,
      birdHome,
      {
        allowSameArea: true,
        settleOnArrive: true,
        durationSeconds: RETURN_FLIGHT_DURATION_SECONDS,
        arcHeight: RETURN_FLIGHT_ARC_HEIGHT,
      }
    );

    if (started) {
      seedBirdFlight(fromPosition, birdHome);
      setBirdControlled(true);
    } else {
      isReturningHomeRef.current = false;
      setIsExitingInterior(false);
      setInteriorAreaId(null);
      setBirdControlled(false);
    }

    setCurrentStage(RETURN_FLIGHT_AREA_ID);
    markArrivedAtCurrentArea(RETURN_FLIGHT_AREA_ID);
    islandControlsRef.current?.goToArea(RETURN_FLIGHT_AREA_ID);
  }, [
    cancelFlight,
    clearSettling,
    getBirdStartPosition,
    isInside,
    isTravelingToInterior,
    markArrivedAtCurrentArea,
    seedBirdFlight,
    startFlight,
  ]);

  const outdoorControlsVisible =
    !isInside && !isExitingInterior && !isTravelingToInterior;
  const showBiplane = outdoorControlsVisible;
  const showIslandBackdrop =
    !isInside && !isExitingInterior;
  const shouldFollowBird = isFlying || isTravelingToInterior;
  const shouldUseInteriorCamera =
    Boolean(interiorView) && isInside && !isExitingInterior;

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
            The phoenix is flying into this island area…
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
            birdPoseRef={birdPoseRef}
            lookAtRef={lookAtRef}
            onArrived={handleFlightArrived}
          />
          <CameraFollow
            enabled={shouldFollowBird}
            isSettling={isSettling && isExitingInterior}
            followPoseRef={birdPoseRef}
            lookAtRef={lookAtRef}
            onSettleComplete={handleSettleComplete}
          />
          <InteriorCamera
            active={shouldUseInteriorCamera}
            isExiting={false}
            targetPosition={interiorView?.cameraPosition}
            targetLookAt={interiorView?.cameraLookAt}
          />

          <Bird isControlled={birdControlled} poseRef={birdPoseRef} />
          <Sky isRotating={isRotating || isFlying} />
          <group visible={showIslandBackdrop}>
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
          </group>
          {showBiplane ? (
            <Plane
              isRotating={isRotating}
              isFlying={false}
              position={biplane.position}
              rotation={[0, 20.1, 0]}
              scale={biplane.scale}
            />
          ) : null}
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
