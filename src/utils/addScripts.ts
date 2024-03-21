import path from "path";
import fsExtra from "fs-extra";
import { PackageJson } from "type-fest";

export function addScript(
  destDir: string,
  scripts: { name: string; value: string }[]
) {
  const pkgJsonPath = path.join(destDir, "package.json");
  const pkgJson = fsExtra.readJsonSync(pkgJsonPath) as PackageJson;
  for (let script of scripts) {
    pkgJson.scripts![script.name] = script.value;
  }
  fsExtra.writeJsonSync(pkgJsonPath, pkgJson, { spaces: 2 });
}
