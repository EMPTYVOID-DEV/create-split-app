import path from "path";
import fsExtra from "fs-extra";
import { PackageJson } from "type-fest";
import { dependencyMap } from "../const.js";
import { dependencies } from "../types.js";

export function addDependency(
  dependencies: dependencies[],
  devMode: boolean,
  projectDir: string
) {
  const pkgJsonPath = path.join(projectDir, "package.json");
  const pkgJson = fsExtra.readJsonSync(pkgJsonPath) as PackageJson;
  for (const dependency of dependencies) {
    if (devMode) {
      pkgJson.devDependencies[dependency] = dependencyMap.get(dependency);
    } else {
      pkgJson.dependencies[dependency] = dependencyMap.get(dependency);
    }
  }
  fsExtra.writeJsonSync(pkgJsonPath, pkgJson, { spaces: 2 });
}
