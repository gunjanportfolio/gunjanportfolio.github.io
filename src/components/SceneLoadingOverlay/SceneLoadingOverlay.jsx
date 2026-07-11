import { LOADING_ISLAND_MESSAGE } from "../../constants/exploreUi";

export default function SceneLoadingOverlay({
  isVisible = true,
  isFading = false,
  message = LOADING_ISLAND_MESSAGE,
}) {
  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`pointer-events-none absolute inset-0 z-40 flex items-center justify-center bg-slate-900/55 backdrop-blur-sm transition-opacity duration-500 ease-out ${
        isFading ? "opacity-0" : "opacity-100"
      }`}
      data-testid="scene-loading-overlay"
      data-fading={isFading ? "true" : "false"}
      role="status"
      aria-live="polite"
      aria-busy={!isFading}
      aria-label={message}
    >
      <div className="mx-4 flex w-full max-w-sm flex-col items-center gap-5 rounded-3xl border border-white bg-white px-8 py-10 text-center shadow-2xl shadow-black/30">
        <div
          className="h-16 w-16 rounded-full border-[3px] border-slate-200 border-t-sky-500 animate-spin"
          aria-hidden="true"
        />
        <div className="space-y-2">
          <p className="font-poppins text-xl font-bold tracking-wide text-slate-900 sm:text-2xl">
            {message}
          </p>
          <p className="text-sm font-medium text-slate-600 sm:text-base">
            Preparing the 3D island
          </p>
        </div>
      </div>
    </div>
  );
}
