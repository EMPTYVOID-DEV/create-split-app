import { fileURLToPath } from "url";
import { dependencies, settings } from "./types.js";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const distPath = path.dirname(__filename);
export const PKG_ROOT = path.join(distPath, "../");

export const title = "Split";

export const defaultSettings: settings = {
  orm: "drizzle",
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

export const authDestPath = "src/lib/auth";

export const databaseDestPath = "src/lib/database";

export const componentsDestPath = "src/lib/components";

export const utilsDestPath = "src/lib/utils";

export const dependencyMap = new Map<dependencies, string>([
  ["@types/express", "^4.17.21"],
  ["@sveltejs/adapter-node", "^5.0.1"],
  ["@types/node", "^20.11.28"],
  ["autoprefixer", "^10.4.18"],
  ["@types/better-sqlite3", "^7.6.9"],
  ["postcss", "^8.4.35"],
  ["tailwindcss", "^3.4.1"],
  ["socket.io", "^4.7.5"],
  ["socket.io-client", "^4.7.5"],
  ["express", "^4.18.3"],
  ["prettier-plugin-tailwindcss", "^0.5.12"],
  ["@prisma/client", "^5.11.0"],
  ["prisma", "^5.11.0"],
  ["@lucia-auth/adapter-prisma", "^4.0.1"],
  ["drizzle-kit", "^0.20.14"],
  ["drizzle-orm", "^0.30.2"],
  ["@lucia-auth/adapter-drizzle", "^1.0.4"],
  ["better-sqlite3", "^9.4.3"],
  ["lucia", "^3.1.1"],
  ["oslo", "^1.1.3"],
]);
