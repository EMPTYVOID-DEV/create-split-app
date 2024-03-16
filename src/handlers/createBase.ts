import path from "path";
import fsExtra from "fs-extra";
import inquirer from "inquirer";
import { PKG_ROOT, workingDir } from "../const.js";
import { logger } from "../utils/logger.js";

export async function createBase(projectDir: string) {
  const srcDir = path.join(PKG_ROOT, "template/base");
  const destDir = path.resolve(workingDir, projectDir);
  const doesItExist = fsExtra.existsSync(destDir);
  if (doesItExist) {
    const writingOption = await exitingDirPrompt();
    if (writingOption == "Abort") {
      logger.info("Aborting the process.");
      process.exit(0);
    } else if (writingOption == "Clear") fsExtra.emptyDirSync(destDir);
  }
  return fsExtra
    .copy(srcDir, destDir)
    .then(() => logger.success("The base project was copied successfully"))
    .catch((e) => {
      console.log(e);
    });
}

async function exitingDirPrompt() {
  const { writingOption } = await inquirer.prompt<{
    writingOption: "Abort" | "Clear" | "Overwrite";
  }>({
    name: "writingOption",
    message:
      "A directory with same path already exits what you want split to do?",
    type: "list",
    choices: [
      {
        name: "Abort the installation (recommanded)",
        value: "Abort",
      },
      {
        name: "Clear the directory and install",
        value: "Clear",
      },
      {
        name: "Overwrite existing files",
        value: "Overwrite",
      },
    ],
    default: "Abort",
  });
  return writingOption;
}
