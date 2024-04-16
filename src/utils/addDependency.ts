import path from "path";
import fsExtra from "fs-extra";
import { PackageJson } from "type-fest";
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
      pkgJson.devDependencies[dependency] = "*";
    } else {
      pkgJson.dependencies[dependency] = "*";
    }
  }
  fsExtra.writeJsonSync(pkgJsonPath, pkgJson, { spaces: 2 });
}
