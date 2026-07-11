import { useEffect, useRef, useState } from "react";

import sakura from "../../assets/sakura.mp3";
import { soundoff, soundon } from "../../assets/icons";

const DEFAULT_VOLUME = 0.4;

function createAmbientAudio() {
  const audioElement = new Audio(sakura);
  audioElement.volume = DEFAULT_VOLUME;
  audioElement.loop = true;
  return audioElement;
}

const MusicToggle = () => {
  const audioRef = useRef(null);
  const [isPlayingMusic, setIsPlayingMusic] = useState(true);

  useEffect(() => {
    const audioElement = createAmbientAudio();
    audioRef.current = audioElement;

    return () => {
      audioElement.pause();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    const audioElement = audioRef.current;

    if (!audioElement) {
      return undefined;
    }

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
      window.removeEventListener("pointerdown", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
    };
  }, [isPlayingMusic]);

  const handleToggleMusic = () => {
    setIsPlayingMusic((previousValue) => !previousValue);
  };

  return (
    <div className="fixed bottom-2 left-2 z-50">
      <button
        type="button"
        onClick={handleToggleMusic}
        aria-label={isPlayingMusic ? "Mute music" : "Play music"}
        data-testid="music-toggle"
        className="cursor-pointer"
      >
        <img
          src={!isPlayingMusic ? soundoff : soundon}
          alt=""
          className="w-10 h-10 object-contain"
        />
      </button>
    </div>
  );
};

export default MusicToggle;
