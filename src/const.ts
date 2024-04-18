import { fileURLToPath } from "url";
import { settings } from "./types.js";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const distPath = path.dirname(__filename);
export const PKG_ROOT = path.join(distPath, "../");

export const title = "create-split-app";

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

export const authDestPath = "src/lib/server/auth";

export const databaseDestPath = "src/lib/server/database";

export const serverUtilsDestPath = "src/lib/server/utils";

export const clientUtilsDestPath = "src/lib/client/utils";

export const migrationCommands = new Map<
  "prisma" | "drizzle",
  { prepare: string[]; push: string[] }
>([
  [
    "prisma",
    {
      prepare: ["prisma", "migrate", "dev", "--name", "initial_migration"],
      push: ["prisma", "generate"],
    },
  ],
  [
    "drizzle",
    {
      prepare: [
        "drizzle-kit",
        "generate:sqlite",
        "--config",
        "./drizzle.config.ts",
      ],
      push: ["drizzle-kit", "push:sqlite", "--config", "./drizzle.config.ts"],
    },
  ],
]);
