import { Html } from "@react-three/drei";

import { LOADING_ISLAND_MESSAGE } from "../constants/exploreUi";

const Loader = () => {
  return (
    <Html center>
      <div
        className="flex flex-col items-center gap-4 px-6"
        data-testid="scene-loader"
        role="status"
        aria-live="polite"
        aria-label={LOADING_ISLAND_MESSAGE}
      >
        <div
          className="h-14 w-14 rounded-full border-2 border-slate-300/40 border-t-sky-500 animate-spin"
          aria-hidden="true"
        />
        <p className="whitespace-nowrap text-center text-sm font-semibold tracking-wide text-slate-700 sm:text-base">
          {LOADING_ISLAND_MESSAGE}
        </p>
      </div>
    </Html>
  );
};

export default Loader;
