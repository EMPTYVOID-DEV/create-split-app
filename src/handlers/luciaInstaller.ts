import path from "path";
import fsExtra from "fs-extra";
import { extraSrc, authDestPath } from "../const.js";
import { logger } from "../utils/logger.js";
import { orm } from "../types.js";

export async function luciaInstaller(destDir: string, orm: orm) {
  const luciaConfigSrc =
    orm == "base-sqlite"
      ? path.join(extraSrc, "lucia/lucia.ts")
      : orm == "prisma"
      ? path.join(extraSrc, "lucia/lucia.prisma.ts")
      : path.join(extraSrc, "lucia/lucia.drizzle.ts");
  const authDest = path.join(destDir, authDestPath);
  const luciaConfigDest = path.join(authDest, "lucia.ts");
  const appTypesSrc = path.join(extraSrc, "lucia/app.d.ts");
  const appTypesDest = path.join(destDir, "src/app.d.ts");
  const hookLuciaSrc = path.join(extraSrc, "pages/hook.server.ts");
  const hookLuciaDest = path.join(destDir, "src/hooks.server.ts");

  // create the auth dir synchronously
  fsExtra.mkdirSync(authDest, { recursive: true });

  return Promise.allSettled([
    fsExtra.copyFile(luciaConfigSrc, luciaConfigDest),
    fsExtra.copyFile(appTypesSrc, appTypesDest),
    fsExtra.copyFile(hookLuciaSrc, hookLuciaDest),
  ])
    .then(() => logger.success("lucia configs copied successfully"))
    .catch(() => logger.error("Failed to copy lucia config"));
}
