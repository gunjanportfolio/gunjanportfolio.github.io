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
      className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-slate-950/75 via-slate-900/45 to-transparent pb-5 pt-24"
      data-testid="explore-controls"
    >
      <div className="mx-auto flex w-full max-w-3xl -translate-y-0 flex-col items-center gap-3.5 px-4">
        {showExploreHint ? (
          <div
            className="explore-hint-enter pointer-events-none w-full max-w-lg rounded-2xl border border-white/90 bg-white px-5 py-4 text-center shadow-2xl shadow-black/25"
            data-testid="explore-first-visit-hint"
          >
            <p className="font-poppins text-base font-bold text-slate-900 sm:text-lg">
              {EXPLORE_HINT_TITLE}
            </p>
            <p className="mt-1.5 text-sm font-medium leading-snug text-slate-700 sm:text-base">
              {EXPLORE_HINT_MESSAGE}
            </p>
          </div>
        ) : (
          <p className="w-full max-w-lg rounded-2xl border border-white/90 bg-white px-5 py-3 text-center text-sm font-semibold text-slate-800 shadow-xl shadow-black/20 sm:text-base">
            {EXPLORE_HINT_MESSAGE}
          </p>
        )}

        <div
          className="flex flex-wrap justify-center gap-2.5 pointer-events-auto"
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
                className={`rounded-full px-5 py-2.5 text-sm font-bold shadow-lg transition active:scale-95 sm:text-base ${
                  isActive
                    ? "bg-sky-500 text-white shadow-sky-900/40 ring-2 ring-white"
                    : "bg-white text-slate-900 shadow-black/25 hover:bg-sky-50"
                } ${shouldPulse ? "explore-area-pulse" : ""}`}
              >
                {area.label}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col items-center gap-1.5 pointer-events-auto">
          <p className="rounded-full bg-black/35 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white">
            {EXPLORE_ROTATE_LABEL}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Rotate island left"
              data-testid="explore-left"
              className="rounded-full border border-white/80 bg-white px-3.5 py-2 text-base font-bold text-slate-800 shadow-md hover:bg-sky-50 active:scale-95"
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
              className="rounded-full border border-white/80 bg-white px-3.5 py-2 text-base font-bold text-slate-800 shadow-md hover:bg-sky-50 active:scale-95"
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
