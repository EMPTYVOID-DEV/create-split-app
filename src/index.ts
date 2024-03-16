import { welcome } from "./handlers/welcome.js";
import { logger } from "./utils/logger.js";
import { cli } from "./handlers/cli.js";
import { createBase } from "./handlers/createBase.js";

async function main() {
  welcome();
  const settings = await cli();
  await createBase(settings.name);
}

main().catch((e) =>
  logger.error(`Unknown error has occured with this message ${e.message}`)
);
