import { welcome } from "./handlers/welcome.js";
import { logger } from "./utils/logger.js";
import { cli } from "./handlers/cli.js";
import { createBase } from "./handlers/createBase.js";
import { tailwindInstaller } from "./handlers/tailwindInstaller.js";
import { expressInstaller } from "./handlers/expressInstaller.js";
import { luciaInstaller } from "./handlers/luciaInstaller.js";

import path from "path";
import { workingDir } from "./const.js";

async function main() {
  welcome();
  const settings = await cli();
  const destDir = path.join(workingDir, settings.name);
  await createBase(destDir);
  if (settings.tailwind) await tailwindInstaller(destDir);
  if (settings.express) await expressInstaller(destDir);
  if (settings.lucia) await luciaInstaller(destDir, settings.database);
}

main().catch((e) =>
  logger.error(`Unknown error has occured with this message ${e.message}`)
);
