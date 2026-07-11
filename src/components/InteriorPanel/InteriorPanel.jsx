import HomeInfo from "../HomeInfo";

export default function InteriorPanel({ areaId, onBack, isFading = false }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 z-30 flex flex-col transition-opacity duration-700 ease-in-out ${
        isFading ? "opacity-0" : "opacity-100"
      }`}
      data-testid="interior-panel"
      data-fading={isFading ? "true" : "false"}
    >
      <div className="pointer-events-none flex flex-1 items-start justify-center bg-gradient-to-b from-slate-950/35 via-slate-900/10 to-transparent px-4 pt-20 sm:pt-24 pb-[32vh]">
        <div
          className={`pointer-events-auto w-full max-w-2xl drop-shadow-2xl ${
            isFading ? "pointer-events-none" : ""
          }`}
          data-testid="interior-card"
        >
          <HomeInfo currentStage={areaId} onBack={isFading ? undefined : onBack} />
        </div>
      </div>
    </div>
  );
}
