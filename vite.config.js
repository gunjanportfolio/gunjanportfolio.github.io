import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// User/org GitHub Pages site: https://gunjanportfolio.github.io/
// Override with: VITE_BASE_PATH=/repo-name/ npm run build
const base = process.env.VITE_BASE_PATH || "/";

export default defineConfig({
  base,
  plugins: [react()],
  assetsInclude: ["**/*.glb"],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.js",
    css: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: [
        "src/components/**/*.{js,jsx}",
        "src/config/**/*.{js,jsx}",
        "src/constants/portfolioAreas.js",
        "src/constants/exploreUi.js",
        "src/constants/rotatingIntro.js",
        "src/constants/homeSocialLinks.js",
        "src/constants/faqChatbot.js",
        "src/hooks/**/*.{js,jsx}",
        "src/utils/**/*.{js,jsx}",
      ],
      exclude: [
        "src/**/*.test.{js,jsx}",
        "src/components/index.js",
        "src/components/ExploreControls/index.js",
        "src/components/MusicToggle/index.js",
        "src/components/ExplorationScene/index.js",
        "src/components/ExplorationScene/CameraFollow.jsx",
        "src/components/ExplorationScene/FlightDriver.jsx",
        "src/components/ExplorationScene/InteriorCamera.jsx",
        "src/components/ExplorationScene/IslandHitboxes.jsx",
        "src/components/ExplorationScene/LoadingTracker.jsx",
        "src/components/InteriorPanel/index.js",
        "src/components/BackToIsland/index.js",
        "src/components/SceneLoadingOverlay/index.js",
        "src/components/RotatingIntro/index.js",
        "src/components/Activities/index.js",
        "src/components/DownloadCvButton/index.js",
        "src/components/HomeSocialLinks/index.js",
        "src/components/AboutProfilePhoto/index.js",
        "src/components/FaqChatbot/index.js",
        "src/utils/index.js",
        "src/test/**",
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 70,
        statements: 80,
      },
    },
  },
});
