import { useEffect, useRef } from "react";

import { PORTFOLIO_AREAS } from "../../constants/portfolioAreas";
import {
  EXPLORE_HINT_MESSAGE,
  EXPLORE_HINT_TITLE,
  EXPLORE_ROTATE_LABEL,
} from "../../constants/exploreUi";
import useExploreHint from "../../hooks/useExploreHint";

const HOLD_INTERVAL_MS = 40;

const ExploreControls = ({
  currentStage,
  onRotateLeft,
  onRotateRight,
  onStopRotate,
  onGoToArea,
}) => {
  const holdIntervalRef = useRef(null);
  const { showExploreHint, dismissExploreHint } = useExploreHint();

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
      dismissExploreHint();
      onGoToArea(areaId);
    };
  };

  return (
    <div
      className="absolute bottom-6 left-1/2 z-20 flex w-full max-w-3xl -translate-x-1/2 flex-col items-center gap-3 px-4 pointer-events-none"
      data-testid="explore-controls"
    >
      {showExploreHint ? (
        <div
          className="explore-hint-enter pointer-events-none max-w-md rounded-2xl border border-sky-200/80 bg-white/95 px-5 py-3 text-center shadow-lg shadow-sky-900/5 backdrop-blur-md"
          data-testid="explore-first-visit-hint"
        >
          <p className="font-poppins text-sm font-semibold text-slate-800 sm:text-base">
            {EXPLORE_HINT_TITLE}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-slate-600 sm:text-sm">
            {EXPLORE_HINT_MESSAGE}
          </p>
        </div>
      ) : (
        <p className="rounded-lg bg-white/85 px-4 py-2 text-center text-sm font-medium text-slate-700 shadow-sm backdrop-blur-sm sm:text-base">
          {EXPLORE_HINT_MESSAGE}
        </p>
      )}

      <div
        className="flex flex-wrap justify-center gap-2 pointer-events-auto"
        data-testid="area-navigator"
      >
        {PORTFOLIO_AREAS.map((area) => {
          const isActive = currentStage === area.id;
          const shouldPulse = showExploreHint && !isActive;
          const handleAreaClick = createAreaClickHandler(area.id);

          return (
            <button
              key={area.key}
              type="button"
              data-testid={`area-${area.key}`}
              aria-current={isActive ? "true" : undefined}
              aria-label={`Explore ${area.label}`}
              onClick={handleAreaClick}
              className={`rounded-full px-4 py-2 text-sm font-semibold shadow transition active:scale-95 ${
                isActive
                  ? "bg-sky-500 text-white shadow-sky-500/30"
                  : "bg-white/95 text-slate-800 hover:bg-white"
              } ${shouldPulse ? "explore-area-pulse" : ""}`}
            >
              {area.label}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col items-center gap-1.5 pointer-events-auto">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500">
          {EXPLORE_ROTATE_LABEL}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            aria-label="Rotate island left"
            data-testid="explore-left"
            className="rounded-full border border-slate-200/80 bg-white/75 px-3 py-1.5 text-base font-semibold text-slate-600 shadow-sm hover:bg-white active:scale-95"
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
            className="rounded-full border border-slate-200/80 bg-white/75 px-3 py-1.5 text-base font-semibold text-slate-600 shadow-sm hover:bg-white active:scale-95"
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
    </div>
  );
};

export default ExploreControls;
