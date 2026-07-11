import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";

import sakura from "../assets/sakura.mp3";
import { soundoff, soundon } from "../assets/icons";
import ExploreControls from "../components/ExploreControls";
import { HomeInfo, Loader } from "../components";
import { Bird, Island, Plane, Sky } from "../models";
import {
  getBiplaneScreenAdjustments,
  getIslandScreenAdjustments,
} from "../utils";

const Home = () => {
  const audioRef = useRef(new Audio(sakura));
  audioRef.current.volume = 0.4;
  audioRef.current.loop = true;
  const islandControlsRef = useRef(null);

  const [currentStage, setCurrentStage] = useState(1);
  const [isRotating, setIsRotating] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(true);

  useEffect(() => {
    const audioElement = audioRef.current;

    const playMusic = () => {
      const playPromise = audioElement.play();

      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Browsers may block autoplay until the first user gesture.
        });
      }
    };

    const handleFirstInteraction = () => {
      if (isPlayingMusic) {
        playMusic();
      }

      window.removeEventListener("pointerdown", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
    };

    if (isPlayingMusic) {
      playMusic();
      window.addEventListener("pointerdown", handleFirstInteraction);
      window.addEventListener("keydown", handleFirstInteraction);
    } else {
      audioElement.pause();
    }

    return () => {
      audioElement.pause();
      window.removeEventListener("pointerdown", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
    };
  }, [isPlayingMusic]);

  const handleToggleMusic = () => {
    setIsPlayingMusic((previousValue) => !previousValue);
  };

  const handleRotateLeft = () => {
    islandControlsRef.current?.rotateLeft();
  };

  const handleRotateRight = () => {
    islandControlsRef.current?.rotateRight();
  };

  const handleStopRotate = () => {
    islandControlsRef.current?.stopRotating();
  };

  const handleGoToArea = (areaId) => {
    islandControlsRef.current?.goToArea(areaId);
    setCurrentStage(areaId);
  };

  const biplane = getBiplaneScreenAdjustments(window.innerWidth);
  const island = getIslandScreenAdjustments(window.innerWidth);

  return (
    <section className="w-full h-screen relative" data-testid="home-page">
      <div className="absolute top-24 left-0 right-0 z-10 flex items-center justify-center pointer-events-none">
        <div className="pointer-events-auto">
          {currentStage && <HomeInfo currentStage={currentStage} />}
        </div>
      </div>

      <Canvas
        className={`w-full h-screen bg-transparent ${
          isRotating ? "cursor-grabbing" : "cursor-grab"
        }`}
        camera={{ near: 0.1, far: 1000 }}
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

          <Bird />
          <Sky isRotating={isRotating} />
          <Island
            ref={islandControlsRef}
            isRotating={isRotating}
            setIsRotating={setIsRotating}
            setCurrentStage={setCurrentStage}
            position={island.position}
            rotation={[0.1, 4.7077, 0]}
            scale={island.scale}
          />
          <Plane
            isRotating={isRotating}
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

      <div className="absolute bottom-2 left-2 z-20">
        <img
          src={!isPlayingMusic ? soundoff : soundon}
          alt="jukebox"
          onClick={handleToggleMusic}
          className="w-10 h-10 cursor-pointer object-contain"
          data-testid="music-toggle"
        />
      </div>
    </section>
  );
};

export default Home;
