import { Html } from "@react-three/drei";

import { LOADING_ISLAND_MESSAGE } from "../constants/exploreUi";

const Loader = () => {
  return (
    <Html center>
      <div
        className="flex flex-col items-center gap-4 rounded-2xl border border-white bg-white px-6 py-5 shadow-2xl"
        data-testid="scene-loader"
        role="status"
        aria-live="polite"
        aria-label={LOADING_ISLAND_MESSAGE}
      >
        <div
          className="h-14 w-14 rounded-full border-[3px] border-slate-200 border-t-sky-500 animate-spin"
          aria-hidden="true"
        />
        <p className="whitespace-nowrap text-center text-base font-bold tracking-wide text-slate-900">
          {LOADING_ISLAND_MESSAGE}
        </p>
      </div>
    </Html>
  );
};

export default Loader;
