import HomeInfo from "../HomeInfo";

export default function InteriorPanel({ areaId, onBack }) {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-30 flex flex-col"
      data-testid="interior-panel"
    >
      <div className="pointer-events-none flex flex-1 items-start justify-center px-4 pt-24 sm:pt-28">
        <div className="pointer-events-auto w-full max-w-2xl">
          <HomeInfo currentStage={areaId} onBack={onBack} />
        </div>
      </div>
    </div>
  );
}
