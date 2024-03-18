import path from "path";
import { execaSync } from "execa";
import fsExtra from "fs-extra";
import inquirer from "inquirer";
import { logger } from "../utils/logger.js";

function isGitInstalled(dir: string) {
  try {
    execaSync("git", ["--version"], { cwd: dir, stdout: "ignore" });
    return true;
  } catch (error) {
    return false;
  }
}

function isInsideRepo(dir: string) {
  try {
    execaSync("git", ["rev-parse", "--is-inside-work-tree"], {
      cwd: dir,
      stdout: "ignore",
    });
    return true;
  } catch (error) {
    return false;
  }
}

function isRootDir(dir: string) {
  const gitPath = path.join(dir, ".git");
  const exists = fsExtra.existsSync(gitPath);
  return exists;
}

export async function initGit(destDir: string) {
  if (!isGitInstalled(destDir))
    return logger.warn(
      "Git is not installed on the system, skipping Git initialization"
    );

  const isRoot = isRootDir(destDir);
  const isInside = isInsideRepo(destDir);

  // ** project dir has git subdir => prompt user for init
  if (isRoot) {
    const { reInit } = await inquirer.prompt({
      name: "reInit",
      message: `Do you want to re-initialize the Git repo.`,
      type: "confirm",
      default: false,
    });

    if (!reInit) return logger.info("Aborting Git initialization");
  }
  // ** project dir is inside parent directory that contains git subdir
  else if (isInside && !isRoot)
    return logger.warn(
      `Your project is already in a work tree. You may need to consider moving the project to a different workspace.`
    );

  try {
    execaSync("git", ["init"], { cwd: destDir });
    logger.success("Git repository initialized successfully");
  } catch (error) {
    logger.error("Failed to initialize Git repository:", error.message);
  }
}
