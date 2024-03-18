import path from "path";
import fsExtra from "fs-extra";
import { PackageJson } from "type-fest";
import { extraSrc, utilsDestPath } from "../const.js";
import { logger } from "../utils/logger.js";
import { addDependency } from "../utils/addDependency.js";

export async function expressInstaller(destDir: string) {
  const expressSrcDir = path.join(extraSrc, "express");
  const expressDest = path.join(destDir, "express");
  const svelteConfigSrcPath = path.join(
    extraSrc,
    "config/svelte.config.express.js"
  );
  const svelteConfigDestPath = path.join(destDir, "svelte.config.js");
  const socketPageSrcPath = path.join(extraSrc, "pages/+page.socket.svelte");
  const socketPageDest = path.join(destDir, "src/routes/+page.svelte");
  const utilsDir = path.join(destDir, utilsDestPath);
  const clientSocketSrcPath = path.join(extraSrc, "pages/clientSocket.ts");
  const clientSocketDestPath = path.join(utilsDir, "clientSocket.ts");

  fsExtra.mkdirSync(utilsDir);

  const pkgJsonPath = path.join(destDir, "package.json");
  const pkgJson = fsExtra.readJSONSync(pkgJsonPath) as PackageJson;
  delete pkgJson.devDependencies!["@sveltejs/adapter-auto"];
  fsExtra.writeJsonSync(pkgJsonPath, pkgJson, { spaces: 2 });

  addDependency(
    ["@types/node", "@types/express", "@sveltejs/adapter-node"],
    true,
    destDir
  );
  addDependency(["express", "socket.io", "socket.io-client"], false, destDir);

  return Promise.allSettled([
    fsExtra.copyFile(socketPageSrcPath, socketPageDest),
    fsExtra.copyFile(clientSocketSrcPath, clientSocketDestPath),
    fsExtra.copy(expressSrcDir, expressDest),
    fsExtra.copyFile(svelteConfigSrcPath, svelteConfigDestPath),
  ])
    .then(() => logger.success("express configs copied successfully"))
    .catch(() => logger.error("Failed to copy express config"));
}
