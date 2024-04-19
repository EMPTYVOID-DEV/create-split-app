#! /usr/bin/env node

import { welcome } from "./handlers/welcome.js";
import { logger } from "./utils/logger.js";
import { cli } from "./handlers/cli.js";
import { createBase } from "./handlers/createBase.js";
import { tailwindInstaller } from "./handlers/tailwindInstaller.js";
import { expressInstaller } from "./handlers/expressInstaller.js";
import { luciaInstaller } from "./handlers/luciaInstaller.js";
import { databaseInstaller } from "./handlers/databaseInstaller.js";
import { copyAuth } from "./handlers/copyAuth.js";
import { installPackages as install } from "./handlers/installPackages.js";
import { initGit } from "./handlers/initGit.js";
import path from "path";
import { workingDir } from "./const.js";
import fsExtra from "fs-extra";

async function main() {
  welcome();
  const { orm, name, tailwind, express, lucia, git, installPackages } =
    await cli();
  const destDir = path.join(workingDir, name);
  await createBase(destDir);
  if (tailwind) await tailwindInstaller(destDir);
  if (orm != "no-orm" && lucia) await luciaInstaller(destDir, orm);
  if (orm != "no-orm") await databaseInstaller(destDir, orm, lucia);
  if (express) await expressInstaller(destDir);
  if (orm != "no-orm" && lucia) await copyAuth(destDir, orm);
  if (git) initGit(destDir);
  if (installPackages) await install(destDir, orm);
}
main().catch((e) =>
  logger.error(`Unknown error has occured with this message ${e.message}.`)
);
