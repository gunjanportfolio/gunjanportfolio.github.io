import { useEffect, useRef } from "react";

import { PORTFOLIO_AREAS } from "../../constants/portfolioAreas";

const HOLD_INTERVAL_MS = 40;

const ExploreControls = ({
  currentStage,
  onRotateLeft,
  onRotateRight,
  onStopRotate,
  onGoToArea,
}) => {
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

  const createAreaClickHandler = (areaId) => {
    return () => {
      onGoToArea(areaId);
    };
  };

  return (
    <div
      className="absolute bottom-6 left-1/2 z-20 flex w-full max-w-3xl -translate-x-1/2 flex-col items-center gap-3 px-4 pointer-events-none"
      data-testid="explore-controls"
    >
      <p className="rounded-lg bg-white/85 px-4 py-2 text-center text-sm font-medium text-slate-700 shadow-sm backdrop-blur-sm sm:text-base">
        Choose an area or click a building to step inside
      </p>

      <div
        className="flex flex-wrap justify-center gap-2 pointer-events-auto"
        data-testid="area-navigator"
      >
        {PORTFOLIO_AREAS.map((area) => {
          const isActive = currentStage === area.id;
          const handleAreaClick = createAreaClickHandler(area.id);

          return (
            <button
              key={area.key}
              type="button"
              data-testid={`area-${area.key}`}
              aria-current={isActive ? "true" : undefined}
              aria-label={`Go to ${area.label} area`}
              onClick={handleAreaClick}
              className={`rounded-full px-4 py-2 text-sm font-semibold shadow transition active:scale-95 ${
                isActive
                  ? "bg-blue-500 text-white"
                  : "bg-white/90 text-slate-800 hover:bg-white"
              }`}
            >
              {area.label}
            </button>
          );
        })}
      </div>

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
