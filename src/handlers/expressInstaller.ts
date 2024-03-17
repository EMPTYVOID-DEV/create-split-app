import path from "path";
import fsExtra from "fs-extra";
import { PackageJson } from "type-fest";
import { extraSrc } from "../const.js";
import { logger } from "../utils/logger.js";
import { addDependency } from "../utils/addDependency.js";

export async function expressInstaller(destDir: string) {
  const expressSrc = path.join(extraSrc, "express");
  const expressDest = path.join(destDir, "express");
  const svelteConfigSrc = path.join(
    extraSrc,
    "config/svelte.config.express.js"
  );
  const svelteConfigDest = path.join(destDir, "svelte.config.js");

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
    fsExtra.copy(expressSrc, expressDest),
    fsExtra.copyFile(svelteConfigSrc, svelteConfigDest),
  ])
    .then(() => logger.success("express configs copied successfully"))
    .catch(() => logger.error("Failed to copy express config"));
}
