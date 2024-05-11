import path from "path";
import fsExtra from "fs-extra";
import { extraSrc, authDestPath } from "../const.js";
import { logger } from "../utils/logger.js";
import { addDependency } from "../utils/addDependency.js";
import { addScript } from "../utils/addScripts.js";

export async function luciaInstaller(
  destDir: string,
  orm: "drizzle" | "prisma"
) {
  const luciaConfigSrc =
    orm == "prisma"
      ? path.join(extraSrc, "lucia/lucia.prisma.ts")
      : path.join(extraSrc, "lucia/lucia.drizzle.ts");
  const authDir = path.join(destDir, authDestPath);
  const luciaConfigDest = path.join(authDir, "lucia.ts");
  const appTypesSrc = path.join(extraSrc, "lucia/app.d.ts");
  const appTypesDest = path.join(destDir, "src/app.d.ts");
  const hookLuciaSrc = path.join(extraSrc, "other/hook.server.ts");
  const hookLuciaDest = path.join(destDir, "src/hooks.server.ts");

  addScript(destDir, [{ name: "mail", value: "npx run maildev" }]);

  addDependency(["lucia", "oslo"], false, destDir);
  // create the auth dir synchronously
  fsExtra.mkdirSync(authDir, { recursive: true });

  return Promise.allSettled([
    fsExtra.copyFile(luciaConfigSrc, luciaConfigDest),
    fsExtra.copyFile(appTypesSrc, appTypesDest),
    fsExtra.copyFile(hookLuciaSrc, hookLuciaDest),
  ])
    .then(() => logger.success("Lucia configs copied successfully"))
    .catch(() => logger.error("Failed to copy lucia config"));
}
