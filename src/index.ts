import { welcome } from "./handlers/welcome.js";
import { logger } from "./utils/logger.js";
import { cli } from "./handlers/cli.js";
import { createBase } from "./handlers/createBase.js";
import { tailwindInstaller } from "./handlers/tailwindInstaller.js";
import { expressInstaller } from "./handlers/expressInstaller.js";
import { luciaInstaller } from "./handlers/luciaInstaller.js";
import { databaseInstaller } from "./handlers/databaseInstaller.js";
import { installPackages as install } from "./handlers/installPackages.js";

import path from "path";
import { workingDir } from "./const.js";

async function main() {
  welcome();
  const { orm, name, tailwind, express, lucia, git, installPackages } =
    await cli();
  const destDir = path.join(workingDir, name);
  await createBase(destDir);
  if (tailwind) await tailwindInstaller(destDir);
  if (express) await expressInstaller(destDir);
  if (lucia) await luciaInstaller(destDir, orm);
  await databaseInstaller(destDir, orm, lucia);
  if (installPackages) await install(destDir);
}

main().catch((e) =>
  logger.error(`Unknown error has occured with this message ${e.message}`)
);
