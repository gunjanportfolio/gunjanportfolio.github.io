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
      className={`pointer-events-none absolute inset-0 z-40 flex items-center justify-center bg-gradient-to-b from-sky-100/95 via-slate-100/95 to-slate-200/95 transition-opacity duration-500 ease-out ${
        isFading ? "opacity-0" : "opacity-100"
      }`}
      data-testid="scene-loading-overlay"
      data-fading={isFading ? "true" : "false"}
      role="status"
      aria-live="polite"
      aria-busy={!isFading}
      aria-label={message}
    >
      <div className="flex flex-col items-center gap-5 px-6 text-center">
        <div
          className="h-16 w-16 rounded-full border-2 border-slate-300/50 border-t-sky-500 animate-spin shadow-sm"
          aria-hidden="true"
        />
        <div className="space-y-2">
          <p className="font-poppins text-lg font-semibold tracking-wide text-slate-800 sm:text-xl">
            {message}
          </p>
          <p className="text-sm text-slate-500">Preparing the 3D island</p>
        </div>
      </div>
    </div>
  );
}
