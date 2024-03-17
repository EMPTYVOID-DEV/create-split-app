import path from "path";
import fsExtra from "fs-extra";
import { PackageJson } from "type-fest";
import { extraSrc } from "../const.js";
import { logger } from "../utils/logger.js";

export async function expressInstaller(destDir: string) {
  let expressSrc = path.join(extraSrc, "express");
  let expressDest = path.join(destDir, "express");
  let svelteConfigSrc = path.join(extraSrc, "config/svelte.config.express.js");
  let svelteConfigDest = path.join(destDir, "svelte.config.js");
  const pkgJsonPath = path.join(destDir, "package.json");
  const pkgJson = fsExtra.readJSONSync(pkgJsonPath) as PackageJson;
  delete pkgJson.devDependencies!["@sveltejs/adapter-auto"];
  return Promise.allSettled([
    fsExtra.writeJson(pkgJsonPath, pkgJson, { spaces: 2 }),
    fsExtra.copy(expressSrc, expressDest),
    fsExtra.copyFile(svelteConfigSrc, svelteConfigDest),
  ])
    .then(() => logger.success("express configs copied successfully"))
    .catch(() => logger.error("Failed to copy express config"));
}