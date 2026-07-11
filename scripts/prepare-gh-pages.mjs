import { copyFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const distDirectory = join(process.cwd(), "dist");
const indexPath = join(distDirectory, "index.html");
const notFoundPath = join(distDirectory, "404.html");

if (!existsSync(indexPath)) {
  throw new Error("dist/index.html was not found. Run vite build first.");
}

copyFileSync(indexPath, notFoundPath);
console.log("Prepared dist/404.html for GitHub Pages SPA routing.");
