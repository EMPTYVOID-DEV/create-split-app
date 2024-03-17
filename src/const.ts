import { fileURLToPath } from "url";
import { settings } from "./types.js";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const distPath = path.dirname(__filename);
export const PKG_ROOT = path.join(distPath, "../");

export const title = "Split";

export const defaultSettings: settings = {
  database: "base-sqlite",
  git: true,
  installPackages: true,
  lucia: true,
  tailwind: true,
  express: false,
  name: "my-app",
};

export const workingDir = process.cwd();

export const extraSrc = path.join(PKG_ROOT, "template/extra");
export const baseSrc = path.join(PKG_ROOT, "template/base");
