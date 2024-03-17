import path from "path";
import fsExtra from "fs-extra";
import { PackageJson } from "type-fest";
import { extraSrc } from "../const.js";
import { logger } from "../utils/logger.js";

export async function tailwindInstaller(destDir: string) {
  let tailwindSrc = path.join(extraSrc, "config/tailwind.config.cjs");
  let postcssSrc = path.join(extraSrc, "config/postcss.config.cjs");
  let tailwindPrettierSrc = path.join(
    extraSrc,
    "config/.prettierrcTailwindConfig"
  );
  let tailwindDest = path.join(destDir, "tailwind.config.cjs");
  let postcssDest = path.join(destDir, "postcss.config.cjs");
  let tailwindPrettierDest = path.join(destDir, ".prettierrc");
  let tailwindCssSrc = path.join(extraSrc, "pages/tailwindAppCss.css");
  let tailwindCssDest = path.join(destDir, "src/app.css");
  // ** removing prettier plugin svelte
  const pkgJsonPath = path.join(destDir, "package.json");
  const pkgJson = fsExtra.readJSONSync(pkgJsonPath) as PackageJson;
  delete pkgJson.devDependencies!["prettier-plugin-svelte"];
  return Promise.allSettled([
    fsExtra.writeJson(pkgJsonPath, pkgJson, { spaces: 2 }),
    fsExtra.copyFile(tailwindSrc, tailwindDest),
    fsExtra.copyFile(postcssSrc, postcssDest),
    fsExtra.copyFile(tailwindPrettierSrc, tailwindPrettierDest),
    fsExtra.copyFile(tailwindCssSrc, tailwindCssDest),
  ])
    .then(() => logger.success("Tailwind configs copied successfully"))
    .catch(() => logger.error("Failed to copy tailwind config"));
}
