import HomeInfo from "../HomeInfo";

export default function InteriorPanel({ areaId, onBack }) {
  const handleBack = () => {
    onBack();
  };

  return (
    <div
      className="pointer-events-none absolute inset-0 z-30 flex flex-col"
      data-testid="interior-panel"
    >
      <div className="pointer-events-auto flex items-start justify-between gap-3 p-4 sm:p-6">
        <button
          type="button"
          data-testid="interior-back-button"
          aria-label="Back to island"
          onClick={handleBack}
          className="rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-slate-800 shadow-md transition hover:bg-white active:scale-95"
        >
          ← Back to island
        </button>
      </div>

      <div className="pointer-events-none flex flex-1 items-start justify-center px-4 pt-2 sm:pt-6">
        <div className="pointer-events-auto w-full max-w-2xl">
          <HomeInfo currentStage={areaId} />
        </div>
      </div>
    </div>
  );
}
