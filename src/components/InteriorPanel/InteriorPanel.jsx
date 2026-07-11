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
      <div className="pointer-events-none flex flex-1 items-start justify-center px-4 pt-24 sm:pt-28">
        <div
          className={`pointer-events-auto w-full max-w-2xl ${
            isFading ? "pointer-events-none" : ""
          }`}
        >
          <HomeInfo currentStage={areaId} onBack={isFading ? undefined : onBack} />
        </div>
      </div>
    </div>
  );
}
