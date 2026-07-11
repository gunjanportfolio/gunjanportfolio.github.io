import { useEffect, useRef } from "react";

const HOLD_INTERVAL_MS = 40;

const ExploreControls = ({ onRotateLeft, onRotateRight, onStopRotate }) => {
  const holdIntervalRef = useRef(null);

  const clearHoldInterval = () => {
    if (holdIntervalRef.current !== null) {
      window.clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      clearHoldInterval();
    };
  }, []);

  const startHold = (rotateAction) => {
    clearHoldInterval();
    rotateAction();
    holdIntervalRef.current = window.setInterval(rotateAction, HOLD_INTERVAL_MS);
  };

  const stopHold = () => {
    clearHoldInterval();
    onStopRotate();
  };

  const handleLeftStart = (event) => {
    event.preventDefault();
    startHold(onRotateLeft);
  };

  const handleRightStart = (event) => {
    event.preventDefault();
    startHold(onRotateRight);
  };

  return (
    <div
      className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-3 pointer-events-none"
      data-testid="explore-controls"
    >
      <p className="rounded-lg bg-white/80 px-4 py-2 text-center text-sm font-medium text-slate-700 shadow-sm backdrop-blur-sm sm:text-base">
        Drag the island or use ← → / A D to fly past different areas
      </p>
      <div className="flex gap-3 pointer-events-auto">
        <button
          type="button"
          aria-label="Rotate island left"
          data-testid="explore-left"
          className="rounded-full bg-white/90 px-4 py-2 text-lg font-semibold text-slate-800 shadow hover:bg-white active:scale-95"
          onMouseDown={handleLeftStart}
          onMouseUp={stopHold}
          onMouseLeave={stopHold}
          onTouchStart={handleLeftStart}
          onTouchEnd={stopHold}
        >
          ←
        </button>
        <button
          type="button"
          aria-label="Rotate island right"
          data-testid="explore-right"
          className="rounded-full bg-white/90 px-4 py-2 text-lg font-semibold text-slate-800 shadow hover:bg-white active:scale-95"
          onMouseDown={handleRightStart}
          onMouseUp={stopHold}
          onMouseLeave={stopHold}
          onTouchStart={handleRightStart}
          onTouchEnd={stopHold}
        >
          →
        </button>
      </div>
    </div>
  );
};

export default ExploreControls;
