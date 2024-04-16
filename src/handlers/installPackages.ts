import ora from "ora";
import { execa } from "execa";
import { getUserPkgManager } from "../utils/getPackageManager.js";
import { logger } from "../utils/logger.js";
import { orm } from "../types.js";
import { migrateDatabase } from "./migrateDatabase.js";

export async function installPackages(destDir: string, orm: orm) {
  const pkgManager = getUserPkgManager();
  const spinner = ora(`Installing packages with ${pkgManager}`).start();

  return execa(pkgManager, ["install"], {
    cwd: destDir,
  })
    .then(({ stdout }) => {
      spinner.succeed(`Packages installed successfully with ${pkgManager}`);
      logger.info(stdout);
    })
    .then(() => {
      if (orm != "no-orm") migrateDatabase(destDir, orm);
    })
    .catch((error) => {
      spinner.fail(`Failed to install packages with ${pkgManager}`);
      logger.error(error.stdout);
    });
}
