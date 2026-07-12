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
      className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-slate-900/25 via-transparent to-transparent pb-4 pt-16"
      data-testid="explore-controls"
    >
      <div className="mx-auto mb-14 flex w-full max-w-3xl flex-col items-center gap-3 px-4 sm:mb-16">
        {showExploreHint ? (
          <div
            className="explore-hint-enter pointer-events-none w-full max-w-lg rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-center shadow-lg shadow-black/20"
            data-testid="explore-first-visit-hint"
          >
            <p className="font-poppins text-sm font-semibold text-slate-700 sm:text-base">
              {EXPLORE_HINT_TITLE}
            </p>
            <p
              className="explore-gradient-text mt-1 text-sm font-bold leading-snug sm:text-base"
              data-testid="explore-hint-message"
            >
              {EXPLORE_HINT_MESSAGE}
            </p>
          </div>
        ) : (
          <p
            className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white px-5 py-3 text-center shadow-lg shadow-black/20"
            data-testid="explore-hint-message"
          >
            <span className="explore-gradient-text text-sm font-bold sm:text-base">
              {EXPLORE_HINT_MESSAGE}
            </span>
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
                className={`rounded-full px-4 py-2 text-sm font-semibold shadow-md transition active:scale-95 ${
                  isActive
                    ? "bg-sky-500/90 text-white ring-1 ring-white/80"
                    : "bg-white/80 text-slate-800 backdrop-blur-sm hover:bg-white"
                } ${shouldPulse ? "explore-area-pulse" : ""}`}
              >
                {area.label}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col items-center gap-1.5 pointer-events-auto">
          <p className="rounded-full bg-slate-900/25 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/90">
            {EXPLORE_ROTATE_LABEL}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Rotate island left"
              data-testid="explore-left"
              className="rounded-full border border-white/60 bg-white/70 px-3 py-1.5 text-base font-semibold text-slate-700 shadow-sm backdrop-blur-sm hover:bg-white active:scale-95"
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
              className="rounded-full border border-white/60 bg-white/70 px-3 py-1.5 text-base font-semibold text-slate-700 shadow-sm backdrop-blur-sm hover:bg-white active:scale-95"
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
    </div>
  );
};

export default ExploreControls;
