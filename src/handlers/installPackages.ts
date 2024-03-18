import ora from "ora";
import { execa } from "execa";
import { getUserPkgManager } from "../utils/getPackageManager.js";

export async function installPackages(destDir: string) {
  const pkgManager = getUserPkgManager();
  const spinner = ora(`Installing packages with ${pkgManager}`).start();

  try {
    const { stdout } = await execa(pkgManager, ["install"], {
      cwd: destDir,
    });

    spinner.succeed(`Packages installed successfully with ${pkgManager}`);
    console.log(stdout);
  } catch (error) {
    spinner.fail(`Failed to install packages with ${pkgManager}`);
    console.error(error.stderr);
  }
}
