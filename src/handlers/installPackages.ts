import { execa } from "execa";
import { getUserPkgManager } from "../utils/getPackageManager.js";
import { logger } from "../utils/logger.js";

export async function installPackages(destDir: string) {
  const pkgManager = getUserPkgManager();
  const pkgInstallMessage = pkgManager == "yarn" ? "add" : "install";
  try {
    const chilProcess = execa(pkgManager, [pkgInstallMessage], {
      cwd: destDir,
    });
    chilProcess.stdout?.pipe(process.stdout);
    await chilProcess;
    logger.success(`The packages were installed successfully`);
  } catch (error: any) {
    if (pkgManager != "pnpm")
      logger.error(
        `The cli got this error while installing packages using ${pkgManager} : \n ${error.message} `
      );
  }
}
