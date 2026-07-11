import { Canvas } from "@react-three/fiber";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";

import ExploreControls from "../components/ExploreControls";
import {
  CameraFollow,
  FlightDriver,
} from "../components/ExplorationScene";
import { HomeInfo, Loader } from "../components";
import useExplorationFlight from "../hooks/useExplorationFlight";
import { Bird, Island, Plane, Sky } from "../models";
import {
  getBiplaneScreenAdjustments,
  getIslandScreenAdjustments,
} from "../utils";
import {
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

  const handleRotateLeft = () => {
    islandControlsRef.current?.rotateLeft();
  };

  const handleRotateRight = () => {
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
      if (isFlying) {
        return;
      }

      setCurrentStage(stage);
      markArrivedAtCurrentArea(stage);
    },
    [isFlying, markArrivedAtCurrentArea]
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

  const handleGoToArea = (areaId) => {
    const islandPosition = toPositionObject(island.position);
    const islandScale = toScaleObject(island.scale);
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

  const showHomeInfo = Boolean(currentStage) && !isFlying;

  return (
    <section className="w-full h-screen relative" data-testid="home-page">
      <div className="absolute top-24 left-0 right-0 z-10 flex items-center justify-center pointer-events-none">
        <div className="pointer-events-auto">
          {showHomeInfo && <HomeInfo currentStage={currentStage} />}
        </div>
      </div>

      <Canvas
        className={`w-full h-screen bg-transparent ${
          isRotating ? "cursor-grabbing" : "cursor-grab"
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
            enabled={isFlying}
            isSettling={isSettling}
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
            suppressStageUpdates={isFlying}
            onManualInteraction={handleManualInteraction}
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

      <ExploreControls
        currentStage={currentStage}
        onRotateLeft={handleRotateLeft}
        onRotateRight={handleRotateRight}
        onStopRotate={handleStopRotate}
        onGoToArea={handleGoToArea}
      />
    </section>
  );
};

export default Home;
