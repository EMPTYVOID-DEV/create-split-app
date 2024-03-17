import path from "path";
import fsExtra from "fs-extra";
import { extraSrc } from "../const.js";
import { logger } from "../utils/logger.js";
import { orm } from "../types.js";

export async function luciaInstaller(destDir: string, orm: orm) {
  let luciaConfigSrc =
    orm == "base-sqlite"
      ? path.join(extraSrc, "lucia/lucia.ts")
      : orm == "prisma"
      ? path.join(extraSrc, "lucia/lucia.prisma.ts")
      : path.join(extraSrc, "lucia/lucia.drizzle.ts");
  let authDest = path.join(destDir, "src/lib/server/auth");
  fsExtra.mkdirSync(authDest, { recursive: true });
  let luciaConfigDest = path.join(authDest, "lucia.ts");
  let appTypesSrc = path.join(extraSrc, "lucia/app.d.ts");
  let appTypesDest = path.join(destDir, "src/app.d.ts");
  let hookLuciaSrc = path.join(extraSrc, "pages/hook.server.ts");
  let hookLuciaDest = path.join(destDir, "src/hooks.server.ts");

  return Promise.allSettled([
    fsExtra.copyFile(luciaConfigSrc, luciaConfigDest),
    fsExtra.copyFile(appTypesSrc, appTypesDest),
    fsExtra.copyFile(hookLuciaSrc, hookLuciaDest),
  ])
    .then(() => logger.success("lucia configs copied successfully"))
    .catch(() => logger.error("Failed to copy lucia config"));
}
